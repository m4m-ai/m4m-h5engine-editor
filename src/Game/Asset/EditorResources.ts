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
import IEditorCode = m4m.framework.IEditorCode;
import font = m4m.framework.font;
import {EditorApplication} from "../EditorApplication";
import {EditorEventMgr} from "../Event/EditorEventMgr";
import {TexturePackerData} from "./TexturePackerData";
import {TexturePackerResult} from "./TexturePackerResult";
import sprite = m4m.framework.sprite;
import {AtlasReference} from "./AssetReference";
import {FileInfoManager} from "../../CodeEditor/code/FileInfoManager";
import {EditorComponentMgr} from "../Component/EditorComponentMgr";
import {EditorAssetInfo} from "./EditorAssetInfo";
import {ExportManager} from "../ExportManager/ExportManager";

export class EditorResources implements IEditorCode {

    /**
     * 默认字体
     */
    public defaultFont: font;
    
    //private currUserSceneInst: any;
    
    private tsRefreshTimer: number = 0;
    private isTsRealoading: boolean = false;
    
    isClosed(): boolean {
        return false;
    }

    onStart(app: m4m.framework.application): any {
        EditorEventMgr.Instance.addEventListener("OnTexturePackerSave", (datas) => {
            console.log("监听到贴图数据合并: ", datas);
        });
        //ts代码编译成功
        EditorEventMgr.Instance.addEventListener("OnTsCompileSuccess", () => {
            //console.log("ts代码编译成功!");
            //2秒后更新代码
            this.tsRefreshTimer = 2;
        });
    }

    onUpdate(delta: number): any {
        let ea = EditorApplication.Instance;
        
        //重载代码直接这样调用会出问题, 后续需要修复
        if (!this.isTsRealoading && this.tsRefreshTimer > 0 && !ea.isPlay) {
            this.tsRefreshTimer -= delta;
            if (this.tsRefreshTimer <= 0) {
                console.log("开始重载用户脚本代码");
                this.reloadUserCode("Code/Lib/node_modules/@types/code.js");
            }
        }
    }

    /**
     * 重新加载用户代码
     */
    public reloadUserCode(path: string) {
        this.existFile(path, (result) => {
            if (result) {
                this.isTsRealoading = true;
                this.loadFile(path, "string", (result) => {
                    //先卸载之前已经加载好的模块
                    let keys = Object.keys(System.models);
                    for (let key of keys) {
                        let model = System.models[key];
                        if (model.____assembly____ == path) {
                            let modelKeys = Object.keys(model);
                            for (let modelKey of modelKeys) {
                                delete model[modelKey];
                            }
                            console.log("卸载模块: ", key);
                            delete System.models[key];
                        }
                    }
                    //卸载组件
                    EditorComponentMgr.uninstallComponents(path);
                    
                    let context = result as string;
                    System.startRecord(path);
                    //执行代码
                    eval(context);
                    System.overRecord();
                    System.init();
                    
                    //更新所有组件数据
                    EditorComponentMgr.refreshComponents(path);
                    //通知编辑器重新挂载脚本
                    EditorEventMgr.Instance.emitEvent("OnRemountComponent", cb => cb());
                    this.isTsRealoading = false;
                }, error => {
                    console.error(`脚本"${path}"更新失败: `, error);
                    this.isTsRealoading = false;
                });
            } else {
                console.log('没有用户脚本');
            }
        });
        
    }
    
    /**
     * 初始化基础资源
     */
    public async initDefaultResources() {
        await this.loadAsset("resource/font/方正粗圆_GBK.TTF.png");
        await this.loadAsset("resource/font/方正粗圆_GBK.font.json");
        await this.loadAsset("resource/icon/axis_1.png");
        await this.loadAsset("resource/icon/axis_2.png");
        await this.loadAsset("resource/icon/axis_3.png");
        await this.loadAsset("resource/icon/axis_4.png");
        await this.loadAsset("resource/icon/axis_5.png");
        await this.loadAsset("resource/shader/shader.assetbundle.json");
        this.defaultFont = EditorApplication.Instance.assetMgr.getAssetByName("方正粗圆_GBK.font.json");
    }

