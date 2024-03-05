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
/** Ai返回的Ui数据 */
export interface GPTUiData {
    /** 是否成功返回ui数据, 如果成功, 则获取data字段, 否则通过errorMessage字段获取错误消息 */
    success: boolean;
    /** 错误消息 */
    errorMessage?: string;
    /** 解析好的ui数据 */
    data?: UI.Node[];
}

//用于创建UI 的UI节点数据
export namespace UI {
    //节点基类
    export interface Node {
        //节点类型,就是子节点类名
        ty: string
        //节点名称,用于区分节点对象
        n: string
        //局部y坐标,单位像素
        x: number
        //局部x坐标,单位像素
        y: number
        //局部x轴缩放,默认1
        sX?: number
        //局部y轴缩放,默认1
        sY?: number
        //局部旋转角度,角度制,默认0
        r?: number
        //包含子节点
        ch?: Node[]
    }
    //ui节点基类,可以制作Ui面板
    export interface Panel extends Node {
        //节点宽度
        w: number
        //节点高度
        h: number
        //水平对其方向,参数为:
        //left:左对齐
        //center:水平居中对齐
        //right:右对齐
        //fill:撑满父级
        hA: string
        //垂直对其方向,参数为:
        //top:顶对齐
        //center:垂直居中对齐
        //bottom:底对齐
        //fill:撑满父级
        vA: string
    }
    //图片节点
    export interface Image extends Panel {
        //显示图片路径,默认不加载
        tex?: string
        //图片混色,16进制颜色字符串,默认:000000ff
        m?: string
    }
    //输入框节点
    export interface Input extends Image {
        //输入框内容,默认:""
        v?: string
        //字体大小,默认12
        fS?: number
        //字体颜色,16进制字符串,默认:000000ff
        c?: string
    }
    //滑动区域节点
    export interface Scroll extends Panel {
        //是否开启水平滑动,默认true
        hS?: boolean
        //是否开启纵向滑动,默认true
        vS?: boolean
    }
    //文本节点
    export interface Label extends Panel {
        //显示文本
        text: string
        //文本水平对其方向,参数为:
        //left:左对齐
        //center:水平居中对齐
        //right:右对齐
        hT: string
        //文本垂直对其方向,参数为:
        //top:顶对齐
        //center:垂直居中对齐
        //bottom:底对齐
        vT: string
        //字体大小,默认24
        fS?: number
        //字体颜色,16进制字符串,默认:000000ff
        c?: string
    }
    //按钮节点
    export interface Button extends Label {
        //按钮显示图片的路径,默认不加载
        tex?: string
        //按钮显示图片的混色,16进制颜色字符串,默认:000000ff
        m?:string
    }
}