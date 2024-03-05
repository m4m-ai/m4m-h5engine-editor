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

import { AwaitDataManager } from "./AwaitDataManager";
import { NetData } from "./NetData";
import { NetWebscoket } from "./NetWebsocket";
import { WsDataManager } from "./WsDataManager";

export class WebsocketTool {
    public static get Instance(): WebsocketTool {
        if (this._instance == null) {
            this._instance = new WebsocketTool();
        }

        return this._instance;
    }
    private static _instance: WebsocketTool;
    public onmessage(netData: NetData) {
        if (netData.head == "[Data]") {
            //服务端通知数据修改完成...
            let obj = netData.GetJson()[0];
            AwaitDataManager.dispatchSuccess(obj.className + "." + obj.functionName + "_#" + obj.args[0], obj.args);
            return true;
        } else if (netData.head == "[DataError]") {
            //发送错误消息
            let obj = netData.GetJson()[0];
            AwaitDataManager.dispatchError(obj.className + "." + obj.functionName + "_#" + obj.args[0], obj.args);
            return true;
        } else if (netData.head != "[LOG]") {
            let messObjList = netData.GetJson();
            let len = messObjList.length;
            for (let i = 0; i < len; i++) {
                let messObj = messObjList[i];
                if (messObj.argsType == "code") {
                    return false;
                }
                if (messObj.argsType == "Event") {
                    return true;
                }
                if (messObj.functionName == "All") {
                    WsDataManager.setData(messObj.className, messObj.args[0], messObj.addType);
                } else if (messObj.functionName == "ChangeList") {
                    WsDataManager.changeDataList(messObj.className, messObj.args[0], messObj.addType);
                } else if (messObj.functionName == "TipData") {
                    WsDataManager.dispatchTipData(messObj.className, messObj.args[0]);
                } else {
                    for (var j = 0; j < messObj.args.length; j++) {
                        let element = messObj.args[j];
                        WsDataManager.changeData(messObj.className, messObj.functionName, messObj.argsType, element, messObj.addType);
                    }
                }
            }
            return true;
        }
        return false;
    }
    public getMsg(className,functionName,text) {
        let mess = `{"currentType":null,"type":null,"callTime":"0001-01-01T00:00:00","callid":0,"timeout":0,"className":"${className}","functionName":"${functionName}","argsType":null,
        ${text}"returnType":null,"returnValue":null}`;
        return mess;
    }

