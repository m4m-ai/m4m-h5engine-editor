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
export class StringDefiner{
    static readonly TAG_UI_EDITOR = "TAG_UI_EDITOR"; //标记 ui 编辑对象
    static readonly TAG_UI_EDITOR_FRAME = "TAG_UI_EDITOR_FRAME"; //标记 ui 编辑框对象
    static readonly ______EditorCamera = "______EditorCamera";  //编辑相机特称
    static readonly axisObject = "axisObject";  //编辑轴对象
    static readonly editorObjRoot = "editorObjRoot";  //编辑对象节点
    static readonly ____editor_camera_frame = "____editor_camera_frame";//取个奇葩名字做标记，用于区分场景物体和camera的cube
    static readonly EDITOR_UI_FRAME_3D = "EDITOR_UI_FRAME_3D"; // ui 3d 编辑框
    static readonly EDITOR_UI_ROOT_3D = "EDITOR_UI_ROOT_3D"; // ui 编辑态 ui容器
    static readonly ____uiMouseObject = "____uiMouseObject";  //UI编辑Tran对象
    static readonly TAG_UIEDITOR_CAN_PICK = "TAG_UIEDITOR_CAN_PICK"; //标记 能被拣选的UI编辑对象
}