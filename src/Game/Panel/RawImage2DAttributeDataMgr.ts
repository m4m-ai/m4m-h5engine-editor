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
import { AssetBundleFileType, ResMgr } from "../ResMgr";
import { ValueType } from "../ValueType";
import C2DComponent = m4m.framework.C2DComponent;
import nodeComponent = m4m.framework.nodeComponent;
export class RawImage2DAttributeDataMgr {
    //rawImage2D组件属性变化 (暂存 组件已被 RawAttributeDataMgr 组件替掉 )
    public static getRawImage2DData(node: nodeComponent | C2DComponent): IComponentData {
        return null;

        // let selection = EditorApplication.Instance.selection;
        // let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
        // let texture = node.comp as m4m.framework.rawImage2D;

        // let onSelectFun: Function = null;
        // //设置图片数据
        // let imageRefresh: Function = null;
        // let setImage = selection.addPropertyListener(texture, "image", ValueType.string, (value) => {
        //     if (imageRefresh) {
        //         imageRefresh(value.getName());
        //     }
        // });

        // let arr = ResMgr.GetAllABForType(AssetBundleFileType.Texture);
        // let selectArr = [];
        // for (let i = 0; i < arr.length; i++) {
        //     let str = arr[i];
        //     selectArr.push({ label: str, value: str });
        // }
        // let textureName=texture.image.getName();
        // return {
        //     enable: null,
        //     title: "RawImage2D",
        //     component: texture,
        //     ticon: null,
        //     attrs: [
        //         {
        //             title: "Texture",
        //             type: "selectList",
        //             attr: {
        //                 attrValue:{
        //                     options: selectArr,
        //                     value: textureName,
        //                 },
        //                 onChange: (val: string) => {
        //                     let textureData = assetmgr.getDefaultTexture(val) as m4m.framework.texture;
        //                     if (!textureData) {
        //                         textureData = assetmgr.getAssetByName(val) as m4m.framework.texture;
        //                     }
        //                     setImage(textureData);
        //                     texture.transform.markDirty();
        //                 },
        //                 onClick: () => {
        //                     // console.error("onClick1");
        //                     if (onSelectFun) {
        //                         let arr = ResMgr.GetAllABForType(AssetBundleFileType.Texture);
        //                         let selectArr = [];
        //                         for (let i = 0; i < arr.length; i++) {
        //                             let str = arr[i];
        //                             selectArr.push({ label: str, value: str });
        //                         }
        //                         onSelectFun(selectArr);
        //                     }
        //                 },
        //                 onSetData: (selectFun) => {
        //                     onSelectFun = selectFun;
        //                 },
        //                 setRefresh: (refresh) => {
        //                     imageRefresh = refresh;
        //                 },
        //             }
        //         }
        //     ]
        // }
    }
}