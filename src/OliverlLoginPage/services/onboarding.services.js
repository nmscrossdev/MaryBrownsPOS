import Config from '../../Config'
import { get_UDid } from '../../ALL_localstorage'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const onboardingServices = {
    OliverExternalLogin,
    GetUserProfile
};

function OliverExternalLogin(externalLoginParam) {
    return serverRequest.clientServiceRequest('POST', '/account/LoginExternaly', externalLoginParam)
        .then(response => {
            console.log('OliverExternalLogin services respons--', response);
            if (response) {
                return response;
            }
        }).catch(function (error) {
            console.log(error);
            return 'Unable to fetch';
        })
}
function GetUserProfile(profileGetParam) {

    var requestOptions = {
        method: 'GET',
        // headers: {
        //     "access-control-allow-origin": "*",
        //     "access-control-allow-credentials": "true",
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json',
        // }
         mode: 'cors',
    };

    return fetch(`https://people.googleapis.com/v1/people/${profileGetParam.userId}/?personFields=ageRanges,names,photos,addresses,locations,birthdays,genders,phoneNumbers,metadata&alt=json&access_token=${profileGetParam.access_token}`)
        // .then(response => {
        //     console.log('---res----', response);
        //     return response
        // })
        .then(handleResponse)
        .then(profileInfo => {
            console.log('--------service -Res--', profileInfo);
            return profileInfo;
        })
        .catch(function (error) {
            console.log(error);
            return 'Unable to get';
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
