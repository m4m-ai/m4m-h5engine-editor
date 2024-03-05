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

import { EditorApplication } from "../Game/EditorApplication";
import { EditorEventMgr } from "../Game/Event/EditorEventMgr";
import { GPTUiData, UI } from "../Game/UI/CreateUINodeData";
import { WrapUiNodeManager } from "../Game/UI/WrapUiNodeManager";

export class UIFixer {
    //初始化
    private _template_define: string = "";
    private _template_define2: string = "";
    private _init: boolean = false;

    async Init(): Promise<void> {
        if (this._init) {
            return;
        }
        this._init = true;
        let res = await fetch("./gpt/template_define.txt");
        this._template_define = await res.text();
        let res2 = await fetch("./gpt/template_define2.txt");
        this._template_define2 =  await res2.text();
    }

    //收到GPT回复
    OnGPTReplyUi(text: string): void {
        console.log("GPT回复:\n" + text);
        if (!text || text == "需求错误") {
            console.error("错误的需求!");
            EditorEventMgr.Instance.emitEvent("OnUiGPTMessage", cb => cb(false, text));
            let errData: GPTUiData = {
                success: false,
                data: null,
                errorMessage: text
            }
            EditorEventMgr.Instance.emitEvent("OnHandlerGPTUiData", cb => cb(errData));
            return;
        }
        // document.getElementById("info").textContent = "";
        let code: string;
        if (text.indexOf('```') >= 0) {
            code = this.CutCode(text);
        } else {
            text = text.trim();
            if (text.startsWith('`') && text.endsWith('`')) {
                code = text.substring(1, text.length - 1);
            } else {
                code = text;
            }
        }
        

        let uiNode: UI.Node[];
        try {
            let temp = JSON.parse(code);
            if (Array.isArray(temp)) {
                uiNode = temp;
            } else {
                uiNode = [temp];
                console.error("gpt犯傻返回了个对象, 这里手动改为数组");
            }
        } catch (e) {
            try {
                let temp = JSON.parse("[" + code + "]");
                uiNode = temp;
                console.error("gpt犯傻返回了个格式错误的json, 这里手动处理一下");
            } catch(e2) {
                console.error("gpt返回的数据无法使用:\n" + code);
                EditorEventMgr.Instance.emitEvent("OnUiGPTMessage", cb => cb(false, text));
                return;
            }
        }
        EditorEventMgr.Instance.emitEvent("OnUiGPTMessage", cb => cb(true));

        let successData: GPTUiData = {
            success: true,
            data: uiNode,
            errorMessage: null
        }
        EditorEventMgr.Instance.emitEvent("OnHandlerGPTUiData", cb => cb(successData));
    }

    //收到GPT回复
    OnGPTReply(text: string): void {
        console.log("GPT回复:\n" + text);
        if (!text || text == "需求错误") {
            console.error("错误的需求!");
            EditorEventMgr.Instance.emitEvent("OnGPTMessage", cb => cb(false, text));
            return;
        }
        // document.getElementById("info").textContent = "";
        let code: string;
        if (text.indexOf('```') >= 0) {
            code = this.CutCode(text);
        } else {
            text = text.trim();
            if (text.startsWith('`') && text.endsWith('`')) {
                code = text.substring(1, text.length - 1);
            } else {
                code = text;
            }
        }
        EditorEventMgr.Instance.emitEvent("OnGPTMessage", cb => cb(true, code));
    }

    private CutCode(text: string): string {
        let ftag = text.indexOf('```');
        let ftagend = text.indexOf('\n', ftag + 1);
        let ftag2 = text.indexOf('```', ftagend + 1);
        let code = text.substring(ftagend + 1, ftag2);
        return code;
    }
    //加工问题，让GPT产生命令列表
    async WrapUi(message: string): Promise<string> {
        var str = this._template_define;

        //当前ui的json数据
        let uiJson = WrapUiNodeManager.WrapUi(EditorApplication.Instance.editorScene.getCurrentOrigin2DRoot());
        str = str.replace("__$data__", uiJson);
        console.log("当前ui数据:\n" + uiJson);
        
        //需求
        var requirement = "* " + message.replaceAll("\n", "\n* ");
        str = str.replace("__$requirement__", requirement);

        //屏幕分辨率
        var viewportSize = `${EditorApplication.Instance.editorScene.viewportWidth}*${EditorApplication.Instance.editorScene.viewportHeight}`
        str = str.replace("__$viewportSize__", viewportSize);

        let selection = EditorApplication.Instance.selection;
        //选择节点
        let activeTransform = selection.activeTransform;
        if (activeTransform != null && activeTransform instanceof m4m.framework.transform2D) {
            let tempTrans: m4m.framework.transform2D = activeTransform;
            let path = "";
            while (tempTrans != null && tempTrans.parent != null) {
                if (path.length > 0) {
                    path = tempTrans.name + "/" + path;
                } else {
                    path = tempTrans.name;
                }
                tempTrans = tempTrans.parent;
            }
            str = str.replace("__$selectNode__", "我当前选中的节点:" + path);
        } else {
            str = str.replace("__$selectNode__", "");
        }

        //选择图片
        var imgList = "";
        if (selection.activeAssetList.length > 0) { //多选文件
            for (let activeAsset of selection.activeAssetList) {
                if (activeAsset.FileType == "png" || activeAsset.FileType == "jpg") {
                    //imgList += "\n* " + activeAsset.relativePath;
                    //imgList += "\n" + activeAsset.relativePath;
                    let texture = await EditorApplication.Instance.editorResources.loadTextureByKeyPromise(activeAsset.key);
                    imgList += "\n路径:" + activeAsset.relativePath + ",大小:" + texture.glTexture.width + "*" + texture.glTexture.height;
                }
            }
            
        } else if (selection.activeAsset != null) { //单选文件
            let activeAsset = selection.activeAsset;
            if (activeAsset.FileType == "png" || activeAsset.FileType == "jpg") {
                //imgList += "* " + activeAsset.relativePath;
                //imgList += activeAsset.relativePath;
                let texture = await EditorApplication.Instance.editorResources.loadTextureByKeyPromise(activeAsset.key);
                imgList += "\n路径:" + activeAsset.relativePath + ",大小:" + texture.glTexture.width + "*" + texture.glTexture.height;
            }
        }
        if (imgList.length > 0) {
            str = str.replace("__$selectImage__", "我当前选中的图片有:" + imgList + "\n");
        } else {
            str = str.replace("__$selectImage__", "");
        }

        //console.log("发送数据: " + str);
        return str;
    }

    //加工问题，让GPT产生命令列表
    async Wrap(message: string): Promise<string> {
        var str = this._template_define2;
        
        //需求
        var requirement = "* " + message.replaceAll("\n", "\n* ");
        str = str.replace("__$requirement__", requirement);

        //屏幕分辨率
        var viewportSize = `${EditorApplication.Instance.editorScene.viewportWidth}*${EditorApplication.Instance.editorScene.viewportHeight}`
        str = str.replace("__$viewportSize__", viewportSize);

        //console.log("发送数据: " + str);
        return str;
    }
}