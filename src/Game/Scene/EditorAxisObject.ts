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
import {EditorApplication} from "../EditorApplication";
import {EditorInputMgr} from "../Input/EditorInputMgr";
import {EditorObjectTags} from "../EditorObjectTags";
import {EditorEventMgr} from "../Event/EditorEventMgr";
import {SceneCameraOpvalueType} from "./EditorSceneCamera";
import {Utils} from "../Utils";
import vector4 = m4m.math.vector4;
import vector3 = m4m.math.vector3;
import quaternion = m4m.math.quaternion;
import transform = m4m.framework.transform;
import TransformUtil = m4m.framework.TransformUtil;
import material = m4m.framework.material;
import pickinfo = m4m.framework.pickinfo;
import vector2 = m4m.math.vector2;
import ray = m4m.framework.ray;
import transform2D = m4m.framework.transform2D;
import color = m4m.math.color;
import layoutOption = m4m.framework.layoutOption;

//轴方向
export enum AxisDirection {
    none = "none",
    x = "x",
    y = "y",
    z = "z",
}

//显示轴类型
export enum AxisType {
    drag = 0,
    move = 1,
    rotate = 2,
    scale = 3,
}

//轴对象
export class EditorAxisObject implements m4m.framework.IEditorCode {

    //------------------ 3d -----------------------
    /** 全局缩放 */
    public globalScale: number = 1.5;
    /** 轴根节点 */
    public axisRoot = new transform();
    /** 活动的轴 */
    public activeAxis: AxisDirection = AxisDirection.none;

    private pickInfo = new m4m.framework.pickinfo(0, 0, 0);
    //鼠标碰撞的轴
    private collAxis: AxisDirection = AxisDirection.none;
    //各方向的轴对象
    private moveAxisMap: AxisMap = {};
    //移动版对象
    private movePanelMap: AxisMap = {};
    //旋转轴
    private rotateAxisMap: AxisMap = {};
    //缩放轴
    private scaleAxisMap: AxisMap = {};
    //默认透明度
    private defaultAxisAlpha = 1;
    //默认轴缩放
    private defaultAxisScale = new vector3(0.1, 1, 0.1);
    //选中时轴缩放
    private defaultSelectAxisScale = new vector3(0.12, 1, 0.12);
    //默认轴颜色
    private defaultAxisColor = {
        "x": new vector4(1, 0, 0, 1),
        "y": new vector4(0, 1, 0, 1),
        "z": new vector4(0, 0, 1, 1),
        //选中时
        "select": new vector4(1, 1, 0, 1),
        //未被选中
        "unSelect": new vector4(0.5, 0.5, 0.5, 1),
    };
    //---------------------------------------------

    //------------------ 2d -----------------------
    //2d轴
    //private axis2DRoot = new transform();

    //---------------------------------------------

    /** 当前显示的轴类型 */
    public get currAxisType() {
        return this._currAxisType;
    };
    public set currAxisType(value: AxisType) {
        this.refreshAxisType(value);
    }
    private _currAxisType: AxisType = null;

    //拖拽时保存的初始数据
    private startDragData = {
        transform: <transform | transform2D>null,
        /** 起始坐标 */
        position: new vector3(),
        /** 起始世界坐标 */
        worldPosition: new vector3(),
        worldMatrix: new m4m.math.matrix(),
        /** 起始缩放 */
        scale: new vector3(),
        /** 起始旋转 */
        rotate: new quaternion(),
        /** 鼠标起始坐标 */
        mousePosition: new vector3(),
        //------------- 旋转 -----------
        /** 鼠标在场景中的起始坐标 */
        mousePosInScreen: new vector2(),
        //
        contrastDir: new vector2(),
    };

    //------------------------------

    isClosed(): boolean {
        return false;
    }

