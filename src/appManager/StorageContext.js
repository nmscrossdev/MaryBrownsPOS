export const clearStorage=()=> {
    window.localStorage.clear();
}

export const saveItem=(key, value) =>{
    window.localStorage.setItem(key, value);
}

export const AddItem=(key, value)=>{
    var savedJsonData = [];    
    var strData = window.localStorage.getItem(key);
    if (strData != null && strData.length > 0) {
        savedJsonData = JSON.parse(strData);        
    }
    savedJsonData.push(value);
    window.localStorage.setItem(key, JSON.stringify(savedJsonData));
}

export const getItem=(key)=> {
    window.localStorage.getItem(key);
}

export const getArray=(key)=> {    
    var strData = window.localStorage.getItem(key);
    if (strData != null && strData.length > 0) {
        return JSON.parse(strData);
    }
    else {
        return [];
    }
}

//===============Call back Events DB Funtions======================
export const RegisterOliCallBackEvent=(obj)=> {
    //console.log(obj);
    var savedJsonData = [];
    var strData = window.localStorage.getItem("callBackEvents");
    if (strData != null && strData.length > 0) {
        savedJsonData = JSON.parse(strData);
    }

    const svdValue = savedJsonData.find(a => a.onAction === obj.onAction && a.framId === obj.framId);
    if (!svdValue) {
        savedJsonData.push(obj);
        window.localStorage.setItem("callBackEvents", JSON.stringify(savedJsonData));
    }
}

export const GetOliCallBackEvents=()=> {    
    var savedJsonData = [];
    var strData = window.localStorage.getItem("callBackEvents");
    if (strData != null && strData.length > 0) {
        savedJsonData = JSON.parse(strData);
    }
    return savedJsonData;
}

export const GetOliCallBackEventForAction=(actionName)=> {
    var savedEvents = [];
    var strData = window.localStorage.getItem("callBackEvents");
    if (strData != null && strData.length > 0) {
        savedEvents = JSON.parse(strData);
        savedEvents = savedEvents.filter(a => a.onAction === actionName);
    }
    return savedEvents;
}
//===============Call back Events DB Funtions======================

//===============Ifram details DB Funtions======================
export const SaveOliBGFram=(obj)=> {
    //console.log(obj);
    var savedJsonData = [];
    var strData = window.localStorage.getItem("bgFrams");
    if (strData != null && strData.length > 0) {
        savedJsonData = JSON.parse(strData);
    }

    const svdValue = savedJsonData.find(a => a.token === obj.token);
    if (!svdValue) {
        savedJsonData.push(obj);
        window.localStorage.setItem("bgFrams", JSON.stringify(savedJsonData));
    }
}

export const GetOliFramId=(token)=> {
    var savedJsonData = [];
    var strData = window.localStorage.getItem("bgFrams");
    if (strData != null && strData.length > 0) {
        savedJsonData = JSON.parse(strData);
    }
    const svdRecord = savedJsonData.find(a => a.token == token)
    return !svdRecord ? "" : svdRecord.id;
}
//===============Ifram details DB Funtions======================

export const removeItem=(key)=> {
    window.localStorage.removeItem(key);    
}


