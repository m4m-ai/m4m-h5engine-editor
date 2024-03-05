import React, { useEffect, useRef, useState } from "react";
import { LightCodePanel } from "../LightCodeData";
import { LightCodeMgr } from "../LightCodeMgr";
import { EditorInputMgr } from "../../../Game/Input/EditorInputMgr"
import { InputNumber } from "antd";


export const Block = (props: { params: LightCodePanel, panel: React.MutableRefObject<HTMLDivElement> }) => {
  let { params, panel } = props
  // 获取ref对象
  const lightcode = useRef<HTMLDivElement>(null);

  const [item, setItem] = useState({ ...params })

  // 修改位置
  const [posi, setPosi] = useState({ x: params.position.x, y: params.position.y })

  const [inAttriVal, setInAttriVal] = useState([])

  const [originalBorderColor, setOriginalBorderColor] = useState('rgb(177, 96, 95)');

  const [borderColor, setBorderColor] = useState('rgb(177, 96, 95)');

  const bindersTouchDown = EditorInputMgr.Instance.createElementEventFactory();

  const [leftitemID, setleftitemID] = useState(Math.floor(Math.random() * 10000000).toString());
  
  const [rightitemID, setrightitemID] = useState(Math.floor(Math.random() * 10000000).toString());

  useEffect(() => {
    LightCodeMgr.add({ data: item, setInAttriVal })
    return () => {
      bindersTouchDown.removeAllEventListener();
    }
  }, [bindersTouchDown, item]);

  useEffect(() => {
    let bindersTouchDown = EditorInputMgr.Instance.addElementEventListener(lightcode.current, 'TouchDown', (touch) => {
      // console.error("TouchDown", touch);
      changeBorderColor();
      let startX = touch.offsetX;
      let startY = touch.offsetY;
      let binderTouchMove = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchMove', (touch) => {
        let x = touch.offsetX - startX;
        let y = touch.offsetY - startY;
        setPosi({
          x: x,
          y: y
        });
        LightCodeMgr.updateBlock(item.id, { x, y })
        for (let index = 0; index < lightcode.current.children.length; index++) {
          const child = lightcode.current.children[index];
          for (let index = 0; index < child.children.length; index++) {
            const divchildren = child.children;
            for (let index = 0; index < divchildren.length; index++) {
              const element = divchildren[index];
              for (let index = 0; index < element.children.length; index++) {
                const divchild = element.children[index];
                for (let index = 0; index < divchild.children.length; index++) {
                  const div = divchild.children[index];
                  if (div.className.indexOf("dot") != -1) {
                    let panelRect = panel.current.getBoundingClientRect();
                    let rect = divchild.getBoundingClientRect();
                    let moveX = rect.left - panelRect.left;
                    let moveY = rect.top - panelRect.top;
                    LightCodeMgr.updateLine({ x1: 0, y1: 0, x2: moveX, y2: moveY }, item.id.toString(), divchild["dataset"].id);
                  }
                }
              }
            }
          }
        }
      });
      let binderTouchUp = EditorInputMgr.Instance.addElementEventListener(lightcode.current, 'TouchUp', () => {
        binderTouchMove.removeListener();
        binderTouchUp.removeListener();
      });

    })
    return () => {
      bindersTouchDown.removeListener();
    }
  }, [panel])

  useEffect(() => {
    const resetBorderColor = () => {
      setBorderColor(originalBorderColor);
    }
    document.addEventListener('click', resetBorderColor);

    let binder = EditorInputMgr.Instance.addElementEventListener(lightcode.current, "TouchClick", changeBorderColor);

    return () => {
      binder.removeListener();
    }
  }, [originalBorderColor]);

  const changeBorderColor = () => {
    if (borderColor === originalBorderColor) {
      setBorderColor('rgb(97,143,213)');
    } else {
      setBorderColor(originalBorderColor);
    }
  }

  const outPuts = (ele) => {
    if (ele) {
      let eleId = item.id;
      bindersTouchDown.addEventListener(ele, 'TouchDown', (touch) => {
        touch.event.stopPropagation();

        let startX = touch.x - panel.current.getBoundingClientRect().left;
        let startY = touch.y - panel.current.getBoundingClientRect().top;
        let binderTouchMove = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchMove', (touch) => {
          let moveX = touch.offsetX;
          let moveY = touch.offsetY;
          LightCodeMgr.delectLine(true);
          LightCodeMgr.drawLine(ele, { x1: startX, y1: startY, x2: moveX, y2: moveY }, item.id, panel, LightCodeMgr.boRef);
        })
        let binderTouchUp = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', (touch) => {
          let moveX = touch.offsetX;
          let moveY = touch.offsetY;
          LightCodeMgr.drawLine(ele, { x1: startX, y1: startY, x2: moveX, y2: moveY }, item.id, panel, LightCodeMgr.boRef, LightCodeMgr.lineBool)
          LightCodeMgr.delectLine(false);
          bindersTouchDown.removeAllEventListener();
          binderTouchMove.removeListener();
          binderTouchUp.removeListener();
        })
      });
    }
  }

  const inputs = (ele) => {
    if (ele) {

      let eleId = item.id;
      bindersTouchDown.addEventListener(ele, 'TouchDown', (touch) => {
        touch.event.stopPropagation();

        let startX = touch.x - panel.current.getBoundingClientRect().left;
        let startY = touch.y - panel.current.getBoundingClientRect().top;
        let binderTouchMove = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchMove', (touch) => {
          let moveX = touch.offsetX;
          let moveY = touch.offsetY;
          LightCodeMgr.delectLine(true);
          LightCodeMgr.drawLine(ele, { x1: startX, y1: startY, x2: moveX, y2: moveY }, item.id, panel, LightCodeMgr.boRef);
        });

        let binderTouchUp = EditorInputMgr.Instance.addElementEventListener(panel.current, 'TouchUp', (touch) => {
          let moveX = touch.offsetX;
          let moveY = touch.offsetY;
          LightCodeMgr.drawLine(ele, { x1: startX, y1: startY, x2: moveX, y2: moveY }, item.id, panel, LightCodeMgr.boRef, LightCodeMgr.lineBool)
          LightCodeMgr.delectLine(false);
          bindersTouchDown.removeAllEventListener();
          binderTouchMove.removeListener();
          binderTouchUp.removeListener();
        });
      });

    }
  }
  const onMouseOverDot = (ele) => {
    LightCodeMgr.boRef = ele;
    LightCodeMgr.lineBool = true;
  }
  const onMouseLeaveDot = () => {
    LightCodeMgr.boRef = null;
    LightCodeMgr.lineBool = false;
  }
  const delectClickX = () => {
    LightCodeMgr.removeID(item.id);
    LightCodeMgr.removeIDs(item.id)
  }

  return (<>
    <div className='lightCode' ref={lightcode} key={item.id} data-id={item.id} style={{ left: posi.x + 'px', top: posi.y + 'px', borderColor: borderColor }}>
      <div className="head">
        {item.title}
        {/* <div onClick={delectClickX} style={{ float: "right", marginRight: 8 }}>X</div> */}
      </div>
      <div className='options'>
        <div className="inputs">
          {
            item.inAttribute && item.inAttribute.map((option) =>
              <div ref={inputs} data-id={leftitemID} style={{ width: 50, height: 20 }} key={option.title} data-val={option.inputVal ? option.inputVal : null}>
                <span className="dot" data-id={leftitemID} onMouseOver={onMouseOverDot} onMouseLeave={onMouseLeaveDot}></span>
                <span className="inner-field" data-id={leftitemID}>{option.title}</span>
              </div>)
          }
        </div>
        <div className="center">
          {item.type === 0 ? <div className="black"></div> : <></>}
        </div>
        <div className="outputs">
          {item.inAttribute && item.outAttribute.map((option) =>
            <div ref={outPuts} data-id={rightitemID} style={{ width: 50, height: 20 }} key={option.title} data-val={option.outputVal ? option.outputVal : null}>
              <span className="inner-field" data-id={rightitemID}>{option.title}</span>
              <span className="dot" data-id={rightitemID} onMouseOver={onMouseOverDot} onMouseLeave={onMouseLeaveDot}></span>
            </div>)
          }
        </div>
        <br></br>
        <div className="div-inp-con">
          {item.type === 2 || item.type === 3 ? (<>
            <div className="div-inp-con-1">
              <div className="div-font">X</div>
              <div className="div-p">
                <InputNumber defaultValue={0} />
              </div>
            </div>
            <div className="div-inp-con-1">
              <div className="div-font">Y</div>
              <div className="div-p">
                <InputNumber defaultValue={0} />
              </div>
            </div></>) : <></>}
        </div>
        <div className="div-inp-con-z">
          {item.type === 3 ? (<>
            <div className="div-inp-con-1">
              <div className="div-font">Z</div>
              <div className="div-p">
                <InputNumber defaultValue={0} />
              </div>
            </div>
          </>) : <></>}
        </div>
      </div>
    </div >
  </>)
}