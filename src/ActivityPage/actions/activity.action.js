import { activityConstants, activityService } from '../index'
import { parse } from 'path';
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';

export const activityActions = {
    getAll,
    getDetail,
    filteredListOrder,
    Sendmail,
    getOne,
    getFilteredActivities,
    deleteDuplicateOrder,
};

function getOne(uid, pagesize, pagenumber) {
    return dispatch => {
        dispatch(request());
        activityService.getAll(uid, pagesize, pagenumber)
            .then(
                activities => {
                    if (localStorage.getItem('selected_row') !== 'customerview') {
                        localStorage.setItem("CUSTOMER_TO_ACTVITY", activities && activities[0] && activities[0].order_id)
                    }
                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //      GTM_OliverDemoUser("ActivityView: Active customer")
                    // }
                    dispatch(success(activities)),
                        error => dispatch(failure(error.toString()))
                }
            );
        function request() { return { type: activityConstants.GETONE_REQUEST } }
        function success() { return { type: activityConstants.GETONE_SUCCESS } }
        function failure(error) { return { type: activityConstants.GETONE_FAILURE, error } }
    };
}

function getAll(uid, pagesize, pagenumber) {
    return dispatch => {
        dispatch(request());
        activityService.getAll(uid, pagesize, pagenumber)
            .then(
                activities => {
                    if (localStorage.getItem('selected_row') !== 'customerview') {
                        localStorage.setItem("CUSTOMER_TO_ACTVITY", activities && activities[0] && activities[0].order_id)
                        localStorage.removeItem('CUSTOMER_TO_OrderId')
                    }
                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //      GTM_OliverDemoUser("Activity: Get all customer")
                    // }
                    dispatch(success(activities))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: activityConstants.GETALL_REQUEST } }
    function success(activities) { return { type: activityConstants.GETALL_SUCCESS, activities } }
    function failure(error) { return { type: activityConstants.GETALL_FAILURE, error } }
}
function getFilteredActivities(_filterParameter) {
    return dispatch => {
        dispatch(request());
        activityService.getFilteredActivities(_filterParameter)
            .then(
                filterActivities => {
                    if (localStorage.getItem('selected_row') !== 'customerview') {
                        localStorage.setItem("CUSTOMER_TO_ACTVITY", filterActivities && filterActivities[0] && filterActivities[0].order_id)
                        localStorage.removeItem('CUSTOMER_TO_OrderId')
                    }
                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //      GTM_OliverDemoUser("Activity: Get All filter activity data")
                    // }
                    dispatch(success(filterActivities))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: activityConstants.GET_FILTER_REQUEST } }
    function success(filterActivities) { return { type: activityConstants.GET_FILTER_SUCCESS, filterActivities } }
    function failure(error) { return { type: activityConstants.GET_FILTER_FAILURE, error } }
}
function getDetail(ordid, UID) {
    return dispatch => {
        dispatch(request());
        activityService.getDetail(ordid, UID)
            .then(
                single_Order_list => {
                    if (localStorage.getItem('selected_row') == 'customerview') {
                        localStorage.removeItem('selected_row')
                    }
                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //      GTM_OliverDemoUser("Activity: Get single order list")
                    // }
                   // sessionStorage.setItem("OrderDetail",JSON.stringify( single_Order_list));
                    dispatch(success(single_Order_list)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: activityConstants.GET_DETAIL_REQUEST } }
    function success(single_Order_list) { return { type: activityConstants.GET_DETAIL_SUCCESS, single_Order_list } }
    function failure(error) { return { type: activityConstants.GET_DETAIL_FAILURE, error } }
}
function deleteDuplicateOrder(ordid) {
    return dispatch => {
        dispatch(request());
        activityService.deleteDuplicateOrder(ordid)
            .then(
                delete_request => {
                  
                    dispatch(success(delete_request)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: activityConstants.ORDER_DELETE_REQUEST } }
    function success(delete_request) { return { type: activityConstants.ORDER_DELETE_SUCCESS, delete_request } }
    function failure(error) { return { type: activityConstants.ORDER_DELETE_FAILURE, error } }
}
function filteredListOrder(filteredListOrder) {
    return dispatch => {
        dispatch(success(filteredListOrder))
    };
    function success(filteredListOrder) { return { type: activityConstants.GET_FILTER_ORDER_LIST_SUCCESS, filteredListOrder } }
}

function Sendmail(mail) {
    return dispatch => {
        dispatch(request());
        activityService.mailSend(mail)
            .then(
                mail_success => {
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //     GTM_OliverDemoUser("Activity: Email sent")
                    // }
                    dispatch(success(mail_success)),
                    error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: activityConstants.SEND_EMAIL_REQUEST } }
    function success(mail_success) { return { type: activityConstants.SEND_EMAIL_SUCCESS, mail_success } }
    function failure(error) { return { type: activityConstants.SEND_EMAIL_FAILURE, error } }
}
