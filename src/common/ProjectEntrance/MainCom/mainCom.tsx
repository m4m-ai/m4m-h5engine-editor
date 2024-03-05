import React from "react"

import style from './mainCom.module.scss'

export default function Main(props) {
    return (
        <div className={style.mainCom}>
            <props.renderCom></props.renderCom>
        </div>
    )
}