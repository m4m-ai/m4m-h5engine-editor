import React, { useEffect, useRef, useState } from 'react'
import { Timeline, TimelineAction, TimelineRow, TimelineState } from '@xzdarcy/react-timeline-editor';
import './index.css';
import { TimelineSide } from './components/timelineSide';
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr';
import { IComponentInfo } from '../../Game/Component/EditorComponentMgr';
import { Button } from 'antd';
import { IAttributeData } from '../attribute/Attribute';

// 动画继承
export interface CustomTimelineAction extends TimelineAction {
  data: {
    val: string
  };
}

// 轨道数据类型
export interface TimelineType extends TimelineRow {
  title?: string
  key?: string
  actions: CustomTimelineAction[]
}

// 外部导入的数据类型
interface outDataType extends IAttributeData {
  key?: string
}

// 导入导出的数据类型
interface exportDataType {
  name: string;
  ticks: tickDatas[];
  timeLength: number;
}

interface tickDatas {
  value: string;
  start: number;
  end: number;
}

// 轨道数据
let exportD: exportDataType[] = []


/**
 * 外部创建轨道
 */
export const createTrack = (data:TimelineType) => {
  EditorEventMgr.Instance.emitEvent('OnOutAnimationData', cb => cb(data))
}


export const TimelineEditor = (datas: { datas: IComponentInfo[] }) => {

  const [data, setData] = useState<TimelineType[]>([])

  const idRef = useRef(10000)
  const timelineState = useRef<TimelineState>();
  const autoScrollWhenPlay = useRef<boolean>(true);
  // 菜单
  const menu = useRef<HTMLDivElement>(null)
  // 右键属性
  const [menuProps, setMenuProps] = useState<{ action?: TimelineAction, row?: TimelineRow, time?: number }>({})

  // cursor时间记录
  const [cursorTime, setCursorTime] = useState<number>(0);

  // 外部调用传入的数据
  const [outData, setOutData] = useState<outDataType>()

  const [scaleWidth, setScaleWidth] = useState(160)

  const [effects, setEffects] = useState({
    effect0: {
      id: "video",
      name: "play video",
      source: {
        // start: ({ action, engine, isPlaying, time }) => {
        //   if (isPlaying) {
        //     const val = (action as CustomTimelineAction).data.val
        //     console.log(val);
        //   }
        // },
        // enter: ({ action, engine, isPlaying, time }) => {
        //   if (isPlaying) {
        //     const val = (action as CustomTimelineAction).data.val
        //     console.log(val);
        //   }
        // },
        update: ({ action, time }) => {
          if (time) {
            const val = (action as CustomTimelineAction).data.val
            //console.log(val, time);
          }
        },
        // leave: ({ action, engine }) => {
        //   const val = (action as CustomTimelineAction).data.val
        //   console.log(val);
        // },
        // stop: ({ action, engine }) => {
        //   const val = (action as CustomTimelineAction).data.val
        //   console.log(val);
        // },
      },
    },
  })

  const CustomScale = (props: { scale: number }) => {
    const { scale } = props;
    const min = parseInt(scale / 60 + '');
    const second = (scale % 60 + '').padStart(2, '0');
    return <>{`${min}:${second}`}</>
  }

  // 接受数据
  useEffect(() => {
    // 隐藏菜单
    document.addEventListener('click', () => {
      if (menu && menu.current) {
        menu.current.style.opacity = '0';
        menu.current.style.display = 'none';
      }
    })

    let binder1 = EditorEventMgr.Instance.addEventListener('OnAnimationDatas', (datas) => {
      setData([...datas])
    })

    let binder2 = EditorEventMgr.Instance.addEventListener('OnOutAnimationData', (data) => {
      setOutData({ ...data })
    })
    return () => {
      binder1.removeListener()
      binder2.removeListener()
    }
  }, [])

  useEffect(() => {

    let arr = data.map(item => {
      return { ...item, actions: [...item.actions] }
    })

    let index = data.findIndex(item => item.title == outData.title);
    if (index != -1) {
      if (!arr[index].actions.some((item) => item.start == cursorTime)) {
        arr[index].actions.push({
          id: `action${idRef.current++}`,
          start: cursorTime,
          end: cursorTime + 0.5,
          effectId: "effect0",
          data: {
            val: outData.attr.value
          }
        })
      }
    }
    else {
      if (outData && outData.title) {

        arr.push({
          id: outData.title,
          key: outData.title,
          title: outData.title,
          actions: [
            {
              id: `action${idRef.current++}`,
              start: cursorTime,
              end: cursorTime + 0.5,
              effectId: 'effect0',
              data: {
                val: outData.attr.value
              }
            }
          ],
        })
      }
    }

    setData(() => {
      return arr.map((item) => {
        return { ...item, actions: [...item.actions] }
      })
    })

  }, [outData])

  // 双击添加key
  const dbAddTrack = (row: TimelineRow, time: number) => {

    setData((pre) => {
      const rowIndex = pre.findIndex(item => item.id === row.id);
      const newAction: CustomTimelineAction = {
        id: `action${idRef.current++}`,
        start: time,
        end: time + 0.5,
        effectId: "effect0",
        data: {
          val: `val${idRef.current++}`
        }
      }
      pre[rowIndex] = { ...row, actions: row.actions.concat(newAction) as CustomTimelineAction[] };
      return [...pre];
    })
  }

  // 删除key
  const delTrack = (action: TimelineAction, row: TimelineRow, time: number) => {
    setData((pre) => {
      const rowIndex = pre.findIndex(item => item.id === row.id);
      const actionIndex = pre[rowIndex].actions.findIndex(item => item.id == action.id)

      row.actions.splice(actionIndex, 1)

      return [...pre]
    })

  }

  // 右击菜单
  const menuOption = {
    menuId: '3',
    items: [
      {
        key: 'add',
        name: 'Add Action',
        handler: (props) => {
          if (!props.action) {
            dbAddTrack(props.row, props.time)
          }
        }
      },
      {
        key: 'del',
        name: 'Del Action',
        handler: (props) => {
          if (props.action) {
            delTrack(props.action, props.row, props.time)
          }
        }
      }
    ]
  }

  // 展示菜单
  const showMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>, props) => {
    setMenuProps(props)
    e.preventDefault();
    e.stopPropagation();
    menu.current.style.opacity = '1'
    menu.current.style.display = 'block'
    menu.current.style.left = e.clientX + 'px';
    menu.current.style.top = e.clientY + 'px';
  }

  // 点击导出数据
  const exportDatas = () => {
    exportD = data.map((item) => {
      let timeLength: number = item.actions[0].end;
      item.actions.forEach((tick) => {
        if (tick.end > timeLength) {
          timeLength = tick.end
        }
      })
      return {
        name: item.key,
        ticks: item.actions.map((tick) => {
          return {
            value: tick.data.val,
            start: tick.start,
            end: tick.end
          }
        }),
        timeLength: timeLength
      }
    })

    console.log(exportD);

  }

  const restoreDatas = () => {

    setData(() => {
      return exportD.map((item) => {
        // 标题
        let title = item.name.split('/')[1].slice(0, 1).toUpperCase() + item.name.split('/')[1].slice(1);
        return {
          id: item.name,
          key: item.name,
          title: title,
          actions: item.ticks.map((tick: { start: any; end: any; value: any; }) => {
            return {
              id: `action${idRef.current++}`,
              start: tick.start,
              end: tick.end,
              effectId: 'effect0',
              data: {
                val: tick.value
              }
            }
          })
        }
      })
    })

  }

  return (
    <div className="timeline-editor-engine">
      <TimelineSide datas={[...data]} timelineState={timelineState} trackdatas={[...datas.datas]}></TimelineSide>

      <div style={{ width: '100%', height: '100%' }} onWheel={(e) => {
        if (scaleWidth > 10) {
          if (e.deltaY > 0) {
            setScaleWidth((scaleWidth) => scaleWidth - 2)
          } else {
            setScaleWidth((scaleWidth) => scaleWidth + 2)
          }
        } else {
          setScaleWidth(11)
        }
      }}>
        <div style={{ width: '100%', height: '32px', backgroundColor: 'rgb(58,58,58)' }}>
          <Button onClick={exportDatas}>Export Datas</Button>
          <Button onClick={restoreDatas}>Restore Datas</Button>
        </div>
        <Timeline
          ref={timelineState}
          onChange={(data) => {
            setData([...data] as TimelineType[]);
          }}
          editorData={data}
          effects={effects}
          onDoubleClickRow={(e, { row, time }) => {
            dbAddTrack(row, time)
          }}
          onContextMenuRow={(e, { row, time }) => {
            showMenu(e, { row, time })
          }}
          onContextMenuAction={(e, { action, row, time }) => {
            showMenu(e, { action, row, time })
          }}
          minScaleCount={20}
          scaleWidth={scaleWidth}
          onCursorDragEnd={(time) => {
            setCursorTime(() => time);
          }}
          getScaleRender={(scale) => <CustomScale scale={scale} />}
        ></Timeline>
      </div>

      {
        <div ref={menu} className='react-contexify' id={menuOption.menuId}>
          {
            menuOption.items.map((item) => {
              return (
                <div className="react-contexify__item" key={item.key} onClick={() => item.handler(menuProps)}>
                  <div className="react-contexify__item__content">
                    {item.name}
                  </div>
                </div>)
            })
          }
        </div>
      }
    </div>
  )
}
