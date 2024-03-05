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
import { NumberInputDataType } from "../../../common/attribute/attr/NumberInputAttr";
import { IAttrComponent, IAttributeData } from "../../../common/attribute/Attribute";
import { EditorApplication } from "../../EditorApplication";
import { ValueType } from "../../ValueType";
import { ComponentFieldHandler, ComponentInstance } from "../ComponentFieldHandler";
import { IComponentFieldInfo } from "../EditorComponentMgr";

export class NumberFiled extends ComponentFieldHandler<IAttrComponent<NumberInputDataType>> {

    public render(component: ComponentInstance, fieldInfo: IComponentFieldInfo): IAttributeData<IAttrComponent<NumberInputDataType>>[] {
        
        let refreshFunc: React.Dispatch<React.SetStateAction<NumberInputDataType>> = null;
        let setValue = EditorApplication.Instance.selection.addPropertyListener(component as any, fieldInfo.name, ValueType.number, (value: number) => {
            if (refreshFunc) {
                refreshFunc((oldValue) => {
                    return {
                        max: oldValue.max,
                        min: oldValue.min,
                        step: oldValue.step,
                        value
                    }
                });
            }
        });

        return [
            {
                type: "number",
                title: fieldInfo.title,
                attr: {
                    attrValue: {
                        value: component[fieldInfo.name]
                    },
                    fieldInfo,
                    onChange(value) {
                        setValue(value.value);
                        if (component instanceof m4m.framework.transform2D) {
                            component.markDirty();
                        }
                    },
                    setRefresh(func) {
                        refreshFunc = func;
                    }
                }
            }
        ]
    }
}