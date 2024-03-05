import { CaretDownFilled } from '@ant-design/icons';
import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.css';
import { MixerMenu } from './mixerMenu/MixerMenu';
import { MixerPanel } from './mixerPanel/MixerPanel';



export const AudioMixer = () => {
  const [isShowParam, setIsShowParam] = useState<boolean>(false);
  useEffect(() => {
    document.addEventListener('click', () => {
      setIsShowParam(false);
    })
    return () => {
      document.removeEventListener('click', () => {
        setIsShowParam(false);
      })
    }
  }, [])

  return (
    <div className='audio-mixer'>
      <div className="audio-content-1">
        <div></div>
        <div className="audio-content1-box" onClick={(e) => {
          e.stopPropagation()
          setIsShowParam(() => !isShowParam)
        }}>
          <span>Exposed Parameters(0) <CaretDownFilled /></span>
          {isShowParam ? (<ul className='params-list'>
            <li className='params-li'>List is Empty</li>
          </ul>) : (<></>)}
        </div>
      </div>
      <Divider />
      <div className="audio-content-2">
        {/* 左侧菜单 */}
        <div className="audio-menu">
          <MixerMenu />
        </div>
        <div
          style={{
            width: '1px',
            height: '100%',
            position: 'absolute',
            left: '200px',
            backgroundColor: 'rgb(0, 0, 0)',
            zIndex: 0,
            cursor: 'ew-resize',
          }}
        ></div>
        {/* 右侧窗口 */}
        <div className="audio-list">
          <MixerPanel />
        </div>
      </div>
    </div>
  )
}
