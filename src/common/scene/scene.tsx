import React from 'react'
import { engineDiv } from '../../index'
import './index.css'
export function Scene() {
    return (
        <>
            {/* 屏蔽功能 */}
            {/* <div className="scene-head">
                    <div className="select-menu">
                    <ToolSetting />
                    <GridSnap />
                    </div>
                    <div className="select-menu">
                    <ViewOptions />
                    </div>
                </div> */}
            <div
                ref={element => {
                    element?.appendChild(engineDiv)
                }}
            ></div>
        </>
    )
}
