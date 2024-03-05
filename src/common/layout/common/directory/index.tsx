/**
 * 目录数据
 */
import React, { useState, useEffect, useContext } from 'react'
import { Tree } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import './index.css'
import 'react-contexify/dist/ReactContexify.min.css'
import { EditorEventMgr } from '../../../../Game/Event/EditorEventMgr'
import { DirectoryTreeProps } from 'antd/lib/tree'
import {DropFileCallBack} from "../../../../Game/ExportManager/DropFileManager";
import {EditorApplication} from "../../../../Game/EditorApplication";
import {FileInfoManager} from "../../../../CodeEditor/code/FileInfoManager";
import {EditorAssetInfo} from "../../../../Game/Asset/EditorAssetInfo";
import {ProjectContext} from '../../layout'
import NameInput from '../NameInput/NameInput'
import { ContextMenu } from '../ContextMenu/ContextMenu' 
import { useContextMenu } from 'react-contexify'


const { TreeNode, DirectoryTree } = Tree

export const Directory = () => {
  const menuId = '01'
  const {selectNode, setSelectNode, expandedKeys, setExpandedKeys, treeData} = useContext(ProjectContext)

  const rootKey: string = (treeData && treeData[0]) ? treeData[0].key : null;

  const renderTreeNodes2 = (data2: any) => {
    let nodeArr2: any[] = data2.map((item2: any) => {
      if (item2.isEditable) {
        item2.title = (
            <NameInput item={item2}></NameInput>
        )
      } else {
        item2.title = (
            <div
                className="titleV2"
                // onClick={(e: any) => {
                //   // e.stopImmediatePropagation()
                //   var titleV: any = document.querySelectorAll('.titleV2')
                //   for (let y = 0; y < titleV.length; y++) {
                //     titleV[y].style.background = '#333'
                //   }
                //   e.target.parentNode.style.background = 'rgba(192, 191, 191, 0.1)'
                // }}
            >
              <span>{item2.value}</span>
            </div>
        )
      }
      // 特殊文件 不在菜单显示
      if(!(!item2.isLeaf && item2.DirType != "")) {
        if (item2.children) {
          return (
              <TreeNode
                  title={item2.title}
                  key={item2.key}
              >
                {renderTreeNodes2(item2.children)}              
              </TreeNode>
          )
        }
        return <TreeNode title={item2.title} key={item2.key}/>
      }
    })
    return nodeArr2
  }

  // 选中触发
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    
    const dirInfo: EditorAssetInfo = info.selectedNodes[0] as EditorAssetInfo;
    const selectedKey = keys[0].toString()

    setSelectNode(dirInfo)

    // 选中的节点没有展开
    if(!info.node.expanded) {
      setExpandedKeys([...expandedKeys, selectedKey])
    } else {
      setExpandedKeys(expandedKeys.filter((key) => key !== selectedKey))
    }

    let assetData: EditorAssetInfo
    if (keys.length > 0) {
      assetData = FileInfoManager.Instance.getDirByKey(selectedKey);
      EditorApplication.Instance.selection.setActiveAsset(assetData);
    }
    EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(dirInfo));

    // getMainDirAll(dirInfo)
    //console.log(assetData);
    //console.log(dirInfo);
    
    
    // if(dirInfo.id === 0) {

    // }

    // 当前选中节点祖先节点，直到祖先节点是 Contents 
    // 把该祖先节点 全部数据扁平化
    // input 输入的话 就把 扁平化数据进行筛选传给 data
    // 如果选中（单击），清空输入，当前data, 显示该节点父目录（ResourceFileUpDate（该节点父目录））; 如果没有选中，应该将输入搜索前的选中节点，传给(ResourceFileUpDate(之前选中节点))
    // 
  };

  const getMainDirAll = (dirInfo) => {
    // while
  }
  
  // 展开触发
  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    // console.log('Trigger Expand', keys, info);
  };

  const {show} = useContextMenu({
    id: menuId
  })

  // 右键显示菜单
  const handleContextMenu2 = (event: any, node: any) => {
    
    let assetData: EditorAssetInfo
    if(node.pos === "0-0") {
      assetData = FileInfoManager.Instance.rootFolder
    } else {
      assetData = FileInfoManager.Instance.getDirByKey(node.key);
    }
    
    setSelectNode(assetData)
    EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(assetData));

    show(event, {
      props: assetData
    })
  }

  return (
      <div className="treeTest-box"
           ref={
             (ele) => {
               if (ele) {
                 let rt = selectNode.key ?? rootKey;
                 if (!rt) {
                   return;
                 }
                 //添加拖拽上传文件操作
                 ele.ondrop = DropFileCallBack;
               }
             }
           }
      >
        {
          treeData?.length > 0 ? (
            <DirectoryTree
              showIcon
              treeData={treeData}
              switcherIcon={<CaretDownOutlined/>}
              onSelect={onSelect}
              onExpand={onExpand}
              selectedKeys={[selectNode.key]}
              expandedKeys={expandedKeys}
              onRightClick={({event, node}) => {
                handleContextMenu2(event, node)
              }}
              >{renderTreeNodes2(treeData)}
            </DirectoryTree>
          ) : null
        }
        <ContextMenu menuId={menuId}></ContextMenu>
      </div>
  )
}