    /***
     * 通过ID获取ProjectData数据
     */
    public ExcelManager_ProjectDataDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","ProjectDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部ProjectData数据
     */
    public ExcelManager_ProjectDataDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","ProjectDataDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条ProjectData数据
     */
    public ExcelManager_ProjectDataDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","ProjectDataDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单ProjectData数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyProjectDataDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyProjectDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个ProjectData数据
     */
    public ExcelManager_addProjectDataData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addProjectDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加ProjectData数组数据
     */
    public ExcelManager_addProjectDataDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addProjectDataDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条ProjectData
     */
    public ExcelManager_removeProjectDataData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeProjectDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取UserProjectData数据
     */
    public ExcelManager_UserProjectDataDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","UserProjectDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部UserProjectData数据
     */
    public ExcelManager_UserProjectDataDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","UserProjectDataDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条UserProjectData数据
     */
    public ExcelManager_UserProjectDataDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","UserProjectDataDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单UserProjectData数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyUserProjectDataDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyUserProjectDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个UserProjectData数据
     */
    public ExcelManager_addUserProjectDataData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addUserProjectDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加UserProjectData数组数据
     */
    public ExcelManager_addUserProjectDataDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addUserProjectDataDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条UserProjectData
     */
    public ExcelManager_removeUserProjectDataData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeUserProjectDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取ErrorInfo数据
     */
    public ExcelManager_ErrorInfoDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","ErrorInfoDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部ErrorInfo数据
     */
    public ExcelManager_ErrorInfoDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","ErrorInfoDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条ErrorInfo数据
     */
    public ExcelManager_ErrorInfoDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","ErrorInfoDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单ErrorInfo数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyErrorInfoDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyErrorInfoDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个ErrorInfo数据
     */
    public ExcelManager_addErrorInfoData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addErrorInfoData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加ErrorInfo数组数据
     */
    public ExcelManager_addErrorInfoDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addErrorInfoDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条ErrorInfo
     */
    public ExcelManager_removeErrorInfoData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeErrorInfoData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取Formulas数据
     */
    public ExcelManager_FormulasDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","FormulasDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部Formulas数据
     */
    public ExcelManager_FormulasDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","FormulasDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条Formulas数据
     */
    public ExcelManager_FormulasDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","FormulasDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单Formulas数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyFormulasDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyFormulasDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个Formulas数据
     */
    public ExcelManager_addFormulasData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addFormulasData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加Formulas数组数据
     */
    public ExcelManager_addFormulasDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addFormulasDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条Formulas
     */
    public ExcelManager_removeFormulasData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeFormulasData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取ServerLog数据
     */
    public ExcelManager_ServerLogDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","ServerLogDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部ServerLog数据
     */
    public ExcelManager_ServerLogDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","ServerLogDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条ServerLog数据
     */
    public ExcelManager_ServerLogDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","ServerLogDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单ServerLog数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyServerLogDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyServerLogDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个ServerLog数据
     */
    public ExcelManager_addServerLogData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addServerLogData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加ServerLog数组数据
     */
    public ExcelManager_addServerLogDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addServerLogDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条ServerLog
     */
    public ExcelManager_removeServerLogData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeServerLogData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取ServerUserData数据
     */
    public ExcelManager_ServerUserDataDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","ServerUserDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部ServerUserData数据
     */
    public ExcelManager_ServerUserDataDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","ServerUserDataDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条ServerUserData数据
     */
    public ExcelManager_ServerUserDataDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","ServerUserDataDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单ServerUserData数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyServerUserDataDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyServerUserDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个ServerUserData数据
     */
    public ExcelManager_addServerUserDataData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addServerUserDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加ServerUserData数组数据
     */
    public ExcelManager_addServerUserDataDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addServerUserDataDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条ServerUserData
     */
    public ExcelManager_removeServerUserDataData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeServerUserDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取SeverConfigBase数据
     */
    public ExcelManager_SeverConfigBaseDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","SeverConfigBaseDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部SeverConfigBase数据
     */
    public ExcelManager_SeverConfigBaseDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","SeverConfigBaseDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条SeverConfigBase数据
     */
    public ExcelManager_SeverConfigBaseDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","SeverConfigBaseDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单SeverConfigBase数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifySeverConfigBaseDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifySeverConfigBaseDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个SeverConfigBase数据
     */
    public ExcelManager_addSeverConfigBaseData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addSeverConfigBaseData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加SeverConfigBase数组数据
     */
    public ExcelManager_addSeverConfigBaseDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addSeverConfigBaseDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条SeverConfigBase
     */
    public ExcelManager_removeSeverConfigBaseData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeSeverConfigBaseData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取SeverData数据
     */
    public ExcelManager_SeverDataDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","SeverDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部SeverData数据
     */
    public ExcelManager_SeverDataDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","SeverDataDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条SeverData数据
     */
    public ExcelManager_SeverDataDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","SeverDataDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单SeverData数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifySeverDataDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifySeverDataDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个SeverData数据
     */
    public ExcelManager_addSeverDataData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addSeverDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加SeverData数组数据
     */
    public ExcelManager_addSeverDataDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addSeverDataDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条SeverData
     */
    public ExcelManager_removeSeverDataData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeSeverDataData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取TimeEvent数据
     */
    public ExcelManager_TimeEventDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","TimeEventDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部TimeEvent数据
     */
    public ExcelManager_TimeEventDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","TimeEventDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条TimeEvent数据
     */
    public ExcelManager_TimeEventDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","TimeEventDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单TimeEvent数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyTimeEventDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyTimeEventDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个TimeEvent数据
     */
    public ExcelManager_addTimeEventData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addTimeEventData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加TimeEvent数组数据
     */
    public ExcelManager_addTimeEventDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addTimeEventDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条TimeEvent
     */
    public ExcelManager_removeTimeEventData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeTimeEventData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取WalletErrLog数据
     */
    public ExcelManager_WalletErrLogDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","WalletErrLogDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部WalletErrLog数据
     */
    public ExcelManager_WalletErrLogDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","WalletErrLogDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条WalletErrLog数据
     */
    public ExcelManager_WalletErrLogDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","WalletErrLogDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单WalletErrLog数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyWalletErrLogDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyWalletErrLogDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个WalletErrLog数据
     */
    public ExcelManager_addWalletErrLogData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addWalletErrLogData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加WalletErrLog数组数据
     */
    public ExcelManager_addWalletErrLogDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addWalletErrLogDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条WalletErrLog
     */
    public ExcelManager_removeWalletErrLogData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeWalletErrLogData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID获取WalletLog数据
     */
    public ExcelManager_WalletLogDataById(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","WalletLogDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取全部WalletLog数据
     */
    public ExcelManager_WalletLogDataGetAll() {
        let paramJsons =``;
        let mess = this.getMsg("ExcelManager","WalletLogDataGetAll",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 通过ID数组获取多条WalletLog数据
     */
    public ExcelManager_WalletLogDataByIds(ids) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(ids))},`;
        let mess = this.getMsg("ExcelManager","WalletLogDataByIds",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改单WalletLog数组的指定属性，propertyName：属性名，value：值
     */
    public ExcelManager_modifyWalletLogDataById(id, propertyName, value) {
        let paramJsons =`"a0":${JSON.stringify(id)},"a1":${JSON.stringify(propertyName)},"a2":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","modifyWalletLogDataById",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加一个WalletLog数据
     */
    public ExcelManager_addWalletLogData(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addWalletLogData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 添加WalletLog数组数据
     */
    public ExcelManager_addWalletLogDatas(value) {
        let paramJsons =`"a0":${JSON.stringify(JSON.stringify(value))},`;
        let mess = this.getMsg("ExcelManager","addWalletLogDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除一条WalletLog
     */
    public ExcelManager_removeWalletLogData(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ExcelManager","removeWalletLogData",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 导出3D Prefab
     */
    public PrefabExport_exportPrefab3D(dirKey, fileName, json) {
        let paramJsons =`"a0":${JSON.stringify(dirKey)},"a1":${JSON.stringify(fileName)},"a2":${JSON.stringify(json)},`;
        let mess = this.getMsg("PrefabExport","exportPrefab3D",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 导出Scene
     */
    public PrefabExport_exportScene(dirKey, fileName, json, fog) {
        let paramJsons =`"a0":${JSON.stringify(dirKey)},"a1":${JSON.stringify(fileName)},"a2":${JSON.stringify(json)},"a3":${JSON.stringify(JSON.stringify(fog))},`;
        let mess = this.getMsg("PrefabExport","exportScene",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * testtesttest
     */
    public PrefabExport_testExport(json) {
        let paramJsons =`"a0":${JSON.stringify(json)},`;
        let mess = this.getMsg("PrefabExport","testExport",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 导出2D Prefab
     */
    public PrefabExport_exportPrefab2D(dirKey, fileName, json) {
        let paramJsons =`"a0":${JSON.stringify(dirKey)},"a1":${JSON.stringify(fileName)},"a2":${JSON.stringify(json)},`;
        let mess = this.getMsg("PrefabExport","exportPrefab2D",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 登录账号
     */
    public ProjectManager_login(userName, pw) {
        let paramJsons =`"a0":${JSON.stringify(userName)},"a1":${JSON.stringify(pw)},`;
        let mess = this.getMsg("ProjectManager","login",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除文件夹
     */
    public ProjectManager_deleteDir(key) {
        let paramJsons =`"a0":${JSON.stringify(key)},`;
        let mess = this.getMsg("ProjectManager","deleteDir",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 编译所有工程
     */
    public ProjectManager_watchProject() {
        let paramJsons =``;
        let mess = this.getMsg("ProjectManager","watchProject",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 停止编译所有工程
     */
    public ProjectManager_stopWatchProject() {
        let paramJsons =``;
        let mess = this.getMsg("ProjectManager","stopWatchProject",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 重新获取文件信息
     */
    public ProjectManager_getFilesInfo(id) {
        let paramJsons =`"a0":${JSON.stringify(id)},`;
        let mess = this.getMsg("ProjectManager","getFilesInfo",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 根据传入的路径打开VSCode
     */
    public ProjectManager_openVSCode(vspath, openpath) {
        let paramJsons =`"a0":${JSON.stringify(vspath)},"a1":${JSON.stringify(openpath)},`;
        let mess = this.getMsg("ProjectManager","openVSCode",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 创建Ts工程
     */
    public ProjectManager_createTsProject(pareKey, dirName) {
        let paramJsons =`"a0":${JSON.stringify(pareKey)},"a1":${JSON.stringify(dirName)},`;
        let mess = this.getMsg("ProjectManager","createTsProject",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 创建Ts文件
     */
    public ProjectManager_createTsFile(pareKey, dirName) {
        let paramJsons =`"a0":${JSON.stringify(pareKey)},"a1":${JSON.stringify(dirName)},`;
        let mess = this.getMsg("ProjectManager","createTsFile",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 创建文件夹
     */
    public ProjectManager_createDir(pareKey, dirName) {
        let paramJsons =`"a0":${JSON.stringify(pareKey)},"a1":${JSON.stringify(dirName)},`;
        let mess = this.getMsg("ProjectManager","createDir",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 重启编译监控
     */
    public ProjectManager_reWatchDir() {
        let paramJsons =``;
        let mess = this.getMsg("ProjectManager","reWatchDir",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 重命名文件夹
     */
    public ProjectManager_renameDir(key, newName) {
        let paramJsons =`"a0":${JSON.stringify(key)},"a1":${JSON.stringify(newName)},`;
        let mess = this.getMsg("ProjectManager","renameDir",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 删除文件
     */
    public ProjectManager_deleteFile(key) {
        let paramJsons =`"a0":${JSON.stringify(key)},`;
        let mess = this.getMsg("ProjectManager","deleteFile",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 打开项目
     */
    public ProjectManager_openProject(projectName) {
        let paramJsons =`"a0":${JSON.stringify(projectName)},`;
        let mess = this.getMsg("ProjectManager","openProject",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 创建项目
     */
    public ProjectManager_creatProject(projectName) {
        let paramJsons =`"a0":${JSON.stringify(projectName)},`;
        let mess = this.getMsg("ProjectManager","creatProject",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 选中当前文件
     */
    public ProjectManager_selectFileFun(path) {
        let paramJsons =`"a0":${JSON.stringify(path)},`;
        let mess = this.getMsg("ProjectManager","selectFileFun",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 保存当前选中文件
     */
    public ProjectManager_saveSelectClassFun(path) {
        let paramJsons =`"a0":${JSON.stringify(path)},`;
        let mess = this.getMsg("ProjectManager","saveSelectClassFun",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 保存代码文件
     */
    public ProjectManager_saveClassFun(path, content) {
        let paramJsons =`"a0":${JSON.stringify(path)},"a1":${JSON.stringify(content)},`;
        let mess = this.getMsg("ProjectManager","saveClassFun",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 调用C++的dll生成导航文件
     */
    public ProjectManager_createNavFile(configKey, fileKeys) {
        let paramJsons =`"a0":${JSON.stringify(configKey)},"a1":${JSON.stringify(fileKeys)},`;
        let mess = this.getMsg("ProjectManager","createNavFile",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 生成导航网格
     */
    public ProjectManager_createNav(pathKey, config, fileInfos, lengthArray, objData) {
        let paramJsons =`"a0":${JSON.stringify(pathKey)},"a1":${JSON.stringify(config)},"a2":${JSON.stringify(fileInfos)},"a3":${JSON.stringify(lengthArray)},"a4":${JSON.stringify(objData)},`;
        let mess = this.getMsg("ProjectManager","createNav",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 记录客户端异常消息
     */
    public ErrorInfoManager_CreateErrorInfo(message, modelType) {
        let paramJsons =`"a0":${JSON.stringify(message)},"a1":${JSON.stringify(modelType)},`;
        let mess = this.getMsg("ErrorInfoManager","CreateErrorInfo",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * callService
     */
    public FrontDataManager_callService(className, funcName, args) {
        let paramJsons =`"a0":${JSON.stringify(className)},"a1":${JSON.stringify(funcName)},"a2":${JSON.stringify(args)},`;
        let mess = this.getMsg("FrontDataManager","callService",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * callFunc
     */
    public FrontDataManager_callFunc(tableName, funcName, args) {
        let paramJsons =`"a0":${JSON.stringify(tableName)},"a1":${JSON.stringify(funcName)},"a2":${JSON.stringify(args)},`;
        let mess = this.getMsg("FrontDataManager","callFunc",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 下载自动代码
     */
    public AutoCodeManager_DownloadAutoCode() {
        let paramJsons =``;
        let mess = this.getMsg("AutoCodeManager","DownloadAutoCode",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改表数据 
     */
    public GmToolsManager_setTableDatas(tableName, tableDatas) {
        let paramJsons =`"a0":${JSON.stringify(tableName)},"a1":${JSON.stringify(tableDatas)},`;
        let mess = this.getMsg("GmToolsManager","setTableDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取表数据 
     */
    public GmToolsManager_getATableDatas(tableName) {
        let paramJsons =`"a0":${JSON.stringify(tableName)},`;
        let mess = this.getMsg("GmToolsManager","getATableDatas",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 备份数据库
     */
    public MySqlManager_copyMySqlClient(PW) {
        let paramJsons =`"a0":${JSON.stringify(PW)},`;
        let mess = this.getMsg("MySqlManager","copyMySqlClient",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 还原数据库
     */
    public MySqlManager_uploadDataClien(PW) {
        let paramJsons =`"a0":${JSON.stringify(PW)},`;
        let mess = this.getMsg("MySqlManager","uploadDataClien",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改服务器时间,time：修改时间 （格式 2022-09-10  00:00:00）
     */
    public ServerManager_timePlus(time) {
        let paramJsons =`"a0":${JSON.stringify(time)},`;
        let mess = this.getMsg("ServerManager","timePlus",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 修改开服时间,time：时间 （格式 2022-09-10  00:00:00）
     */
    public ServerManager_openTimePlus(time) {
        let paramJsons =`"a0":${JSON.stringify(time)},`;
        let mess = this.getMsg("ServerManager","openTimePlus",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 心跳检测
     */
    public ServerManager_heartBeat() {
        let paramJsons =``;
        let mess = this.getMsg("ServerManager","heartBeat",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 延迟检测
     */
    public ServerManager_ping() {
        let paramJsons =``;
        let mess = this.getMsg("ServerManager","ping",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

    /***
     * 获取服务器时间
     */
    public ServerManager_servertime() {
        let paramJsons =``;
        let mess = this.getMsg("ServerManager","servertime",`${paramJsons}`);
        NetWebscoket.Instance.sendStr(mess);
    }

}