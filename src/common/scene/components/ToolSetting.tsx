import React, { useState, useContext } from 'react'
import { CaretDownFilled, CheckOutlined, createFromIconfontCN, GlobalOutlined } from '@ant-design/icons'
import { Menu } from 'antd';
import { Dropdown, Space } from 'antd';

export const ToolSetting = () => {
  const [cop, setCop] = useState('center')
  const [gol, setGol] = useState('local')

  const IconFont = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/c/font_3849507_brwyhu0v6dw.js'
    ],
  });

  const menu = (
    <Menu>
      <Menu.Item key={'center'} onClick={() => {
        setCop('center')
      }}>
        <span className={cop == 'center' ? "scene-check scene-checked" : 'scene-check'}><CheckOutlined /></span> Center
      </Menu.Item>
      <Menu.Item key={'pivot'} onClick={() => {
        setCop('pivot')
      }}>
        <span className={cop == 'pivot' ? "scene-check scene-checked" : 'scene-check'}><CheckOutlined /></span>Pivot
      </Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu>
      <Menu.Item key={'global'} onClick={() => {
        setGol('global')
      }}><span className={gol == 'global' ? "scene-check scene-checked" : 'scene-check'}><CheckOutlined /></span>Global</Menu.Item>
      <Menu.Item key={'local'} onClick={() => {
        setGol('local')
      }}><span className={gol == 'local' ? "scene-check scene-checked" : 'scene-check'}><CheckOutlined /></span>Local</Menu.Item>
    </Menu>
  )

  return (
    <div className='scene-tool'>
      <IconFont type='icon-custom-suspend' className='tool-icon'></IconFont>

      <Dropdown trigger={['click']} overlay={menu}>
        <Space>
          <IconFont type='icon-position' />
          <CaretDownFilled />
        </Space>
      </Dropdown>
      &nbsp;
      <Dropdown trigger={['click']} overlay={menu2}>
        <Space>
          {gol == 'global' ? <GlobalOutlined /> : <IconFont type='icon-box' />}
          <CaretDownFilled />
        </Space>
      </Dropdown>
    </div>
  )
}
