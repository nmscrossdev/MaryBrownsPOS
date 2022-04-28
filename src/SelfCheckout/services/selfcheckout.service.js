import Config from '../../Config'
import {serverRequest  } from "../../CommonServiceRequest/serverRequest";
export const selfcheckoutService = {    
    save,
    get_selfcheckout_setting
};

const API_URL = Config.key.OP_API_URL

function save(customer) {
    return serverRequest.clientServiceRequest('POST', `/ShopCustomer/Save`, customer)
    .then(handleResponse);
}

function get_selfcheckout_setting() {
    return serverRequest.clientServiceRequest('GET', `/SelfCheckoutSetting/GetAsync`,null,1)
    .then(handleResponse => {
        return handleResponse;
    })
    
}