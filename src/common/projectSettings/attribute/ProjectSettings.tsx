import React, { useEffect, useRef, useState } from "react";
import { Input, } from 'antd'
import sear from '../../../assets/搜索.png'
import { EditorInputMgr } from "../../../Game/Input/EditorInputMgr";
// import '../font/iconfont.css'
import '../Project.css'
import { ProjectLeftCom } from './ProjectComponent'
import {EditorEventMgr} from '../../../Game/Event/EditorEventMgr'
import { SettingKind } from "../../projectSettings/ProjectSettingsManager";


export interface ProjectDialogAttrData {
    visible: boolean;
    // assetsList: contentListData[],
    // sceneList: contentListData[],
    handleClose: (v: boolean) => void

}
 // 数据
const data: SettingKind[] = [

];

interface contentListData {
    icon: string,
    name: string
}

export function ProjectSettings(data: ProjectDialogAttrData) {
    let binder: any;
    const boxRef = useRef(null)
    const [textTitle, setTextTitle] = useState('Audio') // 子组件title
    const [comTitle, setcomTItle] = useState('async') // 子组件动态数据
    useEffect(() => {
        return () => {
            if (binder) {
                binder.removeListener();
            }
        }
    }, [data]);

    if (!data.visible) {
        return null;
    }

    // 拉伸组件  待优化 useEffect
    function FlexibleAreaComp() {
        let binder_top;
        let binder_bottom;
        let binder_left;
        let binder_right;
        let binder_bottomright;
        let binder_bottomleft;
        let binder_topright;
        let binder_topleft;

        const topRef = useRef(null)
        const bottomRef = useRef(null)
        const leftRef = useRef(null)
        const rightRef = useRef(null)

        const bottomright = useRef(null)
        const bottomleft = useRef(null)
        const topright = useRef(null)
        const topleft = useRef(null)

        // 上拉
        useEffect(() => {
            binder_top = EditorInputMgr.Instance.addElementEventListener(topRef.current, 'TouchDrag', (touchPosition, state) => {
                if (topRef.current) {
                    boxRef.current.style.top = touchPosition.y + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight - touchPosition.offsetY + 'px'
                }
            })

            return () => {
                if (binder_top) {
                    binder_top.removeListener();
                }
            }
        })
        // 下拉
        useEffect(() => {
            binder_bottom = EditorInputMgr.Instance.addElementEventListener(bottomRef.current, 'TouchDrag', (touchPosition, state) => {
                if (bottomRef.current) {
                    boxRef.current.style.height = boxRef.current.offsetHeight + touchPosition.offsetY + 'px'
                }
            })
            return () => {
                if (binder_bottom) {
                    binder_bottom.removeListener();
                }
            }
        })
        // 右拉
        useEffect(() => {
            binder_right = EditorInputMgr.Instance.addElementEventListener(rightRef.current, 'TouchDrag', (touchPosition, state) => {
                if (rightRef.current) {
                    boxRef.current.style.width = boxRef.current.offsetWidth + touchPosition.offsetX + 'px'
                }
            })
            return () => {
                if (binder_right) {
                    binder_right.removeListener();
                }
            }
        })
        // 左拉
        useEffect(() => {
            binder_left = EditorInputMgr.Instance.addElementEventListener(leftRef.current, 'TouchDrag', (touchPosition, state) => {
                if (leftRef.current) {
                    boxRef.current.style.left = touchPosition.x + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth - touchPosition.offsetX + 'px'
                }
            })
            return () => {
                if (binder_left) {
                    binder_left.removeListener();
                }
            }
        })
        // 右下拉
        useEffect(() => {
            binder_bottomright = EditorInputMgr.Instance.addElementEventListener(bottomright.current, 'TouchDrag', (touchPosition, state) => {
                if (bottomright.current) {
                    boxRef.current.style.width = boxRef.current.offsetWidth + touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight + touchPosition.offsetY + 'px'
                }
            })
            return () => {
                if (binder_bottomright) {
                    binder_bottomright.removeListener();
                }
            }
        })
        // 左下拉
        useEffect(() => {
            binder_bottomleft = EditorInputMgr.Instance.addElementEventListener(bottomleft.current, 'TouchDrag', (touchPosition, state) => {
                if (bottomleft.current) {
                    boxRef.current.style.left = touchPosition.x + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth - touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight + touchPosition.offsetY + 'px'
                }
            })
            return () => {
                if (binder_bottomleft) {
                    binder_bottomleft.removeListener();
                }
            }
        })
        // 右上拉
        useEffect(() => {
            binder_topright = EditorInputMgr.Instance.addElementEventListener(topright.current, 'TouchDrag', (touchPosition, state) => {
                if (topright.current) {
                    boxRef.current.style.top = touchPosition.y + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth + touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight - touchPosition.offsetY + 'px'
                }
            })
            return () => {
                if (binder_topright) {
                    binder_topright.removeListener();
                }
            }
        })
        // 左上拉
        useEffect(() => {
            binder_topleft = EditorInputMgr.Instance.addElementEventListener(topleft.current, 'TouchDrag', (touchPosition, state) => {
                if (topleft.current) {
                    boxRef.current.style.left = touchPosition.x + 'px'
                    boxRef.current.style.top = touchPosition.y + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth - touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight - touchPosition.offsetY + 'px'
                }
            })
            return () => {
                if (binder_topleft) {
                    binder_topleft.removeListener();
                }
            }
        })

        return (
            <div>
                <div ref={topRef} className="line-common fd-top-line"></div>
                <div ref={bottomRef} className="line-common fd-bottom-line"></div>
                <div ref={leftRef} className="line-common fd-left-line"></div>
                <div ref={rightRef} className="line-common fd-right-line"></div>

                <div ref={topleft} className="corner-common fd-topleft-corner"></div>
                <div ref={topright} className="corner-common fd-topright-corner"></div>
                <div ref={bottomleft} className="corner-common fd-bottomleft-corner"></div>
                <div ref={bottomright} className="corner-common fd-bottomright-corner"></div>
            </div>
        )
    }
    //  border 分割线
    function BorderComp() {
        return (
            <div className="pr-border-marginTop"></div>
        )
    }
    // 虚拟tab数据
    const TabData = [
        'Audio', 'Package Manager', 'Quality', 'Player', 'Editor'
    ]
    // 虚拟子组件数据
    const ProComponent = [
        'async', 'await', 'attr', 'prototype', 'watch'
    ]
    function LeftComp() {
        const TabeventStore = EditorInputMgr.Instance.createElementEventFactory()
        useEffect(() => {

            return () => {
                TabeventStore.removeAllEventListener()
            }
        })

        useEffect(() => {


            let binder = EditorEventMgr.Instance.addEventListener("OpenProjectSetting", (data) => {
                console.log("传入数据");
            });

            return () => {
                binder.removeListener();
            }
        }, []);

        function active(elem) {
            var r = [];
            var n = elem.parentNode.firstChild;
            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }
            return r;
        }
        return (
            <div className="pr-left-box" >
                {
                    TabData.map((item, index) =>
                        <div key={index} className={item === textTitle ? 'pr-bgc-pitch' : ''} ref={(element) => {
                            if (element) {
                                TabeventStore.addEventListener(element, 'TouchClick', () => {
                                    const sibling = active(element)
                                    sibling.forEach((item) => {
                                        item.className = ''
                                    })
                                    let index = TabData.indexOf(element.textContent)
                                    setcomTItle(ProComponent[index])
                                    element.className = 'pr-bgc-pitch'
                                    setTextTitle(element.textContent) // 解决 类名判断条件就是传入子组件的数据

                                })
                            }
                        }

                        }>
                            <div className='pr-bgc-padding'>{item}</div>
                        </div>
                    )
                }
            </div>
        )
    }
    return (
        <div className="pr-box" ref={boxRef} >
            {/* 头部 */}
            <div className="fd-header" style={{ backgroundColor: '#1e1e1e', paddingLeft: '0px', height: '20px' }} ref={
                (ele) => {
                    let offsetX;
                    let offsetY;
                    if (ele) {
                        binder = EditorInputMgr.Instance.addElementEventListener(ele, "TouchDrag", (touchPosition, state) => {
                            if (state === 0) {
                                offsetX = touchPosition.offsetX
                                offsetY = touchPosition.offsetY
                            }
                            boxRef.current.style.left = touchPosition.x - offsetX + 'px'
                            boxRef.current.style.top = touchPosition.y - offsetY + 'px'
                        });
                    }
                }
            }>
                <div className="pr-title" >Project Settings</div> {/* 写死title */}
                <div className='flex'>
                    <div className="iconfont icon-24gf-ellipsisVertical  icon"></div>
                    <div className="iconfont icon--shangbiankuang  icon"></div>
                    <div className=" flex-middle icon iconfont icon-guanbi" onClick={() => data.handleClose(false)}></div>
                </div>

            </div>
            {/* 搜索 */}
            <Input
                size="small"
                prefix={<img className="pr-search" src={sear} />}
                className="pr-search-Ipt"
            />
            <div className="flex-adaptive" style={{ top: "15px" }}>
                {/* 分割线 */}
                <BorderComp></BorderComp>
                <div className="flex">
                    {/* 左 */}
                    <LeftComp></LeftComp>
                    {/* 右 */}
                    <ProjectLeftCom title={textTitle} item={comTitle}></ProjectLeftCom>
                </div>

            </div>
            <FlexibleAreaComp></FlexibleAreaComp>
        </div>
    )
}