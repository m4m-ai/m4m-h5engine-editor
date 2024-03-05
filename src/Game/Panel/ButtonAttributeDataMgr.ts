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

import I2DComponent = m4m.framework.I2DComponent;
export class ButtonAttributeDataMgr {
    //Button组件属性变化
    public static getButton2DData(node: I2DComponent): IComponentData {
        return null;
        // let selection = EditorApplication.Instance.selection;
        // let button = node as m4m.framework.button;
        // let selectArr = [];
        // selectArr.push({ label: "None", value: m4m.framework.TransitionType.None });
        // selectArr.push({ label: "Color Tint", value: m4m.framework.TransitionType.ColorTint });
        // selectArr.push({ label: "Sprite Swap", value: m4m.framework.TransitionType.SpriteSwap });
        // //设置按钮变换类型
        // let transitionRefresh: Function = null;
        // let setTransition = selection.addPropertyListener(button, "transition", ValueType.string, (value) => {
        //     if (transitionRefresh) {
        //         transitionRefresh(value);
        //     }
        // });

        // //设置默认显示图片
        // let targetImageRefresh: Function = null;
        // let setTargetImage = selection.addPropertyListener(button, "targetImage", ValueType.string, (value) => {
        //     if (targetImageRefresh) {
        //         targetImageRefresh(value);
        //     }
        // });

        // //设置按钮默认颜色
        // let normalColorRefresh: Function = null;
        // let setNormalColor = selection.addPropertyListener(button, "normalColor", ValueType.string, (value) => {
        //     if (normalColorRefresh) {
        //         normalColorRefresh(value);
        //     }
        // });

        // //按下按钮颜色
        // let pressedColorRefresh: Function = null;
        // let setPressedColor = selection.addPropertyListener(button, "pressedColor", ValueType.string, (value) => {
        //     if (pressedColorRefresh) {
        //         pressedColorRefresh(value);
        //     }
        // });

        // return {
        //     enable: null,
        //     title: "Button",
        //     component: button,
        //     ticon: null,
        //     attrs: [
        //         {
        //             title: "Transition",
        //             type: "select",
        //             attr: <ISelectAttrData>{
        //                 attrValue: button.transition,
        //                 options: selectArr,
        //                 onChange: (value) => {
        //                     console.error(value);
        //                     // setTransition(val);
        //                     button.transform.markDirty();
        //                 },
        //                 setRefresh: (refresh) => {
        //                     transitionRefresh = refresh;
        //                 },
        //             }
        //         },
        //         {
        //             title: "Target Graphic",
        //             type: "asset",
        //             attr: <IAssetSelectionAttrData>{
        //                 attrValue: {
        //                     key: button.targetImage.sprite["_ref"],
        //                     name: button.targetImage.sprite?.getName(),
        //                 },
        //                 onChange: (value) => {
        //                     // setTargetImage(val);
        //                     button.transform.markDirty();
        //                 },
        //                 setRefresh: (refresh) => {
        //                     targetImageRefresh = refresh;
        //                 },
        //             }
        //         },
        //         {
        //             title: "Normal Color",
        //             type: "color",
        //             attr: <IColorSelectionAttrData>{
        //                 attrValue: button.normalColor,
        //                 onChange: (value) => {
        //                     setNormalColor(value);
        //                     button.transform.markDirty();
        //                 },
        //                 setRefresh: (refresh) => {
        //                     normalColorRefresh = refresh;
        //                 },
        //             }
        //         },
        //         {
        //             title: "Pressed Color",
        //             type: "color",
        //             attr: <IColorSelectionAttrData>{
        //                 attrValue: button.pressedColor,
        //                 onChange: (value) => {
        //                     setPressedColor(value);
        //                     button.transform.markDirty();
        //                 },
        //                 setRefresh: (refresh) => {
        //                     pressedColorRefresh = refresh;
        //                 },
        //             }
        //         }
        //     ]
        // }
    }
}