import {
  CaretRightOutlined,
  MoreOutlined,
  NodeExpandOutlined,
  QuestionCircleOutlined,
  VideoCameraTwoTone
} from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Slider
} from 'antd'
import React, { useEffect, useState } from 'react'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'

const { Panel } = Collapse
const { Option, OptGroup } = Select

const onChange1 = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`)
}

const onclick0 = () => {
  console.log('Camera图标icon按钮')
}
const onclick1 = e => {
  e.stopPropagation()
  e.defaultPrevented = false

  console.log('Camera按钮1', e, e.preventDefault())
}
const onclick2 = e => {
  e.stopPropagation()
  console.log('Camera按钮2')
}
const onclick3 = e => {
  e.stopPropagation()
  console.log('Camera按钮3')
}

//Camera的标题行布局
const contentPanel = (
  <div className="p-box">
    <div className="p-con-1">
      <div className="p-1">
        <VideoCameraTwoTone onClick={onclick0} />
        {/* <Checkbox className="checkb2"></Checkbox> */}
      </div>
      <div className="p-2">Camera</div>
    </div>
    <div className="p-con-2" onClick={e => e.stopPropagation()}>
      <div className="p-con-2-1" onClick={(e: any) => onclick1(e)}>
        <QuestionCircleOutlined className="questionC" />
      </div>
      <div className="p-con-2-2" onClick={(e: any) => onclick2(e)}>
        <NodeExpandOutlined className="nodeE" />
      </div>
      <div className="p-con-2-3" onClick={(e: any) => onclick3(e)}>
        <MoreOutlined className="moreO" />
      </div>
    </div>
  </div>
)

//Camera下的活数据
const InspectordataList: any = [
  {
    id: 0,
    title: `Clera Flags`
  },
  {
    id: 1,
    title: `Culling Mask`
  },
  {
    id: 2,
    title: `Pojection`
  },
  {
    id: 3,
    title: `Field of View`
  },
  {
    id: 4,
    title: `Physical Camera`
  },
  {
    id: 5,
    title: `Clipping Planes`
  },
  {
    id: 6,
    title: `Viewport Rect`
  },
  {
    id: 7,
    title: `Depth`
  },
  {
    id: 8,
    title: `Rendering Path`
  }
]

const handleChange = (value: { value: any; label: React.ReactNode }) => {
  console.log(value)
}

const Camera = () => {
  const [inspectordata, setInspectordata] = useState([])
  //滑动输入框状态
  const [inputValue, setInputValue] = useState(1)

  useEffect(() => {
    setInspectordata(InspectordataList)
  }, [])

  const onChange = (newValue: number) => {
    setInputValue(newValue)
  }

  return (
    <Collapse
      bordered={false}
      // collapsible="header"
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Panel header={contentPanel} key="1">
        <div className="camera-box">
          {inspectordata.map((item: any) => {
            return (
              <div className={`camera-content`} key={item.id}>
                <div className="camera-content-left">{item.title}</div>
                <div className="camera-content-right">
                  {item.id == 0 && (
                    <Select
                      defaultValue={{ value: 'Skybox', label: 'Skybox' }}
                      onChange={handleChange}
                    >
                      <Option value="Skybox">Skybox</Option>
                      <Option value="Solid Color">Solid Color</Option>
                    </Select>
                  )}
                  {item.id == 1 && (
                    <Select
                      defaultValue={{
                        value: 'Everything',
                        label: 'Everything'
                      }}
                      onChange={handleChange}
                    >
                      <Option value="Everything">Everything</Option>
                      <Option value="Mixed">Mixed</Option>
                    </Select>
                  )}
                  {item.id == 2 && (
                    <Select
                      defaultValue={{
                        value: 'Perspective',
                        label: 'Perspective'
                      }}
                      onChange={handleChange}
                    >
                      <Option value="Perspective">Perspective</Option>
                      <Option value="Orthograph">Orthograph</Option>
                    </Select>
                  )}
                  {item.id == 3 && (
                    <Row className="row-1">
                      <Slider
                        min={1}
                        max={179}
                        tipFormatter={null}
                        onChange={onChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                      />

                      <InputNumber
                        min={1}
                        max={179}
                        step="0.1"
                        value={inputValue}
                        onChange={onChange}
                      />
                    </Row>
                  )}
                  {item.id == 4 && (
                    <Checkbox
                      className="checkb2"
                      onChange={onChange1}
                    ></Checkbox>
                  )}
                  {item.id == 5 && (
                    <div className="inp">
                      <Form.Item label="Near">
                        <Input />
                      </Form.Item>
                      <Form.Item label="Far">
                        <Input />
                      </Form.Item>
                    </div>
                  )}
                  {item.id == 6 && (
                    <div className="right-inp">
                      <div className="right-inp-con">
                        <div className="right-inp-con-1">
                          <div className="right-font">X</div>
                          <div className="right-p">
                            <InputNumber defaultValue={0} />
                          </div>
                        </div>
                        <div className="right-inp-con-1">
                          <div className="right-font">Y</div>
                          <div className="right-p">
                            <InputNumber defaultValue={0} />
                          </div>
                        </div>
                      </div>
                      <div className="right-inp-con">
                        <div className="right-inp-con-1">
                          <div className="right-font">W</div>
                          <div className="right-p">
                            <InputNumber defaultValue={0} />
                          </div>
                        </div>
                        <div className="right-inp-con-1">
                          <div className="right-font">H</div>
                          <div className="right-p">
                            <InputNumber defaultValue={0} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.id == 7 && (
                    <div className="in7">
                      <Input placeholder={'-1'} />
                    </div>
                  )}
                  {item.id == 8 && (
                    <Select
                      defaultValue={{
                        value: 'Use Graphice Settings',
                        label: 'Use Graphice Settings'
                      }}
                      onChange={handleChange}
                    >
                      <Option value="Use Graphice Settings">
                        Use Graphice Settings
                      </Option>
                      <Option value="Forward">Forward</Option>
                    </Select>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Panel>
    </Collapse>
  )
}

export default Camera
