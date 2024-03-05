import React, { useEffect, useRef, useState } from "react";
import { GPTRunner } from "../../gpt/gptrunner";
import { UIFixer } from "../../gpt/uifixer";
import { ChatBubble, Message } from "../scene/chat/ChatBubble";
import gptIcon from '../../assets/chatgpt.png'
import icon2 from '../../assets/历史.svg'
import icon3 from '../../assets/发送.svg'
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";
import { Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

let gptrunner = new GPTRunner();
let uifixer = new UIFixer();


export function Ai() {

    //输入框文本
    const [value, setValue] = useState("");
    //是否禁用发送按钮
    const [disable, setDisable] = useState(false);
    //历史数据
    const [historyList, setHistoryList] = React.useState<Message[]>(null);
    //历史数据背景面板
    const historyPanel = useRef<HTMLDivElement>();

    /**
        * 添加聊啥数据
        * @param text 聊天文本内容
        * @param isMine 是否是自己发的
        */
    function addMessage(text: string, isMine: boolean) {
        // let list = [...historyList, { text: text, isMine: isMine }];
        setHistoryList((list) => {
            let data = [...list, { text: text, isMine: isMine }];
            if (data.length > 100) {
                data.splice(0, 1);
            }
            localStorage.setItem("GPTHistoryList", JSON.stringify(data));
            return data;
        });
        if (historyPanel != null && historyPanel.current != null) {
            historyPanel.current.scrollTop = historyPanel.current.scrollHeight;
        }
    }

    /**
     * 修改消息数据
     * @param text 消息内容
     */
    function updateLastMessage(text: string) {
        setHistoryList((list) => {
            let newList = [...list];
            newList[list.length - 1].text = text;
            localStorage.setItem("GPTHistoryList", JSON.stringify(newList));
            return newList;
        });
    }

    useEffect(() => {
        if (!historyList) { //尝试读取历史记录
            let json = localStorage.getItem("GPTHistoryList");
            if (json != null) {
                setHistoryList((list) => {
                    return [...JSON.parse(json)];
                })
                return;
            } else {
                setHistoryList([]);
                return;
            }
        }

        uifixer.Init();
        let binder = EditorEventMgr.Instance.addEventListener("OnUiGPTMessage", (success, errorMessage) => {
            if (!success) {
                updateLastMessage(errorMessage);
            } else {
                updateLastMessage("执行完成！");
            }
            setDisable(false);
        })
        let binder2 = EditorEventMgr.Instance.addEventListener("OnGPTMessage", (success, errorMessage) => {
            if (!success) {
                updateLastMessage(errorMessage);
            } else {
                updateLastMessage("执行完成！");
            }
            setDisable(false);
        })

        if (historyPanel != null && historyPanel.current != null) {
            historyPanel.current.scrollTop = historyPanel.current.scrollHeight;
        }

        return () => {
            binder.removeListener();
            binder2.removeListener();
        }
    })

    //点击发送数据
    const btn_Send = async () => {
        if (disable) {
            return;
        }
        if (value == null || value == '') { //空数据
            return;
        }
        // let result = await uifixer.Wrap(value);
        // console.log("当前ui数据: \n" + result);
        // return;

        setDisable(true);
        addMessage(value, true);
        setValue("");
        gptrunner.Start(async (state) => {
            //await uifixer.OnGPTReplyUi(state);
            await uifixer.OnGPTReply(state);
        })
        try {
            //let message = await uifixer.WrapUi(value);
            let message = await uifixer.Wrap(value);
            console.log("发送数据: \n" + message);
            var succ = await gptrunner.Send(message);
            if (succ) {
                addMessage("思考中...", false);
            }
            else {
                setDisable(false);
                addMessage("消息发送失败！", false);
            }

            // addMessage("思考中...", false);

            // setTimeout(() => {
            //     EditorEventMgr.Instance.emitEvent("OnUiGPTMessage", cb => cb(true));
            // }, 5000);

        } catch (e) {
            setDisable(false);
            addMessage("消息发送失败！", false);
        }
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            bottom: "0px",
            position: "absolute",
            // alignItems: "center"  // 垂直居中
        }}>
            <div
                style={{
                    background: "#363636",
                    width: "100%",
                    height: "calc(100% - 30px)",
                    overflow: "auto",
                }}
                ref={historyPanel}
            >
                {
                    historyList && historyList.map((message, index) => {
                        return (
                            <ChatBubble key={index} message={message} />
                        )
                    })
                }
            </div>

            <div style={{ display: "flex", width: "100%", background: "#363636" }}>
                <Input
                    value={value}
                    onChange={(v) => setValue(v.target.value)}
                    style={{
                        height: "30px",
                        marginRight: "2px",
                        width: "calc(100% - 30px)",
                    }}></Input>
                <Button
                    disabled={disable}
                    icon={
                        !disable ?
                            (<img src={icon3} className='chatgpt-button-icon' alt='' />) :
                            (<LoadingOutlined />)
                    }
                    className='chatgpt-button' style={{ background: "#006CBE", borderColor: "#006CBE" }}
                    onClick={async () => {
                        btn_Send();
                        //var succ = await gptrunner.Send(uifixer.Wrap(value));
                    }}></Button>
            </div>
        </div>)
}