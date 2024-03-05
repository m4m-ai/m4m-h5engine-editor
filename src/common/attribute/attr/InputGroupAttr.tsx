import React, {useCallback, useEffect, useState} from "react";
import {INumberInputAttrData} from "./NumberInputAttr";
import {DragLabel} from "../DragLabel";
import {NumberInput} from "../NumberInput";
import {TouchPosition} from "../../../Game/Input/TouchPosition";
import {Utils} from "../../../Game/Utils";
import {IAttrComponent} from "../Attribute";

export interface IInputGroupAttrData extends IAttrComponent {
    onChange(key: string, value: number | string): void;
    array: IInputGroupItemData[];
}

export function InputGroupAttr(data: IInputGroupAttrData) {
    return (
        <div className="right-inp">
            {
                data.array.map((item, index) => {
                    return (<InputGroupItem key={index} {...item} onChange={data.onChange}></InputGroupItem>);
                })
            }
        </div>
    )
}

interface IInputGroupItemData {
    title: string;
    type: "string" | "number";
    data: INumberInputAttrData;
}

function InputGroupItem(data: IInputGroupItemData & { onChange(key: string, value: number | string): void }) {
    let [v, setV] = useState(data.data.value);
    
    useEffect(() => {
        setV(data.data.value);
    }, [data]);

    let dragV = useCallback((touch: TouchPosition, xDelta: number) => {
        setV((x) => {
            return Utils.limit(Utils.number(x + xDelta * (data.data.step ?? 0.05)), data.data);
        })
    }, [data])

    return (
        <div className="right-inp-con">
            <div className="right-inp-con-1">
                <DragLabel label={data.title} onDrag={dragV}></DragLabel>
                <div className="right-p">
                    <NumberInput value={v}
                                 onChange={(value) => data.onChange(data.title, value)}
                                 setValue={setV}
                                 max={data.data.max}
                                 min={data.data.min}
                                 step={data.data.step}
                    ></NumberInput>
                </div>
            </div>
        </div>
    );
}