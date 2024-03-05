import "./Attribute.css"
import React, { useState, useRef, useEffect } from "react";
import { InputNumber, Button } from "antd"
import { CaretRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import Sortable from 'sortablejs'

import {AttributeManager, AttributeMap} from "./AttributeManager";
import { IComponentFieldInfo } from "../../Game/Component/EditorComponentMgr";

/**
 * 属性数据接口
 */
export interface IAttributeData<T extends IAttrComponent<any> = any> {
    /** 显示文本 */
    title: string;
    /** 类型 */
    type: keyof (typeof AttributeMap);
    /** 字段描述 */
    describe?: string;
    /** 右侧组件宽度, 默认 70% */
    rightWidth?: string;
    /** 传入attr组件的数据 */
    attr: T;
    /** 如果是数组， 则传入的数据 */
    arrayData?: any[];
    /** 是否是数组 */
    isArray?: boolean;
    /** 压入默认模板, 有数组才有 */
    defaultTemplate?: object;
}

/**
 * 属性组件数据接口
 */
export interface IAttrComponent<T> {
    /** 属性值 */
    attrValue: T;
    /** 导出属性配置信息 */
    fieldInfo: IComponentFieldInfo;
    /** 是否禁用, 默认 false */
    disable?: boolean;
    /** 设置禁用函数 */
    setDisableFunc?: (refresh: React.Dispatch<React.SetStateAction<boolean>>) => void;
    /** 设置刷新函数 */
    setRefresh: (refresh: React.Dispatch<React.SetStateAction<T>>) => void;
    /** 值改变时调用, 子类提供回调数据 */
    onChange: (data: T) => void;
}

/**
 * 组件属性
 * @param data
 */
export function Attribute(data: IAttributeData) {
    const [isFold, setIsFold] = useState(true)

    let listLength

    // 折叠 展开
    const foldEmitFn = (e) => {
        setIsFold(!isFold)
    }

    const [arrayData, setArrayData] = useState(data.arrayData);

    useEffect(() => {
        setArrayData(data.arrayData);
    }, [data]);

    const subArrListFn = (e) => {
        arrayData.pop()
        setArrayData(arrayData.slice())
    }

    const addArrListFn = (e) => {
        arrayData.push(data.defaultTemplate)
        setArrayData(arrayData.slice())
    }

    const inputBlurFn = (e) => {
        const tempArr = []
        for (let i = 0; i < listLength; i++) {
            tempArr.push(data.defaultTemplate)
        }
        setArrayData(tempArr)
    }

    return (
        // <div className="camera-content" onClick={() => createTrack(data)}>
        <div className="camera-content">
            {
                !data.isArray ? (
                    <div className="camera-content">
                        <div className="camera-content-left" dangerouslySetInnerHTML={{ __html: data.title }}></div>
                        <div className="camera-content-right">
                            {
                                data.attr ? AttributeManager.getAttribute(data.type, data.attr) : <></>
                            }
                        </div>
                    </div>
                ) : (
                    // 有数组属性
                    <div className="attribute-array" style={{ width: '100%' }}>
                        <div className="camera-content">
                            <div onClick={e => foldEmitFn(e)} style={{ display: 'flex', flex: 1 }}>
                                <div>{isFold ? <CaretRightOutlined /> : <CaretDownOutlined />}</div>
                                <div>title</div>
                            </div>

                            <InputNumber style={{ width: '80px' }} parser={text => /^\d+$/.test(text) ? text : 0}
                                onClick={e => e.stopPropagation()} onChange={value => { listLength = value }} onBlur={e => inputBlurFn(e)} />
                        </div>
                        <div style={{ width: '95%', margin: '0 auto' }}>
                            {!isFold ? (
                                <div ref={(ele) => {
                                    if (ele) {
                                        //console.log(Sortable);

                                        Sortable.create(ele, {
                                            handle: '.attr-draggable-title',
                                            chosenClass: 'attr-sortable-chosen',
                                            dragClass: 'attr-sortable-chosen',
                                            onEnd: (evt) => {
                                                //console.log(evt.oldIndex); // 之前下标
                                                //console.log(evt.newIndex); // 之前下标
                                                //console.log(arrayData);




                                            }
                                        })
                                    }
                                }}>
                                    {
                                        arrayData.map((item, index) => {
                                            if (data.attr) {
                                                let attrData: IAttrComponent<any> = {
                                                    ...data.attr,
                                                    attrValue: item,
                                                    onChange(value: any) {
                                                        setArrayData((array) => {
                                                            array = [...array];
                                                            array[index] = value;
                                                            return array;
                                                        });
                                                        data.attr.onChange(arguments);
                                                    }
                                                }
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center' }} key={index}>
                                                        <div className="attr-draggable-title" style={{ width: '30%' }}>{`Element ${index} `}</div>
                                                        {AttributeManager.getAttribute(data.type, attrData)}
                                                    </div>
                                                )
                                            } else {
                                                return <></>
                                            }
                                        })
                                    }
                                    <div style={{ textAlign: 'right' }}>
                                        <Button style={{ background: '#414141' }} size="small" onClick={e => subArrListFn(e)}>-</Button>
                                        <Button style={{ background: '#414141' }} size="small" onClick={e => addArrListFn(e)}>+</Button>
                                    </div>
                                </div>
                            ) : <></>}

                        </div>

                    </div>
                )
            }
        </div>
    )
}