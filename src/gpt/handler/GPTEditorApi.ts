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
import { FileInfoManager } from "../../CodeEditor/code/FileInfoManager";
import { EditorApplication } from "../../Game/EditorApplication";
import { Utils } from "../../Game/Utils";

interface Vector3 {x:number;y:number;z:number;}
interface Vector2 {x:number;y:number;}
interface Color {r:number;g:number;b:number,a:number}
enum PrimitiveType {
    Sphere,
    Capsule,
    Cylinder,
    Cube,
    Plane,
    Quad,
    Pyramid
}
enum LightType {
    Direction=0,
    Point=1,
    Spot=2
}
type ComponentType = "camera"|"light"
interface Component {
    readonly transform:Transform
    clone():Component
}
interface Camera extends Component {
}
interface Light extends Component {
    type:LightType
    //默认白色
    color:Color
    //默认10
    range:number
    //默认0.6
    intensity:number
}
interface Transform {
    name:string
    position:Vector3
    scale:Vector3
    rotation:Vector3
    visible:boolean
    //是否启用物理
    enablePhysics:boolean
    //子节点数量,实时更新
    childrenCount:number
    getPath():string
    findChild(name:string):Transform|null
    //根据名称模糊查询子物体,不区分大小写
    fuzzyFindChild(name:string):Transform[]
    getChild(index:number):Transform|null
    addChild(trans:Transform,index?:number)
    clone():Transform
    //删除物体
    destroy()
    equals(trans:Transform):boolean
    getComponent(type:ComponentType):Component|null
    addComponent(type:ComponentType):Component
    removeComponent(type:ComponentType)
}
interface EditorApi {
    //是否启用世界物理
    enablePhysics:boolean
    //物理下落速度
    physicsGravity:Vector3
    ramdomRangeFloat(min:number,max:number):number
    ramdomRangeInt(min:number,max:number):number
    //播放游戏
    play()
    //停止游戏
    stop()
    //重启游戏
    restart()
    getRoot():Transform
    //获取编辑器相机前面的点,distance:距离,默认5
    getCameraForwardPosition(distance?:number):Vector3
    getSelectTrans():Transform|null
    getSelectFolderPath():string|null
    getSelectFilePath():string|null
    findTrans(path:string):Transform|null
    findComponents(type:ComponentType):Component[]
    //创建一个空物体
    createEmpty(name:string):Transform
    //创建原始对象
    createPrimitive(type:PrimitiveType):Transform
    openNewScene()
    openScene(sceneName:string)
    saveScene(sceneName:string,folderPath?:string)
}
class GPTComponent implements Component {
    public constructor(public comp: m4m.framework.INodeComponent, public compType: ComponentType) {
    }
    public get transform() {
        return new GPTTransform(this.comp.gameObject.transform);
    }
    public clone(): Component {
        let trans = this.comp.gameObject.transform.clone();
        if (this.comp.gameObject.transform.parent != null) {
            this.comp.gameObject.transform.parent.addChild(trans);
        } else {
            EditorApplication.Instance.editorScene.getCurrentRoot().addChild(trans);
        }
        return GPTTransform.wrapComponent(this.compType, trans.gameObject.getComponent(this.compType));
    }
}

class GPTCameraComponent extends GPTComponent implements Camera {

}

class GPTLightComponent extends GPTComponent implements Light {
    public get color(): Color {
        let c = (this.comp as m4m.framework.light).color;
        return {
            r: c.r,
            g: c.g,
            b: c.b,
            a: c.a
        }
    }
    public set color(v) {
        (this.comp as m4m.framework.light).color = new m4m.math.color(v.r, v.g, v.b, v.a);
    }
    public get type() {
        return (this.comp as m4m.framework.light).type as any;
    }
    public set type(v) {
        (this.comp as m4m.framework.light).type = v;
    }
    public get range() {
        return (this.comp as m4m.framework.light).range;
    }
    public set range(v) {
        (this.comp as m4m.framework.light).range = v;
    }
    public get intensity() {
        return (this.comp as m4m.framework.light).intensity;
    }
    public set intensity(v) {
        (this.comp as m4m.framework.light).intensity = v;
    }
}

