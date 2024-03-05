import React, { useEffect, useRef, useState } from "react";
import { LightCodePanel, OutAttribute } from "./LightCodeData";
import './index.css'
import { blockHandler, LightCodeMgr } from "./LightCodeMgr";
import { EditorInputMgr } from "../../Game/Input/EditorInputMgr";
import { EditorEventMgr } from "../../Game/Event/EditorEventMgr";


export const Block = (props: { params: LightCodePanel, panel: React.MutableRefObject<HTMLDivElement> }) => {
  let { params, panel } = props

  // 获取ref对象
  const lightcode = useRef<HTMLDivElement>(null);

  const [item, setItem] = useState({ ...params })

  // 修改位置
  const [posi, setPosi] = useState({ x: params.position.x, y: params.position.y })

  const [inAttriVal, setInAttriVal] = useState([

  ])

  const binders = EditorInputMgr.Instance.createElementEventFactory();

  useEffect(() => {
    //props.params.id
    // 将block加到类对象中
    LightCodeMgr.add({ data: item, setInAttriVal })
    return () => {
      binders.removeAllEventListener();
    }
  }, [binders, item]);

  useEffect(() => {
    let binder1 = EditorInputMgr.Instance.addElementEventListener(lightcode.current, 'TouchDown', (touch) => {
      let startX = touch.offsetX;
      let startY = touch.offsetY;
      let binder2 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchMove', (touch) => {
        setPosi({
          x: touch.offsetX - startX,
          y: touch.offsetY - startY
        })
        let binder3 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', () => {
          binder2.removeListener();
          binder3.removeListener();
        })
      })
    })
    return () => {
      binder1.removeListener()
    }
  }, [panel])


  const changeClassList = (id: number, classList: string[]) => {
    LightCodeMgr.List.forEach((light: blockHandler) => {
      if (light.data.id != id) {
        light.data.outAttribute.forEach((out: OutAttribute) => {
          out.classList = classList
        })
      }
    })
  }


  return (<>
    <div className='lightCode' ref={lightcode} key={item.id} data-id={item.id} style={{ left: posi.x + 'px', top: posi.y + 'px' }}>
      <div className="head">
        {item.title}
      </div>
      <div className='options'>
        <div className="inputs">
          {
            item.inAttribute && item.inAttribute.map((option) =>
              <div ref={
                (ele) => {
                  if (ele) {
                    let eleId = item.id;
                    binders.addEventListener(ele, 'TouchDown', (touch) => {
                      touch.event.stopPropagation();

                      changeClassList(eleId, ['field', 'field-out', ' field-hover'])
                      let startX = touch.x - panel.current.getBoundingClientRect().left;
                      let startY = touch.y - panel.current.getBoundingClientRect().top;
                      let binder1 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchMove', (touch) => {
                        let moveX = touch.offsetX;
                        let moveY = touch.offsetY;
                        LightCodeMgr.drawLine({ x1: startX, y1: startY, x2: moveX, y2: moveY })
                        LightCodeMgr.changeOpacity(1)
                      })
                      let binder2 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', (touch) => {
                        LightCodeMgr.List.forEach((light: blockHandler) => {
                          light.data.outAttribute.forEach((out: OutAttribute) => {
                            out.classList = ['field', 'field-out']
                          })
                        })
                        LightCodeMgr.changeOpacity(0)

                        binders.removeAllEventListener();
                        binder1.removeListener();
                        binder2.removeListener();
                      })
                    });
                  }
                }
              } className={option.classList.join(' ')} key={option.title} data-val={option.inputVal ? option.inputVal : null}>
                <span className="dot"></span>
                <span className="inner-field">{option.title}</span>
              </div>)
          }
        </div>
        <div className="center">
          {item.type === 0 ? <div className="black"></div> : <></>}
        </div>
        <div className="outputs">
          {
            item.inAttribute && item.outAttribute.map((option) =>
              <div ref={
                (ele) => {
                  if (ele) {
                    let eleId = item.id;
                    binders.addEventListener(ele, 'TouchDown', (touch) => {
                      touch.event.stopPropagation();
                      LightCodeMgr.List.delete(eleId);

                      let startX = touch.x - panel.current.getBoundingClientRect().left;
                      let startY = touch.y - panel.current.getBoundingClientRect().top;
                      let binder1 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchMove', (touch) => {
                        let moveX = touch.offsetX;
                        let moveY = touch.offsetY;
                        LightCodeMgr.drawLine({ x1: startX, y1: startY, x2: moveX, y2: moveY })
                        LightCodeMgr.changeOpacity(1)
                      })
                      let binder2 = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', () => {
                        LightCodeMgr.changeOpacity(0)

                        binders.removeAllEventListener();
                        binder1.removeListener();
                        binder2.removeListener();
                      })
                    });
                  }
                }
              }
                className={option.classList.join(' ')} key={option.title} data-val={option.outputVal ? option.outputVal : null}>
                <span className="inner-field">{option.title}</span>
                <span className="dot"></span>
              </div>)
          }
        </div>
      </div>
    </div>
  </>)
}