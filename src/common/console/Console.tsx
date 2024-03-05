import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { CaretDownOutlined, ExclamationCircleFilled, SearchOutlined, StopFilled, WarningFilled } from '@ant-design/icons'
import { Avatar, Checkbox, Divider, Dropdown, Input, List, Menu, MenuProps, } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
import { ConsoleData, consoleMgr, ConsoleType } from '../../Game/Panel/consoleMgr'


const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e)
}
const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`)
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

export function Console() {
  //组件面板是否打开
  const [data, setData] = useState(null as (ConsoleData[]));
  const [TitdeDase, setTide] = useState(null as string);

  // var Consdata = consoleMgr.Consdata;
  var Consdata = consoleMgr.ShowConsoleData;
  var logCount = consoleMgr.logCount;
  var warnCount = consoleMgr.warnCount;
  var errorCount = consoleMgr.errorCount;

  //引用: 添加组件面板 
  const element = useRef(null);
  const consoleCount = useRef(null);
  const TitleDdase = useRef(null);
  useEffect(() => {
    const newLocal = (item: ConsoleData): void => {
      var setStart = []
      for (const iterator of Consdata) {
        setStart.push(iterator)
      }
      setData(setStart)
    }
    let binder1 = EditorEventMgr.Instance.addEventListener("ConsoleMonitor", newLocal);
    return () => {
      // console.error("卸载Inspector...");
      binder1.removeListener();
    }
  });

  const onclick1 = e => {
    var aa: any = document.querySelectorAll('.iconbox')
    var v: boolean;
    if (aa[0].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[0].style.backgroundColor = '#363636'
      v = true;
      consoleMgr.logbool = true;
    } else {
      aa[0].style.backgroundColor = '#707070'
      v = false;
      consoleMgr.logbool = false;
    }
    console.log('按钮1', e.target);
    ClassNameitemColor();
    consoleMgr.ShowLOG(ConsoleType.Log, v);
    setTimeout(() => {
      setData(Consdata);
    }, 50);
  }

  const onclick2 = e => {
    var aa: any = document.querySelectorAll('.iconbox')
    var v: boolean;
    if (aa[1].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[1].style.backgroundColor = '#363636'
      v = true;
      consoleMgr.warnbool = true;
    } else {
      aa[1].style.backgroundColor = '#707070'
      v = false;
      consoleMgr.warnbool = false;
    }
    console.log('按钮2')
    ClassNameitemColor();
    consoleMgr.ShowLOG(ConsoleType.Warn, v);
    setTimeout(() => {
      setData(Consdata);
    }, 50);
  }

  const onclick3 = e => {
    var aa: any = document.querySelectorAll('.iconbox')
    var v: boolean;
    if (aa[2].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[2].style.backgroundColor = '#363636'
      v = true;
      consoleMgr.errorbool = true;
    } else {
      aa[2].style.backgroundColor = '#707070'
      v = false;
      consoleMgr.errorbool = false;
    }
    console.log('按钮3')
    ClassNameitemColor();
    consoleMgr.ShowLOG(ConsoleType.Error, v);
    setTimeout(() => {
      setData(Consdata);
    }, 50);
  }

  const titclik1 = e => {
    var aa: any = document.querySelectorAll('.dd')
    if (aa[0].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[0].style.backgroundColor = '#363636'
    } else {
      aa[0].style.backgroundColor = '#707070'
    }
    console.log('按钮1x', aa[0])
    e.preventDefault()
  }

  const titclik2 = e => {
    var aa: any = document.querySelectorAll('.dd')
    if (aa[1].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[1].style.backgroundColor = '#363636'
    } else {
      aa[1].style.backgroundColor = '#707070'
    }
    console.log('按钮2x', aa[0], aa[1])
    e.preventDefault()
  }

  const titclik3 = e => {
    var aa: any = document.querySelectorAll('.dd')
    if (aa[2].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[2].style.backgroundColor = '#363636'
    } else {
      aa[2].style.backgroundColor = '#707070'
    }
    console.log('按钮3x', aa[0], aa[1], aa[2])
    e.preventDefault()
  }

  const ClearButton = e => {
    consoleMgr.Consdata.length = 0;
    Consdata.length = 0;
    consoleMgr.logCount = 0;
    consoleMgr.warnCount = 0;
    consoleMgr.errorCount = 0;
    setTimeout(() => {
      setData(Consdata);
    }, 50);
    setTide(null);
  }


  const onCounsole = (item, index) => {
    var counsol: any = ClassNameitemColor()
    counsol[index].style.backgroundColor = '#2e6fda';
    let title = item.title;
    setTide(title);
    consoleMgr.indexCoun = index;
  }

  return (
    <div className="console-box">
      <div className="console-content1">
        <div className="console-content1-box1">
          <Dropdown.Button

            // trigger={['click']}
            overlay={menu1}
            placement="bottom"
            onClick={e => ClearButton(e)}
            icon={<CaretDownOutlined />}
          >
            Clear
          </Dropdown.Button>

          <Dropdown
            overlay={menu2}
            className="collapse-title"
          >
            <a className="dd" onClick={e => titclik1(e)}>
              <div>Collapse</div>
            </a>
          </Dropdown>
          <Dropdown
            overlay={menu3}
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
          <div className="console-icon" ref={consoleCount}>
            <div className="iconbox" onClick={onclick1}>
              <ExclamationCircleFilled className="exclamationC" />
              <a className="Asize">{logCount}</a>
            </div>
            <div className="iconbox" onClick={onclick2}>
              <WarningFilled className="warningF" />
              <a className="Asize">{warnCount}</a>
            </div>
            <div className="iconbox" onClick={onclick3}>
              <StopFilled className="StopF" />
              <a className="Asize">{errorCount}</a>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="console-content2" ref={element}>
        <List
          itemLayout="horizontal"
          dataSource={data == null && Consdata || data != null && data}
          renderItem={(item, index) => (
            <List.Item onClick={e => onCounsole(item, index)}>
              {item.visible &&
                <List.Item.Meta
                  avatar={item.calssName == "StopFilled" && <Avatar src={<StopFilled className={item.ConsoelLogIcon == "StopF" && item.ConsoelLogIcon} />} />
                    || item.calssName == "WarningFilled" && <Avatar src={<WarningFilled className={item.ConsoelLogIcon == "WarningF" && item.ConsoelLogIcon} />} />
                    || item.calssName == "ExclamationCircleFilled" && <Avatar src={<ExclamationCircleFilled className={item.ConsoelLogIcon == "exclamationC" && item.ConsoelLogIcon} />} />}
                  title={<a>{item.title}</a>}
                  description={<a>{item.desc}</a>}
                />}
            </List.Item>
          )}
        />
      </div>
      <Divider />
      <div className="console-content3">
        <div className="console-content3-top" ref={TitleDdase}>
          <p className="console-content3-top-font">{TitdeDase}</p>
        </div>
      </div>
    </div>
  )
}
function ClassNameitemColor() {
  var counsol: any = document.getElementsByClassName("ant-list-item")
  if (counsol && consoleMgr.indexCoun != null) {
    if (counsol[consoleMgr.indexCoun]) {
      counsol[consoleMgr.indexCoun].style.backgroundColor = '#363636';
    }
  }
  return counsol
}
function SearchLog(titile): ConsoleData[] {
  let data = [];
  for (const iterator of consoleMgr.Consdata) {
    if (iterator.title.indexOf(titile) != -1) {
      data.push(iterator);
    }
  }
  return data;
}
