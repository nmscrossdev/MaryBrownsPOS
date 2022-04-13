import Config from '../../Config'
import {serverRequest  } from "../../CommonServiceRequest/serverRequest";
export const selfcheckoutService = {    
    save
};

const API_URL = Config.key.OP_API_URL

function save(customer) {
    return serverRequest.clientServiceRequest('POST', `/ShopCustomer/Save`, customer)
    .then(handleResponse);
}