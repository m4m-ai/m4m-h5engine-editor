import {Input} from "antd";
import React, {CSSProperties, useEffect, useRef, useState} from "react";
import {Utils} from "../../Game/Utils";

export interface INumberInputData {
    value: number;
    setValue: (v: number) => void,
    onChange: (valeu: number) => void;
    isshow?: string;
    disable?: boolean;
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
    let [currNum, setCurrNum] = useState(data.value);
    let [showSate, setShowState] = useState(data.isshow);
    useEffect(() => {
        setCurrNum(data.value);
        // if (currNum != data.value) {
        //     data.onChange(data.value);
        // }
    }, [data])

    function onChangeFunc(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value;

        let result = Utils.verificationNumber(value, 0);
        if (result.success) {
            let flag = true;
            if (flag && data.max != null && result.standard != Math.min(data.max, result.standard)) {
                flag = false;
            }
            if (flag && data.min != null && result.standard != Math.max(data.min, result.standard)) {
                flag = false;
            }
            if (flag && data.step != null && result.standard != Utils.period(result.standard, data.step)) {
                flag = false;
            }

            data.setValue(value as any);
            setCurrNum(value as any);
            if (flag) {
                data.onChange(result.standard);
            }
        } else {
            data.setValue(value as any);
            setCurrNum(value as any);
        }
    }

    function onBlurFunc(e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.value;
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
            if (currNum !== result.standard) {
                data.setValue(result.standard);
                setCurrNum(result.standard);
                data.onChange(result.standard);
            }
        } else {
            data.setValue(0);
            setCurrNum(0);
            data.onChange(0);
        }
    }

    return (
        data.disable ? (
                <Input
                    disabled
                    style={{...data.style, display: showSate}}
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
                    style={{...data.style, display: showSate}}
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