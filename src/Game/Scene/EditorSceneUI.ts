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
import IEditorCode = m4m.framework.IEditorCode;
import color = m4m.math.color;
import layoutOption = m4m.framework.layoutOption;
import texture = m4m.framework.texture;
import overlay2D = m4m.framework.overlay2D;
import button = m4m.framework.button;
import rawImage2D = m4m.framework.rawImage2D;
import transform = m4m.framework.transform;
import CullingMask = m4m.framework.CullingMask;
import vector3 = m4m.math.vector3;
import TransformUtil = m4m.framework.TransformUtil;
import material = m4m.framework.material;
import vector4 = m4m.math.vector4;
import camera = m4m.framework.camera;
import transform2D = m4m.framework.transform2D;
import vector2 = m4m.math.vector2;
import canvasRenderer = m4m.framework.canvasRenderer;
import {EditorApplication} from "../EditorApplication";
import {EditorObjectTags} from "../EditorObjectTags";
import {AxisDirection, AxisType} from "./EditorAxisObject";
import {EditorInputMgr} from "../Input/EditorInputMgr";

type AxisData = {
    body: transform,
    canvas: canvasRenderer
}

export class EditorSceneUI implements IEditorCode {

    /**
     * 编辑器ui根节点
     */
    public overlay2D: overlay2D;
    /**
     * 右上角3d轴的ui根节点
     */
    public axisPanel: transform2D;
    /**
     * 是否正在拖拽box
     */
    public isDragBox: boolean = false;

    /**
     * 渲染方向轴的相机
     */
    public axisCamera: camera;
    
    //引擎对象
    private _engineApp: m4m.framework.application;

    private _axisCameraTrans: transform = new transform();
    
    //右上角3d轴
    private _axisRoot: transform;
    private _axisMap: { [key: string]: AxisData } = {};
    //3d轴中间的正方体
    private _axisBox: transform;
    //
    private _pickinfo: m4m.framework.pickinfo = new m4m.framework.pickinfo(0, 0, 0);
    private _isDragMoveFlag = false;
    
    isClosed(): boolean {
        return false;
    }

    onStart(app: m4m.framework.application): any {
        this._engineApp = app;

        let ea = EditorApplication.Instance;
        this.overlay2D = new m4m.framework.overlay2D();
        ea.editorCamera.addOverLay(this.overlay2D);
        
        //创建切换选中轴的按钮
        this.createAxisButtonGroup();
        //创建右上角的轴
        this.createAxis();
        
        //绑定移动事件
        EditorInputMgr.Instance.addEventListener("TouchDown", this.onTouchDownFunc.bind(this));
        EditorInputMgr.Instance.addEventListener("TouchUp", this.onTouchUpFunc.bind(this));
        EditorInputMgr.Instance.addEventListener("TouchMove", this.onTouchMoveFunc.bind(this));
    }

    onUpdate(delta: number): any {
        let ea = EditorApplication.Instance;
        if (ea.isPlay) {
            return;
        }
        
        // 调整轴角度
        if (this._axisRoot) {
            m4m.math.quatClone(ea.editorCamera.gameObject.transform.localRotate, this.axisCamera.gameObject.transform.localRotate);
            this._axisRoot.setWorldRotate(new m4m.math.quaternion());
            var asp = ea.editorCamera.currViewPixelASP;
            if (asp >= 1) {
                this.axisPanel.width = 300 * asp;
                this.axisPanel.height = 300;
                this._axisRoot.localTranslate.z = 5;
            } else {
                this.axisPanel.width = 300 * asp;
                this._axisRoot.localTranslate.z = m4m.math.numberLerp(5, 12, 1 - asp);
            }
        }

        for (let key in this._axisMap) {
            let item = this._axisMap[key];
            
            item.canvas.gameObject.transform.lookat(this.axisCamera.gameObject.transform);
        }
    }

    /**
     * 通过屏幕坐标 获取 3D 空间坐标
     * @param x screenPos.x
     * @param y screenPos.y
     * @param out3DPos 3D 空间坐标
     * @param watchCam 观察相机
     * @param zDepth 相对于相机观察平面的距离(相机Z 深度)
     */
    public static calcu3DPosByScreenPos(x: number, y: number, out3DPos: m4m.math.vector3, watchCam: camera, zDepth: number = 5) {
        if (isNaN(x) || isNaN(y) || !out3DPos || !watchCam) {
            return;
        }
        let sPos = new vector2();
        m4m.math.vec2Set(sPos, x, y);
        let camTrans = watchCam.gameObject.transform;
        
        let app = m4m.framework.sceneMgr.app;
        let planePoint = new vector3();
        let planeN = new vector3();
        watchCam.gameObject.transform.getForwardInWorld(planeN);
        m4m.math.vec3ScaleByNum(planeN, zDepth, planePoint);
        m4m.math.vec3Add(planePoint, camTrans.getWorldPosition(), planePoint);
        let ray = watchCam.creatRayByScreen(sPos, app);
        ray.intersectPlane(planePoint, planeN, out3DPos);
    }

