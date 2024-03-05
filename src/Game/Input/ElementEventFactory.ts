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
import { ElementEventBinder } from "./ElementEventBinder";
import { EditorInputMgr } from "./EditorInputMgr";
import { ElementInputMap } from "./ElementInputMap";

/**
 * 事件工厂, 统一添加监听事件, 统一移除
 */
export class ElementEventFactory {

    private eventList: ElementEventBinder<any, any, any>[] = [];

    /**
     * 返回事件绑定数量
     */
    public getEventSize() {
        return this.eventList.length;
    }

    /**
     * 添加监听事件
     */
    public addEventListener<K extends keyof ElementInputMap, F extends ElementInputMap[K]>(ele: HTMLElement, key: K, func: F): void {
        this.eventList.push(EditorInputMgr.Instance.addElementEventListener(ele, key, func));
    }

    /**
     * 移除所有监听事件
     */
    public removeAllEventListener() {
        for (let item of this.eventList) {
            item.removeListener();
        }
        this.eventList.length = 0;
        // console.log("event state: ", EditorInputMgr.Instance.getState());
    }
}