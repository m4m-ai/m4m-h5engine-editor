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
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";

export class LogManager {
    public static get Instance(): LogManager {
        if (this.instance == null) {
            this.instance = new LogManager();
        }
        return this.instance;
    }
    private static instance: LogManager;
    private _logList: any[] = [];
    public upDateTextNodeFun(text: string) {
        if (text != "") {
            if (this._logList.length > 100) {
                let logObj=this._logList.shift();//从数组开头 开始删
                logObj=null;
            }
            let logObj={};
            logObj["title"]=text;
            this._logList.push(logObj);
            EditorEventMgr.Instance.emitEvent("OnConsoleLog", cb => cb(this._logList));
        }
    }
}