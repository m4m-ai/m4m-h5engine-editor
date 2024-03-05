
import React from "react";
import { Utils } from "../../Game/Utils";
import { SelectAttr } from "./attr/SelectAttr";
import { CheckboxAttr } from "./attr/CheckboxAttr";
import { Vector2Attr } from "./attr/Vector2Attr";
import { Vector3Attr } from "./attr/Vector3Attr";
import { RectAttr } from "./attr/RectAttr";
import { NumberInputAttr } from "./attr/NumberInputAttr";
import { SliderAttr } from "./attr/SliderAttr";
import { StringInputAttr } from "./attr/StringInputAttr";
import { SelectListAttr } from "./attr/SelectListAttr";
import { LayoutSetAttr } from "./attr/LayoutSetAttr";
import { InputGroupAttr } from "./attr/InputGroupAttr";
import { AssetSelectionAttr } from "./attr/AssetSelectionAttr";
import { ColorSelectionAttr } from "./attr/ColorSelectionAttr";
import { Attribute, IAttributeData } from "./Attribute";


/**
 * 通用属性管理器
 */
export class AttributeManager {

    //所有属性数据
    private static _map: { [key: string]: (data: any) => JSX.Element } = {};

    /**
     * 初始化所有属性数据
     */
    public static init() {
        AttributeManager.registerAttribute("select", SelectAttr);
        AttributeManager.registerAttribute("checkbox", CheckboxAttr);
        AttributeManager.registerAttribute(Utils.nameof(m4m.math.vector2), Vector2Attr);
        AttributeManager.registerAttribute(Utils.nameof(m4m.math.vector3), Vector3Attr);
        AttributeManager.registerAttribute(Utils.nameof(m4m.math.rect), RectAttr);
        AttributeManager.registerAttribute("number", NumberInputAttr);
        AttributeManager.registerAttribute("slider", SliderAttr);
        AttributeManager.registerAttribute("string", StringInputAttr);
        AttributeManager.registerAttribute("selectList", SelectListAttr);
        AttributeManager.registerAttribute("layoutSet", LayoutSetAttr);
        AttributeManager.registerAttribute("inputGroup", InputGroupAttr);
        AttributeManager.registerAttribute("asset", AssetSelectionAttr);
        AttributeManager.registerAttribute("color", ColorSelectionAttr);
    }

    /**
     * 注册属性
     * @param typeName 类型名称
     * @param func 属性对应的 react 组件
     */
    public static registerAttribute(typeName: string, func: (data: any) => JSX.Element) {
        if (typeName in this._map) {
            throw new Error("属性类型'" + typeName + "'已经被注册!");
        }
        this._map[typeName] = func;
    }

    /**
     * 根据类型和传入的数据实例化属性组件
     */
    public static getAttribute(typeName: string, data: any): JSX.Element {
        let AttrFunc = this._map[typeName];
        if (AttrFunc) {
            return <AttrFunc {...data}></AttrFunc>;
        }
        throw new Error("未找到对应的属性类型: '" + typeName + "'!");
    }

    /**
     * 根据组件描述数据实例化属性列表
     */
    public static getAttributeList(attrs: IAttributeData[]): JSX.Element {
        return (
            <div className="camera-box">
                {
                    attrs.map((item, index) => {
                        return (
                            <Attribute key={index} {...item}></Attribute>
                        );
                    })
                }
            </div>
        )
    }
}

//初始化所有组件
AttributeManager.init();