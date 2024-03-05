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
import { exC2DComponent } from "./exC2DComponent";

export class Prefab2D extends AssetBundleFileInfo {
    public className: string = "";
    public prefab: string = "";
    public layer: number = 0;
    public tag: string = "";
    public tranName: string = "";
    public isStatic: boolean = false;
    public children: Prefab2D[] = [];
    public width: number = 0;
    public height: number = 0;
    public pivot: m4m.math.vector2 = m4m.poolv2();
    public _visible: boolean = false;
    public localTranslate: m4m.math.vector2 = m4m.poolv2();
    public localScale: m4m.math.vector2 = m4m.poolv2();
    public localRotate: number = 0;
    public isMask: boolean = false;
    public layoutState: number = 0;
    public layoutPercentState: number = 0;
    public layoutValueMap: numberdic = new numberdic();
    public insid: number = 0;
    public components: exC2DComponent[] = [];
    
}

// tslint:disable-next-line: class-name
class numberdic {
    public static classType = m4m["numberdic"] = numberdic;
    public n1: number = 0;
    public n2: number = 0;
    public n4: number = 0;
    public n8: number = 0;
    public n16: number = 0;
    public n32: number = 0;

}
export class Border {
    public static classType = m4m["Border"] = Border;
    public l: number = 0;
    public t: number = 0;
    public r: number = 0;
    public b: number = 0;
}
