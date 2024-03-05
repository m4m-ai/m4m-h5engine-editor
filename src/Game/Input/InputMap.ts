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
import vector3 = m4m.math.vector3;

export interface InputMap {
    /**
     * 点击移动
     * @param x x与上一帧的差距
     * @param y y与上一帧的差距
     */
    TouchMove(x: number, y: number): void,
    /**
     * 拖拽视角移动
     * @param x x与上一帧的差距
     * @param y y与上一帧的差距
     */
    TouchViewMove(x: number, y: number): void,
    /**
     * 点击缩放
     */
    TouchScale(delta: number): void,
    /**
     * 点击按下
     */
    TouchDown(): void,
    /**
     * 点击事件
     */
    TouchClick(): void,
    /**
     * 点击松开
     */
    TouchUp(): void,
    /**
     * WASD-QE移动
     * @param delta 移动的量
     */
    PlayerMove(delta: vector3): void,
}