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
import { cMap } from "../code/Map";
import { Loader } from "./Loader";

export enum ResLoadType {
    NONE = 0,
    SCENE = 1,//Scene
}
export enum LoadType {
    ARRAYBUFFER = 0,
    JSON = 1,
    IMAGE = 2,//Scene
    Text = 3,//
}

//资源加载类  只允计有这一个加载类
export class LoaderManager {
    public static get Instance(): LoaderManager {
        if (this.instance == null) {
            this.instance = new LoaderManager();
        }
        return this.instance;
    }
    /** 项目资源 根路径 URL */
    public static get CDNURL() { return this._CDNURL; }

    public static loaderCount = 10;

    //所有下载资源列表
    public loaders: cMap<Loader> = new cMap<Loader>();

    /// <summary>
    /// 正在加载中的loader列表
    /// </summary>
    public currentLoaders: Loader[] = new Array<Loader>();

    /// <summary>
    /// 所有等待加载的Loader列表
    /// </summary>
    public waitLoaders: Loader[] = new Array<Loader>();
    constructor() {
        this.loadFailBackList = new Array<Loader>();
        // //每间隔 1200 毫秒取一次 加入重试load
        // CTimer.Instance.loopTimeUpdate(1200, this.failBackFun.bind(this));
    }

    private static instance: LoaderManager;
    private static _CDNURL: string = "";

    /// <summary>
    /// 只要产生加载文件即生成一个id;
    /// </summary>
    private index: number = 0;
    private loadFailBackList: Loader[];
    public init(CDNURL: string) {
        LoaderManager._CDNURL = CDNURL;
    }

    /*
     *  priority 优先级,数值越高越优先
     */
    public load(url: string, onLoadFinished: Function, loadType: LoadType = LoadType.Text, priority: number = 0): Loader {
        let loader: Loader;
        if (this.loaders.has(url)) {
            loader = this.loaders.get(url);
            if (loader.bin) {
                onLoadFinished(loader, loader.bin);
            } else {
                loader.addCallBack(onLoadFinished);
            }
        } else {
            loader = new Loader();
            loader.priority = priority;
            loader.loaderType = loadType;
            this.loaders.set(url, loader);
            loader.url = url;
            loader.addCallBack(onLoadFinished);
            this.addLoader(loader);
        }
        return loader;
    }

    public startLoader(): void {
        if (this.waitLoaders.length == 0 || LoaderManager.loaderCount <= this.currentLoaders.length) { return; }
        let nextLoader: Loader = this.getNextLoader();

        if (nextLoader != null) {
            ///从等待加载的列表中移除,添加到当前加载列表中
            let index: number = this.waitLoaders.indexOf(nextLoader);
            if (index != -1) {
                this.waitLoaders.splice(index, 1);
            }
            //Debug.LogError("加入加载列表中");
            this.currentLoaders.push(nextLoader);
            nextLoader.load();
            ///判断下同时加载的数量是否达到默认设置的数量如果没有则继续开始新的加载
            if (this.currentLoaders.length <= LoaderManager.loaderCount) {
                this.startLoader();
            }
        }
    }

    public loaderEnd(loader: Loader): void {
        let index: number = this.currentLoaders.indexOf(loader);
        if (index != -1) {
            this.currentLoaders.splice(index, 1);
        }
        this.startLoader();
    }

    /// <summary>
    /// 添加loader
    /// </summary>
    /// <param name="loader"></param>
    public addLoader(loader: Loader): void {
        this.index++;
        loader.id = this.index;
        loader.loadEndFunction = this.loaderEnd.bind(this);
        this.waitLoaders.push(loader);
        this.startLoader();
    }

    /// <summary>
    /// 删除loader
    /// </summary>
    public removeLoader(url: string): void {
        if (!this.loaders.has(url)) { return; }

        let loader: Loader = this.loaders.get(url);

        let index: number = this.waitLoaders.indexOf(loader);
        if (index != -1) {
            this.waitLoaders.splice(index, 1);
        }

        index = this.currentLoaders.indexOf(loader);
        if (index != -1) {
            this.currentLoaders.splice(index, 1);
        }

        this.loaders.delete(url);
        loader.dispose();
    }

    //加入失败列表
    public addFail(loader: Loader): void {
        let index: number = this.loadFailBackList.indexOf(loader);
        console.error("重新加载     " + loader.url);
        if (index == -1) {
            this.loadFailBackList.push(loader);
        }
    }

    /// <summary>
    /// 获取下一个需要加载的loader,根据需要加载的优先级进行排序
    /// </summary>
    private getNextLoader(): Loader {
        let loader: Loader = this.waitLoaders[0];
        let temp: Loader;
        for (let i: number = 0; i < this.waitLoaders.length; i++) {
            temp = this.waitLoaders[i];
            if (temp.priority > loader.priority) { loader = temp; }
        }
        return loader;
    }

    //失败重试
    private failBackFun() {
        if (this.loadFailBackList.length > 0) {
            let loader: Loader = this.loadFailBackList.shift();
            loader.load();
            console.error(loader.url + " LoaderManage  下载失败  重新 下载");
        }
    }
}
