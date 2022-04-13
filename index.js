import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './src/_helpers';
import { App } from './src/App';
import Config from './src/Config';
import ActiveUser from './src/settings/ActiveUser';
import $ from 'jquery'
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";

//Bug tracker --------------------
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import { checkForEnvirnmentAndDemoUser } from './src/_components/CommonJS';


var bugsnagClient = bugsnag(Config.key.BUGSNAG_KEY);
var isValidENV = checkForEnvirnmentAndDemoUser()

// // check for notification permission 
if(isValidENV == true){
  var notificationPermission = window.Notification && window.Notification !== "undefined" && window.Notification.permission;
  if(notificationPermission == "denied"){
    // alert('Notifications blocked. Please enable them in your browser.')
    window.Notification.requestPermission()
  }
}

if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../firebase-messaging-sw.js")
      .then(function (registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function (err) {
        console.log("Service worker registration failed, error:", err);
      });
  }
}



// Attach to the client object
//console.log("TestBugSnag");
var _user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
if (_user) {
  bugsnagClient.user = {
    id: _user.user_id,
    name: _user.display_name,
    email: _user.user_email
  }
}
//-------------------------------
bugsnagClient.use(bugsnagReact, React);
var ErrorBoundary = bugsnagClient.getPlugin('react');
//console.log("bugsnagClient",bugsnagClient)
//bugsnagClient.notify(new Error('Something broke!'))


//var isMobileOnly = window.orientation > -1;

var webCssStyle = ["./assets/css/bootstrap.min.css", "./assets/css/bootstrap-select-override.css", "./assets/css/all.min.css", "./assets/css/theme.css", "./assets/css/circle.css", "./assets/css/search.css", "./assets/css/jquery.mCustomScrollbar.css", "./assets/css/iconSvg.css", "./assets/css/all.min.update.css", "../assets/css/table.css", "./assets/css/bootstrap-select.min.css", "./assets/css/jquery.bootstrap-touchspin.css", "./assets/css/flaticon.css", "./assets/scss/css/webview.css", "./assets/css/icon.css"]
var mobileCssStyle = ["./mobileAssets/css/main.css", "./mobileAssets/css/text-view.css", "./mobileAssets/www/jquery-scrollbar/css/jquery.scrollbar.css"]

function addLinkOfCss(fileName) {
  var head = document.head;
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;
  head.appendChild(link);
}
function removeLinkOfCss(fileName) {
  var fName = fileName && fileName.substring(fileName.lastIndexOf('/') + 1)
  // var head = document.head;
  // var link = document.createElement("link");
  // link.type = "text/css";
  // link.rel = "stylesheet";
  // link.href = fileName;
  // head.removeChild(link);
  // $("link[title='"+fileName+"']").remove();
  //$("#"+fileName).attr("disabled", "disabled");

  var styles = document.styleSheets;
  var href = "";
  for (var i = 0; i < styles.length; i++) {
    if (styles[i] !== '' && styles[i] !== null && styles[i].href !== null) {
      if (styles[i] && styles[i].href) {
        href = styles[i].href.split("/");
        href = href[href.length - 1];
      }
      //console.log( href +'   '+fName)
      if (href === fName) {
        styles[i].disabled = true;
        break;
      }
    }
  }
}
//if( (!(ActiveUser.key.isSelfcheckout)|| ActiveUser.key.isSelfcheckout == false)) {
if (isMobileOnly) {
  console.log("isMobileOnly", isMobileOnly)
  webCssStyle.forEach(removeLinkOfCss);
  mobileCssStyle.forEach(addLinkOfCss);

}
if (!isMobileOnly) {
  mobileCssStyle.forEach(removeLinkOfCss);
  // webCssStyle.forEach(addLinkOfCss);
}
//}


//check environment/device type --------------------------
if (isIOS === true) {
  localStorage.setItem("env_type", "ios")
}
else if (isMobileOnly === true || isAndroid == true) {
  localStorage.setItem("env_type", "Android")
} else {
  localStorage.removeItem("env_type");
}
//-------------------------------------------------
ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary><App /></ErrorBoundary>
  </Provider>,
  document.getElementById('root'));