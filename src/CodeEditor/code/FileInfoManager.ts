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
import { cMap } from "./Map";
import {EditorAssetInfo} from "../../Game/Asset/EditorAssetInfo";
import {EditorApplication} from "../../Game/EditorApplication";

export class FileInfoManager {
    public static get Instance(): FileInfoManager {
        if (this._instance == null) {
            this._instance = new FileInfoManager();
        }

        return this._instance;
    }
    /**********是否需要请求 配置数据***********
    */
    private static _instance: FileInfoManager;

    /**
     * 文件夹根节点
     */
    public get rootFolder() {
        return this._rootFolder;
    }
    
    private fileMap: cMap<EditorAssetInfo> = new cMap();
    private dirMap: cMap<EditorAssetInfo> = new cMap();
    private keyPathMap: cMap<string> = new cMap();
    private _rootFolder: EditorAssetInfo;
    public getKeyByPath(path: string){
        return this.keyPathMap.get(path);
    }
    public getFileByPath(path: string){
        return this.getFileByKey(this.getKeyByPath(path));
    }
    public getFileByKey(key: string) {
        return this.fileMap.get(key);
    }
    public getDirByKey(key: string) {
        return this.dirMap.get(key);
    }
    public getDirByPath(path: string) {
        return this.getDirByKey(this.keyPathMap.get(path));
    }
    public diguiDirPare(res: EditorAssetInfo, isInit = true) {
        if (isInit) {
            this.fileMap.clear();
            this.dirMap.clear();
            this.keyPathMap.clear();
            this.dirMap.set(res.key, res)
            this.keyPathMap.set(res.relativePath, res.key)
        }
        let childList:any[]=[];
        let childFileList:any[]=[];
        
        if (res.children) {
            for (const key in res.children) {
                var child = res.children[key];
                let k = child.key;
                child.parentDirInfo = res;
                // if (child.DirType != "") {
                //     this.diguiDirPare(child, false);
                //     childFileList.push(child)
                //     this.dirMap.set(k, child);
                //     continue;
                // }
                this.diguiDirPare(child, false);
                childList.push(child);
                this.dirMap.set(k, child);
                this.keyPathMap.set(child.relativePath, k)
            }
        }
        res.children=childList;
        if (res.childrenFile) {
            for (const key in res.childrenFile) {
                var child = res.childrenFile[key];
                let k = child.key;
                childFileList.push(child);
                child.parentDirInfo = res;
                // console.error("当前已创建的文件 "+child.relativePath,child.isLeaf);
                // this.diguiDirPare(child, false);
                this.fileMap.set(k, child);
                this.keyPathMap.set(child.relativePath, k)
            }
        }
        res.childrenFile=childFileList; 
    }
    public setRoot(root: EditorAssetInfo) {
        this._rootFolder = root;
        let selection = EditorApplication.Instance.selection;
        if (selection.activeFolderInfo == null) {
            selection.setActiveAsset(root);
        }
    }
}