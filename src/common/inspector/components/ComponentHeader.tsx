import {
    MoreOutlined,
    NodeExpandOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import {IComponentData} from "./Component";
import {Checkbox} from "antd";
import {ContextMenuManager} from "../../contextMenu/ContextMenuManager";
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;
import INodeComponent = m4m.framework.INodeComponent;
import I2DComponent = m4m.framework.I2DComponent;
import {Utils} from "../../../Game/Utils";

function clickMoreOutlined(element: HTMLDivElement, e: MouseEvent, data: IComponentData) {
    console.error("打开menu")
    ContextMenuManager.showContextMenu({
        x: e.pageX,
        y: e.pageY,
        items: [
            {
                title: "Remove Component",
                onClick(e) {
                    let component = data.component;
                    //console.log("删除组件: ", Utils.getName(component));
                    if (component instanceof transform || component instanceof transform2D) {
                        console.error("不能移除 transform 和 transform2D 组件")
                    } else {
                        if (component["gameObject"]) { //INodeComponent
                            let com = component as INodeComponent;
                            com.gameObject.removeComponent(com);
                        } else { //I2DComponent
                            let com = component as I2DComponent;
                            com.transform.removeComponent(com);
                        }
                    }
                }
            }
        ]
    })
}

export function ComponentHeader(data: IComponentData) {

    return (
        <div className="p-box">
            <div className="p-con-1">
                <div className="p-1">
                    {
                        data.ticon
                    }
                </div>
                {
                    data.enable != null &&
                    (<Checkbox
                        defaultChecked={data.enable}
                        style={{
                            marginRight: "5px"
                        }}
                        onClick={e => e.stopPropagation()}
                    ></Checkbox>)
                }
                <div className="p-2">{data.title}</div>
            </div>
            <div className="p-con-2" onClick={e => e.stopPropagation()}>
                {/* 未实现的功能屏蔽: 组件上的按钮 */}
                {/* <div className="p-con-2-1" onClick={() => {
                }}>
                    <QuestionCircleOutlined className="questionC"/>
                </div>
                <div className="p-con-2-2" onClick={() => {
                }}>
                    <NodeExpandOutlined className="nodeE"/>
                </div> */}
                <div className="p-con-2-3" ref={(ele) => {
                    if (ele) {
                        ele.onclick = (e) => {
                            clickMoreOutlined(ele, e, data);
                        }
                    }
                }}>
                    <MoreOutlined className="moreO"/>
                </div>
            </div>
        </div>
    )
}