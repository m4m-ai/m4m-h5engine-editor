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
//import { INumberInputAttrData } from "../../common/attribute/attr/NumberInputAttr";
import { IComponentData } from "../../common/inspector/components/Component";
import I2DComponent = m4m.framework.I2DComponent;

export class InputFieldAttributeDataMgr {
    //Panel组件属性变化
    public static getInputFieldData(node: I2DComponent): IComponentData {
        return null;

        // let selection = EditorApplication.Instance.selection;
        // let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
        // let inputField = node as m4m.framework.inputField;

        // // inputField.ContentType= m4m.framework.contentType.Number;
        // //设置输入内容
        // let textRefresh: Function = null;
        // let setText = selection.addPropertyListener(inputField, "text", ValueType.string, (value) => {
        //     if (textRefresh) {
        //         textRefresh(value);
        //     }
        // });
        // //设置输入内容类型
        // let contentTypeRefresh: Function = null;
        // let setContentType = selection.addPropertyListener(inputField, "ContentType", ValueType.string, (value) => {
        //     if (contentTypeRefresh) {
        //         contentTypeRefresh(value);
        //     }
        // });

        // //行类型
        // let lineTypeRefresh: Function = null;
        // let setLineType = selection.addPropertyListener(inputField, "LineType", ValueType.string, (value) => {
        //     if (lineTypeRefresh) {
        //         lineTypeRefresh(value);
        //     }
        // });
        // //设置输入的字符限制个数
        // let characterLimitRefresh: Function = null;
        // let setCharacterLimit = selection.addPropertyListener(inputField, "characterLimit", ValueType.number, (value) => {
        //     if (characterLimitRefresh) {
        //         characterLimitRefresh(value);
        //     }
        // });


        // //输入内容的类型
        // let contentTypeArr = [];
        // contentTypeArr.push({ label: "None", value: m4m.framework.contentType.None });
        // contentTypeArr.push({ label: "Number", value: m4m.framework.contentType.Number });//数字
        // contentTypeArr.push({ label: "Word", value: m4m.framework.contentType.Word });//字母
        // contentTypeArr.push({ label: "Underline", value: m4m.framework.contentType.Underline });//下划线
        // contentTypeArr.push({ label: "ChineseCharacter", value: m4m.framework.contentType.ChineseCharacter });//中文字符
        // contentTypeArr.push({ label: "NoneChineseCharacter", value: m4m.framework.contentType.NoneChineseCharacter });//没有中文字符
        // contentTypeArr.push({ label: "Email", value: m4m.framework.contentType.Email });//邮件
        // contentTypeArr.push({ label: "PassWord", value: m4m.framework.contentType.PassWord });//密码
        // contentTypeArr.push({ label: "UndCustomerline", value: m4m.framework.contentType.Custom });//自定义

        // //行模式
        // let lineTypeArr = [];
        // lineTypeArr.push({ label: "SingleLine", value: m4m.framework.lineType.SingleLine });//单行模式
        // lineTypeArr.push({ label: "MultiLine", value: m4m.framework.lineType.MultiLine });//多行模式
        // lineTypeArr.push({ label: "MultiLine_NewLine", value: m4m.framework.lineType.MultiLine_NewLine });//多行模式 输入回车换行

        // //
        // let TextComponentRefresh: Function = null;
        // let TextComponent = selection.addPropertyListener(inputField, "TextLabel", ValueType.number, (value) => {
        //     if (TextComponentRefresh) {
        //         TextComponentRefresh(value);
        //     }
        // });
        // //
        // let PlaceholderRefresh: Function = null;
        // let Placeholder = selection.addPropertyListener(inputField, "PlaceholderLabel", ValueType.number, (value) => {
        //     if (TextComponentRefresh) {
        //         TextComponentRefresh(value);
        //     }
        // });
        // //
        // let frameImageRefresh: Function = null;
        // let frameImage = selection.addPropertyListener(inputField, "frameImage", ValueType.number, (value) => {
        //     if (TextComponentRefresh) {
        //         frameImageRefresh(value);
        //     }
        // });

        // return {
        //     enable: null,
        //     title: "InputField",
        //     component: inputField,
        //     ticon: null,
        //     attrs: [
        //         {
        //             title: "Text",
        //             type: "string",
        //             attr: <IStringInputAttrData>{
        //                 attrValue: inputField.text,

        //                 onChange(value) {
        //                     setText(value);
        //                     inputField.setFocus(true);
        //                     inputField.transform.markDirty();
        //                 },
        //                 setRefresh(cb: Function) {
        //                     textRefresh = cb;
        //                 }
        //             }
        //         },
        //         {
        //             title: "Content Type",
        //             type: "select",
        //             attr: <ISelectAttrData>{
        //                 options: contentTypeArr,
        //                 attrValue: inputField.ContentType,
        //                 onChange: (value: m4m.framework.contentType) => {
        //                     setContentType(value);
        //                 },
        //                 setRefresh: (refresh) => {
        //                     contentTypeRefresh = refresh;
        //                 },
        //             }
        //         },
        //         {
        //             title: "Line Type",
        //             type: "select",
        //             attr: <ISelectAttrData>{
        //                 attrValue: inputField.LineType,
        //                 options: lineTypeArr,

        //                 onChange: (value: m4m.framework.lineType) => {
        //                     setLineType(value);
        //                 },
        //                 setRefresh: (refresh) => {
        //                     lineTypeRefresh = refresh;
        //                 },
        //             }
        //         },
        //         {
        //             title: "Character Limit",
        //             type: "number",
        //             attr: <INumberInputAttrData>{
        //                 attrValue: inputField.characterLimit,
        //                 onChange: (value) => {
        //                     setCharacterLimit(value);
        //                 },
        //                 setRefresh: (refresh) => {
        //                     characterLimitRefresh = refresh;
        //                 },
        //             }
        //         },
        //         //输入框引用相关 后续修改
        //         //Label
        //         {
        //             title: "Text Component",
        //             type: "number",
        //             attr: {
        //                 attrValue: {
        //                     value: inputField.TextLabel,
        //                 },
        //                 onChange: (value: {value: number}) => {
        //                     console.log("textLabel 的引用");
        //                 },
        //                 setRefresh: (refresh) => {
        //                     TextComponentRefresh = refresh;
        //                 },
        //             }
        //         },
        //         //Label
        //         {
        //             title: "Placeholder",
        //             type: "number",
        //             attr: {
        //                 attrValue:{
        //                     value: inputField.PlaceholderLabel,
        //                 },
        //                 onChange: (value: {value: number}) => {
        //                     console.log("PlaceholderLabel 的引用");
        //                 },
        //                 setRefresh: (refresh) => {
        //                     PlaceholderRefresh = refresh;
        //                 },
        //             }
        //         },
        //         //Image2D
        //         {
        //             title: "Target Graphic",
        //             type: "number",
        //             attr: {
        //                 attrValue: {
        //                     value: inputField.frameImage,
        //                 },
        //                 onChange: (value: {value: number}) => {
        //                     console.log("frameImage 的引用");
        //                 },
        //                 setRefresh: (refresh) => {
        //                     frameImageRefresh = refresh;
        //                 },
        //             }
        //         },
        //     ]
        // }

    }
}