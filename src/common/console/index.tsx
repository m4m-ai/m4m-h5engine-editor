import React, { useEffect, useRef } from 'react'
import './index.css'
import {
    ApiOutlined,
    BugFilled,
    CaretDownOutlined,
    CheckCircleFilled,
    DatabaseFilled,
    ExclamationCircleFilled,
    FilterFilled,
    SearchOutlined,
    StopFilled,
    WarningFilled
} from '@ant-design/icons'
import {
    Avatar,
    Button,
    Checkbox,
    Divider,
    Dropdown,
    Input,
    List,
    Menu,
    MenuProps,
    message,
    Select,
    Space
} from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
const { Option } = Select

var data = [];
let bind = EditorEventMgr.Instance.addEventListener("OnConsoleLog", (arr) => {
    // console.log("log change");
    data = arr;
});

const handleMenuClick: MenuProps['onClick'] = e => {
    //console.log('click', e)
}
const onChange = (e: CheckboxChangeEvent) => {
    //console.log(`checked = ${e.target.checked}`)
}
const menu1 = (
    <Menu
        onClick={handleMenuClick}
        items={[
            {
                label: <Checkbox onChange={onChange}>Clear on Play</Checkbox>,
                key: '1'
            },
            {
                label: <Checkbox onChange={onChange}>Clear on Build</Checkbox>,
                key: '2'
            },
            {
                label: <Checkbox onChange={onChange}>Clear on Recompile</Checkbox>,
                key: '3'
            }
        ]}
    />
)
const menu2 = (
    <Menu
        items={[
            {
                label: <a>Collapse identical entries</a>,
                key: '0'
            }
        ]}
    />
)
const menu3 = (
    <Menu
        items={[
            {
                label: <a>Pause Play Mode on error</a>,
                key: '0'
            }
        ]}
    />
)
const menu4 = (
    <Menu
        items={[
            {
                label: <a>Target Selecttion:</a>,
                key: '0'
            }
        ]}
    />
)

// const data = [
//   {
//     title:
//       '[14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
//   },
//   {
//     title:
//       '[14:50:16] Assets/Script/ClientExcelData[226,8]:waming CS0219:The variable is assigned is never used'
//   },
//   {
//     title:
//       '[14:50:16] Assets/ScriptProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
//   },
//   {
//     title:
//       '[14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
//   },
//   {
//     title:
//       '[14:50:16] Assets/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
//   },
//   {
//     title:
//       '[14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
//   }
// ]

const onclick1 = e => {
    var aa: any = document.querySelectorAll('.iconbox')
    //console.log('nnnnnnnnnnnnnnnn', aa[1].style.backgroundColor)

    if (aa[0].style.backgroundColor == 'rgb(112, 112, 112)') {
        aa[0].style.backgroundColor = '#363636'
    } else {
        aa[0].style.backgroundColor = '#707070'
    }
   // console.log('按钮1', e.target)
}
const onclick2 = e => {
    var aa: any = document.querySelectorAll('.iconbox')
    if (aa[1].style.backgroundColor == 'rgb(112, 112, 112)') {
        aa[1].style.backgroundColor = '#363636'
    } else {
        aa[1].style.backgroundColor = '#707070'
    }
   // console.log('按钮2')
}
const onclick3 = e => {
    var aa: any = document.querySelectorAll('.iconbox')
    //console.log('nnnnnnnnnnnnnnnn', aa[1].style.backgroundColor)
    if (aa[2].style.backgroundColor == 'rgb(112, 112, 112)') {
        aa[2].style.backgroundColor = '#363636'
    } else {
        aa[2].style.backgroundColor = '#707070'
    }
    //console.log('按钮3')
}
const titclik1 = e => {
    var aa: any = document.querySelectorAll('.dd')
    if (aa[0].style.backgroundColor == 'rgb(112, 112, 112)') {
        aa[0].style.backgroundColor = '#363636'
    } else {
        aa[0].style.backgroundColor = '#707070'
    }
    //console.log('按钮1x', aa[0])
    e.preventDefault()
}
const titclik2 = e => {
    var aa: any = document.querySelectorAll('.dd')
    if (aa[1].style.backgroundColor == 'rgb(112, 112, 112)') {
        aa[1].style.backgroundColor = '#363636'
    } else {
        aa[1].style.backgroundColor = '#707070'
    }
    //console.log('按钮2x', aa[0], aa[1])
    e.preventDefault()
}
const titclik3 = e => {
    var aa: any = document.querySelectorAll('.dd')
    if (aa[2].style.backgroundColor == 'rgb(112, 112, 112)') {
        aa[2].style.backgroundColor = '#363636'
    } else {
        aa[2].style.backgroundColor = '#707070'
    }
    //console.log('按钮3x', aa[0], aa[1], aa[2])
    e.preventDefault()
}

// const dd =useRef()
const Console = () => (
    <div className="console-box">
        <div className="console-content1">
            <div className="console-content1-box1">
                <Dropdown.Button
                    // trigger={['click']}
                    overlay={menu1}
                    placement="bottom"
                    // onClick={titclik1}
                    icon={<CaretDownOutlined />}
                >
                    Clear
                </Dropdown.Button>

                <Dropdown
                    overlay={menu2}
                    // trigger={['click']}
                    className="collapse-title"
                    // onClick={titclik2}
                >
                    <a className="dd" onClick={e => titclik1(e)}>
                        <div>Collapse</div>
                    </a>
                </Dropdown>
                <Dropdown
                    overlay={menu3}
                    // trigger={['click']}
                    className="collapse-title2"
                >
                    <a className="dd" onClick={e => titclik2(e)}>
                        <div>Error Pause</div>
                    </a>
                </Dropdown>
                <Dropdown
                    overlay={menu4}
                    // trigger={['click']}
                    className="collapse-title3"
                >
                    <a className="dd" onClick={e => titclik3(e)}>
                        <div>
                            Editor&nbsp;
                            <CaretDownOutlined />
                        </div>
                    </a>
                </Dropdown>
            </div>
            <div className="console-content1-box2">
                <div>
                    <Input
                        className="console-input"
                        size="small"
                        placeholder=""
                        prefix={<SearchOutlined className="searchOutl" />}
                    />
                </div>
                <div className="console-icon">
                    {/* <Divider type="vertical" className="console-divider" /> */}
                    <div className="iconbox" onClick={onclick1}>
                        <ExclamationCircleFilled className="exclamationC" />
                    </div>
                    {/* <Divider type="vertical" className="console-divider" /> */}
                    <div className="iconbox" onClick={onclick2}>
                        <WarningFilled className="exclamationC" />
                    </div>
                    {/* <Divider type="vertical" className="console-divider" /> */}
                    <div className="iconbox" onClick={onclick3}>
                        <StopFilled className="exclamationC" />
                    </div>
                </div>
            </div>
        </div>
        <Divider />
        <div className="console-content2">
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={<WarningFilled className="warningF" />} />}
                            title={<a>{item.title}</a>}
                            // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />
        </div>
        <Divider />
        <div className="console-content3">
            <div className="console-content3-top">
                <a className="console-content3-top-font">
                    [14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming
                    CS0219:The variable is assigned is never used
                </a>
            </div>
        </div>
    </div>
)

export default Console
