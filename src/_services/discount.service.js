import Config from '../Config'
import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const discountService = {
    getAll,
    refresh
};

const API_URL = Config.key.OP_API_URL
function refresh() {
    // remove user from local storage to log user out
}

function getAll() {

    var UDID = get_UDid('UDID');
    try {
        return serverRequest.clientServiceRequest('GET', `/Discounts/Get`, '')
            .then(discountlst => {
                localStorage.setItem('discountlst', JSON.stringify(discountlst.content))
                return discountlst.content;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}