    private btnList: { btn: button, img: rawImage2D }[] = [];
    private unSelectColor: color = new color(1, 1, 1);
    private selectColor: color = new color(152 / 255, 183 / 255, 219 / 255);

    //创建切换选中轴的按钮
    private createAxisButtonGroup() {
        //按钮宽
        let width = 100;
        //按钮高
        let height = 50;
        //按钮间距
        let padding = 10;
        //按钮数量
        let count = 5;

        let ea = EditorApplication.Instance;

        //创建背景
        let panel = new m4m.framework.transform2D();
        panel.tag = EditorObjectTags.editorUiTag;
        panel.width = width * count + padding * (count + 1);
        panel.height = height + padding * 2;
        panel.layoutState = layoutOption.TOP | layoutOption.LEFT;
        panel.setLayoutValue(layoutOption.LEFT, 10);
        panel.setLayoutValue(layoutOption.TOP, 10);
        let raw = panel.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        raw.image = ea.assetMgr.getDefaultTexture("white");
        raw.color = new color(0.08235294117647059, 0.07450980392156863, 0.07058823529411765);
        this.overlay2D.addChild(panel);

        //创建按钮
        for (let i = 0; i < count; i++) {
            let btnObj = new m4m.framework.transform2D();
            btnObj.tag = EditorObjectTags.editorUiTag;
            btnObj.width = width;
            btnObj.height = height;
            btnObj.layoutState = layoutOption.TOP | layoutOption.LEFT;
            btnObj.setLayoutValue(layoutOption.LEFT, padding + (width + padding) * i);
            btnObj.setLayoutValue(layoutOption.TOP, padding);
            let btnRaw = btnObj.addComponent("rawImage2D") as m4m.framework.rawImage2D;
            btnRaw.image = ea.assetMgr.getAssetByName<texture>("axis_" + (i + 1) + ".png");
            let btn = btnObj.addComponent("button") as button;
            btn.addListener(m4m.event.UIEventEnum.PointerClick, () => {
                this.onSelectAxisButton(i);
            }, this);
            panel.addChild(btnObj);
            this.btnList.push({btn, img: btnRaw});
        }

        let scale = window.innerWidth / 2560;
        m4m.math.vec2Set(panel.localScale, scale, scale);

        this.onSelectAxisButton(1);
    }

