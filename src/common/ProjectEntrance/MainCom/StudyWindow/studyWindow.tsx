import React from "react"
import style from './studyWindow.module.scss'
import { Tabs } from 'antd';

export default function StudyWindow() {
    return (
        <>
            <div className="main-header">
                <div className="main-title">学习</div>
            </div>

            <div className="main-content">
                <Tabs defaultActiveKey="1" style={{height: '100%'}}>

                    <Tabs.TabPane tab="Project" key="1">
                        <Project></Project>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="教程" key="2">
                    null
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    )
}

// Project 标签页
function Project() {
    return (
        <div className={style.project}>
            {/* 头部 */}
            <div className="project-header">
                {
                    (new Array(3).fill('')).map((item, index) => {
                        return (
                            <div className="card-box" key={index}>
                                <div className="card-pic"></div>
                                <div className="card-info">
                                    <div>Introduction to Visual Scripting</div>
                                    <div>
                                        <span>项目 · </span>
                                        <span>初学者 · </span>
                                        <span>2h 30m</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="project-list">
                {
                    (new Array(10).fill('')).map((item, index) => {
                        return (
                            <div className="item" key={index}>
                                <div className="item-pic"></div>
                                <div className="item-info">
                                    <div>Introduction to Visual Scripting</div>
                                    <div>
                                        <span>项目 · </span>
                                        <span>初学者 · </span>
                                        <span>2h 30m</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
