import React, { useEffect, useRef, useState } from "react";
import {Input} from "antd";
import Slider from 'antd/lib/slider'
import sear from '../../../../assets/搜索.png'
import { EditorInputMgr } from "../../../../Game/Input/EditorInputMgr";
import style from './attribute.module.scss';


export interface FileDialogAttrData {
    assetsList: contentListData[],
    sceneList: contentListData[],
}

interface contentListData {
    icon: string,
    name: string
}

export function FileDialog(data: FileDialogAttrData){
    let binder: any;

    useEffect(() => {
        return () => {
            if (binder) {
                binder.removeListener();
            }
        }
    }, [data]);


    function TabComp() {
        const [currentIndex, setCurrentIndex] = useState(0)
        const [contentList, setContentList] = useState(data.assetsList)
        const [sliderValue, setSliderValue] = useState(0)

        const contentRef = useRef(null)

        const tabList = [
            {
                id: 0,
                name: 'Assets'
            },
            {
                id: 1,
                name: 'Scene'
            }
        ]
        
        // 改变标签页
        function changeTabIndex(id: number) {
            setCurrentIndex(id)
            setContentList(id === 0 ? data.assetsList : data.sceneList)
            // 需优化，childrenList 需要等 contentList 改变才赋值
            setTimeout(()=> {
                setSize(sliderValue)
            }, 0)
        }

        function setSize(val) {
            const per = val / 100
            const childrenList = contentRef.current.children
            
            if(per < 0.10) {
                contentRef.current.classList.remove('fd-content-flex')
                for(let i = 0, n = childrenList.length; i < n; i++) {
                    childrenList[i].style.display = 'flex'
                }
                setSliderValue(0)
            }
            if(per >= 0.20) {
                contentRef.current.classList.add('fd-content-flex')
                for(let i = 0, n = childrenList.length; i < n; i++) {
                    childrenList[i].style.display = 'block'
                    childrenList[i].style.marginRight = '6px'
                    childrenList[i].firstChild.style.width = 120 * per + 'px'
                    childrenList[i].firstChild.style.height = 140 * per + 'px'
                }
                setSliderValue(val)
            }
        }

        return (
            <div className="flex-adaptive-upper">
                <div className="fd-tab">
                    <div className="fd-tab-left">
                        {
                            tabList.map(item => (
                                <div className={currentIndex === item.id ? 'fd-tab-active' : ''} key={item.id} onClick={() => changeTabIndex(item.id)}>{item.name}</div>
                            ))
                        }
                    </div>
                    <div className="fd-tab-right">
                        <div className="slider fd-tab-slider">
                            <Slider
                                tipFormatter={null}
                                value={sliderValue}
                                onChange={(val)=>{
                                    setSize(val)
                                }}
                            />
                        </div>
                        <div className="flex-middle" style={{display: currentIndex === 1 ?  'none':'' }}>隐藏</div>
                    </div>
                </div>
                <div className="fd-content" ref={contentRef}>
                    {
                        contentList.map((item, index)=> (
                            <div key={index} className="fd-content-item">
                                <img className="fd-content-item-pic" src={item.icon} alt=""/>
                                <div className="fd-content-item-name">{item.name}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    function FooterComp() {
        const footerRef = useRef(null)
        const dragLineRef = useRef(null)
        const footerPicRef = useRef(null)

        let binder: any;
        useEffect(()=>{
            if(dragLineRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                binder = EditorInputMgr.Instance.addElementEventListener(dragLineRef.current, "TouchDrag", (touchPosition, state) => {
                    const pre_height = footerRef.current.offsetHeight
                    const {offsetY} = touchPosition
                    const now_height = pre_height - offsetY

                    let max_height = 280
                    let min_height = 30
                    if(now_height <= max_height &&  now_height >= min_height) {
                        // 设置底部div 的处理
                        footerRef.current.style.height = now_height + 'px'
                        // 底部div 图片的处理
                        footerPicRef.current.style.width = footerPicRef.current.offsetWidth - offsetY + 'px'
                    }
                });
            }
            return () => {
                if (binder) {
                    binder.removeListener();
                }
            }
        })

        return (
                <div ref={footerRef} className="fd-footer">
                    <div ref={dragLineRef} className="fd-footer-border">
                        <div className="border-drag-first"></div>
                        <div className="border-drag-second"></div>
                    </div>
                    <div className="fd-footer-container">
                        <img ref={footerPicRef} className="fd-footer-pic" src="" alt="" />
                        <div className="fd-footer-content">content</div>
                    </div>
                </div>
        )
    }
    
    return (
        <div className={style.selectMaterial}>
            {/* 搜索 */}
            <Input 
              size="small"
              prefix={<img className="fd-searchP" src={sear} />}
            />
            <div className="flex-adaptive">
                {/* 标签组件 */}
                <TabComp></TabComp>
                {/* 底部 */}
                <FooterComp></FooterComp>
            </div>
        </div>
    )
}
