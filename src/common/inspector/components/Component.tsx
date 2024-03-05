import React from 'react';
import {Collapse} from "antd";
import {
    CaretRightOutlined,
} from "@ant-design/icons";
import {ComponentHeader} from "./ComponentHeader";
import INodeComponent = m4m.framework.INodeComponent;
import I2DComponent = m4m.framework.I2DComponent;
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;
import {IAttributeData} from "../../attribute/Attribute";
import {AttributeManager} from "../../attribute/AttributeManager";

export interface IComponentData {
    ticon: JSX.Element,
    title: string;
    component: INodeComponent | I2DComponent | transform | transform2D;
    /** 传null表示不显示checkbox */
    enable: boolean | null;
    attrs: IAttributeData[],
}

/**
 * GameObject绑定的组件
 * @constructor
 */
export function Component(data: IComponentData) {
    return (
        <Collapse
            bordered={false}
            defaultActiveKey={data.attrs.length > 0 ? '1' : '0'}
            expandIcon={({isActive}) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0}/>
            )}
        >
            <Collapse.Panel header={ComponentHeader(data)} key="1">
                {
                    AttributeManager.getAttributeList(data.attrs)
                }
            </Collapse.Panel>
        </Collapse>
    )
}