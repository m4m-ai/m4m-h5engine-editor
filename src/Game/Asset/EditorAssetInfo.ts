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
/**
 * 编辑器中的资源数据描述
 */
export type EditorAssetInfo = {
    id: number;
    /**
     * 是否是文件
     */
    isLeaf: boolean;
    /**
     * 文件key
     */
    key: string;
    /**
     * 该资源文件夹需要显示成特殊文件的类型
     */
    DirType?: string;
    /**
     * 文件后缀
     */
    FileType?: string;
    /**
     * 子目录, 当前资源为文件夹时才会有该字段
     */
    children?: EditorAssetInfo[],
    /**
     * 子文件, 当前资源为文件夹时才会有该字段
     */
    childrenFile?: EditorAssetInfo[],
    /**
     * 父目录
     */
    parentDirInfo?: EditorAssetInfo;
    /**
     * 资源路径
     */
    relativePath: string;
    type: string;
    /**
     * 文件名称
     */
    value: string;
    metaFile?: EditorAssetInfo[],
    /**
     * 描述文件, JSON 格式
     */
    meta?: string,
    [key: string]: any;
};