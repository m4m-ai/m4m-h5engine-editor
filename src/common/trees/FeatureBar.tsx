import React from 'react'
import './featureBar.css'
import { ApiOutlined, CaretDownOutlined, PlusOutlined, SearchOutlined, } from '@ant-design/icons'
import { Dropdown, Input, Menu, MenuProps, Space } from 'antd'
import { EditorHierarchyHandle } from "../../Game/Tree/EditorHierarchyHandle";
import { EditorApplication } from "../../Game/EditorApplication";
import transform = m4m.framework.transform;
import PrimitiveType = m4m.framework.PrimitiveType;

//点击菜单项
const handleMenuClick: MenuProps['onClick'] = e => {
    //console.log('click', e)
}

const menu = (
    <Menu
        onClick={handleMenuClick}
        items={[
            {
                key: '1',
                label: 'Create Empty',
                onClick() {
                    EditorHierarchyHandle.create3dEmptyObject(EditorApplication.Instance.editorScene.getCurrentRoot());
                }
            },
            {
                key: '2',
                label: 'Create Empty Child',
                onClick() {
                    let ea = EditorApplication.Instance;
                    let activeTransform = ea.selection.activeTransform;
                    if (activeTransform instanceof transform) {
                        EditorHierarchyHandle.create3dEmptyObject(activeTransform);
                    } else {
                        EditorHierarchyHandle.create3dEmptyObject(ea.editorScene.getCurrentRoot());
                    }
                }
            },
            {
                key: '3',
                label: '3D Object',
                children: [
                    {
                        key: '3-1',
                        label: 'Cube',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Cube, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    },
                    {
                        key: '3-2',
                        label: 'Sphere',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Sphere, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    },
                    {
                        key: '3-3',
                        label: 'Plane',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Plane, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    },
                    {
                        key: '3-4',
                        label: 'Pyramid',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Pyramid, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    },
                    {
                        key: '3-5',
                        label: 'Capsule',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Capsule, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    },
                    {
                        key: '3-6',
                        label: 'Cylinder',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Cylinder, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    },
                    {
                        key: '3-7',
                        label: 'Quad',
                        onClick() {
                            EditorHierarchyHandle.createPrimitive(PrimitiveType.Quad, EditorApplication.Instance.editorScene.getCurrentRoot());
                        }
                    }
                ]
            },
        ]}
    />
)

const onclick2 = () => {
    //console.log('点击icon')
}

const FeatureBar = (props) => (
    <div className="featureBar-box">
        <div className="box-1">
            <Dropdown overlay={menu} trigger={['click']}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        <PlusOutlined />
                        <CaretDownOutlined />
                    </Space>
                </a>
            </Dropdown>
        </div>
        <div className="box-2">
            <div className="box-2-1">
                <Input
                    className="box-2-input"
                    size="small"
                    placeholder="All"
                    prefix={<SearchOutlined className="searchOutl" />}
                    onChange={(e) => props.emitInputChange(e.target.value)}
                />
            </div>
            {/* 未实现功能屏蔽: 搜索节点树左侧按钮 */}
            {/* <div className="box-2-2">
                <ApiOutlined className="apiOutl" onClick={onclick2} />
            </div> */}
        </div>
    </div>
)

export default FeatureBar
