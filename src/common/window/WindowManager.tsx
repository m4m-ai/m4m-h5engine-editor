import { IWindowData, IWindowInstance } from "./Window";
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import React from "react";
import { AttributeManager } from "../attribute/AttributeManager";

import { Button, Select } from 'antd'
import { MessageOutlined } from "@ant-design/icons";
import { TimelineEditor } from "../timeline/timeline";
import { ProgressLoading } from './components/progressLoading/progressLoading';
import { EditorApplication } from "../../Game/EditorApplication";
import { EditorComponentMgr, IComponentInfo } from "../../Game/Component/EditorComponentMgr";
import { BuildSetting } from "./components/BuildSetting/buildSetting";
import { PackageManager } from './components/PackageManager/packageManager'
import { CreateProjectWindow } from "../ProjectEntrance/MainCom/ProjectWindow/CreateProjectWindow/createProjectWindow";
import { WebsocketTool } from "../../CodeEditor/code/WebsocketTool";

export class WindowManager {

    private static _instanceIndex = 1;

    /**
     * 所有已经打开的窗体
     */
    public static windowMap: Map<number, IWindowInstance> = new Map<number, IWindowInstance>();

    /**
     * 返回是否存在指定 id 的窗口实例
     */
    public static hasWindow(id: number): boolean {
        return this.windowMap.has(id);
    }

    /**
     * 创建一个窗体, 返回当前窗体的实例 id, 关闭窗体等其它操作需要用上这个 id
     * @param windowData 窗体数据
     */
    public static createWindow(windowData: IWindowData): number {
        let id: number = this._instanceIndex++;
        let inst: IWindowInstance = { ...windowData, id };
        this.windowMap.set(id, inst);
        let list = Array.from(this.windowMap.values());
        EditorEventMgr.Instance.emitEvent("OnWindowListRefresh", cb => cb(list));
        return id;
    }

    /**
     * 根据 id 关闭窗口
     */
    public static closeWindow(id: number): boolean {
        if (this.windowMap.has(id)) {
            this.windowMap.delete(id);
            let list = Array.from(this.windowMap.values());
            EditorEventMgr.Instance.emitEvent("OnWindowListRefresh", cb => cb(list));
            return true;
        }
        return false;
    }

