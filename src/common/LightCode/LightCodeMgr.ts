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
import { LightCodeData, LightCodePanel } from "./LightCodeData";


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

  // 实例列表
  public static List: Map<number, blockHandler> = new Map();

  // 虚线
  public static line: LineType = { x1: 0, y1: 0, x2: 0, y2: 0 }

  // 贝塞尔曲线列表
  public static bserList = [

  ]

  // 虚线透明度
  public static lineOpacity: number = 0

  // 添加实例
  public static add(data: blockHandler) {
    this.List.set(data.data.id, data);
  }

  // 移除所有数据
  public static removeAll() {
    this.List.clear();
  }

  // 数据格式
  public static addBlock(data: LightCodePanel) {
    //创建数据格式
    this.blockDatas.push(data);
    //通知react组件更新数据
    EditorEventMgr.Instance.emitEvent("OnCreateBlock", cb => cb(data));
  }

  // 修改虚线透明度
  public static changeOpacity(data: number) {
    this.lineOpacity = data;
    EditorEventMgr.Instance.emitEvent("OnChangeOpacity", cb => cb(data));
  }

  // 画虚线
  public static drawLine(data: LineType) {
    this.line = data;
    EditorEventMgr.Instance.emitEvent("OnDrawLine", cb => cb(data));
  }

  // 画曲线
  public static drawBser() {

  }

}
