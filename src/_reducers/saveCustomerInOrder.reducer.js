import { saveCustomerInOrderConstants } from '../_constants';

export function saveCustomer(state = {}, action) {
    switch (action.type) {
        case saveCustomerInOrderConstants.SCIO_SUCCESS:
            return {
                saveCustomer: action.saveCustomer
            };
        case saveCustomerInOrderConstants.SCIO_FAILURE:
            return {
                error: action.error
            };
        case saveCustomerInOrderConstants.SCIO_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}

export function getSuccess(state = {}, action) {
    switch (action.type) {
        case saveCustomerInOrderConstants.SEND_MAIL_TEMP_ORDER_REQUEST:
            return {
                loading: true
            };
        case saveCustomerInOrderConstants.SEND_MAIL_TEMP_ORDER_SUCCESS:
            return {
                items: action.getSuccess
            };
        case saveCustomerInOrderConstants.SEND_MAIL_TEMP_ORDER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}