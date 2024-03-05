import * as React from 'react'
import { useState, useRef } from 'react'
import './index.css'
import { Editor } from '../common/samples/browser-amd-editor'
import Menus from '../common/menus/App'
import * as monaco from 'monaco-editor'
import { TreeDemo } from '../common/trees/trees'

import Project from '../common/layout/layout'
import { TreeTest } from '../common/tressTest/tressTest'
import { Inspector } from '../common/inspector/inspector'
import Excel from '../common/excel/excel'
import FreeTexture from '../common/FreeTexturePacker'
import { Lianxian } from '../common/LightCode/LightCode'
// import { EditorInputMgr, TouchPosition } from '../Game/EditorInputMgr'

import {
    AlignRightOutlined,
    AppstoreFilled,
    EditFilled,
    ExclamationCircleFilled,
    ExclamationCircleOutlined,
    FileDoneOutlined,
    FolderFilled,
    FolderOutlined,
    GatewayOutlined,
    LockFilled,
    LockOutlined,
    MoreOutlined,
    SettingFilled,
    SlidersFilled,
    UnlockOutlined
} from '@ant-design/icons'
import { Dropdown, Menu, Space } from 'antd'
import { Scene } from '../common/scene/scene'
import { TouchPosition } from '../Game/Input/TouchPosition'
import { EditorInputMgr } from '../Game/Input/EditorInputMgr'
import { Console } from '../common/console/Console'
import { UIComponent } from "../common/uiComponent/UIComponent";
import { Window } from "../common/window/Window";
import { WindowSlot } from "../common/window/WindowSlot";
import { WindowManager } from "../common/window/WindowManager";
import { AttributeManager } from "../common/attribute/AttributeManager";
import { Animator } from '../common/animator/animator'
import { AudioMixer } from '../common/audioMixer/AudioMixer'
import { Ai } from '../common/ai/Ai'
// body显示
var zindex: any = 0
// import {  } from "../common/samples/browser-amd-iframe/inner.html";
export const Home = () => {
    const bodyonenode: any = useRef()

    const [bodyone, setBodyone] = useState(false)
    // console.log('aa', bodyone)
    setTimeout(() => {

        let titleDown = function titmou(e: any) {
            //console.log('点击title(每个模块的标题)事件')

            if (e.target.className !== 'header') {
                // 创建要移动的节点
                var die: any = e.target.parentNode.parentNode.parentNode.parentNode
                var changex: any = e.pageX
                var changey: any = e.pageY
                var dqtit: any = e.target.parentNode.parentNode
                movetitlenode = e.target
                var movetitlenode2: any = e.target.cloneNode(true)
                var divnode: any =
                    e.target.parentNode.parentNode.parentNode.cloneNode()
                var divnod: any = movetitlenode.parentNode.parentNode.cloneNode()
                var headernode: any =
                    movetitlenode.parentNode.parentNode.children[0].cloneNode()
                var bnode: any = movetitlenode?.parentNode?.parentNode?.children[1]?.cloneNode(true);
                //判断头部自定义标签和body的标签是否对应
                // console.log('yyyyyyyyyyy', e.target.parentNode.parentNode.children.length)
                for (let j = 0; j < e.target.parentNode.parentNode.children.length; j++) {
                    if (e.target.getAttribute('data-index') ===
                        e.target.parentNode.parentNode.children[j].getAttribute('data-body')) {
                        zindex += 1
                        bnode = e.target.parentNode.parentNode.children[j]
                        bnode.style.zIndex = zindex
                        //console.log('z', zindex)
                    }
                }
                // for (let v = 0; v < dataBody.length; v++) {
                //   arrindev.push(dataBody[v].style.zIndex)

                //   for (var i = 0; i < arrindev.length; i++) {
                //     for (var j = i + 1; j < arrindev.length; j++) {
                //       //如果第一个比第二个大，就交换他们两个位置
                //       if (arrindev[i] > arrindev[j]) {
                //         var temp = arrindev[i]
                //         arrindev[i] = arrindev[j]
                //         arrindev[j] = temp
                //       }
                //     }
                //   }
                //   if (
                //     arrindev[arrindev.length - 1] - arrindev[arrindev.length - 2] >
                //     100
                //   ) {
                //     zindex = arrindev[arrindev.length - 1] - 100
                //   }
                // }
                // console.log(e.target.parentNode)

                for (let v = 0; v < e.target.parentNode.children.length; v++) {
                    // if(){

                    // }
                    // console.log('yyyyyyyyyy', e.target)
                    if (
                        e.target.className == `title-content` ||
                        e.target.className == `title-content active`
                    ) {
                        e.target.parentNode.children[v].className = `title-content`
                        if (e.target.className) {
                            e.target.className = `title-content active`
                        }
                    } else {
                        // if (e.target.className.tagName == 'svg') {
                        //   e.target.parentNode.parentNode.children[
                        //     v
                        //   ].className = `title-content`
                        //   if (e.target.parentNode.className) {
                        //     e.target.parentNode.className = `title-content active`
                        //   }
                        // } else if (e.target.className.tagName == 'span') {
                        //   e.target.parentNode.parentNode.parentNode.children[
                        //     v
                        //   ].className = `title-content`
                        //   if (e.target.parentNode.parentNode.className) {
                        //     e.target.parentNode.parentNode.className = `title-content active`
                        //   }
                        // } else if (e.target.className.tagName == 'path')
                        //   e.target.parentNode.parentNode.parentNode.parentNode.children[
                        //     v
                        //   ].className = `title-content`
                        // if (e.target.parentNode.parentNode.parentNode.className) {
                        //   e.target.parentNode.parentNode.parentNode.className = `title-content active`
                        // }

                        return
                    }
                }
                // 为body绑定移动事件
                bodyEle.onmouseup = () => {
                    bodyEle.removeEventListener('mousemove', bodymove, false)
                }
                var nodeb = e.target.parentNode.parentNode
                var nodea = e.target.parentNode.parentNode.parentNode
                var nodee = e.target.parentNode
                var nodec = e.target.parentNode.parentNode.parentNode.parentNode

                // 判断点下的是第一个还是第二个
                var nodeindex = 0
                for (let l = 0; l < nodec.children.length; l++) {
                    if (nodec.children[l] === nodea) {
                        nodeindex = l
                    }
                }
                // 在按下事件中添加鼠标移动事件---------------
                clickheder = e.target.parentNode
                document.onmousemove = (e: any) => {
                    if (
                        changex + 30 <= e.pageX ||
                        e.pageX <= changex - 30 ||
                        changey + 10 <= e.pageY ||
                        e.pageY <= changey - 10
                    ) {
                        if (
                            changex + 20 <= e.pageX ||
                            e.pageX <= changex - 20 ||
                            changey + 10 <= e.pageY ||
                            e.pageY <= changey - 10
                        ) {
                            headernode.appendChild(movetitlenode2)
                            divnod.insertBefore(bnode, divnod.children[0])
                            divnod.insertBefore(headernode, divnod.children[0])
                            divnode.insertBefore(divnod, divnode.children[0])
                        }

                        divnod.style.flex = 1
                        divnod.style.width = `100%`
                        divnod.style.height = `100%`
                        divnode.style.flex = 1
                        divnode.style.width = `100%`
                        divnode.style.height = `100%`
                        //  移动时删除选中的内容
                        if (nodee.children.length === 1) {
                            //   // 判断是不是只有一个标题，如果是最后一个就把节点删除
                            // 如果删除的标题父级盒子包含其他盒子，就先把其他盒子添加到盒子前，然后删除盒子
                            if (nodea.children.length > 1) {
                                for (let a = 0; a < nodea.children.length; a++) {
                                    if (
                                        nodea.children[a] !== nodeb &&
                                        nodea.children[a].className !== `border` &&
                                        nodea.children[a].className !== `border2`
                                    ) {
                                        nodea.children[a].style.flex = 1
                                        nodea.children[a].style.width = `100%`
                                        nodea.children[a].style.height = `100%`
                                        // 添加的位置有问题-----------------------------
                                        if (nodeindex === 0) {
                                            nodec.insertBefore(
                                                nodea.children[a],
                                                nodec.children[0]
                                            )
                                        } else {
                                            nodec.appendChild(nodea.children[a])
                                        }
                                    }
                                }
                                titleType = false
                                titleActive = false
                                for (let n = 0; n < nodec.children.length; n++) {
                                    if (nodec.children[n] == nodea) {
                                        nodec.removeChild(nodea)
                                    }
                                }
                            } else {
                                for (let z = 0; z < nodec.children.length; z++) {
                                    if (nodec.children[z] == nodea) {
                                        nodec.removeChild(nodea)
                                        titleActive = false
                                        titleType = false
                                    }
                                }
                            }
                        }
                        divActive = true
                        titleActive = true
                        e.target.style.dispaly = 'none'
                        title.style.display = 'block'
                        bodyEle.addEventListener('mousemove', bodymove)
                    }
                }
                bodyEle.appendChild(title)
                // 移动节点
                var cloneHeader = e.target.cloneNode()
                e.stopPropagation()

                title.appendChild(cloneHeader)
                // 添加鼠标松开事件
                document.onmouseup = e => {
                    //console.log('点击title(每个模块的标题)松开事件')
                    // 销毁事件
                    bodyEle.removeEventListener('mousemove', bodymove, false)
                    bodyEle.onmousemove = null
                    document.onmousemove = null
                    document.onmouseup = null
                    header = document.querySelectorAll('[data-index]')
                    divActive = false
                    titleActive = false
                    title.style.display = 'none'

                    title.removeChild(title.children[0])
                    // console.log('松开',)
                    if (titleType === true) {
                        // console.log('在头部')
                        headerboxd.parentNode.appendChild(bnode)
                    }

                    if (bodyType === true) {
                        // console.log('在body',)
                        // dqtit.removeChild(bodynode)
                        // 根据盒子类名判断节点移动位置
                        if (div.className === 'left') {
                            // 移动盒子
                            // 在鼠标松开时把移入的目标盒子放进移动的盒子里面，再添加移动的盒子到目标盒子
                            // 这样保证只有每个定位个盒子里面最多只有两个内容盒子
                            var border: any = document.createElement('div')
                            border.className = 'border'
                            border.style.width = `5px`
                            border.style.height = `100%`
                            divnode.style.display = `flex`
                            divnode.style.backgroundColor = `#aeaeaf`
                            divnode.style.display = `flex`
                            divnode.style.flexDirection = `row`
                            divnode.style.flex = databoodynode.style.flex
                            divnode.style.width = `${databoodynode.style.width}`
                            divnode.style.height = `${databoodynode.style.height}`
                            databoodynode.style.flex = 2
                            databoodynode.style.width = `100%`
                            databoodynode.style.height = `100%`
                            var index: number = 0
                            // 判断移入的内容是盒子地第一个还是第二个
                            for (
                                let i = 0;
                                i < databoodynode.parentNode.children.length;
                                i++
                            ) {
                                if (
                                    databoodynode.parentNode.children[i] === databoodynode
                                ) {
                                    index = i
                                }
                            }
                            divnode.insertBefore(border, divnode.children[1])
                            divnode.insertBefore(
                                databoodynode,
                                divnode.children[0].previousElementSibling
                            )
                            // divnode.insertBefore(border, divnode.children[1])
                            // 根据移入的盒子来判断移入的位置
                            if (layoutboxnode.children[0]) {
                                if (index === 0) {
                                    layoutboxnode.insertBefore(
                                        divnode,
                                        layoutboxnode.children[0]
                                    )
                                } else {
                                    layoutboxnode.appendChild(divnode)
                                }
                            } else {
                                layoutboxnode.appendChild(divnode)
                            }
                            // console.log('在左', border)
                        } else if (div.className === 'right') {
                            var border: any = document.createElement('div')
                            border.className = 'border'
                            border.style.width = `5px`
                            border.style.height = `100%`
                            divnode.style.display = `flex`
                            divnode.style.flexDirection = `row`
                            divnode.style.flex = databoodynode.style.flex
                            divnode.style.width = `${databoodynode.style.width}`
                            divnode.style.height = `${databoodynode.style.height}`
                            // console.log('datattttttttttttttt', databoodynode)

                            databoodynode.style.flex = 2
                            databoodynode.style.width = `100%`
                            databoodynode.style.height = `100%`
                            var index: number = 0
                            for (
                                let i = 0;
                                i < databoodynode.parentNode.children.length;
                                i++
                            ) {
                                if (
                                    databoodynode.parentNode.children[i] === databoodynode
                                ) {
                                    index = i
                                }
                            }
                            divnode.insertBefore(border, divnode.children[0])
                            // console.log(
                            //   'bodyyyyyyyyyyyyyyyyyyyyyy',
                            //   index,
                            //   databoodynode.parentNode.children
                            // )

                            divnode.insertBefore(databoodynode, divnode.children[0])

                            if (layoutboxnode.children[0]) {
                                // =1=0 有争议======================
                                if (index === 0) {
                                    // console.log('走11111111111')

                                    layoutboxnode.insertBefore(
                                        divnode,
                                        layoutboxnode.children[0]
                                    )
                                } else {
                                    // console.log('走2222222222222')
                                    layoutboxnode.appendChild(divnode)
                                }
                            } else {
                                // console.log('走3333333333333333')
                                layoutboxnode.appendChild(divnode)
                            }
                        } else if (div.className === 'buttom') {
                            // eslint-disable-next-line @typescript-eslint/no-redeclare
                            var border: any = document.createElement('div')
                            border.className = 'border2'
                            border.style.width = `100%`
                            border.style.height = `5px`
                            divnode.style.display = `flex`
                            divnode.style.backgroundColor = `#aeaeaf`
                            // console.log('9999999999999', divnode)
                            divnode.style.display = `flex`
                            divnode.style.flexDirection = `column`
                            divnode.style.flex = databoodynode.style.flex
                            // console.log('bbbbbbbbbbbbbbbbbbbb', divnode)
                            divnode.style.width = `${databoodynode.style.width}`
                            divnode.style.height = `${databoodynode.style.height}`
                            databoodynode.style.flex = 2
                            databoodynode.style.width = `100%`
                            databoodynode.style.height = `100%`
                            var index: number = 0
                            for (
                                let i = 0;
                                i < databoodynode.parentNode.children.length;
                                i++
                            ) {
                                if (
                                    databoodynode.parentNode.children[i] === databoodynode
                                ) {
                                    index = i
                                }
                            }
                            // console.log('bodyyyyyyyyyyyyyyyyyyyyyy', index)
                            divnode.insertBefore(border, divnode.children[0])
                            divnode.insertBefore(databoodynode, divnode.children[0])
                            if (layoutboxnode.children[0]) {
                                if (index === 0) {
                                    layoutboxnode.insertBefore(
                                        divnode,
                                        layoutboxnode.children[0]
                                    )
                                } else {
                                    layoutboxnode.appendChild(divnode)
                                }
                            } else {
                                layoutboxnode.appendChild(divnode)
                            }
                        } else if (div.className === 'top') {
                            // var aa:any = databoodynode.cloneNode(true)
                            var border: any = document.createElement('div')
                            border.className = 'border2'
                            border.style.width = `100%`
                            border.style.height = `5px`
                            divnode.style.display = `flex`
                            divnode.style.backgroundColor = `#aeaeaf`
                            // console.log('9999999999999', divnode)
                            divnode.style.display = `flex`
                            divnode.style.flexDirection = `column`
                            divnode.style.flex = databoodynode.style.flex
                            divnode.style.width = `${databoodynode.style.width}`
                            divnode.style.height = `${databoodynode.style.height}`
                            databoodynode.style.flex = 2
                            databoodynode.style.width = `100%`
                            databoodynode.style.height = `100%`
                            var index: number = 0
                            for (
                                let i = 0;
                                i < databoodynode.parentNode.children.length;
                                i++
                            ) {
                                if (
                                    databoodynode.parentNode.children[i] === databoodynode
                                ) {
                                    index = i
                                }
                            }
                            divnode.insertBefore(border, divnode.children[1])
                            divnode.insertBefore(
                                databoodynode,
                                divnode.children[0].previousElementSibling
                            )
                            if (layoutboxnode.children[0]) {
                                if (index === 0) {
                                    layoutboxnode.insertBefore(
                                        divnode,
                                        layoutboxnode.children[0]
                                    )
                                } else {
                                    layoutboxnode.appendChild(divnode)
                                }
                            } else {
                                layoutboxnode.appendChild(divnode)
                            }
                        }
                        titleActive = false
                        for (let y = 0; y < xzbody?.children.length; y++) {
                            if (xzbody?.children[y] == div) {
                                xzbody.removeChild(div)
                            }
                        }
                        // xzbody.removeChild(div)
                        // 在移动节点后为重新创建的节点添加事件
                        headerbox = document.querySelectorAll('.header')
                        dataBody = document.querySelectorAll('[data-body]')
                        layoutbox = document.querySelectorAll('.layoutbox')
                        bordernode = document.querySelectorAll('.border')
                        bordernode2 = document.querySelectorAll('.border2')

                        // for (let y = 0; y < layoutbox.length; y++) {
                        //   layoutbox[y].children[1].onmousedown = null
                        // }

                        // 这里++有争议-0--------------------------------------
                        for (let pz = 0; pz < bordernode.length; ++pz) {
                            // 拖拽boder修改盒子宽高
                            bordernode[pz].addEventListener(
                                'mousedown',
                                (e: any) => {
                                    var brod0 = 0
                                    var brod1 = 0
                                    boderdown(e, pz, brod0, brod1)
                                }
                                // eslint-disable-next-line no-loop-func
                            )
                        }

                        for (let p = 0; p < bordernode2.length; p++) {
                            // 拖拽boder修改盒子宽高
                            bordernode2[p].addEventListener(
                                'mousedown',
                                (e: any) => {
                                    var brod0 = 0
                                    var brod1 = 0
                                    boder2down(e, p, brod0, brod1)
                                }
                                // eslint-disable-next-line no-loop-func
                            )
                        }
                        //看不懂为什么这里又要注册一遍事件 先注掉
                        // for (let z = 0; z < headerbox.length; z++) {
                        //   headerbox[z].addEventListener('mousedown', e => {
                        //     titmou(e)
                        //   })
                        // }
                        for (let z = 0; z < headerbox.length; z++) {
                            headerbox[z].addEventListener('mousedown', () => {
                                titlemouse(z)
                            })
                        }
                        for (let z = 0; z < headerbox.length; z++) {
                            headerbox[z].addEventListener('mouseenter', () => {
                                titlemouse(z)
                            })
                        }
                        for (let z = 0; z < headerbox.length; z++) {
                            headerbox[z].addEventListener('mouseleave', () => {
                                titleleave(z)
                            })
                        }
                        for (let x = 0; x < dataBody.length; x++) {
                            // 移入body
                            dataBody[x].addEventListener('mouseenter', e => {
                                databodymove(e, x)
                            })
                            // 移出body
                            dataBody[x].addEventListener('mouseleave', e => {
                                databodyleave(e, x)
                            })
                        }
                    }
                    setBodyone(!bodyone)
                }
            }
        }

        var header: NodeListOf<HTMLElement> =
            document.querySelectorAll('[data-index]')
        var dataBody: NodeListOf<HTMLElement> =
            document.querySelectorAll('[data-body]')
        var headerbox: NodeListOf<Element> = document.querySelectorAll('.header')
        var bordernode: any = document.querySelectorAll('.border')
        var bordernode2: any = document.querySelectorAll('.border2')
        var layoutbox: any = document.querySelectorAll('.layoutbox')
        var box: NodeListOf<HTMLElement> = document.querySelectorAll('.box')
        // var box1: any = document.querySelectorAll('.box1')
        // var bb: any = document.querySelectorAll('.editor-box')
        // document.ontouchmove = (e: any) => {
        //   console.log('全局移动')
        // }
        // for (let he = 0; he < header.length; he++) {
        //   let headermove = EditorInputMgr.Instance.addElementEventListener(
        //     header[he],
        //     'TouchEnter',
        //     (touch: TouchPosition) => {
        //       console.log(
        //         `111手指移入事件--------------------${touch}`
        //         // `触发按下事件: engineDiv, 鼠标坐标: (${touch.x}, ${touch.y}), 相对于元素的坐标: (${touch.offsetX}, ${touch.offsetY})`
        //       )
        //       //解绑事件调用 removeListener();
        //       headermove.removeListener()
        //     }
        //   )
        //   let headeryichu = EditorInputMgr.Instance.addElementEventListener(
        //     header[he],
        //     'TouchLeave',
        //     (touch: TouchPosition) => {
        //       console.log(
        //         '111手指移出事件--------------------'
        //         // `触发按下事件: engineDiv, 鼠标坐标: (${touch.x}, ${touch.y}), 相对于元素的坐标: (${touch.offsetX}, ${touch.offsetY})`
        //       )
        //       //解绑事件调用 removeListener();
        //       // headeryichu.removeListener()
        //     }
        //   )
        // }
        // console.log('移动事件yy')
        // console.log('box', box[0])
        var bodyEle: any = document.body
        // 当前的移入的header
        var headerboxd: any = null
        var arrindev = []
        // 创建拖拽的标题节点
        var title: any = document.createElement('div')
        title.style.width = `30px`
        title.style.height = `15px`
        title.style.backgroundColor = 'rgb(160, 160, 160)'
        title.style.position = 'absolute'
        title.style.display = 'none'
        title.style.zIndex = '11'
        // console.log('ccc', dataBody, header)
        // console.log('aaa', header.childNodes)
        // 移动的遮罩层
        var div: any = document.createElement('div')

        // var bodyType = 0
        // 控制是否显示添加的div
        var divActive: boolean = false
        // 控制是否显示添加的title
        var titleActive: boolean = false
        // 判断是否在body
        var bodyType: boolean = false
        // 判断是否在title
        var titleType: boolean = false
        // 对应的body
        var bodynode: any = null
        // 复制body
        var clonebody: any = null
        // 当前header
        var headernode: any = null
        // 当前移动的title
        var movetitlenode: any = null

        // 当前header
        var clickheder: any = null
        // 当前移入的databody
        var databoodynode: any = null
        // 当前的layoutbox
        var layoutboxnode: any = null
        // 现在的body
        var xzbody: any = null

        // --------------
        function bodymove(e: any) {
            divActive = true
            title.style.left = `${e.pageX + 10}px`
            title.style.top = `${e.pageY - 10}px`
        }

        // 拖动条改动宽高
        for (let pz = 0; pz < bordernode.length; pz++) {
            // eslint-disable-next-line no-loop-func
            // eslint-disable-next-line no-loop-func
            bordernode[pz].addEventListener('mousedown', (e: any) => {
                var brod0 = 0
                var brod1 = 0
                boderdown(e, pz, brod1, brod0)
            })
        }
        for (let p = 0; p < bordernode2.length; p++) {
            // 拖拽boder2修改盒子宽高
            bordernode2[p].addEventListener(
                'mousedown',
                (e: any) => {
                    var brod0 = 0
                    var brod1 = 0
                    boder2down(e, p, brod0, brod1)
                }
                // eslint-disable-next-line no-loop-func
            )
        }

        // console.error(layoutbox.length,headerbox.length);
        // 遍历循环为title添加事件
        for (let i = 0; i < layoutbox.length; i++) {
            // 添加鼠标按下事件
            header = document.querySelectorAll('[data-index]')
            // headerbox[i].removeEventListener(
            //   'mousedown',
            //   // eslint-disable-next-line no-loop-func
            //   titleDown
            // )
            headerbox[i].addEventListener(
                'mousedown',
                // eslint-disable-next-line no-loop-func
                titleDown
            )
        }
        // 移动端为title添加事件
        for (let i = 0; i < layoutbox.length; i++) {
            // 添加鼠标按下事件
            header = document.querySelectorAll('[data-index]')
            headerbox[i].addEventListener(
                'touchstart',
                // eslint-disable-next-line no-loop-func
                function titmouyd(e: any) {
                    if (e.target.className !== 'header') {
                        // 创建要移动的节点
                        var die: any = e.target.parentNode.parentNode.parentNode.parentNode
                        var changex: any = e.changedTouches[0].pageX
                        var changey: any = e.changedTouches[0].pageY
                        var dqtit: any = e.target.parentNode.parentNode
                        movetitlenode = e.target
                        var movetitlenode2: any = e.target.cloneNode(true)
                        var divnode: any =
                            e.target.parentNode.parentNode.parentNode.cloneNode()
                        var divnod: any = movetitlenode.parentNode.parentNode.cloneNode()
                        var headernode: any =
                            movetitlenode.parentNode.parentNode.children[0].cloneNode()
                        var bnode: any =
                            movetitlenode.parentNode.parentNode.children[1].cloneNode(true)
                        //判断头部自定义标签和body的标签是否对应
                        for (
                            let j = 0;
                            j < e.target.parentNode.parentNode.children.length;
                            j++
                        ) {
                            if (
                                e.target.getAttribute('data-index') ===
                                e.target.parentNode.parentNode.children[j].getAttribute(
                                    'data-body'
                                )
                            ) {
                                zindex += 1
                                bnode = e.target.parentNode.parentNode.children[j]
                                bnode.style.zIndex = zindex
                            }
                        }
                        for (let v = 0; v < e.target.parentNode.children.length; v++) {
                            if (
                                e.target.className == `title-content` ||
                                e.target.className == `title-content active`
                            ) {
                                e.target.parentNode.children[v].className = `title-content`
                                if (e.target.className) {
                                    e.target.className = `title-content active`
                                }
                            } else {
                                return
                            }
                        }
                        // 为body绑定移动事件
                        bodyEle.ontouchend = () => {
                            bodyEle.removeEventListener('touchmove', bodymove, false)
                        }
                        var nodeb = e.target.parentNode.parentNode
                        var nodea = e.target.parentNode.parentNode.parentNode
                        var nodee = e.target.parentNode
                        var nodec = e.target.parentNode.parentNode.parentNode.parentNode

                        // 判断点下的是第一个还是第二个
                        var nodeindex = 0
                        for (let l = 0; l < nodec.children.length; l++) {
                            if (nodec.children[l] === nodea) {
                                nodeindex = l
                            }
                        }
                        // 在按下事件中添加鼠标移动事件---------------
                        clickheder = e.target.parentNode
                        document.ontouchmove = (e: any) => {
                            if (
                                changex !== e.changedTouches[0].pageX ||
                                changey !== e.changedTouches[0].pageY
                            ) {
                                headernode.appendChild(movetitlenode2)
                                divnod.insertBefore(bnode, divnod.children[0])
                                divnod.insertBefore(headernode, divnod.children[0])
                                divnode.insertBefore(divnod, divnode.children[0])

                                divnod.style.flex = 1
                                divnod.style.width = `100%`
                                divnod.style.height = `100%`
                                divnode.style.flex = 1
                                divnode.style.width = `100%`
                                divnode.style.height = `100%`
                                //  移动时删除选中的内容

                                if (nodee.children.length === 1) {
                                    //   // 判断是不是只有一个标题，如果是最后一个就把节点删除
                                    // 如果删除的标题父级盒子包含其他盒子，就先把其他盒子添加到盒子前，然后删除盒子
                                    if (nodea.children.length > 1) {
                                        for (let a = 0; a < nodea.children.length; a++) {
                                            if (
                                                nodea.children[a] !== nodeb &&
                                                nodea.children[a].className !== `border` &&
                                                nodea.children[a].className !== `border2`
                                            ) {
                                                nodea.children[a].style.flex = 1
                                                nodea.children[a].style.width = `100%`
                                                nodea.children[a].style.height = `100%`
                                                // 添加的位置有问题-----------------------------
                                                if (nodeindex === 0) {
                                                    nodec.insertBefore(
                                                        nodea.children[a],
                                                        nodec.children[0]
                                                    )
                                                } else {
                                                    nodec.appendChild(nodea.children[a])
                                                }
                                            }
                                        }
                                        titleType = false
                                        titleActive = false
                                        for (let n = 0; n < nodec.children.length; n++) {
                                            if (nodec.children[n] == nodea) {
                                                nodec.removeChild(nodea)
                                            }
                                        }
                                    } else {
                                        for (let z = 0; z < nodec.children.length; z++) {
                                            if (nodec.children[z] == nodea) {
                                                nodec.removeChild(nodea)
                                                titleActive = false
                                                titleType = false
                                            }
                                        }
                                    }
                                }
                                divActive = true
                                titleActive = true
                                e.target.style.dispaly = 'none'
                                title.style.display = 'block'

                                bodyEle.addEventListener('mousemove', bodymove)
                            }
                        }

                        bodyEle.appendChild(title)
                        // 移动节点
                        var cloneHeader = e.target.cloneNode()
                        // console.log(cloneHeader)
                        e.stopPropagation()
                        title.appendChild(cloneHeader)
                        // 添加鼠标松开事件
                        document.ontouchend = e => {
                            // 销毁事件
                            bodyEle.removeEventListener('mousemove', bodymove, false)
                            bodyEle.ontouchmove = null
                            document.ontouchmove = null
                            document.ontouchend = null
                            header = document.querySelectorAll('[data-index]')
                            divActive = false
                            titleActive = false
                            title.style.display = 'none'

                            title.removeChild(title.children[0])
                            // console.log('松开', headerboxd, clickheder.parentNode.parentNode)
                            if (titleType === true) {
                                // console.log('在头部')

                                headerboxd.parentNode.appendChild(bnode)
                            }
                            if (bodyType === true) {
                                // dqtit.removeChild(bodynode)
                                // 根据盒子类名判断节点移动位置
                                if (div.className === 'left') {
                                    // 移动盒子
                                    // 在鼠标松开时把移入的目标盒子放进移动的盒子里面，再添加移动的盒子到目标盒子
                                    // 这样保证只有每个定位个盒子里面最多只有两个内容盒子
                                    var border: any = document.createElement('div')
                                    border.className = 'border'
                                    border.style.width = `5px`
                                    border.style.height = `100%`
                                    divnode.style.display = `flex`
                                    divnode.style.backgroundColor = `#aeaeaf`
                                    divnode.style.display = `flex`
                                    divnode.style.flexDirection = `row`
                                    divnode.style.flex = databoodynode.style.flex
                                    divnode.style.width = `${databoodynode.style.width}`
                                    divnode.style.height = `${databoodynode.style.height}`
                                    databoodynode.style.flex = 2
                                    databoodynode.style.width = `100%`
                                    databoodynode.style.height = `100%`
                                    var index: number = 0
                                    // 判断移入的内容是盒子地第一个还是第二个
                                    for (
                                        let i = 0;
                                        i < databoodynode.parentNode.children.length;
                                        i++
                                    ) {
                                        if (
                                            databoodynode.parentNode.children[i] === databoodynode
                                        ) {
                                            index = i
                                        }
                                    }
                                    divnode.insertBefore(border, divnode.children[1])
                                    divnode.insertBefore(
                                        databoodynode,
                                        divnode.children[0].previousElementSibling
                                    )
                                    // divnode.insertBefore(border, divnode.children[1])
                                    // 根据移入的盒子来判断移入的位置
                                    if (layoutboxnode.children[0]) {
                                        if (index === 0) {
                                            layoutboxnode.insertBefore(
                                                divnode,
                                                layoutboxnode.children[0]
                                            )
                                        } else {
                                            layoutboxnode.appendChild(divnode)
                                        }
                                    } else {
                                        layoutboxnode.appendChild(divnode)
                                    }
                                } else if (div.className === 'right') {
                                    var border: any = document.createElement('div')
                                    border.className = 'border'
                                    border.style.width = `5px`
                                    border.style.height = `100%`
                                    divnode.style.display = `flex`
                                    divnode.style.flexDirection = `row`
                                    divnode.style.flex = databoodynode.style.flex
                                    divnode.style.width = `${databoodynode.style.width}`
                                    divnode.style.height = `${databoodynode.style.height}`

                                    databoodynode.style.flex = 2
                                    databoodynode.style.width = `100%`
                                    databoodynode.style.height = `100%`
                                    var index: number = 0
                                    for (
                                        let i = 0;
                                        i < databoodynode.parentNode.children.length;
                                        i++
                                    ) {
                                        if (
                                            databoodynode.parentNode.children[i] === databoodynode
                                        ) {
                                            index = i
                                        }
                                    }
                                    divnode.insertBefore(border, divnode.children[0])
                                    divnode.insertBefore(databoodynode, divnode.children[0])
                                    if (layoutboxnode.children[0]) {
                                        // =1=0 有争议======================
                                        if (index === 0) {
                                            layoutboxnode.insertBefore(
                                                divnode,
                                                layoutboxnode.children[0]
                                            )
                                        } else {
                                            layoutboxnode.appendChild(divnode)
                                        }
                                    } else {
                                        layoutboxnode.appendChild(divnode)
                                    }
                                } else if (div.className === 'buttom') {
                                    // eslint-disable-next-line @typescript-eslint/no-redeclare
                                    var border: any = document.createElement('div')
                                    border.className = 'border2'
                                    border.style.width = `100%`
                                    border.style.height = `5px`
                                    divnode.style.display = `flex`
                                    divnode.style.backgroundColor = `#aeaeaf`

                                    divnode.style.display = `flex`
                                    divnode.style.flexDirection = `column`
                                    divnode.style.flex = databoodynode.style.flex

                                    divnode.style.width = `${databoodynode.style.width}`
                                    divnode.style.height = `${databoodynode.style.height}`
                                    databoodynode.style.flex = 2
                                    databoodynode.style.width = `100%`
                                    databoodynode.style.height = `100%`
                                    var index: number = 0
                                    for (
                                        let i = 0;
                                        i < databoodynode.parentNode.children.length;
                                        i++
                                    ) {
                                        if (
                                            databoodynode.parentNode.children[i] === databoodynode
                                        ) {
                                            index = i
                                        }
                                    }

                                    divnode.insertBefore(border, divnode.children[0])
                                    divnode.insertBefore(databoodynode, divnode.children[0])
                                    if (layoutboxnode.children[0]) {
                                        if (index === 0) {
                                            layoutboxnode.insertBefore(
                                                divnode,
                                                layoutboxnode.children[0]
                                            )
                                        } else {
                                            layoutboxnode.appendChild(divnode)
                                        }
                                    } else {
                                        layoutboxnode.appendChild(divnode)
                                    }
                                } else if (div.className === 'top') {
                                    // var aa:any = databoodynode.cloneNode(true)
                                    var border: any = document.createElement('div')
                                    border.className = 'border2'
                                    border.style.width = `100%`
                                    border.style.height = `5px`
                                    divnode.style.display = `flex`
                                    divnode.style.backgroundColor = `#aeaeaf`
                                    divnode.style.display = `flex`
                                    divnode.style.flexDirection = `column`
                                    divnode.style.flex = databoodynode.style.flex
                                    divnode.style.width = `${databoodynode.style.width}`
                                    divnode.style.height = `${databoodynode.style.height}`
                                    databoodynode.style.flex = 2
                                    databoodynode.style.width = `100%`
                                    databoodynode.style.height = `100%`
                                    var index: number = 0
                                    for (
                                        let i = 0;
                                        i < databoodynode.parentNode.children.length;
                                        i++
                                    ) {
                                        if (
                                            databoodynode.parentNode.children[i] === databoodynode
                                        ) {
                                            index = i
                                        }
                                    }
                                    divnode.insertBefore(border, divnode.children[1])
                                    divnode.insertBefore(
                                        databoodynode,
                                        divnode.children[0].previousElementSibling
                                    )
                                    if (layoutboxnode.children[0]) {
                                        if (index === 0) {
                                            layoutboxnode.insertBefore(
                                                divnode,
                                                layoutboxnode.children[0]
                                            )
                                        } else {
                                            layoutboxnode.appendChild(divnode)
                                        }
                                    } else {
                                        layoutboxnode.appendChild(divnode)
                                    }
                                }
                                titleActive = false

                                xzbody.removeChild(div)
                                // 在移动节点后为重新创建的节点添加事件
                                headerbox = document.querySelectorAll('.header')
                                dataBody = document.querySelectorAll('[data-body]')
                                layoutbox = document.querySelectorAll('.layoutbox')
                                bordernode = document.querySelectorAll('.border')
                                bordernode2 = document.querySelectorAll('.border2')
                                // 这里++有争议-0--------------------------------------
                                for (let pz = 0; pz < bordernode.length; ++pz) {
                                    // 拖拽boder修改盒子宽高
                                    bordernode[pz].addEventListener(
                                        'touchstart',
                                        (e: any) => {
                                            var brod0 = 0
                                            var brod1 = 0
                                            boderdown(e, pz, brod0, brod1)
                                        }
                                        // eslint-disable-next-line no-loop-func
                                    )
                                }

                                for (let p = 0; p < bordernode2.length; p++) {
                                    // 拖拽boder2修改盒子宽高
                                    bordernode2[p].addEventListener(
                                        'touchstart',
                                        (e: any) => {
                                            var brod0 = 0
                                            var brod1 = 0
                                            boder2down(e, p, brod0, brod1)
                                        }
                                        // eslint-disable-next-line no-loop-func
                                    )
                                    // bordernode2[p].addEventListener(
                                    //   'mousedown',
                                    //   // eslint-disable-next-line no-loop-func
                                    //   function boder2down(e: any) {
                                    //     var bodera = e.target
                                    //     var ofsettop = e.target.parentNode.offsetTop
                                    //     var ofsetheight = e.target.parentNode.offsetHeight
                                    //     var brod0 = 0
                                    //     var brod1 = 0
                                    //     var borypan: any = bordernode2[p].parentNode
                                    //     borypan.onmousemove = (e: any) => {
                                    //       var defdul = e.target
                                    //       bodera.style.position = `absolute`
                                    //       bodera.style.zIndex = 98
                                    //       bodera.style.width = `${bodera.parentNode.children[0].offsetWidth}px`
                                    //       for (
                                    //         let boderxd = 0;
                                    //         boderxd < e.target.parentNode.children.length;
                                    //         boderxd++
                                    //       ) {}
                                    //       if (e.pageY - ofsettop < 50 + brod0) {
                                    //         bodera.style.top = `${45 + ofsettop + brod0}px`
                                    //       } else if (
                                    //         e.pageY - ofsettop >
                                    //         ofsetheight - 50 - brod1
                                    //       ) {
                                    //         bodera.style.top = `${
                                    //           ofsettop + ofsetheight - 50 - brod1
                                    //         }px`
                                    //       } else {
                                    //         bodera.style.top = `${e.pageY - 5}px`
                                    //       }
                                    //       defdul.onmouseup = () => {
                                    //         defdul.onmousemove = null
                                    //       }

                                    //       var borpan: any = bordernode2[p].parentNode
                                    //       var borzzpan: any = bordernode[p].parentNode
                                    //       borpan.onmouseup = (e: any) => {
                                    //         bodera.style.position = `static`
                                    //         // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                    //         bodera.nextElementSibling.style.flex = `none`
                                    //         bodera.previousElementSibling.style.height = `${
                                    //           bodera.style.top.replace(/[a-zA-Z]+/g, '') -
                                    //           ofsettop
                                    //         }px`
                                    //         defdul.onmousemove = null
                                    //         bordernode[p].onmousedown = null
                                    //         borzzpan.onmousemove = null
                                    //         for (let zz = 0; zz < bordernode2.length; zz++) {
                                    //           bordernode2[zz].onmousedown = null
                                    //           bordernode2[zz].onmousemove = null
                                    //           borzzpan.onmousemove = null
                                    //         }

                                    //         borpan.onmousemove = null
                                    //         for (let z = 0; z < bordernode.length; z++) {
                                    //           bordernode[z].style.height = `100%`
                                    //         }
                                    //         setBodyone(!bodyone)
                                    //       }
                                    //       for (let t = 0; t < layoutbox.length; t++) {
                                    //         // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-loop-func
                                    //         layoutbox[t].onmouseup = () => {
                                    //           bodera.style.position = `static`
                                    //           // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                    //           bodera.nextElementSibling.style.flex = `1`
                                    //           bodera.previousElementSibling.style.flex = `none`
                                    //           bodera.previousElementSibling.style.height = `${
                                    //             bodera.style.top.replace(/[a-zA-Z]+/g, '') -
                                    //             ofsettop
                                    //           }px`
                                    //           defdul.onmousemove = null
                                    //           bordernode2[p].onmousedown = null
                                    //           var borpan: any = bordernode2[p].parentNode
                                    //           borpan.onmousemove = null
                                    //           for (let zz = 0; zz < bordernode2.length; zz++) {
                                    //             var borzzzpan: any = bordernode2[zz].parentNode
                                    //             bordernode2[zz].onmousedown = null
                                    //             bordernode2[zz].onmousemove = null
                                    //             borzzzpan.onmousemove = null
                                    //           }
                                    //           // bordernode2[p].onmousedown = null
                                    //           borpan.onmousemove = null
                                    //           for (let z = 0; z < bordernode.length; z++) {
                                    //             bordernode[z].style.height = `100%`
                                    //           }
                                    //           setBodyone(!bodyone)
                                    //         }
                                    //       }
                                    //     }
                                    //     setBodyone(!bodyone)
                                    //   }
                                    // )
                                }
                                for (let z = 0; z < headerbox.length; z++) {
                                    headerbox[z].addEventListener('mousedown', e => {
                                        titmouyd(e)
                                    })
                                }
                                for (let z = 0; z < headerbox.length; z++) {
                                    headerbox[z].addEventListener('mousedown', () => {
                                        titlemouse(z)
                                    })
                                }
                                for (let z = 0; z < headerbox.length; z++) {
                                    headerbox[z].addEventListener('mouseenter', () => {
                                        titlemouse(z)
                                    })
                                }
                                for (let z = 0; z < headerbox.length; z++) {
                                    headerbox[z].addEventListener('mouseleave', () => {
                                        titleleave(z)
                                    })
                                }
                                for (let x = 0; x < dataBody.length; x++) {
                                    // 移入body
                                    dataBody[x].addEventListener('mouseenter', e => {
                                        databodymove(e, x)
                                    })
                                    // 移出body
                                    dataBody[x].addEventListener('mouseleave', e => {
                                        databodyleave(e, x)
                                    })
                                }
                            }
                            setBodyone(!bodyone)
                        }
                    }
                }
            )
        }

        function databodyleave(e, x) {
            bodyType = false
            document.onmousemove = null
        }

        function databodymove(e, x) {
            bodyType = true

            if (divActive === true) {
                // 添加节点
                div.style.width = `200px`
                div.style.height = `200px`
                div.style.backgroundColor = '#545454'
                // div.style.opacity = 0.4
                div.style.position = 'absolute'
                dataBody[x].appendChild(div)
            }
            // console.log(e.target.parentNode)
            layoutboxnode = e.target.parentNode.parentNode
            databoodynode = e.target.parentNode
            xzbody = e.target
            // 在body移动
            dataBody[x].onmousemove = (e: any) => {
                // console.log('在body移动')
                // 鼠标在div的坐标x轴
                var bodyX = e.pageX - dataBody[x].getBoundingClientRect().left
                // 鼠标在div的坐标y轴
                var bodyY = e.pageY - dataBody[x].getBoundingClientRect().top
                // dataBody[x].getBoundingClientRect().width  div宽
                //  dataBody[x].getBoundingClientRect().heigth div高
                // 是否要显示
                if (divActive === true) {
                    if (bodyX < dataBody[x].getBoundingClientRect().width / 4) {
                        // console.log('左')
                        div.style.height = `${dataBody[x].getBoundingClientRect().height}px`
                        div.style.width = `${dataBody[x].getBoundingClientRect().width / 3
                            }px`
                        div.style.left = `0px`
                        div.style.top = `0px`
                        div.className = 'left'
                    } else if (
                        bodyX > (dataBody[x].getBoundingClientRect().width / 4) * 3 &&
                        bodyY > 0
                    ) {
                        // console.log('右')
                        div.style.width = `${dataBody[x].getBoundingClientRect().width / 3
                            }px`
                        div.style.height = `${dataBody[x].getBoundingClientRect().height}px`
                        div.style.left = `${(dataBody[x].getBoundingClientRect().width / 3) * 2
                            }px`
                        div.style.top = `+0px`
                        div.className = 'right'
                    }
                    if (
                        bodyX <= (dataBody[x].getBoundingClientRect().width / 4) * 3 &&
                        bodyX >= dataBody[x].getBoundingClientRect().width / 4
                    ) {
                        if (bodyY < dataBody[x].getBoundingClientRect().height / 2) {
                            div.style.width = `${dataBody[x].getBoundingClientRect().width}px`
                            div.style.height = `${dataBody[x].getBoundingClientRect().height / 3
                                }px`
                            div.style.left = `0px`
                            div.style.top = `${0}px`
                            div.className = 'top'
                        } else {
                            div.style.width = `${dataBody[x].getBoundingClientRect().width}px`
                            div.style.height = `${dataBody[x].getBoundingClientRect().height / 3
                                }px`
                            div.style.left = `0px`
                            div.style.top = `${(dataBody[x].getBoundingClientRect().height / 3) * 2 + 0
                                }px`
                            div.className = 'buttom'
                        }
                    }
                }
            }
        }

        var pax = 0
        var pay = 0

        function databodymoveyd(e, x, touch) {
            bodyType = true
            // `触发按下事件: engineDiv, 鼠标坐标: (${touch.x}, ${touch.y}), 相对于元素的坐标: (${touch.offsetX}, ${touch.offsetY})`
            if (divActive === true) {
                // 添加节点
                div.style.width = `200px`
                div.style.height = `200px`
                div.style.backgroundColor = '#545454'
                // div.style.opacity = 0.4
                div.style.position = 'absolute'
                div.style.top = '0px'
                div.style.left = '0px'
                div.style.zIndex = '102'
                // div.style.position = 'absolute'
                e.appendChild(div)
            }
            layoutboxnode = e.parentNode.parentNode
            databoodynode = e.parentNode
            xzbody = e
            //移动端 在body移动事件---
            let titlemouseyd = EditorInputMgr.Instance.addElementEventListener(
                e,
                'TouchMove',
                // eslint-disable-next-line no-loop-func
                // 这里的移动端事件需要一个提供移动的鼠标位置
                // touch => {
                //   console.error('检测到移动：', touch, e)
                //   //console.error('检测到移动：', touch, e)
                // }
                (touch2: TouchPosition) => {
                    // console.log('在body移动',)
                    // 鼠标在div的坐标x轴
                    var bodyX = touch2.x - e.getBoundingClientRect().left
                    // 鼠标在div的坐标y轴
                    var bodyY = touch2.y - e.getBoundingClientRect().top
                    // dataBody[x].getBoundingClientRect().width  div宽
                    //  dataBody[x].getBoundingClientRect().heigth div高
                    // 是否要显示
                    if (divActive === true) {
                        if (bodyX < e.getBoundingClientRect().width / 4) {
                            // console.log('左')
                            div.style.height = `${e.getBoundingClientRect().height}px`
                            div.style.width = `${e.getBoundingClientRect().width / 3}px`
                            div.style.left = `0px`
                            div.style.top = `0px`
                            div.className = 'left'
                        } else if (
                            bodyX > (e.getBoundingClientRect().width / 4) * 3 &&
                            bodyY > 0
                        ) {
                            // console.log('右')
                            div.style.width = `${e.getBoundingClientRect().width / 3}px`
                            div.style.height = `${e.getBoundingClientRect().height}px`
                            div.style.left = `${(e.getBoundingClientRect().width / 3) * 2}px`
                            div.style.top = `+0px`
                            div.className = 'right'
                        }
                        if (
                            bodyX <= (e.getBoundingClientRect().width / 4) * 3 &&
                            bodyX >= e.getBoundingClientRect().width / 4
                        ) {
                            if (bodyY < e.getBoundingClientRect().height / 2) {
                                div.style.width = `${e.getBoundingClientRect().width}px`
                                div.style.height = `${e.getBoundingClientRect().height / 3}px`
                                div.style.left = `0px`
                                div.style.top = `${0}px`
                                div.className = 'top'
                            } else {
                                div.style.width = `${e.getBoundingClientRect().width}px`
                                div.style.height = `${e.getBoundingClientRect().height / 3}px`
                                div.style.left = `0px`
                                div.style.top = `${(e.getBoundingClientRect().height / 3) * 2 + 0
                                    }px`
                                div.className = 'buttom'
                            }
                        }
                    }
                    // titlemouseyd.removeListener()
                }
            )
            // dataBody[dy].ontouchmove = event => {
            //   console.log('在body移动', event.changedTouches[0].pageX)
            //   // 鼠标在div的坐标x轴
            //   var bodyX =
            //     event.changedTouches[0].pageX - e.getBoundingClientRect().left
            //   // 鼠标在div的坐标y轴
            //   var bodyY =
            //     event.changedTouches[0].pageY - e.getBoundingClientRect().top
            //   // dataBody[x].getBoundingClientRect().width  div宽
            //   //  dataBody[x].getBoundingClientRect().heigth div高
            //   // 是否要显示
            //   if (divActive === true) {
            //     if (bodyX < e.getBoundingClientRect().width / 4) {
            //       // console.log('左')
            //       div.style.height = `${e.getBoundingClientRect().height}px`
            //       div.style.width = `${e.getBoundingClientRect().width / 3}px`
            //       div.style.left = `0px`
            //       div.style.top = `0px`
            //       div.className = 'left'
            //     } else if (
            //       bodyX > (e.getBoundingClientRect().width / 4) * 3 &&
            //       bodyY > 0
            //     ) {
            //       // console.log('右')
            //       div.style.width = `${e.getBoundingClientRect().width / 3}px`
            //       div.style.height = `${e.getBoundingClientRect().height}px`
            //       div.style.left = `${(e.getBoundingClientRect().width / 3) * 2}px`
            //       div.style.top = `+0px`
            //       div.className = 'right'
            //     }
            //     if (
            //       bodyX <= (e.getBoundingClientRect().width / 4) * 3 &&
            //       bodyX >= e.getBoundingClientRect().width / 4
            //     ) {
            //       if (bodyY < e.getBoundingClientRect().height / 2) {
            //         div.style.width = `${e.getBoundingClientRect().width}px`
            //         div.style.height = `${e.getBoundingClientRect().height / 3}px`
            //         div.style.left = `0px`
            //         div.style.top = `${0}px`
            //         div.className = 'top'
            //       } else {
            //         div.style.width = `${e.getBoundingClientRect().width}px`
            //         div.style.height = `${e.getBoundingClientRect().height / 3}px`
            //         div.style.left = `0px`
            //         div.style.top = `${
            //           (e.getBoundingClientRect().height / 3) * 2 + 0
            //         }px`
            //         div.className = 'buttom'
            //       }
            //     }
            //   }
            // }
        }

        // databody移入移出事件
        for (let x = 0; x < dataBody.length; x++) {
            var onmove = function (e) {
            }
            // 移入body
            dataBody[x].addEventListener('mouseenter', (e: any) => {
                //console.log('移入 body(存放模块内容部分的盒子)')

                databodymove(e, x)
            })
            let Moveindatabodt = EditorInputMgr.Instance.addElementEventListener(
                dataBody[x],
                'TouchEnter',
                // eslint-disable-next-line no-loop-func
                (touch: TouchPosition) => {
                    // console.log('手机端body移入')
                    databodymoveyd(dataBody[x], x, touch)
                    //解绑事件调用 removeListener();
                    Moveindatabodt.removeListener()
                }
            )
            // 移出body
            //console.log('移出body(存放模块内容部分的盒子)')

            dataBody[x].addEventListener('mouseleave', (e: any) => {
                databodyleave(e, x)
            })
        }

        // 标题移入移出事件
        function titlemouse(y: any) {
            for (let y = 0; y < xzbody?.children.length; y++) {
                if (xzbody?.children[y] == div) {
                    xzbody.removeChild(div)
                }
            }
            titleType = true
            // console.log('移入header')
            headerboxd = headerbox[y]
            if (titleActive === true) {
                var title2 = title.cloneNode(true)
                title2.style.position = ''
                headerbox[y].appendChild(movetitlenode)
                header = document.querySelectorAll('[data-index]')
            }
        }

        function titleleave(y: any) {
            titleType = false
            document.onmousemove = null
            // headerbox[y].childNodes()
            if (titleActive === true) {
                // console.log(headerbox[y], movetitlenode, 'yt')
                for (let a = 0; a < headerbox[y].children.length; a++) {
                    if (headerbox[y].children[a] == movetitlenode) {
                        headerbox[y].removeChild(movetitlenode)
                    }
                }
            } else {
            }
            //console.log('移出header(存放title(模块标题)的盒子)')

            header = document.querySelectorAll('[data-index]')
        }

        for (let y = 0; y < headerbox.length; y++) {
            headerbox[y].addEventListener('mouseenter', () => {
                titlemouse(y)
            })
            // eslint-disable-next-line no-loop-func
            headerbox[y].addEventListener('mouseleave', () => {
                titleleave(y)
            })
            let hb: any = headerbox[y];
            let titlemouseyd = EditorInputMgr.Instance.addElementEventListener(
                hb,
                'TouchEnter',
                // eslint-disable-next-line no-loop-func
                (touch: TouchPosition) => {
                    //console.log('移入header(存放title(模块标题)的盒子)')
                    for (let y = 0; y < xzbody?.children.length; y++) {
                        if (xzbody?.children[y] == div) {
                            xzbody.removeChild(div)
                        }
                    }
                    titleType = true
                    headerboxd = headerbox[y]
                    if (titleActive === true) {
                        var title2 = title.cloneNode(true)
                        title2.style.position = ''

                        headerbox[y].appendChild(movetitlenode)
                        header = document.querySelectorAll('[data-index]')
                    }
                    //解绑事件调用 removeListener();
                    titlemouseyd.removeListener()
                }
            )
        }
        const boder2down = (e: any, pz: any, brod1: any, brod0: any) => {
            //console.log('点击broder（横向）(每个模块之间的那根线条)事件')
            var bodera = e.target
            var ofsetleft = e.target.parentNode.offsetTop
            var ofsetwidth = e.target.parentNode.offsetHeight
            var page: any = e.pageY
            var typ = true
            var bord1tast: any = 0
            var bord2tast: any = 0
            var borderpan: any = bordernode2[pz].parentNode
            borderpan.onmousemove = (e: any) => {
                //console.log('移动broder（横向）(每个模块之间的那根线条)事件')

                var brodlist1: any = []
                var brodlist2: any = []
                var defdul = e.target
                bodera.style.position = `absolute`
                bodera.style.zIndex = 99
                if (page !== e.pageY) {
                    for (let y = 0; y < bordernode2.length; y++) {
                        if (bordernode2[y].offsetTop - bordernode2[pz].offsetTop !== 0) {
                            if (bodera.parentNode.children[2].className === `layoutbox`) {
                                if (
                                    bordernode2[y].offsetTop - bordernode2[pz].offsetTop >=
                                    200
                                ) {
                                    brodlist1.push(bordernode2[y])
                                }
                            }
                            if (bodera.parentNode.children[0].className === `layoutbox`) {
                                if (
                                    bordernode2[pz].offsetTop - bordernode2[y].offsetTop >=
                                    200
                                ) {
                                    brodlist2.push(bordernode2[y])
                                }
                            }
                        }
                    }
                }
                for (let n = 0; n < brodlist1.length; n++) {
                    bord1tast = brodlist1[0]
                    if (bord1tast > brodlist1[n].offsetTop) {
                        bord1tast = brodlist1[n].offsetTop
                    }
                }
                for (let n = 0; n < brodlist2.length; n++) {
                    bord2tast = brodlist2[0]
                    if (bord2tast <= brodlist2[n].offsetTop) {
                        bord2tast = brodlist2[n].offsetTop
                    }
                }
                bodera.style.width = `${bodera.parentNode.children[0].offsetWidth}px`
                if (e.pageY - ofsetleft < 200 + brod0) {
                    bodera.style.left = `${195 + ofsetleft + brod0}px`
                } else if (e.pageY - ofsetleft > ofsetwidth - 200 - brod1) {
                    bodera.style.top = `${ofsetleft + ofsetwidth - 200 - brod1}px`
                } else {
                    bodera.style.top = `${e.pageY - 2}px`
                }
                bodera.style.position = `static`
                bodera.nextElementSibling.style.flex = `1`
                bodera.nextElementSibling.style.height = `100%`
                bodera.previousElementSibling.style.flex = `none`
                bodera.previousElementSibling.style.height = `${bodera.style.top.replace(/[a-zA-Z]+/g, '') - ofsetleft
                    }px`

                for (let t = 0; t < layoutbox.length; t++) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-loop-func
                    layoutbox[t].onmouseup = () => {
                        //console.log('松开broder（横向）(每个模块之间的那根线条)事件')

                        defdul.onmousemove = null
                        bordernode2[pz].onmousedown = null

                        var borpzpan: any = bordernode2[pz].parentNode
                        borpzpan.onmousemove = null

                        for (let zz = 0; zz < bordernode2.length; zz++) {
                            var borpanzz: any = bordernode2[zz].parentNode

                            bordernode2[zz].onmousedown = null
                            bordernode2[zz].onmousemove = null
                            borpanzz.onmousemove = null
                        }
                        for (let z = 0; z < bordernode.length; z++) {
                            bordernode[z].style.height = `100%`
                        }
                    }
                }
            }
        }
        // ------
        const boderdown = (e: any, pz: any, brod1: any, brod0: any) => {
            //console.log('点击broder（纵向）(每个模块之间的那根线条)事件')

            var bodera = e.target
            var ofsetleft = e.target.parentNode.offsetLeft
            var ofsetwidth = e.target.parentNode.offsetWidth
            var page: any = e.pageX
            var typ = true
            var bord1tast: any = 0
            var bord2tast: any = 0
            var borderpan: any = bordernode[pz].parentNode
            borderpan.onmousemove = (e: any) => {
                //console.log('移动broder（纵向）(每个模块之间的那根线条)事件')

                var brodlist1: any = []
                var brodlist2: any = []
                var defdul = e.target
                bodera.style.position = `absolute`
                bodera.style.zIndex = 99
                if (page !== e.pageX) {
                    for (let y = 0; y < bordernode.length; y++) {
                        if (bordernode[y].offsetLeft - bordernode[pz].offsetLeft !== 0) {
                            if (bodera.parentNode.children[2].className === `layoutbox`) {
                                if (
                                    bordernode[y].offsetLeft - bordernode[pz].offsetLeft >=
                                    200
                                ) {
                                    brodlist1.push(bordernode[y])
                                }
                            }
                            if (bodera.parentNode.children[0].className === `layoutbox`) {
                                if (
                                    bordernode[pz].offsetLeft - bordernode[y].offsetLeft >=
                                    200
                                ) {
                                    brodlist2.push(bordernode[y])
                                }
                            }
                        }
                    }
                }

                for (let n = 0; n < brodlist1.length; n++) {
                    bord1tast = brodlist1[0]
                    if (bord1tast > brodlist1[n].offsetLeft) {
                        bord1tast = brodlist1[n].offsetLeft
                    }
                }
                for (let n = 0; n < brodlist2.length; n++) {
                    bord2tast = brodlist2[0]

                    if (bord2tast <= brodlist2[n].offsetLeft) {
                        bord2tast = brodlist2[n].offsetLeft
                    }
                }
                bodera.style.height = `${bodera.parentNode.children[0].offsetHeight}px`

                for (
                    let boderxd = 0;
                    boderxd < e.target.parentNode.children.length;
                    boderxd++
                ) {
                    // const element = array[boderxd];
                    if (e.target.parentNode.children[boderxd].className === 'layoutbox') {
                        if (boderxd === 0) {
                            if (
                                e.target.parentNode.children[boderxd].style.flexDirection ===
                                'column'
                            ) {
                                brod0 = 0
                            } else {
                                // brod0 =
                                //   e.target.parentNode.children[boderxd].children[2].offsetWidth
                                e.target.parentNode.children[0].children[0].style.width = `${e.target.parentNode.children[0].children[0].offsetWidth}px`
                                e.target.parentNode.children[0].children[0].style.flex = `none`
                                e.target.parentNode.children[0].children[2].style.width = `100%`
                                e.target.parentNode.children[0].children[2].style.flex = `1`
                            }
                        } else if (boderxd === 2) {
                            if (
                                e.target.parentNode.children[boderxd].style.flexDirection ===
                                'column'
                            ) {
                                brod1 = 0
                            } else {
                                e.target.parentNode.children[2].children[2].style.width = `${e.target.parentNode.children[2].children[2].offsetWidth}px`
                                e.target.parentNode.children[2].children[2].style.flex = `none`
                                e.target.parentNode.children[2].children[0].style.width = `100%`
                                e.target.parentNode.children[2].children[0].style.flex = `1`
                            }
                        }
                    }
                }

                if (e.pageX - ofsetleft < 200 + brod0) {
                    bodera.style.left = `${195 + ofsetleft + brod0}px`
                } else if (e.pageX - ofsetleft > ofsetwidth - 200 - brod1) {
                    bodera.style.left = `${ofsetleft + ofsetwidth - 200 - brod1}px`
                } else {
                    bodera.style.left = `${e.pageX - 2}px`
                }
                bodera.style.position = `static`
                bodera.nextElementSibling.style.flex = `1`
                bodera.nextElementSibling.style.width = `100%`
                bodera.previousElementSibling.style.flex = `none`
                bodera.previousElementSibling.style.width = `${bodera.style.left.replace(/[a-zA-Z]+/g, '') - ofsetleft
                    }px`

                for (let t = 0; t < layoutbox.length; t++) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-loop-func
                    layoutbox[t].onmouseup = () => {
                        //console.log('松开broder（纵向）(每个模块之间的那根线条)事件')

                        defdul.onmousemove = null
                        bordernode[pz].onmousedown = null

                        var borpzpan: any = bordernode[pz].parentNode
                        borpzpan.onmousemove = null

                        for (let zz = 0; zz < bordernode.length; zz++) {
                            var borpanzz: any = bordernode[zz].parentNode

                            bordernode[zz].onmousedown = null
                            bordernode[zz].onmousemove = null
                            borpanzz.onmousemove = null
                        }
                        for (let z = 0; z < bordernode2.length; z++) {
                            bordernode2[z].style.width = `100%`
                        }
                    }
                }
            }
        }
        //窗口变化事件 窗口变化窗口内盒子随着窗口变化缩小
        window.onresize = function () {
            for (let i = 0; i < layoutbox.length; i++) {
                var childer2: any = layoutbox[i].children[2]
                var childer0: any = layoutbox[i].children[0]

                if (
                    layoutbox[i].children.length >= 2 &&
                    layoutbox[i].style.flexDirection === `row`
                ) {
                    if (childer2.offsetWidth <= 200) {
                        childer2.style.width = `200px`
                        childer2.style.flex = `none`
                        childer0.style.flex = `1`
                        childer0.style.width = `100%`
                    }
                    for (let y = 0; y < layoutbox[i].children.length; y++) {
                        var childery: any = layoutbox[i].children[y]
                        if (
                            layoutbox[i].children[y]?.className === `layoutbox` &&
                            childery.style.flexDirection === `row`
                        ) {
                            if (childery.offsetWidth <= 400) {
                                childery.style.width = `400px`
                                childery.style.flex = `none`
                                childer0.style.flex = `1`
                                childer0.style.width = `100%`
                            }
                        }
                    }
                }
                if (
                    layoutbox[i].children.length >= 2 &&
                    layoutbox[i].style.flexDirection === `column`
                ) {
                    if (layoutbox[i].children[2].offsetHeight <= 100) {
                        layoutbox[i].children[2].style.height = `100px`
                        layoutbox[i].children[2].style.flex = `none`
                        layoutbox[i].children[0].style.flex = `1`
                        layoutbox[i].children[0].style.height = `100%`
                    }
                    for (let z = 0; z <= layoutbox[i].children.length; z++) {
                        if (
                            layoutbox[i].children[z]?.className === `layoutbox` &&
                            layoutbox[i].children[z].style.flexDirection === `column`
                        ) {
                            if (layoutbox[i].children[z].offsetHeight <= 200) {
                                layoutbox[i].children[z].style.height = `200px`
                                layoutbox[i].children[z].style.flex = `none`
                                layoutbox[i].children[0].style.flex = `1`
                                layoutbox[i].children[0].style.height = `100%`
                            }
                        }
                    }
                }
            }
        }
        // 整体宽高变化时layoutbox里面的第一个的宽高要等于最外层盒子减去第二个的宽高
    }, 0)

    const [lock, setlock] = useState(false) //icon锁图标的状态
    function lockButton() {
        setlock(lock == false ? true : false)
    }

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: 'Collapse All'
                },
                {
                    key: '2',
                    label: 'Lock'
                },
                {
                    key: '3',
                    label: 'Rename New Objects'
                },
                {
                    key: '4',
                    label: 'Add Tab',
                    children: [
                        {
                            key: '4-1',
                            label: 'Scene'
                        },
                        {
                            key: '4-2',
                            label: 'Game'
                        }
                    ]
                }
            ]}
        />
    )

    const [type, setType] = useState(true)

    return (
        <div className="box">
            <div className="layoutbox">
                <div className="layoutbox" style={{ flexDirection: `row` }}>
                    <div
                        className="layoutbox"
                        style={{
                            flexDirection: 'column',
                            display: 'flex',
                            backgroundColor: 'rgb(174, 174, 175)',
                            flex: '0 0 auto',
                            width: '70%'
                            // width: '1022px'
                        }}
                    >
                        <div
                            className="layoutbox"
                            style={{
                                flexDirection: 'row',
                                flex: '0 0 auto',
                                width: '100%',
                                height: '60%',
                                display: 'flex',
                                backgroundColor: 'rgb(174, 174, 175)'
                            }}
                        >
                            <div
                                className="box1"
                                style={{ flex: '0 0 auto', width: '25%', height: '100%' }}
                            >
                                <div className="header">
                                    <div data-index="2" className="title-content active">
                                        <AlignRightOutlined className="title-icon" />
                                        Hierarchy
                                    </div>
                                </div>
                                <div className="body two" data-body="2" style={{ zIndex: `0` }}>
                                    <TreeDemo />
                                    <TreeTest />
                                </div>
                            </div>
                            <div
                                className="border"
                                style={{
                                    width: '4px',
                                    height: '100%',
                                    position: 'static',
                                    zIndex: '99',
                                    left: '241px',
                                    backgroundColor: 'rgb(0, 0, 0)'
                                }}
                            ></div>
                            <div
                                className="box1"
                                style={{ flex: '1 1 0%', width: '100%', height: '100%' }}
                            >
                                <div className="header">
                                    {/* <div data-index="1" className="title-content">
                                        <EditFilled className="title-icon" />
                                        CodeEdit
                                    </div> */}
                                    <div data-index="2" className="title-content active">
                                        <EditFilled className={'title-icon'} />
                                        Scene
                                    </div>
                                    {/* <div data-index="9" className="title-content">
                                        <EditFilled className={'title-icon'} />
                                        Animator
                                    </div> */}
                                    {/* 锁型开关按钮和菜单按钮 */}
                                    {/* <div className="right-icon">
                  <div onClick={lockButton}>
                    {lock ? <UnlockOutlined /> : <LockFilled />}
                  </div>
                  <div>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <a onClick={e => e.preventDefault()}>
                        <Space>
                          <MoreOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                </div> */}
                                </div>
                                {/* <div className="body one" data-body="1" ref={bodyonenode}>
                                    <Editor />
                                </div> */}
                                {/* <div className="body nine" data-body="9" ref={bodyonenode}>
                                    <Animator />
                                </div> */}
                                <div className="body two" data-body="2" ref={bodyonenode}>
                                    <Scene></Scene>
                                </div>

                            </div>
                        </div>
                        <div
                            className="border2"
                            style={{
                                width: '100%',
                                height: '5px',
                                position: 'static',
                                zIndex: '98',
                                top: '627px',
                                backgroundColor: 'rgb(0, 0, 0)'
                            }}
                        ></div>
                        <div
                            className="box1"
                            style={{ flex: '1 1 0%', width: '100%', height: '100%' }}
                        >
                            <div className="header">
                                <div data-index="3" className="title-content active">
                                    <FolderFilled className="title-icon" />
                                    Project
                                </div>
                                <div data-index="8" className="title-content">
                                    <FileDoneOutlined className="title-icon" />
                                    Console
                                </div>
                                <div data-index="5" className="title-content">
                                    <AppstoreFilled className="title-icon" />
                                    Ai
                                </div>
                                {/* <div data-index="6" className="title-content">
                                    <SettingFilled className="title-icon" />
                                    FreeText
                                </div> */}
                                {/* <div data-index="10" className="title-content">
                                    <SlidersFilled className="title-icon" />
                                    Audio Mixer
                                </div> */}
                            </div>
                            <div className="body therr" data-body="3" style={{ zIndex: `1` }}>
                                <Project />
                            </div>
                            <div className="body eight" data-body="8" style={{ zIndex: `0` }}>
                                <Console />
                            </div>
                            <div className="body five" data-body="5">
                                <Ai />
                            </div>
                            {/* <div className="body six" data-body="6" style={{ zIndex: `0` }}>
                                <FreeTexture />
                            </div> */}
                            {/* <div className="body ten" data-body="10" style={{ zIndex: `0` }}>
                                <AudioMixer />
                            </div> */}
                        </div>
                    </div>

                    <div
                        className="border"
                        style={{
                            position: 'static',
                            zIndex: '99',
                            // height: '907px',
                            left: '950px',
                            backgroundColor: 'rgb(0, 0, 0)'
                        }}
                    ></div>

                    <div
                        className="box1"
                        style={{ flex: '1 1 0%', width: '100%', height: '100%' }}
                    >
                        <div className="header">
                            <div data-index="4" className="title-content active">
                                <ExclamationCircleOutlined className="title-icon" />
                                Inspector
                            </div>
                            {/* 未实现功能屏蔽: 连连看 */}
                            <div data-index="7" className="title-content">
                                <GatewayOutlined className="title-icon" />
                                LightCode
                            </div>
                            <div data-index="8" className="title-content">
                                <GatewayOutlined className="title-icon" />
                                UIComponent
                            </div>
                        </div>
                        <div className="body four" data-body="4" style={{ zIndex: `1` }}>
                            <Inspector />
                        </div>
                        {/* 未实现功能屏蔽: 连连看 */}
                        <div className="body seven" data-body="7" style={{ zIndex: `0` }}>
                            <Lianxian />
                        </div>
                        <div className="body eight" data-body="8" style={{ zIndex: `0` }}>
                            <UIComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}