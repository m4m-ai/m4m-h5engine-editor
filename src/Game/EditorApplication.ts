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
import { EditorSceneCamera } from "./Scene/EditorSceneCamera";
import { EditorGridLine } from "./Discarded/EditorGridLine";
import { EditorAxisObject } from "./Scene/EditorAxisObject";
import { EditorInputMgr } from "./Input/EditorInputMgr";
import { EditorSceneUI } from "./Scene/EditorSceneUI";
import { EditorScene } from "./Scene/EditorScene";
import { EditorSelection } from "./EditorSelection";
import { ExportManager } from "./ExportManager/ExportManager";
import { testReadTool } from "../CodeEditor/loader/otherPlan/testReadTool";
import { EditorEventMgr } from "./Event/EditorEventMgr";
import { EditorResources } from "./Asset/EditorResources";
import vector3 = m4m.math.vector3;
import assetMgr = m4m.framework.assetMgr;
import inputMgr = m4m.framework.inputMgr;
import { WebsocketTool } from "../CodeEditor/code/WebsocketTool";
import transform2D = m4m.framework.transform2D;
import { EditorComponentMgr } from "./Component/EditorComponentMgr";
import overlay2D = m4m.framework.overlay2D;
import camera = m4m.framework.camera;
import { ExportNameList } from "./ExportManager/ExportNameList";
import { CreateUINodeManager } from "./UI/CreateUINodeManager";
import { PSDUiManager } from "./UI/PSDUiManager";
import { GPTApiHandler } from "../gpt/handler/GPTApiHandler";


/**
 * 编辑器对象
 */
export class EditorApplication implements m4m.framework.IEditorCode {

    public static readonly wsServerUrl: string = "ws://127.0.0.1:8004/";
    public static readonly fileServerUrl: string = "http://127.0.0.1:9696/Res/";
    public static readonly postServerUrl: string = "http://127.0.0.1:7777/";

    // /**
    //  * WebSocket 服务器地址
    //  */
    // public static readonly wsServerUrl: string = "wss://ide-svc.meta4d.me:443/";
    // /**
    //  * 文件服务器地址
    //  */
    // public static readonly fileServerUrl: string = "https://ide-svc.meta4d.me:4436/";
    // /**
    //  * 文件上传服务器地址
    //  */
    // public static readonly postServerUrl: string = "https://ide-svc.meta4d.me:4437/";
    
    public static get Instance(): EditorApplication {
        return this._inst;
    }

    private static _inst: EditorApplication = new EditorApplication();
    private static _init = false;

    private _isPlay = false;
    private _isPause = false;

    /**
     * playing状态
     */
    public get isPlay() {
        return this._isPlay;
    }

    /**
     * playing状态
     */
    public set isPlay(v) {
        this.setPlay(v);
    }

    /**
     * 暂停状态
     */
    public get isPause() {
        return this._isPause;
    }

    /**
     * 暂停状态
     */
    public set isPause(v) {
        this.setPause(v);
    }

    /**
     * 引擎实例对象
     */
    public engineApp: m4m.framework.application;
    /**
     * 引擎运行所挂载的div对象
     */
    public element: HTMLDivElement;
    /**
     * 场景相机
     */
    public editorCamera: EditorSceneCamera;
    /**
     * 资源管理器
     */
    public assetMgr: assetMgr;
    /**
     * 输入管理器
     */
    public inputMgr: inputMgr;
    /**
     * 编辑器中的输入管理器 (IEditorCode)
     */
    public editorInputMgr: EditorInputMgr;
    /**
     * 选中单位的轴 (IEditorCode)
     */
    public axisObject: EditorAxisObject;
    /**
     * 编辑器scene窗口ui (IEditorCode)
     */
    public editorSceneUI: EditorSceneUI;
    /**
     * 编辑器场景 (IEditorCode)
     */
    public editorScene: EditorScene;
    /**
     * 编辑器资源管理对象 (IEditorCode)
     */
    public editorResources: EditorResources;
    /**
     * 编辑器选中项管理器 (IEditorCode)
     */
    public selection: EditorSelection;

    /**
     * 工程名称
     */
    public projectName: string = "projectName";

    /**
     * 服务器资源路径
     */
    public get serverResourcesUrl() {
        return EditorApplication.fileServerUrl + "UserProjects/test/" + this.projectName + "/Contents/";
    }

