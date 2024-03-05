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
import { GPTEditorApi } from "./GPTEditorApi";


export class GPTApiHandler {

    private static api: GPTEditorApi;

    public static init() {
        this.api = new GPTEditorApi();
        window["__api__"] = this.api;
        EditorEventMgr.Instance.addEventListener("OnGPTMessage", this.onGPTMessage.bind(this));
    }

    private static onGPTMessage(success: boolean, data: string) {
        if (success) {
            //console.log("js代码: \n" + data);
            try {
                let code = "const api = __api__;\n";
                code += "const PrimitiveType = m4m.framework.PrimitiveType;\n";
                code += "const LightType = m4m.framework.LightTypeEnum;\n";
                code += data;
                eval("(() => {\n" + code + "\n})()");
            } catch (e: any) {
                console.error("执行异常: \n" + e);
            }
        }
    }
}