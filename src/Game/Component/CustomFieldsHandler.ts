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
import { Utils } from "../Utils";
import { ComponentFieldEnum } from "./ComponentFieldEnum";
import { IComponentInfo } from "./EditorComponentMgr";

/**
 * 处理组件自定义字段
 * @param typeName 组件类名
 * @param fields 
 */
export function CustomFieldsHandler(typeName: string, fields: IComponentInfo["fields"]) {
    if (typeName === Utils.nameof(m4m.framework.image2D)) {
        fields.push({
            name: "sprite",
            title: "Sprite",
            isArray: false,
            type: ComponentFieldEnum.sprite,
            defaultValue: null,
            isRef: false
        })
        fields.push({
            name: "color",
            title: "Color",
            isArray: false,
            type: ComponentFieldEnum.color,
            defaultValue: null,
            isRef: false
        })
    } else if (typeName === Utils.nameof(m4m.framework.label)) {
        fields.push({
            name: "color",
            title: "Color",
            isArray: false,
            type: ComponentFieldEnum.color,
            defaultValue: null,
            isRef: false
        })
        fields.push({
            name: "color2",
            title: "Color2",
            isArray: false,
            type: ComponentFieldEnum.color,
            defaultValue: null,
            isRef: false
        })
    } else if (typeName === Utils.nameof(m4m.framework.rawImage2D)) {
        fields.push({
            name: "color",
            title: "Color",
            isArray: false,
            type: ComponentFieldEnum.color,
            defaultValue: null,
            isRef: false
        })
    }
}