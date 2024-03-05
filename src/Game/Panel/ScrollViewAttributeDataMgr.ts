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

export class ScrollViewAttributeDataMgr {
    // //滑动区域组件属性变化
    // public static getScrollViewData(node: I2DComponent): IComponentData {

    //     let selection = EditorApplication.Instance.selection;
    //     let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
    //     let scrollRect = node as m4m.framework.scrollRect;

    //     //参照unity 默认关闭缓动效果
    //     scrollRect.inertia = false;
    //     scrollRect.transform.markDirty();

    //     // console.error(`滑动区域初始设置值： horizontal： ${scrollRect.horizontal}, vertical: ${scrollRect.vertical}, inertia: ${scrollRect.inertia} `);
    //     //勾选水平滑动
    //     let horizontalRefresh: Function = null;
    //     let setHorizontal = selection.addPropertyListener(scrollRect, "horizontal", ValueType.bool, (value) => {
    //         if (horizontalRefresh) {
    //             // horizontalRefresh(value);
    //         }
    //     });

    //     //勾选垂直滑动
    //     let VerticalRefresh: Function = null;
    //     let setVertical = selection.addPropertyListener(scrollRect, "vertical", ValueType.bool, (value) => {
    //         if (VerticalRefresh) {
    //             // VerticalRefresh(value);
    //         }
    //     });

    //     //
    //     let InertiaRefresh: Function = null;
    //     let setInertia = selection.addPropertyListener(scrollRect, "inertia", ValueType.bool, (value) => {
    //         if (InertiaRefresh) {
    //             InertiaRefresh(value);
    //         }
    //     });

    //     //
    //     let DecelerationRateRefresh: Function = null;
    //     let setDecelerationRate = selection.addPropertyListener(scrollRect, "decelerationRate", ValueType.number, (value) => {
    //         if (DecelerationRateRefresh) {
    //             DecelerationRateRefresh(value);
    //         }
    //     });

    //     //
    //     let contentRefresh: Function = null;
    //     let setContent = selection.addPropertyListener(scrollRect, "content", ValueType.string, (value) => {
    //         if (contentRefresh) {
    //             contentRefresh(value);
    //         }
    //     });

    //     return {
    //         enable: null,
    //         title: "scrollRect",
    //         component: scrollRect,
    //         ticon: null,
    //         attrs: [
    //             {
    //                 title: "Horizontal",
    //                 type: "checkbox",
    //                 attr: {
    //                     attrValue: {
    //                         value: scrollRect.horizontal,
    //                     },
    //                     onChange: (value: { val: boolean }) => {
    //                         setHorizontal(value.val);
    //                         console.log("是否开启水平滑动 Horizontal ：", value.val);
    //                     },
    //                     setRefresh: (refresh) => {
    //                         horizontalRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Vertical",
    //                 type: "checkbox",
    //                 attr: {
    //                     attrValue: {
    //                         value: true,
    //                     },
    //                     onChange: (value: { val: boolean }) => {
    //                         setVertical(value.val);
    //                         console.log("是否开启垂直滑动 vertical ：", value.val);
    //                     },
    //                     setRefresh: (refresh) => {
    //                         VerticalRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Inertia",
    //                 type: "checkbox",
    //                 attr: {
    //                     attrValue: {
    //                         value: scrollRect.inertia,
    //                     },
    //                     onChange: (value: {val: boolean}) => {
    //                         setInertia(value.val);
    //                         console.log("是否开启Inertia ：", value.val);
    //                     },
    //                     setRefresh: (refresh) => {
    //                         InertiaRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Deceleration Rate",
    //                 type: "number",
    //                 attr: {
    //                     attrValue:{
    //                         value: scrollRect.decelerationRate,
    //                     },
    //                     onChange: (value: {val: number}) => {
    //                         setDecelerationRate(value.val);
    //                         console.log("Deceleration  :", value.val);
    //                     },
    //                     setRefresh: (refresh) => {
    //                         DecelerationRateRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Content",
    //                 type: "string",
    //                 attr: {
    //                     attrValue: {
    //                         value: scrollRect.content,
    //                     },
    //                     onChange: (value: {val: string}) => {
    //                         console.log("content  引用");
    //                         // setContent(val);
    //                     },
    //                     setRefresh: (refresh) => {
    //                         contentRefresh = refresh;
    //                     },
    //                 }
    //             },
    //         ]
    //     }
    // }
}