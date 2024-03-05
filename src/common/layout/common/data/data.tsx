/**
 * 文件icon和文件名数据(横向和纵向两种排布)
 */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './data.css'
import folder from '../../../../assets/folder.png'
import test from '../../../../assets/test.png'
import { EditorEventMgr } from '../../../../Game/Event/EditorEventMgr'
import Breadcrumb from 'antd/lib/breadcrumb/Breadcrumb'
import Slider from 'antd/lib/slider'
import { EditorApplication } from '../../../../Game/EditorApplication'
import { EditorInputMgr } from "../../../../Game/Input/EditorInputMgr";
import transform2D = m4m.framework.transform2D;
import { ExportManager } from "../../../../Game/ExportManager/ExportManager";
import { FileInfoManager } from "../../../../CodeEditor/code/FileInfoManager";
import { EditorAssetInfo } from "../../../../Game/Asset/EditorAssetInfo";
import { ProjectContext } from '../../layout'
import { DropFileCallBack } from "../../../../Game/ExportManager/DropFileManager";
import NameInput from '../NameInput/NameInput'
import { ContextMenu } from '../ContextMenu/ContextMenu'
import { useContextMenu } from 'react-contexify'
import transform = m4m.framework.transform;
import canvasRenderer = m4m.framework.canvasRenderer;
import { IEventBinder } from "../../../../Game/Event/IEventBinder";
import { MultipleSelectionFileManager } from '../../../../Game/Asset/MultipleSelectionFileManager'



const iconList = ["scene", "prefab", "ts", "json"]

//msg就是父类中size,滑动条控制图片大小
interface childProps { }

const onAfterChange = (value: number | [number, number]) => {
    //console.log('onAfterChange: ', value)
}

