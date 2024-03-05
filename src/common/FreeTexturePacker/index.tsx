import React, {useEffect, memo, useRef} from 'react'
import './index.css'

//把Free texture packer 这个html文件封装进来，调用此组件即可显示
const FreeTexture = memo(() => {
    return (
        <div className="FreeTexture-box">
            <iframe
              className="mainFrame"
              width="100%"
              height="100%"
              scrolling="auto"
              title="atlas_tool"
              src="/plugin/atlas_tool/index.html"
            ></iframe>
        </div>
    )
})
export default FreeTexture
