import Config from '../Config'
import { get_UDid } from '../ALL_localstorage'
import { servicesVersion } from 'typescript';

export const serverRequest = {
    clientServiceRequest
};

const API_URL = Config.key.OP_API_URL

function clientServiceRequest(requestType, requestUrl, postParameter,version=1) {
    if (requestType == 'POST') {
        var requestOptions = {
            method: requestType,
            headers: {
                "access-control-allow-origin": "*",
                "access-control-allow-credentials": "true",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
            }
            , mode: 'cors',
            body: JSON.stringify(postParameter)
        };
    }
    if (requestType == 'GET') {
        var requestOptions = {
            method: requestType,
            headers: {
                "access-control-allow-origin": "*",
                "access-control-allow-credentials": "true",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(sessionStorage.getItem("AUTH_KEY")),
            }
            , mode: 'cors',
        };
    }
    if (localStorage.getItem('demoUser') == 'true' && localStorage.getItem('DemoGuid')) {
        requestOptions.headers['demoauth'] = localStorage.getItem('DemoGuid') && localStorage.getItem('DemoGuid')
    }

    return fetch(`${API_URL}v${version}${requestUrl}`, requestOptions).then(handleResponse)
        .then(servericeResponse => {
           // console.log('--------common-service-Res--', servericeResponse);
            return servericeResponse;
        })
}
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}
