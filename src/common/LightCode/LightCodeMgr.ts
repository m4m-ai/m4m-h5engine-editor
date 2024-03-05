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

import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { LightCodeData, LightCodePanel, ResolvedLink, ResolvedNode } from "./LightCodeData";


// 实例类型
export type blockHandler = {
  // 数据
  data: LightCodePanel;
  setInAttriVal: Function;
}

// 虚线坐标
export type LineType = {
  x1: number, y1: number, x2: number, y2: number
}

// 贝塞尔曲线类型
export type BserType = {
  id: number;
  path: string;
  stroke: string;
}

export class LightCodeMgr {
  // 数据格式列表
  public static blockDatas: LightCodeData = [];

  public static linkList: ResolvedLink[] = [];

  // 实例列表
  public static List: Map<string, blockHandler> = new Map();

  // 虚线
  public static line: LineType = { x1: 0, y1: 0, x2: 0, y2: 0 }

  // 贝塞尔曲线列表
  public static bserList = [];

  // 虚线透明度
  public static lineOpacity: number = 0
  public static lineBool = true;

  private static _boRef

  static get boRef(): string {
    return this._boRef;
  }

  static set boRef(value: string) {
    this._boRef = value;
  }
  // 添加实例
  public static add(data: blockHandler) {
    if (!this.List.has(data.data.id)) {
      this.List.set(data.data.id, data);
    }
  }

  // 移除所有数据
  public static removeAll() {
    this.List.clear();
  }

  public static removeID(id: string) {
    this.List.delete(id);
    let block = this.blockDatas.findIndex(v => v.id = id);
    if (block != -1) {
      this.blockDatas.splice(block, 1)
    }
    EditorEventMgr.Instance.emitEvent("OnCreateBlock", cb => cb(null));
  }

  // 数据格式
  public static addBlock(data: LightCodePanel) {
    //创建数据格式
    this.blockDatas.push(data);
    // console.error(this.blockDatas);
    //通知react组件更新数据
    EditorEventMgr.Instance.emitEvent("OnCreateBlock", cb => cb(data));
  }

  public static updateBlock(id, { x, y }) {
    let block = this.blockDatas.find(v => v.id == id);
    if (block) {
      block.position.x = x;
      block.position.y = y;
    }
  }

  public static getBlockData(id: string) {
    let data = this.blockDatas.find(v => v.id == id);
    if (data) {
      return data;
    }
    return null;
  }

  // 画虚线
  public static drawLine(divline: HTMLDivElement, data: LineType, id: string, panel: React.MutableRefObject<HTMLDivElement>, boRef, linkBool: boolean = false) {
    this.line = data;
    EditorEventMgr.Instance.emitEvent("OnDrawLine", cb => cb(data));
    if (linkBool) {
      let element = document.getElementsByClassName("lightCode");
      let panelRect = panel.current.getBoundingClientRect();
      LightCodeMgr.linkLine(divline, element, id, panelRect, data, boRef);
      EditorEventMgr.Instance.emitEvent("LinkUpdateLocation", cb => cb(this.linkList));
    }
  }


  private static linkLine(divline: HTMLDivElement, element: HTMLCollectionOf<Element>, id: string, panelRect: DOMRect, data: LineType, boRef) {
    let link: ResolvedLink = {
      id: "",
      source: undefined,
      target: undefined
    };
    let sourceNode: ResolvedNode = {
      id: "",
      attrID: "",
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    let targetNode: ResolvedNode = {
      id: "",
      attrID: "",
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    let linkList = this.linkList.filter(v => v.source.id == divline["dataset"].id && v.target.id == divline["dataset"].id)
    if (linkList.length > 0) {
      return;
    }

    for (let index = 0; index < element.length; index++) {
      const item = element[index];
      const itemDatasetId = item['dataset'].id.toString();
      const itemChildren = item.children;

      let rect = divline.getBoundingClientRect();
      if (itemDatasetId == id.toString()) {
        let left = (rect.left - panelRect.left);
        let top = (rect.top - panelRect.top);
        sourceNode = {
          id: id.toString(),
          attrID: divline["dataset"].id,
          x: left,
          y: top,
          width: rect.width,
          height: rect.height
        };
        link = {
          id: Math.floor(Math.random() * 10000000).toString(),
          source: sourceNode,
          target: targetNode
        };
        if (link.target.id && link.source.id) {
          this.linkList.push(link);
          return;
        }
      } else {
        for (let childIndex = 0; childIndex < itemChildren.length; childIndex++) {
          const child = itemChildren[childIndex];
          for (let index = 0; index < child.children.length; index++) {
            const elementBotChildren = child.children[index];
            for (let botIndex = 0; botIndex < elementBotChildren.children.length; botIndex++) {
              const divbotchil = elementBotChildren.children[botIndex].children;
              for (let index = 0; index < divbotchil.length; index++) {
                const div = divbotchil[index];

                if (div.className.indexOf("dot") != -1) {
                  let rect = elementBotChildren.getBoundingClientRect();
                  let left = rect.left - panelRect.left;
                  let top = rect.top - panelRect.top;

                  if (boRef.target["dataset"].id == div["dataset"].id) {
                    targetNode = {
                      id: itemDatasetId,
                      attrID: boRef.target["dataset"].id,
                      x: left,
                      y: top,
                      width: rect.width,
                      height: rect.height
                    };
                  }
                  link = {
                    id: Math.floor(Math.random() * 10000000).toString(),
                    source: sourceNode,
                    target: targetNode
                  };
                  if (link.target.id && link.source.id) {
                    this.linkList.push(link);
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  public static delectLine(isLine: boolean) {
    EditorEventMgr.Instance.emitEvent("OnDrawIsLine", cd => cd(isLine));
  }

  //更新链接线的位置
  public static updateLine(data: LineType, id: string, attrID: string) {
    let bool = false;
    let source: ResolvedLink[] = this.linkList.filter(d => d.source.id == id && d.source.attrID == attrID);
    for (let index = 0; index < source.length; index++) {
      const element = source[index];
      element.source.x = data.x2;
      element.source.y = data.y2;
      bool = true;
    }
    let target = this.linkList.filter(d => d.target.id == id && d.target.attrID == attrID);
    for (let index = 0; index < target.length; index++) {
      const element = target[index];
      element.target.x = data.x2;
      element.target.y = data.y2;
      bool = true;
    }
    if (bool) {
      EditorEventMgr.Instance.emitEvent("LinkUpdateLocation", cb => cb(this.linkList))
    }
  }

  public static unlink(id: string) {
    let index = this.linkList.findIndex(d => d.id == id);
    if (index != -1) {
      this.linkList.splice(index, 1);
    }
    EditorEventMgr.Instance.emitEvent("LinkUpdateLocation", cb => cb(this.linkList));
  }

  public static removeIDs(id: string) {
    let sourceList = this.linkList.filter(d => d.source.id == id);
    if (sourceList.length > 0) {
      for (let index = 0; index < sourceList.length; index++) {
        const element = sourceList[index];
        let indexlink = this.linkList.findIndex(d => d.id == element.id);
        if (indexlink != -1) {
          this.linkList.splice(index, 1);
        }
      }
    }
    let targetList = this.linkList.filter(d => d.target.id == id);
    if (targetList.length > 0) {
      for (let index = 0; index < targetList.length; index++) {
        const element = targetList[index];
        let indexlink = this.linkList.findIndex(d => d.id == element.id);
        if (indexlink != -1) {
          this.linkList.splice(index, 1);
        }
      }
    }
    EditorEventMgr.Instance.emitEvent("LinkUpdateLocation", cb => cb(this.linkList));
  }
}
