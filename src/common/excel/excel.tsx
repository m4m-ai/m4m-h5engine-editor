import { useState } from 'react'
import OnlineSpread from './components/OnlineSpread.jsx'
import OnlineDesigner from './components/OnlineDesigner.jsx'
import './Excel.css'
import React from 'react'

function Excel() {
  const [count, setCount] = useState(0)
  return (
    <div className="Excel">
      {/* <OnlineSpread /> */}
      <OnlineDesigner />
    </div>
  )
}
export default Excel
