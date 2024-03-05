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
export {}

// import { UIFixer } from "./uifixer";


// export abstract class UIElement {
//     html: HTMLElement;
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
//     constructor() {
//         console.log("...Icon.ctor");
//         super();
//         this.html = document.createElement("div");
//         this.html.style.display = "inline-block";
//         this._label = document.createElement("span");
//         this._label.style.fontSize = "20";
//         this._label.style.color = "white";
//         this._icon = document.createElement("img");
//         this.html.appendChild(this._icon);
//         this.html.appendChild(this._label);
//     }
//     getType(): string {
//         return "Icon";
//     }
//     _label: HTMLSpanElement;
//     _icon: HTMLImageElement;
//     _iconname: string = "";
//     _style: IconStyle = IconStyle.H;
//     SetText(text: string): void {
//         this._label.textContent = text;
//     }
//     SetStyle(style: IconStyle): void {
//         this._style = style;
//         if (style == IconStyle.H) {
//             this._icon.style.display = "inline-block";
//         }
//         else {
//             this._icon.style.display = "block";
//         }
//     }
//     GetText(): string {
//         return this._label.textContent;
//     }
//     SetIcon(icon: string): void {
//         this._iconname = icon;
//         // this._icon.src = UIFixer.GetSelectPic(icon);
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
//     constructor() {
//         console.log("...Label.ctor");
//         super();
//         this.html = document.createElement("span");
//         this.html.style.fontSize = "20";
//         this.html.style.color = "white";
//     }
//     getType(): string {
//         return "Label";
//     }
//     SetText(text: string): void {
//         (this.html as HTMLSpanElement).textContent = text;
//     }
//     GetText(): string {
//         return (this.html as HTMLSpanElement).textContent;
//     }
//     GetName(): string {
//         let text = (this.html as HTMLSpanElement).textContent;
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
//     constructor() {
//         console.log("...Button.ctor");
//         super();
//         this.html = document.createElement("button");
//     }
//     getType(): string {
//         return "Button";
//     }
//     SetText(text: string): void {
//         (this.html as HTMLButtonElement).textContent = text;
//     }
//     GetText(): string {
//         return (this.html as HTMLButtonElement).textContent;
//     }
//     GetName(): string {
//         let text = (this.html as HTMLButtonElement).textContent;
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
// export enum Align {
//     Left,
//     Center,
//     Right
// }

// export class Line {


//     constructor() {
//         let div = this.div = document.createElement("div");
//         this.div.style.width = "100%";
//     }
//     div: HTMLDivElement;
//     private _align: Align = Align.Left;
//     private _elems: UIElement[] = [];

//     /**
//      * 设置对齐方式
//      * @param align 对齐方式
//      */
//     setAlign(align: Align): void {
//         this._align = align;
//         this.div.style.textAlign = Align[align];
//     }
//     insertUIElem(index: number, elem: UIElement): void {
//         console.log("...line.insertUIElem");
//         if (index == this.div.childNodes.length) {
//             this._elems.push(elem);
//             this.div.appendChild(elem.html);
//         }
//         else {//插在中间
//             this._elems.splice(index, 0, elem);
//             let next = this.div.childNodes[index];
//             this.div.insertBefore(elem.html, next);
//         }

//     }
//     removeUIElem(index: number): void {
//         console.log("...line.removeUIElem");
//         this._elems.splice(index, 1);
//         this.div.removeChild(this.div.childNodes[index]);
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
//                 let av = Align.Left;
//                 if (strkey.toLowerCase() == "center")
//                     av = Align.Center;
//                 else if (strkey.toLowerCase() == "right")
//                     av = Align.Right;

//                 this.setAlign(av);
//             }
//         }
//     }
//     Dump(): any {
//         let dumpobj: any = {};
//         let s = Align[this._align].toLowerCase();
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
//         let s = Align[this._align].toLowerCase();
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

//         let div = this.div = document.createElement("div");


//         div.style.alignItems = "center";
//         div.style.width = "600"
//         div.style.height = "400";
//         div.style.border = "2px solid white";
//         div.style.position = "absolute";
//         div.style.left = "0px";
//         div.style.top = "0px";
//         div.style.right = "0px";
//         div.style.bottom = "0px";
//         div.style.margin = "auto";
//     }
//     div: HTMLDivElement;
//     private _lines: Line[] = [];
//     getLineCount(): number {
//         return this._lines.length;
//     }
//     addLine(): Line {
//         let _line = new Line();
//         this._lines.push(_line);
//         this.div.appendChild(_line.div);
//         console.log("...panel.addline");
//         return _line;
//     }
//     insertLine(row: number): Line {
//         if (row == this._lines.length) {
//             return this.addLine();
//         }
//         else {
//             console.log("...panel.insertLine");
//             let _line = new Line();
//             this._lines.splice(row, 0, _line);
//             this.div.insertBefore(_line.div, this.div.childNodes[row]);
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
//         this.div.removeChild(this.div.childNodes[index]);
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
// export var RootDiv: HTMLDivElement;
// export var _gpanel: Panel = null;
// /**
//  * 创建一个UI的面板
//  * @returns 返回UI的面板
//  */
// export function CreatePanel(): Panel {
//     if (_gpanel == null) {

//         _gpanel = new Panel();
//         RootDiv.appendChild(_gpanel.div)
//         console.log("...createPanel");
//         return _gpanel;
//     }

//     console.error("...Already created panel.");
//     throw new Error("...Already created panel.")
// }

// export function SetRootDiv(div: HTMLDivElement) {
//     RootDiv = div;
// }
// export function GetGPanel(): Panel {
//     return _gpanel;
// }

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
//             let label = new Label();
//             line.insertUIElem(col, label);
//             label.Change(values);
//         }
//         else if (type == "button") {
//             let button = new Button();
//             line.insertUIElem(col, button);
//             button.Change(values);
//         }
//         else if (type == "icon") {
//             let icon = new Icon();
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