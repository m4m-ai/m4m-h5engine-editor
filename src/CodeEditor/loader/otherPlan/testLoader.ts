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
import { Loader } from "./Loader";
import { LoaderManage } from "./LoaderManage";

enum LoadType {
    ARRAYBUFFER = 0,
    JSON = 1,
    IMAGE = 2,//Scene
}
// tslint:disable-next-line: class-name
export class testLoader {
    //总需要加载的文件数量
    public fileCount: number = 0;
    //当前已经加载文件数量
    public fileLoadedCount: number = 0;
    //加载文件完成的进度
    public sucessProgress: number = 0;
    //总进度
    public progress: number = 0;

    private list: Loader[] = new Array<Loader>();
    private loadedFile = [];
    private loadCallBack: Function;
    private progressCallback: Function;
    public add(url: string, callback: Function, type: LoadType = LoadType.ARRAYBUFFER) {

        let loader: Loader = LoaderManage.Instance.load(url, callback, url, type);
        this.list.push(loader);
        this.fileCount++;

        return;
    }
    public loaderEnd(loader: Loader, file: any): void {

        if (file) {
        this.fileLoadedCount++;
        this.sucessProgress = this.fileLoadedCount / this.fileCount;

        this.loadedFile.push(file);
        if (this.loadCallBack && this.fileLoadedCount >= this.fileCount) {
                this.loadCallBack(this.loadedFile);
                this.list.length = 0;
            }
        }

    }
    public start(callback: Function = null): void {
        this.loadCallBack = callback;
        // this.list.forEach((loader) => {
        //     loader.endFunction = this.loaderEnd.bind(this);
        //     loader.load();
        //     this.progressCallback = this.LoadProgress.bind(this);
        //     loader.addProgressCallBack(this.progressCallback)
        // })
        if (this.fileCount <= 0) {
            callback(null);
            return;
        }
        for (let i: number = 0; i < this.list.length; i++) {
            let loader: Loader = this.list[i];
            loader.endFunction = this.loaderEnd.bind(this);
            loader.load();
            this.progressCallback = this.LoadProgress.bind(this);
            loader.addProgressCallBack(this.progressCallback);
        }
    }
    public LoadProgress(progress: number, fileLoadedCount: number, fileCount: number, bytesLoaded: number, bytesTotal: number) {
        //总进度
        this.progress = bytesLoaded / bytesTotal / this.fileCount + this.sucessProgress;
    }

}