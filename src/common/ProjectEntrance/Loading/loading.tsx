import React from "react";

import './loading.css'

interface PropsType {
    loadingVisible: boolean
}

function Loading(props: PropsType) {
    if(!props.loadingVisible) {
        return null
    }

    return (
        <div className="loading-container">
            <div className="loading-circle"></div>
        </div>
    )
}

export default Loading