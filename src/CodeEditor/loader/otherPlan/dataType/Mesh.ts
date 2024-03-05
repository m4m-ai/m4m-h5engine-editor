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
import { AssetBundleFileInfo } from "./AssetBundleFileInfo";
import { Bounds } from "./Bounds";
import { number4 } from "./number4";

export class Mesh extends AssetBundleFileInfo {
    public static classType = m4m["Mesh"] = Mesh;
    public className: string = "";
    public meshName: string = "";
    public originVF: number = 0;
    public bounds: Bounds = new Bounds();
    public posCount: number = 0;
    public position: m4m.math.vector3[] = [];
    public color: m4m.math.color[] = [];
    public colorex: m4m.math.color[] = [];
    public normal: m4m.math.vector3[] = [];
    public UV0: m4m.math.vector2[] = [];
    public UV1: m4m.math.vector2[] = [];
    public tangent: m4m.math.vector3[] = [];
    public blendIndex: number4[] = [];
    public blendWeight: number4[] = [];
    public vec10tpose: number[] = [];
    public trisindex: number[] = [];
    public subMesh: subMeshInfo[] = [];
    public tmpVArr: Float32Array;
    public minimum: m4m.math.vector3 = m4m.poolv3();
    public maximum: m4m.math.vector3 = m4m.poolv3();

}
// tslint:disable-next-line: class-name
export class subMeshInfo {
    public static classType = m4m["subMeshInfo"] = subMeshInfo;
    public matIndex: number = 0;
    public useVertexIndex: number = 0;
    public line: boolean = false;
    public start: number = 0;
    public size: number = 0;

}
