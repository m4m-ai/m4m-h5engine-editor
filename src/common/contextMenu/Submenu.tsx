import React, { useEffect, useRef, useState } from "react";
import { RightOutlined } from "@ant-design/icons";

import { IMenuOption } from './ContextMenuSlot'
import { Item } from "./Item";

interface PropsType extends IMenuOption {
   
}

export function Submenu(props: PropsType) {
    const submenuWrap = useRef<HTMLDivElement>(null)

    const [subLeft, setSubLeft] = useState<number>(0)
    const [subDisplay, setSubDisplay] = useState<string>('none')

    const showSubmenu = () => {
        setSubLeft(submenuWrap.current.offsetWidth)
        setSubDisplay('block')
        
    }
    const hiddenSubmenu = () => {
        setSubDisplay('none')
    }

    useEffect(()=> {
        if(submenuWrap) {
            setSubLeft(submenuWrap.current.offsetWidth)
        }
    }, [])

    return (
        <div onMouseEnter={showSubmenu} onMouseLeave={hiddenSubmenu} className="react-contexify__item">
            <div ref={submenuWrap} className="context-menu submenu react-contexify__item__content">
                <div>
                    {props.title}
                </div>
                <RightOutlined />
            </div>
            <div className='react-contexify' style={{left: subLeft, top: 0, position: 'absolute', opacity: 1, display: subDisplay}}>
                {
                    props.children.map((item,index) => {
                        return item.children ? <Submenu key={index} {...item} /> : <Item key={index} {...item} />
                         
                        // return <Item key={index} {...item} />
                    })
                }
            </div>
        </div>
    )
}