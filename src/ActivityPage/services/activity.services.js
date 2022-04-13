import Config from '../../Config'
import { serverRequest } from "../../CommonServiceRequest/serverRequest";
export const activityService = {
    getAll,
    getDetail,
    mailSend,
    getFilteredActivities,
    deleteDuplicateOrder
};

const API_URL = Config.key.OP_API_URL
function getAll(uid, pagesize, pagenumber) {
    const d = new Date();
    var time=d.getTime();
    return serverRequest.clientServiceRequest('GET', `/orders/GetPage?pagesize=${pagesize}&pagenumber=${pagenumber}&time=${time}`, '')
        .then(activityorderRes => {
            var activities = activityorderRes.content && activityorderRes.content.Records;
            return activities;
        });
}

function getDetail(ordid, uid) {
    return serverRequest.clientServiceRequest('GET', `/orders/Details?OrderNumber=${ordid}`, '')
        .then(res => { return res})
}

function deleteDuplicateOrder(ordid) {
    return serverRequest.clientServiceRequest('GET', `/Orders/DeleteSale?OrderId=${ordid}`, '')
        .then(res => { return res})
}

/** 
 * Created By: Nagendra
 *  created Date: 29/04/2020
 *  Decription: Call api to get filtered order on the basis of give parameters 
*/
function getFilteredActivities(_filterParameter) {
    return serverRequest.clientServiceRequest('POST', `/orders/GetPage`, _filterParameter)
        .then(activityorderRes => {
            var activities = activityorderRes.content && activityorderRes.content.Records;
            return activities;
        });
}

function mailSend(mail) {
    var Email_id = mail
    return serverRequest.clientServiceRequest('GET', `/send?to=${Email_id}`, '')
        .then(res => { return res })
}
