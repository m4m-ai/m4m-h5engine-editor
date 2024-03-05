import React, { useEffect, useRef } from 'react'
import './bottom.css'
import {
  BugFilled,
  CheckCircleFilled,
  CheckCircleOutlined,
  DatabaseFilled,
  FilterFilled,
  WarningFilled
} from '@ant-design/icons'
import { MenuProps, Select } from 'antd'

const { Option } = Select

const data = [
  {
    title:
      '[14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
  },
  {
    title:
      '[14:50:16] Assets/Script/ClientExcelData[226,8]:waming CS0219:The variable is assigned is never used'
  },
  {
    title:
      '[14:50:16] Assets/ScriptProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
  },
  {
    title:
      '[14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
  },
  {
    title:
      '[14:50:16] Assets/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
  },
  {
    title:
      '[14:50:16] Assets/Script/ClientExcelData/ProfolioBase[226,8]:waming CS0219:The variable is assigned is never used'
  }
]

const onclick1 = () => {
  //console.log('按钮一')
}
const onclick2 = () => {
  //console.log('按钮二')
}
const onclick3 = () => {
  //console.log('按钮三')
}
const onclick4 = () => {
  //console.log('按钮四')
}

const Bottom = () => (
  <div style={{ width: "100%", height: "24px", backgroundColor: "#111111" }}></div>
  // <div className="bottom-box">
  //   <div className="bottom-content">
  //     <a className="bottom-content-font"></a>
  //     <div className="bottom-content-icon">
  //       <div className="icon-a">
  //         <BugFilled className="bugF" onClick={onclick1} />
  //       </div>
  //       <div className="icon-b">
  //         <DatabaseFilled className="daraB" onClick={onclick2} />
  //       </div>
  //       <div className="icon-c">
  //         <FilterFilled className="filterF" onClick={onclick3} />
  //       </div>
  //       <div className="icon-d">
  //         <CheckCircleOutlined className="checkC" onClick={onclick4} />
  //       </div>
  //     </div>
  //   </div>
  // </div>
)

export default Bottom