    //创建scene窗口右上角轴
    private createAxis() {
        let ea = EditorApplication.Instance;

        this.axisPanel = new m4m.framework.transform2D();
        this.axisPanel.width = 300;
        this.axisPanel.height = 300;
        this.axisPanel.layoutState = layoutOption.TOP | layoutOption.RIGHT
        this.axisPanel.setLayoutValue(layoutOption.RIGHT, 0);
        this.axisPanel.setLayoutValue(layoutOption.TOP, 0);
        var raw = this.axisPanel.addComponent("rawImage2D") as m4m.framework.rawImage2D;
        this.overlay2D.addChild(this.axisPanel);

        //需要一个相机单独渲染 axis
        this._axisCameraTrans.name = "axisCamera";
        this.axisCamera = this._axisCameraTrans.gameObject.addComponent("camera") as m4m.framework.camera;
        this.axisCamera.isEditorCam = true;
        ea.editorScene.addEditorTrans(this._axisCameraTrans);

        var color = new m4m.framework.cameraPostQueue_Color();
        color.renderTarget = new m4m.render.glRenderTarget(ea.editorScene.scene.webgl, 300, 300, true, false);
        
        this.axisCamera.CullingMask = CullingMask.editor;
        this.axisCamera.postQueues.push(color);
        //相机渲染背景设置为透明
        this.axisCamera.backgroundColor = new m4m.math.color(0, 0, 0, 0);
        this.axisCamera.postClearUseFogColor = false;
        
        this.axisCamera.far = 15;
        this._axisCameraTrans.localTranslate = new vector3(9999999, 9999999, 9999999);

        var textcolor = new m4m.framework.texture("_color");
        textcolor.glTexture = color.renderTarget;
        raw.image = textcolor;

        //创建轴
        this._axisRoot = new transform();
        let tempRoot = new transform();
        m4m.math.vec3Set(tempRoot.localTranslate, -1, -1, -1);
        this._axisRoot.addChild(tempRoot);
        {
            //创建box
            let box = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, ea.engineApp);
            box.name = "Body";
            this._axisBox = box;
            m4m.math.vec3Set(box.localScale, 2, 2, 2);
            m4m.math.vec3Set(box.localTranslate, 1, 1, 1);
            let renderer: m4m.framework.meshRenderer = box.gameObject.renderer as m4m.framework.meshRenderer;
            let materials: material = renderer.materials[0];
            materials.setShader(ea.engineApp.getAssetMgr().getShader("shader/materialcolor"));
            materials.setVector4("_Color", new vector4(227 / 255, 234 / 255, 239 / 255, 1));
            materials.setFloat("_Alpha", 0.3);
            box.gameObject.addComponent("meshcollider");
            box.gameObject.layer = 3; //CullingMask.editor
            tempRoot.addChild(box);
            
            let xAxis = this.createMoveAxis(AxisDirection.x, new vector4(1, 0, 0, 1), 1, new vector3(0.1, 1, 0.1));
            xAxis.body.localEulerAngles = new vector3(0, 0, -90);
            m4m.math.vec3Set(xAxis.body.localTranslate, 1, 0, 0);
            tempRoot.addChild(xAxis.body);
            let yAxis = this.createMoveAxis(AxisDirection.y, new vector4(0, 1, 0, 1), 1, new vector3(0.1, 1, 0.1));
            yAxis.body.localEulerAngles = new vector3(0, 0, 0);
            m4m.math.vec3Set(yAxis.body.localTranslate, 0, 1, 0);
            tempRoot.addChild(yAxis.body);
            let zAxis = this.createMoveAxis(AxisDirection.z, new vector4(0, 0, 1, 1), 1, new vector3(0.1, 1, 0.1));
            zAxis.body.localEulerAngles = new vector3(90, 0, 0);
            m4m.math.vec3Set(zAxis.body.localTranslate, 0, 0, 1);
            tempRoot.addChild(zAxis.body);

            //===========================
            // let canvasObj = new transform();
            // canvasObj.gameObject.layer = 3; //CullingMask.editor
            // canvasObj.localTranslate.y = 1;
            // let canvas = canvasObj.gameObject.addComponent("canvasRenderer") as canvasRenderer;
            // canvas.dontFrustumCulling = true;
            
            //===========================
            // let labTrans = new m4m.framework.transform2D();
            // labTrans.layer = 4; //CullingMask.editor
            // labTrans.width = 100;
            // labTrans.height = 40;
            // labTrans.pivot = new m4m.math.vector2(0.5, 0.5)
            //
            // let label = labTrans.addComponent("label") as m4m.framework.label;
            // label.text = "123456";
            // label.font = ea.defaultFont;
            // label.fontsize = 35;
            // this._axisPanel.addChild(labTrans)
        }