    private constructor() {
        if (!window["m4m"]["editor"]) {
            window["m4m"]["editor"] = {};
        }
        window["m4m"]["editor"].EditorApplication = EditorApplication;
        window["m4m"]["editor"].EditorInputMgr = EditorInputMgr;
        window["m4m"]["editor"].EditorEventMgr = EditorEventMgr;
        window["m4m"]["editor"].WebsocketTool = WebsocketTool;
        window["m4m"]["editor"].ExportManager = ExportManager;

        window["testFunc"] = (uiName: string) => {
            PSDUiManager.showUi(uiName, this.editorScene.getCurrentOrigin2DRoot());
        }
    }


    /**
     * 初始化编辑器对象
     * @param owner 挂载的div元素
     * @param peojectName 打开工程名称
     */
    public async Init(owner: HTMLDivElement, peojectName: string) {
        if (EditorApplication._init) {
            return;
        }
        ExportNameList.Instance.init();
        CreateUINodeManager.Instance.init();
        GPTApiHandler.init();

        this.projectName = peojectName;
        EditorApplication._init = true;
        this.engineApp = new m4m.framework.application();
        this.element = owner;
        //关闭 guid 依赖
        m4m.framework.assetMgr.openGuid = false;
        this.engineApp.bePlay = true;
        this.engineApp.edModel = true;

        let tempPixel = 1280;
        let devicePixelRatio = window.devicePixelRatio || 1; //处理 硬件像素比例的影响
        let val = tempPixel / devicePixelRatio;
        this.engineApp.start(owner, m4m.framework.CanvasFixedType.FixedHeightType, val);
        owner.style.height = "100%";

        //scene窗口场景
        //this.scene = this.engineApp.getScene();
        this.assetMgr = this.engineApp.getAssetMgr();
        this.inputMgr = this.engineApp.getInputMgr();

        this.editorScene = new EditorScene();
        this.editorInputMgr = EditorInputMgr.Instance;
        this.editorSceneUI = new EditorSceneUI();
        this.axisObject = new EditorAxisObject();
        this.editorResources = new EditorResources();
        this.selection = new EditorSelection();

        EditorComponentMgr.initComponent();

        //return;
        //初始化资源
        await this.editorResources.initDefaultResources();

        this.engineApp.addEditorCodeDirect(this);

        //初始化EditorInputMgr
        this.engineApp.addEditorCodeDirect(this.editorInputMgr);
        this.engineApp.addEditorCodeDirect(this.editorResources);
        //
        this.engineApp.addEditorCodeDirect(this.selection);

        //创建选中轴
        this.engineApp.addEditorCodeDirect(this.axisObject);

        this.engineApp.addEditorCodeDirect(this.editorScene);

        //创建基础物体
        // this.createPrimitive(PrimitiveType.Plane, new m4m.math.vector3(4, 4, 4));
        // let obj = this.createPrimitive(PrimitiveType.Cube);
        // let angle = obj.localEulerAngles;
        // angle.z = 30;
        // obj.localEulerAngles = angle;

        // 初始化网格
        // var egl = new EditorGridLine(this.editorRootTrans, this.scene);
        // egl.init();

        //初始化相机, 看向原点
        let objCam = new m4m.framework.transform();
        this.editorScene.addEditorTrans(objCam);
        this.editorCamera = objCam.gameObject.addComponentDirect(new EditorSceneCamera()) as EditorSceneCamera;
        //this.editorCamera.isEditorCam = true;
        this.editorCamera.near = 0.01;
        this.editorCamera.far = 100000;
        this.editorCamera.fov = Math.PI * 0.3;
        //this.editorCamera.opvalue = 0.5;
        this.editorCamera.size = 2.5;
        this.editorCamera.opvalue = 1;
        this.editorCamera.CullingMask = m4m.framework.CullingMask.everything;
        this.editorScene.scene.update(0);
        objCam.name = "editorCamera";
        objCam.localTranslate = new vector3(0, 0, -50);

        //初始化引擎ui
        this.engineApp.addEditorCodeDirect(this.editorSceneUI);

        //下载用户脚本代码
        this.editorResources.reloadUserCode("Code/Lib/node_modules/@types/code.js");


        global["testCall"] = ExportManager.test;
        global["testCall0"] = ExportManager.test2;
        global["testCall2"] = ExportManager.getPrefab2DByKey;
        global["testCall3"] = async () => {
            console.log("测试调用合并工具进行合并操作");
            this.editorResources.texturePackerByKeys(
                [
                    "59e5665d412948b184498f88fcd371c1",
                    "c0bd3c0f785f484083e57c76d52c58f8",
                ]
                , (result) => {
                    for (const item of result) {
                        console.log("item: ", item)
                        ExportManager.uploadFile("atlas/test.atlas", m4m.io.converter.StringToUtf8Array(item.atlas));
                        ExportManager.uploadFile("atlas/test.png", item.buffer);
                    }
                });
        }
        global["testCall4"] = async () => {
            console.log("测试获取atlas sprite");
            EditorApplication.Instance.editorResources.getSpriteReference({
                key: "8d8aeeac0422419484f7c04f31694b51",
                guid: "ee8c5345676147ad96b8f7234490c5b2",
            }, false, sp => {
                console.log('sp! ', sp);
            });
        }
        global["testCall5"] = (key: string, fileName: string) => {
            console.log("序列化prefab");
            ExportManager.export2dPrefab(key, fileName, this.editorScene.canvasRenderer.canvas.getRoot());
        }
        global["testCall6"] = (key: string) => {
            console.log("反序列化prefab");
            ExportManager.getPrefab2DByKey(key, this.editorScene.canvasRenderer.canvas.getRoot());
        }
        global["testCall7"] = () => {
            WebsocketTool.Instance.ProjectManager_createNavFile(
                "5c61ecd94d6840ab86f08673b02ab220",
                [
                    "aeeef2858f9b4499bbe0eab5959e1a2c",
                    "eda1edf425cd40b99332a4dd040b805c",
                    "c7d40781c25944f6899ecec3a590139c",
                    "6dcaa42cfc2649048f2512eee0ce8f31",
                    "9c7ce1aef81c4d478fe930a35ccf99cb",
                    "8d0680eee9c14464ba9979bb5b34bf1d",
                    "78216848264544da89d4e09359c8b195",
                    "5035fb13d25e4cf28538a1548c5c8ccd",
                    "0962c7c62bef46f78abd8899bfea606c",
                    "aa7c729f223c469387efe370037d0493",
                    "31d82a89f5fd4411906990e403608807",
                    "5b75adf78362480c812633a512fbc14c",
                    "d8a40cecdfd74fdabeafb894d33b2360",
                    "f23b56c42fe24f23ae14b2b4f6d8d3a2",
                    "cc43971b01dd407dbc36993ae8006e36",
                    "1e22c3d3e1874c60b1b7db3bf115c915",
                    "97549534e88944dd9e7c1447e98ea51a",
                    "b882b1a61466496e956e539c28c1a38d",
                    "a2ae3f54756d4ff4a00cb01ebacecb40",
                    "6424f7959bfc4cf5ba4821812a656a6e",
                    "4c40d099040a45f5825f91d8fcf3e3d9",
                    "e6c4724418c145f29982001368683374",
                    "e0c228a13a0c4088844b5a01eb3ef72b",
                    "3e311208a0704698b43a42b34cb9955a",
                    "47d79e905b2f452ebdc92a9ce6e955c1",
                    "990d5b0a335842979cf98ac8621362a6",
                ]);
        }
        testReadTool.init();
        
        //编辑器加载完成
        EditorEventMgr.Instance.emitEvent("OnEditorLoadFinish", cb => cb());
    }

