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
export {};
// import { EditorApplication } from "../Game/EditorApplication";
// import { UIFixer } from "./uifixer";


// export abstract class UIElement {
//     transform: m4m.framework.transform2D;
//     type: string;
//     /**
//      * Dump 方法比较关键
//      * json模式，没有编译器接入，注意比对template_define.txt中的定义
//      */
//     abstract Dump(): any;
//     /**
//      * Change 方法比较关键，用一个统一方法修改属性
//      * @param values 所有要改变的属性
//      */
//     abstract Change(values: any): void;
// }
// export enum IconStyle {
//     H,
//     V,
// }

// /**
//  * 表示道具的UI元素
//  */
// export class Icon extends UIElement {
//     constructor(row, col) {
//         console.log("...Icon.ctor");
//         super();
//         this.transform = new m4m.framework.transform2D();
//         this.world2D = new m4m.framework.transform2D();

//         this._label = this.world2D.addComponent("label") as m4m.framework.label;
//         this._label.transform.name = "Label";
//         this._label.fontsize = 20;
//         this._label.font = EditorApplication.Instance.editorResources.defaultFont;
//         this._label.color = new m4m.math.color(0, 0, 0, 1);
//         this._label.transform.width = 200;
//         this._label.transform.height = 40;
//         this._label.horizontalType = m4m.framework.HorizontalType.Center;
//         this._label.verticalType = m4m.framework.VerticalType.Center;
//         this._label.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;

//         this._icon = this.transform.addComponent("image2D") as m4m.framework.image2D;
//         this._icon.transform.name = "image2D";
//         this._icon.transform.width = 400;
//         this._icon.transform.height = 400;
//         this._icon.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;
//         this.transform.addChild(this.world2D);
//         let rowNumber = row;
//         let layout = rowNumber * (this._icon.transform.height + this._label.transform.height);
//         if (!this.isbool()) {
//             rowNumber = 0;
//             layout = this.height();
//         }
//         if (row > 0) {
//             let IconlayoutTop = this._icon.transform.getLayoutValue(m4m.framework.layoutOption.TOP);
//             IconlayoutTop += layout;
//             this._icon.transform.setLayoutValue(m4m.framework.layoutOption.TOP, IconlayoutTop + 20);
//         }
//         let labelLayoutTop = this._label.transform.getLayoutValue(m4m.framework.layoutOption.TOP);
//         labelLayoutTop += 400;
//         this._label.transform.setLayoutValue(m4m.framework.layoutOption.TOP, 400);

//         if (col > 0) {
//             let IconlayoutLeft = this._icon.transform.getLayoutValue(m4m.framework.layoutOption.LEFT);
//             IconlayoutLeft += col * (this._icon.transform.width + this._label.transform.width);
//             this._icon.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, IconlayoutLeft);
//         }
//     }
//     getType(): string {
//         return "Icon";
//     }

//     isbool(): boolean {
//         let bool = true;
//         let getPanel = GetGPanel();
//         for (let index = 0; index < getPanel.Panel.children.length; index++) {
//             const element = getPanel.Panel.children[index];
//             for (let index = 0; index < element.children.length; index++) {
//                 const child = element.children[index];
//                 bool = child.name == "image2D"
//             }
//         }
//         return bool;
//     }

