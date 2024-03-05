import { FileFilled, MoreOutlined, QuestionCircleFilled, SettingFilled } from '@ant-design/icons'
import { Divider, Input } from 'antd'
import './index.css'
import React, { useState } from 'react'
import { AttributeManager } from '../../attribute/AttributeManager'
import { ContextMenuManager } from '../../contextMenu/ContextMenuManager'

export function InspectorAudio(datas) {

  const [data, setData] = useState([
    {
      id: 0,
      name: 'Attenuation',
      attrs: [
        {
          title: 'Volume',
          type: 'slider',
          attr: {
            value: 0,
            max: 20,
            min: -80,
            setRefresh() { },
            onChange() { }
          }
        }
      ]
    },
    {
      id: 1,
      name: 'Echo',
      attrs: [
        {
          title: 'Delay',
          type: 'slider',
          attr: {
            value: 500,
            max: 5000,
            min: 1,
            setRefresh() { },
            onChange() { }
          }
        },
        {
          title: 'Decay',
          type: 'slider',
          attr: {
            value: 0,
            max: 100,
            min: 0,
            setRefresh() { },
            onChange() { }
          }
        }
      ]
    }
  ])

  const Sliders = (data) => {
    return (<>
      <div className='ins-aud-slider'>
        <div className="slider-head">
          <div className='slider-head-left'>
            <span className='slider-block' style={{ backgroundColor: 'rgb(255,168,7)' }}></span>&nbsp;
            <span className='slider-name'>{data.name}</span>
          </div>

          <SettingFilled className='icon' onClick={(e) => {
            e.stopPropagation()
            ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
          }} />
        </div>

        <div className="slider-body">
          {
            AttributeManager.getAttributeList(data.attrs)
          }
        </div>
      </div>
      <Divider></Divider>
    </>)
  }

  return (
    <div className='ins-aud'>
      <div className="ins-aud-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-aud-header-name">
            <span>
              Master (Audio Mixer Group Controller)
            </span>
            <div></div>
            <span>
              NewAudioMixer
            </span>
          </div>
          <QuestionCircleFilled className='icon' />
          <MoreOutlined className='icon' onClick={(e) => {
            e.stopPropagation()
            ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
          }} />
        </div>
        <div className="header-bottom">
          <span>私有</span>
          <div className="add">
            添加...
          </div>
        </div>
      </div>

      <div className="ins-aud-body">
        <div className="ins-aud-pitch">
          {
            AttributeManager.getAttributeList([
              {
                title: 'Pitch',
                type: 'slider',
                attr: {
                  value: 100,
                  max: 1000,
                  min: 1,
                  setRefresh() { },
                  onChange() { }
                }
              }
            ])
          }
        </div>
        <Divider></Divider>

        {
          data.length ? data.map(item => <Sliders key={item.id} {...item} />
          ) : (<></>)
        }

        <div className="add-effect-btn">
          <div className="add" style={{ position: 'relative' }} onClick={(e) => {
            e.stopPropagation()
            ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
          }}>
            Add Effect
          </div>
        </div>
      </div>
    </div>
  )
}
