import * as React from 'react'
import * as monaco from 'monaco-editor'
import './index.css'
import * as require from 'requirejs'
import { useRef, useState } from 'react'

export const DiffEditor: any = () => {
  const xhr: any = (url: any) => {
    var req: any = null
    return new Promise(
      (c, e) => {
        req = new XMLHttpRequest()
        req.onreadystatechange = function () {
          if (req._canceled) {
            return
          }
          if (req.readyState === 4) {
            if (
              (req.status >= 200 && req.status < 300) ||
              req.status === 1223
            ) {
              c(req)
            } else {
              e(req)
            }
            req.onreadystatechange = function () {}
          }
        }
        req.open('GET', url, true)
        req.responseType = ''
        req.send(null)
      }
      // function () {
      //   req._canceled = true
      //   req.abort()
      // }
    )
  }

  // function xhr(url:any) {
  //   var req:any = null;
  //   return new Promise(
  //     function (c, e) {
  //       req = new XMLHttpRequest();
  //       req.onreadystatechange = function () {
  //         if (req._canceled) {
  //           return;
  //         }
  //         if (req.readyState === 4) {
  //           if ((req.status >= 200 && req.status < 300) || req.status === 1223) {
  //             c(req);
  //           } else {
  //             e(req);
  //           }
  //           req.onreadystatechange = function () {};
  //         }
  //       };
  //       req.open('GET', url, true);
  //       req.responseType = '';
  //       req.send(null);
  //     },
  //     function () {
  //       req._canceled = true;
  //       req.abort();
  //     }
  //   );
  // }

  const bbb: any = useRef()

  const fun: any = () => {
    var diffEditor: any = monaco.editor.createDiffEditor(bbb.current)

    Promise.all([xhr('original.txt'), xhr('modified.txt')]).then(function (r) {
      var originalTxt = r[0].responseText
      var modifiedTxt = r[1].responseText

      diffEditor.setModel({
        original: monaco.editor.createModel(originalTxt, 'javascript'),
        modified: monaco.editor.createModel(modifiedTxt, 'javascript')
      })
    })
  }

  return <div className="diff-editor" ref={bbb}></div>
}
