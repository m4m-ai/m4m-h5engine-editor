import React, { useEffect, useRef, useState } from "react";
import { EditorInputMgr } from "../../Game/Input/EditorInputMgr";
import './Window.css'
import { WindowManager } from "./WindowManager";

export interface IWindowData {
    /**
     * 窗口标题
     */
    title: string;
    /**
     * 窗体内容
     */
    body: JSX.Element;
    /**
     * 是否可以调整大小, 默认 true
     */
    resize?: boolean;
    /**
     * 是否显示关闭按钮, 默认 true
     */
    close?: boolean;
    /**
     * 当前窗口是否会阻挡其他地方的点击, 默认 false
     */
    keepOut?: boolean;
    /**
     * 是否显示, 默认 true
     */
    visible?: boolean;
    /**
     * 窗体的 x 轴
     */
    x?: number;
    /**
     * 窗体的 y 轴
     */
    y?: number;
    /**
     * 宽度
     */
    width?: number;
    /**
     * 高度
     */
    height?: number;
    /**
     * 最小宽度
     */
    minWidth?: number;
    /**
     * 最小高度
     */
    minHeight?: number;

    icon?: JSX.Element;
    /**
     * 关闭按钮点击时的回调, 如果函数返回 false, 则不会关闭窗口
     */
    onCloseBtnClick?: () => boolean | void;
    /**
     * 窗口上绑定的自定义数据
     */
    custom?: {
        [key: string]: any;
    }
}

export interface IWindowInstance extends IWindowData {
    /**
     * 实例 id
     */
    id: number;
}

export interface IWindowSlotInstance extends IWindowInstance {
    onTop(id: number): void;
    isTop(id: number): boolean;
}

/**
 * 通用窗体组件
 */
