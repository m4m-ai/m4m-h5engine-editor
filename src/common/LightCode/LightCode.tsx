/* eslint-disable no-loop-func */
import * as React from 'react'
import { useRef, useState, useEffect, useCallback } from 'react'
import { TouchPosition } from '../../Game/Input/TouchPosition'
import { EditorInputMgr } from '../../Game/Input/EditorInputMgr'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { LightCodeData, LightCodePanel } from './LightCodeData'
import { LightCodeMgr, LineType } from './LightCodeMgr'
import { Block } from './Block'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'

export const Lianxian = () => {

    return (
        <div className="lianxian">
            <div className="box2">
                <div className="tansfrom">
                    <div className="list">
                        <Input
                            className="console-input2"
                            size="small"
                            placeholder=""
                            prefix={<SearchOutlined className="searchOutl"/>}
                        />
                    </div>
                    <div className="panel">
                    </div>
                </div>
            </div>
        </div>
    )
    //---------------------------------- 下面的代码有报错, 先干掉 --------------------------------
    
    // // const lian: any = useRef()
    // const [lianWidth, setLianWidth] = useState(0)
    // useEffect(() => {
    // }, [lianWidth])
    // const lian: any = (node: any) => {
    //     if (node !== null) {
    //         setLianWidth(node.getBoundingClientRect().width)
    //     }
    // }
    //
    // // 
    // const [lightList, setLightList] = useState<LightCodeData>([]);
    // // 虚线
    // const [line, setLine] = useState<LineType>(LightCodeMgr.line)
    // // 虚线透明度
    // const [opacity, setOpacity] = useState<number>(0)
    //
    // useEffect(() => {
    //     let binder = EditorEventMgr.Instance.addEventListener("OnCreateBlock", (data) => {
    //         setLightList([...LightCodeMgr.blockDatas]);
    //     })
    //
    //     let binder1 = EditorEventMgr.Instance.addEventListener('OnDrawLine', (data) => {
    //         setLine({...LightCodeMgr.line})
    //     })
    //     let binder2 = EditorEventMgr.Instance.addEventListener('OnChangeOpacity', (data) => {
    //         setOpacity(data)
    //     })
    //
    //     return () => {
    //         binder.removeListener();
    //         binder1.removeListener();
    //         binder2.removeListener();
    //     }
    // }, []);
    //
    // // 侧边栏列表
    // const [lightCodeList, setLightCodeList] = useState({
    //     Base: [
    //         'Color'
    //     ],
    //     Code: [
    //         'Code'
    //     ]
    // })
    //
    // // 面板数据
    // const [LightCodePanelList, setLightCodePanelList] = useState([
    //     {
    //         type: 0,
    //         title: 'Color',
    //         inAttribute: [
    //             {
    //                 title: 'r',
    //                 type: 'color',
    //                 maxConcat: 1,
    //                 classList: ['field', 'field-in']
    //             },
    //             {
    //                 title: 'g',
    //                 type: 'color',
    //                 maxConcat: 1,
    //                 classList: ['field', 'field-in']
    //             },
    //             {
    //                 title: 'b',
    //                 type: 'color',
    //                 maxConcat: 1,
    //                 classList: ['field', 'field-in']
    //             }
    //         ],
    //         outAttribute: [
    //             {
    //                 title: 'rgb',
    //                 type: 'color',
    //                 maxConcat: 10,
    //                 classList: ['field', 'field-out']
    //             },
    //             {
    //                 title: 'r',
    //                 type: 'color',
    //                 maxConcat: 10,
    //                 classList: ['field', 'field-out']
    //             },
    //             {
    //                 title: 'g',
    //                 type: 'color',
    //                 maxConcat: 10,
    //                 classList: ['field', 'field-out']
    //             },
    //             {
    //                 title: 'b',
    //                 type: 'color',
    //                 maxConcat: 10,
    //                 classList: ['field', 'field-out']
    //             }
    //         ],
    //     },
    //     {
    //         type: 1,
    //         title: 'Code',
    //         inAttribute: [
    //             {
    //                 title: 'code',
    //                 type: 'code',
    //                 maxConcat: 1,
    //                 classList: ['field', 'field-in']
    //             }
    //         ],
    //         outAttribute: [
    //             {
    //                 title: 'out',
    //                 type: 'code',
    //                 maxConcat: 10,
    //                 classList: ['field', 'field-out']
    //             }
    //         ],
    //     },
    // ])
    //
    //
    // const dragableList = useRef<HTMLDivElement>(null)
    // const panel = useRef<HTMLDivElement>(null);
    // const svgnode = useRef<SVGSVGElement>(null);
    //
    // // 创建板块
    // useEffect(() => {
    //     let binder1 = EditorInputMgr.Instance.addElementEventListener(dragableList.current, 'TouchDown', (touch) => {
    //
    //         let target = touch.event.target as HTMLElement
    //         if (target.attributes['data-id']) {
    //
    //             let type = target.attributes['data-id'].value
    //             let sideCode = LightCodePanelList.filter((item) => {
    //                 return item.title === type
    //             })[0]
    //
    //             let binder2 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchEnter', () => {
    //                 let binder3 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', (touch) => {
    //                     let blockX = touch.offsetX;
    //                     let blockY = touch.offsetY;
    //                     binder2.removeListener();
    //                     LightCodeMgr.addBlock({
    //                         ...sideCode,
    //                         position: {x: blockX, y: blockY},
    //                         id: Math.floor(Math.random() * 10000000)
    //                     })
    //                     binder3.removeListener();
    //                 })
    //             })
    //         }
    //     })
    //     return () => {
    //         binder1.removeListener()
    //     }
    //
    // }, [])
    //
    // return (
    //     <div className="lianxian" ref={lian}>
    //         <div className="box2">
    //             <div className="tansfrom">
    //                 <div className="list" ref={dragableList}>
    //                     <Input
    //                         className="console-input2"
    //                         size="small"
    //                         placeholder=""
    //                         prefix={<SearchOutlined className="searchOutl"/>}
    //                     />
    //                     {
    //                         Object.keys(lightCodeList).map((item: any, index) => (<>
    //                             <div className="listHeader">{item}</div>
    //                             {lightCodeList[item].map((data: any, index2) => (
    //                                 <div className='dragable' data-id={data}>{data}</div>)
    //                             )}
    //                         </>))
    //                     }
    //                 </div>
    //                 <div className="panel" ref={panel}>
    //                     <svg
    //                         className="svg"
    //                         width="4000px"
    //                         height="4000px"
    //                         version="1.1"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         ref={svgnode}
    //                     >
    //                         <path fill="none" stroke="#ffffff" stroke-dasharray="3,1" opacity={`${opacity}`}
    //                               d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}></path>
    //                     </svg>
    //                     <div className="node_container">
    //                         {lightList.length ? lightList.map((item) => {
    //                             return <Block params={{...item}} panel={panel}></Block>
    //                         }) : <></>}
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )
}
