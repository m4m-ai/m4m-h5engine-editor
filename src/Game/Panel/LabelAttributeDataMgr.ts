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
import I2DComponent = m4m.framework.I2DComponent;

export class LabelAttributeDataMgr {
    //Label组件属性变化
    public static getLabel2DData(node: I2DComponent): IComponentData {
        let selection = EditorApplication.Instance.selection;
        let label = node as m4m.framework.label;
        // global["test1111"] = () => {
        //     label.fontsize = 50;
        //     label.transform.markDirty();
        // }
        
        //设置文本
        let textRefresh: Function = null;
        let setText = selection.addPropertyListener(label, "text", ValueType.string, (value) => {
            if (textRefresh) {
                textRefresh(value);
            }
        });

        //设置字体
        let fontRefresh: Function = null;
        let setFont = selection.addPropertyListener(label, "font", ValueType.string, (value) => {
            // if (fontRefresh) {
            //     fontRefresh(value);
            // }
        });

        //字体大小
        let fontSizeRefresh: Function = null;
        let setFontSize = selection.addPropertyListener(label, "fontsize", ValueType.number, (value) => {
            if (fontSizeRefresh) {
                fontSizeRefresh(value);
            }
        });

        //字行间距
        let linespaceRefresh: Function = null;
        let setLineSpace = selection.addPropertyListener(label, "linespace", ValueType.number, (value) => {
            if (linespaceRefresh) {
                linespaceRefresh(value);
            }
        });

        //是否横向溢出
        let horizontalOverflowRefresh: Function = null;
        let setHorizontalOverflow = selection.addPropertyListener(label, "horizontalOverflow", ValueType.bool, (value) => {
            if (horizontalOverflowRefresh) {
                horizontalOverflowRefresh(value);
            }
        });

        //是否竖向溢出
        let verticalOverflowRefresh: Function = null;
        let setVerticalOverflow = selection.addPropertyListener(label, "verticalOverflow", ValueType.bool, (value) => {
            if (verticalOverflowRefresh) {
                verticalOverflowRefresh(value);
            }
        });

        //字体颜色
        let colorRefresh: Function = null;
        let setColor = selection.addPropertyListener(label, "color", ValueType.string, (value) => {
            if (colorRefresh) {
                colorRefresh(value);
            }
        });

        //描边颜色
        let strokeColorRefresh: Function = null;
        let setStrokeColor = selection.addPropertyListener(label, "color2", ValueType.string, (value) => {
            if (strokeColorRefresh) {
                strokeColorRefresh(value);
            }
        });
        //描边宽度
        let outlineWidthRefresh: Function = null;
        let setOutlineWidth = selection.addPropertyListener(label, "outlineWidth", ValueType.number, (value) => {
            if (outlineWidthRefresh) {
                outlineWidthRefresh(value);
            }
        });

        //横向显示方式
        let horizontalTypeRefresh: Function = null;
        let setHorizontalType = selection.addPropertyListener(label, "horizontalType", ValueType.number, (value) => {
            if (horizontalTypeRefresh) {
                horizontalTypeRefresh(value);
            }
        });

        //纵向显示方式
        let verticalTypeRefresh: Function = null;
        let setVerticalType = selection.addPropertyListener(label, "verticalType", ValueType.number, (value) => {
            if (verticalTypeRefresh) {
                verticalTypeRefresh(value);
            }
        });
        return {
            enable: null,
            title: "Label",
            component: label,
            ticon: null,
            attrs: [
                {
                    title: "Text",
                    type: "string",
                    attr: {
                        value: label.text,
                        onChange: (val) => {
                            setText(val);
                            // trans.markDirty();
                        },
                        setRefresh: (refresh) => {
                            textRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Font",
                    type: "string",
                    attr: {
                        value: label.font,
                        onChange: (val) => {
                            // setText(val);
                            // trans.markDirty();
                        },
                        setRefresh: (refresh) => {
                            fontRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Font Size",
                    type: "number",
                    attr: {
                        value: label.fontsize,
                        onChange: (val) => {
                            let fontsize = parseInt(val);
                            if (isNaN(fontsize)) {
                                return;
                            }
                            setFontSize(fontsize);
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            fontSizeRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Line Space",
                    type: "number",
                    attr: {
                        value: label.linespace,
                        onChange: (val) => {
                            let linespace = parseInt(val);
                            if (isNaN(linespace)) {
                                return;
                            }
                            setLineSpace(linespace);
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            linespaceRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Horizontal Overflow",
                    type: "checkbox",
                    attr: {
                        value: label.horizontalOverflow,
                        onChange: (val: boolean) => {
                            setHorizontalOverflow(val);
                            // label.horizontalOverflow=val;
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            horizontalOverflowRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Vertical Overflow",
                    type: "checkbox",
                    attr: {
                        value: label.verticalOverflow,
                        onChange: (val: boolean) => {
                            setVerticalOverflow(val);
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            verticalOverflowRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Color",
                    type: "string",
                    attr: {
                        value: label.color,
                        onChange: (val: string) => {
                            let arr = val.split(",");
                            console.error(arr);
                            let r = parseFloat(arr[0]);
                            let g = parseFloat(arr[1]);
                            let b = parseFloat(arr[2]);
                            let a = parseFloat(arr[3]);
                            setColor(new m4m.math.color(r, g, b, a));
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            colorRefresh = refresh;
                        },
                    }
                },
                {
                    title: "Stroke Color",
                    type: "string",
                    attr: {
                        value: label.color,
                        onChange: (val: string) => {
                            let arr = val.split(",");
                            console.error(arr);
                            let r = parseFloat(arr[0]);
                            let g = parseFloat(arr[1]);
                            let b = parseFloat(arr[2]);
                            let a = parseFloat(arr[3]);
                            setStrokeColor(new m4m.math.color(r, g, b, a));
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            strokeColorRefresh = refresh;
                        },
                    }
                },
                {
                    title: "OutlineWidth",
                    type: "number",
                    attr: {
                        value: label.outlineWidth,
                        onChange: (val: number) => {
                            setOutlineWidth(val);
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            outlineWidthRefresh = refresh;
                        },
                    }
                },
                {
                    title: "HorizontalType",
                    type: "number",
                    attr: {
                        value: label.horizontalType,
                        onChange: (val: m4m.framework.HorizontalType) => {
                            // Center = 0,
                            // Left = 1,
                            // Right = 2
                            setHorizontalType(val);
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            horizontalTypeRefresh = refresh;
                        },
                    }
                },
                {
                    title: "VerticalType",
                    type: "number",
                    attr: {
                        value: label.verticalType,
                        onChange: (val: m4m.framework.VerticalType) => {
                            // Center = 0,
                            // Top = 1,
                            // Boom = 2
                            setVerticalType(val);
                            // label.text = label.text;
                            label.transform.markDirty();
                        },
                        setRefresh: (refresh) => {
                            verticalTypeRefresh = refresh;
                        },
                    }
                }
            ]
        }
    }
}