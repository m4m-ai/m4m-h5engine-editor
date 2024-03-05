import React from 'react';
import { Card, Avatar } from 'antd';
import './ChatBubble.css';
import gptIcon from '../../../assets/chatgpt.png'
import userIcon from '../../../assets/flagr4.png'

export interface Message {
    text: string;
    isMine: boolean;
}

export interface Props {
    message: Message;
}

export function ChatBubble({ message }: { message: Message }) {
    const { text, isMine } = message;

    return (
        <div className={isMine ? 'chat-bubble mine' : 'chat-bubble'}>
            {
                isMine ?
                (
                    <img src={userIcon} style={{ width: "52px", height: "32px", paddingLeft: "10px", paddingRight: "10px", display: "block", float: "left" }} alt=''></img>
                ) :
                (
                    <img src={gptIcon} style={{ width: "52px", height: "32px", paddingLeft: "10px", paddingRight: "10px", display: "block", float: "left" }} alt=''></img>
                )
            }
            
            <Card bodyStyle={isMine ? { background: '#DCF8C6' } : { background: '#FFFFFF' }} style={{ wordWrap: "break-word", maxWidth: "calc(100% - 52px - 52px)", background: "unset", border: "unset" }}>
                {text}
            </Card>
        </div>
    );
};