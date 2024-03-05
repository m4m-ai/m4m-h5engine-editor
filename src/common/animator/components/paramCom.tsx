import { CaretDownOutlined, MenuOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Checkbox, Input } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

export default function ParamCom() {


  // parameters 列表
  const [paramsList, setParamsList] = useState([
    {
      id: 0,
      name: 'New Float',
      value: 0
    },
  ])

  const [paramsActive, setParamsActive] = useState<number>(0)
  const [paramsTarget, setParamsTarget] = useState(null)
  const [parId, setParId] = useState<number>(0)

  const menu = useRef<HTMLDivElement>(null)

  const options = useRef<HTMLDivElement>(null)

  const contextMenuList = {
    menuId: '2',

    items: [
      {
        key: 'Del',
        name: 'delete',
        handler: (id) => {
          // 删除
          let arr = paramsList.map((item) => {
            return { ...item }
          })
          let index = arr.findIndex(d => d.id == id)

          if (index != -1) {
            arr.splice(index, 1)
          }

          setParamsList([...arr])
        }
      }
    ]
  }

  useEffect(() => {
    let panels = document.querySelectorAll('.setting-panel');
    document.documentElement.addEventListener('click', (e) => {
      setParamsTarget(null)
      panels.forEach((item) => {
        if (item) {
          let ele = item as HTMLDivElement;
          ele.style.display = 'none'
        }
      })
    })
  }, [paramsList])

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (menu && menu.current) {
        menu.current.style.opacity = '0';
        menu.current.style.display = 'none';
      }
      if (options && options.current) {
        options.current.style.display = 'none';
      }
    })
    return () => {
      document.removeEventListener('click', () => { })
    }
  }, [])

  const drag = (event, id: number) => {
    setParId(id)
  }

  const allowDrop = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
  }

  const drop = (event: React.DragEvent<HTMLLIElement>, id: number) => {
    event.preventDefault();


    if (id == parId) return

    const newArr = paramsList.map(item => {
      return {
        ...item
      }
    });
    let sId = paramsList.findIndex(d => d.id == parId)
    let cId = paramsList.findIndex(d => d.id == id)

    const temp = paramsList[sId];
    newArr[sId] = paramsList[cId];
    newArr[cId] = temp;
    setParamsList([...newArr])
  }

  const changeParams = (e, item) => {
    e.stopPropagation()
    if (paramsTarget == item.id) {
      // rename
    } else {
      setParamsTarget(item.id);
    }
    setParamsActive(item.id);
  }

  const createParam = () => {
    if (options && options.current) {
      options.current.style.display = 'none'
      // 新建
      // ...
    }
  }

  return (
    <>
      <div className='grid-line' style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
        <Input
          style={{ height: '16px', width: '60%', padding: '0 2px' }}
          prefix={<SearchOutlined style={{ color: 'rgb(211, 210, 210)' }}
            placeholder={'Name'}
          />} />
        <div className="params-select" onClick={(e) => {
          e.stopPropagation()
          if (options && options.current) {
            options.current.style.display = 'block';
          }

        }}>
          <PlusOutlined />
          <CaretDownOutlined />
          <div ref={options} className="params-options" >
            <div className="react-contexify" style={{ position: 'relative', opacity: '1' }}>
              <div className="react-contexify__item" onClick={() => {
                createParam()
              }}>
                <div className="react-contexify__item__content">
                  Float
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul className='layer-list'>
        {
          paramsList.length ? paramsList.map((item, index) => (
            <li key={item.id} className={item.id == paramsTarget ? 'params params-active' : item.id == paramsActive ? 'params active' : 'params'}
              draggable
              onDragStart={event => drag(event, item.id)} // 拖拽开始触发
              onDrop={event => drop(event, item.id)} // 拖拽结束触发
              onDragOver={event => allowDrop(event)}
              onClick={(e) => {
                changeParams(e, item)
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
                changeParams(e, item)
                menu.current.style.opacity = '1'
                menu.current.style.display = 'block'
                menu.current.style.left = e.clientX + 'px';
                menu.current.style.top = e.clientY + 'px';
              }}

            >
              <div className='params-icon'>
                <MenuOutlined />
              </div>
              <div className='params-info'>
                <div className="params-top">
                  <div className="params-name">{item.name}</div>
                  {/* <Input className='params-rename' type='text' /> */}
                  <Input value={item.value} style={{ height: '20px', width: '30%', float: 'right' }} />
                  {/* <Checkbox /> */}

                </div>
              </div>
            </li>
          )) : (<li style={{ color: '#999999', padding: '0 8px' }}>List is Empty</li>)
        }
      </ul>
      {
        (<div ref={menu} className='react-contexify' key={contextMenuList.menuId}>
          {
            contextMenuList.items.map((item) => {
              return (
                <div className="react-contexify__item" key={item.key} onClick={() => item.handler(paramsActive)}>
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
