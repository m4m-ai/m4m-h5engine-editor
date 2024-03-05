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
import transform = m4m.framework.transform;
import rawscene = m4m.framework.rawscene;
import prefab = m4m.framework.prefab;
import texture = m4m.framework.texture;
import Fog = m4m.framework.Fog;
import scene = m4m.framework.scene;
import quaternion = m4m.math.quaternion;
import vector3 = m4m.math.vector3;
import canvasRenderer = m4m.framework.canvasRenderer;
import transform2D = m4m.framework.transform2D;
import boxcollider = m4m.framework.boxcollider;
import vector2 = m4m.math.vector2;
import ray = m4m.framework.ray;
import color = m4m.math.color;
import { EditorApplication } from "../EditorApplication";
import { Utils } from "../Utils";
import { EditorEventMgr } from "../Event/EditorEventMgr";
import { EditorObjectTags } from "../EditorObjectTags";
import { EditorSceneCamera, SceneCameraOpvalueType } from "./EditorSceneCamera";
import { EditorInputMgr } from "../Input/EditorInputMgr";
import camera = m4m.framework.camera;
import gameObject = m4m.framework.gameObject;
import behaviour = m4m.framework.behaviour;
import { EditorComponentMgr } from "../Component/EditorComponentMgr";
import overlay2D = m4m.framework.overlay2D;
import { ExportManager } from "../ExportManager/ExportManager";
import { WindowManager } from "../../common/window/WindowManager";
import { FileInfoManager } from "../../CodeEditor/code/FileInfoManager";
import { WebsocketTool } from "../../CodeEditor/code/WebsocketTool";

export enum EditorSceneViewType {
    Scene,
    Prefab
}

export class EditorScene implements IEditorCode {

    /**
     * 编辑器物体父节点
     */
    public editorRootTrans: transform;
    /**
     * 场景物体根节点
     */
    public sceneRootTrans: transform;
    /**
     * 预览根节点
     */
    public previewRootTrans: transform;
    /**
     * 场景对象
     */
    public scene: scene;

    /**
     * 视图预览类型: 场景, 预览prefab
     */
    public set viewType(v: EditorSceneViewType) {
        if (v == EditorSceneViewType.Scene && this._viewType != EditorSceneViewType.Scene) { //场景
            EditorApplication.Instance.selection.setActiveTrans(null);
            let cameraTrans = EditorApplication.Instance.editorCamera.gameObject.transform;
            this.sceneRootTrans.gameObject.visible = true;
            this.previewRootTrans.gameObject.visible = false;
            this._canvasRenderer = null;
            this._canvasColliderTrans = null;
            this.clearPrevScene();

            //还原 lightmaps
            if (this.lightmaps != null) {
                this.scene.lightmaps = this.lightmaps;
                this.lightmaps = null;
            }

            //还原 fog
            if (this.fog != null) {
                this.scene.fog = this.fog;
                this.fog = null;
            }

            if (this.rotate != null) {
                cameraTrans.setWorldRotate(this.rotate);
                this.rotate = null;
            }

            if (this.postition != null) {
                cameraTrans.setWorldPosition(this.postition);
                this.postition = null;
            }

        } else if (v == EditorSceneViewType.Prefab && this._viewType != EditorSceneViewType.Prefab) { //prefab
            EditorApplication.Instance.selection.setActiveTrans(null);
            let cameraTrans = EditorApplication.Instance.editorCamera.gameObject.transform;
            this.sceneRootTrans.gameObject.visible = false;
            this.previewRootTrans.gameObject.visible = true;
            this._canvasRenderer = null;
            this._canvasColliderTrans = null;

            this.rotate = new quaternion();
            this.postition = new vector3();
            m4m.math.quatClone(cameraTrans.getWorldRotate(), this.rotate);
            m4m.math.vec3Clone(cameraTrans.getWorldTranslate(), this.postition);

            //备份 lightmaps 和 fog
            this.lightmaps = this.scene.lightmaps;
            this.fog = this.scene.fog;

            this.scene.lightmaps = null;
            this.scene.fog = null;

            cameraTrans.setWorldPosition(new vector3(0, 10, -10));
            cameraTrans.lookatPoint(new vector3());
        }
        this._viewType = v;
    }

    public get viewType() {
        return this._viewType;
    }

    private _viewType: EditorSceneViewType;

    //------------ 场景脚本
    public currUserSceneClass: any = null;
    public currUserSceneInst: any = null;

    //----- 打开预览场景时存贮主场景中的物体
    private lightmaps: texture[];
    private fog: Fog;
    private rotate: quaternion;
    private postition: vector3;
    //-------------------------

    /**
     * 获取编辑器状态下场景canvas碰撞器
     */
    public get canvasColliderTrans() {
        if (!this.canvasRenderer) {
            this._canvasColliderTrans = null;
        }
        return this._canvasColliderTrans;
    }

    private _canvasColliderTrans: transform;

