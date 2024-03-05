import {Checkbox} from "antd";
import React, {useEffect, useState} from "react";
import {IAttrComponent} from "../Attribute";

export function CheckboxAttr(data: IAttrComponent<boolean>) {
    let [checked, setChecked] = useState(data.attrValue);
    useEffect(() => {
        data.setRefresh(setChecked);
        // console.error("1111  "+checked);
        setChecked(checked);
    }, [data])
    return (
        <Checkbox
            className="checkb2"
            disabled={data.disable}
            checked={checked}
            onChange={(e) => {
                setChecked(e.target.checked);
                data.onChange(e.target.checked);
            }}
        ></Checkbox>
    )
}