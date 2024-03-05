import React, { useEffect, useRef, useState } from "react";
import { CaretRightOutlined, FileImageOutlined, FileImageTwoTone } from "@ant-design/icons";
import { Collapse, Image } from "antd";
import { EditorApplication } from "../../../Game/EditorApplication";
import { EditorAssetInfo } from "../../../Game/Asset/EditorAssetInfo";
import { EditorInputMgr } from "../../../Game/Input/EditorInputMgr";
import { AttributeManager } from "../../attribute/AttributeManager";

export interface IInspertorPreviewData {
    /** 文件的meta描述 */
    assetInfo: EditorAssetInfo;
}

enum PreviewType {
    none,
    image,
    text,
    model,
    scene,
    prefab
}
// 预览高度
let prevHeight: number = 640;

/**
 * 预览文件
 */
export function InspertorPreview(data: IInspertorPreviewData) {
    //console.log("data: ", data)
    let [prevH, setPrevH] = useState(prevHeight)

    //文件类型
    let fileType: string = data.assetInfo.FileType?.toLowerCase();
    //文件名称
    let fileName: string = data.assetInfo.value;
    
    //meta文件
    let meta = data.assetInfo.meta ? JSON.parse(data.assetInfo.meta) : data.assetInfo;
    //
    let showType = PreviewType.none;

    if (fileType == "png" || fileType == "jpg") {
        showType = PreviewType.image;
    } else if (fileType == "ts" || fileType == "txt" || fileType == "js" || fileType == "json" || fileType == "ini") {
        showType = PreviewType.text;
    }

    const border2node = useRef<HTMLDivElement>()

    useEffect(() => {
        if (showType != PreviewType.none) {
            let binder1 = EditorInputMgr.Instance.addElementEventListener(border2node.current, 'TouchDown', (touch) => {
                let target = touch
                let binder2 = EditorInputMgr.Instance.addElementEventListener(document.documentElement, 'TouchMove', (touch) => {
                    setPrevH(touch.offsetY - 96 - target.offsetY)
                })
                let bidner3 = EditorInputMgr.Instance.addElementEventListener(document.documentElement, 'TouchUp', () => {
                    binder2.removeListener();
                    bidner3.removeListener();
                })
            })
            return () => {
                binder1.removeListener();
            }
        }
    }, [data, showType])

    return (
        <>
            {/*头部*/}
            <div className="inspector-preview-head">
                <FileImageOutlined style={{ fontSize: "40px", color: "#BCBCBC" }} />
                <div style={{ marginLeft: "10px", color: "#BCBCBC" }}>{fileName}</div>
            </div>

            {/*属性列表*/}
            <div className="inspector-preview-body">
                {
                    Object.keys(data.assetInfo).map((key) => {
                        let value = data.assetInfo[key];

                        return (
                            <div className="inspector-preview-body-row" key={key}>
                                <div >{key}</div>
                                <div >{value + ""}</div>
                                {/* {
                                    AttributeManager.getAttributeList([
                                        {
                                            title: key,
                                            type: 'string',
                                            attr: {
                                                value: value,
                                                onChange() { },
                                                setRefresh() { }
                                            }
                                        }
                                    ])
                                } */}
                            </div>
                        );
                    })
                }
            </div>

            {/*右下角预览框*/}
            {
                showType != PreviewType.none &&
                (
                    <div className="inspector-preview-window" style={{ height: `calc(100% - ${prevH}px)`, maxHeight: 'calc(100% - 55px)' }}>
                        <div ref={border2node}
                            style={{
                                width: '100%',
                                height: '5px',
                                position: 'static',
                                zIndex: '98',
                                top: '627px',
                                backgroundColor: 'rgb(0, 0, 0)'
                            }}></div>
                        <div className="inspector-preview-widow-head">
                            <div>{fileName}</div>
                        </div>
                        <div className="inspector-preview-window-body">
                            <InspectorPreviewWindow assetInfo={data.assetInfo} type={showType}></InspectorPreviewWindow>
                        </div>
                    </div>
                )
            }
        </>
    )
}

function InspectorPreviewWindow(data: IInspertorPreviewData & { type: PreviewType }) {

    if (data.type == PreviewType.text) {
        return (
            <textarea ref={
                (e) => {
                    if (e) {
                        EditorApplication.Instance.editorResources.loadFile(data.assetInfo.relativePath, "buffer", (result) => {
                            e.textContent = m4m.io.converter.ArrayToString(new Uint8Array(result as ArrayBuffer));
                        });
                    }
                }
            } style={{ backgroundColor: "#363636", width: "100%", height: "calc(100% - 20px)", resize: "none", border: "none" }}
                disabled={true}></textarea>
        )
    } else if (data.type == PreviewType.image) {
        return (
            <Image style={{ objectFit: "contain", height: '100%' }} preview={false} src={EditorApplication.Instance.serverResourcesUrl + data.assetInfo.relativePath}></Image>
        )
    }
}