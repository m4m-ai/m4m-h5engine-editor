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

export class ImageAttributeDataMgr {
    //Image组件属性变化
    // public static getImage2DData(node: I2DComponent): IComponentData {
    //     let selection = EditorApplication.Instance.selection;
    //     let assetmgr = m4m.framework.sceneMgr.app.getAssetMgr();
    //     let image = node as m4m.framework.image2D;
    //
    //     // global["test1111"] = () => {
    //     //     //     let sprite = assetmgr.getDefaultSprite("grid_sprite") as m4m.framework.sprite;
    //     //     //     if(!sprite)
    //     //     //     {
    //     //     //         sprite = assetmgr.getAssetByName("grid_sprite") as m4m.framework.sprite;
    //     //     //     }
    //
    //     //     //     image.sprite=sprite;
    //     //     //     image.transform.markDirty();
    //
    //     //     // image.imageBorder.l = 20;
    //     //     // image.transform.markDirty();
    //
    //     //     image.fillMethod=m4m.framework.FillMethod.Radial_90;
    //     //     image.transform.markDirty();
    //
    //     //     // image.fillAmmount=0.6;
    //     //     // image.transform.markDirty();
    //     // }
    //     //
    //     let onSelectFun: Function = null;
    //
    //     //-----------------------
    //     //设置图片数据
    //     let spriteRefresh: Function = null;
    //     let setSprite = selection.addPropertyListener(image, "sprite", ValueType.object, (value) => {
    //         if (spriteRefresh) {
    //             spriteRefresh(value);
    //         }
    //     });
    //     //-----------------------
    //
    //     //设置图片颜色
    //     let colorRefresh: Function = null;
    //     let setColor = selection.addPropertyListener(image, "color", ValueType.string, (value) => {
    //         if (colorRefresh) {
    //             colorRefresh(value);
    //         }
    //     });
    //
    //     let ImageTypeArr = [];
    //     ImageTypeArr.push({label: "Simple", value: m4m.framework.ImageType.Simple});
    //     ImageTypeArr.push({label: "Sliced", value: m4m.framework.ImageType.Sliced});//九宫
    //     ImageTypeArr.push({label: "Tiled", value: m4m.framework.ImageType.Tiled});//平铺
    //     ImageTypeArr.push({label: "Filled", value: m4m.framework.ImageType.Filled});//填充
    //     //设置贴图的显示方式
    //     let imageTypeRefresh: Function = null;
    //     let setImageType = selection.addPropertyListener(image, "imageType", ValueType.string, (value) => {
    //         if (imageTypeRefresh) {
    //             imageTypeRefresh(value);
    //         }
    //     });
    //
    //     //设置九宫
    //     let imageBorderRefreshL: Function = null;
    //     let imageBorderRefreshT: Function = null;
    //     let imageBorderRefreshR: Function = null;
    //     let imageBorderRefreshB: Function = null;
    //     let setImageBorder = selection.addPropertyListener(image, "imageBorder", ValueType.border, (value) => {
    //         // console.error(value.l);
    //         if (imageBorderRefreshL) {
    //             imageBorderRefreshL(value.l);
    //         }
    //         if (imageBorderRefreshT) {
    //             imageBorderRefreshT(value.t);
    //         }
    //         if (imageBorderRefreshR) {
    //             imageBorderRefreshR(value.r);
    //         }
    //         if (imageBorderRefreshB) {
    //             imageBorderRefreshB(value.b);
    //         }
    //     });
    //
    //     let FillMethodArr = [];
    //     FillMethodArr.push({label: "Horizontal", value: m4m.framework.FillMethod.Horizontal});
    //     FillMethodArr.push({label: "Vertical", value: m4m.framework.FillMethod.Vertical});//
    //     FillMethodArr.push({label: "Radial 90", value: m4m.framework.FillMethod.Radial_90});//
    //     FillMethodArr.push({label: "Radial 180", value: m4m.framework.FillMethod.Radial_180});//
    //     FillMethodArr.push({label: "Radial 360", value: m4m.framework.FillMethod.Radial_360});//
    //     //设置图片填充样式
    //     let fillMethodRefresh: Function = null;
    //     let setFillMethod = selection.addPropertyListener(image, "fillMethod", ValueType.number, (value) => {
    //         console.error("fillMethod", value);
    //         if (fillMethodRefresh) {
    //             fillMethodRefresh(value);
    //         }
    //     });
    //     //设置图片填充率
    //     let fillAmmountRefresh: Function = null;
    //     let setFillAmmount = selection.addPropertyListener(image, "fillAmmount", ValueType.number, (value) => {
    //         if (fillAmmountRefresh) {
    //             fillAmmountRefresh(value);
    //         }
    //     });
    //
    //     let imageDefName: string = image.sprite.getName();
    //     let arr = ResMgr.GetAllABForType(AssetBundleFileType.Sprite);
    //     let selectArr = [];
    //     for (let i = 0; i < arr.length; i++) {
    //         let str = arr[i];
    //         selectArr.push({label: str, value: str});
    //     }
    //     return {
    //         enable: null,
    //         title: "Image2D",
    //         component: image,
    //         ticon: null,
    //         attrs: [
    //
    //             //-------------------------------
    //             // {
    //             //     title: "Source Image",
    //             //     type: "selectList",
    //             //     attr: {
    //             //         options: selectArr,
    //             //         value: imageDefName,
    //             //         onChange: (val: string) => {
    //             //             let sprite = assetmgr.getDefaultSprite(val) as m4m.framework.sprite;
    //             //             if (!sprite) {
    //             //                 sprite = assetmgr.getAssetByName(val) as m4m.framework.sprite;
    //             //             }
    //             //             setSprite(sprite);
    //             //             image.transform.markDirty();
    //             //         },
    //             //         onClick: () => {
    //             //             // console.error("onClick1");
    //             //             if (onSelectFun) {
    //             //                 let arr = ResMgr.GetAllABForType(AssetBundleFileType.Sprite);
    //             //                 let selectArr = [];
    //             //                 for (let i = 0; i < arr.length; i++) {
    //             //                     let str=arr[i];
    //             //                     selectArr.push({ label: str, value: str });
    //             //                 }
    //             //                 onSelectFun(selectArr);
    //             //             }
    //             //         },
    //             //         onSetData: (selectFun) => {
    //             //             onSelectFun = selectFun;
    //             //         },
    //             //         setRefresh: (refresh) => {
    //             //             spriteRefresh = refresh;
    //             //         },
    //             //     }
    //             // },
    //             //--------------------------------------------
    //
    //             {
    //                 title: "Source Image",
    //                 type: "asset",
    //                 attr: <IAssetSelectionAttrData>{
    //                     attrValue: {
    //                         key: image.sprite["_ref"],
    //                         name: image.sprite?.getName(),
    //                     },
    //                     assetType: ["png", "jpg"],
    //                     onChange: (reference) => {
    //
    //                         if (image.sprite == null || image.sprite["_ref"] == null || image.sprite["_ref"].guid != reference.key) {
    //                             //临时处理
    //                             EditorApplication.Instance.editorResources.getSpriteReference({
    //                                 key: reference.key,
    //                                 guid: "",
    //                             }, false, sp => {
    //                                 if (sp) {
    //                                     sp.use();
    //                                 }
    //                                 setSprite(sp);
    //                                 if (spriteRefresh) {
    //                                     spriteRefresh(sp);
    //                                 }
    //                             })
    //                         }
    //                     },
    //                     setRefresh: (refresh) => {
    //                         spriteRefresh = refresh;
    //                     },
    //                 }
    //             },
    //
    //             //--------------------------------------------
    //             {
    //                 title: "Color",
    //                 type: "string",
    //                 attr: <IColorSelectionAttrData>{
    //                     attrValue: image.color,
    //                     onChange: (value) => {
    //                         setColor(value);
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         colorRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Image Type",
    //                 type: "select",
    //                 attr: <ISelectAttrData>{
    //                     attrValue: image.imageType,
    //                     options: ImageTypeArr,
    //                     onChange: (value: m4m.framework.ImageType) => {
    //                         console.error(value);
    //                         //TODO 需要引擎相关人员查一下 设置平铺的功能有BUG 如果图片是个纯色的图片 会卡一段时间
    //                         setImageType(value);
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         imageTypeRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Sliced ImageBorder l",
    //                 type: "number",
    //                 attr: <INumberInputAttrData>{
    //                     attrValue: image.imageBorder.l,
    //                     onChange: (value) => {
    //                         image.imageBorder.l = value;
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         imageBorderRefreshL = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Sliced ImageBorder t",
    //                 type: "number",
    //                 attr: {
    //                     attrValue: {
    //                         value: image.imageBorder.t,
    //                     },
    //                     onChange: (value: {value: number}) => {
    //                         image.imageBorder.t = value.value;
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         imageBorderRefreshT = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Sliced ImageBorder r",
    //                 type: "number",
    //                 attr: <INumberInputAttrData>{
    //                     attrValue: image.imageBorder.r,
    //                     onChange: (value) => {
    //                         image.imageBorder.r = value;
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         imageBorderRefreshR = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Sliced ImageBorder b",
    //                 type: "number",
    //                 attr: <INumberInputAttrData>{
    //                     attrValue: image.imageBorder.b,
    //                     onChange: (value) => {
    //                         image.imageBorder.b = value;
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         imageBorderRefreshB = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Filled Fill Method",
    //                 type: "select",
    //                 attr: <ISelectAttrData>{
    //                     attrValue: image.fillMethod,
    //                     options: FillMethodArr,
    //                     // val: m4m.framework.FillMethod
    //                     onChange: (value: m4m.framework.FillMethod) => {
    //                         console.error(value);
    //                         setFillMethod(value);
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         fillMethodRefresh = refresh;
    //                     },
    //                 }
    //             },
    //             {
    //                 title: "Filled Fill Amount",
    //                 type: "number",
    //                 attr: <INumberInputAttrData>{
    //                     attrValue: image.fillAmmount,
    //                     onChange: (value) => {
    //                         setFillAmmount(value);
    //                         image.transform.markDirty();
    //                     },
    //                     setRefresh: (refresh) => {
    //                         fillAmmountRefresh = refresh;
    //                     },
    //                 }
    //             }
    //         ]
    //     }
    // }
}