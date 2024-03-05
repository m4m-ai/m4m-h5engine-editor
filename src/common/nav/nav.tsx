import * as React from 'react'
import { useEffect, useState } from 'react'
import { Select, Button, Tooltip, Dropdown, Menu, Space, Divider } from 'antd'
import './index.css'
import '../LightCode/index.css'
import {
    SearchOutlined,
    CloudFilled,
    SettingOutlined,
    StepForwardOutlined,
    CaretRightOutlined,
    PauseOutlined,
    ClockCircleOutlined,
    DownOutlined,
    CaretDownFilled
} from '@ant-design/icons'
import {EditorEventMgr} from "../../Game/Event/EditorEventMgr";
import {EditorApplication} from "../../Game/EditorApplication";
import { WebsocketTool } from '../../CodeEditor/code/WebsocketTool'
import { FileInfoManager } from '../../CodeEditor/code/FileInfoManager'

const { Option, OptGroup } = Select
const handleChange = (value: { value: any; label: React.ReactNode }) => {
    //console.log(value)
}

const menu: any = (
    <Menu
        items={[
            {
                key: '1',
                type: 'group',
                children: [
                    {
                        key: '1-1',
                        label: '2 by 3'
                    },
                    {
                        key: '1-2',
                        label: '4 Split'
                    },
                    {
                        key: '1-3',
                        label: 'Default'
                    },
                    {
                        key: '1-4',
                        label: 'Tall'
                    },
                    {
                        key: '1-5',
                        label: 'Wide'
                    },
                    {
                        key: '1-6',
                        label: '-------------------'
                    }
                ]
            },
            {
                key: '2',
                label: 'Save Layout... '
            },
            {
                key: '3',
                label: 'Save Layout to File...'
            },
            {
                key: '4',
                label: 'Load Layout from File...'
            },
            {
                key: '5',
                label: 'Delete Layout',
                children: [
                    {
                        key: '5-1',
                        label: '2 by 3'
                    },
                    {
                        key: '5-2',
                        label: '4 Split'
                    },
                    {
                        key: '5-3',
                        label: 'Default'
                    },
                    {
                        key: '5-4',
                        label: 'Tall'
                    },
                    {
                        key: '5-5',
                        label: 'Wide'
                    }
                ]
            },
            {
                key: '6',
                label: 'Reset All Layouts'
            }
        ]}
    />
)
const openVSCode = () => {
    //console.log('打开VSCode');
    // const assetData = FileInfoManager.Instance.getDirByKey("9613082d34e546688c651f400cddbad6");
    // console.error(assetData);
    //
    //WebsocketTool.Instance.ProjectManager_openVSCode("1","1");
    const div = document.createElement('div');
  
    // 使用iframe嵌入网页
    const iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:9696/m4m_h5/h5/index.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    // 将iframe添加到DIV元素中
    div.appendChild(iframe);
    
    // 设置DIV元素的样式属性
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.backgroundColor = '#ffffff';
    // div.style.opacity = '0.8';
    div.style.zIndex = '9999';
    
    // 将DIV元素添加到文档中
    document.body.appendChild(div);
}
const reloadCode = () => {
    EditorEventMgr.Instance.emitEvent("OnTsCompileSuccess", cb => cb());
}
const dianji1 = () => {
    //console.log('点击图标1')
}
const dianji2 = () => {
    //console.log('点击图标2')
}
const dianji3 = () => {
    //console.log("点击play")
    EditorApplication.Instance.isPlay = !EditorApplication.Instance.isPlay;
}
const dianji4 = () => {
    if (EditorApplication.Instance.isPlay) {
        //console.log('点击pause')
        EditorApplication.Instance.isPause = !EditorApplication.Instance.isPause;
    }
}
const dianji5 = () => {
    //console.log('点击切换按钮')
}
const dianji6 = () => {
    //console.log('点击历史记录按钮')
}
const dianji7 = () => {
    //console.log('点击搜索按钮')
}