class GPTTransform implements Transform {
    public get transform() {
        return this;
    }
    constructor(public trans: m4m.framework.transform) {
    }
    public get enablePhysics(): boolean {
        return this.trans["__physicalObj__"] != null;
    }
    public set enablePhysics(v) {
        if (v) {
            if (this.enablePhysics) {
                return;
            }
            let physicalObj = new m4m.framework.PhysicsImpostor(this.trans, m4m.framework.ImpostorType.BoxImpostor, { mass: 1, restitution: 0.6, friction: 0.5 });
            this.trans["__physicalObj__"] = physicalObj;
        }
    }
    public clone(): Transform {
        let trans = this.trans.clone();
        if (this.trans.parent != null) {
            this.trans.parent.addChild(trans);
        } else {
            EditorApplication.Instance.editorScene.getCurrentRoot().addChild(trans);
        }
        return new GPTTransform(trans);
    }
    public addComponent(type: ComponentType): Component {
        let c = this.trans.gameObject.getComponent(type);
        if (c) {
            return GPTTransform.wrapComponent(type, c);
        }
        c = this.trans.gameObject.addComponent(type);
        if (type == "light") {
            let light = c as m4m.framework.light;
            light.type = m4m.framework.LightTypeEnum.Point;
            light.intensity = 0.6;
        }
        return GPTTransform.wrapComponent(type, c);
    }
    public getComponent(type: ComponentType): Component {
        let c = this.trans.gameObject.getComponent(type);
        if (c) {
            return GPTTransform.wrapComponent(type, c);
        }
        return null;
    }
    public removeComponent(type: ComponentType) {
        this.trans.gameObject.removeComponentByTypeName(type);
    }
    public get name() {
        return this.trans.name;
    }
    public set name(v) {
        this.trans.name = v;
    }
    public get position(): Vector3 {
        let pos = this.trans.localPosition;
        return {
            x: pos.x,
            y: pos.y,
            z: pos.z
        }
    }
    public set position(v) {
        this.trans.localPosition = new m4m.math.vector3(v.x, v.y, v.z);
    }
    public get scale(): Vector3 {
        let pos = this.trans.localScale;
        return {
            x: pos.x,
            y: pos.y,
            z: pos.z
        }
    }
    public get visible() {
        return this.trans.gameObject.visible;
    }
    public set visible(v) {
        this.trans.gameObject.visible = v;
    }
    public set scale(v) {
        this.trans.localScale = new m4m.math.vector3(v.x, v.y, v.z);
    }
    public get rotation(): Vector3 {
        let v = new m4m.math.vector3();
        m4m.math.quatToEulerAngles(this.trans.localRotate, v);
        return v;
    }
    public set rotation(v) {
        let q = new m4m.math.quaternion();
        m4m.math.quatFromEulerAngles(v.x, v.y, v.z, q);
        this.trans.localRotate = q;
    }
    public get childrenCount() {
        return this.trans.children.length;
    }
    public getPath(): string {
        let temp = this.trans;
        let path = "";
        while (temp != null && temp.gameObject.tag != "editor") {
            if (path.length > 0) {
                path += "/";
            }
            path += temp.name;
            temp = temp.parent;
        }
        return path;
    }

    public findChild(name: string): Transform {
        for (let item of this.trans.children) {
            if (item.name == name) {
                return new GPTTransform(item);
            }
        }
        return null;
    }
    public fuzzyFindChild(name: string): Transform[] {
        let trans: Transform[] = [];
        name = name.toLowerCase().replaceAll(" ", "");
        Utils.eachTrans(EditorApplication.Instance.editorScene.getCurrentRoot(), (t) => {
            let n = t.name.toLowerCase().replaceAll(" ", "");
            if (n.includes(name)) {
                trans.push(new GPTTransform(t));
            }
        });
        return trans;
    }
    public getChild(index: number): Transform {
        let c = this.trans.children[index];
        if (!c) {
            return null;
        }
        return new GPTTransform(c);
    }
    public addChild(trans: Transform, index?: number) {
        if (!trans) {
            return;
        }
        let tr = (trans as GPTTransform).trans;
        if (tr.parent != this.trans) {
            tr.parent.removeChild(tr);
        }
        if (index != null) {
            this.trans.addChild(tr);
        } else {
            this.trans.addChildAt(tr, index);
        }
    }
    public destroy() {
        this.trans.dispose();
    }
    public equals(trans: Transform): boolean {
        if (!trans) {
            return false;
        }
        return this.trans == (trans as GPTTransform).trans;
    }
    public static wrapComponent(type: ComponentType, inst: m4m.framework.INodeComponent): Component {
        if (type == "camera") {
            return new GPTCameraComponent(inst, type);
        } else if (type == "light") {
            return new GPTLightComponent(inst, type);
        }
        return null;
    }
}

