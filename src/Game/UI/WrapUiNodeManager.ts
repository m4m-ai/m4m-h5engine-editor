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
import { Utils } from "../Utils";
import { UI } from "./CreateUINodeData";

export class WrapUiNodeManager {

    //排除的trans
    private static _excludeTrans: m4m.framework.transform2D[] = [];

    /**
     * 将trans数据解析成json数据
     * @param rootTrans 
     */
    public static WrapUi(rootTrans: m4m.framework.transform2D): string {
        this._excludeTrans.length = 0;
        if (rootTrans == null || rootTrans.children.length === 0) {
            return "[]";
        }
        let array: UI.Node[] = [];
        for (let item of rootTrans.children) {
            array.push(this.HandlerNode(item));
        }
        return JSON.stringify(array);
    }

    public static WrapPanelNodeData(node: m4m.framework.transform2D, data: UI.Panel, type: string = "Panel") {
        //UI.Node
        data.n = node.name;
        data.ty = type;
        data.x = node.localTranslate.x;
        data.y = node.localTranslate.y;
        let scale = node.localScale;
        if (scale.x !== 1) {
            data.sX = scale.x;
        }
        if (scale.y !== 1) {
            data.sY = scale.y;
        }
        if (node.localRotate !== 0) {
            data.r = Utils.radianToDegree(node.localRotate);
        }

        //Ui.Panel
        data.w = node.width;
        data.h = node.height;
        let lo = m4m.framework.layoutOption;
        let leyout = node.layoutState;
        if ((leyout & lo.LEFT) > 0 && (leyout & lo.RIGHT) > 0) {
            data.hA = "fill";
        } else if ((leyout & lo.LEFT) > 0) {
            data.hA = "left";
        } else if ((leyout & lo.RIGHT) > 0) {
            data.hA = "right";
            data.x += node.width;
        } else if ((leyout & lo.H_CENTER) > 0) {
            data.hA = "center";
            data.x += node.width / 2;
        }
        if ((leyout & lo.TOP) > 0 && (leyout & lo.BOTTOM) > 0) {
            data.vA = "fill";
            
        } else if ((leyout & lo.TOP) > 0) {
            data.vA = "top";
        } else if ((leyout & lo.BOTTOM) > 0) {
            data.vA = "bottom";
            data.y += node.height;
        } else if ((leyout & lo.V_CENTER) > 0) {
            data.vA = "center";
            data.y += node.height / 2;
        }
    }

    public static WrapLabelNodeData(label: m4m.framework.label, data: UI.Label) {
        this.WrapPanelNodeData(label.transform, data, "Label");
        //Ui.Label
        this.fillLabelData(label, data);
    }

    public static WrapButtonNodeData(button: m4m.framework.button, data: UI.Button) {
        this.WrapPanelNodeData(button.transform, data, "Button");
        let label = this.findComponentInChildren(button.transform, "label") as m4m.framework.label;
        if (label != null) {
            this._excludeTrans.push(label.transform);
            this.fillLabelData(label, data);
        }
        let sprite = button.transform.getComponent("image2D") as m4m.framework.image2D;
        if (sprite != null) {
            let ref: AssetReference = sprite["_ref"];
            if (ref) {
                let imageFile = FileInfoManager.Instance.getFileByKey(ref.key);
                if (imageFile) {
                    data.tex = imageFile.relativePath;
                }
            }
            let color = sprite.color;
            if (color.r !== 0 || color.g !== 0 || color.b !== 0 || color.a !== 1) {
                data.m = Utils.colorToHex(color);
            }
        }
    }

    public static WrapImageNodeData(image2D: m4m.framework.image2D, data: UI.Image) {
        this.WrapPanelNodeData(image2D.transform, data, "Image");
        let sprite = image2D.sprite;
        if (sprite != null) {
            let ref: AssetReference = sprite["_ref"];
            if (ref) {
                let imageFile = FileInfoManager.Instance.getFileByKey(ref.key);
                if (imageFile) {
                    data.tex = imageFile.relativePath;
                }
            }
        }
        let color = image2D.color;
        if (color.r !== 0 || color.g !== 0 || color.b !== 0 || color.a !== 1) {
            data.m = Utils.colorToHex(color);
        }
    }

