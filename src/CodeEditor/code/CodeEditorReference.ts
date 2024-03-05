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
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr';
import { NetWebscoket } from './NetWebsocket';
import { WebsocketTool } from './WebsocketTool';
import {EditorApplication} from "../../Game/EditorApplication";
export class CodeEditorReference {

  private static isConnected=false;
  public static connectWebSocket() {
    if(this.isConnected)return;
    this.isConnected=true;
    this.initEvents();
    //连接服务器
    NetWebscoket.Instance.connect(EditorApplication.wsServerUrl);
  }
  public static initEvents() {
    let selectbind = EditorEventMgr.Instance.addEventListener("OnSelectFile", (str) => {
      // console.error(str);
      WebsocketTool.Instance.ProjectManager_selectFileFun(str.relativePath);
    });
    let savebind = EditorEventMgr.Instance.addEventListener("OnSave", (str) => {
      console.error(str);
      WebsocketTool.Instance.ProjectManager_saveSelectClassFun("OnSave");
    });
  }
  public static loadProjectConfig() {

    // const list2: any = [
    //     {
    //       id: 1,
    //       value: 'Favorites1',
    //       parentId: 0,
    //       key: '0',
    //       defaultValue: 'Favorites2' //默认value值
    //     },
    //     {
    //       id: 2,
    //       value: 'All Materials',
    //       parentId: 1,
    //       key: '0-1',
    //       defaultValue: 'All Materials'
    //     },
    //     {
    //       id: 3,
    //       value: 'All Models',
    //       parentId: 1,
    //       key: '0-2',
    //       defaultValue: 'All Models'
    //     },
    //     {
    //       id: 4,
    //       value: 'All Prefabs',
    //       parentId: 1,
    //       key: '0-3',
    //       defaultValue: 'All Prefabs'
    //     },
    //     {
    //       id: 5,
    //       value: 'Assets',
    //       parentId: 0,
    //       key: '1',
    //       defaultValue: 'Assets'
    //     },
    //     {
    //       id: 6,
    //       value: 'Packages',
    //       parentId: 0,
    //       key: '2',
    //       defaultValue: 'Packages'
    //     },
    //     {
    //       id: 7,
    //       value: 'Code Coverage',
    //       parentId: 6,
    //       key: '2-1',
    //       defaultValue: 'Code Coverage'
    //     },
    //     {
    //       id: 8,
    //       value: 'Editor',
    //       parentId: 7,
    //       key: '2-1-1',
    //       defaultValue: 'Editor'
    //     },
    //     {
    //       id: 9,
    //       value: 'lib',
    //       parentId: 7,
    //       key: '2-1-2',
    //       defaultValue: 'lib'
    //     }
    //   ]


    // //   id: 1, //唯一ID
    // //   value: 'Favorites1',//文件名
    // //   parentId: 0, 对应上面的唯一id  如果指定了id 就会成为对应id的子文件
    // //   key: '0',//目录的层级和顺序
    // //   defaultValue: 'Favorites2' //默认value值

    // //servertemplate\GameServer\Res
    // // let url = "./project.json";
    // // LoaderManager.Instance.removeLoader(url);
    // // LoaderManager.Instance.load(url, (loader: Loader, res: any) => {
    // //     console.error("加载完成!" + url);
    // //     console.log(res);

    // //     let proDescriptionDic = res.proDescriptionDic;
    // //     // setTimeout(() => {
    // //         let Arr:any[]=[];
    // //         let pathDic: cMap<any> = new cMap();
    // //         let index=0;
    // //         for (var tsProKey in proDescriptionDic) {
    // //             let tsUrls: any = proDescriptionDic[tsProKey];
    // //             for (var key in tsUrls) {
    // //                 // if (key.indexOf(".json") != -1) {

    // //                 // } else {

    // //                 // }
    // //                 let proPath = tsProKey + key;
    // //                 console.error(proPath);
    // //                 let strArr=proPath.split("/");
    // //                 let pathStr="";
    // //                 let parentObj;
    // //                 for(let i=0;i< strArr.length;i++)
    // //                 {
    // //                     let isLeaf=false;
    // //                     if(i==strArr.length-1)
    // //                     {
    // //                         isLeaf=true;
    // //                     }
    // //                     let str=strArr[i];
    // //                     pathStr+=str;
    // //                     let a;
    // //                     if(!pathDic.has(pathStr))
    // //                     {
    // //                         index++;
    // //                         let parentID=0;
    // //                         if(parentObj)
    //                         {
    //                             parentID=parentObj.id;
    //                         }
    //                         a={
    //                             id: index,
    //                             value: str,
    //                             parentId: parentID,
    //                             key: pathStr,
    //                             children:[],
    //                             isLeaf: isLeaf,
    //                             defaultValue: str //默认value值
    //                         }
    //                         if(parentObj)
    //                         {
    //                             parentObj.children.push(a);
    //                         }
    //                         Arr.push(a);
    //                         pathDic.set(pathStr,a);
    //                     }else
    //                     {
    //                         a=pathDic.get(pathStr);
    //                     }
    //                     pathStr+="/";
    //                     parentObj=a;
    //                 }
    //             }
    //         }

    //         console.error(Arr);
    //         EditorEventMgr.Instance.emitEvent("OnTest", cb => cb(Arr));
    //     // }, 3000);
    // }, LoadType.JSON);
    // EditorEventMgr.Instance.emitEvent("OnTest", cb => cb(Arr));
  }
}