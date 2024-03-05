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
import ProjectWindow from "./MainCom/ProjectWindow/projectWindow"
import StudyWindow from "./MainCom/StudyWindow/studyWindow"
import CommunityWindow from "./MainCom/CommunityWindow/communityWindow"
import InstallationWindow from "./MainCom/InstallationWindow/installationWindow"
import RoutineWindow from "./MainCom/RoutineWindow/routineWindow"
import LicenseWindow from "./MainCom/LicenseWindow/licenseWindow"
import AdvancedWindow from "./MainCom/AdvancedWindow/advancedWindow"

// 首选项菜单
const preferencesMenu = [
    {
        label: '项目',
        key: 'project',
        // icon: ''
    },
    //未实现功能屏蔽: 项目列表页面左侧页签
    // {
    //     label: '学习',
    //     key: 'study',
    //     // icon: ''
    // },
    // {
    //     label: '社区',
    //     key: 'community',
    //     // icon: ''
    // },
    // {
    //     label: '安装',
    //     key: 'installation',
    //     // icon: ''
    // }
]

// 设置菜单
const settingMenu = [
    {
        label: '常规',
        key: 'routine',
        // icon: ''
    },
    {
        label: '许可证管理',
        key: 'license',
        // icon: ''
    },
    {
        label: '高级用户',
        key: 'advance',
        // icon: ''
    },
]

const renderComMap = {
    project: ProjectWindow,
    study: StudyWindow,
    community: CommunityWindow,
    installation: InstallationWindow,
    routine: RoutineWindow,
    license: LicenseWindow,
    advance: AdvancedWindow
}

export const data = {
    preferencesMenu,
    settingMenu,
    renderComMap
}