export function Nav() {
    const [isPlay, setIsPlay] = useState(false);
    const [isPause, setIsPause] = useState(false);

    useEffect(() => {
        let binder1 = EditorEventMgr.Instance.addEventListener("OnPlay", (play) => {
            //console.log("play状态: ", play)
            setIsPlay(play);
        })

        let binder2 = EditorEventMgr.Instance.addEventListener("OnPause", (pause) => {
            //console.log("pause状态: ", pause)
            setIsPause(pause);
        })

        return () => {
            binder1.removeListener();
            binder2.removeListener();
        }
    }, [])


    return (
        <div className="nav-box">
            <div className="nav-1">
                {/* 未实现功能屏蔽: 导航栏按钮 */}
                {/* <div className="nav-1-1">
                    <Select
                        labelInValue
                        defaultValue={{value: 'Sign', label: 'Sign in'}}
                        style={{width: 88}}
                        onChange={handleChange}
                    >
                        <Option value="Sign">Sign in</Option>
                        <Option value="Signup">Sign up</Option>
                    </Select>
                </div>
                <div className="nav-1-2">
                    <Button icon={<CloudFilled className="cloudF" onClick={dianji1}/>}/>
                </div>
                <div className="nav-1-3">
                    <Button
                        icon={<SettingOutlined className="settingO" onClick={dianji2}/>}
                    />
                </div> */}

                <div className="nav-1-4">
                    <Button onClick={openVSCode}>Open VScode</Button>
                </div>

                <div className="nav-1-5">
                    <Button onClick={reloadCode}>Reload Script</Button>
                </div>

            </div>
            <div className="nav-2">
                <div className="nav-2-1">
                    {
                        isPlay && (
                            <Button onClick={dianji3}  icon={<CaretRightOutlined className="caretR" style={{color: "#6786C7"}}/>}/>
                        )
                    }
                    {
                        !isPlay && (
                            <Button onClick={dianji3} icon={<CaretRightOutlined className="caretR"/>}/>
                        )
                    }
                </div>
                {/* 未实现功能屏蔽: 导航栏按钮, 暂停, 下一帧 */}
                {/* <div className="nav-2-2">
                    {
                        isPause && (
                            <Button onClick={dianji4} icon={<PauseOutlined className="pauseO" style={{color: "#6786C7"}}/>}/>
                        )
                    }
                    {
                        !isPause && (
                            <Button onClick={dianji4} icon={<PauseOutlined className="pauseO"/>}/>
                        )
                    }
                </div>
                <div className="nav-2-3">
                    <Button
                    onClick={dianji5}
                    icon={<StepForwardOutlined className="stepF"/>}
                    />
                </div> */}
            </div>
            <div className="nav-3" style={{ width: "300px" }}>
                {/* 未实现功能屏蔽: 导航栏按钮, 上方的 width: "300px" 也算临时处理 */}
                {/* <div className="nav-3-1">
                    <Button
                    onClick={dianji6}
                    icon={<ClockCircleOutlined className="clockC"/>}
                    />
                </div>
                <div className="nav-3-2">
                    <Button
                    onClick={dianji7}
                    icon={<SearchOutlined className="searchO"/>}
                    />
                </div>
                <div className="nav-3-3">
                    <Select
                    labelInValue
                    defaultValue={{value: 'Layers', label: 'Layers'}}
                    style={{width: 90}}
                    onChange={handleChange}
                    >
                        <Option value="Everything">Everything</Option>
                        <Option value="Nothing">Nothing</Option>
                        <Option value="Default">Default</Option>
                        <Option value="TransparentFX">TransparentFX</Option>
                        <Option value="Ignore">Ignore</Option>
                        <Option value="Water">Water</Option>
                        <Option value="UI">UI</Option>
                    </Select>
                </div>
                <div className="nav-3-4">
                    <Select
                        labelInValue
                        defaultValue={{value: 'Default', label: 'Default'}}
                        style={{width: 90}}
                        onChange={handleChange}
                    >
                        <Option value="2 by 3">2 by 3</Option>
                        <Option value="4 split">4 split</Option>
                        <Option value="Default">Default</Option>
                        <Option value="Tall">Tall</Option>
                        <Option value="Wide">Wide</Option>
                        <Option value="Save Layout">Save Layout</Option>
                        <Option value="Delete Layout">Delete Layout</Option>
                    </Select>
                </div> */}
            </div>
        </div>
    )
}