//     height(): number {
//         let number = 0;
//         let getPanel = GetGPanel();
//         for (let key = 0; key < getPanel.Panel.children.length; key++) {
//             const element = getPanel.Panel.children[key];
//             for (let index = 0; index < element.children.length; index++) {
//                 const child = element.children[index];
//                 if (key == (getPanel.Panel.children.length - 2)) {
//                     number += child.height;
//                 }
//             }
//         }
//         return number;
//     }
//     world2D: m4m.framework.transform2D;
//     _label: m4m.framework.label;
//     _icon: m4m.framework.image2D;
//     _iconname: string = "";
//     _style: IconStyle = IconStyle.H;
//     SetText(text: string): void {
//         this._label.text = text;
//     }
//     SetStyle(style: IconStyle): void {
//         this._style = style;
//         if (style == IconStyle.H) {
//             // this._icon.style.display = "inline-block";
//         }
//         else {
//             // this._icon.style.display = "block";
//         }
//     }
//     GetText(): string {
//         return this._label.text;
//     }
//     SetIcon(icon: string): void {
//         this._iconname = icon;
//         console.log(this._icon.sprite);
//         let sprite = UIFixer.GetSelectPic(icon);
//         this._icon.sprite = sprite;
//     }
//     Change(values: any): void {
//         console.log("...Icon.change");
//         for (var key in values) {
//             if (key == "text")
//                 this.SetText(values[key]);
//             else if (key == "icon")
//                 this.SetIcon(values[key]);
//             else if (key == "style")
//                 if (values[key] == "h")
//                     this.SetStyle(IconStyle.H);
//                 else
//                     this.SetStyle(IconStyle.V);
//         }
//     }
//     Dump(): any {
//         let dumpobj: any = {};
//         dumpobj.type = this.getType().toLowerCase();
//         let value: any = {};
//         dumpobj.value = value;
//         value.text = this.GetText();
//         value.icon = this._iconname;
//         let s = IconStyle[this._style].toLowerCase();
//         value.style = s;
//         return dumpobj;
//     }
// }

// /**
//  * 表示标签的UI元素
//  */
// export class Label extends UIElement {
//     constructor(row, col) {
//         console.log("...Label.ctor");
//         super();
//         this.transform = new m4m.framework.transform2D();
//         this.transform.name = "transform"
//         this._label = this.transform.addComponent("label") as m4m.framework.label;
//         this._label.transform.name = "Label";
//         this._label.fontsize = 20;
//         this._label.transform.width = 200;
//         this._label.transform.height = 40;
//         this._label.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;
//         this._label.font = EditorApplication.Instance.editorResources.defaultFont;
//         this._label.color = new m4m.math.color(0, 0, 0, 1);
//         this._label.horizontalType = m4m.framework.HorizontalType.Center;
//         this._label.verticalType = m4m.framework.VerticalType.Center;
        
//         if (row > 0) {
//             let IconlayoutTop = this._label.transform.getLayoutValue(m4m.framework.layoutOption.TOP);
//             IconlayoutTop += row * this._label.transform.height
//             this._label.transform.setLayoutValue(m4m.framework.layoutOption.TOP, IconlayoutTop + 20);
//         }
//         if (col > 0) {
//             let IconlayoutLeft = this._label.transform.getLayoutValue(m4m.framework.layoutOption.LEFT);
//             IconlayoutLeft += col * this._label.transform.width
//             this._label.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, IconlayoutLeft);
//         }
//     }
//     _label: m4m.framework.label;
//     getType(): string {
//         return "Label";
//     }
//     SetText(text: string): void {
//         (this._label as m4m.framework.label).text = text;
//     }
//     GetText(): string {
//         return (this._label as m4m.framework.label).text;
//     }
//     GetName(): string {
//         let text = (this._label as m4m.framework.label).text;
//         return text;
//     }
//     Change(values: any): void {
//         console.log("...Label.change");
//         for (var key in values) {
//             if (key == "text")
//                 this.SetText(values[key]);
//         }
//     }
//     Dump(): any {
//         let dumpobj: any = {};
//         dumpobj.type = this.getType().toLowerCase();
//         let value: any = {};
//         dumpobj.value = value;
//         value.text = this.GetText();
//         return dumpobj;
//     }
// }


