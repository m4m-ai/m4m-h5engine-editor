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
 * 事件绑定对象
 */
import {IEvent} from "./IEvent";
import {IEventBinder} from "./IEventBinder";

export class EventBinder<T, K extends keyof T, F extends T[K]> implements IEventBinder {
    
    public constructor(public mgr: IEvent<T>, public key: K, public func: F) {
    }

    /**
     * 移除当前事件监听
     */
    public removeListener() {
        this.mgr.removeEventListener(this as any);
    }
}