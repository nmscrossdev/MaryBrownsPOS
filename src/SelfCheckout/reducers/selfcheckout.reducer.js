import { selfcheckoutConstants } from '../constants/selfcheckout.constants';
/** 
 * Created By : Aatifa
 * Created Date : 19/06/2020
 * Description : Insert new customer
 **/
export function customer_save_data(state = {}, action) {
    switch (action.type) {
        case selfcheckoutConstants.INSERT_REQUEST:
            return {
                loading: true
            };
        case selfcheckoutConstants.INSERT_SUCCESS:
            return {
                ...state,
                items: action.customer
            };
        case selfcheckoutConstants.INSERT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function selfcheckout_setting_data(state = {}, action) {
    switch (action.type) {
        case selfcheckoutConstants.SELF_CHECKOUT_SETTING_REQUEST:
            return {
                loading: true
            };
        case selfcheckoutConstants.SELF_CHECKOUT_SETTING_SUCCESS:
            return {
                ...state,
                items: action.self_settings
            };
        case selfcheckoutConstants.SELF_CHECKOUT_SETTING_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}