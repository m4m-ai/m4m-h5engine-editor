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
import { Utils } from "../Utils";
import { ComponentFieldEnum } from "./ComponentFieldEnum";
import transform2D = m4m.framework.transform2D;
import transform = m4m.framework.transform;
import { EditorApplication } from "../EditorApplication";
import INodeComponent = m4m.framework.INodeComponent;
import I2DComponent = m4m.framework.I2DComponent;
import vector2 = m4m.math.vector2;
import vector3 = m4m.math.vector3;
import border = m4m.math.border;
import { ComponentFieldHandler } from "./ComponentFieldHandler";
import { ComponentFieldMapping } from "./ComponentFieldMapping";
import { CustomFieldsHandler } from "./CustomFieldsHandler";

export interface IComponentInfo {
    title: string;
    name: string;
    type: "2D" | "3D";
    assembly: string;
    classInfo: { new(): INodeComponent | I2DComponent };
    /** 包含的字段 */
    fields: IComponentFieldInfo[];
}

export interface IComponentFieldInfo {
    /** 字段名称 */
    name: string;
    /** 字段在编辑器中显示的名称 */
    title: string;
    /** 组件类型 */
    type: ComponentFieldEnum;
    /** 默认值 */
    defaultValue: any;
    /** 是否是引用类型 */
    isRef: boolean;
    /** 是否是数组 */
    isArray: boolean;
}

/**
 * 编辑器中的组件管理对象
 */
export class EditorComponentMgr {

    private static readonly _component2d: Map<string, IComponentInfo> = new Map<string, IComponentInfo>();
    private static readonly _component3d: Map<string, IComponentInfo> = new Map<string, IComponentInfo>();

    private static readonly _componentFiled: Map<string, ComponentFieldHandler<any>> = new Map<string, ComponentFieldHandler<any>>();

    /**
     * 获取所有2D组件
     * @constructor
     */
    public static getAll2DComponents(): IComponentInfo[] {
        return Array.from(this._component2d.values());
    }

    /**
     * 获取所有3D组件
     * @constructor
     */
    public static getAll3DComponents(): IComponentInfo[] {
        return Array.from(this._component3d.values());
    }

    /**
     * 获取 组件 数据
     * @param name 组件名称
     */
    public static getComponentInfo(name: string): IComponentInfo {
        if (this._component2d.has(name)) {
            return this._component2d.get(name);
        }
        if (this._component3d.has(name)) {
            return this._component3d.get(name);
        }
        return null;
    }

    /**
     * 往 trans2D 上挂载2D组件, 并初始化默认值
     * @param trans trans对象
     * @param componentName 组件名称
     */
    public static mountComponent2D(trans: transform2D, componentName: string): I2DComponent {
        let info: IComponentInfo = this._component2d.get(componentName);
        if (!info) {
            return;
        }
        let component = new info.classInfo() as I2DComponent;
        this.componentSetValue(component, info);

        trans.addComponentDirect(component);
        if (!EditorApplication.Instance.isPlay && component instanceof m4m.framework.behaviour2d) {
            component.enabled = false;
        }
        return component;
    }

    /**
     * 往 trans 上挂载组件, 并初始化默认值
     * @param trans trans对象
     * @param componentName 组件名称
     */
    public static mountComponent3D(trans: transform, componentName: string): INodeComponent {
        let info: IComponentInfo = this._component3d.get(componentName);
        if (!info) {
            return;
        }
        let component = new info.classInfo() as INodeComponent;
        this.componentSetValue(component, info);

        trans.gameObject.addComponentDirect(component);
        if (!EditorApplication.Instance.isPlay && component instanceof m4m.framework.behaviour) {
            component.enabled = false;
        }
        return component;
    }

    /**
     * 初始化默认组件, 该函数必须在加载用户脚本之前调用
     */
    public static initComponent() {
        // //初始化组件字段配置
        // for (let key in ComponentFieldMapping) {
        //     let item = ComponentFieldMapping[key];
        //     this.registerComponentField(key, item);
        // }
        
        //临时处理, 在 m4m.m4m_reflect_root 下寻找组件数据
        let gdmeta = m4m.m4m_reflect_root.__gdmeta__;
        for (let key in gdmeta) {
            let item = gdmeta[key];
            if (!item.__gdmeta__) {
                continue;
            }
            let gmmeta = item.__gdmeta__;
            let cls = gmmeta.class;
            if (cls && cls.custom) {
                let custom = cls.custom;
                if (custom["nodecomp"]) { //3d组件
                    let fields: IComponentInfo["fields"] = this.getFields(gmmeta);
                    CustomFieldsHandler(cls.typename, fields);
                    this._component3d.set(cls.typename, {
                        type: "3D",
                        name: cls.typename,
                        title: Utils.convertName(cls.typename),
                        classInfo: item.constructor,
                        assembly: "engine",
                        fields
                    });
                } else if (custom["2dcomp"]) { //2d组件
                    let fields: IComponentInfo["fields"] = this.getFields(gmmeta);
                    CustomFieldsHandler(cls.typename, fields);
                    this._component2d.set(cls.typename, {
                        type: "2D",
                        name: cls.typename,
                        title: Utils.convertName(cls.typename),
                        classInfo: item.constructor,
                        assembly: "engine",
                        fields
                    });
                }
            }
        }
    }

