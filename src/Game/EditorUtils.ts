/**
@license
Copyright (c) 2022 meta4d.me Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

export class EditorUtils
{

    public static IsFunction(obj): boolean
    {
        return typeof obj == 'function' || toString.call(obj) === '[object Function]';
    }

    public static GetTime(): number
    {
        return Date.now();//new Date().getTime();
    }

    public static GetNowFormatDate()
    {
        let date = new Date();
        let seperator1 = "-";
        let seperator2 = ":";
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9)
        {
            month = parseInt("0" + month);
        }
        if (strDate >= 0 && strDate <= 9)
        {
            strDate = parseInt("0" + date.getDate());
        }
        let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    }

    public static Replace(src: string, find: string, resp: string): string
    {
        let ret = src;
        while (ret.indexOf(find) != -1)
        {
            ret = ret.replace(find, resp);
        }
        return ret;
    }


    public static GetWebRoot(): string
    {
        let root = window.location.origin;
        if (root.endsWith("/"))
            root = root.substring(0, root.lastIndexOf("/"));
        return root;
    }

    public static GetWebEditorRoot(): string
    {
        let root = window.location.href;
        if (root.endsWith("/"))
            root = root.substring(0, root.lastIndexOf("/"));
        return root;
    }


    public static GetEditorWebRoot(): string
    {
        let root = window.location.href;
        if (root.endsWith("/"))
            root = root.substring(0, root.lastIndexOf("/"));
        return root;
    }

    public static StringToUtf8Array(str: string): number[]
    {
        var bstr: number[] = [];
        for (var i = 0; i < str.length; i++)
        {
            var c = str.charAt(i);
            var cc = c.charCodeAt(0);
            if (cc > 0xFFFF)
            {
                throw new Error("InvalidCharacterError");
            }
            if (cc > 0x80)
            {
                if (cc < 0x07FF)
                {
                    var c1 = (cc >>> 6) | 0xC0;
                    var c2 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2);
                }
                else
                {
                    var c1 = (cc >>> 12) | 0xE0;
                    var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                    var c3 = (cc & 0x3F) | 0x80;
                    bstr.push(c1, c2, c3);
                }
            }
            else
            {
                bstr.push(cc);
            }
        }
        return bstr;
    }

    public static GetNameFromURL(path: string)
    {
        let index = path.lastIndexOf("/");
        return path.substring(index + 1);
    }

    public static GetParentPathFromURL(path: string)
    {
        let index = path.lastIndexOf("/");
        let curPath = path.substr(0, index);
        index = curPath.lastIndexOf("/");
        return path.substr(0, index + 1);
    }
    public static File_str2blob(string: string): Blob
    {
        var u8 = new Uint8Array(this.StringToUtf8Array(string));
        var blob = new Blob([u8]);
        return blob;
    }
    public static File_u8array2blob(array: Uint8Array): Blob
    {
        var blob = new Blob([array]);
        return blob;
    }


}

export function ParseNumber(val: any): number
{
    let ret = Number(val);
    return isNaN(ret) ? 0 : ret;
}