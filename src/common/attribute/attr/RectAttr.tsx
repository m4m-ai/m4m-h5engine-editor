import React, {useCallback, useEffect, useState} from "react"
import {NumberInput} from "../NumberInput";
import {DragLabel} from "../DragLabel";
import {TouchPosition} from "../../../Game/Input/TouchPosition";
import {Utils} from "../../../Game/Utils";
import {IAttrComponent} from "../Attribute";
import rect = m4m.math.rect;

/**
 * 4维向量
 */
export function RectAttr(data: IAttrComponent<m4m.math.rect>) {
    let [r, setR] = useState<rect>(new rect(data.attrValue.x, data.attrValue.y, data.attrValue.w, data.attrValue.h));

    useEffect(() => {
        data.setRefresh(setR);

        setR(new rect(data.attrValue.x, data.attrValue.y, data.attrValue.w, data.attrValue.h));
    }, [data]);
    
    let dragX = useCallback((touch: TouchPosition, xDelta: number) => {
        setR((oldR) => {
            let v = Utils.number(oldR.x + xDelta * 0.05);
            data.onChange(new rect(v, oldR.y, oldR.w, oldR.h));
            return new rect(v, oldR.y, oldR.w, oldR.h);
        })
    }, [data])

    let dragY = useCallback((touch: TouchPosition, xDelta: number) => {
        setR((oldR) => {
            let v = Utils.number(oldR.y + xDelta * 0.05);
            data.onChange(new rect(oldR.x, v, oldR.w, oldR.h));
            return new rect(oldR.x, v, oldR.w, oldR.h);
        })
    }, [data])

    let dragW = useCallback((touch: TouchPosition, xDelta: number) => {
        setR((oldR) => {
            let v = Utils.number(oldR.w + xDelta * 0.05);
            data.onChange(new rect(oldR.x, oldR.y, v, oldR.h));
            return new rect(oldR.x, oldR.y, v, oldR.h);
        })
    }, [data])

    let dragH = useCallback((touch: TouchPosition, xDelta: number) => {
        setR((oldR) => {
            let v = Utils.number(oldR.h + xDelta * 0.05);
            data.onChange(new rect(oldR.x, oldR.y, oldR.w, v));
            return new rect(oldR.x, oldR.y, oldR.w, v);
        })
    }, [data])

    return (
        <div className="right-inp">
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <DragLabel label={"X"} onDrag={dragX}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={r.x}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(new rect(Utils.convertToNumber(v), r.y, r.w, r.h));
                                         }
                                     }
                                     setValue={(v) => setR(new rect(Utils.convertToNumber(v), r.y, r.w, r.h))}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"Y"} onDrag={dragY}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={r.y}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(new rect(Utils.convertToNumber(v), r.y, r.w, r.h));
                                         }
                                     }
                                     setValue={(v) => setR(new rect(Utils.convertToNumber(v), r.y, r.w, r.h))}
                        ></NumberInput>
                    </div>
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <DragLabel label={"W"} onDrag={dragW}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={r.w}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(new rect(Utils.convertToNumber(v), r.y, r.w, r.h));
                                         }
                                     }
                                     setValue={(v) => setR(new rect(Utils.convertToNumber(v), r.y, r.w, r.h))}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"H"} onDrag={dragH}></DragLabel>
                    <div className="right-p">
                        <NumberInput value={r.h}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(new rect(Utils.convertToNumber(v), r.y, r.w, r.h));
                                         }
                                     }
                                     setValue={(v) => setR(new rect(Utils.convertToNumber(v), r.y, r.w, r.h))}
                        ></NumberInput>
                    </div>
                </div>
            </div>
        </div>
    )
}