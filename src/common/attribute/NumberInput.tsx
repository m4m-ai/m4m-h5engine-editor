import { Input } from "antd";
import { number } from "echarts/core";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { Utils } from "../../Game/Utils";

export interface INumberInputData {
    value: number;
    setValue: (value: string | number) => void,
    //值改变时调用, 如果值不在约束范围内则只会调用setValue不会调用onChange
    onChange: (value: string | number) => void;
    isshow?: string;
    disable?: boolean;
    integer?:boolean;//要求是整数
    max?: number;
    min?: number;
    step?: number;
    style?: CSSProperties;
}

/**
 * 数字输入框
 * @param data
 */
export function NumberInput(data: INumberInputData) {
    //当前的值
    let [currNum, setCurrNum] = useState<string>(String(data.value));
    let [showSate, setShowState] = useState(data.isshow);
    useEffect(() => {
        setCurrNum(String(data.value));
        // if (currNum != data.value) {
        //     data.onChange(data.value);
        // }
    }, [data])

    function onChangeFunc(e: React.ChangeEvent<HTMLInputElement>) {
        let value: string = e.target.value;
        if(data.integer)
        {
            value=parseInt(value).toString();
        }
        if (/^-?[0-9]+(.[0-9]+)?$/.test(value)) {
            let standard = Number(value);
            let flag = true;
            if (flag && data.max != null && standard != Math.min(data.max, standard)) {
                flag = false;
            }
            if (flag && data.min != null && standard != Math.max(data.min, standard)) {
                flag = false;
            }
            if (flag && data.step != null && standard != Utils.period(standard, data.step)) {
                flag = false;
            }

            data.setValue(value);
            if (flag) {
                data.onChange(value);
            }
        }

        setCurrNum(value);
    }

    function onBlurFunc(e: React.ChangeEvent<HTMLInputElement>) {
        let value:number=0;
        if(data.integer)
        {
            value=parseInt(e.target.value);
        }else
        {
            value = parseFloat(e.target.value);
        }

        let result = Utils.verificationNumber(value, 0);
        if (result.success) {
            if (data.max != null) {
                result.standard = Math.min(data.max, result.standard);
            }
            if (data.min != null) {
                result.standard = Math.max(data.min, result.standard);
            }
            if (data.step != null) {
                result.standard = Utils.period(result.standard, data.step);
            }
            if (currNum !== result.standard.toString()) {
                data.setValue(result.standard);
                setCurrNum(result.standard.toString());
                data.onChange(result.standard);
            }
        } else {
            data.setValue(0);
            setCurrNum("0");
            data.onChange(0);
        }
    }

    return (
        data.disable ? (
            <Input
                disabled
                style={{ ...data.style, display: showSate }}
                type={"text"}
                //当前值
                value={currNum}
                //改变时调用
                onChange={onChangeFunc}
                //失去焦点
                onBlur={onBlurFunc}
            />
        ) :
            (
                <Input
                    style={{ ...data.style, display: showSate }}
                    type={"text"}
                    //当前值
                    value={currNum}
                    //改变时调用
                    onChange={onChangeFunc}
                    //失去焦点
                    onBlur={onBlurFunc}
                />
            )
    )
}