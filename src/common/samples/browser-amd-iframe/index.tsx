import * as React from 'react'
// import * as monaco from 'monaco-editor'
import './index.css'
// import { useRef, useState } from 'react'

export const Iframe: any = () => {
  var myIframe1 = document.getElementById('myIframe1')
  var myIframe2 = document.getElementById('myIframe2')
  var myIframe3 = document.getElementById('myIframe3')
  var programmaticIframe = document.createElement('iframe')
  programmaticIframe.id = 'programmaticIframe'
  programmaticIframe.src = 'inner.html'
  // trigger its loading & take it off dom
  document.body.appendChild(programmaticIframe)

  setTimeout(function () {
    document.body.removeChild(programmaticIframe)
  }, 10)

  setTimeout(function () {
    document.body.appendChild(programmaticIframe)
    ;[myIframe1, myIframe2, myIframe3, programmaticIframe].forEach(reveal)
  }, 3000)

  function reveal(iframe: any) {
    iframe.style.width = '400px'
    iframe.style.height = '100px'
    iframe.style.display = 'block'
    iframe.style.visibility = 'visible'
  }

  return (
    <div className="iframe-box">
      <title>Editor in tiny iframe</title>
      <h2>Monaco Editor inside iframes sample</h2>
      <br />
      <br />
      0x0:
      <br />
      <iframe id="myIframe1" src="inner.html"></iframe>
      display:none:
      <br />
      <iframe id="myIframe2" src="inner.html"></iframe>
      visibility:hidden:
      <br />
      <iframe id="myIframe3" src="inner.html"></iframe>
      taken off-dom while loading:
      <br />
    </div>
  )
}
