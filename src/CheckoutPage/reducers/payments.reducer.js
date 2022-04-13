import { paymentConstants } from '../constants/payments.constants';

export function make_payconiq_payment(state = {}, action) {
    switch (action.type) {
        case paymentConstants.PAYCONIQ_PAYMENTS_REQUEST:
            return {
                loading: true
            };
        case paymentConstants.PAYCONIQ_PAYMENTS_SUCCESS:
            return {
                items: action.payconiq_payment
            };
        case paymentConstants.PAYCONIQ_PAYMENTS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function check_payconiq_pay_status(state = {}, action) {
    switch (action.type) {
        case paymentConstants.PAYCONIQ_STATUS_REQUEST:
            return {
                loading: true
            };
        case paymentConstants.PAYCONIQ_STATUS_SUCCESS:
            return {
                items: action.payconiq_status
            };
        case paymentConstants.PAYCONIQ_STATUS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function cancel_payconiq_payment(state = {}, action) {
    switch (action.type) {
        case paymentConstants.PAYCONIQ_CANCEL_REQUEST:
            return {
                loading: true
            };
        case paymentConstants.PAYCONIQ_CANCEL_SUCCESS:
            return {
                items: action.payconiq_cancel_res
            };
        case paymentConstants.PAYCONIQ_CANCEL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}