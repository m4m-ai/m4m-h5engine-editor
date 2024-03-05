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
import { EditorObjectTags } from "./EditorObjectTags";
import { EditorApplication } from "./EditorApplication";
import transform2D = m4m.framework.transform2D;

export class Utils {

    /**
     * 弧度制转角度制
     */
    public static radianToDegree(radian: number) {
        return radian * (180 / Math.PI);
    }

    /**
     * 角度制转弧度制
     */
    public static degreesToRadians(degrees: number) {
        return degrees * (Math.PI / 180);
    }

    /**
     * 将颜色转为16进制字符串
     */
    public static colorToHex(color: m4m.math.color): string {
        return this.toHex(color.r) + this.toHex(color.g) + this.toHex(color.b) + this.toHex(color.a);
    }

    private static toHex(c: number) {
        var hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    /**
     * 将获取一个类对象的名称
     */
    public static nameof<T extends { new(): any }>(type: T): string {
        return type.prototype.constructor.name;
    }

    /**
     * 获取一个对象的实例名称
     */
    public static getName(inst: object) {
        return inst.constructor.name;
    }

    /**
     * 转换名称格式, 将驼峰命名转换成短语格式, 例如 abCd => Ab Cd
     */
    public static convertName(str: string): string {
        if (!str || str.length == 0) {
            return str;
        }
        let s0 = str[0].toUpperCase();
        str = str.substring(1);
        str = str.replace(/_/g, " ");
        str = s0 + str.replace(/([A-Z])/g, substring => " " + substring.toUpperCase());
        return str.replace(/(?<= )([a-z])/g, substring => substring.toUpperCase());
    }
    /**
     * 转为 number
     */
    public static convertToNumber(v: string | number): number {
        let outNum:number=0;
        if (typeof v == "string") {
            outNum=Number(v);
            if (isNaN(outNum)) {
                console.error("转number失败 "+v);
                return 0;
            }
         } else {
            outNum=v;
         }
        return outNum;
    }
    /**
     * 验证是否为数字
     * @param str 字符串
     * @param defaultVal 验证失败时返回的默认值
     */
    public static verificationNumber(num: number, defaultVal: number): { success: boolean, standard: number } {
        if (isNaN(num)) {
            return {
                success: false,
                standard: defaultVal,
            }
        }
        return {
            success: true,
            standard: num,
        }
    }

    /**
     * 保留 num 的6位小数
     */
    public static number(num: number) {
        return Math.round(num * 100000) / 100000;
    }

    /**
     * 返回 v 按 period 周期变化的新数
     */
    public static period(v: number, period: number): number {
        return this.number((this.number(v / period) | 0) * period)
    }

    public static limit(value: number, data: { max?: number, min?: number, step?: number }): number {
        if (typeof value == "number") {
            if (data.max != null) {
                value = Math.min(data.max, value);
            }
            if (data.min != null) {
                value = Math.max(data.min, value);
            }
            if (data.step != null) {
                value = this.period(value, data.step);
            }
        }
        return value;
    }

    /**
     * 遍历当前节点的子节点
     */
    public static eachTrans(trans: transform, func: (child: transform, index?: number, layer?: number) => void | boolean, index: number = 0, layer: number = 1) {
        if (!trans) {
            return;
        }
        let children = trans.children;
        for (let i = 0; i < children.length; i++) {
            let c = children[i];
            if (func(c, i, layer + 1) == false) return;
            this.eachTrans(c, func, i, layer + 1);
        }
    }

    /**
     * 遍历当前2D节点的子节点
     */
    public static each2DTrans(trans: transform2D, func: (child: transform2D, index?: number, layer?: number) => void | boolean, index: number = 0, layer: number = 1) {
        if (!trans) {
            return;
        }
        let children = trans.children;
        for (let i = 0; i < children.length; i++) {
            let c = children[i];
            if (func(c, i, layer + 1) == false) return;
            this.each2DTrans(c, func, i, layer + 1);
        }
    }

    //绘制线段
    public static drawLine(trans: transform, points: m4m.math.vector3[], color: m4m.math.color) {

        let ps: m4m.math.vector3[] = [];
        for (let i = 0; i < points.length - 1; i++) {
            ps.push(points[i]);
            ps.push(points[i + 1]);
        }
        let mesh = this.genMesh(ps, color);
        trans.gameObject.tag = EditorObjectTags.hideInTreeTag;
        trans.name = "canvasOutline";

        let mf = trans.gameObject.getComponent("meshFilter") as m4m.framework.meshFilter;
        if (!mf) {
            mf = trans.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        }
        mf.mesh = mesh;

        let mr = trans.gameObject.getComponent("meshRenderer") as m4m.framework.meshRenderer;
        if (!mr) {
            mr = trans.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        }
        let mat = mr.materials[0] = new m4m.framework.material();
        mat.setQueue(10000);
        //mat.setShader(m4m.framework.sceneMgr.app.getAssetMgr().getShader("shader/line"));
        mat.setShader(m4m.framework.sceneMgr.app.getAssetMgr().getShader("shader/defui"));
    }

    //获取线段Mesh
    private static genMesh(points: m4m.math.vector3[], color: m4m.math.color) {
        var meshD = new m4m.render.meshData();
        meshD.pos = [];
        meshD.color = [];
        meshD.trisindex = [];
        for (var i = 0; i < points.length; i++) {
            let pos = points[i];
            meshD.pos.push(new m4m.math.vector3(pos.x, pos.y, pos.z));
            meshD.trisindex.push(i);
            meshD.color.push(color);
        }

        var _mesh = new m4m.framework.mesh();
        _mesh.data = meshD;
        var vf = m4m.render.VertexFormatMask.Position | m4m.render.VertexFormatMask.Color;
        var v32 = _mesh.data.genVertexDataArray(vf);
        var i16 = _mesh.data.genIndexDataArray();

        _mesh.glMesh = new m4m.render.glMesh();
        let webgl = EditorApplication.Instance.engineApp.webgl;
        _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexSubData(webgl, v32);

        _mesh.glMesh.addIndex(webgl, i16.length);
        _mesh.glMesh.uploadIndexSubData(webgl, 0, i16);
        _mesh.glMesh.initVAO();

        _mesh.submesh = [];
        {
            var sm = new m4m.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = 0;
            sm.start = 0;
            sm.size = i16.length;
            sm.line = true;
            _mesh.submesh.push(sm);
        }
        return _mesh;
    }

}