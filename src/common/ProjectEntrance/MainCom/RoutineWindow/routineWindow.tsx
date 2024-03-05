import React, { useState } from "react"
import style from './routineWindow.module.scss'

import { Button, Select  } from 'antd';
import { EllipsisOutlined} from '@ant-design/icons';


export default function RoutineWindow() {
    const [language, setLanguage] = useState([
        {
            value: '0',
            label: 'English',
        },
        {
            value: '1',
            label: '日本语',
        },
        {
            value: '2',
            label: '韩语',
        },
        {
            value: '3',
            label: '简体中文',
        },
        {
            value: '4',
            label: '繁体中文',
        },
    ])
    return (
        <div className={style.routine}>
            <div className="main-header">
                <div className="main-title">常规</div>
            </div>

            <div className="main-content">
                <div className="routine-card">
                    <div className="card-title">Unity编辑器文件夹</div>
                    <div>请选择您电脑上安装Unity编辑的位置，............</div>
                    <div className="path-desc">unity编辑器路径</div>
                    <div className="path-box">
                        <input type="text" />
                        <button><EllipsisOutlined /></button>
                    </div>
                    <Button className="save-btn">保存</Button>
                </div>
                <div className="routine-card">
                    <div className="card-title">语言</div>
                    <div>选择显示语言</div>
                    <div>
                        <Select
                            className="select-lang"
                            defaultValue="3"
                            style={{ width: 200, marginTop: 8}}
                            // onChange={handleChange}
                            options={language}
                            />
                    </div>
                </div>
            </div>
        </div>
    )
}