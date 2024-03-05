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
import { IComponentData } from "../../common/inspector/components/Component";
import { EditorApplication } from "../EditorApplication";
import { ValueType } from "../ValueType";
import nodeComponent = m4m.framework.nodeComponent;
import C2DComponent = m4m.framework.C2DComponent;
import I2DComponent = m4m.framework.I2DComponent;

export class ProgressBarAttributeDataMgr {
    // //进度条组件属性变化
    // public static getProgressBarData(node: I2DComponent): IComponentData{

    //     let selection = EditorApplication.Instance.selection;
    //     let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
    //     let progressBar = node as m4m.framework.progressbar;

    //     //设置进度条值
    //     let valueRefresh: Function = null;
    //     let setValue = selection.addPropertyListener(progressBar, "value", ValueType.number, (value) => {
    //         if (valueRefresh) {
    //             valueRefresh(value);
    //         }
    //     });
    //     //
    //     let BarBgRefresh: Function = null;
    //     let BarBg = selection.addPropertyListener(progressBar, "barBg", ValueType.number, (value) => {
    //         if (BarBgRefresh) {
    //             BarBgRefresh(value);
    //         }
    //     });
    //     //
    //     let cutPanelRefresh: Function = null;
    //     let cutPanel = selection.addPropertyListener(progressBar, "cutPanel", ValueType.number, (value) => {
    //         if (cutPanelRefresh) {
    //             cutPanelRefresh(value);
    //         }
    //     });
    //     //
    //     let barOverImgRefresh: Function = null;
    //     let barOverImg = selection.addPropertyListener(progressBar, "barOverImg", ValueType.number, (value) => {
    //         if (barOverImgRefresh) {
    //             barOverImgRefresh(value);
    //         }
    //     });

    //     return {
    //         enable: null,
    //         title: "ProgressBar",
    //         component:progressBar,
    //         ticon: null,
    //         attrs: [
    //             {
    //                 title: "Value",
    //                 type: "number",
    //                 attr: {
    //                     attrValue:{
    //                         value: progressBar.value,
    //                     },

    //                     onChange(value: { value: number }) {
    //                         setValue(value.value);
    //                         progressBar.transform.markDirty();
    //                     },
    //                     setRefresh(cb: Function) {
    //                         valueRefresh = cb;
    //                     }
    //                 }
    //             },
    //             //进度条 引用相关 后续修改
    //             {
    //                 title: "BarBg",
    //                 type: "number",
    //                 attr: {
    //                     attrValue: {
    //                         value: progressBar.barBg,   //progressBar (image2D)
    //                     },
    //                     onChange(value: { value: number }) {
    //                         // setValue(v);
    //                         console.log("barbg 的引用");
    //                     },
    //                     setRefresh(cb: Function) {
    //                         BarBgRefresh = cb;
    //                     }
    //                 }
    //             },
    //             {
    //                 title: "CutPanel",
    //                 type: "number",
    //                 attr: {
    //                     attrValue:{
    //                         value: progressBar.cutPanel,   //cut (transform2D)
    //                     },

    //                     onChange(value: { v: number }) {
    //                         // setValue(v);
    //                         console.log("cutPanel 的引用");
    //                     },
    //                     setRefresh(cb: Function) {
    //                         cutPanelRefresh = cb;
    //                     }
    //                 }
    //             },
    //             {
    //                 title: "BarOverImg",
    //                 type: "number",
    //                 attr: {
    //                     attrValue: {
    //                         value: progressBar.barOverImg,   //overBar (image2D)
    //                     },
    //                     onChange(value: { v: number }) {
    //                         // setValue(v);
    //                         console.log("barOverImg 的引用");
    //                     },
    //                     setRefresh(cb: Function) {
    //                         barOverImgRefresh = cb;
    //                     }
    //                 }
    //             },
    //         ]
    //     }
    // }
}