// /**
//  * 表示按钮的UI元素
//  */
// export class Button extends UIElement {
//     constructor(row, col) {
//         console.log("...Button.ctor");
//         super();
//         this.transform = new m4m.framework.transform2D();
//         this.transform = m4m.framework.TransformUtil.Create2DPrimitive(m4m.framework.Primitive2DType.Button);
//         this._button = this.transform.getComponent("button") as m4m.framework.button;
//         this._button.transform.width = 150;
//         this._button.transform.height = 50;
//         this._button.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;
//         this._label = this._button.transform.getFirstComponentInChildren("label") as m4m.framework.label;
//         this._label.horizontalType = m4m.framework.HorizontalType.Center;
//         this._label.verticalType = m4m.framework.VerticalType.Center;
//         this._label.transform.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP | m4m.framework.layoutOption.RIGHT | m4m.framework.layoutOption.BOTTOM;
//         this._label.transform.width = 150;
//         this._label.transform.height = 50;
//         this._label.font = EditorApplication.Instance.editorResources.defaultFont;
//         this._label.color = new m4m.math.color(0, 0, 0, 1);

//         if (row > 0) {
//             let IconlayoutTop = this._button.transform.getLayoutValue(m4m.framework.layoutOption.TOP);
//             IconlayoutTop += row * (this._button.transform.height + 20);
//             this._button.transform.setLayoutValue(m4m.framework.layoutOption.TOP, IconlayoutTop);
//         }
//         if (col > 0) {
//             let IconlayoutLeft = this._button.transform.getLayoutValue(m4m.framework.layoutOption.LEFT);
//             IconlayoutLeft += col * (this._button.transform.width + 20);
//             this._button.transform.setLayoutValue(m4m.framework.layoutOption.LEFT, IconlayoutLeft);
//         }
//     }
//     _label: m4m.framework.label;
//     _button: m4m.framework.button;
//     getType(): string {
//         return "Button";
//     }
//     SetText(text: string): void {
//         (this._label as m4m.framework.label).text = text;
//     }
//     GetText(): string {
//         return (this._label as m4m.framework.label).text;
//     }
//     GetName(): string {
//         let text = (this._label as m4m.framework.label).text;
//         return text;
//     }
//     Change(values: any): void {
//         console.log("...Button.change");
//         for (var key in values) {
//             if (key == "text")
//                 this.SetText(values[key]);
//         }
//     }
//     Dump(): any {
//         let dumpobj: any = {};
//         dumpobj.type = this.getType().toLowerCase();
//         let value: any = {};
//         dumpobj.value = value;
//         value.text = this.GetText();
//         return dumpobj;
//     }
// }


// enum layoutOption {
//     LEFT = 1,
//     TOP = 2,
//     RIGHT = 4,
//     BOTTOM = 8,
//     H_CENTER = 16,
//     V_CENTER = 32
// }
// export class Line {
//     constructor(row) {
//         let Panel = this.Panel = new m4m.framework.transform2D();
//         this.Panel.layoutState = m4m.framework.layoutOption.LEFT | m4m.framework.layoutOption.TOP;
//         this.Panel.width = 1920;
//         this.Panel.height = 400;
//         this.Panel.name = "Line";
//         // if (row != 0) {
//         //     this.Panel.transform.localTranslate.y += row * this.Panel.transform.width;
//         // }
//     }
//     Panel: m4m.framework.transform2D;
//     private _align: layoutOption = layoutOption.LEFT;
//     private _elems: UIElement[] = [];

//     /**
//      * 设置对齐方式
//      * @param align 对齐方式
//      */
//     setAlign(align: layoutOption): void {
//         this._align = align;
//         this.Panel.layoutState = align;
//         for (let index = 0; index < this.Panel.children.length; index++) {
//             const element = this.Panel.children[index];
//             element.layoutState = align;
//         }
//     }
//     insertUIElem(index: number, elem: UIElement): void {
//         console.log("...line.insertUIElem");
//         if (index == this.Panel.children.length) {
//             this._elems.push(elem);
//             this.Panel.addChild(elem.transform);
//         }
//         else {//插在中间
//             this._elems.splice(index, 0, elem);
//             let next = this.Panel.children[index];
//             // this.Panel.insertBefore(elem.html, next);
//         }

//     }
//     removeUIElem(index: number): void {
//         console.log("...line.removeUIElem");
//         this._elems.splice(index, 1);
//         this.Panel.removeChild(this.Panel.children[index]);
//     }
//     getUIElemCount(): number {

