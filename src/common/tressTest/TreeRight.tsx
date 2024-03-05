//右键点击目录

import { Tree } from 'antd'
import React from 'react'
// import { Menu, Item, useContextMenu } from 'react-contexify'
// import 'react-contexify/dist/ReactContexify.min.css'

type TreeRightProps = {
  dataSource: any[]
  contextMenu: any
  onSelect: (selectedKeys: any, info: any) => void
}

// const MENU_ID = '1';
const TreeRight: React.FC<TreeRightProps> = props => {
  // const { dataSource, contextMenu, onSelect } = props
  // // 右键菜单
  // const ContextMenu = () => (
  //   <Menu id={contextMenu.menuId}>
  //     {contextMenu.items.map((item: any) => (
  //       // 这里需要加key，不然要报错
  //       <Item key={item.key} onClick={item.handler}>
  //         {item.name}
  //       </Item>
  //     ))}
  //   </Menu>
  // )

  // const { show } = useContextMenu({
  //   id: contextMenu.menuId
  // })

  // // 右键显示菜单
  // const handleContextMenu = (event: any, node: any) => {
  //   event.preventDefault()
  //   show(event, {
  //     props: node
  //   })
  // }
  return (
    <div>
      {/* <Tree
        autoExpandParent
        defaultExpandAll
        defaultExpandParent
        treeData={dataSource}
        onSelect={onSelect}
        // 右键事件
        onRightClick={({ event, node }: any) => {
          handleContextMenu(event, node)
        }}
      /> */}
      {/* <ContextMenu /> */}
    </div>
  )
}

export default TreeRight
