import React, {useContext, useEffect} from 'react'
import { Menu, Item } from 'react-contexify'
import { EditorEventMgr } from '../../../../Game/Event/EditorEventMgr'
import { WebsocketTool } from '../../../../CodeEditor/code/WebsocketTool'
import { nanoid } from 'nanoid'
import {ProjectContext} from '../../layout'
import {FileInfoManager} from "../../../../CodeEditor/code/FileInfoManager";


export const ContextMenu = (props) => {
    const {treeData, setTreeData, setSelectNode} = useContext(ProjectContext)

    const treeRightMenu2 = {
        menuId: props.menuId,
        items2: [
          {
            key: 'add',
            name: '新建文件夹',
            handler: (props: any) => {
              onAddb(props.props.key, 0);
            }
          },
          {
            key: 'addTsDir',
            name: '创建Ts工程',
            handler: (props: any) => {
              onAddb(props.props.key, 1);
            }
          },
          {
            key: 'addTs',
            name: '创建TypeScript',
            handler: (props: any) => {
              onAddb(props.props.key, 2);
            }
          },
          {
            key: 'edit',
            name: '重命名',
            handler: (props: any) => {
              onEditb(props.props.key);
            }
          },
          {
            key: 'del',
            name: '删除',
            handler: (props: any) => {
              onDeleteb2(props.props.key);
            }
          },
          {
            key: 'Save',
            name: '保存',
            handler: (props: any) => {
              EditorEventMgr.Instance.emitEvent("OnSave", cb => cb(props.props.key));
            }
          }
        ]
    }

    const onAddb = (key: any, type: number) => {      
        addNode(key, treeData, type)
        setTreeData(treeData.slice())
    }

    const onEditb = (key: any, isnew = false) => {
        editNode(key, treeData)
        setTreeData(treeData.slice())
    }

    const onDeleteb2 = (key: any) => {
      const parentKey = FileInfoManager.Instance.getDirByKey(key).parentDirInfo.key

      WebsocketTool.Instance.ProjectManager_deleteDir(key);

      const binder = EditorEventMgr.Instance.addEventListener('WaitNetFileInfosUpdate', () => {
        const assetData = FileInfoManager.Instance.getDirByKey(parentKey)
        console.log('assetData-------------------', assetData);
        
        setSelectNode(assetData)
        EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(assetData));
        binder.removeListener()
      })
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
    
    const editNode = (key: any, data2: any) => {
        data2.forEach((item2: any) => {
            if (item2.key === key) {
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
        })
    }
    
    return (
        <Menu id={treeRightMenu2.menuId}>
            {treeRightMenu2.items2.map(item2 => (
                // 这里需要加key，不然要报错
                <Item key={item2.key} onClick={item2.handler}>
                    {item2.name}
                </Item>
            ))}
        </Menu>
    )
}
