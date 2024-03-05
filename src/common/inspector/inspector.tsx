import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { EditTwoTone, RightOutlined, SearchOutlined } from '@ant-design/icons'
import { Divider, Input, List, MenuProps, } from 'antd'
import { Component } from "./components/Component";
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { InspectorHead } from "./InspectorHead";
import { IInspertorGameobjectData, InspertorMgr, InspertorViewType } from "../../Game/Panel/InspertorMgr";
import { InspertorPreview } from "./previvew/InspertorPreview";
import { EditorAssetInfo } from "../../Game/Asset/EditorAssetInfo";
import { EditorApplication } from "../../Game/EditorApplication";
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;
import { EditorComponentMgr, IComponentInfo } from "../../Game/Component/EditorComponentMgr";
import { InspectorAnimator } from './animator/InspectorAnimator';
import { InspectorAudio } from './audio/InspectorAudio';
import { FileInfoManager } from '../../CodeEditor/code/FileInfoManager';
// import { AddComponent } from './Input/AddComponent'

const handleMenuClick: MenuProps['onClick'] = e => {
    //console.log('click', e)
}

let _pvData: EditorAssetInfo;
let _viewType: InspertorViewType;

export function Inspector() {
    //组件面板是否打开
    const [open, setOpen] = useState(false);
    //显示数据类型
    const [viewType, setViewType] = useState(InspertorViewType.Hide);
    //gameobject数据
    const [gmData, setGmData] = useState<IInspertorGameobjectData>(null);
    //预览数据
    const [pvData, setPvData] = useState<EditorAssetInfo>(null);

    _pvData = pvData;
    _viewType = viewType;

    const element = useRef(null);
    //引用: 添加组件面板
    const listcom = useRef<HTMLUListElement>(null)

    const [componentDatas, setComponentDatas] = useState<IComponentInfo[]>([]);

    function getComponentDatas() {
        let trans = gmData.transform;
        if (trans instanceof transform) {
            return EditorComponentMgr.getAll3DComponents();
        } else if (trans instanceof transform2D) {
            return EditorComponentMgr.getAll2DComponents();
        }
        return [];
    }

    useEffect(() => {
        EditorEventMgr.Instance.addEventListener('OnSelectColor', (data) => {
            //console.log(data);
        })
    }, [])

    useEffect(() => {
        document.addEventListener('click', function (e) {
            if (listcom && listcom.current) {
                listcom.current.style.display = 'none'
            }
        });

        function clearInspector() {
            InspertorMgr.ViewType = InspertorViewType.Hide;
            setViewType(InspertorViewType.Hide);
            setGmData(null);
            setPvData(null);
        }

        //清理预览面板数据
        let binder1 = EditorEventMgr.Instance.addEventListener("ClearInspector", () => {
            clearInspector();
        });

        //显示gameobject数据
        let binder2 = EditorEventMgr.Instance.addEventListener("ShowInspectorTransfrom", (data) => {
            InspertorMgr.ViewType = InspertorViewType.Transfrom;
            setViewType(InspertorViewType.Transfrom);
            setGmData(data);
        });

        //预览文件
        let binder3 = EditorEventMgr.Instance.addEventListener("ShowInspectorPreview", (meta) => {
            InspertorMgr.ViewType = InspertorViewType.PreviewFile;
            setViewType(InspertorViewType.PreviewFile);
            setPvData(meta);
        });

        //刷新组件
        let binder4 = EditorEventMgr.Instance.addEventListener("RefreshNodeComponent", () => {
            if (InspertorMgr.ViewType == InspertorViewType.Transfrom) {
                let activeTrans = EditorApplication.Instance.selection.activeTransform;
                if (activeTrans && !activeTrans.beDispose) {
                    InspertorMgr.ShowInspectorTransfrom(activeTrans as any);
                }
            }
        });

        //预览文件丢失
        let binder5 = EditorEventMgr.Instance.addEventListener("WaitNetFileInfosUpdate", () => {
            if (_viewType == InspertorViewType.PreviewFile) {
                if (!_pvData) {
                    clearInspector();
                    EditorApplication.Instance.selection.setActiveAsset(null);
                } else if (_pvData.isLeaf) {
                    if (!FileInfoManager.Instance.getFileByKey(_pvData.key)) {
                        clearInspector();
                        EditorApplication.Instance.selection.setActiveAsset(null);
                    }
                } else {
                    if (!FileInfoManager.Instance.getDirByKey(_pvData.key)) {
                        clearInspector();
                        EditorApplication.Instance.selection.setActiveAsset(null);
                    }
                }
            }
        });

        return () => {
            binder1.removeListener();
            binder2.removeListener();
            binder3.removeListener();
            binder4.removeListener();
            binder5.removeListener();
        }
    }, []);

    const showModal = () => {
        setOpen(true)
    }
    const handleOk = () => {
        setOpen(false)
    }
    const handleCancel = () => {
        setOpen(false)
    }

    //add Component添加组件按钮
    var isOpen = false

    function addButton(e) {
        e.stopPropagation()
        var listCom: HTMLElement = document.querySelector('.list-com')
        isOpen = !isOpen
        if ((listCom.style.display = 'none')) {
            listCom.style.display = 'block'
            //console.log('弹出下拉框')
        } else {
            listCom.style.display = 'none'
            //console.log('关闭下拉框')
        }
        setComponentDatas(getComponentDatas());
    }

    const searchComponentDatas = (e) => {
        const { value } = e.target

        if (value === '') {
            setComponentDatas(getComponentDatas())
            return
        }

        let str = value.toLocaleLowerCase();
        const filterDatas = getComponentDatas().filter(item => item.name.toLocaleLowerCase().indexOf(str) !== -1)
        setComponentDatas(filterDatas)
    }

    return (
        <div className="inspector-box" ref={element}>

            {
                //显示transfrom
                (viewType == InspertorViewType.Transfrom && gmData) &&
                (
                    <>
                        <InspectorHead {...gmData}></InspectorHead>
                        {
                            gmData.components.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <Divider />
                                        <Component component={item.component} enable={item.enable} ticon={(<EditTwoTone />)} title={item.title}
                                            attrs={item.attrs}></Component>
                                    </div>
                                )
                            })
                        }

                        <Divider />
                        <div className="add-component">
                            <div
                                className="clickOpen"
                                onClick={(e: any) => {
                                    addButton(e)
                                }}
                            >
                                Add Component
                            </div>

                            <ul
                                className="list-com"
                                ref={listcom}
                                onClick={e => {
                                    e.stopPropagation();
                                }}
                            >
                                <li className="list-com-li1">
                                    <Input
                                        className="list-com-input"
                                        size="small"
                                        prefix={<SearchOutlined className="searchOutlin" />}
                                        onChange={(e) => searchComponentDatas(e)}
                                    />
                                </li>
                                <li className="list-com-li2">Component</li>
                                <li className="list-com-li3">
                                    <List
                                        split={false}
                                        dataSource={componentDatas}
                                        renderItem={
                                            item => (
                                                <List.Item className="list-com-li3-content"
                                                    onClick={
                                                        (event) => {
                                                            if (listcom && listcom.current) {
                                                                listcom.current.style.display = 'none';
                                                            }
                                                            let trans = gmData.transform;
                                                            if (trans instanceof transform) {
                                                                EditorComponentMgr.mountComponent3D(trans, item.name);
                                                            } else if (trans instanceof transform2D) {
                                                                EditorComponentMgr.mountComponent2D(trans, item.name);
                                                            }
                                                        }
                                                    }
                                                >
                                                    {item.title}
                                                    {<RightOutlined />}
                                                </List.Item>
                                            )
                                        }
                                    />
                                </li>
                            </ul>
                        </div>
                    </>
                )
            }

            {
                //预览文件
                (viewType == InspertorViewType.PreviewFile && pvData) &&
                (
                    <InspertorPreview assetInfo={pvData}></InspertorPreview>
                )
            }

            {/* {
                //动画连线
                (<>
                    <InspectorAnimator></InspectorAnimator>
                </>)
            } */}

            {/* {
                // 混音属性
                (<>
                    <InspectorAudio></InspectorAudio>
                </>)
            } */}
        </div>
    )
}
