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

//--------------- 改同步函数 ----------------------

import {FileData} from "./FileData";
import {EditorApplication} from "../EditorApplication";
import {ExportManager} from "./ExportManager";
import {EditorEventMgr} from "../Event/EditorEventMgr";

//读取文件
async function readFile(fileEntry: FileSystemFileEntry): Promise<FileData> {
    return new Promise((resolve, reject) => {
        fileEntry.file((file) => {
            let selection = EditorApplication.Instance.selection;
            let folder = selection.activeFolderPath;
            let path = folder + fileEntry.fullPath.substring(1).replaceAll("\\", "/");
            file.arrayBuffer()
                .then(buffer => {
                    resolve(
                        {
                            path,
                            buffer: new Uint8Array(buffer)
                        }
                    );
                }).catch(reason => {
                reject("文件读取失败: " + reason);
            });
        }, e => {
            reject("文件读取失败: " + e);
        });
    });
}

//读取文件夹
async function readDir(dirEntry: FileSystemDirectoryEntry): Promise<FileData[]> {
    return new Promise((resolve, reject) => {
        let reader = dirEntry.createReader();
        reader.readEntries(async (entries: FileSystemEntry[]) => {
            let fileList: FileData[] = [];
            for (let entry of entries) {
                if (entry.isFile) {
                    fileList.push(await readFile(entry as FileSystemFileEntry));
                } else if (entry.isDirectory) {
                    fileList = fileList.concat(await readDir(entry as FileSystemDirectoryEntry))
                }
            }
            resolve(fileList);
        }, e => {
            reject("文件夹读取失败: " + e);
        });
    });
}

//------------------------------------------------

/**
 * 拖拽事件回调
 */
export async function DropFileCallBack(e: DragEvent) {
    let files = e.dataTransfer.items;
    if (files) {
        let fileList: FileData[] = [];

        //寻找所有文件
        for (let i = 0; i < files.length; i++) {
            let item = files[i];
            if (item.kind === "file") {
                let entry = item.webkitGetAsEntry();

                if (entry.isFile) {
                    fileList.push(await readFile(entry as FileSystemFileEntry));
                } else if (entry.isDirectory) {
                    fileList = fileList.concat(await readDir(entry as FileSystemDirectoryEntry));
                }
            }
        }
        
        if (fileList.length == 0) {
            return;
        }

        console.log("文件读取完成! :", fileList);
        EditorEventMgr.Instance.emitEvent("OnDropFileUpload", cb => cb(fileList));

        let result = {
            successCount: 0,
            failCount: 0,
        }

        //上传操作
        ExportManager.uploadFiles(fileList, async (response, index) => {
            if (response.status != 200) {
                result.failCount++;
                response.text().then(value => {
                    console.error("文件上传发生错误!", value);
                })
            } else {
                result.successCount++;
                response.text().then(value => {
                    console.log("上传成功: " + fileList[index].path + " key:", value);
                })
                
            }
        }, () => {
            console.log(`所有文件上传完成, 成功: ${result.successCount}, 失败: ${result.failCount}`);
            EditorEventMgr.Instance.emitEvent("OnDropFileUploadFinish", cb => cb(fileList, result.successCount, result.failCount));
        });
    }
}