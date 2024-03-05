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
import transform2D = m4m.framework.transform2D;
import vector3 = m4m.math.vector3;
import vector2 = m4m.math.vector2;
import INodeComponent = m4m.framework.INodeComponent;
import I2DComponent = m4m.framework.I2DComponent;
import border = m4m.math.border;
import { IComponentData } from "../../common/inspector/components/Component";
import { EditorEventMgr } from "../Event/EditorEventMgr";
import { EditorApplication } from "../EditorApplication";
import { ValueType } from "../ValueType";
import { Utils } from "../Utils";
import { EditorComponentMgr, IComponentFieldInfo } from "../Component/EditorComponentMgr";
import { ComponentFieldEnum } from "../Component/ComponentFieldEnum";
import { IAttrComponent, IAttributeData } from "../../common/attribute/Attribute";
import { ILayoutSetAttrData } from "../../common/attribute/attr/LayoutSetAttr";
import behaviour = m4m.framework.behaviour;
import behaviour2d = m4m.framework.behaviour2d;
import { NumberInputDataType } from "../../common/attribute/attr/NumberInputAttr";
import { AssetData } from "../../common/attribute/attr/AssetSelectionAttr";
import { AssetReference } from "../Asset/AssetReference";
import { FileInfoManager } from "../../CodeEditor/code/FileInfoManager";
import { ElementEventFactory } from "../Input/ElementEventFactory";
import { EventFactory } from "../Event/EventFactory";


export interface IInspertorGameobjectData {
    transform: transform2D | transform;
    visible: boolean,
    onVisibleChange(v: boolean): void;
    name: string,
    isStatic: boolean,
    tag: string,
    layer: number,
    components: IComponentData[];
}

export enum InspertorViewType {
    Hide,
    Transfrom,
    PreviewFile,
}

export class InspertorMgr {

    /**
     * 面板显示类型
     */
    public static ViewType: InspertorViewType = InspertorViewType.Hide;

    public static ClearInspertor() {
        EditorEventMgr.Instance.emitEvent("ClearInspector", f => f());
    }

    private static _currTrans: transform | transform2D;
    private static _eventFactory: EventFactory = EditorEventMgr.Instance.createEventFactory();

    /**
     * 打开属性面板
     * @param trans
     * @constructor
     */
    public static ShowInspectorTransfrom(trans: transform);
    public static ShowInspectorTransfrom(trans: transform2D);
    public static ShowInspectorTransfrom(trans: transform | transform2D) {
        this._eventFactory.removeAllEventListener();

        if (this._currTrans == trans && this.ViewType == InspertorViewType.Transfrom) {
            return;
        }
        EditorApplication.Instance.selection.clearPropertyListener();

        let cms: IComponentData[] = [];
        if (trans instanceof transform) {
            //必须要有transform组件
            cms.push(this.getTransfromData(trans));
            trans.gameObject.components.forEach((item) => {
                cms.push(this.getComponentData(item.comp));
            })
            EditorEventMgr.Instance.emitEvent("ShowInspectorTransfrom", cb => cb({
                transform: trans,
                visible: trans.gameObject.visible,
                onVisibleChange(v) {
                    trans.gameObject.visible = v;
                },
                name: trans.gameObject.getName(),
                isStatic: trans.gameObject.isStatic,
                tag: trans.gameObject.tag,
                layer: trans.gameObject.layer,
                components: cms
            }));
        } else {
            //必须要有transform组件
            cms.push(this.getTransfrom2DData(trans));
            trans.components.forEach((item) => {
                let uiName = Utils.getName(item.comp);
                switch (uiName) {
                    // case "label":
                    //     cms.push(LabelAttributeDataMgr.getLabel2DData(item.comp));
                    //     break;
                    // case "button":
                    //     cms.push(ButtonAttributeDataMgr.getButton2DData(item.comp));
                    //     break;
                    // case "image2D":
                    //     cms.push(ImageAttributeDataMgr.getImage2DData(item.comp));
                    //     break;
                    // case "rawImage2D":
                    //     cms.push(RawAttributeDataMgr.getRaw2DData(item.comp));
                    //     break;
                    // case "inputField":
                    //     cms.push(InputFieldAttributeDataMgr.getInputFieldData(item.comp));
                    //     break;
                    // case "progressbar":
                    //     cms.push(ProgressBarAttributeDataMgr.getProgressBarData(item.comp));
                    //     break;
                    // case "scrollRect":
                    //     cms.push(ScrollViewAttributeDataMgr.getScrollViewData(item.comp));
                    //     break;
                    default:
                        cms.push(this.getComponentData(item.comp));
                }
            })
            EditorEventMgr.Instance.emitEvent("ShowInspectorTransfrom", cb => cb({
                transform: trans,
                visible: trans.visible,
                onVisibleChange(v) {
                    trans.visible = v;
                },
                name: trans.name,
                isStatic: trans.isStatic,
                tag: trans.tag,
                layer: trans.layer,
                components: cms
            }));
        }

        //组件属性样例
        //cms.push(ExampleAttributeDataMgr.getExampleData());

    }

