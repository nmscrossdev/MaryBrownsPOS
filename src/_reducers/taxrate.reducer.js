import { taxRateConstants } from '../_constants';

export function taxratelist(state = {}, action) {
    switch (action.type) {
        case taxRateConstants.GETALL_SUCCESS:
            return {
                taxratelist: action.taxratelist
            };
        case taxRateConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case taxRateConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : action perform of data.
 * 
 * Updated By   : 
 * Updated Date :
 * Description :    
*/
export function get_tax_setting(state = {}, action) {
    switch (action.type) {
        case taxRateConstants.GET_TAXSETTING_SUCCESS:
            return {
                items: action.get_tax_setting
            };
        case taxRateConstants.GET_TAXSETTING_FAILURE:
            return {
                error: action.error
            };
        case taxRateConstants.GET_TAXSETTING_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}

export function selectedTaxList(state = {}, action) {
    switch (action.type) {
        case taxRateConstants.GET_TAXLIST_REQUEST:
            return {
                loading: true
            };
        case taxRateConstants.GET_TAXLIST_SUCCESS:
            return {
                items: action.selectedTaxList
            };
        // case taxRateConstants.GET_TAXSETTING_FAILURE:
        //     return {
        //         error: action.error
        //     };

        default:
            return state
    }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 17-06-2019
 * Description  : action perform of data.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export function get_tax_rates(state = {}, action) {
    switch (action.type) {
        case taxRateConstants.GET_TAX_RATES_REQUEST:
            return {
                loading: true
            };
        case taxRateConstants.GET_TAX_RATES_SUCCESS:
            return {
                items: action.get_tax_rates
            };
        case taxRateConstants.GET_TAX_RATES_FAILURE:
            return {
                error: action.error
            };

        default:
            return state
    }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 21-06-2019
 * Description  : action perform of data.
 * 
 * Updated By   : 
 * Updated Date : 
 * Description :    
*/
export function multiple_tax_support(state = {}, action) {
    switch (action.type) {
        case taxRateConstants.CHECK_MULTIPLE_TAX_RATES_REQUEST:
            return {
                loading: true
            };
        case taxRateConstants.CHECK_MULTIPLE_TAX_RATES_SUCCESS:
            return {
                items: action.multiple_tax_support
            };
        default:
            return state
    }
}