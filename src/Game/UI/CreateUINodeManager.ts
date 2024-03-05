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
import { FileInfoManager } from "../../CodeEditor/code/FileInfoManager";
import { AssetReference } from "../Asset/AssetReference";
import { EditorApplication } from "../EditorApplication";
import { EditorEventMgr } from "../Event/EditorEventMgr";
import { UI } from "./CreateUINodeData";

enum UILabelLayoutType {
    left = "left",//左对齐
    right = "right",//右对齐
    top = "top",//顶对齐
    bottom = "bottom",//底对齐
    center = "center",//居中对齐
}

enum UILayoutStateType {
    left = "left",//左对齐
    right = "right",//右对齐
    top = "top",//顶对齐
    bottom = "bottom",//底对齐
    center = "center",//居中对齐
    fill = "fill",//撑满父级
}

enum UIType {
    //Panel
    Panel = "Panel",
    //label
    Label = "Label",
    //Image
    Image = "Image",
    //Button
    Button = "Button",
    //Input
    Input = "Input",
    //Scroll
    Scroll = "Scroll",
}

export class CreateUINodeManager {
    private static _instance: CreateUINodeManager;
    public static get Instance() {
        if (this._instance == null) {
            this._instance = new CreateUINodeManager();
        }
        return this._instance;
    }

    private _lastNodeDataArr: UI.Node[];
    public init() {
        // let uiRoot=EditorApplication.Instance.editorScene.getCurrentOrigin2DRoot();

        EditorEventMgr.Instance.addEventListener("OnHandlerGPTUiData", (result) => {
            if (result.success) {
                console.error(result.data);
                this.createUI(result.data);
                //把这一次的节点缓存 为下一次修改作对比
                this._lastNodeDataArr = result.data;
            } else {
                console.error("收到GPT回复出错");
                console.error(result.errorMessage);
            }
        });
    }

    private refIndex: number = 0;
    // originalNodeData 原node节点
    private getUIbyType(uiNodeData: UI.Node, uiTrans: m4m.framework.transform2D, parentTrans: m4m.framework.transform2D, originalNodeData: UI.Node) {
        this.refIndex++;
        //EditorApplication.Instance.selection.activeAsset.relativePath
        switch (uiNodeData.ty) {
            case UIType.Panel:
                if (uiTrans == null) {
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
                }
                // const panlImage = uiTrans.getComponent("image2D") as m4m.framework.image2D;
                // panlImage.imageType = m4m.framework.ImageType.Sliced;
                // panlImage.color = new m4m.math.color(1, 1, 1, 0.3);
                break;
            case UIType.Label:
                let labelNodeData = uiNodeData as UI.Label;
                if (uiTrans == null) {
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Label);
                }
                //
                const label = uiTrans.getComponent("label") as m4m.framework.label;
                if (labelNodeData.text) {
                    label.text = labelNodeData.text;
                } else {
                    label.text = "text";
                }
                label.font = EditorApplication.Instance.editorResources.defaultFont;
                if (labelNodeData.fS != null) {
                    label.fontsize = labelNodeData.fS;
                }
                let color = new m4m.math.color(0, 0, 0, 1);
                if (labelNodeData.c) {
                    this.color16To10(labelNodeData.c, color);
                }
                label.color = color;
                label.horizontalType = this.getLabelHorizontalLayout(labelNodeData.hT);
                label.verticalType = this.getLabelVerticalLayout(labelNodeData.vT);
                break;
            case UIType.Image:
                let imageNodeData = uiNodeData as UI.Image;
                if (uiTrans == null) {
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
                }
                const image = uiTrans.getComponent("image2D") as m4m.framework.image2D;
                let imageColor = new m4m.math.color(1, 1, 1, 1);
                if (imageNodeData.m) {
                    this.color16To10(imageNodeData.m, imageColor);
                }
                image.color = imageColor;
                if (imageNodeData.tex) {
                    let imageKey = FileInfoManager.Instance.getKeyByPath(imageNodeData.tex)
                    EditorApplication.Instance.editorResources.loadTextureByKey(imageKey, (tex) => {
                        let ref: AssetReference = {
                            key: imageKey
                        }
                        tex["_ref"] = ref;
                        let spr = new m4m.framework.sprite(tex.getName());
                        spr.texture = tex;
                        spr.rect = new m4m.math.rect(0, 0, tex.glTexture.width, tex.glTexture.height);
                        image.sprite = spr;
                    });
                }
                break;
            case UIType.Button:
                let buttonNodeData = uiNodeData as UI.Button;
                //创建按钮
                if (uiTrans == null) {
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Button);
                }
                const btn = uiTrans.getComponent("button") as m4m.framework.button;
                const btnImage = uiTrans.getComponent("image2D") as m4m.framework.image2D;
                const btnLab = btn.transform.getFirstComponentInChildren("label") as m4m.framework.label;
                btnLab.horizontalType = m4m.framework.HorizontalType.Center;
                btnLab.verticalType = m4m.framework.VerticalType.Center;
                btnLab.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.BOTTOM;
                btnLab.text = buttonNodeData.text;
                btnLab.font = EditorApplication.Instance.editorResources.defaultFont;
                if (buttonNodeData.fS != null) {
                    btnLab.fontsize = buttonNodeData.fS;
                }
                if (buttonNodeData.m) {
                    let btncolor = new m4m.math.color(1, 1, 1, 1);
                    this.color16To10(buttonNodeData.m, btncolor);
                    btnImage.color = btncolor;
                }

