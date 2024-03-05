import { useEffect, useState } from "react";
import React from "react";
import { Button, Checkbox, Input, Space } from "antd";
import {IAttrComponent} from "../Attribute";

/**
 * 字符串输入框属性
 */
export function StringInputAttr(data: IAttrComponent<string>) {
    let [v, setValue] = useState(data.attrValue);

    useEffect(() => {
        data.setRefresh(setValue);
        setValue(data.attrValue);
    }, [data])

    return (
        data.disable ? (
                <Input disabled value={v} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let value = e.target.value;
                    data.onChange(value);
                    setValue(value);
                }} style={{width: "100%"}}></Input>
            ) :
            (
                <Input value={v} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let value = e.target.value;
                    data.onChange(value);
                    setValue(value);
                }} style={{width: "100%"}}></Input>
            )
    )
}