import { useEffect, useState } from "react";
import React from "react";
import {Select } from "antd";
import {IAttrComponent} from "../Attribute";

export interface ISelectListAttrData extends IAttrComponent<string | number> {
    options: { value: string | number, label: string }[],
    onClick: () => void;
    onSetData: (val: any) => void;
}

/**
 * 选择列表属性
 */
export function SelectListAttr(data: ISelectListAttrData) {
    let [v, setValue] = useState(data.attrValue);
    let [arr, setArr] = useState(data.options);
    useEffect(() => {
        data.onSetData((Arr: any) => {
            setArr(Arr);
        });

        data.setRefresh(setValue);
        setValue(data.attrValue);
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
            <button disabled={data.disable} type="button" onClick={(e: any) => {
                data.onClick();
            }}>btn</button>
        </>
    )
}