import React, {useCallback, useEffect, useState} from "react";
import {NumberInput} from "../NumberInput";
import {DragLabel} from "../DragLabel";
import {TouchPosition} from "../../../Game/Input/TouchPosition";
import {Utils} from "../../../Game/Utils";
import {IAttrComponent} from "../Attribute";
import vector2 = m4m.math.vector2;

export interface IVector2AttrData extends IAttrComponent {
    x: number;
    y: number;
    onChange: (x: number, y: number) => void;
    setRefresh(func: Function): void;
}

/**
 * 2维向量
 */
export function Vector2Attr(data: IVector2AttrData) {
    let [v2, setV2] = useState<vector2>(new vector2(data.x, data.y));

    useEffect(() => {
        data.setRefresh((x: number, y: number) => {
            setV2(new vector2(x, y));
        });

        setV2(new vector2(data.x, data.y));
    }, [data])

    let dragX = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV2((v2) => {
                let v = Utils.number(v2.x + xDelta * 0.05);
                data.onChange(v, v2.y);
                return new vector2(v, v2.y);
            })
        }
    }, [data])

    let dragY = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV2((v2) => {
                let v = Utils.number(v2.y + xDelta * 0.05);
                data.onChange(v2.x, v);
                return new vector2(v2.x, v);
            })
        }
    }, [data])

    return (
        <div className="right-inp">
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <DragLabel label={"X"} onDrag={dragX}></DragLabel>
                    <div>
                        <NumberInput value={v2.x}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(v, v2.y);
                                         }
                                     }
                                     setValue={(v) => setV2(new vector2(v, v2.y))}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"Y"} onDrag={dragY}></DragLabel>
                    <div>
                        <NumberInput value={v2.y}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(v2.x, v);
                                         }
                                     }
                                     setValue={(v) => setV2(new vector2(v2.x, v))}
                        ></NumberInput>
                    </div>
                </div>
            </div>
        </div>
    )
}