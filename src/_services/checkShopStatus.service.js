import Config from '../Config'
import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const checkShopStatusService = {
    getStatus, getProductCount
};

const API_URL = Config.key.OP_API_URL
function getStatus() {
    var UDID = get_UDid('UDID');
    try {
        return serverRequest.clientServiceRequest('GET', `/Shop/GetCheckShopAlive`, '')
            .then(res => { return res })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}

function getProductCount() {

    var UDID = get_UDid('UDID');
    return serverRequest.clientServiceRequest('GET', `/product/count?udid=${UDID}`, '')
        .then(response => {
            return response;
        })
        .catch(error => console.log(error))
}
