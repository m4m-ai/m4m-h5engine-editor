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
import transform = m4m.framework.transform;
import IEditorCode = m4m.framework.IEditorCode;
import transform2D = m4m.framework.transform2D;
import { ValueType } from "./ValueType";
import vector3 = m4m.math.vector3;
import { InspertorMgr } from "./Panel/InspertorMgr";
import { Utils } from "./Utils";
import { EditorEventMgr } from "./Event/EditorEventMgr";
import vector2 = m4m.math.vector2;
import border = m4m.math.border;
import I2DComponent = m4m.framework.I2DComponent;
import { EditorApplication } from "./EditorApplication";
import { TouchPosition } from "./Input/TouchPosition";
import { ElementInputMap } from "./Input/ElementInputMap";
import { EditorAssetInfo } from "./Asset/EditorAssetInfo";
import { FileInfoManager } from "../CodeEditor/code/FileInfoManager";
import INodeComponent = m4m.framework.INodeComponent;

interface PropertyListenerData<T extends (INodeComponent | transform | transform2D | I2DComponent), P extends keyof T> {
    nowData: T[P];
    onChange: (value: T[P]) => void;
    setValue(value: T[P]): void;
    inst: T,
    property: P;
    type: ValueType;
}

/**
 * 编辑器选中对象管理类
 */
export class EditorSelection implements IEditorCode {
    /**
     * 当前选中的transform
     */
    public get activeTransform(): transform | transform2D {
        return this._activeTransform;
    }

    private _activeTransform: transform | transform2D;

    /**
     * 选中的资源
     */
    public get activeAsset() {
        return FileInfoManager.Instance.getFileByKey(this._activeAssetKey);
    }

    private _activeAssetKey: string;

    /**
     * 当前多选的文件
     */
    public get activeAssetList() {
        return this._activeAssetList;
    }
    private readonly _activeAssetList: EditorAssetInfo[] = [];

    /**
     * 当前选中的文件夹
     */
    public get activeFolderPath() {
        return this.activeFolderInfo.relativePath;
    }

    /**
     * 当前选中的文件夹的描述数据
     */
    public get activeFolderInfo(): EditorAssetInfo {
        let manager = FileInfoManager.Instance;
        let result = manager.getDirByKey(this._activeFolderKey);
        if (!result) {
            return manager.rootFolder;
        }
        return result;
    }

    private _activeFolderKey: string;

    private propertyListenerList: PropertyListenerData<any, any>[] = [];

    /**
     * 设置选中的物体
     */
    public setActiveTrans(trans: transform | transform2D) {
        if (trans) {
            this._activeTransform = trans;
            InspertorMgr.ShowInspectorTransfrom(trans as any);
            EditorEventMgr.Instance.emitEvent("OnSelectActiveObject", cb => cb(trans));
        } else {
            this._activeTransform = null;
            InspertorMgr.ClearInspertor();
            this.clearPropertyListener();
            EditorEventMgr.Instance.emitEvent("OnSelectActiveObject", cb => cb(null));
        }
    }

    isClosed(): boolean {
        return false;
    }

    onStart(app: m4m.framework.application): any {

    }

    /**
     * 选中资源
     */
    public setActiveAsset(assetData: EditorAssetInfo) {
        if (assetData) {
            if (this._activeAssetKey != assetData.key) {
                //console.log("选中资源key: ", assetData.key);
                if (assetData.isLeaf || assetData.DirType) { //不是文件夹, 或者是特殊文件夹
                    EditorEventMgr.Instance.emitEvent("ShowInspectorPreview", cb => cb(assetData));
                    this._activeFolderKey = assetData.parentDirInfo.key;
                } else {
                    this._activeFolderKey = assetData.key;
                }
            }
            this._activeAssetKey = assetData.key;
        } else {
            this._activeAssetKey = null;
        }
    }

    /**
     * 设置多选的列表
     */
    public setActiveAssetList(list: EditorAssetInfo[]) {
        this._activeAssetList.length = 0;
        if (list != null && list.length > 0) {
            this._activeAssetList.push(...list);
        }
    }

    /**
     * 拖拽资源操作, 返回高阶函数, 用于拖拽事件的回调
     */
    public dragAsset(resData: EditorAssetInfo): ElementInputMap["TouchDrag"] {
        return (touch: TouchPosition, state: number) => {
            if (state == 0) {
                EditorEventMgr.Instance.emitEvent("OnDragAsset", cb => cb(resData, {
                    key: resData.key,
                }, 0));
            } else if (state == 1) {

            } else if (state == 2) {
                EditorEventMgr.Instance.emitEvent("OnDragAsset", cb => cb(resData, {
                    key: resData.key,
                }, 1));
            }
        }
    }

    /**
     * 拖拽 transfrom 操作, 返回高阶函数, 用于拖拽事件的回调
     */
    public dragTrans(trans: transform | transform2D): ElementInputMap["TouchDrag"] {
        return (touch: TouchPosition, state: number) => {
            if (state == 0) {
                EditorEventMgr.Instance.emitEvent("OnDragTrans", cb => cb(trans, 0));
            } else if (state == 1) {

            } else if (state == 2) {
                EditorEventMgr.Instance.emitEvent("OnDragTrans", cb => cb(trans, 1));
            }
        }
    }

