import React from "react";
import style from './licenseWindow.module.scss'


import { Button } from 'antd';

export default function LicenseWindow() {
    return (
        <div className={style.license}>
            <div className="main-header">
                <div className="main-title">许可证</div>
                <div className="header-operation">
                    <Button className="active-btn">激活新许可证</Button>
                    <div>
                        <Button className="handle-btn" type="primary">手动激活</Button>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="no-lic">
                    <div className="no-lic-content">
                        <div className="no-pic"></div>
                        <div className="no-title">没有许可证</div>
                        <div className="no-desc">
                            <div>在使用Unity之前，请先激活新的授权，</div>
                            <div>或者手动激活。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}