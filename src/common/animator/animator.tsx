import { EyeInvisibleOutlined, EyeOutlined, MenuOutlined, PlusOutlined, SearchOutlined, SettingFilled } from '@ant-design/icons'
import { Input, Progress } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
import { EditorInputMgr } from '../../Game/Input/EditorInputMgr'
import { IAttributeData } from '../attribute/Attribute'
import { AttributeManager } from '../attribute/AttributeManager'
import { LayerCom } from './components/layerCom'
import ParamCom from './components/paramCom'
// import { AnimatorMgr, layerInstance, layerType } from './animatorMgr'
import './index.css'

enum stateEmun {
  entry,
  exit,
  any,
  new
}

interface aniStatesType {
  type: stateEmun;
  id: number;
  name: string;
  classList: string[];
  position: { x: number, y: number };
  // 连线的数据
  transitions?: []
}

export interface layerInstance {
  id: number;
  name: string;
  weight: number;
  setting: IAttributeData[];
  states?: []
}

export function Animator() {
  // 拖拽侧边栏
  const border = useRef<HTMLDivElement>(null);
  const box1 = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<number>(240);
  const [isShowSide, setIsShowSide] = useState<boolean>(true);

  // layer / parameters
  const [controllerIndex, setControllerIndex] = useState<number>(0);

  const panel = useRef<HTMLDivElement>(null);

  const panelMenu = useRef<HTMLDivElement>(null);

  const [lineActive, setLineActive] = useState(null);

  useEffect(() => {
    if (border.current) {
      EditorInputMgr.Instance.addElementEventListener(border.current, 'TouchDrag', (touch) => {
        if (box1.current) {
          let offsetX = touch.x - box1.current.getBoundingClientRect().left;
          if (offsetX > 210 && offsetX < 600) {
            setBoxWidth(offsetX)
            border.current.style.left = offsetX + 'px';
          }
        }
      })
    }
    document.addEventListener('click', () => {
      panelMenu.current.style.display = 'none';
      panelMenu.current.style.opacity = '0';
      setLineActive(null)
    })
    return () => {
      document.removeEventListener('click', () => { })
    }
  }, []);

  // 面板中静态数据
  const [aniStates, setAniStates] = useState<aniStatesType[]>([
    {
      type: stateEmun.entry,
      id: 0,
      name: 'Entry',
      position: { x: 50, y: 200 },
      classList: ['state', 'entry'],
      transitions: []
    },
    {
      type: stateEmun.exit,
      id: 1,
      name: 'Exit',
      position: { x: 550, y: 200 },
      classList: ['state', 'exit'],
      transitions: []
    },
    {
      type: stateEmun.any,
      id: 2,
      name: 'Any State',
      position: { x: 50, y: 100 },
      classList: ['state', 'any'],
      transitions: []
    },
    {
      type: stateEmun.new,
      id: 3,
      name: 'New State',
      position: { x: 250, y: 100 },
      classList: ['state', 'new-state'],
      transitions: []
    },
    {
      type: stateEmun.new,
      id: 4,
      name: 'New State',
      position: { x: 250, y: 150 },
      classList: ['state', 'new-state'],
      transitions: []
    },
  ]);

  // 点击选中的模块
  const [stateActive, setStateActive] = useState<number>(null);

  const [lineList, setLineList] = useState([
    // 模块之间的线段连接
    {
      id: 0,
      from: 0,
      to: 3,
      path: {
        startX: 0,
        startY: 0,
        x1: 50,
        y1: 50,
        x2: 100,
        y2: 100,
      }
    }
  ])

  const showMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (panelMenu && panelMenu.current) {
      panelMenu.current.style.opacity = '1';
      panelMenu.current.style.display = 'block';
      panelMenu.current.style.left = e.clientX - panel.current.getBoundingClientRect().left + 'px';
      panelMenu.current.style.top = e.clientY - panel.current.getBoundingClientRect().top + 'px';
    }
  }

  return (
    <div className='animator'>
      {
        isShowSide ? (<>
          <div ref={box1} className="box1" style={{ width: `${boxWidth}px` }}>
            <div className="grid-line" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <div className={controllerIndex == 0 ? "controller-title active" : 'controller-title'} onClick={() => setControllerIndex(0)}>Layers</div>
                <div className={controllerIndex == 1 ? "controller-title active" : 'controller-title'} onClick={() => setControllerIndex(1)}>Parameters</div>
              </div>

              <div>
                {isShowSide ? <EyeOutlined onClick={() => { setIsShowSide(false); setBoxWidth(0) }} /> : (<></>)}
              </div>
            </div>
            <div className="body two">
              {
                controllerIndex == 0 ? (<LayerCom />) : (<ParamCom />)
              }
            </div>
          </div>
        </>) : (<></>)
      }
      <div
        ref={border}
        style={{
          width: isShowSide ? '4px' : '0px',
          height: '100%',
          position: 'absolute',
          left: `${boxWidth}px`,
          backgroundColor: 'rgb(0, 0, 0)',
          zIndex: 0
        }}
      ></div>
      <div className="box2" style={{ width: `calc(100% - ${boxWidth}px)`, transform: isShowSide ? 'translateX(4px)' : '' }}>
        <div className="grid-line" style={{ justifyContent: 'space-between' }}>
          {!isShowSide ? <EyeInvisibleOutlined onClick={() => { setIsShowSide(true); setBoxWidth(240) }} /> : (<></>)}
          <div style={{ display: 'flex' }}>
            <div className="layer-bread">
              Base Layer
            </div>
            <span style={{ width: 0, height: 0, padding: 0, margin: 0, backgroundColor: '#333333', border: `10px solid rgb(38,38,38)`, borderLeftColor: `#333` }}></span>
          </div>
          <div className='layer-bread'>
            Auto Live Link
          </div>
        </div>
        <div className="panel-box">
          <div className="panel" ref={panel} onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            showMenu(e)
          }} >

            <svg width="4000" height="4000" version="1.1" xmlns="http://www.w3.org/2000/svg">
              {/* 箭头 */}
              <defs>
                <marker id="arrow" markerUnits="strokeWidth" markerWidth="6" markerHeight="6" viewBox="0 0 6 6" refX="3"
                  refY="3" orient="auto">
                  <path d="M1,1 L5,3 L1,5 L1,1" fill="#993600" />
                </marker>
              </defs>
              {/* 起点 Mx,y 中间箭头 Lx1,y1 结束点 Lx2,y2 */}
              {/* {
                lineList && lineList.length ? lineList.map((item) => (<path key={item.id}
                  d={`M${item.path.startX},${item.path.startY} L${item.path.x1},${item.path.y1} L${item.path.x2},${item.path.y2}`} stroke={item.id == lineActive ? '#6BB2FF' : '#4E3400'} strokeWidth='3'
                  markerMid='url(#arrow)' onClick={(e) => {
                    e.stopPropagation()
                    setLineActive(item.id)
                  }}>
                </path>)) : (<></>)
              } */}
            </svg>

            {
              aniStates && aniStates.length ? aniStates.map((item) => {
                return (<div
                  onClick={(e) => {
                    setStateActive(item.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showMenu(e);
                  }}
                  key={item.id} className={`${item.classList.join(' ')} ${item.id == stateActive ? 'state-active' : ''}`} style={{ left: item.position.x + 'px', top: item.position.y + 'px' }}
                >
                  {item.name}
                </div>)
              }) : (<></>)
            }
          </div>
          {/* 右键菜单 */}
          {
            <div ref={panelMenu} className='react-contexify' style={{ position: 'absolute' }}>
              {/* map多项 */}
              <div className="react-contexify__item">
                <div className="react-contexify__item__content">
                  createState
                </div>
              </div>
            </div>
          }
        </div>
        <div className='grid-line grid-line-bottom'>
          Scenes/New Animator Controller.controller
        </div>
      </div>
    </div>
  )
}