//         return this._elems.length;
//     }
//     getUIElem(index: number): UIElement {
//         console.log("...line.getUIElem");
//         return this._elems[index];
//     }
//     Change(values: any): void {
//         console.log("...line.change");
//         for (var key in values) {
//             if (key == "align") {
//                 let strkey = values[key] as string;
//                 let av = layoutOption.LEFT;
//                 if (strkey.toLowerCase() == "center")
//                     av = layoutOption.H_CENTER;
//                 else if (strkey.toLowerCase() == "right")
//                     av = layoutOption.RIGHT;

//                 this.setAlign(av);
//             }
//         }
//     }
//     Dump(): any {
//         let dumpobj: any = {};
//         let s = layoutOption[this._align].toLowerCase();
//         dumpobj.align = s;
//         dumpobj.elems = [];
//         for (var i = 0; i < this._elems.length; i++) {
//             dumpobj.elems.push(this._elems[i].Dump());
//         }
//         return dumpobj;
//     }
//     //输出易于观察的字符串格式
//     DumpStr(row: number): string {
//         let outjson = this.Dump();
//         outjson.row = row;
//         let s = layoutOption[this._align].toLowerCase();
//         if (this._elems == undefined || this._elems.length <= 1) {
//             let itemstr = "";
//             if (this._elems != undefined && this._elems.length == 1) {
//                 itemstr = JSON.stringify(this._elems[0].Dump());
//             }
//             let outstr = `  {"row":` + row + `,"align":"` + s + `","elems":[` + itemstr + `]`;
//             return outstr;

//         }
//         let outstr = `  {"row":` + row + `,"align":"` + s + `","elems":[\n`;
//         for (var i = 0; i < this._elems.length; i++) {
//             let itemstr = JSON.stringify(this._elems[i].Dump());
//             if (i > 0)
//                 outstr += ",\n"
//             outstr += "      " + itemstr;
//         }
//         outstr += `\n      ]\n  }`
//         return outstr;
//     }

// }

// /**
//  * 表示UI的面板
//  * @getLineCount 获取行数
//  * @addLine 添加一行
//  * @getLine 获取指定行
//  * @removeLine 删除指定行
//  */
// export class Panel {
//     constructor() {
//         let Panel = this.Panel = new m4m.framework.transform2D();
//         this.Panel.name = "Panel";
//         Panel.layoutState = m4m.framework.layoutOption.H_CENTER;
//         // Panel.style.alignItems = "center";
//         Panel.width = 1920;
//         Panel.height = 1080;
//         // Panel.border = "2px solid white";
//         // Panel.position = "absolute";
//         // Panel.left = "0px";
//         // Panel.top = "0px";
//         // Panel.right = "0px";
//         // Panel.bottom = "0px";
//         // Panel.margin = "auto";
//     }
//     Panel: m4m.framework.transform2D;
//     private _lines: Line[] = [];
//     getLineCount(): number {
//         return this._lines.length;
//     }
//     addLine(row): Line {
//         let _line = new Line(row);
//         this._lines.push(_line);
//         this.Panel.addChild(_line.Panel);
//         console.log("...panel.addline");
//         return _line;
//     }
//     insertLine(row: number): Line {
//         if (row == this._lines.length) {
//             return this.addLine(row);
//         }
//         else {
//             console.log("...panel.insertLine");
//             let _line = new Line(row);
//             this._lines.splice(row, 0, _line);
//             // this.div.insertBefore(_line.div, this.div.childNodes[row]);
//             return _line;
//         }
//     }
//     getLine(index: number): Line {
//         console.log("...panel.getLine");
//         return this._lines[index];
//     }
//     removeLine(index: number): void {
//         console.log("...panel.removeLine");
//         this._lines.splice(index, 1);
//         this.Panel.removeChild(this.Panel.children[index]);
//     }
//     DumpStr(): string {
//         let outstr = "[\n";
//         for (var i = 0; i < this._lines.length; i++) {
//             if (i > 0)
//                 outstr += ",\n"
//             let linedump = this._lines[i].DumpStr(i);
//             outstr += linedump;
//         }
//         outstr += "\n]";
//         return outstr;
//     }