    public static WrapInputNodeData(input: m4m.framework.inputField, data: UI.Input) {
        this.WrapPanelNodeData(input.transform, data, "Input");
        let sprite = this.findComponentInChildren(input.transform, "image2D") as m4m.framework.image2D;
        if (sprite) {
            this._excludeTrans.push(sprite.transform);
            let ref: AssetReference = sprite["_ref"];
            if (ref) {
                let imageFile = FileInfoManager.Instance.getFileByKey(ref.key);
                if (imageFile) {
                    data.tex = imageFile.relativePath;
                }
            }
        }
        let label = this.findComponentInChildren(input.transform, "label") as m4m.framework.label;
        if (label) {
            this._excludeTrans.push(label.transform);
            data.v = label.text;
            if (label.fontsize !== 24) {
                data.fS = label.fontsize;
            }
            let color = label.color;
            if (color.r !== 0 || color.g !== 0 || color.b !== 0 || color.a !== 1) {
                data.c = Utils.colorToHex(color);
            }
        }
    }

    public static WrapScrollNodeData(scroll: m4m.framework.scrollRect, data: UI.Scroll) {
        this.WrapPanelNodeData(scroll.transform, data, "Scroll");
        data.hS = scroll.horizontal;
        data.vS = scroll.vertical;
    }

    public static HandlerNode(node: m4m.framework.transform2D): UI.Node {
        let data: UI.Panel = {} as any;

        let scroll = node.getComponent("scrollRect") as m4m.framework.scrollRect;
        if (scroll) {
            this.WrapScrollNodeData(scroll, data as UI.Scroll);
            if (node.children && node.children.length > 0) {
                this.HandlerChildrenNode(node.children[0], data);
            }
            return data;
        }

        let input = node.getComponent("inputField") as m4m.framework.inputField;
        if (input) {
            this.WrapInputNodeData(input, data as UI.Input);
            //this.HandlerChildrenNode(node, data);
            return data;
        }
        let label = node.getComponent("label") as m4m.framework.label;
        if (label != null) {
            this.WrapLabelNodeData(label, data as UI.Label);
            this.HandlerChildrenNode(node, data);
            return data;
        }
        let button = node.getComponent("button") as m4m.framework.button;
        if (button) {
            this.WrapButtonNodeData(button, data as UI.Button);
            this.HandlerChildrenNode(node, data);
            return data;
        }
        let image2D = node.getComponent('image2D') as m4m.framework.image2D;
        if (image2D != null) {
            this.WrapImageNodeData(image2D, data as UI.Image);
            this.HandlerChildrenNode(node, data);
            return data;
        }
        this.WrapPanelNodeData(node, data);
        this.HandlerChildrenNode(node, data);
        return data;
    }

    public static HandlerChildrenNode(node: m4m.framework.transform2D, data: UI.Panel) {
        if (node.children != null && node.children.length > 0) {
            for (let item of node.children) {
                if (!this._excludeTrans.includes(item)) {
                    if (data.ch == null) {
                        data.ch = [];
                    }
                    data.ch.push(this.HandlerNode(item));
                }
            }
        }
    }

    private static findComponentInChildren(trans: m4m.framework.transform2D, componentName: string) {
        if (trans.children != null) {
            for (let item of trans.children) {
                let c = item.getComponent(componentName);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    }

    private static fillLabelData(label: m4m.framework.label, data: UI.Label) {
        data.text = label.text;
        if (label.horizontalType > 0) {
            data.hT = "left";
        } else if (label.horizontalType === 2) {
            data.hT = "right";
        } else {
            data.hT = "center";
        }
        if (label.verticalType > 0) {
            data.vT = "top";
        } else if (label.verticalType === 2) {
            data.vT = "bottom";
        } else {
            data.vT = "center";
        }
        if (label.fontsize !== 24) {
            data.fS = label.fontsize;
        }
        let color = label.color;
        if (color.r !== 0 || color.g !== 0 || color.b !== 0 || color.a !== 1) {
            data.c = Utils.colorToHex(color);
        }
    }

}