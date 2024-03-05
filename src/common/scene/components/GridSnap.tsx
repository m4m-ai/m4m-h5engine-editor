import React, { useEffect, useState } from 'react'
import { CaretDownFilled, ColumnWidthOutlined, MoreOutlined } from '@ant-design/icons'

import { IconFont, SceneHeadType } from '../sceneManager'
import { AttributeManager } from '../../attribute/AttributeManager';
import { ContextMenuManager } from '../../contextMenu/ContextMenuManager';

export function GridSnap() {

  const [data, setData] = useState<SceneHeadType[]>([
    {
      key: '0',
      value: <IconFont type='icon-grid' />,
      isDisabled: false,
      isChecked: false,
      isLine: true,
      isDrop: true,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
      panel: {
        title: 'Grid Visual',
        setting: {
          icon: <MoreOutlined />,
          menu: (e) => {
            ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: 'reset', onClick() { } }] })
          }
        },
        options: [
          {
            title: 'Grid Plane',
            type: 'radioGroup',
            attr: {
              attrValue: {
                value: 'y',
                options: [
                  { label: 'X', value: 'x' },
                  { label: 'Y', value: 'y' },
                  { label: 'Z', value: 'z' },
                ]
              },
              setRefresh(func: Function) {
              },
              onChange() {

              }
            }
          },
          {
            title: 'Opacity',
            type: 'slider',
            attr: {
              value: 50,
              min: 0,
              max: 100,
              onChange() { },
              setRefresh() { }
            }
          },
          {
            title: 'Move To',
            type: 'radioGroup',
            attr: {
              attrValue: {
                value: 'origin',
                options: [
                  { label: 'To Handle', value: 'handle' },
                  { label: 'To Origin', value: 'origin' },
                ]
              },
              setRefresh(func: Function) {
              },
              onChange() {

              }
            }
          },
        ]
      },
      isPanelShow: false,
      changePanel() {
        this.isPanelShow = !this.isPanelShow
      }
    },
    {
      key: '1',
      value: <IconFont type='icon-grid' />,
      isDisabled: true,
      isChecked: false,
      isLine: true,
      isDrop: true,
      changeChecked() {
        this.isChecked = !this.isChecked
      }
    },
    {
      key: '2',
      value: <ColumnWidthOutlined />,
      isDisabled: false,
      isChecked: false,
      isLine: false,
      isDrop: true,
      panel: {
        title: 'Increment Snapping',
        setting: {
          icon: <MoreOutlined />,
          menu: (e) => {
            ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: 'reset', onClick() { } }] })
          }
        },
        options: [
          {
            title: 'Move',
            type: 'vector3',
            attr: {
              attrValue: {
                x: 0, y: 0, z: 0
              },
              onChange() { },
              setRefresh() {

              },
            }
          },
          {
            title: 'Rotate',
            type: 'number',
            attr: {
              attrValue: {
                value: 15
              },
              onChange() { },
              setRefresh() { }
            }
          },
          {
            title: 'Scale',
            type: 'number',
            attr: {
              attrValue: {
                value: 1
              },
              onChange() { },
              setRefresh() { }
            }
          },
        ]
      },
      isPanelShow: false,
      changePanel() {
        this.isPanelShow = !this.isPanelShow
      }
    }
  ])

  const closePanel = () => {
    setData(data.map((item) => {
      return { ...item, isPanelShow: false }
    }))
  }

  useEffect(() => {
    document.addEventListener('click', closePanel);

    return () => {
      document.removeEventListener('click', closePanel)
    }
  }, [])

  return (
    <div className='scene-tool'>
      <IconFont type='icon-custom-suspend' className='tool-icon'></IconFont>

      {
        data.length ? data.map((item) => {
          return (
            <div key={item.key} className={item.isDisabled ? "select-box select-disabled" : item.isChecked ? "select-box select-item" : 'select-box'}>
              <div className="select-icon" onClick={(e) => {
                e.stopPropagation()
                closePanel()
                if (!item.isDisabled && item.changeChecked) {
                  item.changeChecked()
                  setData([...data])
                }
                if (!item.isLine && item.changePanel) {
                  item.changePanel()
                  setData([...data])
                }
              }}>
                {item.value}
              </div>
              {item.isLine ? (<div className="line" style={{ width: '1px', height: '100%', backgroundColor: '#000' }}></div>) : (<></>)}

              {item.isDrop ? (<div className="select-drop" onClick={(e) => {
                e.stopPropagation()
                if (item.changePanel) {
                  item.changePanel()
                  setData([...data])
                }
              }}>
                <CaretDownFilled />
              </div>) : (<></>)}

              {
                item.panel && item.isPanelShow ? (
                  <div className="scene-panel" onClick={(e) => {
                    e.stopPropagation()
                  }}>
                    <div className="scene-panel-title">
                      {item.panel.title}
                      <span onClick={(e: any) => {
                        item.panel.setting.menu(e)
                      }}>
                        {item.panel.setting.icon}
                      </span>
                    </div>
                    <div className="scene-panel-attr">
                      {
                        AttributeManager.getAttributeList(item.panel.options)
                      }
                    </div>
                  </div>) : (<></>)
              }

            </div>)
        }) : (<></>)
      }

    </div>
  )
}
