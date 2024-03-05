import React, {useContext, useEffect} from 'react'
import { Menu, Item, Submenu, ItemParams  } from 'react-contexify'
import { EditorEventMgr } from '../../../../Game/Event/EditorEventMgr'
import { WebsocketTool } from '../../../../CodeEditor/code/WebsocketTool'
import { nanoid } from 'nanoid'
import {ProjectContext} from '../../layout'
import {FileInfoManager} from "../../../../CodeEditor/code/FileInfoManager";
import { EditorAssetInfo } from '../../../../Game/Asset/EditorAssetInfo'


export const ContextMenu = (props: { menuId: string, emitSetData?: Function }) => {
    const {treeData, setTreeData, setSelectNode} = useContext(ProjectContext)

    const treeRightMenu2 = {
        menuId: props.menuId,
        items2: [
          {
            key: 'add',
            name: 'Create Folder',
            handler: (props: ItemParams) => {
              onAddb(props.props.key, 0);
            }
          },
          {
            key: 'addTsDir',
            name: 'Create Typescript Project',
            handler: (props: ItemParams) => {
              onAddb(props.props.key, 1);
            }
          },
          {
            key: 'addTs',
            name: 'Create TypeScript File',
            handler: (props: ItemParams) => {
              onAddb(props.props.key, 2);
            }
          },
          {
            key: 'edit',
            name: 'Rename File',
            handler: (props: ItemParams) => {
              if (props.props) {
                console.log("name:", (props.props as EditorAssetInfo).value);
                
                onEditb(props.props.key);
              }
            }
          },
          {
            key: 'del',
            name: 'Delete File',
            handler: (props: ItemParams) => {
              if (props.props) {
                onDeleteb2(props.props);
              }
            }
          },
          {
            key: 'Save',
            name: 'Save File',
            handler: (props: ItemParams) => {
              EditorEventMgr.Instance.emitEvent("OnSave", cb => cb(props.props.key));
            }
          }
        ]
    }

    const onAddb = (key: any, type: number) => {      
        addNode(key, treeData, type)
        setTreeData(treeData.slice())
    }

    const onEditb = (key: string, isnew = false) => {
        editNode(key, treeData)
        setTreeData(treeData.slice())
    }

    //删除文件/文件夹
    const onDeleteb2 = (info: EditorAssetInfo) => {
      if (!info) {
        return;
      }

      let isDeleteFile = info.isLeaf;
      if (isDeleteFile) { //删除文件
        WebsocketTool.Instance.ProjectManager_deleteFile(info.key);
      } else { //删除文件夹
        WebsocketTool.Instance.ProjectManager_deleteDir(info.key);
      }
    }
    
    const addNode = (key: any, data2: any, type: number) => {
        data2.forEach((item2: any) => {
            if (item2.key === key) {
                let nameList = [];
                item2.children.forEach((item3: any) => {
                    nameList.push(item3.value)
                })
                const newKey = nanoid()
                const isLeafa = type == 2;
                let nameCount = 1
                let newName = "NewFile";
                if (!isLeafa) {
                    newName = "NewDirectory"
                }
                let setName = newName;
                while (nameList.indexOf(setName) != -1) {
                    setName = newName + "_" + nameCount
                    nameCount++
                }
                if(!item2.children) {
                    item2.children = []
                }
                item2.children.push({
                    value: setName,
                    defaultValue: setName,
                    pareKey: key,
                    isLeaf: isLeafa,
                    dirType: type,
                    key: newKey// 这个 key 应该是唯一的,nanoid库，可以产生唯一的key
                })
                
                onEditb(newKey, true);
                return
            }
            if (item2.children) {
                addNode(key, item2.children, type)
        }})
    }
    
    const editNode = (key: string, data2: EditorAssetInfo[]) => {
        data2.forEach((item2: EditorAssetInfo) => {
            if (item2.key === key) {
              //item2.defaultValue = item2.value;
              item2.isEditable = true
              // 是新增才会触发
              if(props.emitSetData && !item2.id) {
                props.emitSetData(item2)
              }
            } else {
              item2.isEditable = false
            }
            item2.value = item2.defaultValue // 当某节点处于编辑状态，并改变数据，点击编辑其他节点时，此节点变成不可编辑状态，value 需要回退到 defaultvalue
            
            if (item2.children) {
              editNode(key, item2.children)
            }

            // if (item2.children || item2.childrenFile) {
            //   let arr: EditorAssetInfo[] = [];
            //   if (item2.children) {
            //     arr.push(...item2.children);
            //   }
            //   if (item2.childrenFile) {
            //     arr.push(...item2.childrenFile);
            //   }
            //   editNode(key, arr)
            // }
        })
    }
    
    return (
        <Menu id={treeRightMenu2.menuId}>
            {treeRightMenu2.items2.map(item2 => (
              <Item key={item2.key} onClick={item2.handler}>
                {item2.name}
              </Item>
              // 若需要增加子菜单，用下面这组件包裹
              // <Submenu label="Submenu" key={item2.key}>
              //   <Submenu label="111">
              //     <Item key={item2.key} onClick={item2.handler}>
              //       {item2.name}
              //     </Item>
              //   </Submenu>
              //   <Item key={item2.key} onClick={item2.handler}>
              //       {item2.name}
              //     </Item>
              // </Submenu>
            ))}
        </Menu>
    )
}
