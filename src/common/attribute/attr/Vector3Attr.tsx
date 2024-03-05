import React, {useCallback, useEffect, useState} from "react";
import {NumberInput} from "../NumberInput";
import {DragLabel} from "../DragLabel";
import {Utils} from "../../../Game/Utils";
import {TouchPosition} from "../../../Game/Input/TouchPosition";
import {IAttrComponent} from "../Attribute";
import vector3 = m4m.math.vector3;

export interface IVector3AttrData extends IAttrComponent {
    x: number;
    y: number;
    z: number;
    onChange: (x: number, y: number, z: number) => void;
    setRefresh(func: Function): void;
}

/**
 * 3维向量
 */
export function Vector3Attr(data: IVector3AttrData) {
    let [v3, setV3] = useState<vector3>(new vector3(data.x, data.y, data.z));

    useEffect(() => {
        data.setRefresh((x: number, y: number, z: number) => {
            setV3(new vector3(x, y, z));
        });

        setV3(new vector3(data.x, data.y, data.z));
    }, [data])

    let dragX = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV3((v3) => {
                let v = Utils.number(v3.x + xDelta * 0.05);
                data.onChange(v, v3.y, v3.z);
                return new vector3(v, v3.y, v3.z);
            })
        }
    }, [data])

    let dragY = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV3((v3) => {
                let v = Utils.number(v3.y + xDelta * 0.05);
                data.onChange(v3.x, v, v3.z);
                return new vector3(v3.x, v, v3.z);
            })
        }
    }, [data])

    let dragZ = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV3((v3) => {
                let v = Utils.number(v3.z + xDelta * 0.05);
                data.onChange(v3.x, v3.y, v);
                return new vector3(v3.x, v3.y, v);
            })
        }
    }, [data])
    
    return (
        <div className="right-inp">
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <DragLabel label={"X"} onDrag={dragX}></DragLabel>
                    <div>
                        <NumberInput value={v3.x}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(v, v3.y, v3.z);
                                         }
                                     }
                                     setValue={(v) => setV3(new vector3(v, v3.y, v3.z))}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"Y"} onDrag={dragY}></DragLabel>
                    <div>
                        <NumberInput value={v3.y}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(v3.x, v, v3.z);
                                         }
                                     }
                                     setValue={(v) => setV3(new vector3(v3.x, v, v3.z))}
                        ></NumberInput>
                    </div>
                </div>
                <div className="right-inp-con-1">
                    <DragLabel label={"Z"} onDrag={dragZ}></DragLabel>
                    <div>
                        <NumberInput value={v3.z}
                                     disable={data.disable}
                                     onChange={
                                         (v) => {
                                             data.onChange(v3.x, v3.y, v);
                                         }
                                     }
                                     setValue={(v) => setV3(new vector3(v3.x, v3.y, v))}
                        ></NumberInput>
                    </div>
                </div>
            </div>
        </div>
    )
}