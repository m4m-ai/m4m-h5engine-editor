import React, { ReactNode, useEffect, useRef, useState } from "react";
import style from './projectSetting.module.scss'

import { Layout, Input, Menu } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Sider, Content} = Layout

interface PropsType {
    data?: any[],
    defaultKey?: '',
    defaultRender?: ReactNode
}

const projectSettingsTestProps: PropsType = {
    data: [
        {
            key: 'Adaptive Performance',
            label: 'Adaptive Performance',
            icon: '',
            render: <>1111</>
        },
        {
            key: 'Audio',
            label: 'Audio',
            icon: '',
            render: <>2222</>
        }
    ]
}

export function ProjectSettings(props: PropsType) {
    // 测试用
    props = projectSettingsTestProps

    
    let menuMappingContent = useRef({})

    const [selectedKey, setSelectedKey] = useState(props.data[0].key)
    const [renderContent, setContent] = useState(props.data[0].render)

    useEffect(() => {
        if(props.data) {
            props.data.forEach(item => {
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

    return (
        <Layout className={style['project-setting']}>
            <div className="header">
                <Input prefix={<SearchOutlined style={{color: '#fff'}}/>} style={{width: 300}}/>
            </div>

            <Layout>
                <Sider>
                    <Menu
                        defaultSelectedKeys={[selectedKey]}
                        mode="inline"
                        items={props.data}
                        onSelect={onSelectMenuItem}
                    />
                </Sider>

                <Content>
                    { renderContent }
                </Content>
            </Layout>
        </Layout>
    )
}