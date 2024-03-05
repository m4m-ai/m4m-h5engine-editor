import React, {useContext} from "react";
import './NameInput.css'
import {ProjectContext} from '../../layout'
import { WebsocketTool } from '../../../../CodeEditor/code/WebsocketTool'
import { EditorEventMgr } from '../../../../Game/Event/EditorEventMgr'
import { FileInfoManager } from "../../../../CodeEditor/code/FileInfoManager";



// 后续需要封装 重命名组件
export default function NameInput(props) {
    const {treeData, setTreeData} = useContext(ProjectContext)

    const currentNode = props.item

    const onChange = (e: any, key: any) => {
        changeNode(key, e.target.value, treeData)
        setTreeData(treeData.slice())
    }

    const changeNode = (key: any, value: any, data2: any) =>
      data2.forEach((item2: any) => {
        if (item2.key === key) {
          item2.value = value
        }
        if (item2.children) {
          changeNode(key, value, item2.children)
        }
      })

    const onClose = (key: any, defaultValue: any) => {
        if (defaultValue != "") {
            closeNode2(key, defaultValue, treeData)
        } else {
            deleteNode2(key, treeData);
        }
        setTreeData(treeData.slice())
    }

    const closeNode2 = (key: any, defaultValue: any, data: any) =>
      data.forEach((item2: any) => {
        item2.isEditable = false
        if (item2.key === key) {
          item2.value = defaultValue
        }
        if (item2.children) {
          closeNode2(key, defaultValue, item2.children)
        }
      })

    const deleteNode2 = (key: any, data2: any) =>
      data2.forEach((item2: any, index: any) => {
        if (item2.key === key) {
          data2.splice(index, 1)
          return
        } else {
          if (item2.children) {
            deleteNode2(key, item2.children)
          }
        }
      })

    const onSave = (key: any, newName: any) => {
      WebsocketTool.Instance.ProjectManager_renameDir(key, newName);
      // // 等待文件改变 再返回
      const binder = EditorEventMgr.Instance.addEventListener('WaitNetFileInfosUpdate', () => {
        binder.removeListener()
        const updateData = FileInfoManager.Instance.getDirByKey(currentNode.parentDirInfo.key)
        EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(updateData));
      })
    }

    function binderFn () {
      const binder = EditorEventMgr.Instance.addEventListener('WaitNetFileInfosUpdate', () => {
        binder.removeListener()
        const updateData = FileInfoManager.Instance.getDirByKey(currentNode.pareKey)
        EditorEventMgr.Instance.emitEvent("ResourceFileUpDate", cb => cb(updateData));
      })
    }

    const newTsFile = (pareKey: string, newName: string) => {
        WebsocketTool.Instance.ProjectManager_createTsFile(pareKey, newName);
        binderFn()
    }

    const newDir = (pareKey: string, newName: string) => {
        WebsocketTool.Instance.ProjectManager_createDir(pareKey, newName);
        binderFn()
    }

    const newTsDir = (pareKey: string, newName: string) => {
        WebsocketTool.Instance.ProjectManager_createTsProject(pareKey, newName);
        binderFn()
    }

    return (
        <input
            className="input-tree2"
            // 阻止触发 Tree 组件的 点击
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()}
            value={currentNode.value || ''}
            onChange={e => onChange(e, currentNode.key)}
            onBlur={e => {
                if (e.target.value == '') {
                    onClose(currentNode.key, currentNode.defaultValue)
                } else {
                    if (!currentNode.pareKey) {
                        onSave(currentNode.key, currentNode.value)
                    } else {
                        if (currentNode.isLeaf) {
                            newTsFile(currentNode.pareKey, currentNode.value);
                        } else {
                            if (currentNode.dirType == 0) {
                                newDir(currentNode.pareKey, currentNode.value);
                            } else {
                                newTsDir(currentNode.pareKey, currentNode.value);
                            }
                        }
                    }
                }
            }}
        />
    )
}