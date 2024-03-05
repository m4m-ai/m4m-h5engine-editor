import { ExclamationCircleFilled, FileFilled, MenuOutlined, MinusOutlined, MoreOutlined, PlusOutlined, RightOutlined, SearchOutlined, SettingFilled } from '@ant-design/icons'
import { Checkbox, Input, List } from 'antd';
import React, { useEffect, useRef } from 'react'
import { AttributeManager } from '../../attribute/AttributeManager';
import "./index.css";

export function InspectorAnimator(data) {

  const behaviourList = useRef<HTMLUListElement>(null)

  useEffect(() => {
    document.addEventListener('click', function (e) {
      if (behaviourList && behaviourList.current) {
        behaviourList.current.style.display = 'none'
      }
    });
  }, [])


  var isOpen = false
  function addButton(e) {
    e.stopPropagation()
    isOpen = !isOpen
    if ((behaviourList.current.style.display = 'none')) {
      behaviourList.current.style.display = 'block'
      //console.log('弹出下拉框')
    } else {
      behaviourList.current.style.display = 'none'
      //console.log('关闭下拉框')
    }
  }

  // 样式数据
  const transitionData = [
    {
      id: 0,
      from: 'Entry',
      to: 'New State',
    },
    {
      id: 1,
      from: 'Entry',
      to: 'New State',
    }
  ]

  const condingtionData = [
    { id: 0 }
  ]

  const Transitions = (data) => {

    return (<div className='ins-ani-transitions'>
      <div className="list-head">
        <div>Transitons</div>
        <div>
          <span>Solo</span>
          &nbsp;&nbsp;
          <span>Mute</span>
        </div>
      </div>

      <div className="transition-list">
        {
          data.data && data.data.length ? data.data.map(item => {
            return (<div key={item.id} className='transition-data'>
              <div className='transition-name'>
                <div className='layer-icon'>
                  <MenuOutlined />
                </div>&nbsp;&nbsp;
                {item.from} -&gt; {item.to}
              </div>

              <div className='transition-checkbox'>
                <Checkbox />
                &nbsp;&nbsp;&nbsp;
                <Checkbox />
              </div>
            </div>)
          }) : (<div className='transition-data'>
            List is Empty
          </div>)
        }
      </div>
      <div className="ins-ani-transitions-after">
        <div className="ins-button">
          <MinusOutlined />
        </div>
      </div>
    </div>)
  }

  const Conditions = (data) => {
    return (<div className='ins-ani-transitions'>
      <div className="list-head">
        <div>Conditions</div>
      </div>
      <div className="transition-list">
        {
          data.data && data.data.length ? data.data.map(item => {
            return (<div key={item.id} className='transition-data'>
              <div className='layer-icon'>
                <MenuOutlined />
              </div>&nbsp;&nbsp;
              <div className='transition-name'>
                Parameter does not exist in
              </div>
            </div>)
          }) : (<div className='transition-data'>
            List is Empty
          </div>)
        }
      </div>
      <div className="ins-ani-transitions-after">
        <div className="ins-button">
          <PlusOutlined />
        </div>
        <div className="ins-button">
          <MinusOutlined />
        </div>
      </div>
    </div>)
  }

  return (
    <div className='ins-ani'>
      {/* 根据选中的不同元素展示不同的界面 */}
      {/* layer */}
      {/* <div className="ins-ani-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-ani-header-name">
            <Input placeholder='Base Layer' />
          </div>

          <MoreOutlined className='icon' />
        </div>
        <div className="header-bottom">
          <span>Private</span>
          <div
            className="add"
          >
            Add...
          </div>
        </div>
      </div>
      <div className="ins-ani-body">
        <div className="add-component">
          <div
            className="clickOpen"
            onClick={(e: any) => {
              addButton(e)
            }}
          >
            Add Behaviour
          </div>

          <ul
            className="list-com"
            ref={behaviourList}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <li className="list-com-li1">
              <Input
                className="list-com-input"
                size="small"
                prefix={<SearchOutlined className="searchOutlin" />}
              />
            </li>
            <li className="list-com-li2">Behaviour</li>
            <li className="list-com-li3">
              <List
                split={false}
                renderItem={
                  item => (
                    <List.Item className="list-com-li3-content"
                      onClick={
                        (event) => {
                        }
                      }
                    >
                      {<RightOutlined />}
                    </List.Item>
                  )
                }
              />
            </li>
          </ul>
        </div>
      </div> */}

      {/* exit */}
      {/* <div className="ins-ani-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-ani-header-name">
            <span>
              Exit (Exit Node)
            </span>
          </div>
          <MoreOutlined className='icon' />
        </div>
      </div> */}

      {/* Entry */}
      {/* <div className="ins-ani-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-ani-header-name">
            <span>
              Entry (Entry Node)
            </span>
          </div>
          <MoreOutlined className='icon' />
        </div>
      </div>
      <div className="ins-ani-body">
        <div className="state-type">
          <span className='state-key'>Default state</span>
          <span className='state-value'>Not set</span>
        </div>
        <br />
        <Transitions data={transitionData} />
      </div> */}

      {/* Any State */}
      {/* <div className="ins-ani-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-ani-header-name">
            <span>
              Any State (Any State Node)
            </span>
          </div>
          <MoreOutlined className='icon' />
        </div>
      </div>
      <div className="ins-ani-body">
        <Transitions />
      </div> */}

      {/* New State */}
      {/* <div className="ins-ani-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-ani-header-name">
            <Input placeholder='Base Layer' />
          </div>
          <MoreOutlined className='icon' />
        </div>
        <div className="header-bottom">
          <span>Private</span>
          <div
            className="add"
          >
            Add...
          </div>
        </div>
      </div>
      <div className="ins-ani-body">
        {
          AttributeManager.getAttributeList([
            {
              title: 'Motion',
              type: 'asset',
              attr: {
                value: '',
                setRefresh() { },
                onChange() { }
              }
            },
            {
              title: 'Speed',
              type: 'number',
              attr: {
                value: 1,
                setRefresh() { },
                onChange() { }
              }
            },
          ])
        }
        {
          // transition list
        }
        <Transitions />

        {
          // add behaviour
        }
        <div className="add-component">
          <div
            className="clickOpen"
            onClick={(e: any) => {
              addButton(e)
            }}
          >
            Add Behaviour
          </div>

          <ul
            className="list-com"
            ref={behaviourList}
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <li className="list-com-li1">
              <Input
                className="list-com-input"
                size="small"
                prefix={<SearchOutlined className="searchOutlin" />}
              />
            </li>
            <li className="list-com-li2">Behaviour</li>
            <li className="list-com-li3">
              <List
                split={false}
                renderItem={
                  item => (
                    <List.Item className="list-com-li3-content"
                      onClick={
                        (event) => {

                        }
                      }
                    >
                      {<RightOutlined />}
                    </List.Item>
                  )
                }
              />
            </li>
          </ul>
        </div>
      </div> */}

      {/* line */}
      {/* <div className="ins-ani-header">
        <div className="header-top">
          <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
          <div className="ins-ani-header-name">
            <span>
              Entry -&gt; New State
            </span>
            <div></div>
            <span>
              1 AnimatorTransitionBase
            </span>
          </div>
          <MoreOutlined className='icon' />
        </div>
        <div className="header-bottom">
          <span>Private</span>
          <div className="add" >
            Add...
          </div>
        </div>
      </div>
      <div className="ins-ani-body" style={{ padding: 0 }}>
        {
          // transition list
        }
        <Transitions />

        <div className="ins-ani-header">
          <div className="header-top">
            <FileFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
            <div className="ins-ani-header-name">
              <Input placeholder='Base Layer' />
              <span>
                Entry -&gt; New State
              </span>
            </div>
            <SettingFilled className='icon' />
          </div>
        </div>

        {
          // Empty
        }
        <div className="ins-ani-header">
          <div className="header-top">
            <ExclamationCircleFilled style={{ color: 'rgb(238,238,238)', fontSize: '30px' }} />
            <div className="ins-ani-header-name">
              Enpty transitions (displayed in grey) are not previewable. To preview a transition please select a State transition (displayed in white).
            </div>
          </div>
        </div>

        {
          // Conditions
        }
        <Conditions data={condingtionData} />
      </div> */}
    </div>
  )
}