    onStart(app: m4m.framework.application): any {
        //this.inputMgr = EditorApplication.Instance.engineApp.getInputMgr();
        let ea = EditorApplication.Instance;

        this.axisRoot.name = "editorAxisRoot";
        ea.editorScene.addEditorTrans(this.axisRoot);
        //this.axisRoot.gameObject.layer = 4; //CullingMask.editor

        // this.axis2DRoot.name = "editorAxis2DRoot";
        // ea.editorScene.addEditorTrans(this.axis2DRoot);
        //this.axisRoot.gameObject.layer = 4; //CullingMask.editor

        //移动轴
        let xAxis = this.createMoveAxis(AxisDirection.x);
        xAxis.body.localEulerAngles = new vector3(0, 0, -90);
        m4m.math.vec3Set(xAxis.body.localTranslate, 1, 0, 0);
        this.axisRoot.addChild(xAxis.body);

        let yAxis = this.createMoveAxis(AxisDirection.y);
        yAxis.body.localEulerAngles = new vector3(0, 0, 0);
        m4m.math.vec3Set(yAxis.body.localTranslate, 0, 1, 0);
        this.axisRoot.addChild(yAxis.body);

        let zAxis = this.createMoveAxis(AxisDirection.z);
        zAxis.body.localEulerAngles = new vector3(90, 0, 0);
        m4m.math.vec3Set(zAxis.body.localTranslate, 0, 0, 1);
        this.axisRoot.addChild(zAxis.body);

        //移动面板
        // let xPanel = this.createMovePanel(AxisDirection.x);
        // xPanel.body.localEulerAngles = new vector3(0, 0, 90);
        // this.axisRoot.addChild(xPanel.body);
        //
        // let yPanel = this.createMovePanel(AxisDirection.y);
        // this.axisRoot.addChild(yPanel.body);
        //
        // let zPanel = this.createMovePanel(AxisDirection.z);
        // zPanel.body.localEulerAngles = new vector3(90, 0, 0);
        // this.axisRoot.addChild(zPanel.body);

        //旋转轴
        let xAngle = this.createRotateAxis(AxisDirection.x);
        xAngle.body.localEulerAngles = new vector3(0, 0, 90);
        this.axisRoot.addChild(xAngle.body);

        let yAngle = this.createRotateAxis(AxisDirection.y);
        yAngle.body.localEulerAngles = new vector3(0, 0, 180);
        this.axisRoot.addChild(yAngle.body);

        let zAngle = this.createRotateAxis(AxisDirection.z);
        zAngle.body.localEulerAngles = new vector3(90, 0, 0);
        this.axisRoot.addChild(zAngle.body);

        //缩放轴
        let xScale = this.createScaleAxis(AxisDirection.x);
        xScale.body.localEulerAngles = new vector3(0, 0, -90);
        m4m.math.vec3Set(xScale.body.localTranslate, 1, 0, 0);
        this.axisRoot.addChild(xScale.body);

        let yScale = this.createScaleAxis(AxisDirection.y);
        yScale.body.localEulerAngles = new vector3(0, 0, 0);
        m4m.math.vec3Set(yScale.body.localTranslate, 0, 1, 0);
        this.axisRoot.addChild(yScale.body);

        let zScale = this.createScaleAxis(AxisDirection.z);
        zScale.body.localEulerAngles = new vector3(90, 0, 0);
        m4m.math.vec3Set(zScale.body.localTranslate, 0, 0, 1);
        this.axisRoot.addChild(zScale.body);

        //将轴类型改为移动
        this.currAxisType = AxisType.move;

        //点击屏幕发射射线
        EditorInputMgr.Instance.addEventListener("TouchClick", this.onTouchDownFunc.bind(this));

        EditorEventMgr.Instance.addEventListener("SetActiveObject", (trans) => {
            let selection = ea.selection;
            selection.setActiveTrans(trans);
            if (EditorApplication.Instance.isPlay) {
                return;
            }
            this.refreshAxisTrans(true);
        })
    }


