import {useEffect, useState} from "react";
import React from "react";
import {NumberInput} from "../NumberInput";
import {IAttrComponent} from "../Attribute";
import { Utils } from "../../../Game/Utils";

export type NumberInputDataType = {
    value: number;
    max?: number;
    min?: number;
    step?: number;
    integer?:boolean;//要求是整数
}

/**
 * 数字输入框属性
 */
export function NumberInputAttr(data: IAttrComponent<NumberInputDataType>) {
    let [v, setValue] = useState(data.attrValue);
    
    useEffect(() => {
        data.setRefresh(setValue);
        setValue(data.attrValue);
    }, [data]);
    
    return (
        <NumberInput disable={data.disable}
                    value={v.value}
                    setValue={
                        (value) => {
                            setValue({value:Utils.convertToNumber(value), step: v.step, max: v.max, min: v.min});
                        }
                    }
                    onChange={
                        (value) => {
                            data.onChange({value:Utils.convertToNumber(value), step: v.step, max: v.max, min: v.min});
                        }
                    }
                    integer={data.attrValue.integer}
                    step={data.attrValue.step}
                    max={data.attrValue.max}
                    min={data.attrValue.min}
                    style={{width: "100%"}}
        ></NumberInput>
    )
}

//----------------------------------------------------

// export type ComponentInstance = INodeComponent | I2DComponent | transform | transform2D;

// abstract class Attr<T> {
    
//     public constructor(component: ComponentInstance, fieldInfo: IComponentFieldInfo) {
        
//     }
    
//     public abstract init(component: ComponentInstance, fieldInfo: IComponentFieldInfo): void;
    
//     public abstract render(data: T): JSX.Element;
// }

// export class NumberInputAttrTest extends Attr<DataType> {

//     public init(component: ComponentInstance, fieldInfo: IComponentFieldInfo): void {
        
//     }
    
//     public render = (data: DataType) => {
//         const [v, setV] = useState(1);
//         return <input
//             value={v}
//             onChange={
//                 (value) => {
//                     let num = parseInt(value.target.value);
//                     console.log("change1: ", num)
//                     setV(num)
//                 }
//             }/>
//     };
// }