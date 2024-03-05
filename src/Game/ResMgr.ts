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
export enum AssetBundleFileType {
    None,
    All,
    Mesh,
    Animation,
    Material,
    Texture,
    Atlas,
    Text,
    Number,
    Shader,
    AssetsBunld,
    AssetsBunldJ,
    Prefab,
    Scene,
    Component,
    Component2d,
    Reference,
    Transform,
    Sprite,
    Font,
}
export class ResMgr {

    public static GetAllABForType(type: AssetBundleFileType): Array<string> {
        let result: Array<string> = new Array<string>();
        let assetMgr = m4m.framework.sceneMgr.app.getAssetMgr();
        switch (type) {
            case AssetBundleFileType.Mesh:
                let meshMap = assetMgr.mapDefaultMesh;
                for (let key in meshMap)
                    result.push(key);
                break;
            case AssetBundleFileType.Shader:
                let mapShader = assetMgr.mapShader;
                for (let key in mapShader)
                    result.push(key);
                break;
            case AssetBundleFileType.Texture:
                let mapTexture = assetMgr.mapDefaultTexture;
                for (let key in mapTexture)
                    result.push(key);
                break;
            case AssetBundleFileType.Sprite:
                let mapSprite = assetMgr.mapDefaultSprite;
                for (let key in mapSprite)
                    result.push(key);
                break;
            case AssetBundleFileType.Font:
                break;
        }
        result = result.concat(this.SearchGlobalAssets(type));
        return result;
    }

    //在assetmgr 中搜索所有指定类型 资源
    public static SearchGlobalAssets(AType: AssetBundleFileType) {
        let alist: string[] = [];
        let mapRes = m4m.framework.sceneMgr.app.getAssetMgr().mapRes;
        switch (AType) {
            case AssetBundleFileType.Mesh:

                break;
            case AssetBundleFileType.Shader:

                break;
            case AssetBundleFileType.Texture:
                let def = m4m.framework.sceneMgr.app.getAssetMgr().mapDefaultTexture;
                for (let k in def)
                    if (def[k] && def[k] instanceof m4m.framework.texture) {
                        alist.push(def[k].getName());
                    }
                for (let k in mapRes)
                    if (mapRes[k] && mapRes[k].asset instanceof m4m.framework.texture) {
                        alist.push(mapRes[k].asset.getName());
                    }
                break;
            case AssetBundleFileType.Sprite:
                for (let k in mapRes)
                    if (mapRes[k] && mapRes[k].asset instanceof m4m.framework.sprite) {
                        alist.push(mapRes[k].asset.getName());
                    }
                break;
            case AssetBundleFileType.Font:
                for (let k in mapRes)
                    if (mapRes[k] && mapRes[k].asset instanceof m4m.framework.font) {
                        alist.push(mapRes[k].asset.getName());
                    }
                break;
        }
        return alist;
    }
}