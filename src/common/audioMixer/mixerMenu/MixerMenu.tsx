import { EyeFilled, MenuOutlined, PlusOutlined, SlidersFilled, StarFilled } from '@ant-design/icons'
import { Input, Tree } from 'antd';
import React, { useEffect, useState } from 'react'
import { ContextMenuManager } from '../../contextMenu/ContextMenuManager';
import { mixerInstanceType, mixerType } from '../AudioMixerMgr';

export const MixerMenu = (datas) => {

  // mixers列表
  const [mixersData, setMixersData] = useState<mixerType[]>([
    {
      id: 0,
      name: 'NewAudioMixer',
      snapshots: [{
        id: 0,
        name: 'snapshot',
        isDefault: true
      }],
      groups: [{
        id: 0,
        name: 'Master',
        effects: [{
          id: 0,
          type: 'slider',
          title: 'Attenuation',
          borderColor: 'rgb(237, 166, 1)',
          attr: { value: 0, onChange() { }, setRefresh() { } }
        }],
        children: [
          {
            id: 1,
            name: 'New Group',
            effects: [{
              id: 1,
              type: 'slider',
              title: 'Attenuation',
              borderColor: 'rgb(237, 166, 1)',
              attr: { value: 0, onChange() { }, setRefresh() { } }
            }],
          }
        ]
      }],
      views: [{
        id: 0,
        name: 'view'
      }]
    }
  ]);

  // 选中的mixer
  const [activeMixer, setActiveMixer] = useState<mixerType>({ ...mixersData[0] })

  const [mixerIndex, setMixerIndex] = useState<number>(1)


  const addMixer = () => {
    setMixerIndex((prev) => prev + 1)
    setMixersData(prev => {
      return [...prev,
      {
        id: mixerIndex,
        name: `NewAudioMixer ${mixerIndex}`,
        snapshots: [{
          id: mixerIndex,
          name: 'snapshot',
          isDefault: true
        }],
        groups: [{
          id: mixerIndex,
          name: 'group',
          effects: [{
            id: mixerIndex,
            type: 'slider',
            title: 'Attenuation',
            borderColor: 'rgb(237, 166, 1)',
            attr: { value: 0, onChange() { }, setRefresh() { } }
          }],
        }],
        views: [{
          id: mixerIndex,
          name: 'view'
        }]
      }]
    })
  }

  const renderTreeNodes = (groups: mixerInstanceType[]) => {

    return groups.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.name} key={item.id} >
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        )
      }
      return (
        <Tree.TreeNode title={item.name} key={item.id} >
          <Input value={item.name} style={{ width: '90%' }}></Input>
        </Tree.TreeNode>
      )
    })
  }

  useEffect(() => {
    setMixersData((prev) => {
      return prev.map(item => {
        if (item.id == activeMixer.id) {
          return { ...activeMixer }
        } else {
          return { ...item }
        }
      })
    })
  }, [activeMixer])

  return (
    <div className='mixer-lists'>
      {/* mixers */}

      <div className='mixer-list'>
        <div className="mixer-line" >
          <div className="mixer-left">
            <SlidersFilled className="title-icon" style={{ color: 'rgb(248,189,8)' }} />
            <span>Mixers</span>
          </div>
          <div className="mixer-right">
            <PlusOutlined onClick={() => addMixer()} />
          </div>
        </div>
        <ul className='mixer-ul'>
          {
            mixersData.length ? mixersData.map((item) => {
              return (
                <li
                  key={item.id}
                  className={'mixer-li'}
                  onClick={() => {
                    setActiveMixer(item)
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
                  }}>
                  {item.name}
                  {/* <Input value={item.name} style={{ width: '90%' }}></Input> */}
                </li>)
            }) : (<li className='mixer-li'>No mixers found</li>)
          }
        </ul>
      </div>

      {
        activeMixer ? (<>
          {/* snapshot */}
          <div className='mixer-list'>
            <div className="mixer-line" >
              <div className="mixer-left">
                <SlidersFilled className="title-icon" style={{ color: 'rgb(248,189,8)' }} />
                <span>Snapshots</span>
              </div>
              <div className="mixer-right">
                <PlusOutlined onClick={() => {
                  setActiveMixer((item) => {
                    return {
                      ...item, snapshots:
                        [...item.snapshots, {
                          id: Math.floor(Math.random() * 10000),
                          name: 'snapshot 0',
                          isDefault: false
                        }]
                    }
                  })
                }} />
              </div>
            </div>
            <ul className='mixer-ul'>
              {
                activeMixer.snapshots.length ? activeMixer.snapshots.map((item) => {
                  return (<li key={item.id}
                    className='mixer-li'
                    onContextMenu={(e) => {
                      e.preventDefault()
                      ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
                    }}>
                    <div className='mixer-icon' style={{ position: 'absolute', left: '2px' }}>
                      <MenuOutlined />
                    </div>
                    {item.name}
                    {/* <Input value={item.name} style={{ width: '90%' }}></Input> */}
                    {item.isDefault ? (<div className="mixer-icon" style={{ position: 'absolute', right: '2px' }}>
                      <StarFilled />
                    </div>) : (<></>)}

                  </li>)
                }) : (<li className='mixer-li'>No mixers found</li>)
              }
            </ul>
          </div>

          {/* group */}
          <div className='mixer-list'>
            <div className="mixer-line" >
              <div className="mixer-left">
                <SlidersFilled className="title-icon" style={{ color: 'rgb(248,189,8)' }} />
                <span>Groups</span>
              </div>
              <div className="mixer-right">
                <PlusOutlined />
              </div>
            </div>
            <Tree.DirectoryTree
              className='mixer-ul'
              showIcon={false}
              expandAction={false}
              blockNode
              onRightClick={(e) => {
                e.event.preventDefault()
                ContextMenuManager.showContextMenu({ x: e.event.pageX, y: e.event.pageY, items: [{ title: '111', onClick() { } }] })
              }}
            >
              {renderTreeNodes(activeMixer.groups)}
            </Tree.DirectoryTree>
          </div>

          {/* views */}
          <div className='mixer-list'>
            <div className="mixer-line" >
              <div className="mixer-left">
                <SlidersFilled className="title-icon" style={{ color: 'rgb(248,189,8)' }} />
                <span>Views</span>
              </div>
              <div className="mixer-right">
                <PlusOutlined onClick={() => {
                  setActiveMixer((item) => {
                    return {
                      ...item, views:
                        [...item.views, {
                          id: Math.floor(Math.random() * 10000),
                          name: 'view 0',
                          isDefault: false
                        }]
                    }
                  })
                }} />
              </div>
            </div>
            <ul className='mixer-ul'>
              {
                activeMixer.views.length ? activeMixer.views.map((item) => {
                  return (
                    <li
                      key={item.id}
                      className='mixer-li'
                      onContextMenu={(e) => {
                        e.preventDefault()
                        ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
                      }}>
                      <div className='mixer-icon' style={{ position: 'absolute', left: '2px' }}>
                        <MenuOutlined />
                      </div>
                      {item.name}
                      {/* <Input value={item.name} style={{ width: '90%' }}></Input> */}
                    </li>)
                }) : (<li className='mixer-li'>No mixers found</li>)
              }
            </ul>
          </div>
        </>) : (<></>)
      }
    </div>
  )
}
