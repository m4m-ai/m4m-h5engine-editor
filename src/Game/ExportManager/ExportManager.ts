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
import { WebsocketTool } from "../../CodeEditor/code/WebsocketTool";
import { Loader } from "../../CodeEditor/loader/Loader";
import { LoadType, LoaderManager } from "../../CodeEditor/loader/LoaderManager";
import { Creat2d } from "../../CodeEditor/loader/otherPlan/Creat2d";
import { Creat3d } from "../../CodeEditor/loader/otherPlan/Creat3d";
import { testReadTool } from "../../CodeEditor/loader/otherPlan/testReadTool";
import { EditorApplication } from "../EditorApplication";
import { EditorSceneViewType } from "../Scene/EditorScene";
import { Utils } from "../Utils";
import { CmopFileManager } from "./CmopFileManager";
import { ExportNameList } from "./ExportNameList";
import { FileData } from "./FileData";

export class ExportManager {
    public static setProjectToken(token: string) {
        ExportManager.projectToken = token;
    }
    private static projectToken: string = "none";

    /**
     * 单文件上传, 如果上传成功, Response 的内容为文件的key
     * @param path 文件上传路径
     * @param buffer 文件内容
     */
    public static async uploadFile(path: string, buffer: Uint8Array): Promise<Response> {
        return fetch(EditorApplication.postServerUrl + "upload?token=" + ExportManager.projectToken + "&filename=" + path,
            {
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                method: "POST",
                body: buffer
            }
        );
    }
    public static getFileUrl(relativePath: string) {
        return EditorApplication.Instance.serverResourcesUrl + relativePath;
    }
    public static getClipByKey(key: string, pare: m4m.framework.aniplayer = null, callback: Function = null) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (!fileInfo) {
            return;
        }
        var getComp = CmopFileManager.Instance.getACompByKey(key);
        if (getComp) {
            if (pare) {
                pare.addClip(getComp);
            }
            if (callback) {
                callback(key);
            }
            return;
        }
        let url = ExportManager.getFileUrl(fileInfo.relativePath);
        let clip = new m4m.framework.animationClip();
        CmopFileManager.Instance.setACompByKey(key, clip);
        LoaderManager.Instance.load(url, (loader: Loader, bytes: any) => {
            var buffer = new Uint8Array(bytes);
            var dataList = testReadTool.testRead(buffer);
            if (!dataList || dataList.className != "Aniclip") {
                return;
            }
            clip = Creat3d.creatClip(dataList, clip, key);
            clip["_fileKey"] = key;
            if (pare) {
                pare.addClip(clip);
            }
            if (callback) {
                callback(key);
            }
        }, LoadType.ARRAYBUFFER);
    }
    public static getMeshByKey(key: string, pare: m4m.framework.skinnedMeshRenderer | m4m.framework.meshFilter = null, callback: Function = null) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (!fileInfo) {
            console.error("1111111111111111111111111111111111111111111  " + key);
            return;
        }
        var getComp = CmopFileManager.Instance.getACompByKey(key);
        if (getComp) {
            if (pare) {
                pare["meshKey"] = key;
                pare.mesh = getComp;
            }
            if (callback) {
                callback(key);
            }
            return;
        }
        let _mesh: m4m.framework.mesh = new m4m.framework.mesh(key + ".mesh.bin");
        CmopFileManager.Instance.setACompByKey(key, _mesh);
        let url = ExportManager.getFileUrl(fileInfo.relativePath);
        LoaderManager.Instance.load(url, (loader: Loader, bytes: any) => {
            var buffer = new Uint8Array(bytes);
            var dataList = testReadTool.testRead(buffer);
            if (!dataList || dataList.className != "Mesh") {
                return;
            }
            var mesh = Creat3d.createMesh(dataList, _mesh, m4m.framework.assetMgr.Instance.webgl);
            // console.error("111166666 " + mesh.getName() + "   " + key);
            mesh["_fileKey"] = key;
            if (pare) {
                pare["meshKey"] = key;
                pare.mesh = mesh;
            }
            if (callback) {
                callback(key);
            }
        }, LoadType.ARRAYBUFFER);
    }
    public static getMatByKey(key: string, pare: m4m.framework.skinnedMeshRenderer | m4m.framework.meshRenderer = null, callback: Function = null) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (!fileInfo) {
            return;
        }
        var getComp = CmopFileManager.Instance.getACompByKey(key);
        if (getComp) {
            if (pare) {
                if (!pare["materialsKey"]) {
                    pare["materialsKey"] = []
                }
                pare["materialsKey"].push(key);
                pare.materials.push(getComp);

            }
            if (callback) {
                callback(key);
            }
            return;
        }
        let url = ExportManager.getFileUrl(fileInfo.relativePath);
        let mat = new m4m.framework.material();
        CmopFileManager.Instance.setACompByKey(key, mat);
        LoaderManager.Instance.load(url, (loader: Loader, bytes: any) => {
            var buffer = new Uint8Array(bytes);
            var dataList = testReadTool.testRead(buffer);
            if (!dataList || dataList.className != "Mat") {
                return;
            }
            mat = Creat3d.setMat(dataList, mat);
            mat["_fileKey"] = key;
            if (pare) {
                // for (let index = 0; index < pare.materials.length; index++) {
                //     const element = pare.materials[index];
                //     if (element.getShader().getName() == "shader/def") {
                //         pare.materials.splice(index, 1);
                //         index--;
                //     }
                // }
                if (!pare["materialsKey"]) {
                    pare["materialsKey"] = []
                }
                pare["materialsKey"].push(key);

                pare.materials.push(mat);
            }
            if (callback) {
                callback(key);
            }
        }, LoadType.ARRAYBUFFER);
    }
    public static getImageSettingByKey(key: string, typekey: string, mat: m4m.framework.material) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (!fileInfo) {
            return;
        }

        let imageurl = ExportManager.getFileUrl(fileInfo.relativePath);
        LoaderManager.Instance.load(imageurl, (loader: Loader, bytes: any) => {
            var buffer = new Uint8Array(bytes);
            var mainImgData = testReadTool.testRead(buffer);
            if (!mainImgData || mainImgData.className != "ImageSetting") {
                return;
            }
            mainImgData["_fileKey"] = key;

            Creat3d.createImageSetting(mainImgData, key, typekey, mat);
        }, LoadType.ARRAYBUFFER);
    }
    public static loadFile(key: string, className: string, callback: Function = null) {
        switch (className) {
            case "Mesh":
                ExportManager.getMeshByKey(key, null, callback);
                break;
            case "Mat":
                ExportManager.getMatByKey(key, null, callback);
                break;
            case "Aniclip":
                ExportManager.getClipByKey(key, null, callback);
                break;
            case "Prefab":
                break;
            default:
                if (callback) {
                    callback(key);
                }
                break;
        }
    }
    public static test2(dirKey: string, fileName: string) {
        ExportNameList.Instance.init();
        var tran = EditorApplication.Instance.editorScene.getCurrentRoot();
        ExportManager.Creat3DPrefabByKey("79d536e47c404c148cd03b80a73a9810", tran);
        //ExportManager.Creat3DPrefabByKey("a46f901aa48a40fa8d1e2bb3318f8de5", tran);
        //setTimeout(() => {

        // var scene = EditorApplication.Instance.editorScene.scene;
        // var tran = EditorApplication.Instance.editorScene.getCurrentRoot();
        // dirKey = FileInfoManager.Instance.getKeyByPath("Scenes/test/");
        //fileName = "ttttbbiiiyyyy";
        // WebsocketTool.Instance.PrefabExport_exportScene(dirKey, fileName, JSON.stringify(ExportManager.getTranInfo(tran)), scene.fog);
        // }, 150000);

        // ExportManager.CreatSceneByKey("20c42715f3da4e2d90ec81da40b0a1f6");
    }
    public static exportScene(dirKey: string, fileName: string) {
        var scene = EditorApplication.Instance.editorScene.scene;
        var tran = EditorApplication.Instance.editorScene.getCurrentRoot();
        console.warn(tran);
        let transObj = ExportManager.getTranInfo(tran);
        console.error(transObj);
        WebsocketTool.Instance.PrefabExport_exportScene(dirKey, fileName, JSON.stringify(transObj), scene.fog);
    }
    public static CreatSceneByKey(jsonKey) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(jsonKey);
        if (!fileInfo) {
            return;
        }
        let tranUrl = ExportManager.getFileUrl(fileInfo.relativePath);
        if (!tranUrl) {
            return;
        }
        // console.error(tranUrl);
        //清理原场景
        EditorApplication.Instance.editorScene.clearScene();
        EditorApplication.Instance.editorScene.viewType = EditorSceneViewType.Scene;

        var pareTran = EditorApplication.Instance.editorScene.getCurrentRoot();
        //加载配置之前清掉 原缓存数据
        LoaderManager.Instance.removeLoader(tranUrl);
        LoaderManager.Instance.load(tranUrl, (loader: Loader, json: any) => {
            var prefabFileInfo = JSON.parse(json);
            // console.error(prefabFileInfo);
            var prefabKey = prefabFileInfo.prefabKey;
            var filesKey = prefabFileInfo.filesKey as { [key: string]: string };
            var scene = EditorApplication.Instance.editorScene.scene;
            if (prefabFileInfo.fog) {
                scene.fog = prefabFileInfo.fog;
            }
            if (filesKey) {
                var fileKeys = Object.keys(filesKey);
                var filesCount = fileKeys.length;
                let isDone = false;
                if (filesCount >= 0) {
                    for (let index = 0; index < fileKeys.length; index++) {
                        const key = fileKeys[index];

                        let className = filesKey[key];
                        ExportManager.loadFile(key, className, (file) => {
                            filesCount--;
                            delete filesKey[key];
                            if (filesCount <= 0 && !isDone) {
                                isDone = true;
                                ExportManager.Creat3DPrefab(prefabKey, pareTran, true);

                            }
                        });
                    }
                } else {
                    ExportManager.Creat3DPrefab(prefabKey, pareTran, true);
                }
            } else {
                ExportManager.Creat3DPrefab(prefabKey, pareTran, true);
            }
        });
    }
    public static export3dPrefab(dirKey: string, fileName: string, tran: m4m.framework.transform) {
        ExportNameList.Instance.init();
        WebsocketTool.Instance.PrefabExport_exportPrefab3D(dirKey, fileName, JSON.stringify(ExportManager.getTranInfo(tran)));
    }
    public static Creat3DPrefabByKey(jsonKey, pareTran: m4m.framework.transform) {
        //289718976a544db4995319bc9c0b5dde
        // let jsonKey = "8221c1ba0b1d45d89d35a87cebe7abc1";
        let fileInfo = FileInfoManager.Instance.getFileByKey(jsonKey);
        if (!fileInfo) {
            return;
        }
        let tranUrl = ExportManager.getFileUrl(fileInfo.relativePath);
        if (!tranUrl) {
            return;
        }
        //加载配置之前清掉 原缓存数据
        LoaderManager.Instance.removeLoader(tranUrl);
        LoaderManager.Instance.load(tranUrl, (loader: Loader, json: any) => {
            var prefabFileInfo = JSON.parse(json);
            var prefabKey = prefabFileInfo.prefabKey;
            var filesKey = prefabFileInfo.filesKey as { [key: string]: string };
            if (filesKey) {
                var filesCount = Object.keys(filesKey).length;
                let isDone = false;
                if (filesCount >= 0) {
                    for (const key in filesKey) {
                        let className = filesKey[key];
                        ExportManager.loadFile(key, className, (file) => {
                            filesCount--;
                            if (filesCount <= 0 && !isDone) {
                                isDone = true;
                                ExportManager.Creat3DPrefab(prefabKey, pareTran, false);
                            }
                        });
                    }
                } else {
                    ExportManager.Creat3DPrefab(prefabKey, pareTran, true);
                }
            } else {
                ExportManager.Creat3DPrefab(prefabKey, pareTran, true);
            }
        });
    }

    public static Creat3DPrefab(prefabKey: string, pareTran: m4m.framework.transform, isScene: boolean) {


        ExportNameList.Instance.init();
        // let prefabKey = "ceff920f83bd47b5aedac03b9d6211c8";
        // let pareTran = EditorApplication.Instance.editorScene.getCurrentRoot();
        let fileInfo = FileInfoManager.Instance.getFileByKey(prefabKey);
        if (!fileInfo) {
            return;
        }
        let tranUrl = ExportManager.getFileUrl(fileInfo.relativePath);
        //加载配置之前清掉 原缓存数据
        LoaderManager.Instance.removeLoader(tranUrl);
        LoaderManager.Instance.load(tranUrl, (loader: Loader, bytes: any) => {
            var buffer = new Uint8Array(bytes);
            var dataList = testReadTool.testRead(buffer);
            if (!dataList) {
                return;
            }
            let insidMap: { [key: number]: any } = {};
            let trans = Creat3d.makeAPrefab(dataList, insidMap);
            trans["prefabKey"] = prefabKey;
            //组装material
            //添加Prefab上的组件
            Creat3d.setCompsToTran(trans, dataList, insidMap);
            if (!isScene) {
                pareTran.addChild(trans);
                // setTimeout(() => {
                //     console.error(trans);
                // }, 2000);
            } else {
                let children: m4m.framework.transform[] = [];
                for (const key in trans.children) {
                    children.push(trans.children[key]);
                }
                trans.removeAllChild();
                for (let index = 0; index < children.length; index++) {
                    const element = children[index];
                    pareTran.addChild(element);
                    // setTimeout(() => {

                    //     console.error(element);
                    // }, 20000);
                }
                let mainCamTrans: m4m.framework.transform = pareTran.find("MainCamera");
                let mainCam = mainCamTrans.gameObject.getComponent("camera") as m4m.framework.camera;
                if (mainCam) {
                    //如果是主相机 暂设置隐藏
                    mainCam.gameObject.visible = false;
                    // console.error(mainCam);
                }
            }
        }, LoadType.ARRAYBUFFER);
    }
    /**
     * 多文件上传
     * @param files 文件列表
     * @param callback 服务器响应回调, response: 请求响应数据, index: 当前文件索引, count: 文件总数
     * @param finish 所有文件上传完成后回调
     */
    public static async uploadFiles(files: FileData[], callback?: (response: Response, index: number, count: number) => Promise<void>, finish?: () => void): Promise<void> {
        let count = files.length;
        for (let i = 0; i < count; i++) {
            let file = files[i];
            let res = await this.uploadFile(file.path, file.buffer);
            callback && await callback(res, i, count);
        }
        finish && finish();
    }

    public static test(dirKey: string) {
        var aaa = EditorApplication.Instance.editorScene.canvasRenderer.canvas.getRoot().children[0];
        var bbb = ExportManager.getUiTranInfo(aaa);
        WebsocketTool.Instance.PrefabExport_exportPrefab2D(dirKey, "aaaa", JSON.stringify(bbb));
        // ExportNameList.Instance.init();
        // var aaa = EditorApplication.Instance.editorScene.getCurrentRoot().children[0];
        // var bbb = ExportManager.getTranInfo(aaa);
        // WebsocketTool.Instance.PrefabExport_testExport(JSON.stringify(bbb));
    }
    public static export2dPrefab(dirKey: string, fileName: string, prefab2D: m4m.framework.transform2D) {
        ExportNameList.Instance.init();
        let prefab2DInfo = ExportManager.getUiTranInfo(prefab2D)
        let prefab2DJson = JSON.stringify(prefab2DInfo);
        WebsocketTool.Instance.PrefabExport_exportPrefab2D(dirKey, fileName, prefab2DJson);
    }
    public static getPrefab2DByKey(key: string, pare: m4m.framework.transform2D) {
        ExportNameList.Instance.init();
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (!fileInfo) {
            return;
        }
        let url = ExportManager.getFileUrl(fileInfo.relativePath);
        LoaderManager.Instance.load(url, (loader: Loader, res: any) => {
            let tran = ExportManager.getPrefab2DByBuffer(res);
            if (!tran) {
                return;
            }
            tran["prefabKey"] = key;
            if (pare) {
                pare.addChild(tran);
            }
        }, LoadType.ARRAYBUFFER);
    }

    public static getPrefab2DByBuffer(bytes: ArrayBuffer) {
        var buffer = new Uint8Array(bytes);
        var tranInfo = testReadTool.testRead(buffer);
        if (!tranInfo) {
            return null;
        }
        var tran = Creat2d.create(tranInfo);
        return tran;
    }
    private static isExport(setName: string) {
        switch (setName) {
            case "_spriteName":
            case "_fontName":
                return setName;
            default:
                break;
        }
        if (setName.startsWith("_")) {
            setName = setName.slice(1);
        }
        switch (setName) {
            case "transform":
            case "targetImage":
            case "UIEventer":
            case "sprite":
            case "datar":
            case "uimat":
            case "update":
            case "max_x":
            case "max_y":
            case "min_x":
            case "min_y":
            case "data_begin":
            case "imgDatar":
            case "font":
            case "imgUIMat":
            case "uimat":
            case "originalSprite":
            case "image":
            case "_gdmeta__":
                return "";
            default:
                break;
        }
        return setName;
    }
    private static getUiTranInfo(tran) {
        let tranInfo = {};
        tranInfo["layer"] = tran.layer;
        tranInfo["tag"] = tran.tag;
        tranInfo["tranName"] = tran.name;
        tranInfo["isStatic"] = tran.isStatic;
        tranInfo["width"] = tran.width;
        tranInfo["height"] = tran.height;
        tranInfo["pivot"] = tran.pivot;
        tranInfo["_visible"] = tran["_visible"];
        tranInfo["localTranslate"] = tran.localTranslate;
        let ts = tranInfo["localTranslate"];
        if (ts) {
            for (const key in ts) {
                const element = ts[key];
                ts[key] = Math.floor(element);
            }
        }
        tranInfo["localScale"] = tran.localScale;
        tranInfo["localRotate"] = tran.localRotate;
        tranInfo["isMask"] = tran.isMask;
        tranInfo["layoutState"] = tran.layoutState;
        tranInfo["layoutPercentState"] = tran.layoutPercentState;
        tranInfo["layoutValueMap"] = tran["layoutValueMap"];
        let layoutValueMap = tranInfo["layoutValueMap"];
        if (layoutValueMap) {
            for (const key in layoutValueMap) {
                const element = layoutValueMap[key];
                layoutValueMap[key] = Math.floor(element);
            }
        }
        tranInfo["insid"] = tran.insId.getInsID();
        let components = [];
        tranInfo["components"] = components;
        let componentsList = {};

        for (const key in tran.components) {
            let comp = tran.components[key];
            let className = Utils.getName(comp.comp);
            let compOut = {};
            compOut["className"] = className;
            for (const key2 in comp.comp) {
                let outPName = this.isExport(key2);
                if (outPName) {
                    const element = comp.comp[key2];
                    if (element && typeof (element) != "function") {
                        if (outPName == "_fontName" && comp.comp["font"]) {
                            compOut[outPName] = comp.comp["font"]["fontname"];
                        } else {
                            compOut[outPName] = element;
                        }
                    }
                }
            }
            switch (className) {
                case "image2D":
                    if (comp.comp["_sprite"]) {
                        if (comp.comp._sprite._ref) {
                            if (comp.comp._sprite._ref.key) {
                                compOut["fileKey"] = comp.comp._sprite._ref.key;
                            } else if (comp.comp._sprite._ref.guid) {
                                compOut["fileKey"] = comp.comp._sprite._ref.guid;
                            } else {
                                compOut["_spriteName"] = comp.comp._sprite._spriteName;
                            }
                        }
                        compOut["image"] = comp.comp._sprite.name.name;
                    }
                    break;
                case "rawImage2D":
                    if (comp.comp["_image"]) {
                        if (comp.comp._image._ref) {
                            compOut["fileKey"] = comp.comp._image._ref.key;
                        }
                        compOut["image"] = comp.comp._image.name.name;
                    }
                    break;

                default:
                    break;
            }
            componentsList[JSON.stringify(compOut)] = className;
        }
        tranInfo["componentsList"] = componentsList;
        let children: any[] = [];
        for (const key in tran.children) {
            let child = tran.children[key];
            if (child["prefabKey"]) {
                children.push({ prefabKey: child["prefabKey"] });
            } else {
                children.push(ExportManager.getUiTranInfo(child));
            }
        }
        tranInfo["children"] = children;
        return tranInfo;
    }
    private static getACompInfo(element, keyName: string) {
        let campInfo = {};
        if (element["_fileKey"]) {
            campInfo["fileKey"] = element["_fileKey"];
            return campInfo;
        }
        switch (keyName) {
            case "clips":
                campInfo["fileName"] = element.name.name;
                break;
            case "_mesh":
                campInfo["meshName"] = element.name.name;
                // _mesh.data.trisindex = meshData.trisindex;   //triIndexBufferData给了， 这里不需要了
                if (element.data) {
                    campInfo["originVF"] = element.data.originVF;
                    let triIndexBufferData = [];
                    for (const key in element.data.triIndexBufferData) {
                        const v = element.data.triIndexBufferData[key];
                        triIndexBufferData.push(v);
                    }
                    if (triIndexBufferData.length == 0) {
                        campInfo["trisindex"] = element.data.trisindex;
                    } else {
                        campInfo["trisindex"] = triIndexBufferData;
                    }

                    let vertexBufferData = [];
                    for (const key in element.data.vertexBufferData) {
                        const v = element.data.vertexBufferData[key];
                        vertexBufferData.push(v);
                    }
                    campInfo["tmpVArr"] = vertexBufferData;
                    campInfo["position"] = element.data.pos;
                    campInfo["color"] = element.data.color;
                    campInfo["colorex"] = element.data.colorex;
                    campInfo["normal"] = element.data.normal;
                    campInfo["UV0"] = element.data.uv;
                    campInfo["UV1"] = element.data.uv2;
                    campInfo["tangent"] = element.data.tangent;
                    campInfo["blendIndex"] = element.data.blendIndex;
                    campInfo["blendWeight"] = element.data.blendWeight;
                }
                if (element.glMesh) {
                    campInfo["posCount"] = element.glMesh.indexCount;

                }
                campInfo["bounds"] = element["bounds"];
                campInfo["colorex"] = element["colorex"];
                campInfo["vec10tpose"] = element["vec10tpose"];
                campInfo["subMesh"] = element["submesh"];
                campInfo["minimum"] = element["minimun"];
                campInfo["maximum"] = element["maximun"];
                break;
            case "materials":
                campInfo["fileName"] = element.name.name;
                if (element["_shaderKey"]) {
                    campInfo["shaderKey"] = element["_shaderKey"];
                } else {
                    campInfo["shader"] = element["shader"].name.name;
                }
                campInfo["queue"] = element["queue"];
                let mapUniformsInfo = element["statedMapUniforms"];
                let mapUniforms = {};
                for (const key in mapUniformsInfo) {
                    let element = mapUniformsInfo[key];
                    let newUniform = {};
                    if (key.indexOf("Tex") == -1) {
                        switch (key) {
                            case "_AlphaCut":
                                newUniform["type"] = 1;
                                newUniform["value"] = element.toString();
                                break;
                            case "_MainColor":
                                newUniform["type"] = 3;
                                newUniform["value"] = "(" + element.x + "," + element.y + "," + element.z + "," + element.w + ")";
                                break;
                            default:
                                break;
                        }
                    } else {
                        newUniform["type"] = 0;
                        newUniform["value"] = element._realName;
                        newUniform["valueKey"] = element["valueKey"];
                        newUniform["valueInfo"] = ExportManager.getACompInfo(element, "ImageSetting");
                    }
                    mapUniforms[key] = newUniform;
                }
                campInfo["mapUniform"] = mapUniforms;
                break;
            case "ImageSetting":
                campInfo["imageName"] = element["_realName"];
                campInfo["imageKey"] = element["imageKey"];
                if (!campInfo["imageKey"] && element.bundle) {
                    let url: string = element.bundle.baseUrl;
                    url = url.replaceAll("//", "/").replaceAll("http:/", "http://").replace(EditorApplication.Instance.serverResourcesUrl, "");
                    url += "resources/" + campInfo["imageName"];
                    campInfo["imageKey"] = FileInfoManager.Instance.getKeyByPath(url);
                }
                let glTexture = element["glTexture"];
                if (glTexture != null) {
                    let filterMode = "Bilinear";
                    if (!glTexture.linear) {
                        filterMode = "no";
                    }
                    campInfo["filterMode"] = filterMode;
                    campInfo["mipmap"] = glTexture.mipmap;
                    let _wrap = "Repeat";
                    if (!glTexture.repeat) {
                        _wrap = "no";
                    }
                    campInfo["wrap"] = _wrap;
                    let _textureFormat = "RGBA";//这里需要确定格式
                    if (glTexture.format == m4m.render.TextureFormatEnum.RGB) {
                        _textureFormat = "RGB";
                    } else if (glTexture.format == m4m.render.TextureFormatEnum.Gray) {
                        _textureFormat = "Gray";
                    }
                    campInfo["format"] = _textureFormat;
                }
                break;
            default:
                break;
        }
        return campInfo;
    }
    private static getTranInfo(tran) {
        let tranInfo = {};
        tranInfo["tranName"] = tran.name;
        tranInfo["localRotate"] = tran.localRotate;
        tranInfo["localTranslate"] = tran.localTranslate;
        tranInfo["localScale"] = tran.localScale;
        tranInfo["insid"] = tran.insId.getInsID();
        let gameObject = {};
        gameObject["layer"] = tran.gameObject.layer;
        gameObject["tag"] = tran.gameObject.tag;
        gameObject["visible"] = tran.gameObject.visible;
        let componentsList = {};

        // console.error(tran.name + "   " + tran.gameObject.components.length);
        for (const key in tran.gameObject.components) {
            let comp = tran.gameObject.components[key];
            let className = Utils.getName(comp.comp);
            let compOut = {};
            compOut["className"] = className;
            // console.error("className  " + className);
            let nameList = ExportNameList.Instance.exportList.get(className);
            if (!nameList) {
                continue;
            }
            nameList.forEach((outPName, key2) => {
                const element = comp.comp[key2];
                if (element) {
                    switch (outPName) {
                        case 2:
                            compOut[key2] = element.insId.getInsID();
                            break;
                        case 3:
                            let insidList: any[] = [];
                            for (const key3 in element) {
                                insidList.push(element[key3].insId.getInsID());
                            }
                            compOut[key2] = insidList;
                            break;
                        case 4:
                            compOut[key2] = ExportManager.getACompInfo(element, key2.toString());
                            break;
                        case 5:
                            let insidList2: any[] = [];
                            for (const key3 in element) {
                                insidList2.push(ExportManager.getACompInfo(element[key3], key2.toString()));
                            }
                            compOut[key2] = insidList2;
                            break;
                        default:
                            compOut[key2] = element;
                            break;
                    }
                }
            });
            // for (const key2 in comp.comp) {
            //     let outPName = ExportNameList.Instance.isExport(className, key2);

            // }
            componentsList[JSON.stringify(compOut)] = className;
        }
        gameObject["componentsList"] = componentsList;
        tranInfo["gameObject"] = gameObject;

        let children: any[] = [];
        for (const key in tran.children) {
            let child = tran.children[key];
            if (child.gameObject.tag == "Ui") {
                // console.error(child.name);
                continue;
            }
            children.push(ExportManager.getTranInfo(child));
        }
        tranInfo["children"] = children;
        return tranInfo;
    }
}