import * as React from 'react'
import * as monaco from 'monaco-editor'
// import *as vs from "../../../../node_modules/monaco-editor/min/vs";
import './index.css'
import { useRef, useState, useCallback, useEffect } from 'react'
export const Editor: any = (prpo: any) => {
  // 窗口宽
  const [size, setSize] = useState(document.documentElement.clientWidth)
  // 窗口高
  const [higth, setHigth] = useState(document.documentElement.clientHeight)
  const aaa: any = useRef()
  const onResize = useCallback(() => {
    setSize(document.documentElement.clientWidth)
    setHigth(document.documentElement.clientHeight)
  }, [])
  // useEffect(() => {
  //   window.addEventListener('resize', onResize)
  //   return () => {
  //     window.removeEventListener('resize', onResize)
  //   }
  // }, [])
  // useEffect(() => {
  //   // @ts-ignore
  //   // eslint-disable-next-line no-restricted-globals
  //   var zz: any = document.querySelector('.editor-box')
  //   setTimeout(() => {
  //     zz.removeChild(zz.children[0])
  //     var editornode: any = document.createElement('div')
  //     editornode.className = `editor`
  //     zz.appendChild(editornode)

  //     let editor = monaco.editor.create(zz.children[0], {
  //       value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
  //         '\n'
  //       ),
  //       language: 'typescript'
  //     })
  //     monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //       'class abc{ aa():void{}}'
  //     )
  //     monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //       'class list{ each():void{}}'
  //     )
  //     console.log('编辑器事件-------------')
  //     // @ts-ignore
  //     // eslint-disable-next-line no-restricted-globals
  //     self.MonacoEnvironment = {
  //       getWorkerUrl: function (moduleId, label) {
  //         if (label === 'json') {
  //           return './json.worker.bundle.js'
  //         }
  //         if (label === 'css' || label === 'scss' || label === 'less') {
  //           return './css.worker.bundle.js'
  //         }
  //         if (label === 'html' || label === 'handlebars' || label === 'razor') {
  //           return './html.worker.bundle.js'
  //         }
  //         if (label === 'typescript' || label === 'javascript') {
  //           return './ts.worker.bundle.js'
  //         }
  //         return './editor.worker.bundle.js'
  //       }
  //     }
  //   }, 0)
  //   console.log('代码编辑器事件', monaco.languages)
  // }, [size, higth])
  // setTimeout(() => {
  // var zz: any = document.querySelector('.editor-box')
  // let MutationObserver = window.MutationObserver
  // let observer = new MutationObserver(() => {
  //   zz.removeChild(zz.children[0])
  //   var editornode: any = document.createElement('div')
  //   editornode.className = `editor`
  //   zz.appendChild(editornode)
  //   let editor = monaco.editor.create(zz.children[0], {
  //     value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
  //       '\n'
  //     ),
  //     language: 'typescript'
  //   })
  //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //     'class abc{ aa():void{}}'
  //   )
  //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //     'class list{ each():void{}}'
  //   )
  //   // @ts-ignore
  //   // eslint-disable-next-line no-restricted-globals
  //   self.MonacoEnvironment = {
  //     getWorkerUrl: function (moduleId, label) {
  //       if (label === 'json') {
  //         return './json.worker.bundle.js'
  //       }
  //       if (label === 'css' || label === 'scss' || label === 'less') {
  //         return './css.worker.bundle.js'
  //       }
  //       if (label === 'html' || label === 'handlebars' || label === 'razor') {
  //         return './html.worker.bundle.js'
  //       }
  //       if (label === 'typescript' || label === 'javascript') {
  //         return './ts.worker.bundle.js'
  //       }
  //       return './editor.worker.bundle.js'
  //     }
  //   }
  // })
  // let observer2 = new MutationObserver(() => {
  //   zz.removeChild(zz.children[0])
  //   var editornode: any = document.createElement('div')
  //   editornode.className = `editor`
  //   zz.appendChild(editornode)
  //   let editor = monaco.editor.create(zz.children[0], {
  //     value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
  //       '\n'
  //     ),
  //     language: 'typescript'
  //   })
  //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //     'class abc{ aa():void{}}'
  //   )
  //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //     'class list{ each():void{}}'
  //   )
  // @ts-ignore
  // eslint-disable-next-line no-restricted-globals
  //   self.MonacoEnvironment = {
  //     getWorkerUrl: function (moduleId, label) {
  //       if (label === 'json') {
  //         return './json.worker.bundle.js'
  //       }
  //       if (label === 'css' || label === 'scss' || label === 'less') {
  //         return './css.worker.bundle.js'
  //       }
  //       if (label === 'html' || label === 'handlebars' || label === 'razor') {
  //         return './html.worker.bundle.js'
  //       }
  //       if (label === 'typescript' || label === 'javascript') {
  //         return './ts.worker.bundle.js'
  //       }
  //       return './editor.worker.bundle.js'
  //     }
  //   }
  // })
  // observer.observe(zz.parentNode.parentNode, {
  //   attributes: true,
  //   attributeFilter: ['style'],
  //   attributeOldValue: true
  // })
  // observer2.observe(zz.parentNode.parentNode.parentNode, {
  //   attributes: true,
  //   attributeFilter: ['style'],
  //   attributeOldValue: true
  // })
  // }, 0)

  // monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //   'class abc{ aa():void{}}'
  // )
  // monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //   'class list{ each():void{}}'
  // )
  // // @ts-ignore
  // // eslint-disable-next-line no-restricted-globals
  // self.MonacoEnvironment = {
  //   getWorkerUrl: function (moduleId, label) {
  //     if (label === 'json') {
  //       return './json.worker.bundle.js'
  //     }
  //     if (label === 'css' || label === 'scss' || label === 'less') {
  //       return './css.worker.bundle.js'
  //     }
  //     if (label === 'html' || label === 'handlebars' || label === 'razor') {
  //       return './html.worker.bundle.js'
  //     }
  //     if (label === 'typescript' || label === 'javascript') {
  //       return './ts.worker.bundle.js'
  //     }
  //     return './editor.worker.bundle.js'
  //   }
  // }
  return (
    <div className="editor-box">
      {/* <div className="editor"></div> */}
      {/* <iframe
        //src="https://cdn.cafegame.cn/Meta4D-App/%E4%BB%A3%E7%A0%81%E7%BC%96%E8%BE%91%E5%99%A8/index.html"
        src='http://localhost:9696/CodeEditorServer/BrowserTypescript/browser-typescript/dist/index.html'
        className="ifrm"
      ></iframe> */}
    </div>
  )
}
