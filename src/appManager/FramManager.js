//< !--Reciver Events Start-->
 import {RegisterCallBackEvents} from './PageFunctions'
 import {GetOliCallBackEventForAction} from './StorageContext'
var srcUrl;
var srcEle;
export const  addEventListener=()=>{
    window.addEventListener("message", function (e) {
        console.log(e);
    srcUrl = e.origin; //sender url
    srcEle = e.source.frameElement;
    try {
        //console.log(e.origin); //sender url
        //console.log(e.source); //sender window               
        // Get the recived data
        const oReq = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        //check validations
        if (!oReq) { SendError("Invalid request.", "", "GR3", oReq); return; }

        //if (oReq.version === 1.0) {
        //    AddEventLog("redirect request to version folder 1.0 from here");
        //}

        //check the event data for oliver based events
        if (oReq) {
            switch (oReq.command) {
                case "appReady":
                    var jsonResponse = {
                        command: oReq.command,
                        version: oReq.version,
                        method: oReq.method,
                        status: 200,
                        data: {
                            appName: oReq.appName,
                            clientGUID: "1234",
                            view: "Register Page",
                            privilege: "admin",
                            viewport: navigator.userAgent
                        },
                        error: null
                    }
                    srcEle.contentWindow.postMessage(JSON.stringify(jsonResponse), srcUrl);                    
                    break;
                case "registerCallBack":
                    if (srcEle) {
                        if (RegisterCallBackEvents(srcEle.id, oReq.data)) {
                            var jsonResponse = {
                                command: "registerCallBack",
                                version: oReq.version,
                                method: "post",
                                status: 200,
                                data: {
                                    message: "call back event registerd successfully."
                                },
                                error: null
                            }
                            srcEle.contentWindow.postMessage(JSON.stringify(jsonResponse), srcUrl);
                        }
                        else {
                            var jsonResponse = {
                                command: "registerCallBack",
                                method: "post",
                                status: 402,
                                data: null,
                                error: { message: "error occured when register call back events, please check your reqest format."}
                            }
                            srcEle.contentWindow.postMessage(JSON.stringify(jsonResponse), srcUrl);
                        }
                    }
                    break;
                case "showme":
                    //get ifram and show him
                    srcEle.style.visibility = "";                    
                    break;
                case "hideme":
                    //get ifram and show him
                    srcEle.style.visibility = "hidden";
                    break;
                default:
                    var jsonResponse = {
                        command: "error",
                        data: {
                            message: "Invalid command",
                            code: 500,
                            request: oReq
                        },
                    }
                    srcEle.contentWindow.postMessage(JSON.stringify(jsonResponse), srcUrl);
                    break;
            }
        }
    }
    catch (e) {
        var jsonResponse = {
            command: "error" ,
            data: {
                message: "Invalid request!",
                exception: JSON.stringify(e),
                request: typeof e.data === "string" ? JSON.parse(e.data) : e.data
            },
        }
        srcEle && srcEle.contentWindow && console.log(srcEle.contentWindow.postMessage(JSON.stringify(jsonResponse), srcUrl));        
    }
});
}

//<!--Reciver Events End-- >

//-----------Call Ifram start------------------
function SendError(message, exception, code, request) {
    var jsonResponse = {
        command: "error",
        data: {
            message: message,
            exception: JSON.stringify(exception),
            code: code,
            request: request
        },
    }
    console.log(srcEle.contentWindow.postMessage(JSON.stringify(jsonResponse), srcUrl));
}

//-----------------Call Ifram End------------
export const TriggerCallBack=(actionName, objData)=> {
    var CBEvents = GetOliCallBackEventForAction(actionName);
    CBEvents.forEach(function (item, index, arr) {
        //trigger to ifram
        if (item.framId) {
            var jsonResponse = {
                command: item.command,
                data: JSON.stringify(objData),
            }
          //  console.log("Trigger call back","Dispatch '" + item.command + "' on '" + actionName + "' data: " + JSON.stringify(objData));
            //AddEventLog(JSON.stringify(objData, undefined, 4)); 
            // AddEventLog(JSON.stringify(jsonResponse, undefined, 4));            
            //identify webview then post message to web view           
//console.log(item.framId,window.frames[item.framId])
             window.frames[item.framId] && window.frames[item.framId].contentWindow.postMessage(JSON.stringify(jsonResponse), "*");
        }
    });
}