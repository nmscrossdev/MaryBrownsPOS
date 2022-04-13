import { activityConstants } from '../index';

export function activities(state = {}, action) {
    switch (action.type) {
        case activityConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case activityConstants.GETALL_SUCCESS:
            return {
                activities: action.activities
            };
        case activityConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case activityConstants.GET_FILTER_REQUEST:
            return {
                loading: true
            };
        case activityConstants.GET_FILTER_SUCCESS:
            return {
                filterActivities: action.filterActivities
            };
        case activityConstants.GET_FILTER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function single_Order_list(state = {}, action) {
    switch (action.type) {
        case activityConstants.GET_DETAIL_REQUEST:
            return {
                loading: true
            };
        case activityConstants.GET_DETAIL_SUCCESS:
            return {

                items: action.single_Order_list
            };
        case activityConstants.GET_DETAIL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function filteredListOrder(state = {}, action) {
    switch (action.type) {
        case activityConstants.GET_FILTER_REQUEST:
            return {
                loading: true
            };
        case activityConstants.GET_FILTER_ORDER_LIST_SUCCESS:
            return {
                items: action.filteredListOrder
            };
        case activityConstants.GET_FILTER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function mail_success(state = {}, action) {
    switch (action.type) {
        case activityConstants.SEND_EMAIL_REQUEST:
            return {
                loading: true
            };
        case activityConstants.SEND_EMAIL_SUCCESS:
            return {
                items: action.mail_success
            };
        case activityConstants.SEND_EMAIL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function deleteDuplicateOrder(state = {}, action) {
    switch (action.type) {
        case activityConstants.ORDER_DELETE_REQUEST:
            return {
                loading: true
            };
        case activityConstants.ORDER_DELETE_SUCCESS:
            return {
                items: action.delete_request
            };
        case activityConstants.ORDER_DELETE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}