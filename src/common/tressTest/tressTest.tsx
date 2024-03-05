// 树形目录

import * as React from 'react'
// import { Tree, Input } from 'antd'
// import './index.css'
// import 'antd/dist/antd.css'
// import { useState, useEffect } from 'react'

// import 'react-contexify/dist/ReactContexify.min.css'
// import TreeRight from './TreeRight'
// import { PageContainer } from '@ant-design/pro-layout' //引入的页面容器
// import ProCard from '@ant-design/pro-card' //页内容器卡片

//模拟的假数据
// const list: any = [
//   {
//     id: 1,
//     title: '一级节点',
//     parentId: 0,
//     key: '0-0',
//     // isValid: true,
//     // canAddChild: true,
//     // parent: null,
//     children: []
//   },
//   {
//     id: 2,
//     title: '二级节点',
//     parentId: 1,
//     key: '0-0-0',
//     // isValid: true,
//     // canAddChild: true,
//     // parent: null,
//     children: []
//   },
//   {
//     id: 3,
//     title: '三级节点',
//     parentId: 2,
//     key: '0-0-0-0',
//     // isValid: true,
//     // canAddChild: true,
//     // parent: null,
//     children: []
//   },
//   {
//     id: 4,
//     title: '一级节点',
//     parentId: 0,
//     key: '0-1',
//     // isValid: true,
//     // canAddChild: true,
//     // parent: null,
//     children: []
//   }
// ]

export const TreeTest: any = () => {
  // const [data, setData] = useState(list) // 树形 数据

  // const rootValue = 0
  // const digui: any = (list: any, rootValue: any) => {
  //   // 将列表型数据转化成树型数据 使用递归算法
  //   // 遍历树型有一个重点 必须先找到一个头部（根部）
  //   var arr: any = [] // 定义一个数组用于接收找到的数据
  //   list.forEach((item: { parentId: any; id: any; children: any }) => {
  //     if (item.parentId === rootValue) {
  //       // 找到根数据 然后去查找他的子节点
  //       const children = digui(list, item.id)
  //       if (children.length) {
  //         // 如果children的长度大于0 说明有且找到了他的子节点
  //         item.children = children
  //       }
  //       arr.push(item) // 将内容加到数组中
  //     }
  //   })
  //   return arr
  // }
  // const [result, setresult] = useState([])
  // useEffect(() => {
  //   setresult(digui(list, 0))
  // }, [])

  // //右键菜单栏
  // const treeRightMenu = {
  //   menuId: '1',
  //   items: [
  //     {
  //       key: 'add',
  //       name: '添加同级节点',
  //       handler: (props: any) => {
  //         handleItemClick('add', props)
  //       }
  //     },
  //     {
  //       key: 'edit',
  //       name: '修改此节点',
  //       handler: (props: any) => {
  //         handleItemClick('edit', props)
  //       }
  //     },
  //     {
  //       key: 'addSub',
  //       name: '添加子节点',
  //       handler: (props: any) => {
  //         handleItemClick('addSub', props)
  //       }
  //     },
  //     {
  //       key: 'del',
  //       name: '删除此节点',
  //       handler: (props: any) => {
  //         handleItemClick('del', props)
  //       }
  //     }
  //   ]
  // }

  // const [title, setTitle] = useState<string>('')
  // // 点击树节点
  // const handleSelect = (selectedKeys: any, info: any) => {
  //   const txt: string = info.selectedNodes[0]?.title
  //   setTitle(txt)
  // }
  // // 右键菜单点击事件，props里就是节点数据
  // const handleItemClick = (type: any, item: any) => {
  //   console.log('右键菜单点击-key')
  //   console.log(type)
  //   console.log('右键菜单点击-item')
  //   console.log(item.props)
  // }

  return (
    <div></div>
    // <div className="treeTest-box">
    //   <div className="tree-content">
    //     {/* <DirectoryTree multiple treeData={result} /> */}
    //     <PageContainer breadcrumbRender={false}>
    //       <ProCard split="vertical">
    //         <ProCard>
    //           <TreeRight
    //             dataSource={result}
    //             contextMenu={treeRightMenu}
    //             onSelect={handleSelect}
    //           />
    //         </ProCard>
    //       </ProCard>
    //     </PageContainer>
    //   </div>
    // </div>
  )
}
