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
import {EditorApplication} from "../EditorApplication";
import {EditorEventMgr} from "../Event/EditorEventMgr";
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;
import PrimitiveType = m4m.framework.PrimitiveType;
import material = m4m.framework.material;
import vector4 = m4m.math.vector4;

/**
 * Hierarchy 面板操作函数
 */
export class EditorHierarchyHandle {
    /**
     * 创建空的3D物体
     */
    public static create3dEmptyObject(root: transform) {
        let trans = new transform();
        trans.name = "Game Object";
        root.addChild(trans);
        EditorEventMgr.Instance.emitEvent("SetActiveObject", cb => cb(trans));
        EditorEventMgr.Instance.emitEvent("CameraLookTransform", cb => cb(trans));
    }

    /**
     * 创建空的2D物体
     */
    public static create2dEmptyObject(root: transform2D) {
        let trans = new transform2D();
        trans.name = "Game Object 2D";
        root.addChild(trans);
        EditorEventMgr.Instance.emitEvent("SetActiveObject", cb => cb(trans));
        EditorEventMgr.Instance.emitEvent("CameraLookTransform", cb => cb(trans));
    }

    /**
     * 创建基础物体
     * @param type 物体类型
     * @param root 父节点
     */
    public static createPrimitive(type: PrimitiveType, root: transform) {
        let trans = m4m.framework.TransformUtil.CreatePrimitive(type, EditorApplication.Instance.engineApp);
        let renderer: m4m.framework.meshRenderer = trans.gameObject.renderer as m4m.framework.meshRenderer;
        let materials: material = renderer.materials[0];
        materials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("diffuse.shader.json"));
        materials.setVector4("_MainColor", new vector4(1, 1, 1, 1));
        materials.setFloat("_AlphaCut", 0.5);
        root.addChild(trans);
        EditorEventMgr.Instance.emitEvent("SetActiveObject", cb => cb(trans));
        EditorEventMgr.Instance.emitEvent("CameraLookTransform", cb => cb(trans));
    }
}