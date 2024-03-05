import React from "react";
import { Link } from "react-router-dom";
import style from './communityWindow.module.scss'

export default function CommunityWindow() {
    return (
        <div className={style.community}>
            <div className="main-header">
                <div className="main-title">社区 
                <span className="title-version">Beta</span>
                </div>
            </div>

            <div className="main-content">
               <div className="community-content">
                    {
                        (new Array(10).fill('')).map((item, index) => {
                            return (
                                <div className="community-item" key={index}>
                                    <div className="item-pic"></div>
                                    <div className="item-info">
                                        <div>Unite Now</div>
                                        <div>通过啥啥啥啥啥啥通过啥啥啥啥啥啥通过啥啥啥啥啥啥通过啥啥啥啥啥啥通过啥啥啥啥啥啥通过啥啥啥啥啥啥</div>
                                        <div><Link to={''}><span className="a-pic"></span><span>unity.com/unite</span></Link></div>
                                    </div>
                                </div>
                            )
                        })
                    }
               </div>
            </div>
        </div>
    )
}