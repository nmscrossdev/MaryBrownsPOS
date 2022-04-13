import Config from '../../Config'
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export const userService = {
    login,
    logout,
};

const API_URL = Config.key.OP_API_URL
 function login(email, password) {
    try{
        // return serverRequest.clientServiceRequest('POST', `/Subscription/DeviceLogin`, { email, password }) // old API call
        return serverRequest.clientServiceRequest('POST', `/account/Login`, { email, password })
        .then(userRes => {
            var user = userRes.content;
            return user;
        }).catch(error => {
            return error
        });
    }
    catch (error) {
        console.log(error);
        return error
    }
    ///////////////////////
}

function logout() {
    
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

// function handleResponse(response) {
//     return response.text().then(text => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             if (response.status === 401) {
//                 // auto logout if 401 response returned from api
//                 logout();
//                 location.reload(true);
//             }
//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }
//         return data;
//     });
// }