import { userConstants } from '../constants/user.constants';
import { userService } from '../services/user.service';
import { alertActions } from '../../_actions/alert.actions';
import { history } from '../../_helpers/history';
import Config from '../../Config'
import {GTM_ClientDetail} from '../../_components/CommonfunctionGTM'
import LocalizedLanguage from '../../settings/LocalizedLanguage';
export const userActions = {
    login,
    logout,
};

function login(username, password) {
    return dispatch => {
        //dispatch(request({ username }));
        userService.login(username, password)
            .then(
                loginRes => {
                    if (loginRes ) {
                        var demoUser = loginRes && loginRes.GoToDemo ? loginRes.GoToDemo:false;
                      
                        // if(demoUser){
                        //     GTM_OliverDemoUser("Site screen: Selecting sites")
                        // }
                       // dispatch(success(loginRes));

                       // console.log("loginRes",loginRes);                      

                        //Check demo user .......................................
                        if (loginRes.subscriptions !== undefined && loginRes.subscriptions.length>0){
                            var userSubscription=loginRes.subscriptions[0];
                            if(userSubscription.subscription_detail.bridge_status === "Not Connected")
                            {
                                dispatch(failure(LocalizedLanguage.BridgeNotConnected));
                                history.push('/login');
                            }
                            else if(loginRes.GoToDemo==true ){
                                    //Redirect to sync page
                                    var _client_Id=loginRes.subscriptions && userSubscription.subscription_detail.client_guid;
                                    var _token=loginRes.UserToken && loginRes.UserToken;
                                    window.location.href = process.env.BRIDGE_DOMAIN + `/account/VerifyClient/?_client=${_client_Id}&_token=${_token}`;
                            }
                            else{
                                //........................................................
                                userSubscription && sessionStorage.setItem("AUTH_KEY",userSubscription.subscription_detail.client_guid + ":" +  userSubscription.subscription_detail.server_token);
                                // alert(sessionStorage.getItem("AUTH_KEY"));
                                // console.log("Config.key.AUTH_KEY1", Config.key.AUTH_KEY);
                                // localStorage.setItem('loginRes', JSON.stringify(loginRes));
                                var lang =  userSubscription && userSubscription.subscription_permission.language ? userSubscription.subscription_permission.language :'en';
                                localStorage.setItem("LANG", lang);
                                localStorage.setItem('sitelist', JSON.stringify(loginRes))
                                //  var sitelis = btoa(JSON.stringify(loginRes));
                                //  var encodedString = window ? window.btoa(localStorage.setItem('sitelist', sitelis)) : "";
                                //  var decodedString = localStorage.getItem('sitelist');
                                // var decod = window ? window.atob(decodedString) : "";
                                //var divicedata=JSON.parse(decod);
                                // console.log("userid",divicedata[0].userId);
                                var userID='';                                    
                                localStorage.setItem('userId', loginRes.UserId)
                                localStorage.setItem("clientDetail",JSON.stringify(userSubscription));
                                localStorage.setItem("hasPin", loginRes.HasPin && loginRes.HasPin);
                                GTM_ClientDetail();
                                dispatch(success(loginRes)); 
                            }                      
                        } else  {
                             // localStorage.setItem('demoUser', true)
                                    localStorage.setItem("demoUser",demoUser)
                                    history.push(`/VisiterShopAccess?_u=${loginRes.UserToken}&_t=demo&_fg=true`);
                        }
                        
                    } else {
                        dispatch(failure(LocalizedLanguage.invaliedUser));
                        history.push('/login');
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };
    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

