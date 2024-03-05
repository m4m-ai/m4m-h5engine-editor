import { Tooltip } from "antd";
import React from "react";

export function Item(props) {

    const showToolTip = (e)=>{
        if(e.target.clientWidth >= e.target.scrollWidth) {
            e.target.style.pointerEvents = 'none'
        }
    }
    
    return (
        <div className="react-contexify__item" onClick={props.onClick}>
            <Tooltip title={props.title}>
                <div onMouseEnter={showToolTip} className="context-menu item react-contexify__item__content">
                    {props.title}
                </div>
            </Tooltip>
        </div>
    )
}