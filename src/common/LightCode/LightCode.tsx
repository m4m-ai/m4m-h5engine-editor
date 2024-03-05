/* eslint-disable no-loop-func */
import * as React from 'react'
import { useRef, useState, useEffect } from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { EditorInputMgr } from '../../Game/Input/EditorInputMgr'
import { LightCodeMgr, LineType } from './LightCodeMgr'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
import { LightCodeData, LightCodePanel } from './LightCodeData'
import { LinksLayer } from './Linking/LinksLayer'
import { LinkingLayer } from './Linking/LinkingLayer'
import { Block } from './widgets/Block'
import "./index.css";

export const Lianxian = () => {

    const [lianWidth, setLianWidth] = useState(0)
    useEffect(() => {
    }, [lianWidth])
    const lian: any = (node: any) => {
        if (node !== null) {
            setLianWidth(node.getBoundingClientRect().width)
        }
    }
    const [lightList, setLightList] = useState<LightCodeData>([]);
    // 虚线
    const [line, setLine] = useState<LineType>(LightCodeMgr.line);
    const [isLine, setisLine] = useState<boolean>(true);
    const [link, setLink] = useState([]);
    // console.log("----------data2: ", link);

    useEffect(() => {
        let binderOnCreateBlock = EditorEventMgr.Instance.addEventListener("OnCreateBlock", (data) => {
            setLightList([...LightCodeMgr.blockDatas]);
        })

        let binderOnDrawLine = EditorEventMgr.Instance.addEventListener('OnDrawLine', (data) => {
            setLine({ ...LightCodeMgr.line })
        })

        let binderOnDrawIsLine = EditorEventMgr.Instance.addEventListener('OnDrawIsLine', (data) => {
            // setOpacity(data)
            setisLine(data);
        })

        let binderLinkUpdateLocation = EditorEventMgr.Instance.addEventListener("LinkUpdateLocation", (data) => {
            setLink((value) => {
                // console.log("--------data: ", value == data);
                return [...data]
            });
        });

        return () => {
            binderOnCreateBlock.removeListener();
            binderOnDrawLine.removeListener();
            binderOnDrawIsLine.removeListener();
            binderLinkUpdateLocation.removeListener();
        }
    }, []);

    // 侧边栏列表
    const [lightCodeList, setLightCodeList] = useState({
        Code: [
            'Code'
        ],
        math: [
            'vector2',
            'vector3',
            'abs()'

        ],
    })
    // let data = 
    // 面板数据
    const Panel: LightCodePanel[] = [
        {
            type: 1,
            title: 'Code',
            inAttribute: [
                {

                    title: 'code',
                    type: "string",
                    maxConcat: 1
                }
            ],
            outAttribute: [
                {
                    title: 'out',
                    type: "string",
                    maxConcat: 1
                }
            ],
        },
        {
            type: 2,
            title: 'vector2',
            inAttribute: [
                {
                    title: 'vc2',
                    type: 'vector2',
                    maxConcat: 1
                }
            ],
            outAttribute: [
                {

                    title: 'vc2',
                    type: "vector2",
                    maxConcat: 1
                }
            ],
        },
        {
            type: 3,
            title: 'vector3',
            inAttribute: [
                {
                    title: 'vc3',
                    type: 'vector3',
                    maxConcat: 1
                }
            ],
            outAttribute: [
                {

                    title: 'vc3',
                    type: "vector3",
                    maxConcat: 1
                }
            ],
        },
        {
            type: 4,
            title: 'abs()',
            inAttribute: [
                {
                    title: 'vc2',
                    type: 'vector2',
                    maxConcat: 1
                }
            ],
            outAttribute: [
                {

                    title: 'vc2',
                    type: "vector2",
                    maxConcat: 1
                }
            ],
        },
    ];
    const [LightCodePanelList, setLightCodePanelList] = useState(Panel);
    // setLightCodePanelList(Panel)
    const dragableList = useRef<HTMLDivElement>(null)
    const panel = useRef<HTMLDivElement>(null);
    // 创建板块
    useEffect(() => {
        let binderTouchDown = EditorInputMgr.Instance.addElementEventListener(dragableList.current, 'TouchDown', (touch) => {

            let target = touch.event.target as HTMLElement
            if (target.attributes['data-id']) {

                let type = target.attributes['data-id'].value
                let sideCode = LightCodePanelList.filter((item) => {
                    return item.title === type
                })[0];

                let binderTouchEnter = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchEnter', () => {
                    let binderTouchUp = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', (touch) => {
                        let blockX = touch.offsetX;
                        let blockY = touch.offsetY;
                        binderTouchEnter.removeListener();

                        LightCodeMgr.addBlock({
                            ...sideCode,
                            position: { x: blockX, y: blockY },
                            id: Math.floor(Math.random() * 10000000).toString()
                        });

                        binderTouchUp.removeListener();
                    })
                })
            }
        })
        return () => {
            binderTouchDown.removeListener()
        }

    }, [])

    return (
        <div className="lianxian" ref={lian}>
            <div className="box2">
                <div className="tansfrom">
                    <div className="list" ref={dragableList}>
                        <Input
                            className="console-input2"
                            size="small"
                            placeholder=""
                            prefix={<SearchOutlined className="searchOutl" />}
                        />
                        {
                            Object.keys(lightCodeList).map((item: any, index) => (<>
                                <div className="listHeader">{item}</div>
                                {lightCodeList[item].map((data: any, index2) => (
                                    <div className='dragable' data-id={data}>{data}</div>)
                                )}
                            </>))
                        }
                    </div>
                    <div className="panel" ref={panel}>
                        <LinksLayer links={link} />
                        <LinkingLayer isLinking={isLine} line={line}></LinkingLayer>
                        <div className="node_container">
                            {lightList.length ? lightList.map((item) => {
                                return <Block params={{ ...item }} panel={panel}></Block>
                            }) : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

