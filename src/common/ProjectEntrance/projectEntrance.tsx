import React, { useEffect, useState } from "react"
import style from './projectEntrance.module.scss'
import {data} from './data'

import { Layout } from 'antd';
import HeaderCom from './HeaderCom/headerCom'
import MenuCom from './MenuCom/menuCom'
import MainCom from './MainCom/mainCom'

const { Header, Sider, Content } = Layout;

function ProjectEntrance (props) {
    const [menuList, setMenuList] = useState(data.preferencesMenu)
    const [currentMenuKey, setCurrentMenuKey] = useState('project')
    const [isSetting, setIsSetting] = useState(false)

    useEffect(()=>{
        // 是 设置的话
        if(isSetting) {
            setMenuList(data.settingMenu)
            setCurrentMenuKey(data.settingMenu[0].key)
        } else {
            setMenuList(data.preferencesMenu)
            setCurrentMenuKey(data.preferencesMenu[0].key)
        }
    },[isSetting])

    return (
        <>
            <Layout className={style.box}>

                <Header style={{background: '#fff'}}>
                    <HeaderCom isSetting={isSetting} emitSettingFn={setIsSetting}></HeaderCom>
                </Header>

                <Layout>

                    <Sider>
                        <MenuCom menuList={menuList} currentMenuKey={currentMenuKey} emitSetMenuKey={setCurrentMenuKey}></MenuCom>
                    </Sider>

                    <Content>
                        <MainCom renderCom={data.renderComMap[currentMenuKey]}></MainCom>
                    </Content>
                    
                </Layout>
            </Layout>
        </>
    )
}

export default ProjectEntrance

