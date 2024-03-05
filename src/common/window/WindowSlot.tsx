import React, {useEffect, useState} from "react";
import {IWindowInstance, Window} from "./Window";
import {EditorEventMgr} from "../../Game/Event/EditorEventMgr";
import {WindowManager} from "./WindowManager";

/**
 * 窗体插槽, 负责存放所有窗口
 */
export function WindowSlot() {

    const [list, setList] = useState<IWindowInstance[]>([]);

    useEffect(() => {
        //监听窗口改变
        let binder = EditorEventMgr.Instance.addEventListener("OnWindowListRefresh", (windowList) => {
            
            setList(prevState => {
                let tempList = [...prevState];
                let newList = [...windowList];

                for (let i = 0; i < tempList.length; i++) {
                    let item = tempList[i];
                    let index = newList.findIndex(value => value.id == item.id);
                    if (index == -1) { //不存在, 表示被删除
                        tempList.splice(i, 1);
                        i--;
                    } else { //仍然存在
                        tempList[i] = newList[index];
                        newList.splice(index, 1);
                    }
                }
                //newList 剩下的为新增的
                tempList = tempList.concat(newList);
                
                return tempList;
            });
        });

        return () => {
            binder.removeListener();
        }
    }, []);
    
    //点击 title, 让最后一个 window 显示在最前面
    function onTop(id: number) {
        if (!WindowManager.hasWindow(id)) {
            return;
        }
        let tempList = [...list];
        for (let i = 0; i < tempList.length; i++) {
            let item = tempList[i];
            if (item.id == id) {
                tempList.splice(i, 1);
                tempList.push(item);
                setList(tempList);
                return;
            }
        }
    }

    //窗口是否在顶端
    function isTop(id: number) {
        if (!WindowManager.hasWindow(id)) {
            return false;
        }
        return list[list.length - 1].id == id;
    }

    return (
        <>
            {
                list.map(item => {
                    return (
                        <Window key={item.id} {...item} onTop={onTop} isTop={isTop}></Window>
                    )
                })
            }
        </>
    )
}