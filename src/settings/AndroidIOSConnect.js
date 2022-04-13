import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,isIOS
} from "react-device-detect";

export function showAndroidToast(udid,orderId,orderType) {
   // alert("AndroidFunctionCall ="+printBody )
   console.log("Android Call");
    if(typeof Android !== "undefined" && Android !== null) {
       // console.log("Android Call")
       // Android.showToast(toast);
        Android.makePrint(udid,orderId,orderType)
    } else if((typeof IOS !== "undefined" && IOS !== null)
              || (typeof iPhone !== "undefined" && iPhone !== null)
              || (typeof iPad !== "undefined" && iPad !== null)
              || (typeof iPod !== "undefined" && iPod !== null)
          )
    {
      // Android.showToast(toast);
      //window.webkit.messageHandlers.jsHandler.postMessage("trigger from JS")
      // IOS.makePrint(udid,orderId)
   }else if(isIOS===true)
    {
     // alert('Test IOS')
    // window.webkit.messageHandlers.jsHandler.postMessage("trigger from JS")
    // window.webkit.messageHandlers.callbackHandler.makePrint(udid,orderId);
      // IOS.makePrint(udid,orderId)
    }
  //    else if(typeof BlackBerry !== "undefined" && BlackBerry !== null) {
  //   // Android.showToast(toast);
  //   BlackBerry.makePrint(udid,orderId)
  // }  else {
  //     //  alert("Not viewing in webview");
  //   }
}
export function showAndroidReceipt(receipt,PrintReceiptData) {
  // alert("AndroidFunctionCall ="+printBody )
  console.log("Android Call");
  console.log("receipt",receipt,"PrintReceiptData",PrintReceiptData)  
   if(typeof Android !== "undefined" && Android !== null) {
        
       Android.generateReceipt(JSON.stringify(receipt),JSON.stringify(PrintReceiptData))
   }
}


export function setAndroidKeyboard(eventname) { 
  if(typeof Android !== "undefined" && Android !== null) {
   // var logout=localStorage.getItem("logoutclick");
  // alert(eventname);
  localStorage.setItem("env_type", "Android");
     Android.androidClickEvent(eventname)
 }
 
}


export function androidSearchClick() { 

  if(typeof Android !== "undefined" && Android !== null) {
   // var logout=localStorage.getItem("logoutclick");
     Android.searchClick('text')
 }
}

export function androidGetUser() { 

  if(typeof Android !== "undefined" && Android !== null) {
   // var logout=localStorage.getItem("logoutclick");
     Android.getuser()
 }
}
export function androidDisplayScreen(itemname, amount, total, mode) { 
  if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
  {
    // let fdata=localStorage.getItem('selected_ffdisplay');
    // if(typeof fdata!="undefined" && fdata=="yes")
    // {
      Android.displayScreen(itemname,amount,total,mode);
    // }
  }
  // else
  // {
  //   if(typeof Android !== "undefined" && Android !== null) {    
  //     Android.displayScreen(itemname,amount,total,mode)
  //   }
  // }

}
export function openCahsDrawer() { 
  console.log("openCahsDrawer");
    if(typeof Android !== "undefined" && Android !== null) {    
     Android.openCahsDrawer()
 }
}

export function AndroidExtentionFinished() { 
  console.log("extentionFinished");
    if(typeof Android !== "undefined" && Android !== null) {   
      var path = location.href
      console.log('--------path--------------',path); 
     Android.extentionFinished(path)
 }
}