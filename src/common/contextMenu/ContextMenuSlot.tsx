import React, { MouseEvent, useEffect, useState } from "react";
import './ContextMenu.css';
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { EditorInputMgr } from "../../Game/Input/EditorInputMgr";
import { IEventBinder } from "../../Game/Event/IEventBinder";

import { Item } from './Item'
import { Submenu } from './Submenu'

export interface IContextMenuData {
    /** x坐标 */
    x: number;
    /** y坐标 */
    y: number;
    items: IMenuOption[];
}

export interface IMenuOption {
    /** 显示文本 */
    title: string;
    /** 点击回调 */
    onClick(e: MouseEvent);
    children?: IMenuOption[];
}

export function ContextMenuSlot() {

    const [contextMenuData, setContextMenuData] = useState<IContextMenuData>(null);

    useEffect(() => {
        let binder2: IEventBinder;
        let binder = EditorEventMgr.Instance.addEventListener("ShowContextMenu", (menuData) => {
            setContextMenuData(menuData);

            binder2 = EditorInputMgr.Instance.addElementEventListener(document.body, "TouchClick", (touch) => {
                if (binder2) {
                    binder2.removeListener();
                    binder2 = null;
                }

                setContextMenuData(null);
            });
        });

        return () => {
            binder.removeListener();
            if (binder2) {
                binder2.removeListener();
            }
        }
    }, []);

    useEffect(() => {
        //console.log('contextMenuData', contextMenuData);
    })

    return (
        contextMenuData ? (
            <div className={"contextMenuSlot"} style={{ left: contextMenuData.x, top: contextMenuData.y }} >
                <div className='react-contexify' style={{ opacity: "1" }} ref={
                    (ele) => {
                        if (ele) {
                            const clientW = window.innerWidth
                            const clientH = window.innerHeight

                            if (contextMenuData.x < 0) {
                                setContextMenuData(pre => {
                                    let newObj = { ...pre }
                                    newObj.x = 0
                                    return newObj
                                })
                            }
                            if (contextMenuData.y < 0) {
                                setContextMenuData(pre => {
                                    let newObj = { ...pre }
                                    newObj.y = 0
                                    return newObj
                                })
                            }
                            if (contextMenuData.x + ele.offsetWidth > clientW) {
                                setContextMenuData(pre => {
                                    let newObj = { ...pre }
                                    newObj.x = clientW - ele.offsetWidth
                                    return newObj
                                })
                            }
                            if (contextMenuData.y + ele.offsetHeight > clientH) {
                                setContextMenuData(pre => {
                                    let newObj = { ...pre }
                                    newObj.y = clientH - ele.offsetHeight
                                    return newObj
                                })
                            }

                        }
                    }
                }>
                    {
                        contextMenuData.items.map((item, index) => {
                            return (
                                item.children ? <Submenu key={index} {...item} /> : <Item key={index} {...item} />
                            )
                        })
                    }
                </div>
            </div>) : <></>
    )
}