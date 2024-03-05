import React, { useState } from "react";
import { Link } from "react-router-dom";

import style from './advancedWindow.module.scss'

import { Select  } from 'antd';


export default function AdvancedWindow() {
    const [channel, setChannel] = useState([
        {
            value: 0,
            label: '正式发布',
        },
        {
            value: 1,
            label: 'Beta',
        }
    ])

    return (
        <div className={style.advance}>
        <div className="main-header">
            <div className="main-title">高级用户</div>
        </div>

        <div className="main-content">
            <div className="advance-card">
                <div className="card-title">发布渠道</div>
                <div>
                    <Select
                        className="select-channel"
                        defaultValue="3"
                        style={{ width: 200 }}
                        // onChange={handleChange}
                        options={channel}
                    />
                </div>
                <div>Beta渠道包含正式发布渠道中还没有的新功能。新版本将自动下载，并在Unity Hub重启以后完成安装</div>
                <div>您可以随时切换回正式发布渠道以退出Beta渠道</div>
                <div><Link to={''} className="advance-link">发送Beta反馈</Link></div>
            </div>
        </div>
    </div>
    )
}