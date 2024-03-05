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
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;
import {EditorApplication} from "../EditorApplication";
import {EditorSceneViewType} from "../Scene/EditorScene";
import {EditorObjectTags} from "../EditorObjectTags";
import overlay2D = m4m.framework.overlay2D;

export interface IHierarchyData {
    id: number;
    transfrom: transform | transform2D;
    title: string;
    visible: boolean;
    children?: IHierarchyData[];
}


export class HierarchyMgr {

    /**
     * 扫描场景树, 并返回数据
     */
    public static getTreeData(): IHierarchyData[] {
        let editorScene = EditorApplication.Instance.editorScene;
        let trans: transform = editorScene.getCurrentRoot();
        return this.eachTrans(trans.children);
    }

    //遍历 trans, 并返回 Hierarchy 需要的数据
    private static eachTrans(transList: (transform | transform2D)[]): IHierarchyData[] {
        let list: IHierarchyData[] = [];
        if (transList != null) {
            for (let i = 0; i < transList.length; i++) {
                let trans = transList[i];
                
                if (trans instanceof transform) {
                    //需要在tree中隐藏
                    if (trans.gameObject.tag == EditorObjectTags.hideInTreeTag) {
                        continue;
                    }

                    let temp: IHierarchyData = {
                        id: trans.insId.getInsID(),
                        title: trans.name,
                        transfrom: trans,
                        visible: trans.gameObject.visible,
                    };

                    //子节点
                    if (trans.children != null && trans.children.length > 0) {
                        if (!temp.children) {
                            temp.children = this.eachTrans(trans.children);
                        } else {
                            temp.children = temp.children.concat(this.eachTrans(trans.children));
                        }
                    }
                    // 寻找canvas节点
                    let component = trans.gameObject.getComponent("canvasRenderer") as m4m.framework.canvasRenderer;
                    if (component) {
                        let children = component.canvas.getRoot().children;
                        if (!temp.children) {
                            temp.children = this.eachTrans(children);
                        } else {
                            temp.children = temp.children.concat(this.eachTrans(children));
                        }
                    }
                    
                    //相机 OverLays
                    let camera = trans.gameObject.getComponent("camera") as m4m.framework.camera;
                    if (camera && trans.gameObject.tag == EditorObjectTags.mainCamera) {
                        let layer: IHierarchyData[] = [];
                        let overLays = camera.getOverLays();
                        for (let j = 0; j < overLays.length; j++) {
                            let ol = overLays[j] as overlay2D;
                            let root = ol.canvas.getRoot();
                            layer.push({
                                id: root.insId.getInsID(),
                                title: "overLay" + (j + 1),
                                transfrom: root,
                                children: root.children.length > 0 ? this.eachTrans(root.children) : null,
                                visible: root.visible,
                            });
                        }
                        
                        if (layer.length > 0) {
                            if (!temp.children) {
                                temp.children = layer;
                            } else {
                                temp.children = temp.children.concat(layer);
                            }
                        }
                    }
                    
                    list.push(temp);
                } else {
                    //需要在tree中隐藏
                    if (trans.tag == EditorObjectTags.hideInTreeTag) {
                        continue;
                    }

                    let temp: IHierarchyData = {
                        id: trans.insId.getInsID(),
                        title: trans.name,
                        transfrom: trans,
                        visible: trans.visible,
                    };

                    //子节点
                    if (trans.children != null && trans.children.length > 0) {
                        if (!temp.children) {
                            temp.children = this.eachTrans(trans.children);
                        } else {
                            temp.children = temp.children.concat(this.eachTrans(trans.children));
                        }
                    }

                    list.push(temp);
                }
            }
        }
        return list;
    }

}
