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
import { AssetBundleFileInfo } from "./AssetBundleFileInfo";
export class AssetBundlea {
    public static classType = m4m["AssetBundle"] = AssetBundlea;
    public className: string = "";
    public fileName: string = "";
    public pathName: string = "";
    public fileSize: cMap<number> = new cMap<number>(); public files: AssetBundleFileInfo[] = [];
    public totalLength: number = 0;
    public version: string = "";
    public createtime: string = "";

}
