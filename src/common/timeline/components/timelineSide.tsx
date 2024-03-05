import { TimelineState } from '@xzdarcy/react-timeline-editor';
import React, { useEffect, useRef, useState } from 'react'
import { TimelinePlayer } from './player'
import { Tree, Divider, Button } from 'antd';
import { TimelineType } from '../timeline'
import { EditorEventMgr } from '../../../Game/Event/EditorEventMgr';
import { Item, Menu, useContextMenu } from 'react-contexify'
import { IComponentFieldInfo, IComponentInfo } from '../../../Game/Component/EditorComponentMgr';

let data = [
  //一条轨道
  {
    name: "camera/size",
    ticks: [
      //时间点
      {
        value: "0",
        timer: 0.5,
      },
      {
        value: "1",
        timer: 1,
      }
      //.....
    ],
    timeLength: 5,
  }
]

export function TimelineSide(datas: { datas: TimelineType[], timelineState: React.MutableRefObject<TimelineState>, trackdatas: IComponentInfo[] }) {

  // track数据
  const [data, setData] = useState([...datas.datas])

  // 添加属性面板
  const propertyList = useRef<HTMLDivElement>(null)

  // const playerPanel = useRef<HTMLDivElement>();
  const autoScrollWhenPlay = useRef<boolean>(true);

  // 轨道id
  const [actionId, setActionId] = useState(1)

  // 添加轨道列表
  const [trackDatas, setTrackDatas] = useState<IComponentInfo[]>(datas.trackdatas.map((item) => {
    return {
      ...item, fields: item.fields.map((data) => {
        return { ...data, name: item.name + '/' + data.name }
      })
    }
  }))

  // 添加轨道列表副本
  const [trackDatasC, setTrackDatasC] = useState<IComponentInfo[]>(trackDatas.map((item) => {
    return { ...item, children: [...item.fields] }
  }))

  // data发生改变派发事件
  useEffect(() => {
    EditorEventMgr.Instance.emitEvent('OnAnimationDatas', cb => cb(data))
    changeTrack(data.map(item => {
      return item.key
    }))
  }, [data])

  useEffect(() => {
    changeTrack(data.map(item => item.key))
  }, [])

  useEffect(() => {
    changeTrack(datas.datas.map(item => item.key))
  }, [datas.datas])

  useEffect(() => {
    document.addEventListener('click', () => {
      if (propertyList && propertyList.current) {
        propertyList.current.style.display = 'none'
      }
    })
  }, [])


  // 添加Property按钮
  var isOpen = false
  const addProperty = (e) => {
    e.stopPropagation()

    if (propertyList) {
      isOpen = !isOpen
      if ((propertyList.current.style.display = 'none')) {
        propertyList.current.style.display = 'block';
      } else {
        propertyList.current.style.display = 'none';
      }
    }
  }

  // 侧边轨道
  const Track = (trackDatas: TimelineType[]) => {
    return trackDatas.map((trackData) => {
      return (
        <Tree.TreeNode title={trackData.title} key={trackData.key}
          className='track'
        >
        </Tree.TreeNode>
      )
    })
  }

  //右键菜单栏
  const treeRightMenu = {
    menuId: '2',
    items: [
      {
        key: 'del',
        name: 'Del Property',
        handler: (props) => {

          let arr = [...datas.datas];

          let index = datas.datas.findIndex(d => {
            return d.key == props.props.key
          })

          if (index != -1) {

            arr.splice(index, 1);
            setData([...arr])
          }
        }
      }
    ]
  }

  const ContextMenu = () => (
    <Menu id={treeRightMenu.menuId} className="menu">
      {treeRightMenu.items.map(item => (
        // 这里需要加key，不然要报错
        <Item key={item.key} onClick={item.handler}>
          {item.name}
        </Item>
      ))}
    </Menu>
  )

  const { show } = useContextMenu({
    id: treeRightMenu.menuId
  })

  // 右键显示菜单
  const handleContextMenu = (event: any, node: any) => {
    event.preventDefault()
    show(event, {
      props: node
    })
  }

  // 数据发生改变时 修改轨道数据
  function changeTrack(keys: string[]) {
    let arr = trackDatas.map((item) => {
      return { ...item, fields: [...item.fields] }
    });

    if (keys.length) {
      keys.forEach((item) => {
        arr.forEach((track, i) => {
          track.fields.forEach((data, j) => {
            if (data.name == item) {

              arr[i].fields.splice(j, 1)
            }
          })
        })
      })
    }

    for (let index = 0; index < arr.length; index++) {
      const track = arr[index];
      if (track.fields.length == 0) {
        arr.splice(index, 1)
        index--;
      }
    }

    setTrackDatasC([...arr])
  }

  // 渲染属性面板数据
  const renderTreeNodes = (propData: IComponentInfo[] | IComponentFieldInfo[]) => {
    return propData.map((item) => {

      let title = item.fields ? (
        <>
          <span>{item.title}</span>
        </>
      ) : (
        <>
          <span>{item.title}</span>
          {/* 添加轨道按钮 */}
          <Button className='addBtn' onClick={(e) => {
            e.stopPropagation()
            setActionId(() => actionId + 1)

            // 修改轨道数据
            setData([...datas.datas, {
              id: item.name,
              key: item.name,
              title: item.title,
              actions: [

              ],
            }]);

            propertyList.current.style.display = 'none'
          }}>+</Button>
        </>
      );
      if (item.fields) {
        return (
          <Tree.TreeNode title={title} key={item.name} >
            {renderTreeNodes(item.fields)}
          </Tree.TreeNode>
        )
      }
      return (
        <>
          <Tree.TreeNode title={title} key={item.name} />
        </>
      )
    })
  }

  return (
    <div className='timeline-side'>
      <TimelinePlayer timelineState={datas.timelineState} autoScrollWhenPlay={autoScrollWhenPlay}></TimelinePlayer>
      <div className='profile-name'>
        <Divider />
        <div className='file-name'>
          New Animation
        </div>
        <Divider />
        <div className="track-ul">
          <Tree.DirectoryTree
            showIcon={false}
            expandAction={false}
            blockNode
            onRightClick={({ event, node }) => {
              handleContextMenu(event, node)
            }}
          >
            {Track(datas.datas)}
          </Tree.DirectoryTree>
          <ContextMenu />
        </div>
        <Divider />
        <div className="addTrack">
          <div className="clickOpen" onClick={(e) => addProperty(e)}>Add Property</div>
          <div
            ref={propertyList}
            className='property-list'
            onClick={e => {
              e.stopPropagation();
            }}>
            <Tree.DirectoryTree
              showIcon={false}
              expandAction={false}
              blockNode
              onRightClick={({ event, node }) => {
                //console.log(event, node)
              }}
            >
              {renderTreeNodes(trackDatasC)}
            </Tree.DirectoryTree>
          </div>
        </div>
      </div>
    </div>
  )
}
