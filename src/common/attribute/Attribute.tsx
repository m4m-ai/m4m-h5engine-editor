import "./Attribute.css"
import React from "react";
import { AttributeManager } from "./AttributeManager";
import { createTrack } from "../timeline/timeline";

/**
 * 属性数据接口
 */
export interface IAttributeData {
    /** 显示文本 */
    title: string;
    /** 类型 */
    type: string;
    /** 字段描述 */
    describe?: string;
    /** 右侧组件宽度, 默认 70% */
    rightWidth?: string;
    /** 传入attr组件的数据 */
    attr?: IAttrComponent;
}

/**
 * 属性组件数据接口
 */
export interface IAttrComponent {
    /** 设置刷新函数 */
    setRefresh: (func: Function) => void;
    /** 值改变时调用, 子类提供回调数据 */
    onChange: Function;
    /** 是否禁用, 默认 false */
    disable?: boolean;
    /** 其他扩展属性, 需子类提供 */
    [key: string]: any;
}

/**
 * 组件属性
 * @param data
 */
export function Attribute(data: IAttributeData) {
    return (
        // <div className="camera-content" onClick={() => createTrack(data)}>
        <div className="camera-content">
            <div title={data.describe ?? ""} dangerouslySetInnerHTML={{ __html: data.title }}></div>
            {
                (data.attr) &&
                <div className="camera-content-right" style={data.rightWidth != undefined ? { width: data.rightWidth } : {}}>
                    {
                        AttributeManager.getAttribute(data.type, data.attr)
                    }
                </div>
            }
        </div>
    )
}