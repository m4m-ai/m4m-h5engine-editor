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
import { LoadType, LoaderManage } from "../../CodeEditor/loader/otherPlan/LoaderManage";
import { EditorApplication } from "../EditorApplication";

export class PSDUiManager {

    public static showUi(uiName: string, root: m4m.framework.transform2D) {
        // let url = "Resources/newUi/" + uiName + "/resources/" + uiName + "_json.json";
        let url = EditorApplication.Instance.serverResourcesUrl + "Art/res/art/ui/" + uiName + "/" + uiName + "_json.json";
        let url2 = EditorApplication.Instance.serverResourcesUrl + `Art/res/art/atlas/${uiName}/${uiName}.assetbundle.json`;

        let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
        assetmgr.load(url2, m4m.framework.AssetTypeEnum.Auto, () => {
            m4m.io.loadText(url, (result, _err, isloadFail) => {
                // uijsonLoder.start((data) => {
                let jsonData = JSON.parse(result as string);
                if (!jsonData) {
                    console.error("ui资源json有错误在请检查文件  " + url);
                    return;
                }
                // this.jsonList.set(url, jsonData);
                let uiInfo = jsonData[0];
                if (!uiInfo) {
                    console.error("ui资源json有错误在请检查文件  " + url);
                    return;
                }
                let insidMap: { [key: number]: any } = {};
                let compMap = [];
                let trans = this.makeTran(uiInfo, insidMap);
                this.setCompsToTran2D(trans, uiInfo, insidMap, compMap);
                this.referenceComps(insidMap, compMap);
                root.addChild(trans)
            });
        });

        // LoaderManage.Instance.load(url2, () => {
        //     LoaderManage.Instance.load(url, (loader, data) => {
        //         // uijsonLoder.start((data) => {
        //         let jsonData = data;
        //         if (!jsonData) {
        //             console.error("ui资源json有错误在请检查文件  " + url);
        //             return;
        //         }
        //         // this.jsonList.set(url, jsonData);
        //         let uiInfo = jsonData[0];
        //         if (!uiInfo) {
        //             console.error("ui资源json有错误在请检查文件  " + url);
        //             return;
        //         }
        //         let insidMap: { [key: number]: any } = {};
        //         let compMap = [];
        //         let trans = this.makeTran(uiInfo, insidMap);
        //         this.setCompsToTran2D(trans, uiInfo, insidMap, compMap);
        //         this.referenceComps(insidMap, compMap);
        //         root.addChild(trans);
        //     }, LoadTypey.JSON).load();
        // }, LoadType.assetMgr).load();
    }

    private static referenceComps(insidMap, compMap) {
        for (let index = 0; index < compMap.length; index++) {
            const element = compMap[index];
            this.referenceComp(element, insidMap);
        }

    }
    private static setCompsToTran2D(trans: m4m.framework.transform2D, pfInfo, insidMap, compMap) {

        for (let i = 0; i < pfInfo.components.length; i++) {
            let compInfo = pfInfo.components[i];
            let rawComp = this.makeAComp2D(compInfo, insidMap, compMap);
            if (rawComp) {
                trans.addComponentDirect(rawComp);
            }
        }

        //递归组装子对象
        for (let i = 0; i < trans.children.length; i++) {
            let childTran = trans.children[i];
            let childTranInfo = pfInfo.children[i];
            this.setCompsToTran2D(childTran, childTranInfo, insidMap, compMap);
        }
    }

    private static makeTran(pfInfo, insidMap) {
        let trans = new m4m.framework.transform2D();
        trans.name = pfInfo.tranName;
        trans.prefab = pfInfo.prefab;
        trans.layer = pfInfo.layer;
        trans.tag = pfInfo.tag;
        trans.isStatic = pfInfo.isStatic;
        trans.width = pfInfo.width;
        trans.height = pfInfo.height;
        m4m.math.vec2Clone(pfInfo.pivot, trans.pivot);
        trans.visible = pfInfo._visible;
        m4m.math.vec2Clone(pfInfo.localTranslate, trans.localTranslate);
        m4m.math.vec2Clone(pfInfo.localScale, trans.localScale);
        trans.localRotate = pfInfo.localRotate;
        trans.isMask = pfInfo.isMask;
        trans.layoutState = pfInfo.layoutState;
        trans.layoutPercentState = pfInfo.layoutPercentState;
        trans.setLayoutValue(1, pfInfo.layoutValueMap.n1);
        trans.setLayoutValue(2, pfInfo.layoutValueMap.n2);
        trans.setLayoutValue(4, pfInfo.layoutValueMap.n4);
        trans.setLayoutValue(8, pfInfo.layoutValueMap.n8);
        trans.setLayoutValue(16, pfInfo.layoutValueMap.n16);
        trans.setLayoutValue(32, pfInfo.layoutValueMap.n32);
        if (pfInfo.insid != null) {
            insidMap[pfInfo.insid] = trans;
        }
        //递归组装子对象
        if (pfInfo.children) {
            for (let i = 0; i < pfInfo.children.length; i++) {
                let childTranInfo = pfInfo.children[i];
                let childTran = this.makeTran(childTranInfo, insidMap);
                trans.addChild(childTran);
            }
        }
        return trans;
    }