export function Window(data: IWindowSlotInstance) {
    let binder: any;
    const boxRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        return () => {
            if (binder) {
                binder.removeListener();
            }
        }
    }, [data]);

    // 拉伸组件  待优化 useEffect
    let eventFactory = EditorInputMgr.Instance.createElementEventFactory();

    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    const bottomright = useRef<HTMLDivElement>(null);
    const bottomleft = useRef<HTMLDivElement>(null);
    const topright = useRef<HTMLDivElement>(null);
    const topleft = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (data.resize == null || data.resize == true) {
            // 上拉
            let limit_offsetTop
            let limit_offsetLeft
            eventFactory.addEventListener(topRef.current, 'TouchDrag', (touchPosition, state) => {
                if (topRef.current) {
                    if (state === 0) {
                        // 计算出当是最小弹窗时候的 offsetTop, touchPosition.y 不能大于 offsetTop
                        limit_offsetTop = boxRef.current.offsetHeight - boxMinHeight + boxRef.current.offsetTop
                    }
                    if (touchPosition.y >= limit_offsetTop) {
                        return
                    }
                    boxRef.current.style.top = touchPosition.y + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight - touchPosition.offsetY + 'px'
                }
            })

            // 下拉
            eventFactory.addEventListener(bottomRef.current, 'TouchDrag', (touchPosition, state) => {
                if (bottomRef.current) {
                    boxRef.current.style.height = boxRef.current.offsetHeight + touchPosition.offsetY + 'px'
                }
            })

            // 右拉
            eventFactory.addEventListener(rightRef.current, 'TouchDrag', (touchPosition, state) => {
                if (rightRef.current) {
                    boxRef.current.style.width = boxRef.current.offsetWidth + touchPosition.offsetX + 'px'
                }
            })

            // 左拉
            eventFactory.addEventListener(leftRef.current, 'TouchDrag', (touchPosition, state) => {
                if (leftRef.current) {
                    if (state === 0) {
                        limit_offsetLeft = boxRef.current.offsetWidth - boxMinWidth + boxRef.current.offsetLeft
                    }
                    if (touchPosition.x >= limit_offsetLeft) {
                        return
                    }
                    boxRef.current.style.left = touchPosition.x + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth - touchPosition.offsetX + 'px'
                }
            })

            // 右下拉
            eventFactory.addEventListener(bottomright.current, 'TouchDrag', (touchPosition, state) => {
                if (bottomright.current) {
                    boxRef.current.style.width = boxRef.current.offsetWidth + touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight + touchPosition.offsetY + 'px'
                }
            })

            // 左下拉
            eventFactory.addEventListener(bottomleft.current, 'TouchDrag', (touchPosition, state) => {
                if (bottomleft.current) {
                    if (state === 0) {
                        limit_offsetLeft = boxRef.current.offsetWidth - boxMinWidth + boxRef.current.offsetLeft
                    }
                    if (touchPosition.x >= limit_offsetLeft) {
                        return
                    }

                    boxRef.current.style.left = touchPosition.x + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth - touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight + touchPosition.offsetY + 'px'
                }
            })

            // 右上拉
            eventFactory.addEventListener(topright.current, 'TouchDrag', (touchPosition, state) => {
                if (topright.current) {
                    if (state === 0) {
                        limit_offsetTop = boxRef.current.offsetHeight - boxMinHeight + boxRef.current.offsetTop
                    }
                    if (touchPosition.y >= limit_offsetTop) {
                        return
                    }
                    boxRef.current.style.top = touchPosition.y + 'px'
                    boxRef.current.style.width = boxRef.current.offsetWidth + touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight - touchPosition.offsetY + 'px'
                }
            })

            // 左上拉
            eventFactory.addEventListener(topleft.current, 'TouchDrag', (touchPosition, state) => {
                if (topleft.current) {
                    if (state === 0) {
                        limit_offsetLeft = boxRef.current.offsetWidth - boxMinWidth + boxRef.current.offsetLeft
                        limit_offsetTop = boxRef.current.offsetHeight - boxMinHeight + boxRef.current.offsetTop
                    }
                    if (!(touchPosition.x >= limit_offsetLeft)) {
                        boxRef.current.style.left = touchPosition.x + 'px'
                    }
                    if (!(touchPosition.y >= limit_offsetTop)) {
                        boxRef.current.style.top = touchPosition.y + 'px'
                    }
                    boxRef.current.style.width = boxRef.current.offsetWidth - touchPosition.offsetX + 'px'
                    boxRef.current.style.height = boxRef.current.offsetHeight - touchPosition.offsetY + 'px'
                }
            })
        }

        return () => {
            eventFactory.removeAllEventListener();
        }
    })

    /*
        width: 600px;
        height: 450px;
        min-width: 200px;
        min-height: 120px;
     */


    const width = data.width != null ? data.width : 600;
    const height = data.height != null ? data.height : 450;

    // 这是窗体内容 最小宽高
    const minWidth = Math.min(data.minWidth != null ? data.minWidth : 200, width);
    const minHeight = Math.min(data.minHeight != null ? data.minHeight : 120, height);

    // 窗体整体 最小宽高
    const boxMinWidth = minWidth
    const boxMinHeight = minHeight + 30

    const left = data.x != null ? data.x : ((document.body.clientWidth - width) / 2);
    const top = data.y != null ? data.y : ((document.body.clientHeight - height) / 2);

    return (
        <>
            {
                (data.keepOut == true) &&
                (
                    <div className="win-keepOut"></div>
                )
            }
            <div className="win-box" ref={boxRef}
                style={{
                    width,
                    height: height + 30,
                    minWidth,
                    minHeight: minHeight + 30,
                    left,
                    top,
                }}
                onPointerDown={
                    (e) => {
                        //e.stopPropagation();
                        data.onTop(data.id);
                    }
                }
            >
                <div className="win-header" ref={
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
                    <div style={{ color: '#C7C7C7' }}>
                        {
                            data.icon ? <span className="win-icon">{data.icon}</span> : ''
                        }
                        {data.title}
                    </div>
                    {
                        (data.close == null || data.close == true) &&
                        (
                            <div className="win-close flex-middle"
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        //关闭窗体
                                        if (!data.onCloseBtnClick || data.onCloseBtnClick() != false) {
                                            WindowManager.closeWindow(data.id);
                                        }
                                    }
                                }
                            >X
                            </div>
                        )
                    }
                </div>

                <div className="win-body">
                    {
                        data.body
                    }
                </div>

                {
                    (data.resize == null || data.resize == true) &&
                    (
                        <div>
                            <div ref={topRef} className="line-common win-top-line"></div>
                            <div ref={bottomRef} className="line-common win-bottom-line"></div>
                            <div ref={leftRef} className="line-common win-left-line"></div>
                            <div ref={rightRef} className="line-common win-right-line"></div>

                            <div ref={topleft} className="corner-common win-topleft-corner"></div>
                            <div ref={topright} className="corner-common win-topright-corner"></div>
                            <div ref={bottomleft} className="corner-common win-bottomleft-corner"></div>
                            <div ref={bottomright} className="corner-common win-bottomright-corner"></div>
                        </div>
                    )
                }
            </div>
        </>
    )
}