    /**
     * 卸载组件
     */
    public static uninstallComponents(assembly: string) {
        let gdmeta = m4m.m4m_reflect_root.__gdmeta__;

        //先卸载所有 assembly 下的模块
        this._component2d.forEach((value, key) => {
            if (value.assembly == assembly) {
                this._component2d.delete(key);
                delete gdmeta[key];
            }
        });
        this._component3d.forEach((value, key) => {
            if (value.assembly == assembly) {
                this._component3d.delete(key);
                delete gdmeta[key];
            }
        });
    }

    /**
     * 刷新组件数据
     */
    public static refreshComponents(assembly: string) {
        let gdmeta = m4m.m4m_reflect_root.__gdmeta__;
        //临时处理, 在 m4m.m4m_reflect_root 下寻找新组件数据
        for (let key in gdmeta) {
            let item = gdmeta[key];
            if (!item.__gdmeta__) {
                continue;
            }
            let gmmeta = item.__gdmeta__;
            let cls = gmmeta.class;
            if (cls && cls.custom) {
                let custom = cls.custom;
                if (custom["nodecomp"]) { //3d组件
                    if (!this._component3d.has(cls.typename)) {
                        let fields: IComponentInfo["fields"] = this.getFields(gmmeta);
                        CustomFieldsHandler(cls.typename, fields);
                        this._component3d.set(cls.typename, {
                            type: "3D",
                            name: cls.typename,
                            title: Utils.convertName(cls.typename),
                            classInfo: item.constructor,
                            assembly,
                            fields
                        });
                    }
                } else if (custom["2dcomp"]) { //2d组件
                    if (!this._component2d.has(cls.typename)) {
                        let fields: IComponentInfo["fields"] = this.getFields(gmmeta);
                        CustomFieldsHandler(cls.typename, fields);
                        this._component2d.set(cls.typename, {
                            type: "2D",
                            name: cls.typename,
                            title: Utils.convertName(cls.typename),
                            classInfo: item.constructor,
                            assembly,
                            fields
                        });
                    }
                }
            }
        }
        // console.log("所有2d组件: ", this._component2d);
        // console.log("所有3d组件: ", this._component3d);
    }

    /** 
     * 注册字段类型
     */
    public static registerComponentField(fieldType: string, handler: ComponentFieldHandler<any>): void {
        this._componentFiled.set(fieldType, handler);
    }

    /**
     * 
     */
    public static getComponentField() {
        
    }

    /**
     * 设置组件值
     */
    private static componentSetValue(component: INodeComponent | I2DComponent, info: IComponentInfo) {
        //赋默认值
        for (let field of info.fields) {
            if (field.defaultValue != undefined) {
                //默认值
                if (component[field.name] == undefined) {
                    component[field.name] = field.defaultValue;
                }
            }
            //某些类型字段不允许空值
            if (component[field.name] == undefined) {
                switch (field.type) {
                    case ComponentFieldEnum.Vector2:
                        component[field.name] = new vector2();
                        break;
                    case ComponentFieldEnum.Vector3:
                        component[field.name] = new vector3();
                        break;
                    case ComponentFieldEnum.Border:
                        component[field.name] = new border();
                        break;
                    case ComponentFieldEnum.Boolean:
                        component[field.name] = false;
                        break;
                    case ComponentFieldEnum.Float:
                        component[field.name] = 0;
                        break;
                    case ComponentFieldEnum.Integer:
                        component[field.name] = 0;
                        break;
                    case ComponentFieldEnum.String:
                        component[field.name] = "";
                        break;
                }
            }
        }
    }

    /**
     * 获取所有字段描述
     */
    private static getFields(gmmeta) {
        let fields: IComponentInfo["fields"] = [];
        for (let key in gmmeta) {
            let item = gmmeta[key];
            if (item.type == "field") {
                let type: string = item.custom.referenceType == null ? item.custom.valueType : item.custom.referenceType;
                let isArray: boolean = type.endsWith("[]");
                if (isArray) {
                    type = type.substring(0, type.length - 2);
                }
                fields.push({
                    name: key,
                    title: Utils.convertName(key),
                    type: this.mappingType(type),
                    defaultValue: item.custom.defaultValue,
                    isRef: item.custom.referenceType != null,
                    isArray
                })
            }
        }
        return fields;
    }

    //将老编辑器中的字段类型映射到新类型
    private static mappingType(type: string): ComponentFieldEnum {
        switch (type) {
            case "boolean":
                return ComponentFieldEnum.Boolean;
            case "number":
            case "floar":
                return ComponentFieldEnum.Float;
            case "int":
            case "integer":
                return ComponentFieldEnum.Integer;
            case "string":
                return ComponentFieldEnum.String;
            case "vector2":
                return ComponentFieldEnum.Vector2;
            case "vector3":
                return ComponentFieldEnum.Vector3;
            case "border":
                return ComponentFieldEnum.Border;
            case "texture":
                return ComponentFieldEnum.texture;
        }
        console.log("未知映射类型: " + type);
        return ComponentFieldEnum.HideInInspector;
    }
}