    /**
     * 获取编辑器状态下的场景canvas对象, 可能为 null, 如果需要根据运行状态获取 2D 根节点请调用 getCurrent2DRoot()
     */
    public get canvasRenderer() {
        if (this._canvasRenderer && !this._canvasRenderer.gameObject) {
            this._canvasRenderer = null;
        }
        return this._canvasRenderer;
    }
    private _canvasRenderer: canvasRenderer;

    /**
     * 视图宽度
     */
    public get viewportWidth() {
        return this._prevWidth;
    }

    /**
     * 视图高度
     */
    public get viewportHeight() {
        return this._prevHeight;
    }

    public get enablePhysical() {
        if (EditorApplication.Instance.isPlay) {
            return m4m.framework.physics != null;
        }
        return this._enablePhysical;
    }
    public set enablePhysical(v) {
        if (EditorApplication.Instance.isPlay) {
            if (v) {
                if (m4m.framework.physics == null) { //没有开启物理
                    let oimoJSPlugin = new m4m.framework.OimoJSPlugin();
                    EditorApplication.Instance.editorScene.scene.enablePhysics(this._physicalGravity, oimoJSPlugin);
                }
            }
        } else {
            this._enablePhysical = v;
        }
    }
    private _enablePhysical: boolean = false;

    public set physicalGravity(v: m4m.math.vector3) {
        if (EditorApplication.Instance.isPlay) {
            if (this.enablePhysical) {
                m4m.framework.physics.setGravity({
                    x: v.x,
                    y: v.y,
                    z: v.z
                });
            }
        } else {
            this._physicalGravity = v;
        }
    }
    public get physicalGravity() {
        if (EditorApplication.Instance.isPlay) {
            if (this.enablePhysical) {
                let v = m4m.framework.physics.gravity;
                return {
                    x: v.x,
                    y: v.y,
                    z: v.z
                }
            }
            return {
                x: 0,
                y: 0,
                z: 0
            }
        } else {
            return this._physicalGravity;
        }
    }
    private _physicalGravity: m4m.math.vector3 = new m4m.math.vector3(0, -9.8, 0);

    private _prevWidth: number;
    private _prevHeight: number;

    //获取场景主相机, 可能为 null
    private _mainCamera: camera;

    private lastLine: m4m.framework.transform;

    //是否有节点变化
    private hasChangeNode: boolean = false;
    private changeNodeTimer: number = 0;

    //是否有组件变化 (选中的物体)
    private hasChangeConponent: boolean = false;
    private changeConponentTimer: number = 0;

    public constructor() {
        let ea = EditorApplication.Instance;
        this.scene = ea.engineApp.getScene();

        //重写函数
        this.overwriteMethod();

        this.editorRootTrans = new transform();
        this.editorRootTrans.gameObject.tag = "editor";
        this.editorRootTrans.name = "editorRoot";
        this.editorRootTrans.gameObject.layer = 3; //CullingMask.editor
        this.scene.addChild(this.editorRootTrans);

        this.sceneRootTrans = new transform();
        this.sceneRootTrans.gameObject.tag = "editor";
        this.sceneRootTrans.name = "objectRoot";
        this.scene.addChild(this.sceneRootTrans);

        this.previewRootTrans = new transform();
        this.previewRootTrans.name = "previewRoot";
        this.previewRootTrans.gameObject.tag = "editor";
        this.scene.addChild(this.previewRootTrans);

        EditorEventMgr.Instance.addEventListener("OnPlay", this.setPlay.bind(this))
    }

    private setPlay(b: boolean) {
        if (b) { //播放游戏
            if (this._enablePhysical && !m4m.framework.physics) {
                let oimoJSPlugin = new m4m.framework.OimoJSPlugin();
                EditorApplication.Instance.editorScene.scene.enablePhysics(new m4m.math.vector3(0, -9.8, 0), oimoJSPlugin);
            }
        }
    }

    isClosed(): boolean {
        return false;
    }

    onStart(app: m4m.framework.application): any {
        global.printTree = this.printTree.bind(this);

        //选中物体
        EditorEventMgr.Instance.addEventListener("OnSelectActiveObject", trans => {
            this.hasChangeConponent = false;
            this.changeConponentTimer = 0;
        });

        //重新挂载脚本
        EditorEventMgr.Instance.addEventListener("OnRemountComponent", this.onRemountComponent.bind(this));

        //保存场景
        EditorEventMgr.Instance.addEventListener("OnSaveScene", this.onSaveScene.bind(this));
        //EditorEventMgr.Instance.addEventListener("OnSaveScene", this.onCreateNav.bind(this));

        this.openEmptyScene();
    }