export class GPTEditorApi implements EditorApi {
    public get enablePhysics() {
        return EditorApplication.Instance.editorScene.enablePhysical;
    }
    public set enablePhysics(v) {
        EditorApplication.Instance.editorScene.enablePhysical = v;
    }
    public get physicsGravity(): Vector3 {
        return EditorApplication.Instance.editorScene.physicalGravity;
    }
    public set physicsGravity(v) {
        EditorApplication.Instance.editorScene.physicalGravity = v;
    }
    public openNewScene() {
        EditorApplication.Instance.editorScene.openEmptyScene();
    }
    public openScene(sceneName: string) {
        let scene = FileInfoManager.Instance.getDirByPath("Scenes/" + sceneName + "/");
        EditorApplication.Instance.editorResources.openFile(scene);
        //EditorApplication.Instance.editorScene.scene
    }
    public saveScene(folderPath: string, sceneName: string) {
        
    }
    public getEditorCamera(): Transform {
        return new GPTTransform(EditorApplication.Instance.editorCamera.gameObject.transform);
    }
    public getCameraForwardPosition(distance: number = 5): Vector3 {
        let temp = EditorApplication.Instance.editorCamera.gameObject.transform;
        let pos = temp.getWorldPosition();
        let dir = new m4m.math.vector3();
        temp.getForwardInWorld(dir);
        return {
            x: pos.x + dir.x * distance,
            y: pos.y + dir.y * distance,
            z: pos.z + dir.z * distance
        }
    }
    public getSelectFolderPath(): string {
        return EditorApplication.Instance.selection.activeFolderPath;
    }
    public getSelectFilePath(): string {
        let a = EditorApplication.Instance.selection.activeAsset;
        if (a) {
            return a.relativePath;
        }
        return null;
    }
    public getSelectTrans(): Transform {
        let selection = EditorApplication.Instance.selection.activeTransform;
        if (selection instanceof m4m.framework.transform) {
            return new GPTTransform(selection);
        }
        return null;
    }
    public ramdomRangeFloat(min: number, max: number): number {
        if (min == max) {
            return min;
        }
        if (min > max)
            return Math.random() * (min - max) + max;
        return Math.random() * (max - min) + min;
    }
    public ramdomRangeInt(min: number, max: number): number {
        if (min == max) {
            return min | 0;
        }
        if (min > max)
            return Math.floor(Math.random() * (min - max + 1) + max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    public play() {
        EditorApplication.Instance.isPlay = true;
    }
    public stop() {
        EditorApplication.Instance.isPlay = false;
    }
    public restart() {
        EditorApplication.Instance.isPlay = false;
        setTimeout(() => {
            EditorApplication.Instance.isPlay = true;
        }, 500);
    }
    public getRoot(): Transform {
        return new GPTTransform(EditorApplication.Instance.editorScene.getCurrentRoot());
    }
    public findTrans(path: string): Transform {
        if (!path) {
            return null;
        }
        let strs = path.split("/");
        let temp = EditorApplication.Instance.editorScene.getCurrentRoot();
        for (let i = 0; i < strs.length; i++) {
            let n = strs[i];
            let flag = false;
            for (let item of temp.children) {
                if (item.name == n) {
                    temp = item;
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                return null;
            }
        }
        return new GPTTransform(temp);
    }
    public findComponents(type: ComponentType): Component[] {
        let list = EditorApplication.Instance.editorScene.getCurrentRoot().gameObject.getComponentsInChildren(type);
        let list2: Component[] = [];
        for (let item of list) {
            list2.push(GPTTransform.wrapComponent(type, item));
        }
        return list2;
    }
    public createEmpty(name: string): Transform {
        let trans = new m4m.framework.transform();
        trans.name = name;
        EditorApplication.Instance.editorScene.getCurrentRoot().addChild(trans);
        return new GPTTransform(trans);
    }
    public createPrimitive(type: PrimitiveType): Transform {
        let root = EditorApplication.Instance.editorScene.getCurrentRoot();
        let trans = m4m.framework.TransformUtil.CreatePrimitive(type, EditorApplication.Instance.engineApp);
        let renderer: m4m.framework.meshRenderer = trans.gameObject.renderer as m4m.framework.meshRenderer;
        let materials: m4m.framework.material = renderer.materials[0];
        materials.setShader(EditorApplication.Instance.engineApp.getAssetMgr().getShader("diffuse.shader.json"));
        materials.setVector4("_MainColor", new m4m.math.vector4(1, 1, 1, 1));
        materials.setFloat("_AlphaCut", 0.5);
        root.addChild(trans);
        return new GPTTransform(trans);
    }
}