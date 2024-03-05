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
//类名对应的编号
export enum nameEnum{
Prefab = 1 ,
gameObjectInfo = 2 ,
Mesh = 3 ,
Bounds = 4 ,
subMeshInfo = 5 ,
Mat = 6 ,
camera = 7 ,
meshFilter = 8 ,
meshRenderer = 9 ,
}
//属性名对应的编号
//因为不同类可能有同名属性，所以采用 类名$属性名 的格式来记录
export enum prtEnum{
Prefab$className = 1 ,
Prefab$tranName = 2 ,
Prefab$localRotate = 3 ,
Prefab$localScale = 4 ,
Prefab$gameObject = 5 ,
gameObjectInfo$tag = 6 ,
gameObjectInfo$visible = 7 ,
Prefab$children = 8 ,
Prefab$insid = 9 ,
Mesh$className = 10 ,
Mesh$meshName = 11 ,
Mesh$originVF = 12 ,
Mesh$bounds = 13 ,
Mesh$posCount = 14 ,
Mesh$position = 15 ,
Mesh$normal = 16 ,
Mesh$UV0 = 17 ,
Mesh$tangent = 18 ,
Mesh$trisindex = 19 ,
Mesh$subMesh = 20 ,
subMeshInfo$size = 21 ,
Mesh$tmpVArr = 22 ,
Mat$className = 23 ,
Mat$shader = 24 ,
Mat$fileName = 25 ,
gameObjectInfo$components = 26 ,
camera$className = 27 ,
camera$near = 28 ,
camera$far = 29 ,
camera$CullingMask = 30 ,
camera$fov = 31 ,
camera$size = 32 ,
camera$opvalue = 33 ,
meshFilter$className = 34 ,
meshFilter$meshKey = 35 ,
meshRenderer$className = 36 ,
meshRenderer$materialsKey = 37 ,
meshRenderer$lightmapIndex = 38 ,
meshRenderer$lightmapScaleOffset = 39 ,
Prefab$localTranslate = 40 ,
}
//属性名对应的数据类型编号
export enum typeEnum{
Prefab$className = 0 ,
Prefab$tranName = 0 ,
Prefab$localRotate = 18 ,
Prefab$localScale = 14 ,
Prefab$gameObject = 1000 ,
gameObjectInfo$tag = 0 ,
gameObjectInfo$visible = 12 ,
Prefab$children = 1100 ,
Prefab$insid = 5 ,
Mesh$className = 0 ,
Mesh$meshName = 0 ,
Mesh$originVF = 4 ,
Mesh$bounds = 1000 ,
Mesh$posCount = 5 ,
Mesh$position = 114 ,
Mesh$normal = 114 ,
Mesh$UV0 = 113 ,
Mesh$tangent = 114 ,
Mesh$trisindex = 106 ,
Mesh$subMesh = 1100 ,
subMeshInfo$size = 5 ,
Mesh$tmpVArr = 109 ,
Mat$className = 0 ,
Mat$shader = 0 ,
Mat$fileName = 0 ,
gameObjectInfo$components = 1100 ,
camera$className = 0 ,
camera$near = 9 ,
camera$far = 9 ,
camera$CullingMask = 7 ,
camera$fov = 9 ,
camera$size = 9 ,
camera$opvalue = 9 ,
meshFilter$className = 0 ,
meshFilter$meshKey = 0 ,
meshRenderer$className = 0 ,
meshRenderer$materialsKey = 100 ,
meshRenderer$lightmapIndex = 5 ,
meshRenderer$lightmapScaleOffset = 15 ,
Prefab$localTranslate = 14 ,
}