    onUpdate(delta: number): any {
        if (this._activeTransform) {
            if (this._activeTransform.beDispose) { //已经被释放了
                this.setActiveTrans(null);
            } else {
                //遍历属性列表, 看其是否有变化
                for (let i = 0; i < this.propertyListenerList.length; i++) {
                    let item = this.propertyListenerList[i];
                    let data = item.inst[item.property];
                    let change: boolean = false;
                    switch (item.type) {
                        case ValueType.vector3:
                            let newData = new vector3(Utils.number(data.x), Utils.number(data.y), Utils.number(data.z));
                            if (newData.x != item.nowData.x || newData.y != item.nowData.y || newData.z != item.nowData.z) {
                                item.nowData = newData;
                                item.onChange(newData);
                            }
                            break;
                        case ValueType.vector2:
                            let vec2Data = new vector2(Utils.number(data.x), Utils.number(data.y));
                            if (vec2Data.x != item.nowData.x || vec2Data.y != item.nowData.y) {
                                item.nowData = vec2Data;
                                item.onChange(vec2Data);
                            }
                            break;
                        case ValueType.border:
                            if (data.l != item.nowData.l) {
                                item.nowData.l = data.l;
                                change = true;
                            }
                            if (data.t != item.nowData.t) {
                                item.nowData.t = data.t;
                                change = true;
                            }
                            if (data.r != item.nowData.r) {
                                item.nowData.r = data.r;
                                change = true;
                            }
                            if (data.b != item.nowData.b) {
                                item.nowData.b = data.b;
                                change = true;
                            }
                            if (change) {
                                item.onChange(data);
                            }
                            break;
                        case ValueType.layout:
                            let trans2d = item.inst as transform2D;
                            //切换布局
                            if (data != item.nowData.layoutState) {
                                item.nowData.layoutState = data;
                                change = true;

                                let parent = trans2d.parent;
                                let x = trans2d.localTranslate.x;
                                let y = trans2d.localTranslate.y;

                                let leftFlag = (trans2d.layoutState & m4m.framework.layoutOption.LEFT) != 0;
                                let h_centerFlag = (trans2d.layoutState & m4m.framework.layoutOption.H_CENTER) != 0;
                                let rightFlag = (trans2d.layoutState & m4m.framework.layoutOption.RIGHT) != 0;
            
                                let topFlag = (trans2d.layoutState & m4m.framework.layoutOption.TOP) != 0;
                                let v_centerFlag = (trans2d.layoutState & m4m.framework.layoutOption.V_CENTER) != 0;
                                let bottomFlag = (trans2d.layoutState & m4m.framework.layoutOption.BOTTOM) != 0;
            
                                if (leftFlag) {
                                    let leftLayVal = x + parent.pivot.x * parent.width - trans2d.pivot.x * trans2d.width;
                                    item.nowData["LEFT"] = leftLayVal;
                                    trans2d.setLayoutValue(m4m.framework.layoutOption.LEFT, leftLayVal);
                                }

                                if (h_centerFlag) {
                                    let h_centerLayVal = x - parent.width / 2 + trans2d.width / 2 + parent.pivot.x * parent.width - trans2d.pivot.x * trans2d.width;
                                    item.nowData["H_CENTER"] = h_centerLayVal;
                                    trans2d.setLayoutValue(m4m.framework.layoutOption.H_CENTER, h_centerLayVal);
                                }

                                if (rightFlag) {
                                    let rightLayVal=parent.width - trans2d.width - x - parent.pivot.x * parent.width + trans2d.pivot.x * trans2d.width;
                                    item.nowData["RIGHT"] = rightLayVal;
                                    trans2d.setLayoutValue(m4m.framework.layoutOption.RIGHT, rightLayVal);
                                }

                                if (topFlag) {
                                    let topLayVal=y + parent.pivot.y * parent.height - trans2d.pivot.y * trans2d.height;
                                    item.nowData["TOP"] = topLayVal;
                                    trans2d.setLayoutValue(m4m.framework.layoutOption.TOP, topLayVal);
                                }

                                if (v_centerFlag) {
                                    let v_centerLayVal=y - parent.height / 2 + trans2d.height / 2 + parent.pivot.y * parent.height - trans2d.pivot.y * trans2d.height;
                                    item.nowData["V_CENTER"] = v_centerLayVal;
                                    trans2d.setLayoutValue(m4m.framework.layoutOption.V_CENTER, v_centerLayVal);
                                }

                                if (bottomFlag) {
                                    let bottomLayVal=parent.height - trans2d.height - y - parent.pivot.y * parent.height + trans2d.pivot.y * trans2d.height;
                                    item.nowData["BOTTOM"] = bottomLayVal;
                                    trans2d.setLayoutValue(m4m.framework.layoutOption.BOTTOM, bottomLayVal);
                                }
                                let disVal:boolean=true;
                                if (!leftFlag && !topFlag && !h_centerFlag && !rightFlag && !v_centerFlag && !bottomFlag) {
                                    disVal = false;
                                }
                                //Position 输入框状态更新
                                EditorEventMgr.Instance.emitEvent("OnTrans2DDisableUpDate", f => f("Position",disVal));
                            }
                            //场景中拖动或属性栏中改动布局的参数值
                            let leftNum = trans2d.getLayoutValue(m4m.framework.layoutOption.LEFT);
                            if (item.nowData["LEFT"] != leftNum) {
                                item.nowData["LEFT"] = leftNum;
                                change = true;
                            }
                            let centerNum = trans2d.getLayoutValue(m4m.framework.layoutOption.H_CENTER);
                            if (item.nowData["H_CENTER"] != centerNum) {
                                item.nowData["H_CENTER"] = centerNum;
                                change = true;
                            }
                            let rightNum = trans2d.getLayoutValue(m4m.framework.layoutOption.RIGHT);
                            if (item.nowData["RIGHT"] != rightNum) {
                                item.nowData["RIGHT"] = rightNum;
                                change = true;
                            }
                            let topNum = trans2d.getLayoutValue(m4m.framework.layoutOption.TOP);
                            if (item.nowData["TOP"] != topNum) {
                                item.nowData["TOP"] = topNum;
                                change = true;
                            }
                            let middleNum = trans2d.getLayoutValue(m4m.framework.layoutOption.V_CENTER);
                            if (item.nowData["V_CENTER"] != middleNum) {
                                item.nowData["V_CENTER"] = middleNum;
                                change = true;
                            }
                            let bottomNum = trans2d.getLayoutValue(m4m.framework.layoutOption.BOTTOM);
                            if (item.nowData["BOTTOM"] != bottomNum) {
                                item.nowData["BOTTOM"] = bottomNum;
                                change = true;
                            }
                            if (change) {
                                item.onChange(item.nowData);
                            }
                            break;
                        default:
                            if (data != item.nowData) {
                                item.nowData = data;
                                item.onChange(data);
                            }
                    }
                }
            }
        }
    }

