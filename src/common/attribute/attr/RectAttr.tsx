import React, {useCallback, useEffect, useState} from "react"
import {NumberInput} from "../NumberInput";
import {DragLabel} from "../DragLabel";
import {TouchPosition} from "../../../Game/Input/TouchPosition";
import {Utils} from "../../../Game/Utils";
import {IAttrComponent} from "../Attribute";

export interface IRectAttrData extends IAttrComponent {
    x: number;
    y: number;
    w: number;
    h: number;
    onChange: (x: number, y: number,w: number, h: number) => void;
}

/**
 * 4维向量
 */
export function RectAttr(data: IRectAttrData) {
    let [x, setX] = useState(data.x);
    let [y, setY] = useState(data.y);
    let [w, setW] = useState(data.w);
    let [h, setH] = useState(data.h);

    useEffect(() => {
        setX(data.x);
        setY(data.y);
        setW(data.w);
        setH(data.h);
    }, [data]);
    
    let dragX = useCallback((touch: TouchPosition, xDelta: number) => {
        setX((x) => {
            return Utils.number(x + xDelta * 0.05);
        })
    }, [data])

    let dragY = useCallback((touch: TouchPosition, xDelta: number) => {
        setY((y) => {
            return Utils.number(y + xDelta * 0.05);
        })
    }, [data])

    let dragW = useCallback((touch: TouchPosition, xDelta: number) => {
        setW((w) => {
            return Utils.number(w + xDelta * 0.05);
        })
    }, [data])

    let dragH = useCallback((touch: TouchPosition, xDelta: number) => {
        setH((h) => {
            return Utils.number(h + xDelta * 0.05);
        })
    }, [data])

    return (
        <div className="right-inp">
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <DragLabel label={"X"} onDrag={dragX}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={x}
                                     onChange={
                                         (v) => {
                                             data.onChange(v, y, w, h);
                                         }
                                     }
                                     setValue={setX}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"Y"} onDrag={dragY}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={y}
                                     onChange={
                                         (v) => {
                                             data.onChange(x, v, w, h);
                                         }
                                     }
                                     setValue={setY}
                        ></NumberInput>
                    </div>
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <DragLabel label={"W"} onDrag={dragW}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={w}
                                     onChange={
                                         (v) => {
                                             data.onChange(x, y, v, h);
                                         }
                                     }
                                     setValue={setW}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"H"} onDrag={dragH}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={h}
                                     onChange={
                                         (v) => {
                                             data.onChange(x, y, w, v);
                                         }
                                     }
                                     setValue={setH}
                        ></NumberInput>
                    </div>
                </div>
            </div>
        </div>
    )
}