import React, { useState } from 'react'
import { mixerInstanceType } from '../AudioMixerMgr'
import { Mixer } from '../mixer/Mixer'

export function MixerPanel(datas) {

  // 应为接受数据 先写成静态数据
  const [mixerList, setMixerList] = useState<mixerInstanceType[]>([
    {
      id: 0,
      name: 'Master',
      effects: [
        {
          id: 0,
          type: 'slider',
          title: 'Attenuation',
          borderColor: 'rgb(237, 166, 1)',
          attr: { value: 0, onChange() { }, setRefresh() { } }
        }
      ]
    },
    {
      id: 1,
      name: 'New Group',
      effects: [
        {
          id: 1,
          type: 'slider',
          title: 'Attenuation',
          borderColor: 'rgb(237, 166, 1)',
          attr: { value: 0, onChange() { }, setRefresh() { } }
        }
      ]
    }
  ])

  return (
    <div className='mixer-panel'>
      {mixerList.length ? mixerList.map((item) => <Mixer key={item.id} {...item} />) : (<></>)}
    </div>
  )
}
