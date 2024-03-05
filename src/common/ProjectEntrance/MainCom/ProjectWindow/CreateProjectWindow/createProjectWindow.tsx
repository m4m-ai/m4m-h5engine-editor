import { CaretDownOutlined, CloudDownloadOutlined, CodeSandboxOutlined, DoubleRightOutlined, DownloadOutlined, DownOutlined, GoldFilled, LoadingOutlined, ReadFilled, SearchOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Button, Checkbox, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { WebsocketTool } from '../../../../../CodeEditor/code/WebsocketTool';
import { WindowManager } from '../../../../window/WindowManager';
import style from './createProjectWindow.module.scss'

export interface sideListType {
  id: number;
  name: string;
  icon: JSX.Element;
}

export interface tempListType {
  tempName: string;
  tempInfo: string;
  leftIcon: JSX.Element;
  tempType: string;
  isDownload: boolean;
  img?: string;
}

export const CreateProjectWindow = (props: { id: number }) => {

  // 侧边列表类型
  const sideList: sideListType[] = [
    {
      id: 0,
      name: 'All templates',
      icon: <UnorderedListOutlined />,
    },
    {
      id: 1,
      name: 'Core',
      icon: <UnorderedListOutlined />,
    },
    {
      id: 2,
      name: 'Sample',
      icon: <GoldFilled />,
    },
    {
      id: 3,
      name: 'Learning',
      icon: <UnorderedListOutlined />,
    },
  ]

  // 类型索引
  const [templateA, setTemplateA] = useState<string>('All templates')

  // 模板索引
  const [templateLiA, setTemplateLiA] = useState<string>('2D')

  // 模板类型
  const [tempList, setTempList] = useState<tempListType[]>([
    {
      tempName: '2D',
      tempInfo: "This is an empty project configured for 2D apps. It uses Unity's built-in renderer.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Core',
      isDownload: true,
    },
    {
      tempName: '3D',
      tempInfo: "This is an empty 3D project that uses Unity's built-in renderer.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Core',
      isDownload: true,
    },
    {
      tempName: 'Runner Game',
      tempInfo: "Tutorials, sample content, and customizable building blocks to build and ship a runner game.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Core',
      isDownload: false,
    },
    {
      tempName: '3D Mobile',
      tempInfo: "Creating in 3D? This template includes recommended packages and settings for 3D mobile development.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Core',
      isDownload: false,
    },
    {
      tempName: 'Test Track',
      tempInfo: "This template made in collaboration with Volvo, features an artistic and technical interpretation of one of Sweden Hällered test ground facility tracks. It provides a good starting point for: The rig and the controller for a car Optimization's required to make this test track run smoothly",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Sample',
      isDownload: false,
    },
    {
      tempName: '3D Sample Scene(URP',
      tempInfo: "Quickly and easily create optimized graphics across a wide range of platforms with the Universal Render Pipeline.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Sample',
      isDownload: false,
    },
    {
      tempName: '2D Platformer Microgame',
      tempInfo: "Customize this 2D platformer game while learning the basics of Unity Editor. Preloaded with scenes, scripts, tutorials, and more.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Learning',
      isDownload: false,
    },
    {
      tempName: 'FPS Microgame',
      tempInfo: "Customize this first-person shooter game while learning the basics of Unity Editor. Preloaded with scenes, scripts, tutorials, and more.",
      leftIcon: <DoubleRightOutlined />,
      tempType: 'Learning',
      isDownload: false,
    },
  ])

  // 模板类型副本 进行一系列处理
  const [tempListC, setTempListC] = useState<tempListType[]>([...tempList]);

  const [versionVal, setVersionVal] = useState('2021.3.15f1c1');
  const [verSearchVal, setVerSearchVal] = useState('');

  const [versionList, setVersionList] = useState(['2021.3.15f1c1'])
  const [verList, setVerList] = useState([...versionList])

  const vSelect = useRef<HTMLDivElement>(null)

  // 搜索框数据
  const [searchVal, setSearchVal] = useState<string>('');

  // 文件名
  const proName = useRef<HTMLInputElement>()
  const [proNameVal, setProNameVal] = useState('test1');

  // name聚焦
  const [isFocus, setIsFocus] = useState<number>(0)

  // 选择template信息
  const [templateInfo, setTemplateInfo] = useState<tempListType>({ ...tempList[0] })

  const [checked, setChecked] = useState<boolean>(true)

  // 用户名
  const [username, setUsername] = useState<string>('username1')

  // 展示用户下拉选择框
  const [isShowSelect, setIsShowSelect] = useState<boolean>(false)

  // 遮罩层
  const mask = useRef<HTMLDivElement>(null)

  let timer = null;

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    filterTemps(templateA, searchVal)
    document.addEventListener('click', () => {
      setIsFocus(0)
      setIsShowSelect(false)
      if (vSelect.current)
        vSelect.current.style.display = 'none'
    })
    return () => {
      document.removeEventListener('click', () => { })
    }
  }, [])

  const onChange = (e) => {
    setChecked(e.target.checked)
  };

  // search数据更新触发搜索
  useEffect(() => {
    filterTemps(templateA, searchVal)
  }, [templateA, searchVal])

  // 搜索模板
  const filterTemps = (type: string, searchVal?: string) => {
    if (type == 'All templates') {
      setTempListC(tempList.filter((item) => {
        return item.tempName.match(new RegExp(searchVal, 'gi'))
      }))
      return;
    }
    setTempListC(tempList.filter((item) => {
      return item.tempType == type && item.tempName.match(new RegExp(searchVal, 'gi'))
    }))
  }

  useEffect(() => {
    setVerList(versionList.filter((item) => {
      return item.match(new RegExp(verSearchVal, 'gi'))
    }))
  }, [verSearchVal])



  return (
    <div className={style.createPro}>
      <div className={style.head}>
        <div className={style.name}>
          New project
        </div>
        <div className={`${style.select}`} onClick={(e) => {
          e.stopPropagation()
          if (vSelect.current)
            vSelect.current.style.display = 'block';
        }}>
          Editor Version: <span className={style.version}>
            {versionVal}
          </span>
          &nbsp;
          <span className={style.tag}>LTS</span>
          &nbsp;
          <DownOutlined />

        </div>
      </div>

      <div className={style.body}>
        {/* 下拉选择框 */}
        <div ref={vSelect} className={style.vSelect}>

          <ul className={style.vUl}>
            <li className={style.liSearch}>
              <Input
                size="large"
                className={style.searchInput}
                prefix={<SearchOutlined className={style.searchIcon} />}
                placeholder={`Filter`}
                onChange={(e) => {
                  setVerSearchVal(e.target.value)
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (vSelect.current)
                    vSelect.current.style.display = 'block';
                }}
              />
            </li>

            {
              verList && verList.length ? versionList.map((item) => (
                <li className={style.selectVer} key={item} onClick={() => {
                  setVersionVal(item);
                }}>
                  <CodeSandboxOutlined />&nbsp;
                  <span>{item}</span>&nbsp;
                  <span className={style.tag}>LTS</span>
                </li>
              )) : (<></>)
            }

          </ul>
        </div>
        <div className={style.bodyLeft}>
          <ul className={style.templates}>
            {
              sideList && sideList.length ? sideList.map((item) => {
                return (
                  <li key={item.id} className={`${style.template} ${templateA == item.name ? style.templateActive : ''}`} onClick={() => { setTemplateA(item.name) }}>
                    {item.icon}
                    <span className={style.templateName}>
                      {item.name}
                    </span>
                  </li>)
              }) : (<></>)
            }

          </ul>
        </div>
        <div className={style.bodyCenter}>
          <ul className={style.centerContainer}>
            <li className={style.liSearch}>
              <Input
                size="large"
                className={style.searchInput}
                prefix={<SearchOutlined className={style.searchIcon} />}
                placeholder={`Search all templates`}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                }}
              />
            </li>

            {
              tempListC && tempListC.length ? tempListC.map((item, index) => (
                <li key={item.tempName} className={`${style.liTemp} ${item.isDownload ? style.liBgTemp : style.liBdTemp} ${item.tempName == templateLiA ? style.liActive : ''}`}
                  onClick={() => {
                    setTemplateLiA(item.tempName)
                    setTemplateInfo({ ...item })
                  }} >
                  <div className={style.iconL}>
                    {item.leftIcon}
                  </div>
                  <div className={style.tempInfo}>
                    <span className={style.tempName}>{item.tempName}</span>
                    <span className={style.tempType}>{item.tempType}</span>
                  </div>
                  {
                    !item.isDownload ?
                      (<div className={style.iconR}>
                        <CloudDownloadOutlined />
                      </div>) : (<></>)
                  }
                </li>)) : (<></>)
            }

          </ul>
        </div>
        <div className={style.bodyRight}>
          <div className={style.infoImg}>

          </div>
          <div className={style.information}>
            <div className={style.infoName}>{templateInfo.tempName}</div>
            <div className={style.infoDesc}>
              {templateInfo.tempInfo}
            </div>
            <div className={style.readmore}>
              <ReadFilled /> &nbsp;
              <span className={style.underline}>
                Read more
              </span>
            </div>
          </div>

          {
            templateInfo && templateInfo.isDownload ? (<div className={style.setting}>
              <div className={style.settingName}>
                PROJECT SETTINGS
              </div>
              <ul className={style.options}>
                <li className={`${style.input} ${isFocus == 1 ? style.inputActive : ''}`} onClick={(e) => {
                  e.stopPropagation()
                  setIsFocus(1)
                  proName.current.focus()
                  setIsShowSelect(false)
                }}>
                  <div className={style.projectName}> Project name</div>
                  <input ref={proName} type="text" value={proNameVal} onChange={(e) => setProNameVal(e.target.value)} />
                </li>
              </ul>
            </div>) : (<div className={style.download}>
              <div className={style.downloadBtn}>
                <DownloadOutlined /> &nbsp;
                Download template
              </div>
            </div>)
          }

          <div className={style.clause}>
            <Checkbox className={style.checkbox} onChange={onChange} checked={checked} >
              <label className={style.checkText}>
                Enable <a href="https://unity.cn/plasticscm" target='_blank' rel="noreferrer">Version Control</a> and agree <a href="https://unity.cn/plasticscm/legal" target='_target' >Terms of Service</a>
              </label>
            </Checkbox>
            {checked ? (<ul className={style.options}>
              <li className={`${style.input} ${isFocus == 2 ? style.inputActive : ''}`} onClick={(e) => {
                e.stopPropagation()
                setIsFocus(2)
                setIsShowSelect(true)
              }}>
                <div style={{ float: 'left' }}>
                  <div className={style.projectName}> Please select org</div>
                  <span>{username}</span>
                </div>
                <div style={{ float: 'right', lineHeight: '44px' }}>
                  <CaretDownOutlined />
                </div>
              </li>
              {
                isShowSelect ? (<li className={style.selectOrg}>
                  {
                    [1, 2].map((n) => (
                      <div key={n} className="react-contexify__item" data-value={`username${n}`} onClick={(e) => {
                        let val = e.currentTarget.getAttribute('data-value')
                        if (e.currentTarget && val) {
                          setUsername(val)
                        }
                      }}>
                        username{n}
                      </div>
                    ))
                  }

                </li>) : (<></>)
              }

            </ul>) : (<></>)}

          </div>

        </div>
      </div>

      <div className={style.footer}>
        <div className={style.btns}>
          <Button type='default' className={style.cancel} onClick={() => {
            WindowManager.closeWindow(props.id)
          }}>Cancel</Button>
          <Button type='primary' className={templateInfo && templateInfo.isDownload ? style.create : style.disabled} disabled={templateInfo && !templateInfo.isDownload} onClick={() => {
            WebsocketTool.Instance.ProjectManager_creatProject(proNameVal);
            mask.current.style.display = 'block'
            timer = setTimeout(() => {
              mask.current.style.display = 'none'
              WindowManager.closeWindow(props.id)
            }, 1000);
          }} >Create project</Button>
        </div>
      </div>

      <div ref={mask} className={style.mask}>
        <span className={style.icon}>
          <LoadingOutlined />
        </span>
      </div>
    </div>
  )
}