    public onStart(app: m4m.framework.application) {

    }

    public onUpdate(delta: number) {

    }

    public isClosed(): boolean {
        return false;
    }

    private setPlay(v: boolean) {
        if (this._isPlay == v) {
            return;
        }
        this._isPlay = v;
        if (!v && this._isPause) {
            this._isPause = false;
            EditorEventMgr.Instance.emitEvent("OnPause", cb => cb(false));
        }
        if (v) {
            this.onPlayFunc();
        } else {
            this.onStopFunc();
        }
        EditorEventMgr.Instance.emitEvent("OnPlay", cb => cb(v));
    }

    private setPause(v: boolean) {
        if (this._isPause == v || !this._isPlay) {
            return;
        }
        this._isPause = v;
        if (v) {
            this.onPauseFunc();
        } else {
            this.onContinueFunc();
        }
        EditorEventMgr.Instance.emitEvent("OnPause", cb => cb(v));
    }

    private onPlayFunc() {
        this.selection.setActiveTrans(null);

        //隐藏编辑器组件
        this.editorScene.scene.removeChild(this.editorScene.editorRootTrans);
        this.editorScene.scene.removeChild(this.editorScene.sceneRootTrans);
        this.editorScene.scene.removeChild(this.editorScene.previewRootTrans);
        //this.editorScene.scene.getRoot().removeAllChild(true);
        //
        let originCanvasRenderer = this.editorScene.canvasRenderer;


        let rootTrans = this.editorScene.sceneRootTrans;
        let root = this.editorScene.getCurrentRoot();
        for (let child of rootTrans.children) {
            root.addChild(child.clone());
        }

        //相机
        let camera = this.editorScene.findMainCamera(root);
        if (camera) {
            camera.gameObject.visible = true;
            this.editorScene.scene.addCamera(camera);
            this.editorScene.scene.mainCamera = camera;
        }
        //ui处理
        if (originCanvasRenderer) {
            let canvasRenderer = this.editorScene.findCanvasRenderer(root);
            if (canvasRenderer) {
                if (camera) {
                    let overlay2D = new m4m.framework.overlay2D();
                    camera.addOverLay(overlay2D);
                    this.editorScene.scene.update(0);

                    let root = canvasRenderer.canvas.getRoot();
                    let children = [...root.children];
                    let originChildren = originCanvasRenderer.canvas.getRoot().children;

                    //移动到 canvas 下
                    for (let i = 0; i < children.length; i++) {
                        let child = children[i];
                        root.removeChild(child);
                        overlay2D.addChild(child);
                    }
                    //设置坐标
                    const setTransPos = (transLis1: transform2D[], transList2: transform2D[]) => {
                        for (let i = 0; i < transList2.length; i++) {
                            let child = transList2[i];
                            let originChild = transLis1[i];
                            m4m.math.vec2Clone(originChild.localTranslate, child.localTranslate);
                            child.markDirty();

                            let ch = child.children;
                            if (ch && ch.length > 0) {
                                setTransPos(originChild.children, ch);
                            }
                        }
                    }
                    setTransPos(originChildren, children);

                    canvasRenderer.gameObject.transform.dispose();
                }
            }
        }

        //场景脚本
        if (this.editorScene.currUserSceneClass) {
            this.editorScene.currUserSceneInst = new this.editorScene.currUserSceneClass();
            this.editorScene.currUserSceneInst.start(this.engineApp, root, this.editorScene.getCurrent2DRoot());
        } else {
            this.editorScene.currUserSceneInst = null;
        }
    }