    /**
     * 获取组件属数据, 并为其添加双向绑定事件
     */
    private static getComponentData(component: INodeComponent | I2DComponent | transform | transform2D): IComponentData {
        let name = Utils.getName(component);

        let attrs: IAttributeData<any>[] = [];
        let info = EditorComponentMgr.getComponentInfo(name);

        if (info) {
            for (let field of info.fields) {
                let attributeData = this.getComponentAttributeData(component, field);
                if (attributeData != null) {
                    for (let attributeDatum of attributeData) {
                        if (attributeDatum != null) {
                            attrs.push(attributeDatum);
                        }
                    }
                }
            }
        }

        return {
            enable: (component instanceof behaviour || component instanceof behaviour2d) ? true : null,
            component: component,
            title: Utils.convertName(name),
            ticon: null,
            attrs
        }
    }

    private static getComponentAttributeData(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData[] {

        switch (fieldInfo.type) {
            case ComponentFieldEnum.Float:
                return [this.listeneFloatField(component, fieldInfo)];
            case ComponentFieldEnum.Integer:
                return [this.listeneIntegerField(component, fieldInfo)];
            case ComponentFieldEnum.String:
                return [this.listeneStringField(component, fieldInfo)];
            case ComponentFieldEnum.Boolean:
                return [this.listeneBoolenField(component, fieldInfo)];
            case ComponentFieldEnum.Vector2:
                return [this.listeneVector2Field(component, fieldInfo)];
            case ComponentFieldEnum.Vector3:
                return [this.listeneVector3Field(component, fieldInfo)];
            case ComponentFieldEnum.Rect:
                return [this.listeneRectField(component, fieldInfo)];
            case ComponentFieldEnum.Border:
                return this.listeneBorderField(component, fieldInfo);
            case ComponentFieldEnum.texture:
                return [this.listeneTextureField(component, fieldInfo)];
            case ComponentFieldEnum.sprite:
                return [this.listeneSpriteField(component, fieldInfo)];
            case ComponentFieldEnum.color:
                return [this.listeneColorField(component, fieldInfo)];
        }
        if (fieldInfo.type) {
            console.error("未支持的映射类型: " + fieldInfo.type);
        }

        return null;
    }

    private static listeneStringField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<string>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<string>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.string, (value: string) => {
            if (refreshFunc) {
                refreshFunc(value);
            }
        });

