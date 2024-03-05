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
import { LoaderManager, LoadType } from "./LoaderManager";

export class Loader {
    public id: number;

    public loaderEvents: CallBackData[];
    /// <summary>
    /// 加载路径
    /// </summary>
    public url: string;

    /// <summary>
    /// 优先级,数值越高越优先
    /// </summary>
    public priority: number = 0;

    /// <summary>
    /// 加载失败的重试次数
    /// </summary>
    /// <returns></returns>
    public timeoutCount: number = 3;

    /// <summary>
    /// 加载失败的重试次数
    /// </summary>
    /// <returns></returns>
    public timeout: number = 3;
    /// <summary>
    /// 资源的引用次数
    /// </summary>
    public userCount: number = 0;

    /// <summary>
    /// 加载进度
    /// </summary>
    /// <returns></returns>
    public progress: number = 0;

    ///已经加载的字节大小
    public bytesLoaded: number = 0;
    //总需求加载大小
    public bytesTotal: number = 0;
    //总需要加载的文件数量
    public fileCount: number = 0;
    //当前已经加载文件数量
    public fileLoadedCount: number = 0;
    public loaderType = LoadType.ARRAYBUFFER;
    public bin: any;

    //加载结束 不管成功失败都回调
    public loadEndFunction: Function;
    public constructor() {
        this.loaderEvents = new Array<CallBackData>();
    }

    public load() {
        if (this.bin) {
            this.completeCallBack();
            return;
        }
        let responseType: XMLHttpRequestResponseType = "text";
        switch (this.loaderType) {
            case LoadType.ARRAYBUFFER:
                responseType = "arraybuffer";
                break;
            case LoadType.JSON:
                responseType = "json";
                break;
        }
        let url = this.url;
        // console.error("++++++++++++++++++++++++++++++++++++  "+url)
        let req = new XMLHttpRequest();
        let isLoaded = false;
        req.open("GET", url);
        req.responseType = responseType;
        req.onreadystatechange = () => {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    isLoaded = true;
                    this.downLoadFinish(req);
                } else {
                    // tslint:disable-next-line: switch-default
                    switch (req.status) {
                        case 404:
                            console.error("got a 404:" + url);
                            break;
                    }
                }
            }
        };
        req.onprogress = (ev) => {
            // console.log(ev.loaded, ev.total);
        };
        req.onerror = (ev) => {
            console.error(`URL : ${url} \n onerr on req: `);
        };
        req.onloadend = () => {
            //console.error(" is onload");
            if (!isLoaded) {
                this.loadFail();
            }
        };
        req.send();
    }

    public dispose() {
        for (let i = 0; i < this.loaderEvents.length; i++) {
            let data: CallBackData = this.loaderEvents[i];
            data.dispose();
            data = null;
        }
        this.loaderEvents.length = 0;
        this.loaderEvents = null;
        this.bin = null;
        this.loadEndFunction = null;
    }
    public addCallBack(callBack: Function) {
        let cb: CallBackData = new CallBackData();
        cb.callback = callBack;
        this.loaderEvents.push(cb);
    }

    private downLoadFinish(res: XMLHttpRequest) {
        //下载完成回调
        if (this.loadEndFunction) { this.loadEndFunction(this); }
        switch (this.loaderType) {
            case LoadType.Text:
                this.bin =res.responseText;
                break;
            case LoadType.ARRAYBUFFER:
            case LoadType.JSON:
                this.bin =res.response;
                break;
        }
        this.completeCallBack();
    }
    private loadFail() {
        if (this.loadEndFunction) { this.loadEndFunction(this); }
        //加载失败
        LoaderManager.Instance.addFail(this);
    }

    //完成时回调
    private completeCallBack(): void {
        for (let i = 0; i < this.loaderEvents.length; i++) {
            let cbd: CallBackData = this.loaderEvents[i];
            if (cbd.callback != null) {
                cbd.callback(this, this.bin);
            }
            cbd.dispose();
            cbd = null;
        }
        this.loaderEvents.length = 0;
    }
}

class CallBackData {
    public callback: Function;
    public dispose() {
        this.callback = null;
    }
}