import Config from '../Config'
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const saveCustomerInOrderService = {
    saveCustomer,
    saveCustomerToTempOrder
};

const API_URL = Config.key.OP_API_URL;
/** 
 *  created Date: 26/06/2019
 * Modified By : 
 *  Modified Date: 
 * Decription: update order and add customer to the temp order 
*/
function saveCustomerToTempOrder(udid, order_id, email_id) {

    return serverRequest.clientServiceRequest('GET', `/orders/SaveCustomerInTempOrder?OrderId=${order_id}&CustomerEmail=${email_id}`, '')
        .then(response => {
            return response;
        }
        );
}

function saveCustomer(udid, order_id, email_id) {
    return serverRequest.clientServiceRequest('GET', `/orders/SaveCustomer?OrderId=${order_id}&CustomerEmail=${email_id}`, '')
        .then(response => {
            return response;
        }
        );
}






