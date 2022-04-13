import Config from '../Config'
import { history } from '../_helpers';
import { serverRequest } from '../CommonServiceRequest/serverRequest'
export const userService = {
    login,
    logout,
};

const API_URL = Config.key.OP_API_URL
function login(email, password) {
    return serverRequest.clientServiceRequest('POST', `/Subscription/DeviceLogin`, { email, password })
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.Content[0].UDID) {
                var lang = user.Content && user.Content[0] ? user.Content[0].language : 'en';
                localStorage.setItem("LANG", lang);
                var userId = user.Content && user.Content[0] ? user.Content[0].userId : 0;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                //localStorage.setItem('user', JSON.stringify(user));
                //localStorage.setItem('userId', userId);

                return serverRequest.clientServiceRequest('GET', `/locations/Get?userId=${user.Content[0].userId}`, '')
                    .then(location => {
                        setTimeout(function () {
                            localStorage.setItem('user', JSON.stringify(user));
                            localStorage.setItem('UserLocations', JSON.stringify(location && location.content));
                            return user;
                        }, 1000)

                    }).catch(error => {
                        Message: "Error- No location found"
                    })
            }
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('shopstatus');
    localStorage.removeItem('user');
    //localStorage.removeItem('UserLocations');
    //localStorage.removeItem('UDID');
    //history.push('/login');

    if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
    {
        Android.wrapperLogout();
    }
    else
    {
        history.push("/login");
    }
}




