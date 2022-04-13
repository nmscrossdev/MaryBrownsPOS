import { selfcheckoutConstants } from '..';
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