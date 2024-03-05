import { MenuOutlined, PlusOutlined, SettingFilled } from '@ant-design/icons'
import { Progress } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { AttributeManager } from '../../attribute/AttributeManager'
import { layerInstance } from '../animator'

export function LayerCom(props) {

  // layer列表
  const [list, setList] = useState<layerInstance[]>([
    {
      id: 0,
      name: 'Base Layer',
      weight: 100,
      setting: [
        {
          title: 'Weight',
          type: 'slider',
          attr: {
            value: 100,
            max: 100,
            min: 0,
            setRefresh() { },
            onChange() { }
          }
        },
        {
          title: 'Mask',
          type: 'asset',
          attr: {
            value: '',
            setRefresh() { },
            onChange() { }
          }
        },
        {
          title: 'Bending',
          type: 'select',
          attr: {
            attrValue: {
              defaultValue: 'Override',
            },
            options: [{ value: 'Override', label: 'Override' }, { value: 'Additive', label: 'Additive' }],
            setRefresh() { },
            onChange() { }
          }
        },
        {
          title: 'Sync',
          type: 'checkbox',
          attr: {
            attrValue: {
              value: false
            },
            setRefresh() { },
            onChange() { }
          }
        },
        {
          title: 'IK Pass',
          type: 'checkbox',
          attr: {
            attrValue: {
              value: false
            },
            setRefresh() { },
            onChange() { }
          }
        }
      ],
    }
  ])
  const [layerIndex, setLayerIndex] = useState<number>(1)
  const [layerActive, setLayerActive] = useState<number>(0)

  const menu = useRef<HTMLDivElement>(null)

  // 记录选中的元素
  const [layerTarget, setLayerTarget] = useState(null)
  useEffect(() => {
    let panels = document.querySelectorAll('.setting-panel');
    document.documentElement.addEventListener('click', (e) => {
      setLayerTarget(null)
      panels.forEach((item) => {
        if (item) {
          let ele = item as HTMLDivElement;
          ele.style.display = 'none'
        }
      })
    })
  }, [list])

  const [srcId, setSrcId] = useState(null);

  // 当拖动时触发
  const drag = (event, id: number) => {
    setSrcId(id)
  }

  const allowDrop = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
  }

  const drop = (event: React.DragEvent<HTMLLIElement>, id: number) => {
    event.preventDefault();


    if (id == srcId) return

    const newArr = list.map(item => {
      return {
        ...item,
        setting: item.setting.map(s => {
          return { ...s }
        })
      }
    });
    let sId = list.findIndex(d => d.id == srcId)
    let cId = list.findIndex(d => d.id == id)

    const temp = list[sId];
    newArr[sId] = list[cId];
    newArr[cId] = temp;
    setList([...newArr])
  }

  useEffect(() => {
    document.addEventListener('click', () => {
      if (menu && menu.current) {
        menu.current.style.opacity = '0';
        menu.current.style.display = 'none';
      }
    })
    return () => {
      document.removeEventListener('click', () => { })
    }
  }, [])

  // 右键菜单
  const contextMenuList = {
    menuId: '1',

    items: [
      {
        key: 'Del',
        name: 'delete',
        handler: (id) => {
          // 删除
          let arr = list.map((item) => {
            return { ...item, setting: item.setting.map(sett => { return { ...sett } }) }
          })
          let index = arr.findIndex(d => d.id == id)

          if (index != -1) {
            arr.splice(index, 1)
          }

          setList([...arr])
        }
      }
    ]
  }

  const changeLayer = (e, item) => {
    e.stopPropagation()
    if (layerTarget == item.id) {
      // rename
    } else {
      setLayerTarget(item.id);
    }
    setLayerActive(item.id);
  }

  return (
    <>
      <div className="grid-line" style={{ justifyContent: 'flex-end', padding: '0 5px' }} >
        <PlusOutlined onClick={(e) => {
          e.stopPropagation()
          setList(prev => {
            return [...prev, {
              id: layerIndex, name: `New Layer ${layerIndex}`, weight: 0, setting: [
                {
                  title: 'Weight',
                  type: 'slider',
                  attr: {
                    value: 100,
                    max: 100,
                    min: 0,
                    setRefresh() { },
                    onChange() { }
                  }
                },
                {
                  title: 'Mask',
                  type: 'asset',
                  attr: {
                    value: '',
                    setRefresh() { },
                    onChange() { }
                  }
                },
                {
                  title: 'Bending',
                  type: 'select',
                  attr: {
                    attrValue: {
                      defaultValue: 'Override',
                    },
                    options: [{ value: 'Override', label: 'Override' }, { value: 'Additive', label: 'Additive' }],
                    setRefresh() { },
                    onChange() { }
                  }
                },
                {
                  title: 'Sync',
                  type: 'checkbox',
                  attr: {
                    attrValue: {
                      value: false,
                    },
                    setRefresh() { },
                    onChange() { }
                  }
                },
                {
                  title: 'IK Pass',
                  type: 'checkbox',
                  attr: {
                    attrValue: {
                      value: false,
                    },
                    setRefresh() { },
                    onChange() { }
                  }
                }
              ],
            }]
          })
          setLayerIndex(prev => prev + 1)
        }} />
      </div>
      <ul className='layer-list'>

        {list.length ? list.map((item, index) => (
          <li key={item.id} className={item.id == layerTarget ? 'layer layer-active' : item.id == layerActive ? 'layer active' : 'layer'} draggable
            onDragStart={event => drag(event, item.id)} // 拖拽开始触发
            onDrop={event => drop(event, item.id)} // 拖拽结束触发
            onDragOver={event => allowDrop(event)}
            onClick={(e) => {
              changeLayer(e, item)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              changeLayer(e, item)
              menu.current.style.opacity = '1'
              menu.current.style.display = 'block'
              menu.current.style.left = e.clientX + 'px';
              menu.current.style.top = e.clientY + 'px';
            }}
          >
            <div className='layer-icon'>
              <MenuOutlined />
            </div>
            <div className='layer-info'>
              <div className="layer-top">

                <div className="layer-name">{item.name}</div>
                {/* <Input className='layer-rename' type='text' /> */}
                <div className="layer-setting">
                  <SettingFilled onClick={(e) => {
                    e.stopPropagation()
                    let panels = document.querySelectorAll('.setting-panel');
                    let panel = panels[index] as HTMLDivElement;
                    panels.forEach((item) => {
                      let ele = item as HTMLDivElement;
                      ele.style.display = 'none'
                    })
                    panel.style.display = 'block';
                  }} />
                </div>
              </div>
              <div className="layer-slider">
                <Progress className='progress' percent={item.weight} showInfo={false} strokeWidth={2} strokeColor={'rgb(139,139,139)'} trailColor={'rgb(84,84,84)'} />
              </div>
            </div>
            <div className='setting-panel' onClick={(e) => {
              e.stopPropagation()
            }}>
              {AttributeManager.getAttributeList(item.setting)}
            </div>
          </li>
        )) : (<li style={{ color: '#999999', padding: '0 8px' }}>List is Empty</li>)}
      </ul>

      {
        (<div ref={menu} className='react-contexify' key={contextMenuList.menuId}>
          {
            contextMenuList.items.map((item) => {
              return (
                <div className="react-contexify__item" key={item.key} onClick={() => item.handler(layerActive)}>
                  <div className="react-contexify__item__content">
                    {item.name}
                  </div>
                </div>)
            })
          }
        </div>)
      }
    </>
  )
}
