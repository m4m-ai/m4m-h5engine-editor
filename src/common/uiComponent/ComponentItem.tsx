import {EditorInputMgr} from "../../Game/Input/EditorInputMgr";
import React, {memo, useEffect, useMemo} from "react";
import {EditorApplication} from "../../Game/EditorApplication";

export interface IComponentItemData {
    //显示文本
    text: string;
    //控件类型
    type: m4m.framework.Primitive2DType;
    //onDrag(touch: TouchPosition): void;
}

export const ComponentItem = memo((data: IComponentItemData) => {
    
    let binder: any;
    let binder2: any;
    
    useEffect(() => {
        return () => {
            if (binder != null) {
                binder.removeListener();
            }
            if (binder2 != null) {
                binder2.removeListener();
            }
        }
    })
    
    return (
        <div data-id="0" className="ui-component" ref={e => {
            if (e != null) {
                binder = EditorInputMgr.Instance.addElementEventListener(e, "TouchDrag", (touch, state) => {
                    //结束
                    if (state == 2) {
                        //在Scene内
                        if (EditorInputMgr.Instance.isTouchInScene()) {
                            //创建元素
                            EditorApplication.Instance.editorScene.createUiElement(data.type);
                        }
                    }
                });
            }
        }}>{data.text}</div>
    );
});