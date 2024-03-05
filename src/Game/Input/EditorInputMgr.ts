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
/**
 * 编辑器输入管理
 */
import IEditorCode = m4m.framework.IEditorCode;
import vector2 = m4m.math.vector2;
import vector3 = m4m.math.vector3;
import {ElementInputMap} from "./ElementInputMap";
import {InputMap} from "./InputMap";
import {ElementEventBinder} from "./ElementEventBinder";
import {TouchPosition} from "./TouchPosition";
import {IEvent} from "../Event/IEvent";
import {EventBinder} from "../Event/EventBinder";
import Ivec2 = m4m.math.Ivec2;
import {ElementEventFactory} from "./ElementEventFactory";
import {EditorApplication} from "../EditorApplication";

export enum PlatformType {
    Android,
    IOS,
    PC,
}

export class EditorInputMgr implements IEditorCode, IEvent<InputMap> {

    public static get Instance() {
        return this._instance;
    }
    private static _instance: EditorInputMgr = new EditorInputMgr();

    /**
     * 获取编辑器执行的平台
     */
    public get platformType() {
        return this._platformType;
    }

    private _platformType: PlatformType = PlatformType.PC;


    private bindMap = new Map<keyof InputMap, EventBinder<InputMap, keyof InputMap, InputMap[keyof InputMap]>[]>();
    private elementBindMap = new Map<keyof ElementInputMap, ElementEventBinder<ElementInputMap, keyof ElementInputMap, ElementInputMap[keyof ElementInputMap]>[]>();

    //引擎对象
    private _engineApp: m4m.framework.application;
    //引擎输入类
    private _inputMgr: m4m.framework.inputMgr;
    
    private _touchPos: vector2 = new m4m.math.vector2();

    private _inputClickDown: boolean = false;
    private _isTouchPressed: boolean = false;
    
    private _inputCkickFlag = false;
    //开始触摸的位置
    private _inputTouchStartPos: vector2;
    //上一帧点击位置
    private _inputTouchPrevPos: vector2;
    //点击位置变化量
    private _inputTouchDeltaPos: vector2 = new m4m.math.vector2();
    
    private _playerMoveSpeed: number = 1;
    
    private _globalTouchPos: vector2 = new m4m.math.vector2();

    private constructor() {
        let ua = window.navigator.userAgent.toLowerCase();
        let isAndroid = (ua.indexOf('android') >= 0);
        let isIOS = (/iphone|ipad|ipod|ios/.test(ua));

        if (isAndroid) { //安卓平台
            this._platformType = PlatformType.Android;
        } else if (isIOS) { //ios平台
            this._platformType = PlatformType.IOS;
        } else { //pc平台
            this._platformType = PlatformType.PC;
        }
    }
    
    /**
     * 返回是否在触摸中
     */
    public isTouching(): boolean {
        if (this._platformType == PlatformType.Android || this._platformType == PlatformType.IOS) { //安卓平台, ios平台
            let touch = this._inputMgr.touches[0];
            return touch != null && touch.touch;
        } else { //pc平台
            return this._inputMgr.isPressed(0);
        }
    }

    /**
     * 返回是否刚触摸
     */
    public isTouchPressed(): boolean {
        if (this._platformType == PlatformType.Android || this._platformType == PlatformType.IOS) { //安卓平台, ios平台
            return this._isTouchPressed;
        } else { //pc平台
            return this._isTouchPressed;
        }
    }

    /**
     * 获取触摸的坐标
     */
    public getTouchPosition(): vector2 {
        if (this._platformType == PlatformType.Android || this._platformType == PlatformType.IOS) { //安卓平台, ios平台
            let touch = this._inputMgr.touches[0];
            if (touch != null && touch.touch) {
                m4m.math.vec2Set(this._touchPos, touch.x, touch.y);
            }
            return new vector2(this._touchPos.x, this._touchPos.y);
        } else { //pc平台
            let pos = new vector2();
            m4m.math.vec2Clone(this._inputMgr.point, pos);
            return pos;
        }
    }

