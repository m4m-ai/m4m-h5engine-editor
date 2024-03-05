import React, {useCallback, useEffect, useState} from "react";
// import {INumberInputAttrData} from "./NumberInputAttr";
// import {DragLabel} from "../DragLabel";
// import {NumberInput} from "../NumberInput";
// import {TouchPosition} from "../../../Game/Input/TouchPosition";
// import {Utils} from "../../../Game/Utils";
// import {IAttrComponent} from "../Attribute";

// export interface IInputGroupAttrData extends IAttrComponent<IInputGroupItemData[]> {
//     onChange(key: string, value: number | string): void;
// }

// export function InputGroupAttr(data: IInputGroupAttrData) {
//     return (
//         <div className="right-inp">
//             {
//                 data.attrValue.map((item, index) => {
//                     return (
//                     <InputGroupItem key={index} {...item}></InputGroupItem>);
//                 })
//             }
//         </div>
//     )
// }

// interface IInputGroupItemData {
//     title: string;
//     type: "string" | "number";
//     data: INumberInputAttrData;
// }

// function InputGroupItem(data: IInputGroupItemData & IInputGroupAttrData["onChange"]) {
//     let [v, setV] = useState(data.data.attrValue);

//     useEffect(() => {
//         setV(data.data.attrValue);
//     }, [data]);

//     let dragV = useCallback((touch: TouchPosition, xDelta: number) => {
//         setV((old) => {
//             var v = {...old};
//             v.value = Utils.limit(Utils.number(old.value + xDelta * (data.data.attrValue.step ?? 0.05)), data.data.attrValue);
//             return v;
//         })
//     }, [data])

//     return (
//         <div className="right-inp-con">
//             <div className="right-inp-con-1">
//                 <DragLabel label={data.title} onDrag={dragV}></DragLabel>
//                 <div className="right-p">
//                     <NumberInput value={v.value}
//                                  onChange={(value) => {
//                                      data.data.onChange({
//                                         max: data.data.attrValue.max,
//                                         min: data.data.attrValue.min,
//                                         step: data.data.attrValue.step,
//                                         value,
//                                     })
//                                  }}
//                                  setValue={(value) => {
//                                     setV({
//                                         max: data.data.attrValue.max,
//                                         min: data.data.attrValue.min,
//                                         step: data.data.attrValue.step,
//                                         value,
//                                     });
//                                  }}
//                                  max={data.data.attrValue.max}
//                                  min={data.data.attrValue.min}
//                                  step={data.data.attrValue.step}
//                     ></NumberInput>
//                 </div>
//             </div>
//         </div>
//     );
// }
