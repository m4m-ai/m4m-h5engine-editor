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

export class ImageSetting extends AssetBundleFileInfo {
    public static classType = m4m["ImageSetting"] = ImageSetting;
    public imageName: string = "";
    public filterMode: string = "";
    public format: string = "";
    public mipmap: boolean = false;
    public wrap: string = "";
    public premultiplyAlpha: boolean = false;
    public imageGuid: string = "";

}
