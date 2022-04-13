import Config from '../Config'
import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'
export const allProductService = {
    getAll,
    getAttributes,
    refresh,
    ticket_FormL_ist,
    productWarehouseQuantity
};

const API_URL = Config.key.OP_API_URL
function refresh() {
    // remove user from local storage to log user out
}

function getAll() {
    
    var UDID = get_UDid('UDID');
    //Added by Aatifa 15/7/2020
    try {
        return serverRequest.clientServiceRequest('GET', `/ShopData/GetAllProducts?Udid=${UDID}`, '')
            .then(productlst => {
                return productlst.Content;
            })
            .catch(error => {
                return error
            });
    } catch (error) {
        console.log(error);
    }
    /////////////////////////
}

function ticket_FormL_ist(udid, frmid) {
    return serverRequest.clientServiceRequest('GET', `/Tickera/GetFormById?udid=${udid}&form_id=${frmid}`, '')
        .then(ticket => {
            var ticketlist = ticket.content
            return ticketlist;
        });
}

function getAttributes() {
    
    var UDID = get_UDid('UDID');
    try {
        return serverRequest.clientServiceRequest('GET', `/Attributes/Get`, '')
            .then(attributelist => {
                return attributelist.content;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error);
    }
}

function productWarehouseQuantity(productId) {      
    try {
        return serverRequest.clientServiceRequest('GET', `/Product/GetWarehouseQuantity?wpid=${productId}`, '')
            .then(productdetail => {
                return productdetail;
            })
            .catch(error => {
                return error
            });
    } catch (error) {
        console.log(error);
    }
    /////////////////////////
}



