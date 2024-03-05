import { useEffect, useState } from "react";
import React from "react";
import { Button, Checkbox, Input, Space } from "antd";
import {IAttrComponent} from "../Attribute";

export interface IStringInputAttrData extends IAttrComponent {
    value: string;
    onChange: (value: string) => void;
    setRefresh(func: Function): void;
}

/**
 * 字符串输入框属性
 */
export function StringInputAttr(data: IStringInputAttrData) {
    let [v, setValue] = useState(data.value);

    useEffect(() => {
        data.setRefresh((val: string) => {
            setValue(val);
        });
        setValue(data.value);
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

    // return (
    //     <>
    //         <Space>
    //             <label style={{ width: 18 }}>L</label><Checkbox
    //                 className="checkb2"
    //                 checked={false}
    //                 onChange={(e) => {
    //                     console.error(e.target.checked);
    //                     // setChecked(e.target.checked);
    //                     // data.onChange(e.target.checked);
    //                 }}
    //             ></Checkbox>
    //             <label style={{ width: 18 }}>C</label><button type="button" onClick={(e: any) => {
    //                 console.error("onClick");
    //             }}>btn</button>
    //         </Space>
    //     </>
    // )
}