    /**
     * 检测是否存在文件
     * @param path 文件路径
     * @param callback 回调
     */
    public existFile(path: string, callback: (result: boolean) => void) {
        let url = EditorApplication.Instance.serverResourcesUrl + path;
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        }
        xhr.send(null);
    }

    /**
     * 异步下载文件, 回调形式返回数据
     * @param path 文件路径
     * @param type 下载的数据类型
     * @param success 下载成功回调
     * @param fail 失败回调
     */
    public loadFile(path: string, type: "string" | "buffer" = "buffer", success: (result: string | ArrayBuffer) => void, fail?: (error: any) => void) {
        let url = EditorApplication.Instance.serverResourcesUrl + path;
        if (type == "string") {
            m4m.io.loadText(url, (_txt, _err, isloadFail) => {
                if (isloadFail) {
                    fail && fail(_err);
                } else {
                    success(_txt);
                }
            });
        } else {
            m4m.io.loadArrayBuffer(url, (_txt, _err, isloadFail) => {
                if (isloadFail) {
                    fail && fail(_err);
                } else {
                    success(_txt);
                }
            });
        }
    }

    /**
     * 异步下载文件, 以Promise形式返回数据
     * @param path 文件路径
     * @param type 返回数据类型
     */
    public loadFilePromise(path: string, type: "string" | "buffer" = "buffer"): Promise<string | ArrayBuffer> {
        return new Promise<string | ArrayBuffer>((resolve, reject) => {
            this.loadFile(path, type, result => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * 根据文件key异步下载文件, 回调形式返回数据
     * @param key 文件唯一key
     * @param type 下载的数据类型
     * @param success 下载成功回调
     * @param fail 失败回调
     */
    public loadFileByKey(key: string, type: "string" | "buffer" = "buffer", success: (result: string | ArrayBuffer) => void, fail?: (error: any) => void) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (fileInfo != null) {
            this.loadFile(fileInfo.relativePath, type, success, fail);
        } else {
            fail && fail(`没有找到key: '${key}'对应的文件!`);
        }
    }

    /**
     * 根据文件key异步下载文件, 以Promise形式返回数据
     * @param key 文件唯一key
     * @param type 下载的数据类型
     */
    public loadFileByKeyPromise(key: string, type: "string" | "buffer" = "buffer"): Promise<string | ArrayBuffer> | null {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (fileInfo != null) {
            return this.loadFilePromise(fileInfo.relativePath, type);
        }
    }

    /**
     * 根据文件key加载texture
     * @param key
     */
    public loadTextureByKeyPromise(key: string): Promise<m4m.framework.texture> {
        return new Promise<m4m.framework.texture>((resolve, reject) => {
            let fileInfo = FileInfoManager.Instance.getFileByKey(key);
            if (fileInfo) {
                this.loadTexture(fileInfo.relativePath, (tex) => {
                    resolve(tex);
                }, (e) => {
                    reject(e);
                });
            }
        })
    }

    /**
     * 根据文件key加载texture
     * @param key
     * @param success
     * @param fail
     */
    public loadTextureByKey(key: string, success: (tex: m4m.framework.texture) => void, fail?: (error: any) => void) {
        let fileInfo = FileInfoManager.Instance.getFileByKey(key);
        if (fileInfo) {
            this.loadTexture(fileInfo.relativePath, success, fail);
        } else {
            fail && fail(new Error(`没有找到key: '${key}'对应的文件!`));
        }
    }

    /**
     * 根据文件路径加载texture
     * @param url
     * @param success
     * @param fail
     */
    public loadTexture(url: string, success: (tex: m4m.framework.texture) => void, fail?: (error: any) => void) {
        url = EditorApplication.Instance.serverResourcesUrl + url;
        m4m.io.loadImg(url, (_tex, err) => {
            if (err) {
                if (fail) {
                    fail(err);
                }
            } else {
                //构建 img
                let _texture = new m4m.framework.texture(url.substring(url.lastIndexOf("/") + 1));
                let _textureFormat = m4m.render.TextureFormatEnum.RGBA;//这里需要确定格式
                let t2d = new m4m.render.glTexture2D(m4m.framework.sceneMgr.app.webgl, _textureFormat);
                t2d.uploadImage(_tex, false, true, false, false, false); //非2次幂 图 不能显示设置repeat
                _texture.glTexture = t2d;
                _texture.use();

                delete m4m.framework.assetMgr.mapImage[url];
                delete m4m.framework.assetMgr.mapLoading[url];

                success(_texture);
            }
        });
    }
    
    /**
     * 获取精灵资源
     * @param atlas
     * @param useCache
     * @param callback
     */
    public getSpriteReference(atlas: AtlasReference, useCache: boolean, callback: (sp: sprite) => void) {
        if (atlas == null) {
            callback(null);
            return;
        }
        if (atlas.guid == null || atlas.guid.length === 0) {
            //直接加载texture, 并转为 sprite
            this.loadTextureByKey(atlas.key, (tex) => {
                let _sprite = new sprite();
                let ref: AtlasReference = {
                    key: atlas.key,
                    guid: atlas.guid,
                }
                _sprite["_ref"] = ref;
                _sprite.texture = tex;
                _sprite.border = new m4m.math.border(0,0,0,0);
                _sprite.rect = new m4m.math.rect(0,0,tex.glTexture.width, tex.glTexture.height);
                callback(_sprite);
            }, () => {
                callback(null);
            })
        } else {
            //加载图集
            let file = FileInfoManager.Instance.getFileByKey(atlas.key);
            if (file == null) {
                callback(null);
                return;
            }
            this.loadFile(file.relativePath, "string", (result) => {
                let text = result as string;
                let atlasObject = JSON.parse(text);

                let frames: any[] = atlasObject.frames;
                for (const frame of frames) {
                    if (frame.filename == atlas.guid) {
                        //new sprite();
                        //加载贴图
                        this.loadTexture(file.relativePath.substring(0, file.relativePath.length - 6) + ".png", (texture) => {
                            var _sprite = new sprite();
                            let ref: AtlasReference = {
                                key: atlas.key,
                                guid: atlas.guid,
                            }
                            _sprite["_ref"] = ref;
                            _sprite.texture = texture;
                            _sprite.border = new m4m.math.border(0, 0, 0, 0);
                            _sprite.rect = new m4m.math.rect(frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h);
                            callback(_sprite);
                        }, () => {
                            callback(null);
                        })
                        return;
                    }
                }
            }, () => {
                callback(null);
            });
        }
    }

    /**
     * 传入texture的id, 调用打包图集工具
     * @param keys 图片id
     * @param callback 回调函数
     */
    public texturePackerByKeys(keys: string[], callback: (result: TexturePackerResult[]) => void) {
        (async () => {
            let texture: {
                path: string;
                key: string;
                buffer: Uint8Array;
            }[] = [];

            for (let key of keys) {
                let file = FileInfoManager.Instance.getFileByKey(key);
                let buffArray = await this.loadFilePromise(file.relativePath, "buffer") as ArrayBuffer;
                texture.push({
                    path: file.relativePath,
                    key: file.key,
                    buffer: new Uint8Array(buffArray)
                });
            }
            this.texturePacker({texture}, callback);
        })();
    }
    
    /**
     * 选中编辑器中的特殊资源文件
     * @param fileName 文件名称
     * @param path 文件路径, 相对于 Contents 的路径
     * @param assetInfo 该文件的描述对象
     */
    public selectFile(fileName: string, path: string, assetInfo: EditorAssetInfo) {
        //console.log("selectFile: ", fileName, path, meta);
    }

    /**
     * 打开编辑器中的文件 (双击), 需要执行异步操作
     * @param assetInfo 该文件的描述对象
     */
    public async openFile(assetInfo: EditorAssetInfo): Promise<void> {
        if (EditorApplication.Instance.isPlay) {
            return;
        }
        if (!assetInfo.isLeaf && assetInfo.meta) {
            let dataData = JSON.parse(assetInfo.meta);

            let ea = EditorApplication.Instance;
            if (dataData.DirectoryType == "scene") { //打开场景 (老一套加载方式)
                // if (this.currUserSceneInst) {
                //     this.currUserSceneInst.close();
                //     this.currUserSceneInst = null;
                // }
                if (dataData.ResName) {
                    await this.openScene(ea.serverResourcesUrl + "Art/" + assetInfo.relativePath, dataData.ResName);
                } else {
                    //打开空场景
                    ea.editorScene.openEmptyScene();
                }
                //加载脚本
                let scriptPath: string = dataData.Script;
                if (scriptPath) {
                    let p = "Code/Src/";
                    let index = scriptPath.indexOf(p);
                    if (index > -1) {
                        scriptPath = scriptPath.substring(index + p.length);
                    }
                    index = scriptPath.indexOf(".");
                    if (index > -1) {
                        scriptPath = scriptPath.substring(0, index);
                    }
                    
                    let sl = scriptPath.split("/");
                    let clsName = sl[sl.length - 1];

                    let cls = System.get(scriptPath)[clsName];
                    ea.editorScene.currUserSceneClass = cls;
                    if (!cls) {
                        console.error("加载场景时没有找到对应的类: " + scriptPath);
                    }
                }
            } else if (dataData.DirectoryType == "prefab") { //打开prefab (老一套加载方式)
                // if (this.currUserSceneInst) {
                //     this.currUserSceneInst.close();
                //     this.currUserSceneInst = null;
                // }
                //await this.openPrefab(ea.serverResourcesUrl + "Art/" + path, dataData.ResName);
            } else if (dataData.DirectoryType == "Scene3D") { //打开场景, 新方式
                // console.error("打开场景 "+assetInfo.value + ".json");
                let configJson = assetInfo.childrenFile.find(value => value.value == assetInfo.value + ".json");
                if (configJson) {
                    // console.error("打开场景 "+configJson.key);
                    ExportManager.CreatSceneByKey(configJson.key);
                }
            }
        }
    }
    
    /**
     * 异步加载资源
     * @param url 资源路径
     */
    public loadAsset(url: string): Promise<m4m.framework.stateLoad> {
        return new Promise<m4m.framework.stateLoad>((resolve, reject) => {
            EditorApplication.Instance.engineApp.getAssetMgr().load(url, m4m.framework.AssetTypeEnum.Auto, (s) => {
                if (s && s.isfinish) {
                    resolve(s);
                } else {
                    reject();
                }
            });
        });
    }
    
    /**
     * 打开预制体
     */
    public openPrefab(psth: string, resName: string) {
        let ea = EditorApplication.Instance;
        ea.assetMgr.load(psth + "/" + resName + ".assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s1) => {
            if (s1.isfinish) {
                var prefab = ea.assetMgr.getAssetByName<m4m.framework.prefab>(resName + ".prefab.json", resName + ".assetbundle.json");

                ea.editorScene.previewPrefab(prefab);

                //清除资源
                ea.assetMgr.unload(psth + "/" + resName + ".assetbundle.json");
            }
        });
    }

    /**
     * 打开场景
     * @param path 路径
     * @param resName 资源名
     */
    public openScene(path: string, resName: string): Promise<void> {
        console.log("openScene", path, resName)
        return new Promise((resolve, reject) => {
            let ea = EditorApplication.Instance;
            ea.assetMgr.load(path + "/" + resName + ".assetbundle.json", m4m.framework.AssetTypeEnum.Auto, (s1) => {
                if (s1.isfinish) {
                    var rawscene = ea.assetMgr.getAssetByName<m4m.framework.rawscene>(resName + ".scene.json", resName + ".assetbundle.json");

                    if (rawscene) {
                        ea.editorScene.changeScene(rawscene);

                        //清除资源
                        ea.assetMgr.unload(path + "/" + resName + ".assetbundle.json");

                        EditorEventMgr.Instance.emitEvent("OnSceneOpenSuccess", cb => cb());
                        resolve();
                    } else {
                        console.error(`资源: '${path}/${resName}', 不是一个有效的场景资源`);
                        reject();
                    }
                } else {
                    reject();
                }
            });
        });
    }

    /**
     * 传入图片二进制数据, 调用打包图集工具
     * @param data 传入图片数据
     * @param callback 成功时的回调函数
     */
    private texturePacker(data: TexturePackerData, callback: (result: TexturePackerResult[]) => void): void {
        EditorEventMgr.Instance.emitEvent("CallTexturePacker", cb => cb(data, callback));
    }
}