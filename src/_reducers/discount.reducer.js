import { discountConstants } from '../_constants';

export function discountlist(state = {}, action) {
    switch (action.type) {
        case discountConstants.GETALL_SUCCESS:
            return {
                discountlist: action.discountlist
            };
        case discountConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case discountConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}