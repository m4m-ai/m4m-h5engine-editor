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
import { cMap } from "../../CodeEditor/code/Map";

export class ExportNameList {
    public static get Instance(): ExportNameList {
        if (this._instance == null) {
            this._instance = new ExportNameList();
        }

        return this._instance;
    }
    /**********是否需要请求 配置数据***********
    */
    private static _instance: ExportNameList;
    private isInit = false;
    public exportList: cMap<cMap<number>> = new cMap();
    public isExport(compName: string, proName: string) {
        let nameList = this.exportList.get(compName);
        if (!nameList) {
            return 0;
        }
        return nameList.get(proName);
    }
    public init() {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        let f4skinnedMeshRenderer:cMap<number> = new cMap<number>();
        f4skinnedMeshRenderer.set("materials",5);
        f4skinnedMeshRenderer.set("center",1);
        f4skinnedMeshRenderer.set("size",1);
        f4skinnedMeshRenderer.set("ibmContainer",1);
        f4skinnedMeshRenderer.set("mesh",4);
        f4skinnedMeshRenderer.set("rootBone",2);
        f4skinnedMeshRenderer.set("bones",3);
        this.exportList.set("f4skinnedMeshRenderer", f4skinnedMeshRenderer);

        let boxcollider: cMap<number> = new cMap<number>();
        boxcollider.set("center",1);
        boxcollider.set("size",1);
        this.exportList.set("boxcollider", boxcollider);

        let aniplayer: cMap<number> = new cMap<number>();
        aniplayer.set("clips",5);
        aniplayer.set("clipKeys",2);
        aniplayer.set("bones",1);
        aniplayer.set("startPos",1);
        aniplayer.set("animNames",1);
        this.exportList.set("aniplayer", aniplayer);

        let skinnedMeshRenderer: cMap<number> = new cMap<number>();
        skinnedMeshRenderer.set("materials",5);
        skinnedMeshRenderer.set("materialsKey",1);
        skinnedMeshRenderer.set("center",1);
        skinnedMeshRenderer.set("size",1);
        skinnedMeshRenderer.set("_mesh",4);
        skinnedMeshRenderer.set("meshKey",1);
        skinnedMeshRenderer.set("rootBone",2);
        skinnedMeshRenderer.set("bones",3);
        skinnedMeshRenderer.set("player",2);
        this.exportList.set("skinnedMeshRenderer", skinnedMeshRenderer);

        let meshFilter: cMap<number> = new cMap<number>();
        meshFilter.set("_mesh",4);
        meshFilter.set("meshKey",1);
        this.exportList.set("meshFilter", meshFilter);

        
        let meshRenderer: cMap<number> = new cMap<number>();
        meshRenderer.set("materials",5);
        meshRenderer.set("materialsKey",1);
        meshRenderer.set("lightmapIndex",1);
        meshRenderer.set("lightmapScaleOffset",1);
        meshRenderer.set("layer",1);
        this.exportList.set("meshRenderer", meshRenderer);

        let meshcollider: cMap<number> = new cMap<number>();
        this.exportList.set("meshcollider", meshcollider);

        let asbone: cMap<number> = new cMap<number>();
        this.exportList.set("asbone", asbone);

        let godray: cMap<number> = new cMap<number>();
        this.exportList.set("godray", godray);

        let particlesystem: cMap<number> = new cMap<number>();
        particlesystem.set("particleSystemData",1);
        particlesystem.set("material",1);
        particlesystem.set("mesh",1);
        particlesystem.set("sortingFudge",1);
        particlesystem.set("pivot",1);
        this.exportList.set("particlesystem", particlesystem);

        let spherecollider: cMap<number> = new cMap<number>();
        spherecollider.set("center",1);
        spherecollider.set("radius",1);
        this.exportList.set("spherecollider", spherecollider);

        let f14effCmop: cMap<number> = new cMap<number>();
        f14effCmop.set("f14eff",1);
        f14effCmop.set("delay",1);
        this.exportList.set("f14effCmop", f14effCmop);

        let water: cMap<number> = new cMap<number>();
        water.set("copyFrom",2);
        water.set("defNumVertsPerRow",1);
        this.exportList.set("water", water);

        let linerendererCmop: cMap<number> = new cMap<number>();
        linerendererCmop.set("lineRendererData",1);
        linerendererCmop.set("material",1);
        this.exportList.set("linerendererCmop", linerendererCmop);

        let keyFrameAniPlayer: cMap<number> = new cMap<number>();
        keyFrameAniPlayer.set("clips",1);
        this.exportList.set("keyFrameAniPlayer", keyFrameAniPlayer);


        let Aniclip: cMap<number> = new cMap<number>();
        Aniclip.set("aniclipName",1);
        Aniclip.set("fps",1);
        Aniclip.set("hasScaled",1);
        Aniclip.set("loop",1);
        Aniclip.set("boneCount",1);
        Aniclip.set("bones",1);
        Aniclip.set("indexDic",1);
        Aniclip.set("subclipCount",1);
        Aniclip.set("subclips",1);
        Aniclip.set("frameCount",1);
        Aniclip.set("frames",1);
        this.exportList.set("Aniclip", Aniclip);

        let camera: cMap<number> = new cMap<number>();
        camera.set("near",1);
        camera.set("far",1);
        camera.set("CullingMask",1);
        // camera.set("overlays",1);
        camera.set("fov",1);
        camera.set("size",1);
        camera.set("opvalue",1);
        this.exportList.set("camera", camera);
    }
}
