import {
  BgColorsOutlined,
  CoffeeOutlined,
  EditOutlined,
  FileOutlined,
  HighlightOutlined,
  PieChartOutlined
} from '@ant-design/icons'
import './modalColor.css'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, Button } from 'antd'
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
// import { Link, Outlet, useNavigate } from 'react-router-dom'

// import perf from './common/color1/在线调色板.html'
// var perf: any = require('./common/color1/在线调色板.html')

const { Header, Content, Footer, Sider } = Layout
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode
): MenuItem {
  return {
    key,
    icon,
    label
  } as MenuItem
}

const items: any = [
  getItem('在线调色板', '0', <PieChartOutlined />),
  getItem('RGB颜色表', '1', <CoffeeOutlined />),
  getItem('颜色轮盘表', '2', <BgColorsOutlined />),
  getItem('颜色选择板', '3', <HighlightOutlined />),
  getItem('调色板工具', '4', <FileOutlined />),
  // getItem('色深工具器', '5', <EditOutlined />)
]

interface propsType {
  color: m4m.math.color[],
  setColor: Dispatch<SetStateAction<m4m.math.color[]>>,
  handleCancel: () => void,
  handleOk: ()=> void
}

const ModalColor = (props: propsType) => {
  const { color, setColor } = props

  const [collapsed, setCollapsed] = useState(false)
  const [item, setItem] = useState(0)

  const onClick = (e: any) => {
    console.log('click', e.key)
    setItem(e.key)
  }

  useEffect(() => {   //为了避免作用域及缓存
    const receiveMessageFromIndex = (event: { data: string }) => {
      if (event != undefined && event != null) {
        let arr: m4m.math.color[] = [];
        if (typeof event.data == 'string') {
          let r: number, g: number, b: number, a: number = 1
          if (event.data.match(/^#/)) {
            r = Number(parseInt(event.data.slice(1, 3), 16) / 255)
            g = Number(parseInt(event.data.slice(3, 5), 16) / 255)
            b = Number(parseInt(event.data.slice(5, 7), 16) / 255)
            a = event.data.slice(7) ? Number(parseInt(event.data.slice(7), 16)) : 1
          } else if (event.data.match(/^rgba?/)) {
            let numColor = event.data.match(/\(.*?\)/i)[0].slice(1, -1).split(',');
            r = Number(numColor[0]) / 255
            g = Number(numColor[1]) / 255
            b = Number(numColor[2]) / 255
            a = numColor[3] ? Number(numColor[3]) : 1
          }
          let rgbColor = new m4m.math.color(r, g, b, a)
          arr.push(rgbColor)
          setColor([...arr]);
        } else {
          let colorData = event.data as string[];
          if (Object.prototype.toString.call(colorData).slice(7, -1) == 'Array') {
            colorData.forEach((item) => {
              let r: number, g: number, b: number, a: number = 1
              if (item.match(/^#/)) {
                r = Number(parseInt(item.slice(1, 3), 16) / 255)
                g = Number(parseInt(item.slice(3, 5), 16) / 255)
                b = Number(parseInt(item.slice(5, 7), 16) / 255)
                a = item.slice(7) ? Number(parseInt(item.slice(7), 16)) : 1
              }
              let rgbColor = new m4m.math.color(r, g, b, a)
              arr.push(rgbColor)
            })
            setColor([...arr]);
          }

        }
      }
    }
    //监听message事件
    window.addEventListener("message", receiveMessageFromIndex, false);

  }, [])

  return (
    <div className="modalColor-box">
      <Layout style={{ minHeight: '460px' }}>
        <Sider
        // collapsible
        // collapsed={collapsed}
        // onCollapse={value => setCollapsed(value)}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={['0']}
            mode="inline"
            items={items}
            onClick={onClick}
          />
        </Sider>
        <Layout className="site-layout">
          {item == 0 && (
            <Content style={{ margin: '0 16px' }}>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>在线调色板</Breadcrumb> */}
              <div
                className="site-layout-background"
                style={{ height: '100%' }}
              >
                <iframe
                  src="/common/color1/color1.html"
                  style={{ width: '100%', border: '0px', height: '100%' }}
                  scrolling="auto"
                ></iframe>
              </div>
            </Content>
          )}
          {item == 1 && (
            <Content style={{ margin: '0 16px' }}>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>RGB颜色值</Breadcrumb> */}
              <div
                className="site-layout-background"
                style={{ height: '100%' }}
              >
                <iframe
                  // className="mainFrame2"
                  src="/common/color2/color2.html"
                  style={{ width: '100%', border: '0px', height: '100%' }}
                  scrolling="auto"
                ></iframe>
              </div>
            </Content>
          )}
          {item == 2 && (
            <Content style={{ margin: '0 16px' }}>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>颜色轮盘</Breadcrumb> */}
              <div
                className="site-layout-background"
                style={{ height: '100%' }}
              >
                <iframe
                  // className="mainFrame2"
                  src="/common/color3/color3.html"
                  style={{ width: '100%', border: '0px', height: '100%' }}
                  scrolling="auto"
                ></iframe>
              </div>
            </Content>
          )}
          {item == 3 && (
            <Content style={{ margin: '0 16px' }}>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>在线调色板</Breadcrumb> */}
              <div
                className="site-layout-background"
                style={{ height: '100%' }}
              >
                <iframe
                  // className="mainFrame2"
                  src="/common/color4/color4.html"
                  style={{ width: '100%', border: '0px', height: '100%' }}
                  scrolling="auto"
                ></iframe>
              </div>
            </Content>
          )}
          {item == 4 && (
            <Content style={{ margin: '0 16px' }}>
              {/* <Breadcrumb style={{ margin: '16px 0' }}>在线调色板</Breadcrumb> */}
              <div
                className="site-layout-background"
                style={{ height: '100%' }}
              >
                <iframe
                  // className="mainFrame2"
                  src="/common/color5/color5.html"
                  id='iframe5'
                  style={{ width: '100%', border: '0px', height: '100%' }}
                  scrolling="auto"
                ></iframe>
              </div>
            </Content>
          )}

          {/* 
          {item == 5 && (
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>dopelycolors</Breadcrumb>
              <div
                className="site-layout-background"
                style={{ height: '100%' }}
              >
                <iframe
                  // className="mainFrame2"
                  src="/common/color6/color6.html"
                  style={{ width: '100%', border: '0px', height: '100%' }}
                  scrolling="auto"
                ></iframe>
              </div>
            </Content>
            )}
          */}

        </Layout>
      </Layout>
      <Footer style={{ background: '#363636', textAlign: 'right'}}>
          {/* onClick={handleCancel} */}
          <Button style={{background: '#222'}} onClick={props.handleCancel}>关闭</Button>
          {/* onClick={handleOk} */}
          <Button style={{background: '#222'}} onClick={props.handleOk}>提交</Button>
      </Footer>
    </div>
  )
}

export default ModalColor
