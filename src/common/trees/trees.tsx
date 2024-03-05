import React, { useEffect, useRef, useState } from 'react'
// import type { DataNode, DirectoryTreeProps } from 'antd/es/tree'
import { CaretDownOutlined, CodeSandboxOutlined } from '@ant-design/icons'
import './index.css'
import 'antd/dist/antd.css'
import { Item, Menu, useContextMenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import FeatureBar from './FeatureBar'
import { HierarchyMgr, IHierarchyData } from "../../Game/Panel/HierarchyMgr";
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { Key } from "antd/es/table/interface";
import { EditorInputMgr } from "../../Game/Input/EditorInputMgr";
import { EditorApplication } from "../../Game/EditorApplication";
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;
import { ExportManager } from "../../Game/ExportManager/ExportManager";
import { Tree } from "antd";
import { IEventBinder } from '../../Game/Event/IEventBinder'
import { EditorHierarchyHandle } from '../../Game/Tree/EditorHierarchyHandle'


/**
 * 查询树下指定id的transform
 */
function queryTransById(data: IHierarchyData[], id: number): IHierarchyData["transfrom"] {
    for (let i = 0; i < data.length; i++) {
        let temp = data[i];
        if (temp.id == id) {
            return temp.transfrom;
        }
        if (temp.children != null) {
            let result = queryTransById(temp.children, id);
            if (result != null) {
                return result;
            }
        }
    }
    return null;
}

const eventFactory = EditorInputMgr.Instance.createElementEventFactory();

export function TreeDemo() {
    const [data, setData] = useState<IHierarchyData[]>([]);
    const [keys, setKeys] = useState<Key[]>([]);
    const [expandKey, setExpandKey] = useState<Key[]>([]);

    const boxRef = useRef<HTMLDivElement>();

    useEffect(() => {
        setData(HierarchyMgr.getTreeData());

        let binder1 = EditorEventMgr.Instance.addEventListener("OnSceneOpenSuccess", () => {
        });
        let binder3 = EditorEventMgr.Instance.addEventListener("RefreshNodeTree", () => {
            let datas = HierarchyMgr.getTreeData();
            setData(datas);
        });
        let binder2 = EditorEventMgr.Instance.addEventListener("OnSelectActiveObject", (trans) => {

            if (trans) {
                let key = trans.insId.getInsID().toString();

                const parentKeys = searchParentIds(trans)

                setExpandKey(prev => {
                    let filterArr: string[] = []
                    if (parentKeys.length > 0) {
                        filterArr = parentKeys.filter(key => prev.indexOf(key) === -1)
                    }
                    return [...prev, ...filterArr]
                })

                if (keys.length != 1 || keys[0] !== key) {
                    setKeys([key]);
                }

            }
        });

        let binder4: IEventBinder;

        //实例化 prefab
        let binder5 = EditorEventMgr.Instance.addEventListener("OnDragAsset", (assetInfo, reference, state) => {
            if (!assetInfo.isLeaf) {
                if (assetInfo.DirType == "Prefab2D") { //2d prefab
                    if (binder4) {
                        binder4.removeListener();
                        binder4 = null;
                    }
                    if (state == 0) {
                        binder4 = EditorInputMgr.Instance.addElementEventListener(boxRef.current, "TouchUp", touch => {
                            console.log("创建prefab2D: ", assetInfo);
                            //临时处理
                            let info = assetInfo.childrenFile.find(value => value.value == assetInfo.value + ".bin");
                            if (info) {
                                ExportManager.getPrefab2DByKey(info.key, EditorApplication.Instance.editorScene.getCurrent2DRoot());
                            }
                            binder4.removeListener();
                            binder4 = null;
                        });
                    }
                } else if (assetInfo.DirType == "Prefab3D") {
                    if (binder4) {
                        binder4.removeListener();
                        binder4 = null;
                    }
                    if (state == 0) {
                        binder4 = EditorInputMgr.Instance.addElementEventListener(boxRef.current, "TouchUp", touch => {
                            console.log("创建prefab3D: ", assetInfo);
                            //临时处理
                            let info = assetInfo.childrenFile.find(value => value.value == assetInfo.value + ".json");
                            if (info) {
                                ExportManager.Creat3DPrefabByKey(info.key, EditorApplication.Instance.editorScene.getCurrentRoot());
                            }
                            binder4.removeListener();
                            binder4 = null;
                        });
                    }
                }
            }
        })

        return () => {
            binder1.removeListener();
            binder3.removeListener();
            binder2.removeListener();
            if (binder4) {
                binder4.removeListener();
            }
            binder5.removeListener();
        }
    }, []);

    useEffect(() => {
        return () => {
            eventFactory.removeAllEventListener();
        }
    })

    //右键菜单栏
    const treeRightMenu = {
        menuId: '1',
        items: [
            {
                key: 'addSub',
                name: '添加子节点',
                handler: (props) => {
                    let trans = queryTransById(data, props.props.key);
                    if (trans) {
                        if (trans instanceof transform) {
                            EditorHierarchyHandle.createEmpty(trans);
                        } else {
                            let trans = new transform2D();
                            trans.name = "Game Object 2D";
                            trans.addChild(trans);
                            EditorEventMgr.Instance.emitEvent("SetActiveObject", cb => cb(trans));
                            EditorEventMgr.Instance.emitEvent("CameraLookTransform", cb => cb(trans));
                        }
                    }
                }
            },
            {
                key: 'del',
                name: '删除此节点',
                handler: (props) => {
                    let trans = queryTransById(data, props.props.key);
                    if (trans) {
                        trans.dispose();
                    }
                }
            }
        ]
    }

    //拖拽节点树
    const refDomFun = (trans: transform | transform2D) => {
        return (ele: HTMLDivElement | null) => {
            if (ele) {
                eventFactory.addEventListener(ele, "TouchDrag", EditorApplication.Instance.selection.dragTrans(trans));
            }
        }
    }

    //节点树
    const renderTreeNodes = (data: IHierarchyData[]) => {
        return data.map((item) => {
            let title = (
                <span>{item.title}</span>
            );
            if (item.children) {
                return (
                    <Tree.TreeNode title={title} key={item.id} domRef={refDomFun(item.transfrom)}>
                        {renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                )
            }
            return <Tree.TreeNode title={title} key={item.id} domRef={refDomFun(item.transfrom)} />
        })
    }

    // 右键菜单
    const ContextMenu = () => (
        <Menu id={treeRightMenu.menuId}>
            {treeRightMenu.items.map(item => (
                // 这里需要加key，不然要报错
                <Item key={item.key} onClick={item.handler}>
                    {item.name}
                </Item>
            ))}
        </Menu>
    )

    const { show } = useContextMenu({
        id: treeRightMenu.menuId
    })

    // 右键显示菜单
    const handleContextMenu = (event: any, node: any) => {
        event.preventDefault()
        show(event, {
            props: node
        })
    }

    // 数组扁平化
    let flattenArr = []
    function flatten(arr) {
        arr.forEach((item) => {
            flattenArr.push(item)
            if (item.children && item.children.length !== 0) {
                flatten(item.children)
            }
        })
    }
    flatten(data)

    const emitInputChange = (value) => {
        if (value === '') {
            setData(HierarchyMgr.getTreeData());
            return
        }

        const filterNodes = flattenArr.filter(item => {
            delete item.children
            return item.title.toLowerCase().indexOf(value) !== -1
        })
        setData(filterNodes)
    }

    // 需要将节点的 父节点 展开。 1. 在输入选中值清空需求; 2. 创建子节点需求; 3. 选中场景节点需求。
    const searchParentIds = (trans) => {
        let parentsIds: string[] = []
        while (trans.parent) {
            trans = trans.parent
            if (trans.insId.getInsID() === 3) {
                break
            }
            parentsIds.push(trans.insId.getInsID().toString())
        }
        return parentsIds
    }

    return (
        <div className="treeTest-box">
            <div className="treeTest-box1">
                <FeatureBar emitInputChange={emitInputChange} />
            </div>
            <div className="treeTest-box2" ref={boxRef}>
                <Tree.DirectoryTree
                    blockNode
                    showIcon
                    multiple
                    expandAction={false}
                    icon={<CodeSandboxOutlined />}
                    selectedKeys={keys}
                    draggable
                    onDrop={
                        (info) => {
                            //放入的节点
                            let dropKey = Number(info.node.key);
                            //拖拽的节点
                            let dragKey = Number(info.dragNode.key);

                            let dropTrans = queryTransById(data, dropKey);
                            let dragTrans = queryTransById(data, dragKey);

                            if (!info.dropToGap) { //放入子级
                                if (dropTrans instanceof transform && dragTrans instanceof transform) {
                                    let matrix = dragTrans.getWorldMatrix();
                                    dragTrans.parent.removeChild(dragTrans);
                                    dropTrans.addChildAt(dragTrans, 0);
                                    dragTrans.setWorldMatrix(matrix);
                                } else if (dropTrans instanceof transform2D && dragTrans instanceof transform2D) {
                                    let translate = dragTrans.getWorldTranslate();
                                    dragTrans.parent.removeChild(dragTrans);
                                    dropTrans.addChildAt(dragTrans, 0);
                                    dragTrans.setWorldPosition(translate);
                                } else if (dropTrans instanceof transform && dragTrans instanceof transform2D) {
                                    if (info.dropPosition <= 0 && dropTrans == EditorApplication.Instance.editorScene.canvasRenderer.gameObject.transform) {
                                        let translate = dragTrans.getWorldTranslate();
                                        let parent = dragTrans.parent;
                                        parent.removeChild(dragTrans);
                                        parent.addChildAt(dragTrans, 0);
                                        dragTrans.setWorldPosition(translate);
                                    }
                                }
                            } else {
                                if (dropTrans instanceof transform && dragTrans instanceof transform) {
                                    let matrix = dragTrans.getWorldMatrix();
                                    dragTrans.parent.removeChild(dragTrans);
                                    if (info.dropPosition < 0) {
                                        dropTrans.parent.addChildAt(dragTrans, 0);
                                    } else if (info.dropPosition >= dropTrans.parent.children.length) {
                                        dropTrans.parent.addChild(dragTrans);
                                    } else {
                                        dropTrans.parent.addChildAt(dragTrans, info.dropPosition);
                                    }
                                    dragTrans.setWorldMatrix(matrix);
                                } else if (dropTrans instanceof transform2D && dragTrans instanceof transform2D) {
                                    let translate = dragTrans.getWorldTranslate();
                                    dragTrans.parent.removeChild(dragTrans);
                                    if (info.dropPosition < 0) {
                                        dropTrans.parent.addChildAt(dragTrans, 0);
                                    } else if (info.dropPosition >= dropTrans.parent.children.length) {
                                        dropTrans.parent.addChild(dragTrans);
                                    } else {
                                        dropTrans.parent.addChildAt(dragTrans, info.dropPosition);
                                    }
                                    dragTrans.setWorldPosition(translate);
                                }
                            }
                        }
                    }
                    switcherIcon={<CaretDownOutlined style={{ color: "#686868" }} />}
                    expandedKeys={expandKey}
                    onRightClick={({ event, node }) => {
                        handleContextMenu(event, node)
                    }}
                    onSelect={
                        (selectedKeys, info) => {
                            setKeys(selectedKeys);
                        }
                    }
                    onExpand={
                        (keys) => {
                            console.log('onExpand', keys);
                            setExpandKey(keys)
                        }
                    }
                    onClick={
                        (event, node) => {
                            let trans = queryTransById(data, node.key as number);

                            if (trans) {
                                EditorEventMgr.Instance.emitEvent("SetActiveObject", cb => cb(trans));
                            }
                        }
                    }
                    onDoubleClick={
                        (event, node) => {
                            let trans = queryTransById(data, node.key as number);
                            if (trans) {
                                EditorEventMgr.Instance.emitEvent("CameraLookTransform", cb => cb(trans));
                            }
                        }
                    }
                >
                    {renderTreeNodes(data)}
                </Tree.DirectoryTree>
                <ContextMenu />
            </div>
        </div>
    )
}
