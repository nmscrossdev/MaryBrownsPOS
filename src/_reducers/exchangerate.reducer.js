import { exchangeRateConstants } from '../_constants';

export function exchnagerate(state = {}, action) {
    switch (action.type) {
        case exchangeRateConstants.GETALL_SUCCESS:
            return {
                exchnagerate: action.exchnagerate
            };
        case exchangeRateConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case exchangeRateConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}