    onUpdate(delta: number): any {

        if (EditorApplication.Instance.isPlay) {
            return;
        }
        
        //临时调用
        let ea = EditorApplication.Instance;
        if (ea.engineApp.getInputMgr().GetKeyDown(m4m.event.KeyCode.Numpad1)) {
            this.currAxisType = AxisType.move;
        } else if (ea.engineApp.getInputMgr().GetKeyDown(m4m.event.KeyCode.Numpad2)) {
            this.currAxisType = AxisType.rotate;
        } else if (ea.engineApp.getInputMgr().GetKeyDown(m4m.event.KeyCode.Numpad3)) {
            this.currAxisType = AxisType.scale;
        }

        //是否点击
        let inputMgr = ea.editorInputMgr;
        let isPressed = inputMgr.isTouching();

        let trans = ea.selection.activeTransform;
        if (trans != null) { //存在选中的物体

            let is2D = trans instanceof transform2D;

            //显示轴
            this.axisRoot.gameObject.visible = !is2D || ea.editorCamera.opvalueType == SceneCameraOpvalueType.Ui;
            //this.axis2DRoot.gameObject.visible = is2D;

            //轴缩放, 使其在屏幕上大小不变
            if (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Normal) {
                let distance = m4m.math.vec3Distance(this.axisRoot.getWorldTranslate(), ea.editorCamera.gameObject.transform.getWorldTranslate());
                this.axisRoot.localScale.x = distance * 0.05 * this.globalScale;
                this.axisRoot.localScale.y = distance * 0.05 * this.globalScale;
                this.axisRoot.localScale.z = distance * 0.05 * this.globalScale;
            } else {
                let size = ea.editorCamera.size;
                this.axisRoot.localScale.x = size * 0.05 * this.globalScale;
                this.axisRoot.localScale.y = size * 0.05 * this.globalScale;
                this.axisRoot.localScale.z = size * 0.05 * this.globalScale;
            }

            //当前轴类型
            if (this.currAxisType == AxisType.move) { //移动轴

                this.moveAxisMap["z"].body.gameObject.visible = (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Normal && !is2D);

                //射线检测
                if (this.activeAxis == AxisDirection.none) {
                    let ray = this.createRay();
                    //面板检测

                    //轴检测
                    if (ray.intersectCollider(this.moveAxisMap["x"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.x;
                        this.refreshAxisState(this.moveAxisMap);
                    } else if (ray.intersectCollider(this.moveAxisMap["y"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.y;
                        this.refreshAxisState(this.moveAxisMap);
                    } else if (ray.intersectCollider(this.moveAxisMap["z"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.z;
                        this.refreshAxisState(this.moveAxisMap);
                    } else if (this.collAxis != AxisDirection.none) {
                        this.collAxis = AxisDirection.none;
                        this.refreshAxisState(this.moveAxisMap);
                    }
                }
                //点击轴
                if (isPressed && this.collAxis != AxisDirection.none) {
                    if (this.activeAxis == AxisDirection.none && inputMgr.isTouchPressed()) {
                        this.activeAxis = this.collAxis;

                        for (const key in this.moveAxisMap) {
                            if (key == this.activeAxis) {
                                this.setAxisColor(this.moveAxisMap[key], this.defaultAxisColor.select)
                            } else {
                                this.setAxisColor(this.moveAxisMap[key], this.defaultAxisColor.unSelect);
                            }
                        }
                        this.dragDownAxis(this.pickInfo);
                    }
                } else if (!isPressed) {
                    if (this.activeAxis != AxisDirection.none) {
                        this.activeAxis = AxisDirection.none;

                        for (const key in this.moveAxisMap) {
                            this.setAxisColor(this.moveAxisMap[key], this.defaultAxisColor[key]);
                        }
                        this.dragUpAxis();
                    }
                }
            } else if (this.currAxisType == AxisType.rotate) { //旋转轴

                this.rotateAxisMap["z"].body.gameObject.visible = (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Normal && !is2D);

                //射线检测
                if (this.activeAxis == AxisDirection.none) {
                    let ray = this.createRay();
                    //面板检测

                    //轴检测
                    if (ray.intersectCollider(this.rotateAxisMap["x"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.x;
                        this.refreshAxisState(this.rotateAxisMap);
                    } else if (ray.intersectCollider(this.rotateAxisMap["y"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.y;
                        this.refreshAxisState(this.rotateAxisMap);
                    } else if (ray.intersectCollider(this.rotateAxisMap["z"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.z;
                        this.refreshAxisState(this.rotateAxisMap);
                    } else if (this.collAxis != AxisDirection.none) {
                        this.collAxis = AxisDirection.none;
                        this.refreshAxisState(this.rotateAxisMap);
                    }
                }
                //点击轴
                if (isPressed && this.collAxis != AxisDirection.none) {
                    if (this.activeAxis == AxisDirection.none && inputMgr.isTouchPressed()) {
                        this.activeAxis = this.collAxis;

                        for (const key in this.rotateAxisMap) {
                            if (key == this.activeAxis) {
                                this.setAxisColor(this.rotateAxisMap[key], this.defaultAxisColor.select)
                            } else {
                                this.setAxisColor(this.rotateAxisMap[key], this.defaultAxisColor.unSelect);
                            }
                        }
                        this.dragDownAxis(this.pickInfo);
                    }
                } else if (!isPressed) {
                    if (this.activeAxis != AxisDirection.none) {
                        this.activeAxis = AxisDirection.none;

                        for (const key in this.rotateAxisMap) {
                            this.setAxisColor(this.rotateAxisMap[key], this.defaultAxisColor[key]);
                        }
                        this.dragUpAxis();
                    }
                }
            } else if (this.currAxisType == AxisType.scale) { //缩放轴

                this.scaleAxisMap["z"].body.gameObject.visible = (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Normal && !is2D);

                //射线检测
                if (this.activeAxis == AxisDirection.none) {
                    let ray = this.createRay();
                    //轴检测
                    if (ray.intersectCollider(this.scaleAxisMap["x"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.x;
                        this.refreshAxisState(this.scaleAxisMap);
                    } else if (ray.intersectCollider(this.scaleAxisMap["y"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.y;
                        this.refreshAxisState(this.scaleAxisMap);
                    } else if (ray.intersectCollider(this.scaleAxisMap["z"].body, this.pickInfo)) {
                        this.collAxis = AxisDirection.z;
                        this.refreshAxisState(this.scaleAxisMap);
                    } else if (this.collAxis != AxisDirection.none) {
                        this.collAxis = AxisDirection.none;
                        this.refreshAxisState(this.scaleAxisMap);
                    }
                }
                //点击轴
                if (isPressed && this.collAxis != AxisDirection.none) {
                    if (this.activeAxis == AxisDirection.none && inputMgr.isTouchPressed()) {
                        this.activeAxis = this.collAxis;

                        for (const key in this.scaleAxisMap) {
                            if (key == this.activeAxis) {
                                this.setAxisColor(this.scaleAxisMap[key], this.defaultAxisColor.select)
                            } else {
                                this.setAxisColor(this.scaleAxisMap[key], this.defaultAxisColor.unSelect);
                            }
                        }
                        this.dragDownAxis(this.pickInfo);
                    }
                } else if (!isPressed) {
                    if (this.activeAxis != AxisDirection.none) {
                        this.activeAxis = AxisDirection.none;

                        for (const key in this.scaleAxisMap) {
                            this.setAxisColor(this.scaleAxisMap[key], this.defaultAxisColor[key]);
                        }
                        this.dragUpAxis();
                    }
                }
            }

            //拖动轴
            if (isPressed && this.activeAxis != AxisDirection.none) {
                this.dragAxis(this.pickInfo);
            }

            //刷新轴消息
            this.refreshAxisTrans(false);

        } else { //不存在选中的物体
            this.axisRoot.gameObject.visible = false;
            //this.axis2DRoot.gameObject.visible = false;
        }
    }

    //刷新轴的trans信息
    private refreshAxisTrans(init: boolean) {
        let selection = EditorApplication.Instance.selection;
        if (selection.activeTransform) {

            let trans = selection.activeTransform;
            if (trans instanceof transform) {
                //更新轴位置信息
                let rootPos = trans.getWorldTranslate();
                this.axisRoot.setWorldPosition(rootPos);
                if (EditorApplication.Instance.editorCamera.opvalueType == SceneCameraOpvalueType.Normal) {
                    this.axisRoot.setWorldRotate(trans.getWorldRotate());
                } else {
                    this.axisRoot.setWorldRotate(new quaternion());
                }
            } else {
                let matrix = trans.getCanvasWorldMatrix();
                let cr = EditorApplication.Instance.editorScene.canvasRenderer;

                let center = new vector2((0.5 - trans.pivot.x) * trans.width, (0.5 - trans.pivot.y) * trans.height);
                let pos = new vector3();

                m4m.math.matrix3x2TransformVector2(matrix, center, center);
                cr.calCanvasPosToWorldPos(center, pos);

                if (init) {
                    // let startPos = new vector3();
                    // let endPos = new vector3();
                    // let uiStart = new vector2(-3, -3);
                    // let uiEnd = new vector2(trans.width + 3, trans.height + 3);
                    // m4m.math.matrix3x2TransformVector2(matrix, uiStart, uiStart);
                    // cr.calCanvasPosToWorldPos(uiStart, startPos);
                    // m4m.math.matrix3x2TransformVector2(matrix, uiEnd, uiEnd);
                    // cr.calCanvasPosToWorldPos(uiEnd, endPos);

                    // Utils.drawLine(
                    //     this.axis2DRoot,
                    //     [
                    //         new vector3(startPos.x, startPos.y, startPos.z),
                    //         new vector3(endPos.x, startPos.y, startPos.z),
                    //         new vector3(endPos.x, endPos.y, startPos.z),
                    //         new vector3(startPos.x, endPos.y, startPos.z),
                    //         new vector3(startPos.x, startPos.y, startPos.z),
                    //     ],
                    //     new color(1, 0, 0, 1)
                    // );
                }
                this.axisRoot.setWorldPosition(pos);
                if (EditorApplication.Instance.editorCamera.opvalueType == SceneCameraOpvalueType.Normal) {
                    this.axisRoot.setWorldRotate(cr.gameObject.transform.getWorldRotate());
                } else {
                    this.axisRoot.setWorldRotate(new quaternion());
                }
            }
        }
    }

    //碰撞到的tran2D列表
    private trans2dList: transform2D[] = [];
    
    //左键点击
    private onTouchDownFunc() {
        if (EditorApplication.Instance.isPlay) {
            return;
        }
        let ea = EditorApplication.Instance;
        let inputMgr = EditorInputMgr.Instance;

        let touchPos = inputMgr.getTouchPosition();
        //如果碰到编辑器ui, 就直接跳过
        if (ea.editorSceneUI.overlay2D.pick2d(touchPos.x, touchPos.y) != null) {
            return;
        }

        //射线加测
        let ray = this.createRay();
        
        let tempinfos: pickinfo[] = [];
        let bool = ea.editorScene.scene.pickAll(ray, tempinfos, true, ea.editorScene.getCurrentRoot());

        let selection = ea.selection;
        if (!bool) {
            //与canvas下的子物体碰撞
            let renderer = ea.editorScene.canvasRenderer;
            let tempTrans2dList = renderer.pickAll2d(ray);
            if (tempTrans2dList[tempTrans2dList.length - 1] == renderer.canvas.getRoot()) {
                tempTrans2dList.pop();
            }
            
            if (tempTrans2dList.length > 0) { //点击到ui选择子物体
                for (let i = 0; i < tempTrans2dList.length; i++) {
                    let trans2d = tempTrans2dList[i];
                    if (trans2d.tag == EditorObjectTags.hideInTreeTag) {
                        continue;
                    }
                    if (this.trans2dList.indexOf(trans2d) == -1) {
                        selection.setActiveTrans(trans2d);
                        this.trans2dList.push(trans2d);
                        return;
                    }
                }
                this.trans2dList.length = 0;
                selection.setActiveTrans(tempTrans2dList[0]);
                this.trans2dList.push(tempTrans2dList[0]);
                return;
            } else { //没点到ui

                //是否点到ui
                let collFlag = false;
                //测试与 canvas 碰撞
                let collTrans = ea.editorScene.canvasColliderTrans;
                if (collTrans) {
                    var pf = new m4m.framework.pickinfo();
                    if (ray.intersectCollider(collTrans, pf)) {
                        collFlag = true;
                    }
                }
                selection.setActiveTrans(collFlag ? renderer.gameObject.transform : null);
            }
            
            this.trans2dList.length = 0;
            return;
        }

        //如果有轴, 就直接跳过
        for (const item of tempinfos) {
            if (item.pickedtran.gameObject.tag == EditorObjectTags.editorAxisTag) {
                this.trans2dList.length = 0;
                return;
            }
        }

        //获取最近的碰撞物体
        let pickinfo = this.getUsefulPickinfo(tempinfos);
        if (pickinfo && pickinfo.pickedtran) {
            selection.setActiveTrans(pickinfo.pickedtran);
            this.refreshAxisTrans(true);
        } else {
            selection.setActiveTrans(null);
            this.trans2dList.length = 0;
        }
        this.trans2dList.length = 0;
    }

    //拖拽按下
    private dragDownAxis(pickInfo: pickinfo) {
        let selection = EditorApplication.Instance.selection;
        //保存trans数据
        this.saveTransData(selection.activeTransform);

        //创建射线
        var inputMgr = EditorInputMgr.Instance;
        let ray = this.createRay();

        let trans = this.startDragData.transform;

        if (trans instanceof transform) {
            if (this.currAxisType == AxisType.rotate) { //旋转轴

                m4m.math.vec2Clone(inputMgr.getTouchPosition(), this.startDragData.mousePosInScreen);
                //let matToWorld = trans.getWorldMatrix();
                let matToWorld = this.startDragData.worldMatrix;

                let dirStartInWord = new vector3();
                //m4m.math.vec3Clone(trans.getWorldTranslate(), dirStartInWord);
                m4m.math.vec3Clone(this.startDragData.worldPosition, dirStartInWord);

                let dirEndInWord = new vector3();

                if (this.activeAxis == AxisDirection.x) {
                    m4m.math.matrixTransformVector3(m4m.math.pool.vector3_right, matToWorld, dirEndInWord);
                } else if (this.activeAxis == AxisDirection.y) {
                    m4m.math.matrixTransformVector3(m4m.math.pool.vector3_up, matToWorld, dirEndInWord);
                } else if (this.activeAxis == AxisDirection.z) {
                    m4m.math.matrixTransformVector3(m4m.math.pool.vector3_forward, matToWorld, dirEndInWord);
                }

                let dirStartInScreen = new vector2();
                let dirEndInScreen = new vector2();
                let camera = EditorApplication.Instance.editorCamera;
                if (camera) {
                    camera.calcScreenPosFromWorldPos(EditorApplication.Instance.engineApp, dirStartInWord, dirStartInScreen);
                    camera.calcScreenPosFromWorldPos(EditorApplication.Instance.engineApp, dirEndInWord, dirEndInScreen);
                }
                let temptDir = new vector2();

                m4m.math.vec2Subtract(dirEndInScreen, dirStartInScreen, temptDir);
                m4m.math.vec2Normalize(temptDir, temptDir);

                m4m.math.vec2Set(this.startDragData.contrastDir, -temptDir.y, temptDir.x);
                m4m.math.quatClone(trans.localRotate, this.startDragData.rotate);

            } else { //移动和缩放轴
                let dir = new vector3();

                if (EditorApplication.Instance.editorCamera.opvalueType == SceneCameraOpvalueType.Normal) {
                    if (this.activeAxis == AxisDirection.x) {
                        trans.getRightInWorld(dir)
                    } else if (this.activeAxis == AxisDirection.y) {
                        trans.getUpInWorld(dir);
                    } else if (this.activeAxis == AxisDirection.z) {
                        trans.getForwardInWorld(dir);
                    }
                } else {
                if (this.activeAxis == AxisDirection.x) {
                    dir.x = 1;
                } else if (this.activeAxis == AxisDirection.y) {
                    dir.y = 1;
                    //trans.getUpInWorld(dir);
                }
            }

            let objPos = new vector3();
            m4m.math.vec3Clone(trans.getWorldTranslate(), objPos);

            //记录鼠标起始点
            let finalPos = new vector3();
            let bool = this.intersectionWith2Line(ray.origin, ray.direction, objPos, dir, finalPos);
                if (bool) {
                    m4m.math.vec3Clone(finalPos, this.startDragData.mousePosition);
                }
            }
        } else {
            
        }

    }

    //拖拽松开
    private dragUpAxis() {

    }

    //拖动轴
    private dragAxis(pickInfo: pickinfo) {
        let trans = this.startDragData.transform;
        var inputMgr = EditorInputMgr.Instance;
        if (trans instanceof transform) { //3d轴拖拽
            // canvascontainer 组件不能被拖动
            if (trans.gameObject.getComponent("canvascontainer")) {
                return;//canvascontainer 不能被移动
            }
            //创建射线
            let ray = this.createRay();

            if (this.currAxisType == AxisType.rotate) {
                var endScreenPos = inputMgr.getTouchPosition();
                var moveDir = new vector2();
                m4m.math.vec2Subtract(endScreenPos, this.startDragData.mousePosInScreen, moveDir);

                var contrastValue = m4m.math.vec2Multiply(moveDir, this.startDragData.contrastDir);

                var RotSpeed: number = 0.5;
                var rotAngle = RotSpeed * -contrastValue;

                var localRot = m4m.math.pool.new_quaternion();
                if (this.activeAxis == AxisDirection.x) {
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_right, rotAngle, localRot);
                } else if (this.activeAxis == AxisDirection.y) {
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_up, rotAngle, localRot);
                } else if (this.activeAxis == AxisDirection.z) {
                    m4m.math.quatFromAxisAngle(m4m.math.pool.vector3_forward, rotAngle, localRot);
                }
                m4m.math.quatMultiply(this.startDragData.rotate, localRot, trans.localRotate);
            } else {
                //这里需要更具轴类型做射线判断

                let dir = new vector3();
                if (EditorApplication.Instance.editorCamera.opvalueType == SceneCameraOpvalueType.Normal) {
                    if (this.activeAxis == AxisDirection.x) {
                        trans.getRightInWorld(dir);
                    } else if (this.activeAxis == AxisDirection.y) {
                        trans.getUpInWorld(dir);
                    } else if (this.activeAxis == AxisDirection.z) {
                        trans.getForwardInWorld(dir);
                    }
                } else {
                    if (this.activeAxis == AxisDirection.x) {
                        dir.x = 1;
                    } else if (this.activeAxis == AxisDirection.y) {
                        dir.y = 1;
                    }
                }
                m4m.math.vec3Normalize(dir, dir);

                let ori = new vector3();
                //m4m.math.vec3Clone(trans.getWorldTranslate(), ori);
                m4m.math.vec3Clone(this.startDragData.worldPosition, ori);

                let finalPos = new vector3();
                let bool = this.intersectionWith2Line(ray.origin, ray.direction, ori, dir, finalPos);

                if (bool) {
                    if (this.currAxisType == AxisType.move) {
                        finalPos.x -= this.startDragData.mousePosition.x - this.startDragData.position.x - (this.startDragData.worldPosition.x - this.startDragData.position.x);
                        finalPos.y -= this.startDragData.mousePosition.y - this.startDragData.position.y - (this.startDragData.worldPosition.y - this.startDragData.position.y);
                        finalPos.z -= this.startDragData.mousePosition.z - this.startDragData.position.z - (this.startDragData.worldPosition.z - this.startDragData.position.z);
                        //console.error("----1\ntemp", temp, "\nfinalPos", finalPos, "\nmousePosition", this.startDragData.mousePosition, "\nposition", this.startDragData.position);
                        trans.setWorldPosition(finalPos);
                    } else if (this.currAxisType == AxisType.scale) {
                        if (this.activeAxis == AxisDirection.x) {
                            trans.localScale.x = this.startDragData.scale.x * (finalPos.x - ori.x) / (this.startDragData.mousePosition.x - ori.x);
                        } else if (this.activeAxis == AxisDirection.y) {
                            trans.localScale.y = this.startDragData.scale.y * (finalPos.y - ori.y) / (this.startDragData.mousePosition.y - ori.y);
                        } else if (this.activeAxis == AxisDirection.z) {
                            trans.localScale.z = this.startDragData.scale.z * (finalPos.z - ori.z) / (this.startDragData.mousePosition.z - ori.z);
                        }
                    }
                }
            }
        } else { //拖拽2d轴
            let deltaPosition = EditorApplication.Instance.editorInputMgr.getTouchDeltaPosition();
            if (deltaPosition.x != 0 || deltaPosition.y != 0) {
                if (this.currAxisType == AxisType.move) {
                    let layoutState = trans.layoutState;
                    if (this.activeAxis == AxisDirection.x) { //拖拽x轴
                        let leftFlag = !!(layoutState & layoutOption.LEFT);
                        let centerFlag = !!(layoutState & layoutOption.H_CENTER);
                        let rightFlag = !!(layoutState & layoutOption.RIGHT);
                        if (!leftFlag && !centerFlag && !rightFlag) {
                            let pos = trans.localTranslate;
                            trans.localTranslate = new vector2(pos.x + deltaPosition.x, pos.y);
                            trans.markDirty();
                        } else if (leftFlag && !centerFlag && rightFlag) {
                            trans.setLayoutValue(layoutOption.LEFT, trans.getLayoutValue(layoutOption.LEFT) + deltaPosition.x);
                            trans.setLayoutValue(layoutOption.RIGHT, trans.getLayoutValue(layoutOption.RIGHT) - deltaPosition.x);
                        } else if (centerFlag) {
                            trans.setLayoutValue(layoutOption.H_CENTER, trans.getLayoutValue(layoutOption.H_CENTER) + deltaPosition.x);
                        } else if (leftFlag) {
                            trans.setLayoutValue(layoutOption.LEFT, trans.getLayoutValue(layoutOption.LEFT) + deltaPosition.x);
                        } else if (rightFlag) {
                            trans.setLayoutValue(layoutOption.RIGHT, trans.getLayoutValue(layoutOption.RIGHT) - deltaPosition.x);
                        }

                    } else if (this.activeAxis == AxisDirection.y) { //拖拽y轴
                        let topFlag = !!(layoutState & layoutOption.TOP);
                        let centerFlag = !!(layoutState & layoutOption.V_CENTER);
                        let bottomFlag = !!(layoutState & layoutOption.BOTTOM);
                        if (!topFlag && !centerFlag && !bottomFlag) {
                            let pos = trans.localTranslate;
                            trans.localTranslate = new vector2(pos.x, pos.y + deltaPosition.y);
                            trans.markDirty();
                        } else if (topFlag && !centerFlag && bottomFlag) {
                            trans.setLayoutValue(layoutOption.TOP, trans.getLayoutValue(layoutOption.TOP) + deltaPosition.y);
                            trans.setLayoutValue(layoutOption.BOTTOM, trans.getLayoutValue(layoutOption.BOTTOM) - deltaPosition.y);
                        } else if (centerFlag) {
                            trans.setLayoutValue(layoutOption.V_CENTER, trans.getLayoutValue(layoutOption.V_CENTER) + deltaPosition.y);
                        } else if (topFlag) {
                            trans.setLayoutValue(layoutOption.TOP, trans.getLayoutValue(layoutOption.TOP) + deltaPosition.y);
                        } else if (bottomFlag) {
                            trans.setLayoutValue(layoutOption.BOTTOM, trans.getLayoutValue(layoutOption.BOTTOM) + deltaPosition.y);
                        }
                    }

                } else if (this.currAxisType == AxisType.scale) {
                    if (this.activeAxis == AxisDirection.x) {
                        let scale = trans.localScale;
                        trans.localScale = new vector2(scale.x + deltaPosition.x * 0.02, scale.y);
                        trans.markDirty();
                    } else if (this.activeAxis == AxisDirection.y) {
                        let scale = trans.localScale;
                        trans.localScale = new vector2(scale.x, scale.y - deltaPosition.y * 0.02);
                        trans.markDirty();
                    }
                }
            }
        }
    }

    //刷新轴类型
    private refreshAxisType(value: AxisType) {
        // if (this._currAxisType == value) {
        //     return;
        // }
        //隐藏原来的轴

        //隐藏移动轴
        if (value != AxisType.move) {
            for (const key in this.moveAxisMap) {
                this.moveAxisMap[key].body.gameObject.visible = false;
                this.moveAxisMap[key].head.gameObject.visible = false;
            }
            // for (const key in this.movePanelMap) {
            //     this.movePanelMap[key].body.gameObject.visible = false;
            // }
        } else {
            for (const key in this.moveAxisMap) {
                this.moveAxisMap[key].body.gameObject.visible = true;
                this.moveAxisMap[key].head.gameObject.visible = true;
            }
            // for (const key in this.movePanelMap) {
            //     this.movePanelMap[key].body.gameObject.visible = true;
            // }
        }
        //隐藏旋转轴
        if (value != AxisType.rotate || EditorApplication.Instance.editorCamera.opvalueType == SceneCameraOpvalueType.Normal) {
            for (const key in this.rotateAxisMap) {
                this.rotateAxisMap[key].body.gameObject.visible = false;
            }
        } else {
            for (const key in this.rotateAxisMap) {
                this.rotateAxisMap[key].body.gameObject.visible = true;
            }
        }

        //隐藏缩放轴
        if (value != AxisType.scale) {
            for (const key in this.scaleAxisMap) {
                this.scaleAxisMap[key].body.gameObject.visible = false;
                this.scaleAxisMap[key].head.gameObject.visible = false;
            }
        } else {
            for (const key in this.scaleAxisMap) {
                this.scaleAxisMap[key].body.gameObject.visible = true;
                this.scaleAxisMap[key].head.gameObject.visible = true;
            }
        }

        this._currAxisType = value;
    }

    //刷新轴演示和缩放
    private refreshAxisState(axisMap: AxisMap) {
        if (this.currAxisType == AxisType.rotate) {
            if (this.collAxis != AxisDirection.x) {
                m4m.math.vec3Set(axisMap["x"].body.localScale, 1, 1, 1);
            } else {
                m4m.math.vec3Set(axisMap["x"].body.localScale, 1.01, 1.01, 1.01);
            }
            if (this.collAxis != AxisDirection.y) {
                m4m.math.vec3Set(axisMap["y"].body.localScale, 1, 1, 1);
            } else {
                m4m.math.vec3Set(axisMap["y"].body.localScale, 1.01, 1.01, 1.01);
            }
            if (this.collAxis != AxisDirection.z) {
                m4m.math.vec3Set(axisMap["z"].body.localScale, 1, 1, 1);
            } else {
                m4m.math.vec3Set(axisMap["z"].body.localScale, 1.01, 1.01, 1.01);
            }
        } else {
            if (this.collAxis != AxisDirection.x) {
                m4m.math.vec3Clone(this.defaultAxisScale, axisMap["x"].body.localScale);
            } else {
                m4m.math.vec3Clone(this.defaultSelectAxisScale, axisMap["x"].body.localScale);
            }
            if (this.collAxis != AxisDirection.y) {
                m4m.math.vec3Clone(this.defaultAxisScale, axisMap["y"].body.localScale);
            } else {
                m4m.math.vec3Clone(this.defaultSelectAxisScale, axisMap["y"].body.localScale);
            }
            if (this.collAxis != AxisDirection.z) {
                m4m.math.vec3Clone(this.defaultAxisScale, axisMap["z"].body.localScale);
            } else {
                m4m.math.vec3Clone(this.defaultSelectAxisScale, axisMap["z"].body.localScale);
            }
        }
    }

    //设置轴颜色
    private setAxisColor(data: AxisTransData, color: vector4) {
        data.bodyMaterial.setVector4("_Color", color);
        if (data.headMaterial) {
            data.headMaterial.setVector4("_Color", color);
        }
    }

    //创建移动轴
    private createMoveAxis(axisType: AxisDirection): AxisTransData {
        let axis = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cylinder, EditorApplication.Instance.engineApp);
        axis.name = "MoveAxis_" + axisType;
        axis.gameObject.tag = EditorObjectTags.editorAxisTag;
        axis.gameObject.layer = 3; //CullingMask.editor
        let renderer: m4m.framework.meshRenderer = axis.gameObject.renderer as m4m.framework.meshRenderer;
        let materials: material = renderer.materials[0];
        materials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        materials.setVector4("_Color", this.defaultAxisColor[axisType]);
        materials.setFloat("_Alpha", this.defaultAxisAlpha);

        //创建圆锥
        let pyramid = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Pyramid, EditorApplication.Instance.engineApp);
        pyramid.gameObject.tag = EditorObjectTags.editorAxisTag;
        let pyramidRenderer = pyramid.gameObject.renderer as m4m.framework.meshRenderer;
        let pyramidMaterials = pyramidRenderer.materials[0];
        pyramidMaterials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        pyramidMaterials.setVector4("_Color", this.defaultAxisColor[axisType]);
        pyramidMaterials.setFloat("_Alpha", this.defaultAxisAlpha);
        pyramid.gameObject.layer = 3; //CullingMask.editor

        m4m.math.vec3Set(pyramid.localScale, 2, 0.2, 2);
        pyramid.localTranslate.y = 1;
        axis.addChild(pyramid);

        m4m.math.vec3Clone(this.defaultAxisScale, axis.localScale);
        //碰撞组件
        axis.gameObject.addComponent("meshcollider");
        let data: AxisTransData = {
            body: axis,
            bodyMaterial: materials,
            head: pyramid,
            headMaterial: pyramidMaterials,
        };
        this.moveAxisMap[axisType] = data;
        return data;
    }

    //创建移动面板
    private createMovePanel(axisType: AxisDirection): AxisTransData {
        let panel = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Plane, EditorApplication.Instance.engineApp);
        panel.name = "MovePanel_" + axisType;
        panel.gameObject.tag = EditorObjectTags.editorAxisTag;
        panel.gameObject.layer = 3; //CullingMask.editor
        let renderer: m4m.framework.meshRenderer = panel.gameObject.renderer as m4m.framework.meshRenderer;
        let materials: material = renderer.materials[0];
        materials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        materials.setVector4("_Color", this.defaultAxisColor[axisType]);
        materials.setFloat("_Alpha", this.defaultAxisAlpha * 0.5);

        m4m.math.vec3Set(panel.localScale, 0.05, 0.05, 0.05);
        //碰撞组件
        panel.gameObject.addComponent("meshcollider");
        let data: AxisTransData = {
            body: panel,
            bodyMaterial: materials,
        };
        this.movePanelMap[axisType] = data;
        return data;
    }

    //创建旋转轴
    private createRotateAxis(axisType: AxisDirection): AxisTransData {
        let app = EditorApplication.Instance.engineApp;
        let circlemesh = app.getAssetMgr().getDefaultMesh("circleline");
        let sh = app.getAssetMgr().getShader("shader/materialcolor");

        let trans = new transform();
        trans.name = "RotateAxis_" + axisType;
        trans.gameObject.tag = EditorObjectTags.editorAxisTag;
        trans.gameObject.layer = 3; //CullingMask.editor
        let mf = trans.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        trans.gameObject.addComponent("meshcollider");
        //trans.gameObject.hideFlags = m4m.framework.HideFlags.HideInHierarchy;
        mf.mesh = circlemesh;
        let renderer = trans.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        renderer.renderLayer = m4m.framework.cullingmaskutil.maskTolayer(m4m.framework.CullingMask.editor);
        renderer.materials = [];
        let material = new m4m.framework.material();
        renderer.materials.push(material);
        material.setShader(sh);
        material.setVector4("_Color", this.defaultAxisColor[axisType]);
        material.setFloat("_Alpha", this.defaultAxisAlpha);

        let data: AxisTransData = {
            body: trans,
            bodyMaterial: material,
        };
        this.rotateAxisMap[axisType] = data;

        return data;
    }

    //创建缩放轴
    private createScaleAxis(axisType: AxisDirection): AxisTransData {
        let axis = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cylinder, EditorApplication.Instance.engineApp);
        axis.name = "ScaleAxis_" + axisType;
        axis.gameObject.tag = EditorObjectTags.editorAxisTag;
        axis.gameObject.layer = 3; //CullingMask.editor
        let renderer: m4m.framework.meshRenderer = axis.gameObject.renderer as m4m.framework.meshRenderer;
        let materials: material = renderer.materials[0];
        materials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        materials.setVector4("_Color", this.defaultAxisColor[axisType]);
        materials.setFloat("_Alpha", this.defaultAxisAlpha);

        //创建顶部方形
        let cube = TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, EditorApplication.Instance.engineApp);
        cube.gameObject.tag = EditorObjectTags.editorAxisTag;
        cube.gameObject.layer = 3; //CullingMask.editor
        let pyramidRenderer = cube.gameObject.renderer as m4m.framework.meshRenderer;
        let cubeMaterials = pyramidRenderer.materials[0];
        cubeMaterials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("shader/materialcolor"));
        cubeMaterials.setVector4("_Color", this.defaultAxisColor[axisType]);
        cubeMaterials.setFloat("_Alpha", this.defaultAxisAlpha);

        m4m.math.vec3Set(cube.localScale, 2.5, 0.25, 2.5);
        cube.localTranslate.y = 0.875;
        axis.addChild(cube);

        m4m.math.vec3Clone(this.defaultAxisScale, axis.localScale);
        //碰撞组件
        axis.gameObject.addComponent("meshcollider");
        let data: AxisTransData = {
            body: axis,
            bodyMaterial: materials,
            head: cube,
            headMaterial: cubeMaterials,
        };
        this.scaleAxisMap[axisType] = data;
        return data;
    }

    /**
     * 创建一条从点击位置创建的射线, 用于scene内的物体检测
     */
    public createRay(): ray {
        let ea = EditorApplication.Instance;
        //从点击除创建射线
        let ray = ea.editorCamera.creatRayByScreen(EditorInputMgr.Instance.getTouchPosition(), ea.engineApp);

        if (ea.editorCamera.opvalueType == SceneCameraOpvalueType.Ui) {
            ray.origin.z = -1000;
        }
        return ray;
    }

    //拖拽前保存初始数据
    private saveTransData(trans: transform | transform2D) {
        this.startDragData.transform = trans;
        if (trans instanceof transform) {
            m4m.math.vec3Clone(trans.getWorldTranslate(), this.startDragData.worldPosition);
            m4m.math.vec3Clone(trans.localTranslate, this.startDragData.position);
            m4m.math.vec3Clone(trans.localScale, this.startDragData.scale);
            m4m.math.vec3Clone(trans.localRotate, this.startDragData.rotate);
            m4m.math.matrixClone(trans.getWorldMatrix(), this.startDragData.worldMatrix)
        } else {

        }
    }
    
    //异面直线交点
    private intersectionWith2Line(p1: vector3, d1: vector3, p2: vector3, d2: vector3, outpoint: vector3): boolean {
        let tvec = new vector3();
        let tvec1 = new vector3();
        m4m.math.vec3Cross(d1, d2, tvec);
        m4m.math.vec3Cross(d1, tvec, tvec1);
        m4m.math.vec3Normalize(tvec1, tvec1);

        let ray1 = new m4m.framework.ray(p2, d2);

        return ray1.intersectPlane(p1, tvec1, outpoint);
    }

    //取个可用 的（过滤 不可编辑的对象）
    private getUsefulPickinfo(arr: pickinfo[]) {
        if (!arr || arr.length < 1) return;

        let result: pickinfo;
        arr.sort((a, b) => {
            return a.distance - b.distance;
        });
        let navmgr = m4m.framework.NavMeshLoadManager.Instance;
        while (!result && arr.length > 0) {
            let info = arr.shift();
            //不可编辑对象过滤
            if ((info.pickedtran.gameObject.hideFlags & m4m.framework.HideFlags.NotEditable) == 0) {
                result = info;
            }
        }
        return result;
    }

}

type AxisTransData = {
    body: transform,
    bodyMaterial: material,
    head?: transform,
    headMaterial?: material,
};

type AxisMap = { [key: string]: AxisTransData };