import {
    MoreOutlined,
    NodeExpandOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import {IComponentData} from "./Component";
import {Checkbox} from "antd";

import { MOContextMenu } from './MOContextMenu'
import { useContextMenu } from 'react-contexify'


export function ComponentHeader(data: IComponentData) {
    const menuId = 'MoreOutlined'

    const {show} = useContextMenu({
        id: menuId
      })
    
    const clickMoreOutlined = (event) => {
        show(event, {
            props: ''
        })
    }
    

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
                <div className="p-con-2-3" onClick={(e) => clickMoreOutlined(e)}>
                    <MoreOutlined className="moreO"/>
                </div>
            </div>
            <MOContextMenu component={data.component} menuId={menuId}></MOContextMenu>
        </div>
    )
}