    private static makeAComp2D(compInfo: any, insidMap, compMap) {
        let name = compInfo.cmop as string || compInfo.className as string;
        switch (name) {
            case "button":
                let compButton = new m4m.framework.button();
                compButton.transition = compInfo.transition;
                compButton["_origianlSpriteName"] = compInfo._origianlSpriteName;
                compButton["_pressedSpriteName"] = compInfo._pressedSpriteName;
                m4m.math.colorClone(compInfo.normalColor, compButton.normalColor);
                m4m.math.colorClone(compInfo.pressedColor, compButton.pressedColor);
                compButton.fadeDuration = compInfo.fadeDuration;
                compInfo["_comp"] = compButton;
                compMap.push(compInfo);
                return compButton;
            case "image2D":
                let compImage2D = new m4m.framework.image2D();
                m4m.math.colorClone(compInfo.color, compImage2D.color);
                compImage2D.imageType = compInfo.imageType;
                compImage2D.fillMethod = compInfo.fillMethod;
                compImage2D.fillAmmount = compInfo.fillAmmount;
                // compImage2D.sprite = m4m.framework.sceneMgr.app.getAssetMgr().getDefaultSprite("grid_sprite");
                let assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
                let _sp = assetMgr.getDefaultSprite(compInfo._spriteName);
                if (!_sp) {
                    _sp = assetMgr.getAssetByName(compInfo._spriteName);
                }
                compImage2D.sprite = _sp;
                compImage2D["_spriteName"] = compInfo._spriteName;
                compImage2D["_imageBorder"].l = compInfo._imageBorder.l;
                compImage2D["_imageBorder"].t = compInfo._imageBorder.t;
                compImage2D["_imageBorder"].r = compInfo._imageBorder.r;
                compImage2D["_imageBorder"].b = compInfo._imageBorder.b;
                return compImage2D;
            case "label":
                let compLabel = new m4m.framework.label();
                compLabel.text = compInfo.text;
                //compLabel.font = new m4m.framework.font(compInfo._fontName);
                compLabel.font = EditorApplication.Instance.editorResources.defaultFont;
                compLabel["_fontName"] = EditorApplication.Instance.editorResources.defaultFont.fontname;
                //compLabel["_fontName"] = compInfo._fontName;
                compLabel.fontsize = compInfo.fontsize;
                compLabel.linespace = compInfo.linespace;
                compLabel.horizontalType = compInfo.horizontalType;
                compLabel.verticalType = compInfo.verticalType;
                compLabel.horizontalOverflow = compInfo.horizontalOverflow;
                compLabel.verticalOverflow = compInfo.verticalOverflow;
                m4m.math.colorClone(compInfo.color, compLabel.color);
                m4m.math.colorClone(compInfo.color2, compLabel.color2);
                return compLabel;
            case "scrollRect":
                let compScrollRect = new m4m.framework.scrollRect();
                compScrollRect.content = insidMap[compInfo.content];
                compScrollRect.horizontal = compInfo.horizontal;
                compScrollRect.vertical = compInfo.vertical;
                compScrollRect.inertia = compInfo.inertia;
                compScrollRect.decelerationRate = compInfo.decelerationRate;
                return compScrollRect;
            case "rawImage2D":
                let compRawImage2D = new m4m.framework.rawImage2D();
                m4m.math.colorClone(compInfo.color, compRawImage2D.color);
                return compRawImage2D;
            case "progressbar":
                let compProgressbar = new m4m.framework.progressbar();
                compProgressbar.value = compInfo.value;
                compProgressbar.cutPanel = insidMap[compInfo.cutPanel];
                // compProgressbar.barOverImg = insidMap[compInfo.barOverImg];
                // compProgressbar.barBg = insidMap[compInfo.barBg];
                compInfo["_comp"] = compProgressbar;
                compMap.push(compInfo);
                return compProgressbar;
            case "input":
                let compinput = new m4m.framework.inputField();
                compinput.characterLimit = compInfo.characterLimit;
                compinput.LineType = compInfo.LineType;
                compinput.ContentType = compInfo.ContentType;

                // compinput.frameImage=insidMap[compInfo.frameImage];
                // compinput.TextLabel=insidMap[compInfo.TextLabel];
                // compinput.PlaceholderLabel=insidMap[compInfo.PlaceholderLabel];
                compInfo["_comp"] = compinput;
                compMap.push(compInfo);
                return compinput;
            default: return null;
        }
    }


    private static referenceComp(compInfo: any, insidMap) {
        let name = compInfo.cmop || compInfo.className;
        switch (name) {
            case "button":
                let compButton = compInfo["_comp"] as m4m.framework.button;
                if (insidMap[compInfo.targetImage]) {
                    let image = insidMap[compInfo.targetImage].getComponent("image2D") as m4m.framework.image2D;
                    compButton.targetImage = image;
                }
                break;
            case "progressbar":
                let compProgressbar = compInfo["_comp"] as m4m.framework.progressbar;
                if (insidMap[compInfo.barBg]) {
                    compProgressbar.barBg = insidMap[compInfo.barBg].getComponent("image2D") as m4m.framework.image2D;
                }
                if (insidMap[compInfo.barOverImg]) {
                    compProgressbar.barOverImg = insidMap[compInfo.barOverImg].getComponent("image2D") as m4m.framework.image2D;
                }
                break;
            case "input":
                let compinput = compInfo["_comp"] as m4m.framework.inputField;
                if (insidMap[compInfo.frameImage]) {
                    compinput.frameImage = insidMap[compInfo.frameImage].getComponent("image2D") as m4m.framework.image2D;
                }
                if (insidMap[compInfo.TextLabel]) {
                    compinput.TextLabel = insidMap[compInfo.TextLabel].getComponent("label") as m4m.framework.label;
                }
                if (insidMap[compInfo.PlaceholderLabel]) {
                    compinput.PlaceholderLabel = insidMap[compInfo.PlaceholderLabel].getComponent("label") as m4m.framework.label;
                }
                break;
        }
    }
}