    /**
     * 弹出保存询问窗口
     */
    public static showSaveConfirm(title: string, path: string, value: string, onSave: (path: string, name: string) => void): number {
        let p1 = path;
        let n1 = value;
        let id = this.createWindow({
            close: false,
            body: (
                <div className="win-confirm">
                    <div className="win-confirm-body">
                        {
                            AttributeManager.getAttributeList([
                                {
                                    title: "Save Path",
                                    type: "string",
                                    attr: {
                                        attrValue: path,
                                        disable: true,
                                        onChange(changeValue: string) {
                                            p1 = changeValue;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Save Name",
                                    type: "string",
                                    attr: {
                                        attrValue: value,
                                        onChange(changeValue: string) {
                                            // console.error("Save Name "+changeValue);
                                            n1 = changeValue;
                                        },
                                        setRefresh() { }
                                    }
                                }
                            ])
                        }
                    </div>

                    <div className="win-confirm-bottom">
                        <div
                            style={{ margin: "5px" }}
                            className="clickOpen"
                            onClick={(e) => {
                                WindowManager.closeWindow(id);
                                onSave(p1, n1);
                            }}
                        >
                            Save
                        </div>
                        <div
                            style={{ margin: "5px" }}
                            className="clickOpen"
                            onClick={(e) => {
                                WindowManager.closeWindow(id);
                            }}
                        >
                            Cancel
                        </div>
                    </div>
                </div>
            ),
            title: title,
            width: 400,
            height: 200,
            custom: {
                isSaveConfirm: true,
            }
        });
        return id;
    }

    /**
     * 返回 SaveConfirm 窗口是否打开
     */
    public static hasSaveConfirm(): boolean {
        let flag = false;
        this.windowMap.forEach((value, key) => {
            if (flag) {
                return;
            }
            flag = value.custom && value.custom.isSaveConfirm == true;
        })
        return flag;
    }

    /**
     * 打开导航生成窗口
     */
    public static showCreateNavigationConfirm(onSave: (data: any) => void) {
        let data = {
            meshtype: "Solo",
            cellsize: 1,
            cellheight: 1,
            agentheight: 1,
            agentradius: 1,
            agentmaxclimb: 0.2,
            agentmaxslope: 45,
            minregionsize: 1,
            partitioning: 0,
            lowHangingObstacles: 1,
            ledgeSpans: 0.3,
            walkableLowHeightSpans: 0,
        }
        let id = this.createWindow({
            close: false,
            body: (
                <div className="win-confirm">
                    <div className="win-confirm-body">
                        {
                            AttributeManager.getAttributeList([
                                {
                                    title: "Mesh Type",
                                    describe: "导航网格类型",
                                    rightWidth: "50%",
                                    type: "select",
                                    attr: {
                                        attrValue: {
                                            defaultValue: data.meshtype,
                                        },
                                        options: [
                                            { value: "Solo", label: "Solo" },
                                            { value: "Tile", label: "Tile" }
                                        ],
                                        onChange(value: { value: string }) {
                                            data.meshtype = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Cell Size",
                                    describe: "网格大小",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.cellsize,
                                        },
                                        onChange(value: { value: number }) {
                                            data.cellsize = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Cell Height",
                                    describe: "网格高度",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.cellheight,
                                        },
                                        onChange(value: { value: number }) {
                                            data.cellheight = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Agent Height",
                                    describe: "行走代理角色的身高",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.agentheight,
                                        },
                                        onChange(value: { value: number }) {
                                            data.agentheight = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Agent Radius",
                                    describe: "行走代理角色的半径",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.agentradius,
                                        },
                                        onChange(value: { value: number }) {
                                            data.agentradius = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Agent Max Climb",
                                    describe: "行走代理角色的可爬高度",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.agentmaxclimb,
                                        },
                                        onChange(value: { value: number }) {
                                            data.agentmaxclimb = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Agent Max Slope",
                                    describe: "行走代理角色的可走最大坡度",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.agentmaxslope,
                                        },
                                        onChange(value: { value: number }) {
                                            data.agentmaxslope = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Min Region Size",
                                    describe: "最小区域size",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.minregionsize,
                                        },
                                        onChange(value: { value: number }) {
                                            data.minregionsize = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Partitioning",
                                    describe: "Partitioning",
                                    rightWidth: "50%",
                                    type: "select",
                                    attr: {
                                        attrValue: {
                                            defaultValue: data.partitioning,
                                        },
                                        options: [
                                            { value: 0, label: "Watershed" },
                                            { value: 1, label: "Monotone" },
                                            { value: 2, label: "Layers" }
                                        ],
                                        onChange(value: { value: number }) {
                                            data.partitioning = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Low Hanging Obstacles",
                                    describe: "最小绞死障碍",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.lowHangingObstacles,
                                        },
                                        onChange(value: { value: number }) {
                                            data.lowHangingObstacles = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Ledge Spans",
                                    describe: "岩架跨度",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.ledgeSpans,
                                        },
                                        onChange(value: { value: number }) {
                                            data.ledgeSpans = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                                {
                                    title: "Walkable Low Height Spans",
                                    describe: "可行走最低高度",
                                    rightWidth: "50%",
                                    type: "number",
                                    attr: {
                                        attrValue: {
                                            value: data.walkableLowHeightSpans,
                                        },
                                        onChange(value: { value: number }) {
                                            data.walkableLowHeightSpans = value.value;
                                        },
                                        setRefresh() { }
                                    }
                                },
                            ])
                        }
                    </div>

                    <div className="win-confirm-bottom">
                        <div
                            style={{ margin: "5px" }}
                            className="clickOpen"
                            onClick={(e) => {
                                WindowManager.closeWindow(id);
                                onSave(data);
                            }}
                        >
                            保存
                        </div>
                        <div
                            style={{ margin: "5px" }}
                            className="clickOpen"
                            onClick={(e) => {
                                WindowManager.closeWindow(id);
                            }}
                        >
                            取消
                        </div>
                    </div>
                </div>
            ),
            title: "生成导航网格",
            width: 500,
            height: 600,
            custom: {
                isCreateNavigationConfirm: true,
            }
        });
        return id;
    }

    /**
     * 是否打开了导航网格生成窗口
     */
    public static hasCreateNavigationConfirm() {
        let flag = false;
        this.windowMap.forEach((value, key) => {
            if (flag) {
                return;
            }
            flag = value.custom && value.custom.isCreateNavigationConfirm == true;
        })
        return flag;
    }

    /**
     * 弹出一个提示
     */
    public static showTips(title: string, message: string, onClose?: () => void) {
        let id = this.createWindow({
            resize: false,
            keepOut: true,
            close: false,
            width: 250,
            height: 150,
            body:
                (
                    <div className="win-confirm">
                        <div style={{ color: "#C7C7C7" }} className="win-confirm-body">
                            {message}
                        </div>

                        <div className="win-confirm-bottom">
                            <div
                                style={{ margin: "5px" }}
                                className="clickOpen"
                                onClick={(e) => {
                                    onClose && onClose();
                                    this.closeWindow(id);
                                }}
                            >
                                确定
                            </div>
                        </div>
                    </div>
                ),
            title: title
        });
        return id;
    }

    public static showAnimationWindow() {
        let trans = EditorApplication.Instance.selection.activeTransform;
        let infos: IComponentInfo[] = [];
        if (trans) {
            let componentTypes: any;;
            if (trans instanceof m4m.framework.transform2D) {
                componentTypes = trans.componentTypes;
                for (const key in trans.componentTypes) {
                    if (trans.componentTypes[key]) {
                        infos.push(EditorComponentMgr.getComponentInfo(key));
                    }
                }
            } else {
                componentTypes = trans.gameObject.componentTypes;
                for (const key in componentTypes) {
                    if (componentTypes[key]) {
                        infos.push(EditorComponentMgr.getComponentInfo(key));
                    }
                }
            };
        }
        console.error("infos: ", infos);
        let id = this.createWindow({
            resize: true,
            close: true,
            width: 1000,
            height: 600,
            body:
                (
                    <TimelineEditor datas={[...infos]}></TimelineEditor>
                ),
            title: "动画编辑器"
        });
        return id;
    }

    /**
     * 弹出新建窗口
     */
    public static showCreateProjectWindow() {
        let str = "";
        let id = this.createWindow({
            resize: true,
            close: true,
            width: 300,
            height: 100,
            minWidth: 300,
            minHeight: 100,
            body:
                (
                    //<CreateProjectWindow id={this._instanceIndex}></CreateProjectWindow>
                    <div style={{ margin: "10px" }}>
                    {
                        AttributeManager.getAttributeList([
                            {
                                title: "Project Name",
                                type: "string",
                                attr: {
                                    attrValue: {
                                        value: str,
                                    },
                                    setRefresh() { },
                                    onChange(value: { value: string }) {
                                        str = value.value;
                                    }
                                }
                            }
                        ])
                    }
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, auto)",
                        justifyItems: "center",
                    }}>
                        <Button onClick={event => {
                            WindowManager.closeWindow(id);
                        }}>Cancel</Button>
                        <Button onClick={event => {
                            WebsocketTool.Instance.ProjectManager_creatProject(str);
                            WindowManager.closeWindow(id);
                        }}>Create</Button>
                    </div>
                </div>
                ),
            title: "Create Project"
        });
        return id;
    }

    /**
     * 弹出提示窗口 (样例, 没有做样式)
     * @param message 显示文本
     * @param onClose 关闭时调用
     */
    public static showTipsExample(message: string, onClose?: () => void): number {
        let id = this.createWindow({
            resize: false,
            width: 200,
            height: 100,
            body:
                (
                    <div>
                        <div style={{ color: "#C7C7C7" }}>{message}</div>
                        <Button onClick={event => { this.closeWindow(id); onClose && onClose(); }}>关闭</Button>
                    </div>
                ),
            title: "提示:"
        });
        return id;
    }

    /**
     * 展示属性面板窗口 (样例)
     */
    public static showAttrExample(): number {
        let id = WindowManager.createWindow({
            body: (
                <div style={{ margin: "10px" }}>
                    {
                        AttributeManager.getAttributeList([
                            {
                                title: "属性number",
                                type: "number",
                                attr: {
                                    attrValue: {
                                        value: 0,
                                    },
                                    setRefresh() { },
                                    onChange() { }
                                }
                            },
                            {
                                title: "属性string",
                                type: "string",
                                attr: {
                                    attrValue: {
                                        value: "",
                                    },
                                    setRefresh() { },
                                    onChange() { }
                                }
                            },
                            {
                                title: "属性vector3",
                                type: "vector3",
                                attr: {
                                    attrValue: {
                                        x: 0,
                                        y: 0,
                                        z: 0,
                                    },
                                    disable: true,
                                    setRefresh() { },
                                    onChange() { }
                                }
                            },
                            {
                                title: "属性color",
                                type: "color",
                                attr: {
                                    attrValue: {
                                        r: 1,
                                        g: 0,
                                        b: 0,
                                        a: 0.5,
                                    },
                                    setRefresh(func: Function) {
                                        //console.log("setRefresh...");
                                    },
                                    onChange(r, g, b, a) {
                                        //console.log("onChange颜色改变：", r, g, b, a);
                                    }
                                }
                            },
                            {
                                title: "number Array",
                                type: "number",
                                isArray: true,
                                arrayData: [
                                    { value: 1 },
                                    { value: 2 }
                                ],
                                defaultTemplate: {
                                    value: 0
                                },
                                attr: {
                                    attrValue: {},
                                    setRefresh(func: Function) {
                                    },
                                    onChange() {
                                    }
                                },
                            },
                            {
                                title: '属性checkbox',
                                type: 'checkbox',
                                attr: {
                                    attrValue: {
                                        value: true
                                    },
                                    disable: true,
                                    setRefresh(func: Function) {
                                    },
                                    onChange() {
                                    }
                                }
                            },
                            {
                                title: '属性select',
                                type: 'select',
                                attr: {
                                    attrValue: {
                                        defaultValue: 1
                                    },
                                    options: [
                                        {
                                            value: 1,
                                            label: 'op1'
                                        },
                                        {
                                            value: 2,
                                            label: 'op2'
                                        },
                                    ],
                                    disable: true,
                                    setRefresh(func: Function) {
                                    },
                                    onChange() {
                                    }
                                }
                            },
                            {
                                title: '属性SliderAttr',
                                type: 'slider',
                                attr: {
                                    value: 20,
                                    min: 0,
                                    max: 100,
                                    disable: true,
                                    setRefresh(func: Function) {
                                    },
                                    onChange() {
                                    }
                                }
                            },
                            {
                                title: '属性RectAttr',
                                type: 'rect',
                                attr: {
                                    x: 1,
                                    y: 2,
                                    w: 3,
                                    h: 4,
                                    disable: true,
                                    setRefresh(func: Function) {
                                    },
                                    onChange() {
                                    }
                                }
                            },
                            // {
                            //     title: '属性inputGroup',
                            //     type: 'inputGroup',
                            //     attr: {
                            //         array: [
                            //             {
                            //                 title: 'string',
                            //                 type: "string",
                            //                 data: [],
                            //             }
                            //         ],
                            //         disable: true,
                            //         setRefresh(func: Function) {
                            //         },
                            //         onChange() {
                            //         }
                            //     }
                            // },
                            {
                                title: '属性radioGroup',
                                type: 'radioGroup',
                                attr: {
                                    attrValue: {
                                        value: 'x',
                                        options: [
                                            { label: 'X', value: 'x' },
                                            { label: 'Y', value: 'y' },
                                            { label: 'Z', value: 'z' },
                                        ]
                                    },
                                    setRefresh(func: Function) {
                                    },
                                    onChange() {

                                    }
                                }
                            }
                        ])
                    }
                    <div style={{ background: '#36376C', padding: '6px', marginBottom: '10px' }}>
                        <Button onClick={event => { WindowManager.closeWindow(id); }}>关闭</Button>
                    </div>
                    <Select defaultValue={'1111'}>
                        <Select.Option value="1111">1111</Select.Option>
                        <Select.Option value="2222">2222</Select.Option>
                    </Select>
                </div>
            ),
            width: 500,
            height: 400,
            minWidth: 300,
            minHeight: 50,
            title: "样例窗口",
            icon: <MessageOutlined />
        });
        return id;
    }
    /**
     * 进度条窗口
     */
    public static showProgressWindow(props: {
        title: string, progressNum: number, infoList: [], progressRefresh: Function
    }): number {

        const id = WindowManager.createWindow({
            title: props.title,
            keepOut: true,
            body: (
                <ProgressLoading progressNum={props.progressNum} infoList={props.infoList} setRefresh={(firstRefresh, secRefresh) => {
                    props.progressRefresh(firstRefresh, secRefresh)
                }} />
            ),
            width: 514,
            height: 120,
            resize: false
        })
        return id
    }
    /**
     * build Settings 窗口
     */
    public static showBuildSettingWindow(props) {
        const id = WindowManager.createWindow({
            title: 'Build Settings',
            keepOut: true,
            body: (
                <BuildSetting />
            ),
            width: 1124,
            height: 725,
            minWidth: 765,
            minHeight: 520
        })
        return id
    }
    public static showPackageManager(props) {
        const id = WindowManager.createWindow({
            title: 'PackageManager',
            body: (
                <PackageManager />
            ),
            width: 800,
            height: 567,
        })
        return id
    }
}