import { Button, Checkbox, Dropdown, Form, Input, Menu, MenuProps, Modal, Select, Space } from "antd";
import { CaretDownFilled, MenuUnfoldOutlined } from "@ant-design/icons";
import ModalColor from "./ModalColor";
import React, { useEffect, useState } from "react";
import { IInspertorGameobjectData } from "../../Game/Panel/InspertorMgr";
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { WindowManager } from "../window/WindowManager";

const handleMenuClick: MenuProps['onClick'] = e => {
    console.log('click', e)
}

//菜单组件的数据
const menu = (
    <Menu
        onClick={handleMenuClick}
        items={[
            {
                label: <a>1st menu item</a>,
                key: '0'
            },
            {
                label: <a>2nd menu item</a>,
                key: '1'
            },
            {
                type: 'divider'
            },
            {
                label: '3rd menu item',
                key: '3'
            }
        ]}
    />
)

let colorWindowId;

export function InspectorHead(data: IInspertorGameobjectData) {
    //组件面板是否打开
    const [objectVisible, setObjectVisible] = useState(data.visible);

    // 颜色值
    const [color, setColor] = useState<m4m.math.color[]>([]);

    useEffect(() => {
        setObjectVisible(data.visible);
    }, [data])

    const showModal = () => {
        colorWindowId = WindowManager.createWindow({
            body: (
                <ModalColor color={color} setColor={setColor} handleCancel={handleCancel} handleOk={handleOk}/>
            ),
            width: 820,
            height: 540,
            minWidth: 820,
            minHeight: 540,
            title: "颜色提取器",
        })
        
        return colorWindowId
    }
    const handleOk = () => {
        console.log('handleOk');
        EditorEventMgr.Instance.emitEvent('OnSelectColor', cb => cb(color))
    }
    const handleCancel = () => {
        console.log('handleCancel');
        console.log('colorWindowId', colorWindowId);
        
        WindowManager.closeWindow(colorWindowId);
    }

    const handleChange1 = (value: { value: any; label: React.ReactNode }) => {
        console.log('Tag打印', value)
    }
    const handleChange2 = (value: { value: any; label: React.ReactNode }) => {
        console.log('Layer打印', value)
    }

    return (
        <div className="inspector-content-1">
            <div className="inspector-left" style={{ width: "10px" }}>
                {/* 未实现功能屏蔽: GameObject 颜色选择, 上面的 width: "10px" 也算临时处理 */}
                {/* <div className="popover-color">
                    <Button className="but" onClick={showModal}>
                        <MenuUnfoldOutlined className="menuU" />
                    </Button>
                </div> */}
            </div>
            <div className="inspector-right">
                <div className="inspector-right-up">
                    <div className="up-1">
                        <Checkbox className="checkb" checked={objectVisible} onChange={
                            e => {
                                setObjectVisible(e.target.checked);
                                data.onVisibleChange(e.target.checked);
                            }
                        }></Checkbox>
                    </div>
                    <div className="up-2">
                        <Input value={data.name} />
                    </div>
                    {/* 未实现功能屏蔽: gameobject静态 */}
                    <div className="up-4">Static</div>
                    {/* <div className="up-3">
                        <Checkbox checked={data.isStatic}>Static</Checkbox>
                    </div>
                    <div className="up-5">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a onClick={e => e.preventDefault()}>
                                <Space>
                                    <CaretDownFilled />
                                </Space>
                            </a>
                        </Dropdown>
                    </div> */}
                </div>
                <div className="inspector-right-down">
                    <div className="down-1">
                        <Form.Item label="Tag">
                            {/* 未实现功能屏蔽: gameobject选择标签 */}
                            <label style={{ color: "#DDDBDB", fontSize: "12px" }}>{ data.tag }</label>
                            {/* <Select
                                className="ins-select"
                                value={data.tag as any}
                                onChange={handleChange1}
                            >
                                <Select.Option value="Untagged">Untagged</Select.Option>
                                <Select.Option value="Respawn">Respawn</Select.Option>
                            </Select> */}
                        </Form.Item>
                    </div>
                    <div className="down-2">
                        <Form.Item label="Layer">
                            {/* 未实现功能屏蔽: gameobject选择层级 */}
                            <label style={{ color: "#DDDBDB", fontSize: "12px" }}>{ "Default" }</label>
                            {/* <Select
                                defaultValue={{ value: 'Default', label: 'Default' }}
                                onChange={handleChange2}
                            >
                                <Select.Option value="Default">Default</Select.Option>
                                <Select.Option value="Ui">Ui</Select.Option>
                            </Select> */}
                        </Form.Item>
                    </div>
                </div>
            </div>
        </div>
    )
}