var global = global || this;
var System = System || {};
System.models = {};
System.CheckFuill = function (key) {
    return key != "____imports____" && key != "____config____" && key != "____ready____" && key != "____assembly____";
}
System.register = function (_path, arrs, callback) {
    let self = this;
    if (!self.models[_path])
        self.models[_path] = {};
    let result = callback(function (pOrName, cls) {
        if (typeof (pOrName) == "object") {
            for (let k in pOrName) {
                if (self.CheckFuill(k))
                    self.models[_path][k] = pOrName[k];
            }
        } else
            self.models[_path][pOrName] = cls;
    }, "");
    self.models[_path].____imports____ = arrs;
    self.models[_path].____config____ = result;
    self.models[_path].____assembly____ = System.recordAssembly;
}
System.delete = function (_path) {
    if (_path && typeof (_path)) {
        let index = _path.indexOf("__usercode__/");
        if (index != -1) {
            _path = _path.substring(index);
            delete System.models[_path];
        }
    }
}
System.init = function () {
    for (let key in this.models) {
        let fails = [];
        this.modelInit(key, [], fails);
        for (let item of fails) {
            let __fails = [];
            this.modelInit(item, [], __fails);
        }
    }
}
System.pathToName = function (_path) {
    let idx = _path.lastIndexOf("/");
    if (idx != -1)
        _path = _path.substring(idx + 1);
    return _path;
}
System.modelInit = function (key, paths, fails) {
    let model = this.models[key];
    paths.push(key);
    for (let i = 0, len = model.____imports____.length; i < len; ++i) {
        let ckey = model.____imports____[i];
        let cmodel = this.models[ckey];
        if (!cmodel) continue;
        if (paths.lastIndexOf(ckey) == -1 && !cmodel.____ready____)
            this.modelInit(ckey, paths, fails);
        this.handleIndex(key, ckey, model, cmodel, paths);
        model.____config____.setters[i](cmodel);
    }
    if (!model.____ready____) {
        try {
            model.____ready____ = true;
            model.____config____.execute();
            this.addToGlobal(model);
        } catch (e) {
            console.error("'" + key + "'" + " init: " + e + "\n" + e.stack);
        }
    }
}
System.handleIndex = function (key, ckey, model, cmodel, paths, fails) {
    if (key.endsWith("index")) {
        {
            let nckey = this.pathToName(ckey);
            if ("default" in cmodel)
                model[nckey] = cmodel["default"];
            else {
                if (!(ckey in cmodel))
                    this.modelInit(ckey, paths, fails);
                for (ck in cmodel) {
                    if (!this.CheckFuill(ck))
                        continue;
                    if (!(ck in cmodel)) {
                        this.modelInit(ck, paths, fails);
                        for (let k in cmodel) {
                            if (!this.CheckFuill(k))
                                continue;
                            model[k] = cmodel[k];
                        }
                    } else
                        model[ck] = cmodel[ck];
                }
            }
        }
    }
}
System.addToGlobal = function (model) {
    for (let k in model) {
        if (k.startsWith("____")) { continue; }
        let obj = model[k];
        if (obj) {
            global[k] = obj;
        }
    }
}
System.addObject = function (_path, name, obj) {
    var model = this.models[_path];
    if (model) {
        model[name] = obj;
    } else {
        model = {
            ____ready____: true,
            ____imports____: [],
            ____assembly____: System.recordAssembly,
            ____config____: {
                setters: [],
                execute: function () { },
            },
        }
        model[name] = obj;
        this.models[_path] = model;
    }
    global[name] = obj;
}
System.get = function (fullpath) {
    let result = {};
    let model = this.models[fullpath];
    if (model)
        for (let key in model) {
            if (this.CheckFuill(key))
                result[key] = model[key];
        }
    return result;
}
System.startRecord = function (file) {
    System.recordAssembly = file;
}
System.overRecord = function () {
    System.recordAssembly = undefined;
}
function GetModule(path){
    return System.models[path];
}