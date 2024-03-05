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
import { EditorAssetInfo } from './../../Game/Asset/EditorAssetInfo';
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { ExportManager } from "../../Game/ExportManager/ExportManager";
import { FileInfoManager } from "./FileInfoManager";
import { LogManager } from "./LogManager";
import { NetData } from "./NetData";
import { WebsocketTool } from "./WebsocketTool";

export class NetWebscoket {
    public static get Instance(): NetWebscoket {
        if (this._instance == null) {
            this._instance = new NetWebscoket();
        }

        return this._instance;
    }
    /**********是否需要请求 配置数据***********
    */
    public static reqconfigMes: boolean = true;
    public fuck: string = "";

    private static _instance: NetWebscoket;
    private _webscoket: WebSocket;
    //是否连接过服务器
    private _connected = false;
    public connect(url: string) {
        // console.log("开始链接服务器*** " + url);
        // this._webscoket = new WebSocket(url);//"wss://hse-dev-qq.upaidui.com"
        if (url == null) {
            console.error("服务器 地址出错！" + url);
            return;
        }
        // url = "wss://kingzet.cn";
        //console.log("开始链接服务器 " + url);
        this._webscoket = new WebSocket(url) as any;
        this._webscoket["onmessage"] = this.onmessage.bind(this);
        this._webscoket["onopen"] = this.onopen.bind(this);
        this._webscoket["onclose"] = this.onclose.bind(this);
        this._webscoket["onerror"] = this.onerror.bind(this);

    }

    public onmessage(e: any) {
        //MapManager.Instance.GetIntervalTime();
        // console.log("来消息了：" , e.data);
        try {
            if (typeof (e) == "string") {
                this.onmessageHandler(new NetData(e));
            } else {
                if (!e.data) {
                    this.onmessageHandler(new NetData(e));
                } else if (e.data.arrayBuffer) {
                    e.data.arrayBuffer()
                        .then((bf: ArrayBuffer) => {
                            this.onmessageHandler(new NetData(bf));
                        });
                } else {
                    this.onmessageHandler(new NetData(e.data));
                }
            }
        } catch (e: any) {
            console.error("NetWebscoket.onmessage异常:\n" + e.message + "\n" + e.stack);
        }
    }

    public sendMessage(buff: Uint8Array) {
        // console.error(buff.join());
        // this.rnetStream.Write(buff, 0, buff.length);
        NetWebscoket.Instance.send(buff);
    }

    public onopen(e) {
        //console.log("WebSocket连接成功!服务器onopen");
        this._connected = true;
        WebsocketTool.Instance.ProjectManager_login("test", "test");
    }

    public send(bytes: Uint8Array) {
        // console.error(bytes.join());
        if (this._webscoket && this._webscoket.readyState == 1) {
            this._webscoket.send(bytes);
        } else if (this._connected) {
        } else {
            //console.error("谁的傻逼代码 服务器都还没连上就调发送了111！");
        }
    }

    public sendStr(mess: string) {
        if (this._webscoket && this._webscoket.readyState == 1) {
            this._webscoket.send(mess);
        } else if (this._connected) {
            //console.error("提示", "已与服务器断开连接");
        } else {
            //console.error("谁的傻逼代码 服务器都还没连上就调发送了222！");
        }
    }

    public onclose(e) {
        //console.error("socket close  连接关闭连接关闭连接关闭。。。", e);
    }
    public onerror(e) {
        console.error(e);
        console.log("socket error", e);
    }


