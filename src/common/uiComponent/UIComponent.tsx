import './UIComponent.css'
import React, {useCallback, useRef} from "react";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {EditorInputMgr} from "../../Game/Input/EditorInputMgr";
import {ComponentItem} from "./ComponentItem";
import {TouchPosition} from "../../Game/Input/TouchPosition";

export function UIComponent() {
    
    let drag1 = useCallback((touch: TouchPosition) => {
        //console.error("pos: ", touch)
    }, [])
    
    return (
        <div className="inspector-box">
            <div className="list" style={{
                width: "100%"
            }}>
                <Input
                    className="console-input2"
                    size="small"
                    placeholder=""
                    prefix={<SearchOutlined className="searchOutl" />}
                />
                <div className="listHeader">UiNode</div>
                <ComponentItem text={"Label"} type={m4m.framework.Primitive2DType.Label}></ComponentItem>
                <ComponentItem text={"Image2D"} type={m4m.framework.Primitive2DType.Image2D}></ComponentItem>
                <ComponentItem text={"RawImage2D"} type={m4m.framework.Primitive2DType.RawImage2D}></ComponentItem>
                <ComponentItem text={"Button"} type={m4m.framework.Primitive2DType.Button}></ComponentItem>
                <ComponentItem text={"Panel"} type={m4m.framework.Primitive2DType.Panel}></ComponentItem>
                <ComponentItem text={"InputField"} type={m4m.framework.Primitive2DType.InputField}></ComponentItem>
                <ComponentItem text={"ProgressBar"} type={m4m.framework.Primitive2DType.Progressbar}></ComponentItem>
                <ComponentItem text={"ScrollView"} type={m4m.framework.Primitive2DType.ScrollRect}></ComponentItem>
            </div>
        </div>
    );
}