    private onStopFunc() {
        this.selection.setActiveTrans(null);

        let instance = m4m.framework.NavMeshLoadManager.Instance;
        if (instance.navTrans && !instance.navTrans.beDispose) {
            instance.navTrans.dispose();
            instance.navTrans = null;
        }

        if (m4m.framework.physics) {
            m4m.framework.physics.dispose();
            m4m.framework.physics = null;
        }

        //场景脚本
        if (this.editorScene.currUserSceneInst) {
            this.editorScene.currUserSceneInst.close();
            this.editorScene.currUserSceneInst = null;
        }

        //销毁所有子节点
        var cameras = this.editorScene.scene.getRoot().gameObject.getComponentsInChildren("camera") as camera[];
        for (let cam of cameras) {
            let overLays = cam.getOverLays();
            for (const overLay of overLays) {
                if (overLay instanceof overlay2D) {
                    if (!overLay.disposed) {
                        overLay.dispose();
                    }
                }
            }
        }
        let root = this.editorScene.scene.getRoot();
        root.removeAllChild(true);
        //清除所有相机
        this.editorScene.scene.clearCameras();

        //临时处理, 移除所有事件
        (this.inputMgr as any).eventer.RemoveListenerAll();

        //显示编辑器组件
        this.editorScene.scene.addChild(this.editorScene.editorRootTrans);
        this.editorScene.scene.addChild(this.editorScene.sceneRootTrans);
        this.editorScene.scene.addChild(this.editorScene.previewRootTrans);

        this.editorScene.scene.addCamera(this.editorCamera);
        this.editorScene.scene.addCamera(this.editorSceneUI.axisCamera);
        this.editorScene.scene.mainCamera = this.editorCamera;
    }

    private onPauseFunc() {

    }

    private onContinueFunc() {

    }

    //-------------------------------------------------------------------------------
    //----------------------------------- old ---------------------------------------
    //-------------------------------------------------------------------------------

    public static onInstanceInit: () => void;

    private sceneGrid: EditorGridLine = null;

    public PointInEditorCamera(point: number): boolean {
        return (this.editorScene.scene && this.editorCamera) && point / this.editorScene.scene.app.width <= this.editorCamera.viewport.w;
    }

    public AddEditorObjToScene(trans: any) {
        this.editorScene.scene.addChild(trans);
    }
}

export enum EditorType {
    Editor,
    PlayDebug
}