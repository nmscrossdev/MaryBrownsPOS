import Config from '../../Config'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const onboardingServices = {
    VisiterShopAccessCallBack,
    EncriptData,
    UpdateGoToDemo,
    CheckShopConnected
};

const API_URL = Config.key.OP_API_URL

function CheckShopConnected(visitorId, visitorEmail) {
    // https://dev1.app.olivertest.com/account/CheckShopConnected?VisterUserId=e0c2a671-2ef9-4df2-a6d9-9d64718ffada
    return serverRequest.clientServiceRequest('GET', `/account/CheckShopConnected?VisterUserId=${visitorId}`, '')
        .then(checkShopResponse => {
            return checkShopResponse;
        }).catch(error => {
            return error
        });


}
function UpdateGoToDemo(userID, isGoToDemo) {
    return serverRequest.clientServiceRequest('GET', `/account/UpdateGoToDemo?Userid=${userID}&isGoToDemo=${isGoToDemo}`, '')
        .then(updateDemoRes => {
            return updateDemoRes;
        }).catch(error => {
            return error
        });

}
function VisiterShopAccessCallBack(parameter) {
    return serverRequest.clientServiceRequest('GET', `/account/VisiterShopAccessCallBack?${parameter}`, '')
        .then(loginRes => {
            return loginRes;
        }).catch(error => {
            return error
        });

}
function EncriptData(userID) {

    return serverRequest.clientServiceRequest('GET', `/subscription/OliverEncrypt?userId=${userID}`, '')
        .then(encripedtdata => {
            return encripedtdata;
        }).catch(error => {
            return error
        });
}