    onUpdate(delta: number): any {
        //这里做个优化, 并不是每一帧刷新场景树, 而是刷新之后半秒内不再刷新
        if (this.changeNodeTimer > 0) {
            this.changeNodeTimer -= delta;
        }
        if (this.changeNodeTimer <= 0 && this.hasChangeNode) {
            this.changeNodeTimer = 0.5;
            this.hasChangeNode = false;
            //通知刷新场景树
            EditorEventMgr.Instance.emitEvent("RefreshNodeTree", cb => cb());
        }

        //选中的物体有组件变化
        if (this.changeConponentTimer > 0) {
            this.changeConponentTimer -= delta;
        }
        if (this.changeConponentTimer <= 0 && this.hasChangeConponent) {
            this.changeConponentTimer = 0.5;
            this.hasChangeConponent = false;
            //通知刷新显示的组件
            EditorEventMgr.Instance.emitEvent("RefreshNodeComponent", cb => cb());
        }

        let ea = EditorApplication.Instance;
        // 在play状态下才会进行 update
        if (ea.isPlay) {
            if (this.currUserSceneInst != null) {
                this.currUserSceneInst.update(delta);
            }
        }

        if (ea.isPlay) {
            return;
        }

        //视图大小改变
        let rect = EditorApplication.Instance.editorCamera.currViewPixelRect;
        if (rect.w != this._prevWidth || rect.h != this._prevHeight) {
            this._prevWidth = rect.w;
            this._prevHeight = rect.h;
            this.changeViewportRect(this._prevWidth, this._prevHeight);

            EditorEventMgr.Instance.emitEvent("OnViewportRectChange", cb => cb(this._prevWidth, this._prevHeight));
        }
    }

    /**
     * 在 editorRootTrans 下添加对象
     */
    public addEditorTrans(trans: transform) {
        trans.gameObject.layer = 3;
        this.editorRootTrans.addChild(trans);
    }

    /**
     * 往场景中添加一个trans
     */
    public addSceneTrans(trans: transform) {
        this.sceneRootTrans.addChild(trans);
    }

    /**
     * 在预览模式下添加一个trans
     */
    public addPreviewTrans(trans: transform) {
        this.previewRootTrans.addChild(trans);
    }

    /**
     * 根据运行状态, 往场景根节点添加 trans
     */
    public addToCurrentRoot(trans: transform) {
        if (EditorApplication.Instance.isPlay) {
            return this.scene.getRoot().addChild(trans);
        } else if (this.viewType == EditorSceneViewType.Scene) {
            this.addSceneTrans(trans);
        } else {
            this.addPreviewTrans(trans);
        }
    }

    /**
     * 根据运行状态, 返回场景根节点
     */
    public getCurrentRoot(): transform {
        if (EditorApplication.Instance.isPlay) {
            return this.scene.getRoot();
        }
        if (this.viewType == EditorSceneViewType.Scene) {
            return this.sceneRootTrans;
        } else {
            return this.previewRootTrans;
        }
    }

    /**
     * 获取当前显示的场景原根节点, 例如在运行状态下, 返回的是编辑器状态下的场景根节点
     */
    public getCurrentOriginRoot(): transform {
        if (EditorApplication.Instance.isPlay || this.viewType == EditorSceneViewType.Scene) {
            return this.sceneRootTrans;
        } else {
            return this.previewRootTrans;
        }
    }

    /**
     * 更具是否运行来返回当前的 2D 根节点
     */
    public getCurrent2DRoot(): transform2D {
        if (EditorApplication.Instance.isPlay) {
            if (this.scene.mainCamera) {
                let overLays = this.scene.mainCamera.getOverLays();
                for (const overLay of overLays) {
                    if (overLay instanceof overlay2D) {
                        return overLay.canvas.getRoot();
                    }
                }
            }
        } else if (this.viewType == EditorSceneViewType.Scene) {
            let renderer = this.canvasRenderer;
            if (renderer) {
                return renderer.canvas.getRoot();
            }
        }
        return null;
    }

    /**
     * 获取当前显示的场景原2D根节点, 例如在运行状态下, 返回的是编辑器状态下的场景2D根节点
     */
    public getCurrentOrigin2DRoot(): transform2D {
        if (EditorApplication.Instance.isPlay || this.viewType == EditorSceneViewType.Scene) {
            let renderer = this.canvasRenderer;
            if (renderer) {
                return renderer.canvas.getRoot();
            }
        }
        return null;
    }

    /**
     * 打开空场景
     */
    public openEmptyScene() {
        this.clearScene();
        // this.lightmaps = null;
        // this.fog = null;
        this.viewType = EditorSceneViewType.Scene;

        let ct = EditorApplication.Instance.editorCamera.gameObject.transform;
        ct.setWorldPosition(new vector3(0, 3, -3));
        ct.lookatPoint(new vector3());

        this.createOrGetCanvasRenderer();
        this.createOrGetMainCamera();
    }

