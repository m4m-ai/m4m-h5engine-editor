import React, { useEffect, useState } from "react"; 
import style from './progressLoading.module.scss'

interface PropsType {
    setRefresh(setProgress: (progress: number) => void, setInfoList: (infoList: []) => void): void;
    progressNum: number,
    infoList: string[]
}

export function ProgressLoading(props: PropsType) {

    const [progressNum, setProgress] = useState(props.progressNum);
    const [infoList, setInfoList] = useState(props.infoList);

    useEffect(() => {
        props.setRefresh(
            (num) => {
                setProgress(num)
            },
            (infoArr) => {
                setInfoList(infoArr)
            }
        );
        setProgress(props.progressNum);
        setInfoList(props.infoList)
    }, [props]);

    return (
        <div className={style.progressLoading}>
            {/* 进度条 */}
            <div className="progress-box">
                <div className="progress-bar" style={{width: `${progressNum}%`}}></div>
            </div>
            {/* 显示信息 */}
            <div className="progress-info">
                {
                    infoList.map((item, index) => {
                        return (
                            <div key={index} style={{margin: '4px 0'}}>
                                {item}
                            </div>
                        )
                    })
                }
                <div>固定显示信息</div>
            </div>
        </div>
    )
}