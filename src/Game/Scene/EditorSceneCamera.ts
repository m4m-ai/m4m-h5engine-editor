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
import {AxisDirection} from "./EditorAxisObject";
import {EditorEventMgr} from "../Event/EditorEventMgr";
import math = m4m.math;
import vector3 = m4m.math.vector3;
import transform = m4m.framework.transform;
import vector2 = m4m.math.vector2;

export enum SceneCameraOpvalueType {
    Normal,
    Ui,
}

/**
 * 编辑器中的相机
 */
export class EditorSceneCamera extends m4m.framework.camera {

    //private inputMgr: m4m.framework.inputMgr;

    //相机移动速度
    private moveSpeed: number = 3;
    //鼠标是否在窗口内
    private mouseInWindow: boolean = false;
    //是否能移动视野
    private _moveViewFlag = false;
    
    private _targetFlag: boolean = false;
    private _targetAngle: vector3 = new m4m.math.vector3();
    private _angleSpeed: number = 1;
    //记录切成ui相机前的相机坐标
    private _pos: vector3 = new vector3();

    private _focusDistance: number;
    //焦点距离
    get FocusDistance () {
        return this._focusDistance;
    }
    
    public get opvalueType() {
        return this._opvalueType;
    }
    private _opvalueType: SceneCameraOpvalueType = SceneCameraOpvalueType.Normal;

    private onMouseleaveFunc = this.onMouseleave.bind(this);
    private onMouseenterFunc = this.onMouseenter.bind(this);

    public start(): void {
        super.start();
        //this.inputMgr = EditorApplication.Instance.engineApp.getInputMgr();
        //绑定鼠标移出和移入窗口逻辑
        EditorApplication.Instance.element.addEventListener("mouseleave", this.onMouseleaveFunc);
        EditorApplication.Instance.element.addEventListener("mouseenter", this.onMouseenterFunc);

        //绑定移动事件
        EditorInputMgr.Instance.addEventListener("PlayerMove", this.onPlayerMoveFunc.bind(this));
        EditorInputMgr.Instance.addEventListener("TouchScale", this.onTouchScaleFunc.bind(this));
        EditorInputMgr.Instance.addEventListener("TouchDown", this.onTouchDownFunc.bind(this));
        EditorInputMgr.Instance.addEventListener("TouchViewMove", this.onTouchViewMoveFunc.bind(this));

        EditorEventMgr.Instance.addEventListener("CameraLookTransform", (trans) => {
            if (EditorApplication.Instance.isPlay) {
                return;
            }
            if (trans instanceof transform) {
                this.CameraCenterToPoint(trans.getWorldTranslate());
            } else {
                let cr = EditorApplication.Instance.editorScene.canvasRenderer;
                let pos = new vector3();
                let center = new vector2((0.5 - trans.pivot.x) * trans.width, (0.5 - trans.pivot.y) * trans.height);
                let matrix = trans.getCanvasWorldMatrix();
                m4m.math.matrix3x2TransformVector2(matrix, center, center);
                cr.calCanvasPosToWorldPos(center, pos);
                this.CameraCenterToPoint(pos);
            }
        });
    }

    public update(delta: number): void {
        super.update(delta);
        if (this._targetFlag) {
            let angle = this.gameObject.transform.localEulerAngles;
            m4m.math.vec3SLerp(angle, this._targetAngle, this._angleSpeed, angle);
            this.gameObject.transform.localEulerAngles = angle;

            let targetAngle = new vector3(this._targetAngle.x, this._targetAngle.y, this._targetAngle.z);
            let a2 = new vector3(angle.x, angle.y, angle.z);
            let angle1 = m4m.math.vec3AngleBetween(targetAngle, a2);
            if (angle1 <= 0.00001) {
                this._targetFlag = false;
            }
        }
    }

    public remove(): void {
        super.remove();
        EditorApplication.Instance.element.removeEventListener("mouseleave", this.onMouseleaveFunc);
        EditorApplication.Instance.element.removeEventListener("mouseenter", this.onMouseenterFunc);
    }

    //相机中心移动到 指定点
    public CameraCenterToPoint(worldPoint: vector3) {
        let camTran = this.gameObject.transform;
        let temp = new vector3();
        camTran.getForwardInWorld(temp);

        temp.x *= 5;
        temp.y *= 5;
        temp.z *= 5;
        
        m4m.math.vec3Subtract(worldPoint, temp, temp);
        camTran.setWorldPosition(temp);
    }


    //移动相机视角
    public MoveView(x: number, y: number) {
        this._targetFlag = false;
        if (EditorApplication.Instance.axisObject.activeAxis == AxisDirection.none) {
            if (this.opvalueType == SceneCameraOpvalueType.Normal) {
                let angle = this.gameObject.transform.localEulerAngles;
                angle.y += x * 0.1;
                angle.y %= 360;
                angle.x = this.clampValue(-90, 90, angle.x + y * 0.1);
                this.gameObject.transform.localEulerAngles = angle;
            } else {
                let translate = this.gameObject.transform.localTranslate;
                translate.x -= x * this.size / 1250;
                translate.y += y * this.size / 1250;
            }
        }
    }

