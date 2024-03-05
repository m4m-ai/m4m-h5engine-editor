import {useEffect, useState} from "react";
import React from "react";
import {NumberInput} from "../NumberInput";
import {IAttrComponent} from "../Attribute";

export interface INumberInputAttrData extends IAttrComponent {
    value: number;
    onChange: (value: number) => void;
    setRefresh(func: Function): void;
    max?: number;
    min?: number;
    step?: number;
}

/**
 * 数字输入框属性
 */
export function NumberInputAttr(data: INumberInputAttrData) {
    let [v, setValue] = useState(data.value);

    useEffect(() => {
        data.setRefresh((val: number) => {
            setValue(val);
        });
        setValue(data.value);
    }, [data]);
    
    return (
        <NumberInput disable={data.disable} value={v} setValue={setValue} onChange={data.onChange}
                     step={data.step} max={data.max} min={data.min} style={{width: "100%"}}></NumberInput>

    )
}