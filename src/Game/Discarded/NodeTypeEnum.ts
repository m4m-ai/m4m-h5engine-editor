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
export enum NodeTypeEnum
{
    None = 0,
    Transform,
    CanvasRenderer,
    Camera,
    CameraAndCanvasRenderer,//以上data全是transform
    Transform2D,
    Canvas,                 //data为canvas。一定跟着CanvasRenderer或CameraAndCanvasRenderer
    OverLayRoot,            //Camera下固定存在的节点。  data为Camera
    OverLay2D,              //OverLay2d               data为overlay，其下不设置canvas虚拟点了。功能整合到这一个里面
    EffectVirsual//特效中的虚拟元素节点
}