    /**
     * 切换到指定场景
     */
    public changeScene(pack: rawscene) {
        this.clearScene();
        // this.lightmaps = null;
        // this.fog = null;

        this.viewType = EditorSceneViewType.Scene;

        let ct = EditorApplication.Instance.editorCamera.gameObject.transform;
        ct.setWorldPosition(new vector3(0, 3, -3));
        ct.lookatPoint(new vector3());
        var _root = pack.getSceneRoot();
        this.addSceneTrans(_root);
        this.scene.lightmaps = [];
        pack.useLightMap(this.scene);
        pack.useFog(this.scene);

        this.createOrGetCanvasRenderer();
        this.createOrGetMainCamera(_root);
    }

    /**
     * 打开预览模式下的trans
     */
    public previewPrefab(prefab: prefab) {
        this.viewType = EditorSceneViewType.Prefab;
        this.addPreviewTrans(prefab.getCloneTrans());
    }

    /**
     * 清理场景内的所有物体
     */
    public clearScene() {
        this.lightmaps = null;
        this.fog = null;

        this._canvasRenderer = null;
        this._mainCamera = null;
        this._canvasColliderTrans = null;
        this.scene.fog = null;

        let ea = EditorApplication.Instance;
        ea.selection.setActiveTrans(null);
        this.sceneRootTrans.removeAllChild(true);
        if (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Ui) {
            ea.editorCamera.resetPpvalue();
        }
    }

    public clearPrevScene() {
        this.previewRootTrans.removeAllChild(true);
    }

    /**
     * 获取 CanvasRenderer 节点, 如果没有, 就创建
     */
    public createOrGetCanvasRenderer(root?: transform) {
        if (this.canvasRenderer) {
            return this.canvasRenderer;
        }
        if (!root) {
            this._canvasRenderer = this.createCanvasRenderer();
            this._canvasColliderTrans = this.createCanvasRendererCollider(this._canvasRenderer);
            this.addToCurrentRoot(this._canvasRenderer.gameObject.transform);
            this.drawCanvasRendererOutline();
            return this._canvasRenderer;
        }
        this._canvasRenderer = this.findCanvasRenderer(root);
        if (!this._canvasRenderer) {
            this._canvasRenderer = this.createCanvasRenderer();
        }

        if (this._canvasRenderer.gameObject.getComponent("boxcollider") == null) {
            this._canvasColliderTrans = this.createCanvasRendererCollider(this._canvasRenderer);
        }

        this.addToCurrentRoot(this._canvasRenderer.gameObject.transform);
        this.drawCanvasRendererOutline();
        return this._canvasRenderer;
    }

    /**
     * 获取 Camera 节点, 如果没有, 就创建
     * @param root 从哪一个 transform 开始扫描
     */
    public createOrGetMainCamera(root?: transform) {
        if (this._mainCamera && !this._mainCamera.gameObject) {
            this._mainCamera = null;
        }
        if (this._mainCamera) {
            return this._mainCamera;
        }
        if (!root) {
            this._mainCamera = this.createMainCamera();
            this.addToCurrentRoot(this._mainCamera.gameObject.transform);
            return this._mainCamera;
        }
        this._mainCamera = this.findMainCamera(root);
        if (!this._mainCamera) {
            this._mainCamera = this.createMainCamera();
        }
        this.addToCurrentRoot(this._mainCamera.gameObject.transform);
        return this._mainCamera;
    }

    /**
     * 在指定 trans 下寻找 canvasRenderer 组件
     */
    public findCanvasRenderer(trans: transform) {
        let canvasRenderers = trans.gameObject.getComponentsInChildren("canvasRenderer") as canvasRenderer[];
        if (!canvasRenderers || canvasRenderers.length == 0) {
            return null;
        }
        for (let i = 0; i < canvasRenderers.length; i++) {
            let cr = canvasRenderers[i];
            if (cr.gameObject.tag == "Ui") {
                return cr;
            }
        }
        return null;
    }

    /**
     * 在指定 trans 下寻找主相机
     */
    public findMainCamera(trans: transform) {
        let cameras = trans.gameObject.getComponentsInChildren("camera") as camera[];
        if (!cameras || cameras.length == 0) {
            return null;
        }
        for (let i = 0; i < cameras.length; i++) {
            let cam = cameras[i];
            if (cam.gameObject.tag == EditorObjectTags.mainCamera) {
                return cam;
            }
        }
        return null;
    }

