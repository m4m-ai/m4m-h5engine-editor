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
export class EditorGridLine
{

    public frameWidth: number = 100;

    public frameHeight: number = 100;

    public scale: number = 5;

    public trans: m4m.framework.transform = null;


    constructor(private owner: m4m.framework.transform, private _scene: m4m.framework.scene, private lineShader: string = "shader/line")
    {
    }


    public init()
    {
        var _mesh: m4m.framework.mesh = new m4m.framework.mesh();
        var data = new m4m.render.meshData();
        _mesh.data = data;
        data.pos = [];
        data.trisindex = [];
        data.color = [];
        //构建pos
        for (let i = 0; i <= this.frameWidth; i++)
        {
            for (let j = 0; j <= this.frameHeight; j++)
            {
                data.pos.push(new m4m.math.vector3((i - this.frameWidth / 2) * this.scale, 0, (j - this.frameHeight / 2) * this.scale));
            }
        }
        //构建color
        for (let i = 0; i < data.pos.length; i++)
        {
            data.color.push(new m4m.math.color(0.2, 0.2, 0.2, 0.5));
        }

        //构建索引X
        //构建竖线
        for (let i = 0; i <= this.frameWidth; i++)
        {
            data.trisindex.push(i);
            data.trisindex.push(i + this.frameHeight * (this.frameWidth + 1));
        }
        //构建横线
        for (let i = 0; i <= this.frameHeight; i++)
        {
            data.trisindex.push(i * (this.frameWidth + 1));
            data.trisindex.push(i * (this.frameWidth + 1) + this.frameWidth);
        }

        //设定顶点格式
        var vf = m4m.render.VertexFormatMask.Position | m4m.render.VertexFormatMask.Color;
        //根据顶点格式生成VBO
        var vbo32 = _mesh.data.genVertexDataArray(vf);
        //生成IBO
        var ibo16 = new Uint16Array(data.trisindex);

        var webgl = this._scene.webgl;

        _mesh.glMesh = new m4m.render.glMesh();
        _mesh.glMesh.initBuffer(webgl, vf, _mesh.data.pos.length);
        _mesh.glMesh.uploadVertexSubData(webgl, vbo32);
        _mesh.glMesh.addIndex(webgl, ibo16.length);
        _mesh.glMesh.uploadIndexSubData(webgl, 0, ibo16);

        _mesh.submesh = [];
        {
            var sm = new m4m.framework.subMeshInfo();
            sm.matIndex = 0;
            sm.useVertexIndex = 0;
            sm.start = 0;
            sm.size = ibo16.length;
            sm.line = true;
            _mesh.submesh.push(sm);
        }

        let trans = new m4m.framework.transform();
        trans.name = "______EditorFrame";
        trans.gameObject.hideFlags = m4m.framework.HideFlags.HideAndDontSave;
        let filter = trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHFILTER) as m4m.framework.meshFilter;
        filter.mesh = (_mesh);
        let render = trans.gameObject.addComponent(m4m.framework.StringUtil.COMPONENT_MESHRENDER) as m4m.framework.meshRenderer;
        let material = new m4m.framework.material();
        material.setShader(m4m.framework.sceneMgr.app.getAssetMgr().getShader(this.lineShader));
        render.materials = [];
        render.materials.push(material);
        render.renderLayer = m4m.framework.cullingmaskutil.maskTolayer(m4m.framework.CullingMask.editor);

        this.trans = trans;
        this.owner.addChild(trans);
    }
}