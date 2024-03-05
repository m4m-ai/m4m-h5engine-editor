import {Row, Slider} from "antd";
import React, {useEffect, useState} from "react";
import {NumberInput} from "../NumberInput";
import {Utils} from "../../../Game/Utils";
import {IAttrComponent} from "../Attribute";

export interface ISliderAttrData extends IAttrComponent<number> {
    min: number;
    max: number;
    step?: number;
}

/**
 * 滑块
 */
export function SliderAttr(data: ISliderAttrData) {
    let [v, setV] = useState<string|number>(data.attrValue);

    useEffect(() => {
        setV(data.attrValue);
    }, [data]);
    
    let step = data.step == null ? 0.1 : data.step;
    let min = Utils.period(data.min, step);
    let max = Utils.period(data.max, step);

    function onChange(newValue: number) {
        setV(newValue);
    }

    function onChange2(newValue: string|number) {
        data.onChange(Utils.convertToNumber(newValue));
    }

    return (
        <Row className="row-1">
            <Slider
                min={min}
                max={max}
                step={data.step}
                tipFormatter={null}
                onChange={onChange}
                value={Number(v)}
                disabled={data.disable}
            />
            <NumberInput value={Number(v)} setValue={setV} onChange={onChange2} min={min} max={max}
                         step={step}
                         style={{
                             width: "100px",
                             marginLeft: "10px"
                         }}
            ></NumberInput>
        </Row>
    )
}