// }
// export var Root: m4m.framework.transform2D;
// export var _gpanel: Panel = null;
// /**
//  * 创建一个UI的面板
//  * @returns 返回UI的面板
//  */
// export function CreatePanel(): Panel {
//     if (_gpanel == null) {

//         _gpanel = new Panel();
//         Root = new m4m.framework.transform2D();
//         Root.addChild(_gpanel.Panel);
//         Root.layoutState = m4m.framework.layoutOption.H_CENTER;
//         Root.width = 1920;
//         Root.height = 1080;
//         Root.name = "transform2D"

//         let ui = EditorApplication.Instance.editorScene.canvasRenderer;
//         if (ui.canvas) {
//             let uiRoot = ui.canvas.getRoot();
//             uiRoot.addChild(Root);
//         }

//         console.log("...createPanel");

//         return _gpanel;
//     }

//     console.error("...Already created panel.");
//     throw new Error("...Already created panel.")
// }

// export function SetRootDiv(transform: m4m.framework.transform2D) {
//     Root = transform;
// }
// export function GetGPanel(): Panel {
//     return _gpanel;
// }
// var type = 0;
// export function RunCmd(cmdjson: any): void {
//     let cmd = cmdjson["cmd"];
//     if (cmd == "CreatePanel") {
//         CreatePanel();
//     }
//     else if (cmd == "InsertLine") {
//         let row = cmdjson["row"];
//         _gpanel.insertLine(row);
//     }
//     else if (cmd == "RemoveLine") {
//         let row = cmdjson["row"];
//         _gpanel.removeLine(row);
//     }
//     else if (cmd == "ChangeLineValue") {
//         let row = cmdjson["row"];
//         let change = cmdjson["change"];
//         let line = _gpanel.getLine(row);
//         line.Change(change);
//     }
//     else if (cmd == "CreateElement") {
//         let row = cmdjson["row"];
//         let col = cmdjson["col"];
//         let type = cmdjson["type"].toLowerCase();
//         let values = cmdjson["values"];
//         let line = _gpanel.getLine(row);
//         if (type == "label") {
//             let label = new Label(row, col);
//             line.insertUIElem(col, label);
//             label.Change(values);
//         }
//         else if (type == "button") {
//             let button = new Button(row, col);
//             line.insertUIElem(col, button);
//             button.Change(values);
//         }
//         else if (type == "icon") {
//             let icon = new Icon(row, col);
//             line.insertUIElem(col, icon);
//             icon.Change(values);
//         }

//     }
//     else if (cmd == "RemoveElement") {
//         let row = cmdjson["row"];
//         let col = cmdjson["col"];
//         _gpanel.getLine(row).removeUIElem(col);
//     }
//     else if (cmd == "MoveElement") {
//         /*
// 7.移动组件，比如 将第2行，第1列的组件，插入到第0行，第0列，移动相当于从原位置删除，再重新插入到新位置，下标依次变化，如果移动后产生一个空行，则保留该空行
//     json形式 {"cmd":"MoveElement",row:2,col:1,newrow:0,newcol:0}
//         */
//         //这玩意儿工作的不咋样，移除
//         // let row = cmdjson["row"];
//         // let col = cmdjson["col"];
//         // let newrow = cmdjson["newrow"];
//         // let newcol = cmdjson["newcol"];
//         // let elem = _gpanel.getLine(row).getUIElem(col);
//         // _gpanel.getLine(row).removeUIElem(col);
//         // _gpanel.getLine(newrow).insertUIElem(newcol, elem);
//     }
//     else if (cmd == "ChangeElementValue") {
//         let row = cmdjson["row"];
//         let col = cmdjson["col"];
//         let change = cmdjson["change"];
//         let elem = _gpanel.getLine(row).getUIElem(col);
//         elem.Change(change);
//     }
// }