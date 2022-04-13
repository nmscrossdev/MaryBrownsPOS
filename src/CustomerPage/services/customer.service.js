import Config from '../../Config'
import { get_UDid } from '../../ALL_localstorage'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const customerService = {
    getAll,
    getPage,
    save,
    getDetail,
    Delete,
    removeStoreCredit,
    filteredList,
    getCountryList,
    getStateList,
    update,
    updateCreditScore,
    updateCustomerNote,
    getAllEvents
};

const API_URL = Config.key.OP_API_URL

function getPage(uid, pageSize, pageNumber) {
    var customer_list = [];
    return serverRequest.clientServiceRequest('GET', `/customers/GetPage?pageSize=${pageSize}&pageNumber=${pageNumber}`, '')
        .then(result => {           
            var new_list = result && result.content;
            if (new_list && new_list.Records && new_list.Records.length>0) {
                new_list.Records.map(item => {
                    if (item.WPId !== "" && item.WPId !== 0) {
                        customer_list.push(item)
                    }
                })
                result.content['Records'] = customer_list;
                sessionStorage.setItem("CUSTOMER_ID", customer_list[0].WPId)
            }
           
            return result;
        });
}

function getAll(uid) {
    return serverRequest.clientServiceRequest('GET', `/ShopCustomer/GetAll?Udid=${uid}`, '')
        .then(res => {
            return res
        });

}
function getCountryList() {
    var UID = get_UDid('UDID');
    //Added by Aatifa 15/7/2020
    try {
        return serverRequest.clientServiceRequest('GET', `/Country/Get`, '')
            .then(countrylist => {
                return countrylist;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error);
    }
    ///////////////////////
}

function getStateList() {
    var UID = get_UDid('UDID');
    try {
        return serverRequest.clientServiceRequest('GET', `/States/Get`, '')
            .then(statelist => {
                return statelist;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error)
    }
}

function getDetail(id, uid) {
    return serverRequest.clientServiceRequest('GET', `/Customers/Details?wpid=${id}`, '')
        .then(singleList => {
            return singleList;
        })
}

//Get All Events of a customer
function getAllEvents(id, uid) {
    var param = {
        wpid : id,
        Udid:uid
    }
    return serverRequest.clientServiceRequest('POST', `/Customers/GetCustomerEvents`, param)
        .then(singleList => {
            return singleList;
        })
}

function save(customer) {

    return serverRequest.clientServiceRequest('POST', `/customers/Save`, customer)
        .then(res => {
            return res
        })
}

function update(customer) {

    return serverRequest.clientServiceRequest('POST', `/customers/Update`, customer)
        .then(res => {
            return res
        })
}

function filteredList(udid, pageSize, filtervalue) {
    return serverRequest.clientServiceRequest('POST', `/customers/GetPage`, {
        "UDID": udid,
        "pageSize": pageSize,
        "pageNumber": 1,
        "isSearch": true,
        "searchVal": filtervalue,
    })
        .then(res => {
            return res
        })
}

function Delete(id, uid) {

    return serverRequest.clientServiceRequest('GET', `/customers/Delete?wpid=${id}`, '')
        .then(res => {
            return res
        });
}

function removeStoreCredit(uid, id, amount) {
    return serverRequest.clientServiceRequest('GET', `/customers/RemoveFromStoreCredit?Udid=${uid}&Id=${id}&point=${amount}`, '')
        .then(res => {
            return res
        })
}

function updateCreditScore(CustomerWpid, AddPoint, DeductPoint, Notes, Udid) {

    return serverRequest.clientServiceRequest('POST', `/customers/AdjustStoreCredit`, {
        "CustomerWpid": CustomerWpid,
        "AddPoint": AddPoint,
        "DeductPoint": DeductPoint,
        "Notes": Notes,
        "Udid": Udid,
    })
        .then(res => {
            return res
        })
}

function updateCustomerNote(wpid, Notes, metadata) {

    return serverRequest.clientServiceRequest('POST', `/customers/SaveNote`, {
        "wpid": wpid,
        "notes": Notes,
        "MetaData": metadata,
    })
        .then(res => {
            return res
        })
}