    /**
     * 添加属性数据监听, 主要用于 Inspector 面板数据双向绑定, 返回的函数为设置被监听属性的函数, 如果需要设置该属性, 必须调用该函数
     * @param inst 被监听的实例对象
     * @param property 属性名称
     * @param type 数据类型
     * @param onChange 当数据改变时的回调函数
     */
    public addPropertyListener<T extends (INodeComponent | transform | transform2D | I2DComponent), P extends keyof T>(inst: T, property: P, type: ValueType, onChange: (value: T[P]) => void): (v: T[P]) => void {
        if (this._activeTransform == null) {
            return;
        }
        let nowData: any;
        if (type == ValueType.vector3) {
            let v3: any = inst[property];
            if (v3) {
                nowData = new vector3(v3.x, v3.y, v3.z)
            } else {
                nowData = new vector3();
            }
        } else if (type == ValueType.vector2) {
            let v3: any = inst[property];
            if (v3) {
                nowData = new vector2(v3.x, v3.y);
            } else {
                nowData = new vector2();
            }
        } else if (type == ValueType.border) {
            let bor: any = inst[property];
            if (bor) {
                nowData = new border(bor.l, bor.t, bor.r, bor.b);
            } else {
                nowData = new border();
            }
        } else if (type == ValueType.layout) {
            //布局的特殊使用
            nowData = this.getLayoutAttrData(inst, property);
        } else {
            nowData = inst[property];
        }
        let bindData: PropertyListenerData<T, P> = {
            nowData,
            inst,
            property,
            type,
            onChange,
            setValue(value: T[P]) {
                if (type == ValueType.layout) {
                    let layoutData = EditorApplication.Instance.selection.getLayoutAttrData(inst, property);
                    inst[property] = value;
                    bindData.nowData = layoutData as any;
                } else {
                    inst[property] = value;
                    bindData.nowData = value;
                }
                if (inst instanceof transform2D) {
                    inst.markDirty();
                } else if (inst instanceof transform) {
                    inst.markDirty();
                } else if ("transform" in inst) {
                    inst.transform.markDirty();
                }
            }
        }
        this.propertyListenerList.push(bindData);
        return bindData.setValue;
    }

    public getLayoutAttrData(inst, property) {
        let layoutState: any = inst[property];
        let nowData = {};
        nowData["layoutState"] = layoutState;
        let trans2d = inst as transform2D;
        nowData["LEFT"] = trans2d.getLayoutValue(m4m.framework.layoutOption.LEFT);
        nowData["H_CENTER"] = trans2d.getLayoutValue(m4m.framework.layoutOption.H_CENTER);
        nowData["RIGHT"] = trans2d.getLayoutValue(m4m.framework.layoutOption.RIGHT);
        nowData["TOP"] = trans2d.getLayoutValue(m4m.framework.layoutOption.TOP);
        nowData["V_CENTER"] = trans2d.getLayoutValue(m4m.framework.layoutOption.V_CENTER);
        nowData["BOTTOM"] = trans2d.getLayoutValue(m4m.framework.layoutOption.BOTTOM);
        return nowData;
    }

    public clearPropertyListener() {
        this.propertyListenerList.length = 0;
    }

}