                let btnLabelcolor = new m4m.math.color(0, 0, 0, 1);
                if (buttonNodeData.c) {
                    this.color16To10(buttonNodeData.c, btnLabelcolor);
                }
                btnLab.color = btnLabelcolor;
                if (buttonNodeData.tex) {
                    let btnImageKey = FileInfoManager.Instance.getKeyByPath(buttonNodeData.tex)
                    EditorApplication.Instance.editorResources.loadTextureByKey(btnImageKey, (tex) => {
                        let ref: AssetReference = {
                            key: btnImageKey
                        }
                        tex["_ref"] = ref;
                        let spr = new m4m.framework.sprite(tex.getName());
                        spr.texture = tex;
                        spr.rect = new m4m.math.rect(0, 0, tex.glTexture.width, tex.glTexture.height);
                        btnImage.sprite = spr;
                    });
                }
                break;
            case UIType.Input:
                let inputNodeData = uiNodeData as UI.Input;
                //创建输入框组件
                if (uiTrans == null) {
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.InputField);
                }

                const input = uiTrans.getComponent("inputField") as m4m.framework.inputField;
                const inputImage = uiTrans.getFirstComponentInChildren("image2D") as m4m.framework.image2D;
                if (inputNodeData.v) {
                    input.TextLabel.text = inputNodeData.v;
                }
                if (inputNodeData.fS != null) {
                    input.TextLabel.fontsize = inputNodeData.fS;
                }
                let inputcolor = new m4m.math.color(0, 0, 0, 1);
                if (inputNodeData.c) {
                    this.color16To10(inputNodeData.c, inputcolor);
                }
                input.TextLabel.color = inputcolor;
                if (inputNodeData.tex) {
                    let InputImageKey = FileInfoManager.Instance.getKeyByPath(inputNodeData.tex)
                    EditorApplication.Instance.editorResources.loadTextureByKey(InputImageKey, (tex) => {
                        let ref: AssetReference = {
                            key: InputImageKey
                        }
                        tex["_ref"] = ref;
                        let spr = new m4m.framework.sprite(tex.getName());
                        spr.texture = tex;
                        spr.rect = new m4m.math.rect(0, 0, tex.glTexture.width, tex.glTexture.height);
                        inputImage.sprite = spr;
                    });
                }
                break;
            case UIType.Scroll:
                let scrollNodeData = uiNodeData as UI.Scroll;
                //创建滑动区域组件
                if (uiTrans == null) {
                    uiTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.ScrollRect);
                }
                const scroll = uiTrans.getComponent("scrollRect") as m4m.framework.scrollRect;
                if (scrollNodeData.hS) {
                    scroll.horizontal = scrollNodeData.hS;
                }
                if (scrollNodeData.vS) {
                    scroll.horizontal = scrollNodeData.vS;
                }
                // let testTrans = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Image2D);
                // scroll.content.addChild(testTrans);
                // scroll.content.width=300;
                // scroll.content.height=300;
                break;
        }

        let transNodeData = uiNodeData as UI.Panel;
        let lastX: number = 0;
        let lastY: number = 0;
        //用修改之前的trans节点计算出实际 localTranslate 坐标
        if (originalNodeData != null)//有原节点 判断新节点的修改
        {
            let oldNodeData = originalNodeData as UI.Panel;
            if (transNodeData.hA != oldNodeData.hA)//如果 left right hcenter  hfill  布局有修改
            {
                lastX = uiTrans.localTranslate.x;
                if ((uiTrans.layoutState & m4m.framework.layoutOption.LEFT) > 0 && (uiTrans.layoutState & m4m.framework.layoutOption.RIGHT) > 0) {
                    // data.hA = "fill";
                } else if ((uiTrans.layoutState & m4m.framework.layoutOption.LEFT) > 0) {
                    // data.hA = "left";
                } else if ((uiTrans.layoutState & m4m.framework.layoutOption.RIGHT) > 0) {
                    // data.hA = "right";
                    lastX += uiTrans.width;
                } else if ((uiTrans.layoutState & m4m.framework.layoutOption.H_CENTER) > 0) {
                    // data.hA = "center";
                    lastX += uiTrans.width / 2;
                }
                // console.error("左右布局有修改 " + lastX);
            }

            if (transNodeData.vA != oldNodeData.vA)//如果 top bottom vcenter  vfill  布局有修改
            {
                lastY = uiTrans.localTranslate.y;
                if ((uiTrans.layoutState & m4m.framework.layoutOption.TOP) > 0 && (uiTrans.layoutState & m4m.framework.layoutOption.BOTTOM) > 0) {
                    // data.vA = "fill";
                } else if ((uiTrans.layoutState & m4m.framework.layoutOption.TOP) > 0) {
                    // data.vA = "top";
                } else if ((uiTrans.layoutState & m4m.framework.layoutOption.BOTTOM) > 0) {
                    // data.vA = "bottom";
                    lastY += uiTrans.height;
                } else if ((uiTrans.layoutState & m4m.framework.layoutOption.V_CENTER) > 0) {
                    // data.vA = "center";
                    lastY += uiTrans.height / 2;
                }
                // console.error("上下布局有修改 " + lastY);
            }
        }
        uiTrans.name = transNodeData.n;
        if (transNodeData.w != null && transNodeData.w != 0) {
            uiTrans.width = transNodeData.w;
        }
        if (transNodeData.h != null && transNodeData.h != 0) {
            uiTrans.height = transNodeData.h;
        }
        uiTrans.layoutState = this.getTransHorizontalLayout(transNodeData.hA) | this.getTransVerticalLayout(transNodeData.vA);

        //因刷新问题 设置延迟 (不设置延迟设置的位置不生效)
        // setTimeout(() => {
        // if (transNodeData.x != null) {
        //     uiTrans.localTranslate.x = transNodeData.x;
        // }
        // if (transNodeData.y != null) {
        //     uiTrans.localTranslate.y = transNodeData.y;
        // }
        // uiTrans.localTranslate = uiTrans.localTranslate;
        // uiTrans.markDirty();
        // }, 80 + this.refIndex * 20);
        let isLayoutChange: boolean = false;
        if (originalNodeData != null)//有原节点 判断新节点的修改
        {
            //切换了布局
            let oldNodeData = originalNodeData as UI.Panel;
            if (transNodeData.hA != oldNodeData.hA)//如果 left right hcenter  hfill  布局有修改
            {
                isLayoutChange = true;

                if (uiTrans.layoutState & m4m.framework.layoutOption.LEFT) {
                    // let leftLayVal = transNodeData.x + parentTrans.pivot.x * parentTrans.width - uiTrans.pivot.x * uiTrans.width;
                    let leftLayVal = 0;
                    switch (oldNodeData.hA) {
                        case UILayoutStateType.left:
                            leftLayVal = lastX;
                            break;
                        case UILayoutStateType.right:
                            leftLayVal = lastX - uiTrans.width;
                            break;
                        case UILayoutStateType.center:
                            leftLayVal = lastX - uiTrans.width / 2;
                            break;
                        case UILayoutStateType.fill:
                            //
                            // laySta = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT;
                            break;
                    }
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.LEFT, leftLayVal);

                    /****************左右对齐**************/
                    if (uiTrans.layoutState & m4m.framework.layoutOption.RIGHT) {
                        // uiTrans.width = parentTrans.width - uiTrans.getLayoutValue(m4m.framework.layoutOption.LEFT) - uiTrans.getLayoutValue(m4m.framework.layoutOption.RIGHT);
                        let rightLayVal = 0;
                        switch (oldNodeData.hA) {
                            case UILayoutStateType.left:
                                rightLayVal = parentTrans.width - uiTrans.width - lastX;
                                break;
                            case UILayoutStateType.right:
                                rightLayVal = parentTrans.width - lastX;
                                break;
                            case UILayoutStateType.center:
                                rightLayVal = parentTrans.width - lastX - uiTrans.width / 2;
                                break;
                        }
                        uiTrans.setLayoutValue(m4m.framework.layoutOption.RIGHT, rightLayVal);
                    }
                } else if (uiTrans.layoutState & m4m.framework.layoutOption.RIGHT) {
                    // let rightLayVal = parentTrans.width - uiTrans.width - parentTrans.pivot.x * parentTrans.width + uiTrans.pivot.x * uiTrans.width - transNodeData.x;
                    let rightLayVal = 0;
                    switch (oldNodeData.hA) {
                        case UILayoutStateType.left:
                            rightLayVal = (parentTrans.width - uiTrans.width) - lastX;
                            break;
                        case UILayoutStateType.center:
                            rightLayVal = (parentTrans.width - uiTrans.width / 2) - lastX;
                            break;
                        case UILayoutStateType.fill:
                            //
                            // laySta = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT;
                            break;
                    }
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.RIGHT, rightLayVal);
                }

                if (uiTrans.layoutState & m4m.framework.layoutOption.H_CENTER) {
                    // let hcenterLayVal = transNodeData.x - (parentTrans.width - uiTrans.width) / 2 + parentTrans.pivot.x * parentTrans.width - uiTrans.pivot.x * uiTrans.width;
                    // console.error(transNodeData.x ,parentTrans.width / 2, transNodeData.x - parentTrans.width / 2);
                    let hcenterLayVal = 0;
                    switch (oldNodeData.hA) {
                        case UILayoutStateType.left:
                            hcenterLayVal = lastX - (parentTrans.width - uiTrans.width) / 2;
                            break;
                        case UILayoutStateType.right:
                            hcenterLayVal = lastX - parentTrans.width / 2 - uiTrans.width / 2;
                            break;
                        case UILayoutStateType.fill:
                            //
                            // laySta = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT;
                            break;
                    }
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.H_CENTER, hcenterLayVal);

                }
            }

            if (transNodeData.vA != oldNodeData.vA)//如果 top bottom vcenter  vfill  布局有修改
            {
                isLayoutChange = true;

                if (uiTrans.layoutState & m4m.framework.layoutOption.TOP) {
                    // let topLayVal = transNodeData.y + parentTrans.pivot.y * parentTrans.height - uiTrans.pivot.y * uiTrans.height;
                    // console.error("原y坐标为  " + lastY);
                    let topLayVal = 0;
                    switch (oldNodeData.vA) {
                        case UILayoutStateType.top:
                            topLayVal = lastY;
                            break;
                        case UILayoutStateType.bottom:
                            topLayVal = lastY - uiTrans.height;
                            break;
                        case UILayoutStateType.center:
                            topLayVal = lastY - uiTrans.height / 2;
                            break;
                        case UILayoutStateType.fill:
                            //
                            break;
                    }
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.TOP, topLayVal);

                    /**************上下对齐************/
                    if (uiTrans.layoutState & m4m.framework.layoutOption.BOTTOM) {
                        // uiTrans.height = parentTrans.height - uiTrans.getLayoutValue(m4m.framework.layoutOption.TOP) - uiTrans.getLayoutValue(m4m.framework.layoutOption.BOTTOM);
                        let bottomLayVal = 0;
                        switch (oldNodeData.vA) {
                            case UILayoutStateType.top:
                                bottomLayVal = parentTrans.height - uiTrans.height - lastY;
                                break;
                            case UILayoutStateType.bottom:
                                bottomLayVal = parentTrans.height - lastY;
                                break;
                            case UILayoutStateType.center:
                                bottomLayVal = parentTrans.height - lastY - uiTrans.height / 2;
                                console.error(bottomLayVal);
                                break;
                        }
                        uiTrans.setLayoutValue(m4m.framework.layoutOption.BOTTOM, bottomLayVal);
                    }
                } else if (uiTrans.layoutState & m4m.framework.layoutOption.BOTTOM) {
                    // console.error(parentTrans.height, transNodeData.y, parentTrans.height - transNodeData.y);
                    // let bottomLayVal = parentTrans.height - uiTrans.height - parentTrans.pivot.y * parentTrans.height + uiTrans.pivot.y * uiTrans.height - transNodeData.y;
                    // console.error("原y坐标为  " + lastY);
                    let bottomLayVal = 0;
                    switch (oldNodeData.vA) {
                        case UILayoutStateType.top:
                            bottomLayVal = parentTrans.height - uiTrans.height - lastY;
                            break;
                        case UILayoutStateType.center:
                            bottomLayVal = (parentTrans.height - uiTrans.height / 2) - lastY;
                            break;
                        case UILayoutStateType.fill:
                            //
                            break;
                    }
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.BOTTOM, bottomLayVal);
                }

                if (uiTrans.layoutState & m4m.framework.layoutOption.V_CENTER) {
                    // let vcenterLayVal = transNodeData.y - (parentTrans.height - uiTrans.height) / 2 + parentTrans.pivot.y * parentTrans.height - uiTrans.pivot.y * uiTrans.height;
                    // console.error("原y坐标为  " + lastY);
                    let vcenterLayVal = 0;
                    switch (oldNodeData.vA) {
                        case UILayoutStateType.top:
                            vcenterLayVal = lastY - (parentTrans.height - uiTrans.height) / 2;
                            break;
                        case UILayoutStateType.bottom:
                            vcenterLayVal = lastY - parentTrans.height / 2 - uiTrans.height / 2;
                            break;
                        case UILayoutStateType.fill:
                            //
                            break;
                    }
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.V_CENTER, vcenterLayVal);
                }
            }
        }

        //如果不是布局的修改  计算坐标的更新 调整布局参数
        if (isLayoutChange == false) {
            //以布局调整位置 (因复杂一点的布局调整 没有对应的标示 这里没有处理)
            if (transNodeData.x != null) {
                if (uiTrans.layoutState & m4m.framework.layoutOption.LEFT) {
                    // let leftLayVal = transNodeData.x + parentTrans.pivot.x * parentTrans.width - uiTrans.pivot.x * uiTrans.width;
                    let leftLayVal = transNodeData.x;
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.LEFT, leftLayVal);
                    //左右对齐
                    if (uiTrans.layoutState & m4m.framework.layoutOption.RIGHT) {
                        uiTrans.width = parentTrans.width - uiTrans.getLayoutValue(m4m.framework.layoutOption.LEFT) - uiTrans.getLayoutValue(m4m.framework.layoutOption.RIGHT);
                    }
                } else if (uiTrans.layoutState & m4m.framework.layoutOption.RIGHT) {
                    // let rightLayVal = parentTrans.width - uiTrans.width - parentTrans.pivot.x * parentTrans.width + uiTrans.pivot.x * uiTrans.width - transNodeData.x;
                    let rightLayVal = parentTrans.width - transNodeData.x;
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.RIGHT, rightLayVal);
                }

                if (uiTrans.layoutState & m4m.framework.layoutOption.H_CENTER) {
                    // let hcenterLayVal = transNodeData.x - (parentTrans.width - uiTrans.width) / 2 + parentTrans.pivot.x * parentTrans.width - uiTrans.pivot.x * uiTrans.width;
                    // console.error(transNodeData.x ,parentTrans.width / 2, transNodeData.x - parentTrans.width / 2);

                    let hcenterLayVal = transNodeData.x - parentTrans.width / 2;
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.H_CENTER, hcenterLayVal);
                }
            }
            if (transNodeData.y != null) {
                if (uiTrans.layoutState & m4m.framework.layoutOption.TOP) {
                    // let topLayVal = transNodeData.y + parentTrans.pivot.y * parentTrans.height - uiTrans.pivot.y * uiTrans.height;
                    let topLayVal = transNodeData.y;
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.TOP, topLayVal);
                    //如果是上下对齐
                    if (uiTrans.layoutState & m4m.framework.layoutOption.BOTTOM) {
                        uiTrans.height = parentTrans.height - uiTrans.getLayoutValue(m4m.framework.layoutOption.TOP) - uiTrans.getLayoutValue(m4m.framework.layoutOption.BOTTOM);
                    }
                } else if (uiTrans.layoutState & m4m.framework.layoutOption.BOTTOM) {
                    // console.error(parentTrans.height, transNodeData.y, parentTrans.height - transNodeData.y);
                    // let bottomLayVal = parentTrans.height - uiTrans.height - parentTrans.pivot.y * parentTrans.height + uiTrans.pivot.y * uiTrans.height - transNodeData.y;

                    let bottomLayVal = parentTrans.height - transNodeData.y;
                    uiTrans.setLayoutValue(m4m.framework.layoutOption.BOTTOM, bottomLayVal);
                }

                if (uiTrans.layoutState & m4m.framework.layoutOption.V_CENTER) {
                    // let vcenterLayVal = transNodeData.y - (parentTrans.height - uiTrans.height) / 2 + parentTrans.pivot.y * parentTrans.height - uiTrans.pivot.y * uiTrans.height;
                    let vcenterLayVal = transNodeData.y - parentTrans.height / 2;

                    uiTrans.setLayoutValue(m4m.framework.layoutOption.V_CENTER, vcenterLayVal);
                }
            }
        }
        uiTrans.markDirty();


        if (transNodeData.sX) {
            uiTrans.localScale.x = transNodeData.sX;
        }
        if (transNodeData.sY) {
            uiTrans.localScale.y = transNodeData.sY;
        }
        // console.error(uiTrans.localScale);
        uiTrans.localScale = uiTrans.localScale;

        if (transNodeData.r != null) {
            uiTrans.localRotate = transNodeData.r;
        }
        return uiTrans;
    }
    //组装
    private createUI(uiNodeDataArr: UI.Node[]) {
        this.refIndex = 0;
        let uiRoot = EditorApplication.Instance.editorScene.getCurrentOrigin2DRoot();
        //最上层节点
        for (let i = 0; i < uiNodeDataArr.length; i++) {
            let uiNodeData = uiNodeDataArr[i];
            let hasSameNode: UI.Node;
            if (this._lastNodeDataArr != null) {
                let index: number = -1;
                for (let k = 0; k < this._lastNodeDataArr.length; k++) {
                    let element = this._lastNodeDataArr[k];
                    if (uiNodeData.n == element.n) {
                        index = k;
                        hasSameNode = element;
                        //找到同一节点下的 同名节点
                        break;
                    }
                }
                if (index != -1) {
                    this._lastNodeDataArr.splice(index, 1);
                }
            }
            let trans: m4m.framework.transform2D;
            if (hasSameNode)//找到同名 老的节点
            {
                for (let j = 0; j < uiRoot.children.length; j++) {
                    let chilTran = uiRoot.children[j];
                    if (hasSameNode.n == chilTran.name) {
                        //找到 trans 同名节点  修改节点参数
                        trans = this.getUIbyType(uiNodeData, chilTran, chilTran.parent, hasSameNode);
                        //如果节点的位置所引换了
                        if (i != j) {
                            //放到一个新的位置所引
                            chilTran.parent.addChildAt(chilTran, i);
                        }
                        break;
                    }
                }
                if (trans == null) {
                    console.error("出错 当前场景中未找到节点 " + hasSameNode.n);
                    return;
                }
            } else {
                //未找到 创建
                trans = this.getUIbyType(uiNodeData, null, uiRoot, null);
                // console.error("创建一个新的节点 " + uiNodeData.n);
                uiRoot.addChildAt(trans, i);
                // uiRoot.addChild(trans);
            }
            this.createChildUI(uiNodeData, hasSameNode, trans);
        }
        if (this._lastNodeDataArr != null) {
            //剩下的就是 不需要的节点 删除
            for (let i = 0; i < this._lastNodeDataArr.length; i++) {
                let element = this._lastNodeDataArr[i];
                for (let j = 0; j < uiRoot.children.length; j++) {
                    let chilTran = uiRoot.children[j];
                    if (element.n == chilTran.name) {
                        //找到 trans 同名节点 做移除操作
                        chilTran.parent.removeChild(chilTran);
                        break;
                    }
                }
            }
        }
    }

    //组装
    private createChildUI(uiNodeData: UI.Node, oldNode: UI.Node, parentTrans: m4m.framework.transform2D) {
        //递归组装子对象
        if (uiNodeData.ch && uiNodeData.ch.length > 0) {
            for (let i = 0; i < uiNodeData.ch.length; i++) {
                let childNodeInfo = uiNodeData.ch[i];

                let hasSameNode: UI.Node;
                if (oldNode != null && oldNode.ch) {
                    let index: number = -1;
                    for (let k = 0; k < oldNode.ch.length; k++) {
                        let element = oldNode.ch[k];
                        if (childNodeInfo.n == element.n) {
                            index = k;
                            hasSameNode = element;
                            //找到同一节点下的 同名节点
                            break;
                        }
                    }
                    if (index != -1) {
                        oldNode.ch.splice(index, 1);
                    }
                }
                let trans: m4m.framework.transform2D;
                if (hasSameNode)//找到同名 老的节点
                {
                    for (let j = 0; j < parentTrans.children.length; j++) {
                        let chilTran = parentTrans.children[j];
                        if (hasSameNode.n == chilTran.name) {
                            //找到 trans 同名节点  修改节点参数
                            trans = this.getUIbyType(childNodeInfo, chilTran, chilTran.parent, hasSameNode);
                            //如果节点的位置所引换了
                            if (i != j) {
                                //放到一个新的位置所引
                                chilTran.parent.addChildAt(chilTran, i);
                            }
                            break;
                        }
                    }
                    if (trans == null) {
                        console.error("出错 当前场景中未找到节点 " + hasSameNode.n);
                        return;
                    }
                } else {
                    //未找到 创建
                    trans = this.getUIbyType(childNodeInfo, null, parentTrans, null);
                    // console.log("创建一个新的UI " + childNodeInfo.n + "  " + i);
                    parentTrans.addChildAt(trans, i);
                    // parentTrans.addChild(trans);
                }

                this.createChildUI(childNodeInfo, hasSameNode, trans);
            }
        }

        if (oldNode != null && oldNode.ch) {
            //剩下的就是 不需要的节点 删除
            for (let i = 0; i < oldNode.ch.length; i++) {
                let element = oldNode.ch[i];
                for (let j = 0; j < parentTrans.children.length; j++) {
                    let chilTran = parentTrans.children[j];
                    if (element.n == chilTran.name) {
                        //找到 trans 同名节点 做移除操作
                        chilTran.parent.removeChild(chilTran);
                        break;
                    }
                }
            }
        }
    }

    //返回水平方向布局
    private getTransHorizontalLayout(layType: string) {
        let laySta: m4m.framework.layoutOption;
        switch (layType) {
            case UILayoutStateType.left:
                laySta = m4m.framework.layoutOption.LEFT;
                break;
            case UILayoutStateType.right:
                laySta = m4m.framework.layoutOption.RIGHT;
                break;
            case UILayoutStateType.center:
                laySta = m4m.framework.layoutOption.H_CENTER;
                break;
            case UILayoutStateType.fill:
                laySta = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.RIGHT;
                break;
        }
        return laySta;
    }

    //返回竖直方向布局
    private getTransVerticalLayout(layType: string) {
        let laySta: m4m.framework.layoutOption;
        switch (layType) {
            case UILayoutStateType.top:
                laySta = m4m.framework.layoutOption.TOP;
                break;
            case UILayoutStateType.bottom:
                laySta = m4m.framework.layoutOption.BOTTOM;
                break;
            case UILayoutStateType.center:
                laySta = m4m.framework.layoutOption.V_CENTER;
                break;
            case UILayoutStateType.fill:
                laySta = m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.BOTTOM;
                break;
        }
        return laySta;
    }

    //返回文本水平方向布局
    private getLabelHorizontalLayout(layType: string) {
        let laySta: m4m.framework.HorizontalType;
        switch (layType) {
            case UILabelLayoutType.left:
                laySta = m4m.framework.HorizontalType.Left;
                break;
            case UILabelLayoutType.right:
                laySta = m4m.framework.HorizontalType.Right;
                break;
            case UILabelLayoutType.center:
                laySta = m4m.framework.HorizontalType.Center;
                break;
        }
        return laySta;
    }
    //返回文本竖直方向布局
    private getLabelVerticalLayout(layType: string) {
        let laySta: m4m.framework.VerticalType;
        switch (layType) {
            case UILabelLayoutType.top:
                laySta = m4m.framework.VerticalType.Top;
                break;
            case UILabelLayoutType.bottom:
                laySta = m4m.framework.VerticalType.Boom;
                break;
            case UILabelLayoutType.center:
                laySta = m4m.framework.VerticalType.Center;
                break;
        }
        return laySta;
    }
    //16进制颜色转10进制
    public color16To10(str: string, out: m4m.math.color) {
        str = str.replace("#", "");
        out.r = parseInt(str.substring(0, 2), 16) / 255;
        out.g = parseInt(str.substring(2, 4), 16) / 255;
        out.b = parseInt(str.substring(4, 6), 16) / 255;
        if (str.length > 6) {
            out.a = parseInt(str.substring(6, 8), 16) / 255;
        } else {
            out.a = 1;
        }
    }
}