import { onboardingConstants } from '../constants/onboarding.constants';
import { onboardingServices } from '../services/onboarding.service';
import { alertActions } from '../../_actions/alert.actions';
import { history } from '../../_helpers/history';
import { encode_UDid } from '../../ALL_localstorage';
import { demoShopActions } from '../../_actions';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {trackShopDetail} from '../../_components/SegmentAnalytic'
export const onboardingActions = {
    VisiterShopAccessCallBack,
    EncriptData,
    UpdateGoToDemo,
    CheckShopConnected
};

function CheckShopConnected(visitorId, visitorEmail) {
    return dispatch => {
        dispatch(request({ visitorId }));
        localStorage.setItem("showExtention", false);
        onboardingServices.CheckShopConnected(visitorId, visitorEmail)
            .then(
                res => {
                    if (res) {
                        // if (res.is_success == true) {
                            console.log("res", res)
                            dispatch(success(res));
                        // }
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    // history.push('/login');
                }
            );
    };
    function request(user) { return { type: onboardingConstants.CHECKSHOP_CONNECTED_REQUEST, user } }
    function success(res) { return { type: onboardingConstants.CHECKSHOP_CONNECTED_SUCCESS, res } }
    function failure(error) { return { type: onboardingConstants.CHECKSHOP_CONNECTED_FAILURE, error } }
}
function UpdateGoToDemo(userID, isGoToDemo) {
    return dispatch => {
        dispatch(request({ userID }));
        localStorage.setItem("showExtention", false);
        onboardingServices.UpdateGoToDemo(userID, isGoToDemo)
            .then(
                res => {
                    if (res) {
                        if (res.is_success == true) {
                            console.log("res", res)
                            dispatch(success(res));
                        }
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    // history.push('/login');
                }
            );
    };
    function request(user) { return { type: onboardingConstants.UPDATE_GO_TO_DEMO_REQUEST, user } }
    function success(res) { return { type: onboardingConstants.UPDATE_GO_TO_DEMO_SUCCESS, res } }
    function failure(error) { return { type: onboardingConstants.UPDATE_GO_TO_DEMO_FAILURE, error } }
}

function VisiterShopAccessCallBack(Parameter, oliverlogin) {
    return dispatch => {
        dispatch(request({ Parameter }));
        localStorage.setItem("showExtention", false);
        onboardingServices.VisiterShopAccessCallBack(Parameter)
            .then(
                loginRes => {
                    console.log("loginRes", loginRes)
                    if (loginRes) {
                        if (loginRes.is_success == true) {
                            console.log("loginRes.content", loginRes.content)
                            if (loginRes.content) {

                                var demoShopDetail = loginRes.content;
                                sessionStorage.setItem("AUTH_KEY", demoShopDetail.userSubcription.subscription_detail.client_guid + ":" + demoShopDetail.userSubcription.subscription_detail.server_token);
                                var _udid = demoShopDetail.userSubcription && demoShopDetail.userSubcription.subscription_detail && demoShopDetail.userSubcription.subscription_detail.udid?demoShopDetail.userSubcription.subscription_detail.udid:"";
                                var _hostName=demoShopDetail.userSubcription && demoShopDetail.userSubcription.subscription_detail &&  demoShopDetail.userSubcription.subscription_detail.host_name?demoShopDetail.userSubcription.subscription_detail.host_name:"";
                                if (demoShopDetail && demoShopDetail.userSubcription && demoShopDetail.userSubcription.subscription_detail) {
                                    demoShopDetail.userSubcription.subscription_detail["AllowCashManagement"] = true;
                                    demoShopDetail.userSubcription.subscription_detail["StatusOpt"] = { instance: _hostName };
                                    demoShopDetail.userSubcription.subscription_detail["UDID"] = _udid;
                                }
                                localStorage.setItem("clientDetail", JSON.stringify(demoShopDetail.userSubcription));
                                localStorage.setItem("hasPin", demoShopDetail.userSubcription.HasPin && demoShopDetail.userSubcription.HasPin);

                                var sitelis = [];
                                if (demoShopDetail.userSubcription) {
                                    sitelis.push((demoShopDetail.userSubcription));
                                    localStorage.setItem('sitelist',JSON.stringify(sitelis));
                                    //localStorage.setItem('sitelist', btoa(JSON.stringify(sitelis)));
                                }
                                encode_UDid(_udid);
                                localStorage.setItem("userId", demoShopDetail.user_id);
                                localStorage.setItem("LANG", demoShopDetail.userinfo.language);
                                localStorage.setItem("user", JSON.stringify(demoShopDetail.userinfo));
                                // get DemoGuid from API anf add to localstorage
                                if (demoShopDetail && demoShopDetail.DemoGuid) {
                                    localStorage.setItem("DemoGuid", demoShopDetail.DemoGuid);
                                }
                                if (demoShopDetail.userSubcription.locations && demoShopDetail.userSubcription.locations.length > 0) {
                                    localStorage.setItem("UserLocations", JSON.stringify(demoShopDetail.userSubcription.locations));
                                    localStorage.setItem("LocationName", demoShopDetail.userSubcription.locations[0].name);
                                    localStorage.setItem("Location", demoShopDetail.userSubcription.locations[0].id);
                                    localStorage.setItem("last_login_location_id_" + _udid, demoShopDetail.userSubcription.locations[0].id);
                                    localStorage.setItem("last_login_location_name_" + _udid, demoShopDetail.userSubcription.locations[0].name);
                                }
                                if (demoShopDetail.userSubcription.registers && demoShopDetail.userSubcription.registers.length > 0) {
                                    localStorage.setItem("registerName", demoShopDetail.userSubcription.registers[0].name);
                                    localStorage.setItem("register", demoShopDetail.userSubcription.registers[0].id);
                                    localStorage.setItem("selectedRegister", JSON.stringify(demoShopDetail.userSubcription.registers[0]));
                                    localStorage.setItem("last_login_register_id_" + _udid, demoShopDetail.userSubcription.registers[0].id);
                                    localStorage.setItem("last_login_register_name_" + _udid, demoShopDetail.userSubcription.registers[0].name);
                                }
                                if (demoShopDetail && demoShopDetail.VisiterUserID) {
                                    localStorage.setItem("VisiterUserID", demoShopDetail.VisiterUserID);
                                    localStorage.setItem("VisiterUserEmail", demoShopDetail.VisiterUserEmail);
                                    //localStorage.setItem("IsCashDrawerOpen", "true");
                                    sessionStorage.setItem("issuccess", true);
                                }

                                if (demoShopDetail &&
                                    demoShopDetail.VisiterClientConnected &&
                                    demoShopDetail.VisiterShopAuthToken &&
                                    demoShopDetail.VisiterClientID) {

                                    localStorage.setItem('VisiterClientConnected', demoShopDetail.VisiterClientConnected)
                                    localStorage.setItem('VisiterShopAuthToken', demoShopDetail.VisiterShopAuthToken)
                                    localStorage.setItem('VisiterClientID', demoShopDetail.VisiterClientID)
                                }
                                // localStorage.setItem('VisiterClientConnected', true)

                                dispatch(success(loginRes.content));
                                trackShopDetail();
                            }

                            //if user come from oliverlogin
                            if (oliverlogin == false) {
                                setTimeout(() => {
                                    history.push('/onboardloading')
                                }, 1000);
                            }
                            // localStorage.setItem("showExtention", loginRes.Content && loginRes.Content.ShowExtention?loginRes.Content.ShowExtention:false);
                            // localStorage.setItem("userId", loginRes.Content.userId); 
                            // sessionStorage.setItem("AUTH_KEY",loginRes.Content.ClientId + ":" +  loginRes.Content.AuthToken);
                            // var lang =  loginRes.Content && loginRes.Content.language ? loginRes.Content.language :'en';
                            // localStorage.setItem("LANG", lang);   
                            // localStorage.setItem("clientDetail",JSON.stringify(loginRes.Content))                        
                            //dispatch(success(loginRes.Content));   
                            // if(loginRes.Content.udid)
                            // {
                            //     var locations=[]
                            //     locations.push(loginRes.Content.location);
                            //     localStorage.setItem("UserLocations",JSON.stringify(locations));
                            //    console.log("ExternalLoginLocation", JSON.parse(localStorage.getItem("UserLocations")));
                            //   //localStorage.setItem("UDID", loginRes.Content.udid);
                            //   encode_UDid(loginRes.Content.udid);
                            //   if(loginRes.Content.location && loginRes.Content.register)
                            //     {  
                            //         console.log("External Loging Step1");
                            //         localStorage.setItem("Location", loginRes.Content.location.Id);
                            //         localStorage.setItem("LocationName",loginRes.Content.location.Name);

                            //         localStorage.setItem("register", loginRes.Content.register.Id);
                            //         localStorage.setItem('registerName',loginRes.Content.register.Name);

                            //         history.push('/loginpin');
                            //     }
                            //   else if(loginRes.Content.locations)
                            //   {                               
                            //      console.log("External Loging Step2",loginRes.Content.locations);
                            //     localStorage.setItem('UserLocations',JSON.stringify(loginRes.Content.locations));
                            //     history.push('/login_location');
                            //   }
                            //   else
                            //   {
                            //     console.log("External Loging Step3")
                            //     history.push('/login');
                            //   }

                            // }
                            // else{
                            //     history.push('/login');
                            // }
                        } else {
                            // history.push('/login');
                        }
                    } else {
                        dispatch(failure(LocalizedLanguage.invaliedUser));
                        //history.push('/login');
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    history.push('/login');
                }
            );
    };
    function request(user) { return { type: onboardingConstants.ONBOARDING_LOGIN_REQUEST, user } }
    function success(loginRes) { return { type: onboardingConstants.ONBOARDING_LOGIN_SUCCESS, loginRes } }
    function failure(error) { return { type: onboardingConstants.ONBOARDING_LOGIN_FAILURE, error } }
}

function EncriptData(userID) {
    return dispatch => {
        dispatch(request({ userID }));
        localStorage.setItem("showExtention", false);
        onboardingServices.EncriptData(userID)
            .then(
                encriptedData => {
                    if (encriptedData) {
                        if (encriptedData.is_success == true) {
                            console.log("encriptedData", encriptedData)
                            dispatch(success(encriptedData));
                        }
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    history.push('/login');
                }
            );
    };
    function request(user) { return { type: onboardingConstants.ENCRIPT_DATA_REQUEST, user } }
    function success(encriptedData) { return { type: onboardingConstants.ENCRIPT_DATA_SUCCESS, encriptedData } }
    function failure(error) { return { type: onboardingConstants.ENCRIPT_DATA_FAILURE, error } }
}