        this._axisCameraTrans.addChild(this._axisRoot);
        this._axisRoot.localTranslate = new vector3(0, 0, 5);
    }
    
    private onSelectAxisButton(index: number) {
        if (index == 4) { //切换2d / 3d
            EditorApplication.Instance.editorCamera.switchPpvalueType();
        } else {
            let axisObject = EditorApplication.Instance.axisObject;
            if (index == 0) { //纯拖拽
                axisObject.currAxisType = AxisType.drag;
            } else if (index == 1) { //移动
                axisObject.currAxisType = AxisType.move;
            } else if (index == 2) { //选装
                axisObject.currAxisType = AxisType.rotate;
            } else if (index == 3) { //缩放
                axisObject.currAxisType = AxisType.scale;
            }
            for (let i = 0; i < 4; i++) {
                let item = this.btnList[i];
                if (index == i) {
                    item.img.color = this.selectColor;
                    item.img.updateTran();
                } else {
                    item.img.color = this.unSelectColor;
                    item.img.updateTran();
                }
            }
        }
    }

    //创建移动轴
    private createMoveAxis(type: AxisDirection, color: vector4, alpha: number, scale: vector3): AxisData {
        let ea = EditorApplication.Instance;
        let axis = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cylinder, ea.engineApp);
        axis.name = "Axis_" + type;
        axis.gameObject.layer = 3; //CullingMask.editor
        let renderer: m4m.framework.meshRenderer = axis.gameObject.renderer as m4m.framework.meshRenderer;
        let materials: material = renderer.materials[0];
        materials.setShader(ea.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        materials.setVector4("_Color", color);
        materials.setFloat("_Alpha", alpha);

        //创建圆锥
        let pyramid = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Pyramid, ea.engineApp);
        let pyramidRenderer = pyramid.gameObject.renderer as m4m.framework.meshRenderer;
        let pyramidMaterials = pyramidRenderer.materials[0];
        pyramidMaterials.setShader(ea.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        pyramidMaterials.setVector4("_Color", color);
        pyramidMaterials.setFloat("_Alpha", alpha);
        pyramid.gameObject.layer = 3; //CullingMask.editor

        m4m.math.vec3Set(pyramid.localScale, 2, 0.2, 2);
        pyramid.localTranslate.y = 1;
        axis.addChild(pyramid);

        m4m.math.vec3Clone(scale, axis.localScale);
        //碰撞组件
        axis.gameObject.addComponent("meshcollider");

        let canvasObj = new transform();
        canvasObj.gameObject.layer = 3; //CullingMask.editor
        pyramid.addChild(canvasObj);
        canvasObj.localTranslate.y = 1;
        let canvas = canvasObj.gameObject.addComponent("canvasRenderer") as canvasRenderer;
        canvas.dontFrustumCulling = true;
        let labTrans = new m4m.framework.transform2D();
        labTrans.layer = 4; //CullingMask.editor
        labTrans.width = 30;
        labTrans.height = 30;
        labTrans.pivot = new m4m.math.vector2(0.25, 0.5)
        labTrans.localScale = new m4m.math.vector2(-50, 50);
        
        let label = labTrans.addComponent("label") as m4m.framework.label;
        label.text = type;
        label.font = ea.editorResources.defaultFont;
        label.fontsize = 15;
        canvas.addChild(labTrans);
        
        let data = {
            body: axis,
            canvas: canvas
        };
        this._axisMap[type] = data;
        return data;
    }
    
    //按下
    private onTouchDownFunc() {
        this._isDragMoveFlag = false;
        let inputMgr = EditorInputMgr.Instance;
        let touchPosition = inputMgr.getTouchPosition();
        let translate = this.axisPanel.localTranslate;
        // 鼠标在画布内
        if (touchPosition.x >= translate.x && touchPosition.x <= translate.x + this.axisPanel.width &&
            touchPosition.y >= translate.y && touchPosition.y <= translate.y + this.axisPanel.height) {

            let ea = EditorApplication.Instance;
            let pixelRect = ea.editorCamera.currViewPixelRect;
            let viewPoint = new vector2((touchPosition.x - translate.x) / this.axisPanel.width * pixelRect.w,
                (touchPosition.y - translate.y) / this.axisPanel.height * pixelRect.h);

            //碰撞检测, 是否点击到box
            let ray = this.axisCamera.creatRayByScreen(viewPoint, ea.engineApp);
            //let children = this._axisRoot.children[0].children;
            
            if (ray.intersectCollider(this._axisBox, this._pickinfo)) {
                this.isDragBox = true;
            }
        }
    }
    
    //拖动
    private onTouchMoveFunc(x: number, y: number) {
        if (this.isDragBox) {
            this._isDragMoveFlag = true;
            EditorApplication.Instance.editorCamera.MoveView(x * 10, y * 10);
        }
    }
    
    //松开
    private onTouchUpFunc() {
        if (this.isDragBox && !this._isDragMoveFlag) { //没有移动过相机
            // console.error("normal: ", this._pickinfo.normal);
            // console.error("camera angle: ", EditorApplication.Instance.editorCamera.gameObject.transform.localEulerAngles)
            // console.error("toAngle: ", this.toAngle(this._pickinfo.normal));

            EditorApplication.Instance.editorCamera.DifferenceMoveView(this.toAngle(this._pickinfo.normal), 0.2);
        }
        this.isDragBox = false;
        this._isDragMoveFlag = false;
    }
    
    private toAngle(normal: vector3): vector3 {
        if (normal.x == 0 && normal.y == 0) {
            if (normal.z == 1) {
                return new vector3();
            } else {
                return new vector3(0, -180, 0);
            }
        }
        if (normal.x == 0 && normal.z == 0) {
            if (normal.y == 1) {
                return new vector3(-90, 0, 0);
            } else {
                return new vector3(90, 0, 0);
            }
        }
        if (normal.y == 0 && normal.z == 0) {
            if (normal.x == 1) {
                return new vector3(0, 90, 0);
            } else {
                return new vector3(0, -90, 0);
            }
        }
        return new vector3();
    }
    
}