import React, { Component } from 'react'
import { Menu, Dropdown } from 'antd'
import 'antd/dist/antd.css' //引入antd样式
import './index.css'
import { DownOutlined, RightOutlined } from '@ant-design/icons'
const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        2nd menu item
        <RightOutlined />
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer">
        3rd menu Item
      </a>
    </Menu.Item>
    <Menu.Item danger>a danger item</Menu.Item>
  </Menu>
)
class Index extends Component {
  render() {
    return (
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            下拉菜单 <DownOutlined />
          </a>
        </Dropdown>
      </div>
    )
  }
}

export default Index
