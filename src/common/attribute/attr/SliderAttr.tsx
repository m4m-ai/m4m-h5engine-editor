import {Row, Slider} from "antd";
import React, {useEffect, useState} from "react";
import {NumberInput} from "../NumberInput";
import {Utils} from "../../../Game/Utils";
import {IAttrComponent} from "../Attribute";

export interface ISliderAttrData extends IAttrComponent {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    step?: number;
}

/**
 * 滑块
 */
export function SliderAttr(data: ISliderAttrData) {
    let [v, setV] = useState(data.value);

    useEffect(() => {
        setV(data.value);
    }, [data]);
    
    let step = data.step == null ? 0.1 : data.step;
    let min = Utils.period(data.min, step);
    let max = Utils.period(data.max, step);

    function onChange(newValue: number) {
        setV(newValue);
    }

    function onChange2(newValue: number) {
        data.onChange(newValue);
    }

    return (
        <Row className="row-1">
            <Slider
                min={min}
                max={max}
                step={data.step}
                tipFormatter={null}
                onChange={onChange}
                value={v}
            />
            <NumberInput value={v} setValue={setV} onChange={onChange2} min={min} max={max}
                         step={step}
                         style={{
                             width: "100px",
                             marginLeft: "10px"
                         }}
            ></NumberInput>
        </Row>
    )
}