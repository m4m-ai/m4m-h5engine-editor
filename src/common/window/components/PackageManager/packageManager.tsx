import React, { useRef, useState } from "react";
import styles from './packageManager.module.scss'

import { Input } from "antd";
import { CaretDownOutlined, CheckOutlined, DiffOutlined, PlusOutlined, ReloadOutlined, SearchOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons'

import { PackageIntroduce } from "./packageIntroduce";
import { CollapseM4M } from '../../../CollapseM4M/collapseM4M'
import { ContextMenuManager } from "../../../contextMenu/ContextMenuManager";

function FeatureTemplate() {
    return (
        <div className="feature-temp">
            <div style={{display: 'flex'}}>
                <div style={{marginRight: 4}}><DiffOutlined /></div>
                <div>
                    <div>Engineering</div>
                    <div>7 packages</div>
                </div>
            </div>
            <div>
                <div><CheckOutlined style={{color: '#66d095'}}/></div>
                <div><ToolOutlined /></div>
            </div>
        </div>
    )
}

// 测试数据
const testData = [
    {
        header: 'JetBrains Rider',
        key: 0,
        content: ''
    },
    {
        header: 'Test FrameWork',
        key: 1,
        content: ''
    },
    {
        header: 'TextMeshPro',
        key: 2,
        content: ''
    }
]

export function PackageManager() {
    const addRef = useRef<HTMLDivElement>()
    const packagesRef = useRef<HTMLDivElement>()
    const sortRef = useRef<HTMLDivElement>()
    const settingRef = useRef<HTMLDivElement>()

    const [featuresCollapse, setFeaturesCollapse] = useState([
        {
            header: 'Features',
            key: 0,
            content: <FeatureTemplate />
        }
    ])

    const [packagesCollapse, setPackagesCollapse] = useState([
        {
            header: 'Packages',
            key: 0,
            content: <CollapseM4M collapseData={testData}></CollapseM4M>
        }
    ])

    const addPackageFn = (e) =>{
        const { x, y, height } = addRef.current.getBoundingClientRect()
        e.stopPropagation()
        ContextMenuManager.showContextMenu({
            x,
            y: y + height,
            items: [
                {
                    title: 'Add package from disk...',
                    onClick: () => {}
                },
                {
                    title: 'Add package from tarball...',
                    onClick: () => {}
                },
                {
                    title: 'Add package from git URL...',
                    onClick: () => {}
                },
                {
                    title: 'Add package from name...',
                    onClick: () => {}
                }
            ]
        })
    }
    const selectPackageOriginFn = (e) =>{
        const { x, y, height } = packagesRef.current.getBoundingClientRect()
        e.stopPropagation()
        ContextMenuManager.showContextMenu({
            x,
            y: y + height,
            items: [
                {
                    title: 'Unity Registry',
                    onClick: () => {}
                },
                {
                    title: 'In project',
                    onClick: () => {}
                },
                {
                    title: 'My Assets',
                    onClick: () => {}
                },
                {
                    title: 'Built-in',
                    onClick: () => {}
                },
                {
                    title: 'Featured',
                    onClick: () => {}
                }
            ]
        })
    }
    const sortPackageFn = (e) =>{
        const { x, y, height } = sortRef.current.getBoundingClientRect()
        e.stopPropagation()
        ContextMenuManager.showContextMenu({
            x,
            y: y + height,
            items: [
                {
                    title: 'Name ↓',
                    onClick: () => {}
                },
                {
                    title: 'Name ↑',
                    onClick: () => {}
                },
                {
                    title: 'Published date ↓',
                    onClick: () => {}
                },
                {
                    title: 'Published date ↑',
                    onClick: () => {}
                },
                {
                    title: 'Update available',
                    onClick: () => {}
                }
            ]
        })
    }
    const settingFn = (e) => {
        const { x, y, height } = settingRef.current.getBoundingClientRect()
        e.stopPropagation()
        ContextMenuManager.showContextMenu({
            x,
            y: y + height,
            items: [
                {
                    title: 'Advanced Project Settings',
                    onClick: () => {}
                },
                {
                    title: 'Reset Packages to defaults',
                    onClick: () => {}
                },
            ]
        })
    }

    return (
        <div className={styles['package-manager']}>
            <div className="package-header">
                <div className="header-left">
                    <div ref={addRef} onClick={ addPackageFn }><span><PlusOutlined /></span><CaretDownOutlined /></div>
                    <div ref={packagesRef} onClick={ selectPackageOriginFn }><span>Packages:</span><CaretDownOutlined /></div>
                    <div ref={sortRef} onClick={ sortPackageFn }><span>Sort:</span><CaretDownOutlined /></div>
                </div>
                <div className="header-right">
                    <SettingOutlined style={{ marginRight: 5}} ref={settingRef} onClick={settingFn}/>
                    <Input style={{width: 200, height: 24}} prefix={<SearchOutlined style={{color: '#c7c7c7'}}/>}/>
                </div>
            </div>

            <div className="package-main">
                <div className="package-silder">
                    <div>
                        <CollapseM4M collapseData={featuresCollapse}/>
                        <CollapseM4M collapseData={packagesCollapse}/>
                    </div>
                    <div className="silder-footer">
                        <div>Last update Date Dec 26, 16:18</div>
                        <div className="silder-footer-btn">
                            <div><ReloadOutlined /></div>
                            <div><CaretDownOutlined /></div>
                        </div>
                    </div>
                </div>
                <div className="package-content">
                    <div className="content-main">
                        <PackageIntroduce />
                    </div>
                    <div className="content-footer">
                        <div className="content-footer-btn">Install</div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}