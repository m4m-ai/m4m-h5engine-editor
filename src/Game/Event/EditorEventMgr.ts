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
import {IEvent} from "./IEvent";
import {EventBinder} from "./EventBinder";
import {EventMap} from "./EventMap";

/**
 * 编辑器事件管理类, 编辑器中所有的事件(除了输入事件)都必须走该类来管理, 在 EventMap 中注册相应的事件
 */
export class EditorEventMgr implements IEvent<EventMap> {

    private bindMap = new Map<keyof EventMap, EventBinder<EventMap, keyof EventMap, EventMap[keyof EventMap]>[]>();

    public static get Instance() {
        return this._instance;
    }

    private static _instance: EditorEventMgr = new EditorEventMgr();
    
    private constructor() {
    }
    
    public addEventListener<K extends keyof EventMap, F extends EventMap[K]>(key: K, func: F): EventBinder<EventMap, K, F> {
        let binder: EventBinder<EventMap, K, F>;
        let list = this.bindMap.get(key);
        if (!list) {
            binder = new EventBinder(this, key, func);
            list = [binder];
            this.bindMap.set(key, list);
            return binder;
        }
        for (let i = 0; i < list.length; i++) {
            if (list[i].func == func) {
                return list[i] as EventBinder<EventMap, K, F>;
            }
        }
        binder = new EventBinder(this, key, func);
        list.push(binder);
        return binder;
    }
    
    public removeEventListener<K extends keyof EventMap, F extends EventMap[K]>(binder: EventBinder<EventMap, K, F>) {
        let list = this.bindMap.get(binder.key);
        if (list) {

            if (list.length > 0) {
                list.splice(list.indexOf(binder), 1);
            }

            if (list.length == 0) {
                this.bindMap.delete(binder.key);
            }
        }
    }
    
    public removeAllEventListener<K extends keyof EventMap>(key: K) {
        this.bindMap.delete(key);
    }
    
    public clearEventListener() {
        this.bindMap.clear();
    }
    
    public emitEvent<K extends keyof EventMap, F extends EventMap[K]>(key: K, cb: (callback: EventBinder<EventMap, K, F>["func"]) => void) {
        let list = this.bindMap.get(key);
        if (list) {
            let tempList = [...list];
            for (let i = 0; i < tempList.length; i++) {
                cb((tempList[i] as EventBinder<EventMap, K, F>).func);
            }
        }
    }
}