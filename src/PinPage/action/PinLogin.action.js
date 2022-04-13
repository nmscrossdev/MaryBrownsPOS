import { pinLoginConstants, pinLoginService } from '../';
import { alertActions } from "../../_actions";
import { history } from "../../_helpers";
import moment from 'moment';
import LocalizedLanguage from '../../settings/LocalizedLanguage'
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import {SendRegisterAccessed} from '../../firebase/Notifications';
import Config from '../../Config'
import { checkForEnvirnmentAndDemoUser } from '../../_components/CommonJS';

export const pinLoginActions = {
  pinLogin,
  checkSubcription,
  switchUser,
  getBlockerInfo,
  createPin
};
// <!-- Pin Login  -->
function pinLogin(pin, userid) {
  return dispatch => {
    dispatch(request());
    // pinLoginService
    //   .checkSubcriptionStatus(1)
    //   .then(res => {
    localStorage.setItem("check_subscription_status_datetime", new Date());
    // if (res.IsSuccess == true) {
    //   if (res.Content.subscription_status != true) {
    //     localStorage.setItem("userstatus", JSON.stringify(res));
    //     history.push('/revalidate');
    //   } else if (pin && pin !== '') 
    //   {
    pinLoginService
      .pinLogin(pin, userid)
      .then(
        user => {
          if (user == true) {
            sessionStorage.setItem("issuccess", true)
            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            // if (demoUser) {
            //   GTM_OliverDemoUser("Pin Login: pin varification success")
            // }
            if (localStorage.getItem("PRODUCT_REFRESH_DATE") == null) {
              localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            }
            dispatch(success(user));
            dispatch(alertActions.success(LocalizedLanguage.loginSuccessMsg));
            hideModal('browser_version');
            hideModal('oliver_version');

            // Call API to send fairebase token to Admin----------------------
            var isValidENV = checkForEnvirnmentAndDemoUser()

            if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
            SendRegisterAccessed(dispatch)
            }
            //----------------------------------------------------------------   


            //$('#browser_version').modal('hide');
            //$('#oliver_version').modal('hide')
            //window.location = '/';
            var _lang = localStorage.getItem("LANG");

            var user = JSON.parse(localStorage.getItem("user"))
            var lang = user && user.language ? user.language : 'en';
            localStorage.setItem("LANG", lang);

            //Reloading the component if new language set for the login user.                  
            if (_lang && _lang !== lang) {
              window.location = '/';
            }
            history.push('/')
          } else {
            dispatch(failure(user.toString()));
            dispatch(alertActions.error(user.toString()));
          }
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  }
  // } else {
  //   dispatch(alertActions.error(res.Message));
  // }
  // }, error => {
  //   dispatch(failure(error.toString()));
  //   dispatch(alertActions.error(error.toString()));
  // })
  //};
  function request() { return { type: pinLoginConstants.PIN_LOGIN_REQUEST }; }
  function success(logindetail) { return { type: pinLoginConstants.PIN_LOGIN_SUCCESS, logindetail }; }
  function failure(error) { return { type: pinLoginConstants.PIN_LOGIN_FAILURE, error }; }
}

// create new pin
function createPin(pin, userId) {
  return dispatch => {
    dispatch(request());
    pinLoginService
      .createPin(pin, userId)
      .then(
        res => {
          // dispatch(success(res));
          if (res == true) {
            sessionStorage.setItem("issuccess", true)
            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            // if (demoUser) {
            //   GTM_OliverDemoUser("Pin Login: pin varification success")
            // }
            if (localStorage.getItem("PRODUCT_REFRESH_DATE") == null) {
              localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            }
            dispatch(success(res));
            dispatch(alertActions.success(LocalizedLanguage.loginSuccessMsg));
            hideModal('browser_version');
            hideModal('oliver_version');
            
            var _lang = localStorage.getItem("LANG");

            var user = JSON.parse(localStorage.getItem("user"))
            var lang = user && user.language ? user.language : 'en';
            localStorage.setItem("LANG", lang);
            localStorage.setItem("hasPin", true);

            //Reloading the component if new language set for the login user.                  
            if (_lang && _lang !== lang) {
              // window.location = '/';
            }
            // history.push('/')
          } else {
            dispatch(failure(res.toString()));
            dispatch(alertActions.error(res.toString()));
          }
        


          //$('#browser_version').modal('hide');
          //$('#oliver_version').modal('hide')
          //window.location = '/';
        },
        error => {
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      );
  }
  function request() { return { type: pinLoginConstants.CREATE_PIN_REQUEST }; }
  function success(res) { return { type: pinLoginConstants.CREATE_PIN_SUCCESS, res }; }
  function failure(error) { return { type: pinLoginConstants.CREATE_PIN_FAILURE, error }; }
}

function switchUser(pin, staffId) {
  return dispatch => {
    if (pin && staffId && pin !== '') {
      pinLoginService.switchUser(pin, staffId)
        .then(
          user => {
            if (user == true) {
              sessionStorage.setItem("issuccess", true)
              if (localStorage.getItem("PRODUCT_REFRESH_DATE") == null) {
                localStorage.setItem("PRODUCT_REFRESH_DATE", moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss'))
              }
              var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
              // if (demoUser) {
              //   GTM_OliverDemoUser("Pin Login: Switches User")
              // }
              dispatch(success(user));
              dispatch(alertActions.success(LocalizedLanguage.loginSuccessMsg));
              window.location = '/';
            } else {
              dispatch(failure(user.toString()));
              dispatch(alertActions.error(user.toString()));

            }
          },
          error => {
            dispatch(failure(error.toString()));
            dispatch(alertActions.error(error.toString()));
          }
        );
    }
  };

  function request() { return { type: pinLoginConstants.PIN_LOGIN_REQUEST }; }
  function success(logindetail) { return { type: pinLoginConstants.PIN_LOGIN_SUCCESS, logindetail }; }
  function failure(error) { return { type: pinLoginConstants.PIN_LOGIN_FAILURE, error }; }
}

function checkSubcription() {
  return dispatch => {
    dispatch(request());
    pinLoginService
      .checkSubcriptionStatus()
      .then(res => {
        localStorage.setItem("check_subscription_status_datetime", new Date());
        if (res.IsSuccess == true) {
          var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
          // if (demoUser) {
          //   GTM_OliverDemoUser("PinLogin: Checked Subscription")
          // }
          if (res.Content.subscription_status != true) {
            localStorage.setItem("userstatus", JSON.stringify(res));
            history.push('/revalidate');
          }
        } else {
          history.push('/login');
        }
      })
    error => {
      dispatch(failure(error.toString()));
      dispatch(alertActions.error(error.toString()));
    }
  };
  function request() { return { type: pinLoginConstants.SUBCRIPSTION_STATUS_REQUEST }; }
  function success(status) { return { type: pinLoginConstants.SUBCRIPSTION_STATUS_SUCCESS, status }; }
  function failure(error) { return { type: pinLoginConstants.SUBCRIPSTION_STATUS_FAILURE, error }; }
}

function getBlockerInfo() {
  return dispatch => {
    dispatch(request());
    pinLoginService.getBlockerInfo()
      .then(getversioninfo => {
        dispatch(success(getversioninfo));
      })
    error => {
      dispatch(failure(error.toString()));
    }
  };
  function request() { return { type: pinLoginConstants.GET_VERSION_REQUEST }; }
  function success(getversioninfo) { return { type: pinLoginConstants.GET_VERSION_SUCCESS, getversioninfo }; }
  function failure(error) { return { type: pinLoginConstants.GET_VERSION_FAILURE, error }; }
}


