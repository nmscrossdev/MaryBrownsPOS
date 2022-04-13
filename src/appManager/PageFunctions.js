import * as React from 'react';
import {RegisterOliCallBackEvent} from './StorageContext' 
export const  LoadIframs=(ifrmUrl)=>{
// function LoadIframs(ifrmUrl) {
    var eleDvFram = document.getElementById("hiddenIfrms");
    if (!eleDvFram) {
        var elemDiv = document.createElement('div');
        elemDiv.id = "hiddenIfrms";
        //elemDiv.style.cssText = 'display:none';
        document.body.appendChild(elemDiv);
    }

    var aToken = createUUID();
    var frmId = "fram-" + aToken;
    var iframe = document.createElement('iframe');
    iframe.src = ifrmUrl;//+ '&accessToken=' + encodeURIComponent(aToken);
    iframe.loading = 'lazy';
    iframe.id = frmId;
    //iframe.style.visibility = "hidden";
    //load hidden frame
    document.getElementById("hiddenIfrms").appendChild(iframe);
}
export const  createUUID=()=>{
//function createUUID() {
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export const  createDivID=()=>{
// function createDivID() {
    return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// function AddEventLog(value, color = 'white') {
//     var dvIdDyn = createDivID();
//     var output = "<div style='color:" + color +"' id=" + dvIdDyn + " class=\"log-" + (typeof value) + "\">";
//     if (typeof value === "object") {
//         output += JSON.stringify(value, undefined, 4);
//     } else {
//         output += value;
//     }
//     output += "</div>";
//     document.getElementById("eventLogger").innerHTML += output;
//     document.getElementById("eventLogger").scrollTop = document.getElementById("eventLogger").scrollHeight;
//     //document.getElementById(dvIdDyn).focus();
// }
// //AddEventLog("");


export const RegisterCallBackEvents=(framId, callBackEvents)=> {
    //retrive Callback Events from localstorage    
    try {
        callBackEvents.forEach(function (item, index, arr) {
            const jObj = typeof item === "string" ? JSON.parse(item) : item;
            //validate model here before add callback info
            RegisterOliCallBackEvent({
                framId: framId,
                onAction: jObj.onAction,
                command: jObj.command
            });
        });
        return true;
    }
    catch (e) {
        return false;
    }
}

export const registerEventsForComponent=(componentName)=>{
    switch (componentName){  
        case value1:
            /* implement the statement(s) to be executed when
            expression = value1 */
            break;
        case value2:
            /* implement the statement(s) to be executed when
            expression = value2 */
            break;
        case value3:
            /* implement the statement(s) to be executed when
            expression = value3 */
            break;
        default:
           /* implement the statement(s) to be executed if expression 
           doesn't match any of the above cases */ 
      }
}