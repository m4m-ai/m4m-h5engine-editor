import { useEffect, useState } from "react";
import React from "react";
import {Select } from "antd";
import {IAttrComponent} from "../Attribute";

export interface ISelectListAttrData extends IAttrComponent {
    value: string | number;
    options: { value: string | number, label: string }[],
    onChange: (value: string | number) => void;
    onClick: () => void;
    onSetData: (val: any) => void;
    setRefresh(func: Function): void;
}

/**
 * 选择列表属性
 */
export function SelectListAttr(data: ISelectListAttrData) {
    let [v, setValue] = useState(data.value);
    let [arr, setArr] = useState(data.options);
    useEffect(() => {
        data.onSetData((Arr: any) => {
            setArr(Arr);
        });

        data.setRefresh((val: string | number) => {
            setValue(val);
        });
        setValue(data.value);
    }, [data])

    return (
        <>
            <Select onChange={(val) => {
                data.onChange(val);
                setValue(val);
            }} value={v} >
                {
                    arr.map((item, index) => {
                        return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                    })
                }
            </Select>
            <button type="button" onClick={(e: any) => {
                data.onClick();
            }}>btn</button>
        </>
    )
}