    /**
     * 在canvas下根据点击坐标创建ui, 如果没有canvas, 则创建canvas
     * @param type 控件类型
     */
    public createUiElement(type: m4m.framework.Primitive2DType) {
        let ea = EditorApplication.Instance;
        this.createOrGetCanvasRenderer();

        //获取点击的坐标
        let pos = this.getCanvasTouchPos();
        if (pos) {
            console.log("创建ui控件pos: ", pos);
            let uiTrans: m4m.framework.transform2D;
            console.log("ui控件的类型 ：", type);
            switch (type) {
                case m4m.framework.Primitive2DType.Button:
                    //创建按钮
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Button);
                    const btn = uiTrans.getComponent("button") as m4m.framework.button;
                    // btn.transform.localTranslate = new m4m.math.vector2(pos.x, pos.y);
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    const btnLab = btn.transform.getFirstComponentInChildren("label") as m4m.framework.label;
                    btnLab.horizontalType = m4m.framework.HorizontalType.Center;
                    btnLab.verticalType = m4m.framework.VerticalType.Center;
                    btnLab.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.BOTTOM;
                    btnLab.text = `button`;
                    btnLab.font = ea.editorResources.defaultFont;
                    btnLab.color = new m4m.math.color(0, 0, 0, 1);
                    break;
                case m4m.framework.Primitive2DType.Label:
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Label);
                    // uiTrans.localTranslate = new m4m.math.vector2(pos.x, pos.y);
                    //居中显示
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    const label = uiTrans.getComponent("label") as m4m.framework.label;
                    label.text = "Text";
                    label.font = ea.editorResources.defaultFont;
                    label.color = new m4m.math.color(0, 0, 0, 1);
                    break;
                case m4m.framework.Primitive2DType.Image2D:
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    break;
                case m4m.framework.Primitive2DType.RawImage2D:
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.RawImage2D);
                    //居中显示
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    break;
                case m4m.framework.Primitive2DType.Panel:
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
                    uiTrans.layoutState = m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.BOTTOM;
                    const image = uiTrans.getComponent("image2D") as m4m.framework.image2D;
                    image.imageType = m4m.framework.ImageType.Sliced;
                    image.color = new m4m.math.color(1, 1, 1, 100 / 255);
                    break;
                case m4m.framework.Primitive2DType.InputField:
                    //创建输入框组件
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.InputField);
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    uiTrans.width = 400;
                    uiTrans.height = 100;
                    break;
                case m4m.framework.Primitive2DType.Progressbar:
                    //创建进度条组件
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Progressbar);
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    this.canvasRenderer.addChild(uiTrans);
                    const progressBar = uiTrans.getComponent("progressbar") as m4m.framework.progressbar;
                    progressBar.cutPanel.isMask = true;
                    uiTrans.width = 400;
                    uiTrans.height = 60;
                    break;
                case m4m.framework.Primitive2DType.ScrollRect:
                    //创建滑动区域组件
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.ScrollRect);
                    uiTrans.layoutState = m4m.framework.layoutOption.H_CENTER | m4m.framework.layoutOption.V_CENTER;
                    // uiTrans.isMask = true;
                    // uiTrans.width = 400;
                    // uiTrans.height = 60;
                    break;
            }


            if (uiTrans) {
                // let trans = EditorApplication.Instance.selection.activeTransform;
                // if (trans instanceof m4m.framework.transform2D) {
                //     trans.addChild(uiTrans);
                //     // EditorApplication.Instance.selection.setActiveTrans(uiTrans);
                // } else {
                //加到canvas下
                if (uiTrans.parent == null) {
                    this.canvasRenderer.addChild(uiTrans);
                }
                // }
            }
        }
    }

    /**
     * 获取点击在Canvas上的坐标, 没有点到Canvas则返回null
     */
    public getCanvasTouchPos(): vector2 {
        if (this._canvasRenderer == null) {
            return null;
        }
        let ea = EditorApplication.Instance;
        let renderer = this.createOrGetCanvasRenderer();
        let ray: ray;
        if (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Ui) {
            //从点击处创建射线
            ray = ea.editorCamera.creatRayByScreen(EditorInputMgr.Instance.getTouchPosition(), ea.engineApp);
            ray.origin.z = -1000;
        } else {
            ray = ea.axisObject.createRay();
        }

        let pf = new m4m.framework.pickinfo();
        if (ray.intersectCollider(this.canvasColliderTrans, pf)) {
            let worldPosition = this.canvasColliderTrans.getWorldPosition();
            //算在canvas中的坐标
            return new vector2(
                renderer.canvas.pixelWidth * (((pf.hitposition.x - worldPosition.x) * (renderer.canvas.pixelHeight / renderer.canvas.pixelWidth) + 1) / 2),
                renderer.canvas.pixelHeight * ((1 - (pf.hitposition.y - worldPosition.y)) / 2)
            );
        }
        return null;
    }

    //绘制线段
    private drawLine(points: m4m.math.vector3[]) {
        if (this.lastLine) {
            this.lastLine.gameObject.visible = false;
            if (this.lastLine.parent)
                this.lastLine.parent.removeChild(this.lastLine);
            this.lastLine.dispose();
        }
        this.lastLine = new m4m.framework.transform();

        Utils.drawLine(this.lastLine, points, new color(1, 1, 1, 1));

        //this.lastLine.localTranslate = new vector3();
        this._canvasRenderer.gameObject.transform.addChild(this.lastLine);
    }

    //视图大小改变
    private changeViewportRect(width: number, height: number) {
        //console.log("viewport change: ", width, height);
        //调整画布宽高
        let renderer = this.canvasRenderer;
        if (renderer) {
            renderer.canvas.pixelWidth = width;
            renderer.canvas.pixelHeight = height;

            //let boxcollider = this.canvasColliderTrans.gameObject.getComponent("boxcollider") as boxcollider;

        }

        //重绘边框

    }

    private createCanvasRenderer(): canvasRenderer {
        let canvasTrans = new transform();
        canvasTrans.name = "Canvas";
        canvasTrans.gameObject.tag = "Ui";
        m4m.math.vec3Set(canvasTrans.localPosition, 0, 1000, 0);
        let canvasRenderer = canvasTrans.gameObject.addComponent("canvasRenderer") as canvasRenderer;
        let rect = EditorApplication.Instance.editorCamera.currViewPixelRect;
        canvasRenderer.canvas.pixelWidth = rect.w;
        canvasRenderer.canvas.pixelHeight = rect.h;
        canvasRenderer.canvas.enableOutsideRenderClip = false;
        return canvasRenderer;
    }

    private createCanvasRendererCollider(cr: canvasRenderer) {
        let canvasColliderTrans = new transform();
        canvasColliderTrans.gameObject.tag = EditorObjectTags.hideInTreeTag;
        let boxcollider = canvasColliderTrans.gameObject.addComponent("boxcollider") as boxcollider;
        //boxcollider.colliderVisible = true;
        boxcollider.size = new vector3(2, 2, 0.02);
        cr.gameObject.transform.addChild(canvasColliderTrans);
        return canvasColliderTrans;
    }

    private createMainCamera(): camera {
        //初始化相机, 看向原点
        let objCam = new m4m.framework.transform();
        objCam.name = "MainCamera";
        objCam.gameObject.visible = false;
        let camera = objCam.gameObject.addComponent("camera") as camera;
        objCam.gameObject.tag = EditorObjectTags.mainCamera;
        camera.gameObject.visible = false;
        camera.near = 0.01;
        camera.far = 100000;
        camera.fov = Math.PI * 0.3;
        objCam.localTranslate = new vector3(0, 0, 0);
        return camera;
    }

    private drawCanvasRendererOutline() {
        //创建线段
        let width = 2;
        let height = 2;
        let arr = [
            new vector3(-width / 2, -height / 2, 0),
            new vector3(width / 2, -height / 2, 0),
            new vector3(width / 2, height / 2, 0),
            new vector3(-width / 2, height / 2, 0),
            new vector3(-width / 2, -height / 2, 0),
        ];
        this.drawLine(arr);
    }

    /**
     * 重新挂载场景中的脚本
     */
    private onRemountComponent() {

        //更新3d组件
        Utils.eachTrans(this.getCurrentOriginRoot(), (child) => {
            let components = [...child.gameObject.components];
            for (let component of components) {
                let oldComp = component.comp;
                if (oldComp instanceof behaviour) {
                    let name = Utils.getName(oldComp);
                    child.gameObject.removeComponent(oldComp);
                    //获取映射表
                    let componentInfo = EditorComponentMgr.getComponentInfo(name);
                    if (componentInfo) { //说明该脚本没有被移除
                        let newComponent = EditorComponentMgr.mountComponent3D(child, componentInfo.name);
                        for (let field of componentInfo.fields) {
                            if (field.name in oldComp) {
                                //这里需要判断类型是否改变, 还没做, 留个坑
                                newComponent[field.name] = oldComp[field.name];
                            }
                        }
                    } else {
                        console.error("丢失3d组件: ", name);
                    }
                }
            }
        });

        //更新2d组件
        Utils.each2DTrans(this.getCurrentOrigin2DRoot(), (child) => {
            let components = [...child.components];
            for (let component of components) {
                let oldComp = component.comp;
                if (oldComp instanceof behaviour) {
                    let name = Utils.getName(oldComp);
                    child.removeComponent(oldComp);
                    //获取映射表
                    let componentInfo = EditorComponentMgr.getComponentInfo(name);
                    if (componentInfo) { //说明该脚本没有被移除
                        let newComponent = EditorComponentMgr.mountComponent2D(child, componentInfo.name);
                        for (let field of componentInfo.fields) {
                            if (field.name in oldComp) {
                                //这里需要判断类型是否改变, 还没做, 留个坑
                                newComponent[field.name] = oldComp[field.name];
                            }
                        }
                    } else {
                        console.error("丢失2d组件: ", name);
                    }
                }
            }
        });
    }

    /**
     * 保存场景
     */
    private onSaveScene() {
        if (!WindowManager.hasSaveConfirm()) {
            let path = EditorApplication.Instance.selection.activeFolderPath;
            WindowManager.showSaveConfirm("Save Scene", "Contents/" + path, "NewScene",
                (savePath, saveName) => {
                    if (!saveName) {
                        console.warn("警告 保存的文件名不能为空！");
                        return;
                    } 

                    // if (!saveName) {
                    //     WindowManager.showTips("警告", "保存的文件名不能为空！");
                    //     return;
                    // } else if (!savePath.startsWith("Contents/")) {
                    //     WindowManager.showTips("警告", "路径必须以\"Contents/\"开头！");
                    //     return;
                    // }
                    //let p = (savePath + saveName).replaceAll("\\", "/");
                    //p = p.replaceAll("//", "/");

                    console.log("保存文件: ", EditorApplication.Instance.selection.activeFolderInfo.key, saveName);
                    ExportManager.exportScene(EditorApplication.Instance.selection.activeFolderInfo.key, saveName);
                }
            );
        }
    }

    private onCreateNav() {
        if (!WindowManager.hasCreateNavigationConfirm()) {
            let path = EditorApplication.Instance.selection.activeFolderPath;
            WindowManager.showCreateNavigationConfirm((data) => {
                let binder = EditorEventMgr.Instance.addEventListener("OnNavMeshFileResponse", (result) => {
                    binder.removeListener();
                    if (result != "") {
                        console.log("网格生成成功!: ", result);
                    }
                })
                this.handleSceneNav(EditorApplication.Instance.selection.activeFolderInfo.key, data);
            });
        }
    }

    private handleSceneNav(path: string, config: any): void {
        var array: m4m.framework.transform[] = this.getCurrentRoot().children;
        var szConfig: string = "";
        var nSum = 0;

        //debugger;

        //模型数据
        let lengthArr: number[] = [];
        let fileData: number[] = [];
        for (var i = 0; i < array.length; i++) {
            var meshes: m4m.framework.INodeComponent[] = array[i].gameObject.getComponentsInChildren("meshFilter");
            for (var j = 0; j < meshes.length; j++) {
                var item = meshes[j] as m4m.framework.meshFilter;
                var mesh_ = item.mesh as m4m.framework.mesh;
                if (!mesh_.szContent) {
                    /// Unknown mesh content is empty, we don't need it
                    continue;
                }
                var lowerCaseString = mesh_.getName().toLowerCase();
                if (lowerCaseString.indexOf("skybox") != -1) {
                    /// skybox not need nav mesh
                    continue;
                }

                let arrData = Array.from(m4m.io.converter.StringToUtf8Array(mesh_.szContent));
                lengthArr.push(arrData.length);
                fileData = fileData.concat(arrData);

                var matrix_ = item.gameObject.transform.getWorldMatrix();
                var _count_: number = j + 1;
                szConfig += "i obj" + String(_count_) + " " + mesh_.getName() + ".obj " + String(matrix_.rawData[0]) + " " + String(matrix_.rawData[1]) + " " + String(matrix_.rawData[2]) + " " + String(matrix_.rawData[3]) + " " + String(matrix_.rawData[4]) + " " + String(matrix_.rawData[5]) + " " + String(matrix_.rawData[6]) + " " + String(matrix_.rawData[7]) + " " + String(matrix_.rawData[8]) + " "
                    + String(matrix_.rawData[9]) + " " + String(matrix_.rawData[10]) + " " + String(matrix_.rawData[11]) + " " + String(matrix_.rawData[12]) + " " + String(matrix_.rawData[13]) + " " + String(matrix_.rawData[14]) + " " + String(matrix_.rawData[15]) + "\n";
                nSum++;
            }
        }

        if (lengthArr.length == 0) {
            WindowManager.showTips("警告", "当前场景中没有效的网格数据!");
        } else {
            WebsocketTool.Instance.ProjectManager_createNav(path, config, Array.from(m4m.io.converter.StringToUtf8Array(szConfig)), lengthArr, fileData);
        }
    }

    /**
     * 重写 transform, transform2d 上面的节点操作函数
     */
    private overwriteMethod() {
        let _self = this;
        //------------------- 重写 transform 下的函数, 使其能够监听节点修改 -------------------
        transform.prototype["_addChild"] = transform.prototype.addChild;
        transform.prototype.addChild = function (node: transform) {
            this["_addChild"](node);
            if (node.gameObject.tag != EditorObjectTags.hideInTreeTag) {
                _self.hasChangeNode = true;
            }
        }
        transform.prototype["_removeChild"] = transform.prototype.removeChild;
        transform.prototype.removeChild = function (node: transform) {
            this["_removeChild"](node);
            if (node.gameObject.tag != EditorObjectTags.hideInTreeTag) {
                _self.hasChangeNode = true;
            }
        }
        transform.prototype["_removeAllChild"] = transform.prototype.removeAllChild;
        transform.prototype.removeAllChild = function () {
            let count = this.children.length;
            this["_removeAllChild"]();
            if (count > 0) {
                _self.hasChangeNode = true;
            }
        }
        transform.prototype["_addChildAt"] = transform.prototype.addChildAt;
        transform.prototype.addChildAt = function (node: transform, index: number) {
            this["_addChildAt"](node, index);
            if (node.gameObject.tag != EditorObjectTags.hideInTreeTag) {
                _self.hasChangeNode = true;
            }
        }

        //--------------
        transform2D.prototype["_addChild"] = transform2D.prototype.addChild;
        transform2D.prototype.addChild = function (node: transform2D) {
            this["_addChild"](node);
            if (node.tag != EditorObjectTags.hideInTreeTag) {
                _self.hasChangeNode = true;
            }
        }
        transform2D.prototype["_removeChild"] = transform2D.prototype.removeChild;
        transform2D.prototype.removeChild = function (node: transform2D) {
            this["_removeChild"](node);
            if (node.tag != EditorObjectTags.hideInTreeTag) {
                _self.hasChangeNode = true;
            }
        }
        transform2D.prototype["_removeAllChild"] = transform2D.prototype.removeAllChild;
        transform2D.prototype.removeAllChild = function () {
            let count = this.children.length;
            this["_removeAllChild"]();
            if (count > 0) {
                _self.hasChangeNode = true;
            }
        }
        transform2D.prototype["_addChildAt"] = transform2D.prototype.addChildAt;
        transform2D.prototype.addChildAt = function (node: transform2D, index: number) {
            this["_addChildAt"](node, index);
            if (node.tag != EditorObjectTags.hideInTreeTag) {
                _self.hasChangeNode = true;
            }
        }

        //------------------- 监听重写组件修改函数 -------------------
        gameObject.prototype["_addComponent"] = gameObject.prototype.addComponent;
        gameObject.prototype.addComponent = function (comp) {
            let result = this["_addComponent"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this.transform) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        gameObject.prototype["_addComponentDirect"] = gameObject.prototype.addComponentDirect;
        gameObject.prototype.addComponentDirect = function (comp) {
            let result = this["_addComponentDirect"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this.transform) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        gameObject.prototype["_removeComponent"] = gameObject.prototype.removeComponent;
        gameObject.prototype.removeComponent = function (comp) {
            let result = this["_removeComponent"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this.transform) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        gameObject.prototype["_removeComponentByTypeName"] = gameObject.prototype.removeComponentByTypeName;
        gameObject.prototype.removeComponentByTypeName = function (comp) {
            let count = this.components.length;
            let result = this["_removeComponentByTypeName"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this.transform && count != this.components.length) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        gameObject.prototype["_removeAllComponents"] = gameObject.prototype.removeAllComponents;
        gameObject.prototype.removeAllComponents = function () {
            let count = this.components.length;
            let result = this["_removeAllComponents"]();
            if (EditorApplication.Instance.selection.activeTransform == this.transform && count != this.components.length) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        //-------------------
        transform2D.prototype["_addComponent"] = transform2D.prototype.addComponent;
        transform2D.prototype.addComponent = function (comp) {
            let result = this["_addComponent"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        transform2D.prototype["_addComponentDirect"] = transform2D.prototype.addComponentDirect;
        transform2D.prototype.addComponentDirect = function (comp) {
            let result = this["_addComponentDirect"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        transform2D.prototype["_removeComponent"] = transform2D.prototype.removeComponent;
        transform2D.prototype.removeComponent = function (comp) {
            let result = this["_removeComponent"](comp);
            if (EditorApplication.Instance.selection.activeTransform == this) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        transform2D.prototype["_removeAllComponents"] = transform2D.prototype.removeAllComponents;
        transform2D.prototype.removeAllComponents = function () {
            let count = this.components.length;
            let result = this["_removeAllComponents"]();
            if (EditorApplication.Instance.selection.activeTransform == this && count != this.components.length) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
        transform2D.prototype["_removeComponentByTypeName"] = transform2D.prototype.removeComponentByTypeName;
        transform2D.prototype.removeComponentByTypeName = function () {
            let count = this.components.length;
            let result = this["_removeComponentByTypeName"]();
            if (EditorApplication.Instance.selection.activeTransform == this && count != this.components.length) {
                _self.hasChangeConponent = true;
                EditorApplication.Instance.selection.clearPropertyListener();
            }
            return result;
        }
    }

    /** 控制台打印节点树结构,用于debug时调用 */
    public printTree() {
        let str = "";
        let map = new Map<transform, string>();
        Utils.eachTrans(this.scene.getRoot(), (child, index) => {
            let parent = child.parent;
            let parStr = parent && map.get(parent) || "";
            switch (index) {
                case parent.children.length - 1:
                    str += parStr + "  ┖╴" + child.name;
                    map.set(child, parStr + "   ");
                    break;
                default:
                    str += parStr + "  ┠╴" + child.name;
                    map.set(child, parStr + "  ┃");
                    break;
            }

            if (!child.gameObject.visibleInScene) {
                str += " (hide)\n";
            } else if (child.gameObject.tag == EditorObjectTags.hideInTreeTag) {
                str += " (hideInTree)\n";
            } else {
                str += "\n";
            }
        });
        console.log(str);
    }

}