const ProjectData: React.FC<childProps> = props => {
    const menuId = '01'
    const { selectNode, setSelectNode, expandedKeys, setExpandedKeys } = useContext(ProjectContext)

    const [size, setSize] = useState(30)
    const [data, setData] = useState<EditorAssetInfo[]>([])
    const [pareData, setPareData] = useState(null);
    const [highlightKey, setHighlight] = useState<string[]>([])

    const boxRef = useRef<HTMLDivElement>();

    //事件工厂
    const eventFactory = EditorInputMgr.Instance.createElementEventFactory();
    // 判断右键是否是当前文件夹
    const [isCurrentFolder, setIsCurrentFolder] = useState(true)

    useEffect(() => {
        if (boxRef.current) {
            boxRef.current.ondrop = DropFileCallBack;
        }

        let binder = EditorEventMgr.Instance.addEventListener("ResourceFileUpDate", (dirInfo) => {
            const sendInfo: EditorAssetInfo[] = [];

            if (dirInfo.children) {
                for (const key in dirInfo.children) {
                    sendInfo.push(dirInfo.children[key]);
                }
            }
            if (dirInfo.childrenFile) {
                for (const key in dirInfo.childrenFile) {
                    sendInfo.push(dirInfo.childrenFile[key]);
                }
            }
            setData(sendInfo);
            setPareData(dirInfo);
        });

        let bind3: IEventBinder;

        //监听拖拽trans
        let bind2 = EditorEventMgr.Instance.addEventListener("OnDragTrans", (trans, state) => {
            if (state == 0) {
                if (bind3) {
                    bind3.removeListener();
                    bind3 = null;
                }
                if (boxRef.current) {
                    bind3 = EditorInputMgr.Instance.addElementEventListener(boxRef.current, "TouchDrop", (touch) => {
                        bind3.removeListener();
                        bind3 = null;

                        let activeFolderInfo = EditorApplication.Instance.selection.activeFolderInfo;
                        //console.log("拖拽生成prefab, 目标文件夹: " + activeFolderInfo.key);
                        //导出prefab
                        if (trans instanceof transform2D) { //ui组件
                            ExportManager.export2dPrefab(activeFolderInfo.key, trans.name, trans);
                        } else if (trans instanceof transform) {
                            if (trans.gameObject.tag == "Ui") { //ui组件
                                let component = trans.gameObject.getComponent("canvasRenderer") as canvasRenderer;
                                if (component) {
                                    ExportManager.export2dPrefab(activeFolderInfo.key, trans.name, component.canvas.getRoot());
                                }
                            } else {
                                ExportManager.export3dPrefab(activeFolderInfo.key, trans.name, trans);
                            }
                        }
                    })
                }
            } else {
                if (bind3) {
                    bind3.removeListener();
                    bind3 = null;
                }
            }
        });

        //监听文件更新
        let bind4 = EditorEventMgr.Instance.addEventListener("WaitNetFileInfosUpdate", () => {
            let af = EditorApplication.Instance.selection.activeFolderInfo;

            if (af) {
                //刷新当前文件夹
                EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(af));
            }
        });

        return () => {
            binder.removeListener();
            bind2.removeListener();
            if (bind3) {
                bind3.removeListener();
            }
            bind4.removeListener();
        }
    }, []);

    useEffect(() => {
        return () => {
            eventFactory.removeAllEventListener();
        }
    })


    let pareList = [];
    let con = pareData;
    while (con) {
        pareList.unshift(con)
        con = con.parentDirInfo
    }
    const pathSnippets = pareList;
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `${pathSnippets[index].value}`
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url} onClick={(e) => breadcrumbItemClick(e, index)}>{url}</Link>
            </Breadcrumb.Item>
        )
    })
    const breadcrumbItems = extraBreadcrumbItems
    // 双击
    const selectDoubleFile = (e: EditorAssetInfo) => {
        const dirInfo = e;
        const parentKey = dirInfo.parentDirInfo.key || ''

        // 选中的是文件
        if (dirInfo.isLeaf) {
            return
        }
        //选中的是文件 （Scenes）
        if (!dirInfo.isLeaf && dirInfo.DirType != "") {
            //console.log("选中的组件是：" + path + "  组件类型是：" + dirInfo.DirType);
            EditorApplication.Instance.editorResources.openFile(dirInfo);
            return;
        }

        // 文件夹才会走这里
        setSelectNode(dirInfo)
        // 当前文件夹的父节点 没有展开
        if (expandedKeys.indexOf(parentKey) === -1) {
            setExpandedKeys([...expandedKeys, parentKey])
        }
        EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(dirInfo));
    }
    const getImg = (e: string) => {
        if (iconList.indexOf(e) != -1) {
            return require('../../../../assets/' + e + '.png');
        }
        return test;
    }
    // 单击
    const selectFile = (e: EditorAssetInfo, assetInfoList: EditorAssetInfo[], event) => {
        const dirInfo = e;

        // console.error(event);

        let multipleSelect: boolean = false;
        //shift键按下
        if (event.shiftKey) {
            // console.error("shift键按下  ++ ");
            if (MultipleSelectionFileManager.Instance.selectIndex != -1) {
                multipleSelect = true;
                //
                MultipleSelectionFileManager.Instance.onShiftKeyDownSelect(e, assetInfoList, (selectList: EditorAssetInfo[]) => {
                    let fileKeyArr: string[] = [];
                    for (let i = 0; i < selectList.length; i++) {
                        let slectFile = selectList[i];
                        // console.error("设置高亮  " + slectFile.value);
                        fileKeyArr.push(slectFile.key);
                    }
                    // 高亮设置
                    setHighlight(fileKeyArr);
                    //当前选中的文件列表
                    //selectList
                    EditorApplication.Instance.selection.setActiveAssetList(selectList);
                });
            }
        } else if (event.ctrlKey) {//ctrl键按下 
            // console.error("ctrl键按下  ++ ");
            if (MultipleSelectionFileManager.Instance.selectIndex != -1) {
                multipleSelect = true;
                //
                MultipleSelectionFileManager.Instance.onCtrlKeyDownSelect(e, assetInfoList, (selectList: EditorAssetInfo[]) => {
                    let fileKeyArr: string[] = [];
                    for (let i = 0; i < selectList.length; i++) {
                        let slectFile = selectList[i];
                        // console.error("设置高亮  " + slectFile.value);
                        fileKeyArr.push(slectFile.key);
                    }
                    // 高亮设置
                    setHighlight(fileKeyArr);
                    //当前选中的文件列表
                    //selectList
                    EditorApplication.Instance.selection.setActiveAssetList(selectList);
                });
            }
        }

        //当前选中文件
        MultipleSelectionFileManager.Instance.upDateSelectAssetInfo(e, assetInfoList);

        //编辑器右边信息栏显示当前选中文件信息
        EditorApplication.Instance.selection.setActiveAsset(dirInfo);
        if (multipleSelect) {
            //如果是按键下的多选 （下面有些未实现功能暂时不处理）
            return;
        }

        /*** 以下走单选中流程 */
        //
        MultipleSelectionFileManager.Instance.clear();

        // 高亮设置
        setHighlight([dirInfo.key])
        //选中文件
        if (dirInfo.isLeaf) {
            EditorApplication.Instance.selection.setActiveAssetList([]);
            EditorEventMgr.Instance.emitEvent("OnSelectFile", cb => cb(dirInfo));
            return;
        }

        // 选中的是文件 （Scenes）
        if (!dirInfo.isLeaf && dirInfo.DirType != "") {
            let path = dirInfo.relativePath;
            EditorApplication.Instance.editorResources.selectFile(dirInfo.value, path, dirInfo);
            return;
        }
    }
    const breadcrumbItemClick = (e, index) => {
        e.preventDefault()
        setSelectNode(pathSnippets[index])
        EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(pathSnippets[index]));
    }

    const { show } = useContextMenu({
        id: menuId
    })
    // 右键点击事件
    const contextMenuFn = (event, node: EditorAssetInfo, isSelected) => {
        if (!node) {
            return;
        }
        setIsCurrentFolder(isSelected)
        event.preventDefault()
        event.stopPropagation()

        // 则是当前窗口的文件夹
        if (isSelected) {
            setHighlight([''])
            //console.log('当前窗口文件夹selectNode', pathSnippets[pathSnippets.length - 1]);

        }
        else {
            //console.log('选中文件夹node', node);
            setHighlight([node.key])
        }
        show(event, {
            props: node
        })
    }
    const emitSetData = (newCreate) => {
        if (isCurrentFolder) {
            setData([...data, newCreate])
            //console.log('newCreate--------', newCreate);
        } else {
            const assetData: EditorAssetInfo = FileInfoManager.Instance.getDirByKey(newCreate.pareKey);

            setData([newCreate])
            setPareData(assetData)
        }
    }
    return (
        <div className="layout-box-2" onContextMenu={(e) => contextMenuFn(e, null, true)}>
            <div className="lay-1">
                <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
            </div>
            <div className="lay-2" ref={boxRef}>
                {/* <ProjectData  msg={size}/> */}
                <Routes>
                    {/* <Route path="/apps" element={Apps} /> */}
                    <Route path="*" element={<div className="data-box">
                        {/* 文件横向排布 */}
                        {size > 0 && (
                            <div className="iconAndFont-layout1">
                                {data.map((_item: EditorAssetInfo, index) => (
                                    <div key={_item.key} ref={
                                        (ele) => {
                                            if (ele) {
                                                eventFactory.addEventListener(ele, "TouchDrag", EditorApplication.Instance.selection.dragAsset(_item))
                                            }
                                        }
                                    }
                                        className="iconAndFont-ul" onClick={(e) => selectFile(_item, data, e)}
                                        onDoubleClick={(e) => selectDoubleFile(_item)}
                                        onContextMenu={(e) => contextMenuFn(e, _item, false)}
                                    >
                                        {
                                            //普通文件
                                            _item.isLeaf && (
                                                <div>
                                                    <img
                                                        src={getImg(_item.FileType)}
                                                        alt=""
                                                        style={{ width: size, minWidth: 30 }}
                                                        className="not-drag"
                                                    />
                                                </div>
                                            )
                                        }
                                        {
                                            //普通文件夹
                                            !_item.isLeaf && _item.DirType == "" && (
                                                <div>
                                                    <img
                                                        src={folder}
                                                        alt=""
                                                        style={{ width: size, minWidth: 30 }}
                                                        className="not-drag"
                                                    />
                                                </div>
                                            )
                                        }
                                        {
                                            //特殊文件夹
                                            !_item.isLeaf && _item.DirType != "" && (
                                                <div>
                                                    <img
                                                        src={getImg(_item.DirType)}
                                                        alt=""
                                                        style={{ width: size, minWidth: 30 }}
                                                        className="not-drag"
                                                    />
                                                </div>
                                            )
                                        }

                                        <div className="ul-font" style={{ width: size, minWidth: 30, color: "#FFFFFF" }}>
                                            {
                                                _item.isEditable ? <NameInput className="name-input" item={_item} /> : <div className="ul-font-in">{_item.value}</div>
                                            }
                                        </div>

                                        {/* 高亮框 */}
                                        <div className={highlightKey.includes(_item.key) ? 'highlight-box' : ''}></div>
                                    </div>
                                    // </Link>
                                ))}
                            </div>
                        )}
                        {/* 文件列表排布 */}
                        {size == 0 && (
                            <div className="iconAndFont-layout2">
                                {data.map((_item2: any, index2) => (
                                    <div key={_item2.key} className="not-drag" style={{ background: highlightKey.includes(_item2.key) ? '#5b80a3' : '', color: "white" }}>
                                        <div className="iconAndFont-li"
                                            ref={
                                                (ele) => {
                                                    if (ele) {
                                                        eventFactory.addEventListener(ele, "TouchDrag", EditorApplication.Instance.selection.dragAsset(_item2))
                                                    }
                                                }
                                            }
                                            onClick={(e) => selectFile(_item2, data, e)}
                                            onDoubleClick={(e) => selectDoubleFile(_item2)}
                                            onContextMenu={(e) => contextMenuFn(e, _item2, false)}
                                        >
                                            {
                                                //普通文件
                                                _item2.isLeaf && (
                                                    <div>
                                                        <img src={getImg(_item2.FileType)} alt="" style={{ width: 15 }}
                                                            className="not-drag" />
                                                    </div>
                                                )
                                            }
                                            {
                                                //普通文件夹
                                                !_item2.isLeaf && _item2.DirType == "" && (
                                                    <div>
                                                        <img src={folder} alt="" style={{ width: 15 }} className="not-drag" />
                                                    </div>
                                                )
                                            }
                                            {
                                                //特殊文件夹
                                                !_item2.isLeaf && _item2.DirType != "" && (
                                                    <div>
                                                        <img src={getImg(_item2.DirType)} alt="" style={{ width: 15 }}
                                                            className="not-drag" />
                                                    </div>
                                                )
                                            }
                                            <div className="li-font">
                                                {
                                                    _item2.isEditable ? <NameInput className="name-input" item={_item2} /> : _item2.value
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>} />
                </Routes>
            </div>
            <div className="lay-3">
                <div className="slider">
                    <Slider
                        tipFormatter={null}
                        value={size}
                        onChange={(value: React.SetStateAction<number>) =>
                            setSize(value)
                        }
                        onAfterChange={onAfterChange}
                    />
                </div>
            </div>
            <ContextMenu menuId={menuId} emitSetData={emitSetData}></ContextMenu>
        </div>
    )
}
export default ProjectData
