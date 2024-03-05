import React, {useContext, useEffect} from 'react'
import { Menu, Item } from 'react-contexify'
import I2DComponent = m4m.framework.I2DComponent;
import INodeComponent = m4m.framework.INodeComponent;
import transform = m4m.framework.transform;
import transform2D = m4m.framework.transform2D;

export interface IMOContextMenuData {
    menuId: string;
    component: I2DComponent | INodeComponent | transform | transform2D;
}

// MoreOutlined 右键的菜单
export const MOContextMenu = (props: IMOContextMenuData) => {

    const menuId = props.menuId

    const list = [
        {
            name: 'Reset',
            handler: (arg)=>{
                //console.log(arg);
            }
        },
        {
            name: 'Remove Component',
            handler: (arg)=>{
                let component = props.component;
                if (component instanceof transform || component instanceof transform2D) {
                    console.error("不能移除 transform 和 transform2D 组件")
                } else {
                    if (component["gameObject"]) { //INodeComponent
                        let com = component as INodeComponent;
                        com.gameObject.removeComponent(com);
                    } else { //I2DComponent
                        let com = component as I2DComponent;
                        com.transform.removeComponent(com);
                    }
                }
                //console.log(props, arg);
            }
        }
    ]

    return (
        <Menu id={menuId}>
            {list.map(item => (
                <Item key={item.name} onClick={item.handler}>
                    {item.name}
                </Item>
            ))}
        </Menu>
    )
}
