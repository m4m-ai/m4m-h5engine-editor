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
import { Iframe } from "../../../common/samples/browser-amd-iframe";
import { ExportManager } from "../../../Game/ExportManager/ExportManager";
import { FileInfoManager } from "../../code/FileInfoManager";
import { LoaderManager, LoadType } from "../LoaderManager";
import { Aniclip } from "./dataType/Aniclip";
import { Mat } from "./dataType/Mat";
import { Mesh } from "./dataType/Mesh";
import { aniplayer, boxcollider, meshFilter, meshRenderer } from "./dataType/nodeComponent";
import { Prefab } from "./dataType/Prefab";
import { subClip } from "./dataType/subClip";
import { KTXParse } from "./ktx";
import { Loader } from "./Loader";
import { testPvrParse } from "./pvr";

export class Creat3d {
    //组装Prefab
    public static makeAPrefab(pfInfo: Prefab, insidMap) {
        let trans = new m4m.framework.transform();
        trans.name = pfInfo.tranName;
        if (!trans.name) {
            trans.name = pfInfo.name;
        }

        if (pfInfo.insid != null) {
            insidMap[pfInfo.insid] = trans;
        }
        if (pfInfo.localTranslate) {
            m4m.math.vec3Clone(pfInfo.localTranslate, trans.localTranslate);
        }
        if (pfInfo.localScale) {
            m4m.math.vec3Clone(pfInfo.localScale, trans.localScale);
        }
        if (pfInfo.localRotate) {
            m4m.math.quatClone(pfInfo.localRotate, trans.localRotate);
        }
        //递归组装子对象
        if (pfInfo.children) {
            for (let i = 0; i < pfInfo.children.length; i++) {
                let childTranInfo = pfInfo.children[i];
                let childTran = Creat3d.makeAPrefab(childTranInfo, insidMap);
                trans.addChild(childTran);
            }
        }
        return trans;
    }
    //添加组件到Prefab
    public static setCompsToTran(trans: m4m.framework.transform, pfInfo: Prefab, insidMap) {
        if (pfInfo.gameObject.tag) {
            trans.gameObject.tag = pfInfo.gameObject.tag;
        }
        if (pfInfo.gameObject.layer) {
            trans.gameObject.layer = pfInfo.gameObject.layer;
        }

        // trans["_aabb"] = new m4m.framework.aabb(new m4m.math.vector3(-1, -1, -1), new m4m.math.vector3(1, 1, 1));
        if (pfInfo.gameObject.components) {
            for (let i = 0; i < pfInfo.gameObject.components.length; i++) {
                let compInfo = pfInfo.gameObject.components[i];
                let rawComp = Creat3d.makeAComp(trans, compInfo, insidMap, pfInfo.tranName);
                if (rawComp) {

                    trans.gameObject.addComponentDirect(rawComp);
                } else {
                    console.error(compInfo.cmop + "       " + trans.name);
                }
            }
        }

        //递归组装子对象
        for (let i = 0; i < trans.children.length; i++) {
            let childTran = trans.children[i];
            let childTranInfo = pfInfo.children[i];
            Creat3d.setCompsToTran(childTran, childTranInfo, insidMap);
        }
    }
    //组装组件
    // tslint:disable-next-line: cyclomatic-complexity
    private static makeAComp(trans: m4m.framework.transform, compInfo: any, insidMap, fileN) {
        let name = compInfo.cmop || compInfo.className;
        // let pfbres = Creat3d.pfbResList.get(path);
        switch (name) {
            case "asbone":
                let compAsBone = new m4m.framework.asbone();
                return compAsBone;
            case "camera":
                let compcamera = new m4m.framework.camera();
                if (compInfo["near"]) {
                    compcamera.near = compInfo["near"];
                }
                if (compInfo["far"]) {
                    compcamera.far = compInfo["far"];
                }
                if (compInfo["CullingMask"]) {
                    compcamera.CullingMask = compInfo["CullingMask"];
                }
                if (compInfo["fov"]) {
                    compcamera.fov = compInfo["fov"];
                }
                if (compInfo["size"]) {
                    compcamera.size = compInfo["size"];
                }
                if (compInfo["opvalue"]) {
                    compcamera.opvalue = compInfo["opvalue"];
                }
                return compcamera;
            case "boxcollider":
                let compBox = new m4m.framework.boxcollider();
                let compInfoBox = compInfo as boxcollider;
                if (compInfoBox["center"]) {
                    m4m.math.vec3Clone(compInfoBox["center"] as m4m.math.vector3, compBox.center);
                }
                if (compInfoBox["size"]) {
                    m4m.math.vec3Clone(compInfoBox["size"] as m4m.math.vector3, compBox.size);
                }
                return compBox;
            case "aniplayer":
                let compAnip = new m4m.framework.aniplayer();
                let compInfoAnip = compInfo;
                compAnip.clips = [];
                let compAnipKeys = compInfoAnip["clipKeys"];
                if (compAnipKeys) {
                    for (const key in compAnipKeys) {
                        const element = compAnipKeys[key];

                    }
                }

                compAnip.bones = [];
                let compAnipBones = compInfoAnip["bones"];
                if (compAnipBones) {
                    for (const key in compAnipBones) {
                        let tPos = compAnipBones[key] as m4m.framework.tPoseInfo;
                        let addTpos = new m4m.framework.tPoseInfo();
                        if (tPos) {
                            addTpos.name = tPos["tranName"];
                            addTpos.tposep = new m4m.math.vector3();
                            addTpos.tposeq = new m4m.math.quaternion();
                            if (tPos.tposep) {
                                m4m.math.vec3Clone(tPos.tposep, addTpos.tposep);
                            }
                            if (tPos.tposeq) {
                                m4m.math.quatClone(tPos.tposeq, addTpos.tposeq);
                            }
                            compAnip.bones.push(addTpos);
                        }
                    }
                }
                compAnip.startPos = [];
                let compAnipSPos = compInfoAnip["startPos"];
                if (compAnipSPos) {
                    for (const key in compAnipSPos) {
                        let spos = compAnipSPos[key] as m4m.framework.PoseBoneMatrix;
                        let addSpos = new m4m.framework.PoseBoneMatrix();
                        addSpos.t = new m4m.math.vector3();
                        addSpos.r = new m4m.math.quaternion();
                        if (spos.t) {
                            m4m.math.vec3Clone(spos.t, addSpos.t);
                        }
                        if (spos.r) {
                            m4m.math.quatClone(spos.r, addSpos.r);
                        }
                        compAnip.startPos.push(addSpos);
                    }
                }
                // testCreat.aniplayer = compAnip;
                return null;
            case "skinnedMeshRenderer":
                let compSkin = new m4m.framework.skinnedMeshRenderer();
                let compInfoSkin = compInfo;
                compSkin.materials = [];
                let compSkinMats = compInfoSkin["materialsKey"];
                if (compSkinMats) {
                    for (const key in compSkinMats) {
                        let matKey = compSkinMats[key];
                        compSkin["meshKey"] = matKey;
                        console.error("=============================================    " + compSkin["meshKey"]);
                        ExportManager.getMatByKey(matKey, compSkin);
                    }
                } else {
                    // let mat = new m4m.framework.material();
                    // let sh = m4m.framework.sceneMgr.app.getAssetMgr()
                    //     .getShader("diffuse.shader.json");
                    // mat.setShader(sh);
                    // compSkinMats.materials.push(mat);
                }
                compSkin.center = new m4m.math.vector3();
                compSkin.size = new m4m.math.vector3();
                if (compInfoSkin["center"]) {
                    m4m.math.vec3Clone(compInfoSkin["center"] as m4m.math.vector3, compSkin.center);
                }
                if (compInfoSkin["size"]) {
                    m4m.math.vec3Clone(compInfoSkin["size"] as m4m.math.vector3, compSkin.size);
                }
                if (compInfoSkin["meshKey"]) {


                    ExportManager.getMeshByKey(compInfoSkin["meshKey"], compSkin);
                }
                // compSkin.mesh = await testCreat.getMeshFromMap(meshMap, compInfoSkin.mesh, path);
                // compSkin.mesh = pfbres.get(compInfoSkin.mesh);

                // if (compSkin.mesh) {
                //     let max = compSkin.mesh["_max"] as m4m.math.vector3;
                //     let min = compSkin.mesh["_min"] as m4m.math.vector3;
                //     trans["_aabb"] = new m4m.framework.aabb(min, max);
                //     m4m.framework.transform["aabbStoreMap"][compSkin.mesh.getGUID()] = [min, max];
                // }

                compSkin.bones = [];
                let compSkinbones = compInfoSkin["bones"];
                if (compSkinbones) {
                    for (const key in compSkinbones) {
                        let insid = compSkinbones[key];
                        let bone = insidMap[insid];
                        if (bone) {
                            compSkin.bones.push(bone);
                        }
                    }
                }
                compSkin.rootBone = insidMap[compInfoSkin.rootBone];
                // compSkin.player = testCreat.aniplayer;
                return compSkin;
            case "meshFilter":
                let compMF = new m4m.framework.meshFilter();
                let compInfoMF = compInfo;
                // compMF.mesh = await testCreat.getMeshFromMap(meshMap, compInfoMF.mesh, path);
                if (compInfoMF["meshKey"]) {
                    ExportManager.getMeshByKey(compInfoMF["meshKey"], compMF);
                }
                // compMF.mesh = pfbres.get(compInfoMF.mesh);

                // if (compMF.mesh) {
                //     let max = compMF.mesh["_max"] as m4m.math.vector3;
                //     let min = compMF.mesh["_min"] as m4m.math.vector3;
                //     trans["_aabb"] = new m4m.framework.aabb(min, max);
                //     m4m.framework.transform["aabbStoreMap"][compMF.mesh.getGUID()] = [min, max];
                // }

                return compMF;
            case "meshRenderer":
                let compMR = new m4m.framework.meshRenderer();
                let compInfoMR = compInfo as meshRenderer;
                compMR.materials = [];
                let compMRMats = compInfoMR["materialsKey"];
                if (compMRMats) {
                    for (const key in compMRMats) {
                        let matKey = compMRMats[key];
                        compMR["meshKey"] = matKey;
                        ExportManager.getMatByKey(matKey, compMR);
                    }
                } else {
                    // let mat = new m4m.framework.material();
                    // let sh = m4m.framework.sceneMgr.app.getAssetMgr()
                    //     .getShader("diffuse.shader.json");
                    // mat.setShader(sh);
                    // compMR.materials.push(mat);
                }
                if (compInfoMR["lightmapIndex"]) {
                    compMR.lightmapIndex = compInfoMR["lightmapIndex"];
                }
                if (compInfoMR.layer) {
                    compMR.layer = compInfoMR.layer;
                }
                compMR.lightmapScaleOffset = new m4m.math.quaternion();
                if (compInfoMR["lightmapScaleOffset"]) {
                    m4m.math.quatClone(compInfoMR["lightmapScaleOffset"] as m4m.math.quaternion, compMR.lightmapScaleOffset);
                }
                return compMR;
            case "spherecollider":
                let compSpherecollider = new m4m.framework.spherecollider();
                return compSpherecollider;
            // case "godray":
            //     let compGodray = new godray();
            //     return compGodray;
            case "meshcollider":
                let compMeshcollider = new m4m.framework.meshcollider();
                return compMeshcollider;
            // case "water":
            //     let compWater = new water();
            //     let compInfoWater = compInfo as waterComp;
            //     compInfoWater.copyFrom = compInfoWater.copyFrom;
            //     compInfoWater.defNumVertsPerRow = compInfoWater.defNumVertsPerRow;
            //     return compWater;
            // case "particlesystem":
            // // let particleData = pfbres.get(compInfo.particleSystemData) as m4m.framework.ParticleSystemData;
            // // let particleComp = new m4m.framework.ParticleSystem();
            // // let particleCompData = new m4m.framework.ParticleSystemData(compInfo.particleSystemData);
            // // particleCompData.objectData = particleData;
            // // particleCompData.value = compInfo.particleSystemData;
            // // particleComp.particleSystemData = particleCompData;
            // // particleComp.material = pfbres.get(compInfo.material);
            // // particleComp.sortingFudge = compInfo.sortingFudge;
            // // return particleComp;
            // case "f14effCmop":
            //     // let f14effCmopData = pfbres.get(compInfo.f14eff);
            //     // let f14effCmop = new ISpParticleSystem(f14effCmopData.f14dffName);
            //     // // f14effCmop.f14eff=JSON.parse(f14effCmopData.jsonData);
            //     // let f14 = new m4m.framework.f14eff(f14effCmopData.f14dffName);
            //     // f14.Parse(f14effCmopData.jsonData, m4m.framework.sceneMgr.app.getAssetMgr());
            //     // f14effCmop.f14eff = f14;
            //     // for (let i = 0; i < f14.data.layers.length; i++) {
            //     //     let elementdata = f14.data.layers[i].elementdata;

            //     // }

            //     // return f14effCmop;
            //     break;
            default:
                console.error("==========================未完成的组件解析：" + name);
        }
    }
    // tslint:disable-next-line: cyclomatic-complexity
    public static setMat(matData: Mat, mat: m4m.framework.material): m4m.framework.material {

        let sh = m4m.framework.sceneMgr.app.getAssetMgr()
            .getShader(matData.shader);
        mat.setShader(sh);
        let mapUniform = matData.mapUniform.forEach ? matData.mapUniform["data"] : matData.mapUniform;
        for (let key in mapUniform) {
            let value = mapUniform[key];
            if (value.value == null) {
                continue;
            }
            if (!value.type) {
                value.type = 0;
            }
            switch (value.type) {
                case m4m.render.UniformTypeEnum.Float:
                    mat.setFloat(key.toString(), Number.parseFloat(value.value));
                    break;
                case m4m.render.UniformTypeEnum.Float4:
                    let values = value.value.match(m4m.framework.RegexpUtil.vector4Regexp);
                    try {

                        if (values != null) {
                            // tslint:disable-next-line: max-line-length
                            let _float4: m4m.math.vector4 = new m4m.math.vector4(parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]), parseFloat(values[4]));
                            mat.setVector4(key.toString(), _float4);
                        }
                    } catch (e) {
                        //数据不合法就不提交了
                        console.error("Material Mapuniform float4 无效:value (" + value.value + ")！");
                    }
                    break;
                case m4m.render.UniformTypeEnum.Texture:
                case m4m.render.UniformTypeEnum.CubeTexture:
                    ExportManager.getImageSettingByKey(value.valueKey, key, mat);

                    break;
                default:
            }
        }
        return mat;
    }
    //组装动画片段
    public static creatClip(element: Aniclip, animc: m4m.framework.animationClip, pfbName: string = "") {


        if (element == null) {
            return;
        }

        animc["name"].name = pfbName + "_" + element.aniclipName + ".aniclip.bin";

        animc.fps = element.fps;
        animc.hasScaled = element.hasScaled;
        animc.loop = element.loop;
        animc.boneCount = element.boneCount;
        animc.bones = [];
        for (let j = 0; j < element.bones.length; j++) {
            const bone = element.bones[j];
            animc.bones.push(bone);
        }
        element.indexDic.forEach((value, key) => {
            animc.indexDic[key] = value;
        });
        animc.subclipCount = element.subclipCount;
        animc.fps = element.fps;
        animc.fps = element.fps;
        for (let j = 0; j < element.subclips.length; j++) {
            const clipC = element.subclips[j];
            if (clipC) {
                let addClip = new subClip();
                addClip.endframe = clipC.endframe;
                addClip.loop = clipC.loop;
                addClip.name = clipC.name;
                addClip.startframe = clipC.startframe;
                animc.subclips.push(addClip);
            }
        }
        animc.frameCount = element.frameCount;
        element.frames.forEach((value, key) => {
            animc.frames[key] = value;
        });
        return animc;
    }
    //组装Mesh
    public static createMesh(meshData: Mesh, _mesh: m4m.framework.mesh, webgl: WebGL2RenderingContext) {

        if (meshData.maximum) {
            _mesh.maximun = m4m.poolv3(meshData.maximum);
        }
        if (meshData.minimum) {
            _mesh.minimun = m4m.poolv3(meshData.minimum);
        }
        _mesh["name"].name = meshData.meshName + ".mesh.bin";
        _mesh.defaultAsset = true;
        _mesh.data = new m4m.render.meshData();
        // _mesh.data.pos = meshData.position;
        // _mesh.data.color = meshData.color;
        // _mesh.data.normal = meshData.normal;
        // _mesh.data.uv = meshData.UV0;
        // _mesh.data.uv2 = meshData.UV1;
        // _mesh.data.tangent = meshData.tangent;
        // _mesh.data.blendIndex = meshData.blendIndex;
        // _mesh.data.blendWeight = meshData.blendWeight;
        // _mesh.data.trisindex = meshData.trisindex;   //triIndexBufferData给了， 这里不需要了
        _mesh.submesh = [];
        let meshsubMesh = meshData["subMesh"];
        if (meshsubMesh) {
            for (const key in meshsubMesh) {
                const element = meshsubMesh[key];

                let subMesh = new m4m.framework.subMeshInfo();
                if (element.line) {
                    subMesh.line = element.line;
                }
                if (element.matIndex) {
                    subMesh.matIndex = element.matIndex;
                }
                if (element.size) {
                    subMesh.size = element.size;
                }
                if (element.start) {
                    subMesh.start = element.start;
                }
                if (element.useVertexIndex) {
                    subMesh.useVertexIndex = element.useVertexIndex;
                }
                _mesh.submesh.push(subMesh);
            }
        }
        let vf = meshData.originVF;
        _mesh.data.originVF = vf;
        let v32 = meshData.tmpVArr;
        _mesh.data.vertexBufferData = meshData.tmpVArr;     //走二进制模式

        if (meshData.trisindex) {   
            //走二进制模式 trisindex 数据不需要填入（增加加了一份无用的内存占用）
            _mesh.data.triIndexBufferData = new Uint16Array(meshData.trisindex);
            // _mesh.data.trisindex = meshData.trisindex;
        } else {
            _mesh.data.triIndexBufferData = new Uint16Array();
            _mesh.data.trisindex = [];
        }

        if(_mesh.data.getTriIndexCount() > 65535){
            _mesh.data.triIndexUint32Mode = true;
        }
        // var v32 = _mesh.data.genVertexDataArray(vf);

        let i16 = _mesh.data.genIndexDataArray();
        // var i16 = _mesh.data.genIndexDataArray();
        _mesh.glMesh = new m4m.render.glMesh();

        // _mesh.maximun=new m4m.math.vector3();
        // _mesh.minimun=new m4m.math.vector3();

        _mesh.glMesh.initBuffer(webgl, vf, meshData.posCount);
        _mesh.glMesh.uploadVertexData(webgl, v32);
        _mesh.glMesh.addIndex(webgl, i16.length);
        _mesh.glMesh.uploadIndexData(webgl, 0, i16);
        _mesh.glMesh.initVAO();
        return _mesh;
    }
    public static createImageSetting(mainImgData, key: string, typekey: string, mat: m4m.framework.material) {
        let app = m4m.framework.sceneMgr.app;
        let _texture = new m4m.framework.texture(key);


        let _name: string = mainImgData.imageName;
        let _filterMode: string = mainImgData.filterMode;
        let _format: string = mainImgData.format;
        let _mipmap: boolean = mainImgData.mipmap;
        if (!_mipmap) {
            _mipmap = false;
        }
        let _wrap: string = mainImgData.wrap;
        let _premultiplyAlpha: boolean = mainImgData.premultiplyAlpha;

        if (_premultiplyAlpha == undefined) {
            _premultiplyAlpha = true;
        }
        let _textureFormat = m4m.render.TextureFormatEnum.RGBA;//这里需要确定格式
        if (_format == "RGB") {
            _textureFormat = m4m.render.TextureFormatEnum.RGB;
        } else if (_format == "Gray") {
            _textureFormat = m4m.render.TextureFormatEnum.Gray;
        }

        let _linear: boolean = true;
        if (_filterMode.indexOf("linear") < 0) {
            _linear = false;
        }

        let _repeat: boolean = false;
        if (_wrap.indexOf("Repeat") >= 0) {
            _repeat = true;
        }
        _texture.realName = _name;

        let imgKey = mainImgData.imageKey;

        let imgfileInfo = FileInfoManager.Instance.getFileByKey(imgKey);
        if (!imgfileInfo) {
            return;
        }
        let url = ExportManager.getFileUrl(imgfileInfo.relativePath);
        let tType = Creat3d.tNormal;
        if (url.indexOf(".pvr.bin") >= 0) {
            tType = Creat3d.tPVR;
        } else if (url.indexOf(".dds.bin") >= 0) {
            tType = Creat3d.tDDS;
        } else if (url.indexOf(".ktx") >= 0) {
            tType = Creat3d.tKTX;
        } else if (url.indexOf(".astc") >= 0) {
            tType = Creat3d.tASCT;
        }

        //构建贴图
        // console.error("=================================   " + url);
        // tslint:disable-next-line: switch-default
        // if (!this.loadImgMap.get(url)) {
        switch (tType) {
            case Creat3d.tNormal:
                let t2d = new m4m.render.glTexture2D(app.getAssetMgr().webgl, _textureFormat);
                m4m.io.loadImg(url, (img) => {
                    t2d.uploadImage(img, _mipmap, _linear, _premultiplyAlpha, _repeat);
                    _texture.glTexture = t2d;
                    mat.setTexture(typekey, _texture);
                    mat.statedMapUniforms[typekey]["valueKey"] = key;

                    mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
                });

                break;
            case Creat3d.tPVR:
                let pvr: testPvrParse = new testPvrParse(app.getAssetMgr().webgl);
                LoaderManager.Instance.load(url, (loader: Loader, img: any) => {

                    _texture.glTexture = pvr.parse(img as ArrayBuffer);
                    mat.setTexture(typekey, _texture);
                    mat.statedMapUniforms[typekey]["valueKey"] = key;
                    mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
                }, LoadType.ARRAYBUFFER);
                break;
            case Creat3d.tKTX:
                LoaderManager.Instance.load(url, (loader: Loader, img: any) => {
                    _texture.glTexture = KTXParse.parse(app.getAssetMgr().webgl, img as ArrayBuffer);
                    mat.setTexture(typekey, _texture);
                    mat.statedMapUniforms[typekey]["valueKey"] = key;
                    mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
                }, LoadType.ARRAYBUFFER);
                break;
            case Creat3d.tASCT:
                LoaderManager.Instance.load(url, (loader: Loader, img: any) => {
                    _texture.glTexture = m4m.framework.ASTCParse.parse(app.getAssetMgr().webgl, img as ArrayBuffer);
                    mat.setTexture(typekey, _texture);
                    mat.statedMapUniforms[typekey]["valueKey"] = key;
                    mat.statedMapUniforms[typekey]["imageKey"] = imgKey;
                }, LoadType.ARRAYBUFFER);
                break;
            case Creat3d.tDDS:
                throw new Error("暂不支持DDS");
            // assetMgr.webgl.pixelStorei(assetMgr.webgl.UNPACK_FLIP_Y_WEBGL, 1);
            // let textureUtil = new WebGLTextureUtil(assetMgr.webgl, true);
            // textureUtil.loadDDS(_textureSrc, null, (texture, error, stats) =>
            // {
            //     let t2d = new m4m.render.glTexture2D(assetMgr.webgl);
            //     t2d.format = m4m.render.TextureFormatEnum.PVRTC2_RGB;
            //     t2d.texture = texture;
            //     _texture.glTexture = t2d;
            // });
            // break;
            default:
        }
    }
    private static readonly allEnd = ".bin.js";
    private static readonly noClipEnd = "_split.bin.js";
    private static readonly noMeshEnd = "_Json.json";
    private static readonly meshEnd = "_Mesh.bin.js";
    private static readonly tNormal = "t_Normal";
    private static readonly tPVR = "t_PVR";
    private static readonly tDDS = "t_DDS";
    private static readonly tKTX = "t_KTX";
    private static readonly tASCT = "t_ASTC";
}