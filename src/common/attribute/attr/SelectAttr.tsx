import React, { Component, useEffect, useState } from "react";
import { Select } from "antd";
import {IAttrComponent} from "../Attribute";
export interface ISelectAttrData extends IAttrComponent<string | number> {
    options: { value: string | number, label: string }[],
}


export function SelectAttr(data: ISelectAttrData) {
    let [v, setValue] = useState(data.attrValue);
    useEffect(() => {
        data.setRefresh(setValue);
        setValue(data.attrValue);
    }, [data])
    return (
        <Select size="small" onChange={(val) => {
            data.onChange(val);
            setValue(val);
        }} value={v} >
            {
                data.options.map((item, index) => {
                    return <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
                })
            }
        </Select>
    )
}