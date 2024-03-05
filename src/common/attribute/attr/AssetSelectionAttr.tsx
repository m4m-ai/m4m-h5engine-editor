import React, {CSSProperties, Ref, useEffect, useRef, useState} from "react";
import IAsset = m4m.framework.IAsset;
import {AssetReference} from "../../../Game/Asset/AssetReference";
import {EditorEventMgr} from "../../../Game/Event/EditorEventMgr";
import {EditorInputMgr} from "../../../Game/Input/EditorInputMgr";
import {FileDialog} from "../../inspector/components/attribute/FileDialog";
import {IAttrComponent} from "../Attribute";
import { WindowManager } from "../../window/WindowManager";

export interface AssetData {
    name: string,
    key: string,
    /**
     * 资源类型, 例如: ["png", "jpg"], 为 null 表示所有类型
     */
    assetType?: string[],
}


const activeStyle: CSSProperties = {
    width: "100%",
    border: "1px solid #40A9FF",
    borderRadius: "2px",
};
const normalStyle: CSSProperties = {
    width: "100%",
    borderRadius: "2px",
};

/**
 * 资源选择器
 */
export function AssetSelectionAttr(data: IAttrComponent<AssetData>) {
    const [style, setStyle] = useState(normalStyle);
    const element = useRef<HTMLDivElement>(null);
    const [asset, setAsset] = useState(data.attrValue);

    useEffect(() => {
        data.setRefresh((ass) => {
            setAsset(ass);
        });
        setAsset(data.attrValue);

        let binder2;

        let binder = EditorEventMgr.Instance.addEventListener("OnDragAsset", (assetInfo, reference, state) => {
            if (assetInfo.isLeaf && (data.attrValue && data.attrValue.assetType == null || data.attrValue.assetType.includes(assetInfo.FileType))) {
                if (state == 0) { //开始拖拽
                    setStyle(activeStyle);
                    if (element) {
                        if (binder2) {
                            binder2.removeListener();
                            binder2 = null;
                        }
                        binder2 = EditorInputMgr.Instance.addElementEventListener(element.current, "TouchUp", () => {
                            let ref: AssetData = {
                                name: assetInfo.value,
                                key: reference.key,
                                assetType: data?.attrValue?.assetType
                            };
                            //调用赋值操作
                            data.onChange(ref);
                            setAsset(ref);
                        });
                    }
                } else if (state == 1) { //停止拖拽
                    setStyle(normalStyle);
                    if (binder2) {
                        binder2.removeListener();
                        binder2 = null;
                    }
                }
            }
        });

        return () => {
            if (binder2) {
                binder2.removeListener();
            }
            binder.removeListener();
        }
    }, [data])


    const assetsList = [
        {
            icon: '',
            name: 'a-one'
        },
        {
            icon: '',
            name: 'a-two'
        },
        {
            icon: '',
            name: 'a-three'
        },
        {
            icon: '',
            name: 'a-three'
        },
        {
            icon: '',
            name: 'a-three'
        },
        {
            icon: '',
            name: 'a-three'
        },
        {
            icon: '',
            name: 'a-three'
        },
        {
            icon: '',
            name: 'a-three'
        }
    ]

    const sceneList = [
        {
            icon: '',
            name: 's-one'
        },
        {
            icon: '',
            name: 's-two'
        },
        {
            icon: '',
            name: 's-three'
        }
    ]

    function toggleDialogStatus (){
        WindowManager.createWindow({
            body: (
                (
                    <>
                        <FileDialog assetsList={assetsList} sceneList={sceneList}></FileDialog>
                    </>
                )
            ),
            width: 500,
            height: 400,
            minWidth: 300,
            minHeight: 50,
            title: "select Material",
        })
    }

    return (
        <div className="file-select-box" ref={element} style={style}>
            <span className="file-select-content">{ asset ? asset.name : "" }</span>
            <div className="file-select-btn flex-middle" onClick={toggleDialogStatus}>
                <div className="file-select-btn-cir flex-middle" >
                    <div className="file-select-btn-center"></div>
                </div>
            </div>
            {/*<BuildDialog visible={isShow} assetsList={assetsList} sceneList={sceneList} handleClose={setIsShow} ></BuildDialog>*/}
        </div>
    )
}