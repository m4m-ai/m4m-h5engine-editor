/**
@license
Copyright (c) 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
/**
 * 连连看属性定义类型, number, bool, string, color, vector2, vector3
 */
export type LightCodeDataType = {
    "number": number,
    "boolean": boolean,
    "string": string,
    "color": m4m.math.color,
    "vector2": m4m.math.vector2,
    "vector3": m4m.math.vector3
    //后面自己补....
}

/**
 * 连连看数据定义格式
 */
export type LightCodeData = LightCodePanel[];

/** 拖拽面板定义格式 */
export interface LightCodePanel {
    /** 数据id */
    id?: string;
    /** 面板类型 */
    type: number;
    /** 坐标 */
    position?: Position;
    /** 面板标题 */
    title: string;
    /** 输入属性列表 */
    inAttribute: InAttribute<any>[];
    /** 输出属性列表 */
    outAttribute: OutAttribute<any>[];
}

/** 坐标数据定义格式 */
export interface Position {
    /** x轴坐标 */
    x: number;
    /** y轴坐标 */
    y: number;
}

/** 左侧(输入)属性数据定义格式 */
export interface InAttribute<T extends keyof LightCodeDataType> {
    /** 属性显示名称 */
    title: string;
    /** 属性类型 */
    type: T;
    /** 允许最大的连接数量, 默认为1 */
    maxConcat: number;
    /** 输入的值 */
    inputVal?: LightCodeDataType[T];
}
/** 右侧(输出)属性数据定义格式 */
export interface OutAttribute<T extends keyof LightCodeDataType> {
    /** 属性显示名称 */
    title: string;
    /** 属性类型 */
    type: T;
    /** 允许最大的连接数量, 默认为1 */
    maxConcat: number;
    /** 输出的值 */
    outputVal?: LightCodeDataType[T];
    /** 连接的属性列表,  */
    concatList?: ConcatData[];
}

/** 属性连接描述 */
interface ConcatData {
    /** 连接的面板id */
    panelId: number;
    /** 连接的属性名称 */
    attrName: number;
}

export interface ResolvedLink {
    id: string;
    source: ResolvedNode
    target: ResolvedNode
}

export type ElementId = string

export interface ResolvedNode {
    id: string
    /** 连接的属性ID */
    attrID: string
    x: number
    y: number
    width: number
    height: number
}   