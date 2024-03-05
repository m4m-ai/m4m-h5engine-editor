/**
@license
Copyright (c) 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import { EditorApplication, EditorType } from "../EditorApplication";
import { DebugModel, DebugTool } from "./SceneenvTool";
import { StringDefiner } from "./StringDefiner";

enum SelectModel
{
    null,
    Axis_X,
    Axis_Y,
    Axis_Z,
}

//选中object显示的轴 3d RTS 编辑工具
export class AxisObject
{
    private app: m4m.framework.application;
    scene: m4m.framework.scene;
    private inputMgr: m4m.framework.inputMgr;
    private debugTool: DebugTool;

    private _tran: m4m.framework.transform;
    public get tran(): m4m.framework.transform
    {
        return this._tran;
    }
    public set tran(trans: m4m.framework.transform)
    {
        this._tran = trans;
        for (let item of this.xyzNames)
        {
            this[item] = trans.find(item);
        }
    }

    private _pyr: m4m.framework.transform;
    private _pyrX: m4m.framework.transform;
    private _pyrY: m4m.framework.transform;
    private _pyrZ: m4m.framework.transform;
    private _planeX: m4m.framework.transform;
    private _planeY: m4m.framework.transform;
    private _planeZ: m4m.framework.transform;

    private _box: m4m.framework.transform;
    private _boxX: m4m.framework.transform;
    private _boxY: m4m.framework.transform;
    private _boxZ: m4m.framework.transform;

    private _line: m4m.framework.transform;
    private _lineX: m4m.framework.transform;
    private _lineY: m4m.framework.transform;
    private _lineZ: m4m.framework.transform;

    private _circle: m4m.framework.transform;
    private _circleX: m4m.framework.transform;
    private _circleY: m4m.framework.transform;
    private _circleZ: m4m.framework.transform;

    private _colorX: m4m.math.vector4 = new m4m.math.vector4(1,0,0,1);
    private _colorY: m4m.math.vector4 = new m4m.math.vector4(0,1,0,1);
    private _colorZ: m4m.math.vector4 = new m4m.math.vector4(0,0,1,1);
    private _colorSelec: m4m.math.vector4 = new m4m.math.vector4(1,1,0,1);

    private anisSize = 1;
    //public get debugMode(){return this.debugTool.debugMode;}
    //private _debugMode: DebugModel = DebugModel.null;
    private selectMode: SelectModel = SelectModel.null;
    private isPlaneMode:boolean = false;
    private _isGlobalRotate:boolean = false;
    private readonly planeSize = 0.36; //plane 尺寸
    private readonly planeAlpha = 0.26;
    private _target: m4m.framework.transform;

    private xyzNames: Array<string> = new Array<string>();
    private createXYZTrans(name: string): m4m.framework.transform
    {
        let trans = new m4m.framework.transform();
        trans.name = name;
        this.xyzNames.push(name);
        return trans;
    }
    public onSetTarget: (target) => void;

    get target()
    {
        return this._target;
    }

    set target(tar: m4m.framework.transform)
    {
        if(tar == this._target) return;
        if(tar && tar.gameObject.hideFlags & m4m.framework.HideFlags.NotEditable) return;
        this._target = tar;
        this.lock = false;
        if (this.onSetTarget) this.onSetTarget(this._target);
    }

    private subTran: m4m.framework.transform;

    // mainCam: m4m.framework.camera;
    type: EditorType;

    //装配 材质 mesh
    private assemblMaterialMesh(trans:m4m.framework.transform,mesh,sh,color,Alpha){
        if(!trans || !mesh || !color) return;
        var mf = trans.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        trans.gameObject.addComponent("meshcollider") as m4m.framework.meshcollider;
        trans.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
        mf.mesh = mesh;
        var renderer = trans.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        renderer.renderLayer = m4m.framework.cullingmaskutil.maskTolayer(m4m.framework.CullingMask.editor);
        renderer.materials = [];
        renderer.materials.push(new m4m.framework.material());
        renderer.materials[0].setShader(sh);
        renderer.materials[0].setVector4("_Color", color);
        renderer.materials[0].setFloat("_Alpha", Alpha);
    }

    constructor(type: EditorType, _app: m4m.framework.application, _debugTool: DebugTool)
    {
        this.app = _app;
        this.type = type;
        this.inputMgr = this.app.getInputMgr();
        // this.mainCam = _mainCam;
        this.scene = _app.getScene();
        this.debugTool = _debugTool;

        this._tran = new m4m.framework.transform();
        this._tran.localScale.x = this._tran.localScale.y = this._tran.localScale.z = 1;
        this._pyr = this.createXYZTrans("_pyr");//new m4m.framework.transform();
        this._line = new m4m.framework.transform();
        this._box = new m4m.framework.transform();
        this._circle = new m4m.framework.transform();
        this._pyr.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
        this._line.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
        this._box.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
        this._circle.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;

        this._tran.name = StringDefiner.axisObject;

        var sh = this.app.getAssetMgr().getShader("shader/materialcolor");

        var planemesh = this.app.getAssetMgr().getDefaultMesh("plane");
        var pyramidmesh = this.app.getAssetMgr().getDefaultMesh("pyramid");
        var cubemesh = this.app.getAssetMgr().getDefaultMesh("cube");
        var circlemesh = this.app.getAssetMgr().getDefaultMesh("circleline");
        let size = 1.3;
        {
            this._pyrX = this.createXYZTrans("_pyrX");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._pyrX,pyramidmesh,sh,this._colorX,1);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, -90, this._pyrX.localRotate);
            this._pyrX.localScale.x = this._pyrX.localScale.y = this._pyrX.localScale.z = 0.2;
            this._pyrX.localTranslate.x = size;
            this._pyr.addChild(this._pyrX);

            this._pyrY = this.createXYZTrans("_pyrY");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._pyrY,pyramidmesh,sh,this._colorY,1);
            this._pyrY.localScale.x = this._pyrY.localScale.y = this._pyrY.localScale.z = 0.2;
            this._pyrY.localTranslate.y = size;
            this._pyr.addChild(this._pyrY);

            this._pyrZ = this.createXYZTrans("_pyrZ");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._pyrZ,pyramidmesh,sh,this._colorZ,1);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, 90, this._pyrZ.localRotate);
            this._pyrZ.localScale.x = this._pyrZ.localScale.y = this._pyrZ.localScale.z = 0.2;
            this._pyrZ.localTranslate.z = size;
            this._pyr.addChild(this._pyrZ);
        }
        {
            let planeDefsize = 10;
            this._planeX = this.createXYZTrans("_planeX");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._planeX,planemesh,sh,this._colorX,this.planeAlpha);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, -90, this._planeX.localRotate);
            this._planeX.localScale.x = this._planeX.localScale.z = this.planeSize/planeDefsize;
            this._planeX.localTranslate.z = this._planeX.localTranslate.y = this.planeSize/2;
            this._planeX.localTranslate.x = 0;
            this._pyr.addChild(this._planeX);
            this.addPlaneFrame(this._planeX,this.planeSize/(this.planeSize/planeDefsize),sh,cubemesh);

            this._planeY = this.createXYZTrans("_planeY");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._planeY,planemesh,sh,this._colorY,this.planeAlpha);
            this._planeY.localScale.x = this._planeY.localScale.z = this.planeSize/planeDefsize;
            this._planeY.localTranslate.x = this._planeY.localTranslate.z = this.planeSize/2;
            this._planeY.localTranslate.y = 0;
            this._pyr.addChild(this._planeY);
            this.addPlaneFrame(this._planeY,this.planeSize/(this.planeSize/planeDefsize),sh,cubemesh);

            this._planeZ = this.createXYZTrans("_planeZ");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._planeZ,planemesh,sh,this._colorZ,this.planeAlpha);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, 90, this._planeZ.localRotate);
            this._planeZ.localScale.x = this._planeZ.localScale.z = this.planeSize/planeDefsize;
            this._planeZ.localTranslate.x = this._planeZ.localTranslate.y = this.planeSize/2;
            this._planeZ.localTranslate.z = 0;
            this._pyr.addChild(this._planeZ);
            this._planeZ.markDirty();
            this.addPlaneFrame(this._planeZ,this.planeSize/(this.planeSize/planeDefsize),sh,cubemesh);
        }
        {
            this._boxX = this.createXYZTrans("_boxX");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._boxX,cubemesh,sh,this._colorX,1);
            this._boxX.localScale.x = this._boxX.localScale.y = this._boxX.localScale.z = 0.2;
            this._boxX.localTranslate.x = size;
            this._box.addChild(this._boxX);

            this._boxY = this.createXYZTrans("_boxY");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._boxY,cubemesh,sh,this._colorY,1);
            this._boxY.localScale.x = this._boxY.localScale.y = this._boxY.localScale.z = 0.2;
            this._boxY.localTranslate.y = size;
            this._box.addChild(this._boxY);

            this._boxZ = this.createXYZTrans("_boxZ");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._boxZ,cubemesh,sh,this._colorZ,1);
            this._boxZ.localScale.x = this._boxZ.localScale.y = this._boxZ.localScale.z = 0.2;
            this._boxZ.localTranslate.z = size;
            this._box.addChild(this._boxZ);
        }
        {
            this._lineX = this.createXYZTrans("_lineX");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._lineX,cubemesh,sh,this._colorX,1);
            this._lineX.localScale.x = size;
            this._lineX.localScale.y = this._lineX.localScale.z = 0.01;
            this._lineX.localTranslate.x = this._lineX.localScale.x *0.5;
            this._line.addChild(this._lineX);

            this._lineY = this.createXYZTrans("_lineY");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._lineY,cubemesh,sh,this._colorY,1);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, -90, this._lineY.localRotate);
            this._lineY.localScale.x = size;
            this._lineY.localScale.y = this._lineY.localScale.z = 0.01;
            this._lineY.localTranslate.y = this._lineX.localScale.x *0.5;
            this._line.addChild(this._lineY);

            this._lineZ = this.createXYZTrans("_lineZ");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._lineZ,cubemesh,sh,this._colorZ,1);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, 90, this._lineZ.localRotate);
            this._lineZ.localScale.x = size;
            this._lineZ.localScale.y = this._lineZ.localScale.z = 0.01;
            this._lineZ.localTranslate.z = this._lineX.localScale.x *0.5;
            this._line.addChild(this._lineZ);
        }
        {
            this._circleX = this.createXYZTrans("_circleX");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._circleX,circlemesh,sh,this._colorX,1);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, 90, this._circleX.localRotate);
            this._circleX.localScale.x = 1;
            this._circleX.localScale.y = this._circleX.localScale.z = 1;
            this._circle.addChild(this._circleX);

            this._circleY = this.createXYZTrans("_circleY");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._circleY,circlemesh,sh,this._colorY,1);
            this._circleY.localScale.x = 1;
            this._circleY.localScale.y = this._circleY.localScale.z = 1;
            this._circle.addChild(this._circleY);

            this._circleZ = this.createXYZTrans("_circleZ");//new m4m.framework.transform();
            this.assemblMaterialMesh(this._circleZ,circlemesh,sh,this._colorZ,1);
            m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, 90, this._circleZ.localRotate);
            this._circleZ.localScale.x = 1;
            this._circleZ.localScale.y = this._circleZ.localScale.z = 1;
            this._circle.addChild(this._circleZ);
        }
        this._tran.addChild(this._box);
        this._tran.addChild(this._line);
        this._tran.addChild(this._pyr);
        this._tran.addChild(this._circle);

        this._tran.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
        this._tran.gameObject.visible = false;
        this._tran.markDirty();

        EditorApplication.Instance.AddEditorObjToScene(this._tran);

        //this.attachControll(this.debugTool.rootEle);
        this.colorRefresh();
    }

    public lock = false;

    update(delta: number)
    {
        if(this.lock){
            this._tran.gameObject.visible = false;
            return;
        }
            
        if (this.target)
        {
            this._tran.gameObject.visible = true;
            if (this.target instanceof m4m.framework.transform)
            {
                m4m.math.vec3Clone(this.target.getWorldTranslate(), this._tran.localTranslate);
                //this._tran.localRotate = this.target.getWorldRotate();
                m4m.math.quatClone(this._isGlobalRotate ? m4m.math.pool.new_quaternion() : this.target.getWorldRotate() , this._tran.localRotate);
            }

            this._tran.markDirty();
        }
        else
        {
            this._tran.gameObject.visible = false;
            return;
        }

        if (this._tran.gameObject.visible && EditorApplication.Instance.editorCamera)
        {
            var distance = m4m.math.vec3Distance(this._tran.getWorldTranslate(),
            EditorApplication.Instance.editorCamera.gameObject.transform.getWorldTranslate());
            this._tran.localScale.x = distance * 0.1;
            this._tran.localScale.y = distance * 0.1;
            this._tran.localScale.z = distance * 0.1;
        }

        if(!this.isholdDown){
            this.adjustPlanes();
        }
    }
    //异面直线交点
    intersectionWith2Line(p1: m4m.math.vector3, d1: m4m.math.vector3, p2: m4m.math.vector3, d2: m4m.math.vector3,outpoint:m4m.math.vector3): boolean
    {
        var tvec = m4m.math.pool.new_vector3();
        var tvec1 = m4m.math.pool.new_vector3();
        m4m.math.vec3Cross(d1, d2, tvec);
        m4m.math.vec3Cross(d1, tvec, tvec1);
        m4m.math.vec3Normalize(tvec1, tvec1);

        var ray1 = new m4m.framework.ray(p2, d2);
        var result = ray1.intersectPlane(p1, tvec1,outpoint);

        m4m.math.pool.delete_vector3Array([tvec1,tvec]);
        return result;
    }

    addPlaneFrame(planetran:m4m.framework.transform,size,sh,linemesh){
        if(!planetran) return;
        let genFun = (name:string) => {
            let _line = this.createXYZTrans(name);//new m4m.framework.transform();
            var mesh = _line.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
            _line.gameObject.addComponent("meshcollider") as m4m.framework.meshcollider;
            _line.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
            mesh.mesh = (linemesh);
            var renderer = _line.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
            renderer.renderLayer = m4m.framework.cullingmaskutil.maskTolayer(m4m.framework.CullingMask.editor);
            renderer.materials = [];
            renderer.materials.push(new m4m.framework.material());
            renderer.materials[0].setShader(sh);
            renderer.materials[0].setVector4("_Color", this._colorSelec);
            renderer.materials[0].setFloat("_Alpha", 1.0);
            _line.localScale.x = size;
            _line.localScale.y = _line.localScale.z = 0.01;
            planetran.addChild(_line);
            _line.markDirty();
            return _line;
        }
        //top
        let line_t = genFun("FrameLine_t");
        line_t.localTranslate.x = -size/2;
        m4m.math.quatFromEulerAngles(90,0,90,line_t.localRotate);
        line_t.localScale.y /= planetran.localScale.x;
        //left
        let line_l = genFun("FrameLine_l");
        line_l.localTranslate.z = size/2;
        line_l.localScale.z /= planetran.localScale.x;
        //bottm
        let line_b = genFun("FrameLine_b");
        line_b.localTranslate.x = size/2;
        m4m.math.quatFromEulerAngles(90,0,90,line_b.localRotate);
        line_b.localScale.y /= planetran.localScale.x;
        //right
        let line_r = genFun("FrameLine_r");
        line_r.localTranslate.z = -size/2;
        line_r.localScale.z /= planetran.localScale.x;
    }
    private cupTpi = new m4m.framework.pickinfo(0,0,0);
    //是否选取到了轴
    isPickAxis(ray: m4m.framework.ray): boolean
    {
        if(!this._tran || !this._tran.gameObject.visible) return false;
        if (this.debugTool.debugMode != DebugModel.rotation)
        {
            this.isPlaneMode = false;
            if (ray.intersectCollider(this._pyrX,this.cupTpi) || ray.intersectCollider(this._lineX,this.cupTpi) || ray.intersectCollider(this._boxX,this.cupTpi)|| ray.intersectCollider(this._planeX,this.cupTpi))
            {
                if(ray.intersectCollider(this._planeX,this.cupTpi)) this.isPlaneMode = true;
                this.selectMode = SelectModel.Axis_X;
                return true;
            }
            else if (ray.intersectCollider(this._pyrY,this.cupTpi) || ray.intersectCollider(this._lineY,this.cupTpi) || ray.intersectCollider(this._boxY,this.cupTpi)|| ray.intersectCollider(this._planeY,this.cupTpi))
            {
                if(ray.intersectCollider(this._planeY,this.cupTpi)) this.isPlaneMode = true;
                this.selectMode = SelectModel.Axis_Y;
                return true;
            }
            else if (ray.intersectCollider(this._pyrZ,this.cupTpi) || ray.intersectCollider(this._lineZ,this.cupTpi) || ray.intersectCollider(this._boxZ,this.cupTpi)|| ray.intersectCollider(this._planeZ,this.cupTpi))
            {
                if(ray.intersectCollider(this._planeZ,this.cupTpi)) this.isPlaneMode = true;
                this.selectMode = SelectModel.Axis_Z;
                return true;
            }
            else
            {
                this.selectMode = SelectModel.null;
                return false;
            }
        }
        else if (this.debugTool.debugMode == DebugModel.rotation)
        {
            if (ray.intersectCollider(this._circleX,this.cupTpi))
            {
                this.selectMode = SelectModel.Axis_X;
                return true;
            }
            else if (ray.intersectCollider(this._circleY,this.cupTpi))
            {
                this.selectMode = SelectModel.Axis_Y;
                return true;
            }
            else if (ray.intersectCollider(this._circleZ,this.cupTpi))
            {
                this.selectMode = SelectModel.Axis_Z;
                return true;
            }
            else
            {
                this.selectMode = SelectModel.null;
                return false;
            }
        }
        return false;
    }

    private isPickTrans(x,y):boolean{
        let tempv2 = m4m.math.pool.new_vector2(x,y);
        var ray = EditorApplication.Instance.editorCamera.creatRayByScreen(tempv2, this.app);
        m4m.math.pool.delete_vector2(tempv2);
        //3d pick
        let tempinfos:m4m.framework.pickinfo[] = []; 
        let bool = this.scene.pickAll(ray,tempinfos , true);
        let pickinfo = this.getusefulPickinfo(tempinfos);
        if (bool && pickinfo && pickinfo.pickedtran)
        {
            if (pickinfo.pickedtran.parent && pickinfo.pickedtran.parent.name == StringDefiner.____editor_camera_frame) //pick到了编辑camer的cube
            {
                //.....
            }
            this.target = pickinfo.pickedtran;
            if (this.debugTool.clickFunc )
            {
                this.debugTool.clickFunc(this.target);
            }
        }else{
            this.target = null;
        }
        tempinfos.forEach(info=>{
            if(info)    m4m.math.pool.delete_pickInfo(info);
        });

        return bool;
    }

    private lastPos:m4m.math.vector3 = new m4m.math.vector3();
    private lastCamPos:m4m.math.vector3 = new m4m.math.vector3();
    private lastRotate:m4m.math.quaternion = new m4m.math.quaternion();
    private lastCamRotate:m4m.math.quaternion = new m4m.math.quaternion();
    //调整Plane 布局
    adjustPlanes(){
        if(!this._planeX || !this._planeY || !this._planeZ) return;
        let eCam = EditorApplication.Instance.editorCamera;
        if(!this.tran || !eCam) return;
        let ePos = eCam.gameObject.transform.getWorldTranslate();
        let pos = this.tran.getWorldTranslate();
        //检测是否需要刷新
        if(m4m.math.vec3Equal(pos,this.lastPos) && m4m.math.vec3Equal(ePos,this.lastCamPos)
            && m4m.math.quatEqual(this.tran.localRotate,this.lastRotate)  
            && m4m.math.quatEqual(eCam.gameObject.transform.localRotate,this.lastCamRotate)  
            ){
           return; 
        }
        //
        let invMtx = m4m.math.pool.new_matrix();
        m4m.math.matrixInverse(this.tran.getWorldMatrix(),invMtx);
        let eInvPos = m4m.math.pool.new_vector3();
        m4m.math.matrixTransformVector3(ePos,invMtx,eInvPos);

        //执行调整
        let x_Symbol = eInvPos.x>0 ? 1: -1;
        let y_Symbol = eInvPos.y>0 ? 1: -1;
        let z_Symbol = eInvPos.z>0 ? 1: -1;

        this._planeX.localTranslate.y = y_Symbol * this.planeSize/2; this._planeX.localTranslate.z = z_Symbol * this.planeSize/2;
        this._planeY.localTranslate.x = x_Symbol * this.planeSize/2; this._planeY.localTranslate.z = z_Symbol * this.planeSize/2;
        this._planeZ.localTranslate.x = x_Symbol * this.planeSize/2; this._planeZ.localTranslate.y = y_Symbol * this.planeSize/2;
        this._planeX.markDirty();   this._planeY.markDirty();   this._planeZ.markDirty();
        m4m.math.vec3Clone(this.tran.getWorldTranslate(),this.lastPos);
        m4m.math.vec3Clone(ePos,this.lastCamPos);
        m4m.math.quatClone(this.tran.localRotate,this.lastRotate);
        m4m.math.quatClone(eCam.gameObject.transform.localRotate,this.lastCamRotate);
        //delet
        m4m.math.pool.delete_vector3(eInvPos);
        m4m.math.pool.delete_matrix(invMtx);
    }

    //刷新选择颜色
    colorRefresh(onlyReset:boolean= false){
        //重置到默认颜色
        this.colorChange(this._pyrX,this._colorX);
        this.childrenColorCg(this._planeX,this._colorX);
        this.colorChange(this._boxX,this._colorX);
        this.colorChange(this._lineX,this._colorX);
        this.colorChange(this._circleX,this._colorX);

        this.colorChange(this._pyrY,this._colorY);
        this.childrenColorCg(this._planeY,this._colorY);
        this.colorChange(this._boxY,this._colorY);
        this.colorChange(this._lineY,this._colorY);
        this.colorChange(this._circleY,this._colorY);

        this.colorChange(this._pyrZ,this._colorZ);
        this.childrenColorCg(this._planeZ,this._colorZ);
        this.colorChange(this._boxZ,this._colorZ);
        this.colorChange(this._lineZ,this._colorZ);
        this.colorChange(this._circleZ,this._colorZ);
        
        if(onlyReset) return;
        //
        if(this.selectMode == SelectModel.null) return;
        switch(this.selectMode){
            case SelectModel.Axis_X:  
            if(this.isPlaneMode){
                this.childrenColorCg(this._planeX,this._colorSelec);
            }
            else{
                this.colorChange(this._pyrX,this._colorSelec);
                this.colorChange(this._lineX,this._colorSelec);
            }
            this.colorChange(this._boxX,this._colorSelec);
            this.colorChange(this._circleX,this._colorSelec);
            break; 
            case SelectModel.Axis_Y:  
            if(this.isPlaneMode){
                this.childrenColorCg(this._planeY,this._colorSelec);
            }
            else{
                this.colorChange(this._pyrY,this._colorSelec);
                this.colorChange(this._lineY,this._colorSelec);
            }
            this.colorChange(this._boxY,this._colorSelec);
            this.colorChange(this._circleY,this._colorSelec);
            break; 
            case SelectModel.Axis_Z:  
            if(this.isPlaneMode){
                this.childrenColorCg(this._planeZ,this._colorSelec);
            }
            else{
                this.colorChange(this._lineZ,this._colorSelec);
                this.colorChange(this._pyrZ,this._colorSelec);
            }
            this.colorChange(this._boxZ,this._colorSelec);
            this.colorChange(this._circleZ,this._colorSelec);
            break; 
        }
    }

    //颜色调整
    private colorChange(tran:m4m.framework.transform,color:m4m.math.vector4){
        if(!tran || !color) return;
        let mr = tran.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        if(!mr || !mr.materials || !mr.materials[0]) return;
        mr.materials[0].setVector4("_Color",color);
    }

    private childrenColorCg(tran:m4m.framework.transform,color:m4m.math.vector4){
        if(!tran || !tran.children || !color) return;
        tran.children.forEach(element => {
            if(element) this.colorChange(element,color);           
        });
    }

    private getViewZ(x:number,y:number):number{
        let result = Number.MIN_VALUE;
        let contexts = this.scene["renderContext"] as m4m.framework.renderContext[];
        let idx = this.scene["renderCameras"].indexOf(EditorApplication.Instance.editorCamera);
        if(idx == -1) return result;
        //拣选一下
        let tempv2 = m4m.math.pool.new_vector2(x,y);
        var ray = EditorApplication.Instance.editorCamera.creatRayByScreen(tempv2, this.app);
        let tempinfos:m4m.framework.pickinfo[] = []; 
        let bool = this.scene.pickAll(ray,tempinfos , true);
        let pickinfo = this.getusefulPickinfo(tempinfos);
        if(!bool || !pickinfo || !pickinfo.hitposition) return result;
        //转到view 空间
        let contx = contexts[idx];
        let wpos = m4m.math.pool.clone_vector3(pickinfo.hitposition);
        m4m.math.matrixTransformVector3(wpos,contx.matrixModelView,wpos);
        result = wpos.z;
        
        m4m.math.pool.delete_vector3(wpos);
        m4m.math.pool.delete_vector2(tempv2);
        tempinfos.forEach(info=>{
            if(info)    m4m.math.pool.delete_pickInfo(info);
        });

        return result;
    }
    
    //private pointLeftDown: boolean = false;
    //private pointMiddleDown:boolean = false;
    //private pointRightDown: boolean = false;
    private isholdDown :boolean = false;
    private mousePosInScreen: m4m.math.vector2 = new m4m.math.vector2();//鼠标点击开始的位置（在屏幕坐标系）
    private contrastDir: m4m.math.vector2 = new m4m.math.vector2()//鼠标旋转参照坐标轴在屏幕中表示

    private lastDebugModel = DebugModel.null;
    private lastTargetID = -1;
    private offset: m4m.math.vector3 = new m4m.math.vector3();
    private lastMidPickPos: m4m.math.vector3 = new m4m.math.vector3(); //鼠标中间pick到的世界坐标点
    private isMidPicked = false; //中键 获取到了碰撞点
    //点击选中.
    pointDownEvent(e: any)
    {
        let result = Number.MIN_VALUE;
        this.mouseStartPoint.x = e.x;
        this.mouseStartPoint.y = e.y;
        if(EditorApplication.Instance.editorCamera){
            m4m.math.vec3Clone(EditorApplication.Instance.editorCamera.gameObject.transform.getWorldTranslate(),this.eCameraStartPoint);
        }

        this.moveOverlimit = false;
        if (e.button == 0)
        {
            if (!EditorApplication.Instance.PointInEditorCamera(e.x))
                // if (EditorApplication.Instance.GetCamera(e.x) != this.mainCam)
                return;
            let tempv2 = m4m.math.pool.new_vector2(e.x,e.y);
            var ray = EditorApplication.Instance.editorCamera.creatRayByScreen(tempv2, this.app);
            m4m.math.pool.delete_vector2(tempv2);

            if (this.isPickAxis(ray))
            {
                this.isholdDown = true;
            
                if (this.target == null) return;
                if (this.target instanceof m4m.framework.transform)
                {
                    this.isPickedAxis = true;
                    this.saveRTS();
                    if (this.debugTool.debugMode == DebugModel.translate || this.debugTool.debugMode == DebugModel.scale)
                    {
                        var dir = m4m.math.pool.new_vector3();
                        if (this.selectMode == SelectModel.Axis_X)
                        {
                            if(this._isGlobalRotate){
                                m4m.math.vec3Clone(m4m.math.pool.vector3_right,dir);
                            }else{
                                m4m.math.matrixTransformNormal(m4m.math.pool.vector3_right, this.target.getWorldMatrix(), dir);
                            }
                        }
                        else if (this.selectMode == SelectModel.Axis_Y)
                        {
                            if(this._isGlobalRotate){
                                m4m.math.vec3Clone(m4m.math.pool.vector3_up,dir);
                            }else{
                                m4m.math.matrixTransformNormal(m4m.math.pool.vector3_up, this.target.getWorldMatrix(), dir);
                            }
                        }
                        else if (this.selectMode == SelectModel.Axis_Z)
                        {
                            if(this._isGlobalRotate){
                                m4m.math.vec3Clone(m4m.math.pool.vector3_forward,dir);
                            }else{
                                m4m.math.matrixTransformNormal(m4m.math.pool.vector3_forward, this.target.getWorldMatrix(), dir);
                            }
                        }

                        var ori = m4m.math.pool.new_vector3();
                        m4m.math.vec3Clone(this.target.getWorldTranslate(), ori);

                        let t = m4m.math.pool.new_vector3();
                        var bool = this.intersectionWith2Line(ray.origin, ray.direction, ori, dir,t);

                        if (bool)
                        {
                            if(this.isPlaneMode){
                                let temp :m4m.framework.transform;
                                switch(this.selectMode){
                                    case SelectModel.Axis_X: temp = this._planeX; break;
                                    case SelectModel.Axis_Y: temp = this._planeY; break;
                                    case SelectModel.Axis_Z: temp = this._planeZ; break;
                                }
                                m4m.math.vec3Normalize(dir,dir);
                                let tempv3 = m4m.math.pool.new_vector3();
                                let bool = ray.intersectPlane(temp.getWorldTranslate(),dir,tempv3);
                                if(bool)
                                    m4m.math.vec3Clone(tempv3, this.MouseStartPoint);

                            }
                            else
                                m4m.math.vec3Clone(t, this.MouseStartPoint);
                            if (this.debugTool.debugMode == DebugModel.translate)
                            {
                                m4m.math.vec3Clone(this.target.getWorldTranslate(), this.targetStartPoint);
                            }
                            else if (this.debugTool.debugMode == DebugModel.scale)
                            {
                                this.targetStartScale = m4m.math.pool.clone_vector3(this.target.localScale);
                            }
                        }
                        m4m.math.pool.delete_vector3(dir);
                        m4m.math.pool.delete_vector3(ori);
                        m4m.math.pool.delete_vector3(t);
                    }
                    else if (this.debugTool.debugMode == DebugModel.rotation)
                    {
                        this.mousePosInScreen.x = e.x;
                        this.mousePosInScreen.y = e.y;

                        var matToWorld = this.target.getWorldMatrix();

                        var dirStartInWord = m4m.math.pool.new_vector3();
                        m4m.math.vec3Clone(this.target.getWorldTranslate(), dirStartInWord);

                        var dirEndInWord = m4m.math.pool.new_vector3();

                        if (this.selectMode == SelectModel.Axis_X)
                        {
                            m4m.math.matrixTransformVector3(m4m.math.pool.vector3_right, matToWorld, dirEndInWord);
                        }
                        else if (this.selectMode == SelectModel.Axis_Y)
                        {
                            m4m.math.matrixTransformVector3(m4m.math.pool.vector3_up, matToWorld, dirEndInWord);
                        }
                        else if (this.selectMode == SelectModel.Axis_Z)
                        {
                            m4m.math.matrixTransformVector3(m4m.math.pool.vector3_forward, matToWorld, dirEndInWord);
                        }

                        var dirStartInScreen = m4m.math.pool.new_vector2();
                        var dirEndInScreen = m4m.math.pool.new_vector2();
                        if (EditorApplication.Instance.editorCamera)
                        {
                            EditorApplication.Instance.editorCamera.calcScreenPosFromWorldPos(this.app, dirStartInWord, dirStartInScreen);
                            EditorApplication.Instance.editorCamera.calcScreenPosFromWorldPos(this.app, dirEndInWord, dirEndInScreen);
                        }
                        var temptDir = m4m.math.pool.new_vector2();

                        m4m.math.vec2Subtract(dirEndInScreen, dirStartInScreen, temptDir);
                        m4m.math.vec2Normalize(temptDir, temptDir);
                        //m4m.math.vec2Clone(temptDir, this.contrastDir);
                        this.contrastDir.x = -temptDir.y;
                        this.contrastDir.y = temptDir.x;

                        m4m.math.quatClone(this.target.localRotate, this.targetStartRotate);

                        m4m.math.pool.delete_vector3(dirStartInWord);
                        m4m.math.pool.delete_vector3(dirEndInWord);
                        m4m.math.pool.delete_vector2(dirStartInScreen);
                        m4m.math.pool.delete_vector2(dirEndInScreen);
                        m4m.math.pool.delete_vector2(temptDir);
                    }

                }
                this.colorRefresh();
            }
            result = this.getViewZ(e.x,e.y);
        }else if(e.button == 1){
            this.isMidPicked = false;
            this.lastDebugModel = this.debugTool.debugMode;
            //ApplicationMgr.DebugmodeBarUIChange(DebugModel.view);
            this.debugTool.setDebugModel(DebugModel.view);
            //获取碰撞点
            if (!EditorApplication.Instance.PointInEditorCamera(e.x)) return;
            let tempv2 = m4m.math.pool.new_vector2(e.x,e.y);
            var ray = EditorApplication.Instance.editorCamera.creatRayByScreen(tempv2, this.app);
            m4m.math.pool.delete_vector2(tempv2);

            let tempinfos:m4m.framework.pickinfo[] = []; 
            let bool = this.scene.pickAll(ray,tempinfos , true);
            let pickinfo = this.getusefulPickinfo(tempinfos);
            if(bool && pickinfo){
                if(!pickinfo.pickedtran.parent || pickinfo.pickedtran.parent.name != StringDefiner.____editor_camera_frame){
                    m4m.math.vec3Clone(pickinfo.hitposition,this.lastMidPickPos);
                    this.isMidPicked = true;
                }
            }
        }
        else if (e.button == 2)
        {
           
        }
        return result;
    }

    //取个可用 的（过滤 不可编辑的对象）
    private getusefulPickinfo(arr:m4m.framework.pickinfo[]){
        if(!arr || arr.length <1) return;
        let result :m4m.framework.pickinfo;
        arr.sort((a,b)=>{
            return a.distance - b.distance;
        });
        let navmgr = m4m.framework.NavMeshLoadManager.Instance;
        while(!result && arr.length>0){
            let info = arr.shift();
            //不可编辑对象过滤
            if((info.pickedtran.gameObject.hideFlags & m4m.framework.HideFlags.NotEditable) == 0){
                result = info;
            }
        }
        return result;
    }

    //鼠标移动超过限制
    private moveOverlimit = false;
    private readonly limitNum = 2;

    private mouseStartPoint:m4m.math.vector2 = new m4m.math.vector2();
    private mouseEndPoint: m4m.math.vector2 = new m4m.math.vector2();
    private eCameraStartPoint:m4m.math.vector3 = new m4m.math.vector3();
    private MouseStartPoint: m4m.math.vector3 = new m4m.math.vector3();
    private targetStartPoint: m4m.math.vector3 = new m4m.math.vector3();
    private targetStartScale: m4m.math.vector3 = new m4m.math.vector3();
    private targetStartRotate: m4m.math.quaternion = new m4m.math.quaternion();

    pointHoldEvent(e: any)
    {
        if (!EditorApplication.Instance.editorCamera) return;
        this.mouseEndPoint.x = e.x;
        this.mouseEndPoint.y = e.y;
        
        if(this.debugTool.debugMode == DebugModel.view && (this.debugTool.pointLeftDown ||this.debugTool.pointMiddleDown)){
            let eCame = EditorApplication.Instance.editorCamera
            let ecamT = eCame.gameObject.transform;
            //重置位置
            //console.error(` equal  : ${ m4m.math.vec3Equal(this.eCameraStartPoint,ecamT.getWorldTranslate())}`);
            ecamT.setWorldPosition(this.eCameraStartPoint);
            //pick 远端面
            let cam_forward = m4m.math.pool.new_vector3();
            ecamT.getForwardInWorld(cam_forward);
            //ray_0-------------
            let ray_0 = eCame.creatRayByScreen(this.mouseStartPoint,this.app);
            let center = m4m.math.pool.new_vector3();
            let start = m4m.math.pool.new_vector3();
            m4m.math.vec3ScaleByNum(cam_forward,EditorApplication.Instance.editorCamera.FocusDistance,center);
            ray_0.intersectPlane(center,cam_forward,start);
            //ray_1-------------
            let ray_1 = eCame.creatRayByScreen(this.mouseEndPoint,this.app);
            let end = m4m.math.pool.new_vector3();
            ray_1.intersectPlane(center,cam_forward,end);
            let cahngev3 = m4m.math.pool.new_vector3();
            m4m.math.vec3Subtract(start,end,cahngev3);

            //view move
            m4m.math.vec3Add(this.eCameraStartPoint,cahngev3,cahngev3);
            //console.error(` equal  : ${ m4m.math.vec3Equal(cahngev3,ecamT.getWorldTranslate())}`);
            ecamT.setWorldPosition(cahngev3);
            ecamT.markDirty();
            m4m.math.pool.delete_vector3Array([cam_forward,center,start,end,cahngev3]);
        }
        
        
        if(e.button == 0 && this.debugTool.pointLeftDown){
            if (this.target && this.target instanceof m4m.framework.transform)
            {
                if(this.target.gameObject.getComponent("canvascontainer") as m4m.framework.canvascontainer){
                    return;//canvascontainer 不能被移动
                }
                if (this.debugTool.debugMode == DebugModel.translate || this.debugTool.debugMode == DebugModel.scale)
                {
                    let tempv2 = m4m.math.pool.new_vector2(e.x,e.y);
                    var ray = EditorApplication.Instance.editorCamera.creatRayByScreen(tempv2, this.app);
                    m4m.math.pool.delete_vector2(tempv2);
    
                    var dir = m4m.math.pool.new_vector3();
                    if (this.selectMode == SelectModel.Axis_X)
                    {
                        if(this._isGlobalRotate){
                            m4m.math.vec3Clone(m4m.math.pool.vector3_right,dir);
                        }else{
                            m4m.math.matrixTransformNormal(m4m.math.pool.vector3_right, this.target.getWorldMatrix(), dir);
                        }
                    }
                    else if (this.selectMode == SelectModel.Axis_Y)
                    {
                        if(this._isGlobalRotate){
                            m4m.math.vec3Clone(m4m.math.pool.vector3_up,dir);
                        }else{
                            m4m.math.matrixTransformNormal(m4m.math.pool.vector3_up, this.target.getWorldMatrix(), dir);
                        }
                    }
                    else if (this.selectMode == SelectModel.Axis_Z)
                    {
                        if(this._isGlobalRotate){
                            m4m.math.vec3Clone(m4m.math.pool.vector3_forward,dir);
                        }else{
                            m4m.math.matrixTransformNormal(m4m.math.pool.vector3_forward, this.target.getWorldMatrix(), dir);
                        }
                    }
    
                    var ori = m4m.math.pool.new_vector3();
                    m4m.math.vec3Clone(this.target.getWorldTranslate(), ori);
                    m4m.math.vec3Normalize(dir,dir);
    
                    let t = m4m.math.pool.new_vector3();
                    var bool = this.intersectionWith2Line(ray.origin, ray.direction, ori, dir,t);
    
                    //父物体矩阵的逆
                    var pworld = m4m.math.pool.new_matrix();
                    if (this.target.parent != null)
                    {
                        m4m.math.matrixClone(this.target.parent.getWorldMatrix(), pworld);
                    }
                    else
                    {
                        m4m.math.matrixMakeIdentity(pworld);
                    }
                    var matinv = new m4m.math.matrix();
                    m4m.math.matrixInverse(pworld, matinv);
    
                    if (bool)
                    {
                        if (this.debugTool.debugMode == DebugModel.translate)
                        {
                            if(this.isPlaneMode){
                                m4m.math.vec3Normalize(dir,dir);
                                ray.intersectPlane(this.target.getWorldTranslate(),dir,t);
                            }
                            if(t){
                                t.x -= this.MouseStartPoint.x - this.targetStartPoint.x;
                                t.y -= this.MouseStartPoint.y - this.targetStartPoint.y;
                                t.z -= this.MouseStartPoint.z - this.targetStartPoint.z;
                                this.target.setWorldPosition(t);
                                
                            }
                        }
                        else if (this.debugTool.debugMode == DebugModel.scale)
                        {
                            if (this.selectMode == SelectModel.Axis_X)
                            {
                                this.target.localScale.x = this.targetStartScale.x * (t.x - ori.x) / (this.MouseStartPoint.x - ori.x);
                            }
                            else if (this.selectMode == SelectModel.Axis_Y)
                            {
                                this.target.localScale.y = this.targetStartScale.y * (t.y - ori.y) / (this.MouseStartPoint.y - ori.y);
                            }
                            else if (this.selectMode == SelectModel.Axis_Z)
                            {
                                this.target.localScale.z = this.targetStartScale.z * (t.z - ori.z) / (this.MouseStartPoint.z - ori.z);
                            }
                        }
                        this.target.markDirty();
                    }
                    m4m.math.pool.delete_vector3(dir);
                    m4m.math.pool.delete_vector3(t);
                }
                else if (this.debugTool.debugMode == DebugModel.rotation && this.selectMode != SelectModel.null)
                {
                    var endScreenPos = m4m.math.pool.new_vector2();
                    endScreenPos.x = e.x;
                    endScreenPos.y = e.y;
                    var moveDir = m4m.math.pool.new_vector2();
                    m4m.math.vec2Subtract(endScreenPos, this.mousePosInScreen, moveDir);
    
                    var contrastValue = m4m.math.vec2Multiply(moveDir, this.contrastDir);
    
                    var RotSpeed: number = 0.5;
                    var rotAngle = RotSpeed * -contrastValue;
    
                    var localRot = m4m.math.pool.new_quaternion();
                    if (this.selectMode == SelectModel.Axis_X)
                    {
                        m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, rotAngle, localRot);
                    }
                    else if (this.selectMode == SelectModel.Axis_Y)
                    {
                        m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, rotAngle, localRot);
                    }
                    else if (this.selectMode == SelectModel.Axis_Z)
                    {
                        m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, rotAngle, localRot);
                    }
                    m4m.math.quatMultiply(this.targetStartRotate, localRot, this.target.localRotate);
                    this.target.markDirty();
    
                    m4m.math.pool.delete_vector2(endScreenPos);
                    m4m.math.pool.delete_vector2(moveDir);
                }
    
            }
        }

        if(!this.moveOverlimit){
            let currPos = m4m.math.pool.new_vector2(e.x,e.y);
            if(m4m.math.vec2Distance(this.mouseStartPoint,this.mouseEndPoint) > this.limitNum){
                this.moveOverlimit = true;
                if(this.target && !this.isPickedAxis && this.debugTool.pointLeftDown){
                    this.target = null;
                }
            }
        }

    }
    pointUpEvent(e)
    {
        if (e.button == 0)
        {
            if(this.isPickedAxis){
                //this.checkRTSChange();
            }else if(this.isPickTrans(e.x,e.y)){
                //..
            }

            this.isPickedAxis = false;
            e.button = -1; //和ui 触发互斥
        }else if(e.button == 1){
            //ApplicationMgr.DebugmodeBarUIChange(this.lastDebugModel);
            this.debugTool.setDebugModel(this.lastDebugModel);
            //调整观察点到中心
            if(!this.moveOverlimit && this.isMidPicked){
                //EditorApplication.Instance.editorCamera.CameraCenterToPoint(this.lastMidPickPos);
            }
        }
        else if (e.button == 2)
        {
            
        }
        this.selectMode = SelectModel.null;
        this.isholdDown = false;

        if(this.target && this.target instanceof m4m.framework.transform){
            let id = this.target.insId.getInsID();
            if(id != this.lastTargetID){
                this.colorRefresh(true);
            }
            this.lastTargetID = id;
        }
    }

    private tarlastPos:m4m.math.vector3 = new m4m.math.vector3();
    private tarlastRotate:m4m.math.quaternion = new m4m.math.quaternion();
    private tarlastScale:m4m.math.vector3 = new m4m.math.vector3();
    private isPickedAxis = false;
    private saveRTS(){
        if(!this.target|| !this.tarlastPos || !this.tarlastRotate || !this.tarlastScale) return;
        m4m.math.vec3Clone(this.target.localTranslate,this.tarlastPos);
        m4m.math.quatClone(this.target.localRotate,this.tarlastRotate);
        m4m.math.vec3Clone(this.target.localScale,this.tarlastScale);
    }

    // private checkRTSChange(){
    //     if(!this.target || !this.tarlastPos || !this.tarlastRotate || !this.tarlastScale) return;
    //     if(!m4m.math.vec3Equal(this.target.localTranslate,this.tarlastPos)){
    //         let tempPos = new m4m.math.vector3();
    //         m4m.math.vec3Clone(this.target.localTranslate,tempPos);
    //         m4m.math.vec3Clone(this.tarlastPos,this.target.localTranslate);
    //         let fun = this.target.markDirty.bind(this.target);
    //         let combi = new CombiCommand();
    //         combi.addCommand(new ObjAttriChangeCommand(this.target,"localTranslate",tempPos));
    //         combi.addCommand(new FunCommand(fun,fun));
    //         CommandMgr.Instance.executeCommand(combi);
    //         m4m.math.vec3Clone(this.target.localTranslate,this.tarlastPos);
    //     }
    //     if(!m4m.math.vec3Equal(this.target.localScale,this.tarlastScale)){
    //         let tempSca = new m4m.math.vector3();
    //         m4m.math.vec3Clone(this.target.localScale,tempSca);
    //         m4m.math.vec3Clone(this.tarlastScale,this.target.localScale);
    //         let fun = this.target.markDirty.bind(this.target);
    //         let combi = new CombiCommand();
    //         combi.addCommand(new ObjAttriChangeCommand(this.target,"localScale",tempSca));
    //         combi.addCommand(new FunCommand(fun,fun));
    //         CommandMgr.Instance.executeCommand(combi);
    //         m4m.math.vec3Clone(this.target.localScale,this.tarlastScale);
    //     }
    //     if(!m4m.math.quatEqual(this.target.localRotate,this.tarlastRotate)){
    //         let tempRot = new m4m.math.quaternion();
    //         m4m.math.quatClone(this.target.localRotate,tempRot);
    //         m4m.math.quatClone(this.tarlastRotate,this.target.localRotate);
    //         let fun = this.target.markDirty.bind(this.target);
    //         let combi = new CombiCommand();
    //         combi.addCommand(new ObjAttriChangeCommand(this.target,"localRotate",tempRot));
    //         combi.addCommand(new FunCommand(fun,fun));
    //         CommandMgr.Instance.executeCommand(combi);
    //         m4m.math.quatClone(this.target.localRotate,this.tarlastRotate);
    //     }
    // }

    DebugModelChange(_model: number){
        this._pyr.gameObject.visible = this._box.gameObject.visible = this._line.gameObject.visible = this._circle.gameObject.visible = false;
        switch(_model){
            case DebugModel.translate:
                this._pyr.gameObject.visible = true;
                this._line.gameObject.visible = true;
                break; 
            case DebugModel.rotation:
                this._circle.gameObject.visible = true; 
                break; 
            case DebugModel.scale:
                this._box.gameObject.visible = true;
                this._line.gameObject.visible = true; 
                break; 
        }
    }

    setToolGlobal(isGlobal:boolean){
        this._isGlobalRotate = isGlobal;
    }
}