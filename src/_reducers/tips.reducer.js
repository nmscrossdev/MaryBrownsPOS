import { tipsConstants } from '../_constants';

export function tipslist(state = {}, action) {
    switch (action.type) {
        case tipsConstants.GETALL_SUCCESS:
            return {
                tipslist: action.tipslist
            };
        case tipsConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case tipsConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}