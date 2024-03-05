import React, { useEffect, useRef, useState } from "react";
import style from './headerCom.module.scss'
import { Link } from "react-router-dom";

import { Divider } from 'antd';
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import {EditorInputMgr} from "../../../Game/Input/EditorInputMgr";


interface PropsType {
    isSetting: boolean,
    emitSettingFn: Function,
}

export default function HeaderCom(props: PropsType) {
    const [downloadDialog, setDownLoadDialog] = useState(false)
    const [infoDialog, setInfoDialog] = useState(false)
    const downloadDialogRef = useRef(null)
    const infoDialogRef = useRef(null)

    useEffect(() => {
        let  binder1, binder2
        if(downloadDialogRef && downloadDialog) {
            binder1 = clickJudgeCloseEvent(downloadDialogRef, setDownLoadDialog)
        }
        if(infoDialogRef && infoDialog) {
            binder2 = clickJudgeCloseEvent(infoDialogRef, setInfoDialog)
        }

        return ()=> {
            if(binder1) {
                binder1.removeListener()
            }
            if(binder2) {
                binder2.removeListener()
            }
        }
    })

    const clickJudgeCloseEvent = (dialogRef, closeFn) => {
        return EditorInputMgr.Instance.addElementEventListener(document.body, 'TouchClick', (e) => {
            const {left, right, top, bottom} = dialogRef.current.getBoundingClientRect()
            const {x, y} = e            
            if((x < left || x > right || y < top || y > bottom)) {
                closeFn(false)
            }
        })
    }


    const showDownLoadDFn = (e)=> {
        e.stopPropagation()
        setDownLoadDialog(true)
    }

    const showInfoDFn = (e) => {
        e.stopPropagation()
        setInfoDialog(true)
    }

    return (
        <div className={style.box}>
            {
                props.isSetting ? (
                    <div className="back-preferences">
                        <div><ArrowLeftOutlined onClick={() => props.emitSettingFn(false)}/></div>
                        <div>首选项</div>
                    </div>
                ) : <div>logo</div> 
            }
            {/* 未实现功能屏蔽: 项目列表页面头部 */}
            {/* <div className="right">
                <div className="header-download" style={{background: downloadDialog ? '#ececec' : '#fff'}} onClick={e => showDownLoadDFn(e)}>
                    <span>可下载</span>
                    {
                        downloadDialog ? (
                            <div className="download-dialog" ref={(downloadDialogRef)}>
                                <div className="download-dialog-desc">新版Unity Hub 已下载</div>
                                <Divider />
                                <div className="download-dialog-click">阅读发布日志</div>
                                <Divider />
                                <div className="download-dialog-click">现在重启并安装</div>
                                <Divider />
                                <div className="download-dialog-desc desc-end">您现在可以在Hub的偏好选项中参与Beta版本的测试</div>
                            </div>
                        ) : ''
                    }
                </div>
                <div className="header-setting" onClick={() => props.emitSettingFn(true)}><SettingOutlined style={{fontSize: 24}}/></div>
                <div className="header-avatar" onClick={e => showInfoDFn(e)}>
                    {
                        infoDialog ? (
                            <div  className="info-dialog" ref={infoDialogRef}>
                                <div className="info-box">
                                    <div className="info-avatar">郭</div>
                                    <div className="info-right">
                                        <div>郭</div>
                                        <div>123456789@qq.com</div>
                                        <div><Link to={'#'}>账户</Link></div>
                                    </div>
                                </div>
                                <Divider />
                                <div className="info-content">
                                    <div>前往开发者面板</div>
                                    <div>管理许可证</div>
                                    <div>管理组织</div>
                                    <div>帮助</div>
                                    <div>故障排除</div>
                                    <Divider />
                                    <div><span className="log-out"></span>登出</div>
                                </div>
                            </div>
                        ) : ''
                    }
                    
                </div>
            </div> */}
        </div>
    )
}