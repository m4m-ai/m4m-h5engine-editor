import React, { useState } from "react";
import style from './tabsM4M.module.scss'
import { WindowManager } from "../window/WindowManager";

interface tabItem {
    icon?: any,
    name?: string,
    key: number | string,
    content?: any
}

interface TabsPropsType {
    tabsData: tabItem[]
}

export function TabsM4M(props: TabsPropsType) {
    const [currentKey, setCurrentKey] = useState<string | number>(props.tabsData[0].key)
    const [tabContent, setTabContent] = useState(props.tabsData[0].content)

    const selectedTab = (tab: tabItem) => {
        setCurrentKey(tab.key)
        setTabContent(tab.content)
    }

    return (
        <div className={style.tabsM4M}>
           {/* 选项卡 */}
           <div className="tabs-bar">
             {
                props.tabsData.map(item => {
                    return (
                        <div className={`tabs-item ${currentKey === item.key ? 'tabs-active' : ''}`} key={item.key} 
                        onClick={() => selectedTab(item)}>
                            <div className="tabs-icon">{item.icon}</div>
                            <div className="tabs-name">{item.name}</div>
                        </div>
                    )
                })
             }
           </div>

           {/* 渲染内容 */}
           <div className="tabs-content">
             {
                tabContent
             }
           </div>
        </div>
    )
}