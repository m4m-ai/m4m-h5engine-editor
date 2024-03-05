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
import { EditorApplication } from "../EditorApplication";
import { NodeTypeEnum } from "./NodeTypeEnum";

export class ObjectUtil
{
    public static createEmpty(transform2D: boolean = false)
    {
        let trans = null;
        if (!transform2D)
        {
            trans = new m4m.framework.transform();
        }
        else
        {
            trans = new m4m.framework.transform2D();
            trans.width = 50;
            trans.height = 50;
        }
        return trans;
    }

    public static createPrimitive(type: m4m.framework.PrimitiveType): m4m.framework.gameObject
    {
        let obj = m4m.framework.TransformUtil.CreatePrimitive(type, EditorApplication.Instance.engineApp);
        //shader 设置成 diffuse.shader.json
        let mr = obj.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        let assMgr = EditorApplication.Instance.engineApp.getAssetMgr();
        if(mr){
            mr.materials = mr.materials ? mr.materials : [];
            mr.materials[0] = mr.materials[0] ? mr.materials[0]: new m4m.framework.material();
            // mr.materials[0].setShader(assMgr.getShader("shader/def"));
            mr.materials[0].setShader(assMgr.getShader("diffuse.shader.json"));
        }
        return obj.gameObject;
    }

    public static createCamera(name: string = null): m4m.framework.camera
    {
        let trans = new m4m.framework.transform();
        trans.name = name || trans.name;
        return trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_CAMERA) as m4m.framework.camera;
    }

    public static createOverlay(): m4m.framework.overlay2D
    {
        return new m4m.framework.overlay2D();
    }

    public static removeObject(trans: any): boolean
    {
        if (trans)
        {
            if (trans.onDestory)
                trans.onDestory(trans);

            if (trans.parent)
                trans.parent.removeChild(trans);
            trans.dispose();
            return true;
        }
        return false;
    }

    public static getObjectMetaData(obj: m4m.framework.gameObject): any
    {
        return m4m.io.serializeObj(obj);
    }

    public static addComponent(obj: any, comp: string): any
    {
        return obj.addComponent(comp);
    }

    public static getComponent(obj: m4m.framework.gameObject, comp: string): m4m.framework.INodeComponent
    {
        return obj.getComponent(comp);
    }

    public static getCamera(trans: m4m.framework.transform): m4m.framework.INodeComponent
    {
        return ObjectUtil.getComponent(trans.gameObject || trans as any, m4m.framework.StringUtil.COMPONENT_CAMERA);
    }

    public static getCanvasRenderer(trans: m4m.framework.transform): m4m.framework.INodeComponent
    {
        return ObjectUtil.getComponent(trans.gameObject || trans as any, m4m.framework.StringUtil.COMPONENT_CANVASRENDER);
    }


    public static getEffectSystem(trans: any): m4m.framework.effectSystem
    {
        return ObjectUtil.getComponent(trans.gameObject || trans, m4m.framework.StringUtil.COMPONENT_EFFECTSYSTEM) as m4m.framework.effectSystem;
    }

    public static get3DType(trans: m4m.framework.transform): NodeTypeEnum
    {
        let canvasrender = ObjectUtil.getCanvasRenderer(trans);
        let camera = ObjectUtil.getCamera(trans);
        if (canvasrender != null && camera != null)
            return NodeTypeEnum.CameraAndCanvasRenderer;
        else if (canvasrender != null && camera == null)
            return NodeTypeEnum.CanvasRenderer;
        else if (camera != null && canvasrender != null)
            return NodeTypeEnum.Camera;
        else
            return NodeTypeEnum.Transform;
    }

    public static getType(trans: any): NodeTypeEnum
    {
        if (trans instanceof m4m.framework.transform)
            return NodeTypeEnum.Transform;
        else if (trans instanceof m4m.framework.transform2D)
            return NodeTypeEnum.Transform2D;
        return NodeTypeEnum.None;
    }

    public static showInHierarchy(trans: any)
    {
        if (trans)
            return EditorApplication.Instance.engineApp.checkFilter(trans);
        return true;
    }

    public static get NAME_COMPONENT_CAMERA()
    {
        return m4m.framework.StringUtil.COMPONENT_CAMERA;
    }

    public static get NAME_COMPONENT_CANVASRENDER()
    {
        return m4m.framework.StringUtil.COMPONENT_CANVASRENDER;
    }

    public static get NAME_COMPONENT_EFFECTSYSTEM()
    {
        return m4m.framework.StringUtil.COMPONENT_EFFECTSYSTEM;
    }
}
