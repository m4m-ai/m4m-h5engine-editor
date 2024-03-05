import React, { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'
import { CaretDownOutlined, ExclamationCircleFilled, SearchOutlined, StopFilled, WarningFilled } from '@ant-design/icons'
import { Avatar, Checkbox, Divider, Dropdown, Input, List, Menu, MenuProps, } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
import { ConsoleData, consoleMgr, ConsoleType } from '../../Game/Panel/consoleMgr'
import { use } from 'echarts/core'


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

export function Console() {
  // var Consdata = consoleMgr.Consdata;
  var Consdata = consoleMgr.ShowConsoleData;
  var logCount = consoleMgr.logCount;
  var warnCount = consoleMgr.warnCount;
  var errorCount = consoleMgr.errorCount;

  const itemSize = 45; // 每个 li 的高度, li 修改这里一定要改，不然会出现抖动问题
  //组件面板是否打开
  const [data, setData] = useState(null as (ConsoleData[]));
  const [TitdeDase, setTide] = useState(null as string);
  const [collapseStatus, setCollapseStatus] = useState(false)
  const [selectedId, setSelectedId] = useState(-1)

  // 虚拟列表
  const [screenHeight, setScreenHeight] = useState(0) //可视区域高度
  const [listHeight, setListHeight] = useState(0) //列表总高度
  const [startIndex, setStartIndex] = useState(0)
  const [startOffset, setStartOffset] = useState(0)
  const visibleCount = useMemo(() => Math.ceil(screenHeight / itemSize), [screenHeight]) //可显示的列表项数
  const endIndex = useMemo(() => startIndex + visibleCount, [startIndex, visibleCount])
  const visibleData = useMemo(() => data?.slice(startIndex, Math.min(endIndex, data.length)), [data, startIndex, endIndex])
  const getTransform = useMemo(() => `translate3d(0,${startOffset}px,0)`, [startOffset])

  //引用: 添加组件面板 
  const element = useRef<HTMLDivElement>(null);
  const consoleCount = useRef(null);
  const TitleDdase = useRef(null);

  useEffect(() => {
    const scrollFn = () => {
      const scrollTop = element.current.scrollTop
      setStartIndex(Math.floor(scrollTop / itemSize))
      setStartOffset(scrollTop - (scrollTop % itemSize))
    }
    if (element) {
      element.current.addEventListener('scroll', scrollFn)
    }
    return () => {
      element.current.removeEventListener('scroll', scrollFn)
    }
  }, [])

  useEffect(() => {
    if (element) {
      setScreenHeight(element.current.offsetHeight)
    }
    const newLocal = (item: ConsoleData): void => {
      let uuid = 0
      var setStart = []
      if (!collapseStatus) {
        for (const iterator of Consdata) {
          iterator.uuid = uuid++
          setStart.push(iterator)
        }
      } else {
        let setByTitle = {}
        for (const iterator of Consdata) {
          const { title } = iterator
          if (!setByTitle[title]) {
            setByTitle[title] = iterator
            setByTitle[title].sum = 1
          } else {
            setByTitle[title].sum++
          }
        }
        for (const key in setByTitle) {
          setByTitle[key].uuid = uuid++
          setStart.push(setByTitle[key])
        }
      }
      setListHeight(setStart.length * itemSize)
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
    //console.log('按钮1', e.target);
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
    //console.log('按钮2')
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
    //console.log('按钮3')
    ClassNameitemColor();
    consoleMgr.ShowLOG(ConsoleType.Error, v);
    setTimeout(() => {
      setData(Consdata);
    }, 50);
  }

  const titclik1 = e => {
    setCollapseStatus(!collapseStatus)
    var aa: any = document.querySelectorAll('.dd')
    if (aa[0].style.backgroundColor == 'rgb(112, 112, 112)') {
      aa[0].style.backgroundColor = '#363636'
    } else {
      aa[0].style.backgroundColor = '#707070'
    }
    console.dir('按钮1x', aa)
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
    setSelectedId(item.uuid)
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
        <div style={{ height: listHeight }} className="infinite-list-phantom"></div>)
        <List
          style={{ transform: getTransform }}
          className='infinite-list'
          itemLayout="horizontal"
          // dataSource={data == null && Consdata || data != null && data}
          dataSource={visibleData}
          renderItem={(item, index) => (
            <List.Item
              style={{ background: item.uuid === selectedId ? '#2e6fda' : '' }}
              actions={collapseStatus ? [<span style={{ background: '#5f5f5f', padding: '2px 6px', borderRadius: 20, color: '#fff' }}>{item.sum}</span>] : [<></>]}
              onClick={e => onCounsole(item, index)}>
              {item.visible &&
                <List.Item.Meta
                  avatar={item.calssName == "StopFilled" && <Avatar src={<StopFilled className={item.ConsoelLogIcon == "StopF" && item.ConsoelLogIcon} />} />
                    || item.calssName == "WarningFilled" && <Avatar src={<WarningFilled className={item.ConsoelLogIcon == "WarningF" && item.ConsoelLogIcon} />} />
                    || item.calssName == "ExclamationCircleFilled" && <Avatar src={<ExclamationCircleFilled className={item.ConsoelLogIcon == "exclamationC" && item.ConsoelLogIcon} />} />}
                  title={(
                    <a>{item.title}</a>
                  )}
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
