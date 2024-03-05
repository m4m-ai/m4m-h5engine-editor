import {Checkbox} from "antd";
import React, {useEffect, useState} from "react";
import {IAttrComponent} from "../Attribute";

export interface ICheckboxAttrData extends IAttrComponent {
    onChange: (check: boolean) => void;
    setRefresh(func: Function): void;
    value?: boolean;
}

export function CheckboxAttr(data: ICheckboxAttrData) {
    let [checked, setChecked] = useState(data.value);
    useEffect(() => {
        data.setRefresh((checked: boolean) => {
            console.error(checked);
            setChecked(checked);
            // valArr.length = 0;
            // valArr = null;
        });
        // console.error("1111  "+checked);
        setChecked(checked);
    }, [data])
    return (
        <Checkbox
            className="checkb2"
            checked={checked}
            onChange={(e) => {
                setChecked(e.target.checked);
                data.onChange(e.target.checked);
            }}
        ></Checkbox>
    )
}