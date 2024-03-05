import React, { useState } from "react";


export function ColorSelectionAttr() {
    const [bgColor, setBgColor] = useState('#000')
    const [tranPer, setTranPer] = useState(40)


    return (
        <div className="color-box">
            <div className="color-content">
                <div className="color-selected" style={{ backgroundColor: bgColor }}></div>
                <div className="color-transparency" style={{ width: `${tranPer}%` }}></div>
            </div>
            <div className="color-pen flex-middle">P</div>
        </div>
    )
}