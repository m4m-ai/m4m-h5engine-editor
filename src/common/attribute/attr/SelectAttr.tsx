import React, { Component, useEffect, useState } from "react";
import { Select } from "antd";
import {IAttrComponent} from "../Attribute";
export interface ISelectAttrData extends IAttrComponent {
    options: { value: string | number, label: string }[],
    onChange: (value: string | number) => void,
    setRefresh(func: Function): void;
    defaultValue?: string | number
}

/**
 * 下拉框
 */
export function SelectAttr(data: ISelectAttrData) {
    let [v, setValue] = useState(data.defaultValue);
    useEffect(() => {
        data.setRefresh((val) => {
            setValue(val);
        });
        setValue(data.defaultValue);
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