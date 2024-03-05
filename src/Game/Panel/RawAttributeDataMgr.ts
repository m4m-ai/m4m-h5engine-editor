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
import {IComponentData} from "../../common/inspector/components/Component";
import {EditorApplication} from "../EditorApplication";
import texture = m4m.framework.texture;
import {ValueType} from "../ValueType";
import {EditorAssetInfo} from "../Asset/EditorAssetInfo";
import {AssetReference} from "../Asset/AssetReference";
import I2DComponent = m4m.framework.I2DComponent;

export class RawAttributeDataMgr {
    public static getRaw2DData(node: I2DComponent): IComponentData {
        return null;

        // let selection = EditorApplication.Instance.selection;
        // let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
        // let rawImage2D = node as m4m.framework.rawImage2D;

        // let textureRefresh: Function = null;
        // let setTexture = selection.addPropertyListener(rawImage2D, "image", ValueType.object, (value) => {
        //     if (textureRefresh) {
        //         textureRefresh(value);
        //     }
        // });
        
        // return {
        //     enable: null,
        //     title: "RawImage2D",
        //     component: rawImage2D,
        //     ticon: null,
        //     attrs: [
        //         {
        //             title: "Texture",
        //             type: "asset",
        //             attr: {
        //                 value: rawImage2D.image,
        //                 assetType: ["png", "jpg"],
        //                 onChange(reference: AssetReference) {
        //                     //加载贴图
        //                     let ea = EditorApplication.Instance;
        //                     ea.editorResources.loadTextureByKey(reference.key, (tex) => {
        //                         tex["_ref"] = {...reference};
        //                         setTexture(tex);
        //                         if (textureRefresh) {
        //                             textureRefresh(tex);
        //                         }
        //                     });
        //                 },
        //                 setRefresh(func: Function) {
        //                     textureRefresh = func;
        //                 }
        //             }
        //         },
        //     ]
        // }
    }
}