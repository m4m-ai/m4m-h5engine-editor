import { Breadcrumb, Divider, Slider, Layout, Space, Input } from 'antd'
import React, {createContext, useState, useEffect} from 'react'
import './index.css'

import sear from '../../assets/搜索.png'
import { Directory } from './common/directory/index'
import { HashRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import ProjectData from './common/data/data'
import {
  CaretDownOutlined,
  EyeInvisibleFilled,
  MacCommandOutlined,
  PlusOutlined,
  ProfileFilled,
  SlidersFilled,
  TagFilled
} from '@ant-design/icons'

import { EditorEventMgr } from '../../Game/Event/EditorEventMgr'
import { FileInfoManager } from "../../CodeEditor/code/FileInfoManager"
import { ContextMenu } from "./common/ContextMenu/ContextMenu"
import { useContextMenu } from 'react-contexify'
import { EventBinder } from '../../Game/Event/EventBinder'

const { Sider } = Layout


const onclick3 = () => {
  //console.log('点击按钮1')
}
const onclick4 = () => {
  //console.log('点击按钮2')
}
const onclick5 = () => {
 // console.log('点击按钮3')
}
const onclick6 = () => {
 // console.log('点击按钮4')
}
const onclick7 = e => {
  var aa: any = document.querySelector('.right-6')
 // console.log('nnnnnnnnnnnnnnnn', aa.style.backgroundColor)
  if (aa.style.backgroundColor == 'rgb(112, 112, 112)') {
    aa.style.backgroundColor = '#363636'
  } else {
    aa.style.backgroundColor = '#707070'
  }
  //console.log('点击按钮5')
}

const ProjectContext = createContext(null); // 创建Context

const Project = () => {

  const [treeData, setTreeData] = useState([]);
  // 菜单选中的项
  const [selectNode, setSelectNode] = useState({})

  // 菜单展开的值
  const [expandedKeys, setExpandedKeys] = useState(['']);

  useEffect(() => {
    let bind = EditorEventMgr.Instance.addEventListener("FileTreeUpDate", (arr) => {
      setTreeData(arr);
    });
    // return ()=> bind.removeListener()
  }, []);

  const menuId= 'ProjectContextMenu'
  const {show} = useContextMenu({
    id: menuId
  })

  // 增加菜单
  const addBtnFn = (event) => {
    //console.log('当前选中的 selectNode', selectNode);
    if(Object.keys(selectNode).length < 1) {
      return
    }
    show(event, {
      props: selectNode
    })
  }

  // 搜索触发
  const searchInputFn = (event) => {
    const { value } = event.target
    //console.log('value', value);
    //console.log(treeData);
    
  }
 
  return (
    <div className="layout-box">
      <div className="layout-content-1">
        <div className="layout-content-left">
          <div className="left-1" onClick={(e) => addBtnFn(e)}>
            <PlusOutlined className="plusO"/>
            <CaretDownOutlined className="caretD"/>
          </div>
        </div>
        {/* 未实现的功能屏蔽: 文件搜索 */}
        {/* <div className="layout-content-right">
          <div className="right-1">
            <Input
              size="small"
              prefix={<img className="searchP" src={sear} />}
              onChange={(e) => searchInputFn(e)}
            />
          </div>
          <div className="right-2">
            <MacCommandOutlined className="macC" onClick={onclick3} />
          </div>
          <div className="right-3">
            <SlidersFilled className="slidersF" onClick={onclick4} />
          </div>
          <div className="right-4">
            <TagFilled className="tagF" onClick={onclick5} />
          </div>
          <div className="right-5">
            <ProfileFilled className="profileF" onClick={onclick6} />
          </div>
          <div className="right-6" onClick={onclick7}>
            <EyeInvisibleFilled className="eyeI" />
            16
          </div>
        </div> */}
      </div>
      <Divider/>
      <div className="layout-content-2">
        <ProjectContext.Provider value={{selectNode, setSelectNode, expandedKeys, setExpandedKeys, treeData, setTreeData}}>
          <Layout>

            {/* 左侧菜单 */}
            <Sider>
              <div className="layout-box-1">
                <div className="lay-0">
                  <Directory/>
                </div>
              </div>
            </Sider>

            {/* 右侧窗口 */}
            <Layout>
              <ProjectData />
            </Layout>
          </Layout>
          <ContextMenu menuId={menuId}></ContextMenu>
        </ProjectContext.Provider>
      </div>
    </div>
  )
}

export default Project
export {ProjectContext}