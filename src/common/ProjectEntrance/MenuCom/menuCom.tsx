import React from "react";
import { Menu, MenuProps } from 'antd';
import style from './menuCom.module.scss'

interface PropsType {
    menuList: MenuProps['items'],
    emitSetMenuKey: Function,
    currentMenuKey: String
}

export default function MenuCom(props: PropsType) {
    //console.log('props.menuList[0].key.toString()',props.menuList[0].key.toString());
    

    return (
        <Menu
            // defaultSelectedKeys={[props.menuList[0].key.toString()]}
            selectedKeys={[props.currentMenuKey.toString()]}
            className={style.box}
            mode="inline"
            items={props.menuList}
            onClick={({key}) => props.emitSetMenuKey(key)}
        />
    )
}