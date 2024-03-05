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
import {TouchPosition} from "./TouchPosition";


export interface ElementInputMap {
    /**
     * 拖拽元素, state: 0 拖拽开始, 1 拖拽中, 2 拖拽结束
     */
    TouchDrag(touch: TouchPosition, state: number): void,
    /**
     * 监听拖拽其他元素并放入节点
     */
    TouchDrop(touch: TouchPosition): void,
    /**
     * 点击元素
     */
    TouchClick(touch: TouchPosition): void,
    /**
     * 按下元素
     */
    TouchDown(touch: TouchPosition): void,
    /**
     * 放开元素
     */
    TouchUp(touch: TouchPosition): void,
    /**
     * 缩放事件
     * @param delta 缩放的量
     */
    TouchScale(delta: number): void,
    /**
     * 触点进入时调用
     */
    TouchEnter(touch: TouchPosition): void,
    /**
     * 触点在元素内移动时调用
     */
    TouchMove(touch: TouchPosition): void,
    /**
     * 触点离开时调用
     */
    TouchLeave(touch: TouchPosition): void,
}