    // tslint:disable-next-line: cyclomatic-complexity
    private onmessageHandler(netData: NetData) {
        if (WebsocketTool.Instance.onmessage(netData)) {
            //console.log("json长度: " + netData.code.length + ", 整体用时" + MapManager.Instance.GetIntervalTime());
            return;
        }
        // console.log("netData ********* ", netData);
        if (netData.head != "[LOG]") {
            let messObjList: any[];
            messObjList = netData.GetJson();
            // console.log("messObj -----  ", messObj);
            // console.log("functionName -----", messObj.functionName);
            let len = messObjList.length;
            for (let i = 0; i < len; i++) {
                let messObj = messObjList[i];
                let res;
                switch (messObj.functionName) {
                    case "projectToken":
                        res = messObj.args[0];
                        ExportManager.setProjectToken(res);
                        break;
                    case "test":
                        res = messObj.args[0];
                        ExportManager.getPrefab2DByKey("116dade1704947959baff0c61df99770", null);
                        // console.error("111111111111111111111111111");
                        break;
                    case "openVSCode":
                        res = messObj.args[0];
                        console.log(res);
                        break;
                    case "login":
                        res = JSON.parse(messObj.args[0]);
                        //WebsocketTool.Instance.ProjectManager_openProject("test1");
                        // console.error("111111111111111111111111111", res);
                        //通知工程列表刷新
                        EditorEventMgr.Instance.emitEvent("ProjectListRefresh", cb => cb(res.projects));
                        break;
                    case "fileInfos":
                        res = JSON.parse(messObj.args[0]);
                        //console.log("刷新文件系统...");
                        //let fileInfo: EditorAssetInfo = res;
                        //console.log('fileInfo', fileInfo);
                        //console.error(res);
                        FileInfoManager.Instance.diguiDirPare(res);
                        FileInfoManager.Instance.setRoot(res);
                        EditorEventMgr.Instance.emitEvent("FileTreeUpDate", cb => cb([res]));
                        EditorEventMgr.Instance.emitEvent('WaitNetFileInfosUpdate', cb => cb());
                        // EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(res));
                        break;
                    case "OpenProject":
                        res = JSON.parse(messObj.args[0]);
                        // console.error(res);
                        FileInfoManager.Instance.diguiDirPare(res);
                        FileInfoManager.Instance.setRoot(res);
                        EditorEventMgr.Instance.emitEvent("FileTreeUpDate", cb => cb([res]));
                        // EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(res));
                        //编译代码文件
                        WebsocketTool.Instance.ProjectManager_watchProject();
                        break;
                    case "ClassSaveState":
                        console.error(messObj.args[0]);
                        break;
                    case "ClassCompileState":
                        //代码编译
                        let log: string = messObj.args[0];
                        if (log != "") {
                            //console.log("编译返回  ", log);
                            LogManager.Instance.upDateTextNodeFun(log);
                            //临时解决, 判断编译成功
                            if (log.indexOf("Found 0 errors") != -1) {
                                EditorEventMgr.Instance.emitEvent("OnTsCompileSuccess", cb => cb());
                            }
                        }
                        break;
                    case "CreateProject":
                        res = JSON.parse(messObj.args[0]);
                        // console.error(res);
                        if (res.res == 0) {
                            //创建工程成功 重新加一遍json
                            let userData = JSON.parse(res.obj);
                            // console.error(userData.projects);
                            //通知工程列表刷新
                            EditorEventMgr.Instance.emitEvent("ProjectListRefresh", cb => cb(userData.projects));
                        }
                        break;
                    case "CreateClassState":
                        res = JSON.parse(messObj.args[0]);
                        console.error(res);
                        if (res.res == 0) {
                            //创建成功
                        }
                        break;
                    case "DeleteClassState":
                        res = JSON.parse(messObj.args[0]);
                        console.error(res);
                        if (res.res == 0) {
                            //删除成功
                        }
                        break;
                    case "CreateFolderState":
                        res = JSON.parse(messObj.args[0]);
                        console.error(res);
                        if (res.res == 0) {
                            //创建文件夹成功

                        }
                        break;
                    case "DeleteFolderState":
                        res = JSON.parse(messObj.args[0]);
                        console.error(res);
                        if (res.res == 0) {
                            //删除文件夹成功  重新加一遍json
                        }
                        break;
                    case "NavFileResponse":
                        res = messObj.args[0];
                        EditorEventMgr.Instance.emitEvent("OnNavMeshFileResponse", cb => cb(res));
                        break;
                    default:
                        if (messObj.className == "Tip" && messObj.functionName == "Message") {
                            //
                            let messStr = messObj.args[0];
                            let messageObj = messStr;
                            // let context = messageObj.context;
                            let tipType = messageObj.tipType;
                        }
                }
            }
        }
        //console.log("json长度: " + netData.code.length + ", 整体用时(code)" + MapManager.Instance.GetIntervalTime());
    }

    private Close() {
        if (this._webscoket) {
            this._webscoket.close();
        }
    }

}