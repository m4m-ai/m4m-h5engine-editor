import {
    BgColorsOutlined,
    CoffeeOutlined,
    EditOutlined,
    FileOutlined,
    HighlightOutlined,
    PieChartOutlined
} from '@ant-design/icons'
import './modalColor.css'
import type { MenuProps } from 'antd'
import { Layout, Button } from 'antd'
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
// import { Link, Outlet, useNavigate } from 'react-router-dom'

// import perf from './common/color1/在线调色板.html'
// var perf: any = require('./common/color1/在线调色板.html')

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode
): MenuItem {
    return {
        key,
        icon,
        label
    } as MenuItem
}

const items: any = [
    getItem('在线调色板', '0', <PieChartOutlined />),
    getItem('RGB颜色表', '1', <CoffeeOutlined />),
    getItem('颜色轮盘表', '2', <BgColorsOutlined />),
    getItem('颜色选择板', '3', <HighlightOutlined />),
    getItem('调色板工具', '4', <FileOutlined />),
    // getItem('色深工具器', '5', <EditOutlined />)
]

interface propsType {
    color: m4m.math.color[],
    setColor: (color: m4m.math.color[]) => void,
    handleCancel: () => void,
    handleOk: () => void
}

const ModalColor = (props: propsType) => {
    const { color, setColor } = props

    useEffect(() => {   //为了避免作用域及缓存
        const receiveMessageFromIndex = (event: { data: string | string[] }) => {
            if (event != undefined && event != null) {
                let arr: m4m.math.color[] = [];
                if (typeof event.data == 'string') {
                    let r: number, g: number, b: number, a: number = 1
                    if (event.data.match(/^#/)) {
                        r = Number(parseInt(event.data.slice(1, 3), 16) / 255)
                        g = Number(parseInt(event.data.slice(3, 5), 16) / 255)
                        b = Number(parseInt(event.data.slice(5, 7), 16) / 255)
                        a = event.data.slice(7) ? Number(parseInt(event.data.slice(7), 16)) : 1
                    } else if (event.data.match(/^rgba?/)) {
                        let numColor = event.data.match(/\(.*?\)/i)[0].slice(1, -1).split(',');
                        r = Number(numColor[0]) / 255
                        g = Number(numColor[1]) / 255
                        b = Number(numColor[2]) / 255
                        a = numColor[3] ? Number(numColor[3]) : 1
                    }
                    let rgbColor = new m4m.math.color(r, g, b, a)
                    arr.push(rgbColor)
                    setColor([...arr]);
                } else {
                    let colorData = event.data as string[];
                    if (Object.prototype.toString.call(colorData).slice(7, -1) == 'Array') {
                        colorData.forEach((item) => {
                            let r: number, g: number, b: number, a: number = 1
                            if (item.match(/^#/)) {
                                r = Number(parseInt(item.slice(1, 3), 16) / 255)
                                g = Number(parseInt(item.slice(3, 5), 16) / 255)
                                b = Number(parseInt(item.slice(5, 7), 16) / 255)
                                a = item.slice(7) ? Number(parseInt(item.slice(7), 16)) : 1
                            }
                            let rgbColor = new m4m.math.color(r, g, b, a)
                            arr.push(rgbColor)
                        })
                        setColor([...arr]);
                    }

                }
            }
        }
        //监听message事件
        window.addEventListener("message", receiveMessageFromIndex, false);

    }, [])

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <iframe
                src="/common/color5/color5.html"
                id='iframe5'
                style={{ height: "calc(100% - 50px)", width: "100%" }}
            ></iframe>
            <div style={{ textAlign: 'right', width: "100%" }}>
                <Button style={{ background: '#222' }} onClick={props.handleCancel}>关闭</Button>
                <Button style={{ background: '#222' }} onClick={props.handleOk}>提交</Button>
            </div>
        </div>
    )
}

export default ModalColor
