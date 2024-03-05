import React, { useEffect, useState } from 'react'
import { CaretDownFilled, CheckOutlined, DribbbleOutlined, EyeInvisibleOutlined, SearchOutlined, SettingFilled, VideoCameraFilled } from '@ant-design/icons'

import { SceneHeadType, IconFont } from '../sceneManager'
import { AttributeManager } from '../../attribute/AttributeManager';
import { ContextMenuManager } from '../../contextMenu/ContextMenuManager';
import { Checkbox, Input } from 'antd';
export default function ViewOptions() {

  const [shadowMode, setShadowMode] = useState<string>('shading-mode-shaded');

  const [data, setData] = useState<SceneHeadType[]>([
    {
      key: '0',
      value: <DribbbleOutlined />,
      isDisabled: false,
      isChecked: false,
      isLine: false,
      isDrop: true,
      panel: {
        lists: [
          {
            key: 'shading-mode',
            title: 'Shading Mode',
            children: [
              {
                key: 'shading-mode-shaded',
                subtitle: 'Shaded',
              },
              {
                key: 'shading-Mode-wireframe',
                subtitle: 'Wireframe',
              },
            ]
          },
          {
            key: 'miscellaneous',
            title: 'Miscellaneous',
            children: [
              {
                key: 'miscellaneous-shadow-cascades',
                subtitle: 'Shadow Cascades',
              },
              {
                key: 'miscellaneous-wireframe',
                subtitle: 'Wireframe',
              },
            ]
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
      value: <IconFont type='icon-view_d' />,
      isDisabled: false,
      isChecked: false,
      isLine: false,
      isDrop: false,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
    },
    {
      key: '2',
      value: <IconFont type='icon-lightbulb' />,
      isDisabled: false,
      isChecked: true,
      isLine: false,
      isDrop: false,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
    },
    {
      key: '3',
      value: <IconFont type='icon-voice1' />,
      isDisabled: false,
      isChecked: false,
      isLine: false,
      isDrop: false,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
    },
    {
      key: '4',
      value: <IconFont type='icon-stack-fill' />,
      isDisabled: false,
      isChecked: true,
      isLine: true,
      isDrop: true,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
      panel: {
        skybox: [
          {
            key: 'skybox',
            title: 'Skybox',
            isChecked: true,
            onChange() {
              this.isChecked = !this.isChecked;
            }
          },
          {
            key: 'fog',
            title: 'Fog',
            isChecked: true,
            onChange() {
              this.isChecked = !this.isChecked;
            }
          }
        ]
      },
      isPanelShow: false,
      changePanel() {
        this.isPanelShow = !this.isPanelShow
      }
    },
    {
      key: '5',
      value: <EyeInvisibleOutlined />,
      isDisabled: false,
      isChecked: true,
      isLine: false,
      isDrop: false,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
    },
    {
      key: '6',
      value: <VideoCameraFilled />,
      isDisabled: false,
      isChecked: false,
      isLine: false,
      isDrop: true,
      panel: {
        title: 'Scene Camera',
        setting: {
          icon: <SettingFilled />,
          menu: (e) => {
            ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: 'reset', onClick() { } }] })
          }
        },
        options: [
          {
            title: 'Field of View',
            type: 'slider',
            attr: {
              value: 60,
              min: 0,
              max: 120,
              setRefresh(func: Function) {
              },
              onChange() {
              }
            }
          },
          {
            title: 'Dynamic Clipping',
            type: 'checkbox',
            attr: {
              attrValue: {
                value: true
              },
              setRefresh(func: Function) {
              },
              onChange() {
              }
            }
          },
          {
            title: "Clipping Planes",
            type: "number",
            isArray: true,
            arrayData: [
              { value: 0.03 },
              { value: 10000 }
            ],
            defaultTemplate: {
              value: 0
            },
            attr: {
              attrValue: {},
              setRefresh(func: Function) {
              },
              onChange() {
              }
            },
          },
          {
            title: 'Occlusion Culling',
            type: 'checkbox',
            attr: {
              attrValue: {
                value: true
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
      key: '7',
      value: <DribbbleOutlined />,
      isDisabled: false,
      isChecked: true,
      isLine: true,
      isDrop: true,
      changeChecked() {
        this.isChecked = !this.isChecked
      },
      panel: {
        options: [
          {
            title: '3D Icons',
            type: 'slider',
            attr: {
              value: 50,
              min: 0,
              max: 100,
              setRefresh(func: Function) {
              },
              onChange() {
              }
            }
          },
          {
            title: 'Fade Gizmos',
            type: 'slider',
            attr: {
              value: 40,
              min: 0,
              max: 100,
              setRefresh(func: Function) {
              },
              onChange() {
              }
            }
          },
          {
            title: 'Selection Outline',
            type: 'checkbox',
            attr: {
              attrValue: {
                value: true
              },
              setRefresh(func: Function) {
              },
              onChange() {
              }
            }
          },
        ],
        gizmos: [
          {
            key: 'recently-changed',
            title: 'Recently Changed',
            checkVis: true,
            changeCheck() {
              this.checkVis = !this.checkVis
            },
            items: [
              {
                key: 'animation',
                title: 'Animation',
                checkVis: true,
                changeCheck() {
                  this.checkVis = !this.checkVis
                },
              },
              {
                key: 'animation-track',
                title: 'AnimationTrack',
                checkVis: true,
                changeCheck() {
                  this.checkVis = !this.checkVis
                },
              },
            ]
          },
          {
            key: 'scripts',
            title: 'Scripts',
            checkVis: true,
            changeCheck() {
              this.checkVis = !this.checkVis
            },
            items: [
              {
                key: 'text-mesh-pro',
                title: 'TextMeshPro',
                checkVis: true,
                changeCheck() {
                  this.checkVis = !this.checkVis
                },
              },
              {
                key: 'camera',
                title: 'Camera',
                icon: <VideoCameraFilled />,
                checkVis: true,
                changeCheck() {
                  this.checkVis = !this.checkVis
                },
              },
              {
                key: 'variable',
                title: 'Variable',
                icon: <IconFont type='icon-code' />,
              },
            ]
          }
        ]
      },
      isPanelShow: false,
      changePanel() {
        this.isPanelShow = !this.isPanelShow
      }
    },
  ])

  function closePanel() {
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
                closePanel()
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
                    {/* 标题 */}
                    {
                      item.panel.title ? (<div className="scene-panel-title">
                        {item.panel.title}
                        <span onClick={(e) => {
                          item.panel.setting.menu(e)
                        }}>
                          {item.panel.setting.icon}
                        </span>
                      </div>) : (<></>)
                    }
                    {/* 切换 attributes */}
                    {
                      item.panel.options ? (<div className="scene-panel-attr">
                        {
                          AttributeManager.getAttributeList(item.panel.options)
                        }
                      </div>) : (<></>)
                    }
                    {/* 切换场景模式 */}
                    {
                      item.panel.lists ? item.panel.lists.map((list) => {
                        return (<div key={list.key}>
                          <span className='scene-panel-title'>
                            {list.title}
                          </span>
                          <ul className='scene-panel-ul'>
                            {
                              list.children ? list.children.map((li) => {
                                return (<li className='scene-panel-li' key={li.key} onClick={() => {
                                  setShadowMode(li.key)
                                }}>
                                  <span className={li.key == shadowMode ? "scene-check list-checked" : 'scene-check'}><CheckOutlined /></span>
                                  {li.subtitle}
                                </li>)
                              }) : (<></>)
                            }
                          </ul>
                        </div>)
                      }) : (<></>)
                    }
                    {/* 切换天空背景 */}
                    {
                      item.panel.skybox ? (<ul className='scene-panel-ul'>
                        {
                          item.panel.skybox.map((sky) => {
                            return <li className='scene-panel-li' key={sky.key} onClick={() => {
                              sky.onChange()
                              setData([...data])
                            }}>
                              <span className={sky.isChecked ? "scene-check list-checked" : 'scene-check'}><CheckOutlined /></span>
                              {sky.title}
                            </li>
                          })
                        }
                      </ul>) : (<></>)
                    }

                    {/* 场景元素隐藏 */}
                    {
                      item.panel.gizmos ? (<div className='panel-gizmos'>
                        <Input className="box-2-input"
                          size="small"
                          prefix={<SearchOutlined className="searchOutl" />}></Input>
                        <table>
                          <thead>
                            <tr>
                              <th style={{ width: '80%' }}></th>
                              <th style={{ width: '10%' }}>icon</th>
                              <th style={{ width: '10%' }}>gizmo</th>
                            </tr>
                          </thead>
                          {
                            item.panel.gizmos.map((item) => {
                              return (<tbody key={item.key}>
                                <tr>
                                  <td>{item.title}</td>
                                  <td></td>
                                  <td><Checkbox checked={item.checkVis} onChange={() => {
                                    item.changeCheck()
                                    setData([...data])
                                  }}></Checkbox></td>
                                </tr>
                                {item.items ? item.items.map((subitem) => {
                                  return (<tr key={subitem.key}>
                                    <td style={{ paddingLeft: '5px' }}>{subitem.title}</td>
                                    <td>{subitem.icon ? subitem.icon : (<></>)}</td>
                                    <td><Checkbox checked={subitem.checkVis} onChange={() => {
                                      subitem.changeCheck()
                                      setData([...data])
                                    }}></Checkbox></td>
                                  </tr>)
                                })
                                  : (<></>)
                                }
                              </tbody>)
                            })
                          }

                        </table>
                      </div>) : (<></>)
                    }
                  </div>) : (<></>)
              }

            </div>)
        }) : (<></>)
      }

    </div>
  )
}
