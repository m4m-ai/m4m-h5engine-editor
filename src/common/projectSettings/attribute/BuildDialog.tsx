/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef, useState } from "react";
import '../BuildDialog.css'
import { Button, } from 'antd'
import {ProjectSettings} from './ProjectSettings'
import { EditorInputMgr } from "../../../Game/Input/EditorInputMgr";
import '../font/iconfont.css'


export interface FileDialogAttrData {
    visible: boolean;
    assetsList: contentListData[],
    sceneList: contentListData[],
    handleClose: (v: boolean) => void

}

interface contentListData {
    icon: string,
    name: string
}

export function BuildDialog(data: FileDialogAttrData) {
    let binder: any;
    const boxRef = useRef(null)
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
    //  中间区域
    function TabComp() {
        // 虚拟数据
        const status = ()=>{
            const data =[
                {msg:'StartScene',count:0},
                {msg:'stautas',count:200},
                {msg:'marginis',count:500},
                {msg:'paddings',count:1000},
                {msg:'optionbs',count:200000},
                {msg:'iconts',count:9999},
                {msg:'media',count:-22000},
                {msg:'resachserf',count:879875},
                {msg:'display',count:12324},
            ]
            return  data
            
        }
         useEffect(()=>{
            const state = document.querySelectorAll('.bd-dialog-states')
            function active(elem){
                var r = [];   
                var n = elem.parentNode.firstChild;  
                for (; n; n = n.nextSibling) {
                    if (n.nodeType === 1 && n !== elem) {
                        r.push(n);
                    }
                }
                return r;
            }
            state.forEach((item)=>{ 
                item.addEventListener('click',()=>{
                  let arr = active(item)
                  arr.forEach((msg)=>{msg.className = 'flex bd-between'})
                  item.className='flex bd-between pitch-status'
                })
            })
         })
        return (
            <div className="bd-content">
                <div className="bd-Build">Scenes In Build</div>
                <div className="bd-middle">
                    {/* 默认选中状态  pitch-status */}
                      {/* 死数据 */}
                    <div className="flex bd-between pitch-status bd-dialog-states">
                        <div className="flex">
                            <input type="checkbox" className="bd-input" />
                            <div className="bd-middle-test">StartScene</div>
                        </div>
                        <div>0</div>
                    </div>
                    <div className="flex bd-between bd-dialog-states">
                        <div className="flex">
                            <input type="checkbox" className="bd-input" />
                            <div className="bd-middle-test">StartSopp</div>
                        </div>
                        <div>999</div>
                    </div>
                    <div className="flex bd-between bd-dialog-states">
                        <div className="flex">
                            <input type="checkbox" className="bd-input" />
                            <div className="bd-middle-test">StartScalse</div>
                        </div>
                        <div>50000</div>
                    </div>
                    <div className="flex bd-between bd-dialog-states">
                        <div className="flex">
                            <input type="checkbox" className="bd-input" />
                            <div className="bd-middle-test">StartSpush</div>
                        </div>
                        <div>1000</div>
                    </div>
                    <div className="flex bd-between bd-dialog-states">
                        <div className="flex">
                            <input type="checkbox" className="bd-input" />
                            <div className="bd-middle-test">StartSafter</div>
                        </div>
                        <div>500</div>
                    </div>
                </div>
                <div className="bd-btn flex">
                    <Button className="bd-button" >Add Open Scenes</Button>
                </div>

            </div>
        )
    }

    const FooterComp = () => {

        // 虚拟 bd-footer-right数据
        const Data = () => {
            return {
                data: {
                    'Pc,Mac & Linux Standalone': {
                        selectTitle: 'react',
                        options: ['1.0', '2.0', '3.0'],
                        checkoutTitle: 'zxc',
                        state: true,
                    },
                    'iOS': {
                        selectTitle: 'vue2',
                        options: ['for', 'if', 'else'],
                        checkoutTitle: 'zxq',
                        state: false,
                    },
                    Android: {
                        selectTitle: 'vue3',
                        options: ['root', 'id', 'class'],
                        checkoutTitle: 'ldx',
                        state: true,
                    },

                    PS5: {
                        selectTitle: 'node',
                        options: ['path', 'export',],
                        checkoutTitle: '987',
                        state: false,
                    },
                    WebGL: {
                        selectTitle: 'echares',
                        options: ['title', 'option', 'extend'],
                        checkoutTitle: 'watch',
                        state: false,
                    },
                    tvOS: {
                        selectTitle: 'vite',
                        options: ['config', 'script', 'style'],
                        checkoutTitle: 'computed',
                        state: false,
                    },
                    PS4: {
                        selectTitle: 'element',
                        options: ['dialog', 'row', 'asd'],
                        checkoutTitle: 'components',
                        state: false,
                    },
                    'Universal Windows Platform': {
                        selectTitle: 'uniapp',
                        options: ['create', 'mounte', 'update'],
                        checkoutTitle: 'vuex',
                        state: false,
                    },
                    'Xbox One': {
                        selectTitle: 'mySql',
                        options: ['select', 'zzz', 'yyyy'],
                        checkoutTitle: 'store',
                        state: false,
                    }
                }
            }
        }
        // 虚拟bd-footer-left 数据
        const TabData = ()=>{
            return {
              data:[
                  {title:'Pc,Mac & Linux Standalone',icon:'iconfont icon-diannao footer-icon'},
                  {title:'iOS',icon:'iconfont icon-ios footer-icon'},
                  {title:'Android',icon:'iconfont icon-android-o  footer-icon'},
                  {title:'PS5',icon:'iconfont icon-ps  footer-icon'},
                  {title:'WebGL',icon:'iconfont icon-HTML-5  footer-icon'},
                  {title:'tvOS',icon:'iconfont icon-nodejs  footer-icon'},
                  {title:'PS4',icon:'iconfont icon-ps  footer-icon'},
                  {title:'Universal Windows Platform',icon:'iconfont icon-windows  footer-icon'},
                  {title:'Xbox One',icon:'iconfont icon-xbox  footer-icon'}
                   ]
            }
         }
        const [rightData, setRightData] = useState({
            selectTitle: 'language',
            options: ['js','ts','net'],
            checkoutTitle: '',
            state: Boolean,
        }) // 点击后的数据
        const [optionValue, setOptionValue] = useState(['js','ts','net']) // select数据
        const [checkbox, setCheckbox] = useState(String) // checkbox title
        const [state, setState] = useState(true) // checkbox state
        const [tabData,setTabData] = useState([]) 
        const [ProjectShow,setProjectShow] =useState(false) // Project组件显示和隐藏
        const eventStore = EditorInputMgr.Instance.createElementEventFactory();

  
        useEffect(()=>{
            function getTabData(){
                const {data} = TabData()
                setTabData(data)
             }
                getTabData()
        },[])
      
        useEffect(() => {
            // 销毁事件
            return () => {
                eventStore.removeAllEventListener();
            }
        },)
        const handleShow = ()=>{
            setProjectShow( !ProjectShow)
        }
        return (
            <div className="bd-footer flex">
                {/* 左边 */}
                <div className="bd-footer-left">
                    <div>Platform</div>
                    <div className="bd-footer-left-body" >
                        {
                            tabData.map((item,index)=>
                            <div  className={item.title==='Pc,Mac & Linux Standalone'? 'bd-footer-left-click flex  bd-footer-font category':'flex  bd-footer-font category'} key={index}
                        ref={
                            (element) => {
                                if (element) {
                                    eventStore.addEventListener(element, 'TouchClick', () => {
                                        const rightcategory = document.querySelector('.categoryGet')
                                        rightcategory.textContent = element.textContent
                                        // 获取所有兄弟元素
                                            function active(elem){
                                            var r = [];   
                                            var n = elem.parentNode.firstChild;  
                                            for (; n; n = n.nextSibling) {
                                                if (n.nodeType === 1 && n !== elem) {
                                                    r.push(n);
                                                }
                                            }
                                            return r;
                                        }
                                        // 获取虚拟数据
                                        function getData(item) {
                                            const { data } = Data()
                                            let resolve;
                                            Object.keys(data).forEach((key) => {
                                                if (key === item) {
                                                    resolve = data[key]
                                                }
                                            })
                                            return resolve
                                        }
                                        let data = getData(element.textContent)
                                        setRightData(data)
                                        setOptionValue(data.options)
                                        setCheckbox(data.checkoutTitle)
                                        setState(data.state)
                                        const sibling = active(element)
                                       sibling.forEach((item)=>{item.className = 'flex bd-footer-font category'})
                                        element.className = 'bd-footer-left-click flex  bd-footer-font category'
                                    }) 
                                }
                            }
                        }>
                            <div className={item.icon}></div>
                          {item.title}
                        </div>)
                        }
                    </div>
                    <div className="bd-footer-btn">
                        <Button className="bd-button"  onClick={handleShow}>Player Settings...</Button>
                    </div>
                </div>
                {/* 右边 */}
                <div className="bd-footer-right" style={{ flex: 1 }}>
                    <div>
                        <div className="flex  bd-footer-font categoryGet" >
                            <div className="iconfont icon-diannao footer-icon"></div>
                            Pc,Mac & Linux Standalone
                        </div>
                    </div>
                    <div className="bd-footer-Set">
                        <div className="flex  bd-SetPadding">
                            <div className="bd-footer-text">{rightData.selectTitle}</div>
                            <div className="bd-footer-right-padding flex">
                                {
                                    optionValue ? <select name="" id="" className="bd-footer-select">
                                        {
                                            optionValue.map((item, index) => <option value={item} key={index}>{item}</option>)
                                        }

                                    </select> : null
                                }
                            </div>
                        </div>
                        <div className="flex  bd-SetPadding">
                            {
                                checkbox ? <div className="flex">
                                      <div className="bd-footer-text">{checkbox}</div>
                                      <div className="bd-footer-right-padding flex">
                                <input type="checkbox" className="bd-footer-right-ipt" checked={state} />
                                       </div>
                                </div> : null
                            }
                        </div>
                        <div className="flex bd-footer-right-lastRow">
                            <div className="bd-footer-text">Compression Method</div>
                            <div className="bd-footer-right-padding flex">
                                <select name="" id="" className="bd-footer-select">
                                    <option value="Default">Default</option>
                                </select>
                            </div>

                        </div>
                    </div>
                    {/* button */}
                    <div className="flex bd-footer-right-btn">
                        <Button className="bd-button" >Switch Platform</Button>
                        <Button className="bd-button btn-left-margin" disabled>Build And Run</Button>
                    </div>
                </div>
                <ProjectSettings handleClose={setProjectShow} visible={ProjectShow}></ProjectSettings>
            </div >
        )
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

    return (
        // fd ==> file-dialog
        <div className="bd-box" ref={boxRef} >
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
                <div className="bd-title" >Build Settings</div> {/* 写死title */}
                <div className='flex'>
                    <div className="iconfont icon-24gf-ellipsisVertical  icon"></div>
                    <div className="iconfont icon--shangbiankuang  icon"></div>
                    <div className=" flex-middle icon iconfont icon-guanbi" onClick={() => data.handleClose(false)}></div>
                </div>

            </div>
            {/* 搜索 */}
            <div className="flex-adaptive" style={{ top: "15px" }}>
                {/* 标签组件 */}
                <TabComp></TabComp>
                {/* 底部 */}
                <FooterComp></FooterComp>
            </div>
        
            <FlexibleAreaComp></FlexibleAreaComp>
        </div>
    )
}