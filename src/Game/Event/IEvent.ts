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
import {EventBinder} from "./EventBinder";

export interface IEvent<T> {
    /**
     * 添加事件监听
     * @param key 事件类型
     * @param func 回调函数
     */
    addEventListener<K extends keyof T, F extends T[K]>(key: K, func: F): EventBinder<T, K, F>;

    /**
     * 移除事件监听
     * @param binder 事件绑定对象
     */
    removeEventListener<K extends keyof T, F extends T[K]>(binder: EventBinder<T, K, F>);

    /**
     * 移除指定事件下所有监听对象
     * @param key 事件类型
     */
    removeAllEventListener<K extends keyof T>(key: K);

    /**
     * 移除所有事件监听
     */
    clearEventListener();

    /**
     * 派发事件
     * @param key 事件类型
     * @param cb 事件处理回调, callback 参数为执行的事件
     */
    emitEvent<K extends keyof T, F extends T[K]>(key: K, cb: (callback: EventBinder<T, K, F>["func"]) => void);
}