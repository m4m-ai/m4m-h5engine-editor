import React, { useEffect, useRef, useState } from "react";
import { AttributeManager } from "../../attribute/AttributeManager";
export interface ProjectLeftData{
  title:String,
  item:String
}
export function ProjectLeftCom(props){
  let {title,item} = props
  let binder: any;
  const boxRef = useRef(null)
  useEffect(() => {
      return () => {
          if (binder) {
              binder.removeListener();
          }
      }
  });

  // if (!data.visible) {
  //     return null;
  // }
  return(
    <div ref={boxRef} className='pr-right-box'>
      <div className="pr-right-title">{title}</div>
      {/* 下边测试 */}
      <div className="pr-right-ce">
          <div>Scoped Registries</div>
           {
            // 数据
            AttributeManager.getAttributeList([
              {
                title:item,
                type:'string',
                attr:{
                  value:'',
                  onChange(){},
                  setRefresh(func) {
                      
                  },
                }
              },
              // {
              //   title:'ajax',
              //   type:'string',
              //   attr:{
              //     value:'',
              //     onChange(){},
              //     setRefresh(func) {
                      
              //     },
              //   }
              // }
            ])
           }
      </div>
    </div>
  )
}