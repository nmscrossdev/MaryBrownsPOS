import Config from '../../Config'
import { serverRequest } from "../../CommonServiceRequest/serverRequest";
export const externalLoginService = {
    externallogin,
    logout,
};

const API_URL = Config.key.OP_API_URL
function externallogin(parameter) {
    //return serverRequest.clientServiceRequest('GET', `/Subscription/ExternalAuth?${parameter}`, '')
    return serverRequest.clientServiceRequest('GET', `/account/ExternalLogin?${parameter}`, '')
        .then(loginRes => {
            return loginRes;
        }).catch(error => {
            return error
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
