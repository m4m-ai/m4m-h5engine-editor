import React from "react";
import style from './installationWindow.module.scss'

import { Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';


export default function InstallationWindow() {
    return (
        <div className={style.installation}>
            <div className="main-header">
                <div className="main-title">安装</div>
                <div className="header-operation">
                    <Button className="pos-btn">定位</Button>
                    <div>
                        <Button className="add-btn" type="primary">添加</Button>
                    </div>
                </div>
            </div>

            <div className="main-content">
               <div className="installation-content">
                    <div className="installation-card">
                        <div>
                            <div className="card-pic"></div>
                            <div className="card-time">2021.3.13f1c1</div>
                        </div>
                        <MoreOutlined className="card-icon"/>
                    </div>
               </div>
            </div>
        </div>
    )
}