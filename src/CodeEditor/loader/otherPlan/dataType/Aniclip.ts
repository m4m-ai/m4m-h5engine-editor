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
import { cMap } from "../../../code/Map";
import { subClip } from "./subClip";
export class Aniclip {
    public static classType = m4m["Aniclip"] = Aniclip;
    public fileName: string = "";
    public aniclipName: string = "";
    public fps: number = 0;
    public hasScaled: boolean = false;
    public loop: boolean = false;
    public boneCount: number = 0;
    public bones: string[] = [];
    public indexDic: cMap<number> = new cMap<number>(); public subclipCount: number = 0;
    public subclips: subClip[] = [];
    public frameCount: number = 0;
    public frames: cMap<Float32Array> = new cMap<Float32Array>();
}
