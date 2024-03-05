import React, {useCallback, useEffect, useState} from "react";
import {NumberInput} from "../NumberInput";
import {DragLabel} from "../DragLabel";
import {Utils} from "../../../Game/Utils";
import {TouchPosition} from "../../../Game/Input/TouchPosition";
import {IAttrComponent} from "../Attribute";
import vector3 = m4m.math.vector3;


/**
 * 3维向量
 */
export function Vector3Attr(data: IAttrComponent<m4m.math.vector3>) {
    let [v3, setV3] = useState<vector3>(new vector3(data.attrValue.x, data.attrValue.y, data.attrValue.z));

    useEffect(() => {
        data.setRefresh(setV3);

        setV3(new vector3(data.attrValue.x, data.attrValue.y, data.attrValue.z));
    }, [data])

    let dragX = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV3((v3) => {
                let v = Utils.number(v3.x + xDelta * 0.05);
                data.onChange(new vector3(v, v3.y, v3.z));
                return new vector3(v, v3.y, v3.z);
            })
        }
    }, [data])

    let dragY = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV3((v3) => {
                let v = Utils.number(v3.y + xDelta * 0.05);
                data.onChange(new vector3(v3.x, v, v3.z));
                return new vector3(v3.x, v, v3.z);
            })
        }
    }, [data])

    let dragZ = useCallback((touch: TouchPosition, xDelta: number) => {
        if (!data.disable) {
            setV3((v3) => {
                let v = Utils.number(v3.z + xDelta * 0.05);
                data.onChange(new vector3(v3.x, v3.y, v));
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
                                             data.onChange(new vector3(Utils.convertToNumber(v), v3.y, v3.z));
                                         }
                                     }
                                     setValue={(v) => setV3(new vector3(Utils.convertToNumber(v), v3.y, v3.z))}
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
                                             data.onChange(new vector3(v3.x, Utils.convertToNumber(v), v3.z));
                                         }
                                     }
                                     setValue={(v) => setV3(new vector3(v3.x, Utils.convertToNumber(v), v3.z))}
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
                                             data.onChange(new vector3(v3.x, v3.y, Utils.convertToNumber(v)));
                                         }
                                     }
                                     setValue={(v) => setV3(new vector3(v3.x, v3.y, Utils.convertToNumber(v)))}
                        ></NumberInput>
                    </div>
                </div>
            </div>
        </div>
    )
}