    //插值旋转相机视角
    public DifferenceMoveView(targetAngle: vector3, speed: number) {
        this._targetFlag = true;
        m4m.math.vec3Clone(targetAngle, this._targetAngle);
        this._angleSpeed = speed;
        //m4m.math.quatFromEulerAngles(targetAngle.x, targetAngle.y, targetAngle.z, this._targetAngle);
    }

    /**
     * 切换2d/3d视图
     */
    public switchPpvalueType() {
        if (this._opvalueType == SceneCameraOpvalueType.Normal) {
            //改为ui相机
            this._opvalueType = SceneCameraOpvalueType.Ui;
            this.opvalue = 0;
            this.gameObject.transform.localEulerAngles = new vector3();
            //this.DifferenceMoveView(new vector3(), 0.2);
            m4m.math.vec3Clone(this.gameObject.transform.localTranslate, this._pos);
            
            let canvasRenderer = EditorApplication.Instance.editorScene.canvasRenderer;
            if (canvasRenderer) {
                let translate = canvasRenderer.gameObject.transform.localTranslate;
                m4m.math.vec3Set(this.gameObject.transform.localTranslate, translate.x, translate.y, -10);
                // this.gameObject.getScene().update(0);
                // this.gameObject.update(0);
                //this.gameObject.transform.localTranslate.z = -10;
            }
        } else {
            //改成正常相机
            this._opvalueType = SceneCameraOpvalueType.Normal;
            this.opvalue = 1;
            m4m.math.vec3Clone(this._pos, this.gameObject.transform.localTranslate);
            m4m.math.vec3Set(this._pos, 0, 0, 0);
            this.gameObject.getScene().update(0);
            this.gameObject.update(0);
        }
    }
    
    public resetPpvalue() {
        this._opvalueType = SceneCameraOpvalueType.Normal;
        this.opvalue = 1;
        m4m.math.vec3Set(this._pos, 0, 0, 0);
    }
    
    private onTouchDownFunc() {
        if (EditorApplication.Instance.isPlay) {
            return;
        }
        //确保没有点击到ui上
        let pos = EditorInputMgr.Instance.getTouchPosition();
        let sceneUI = EditorApplication.Instance.editorSceneUI;
        let flag = sceneUI.overlay2D.pick2d(pos.x, pos.y);
        this._moveViewFlag = !flag || flag == sceneUI.axisPanel;
    }
    
    //移动视角回调
    private onTouchViewMoveFunc(x: number, y: number) {
        if (EditorApplication.Instance.isPlay) {
            return;
        }
        if (this._moveViewFlag && !EditorApplication.Instance.editorSceneUI.isDragBox) {
            this.MoveView(x, y);
        }
    }
    //移动回调
    private onPlayerMoveFunc(delta: vector3) {
        if (EditorApplication.Instance.isPlay) {
            return;
        }
        this.cameraMove(delta);
    }
    //视角缩放回调
    private onTouchScaleFunc(scaleDelta: number) {
        if (EditorApplication.Instance.isPlay) {
            return;
        }
        if (this.opvalueType == SceneCameraOpvalueType.Normal) {
            let axis = new math.vector3(0, 0, scaleDelta * 10);
            this.cameraMove(axis);
        } else {
            this.size -= scaleDelta * this.size / 10;
            this.markDirty();
            // EditorApplication.Instance.editorScene.scene.update(0);
        }
    }
    
    //场景相机移动
    private cameraMove(axis: vector3) {
        let delta = EditorApplication.Instance.engineApp.deltaTime;
        let cameraPos = this.gameObject.transform.getWorldPosition();
        if (axis.x != 0) {
            let right = new math.vector3();
            this.gameObject.transform.getRightInWorld(right);
            right.x *= this.moveSpeed * axis.x * delta;
            right.y *= this.moveSpeed * axis.x * delta;
            right.z *= this.moveSpeed * axis.x * delta;
            math.vec3Add(cameraPos, right, cameraPos);
        }
        if (axis.y != 0) {
            cameraPos.y += this.moveSpeed * axis.y * delta
        }
        if (axis.z != 0) {
            let forward = new math.vector3();
            this.gameObject.transform.getForwardInWorld(forward);
            forward.x *= this.moveSpeed * axis.z * delta;
            forward.y *= this.moveSpeed * axis.z * delta;
            forward.z *= this.moveSpeed * axis.z * delta;
            math.vec3Add(cameraPos, forward, cameraPos);
        }
        this.gameObject.transform.setWorldPosition(cameraPos);
    }

    private onMouseleave() {
        this.mouseInWindow = false;
    }

    private onMouseenter() {
        this.mouseInWindow = true;
    }

    private clampValue(a: number, b: number, v: number): number {
        if (v < a) {
            return a;
        }
        if (v > b) {
            return b;
        }
        return v;
    }
}