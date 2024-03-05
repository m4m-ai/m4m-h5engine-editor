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
import { title } from "process";
import { EditorEventMgr } from "../Event/EditorEventMgr"

export interface ConsoleData {
    calssName: string;
    ConsoleTypes: ConsoleType
    title: string;
    desc: string;
    ConsoelLogIcon: string;
    visible: boolean,
}
export enum ConsoleType {
    Log = 0,
    Warn = 1,
    Error = 2,
    info = 3,
}
export class consoleMgr {
    /**所有log，warn,error信息 */
    public static Consdata: ConsoleData[] = [];

    /**显示的信息 */
    public static ShowConsoleData: ConsoleData[] = [];

    /**log数量 */
    public static logCount: number = 0;

    /**warn数量 */
    public static warnCount: number = 0;

    /**error数量 */
    public static errorCount: number = 0;

    public static logbool: boolean = true;

    public static warnbool: boolean = true;

    public static errorbool: boolean = true;

    public static indexCoun: number;

    /**`
     * 日志信息显示
     * @param ConsoleTypes 类型
     * @param Consoletilte 标题
     * @param ConsoleDsec 内容
     */
    public static getConsoleData(ConsoleTypes: ConsoleType, Consoletilte: string = "", ConsoleDsec: string = "") {
        if (ConsoleTypes != null && Consoletilte != null) {
            let name: string;
            let logIcon: string;
            let v: boolean;
            switch (ConsoleTypes) {
                case ConsoleType.Log:
                    name = "ExclamationCircleFilled"
                    logIcon = "exclamationC"
                    v = consoleMgr.logbool;
                    break;
                case ConsoleType.Warn:
                    name = "WarningFilled"
                    logIcon = "warningF"
                    v = consoleMgr.warnbool
                    break;
                case ConsoleType.Error:
                    name = "StopFilled"
                    logIcon = "StopF"
                    v = consoleMgr.errorbool;
                    break;
            }

            let data: ConsoleData = {
                calssName: name,
                ConsoleTypes: ConsoleTypes,
                title: Consoletilte,
                ConsoelLogIcon: logIcon,
                desc: ConsoleDsec,
                visible: v,
            }
            this.Consdata.push(data);
            if (data.visible) {
                this.ShowConsoleData.push(data);
            }
            this.newFunction(data);
            EditorEventMgr.Instance.emitEvent("ConsoleMonitor", cb => cb(data));
        }
    }

    public static newFunction(data) {
        let item = { data };
        if (consoleMgr.logCount != 999 && consoleMgr.warnCount != 999 && consoleMgr.errorCount != 999) {
            for (const index in item) {
                const element = item[index]
                switch (element.ConsoleTypes) {
                    case ConsoleType.Log:
                        consoleMgr.logCount++
                        break
                    case ConsoleType.Warn:
                        consoleMgr.warnCount++
                        break
                    case ConsoleType.Error:
                        consoleMgr.errorCount++
                        break
                }
            }
        }
        if (consoleMgr.logCount >= 1000) {
            consoleMgr.logCount = 999
        }
        if (consoleMgr.warnCount >= 1000) {
            consoleMgr.warnCount = 999
        }
        if (consoleMgr.errorCount >= 1000) {
            consoleMgr.errorCount = 999
        }
    }

    /**是否显示日志 */
    public static ShowLOG(type: ConsoleType, v: boolean = true) {
        for (const iterator of this.Consdata) {
            if (iterator.ConsoleTypes == type) {
                iterator.visible = v;
            }
        }
        this.ShowConsoleData.length = 0;
        for (const data of this.Consdata) {
            if (data.visible) {
                this.ShowConsoleData.push(data);
            }
        }
    }

    /**
 * 序列化对象, 注意, 序列化的结果不是json字符串
 * @param obj 对象
 * @param level 最大序列化层级, 默认1级
 * @param maxLen 限制字符串最大长度, 无限制则设置为-1
 */
    public static stringify(obj: any, level: number = 1, maxLen: number = 5000, append: string = ""): string {
        if (obj === null) {
            return "null";
        }
        let type = typeof obj;
        if (type == "string") {
            return '"' + obj + '"';
        } else if (type == "undefined") {
            return "undefined";
        } else if (type == "bigint" || type == "boolean" || type == "number" || type == "symbol") {
            return obj;
        } else if (type == "function") {
            return "function() { [code] }";
        }
        if (level == 0) {
            return "[object: Object]";
        }
        let str = "";
        let isArr = Array.isArray(obj);
        if (isArr) {
            str += "[\n";
            for (let item of obj) {
                if (maxLen > -1 && str.length > maxLen) {
                    return str + "\n对象数据太大了.....";
                }
                str += append + "    " + this.stringify(item, level - 1, maxLen, append + "    ") + ",\n";
            }
            str += append + "]";
        } else {
            str += "{\n";
            for (let key in obj) {
                if (maxLen > -1 && str.length > maxLen) {
                    return str + "\n对象数据太大了.....";
                }
                let item = obj[key];
                str += append + '    "' + key + '": ' + this.stringify(item, level - 1, maxLen, append + "    ") + ",\n";
            }
            str += append + "}";
        }
        return str;
    }
}