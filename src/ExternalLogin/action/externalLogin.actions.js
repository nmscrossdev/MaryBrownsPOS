import { externalLoginConstants } from '../constants/externalLogin.constants';
import { externalLoginService } from '../services/externalLogin.service';
import { alertActions } from '../../_actions/alert.actions';
import { history } from '../../_helpers/history';
import {encode_UDid}  from '../../ALL_localstorage';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {sendFireBaseTokenToAdmin} from '../../firebase/Notifications';
import  config from '../../Config'
import { checkForEnvirnmentAndDemoUser } from '../../_components/CommonJS';
export const externalLoginActions = {
    externallogin,
    logout,
};

function externallogin(Parameter) {    
    return dispatch => {
        dispatch(request({ Parameter }));
        localStorage.setItem("showExtention",false);
        externalLoginService.externallogin(Parameter)
            .then(
                loginRes => { 
                    if(loginRes){
                        if(loginRes.is_success==true)
                        {
                            var _content=loginRes.content;
                        var userSubscription=_content.subscription_detail;
                        sessionStorage.setItem("AUTH_KEY",userSubscription.client_guid + ":" +  userSubscription.server_token);
                      
                        var lang =  _content && _content.subscription_permission.language ? _content.subscription_permission.language :'en';
                        localStorage.setItem("LANG", lang);  
                        console.log("_content",_content);
                        var sitelis = _content;
                        console.log("sitelis",sitelis)
                        localStorage.setItem('sitelist', JSON.stringify(sitelis));
                        //var encodedString = window.btoa(localStorage.setItem('sitelist', sitelis));
                        //var decodedString = localStorage.getItem('sitelist');
                        // var decod = window.atob(decodedString);
                        // var divicedata=JSON.parse(decod);
                        var userID='';
                                            
                            localStorage.setItem('userId', _content.user_id)
                            localStorage.setItem("clientDetail",JSON.stringify(_content));
                            localStorage.setItem("hasPin", _content.HasPin && _content.HasPin);
                            localStorage.setItem("showExtention", _content && _content.subscription_permission?_content.subscription_permission.show_extension:false);
                            encode_UDid(_content.udid);
                            // localStorage.setItem("showExtention", loginRes.Content && loginRes.content.ShowExtention?loginRes.content.ShowExtention:false);
                            // localStorage.setItem("userId", loginRes.content.userId); 
                            // sessionStorage.setItem("AUTH_KEY",loginRes.content.ClientId + ":" +  loginRes.content.AuthToken);
                            // var lang =  loginRes.content && loginRes.content.language ? loginRes.content.language :'en';
                            // localStorage.setItem("LANG", lang);   
                            // localStorage.setItem("clientDetail",JSON.stringify(loginRes.content))  
                            // localStorage.setItem("hasPin",  loginRes.content && loginRes.content.HasPin?loginRes.content.HasPin : false);

                            // Call API to send fairebase token to Admin----------------------
                            var isValidENV = checkForEnvirnmentAndDemoUser()

                            if(isValidENV == true){ // call notification functionality only on dev1 and qa1 (development)
                                sendFireBaseTokenToAdmin(dispatch)
                                setTimeout(function () {
                                    console.log("wait....")
                                }, 500);
                            }
                            //----------------------------------------------------------------
                            dispatch(success(loginRes.content));   
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
                        } else{
                            history.push('/login');
                        }
                    } else{
                        dispatch(failure(LocalizedLanguage.invaliedUser));
                        history.push('/login');
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                    history.push('/login');
                }
            );
    };
    function request(user) { return { type: externalLoginConstants.LOGIN_REQUEST, user } }
    function success(loginRes) { return { type: externalLoginConstants.LOGIN_SUCCESS, loginRes } }
    function failure(error) { return { type: externalLoginConstants.LOGIN_FAILURE, error } }
}

function logout() {
    externalLoginService.logout();
    return { type: externalLoginConstants.LOGOUT };
}

