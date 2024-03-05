import React from "react";
import style from './collapseM4M.module.scss'

import { Collapse } from 'antd';

const { Panel } = Collapse;

interface collapsePropsType {
    collapseData: collapseItem[]
}

interface collapseItem {
    header: string,
    key: string | number,
    content: any
}

export function CollapseM4M(props: collapsePropsType) {
    return (
        <div className={style.collapse}>
            <Collapse>
            
                {
                    props.collapseData.map(item => {
                        return (
                            <Panel header={item.header} key={item.key}>
                                {
                                    item.content
                                }
                            </Panel>
                        )
                    })
                }
            </Collapse>
        </div>
    )
}