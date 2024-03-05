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
import { AxisObject } from "./AxisObject";

export class DebugTool
{
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    axisObj: AxisObject;
    //mouseUICtr: UIMouseCTR;
    //cameraEdit: CameraEdit;
    clickFunc: Function;
    rootEle: HTMLElement;
    type: EditorType;

    private PointDownMap:{[button:number]:boolean} = {};
    get pointLeftDown(){return this.PointDownMap[0];}
    get pointMiddleDown(){return this.PointDownMap[1];}
    get pointRightDown(){return this.PointDownMap[2];}

    public get debugMode(){return this._debugMode;}
    private _debugMode: DebugModel = DebugModel.null;

    get cursor(){return this._cursor;};
    private _cursor = "";
    setDebugModel(_model: number)
    {
        if (this.debugMode == _model) return;
        this._debugMode = _model;
        this._cursor = this.app.container.style.cursor= "";
        if(_model == DebugModel.view){
            //this.axisObj.target = this.mouseUICtr.target =null;
            this.axisObj.target = null;
            this._cursor = this.app.container.style.cursor = "pointer";  //手形
        }
        this.axisObj.DebugModelChange(_model);
    }

    constructor(rootEle: HTMLElement = null, clickFunc: Function = null)
    {

        this.PointDownMap[0] = this.PointDownMap[1] = this.PointDownMap[2] = false;

        this.clickFunc = clickFunc;

        this.app = m4m.framework.sceneMgr.app;

        this.rootEle = rootEle || this.app.container;

        this.scene = this.app.getScene();

        this.axisObj = new AxisObject(EditorType.Editor, this.app, this);
        //if (this.type == EditorType.Editor)
        //this.mouseUICtr = new UIMouseCTR(this.app, this);

        //this.cameraEdit = new CameraEdit(EditorType.Editor, this.app, this.screenSplit, this);
        this.type = EditorType.Editor;

        this.attachControll(this.rootEle);

        //
        //ApplicationMgr.onCanvascontainerChange = this.onCanvcontainerChange.bind(this);
        this.setDebugModel(DebugModel.translate);
    }

    private last_3d_Z = 0;
    private last_2d_Z = 0;
    //io 操作
    private attachControll(ele:HTMLElement){
        let app = this.app;
        let getPe = function(e){
            let rect = ele.getBoundingClientRect();
            let dpr = window.devicePixelRatio;
            return { x: dpr * (e.clientX - rect.left) / app.scaleFromPandding, y: dpr * (e.clientY - rect.top) / app.scaleFromPandding, button: e.button ,type:e.type};
        }

        ele.addEventListener("mousedown", (e) =>
        {
            if(!this.ckPointInEditorView(e)) return;
            this.PointDownMap[e.button] = true;
            let tempe = getPe(e);
            //this.last_2d_Z =this.mouseUICtr.pointDownEvent(tempe);
            this.last_3d_Z =this.axisObj.pointDownEvent(tempe);
        });
        ele.addEventListener("mouseup", (e) =>
        {
            if(!this.ckPointInEditorView(e)) return;
            this.PointDownMap[e.button] = false;
            let tempe = getPe(e);
            if(this.last_3d_Z > this.last_2d_Z){
                //this.mouseUICtr.pointUpEvent(tempe);
                this.axisObj.pointUpEvent(tempe);
            }else{
                this.axisObj.pointUpEvent(tempe);
                //this.mouseUICtr.pointUpEvent(tempe);
            }
        });
        ele.addEventListener("mousemove", (e) =>
        {
            if(!this.ckPointInEditorView(e)) return;
            let tempe = getPe(e);

            //this.mouseUICtr.pointHoldEvent(tempe);
            this.axisObj.pointHoldEvent(tempe);
        });
        ele.addEventListener("keydown", (e) =>
        {
            this.keyDownEvent(e);
        });
    }

    private ckPointInEditorView(e){
        if(!EditorApplication.Instance.editorCamera)return false;
        let rect = EditorApplication.Instance.editorCamera.viewport;
        let _h = this.app.canvasClientHeight;
        let _w = this.app.canvasClientWidth;
        if(e.x < rect.x * _w || e.x > (rect.x + rect.w) * _w) return false;
        if(e.y < rect.y * _h || e.y > (rect.y + rect.h) * _w) return false;
        return true;
    }

    private keyDownEvent(e: KeyboardEvent)
    {
        if (this.pointLeftDown ||this.pointRightDown) return;
        switch (e.keyCode)
        {
            case m4m.framework.NumberUtil.KEY_Q:
                //ApplicationMgr.DebugmodeBarUIChange(DebugModel.view);
                this.setDebugModel(DebugModel.view);
                break;
            case m4m.framework.NumberUtil.KEY_W:
                //ApplicationMgr.DebugmodeBarUIChange(DebugModel.translate);
                this.setDebugModel(DebugModel.translate);
                break;
            case m4m.framework.NumberUtil.KEY_E:
                //ApplicationMgr.DebugmodeBarUIChange(DebugModel.rotation);
                this.setDebugModel(DebugModel.rotation);
                break;
            case m4m.framework.NumberUtil.KEY_R:
                //ApplicationMgr.DebugmodeBarUIChange(DebugModel.scale);
                this.setDebugModel(DebugModel.scale);
                break;
        }
    }

    // private onCanvcontainerChange(){
    //     if(!this.mouseUICtr) return;
    //     this.mouseUICtr.adjustOnCanvascontainerChang();
    // }

    update(delta: number)
    {
        this.axisObj.update(delta);
        // if (this.mouseUICtr)
        //     this.mouseUICtr.update(delta);
        // this.cameraEdit.update();
    }
}

export enum DebugModel
{
    null,
    view,
    translate,
    rotation,
    scale
}