    /**
     * 获取点击坐标相对于上一帧的偏移量
     */
    public getTouchDeltaPosition(): vector2 {
        return this._inputTouchDeltaPos;
    }

    /**
     * 获取点击的位置是否在场景元素内
     */
    public isTouchInScene(): boolean {
        let rect = this._engineApp.container.getBoundingClientRect();
        return this._globalTouchPos.x >= rect.x && this._globalTouchPos.x <= rect.x + rect.width &&
            this._globalTouchPos.y >= rect.y && this._globalTouchPos.y <= rect.y + rect.height;
    }

    public addEventListener<K extends keyof InputMap, F extends InputMap[K]>(key: K, func: F): EventBinder<InputMap, K, F> {
        let binder: EventBinder<InputMap, K, F>;
        let list = this.bindMap.get(key);
        if (!list) {
            binder = new EventBinder(this, key, func);
            list = [binder];
            this.bindMap.set(key, list);
            return binder;
        }
        for (let i = 0; i < list.length; i++) {
            if (list[i].func == func) {
                return list[i] as EventBinder<InputMap, K, F>;
            }
        }
        binder = new EventBinder(this, key, func);
        list.push(binder);
        return binder;
    }

    public removeEventListener<K extends keyof InputMap, F extends InputMap[K]>(binder: EventBinder<InputMap, K, F>) {
        let list = this.bindMap.get(binder.key);
        if (list) {

            if (list.length > 0) {
                list.splice(list.indexOf(binder), 1);
            }

            if (list.length == 0) {
                this.bindMap.delete(binder.key);
            }
        }
    }

    public removeAllEventListener<K extends keyof InputMap>(key: K) {
        this.bindMap.delete(key);
    }

    public clearEventListener() {
        this.bindMap.clear();
    }

    public emitEvent<K extends keyof InputMap, F extends InputMap[K]>(key: K, cb: (callback: EventBinder<InputMap, K, F>["func"]) => void) {
        let list = this.bindMap.get(key);
        if (list) {
            let tempList = [...list];
            for (let i = 0; i < tempList.length; i++) {
                cb((tempList[i] as EventBinder<InputMap, K, F>).func);
            }
        }
    }

