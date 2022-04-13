import Config from '../../Config'
import { get_UDid } from '../../ALL_localstorage'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const pinLoginService = {
    pinLogin,
    logout,
    checkSubcriptionStatus,
    switchUser,
    getBlockerInfo,
    createPin
};

const API_URL = Config.key.OP_API_URL
function pinLogin(pin, userid) {

    var UDID = get_UDid('UDID');
    //Location
    try {
        return serverRequest.clientServiceRequest('GET', `/account/VerifyPin?udid=` + UDID + '&pin=' + pin + '&userid=' + userid, '')
            .then(response => {
                // login successful if there's a jwt token in the response
                if (response.is_success == true) {
                    // var lang = response.Content && response.Content.language ? response.Content.language : 'en';
                    // localStorage.setItem("LANG", lang);
                    localStorage.setItem('user', JSON.stringify(response.content));
                    if (typeof (Storage) !== "undefined") {
                        localStorage.setItem("check_subscription_status_datetime", new Date());
                    }
                    return response.is_success;
                } else {
                    return response.message;
                }
            }).catch(function (error) {
                return 'Unable to login';
            })
    }
    catch (error) {
        console.log(error);
    }
}
// create pin service
function createPin(pin, id) {
    try {
        return serverRequest.clientServiceRequest('POST', `/Users/RegisterPinReset`, { pin, id })
            .then(response => {
                console.log(response);
                // login successful if there's a jwt token in the response
                if (response.is_success == true) {
                    if(response.Content){
                        localStorage.setItem('user', JSON.stringify(response.Content));
                        if (typeof (Storage) !== "undefined") {
                            localStorage.setItem("check_subscription_status_datetime", new Date());
                        }
                    }
                    return response.is_success;
                } else {
                    return response.exceptions[0] || response.message;
                }
            }).catch(function (error) {
                return 'Unable to create pin';
            })
    }
    catch (error) {
        console.log(error);
    }

}

function switchUser(pin, staffId) {
    var UDID = get_UDid('UDID');
    return serverRequest.clientServiceRequest('GET', '/users/ValidatePin?pin=' + pin + '&StaffId=' + staffId, '')
        .then(response => {
            // login successful if there's a jwt token in the response
            if (response.is_success == true) {
                var lang = response.content && response.content.language ? response.content.language : 'en';
                localStorage.setItem("LANG", lang);
                localStorage.setItem('user', JSON.stringify(response.content));
                if (typeof (Storage) !== "undefined") {
                    localStorage.setItem("check_subscription_status_datetime", new Date());
                }
                return response.is_success;
            } else {
                return response.message;
            }
        }).catch(function (error) {
            return 'Unable to login';
        })
}

function checkSubcriptionStatus() {
    var UDID = get_UDid('UDID');
    return serverRequest.clientServiceRequest('GET', `/Subscription/CheckStatus?Udid=` + UDID, '')
        .then(response => {
            return response;
        });
}


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getBlockerInfo() {
    try {
        return serverRequest.clientServiceRequest('GET', `/Immunity/GetBlockerInfo`, '')
            .then(response => {
                if (response.is_success == true) {
                    return response.content;
                } else {
                    return response.message;
                }
            }).catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}
