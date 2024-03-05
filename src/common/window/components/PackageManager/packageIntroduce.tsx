import React from "react";
import { Link } from "react-router-dom";
import style from './packageIntroduce.module.scss'

interface PropsType {
    packageName?: string,
    developer?: string,
    version?: string,
    date?: any,
    platform?: string,
    website?: string,
    introContent?: string
}

export function PackageIntroduce(props: PropsType) {
    const {
        packageName = 'Version Control',
        developer = 'Unity Technologies',
        version = '1.17.7',
        date = 'November 10, 2022',
        platform = 'Unity',
        website = 'com.unity.collab-proxy',
        introContent = '13123124124'

    } = props

    return (
        <div className={style['package-intro']}>
            <div className="header">
                <div className="title">
                    <span>{ packageName }</span>
                    <span className="title-status">Release</span>
                </div>
                <div className="bottom-gap">{ developer }</div>
                <div className="bottom-gap"><span className="rows-header">Version</span> { version } - { date }</div>
                <div className="bottom-gap"><span className="rows-header">Registry</span> { platform }</div>
                <div className="bottom-gap website">{ website }</div>
                <div className="view-module">
                    <Link to=''>View documentation</Link>
                    <span className="dot-gap">·</span>
                    <Link to=''>View changelog</Link>
                    <span className="dot-gap">·</span>
                    <Link to=''>View licenses</Link>
                </div>
            </div>

            <div className='textarea-box'>
                {introContent}
            </div>
        </div>
    )
}