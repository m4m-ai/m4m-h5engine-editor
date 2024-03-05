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
import { gameObjectInfo } from "./gameObjectInfo";

export class Prefab extends AssetBundleFileInfo {
    public static classType = m4m["Prefab"] = Prefab;
    public tranName: string = "";
    public localRotate: m4m.math.quaternion = m4m.poolquat();
    public localTranslate: m4m.math.vector3 = m4m.poolv3();
    public localScale: m4m.math.vector3 = m4m.poolv3();
    public gameObject: gameObjectInfo = new gameObjectInfo();
    public children: Prefab[] = [];
    public insid: number = 0;

}
