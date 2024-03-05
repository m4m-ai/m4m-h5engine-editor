import { useEffect, useState } from "react";
import React from "react";
import { Checkbox, Space } from "antd";
import { NumberInput } from "../NumberInput";
import {IAttrComponent} from "../Attribute";

export interface ILayoutSetAttrData extends IAttrComponent {
    checkeState: { checked: boolean, value: number, isshow: string }[],
    onChange: (val: any) => void
    setRefresh(func: Function): void;
}

/**
 * 布局框属性
 */
export function LayoutSetAttr(data: ILayoutSetAttrData) {
    let [checkedArr, setChecked] = useState(data.checkeState);

    useEffect(() => {
        data.setRefresh((valArr: { checked: boolean, value: number, isshow: string }[]) => {
            // console.error(valArr);
            setChecked(valArr);
            // valArr.length = 0;
            // valArr = null;
        });
        setChecked(data.checkeState);
    }, [data])
    let outisShow = (select: boolean) => {
        if (select) {
            return "block";
        }
        return "none";
    }

    return (
        <div className="right-inp">
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    {/* 上三个色选框 L  C  R */}
                    <div>{`\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`}</div>
                    <Space>
                        <label>L</label>
                        <Space size={20}>
                            <Checkbox
                                checked={checkedArr[0].checked}
                                onChange={(e) => {
                                    // console.error(e.target.checked);
                                    // console.error(checked);
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[0].checked = e.target.checked;
                                    checkChangeArr[0].isshow = outisShow(e.target.checked);
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }}
                            ></Checkbox>
                            <label>C</label>
                        </Space>
                        <Space size={20}>
                            <Checkbox
                                checked={checkedArr[1].checked}
                                onChange={(e) => {
                                    // console.error(e.target.checked);
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[1].checked = e.target.checked;
                                    checkChangeArr[1].isshow = outisShow(e.target.checked);
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }}
                            ></Checkbox>
                            <label>R</label>
                        </Space>
                        <Checkbox
                            checked={checkedArr[2].checked}
                            onChange={(e) => {
                                // console.error(e.target.checked);
                                let checkChangeArr = checkedArr.concat();
                                checkChangeArr[2].checked = e.target.checked;
                                checkChangeArr[2].isshow = outisShow(e.target.checked);
                                setChecked(checkChangeArr);
                                data.onChange(checkChangeArr);
                            }}
                        ></Checkbox>
                    </Space>
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <Space size={12}>
                        <label>T</label>
                        <Space size={168}>
                            <Checkbox
                                checked={checkedArr[3].checked}
                                onChange={(e) => {
                                    // console.error(e.target.checked);
                                    // console.error(checked);
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[3].checked = e.target.checked;
                                    checkChangeArr[3].isshow = outisShow(e.target.checked);
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }}
                            ></Checkbox>
                            <div style={{ display: checkedArr[3].isshow }}>
                                <NumberInput value={checkedArr[3].value} setValue={(val) => {
                                    // console.error(val);
                                }} onChange={(val: number) => {
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[3].value = val;
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }} style={{ width: 36 }}></NumberInput>
                            </div>
                        </Space>
                    </Space>
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <Space>
                        <label>M</label>
                        <Space size={168}>
                            <Checkbox
                                checked={checkedArr[4].checked}
                                onChange={(e) => {
                                    // console.error(e.target.checked);
                                    // console.error(checked);
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[4].checked = e.target.checked;
                                    checkChangeArr[4].isshow = outisShow(e.target.checked);
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }}
                            ></Checkbox>
                            <div style={{ display: checkedArr[4].isshow }}>
                                <NumberInput value={checkedArr[4].value} setValue={(val) => {
                                    // console.error(val);
                                }} onChange={(val: number) => {
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[4].value = val;
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }} style={{ width: 36 }}></NumberInput>
                            </div>
                        </Space>
                    </Space>
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                    <Space size={12}>
                        <label>B</label>
                        <Space size={168}>
                            <Checkbox
                                checked={checkedArr[5].checked}
                                onChange={(e) => {
                                    // console.error(e.target.checked);
                                    // console.error(checked);
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[5].checked = e.target.checked;
                                    checkChangeArr[5].isshow = outisShow(e.target.checked);
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }}
                            ></Checkbox>
                            <div style={{ display: checkedArr[5].isshow }}>
                                <NumberInput value={checkedArr[5].value} setValue={(val) => {
                                    // console.error(val);
                                }} onChange={(val: number) => {
                                    let checkChangeArr = checkedArr.concat();
                                    checkChangeArr[5].value = val;
                                    setChecked(checkChangeArr);
                                    data.onChange(checkChangeArr);
                                }} style={{ width: 36 }}></NumberInput>
                            </div>
                        </Space>
                    </Space>
                </div>
            </div>

            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1">
                </div>
            </div>
            <div className="right-inp-con">
                <div className="right-inp-con-1"> {`\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0`}
                    {/* 下三个输入框 */}
                    <div style={{ width: "53px" }}>
                        <div style={{ display: checkedArr[0].isshow }}>
                            {/* <Space size={16}> */}
                            <NumberInput value={checkedArr[0].value} setValue={(val: number) => {
                                //  console.error(val);
                            }} onChange={(val: number) => {
                                let checkChangeArr = checkedArr.concat();
                                checkChangeArr[0].value = val;
                                setChecked(checkChangeArr);
                                data.onChange(checkChangeArr);
                            }} style={{ width: 36 }}></NumberInput>
                        </div>
                    </div>
                    <div style={{ width: "53px" }}>
                        <div style={{ display: checkedArr[1].isshow }}>
                            <NumberInput value={checkedArr[1].value} setValue={(val) => {
                                //  console.error(val);
                            }} onChange={(val: number) => {
                                let checkChangeArr = checkedArr.concat();
                                checkChangeArr[1].value = val;
                                setChecked(checkChangeArr);
                                data.onChange(checkChangeArr);
                            }} style={{ width: 36 }}></NumberInput>
                        </div>
                    </div>
                    <div style={{ width: "53px" }}>
                        <div style={{ display: checkedArr[2].isshow }}>
                            <NumberInput value={checkedArr[2].value} setValue={(val) => {
                                //  console.error(val);
                            }} onChange={(val: number) => {
                                let checkChangeArr = checkedArr.concat();
                                checkChangeArr[2].value = val;
                                setChecked(checkChangeArr);
                                data.onChange(checkChangeArr);
                            }} style={{ width: 36 }}></NumberInput>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}