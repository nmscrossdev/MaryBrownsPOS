import { refundConstants } from '../';

export function refundOrder(state = {}, action) {
    switch (action.type) {
        case refundConstants.REFUND_GETALL_REQUEST:
            return {
                loading: true
            };
        case refundConstants.REFUND_GETALL_SUCCESS:
            return {
                items: action.refundOrder
            };
        case refundConstants.REFUND_GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

