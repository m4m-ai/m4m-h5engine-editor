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
export class GPTRunner {


    Start(callback: (state: string) => void) {
        this._statecall = callback;
        this._idcounter = (Math.random() * 1000000) | 0;
        this.CheckState()
    }
    private _statecall: (state: string) => void
    private _lastid: number = -1;
    private _idcounter: number = 0;
    private async CheckState() {
        if (this._lastid > 0) {
            let _params: string[] = [];
            let _json = { jsonrpc: 2.0, id: 1, method: "state", params: _params };
            let _res = await fetch("http://192.168.15.19:8847/func", { method: "POST", body: JSON.stringify(_json) });
            let _result = (await _res.json())["result"];
            let _busy = _result["buzy"] == true;
            let _lastid = _result["lastreq_id"] as number;
            if (_busy == false && _lastid == this._lastid) {
                let _res = _result["lastreq_result"] as string;
                this._lastid = -1;
                this._statecall(_res);
            }
        }
        requestAnimationFrame(this.CheckState.bind(this));
    }
    async State(): Promise<string> {
        let _params: string[] = [];
        let _json = { jsonrpc: 2.0, id: 1, method: "state", params: _params };
        let _res = await fetch("http://192.168.15.19:8847/func", { method: "POST", body: JSON.stringify(_json) });
        let _result = (await _res.json())["result"];
        console.log(_result);
        return JSON.stringify(_result);
    }
    async Send(text: string): Promise<boolean> {
        let _params: string[] = [text];


        let _json = { jsonrpc: 2.0, id: this._idcounter + 1, method: "chat", params: _params };
        let _res = await fetch("http://192.168.15.19:8847/func", { method: "POST", body: JSON.stringify(_json) });
        let _jsonr = await _res.json();
        let _result = _jsonr["result"];
        console.log(_result);
        if (_result["state"] == "busy")
            return false;

        this._idcounter++;
        this._lastid = this._idcounter;
        return true;
    }
}