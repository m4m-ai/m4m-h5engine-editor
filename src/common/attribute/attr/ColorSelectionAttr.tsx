import React, { useEffect, useState } from "react";
import { EditorEventMgr } from "../../../Game/Event/EditorEventMgr";
import { IAttrComponent, IAttributeData } from "../Attribute";
import color = m4m.math.color;
import { WindowManager } from "../../window/WindowManager";
import ModalColor from "../../inspector/ModalColor";

let colorWindowId: number = -1;

export function ColorSelectionAttr(data: IAttrComponent<color>) {

    const [col, setCol] = useState(new color(data.attrValue.r, data.attrValue.g, data.attrValue.b, data.attrValue.a));
    
    useEffect(() => {
        data.setRefresh(setCol);

        setCol(new color(data.attrValue.r, data.attrValue.g, data.attrValue.b, data.attrValue.a));
    }, [data]);

    const showModal = () => {
        if (colorWindowId != -1) {
            return;
        }
        console.log("数据: ", col);
        
        let colors: m4m.math.color[];
        colorWindowId = WindowManager.createWindow({
            body: (
                <ModalColor
                    color={[col]}
                    setColor={(data) => {
                        colors = data;
                    }}
                    handleCancel={() => {
                        WindowManager.closeWindow(colorWindowId);
                        colorWindowId = -1;
                    }}
                    handleOk={() => {
                        WindowManager.closeWindow(colorWindowId);
                        colorWindowId = -1;
                        if (colors && colors.length > 0) {
                            let item = colors[0];
                            data.onChange(new m4m.math.color(item.r, item.g, item.b, item.a));
                            setCol(new color(item.r, item.g, item.b, item.a));
                        }
                    }}/>
            ),
            onCloseBtnClick() {
                colorWindowId = -1;
            },
            width: 700,
            height: 500,
            minWidth: 820,
            minHeight: 540,
            title: "颜色提取器",
        })
    }

    // const [bgColor, setBgColor] = useState('#000')
    // const [tranPer, setTranPer] = useState(40)


    return (
        <div style={{width: '100%'}} onClick={showModal}>
            <div className="color-box">
                <div className="color-content">
                    <div className="color-selected" style={{ backgroundColor: `rgb(${col.r * 255}, ${col.g * 255}, ${col.b * 255})` }}></div>
                    <div className="color-transparency" style={{ width: `${col.a * 100}%` }}></div>
                </div>
                <div className="color-pen flex-middle">P</div>
            </div>
        </div>
    )
}