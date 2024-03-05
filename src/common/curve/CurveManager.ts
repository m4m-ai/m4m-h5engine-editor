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
import { EditorEventMgr } from './../../Game/Event/EditorEventMgr'

export class CurveManager {
	//根据数据重置曲线
	public static reRenderCurve(data: any) {}
	//修改最高最低点
	public static resetMaxAndMin() {}
	//有节点变化 （位置， 添加， 删除）， 派发事件出来
	public static aaa() {
		let data = {}
		// EditorEventMgr.Instance.emitEvent("OnRefreshCurveData", cb => cb(data));
	}
}
