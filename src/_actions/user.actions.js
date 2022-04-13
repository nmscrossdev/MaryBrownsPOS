import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { checkForEnvirnmentAndDemoUser, redirectToURL } from '../_components/CommonJS';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';
import {sendFireBaseTokenToAdmin} from '../firebase/Notifications';
import Config from '../Config'
export const userActions = {
    login,
    logout,
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        userService.login(username, password)
            .then(
                user => {
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //     GTM_OliverDemoUser("Login: Loged in user")
                    // }
                    // Call API to send fairebase token to Admin----------------------
                    var isValidENV = checkForEnvirnmentAndDemoUser()
                    if(isValidENV == true ){ // call notification functionality only on dev1 and qa1 (development)
                    sendFireBaseTokenToAdmin(this.props.dispatch)
                    }
                    //----------------------------------------------------------------   
                    dispatch(success(user));
                    history.push('/site_link');
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
    redirectToURL()
    // var isDemoUser=  localStorage.getItem('demoUser') ? localStorage.getItem('demoUser'):false;
    // if(isDemoUser==false)
    // history.push('/loginpin');
    // else
    // history.push('/oliverlogin');
    return { type: userConstants.LOGOUT };
}