    /**
     * 添加原生element监听事件
     * @param ele 绑定的element对象
     * @param key 事件名称
     * @param func 回调函数
     */
    public addElementEventListener<K extends keyof ElementInputMap, F extends ElementInputMap[K]>(ele: HTMLElement, key: K, func: F): ElementEventBinder<ElementInputMap, K, F> {
        let binder: ElementEventBinder<ElementInputMap, K, F> = null;
        let list = this.elementBindMap.get(key);
        if (!list) {
            binder = new ElementEventBinder(this, key, func);
            list = [binder];
            this.elementBindMap.set(key, list);
        } else {
            for (let i = 0; i < list.length; i++) {
                if (list[i].callBack == func) {
                    return list[i] as ElementEventBinder<ElementInputMap, K, F>;
                }
            }
            binder = new ElementEventBinder(this, key, func);
            list.push(binder);
        }
        
        let cb: Function = func;

        if (key == "TouchDrag") { //拖拽物体
            let moveFlag = false;
            let state = 0;
            if (this.platformType == PlatformType.PC) { //pc平台
                let downFlag = false;
                let prevPos: m4m.math.Ivec2 = {
                    x: -1,
                    y: -1,
                };

                let md = (ev: MouseEvent) => {
                    moveFlag = false;
                    downFlag = true;
                };
                let mu = (ev: MouseEvent) => {
                    if (downFlag && moveFlag) {
                        let rect = ele.getBoundingClientRect();
                        cb(<any>this.createTouchData(
                            ev.pageX,
                            ev.pageY,
                            ev.pageX - rect.x,
                            ev.pageY - rect.y,
                            ev
                        ), 2);
                        state = 0;
                    }
                    downFlag = false;
                    prevPos.x = -1;
                    prevPos.y = -1;
                }
                let mm = (ev: MouseEvent) => {
                    if (downFlag && (prevPos.x != ev.pageX || prevPos.y != ev.pageY)) {
                        prevPos.x = ev.pageX;
                        prevPos.y = ev.pageY;
                        moveFlag = true;
                        let rect = ele.getBoundingClientRect();
                        cb(<any>this.createTouchData(
                            ev.pageX,
                            ev.pageY,
                            ev.pageX - rect.x,
                            ev.pageY - rect.y,
                            ev
                        ), state);
                        state = 1;
                    }
                };
                if (ele.draggable) {
                    ele.addEventListener("dragstart", md);
                    ele.addEventListener("dragend", mu);
                    ele.addEventListener("drag", mm);

                    binder.funcMap["dragstart"] = {
                        element: ele,
                        func: md,
                    };
                    binder.funcMap["dragend"] = {
                        element: ele,
                        func: mu,
                    };
                    binder.funcMap["drag"] = {
                        element: ele,
                        func: mm,
                    };
                } else {
                    ele.addEventListener("mousedown", md);
                    document.body.addEventListener("mouseup", mu);
                    document.body.addEventListener("mousemove", mm);

                    binder.funcMap["mousedown"] = {
                        element: ele,
                        func: md,
                    };
                    binder.funcMap["mouseup"] = {
                        element: document.body,
                        func: mu,
                    };
                    binder.funcMap["mousemove"] = {
                        element: document.body,
                        func: mm,
                    };
                }
            } else { //移动端
                let dragFlag = false;
                let state = 0;
                let prevPos: m4m.math.Ivec2 = {
                    x: -1,
                    y: -1,
                }
                let ts = (ev: TouchEvent) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData) {
                        prevPos.x = touchData.pageX;
                        prevPos.y = touchData.pageY;
                        let rect = ele.getBoundingClientRect();
                        dragFlag = touchData.pageX >= rect.x && touchData.pageX <= rect.x + rect.width && touchData.pageY >= rect.y && touchData.pageY <= rect.y + rect.height;
                        moveFlag = false;
                    }
                };
                let te = (ev: TouchEvent) => {
                    if (dragFlag) {
                        let touchData = ev.changedTouches[0];
                        if (touchData && moveFlag) {
                            let rect = ele.getBoundingClientRect();
                            cb(<any>this.createTouchData(
                                touchData.pageX,
                                touchData.pageY,
                                touchData.pageX - rect.x,
                                touchData.pageY - rect.y,
                                ev
                            ), 2);
                            state = 0;
                        }
                    }
                    dragFlag = false;
                    prevPos.x = -1;
                    prevPos.y = -1;
                };
                let tm = (ev: TouchEvent) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData && dragFlag) {
                        moveFlag = true;
                        let rect = ele.getBoundingClientRect();
                        if (prevPos.x != touchData.pageX || prevPos.y != touchData.pageY) {
                            prevPos.x = touchData.pageX;
                            prevPos.y = touchData.pageY;
                            cb(<any>this.createTouchData(
                                touchData.pageX,
                                touchData.pageY,
                                touchData.pageX - rect.x,
                                touchData.pageY - rect.y,
                                ev
                            ), state);
                            state = 1;
                        }
                    }
                };
                document.body.addEventListener("touchstart", ts);
                document.body.addEventListener("touchend", te);
                document.body.addEventListener("touchmove", tm);

                binder.funcMap["touchstart"] = {
                    element: document.body,
                    func: ts,
                };
                binder.funcMap["touchend"] = {
                    element: document.body,
                    func: te,
                };
                binder.funcMap["touchmove"] = {
                    element: document.body,
                    func: tm,
                };
            }
        } else if (key == "TouchDrop") {
            let cl = (ev: MouseEvent) => {
                let rect = ele.getBoundingClientRect();
                cb(<any>this.createTouchData(
                    ev.pageX,
                    ev.pageY,
                    ev.pageX - rect.x,
                    ev.pageY - rect.y,
                    ev
                ));
            };
            ele.addEventListener("drop", cl);

            binder.funcMap["drop"] = {
                element: ele,
                func: cl,
            };
        } else if (key == "TouchClick") {
            let cl = (ev: MouseEvent) => {
                let rect = ele.getBoundingClientRect();
                cb(<any>this.createTouchData(
                    ev.pageX,
                    ev.pageY,
                    ev.pageX - rect.x,
                    ev.pageY - rect.y,
                    ev
                ));
            };
            ele.addEventListener("click", cl);

            binder.funcMap["click"] = {
                element: ele,
                func: cl,
            };
        } else if (key == "TouchDown") {
            if (this.platformType == PlatformType.PC) { //pc平台
                let md = (ev: MouseEvent) => {
                    let rect = ele.getBoundingClientRect();
                    cb(<any>this.createTouchData(
                        ev.pageX,
                        ev.pageY,
                        ev.pageX - rect.x,
                        ev.pageY - rect.y,
                        ev
                    ));
                };
                ele.addEventListener("mousedown", md);

                binder.funcMap["mousedown"] = {
                    element: ele,
                    func: md,
                };
            } else { //移动端
                let ts = (ev: TouchEvent) => {
                    let touchData = ev.targetTouches[0];
                    if (touchData) {
                        let rect = ele.getBoundingClientRect();
                        cb(<any>this.createTouchData(
                            touchData.pageX,
                            touchData.pageY,
                            touchData.pageX - rect.x,
                            touchData.pageY - rect.y,
                            ev
                        ));
                    }
                };
                ele.addEventListener("touchstart", ts);

                binder.funcMap["touchstart"] = {
                    element: ele,
                    func: ts,
                };
            }
        } else if (key == "TouchUp") {
            if (this.platformType == PlatformType.PC) { //pc平台
                let mu = (ev: MouseEvent) => {
                    let rect = ele.getBoundingClientRect();
                    cb(<any>this.createTouchData(
                        ev.pageX,
                        ev.pageY,
                        ev.pageX - rect.x,
                        ev.pageY - rect.y,
                        ev
                    ));
                };
                ele.addEventListener("mouseup", mu);

                binder.funcMap["mouseup"] = {
                    element: ele,
                    func: mu,
                };
            } else { //移动端
                let te = (ev) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData) {
                        let rect = ele.getBoundingClientRect();
                        cb(<any>this.createTouchData(
                            touchData.pageX,
                            touchData.pageY,
                            touchData.pageX - rect.x,
                            touchData.pageY - rect.y,
                            ev
                        ));
                    }
                };
                ele.addEventListener("touchend", te);

                binder.funcMap["touchend"] = {
                    element: ele,
                    func: te,
                };
            }
        } else if (key == "TouchScale") {
            let wh = (ev: WheelEvent) => {
                cb(<any>ev.deltaY);
            };
            ele.addEventListener("wheel", wh);

            binder.funcMap["wheel"] = {
                element: ele,
                func: wh,
            };
        } else if (key == "TouchEnter") {
            if (this.platformType == PlatformType.PC) { //pc平台
                let mt = (ev: MouseEvent) => {
                    let rect = ele.getBoundingClientRect();
                    cb(<any>this.createTouchData(
                        ev.pageX,
                        ev.pageY,
                        ev.pageX - rect.x,
                        ev.pageY - rect.y,
                        ev
                    ));
                };
                ele.addEventListener("mouseenter", mt);

                binder.funcMap["mouseenter"] = {
                    element: ele,
                    func: mt,
                };
            } else { //移动端
                let enterFlag = false;
                let tm = (ev: TouchEvent) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData) {
                        let rect = ele.getBoundingClientRect();
                        if (touchData.pageX >= rect.x && touchData.pageX <= rect.x + rect.width && touchData.pageY >= rect.y && touchData.pageY <= rect.y + rect.height) {
                            if (!enterFlag) {
                                enterFlag = true;
                                cb(<any>this.createTouchData(
                                    touchData.pageX,
                                    touchData.pageY,
                                    touchData.pageX - rect.x,
                                    touchData.pageY - rect.y,
                                    ev
                                ));
                            }
                        } else {
                            enterFlag = false;
                        }
                    }
                };
                document.body.addEventListener("touchmove", tm);
                document.body.addEventListener("touchstart", tm);
                binder.funcMap["touchmove"] = {
                    element: document.body,
                    func: tm,
                };
                binder.funcMap["touchstart"] = {
                    element: document.body,
                    func: tm,
                };
            }
        } else if (key == "TouchLeave") {
            if (this.platformType == PlatformType.PC) { //pc平台
                let mt = (ev: MouseEvent) => {
                    let rect = ele.getBoundingClientRect();
                    cb(<any>this.createTouchData(
                        ev.pageX,
                        ev.pageY,
                        ev.pageX - rect.x,
                        ev.pageY - rect.y,
                        ev
                    ));
                };
                ele.addEventListener("mouseleave", mt);

                binder.funcMap["mouseleave"] = {
                    element: ele,
                    func: mt,
                };
            } else { //移动端
                let enterFlag = false;
                let tm = (ev: TouchEvent) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData) {
                        let rect = ele.getBoundingClientRect();
                        if (touchData.pageX >= rect.x && touchData.pageX <= rect.x + rect.width && touchData.pageY >= rect.y && touchData.pageY <= rect.y + rect.height) {
                            enterFlag = true;
                        } else if (enterFlag) {
                            cb(<any>this.createTouchData(
                                touchData.pageX,
                                touchData.pageY,
                                touchData.pageX - rect.x,
                                touchData.pageY - rect.y,
                                ev
                            ));
                            enterFlag = false;
                        }
                    }
                };
                document.body.addEventListener("touchmove", tm);
                document.body.addEventListener("touchstart", tm);
                binder.funcMap["touchmove"] = {
                    element: document.body,
                    func: tm,
                };
                binder.funcMap["touchstart"] = {
                    element: document.body,
                    func: tm,
                };
            }
        } else if (key == "TouchMove") {
            if (this.platformType == PlatformType.PC) { //pc平台
                let mt = (ev: MouseEvent) => {
                    let rect = ele.getBoundingClientRect();
                    cb(<any>this.createTouchData(
                        ev.pageX,
                        ev.pageY,
                        ev.pageX - rect.x,
                        ev.pageY - rect.y,
                        ev
                    ));
                };
                ele.addEventListener("mousemove", mt);

                binder.funcMap["mousemove"] = {
                    element: ele,
                    func: mt,
                };
            } else { //移动端
                let enterFlag = false;
                let te = (ev: TouchEvent) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData) {
                        let rect = ele.getBoundingClientRect();
                        enterFlag = touchData.pageX >= rect.x && touchData.pageX <= rect.x + rect.width && touchData.pageY >= rect.y && touchData.pageY <= rect.y + rect.height;
                    }
                };
                let tm = (ev: TouchEvent) => {
                    let touchData = ev.changedTouches[0];
                    if (touchData) {
                        let rect = ele.getBoundingClientRect();
                        enterFlag = touchData.pageX >= rect.x && touchData.pageX <= rect.x + rect.width && touchData.pageY >= rect.y && touchData.pageY <= rect.y + rect.height;
                        if (enterFlag) {
                            cb(<any>this.createTouchData(
                                touchData.pageX,
                                touchData.pageY,
                                touchData.pageX - rect.x,
                                touchData.pageY - rect.y,
                                ev
                            ));
                        }
                    }
                };
                document.body.addEventListener("touchmove", tm);
                document.body.addEventListener("touchstart", te);
                document.body.addEventListener("touchend", te);
                binder.funcMap["touchmove"] = {
                    element: document.body,
                    func: tm,
                };
                binder.funcMap["touchstart"] = {
                    element: document.body,
                    func: te,
                };
                binder.funcMap["touchend"] = {
                    element: document.body,
                    func: te,
                };
            }
        }
        return binder;
    }

    /**
     * 清除指定element监听事件
     * @param binder 监听器对象
     */
    public removeElementEventListener<K extends keyof ElementInputMap, F extends ElementInputMap[K]>(binder: ElementEventBinder<ElementInputMap, K, F>) {
        let list = this.elementBindMap.get(binder.key);
        if (list) {
            if (list.length > 0) {
                list.splice(list.indexOf(binder), 1);
                this.removeElementBinder(binder);
            }

            if (list.length == 0) {
                this.elementBindMap.delete(binder.key);
            }
        }
    }

    /**
     * 清除指定key的所有原生element监听事件
     * @param key 事件名称
     */
    public removeAllElementEventListener<K extends keyof ElementInputMap>(key: K) {
        let list = this.elementBindMap.get(key);
        if (list) {
            for (const binder of list) {
                this.removeElementBinder(binder);
            }
            this.elementBindMap.delete(key);
        }
    }

    /**
     * 清除所有原生element监听事件
     */
    public clearElementEventListener() {
        this.elementBindMap.forEach((list) => {
            for (const binder of list) {
                this.removeElementBinder(binder);
            }
        })
        this.elementBindMap.clear();
    }

    /**
     * 创建事件工厂, 方便统一销毁事件对象
     */
    public createElementEventFactory(): ElementEventFactory {
        return new ElementEventFactory();
    }

    /**
     * 获取当前事件管理器绑定状态
     */
    public getState() {
        let eventMap: any = {}
        let elementEventMap: any = {}
        let size1 = 0;
        let size2 = 0;
        this.bindMap.forEach((item, key) => {
            size1 += item.length;
            eventMap[key] = item.length;
        });
        this.elementBindMap.forEach((item, key) => {
            size2 += item.length;
            eventMap[key] = item.length;
        });
        return {
            eventSize: size1,
            eventMap,
            elementEventSize: size2,
            elementEventMap,
        }
    }

    public onStart(app: m4m.framework.application) {
        this._engineApp = app;
        this._inputMgr = app.getInputMgr();

        //记录全局鼠标全局坐标
        if (this.platformType == PlatformType.PC) {
            document.body.addEventListener("mousemove", ev => {
                this._globalTouchPos.x = ev.pageX;
                this._globalTouchPos.y = ev.pageY;
            });
        } else {
            document.body.addEventListener("touchmove", ev => {
                let touchData = ev.changedTouches[0];
                if (touchData) {
                    this._globalTouchPos.x = touchData.pageX;
                    this._globalTouchPos.y = touchData.pageY;
                }
            });
        }

    }

    public onUpdate(delta: number) {

        let ea = EditorApplication.Instance;
        if (ea.isPlay) {
            return;
        }
        
        this._isTouchPressed = false;
        
        
        let touchPos: Ivec2;
        let down: boolean;

        let moveFlag: boolean;
        let moveViewFlag: boolean;
        let movePlayerFlag: boolean;

        if (this._platformType == PlatformType.Android || this._platformType == PlatformType.IOS) { //安卓平台, ios平台
            let touch = this._inputMgr.touches[0];
            down = touch != null && touch.touch;
            touchPos = touch;

            moveFlag = down;
            moveViewFlag = down;
            movePlayerFlag = down;
            
        } else { //pc平台
            let left = this._inputMgr.isPressed(0);
            let right = this._inputMgr.isPressed(2);
            down = left || right;
            touchPos = this._inputMgr.point;

            moveFlag = down;
            moveViewFlag = right;
            movePlayerFlag = right;
        }

        //计算 Down, Ckick, Up 事件
        if (!this._inputClickDown && down) {
            this._inputClickDown = true;
            this._isTouchPressed = true;

            this._inputCkickFlag = true;
            this._inputTouchStartPos = new m4m.math.vector2(touchPos.x, touchPos.y);
            this._inputTouchPrevPos = new m4m.math.vector2(touchPos.x, touchPos.y);
            //派发触摸按下事件
            this.emitEvent("TouchDown", callback => callback());
        } else if (this._inputClickDown && !down) {
            //是否能触发click事件
            if (this._inputCkickFlag) {
                this.emitEvent("TouchClick", callback => callback()); 
            }
            
            this._inputClickDown = false;
            //派发触摸抬起事件
            this.emitEvent("TouchUp", callback => callback());
            this._inputCkickFlag = false;
            this._inputTouchStartPos = null;
            this._inputTouchPrevPos = null;
        }
        
        //计算 delta
        if (this._inputClickDown && !this._isTouchPressed) {
            m4m.math.vec2Subtract(touchPos, this._inputTouchPrevPos, this._inputTouchDeltaPos);
            m4m.math.vec2Clone(touchPos, this._inputTouchPrevPos);
            if (this._inputTouchDeltaPos.x != 0 || this._inputTouchDeltaPos.y != 0) {
                this._inputCkickFlag = false;
            }
        } else {
            m4m.math.vec2Set(this._inputTouchDeltaPos, 0, 0);
        }
        
        //触摸移动
        if (moveFlag) {
            let deltaPos = this._inputTouchDeltaPos;
            if (deltaPos.x != 0 || deltaPos.y != 0) {
                //派发触摸移动事件
                this.emitEvent("TouchMove", callback => callback(deltaPos.x, deltaPos.y));
            }
        }
        
        //视角移动
        if (moveViewFlag) {
            let deltaPos = this._inputTouchDeltaPos;
            if (deltaPos.x != 0 || deltaPos.y != 0) {
                //派发触摸视角移动事件
                this.emitEvent("TouchViewMove", callback => callback(deltaPos.x, deltaPos.y));
            }
        }
        //方向移动
        if (movePlayerFlag) {
            let axis = new vector3();
            axis.x = this._inputMgr.GetKeyDown(m4m.event.KeyCode.KeyD) - this._inputMgr.GetKeyDown(m4m.event.KeyCode.KeyA);
            axis.y = this._inputMgr.GetKeyDown(m4m.event.KeyCode.KeyE) - this._inputMgr.GetKeyDown(m4m.event.KeyCode.KeyQ);
            axis.z = this._inputMgr.GetKeyDown(m4m.event.KeyCode.KeyW) - this._inputMgr.GetKeyDown(m4m.event.KeyCode.KeyS);
            if (axis.x != 0 || axis.y != 0 || axis.z != 0) {
                m4m.math.vec2Normalize(axis, axis);
                axis.x *= this._playerMoveSpeed;
                axis.y *= this._playerMoveSpeed;
                axis.z *= this._playerMoveSpeed;
                if (this._inputMgr.GetKeyDown(m4m.event.KeyCode.ShiftLeft)) {
                    axis.x *= 5;
                    axis.y *= 5;
                    axis.z *= 5;
                }
                this.emitEvent("PlayerMove", callback => callback(axis));
                this._playerMoveSpeed *= 1.011;
            } else {
                this._playerMoveSpeed = 1;
            }
        } else {
            this._playerMoveSpeed = 1;
        }

        //缩放
        if (this._inputMgr.wheel != 0) {
            this.emitEvent("TouchScale", callback => callback(this._inputMgr.wheel));
        }
    }

    public isClosed(): boolean {
        return false;
    }

    private removeElementBinder<K extends keyof ElementInputMap, F extends ElementInputMap[K]>(binder: ElementEventBinder<ElementInputMap, K, F>) {
        let map = binder.funcMap;
        for (const key in map) {
            let item = map[key];
            if (item.element) {
                item.element.removeEventListener(key as any, item.func as any);
            }
        }
    }

    private createTouchData(x: number, y: number, offsetX: number, offsetY: number, event: Event,): TouchPosition {
        return {
            x, y, offsetX, offsetY, event
        };
    }
}
