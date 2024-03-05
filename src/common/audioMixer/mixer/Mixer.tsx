import { Divider } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { EditorInputMgr } from '../../../Game/Input/EditorInputMgr';
import { ContextMenuManager } from '../../contextMenu/ContextMenuManager';
import { mixerInstanceType } from '../AudioMixerMgr';

export function Mixer(data: mixerInstanceType) {
  const [mixer, setMixer] = useState<mixerInstanceType>({ ...data })
  const slider = useRef<HTMLDivElement>(null);
  const scale = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (slider.current && scale.current) {
      EditorInputMgr.Instance.addElementEventListener(slider.current, 'TouchDrag', (touch) => {
        let posiY = Math.floor(((touch.y - scale.current.getBoundingClientRect().top) / scale.current.clientHeight) * 100)

        if (posiY >= 0 && posiY <= 100) {
          setMixer((prev) => {
            return {
              ...prev, effects: prev.effects.map((item => {
                return { ...item, attr: { ...item.attr, value: (posiY - 20) * -1 } }
              }))
            }
          })
        } else if (posiY < 0) {
          slider.current.style.top = 0 + '%'
        } else if (posiY > 100) {
          slider.current.style.top = 100 + '%'
        }
      })
    }
  }, [])

  const [btnS, setBtnS] = useState<boolean>(false);
  const [btnM, setBtnM] = useState<boolean>(false);
  const [btnB, setBtnB] = useState<boolean>(false);

  return (
    <div className='mixer' onContextMenu={(e) => {
      e.preventDefault()
    }}>
      {/* 选中边框 */}
      {/* <div className="mixer-select"></div> */}
      <div className="mixer-name">{mixer ? mixer.name : ''}</div>
      <div className="mixer-scale">
        <div className="line-scale">
          <div className="center-line"></div>
          <div className="volume-style"></div>
        </div>
        <div ref={scale} className="num-scale">
          <ul className='rule'>
            <li className='rule-scale'>
              <span className="rule-line"></span>
              <span className='rule-num'>20</span>
            </li>
            <li className='rule-scale'>
              <span className="rule-line"></span></li>
            <li className='rule-scale'>
              <span className="rule-line"></span>
              <span className='rule-num'>0</span>
            </li>
            <li className='rule-scale'>
              <span className="rule-line"></span></li>
            <li className='rule-scale'>
              <span className="rule-line"></span>
              <span className='rule-num'>-20</span>
            </li>
            <li className='rule-scale'>
              <span className="rule-line"></span></li>
            <li className='rule-scale'>
              <span className="rule-line"></span>
              <span className='rule-num'>-40</span>
            </li>
            <li className='rule-scale'>
              <span className="rule-line"></span></li>
            <li className='rule-scale'>
              <span className="rule-line"></span>
              <span className='rule-num'>-60</span>
            </li>
            <li className='rule-scale'>
              <span className="rule-line"></span></li>
            <li className='rule-scale'>
              <span className="rule-line"></span>
              <span className='rule-num'>-80</span>
            </li>
          </ul>
          <div ref={slider} className="rule-silder" style={{ top: `${Math.abs((mixer.effects[0].attr.value - 20))}%` }} >
            <span>
              {mixer.effects[0].attr.value}
            </span>
          </div>
        </div>
      </div>
      <div className='smb'>
        <span>-80.0 dB</span>
        <div className='mixer-btns'>
          <button className={btnS ? 'mixer-btn mixer-btn-o' : 'mixer-btn'}
            onClick={() => setBtnS(prev => !prev)}
          >S</button>
          <button className={btnM && btnS ? 'mixer-btn mixer-btn-g' : btnM && !btnS ? 'mixer-btn mixer-btn-o' : 'mixer-btn'}
            onClick={() => setBtnM(prev => !prev)}
          >M</button>
          <button className={btnB ? 'mixer-btn mixer-btn-b' : 'mixer-btn'}
            onClick={() => setBtnB(prev => !prev)}
          >B</button>
        </div>
      </div>
      <Divider />
      <ul className="mixer-effects">
        {mixer && mixer.effects ? mixer.effects.map((item) => {
          return (<li key={item.id} className='mixer-effect' style={{ borderBottom: `2px solid ${item.borderColor}` }}>
            {item.title}
          </li>)
        }) : (<></>)}

      </ul>
      <div className="add-effect">
        <div className='add-btn' onClick={(e) => {
          e.stopPropagation()
          ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
        }} onContextMenu={(e) => {
          e.preventDefault()
          ContextMenuManager.showContextMenu({ x: e.pageX, y: e.pageY, items: [{ title: '111', onClick() { } }] })
        }}
        >Add...</div>

      </div>
    </div>
  )
}
