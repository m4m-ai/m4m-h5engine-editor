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
import { number } from "echarts/core";
import { EditorAssetInfo } from "./EditorAssetInfo";

//文件多选处理
export class MultipleSelectionFileManager {
    public static get Instance(): MultipleSelectionFileManager {
        if (this._inst == null) {
            this._inst = new MultipleSelectionFileManager();
        }
        return this._inst;
    }
    private static _inst: MultipleSelectionFileManager;

    public selectIndex: number = -1;
    private _nowSelectList: EditorAssetInfo[];
    public upDateSelectAssetInfo(e: EditorAssetInfo, assetInfoList: EditorAssetInfo[]) {
        // console.log("整个文件列表");
        // console.warn(assetInfoList);
        // //当前选中的所引
        let nowSelectIndex = assetInfoList.indexOf(e);
        this.selectIndex = nowSelectIndex;
        // console.log("更新当前选中文件所引 " + this.selectIndex);
        // console.error(e);

    }

    //当shift键按下时
    public onShiftKeyDownSelect(selectAsset: EditorAssetInfo, assetInfoList: EditorAssetInfo[], callBackFun: Function) {
        let nowSelectIndex = assetInfoList.indexOf(selectAsset);
        // console.log("原所引 " + this.selectIndex + " 当前选中所引 " + nowSelectIndex);
        // console.warn(assetInfoList);
        // console.error(selectAsset);

        let nowSelectList: EditorAssetInfo[];
        if (nowSelectIndex == this.selectIndex) {
            if (this._nowSelectList.includes(selectAsset)) {
                // console.error("选中的就是原已选中文件");
                this._nowSelectList = [selectAsset];
                if (this._nowSelectList) {
                    callBackFun(this._nowSelectList);
                }
                return;
            }
        }

        if (nowSelectIndex > this.selectIndex) {
            nowSelectList = assetInfoList.slice(this.selectIndex, nowSelectIndex + 1);
        } else {
            nowSelectList = assetInfoList.slice(nowSelectIndex, this.selectIndex + 1);
        }
        if (this._nowSelectList) {
            let orgList;
            //如果在原选中列表中
            if (this._nowSelectList.includes(selectAsset)) {
                orgList = this._nowSelectList;

                this._nowSelectList = nowSelectList;
            } else {
                for (let i = 0; i < nowSelectList.length; i++) {
                    let element = nowSelectList[i];
                    if (this._nowSelectList.includes(element) == false) {
                        this._nowSelectList.push(element);
                    }
                }
                orgList = this._nowSelectList;
            }
            let min: number = -1;
            let max: number = -1;
            for (let i = 0; i < orgList.length; i++) {
                let infoData = orgList[i];
                let index = assetInfoList.indexOf(infoData);
                if (min == -1 || index < min) {
                    min = index;
                }
                if (max == -1 || index > max) {
                    max = index;
                    // console.error(index);
                }
            }
            // console.error("_nowSelectList " + this._nowSelectList.length + "  ??  " + min + "   " + max);

            //是否连续
            let isContinuous: boolean = true;
            for (let i = min; i < max + 1; i++) {
                let element = assetInfoList[i];
                if (this._nowSelectList.includes(element) == false) {
                    isContinuous = false;
                    break;
                }
            }
            //如果不连续 另处理
            if (isContinuous == false) {
                // console.error("如果不连续 另处理 " + min + "   " + max);
                if (nowSelectIndex > this.selectIndex) {
                    //往后
                    this._nowSelectList = assetInfoList.slice(min, nowSelectIndex + 1);
                } else {
                    //往前
                    this._nowSelectList = assetInfoList.slice(nowSelectIndex, max + 1);
                }
            }
        } else {
            this._nowSelectList = nowSelectList;
        }
        // console.error(this._nowSelectList);

        if (this._nowSelectList) {
            callBackFun(this._nowSelectList);
        }
    }

    //当Ctrl键按下时
    public onCtrlKeyDownSelect(selectAsset: EditorAssetInfo, assetInfoList: EditorAssetInfo[], callBackFun: Function) {
        let nowSelectIndex = assetInfoList.indexOf(selectAsset);
        // console.log("原所引 " + this.selectIndex + " 当前选中所引 " + nowSelectIndex);

        if (this._nowSelectList) {
            //如果在原选中列表中
            let index = this._nowSelectList.indexOf(selectAsset);
            if (index != -1) {
                this._nowSelectList.splice(index, 1);
            } else {
                this._nowSelectList.push(selectAsset);
            }
        } else {
            this._nowSelectList = [];
            let lastAsset = assetInfoList[this.selectIndex];
            this._nowSelectList.push(lastAsset);
            this._nowSelectList.push(selectAsset);
        }
        // console.error(this._nowSelectList);

        if (this._nowSelectList) {
            callBackFun(this._nowSelectList);
        }

    }

    public clear() {
        if (this._nowSelectList) {
            this._nowSelectList.length = 0;
            this._nowSelectList = null;
        }
    }
}