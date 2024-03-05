
import React, {memo, useEffect, useState} from "react";
import {TouchPosition} from "../../Game/Input/TouchPosition";
import {EditorInputMgr} from "../../Game/Input/EditorInputMgr";
import {IEventBinder} from "../../Game/Event/IEventBinder";



export interface IDragLabelData {
    label: string,
    onDrag: (touch: TouchPosition, xDelta: number) => void,
}

export const DragLabel = memo((data: IDragLabelData) => {
    let prevX: number = -1;
    let binder3: IEventBinder;

    useEffect(() => {
        return () => {
            if (binder3 != null) {
                binder3.removeListener();
            }
        }
    })

    return (
        <div ref={
            (element) => {
                if (element != null) {
                    binder3 = EditorInputMgr.Instance.addElementEventListener(element, "TouchDrag", (touch, state) => {
                        if (state == 0) {
                            prevX = touch.x;
                            document.body.style.cursor = "w-resize";
                        } else if (state == 2) {
                            prevX = -1;
                            document.body.style.cursor = "default";
                        } else {
                            if (prevX >= 0) {
                                data.onDrag(touch, touch.x - prevX);
                            }
                            prevX = touch.x;
                        }

                    })
                }
            }
        } className="right-font">{data.label}</div>
    );
})