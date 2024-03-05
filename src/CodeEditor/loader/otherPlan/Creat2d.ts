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
import { EditorApplication } from "../../../Game/EditorApplication";
import { ExportManager } from "../../../Game/ExportManager/ExportManager";
import { FileInfoManager } from "../../code/FileInfoManager";

export class Creat2d {
    public static create(info) {
        let insidMap: { [key: number]: any } = {};
        let compMap = [];
        let trans = Creat2d.makeAPrefab2D(info, insidMap);
        Creat2d.setCompsToTran2D(trans, info, insidMap, compMap);
        Creat2d.referenceComps(insidMap, compMap);
        trans.markDirty();
        return trans;
    }
    private static referenceComps(insidMap, compMap) {
        for (let index = 0; index < compMap.length; index++) {
            const element = compMap[index];
            Creat2d.referenceComp(element, insidMap);
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
            // case "joyStick":
            //     let compJoyStick = compInfo["_comp"] as joyStick;
            //     if (insidMap[compInfo.bottomImg]) {

            //         compJoyStick.bottomImg = insidMap[compInfo.bottomImg].getComponent("image2D") as m4m.framework.image2D;
            //     }
            //     if (insidMap[compInfo.overImg]) {

            //         compJoyStick.overImg = insidMap[compInfo.overImg].getComponent("image2D") as m4m.framework.image2D;
            //     }
            //     break;
            // case "imgNum":
            //     let compImgNum = compInfo["_comp"] as imgNum;
            //     if (insidMap[compInfo.template]) {

            //         compImgNum.template = insidMap[compInfo.template].getComponent("image2D") as m4m.framework.image2D;
            //     }
            //     break;
            // case "uiImageSlider":
            //     let compuiImageSlider = compInfo["_comp"] as uiImageSlider;
            //     if (insidMap[compInfo.scrollRect]) {

            //         compuiImageSlider.scrollRect = insidMap[compInfo.scrollRect].getComponent("scrollRect") as m4m.framework.scrollRect;
            //     }
            //     break;
            // case "uiFloat":
            //     let compUiFloat = compInfo["_comp"] as uiFloat;
            //     if (insidMap[compInfo.floatIcon]) {

            //         compUiFloat.floatIcon = insidMap[compInfo.floatIcon].getComponent("rawImage2D") as m4m.framework.rawImage2D;
            //     }
            //     if (insidMap[compInfo.clickBtn]) {

            //         compUiFloat.clickBtn = insidMap[compInfo.clickBtn].getComponent("button") as m4m.framework.button;
            //     }
            //     break;
            // case "uiRoll":
            //     let compUiRoll = compInfo["_comp"] as uiRoll;
            //     if (insidMap[compInfo.bg1]) {

            //         compUiRoll.bg1 = insidMap[compInfo.bg1].getComponent("rawImage2D") as m4m.framework.rawImage2D;
            //     }
            //     if (insidMap[compInfo.bg2]) {

            //         compUiRoll.bg2 = insidMap[compInfo.bg2].getComponent("rawImage2D") as m4m.framework.rawImage2D;
            //     }

            //     compInfo["_comp"] = compUiRoll;
            //     return compUiRoll;
            default:
                if (name.indexOf("Handle") == -1) {
                    console.error("==========================未完成的2D组件解析：" + name);
                }
                // let handleComp = compInfo["_comp"] as uiFloat;
                for (let index = 0; index < compInfo.referenceName.length; index++) {
                    let refName = compInfo.referenceName[index];
                    // if (refName == "imgnum") {
                    //     console.error(refName)
                    // }
                    let reType = compInfo.referenceType[index];
                    let reInsid = compInfo.referenceInsdi[index];
                    if (insidMap[reInsid]) {

                        // if (reType == "transform2D") {

                        //     handleComp[refName] = insidMap[reInsid];
                        // } else {
                        //     handleComp[refName] = insidMap[reInsid].getComponent(reType);
                        // }
                    }
                }
        }
    }
    private static makeAPrefab2D(pfInfo, insidMap) {
        let trans = new m4m.framework.transform2D();
        trans.name = pfInfo.tranName;

        if (pfInfo.insid != null) {
            insidMap[pfInfo.insid] = trans;
        }
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
        // trans["layoutValueMap"] = pfInfo.layoutValueMap;
        trans.setLayoutValue(1, pfInfo.layoutValueMap["1"]);
        trans.setLayoutValue(2, pfInfo.layoutValueMap["2"]);
        trans.setLayoutValue(4, pfInfo.layoutValueMap["4"]);
        trans.setLayoutValue(8, pfInfo.layoutValueMap["8"]);
        trans.setLayoutValue(16, pfInfo.layoutValueMap["16"]);
        trans.setLayoutValue(32, pfInfo.layoutValueMap["32"]);
        //递归组装子对象
        if (pfInfo.children) {
            for (let i = 0; i < pfInfo.children.length; i++) {
                let childTranInfo = pfInfo.children[i];
                if (childTranInfo.prefabKey) {
                    ExportManager.getPrefab2DByKey(childTranInfo.prefabKey, trans);
                } else {

                    let childTran = Creat2d.makeAPrefab2D(childTranInfo, insidMap);
                    trans.addChild(childTran);
                }
            }
        }
        return trans;
    }
    private static setCompsToTran2D(trans: m4m.framework.transform2D, pfInfo, insidMap, compMap) {

        for (let i = 0; i < pfInfo.components.length; i++) {
            let compInfo = pfInfo.components[i];
            let rawComp = Creat2d.makeAComp2D(trans, compInfo, insidMap, compMap);
            if (rawComp) {
                trans.addComponentDirect(rawComp);
            }
        }

        //递归组装子对象
        for (let i = 0; i < trans.children.length; i++) {
            let childTran = trans.children[i];
            let childTranInfo = pfInfo.children[i];
            Creat2d.setCompsToTran2D(childTran, childTranInfo, insidMap, compMap);
        }
    }
    public static createImage(key: string, callBack: Function) {
        let app = m4m.framework.sceneMgr.app;



        // let _name: string = mainImgData.imageName;
        // let _filterMode: string = mainImgData.filterMode;
        // let _format: string = mainImgData.format;
        // let _mipmap: boolean = mainImgData.mipmap;
        let _mipmap: boolean = true;
        // if (!_mipmap) {
        //     _mipmap = false;
        // }
        // let _wrap: string = mainImgData.wrap;
        // let _premultiplyAlpha: boolean = mainImgData.premultiplyAlpha;

        // if (_premultiplyAlpha == undefined) {
        let _premultiplyAlpha = true;
        // }
        let _textureFormat = m4m.render.TextureFormatEnum.RGBA;//这里需要确定格式
        // if (_format == "RGB") {
        //     _textureFormat = m4m.render.TextureFormatEnum.RGB;
        // } else if (_format == "Gray") {
        //     _textureFormat = m4m.render.TextureFormatEnum.Gray;
        // }

        let _linear: boolean = true;
        // if (_filterMode.indexOf("linear") < 0) {
        //     _linear = false;
        // }

        let _repeat: boolean = false;
        // if (_wrap.indexOf("Repeat") >= 0) {
        //     _repeat = true;
        // }

        // let imgKey = mainImgData.imageKey;

        let imgfileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (!imgfileInfo) {
            return;
        }
        let _texture: m4m.framework.texture;
        if (imgfileInfo.value) {
            _texture = new m4m.framework.texture(imgfileInfo.value);

            _texture.realName = imgfileInfo.value;
        } else {
            _texture = new m4m.framework.texture(imgfileInfo.key);

            _texture.realName = imgfileInfo.key;
        }
        let url = ExportManager.getFileUrl(imgfileInfo.relativePath);
        // let tType = Creat3d.tNormal;
        // if (url.indexOf(".pvr.bin") >= 0) {
        //     tType = Creat3d.tPVR;
        // } else if (url.indexOf(".dds.bin") >= 0) {
        //     tType = Creat3d.tDDS;
        // } else if (url.indexOf(".ktx") >= 0) {
        //     tType = Creat3d.tKTX;
        // } else if (url.indexOf(".astc") >= 0) {
        //     tType = Creat3d.tASCT;
        // }

        //构建贴图
        // console.error("=================================   " + url);
        // tslint:disable-next-line: switch-default
        // if (!this.loadImgMap.get(url)) {
        // switch (tType) {
        //     case Creat3d.tNormal:
        let t2d = new m4m.render.glTexture2D(app.getAssetMgr().webgl, _textureFormat);
        m4m.io.loadImg(url, (img) => {
            t2d.uploadImage(img, _mipmap, _linear, _premultiplyAlpha, _repeat);
            _texture.glTexture = t2d;
            _texture["_ref"] = { key };
            if (callBack) {
                callBack(_texture);
            }
        });

        //     break;
        // case Creat3d.tPVR:
        //     let pvr: testPvrParse = new testPvrParse(app.getAssetMgr().webgl);
        //     LoaderManager.Instance.load(url, (loader: Loader, img: any) => {

        //         _texture.glTexture = pvr.parse(img as ArrayBuffer);
        //         mat.setTexture(typekey, _texture);
        //         mat.statedMapUniforms[typekey]["valueKey"] = key;
        //         mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
        //     }, LoadType.ARRAYBUFFER);
        //     break;
        // case Creat3d.tKTX:
        //     LoaderManager.Instance.load(url, (loader: Loader, img: any) => {
        //         _texture.glTexture = KTXParse.parse(app.getAssetMgr().webgl, img as ArrayBuffer);
        //         mat.setTexture(typekey, _texture);
        //         mat.statedMapUniforms[typekey]["valueKey"] = key;
        //         mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
        //     }, LoadType.ARRAYBUFFER);
        //     break;
        // case Creat3d.tASCT:
        //     LoaderManager.Instance.load(url, (loader: Loader, img: any) => {
        //         _texture.glTexture = m4m.framework.ASTCParse.parse(app.getAssetMgr().webgl, img as ArrayBuffer);
        //         mat.setTexture(typekey, _texture);
        //         mat.statedMapUniforms[typekey]["valueKey"] = key;
        //         mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
        //     }, LoadType.ARRAYBUFFER);
        //     break;
        // case Creat3d.tDDS:
        //     throw new Error("暂不支持DDS");
        // // assetMgr.webgl.pixelStorei(assetMgr.webgl.UNPACK_FLIP_Y_WEBGL, 1);
        // // let textureUtil = new WebGLTextureUtil(assetMgr.webgl, true);
        // // textureUtil.loadDDS(_textureSrc, null, (texture, error, stats) =>
        // // {
        // //     let t2d = new m4m.render.glTexture2D(assetMgr.webgl);
        // //     t2d.format = m4m.render.TextureFormatEnum.PVRTC2_RGB;
        // //     t2d.texture = texture;
        // //     _texture.glTexture = t2d;
        // // });
        // // break;
        // default:
        // }
    }
    private static makeAComp2D(trans: m4m.framework.transform2D, compInfo: any, insidMap, compMap) {
        let name = compInfo.className as string;
        switch (name) {
            case "button":
                let compButton = new m4m.framework.button();
                if (compInfo.transition) {
                    compButton.transition = compInfo.transition;
                }
                if (compInfo._origianlSpriteName) {
                    compButton["_origianlSpriteName"] = compInfo._origianlSpriteName;
                }
                if (compInfo._pressedSpriteName) {
                    compButton["_pressedSpriteName"] = compInfo._pressedSpriteName;
                }
                if (compInfo.normalColor) {
                    m4m.math.colorClone(compInfo.normalColor, compButton.normalColor);
                }
                if (compInfo.pressedColor) {
                    m4m.math.colorClone(compInfo.pressedColor, compButton.pressedColor);
                }
                if (compInfo.fadeDuration) {
                    compButton.fadeDuration = compInfo.fadeDuration;
                }
                compInfo["_comp"] = compButton;
                compMap.push(compInfo);
                return compButton;
            case "image2D":
                let compImage2D = new m4m.framework.image2D();
                if (compInfo.color) {
                    m4m.math.colorClone(compInfo.color, compImage2D.color);
                }
                if (compInfo.imageType) {
                    compImage2D.imageType = compInfo.imageType;
                }
                if (compInfo.fillMethod) {
                    compImage2D.fillMethod = compInfo.fillMethod;
                }
                if (compInfo.fillAmmount) {
                    compImage2D.fillAmmount = compInfo.fillAmmount;
                }
                if (compInfo._spriteName) {
                    compImage2D["_spriteName"] = compInfo._spriteName;
                }
                if (compInfo.fileKey) {
                    this.createImage(compInfo.fileKey, (t:m4m.framework.texture) => {
                      let s=new m4m.framework.sprite(t.getName());
                      s.texture = t;
                      s.rect= new m4m.math.rect(0,0,t.glTexture.width,t.glTexture.height);
                        compImage2D.sprite=s;
                    });
                }
                if (compInfo._imageBorder) {
                    compImage2D["_imageBorder"].l = compInfo._imageBorder.l;
                    compImage2D["_imageBorder"].t = compInfo._imageBorder.t;
                    compImage2D["_imageBorder"].r = compInfo._imageBorder.r;
                    compImage2D["_imageBorder"].b = compInfo._imageBorder.b;
                }
                return compImage2D;
            case "label":
                let compLabel = new m4m.framework.label();
                if (compInfo.text) {
                    compLabel.text = compInfo.text;
                }
                if (compInfo._fontName) {
                    //  compLabel.font = new m4m.framework.font(compInfo._fontName);
                    compLabel.font = EditorApplication.Instance.editorResources.defaultFont;
                }
                if (compInfo.fontsize) {
                    compLabel.fontsize = compInfo.fontsize;
                }
                if (compInfo.linespace) {
                    compLabel.linespace = compInfo.linespace;
                }
                if (compInfo.horizontalType) {
                    compLabel.horizontalType = compInfo.horizontalType;
                }
                if (compInfo.verticalType) {
                    compLabel.verticalType = compInfo.verticalType;
                }
                if (compInfo.horizontalOverflow) {
                    compLabel.horizontalOverflow = compInfo.horizontalOverflow;
                }
                if (compInfo.verticalOverflow) {
                    compLabel.verticalOverflow = compInfo.verticalOverflow;
                }
                if (compInfo.color) {
                    m4m.math.colorClone(compInfo.color, compLabel.color);
                }
                if (compInfo.color2) {
                    m4m.math.colorClone(compInfo.color2, compLabel.color2);
                }

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
                if (compInfo.fileKey) {
                    this.createImage(compInfo.fileKey, (t) => {
                        compRawImage2D.image = t;
                    });
                }
                // compRawImage2D.image=
                m4m.math.colorClone(compInfo.color, compRawImage2D.color);
                return compRawImage2D;
            // case "uiScaleDown":
            //     return new uiScaleDown();
            // case "uiScaleAnimation":
            //     return new uiScaleAnimation();
            // case "multiToucher":
            //     return new multiToucher();
            // case "uiSpring":
            //     return new uiSpring();
            // case "sequenceFrame":
            //     return new sequenceFrame();
            // case "uiBtnDown":
            //     return new uiBtnDown();
            case "progressbar":
                let compProgressbar = new m4m.framework.progressbar();
                compProgressbar.value = compInfo.value;
                compProgressbar.cutPanel = insidMap[compInfo.cutPanel];
                compInfo["_comp"] = compProgressbar;
                compMap.push(compInfo);
                return compProgressbar;
            // case "joyStick":
            //     let compJoyStick = new joyStick();
            //     compJoyStick.moveRange = compInfo.moveRange;
            //     compInfo["_comp"] = compJoyStick;
            //     compMap.push(compInfo);
            //     return compJoyStick;
            // case "uiRoll":
            //     let compUiRoll = new uiRoll();
            //     compUiRoll.bgPan1 = insidMap[compInfo.bgPan1];
            //     compUiRoll.bgPan2 = insidMap[compInfo.bgPan2];

            //     compInfo["_comp"] = compUiRoll;
            //     compMap.push(compInfo);
            //     return compUiRoll;
            // case "imgNum":
            //     let compImgNum = new imgNum();
            //     compImgNum.gap = compInfo.gap;
            //     compInfo["_comp"] = compImgNum;
            //     compMap.push(compInfo);
            //     return compImgNum;
            case "slideArea":
                let compSlideArea = new m4m.framework.slideArea();
                compSlideArea.horizontal = compInfo.horizontal;
                compSlideArea.vertical = compInfo.vertical;
                return compSlideArea;
            // case "uiImageSlider":
            //     let compuiImageSlider = new uiImageSlider();
            //     compuiImageSlider.content = insidMap[compInfo.content];
            //     compuiImageSlider.imageTrans = insidMap[compInfo.imageTrans];
            //     compuiImageSlider.imageBgTrans = insidMap[compInfo.imageBgTrans];
            //     compInfo["_comp"] = compuiImageSlider;
            //     compMap.push(compInfo);
            //     return compuiImageSlider;
            // case "uiFloat":
            //     let compUiFloat = new uiFloat();
            //     compInfo["_comp"] = compUiFloat;
            //     compMap.push(compInfo);
            //     return compUiFloat;
            default:
                if (name.indexOf("Handle") == -1) {
                    console.error("==========================未完成的2D组件解析：" + name);
                }
                let handleComp = trans.addComponent(name);
                compInfo["_comp"] = handleComp;
                compMap.push(compInfo);
                return null;
        }
    }
}