        return {
            type: "string",
            title: fieldInfo.title,
            attr: {
                attrValue: component[fieldInfo.name],
                fieldInfo,
                onChange(value) {
                    setValue(value);
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }

    private static listeneFloatField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<NumberInputDataType>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.number, (value: number) => {
            if (refreshFunc) {
                refreshFunc((oldValue) => {
                    return {
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step,
                        value
                    }
                });
            }
        });

        return {
            type: "number",
            title: fieldInfo.title,
            attr: {
                attrValue: {
                    value: component[fieldInfo.name],
                },
                fieldInfo,
                onChange(value) {
                    setValue(value.value);
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }

    private static listeneIntegerField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<NumberInputDataType>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.number, (value: number) => {
            if (refreshFunc) {
                refreshFunc((oldValue) => {
                    return {
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step,
                        value
                    }
                });
            }
        });

        return {
            type: "number",
            title: fieldInfo.title,
            attr: {
                attrValue: {
                    value: component[fieldInfo.name],
                    integer: true
                },
                fieldInfo,
                onChange(value) {
                    setValue(value.value);
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }



    private static listeneBoolenField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<boolean>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<boolean>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.bool, (value: boolean) => {
            if (refreshFunc) {
                refreshFunc(value);
            }
        });

        return {
            type: "checkbox",
            title: fieldInfo.title,
            attr: {
                attrValue: component[fieldInfo.name],
                fieldInfo,
                onChange(value) {
                    setValue(value);
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }


    private static listeneVector2Field(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo, changeDisable: boolean = false): IAttributeData<IAttrComponent<vector2>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<vector2>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.vector2, (value: vector2) => {
            if (refreshFunc) {
                refreshFunc(new vector2(value.x, value.y));
            }
        });
        let disVal: boolean = false;
        let setDisable: { key: string, value?: (v: boolean) => void } = { key: fieldInfo.title };
        if (changeDisable) {
            this._eventFactory.addEventListener("OnTrans2DDisableUpDate", (key: string, v: boolean) => {
                // console.error(key);
                if (key == setDisable.key) {
                    if (setDisable.value) {
                        setDisable.value(v);
                    }
                }
            });
            if (fieldInfo.title == "Position") {//UI坐标处理
                if (component instanceof transform2D) {
                    // console.error(component.layoutState);
                    let leftFlag = (component.layoutState & m4m.framework.layoutOption.LEFT) != 0;
                    let h_centerFlag = (component.layoutState & m4m.framework.layoutOption.H_CENTER) != 0;
                    let rightFlag = (component.layoutState & m4m.framework.layoutOption.RIGHT) != 0;

                    let topFlag = (component.layoutState & m4m.framework.layoutOption.TOP) != 0;
                    let v_centerFlag = (component.layoutState & m4m.framework.layoutOption.V_CENTER) != 0;
                    let bottomFlag = (component.layoutState & m4m.framework.layoutOption.BOTTOM) != 0;

                    if (!leftFlag && !topFlag && !h_centerFlag && !rightFlag && !v_centerFlag && !bottomFlag) {
                        disVal = false;
                    } else {
                        disVal = true;
                    }
                }
            }
        }

        let v2: vector2 = component[fieldInfo.name];
        return {
            type: "vector2",
            title: fieldInfo.title,
            attr: {
                disable: disVal,
                attrValue: new vector2(v2.x, v2.y),
                fieldInfo,
                onChange(value) {
                    setValue(new vector2(value.x, value.y));
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                },
                setDisableFunc(func) {
                    setDisable.value = func;
                }
            }
        };
    }

    private static listeneVector3Field(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<vector3>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<vector3>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.vector3, (value: vector3) => {
            if (refreshFunc) {
                refreshFunc(new vector3(value.x, value.y, value.z));
            }
        });
        let v3: vector3 = component[fieldInfo.name];
        return {
            type: "vector3",
            title: fieldInfo.title,
            attr: {
                attrValue: new vector3(v3.x, v3.y, v3.z),
                fieldInfo,
                onChange(value) {
                    setValue(new vector3(value.x, value.y, value.z));
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }


    private static listeneRectField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<m4m.math.rect>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<m4m.math.rect>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.rect, (value: m4m.math.rect) => {
            if (refreshFunc) {
                refreshFunc(new m4m.math.rect(value.x, value.y, value.w, value.h));
            }
        });
        let rect: m4m.math.rect = component[fieldInfo.name];
        return {
            type: "rect",
            title: fieldInfo.title,
            attr: {
                attrValue: new m4m.math.rect(rect.x, rect.y, rect.w, rect.h),
                fieldInfo,
                onChange(value) {
                    setValue(new m4m.math.rect(value.x, value.y, value.w, value.h));
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }

    private static listeneBorderField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): (IAttributeData<IAttrComponent<NumberInputDataType>>)[] {
        let borderRefreshL: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let borderRefreshT: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let borderRefreshR: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let borderRefreshB: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let setBorder = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.border, (value: border) => {
            if (borderRefreshL) {
                borderRefreshL((oldValue) => {
                    return {
                        value: value.l,
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step
                    }
                });
            }
            if (borderRefreshT) {
                borderRefreshT((oldValue) => {
                    return {
                        value: value.t,
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step
                    }
                });
            }
            if (borderRefreshR) {
                borderRefreshR((oldValue) => {
                    return {
                        value: value.r,
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step
                    }
                });
            }
            if (borderRefreshB) {
                borderRefreshB((oldValue) => {
                    return {
                        value: value.b,
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step
                    }
                });
            }
        });

        return [
            {
                type: "number",
                title: fieldInfo.title,
                attr: null
            },
            {
                type: "number",
                title: "&nbsp;&nbsp;&nbsp;&nbsp;Border L",
                attr: {
                    attrValue: {
                        value: component[fieldInfo.name].l
                    },
                    fieldInfo,
                    onChange({ value }) {
                        let border = component[fieldInfo.name];
                        border.l = value;
                        setBorder(border);
                        if (component instanceof transform2D) {
                            component.markDirty();
                        }
                    },
                    setRefresh(func) {
                        borderRefreshL = func;
                    }
                }
            },
            {
                type: "number",
                title: "&nbsp;&nbsp;&nbsp;&nbsp;Border T",
                attr: {
                    attrValue: {
                        value: component[fieldInfo.name].t
                    },
                    fieldInfo,
                    onChange({ value }) {
                        let border = component[fieldInfo.name];
                        border.t = value;
                        setBorder(border);
                    },
                    setRefresh(func) {
                        borderRefreshT = func;
                    }
                }
            },
            {
                type: "number",
                title: "&nbsp;&nbsp;&nbsp;&nbsp;Border R",
                attr: {
                    attrValue: {
                        value: component[fieldInfo.name].r
                    },
                    fieldInfo,
                    onChange({ value }) {
                        let border = component[fieldInfo.name];
                        border.r = value;
                        setBorder(border);
                    },
                    setRefresh(func) {
                        borderRefreshR = func;
                    }
                }
            },
            {
                type: "number",
                title: "&nbsp;&nbsp;&nbsp;&nbsp;Border B",
                attr: {
                    attrValue: {
                        value: component[fieldInfo.name].b
                    },
                    fieldInfo,
                    onChange({ value }) {
                        let border = component[fieldInfo.name];
                        border.b = value;
                        setBorder(border);
                    },
                    setRefresh(func) {
                        borderRefreshB = func;
                    }
                }
            }
        ];
    }

    private static listeneTextureField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<AssetData>> {
        let attrValue: AssetData = {
            key: null,
            name: null,
            assetType: ["png", "jpg"]
        }
        let refreshFunc: React.Dispatch<React.SetStateAction<AssetData>> = null;
        let setValue: (data: m4m.framework.texture) => void = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.object, (value: m4m.framework.texture) => {
            if (refreshFunc) {
                let ref: AssetReference = value ? null : value["_ref"];
                if (ref) {
                    refreshFunc({
                        key: ref.key,
                        name: FileInfoManager.Instance.getFileByKey(ref.key).value,
                        assetType: attrValue.assetType
                    });
                } else {
                    refreshFunc(null);
                }
            }
        });
        let texture: m4m.framework.texture = component[fieldInfo.name];
        let ref: AssetReference = texture ? texture["_ref"] : null;
        if (ref) {
            attrValue.key = ref.key;
            attrValue.name = FileInfoManager.Instance.getFileByKey(ref.key).value;
        }
        return {
            type: "asset",
            title: fieldInfo.title,
            attr: {
                attrValue,
                fieldInfo,
                onChange(value) {
                    //加载贴图
                    EditorApplication.Instance.editorResources.loadTextureByKey(value.key, (tex) => {
                        let ref: AssetReference = {
                            key: value.key
                        }
                        tex["_ref"] = ref;
                        setValue(tex);
                    });
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }


    private static listeneSpriteField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<AssetData>> {
        let attrValue: AssetData = {
            key: null,
            name: null,
            assetType: ["png", "jpg"]
        }
        let refreshFunc: React.Dispatch<React.SetStateAction<AssetData>> = null;
        let setValue: (data: m4m.framework.sprite) => void = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.object, (value: m4m.framework.sprite) => {
            if (refreshFunc) {
                let ref: AssetReference = value ? null : value["_ref"];
                if (ref) {
                    refreshFunc({
                        key: ref.key,
                        name: FileInfoManager.Instance.getFileByKey(ref.key).value,
                        assetType: attrValue.assetType
                    });
                } else {
                    refreshFunc(null);
                }
            }
        });
        let sprite: m4m.framework.sprite = component[fieldInfo.name];
        let ref: AssetReference = sprite ? sprite["_ref"] : null;
        if (ref) {
            attrValue.key = ref.key;
            attrValue.name = FileInfoManager.Instance.getFileByKey(ref.key).value;
        }
        return {
            type: "asset",
            title: fieldInfo.title,
            attr: {
                attrValue,
                fieldInfo,
                onChange(value) {
                    //临时处理
                    EditorApplication.Instance.editorResources.getSpriteReference({
                        key: value.key,
                        guid: "",
                    }, false, sp => {
                        if (sp) {
                            sp.use();
                        }
                        let ref: AssetReference = {
                            key: value.key
                        }
                        sp["_ref"] = ref;
                        setValue(sp);
                        if (component instanceof transform2D) {
                            component.markDirty();
                        }
                    })
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }

    private static listeneColorField(component: INodeComponent | I2DComponent | transform | transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<m4m.math.color>> {
        let refreshFunc: React.Dispatch<React.SetStateAction<m4m.math.color>> = null;
        let setValue: (color: m4m.math.color) => void = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.rect, (value: m4m.math.color) => {
            if (refreshFunc) {
                refreshFunc(new m4m.math.color(value.r, value.g, value.b, value.a));
            }
        });
        let color: m4m.math.color = component[fieldInfo.name];
        return {
            type: "color",
            title: fieldInfo.title,
            attr: {
                attrValue: new m4m.math.color(color.r, color.g, color.b, color.a),
                fieldInfo,
                onChange(value) {
                    setValue(new m4m.math.color(value.r, value.g, value.b, value.a));
                    if (component instanceof transform2D) {
                        component.markDirty();
                    }
                },
                setRefresh(func) {
                    refreshFunc = func;
                }
            }
        };
    }

    private static listenelayoutSetField(component: transform2D, fieldInfo: IComponentFieldInfo): IAttributeData<ILayoutSetAttrData> {
        //只有 transform2d 组件才能设置 layout 属性
        if (!(component instanceof transform2D)) {
            return null;
        }
        let layoutArr = this.getLayoutArr(component);

        //设置布局
        let layoutStateRefresh: Function = null;
        let setLayoutState = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.layout, (value) => {
            if (layoutStateRefresh) {

                let chOjb = value;
                let left: boolean = false;
                if ((chOjb.layoutState & m4m.framework.layoutOption.LEFT) > 0) {
                    left = true;
                    // console.error("left ",value);
                }
                let center: boolean = false;
                if ((chOjb.layoutState & m4m.framework.layoutOption.H_CENTER) > 0) {
                    center = true;
                    // console.error("H_center ",value);
                }
                let right: boolean = false;
                if ((chOjb.layoutState & m4m.framework.layoutOption.RIGHT) > 0) {
                    right = true;
                    // console.error("right ",value);
                }
                let top: boolean = false;
                if ((chOjb.layoutState & m4m.framework.layoutOption.TOP) > 0) {
                    top = true;
                    // console.error("top ",value);
                }
                let middle: boolean = false;
                if ((chOjb.layoutState & m4m.framework.layoutOption.V_CENTER) > 0) {
                    middle = true;
                    // console.error("V_center ",value);
                }
                let bottom: boolean = false;
                if ((chOjb.layoutState & m4m.framework.layoutOption.BOTTOM) > 0) {
                    bottom = true;
                    // console.error("bottom ",value);
                }
                let mlayoutArr = [];
                mlayoutArr.push({ checked: left, value: chOjb.LEFT, isshow: this.outisshow(left) });
                mlayoutArr.push({ checked: center, value: chOjb.H_CENTER, isshow: this.outisshow(center) });
                mlayoutArr.push({ checked: right, value: chOjb.RIGHT, isshow: this.outisshow(right) });

                mlayoutArr.push({ checked: top, value: chOjb.TOP, isshow: this.outisshow(top) });
                mlayoutArr.push({ checked: middle, value: chOjb.V_CENTER, isshow: this.outisshow(middle) });
                mlayoutArr.push({ checked: bottom, value: chOjb.BOTTOM, isshow: this.outisshow(bottom) });
                layoutStateRefresh(mlayoutArr);
            }
        });

        return {
            title: "Layout",
            type: "layoutSet",
            attr: {
                attrValue: layoutArr,
                fieldInfo,
                onChange: (valArr) => {
                    let left: m4m.framework.layoutOption;
                    if (valArr[0].checked) {
                        left = m4m.framework.layoutOption.LEFT;
                    }
                    let center: m4m.framework.layoutOption;
                    if (valArr[1].checked) {
                        center = m4m.framework.layoutOption.H_CENTER;
                    }
                    let right: m4m.framework.layoutOption;
                    if (valArr[2].checked) {
                        right = m4m.framework.layoutOption.RIGHT;
                    }
                    let top: m4m.framework.layoutOption;
                    if (valArr[3].checked) {
                        top = m4m.framework.layoutOption.TOP;
                    }
                    let middle: m4m.framework.layoutOption;
                    if (valArr[4].checked) {
                        middle = m4m.framework.layoutOption.V_CENTER;
                    }
                    let bottom: m4m.framework.layoutOption;
                    if (valArr[5].checked) {
                        bottom = m4m.framework.layoutOption.BOTTOM;
                    }

                    setLayoutState(left | center | right | top | middle | bottom);

                    // console.error(component);
                    if (left) {
                        component.setLayoutValue(m4m.framework.layoutOption.LEFT, valArr[0].value);
                    }
                    if (center) {
                        component.setLayoutValue(m4m.framework.layoutOption.H_CENTER, valArr[1].value);
                    }
                    if (right) {
                        component.setLayoutValue(m4m.framework.layoutOption.RIGHT, valArr[2].value);
                    }

                    if (top) {
                        component.setLayoutValue(m4m.framework.layoutOption.TOP, valArr[3].value);
                    }
                    if (middle) {
                        component.setLayoutValue(m4m.framework.layoutOption.V_CENTER, valArr[4].value);
                    }
                    if (bottom) {
                        component.setLayoutValue(m4m.framework.layoutOption.BOTTOM, valArr[5].value);
                    }
                    component.markDirty();
                },
                setRefresh: (refresh) => {
                    layoutStateRefresh = refresh;
                },
            }
        }
    }

    //-----------------------------------------------------------------------------------------------------------------------

    //监听transform的变化
    private static getTransfromData(trans: transform): IComponentData {
        return {
            enable: null,
            title: "Transfrom",
            component: trans,
            ticon: null,
            attrs: [
                this.listeneVector3Field(trans, {
                    title: "Position",
                    name: "localPosition",
                    type: ComponentFieldEnum.Vector3,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listeneVector3Field(trans, {
                    title: "Rotation",
                    name: "localEulerAngles",
                    type: ComponentFieldEnum.Vector3,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listeneVector3Field(trans, {
                    title: "Scale",
                    name: "localScale",
                    type: ComponentFieldEnum.Vector3,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                })
            ]
        }
    }

    //监听transform2d的变化
    private static getTransfrom2DData(trans: transform2D): IComponentData {
        return {
            enable: null,
            title: "Transfrom2D",
            component: trans,
            ticon: null,
            attrs: [
                this.listeneVector2Field(trans, {
                    title: "Position",
                    name: "localTranslate",
                    type: ComponentFieldEnum.Vector2,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }, true),
                this.listeneFloatField(trans, {
                    title: "Rotation",
                    name: "localRotate",
                    type: ComponentFieldEnum.Float,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listeneVector2Field(trans, {
                    title: "Scale",
                    name: "localScale",
                    type: ComponentFieldEnum.Vector2,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listeneFloatField(trans, {
                    title: "Width",
                    name: "width",
                    type: ComponentFieldEnum.Float,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listeneFloatField(trans, {
                    title: "Height",
                    name: "height",
                    type: ComponentFieldEnum.Float,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listeneVector2Field(trans, {
                    title: "Pivot",
                    name: "pivot",
                    type: ComponentFieldEnum.Vector2,
                    defaultValue: undefined,
                    isRef: false,
                    isArray: false,
                }),
                this.listenelayoutSetField(trans, {
                    title: "Layout State",
                    name: "layoutState",
                    type: ComponentFieldEnum.Layout,
                    defaultValue: undefined,
                    isArray: false,
                    isRef: false
                })
            ]
        }
    }

    private static getLayoutArr(trans: transform2D) {
        let left: boolean = false;
        if (trans.layoutState & m4m.framework.layoutOption.LEFT) {
            left = true;
        }
        let center: boolean = false;
        if (trans.layoutState & m4m.framework.layoutOption.H_CENTER) {
            center = true;
        }

        let right: boolean = false;
        if (trans.layoutState & m4m.framework.layoutOption.RIGHT) {
            right = true;
        }

        let top: boolean = false;
        if (trans.layoutState & m4m.framework.layoutOption.TOP) {
            top = true;
        }
        let middle: boolean = false;
        if (trans.layoutState & m4m.framework.layoutOption.V_CENTER) {
            middle = true;
        }
        let bottom: boolean = false;
        if (trans.layoutState & m4m.framework.layoutOption.BOTTOM) {
            bottom = true;
        }

        let layoutArr: { checked: boolean, value: number, isshow: string }[] = [];
        layoutArr.push({
            checked: left,
            value: trans.getLayoutValue(m4m.framework.layoutOption.LEFT),
            isshow: this.outisshow(left)
        });
        layoutArr.push({
            checked: center,
            value: trans.getLayoutValue(m4m.framework.layoutOption.H_CENTER),
            isshow: this.outisshow(center)
        });
        layoutArr.push({
            checked: right,
            value: trans.getLayoutValue(m4m.framework.layoutOption.RIGHT),
            isshow: this.outisshow(right)
        });

        layoutArr.push({
            checked: top,
            value: trans.getLayoutValue(m4m.framework.layoutOption.TOP),
            isshow: this.outisshow(top)
        });
        layoutArr.push({
            checked: middle,
            value: trans.getLayoutValue(m4m.framework.layoutOption.V_CENTER),
            isshow: this.outisshow(middle)
        });
        layoutArr.push({
            checked: bottom,
            value: trans.getLayoutValue(m4m.framework.layoutOption.BOTTOM),
            isshow: this.outisshow(bottom)
        });
        return layoutArr;
    }

    private static outisshow(select: boolean) {
        if (select) {
            return "block";
        }
        return "none";
    }

}