/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef, useState } from "react";
import style from './buildSetting.module.scss'
import { Button, Checkbox, Layout, Menu } from 'antd'

import { ProjectSettings } from "../ProjectSetting/ProjectSettings";
import { WindowManager } from "../../WindowManager";

const { Sider, Content } = Layout;

export interface FileDialogAttrData {
    handleClose?: (v: boolean) => void
}

interface ScenesBuildPropsType {
    checkboxGroup: any[]
}

interface PlatformPropsType {
    platformTab?: any[]
}

const scenesBuildTestProps = {
    checkboxGroup: [
        {
            checkStatus: false,
            name: 'gyl_test',
            number: 1,
            key: 'gyl_test'
        },
        {
            checkStatus: false,
            name: 'm4m_test',
            number: 222,
            key: 'm4m_test'
        }
    ]
}

const platformTestProps = {
    platformTab: [
        {
            key: 'platform_mac',
            label: 'MAC',
            icon: '',
            render: (
                <div>
                    <div>11111111111111</div>
                    <div>11111111111111</div>
                    <div>11111111111111</div>
                    <div>11111111111111</div>
                    <div>11111111111111</div>
                    <div>11111111111111</div>
                </div>
            )
            
        },
        {
            key: 'platform_windows',
            label: 'WINDOwS',
            icon: '',
            render: <>222</>
        }
    ]
}

export function BuildSetting(data: FileDialogAttrData) {
    // Scenes in Build
    function ScenesBuild(props: ScenesBuildPropsType) {

        const [checkboxGroup, setCheckboxGroup] = useState(props.checkboxGroup)
        const [selectRowKey, setSelectRowKey] = useState('')

        const changeCheckbox = (checkedValue)=> {
            //console.log('checkedValue\n', checkedValue);
        }

        const clickRowItem = (key) => {
            setSelectRowKey(key)
        }

        return (
            <div className="bd-content">
                <div >Scenes In Build</div>
                <div className="bd-middle">
                    <Checkbox.Group onChange={changeCheckbox} style={{width: '100%'}}>
                        {
                            checkboxGroup.map((item, index) => {
                                return (
                                    <div className={`bd-item ${selectRowKey === item.key ? 'pitch-status' : ''}`} key={index} onClick={() => clickRowItem(item.key)}>
                                        <div>
                                            <Checkbox value={item}>{item.name}</Checkbox>
                                        </div>
                                        <div>{item.number}</div>
                                    </div>
                                )
                            })
                        }   
                    </Checkbox.Group>
                </div>
                <div style={{display: 'flex',justifyContent: 'right'}}>
                    <Button className="bd-button">Add Open Scenes</Button>
                </div>
            </div>
        )
    }
    // Platform
    const PlatformContent = (props: PlatformPropsType) => {
        let menuMappingContent = useRef({})
        const [selectedKey, setSelectedKey] = useState(props.platformTab[0].key)
        const [renderContent, setContent] = useState(props.platformTab[0].render)
      
        useEffect(() => {
            if(props.platformTab) {
                props.platformTab.forEach(item => {
                    menuMappingContent.current[item.key] = item.render
                })
            }
        }, [])

        useEffect(()=>{
            setContent(menuMappingContent.current[selectedKey])
        }, [selectedKey])

        const onSelectMenuItem = ({key}) => {
            setSelectedKey(key)
        }
        const openProjectSetting = () => {
            WindowManager.createWindow({
                title: 'project Settings',
                keepOut: true,
                body: (
                    <ProjectSettings/>
                ),
                width: 1124,
                height: 725,
                minWidth: 765,
                minHeight: 520
            })
        }

        return (
            <div className="bd-platform">
                <Layout className="platform-layout">
                    <Sider>
                        <div>Platform</div>
                        <Menu
                            defaultSelectedKeys={[selectedKey]}
                            mode="inline"
                            items={props.platformTab}
                            onSelect={onSelectMenuItem}
                        />
                    </Sider>
                    <Content style={{paddingLeft: '10px'}} className="platform-layout-content">
                        {
                            renderContent
                        }
                    </Content>
                </Layout>

                <div className="platform-footer-btn">
                    <div>
                        <Button className="bd-button" onClick={openProjectSetting}>Player Settings...</Button>
                    </div>
                    <div style={{display: 'flex'}}>
                        <Button className="bd-button" >Switch Platform</Button>
                        <Button className="bd-button" disabled>Build And Run</Button>
                    </div>
                </div>

            </div >
        )
    }

    return (
        <div className={style['build-setting']}>
            <ScenesBuild checkboxGroup={scenesBuildTestProps.checkboxGroup}/>
            {/* 平台选择 */}
            <PlatformContent platformTab={platformTestProps.platformTab}/>
        </div>
    )
}