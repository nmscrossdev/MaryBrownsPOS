import { taxRateConstants } from '../_constants';
import { taxRateService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';

export const taxRateAction = {
    refresh,
    getTaxSetting,
    selectedTaxList,
    getGetRates,
    getIsMultipleTaxSupport
};

function refresh() {
    return { type: taxRateConstants.GETALL_REFRESH };
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : update tax rate when change tax rate .
 * 
 * Updated By   : 
 * Updated Date : 05-05-2019
 * Description :    
*/
function selectedTaxList(taxlist) {
    return dispatch => {
        dispatch(request());
        dispatch(success(taxlist));
    };
    function request() { return { type: taxRateConstants.GET_TAXLIST_REQUEST } }
    function success(selectedTaxList) { return { type: taxRateConstants.GET_TAXLIST_SUCCESS, selectedTaxList } }
}

/**
 * Updated By   : Aman
 * Updated Date : 31-07-2020
 * Description : IsSuccess of undefined Bugsnag issue, defined get_tax_setting on line no 46.  
*/
function getTaxSetting() {
    return dispatch => {
        dispatch(request());
        taxRateService.getTaxSetting()
            .then(
                get_tax_setting => {
                    if (get_tax_setting && get_tax_setting.is_success == false && get_tax_setting.message == "You are not authorized.") {
                        history.push('/login');
                    }
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if (demoUser) {
                    //     GTM_OliverDemoUser("TaxSetting: Getting tax setting details")
                    // }
                    dispatch(success(get_tax_setting))
                    if (get_tax_setting && get_tax_setting.content) {
                        localStorage.setItem("TAX_SETTING", JSON.stringify(get_tax_setting.content))
                    }
                    error => {
                        dispatch(failure(error.toString()))
                        dispatch(alertActions.error(error.toString()))
                    }
                }
            );
    };
    function request() { return { type: taxRateConstants.GET_TAXSETTING_REQUEST } }
    function success(get_tax_setting) { return { type: taxRateConstants.GET_TAXSETTING_SUCCESS, get_tax_setting } }
    function failure(error) { return { type: taxRateConstants.GET_TAXSETTING_FAILURE, error } }

}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : get first time all tax rate.
 * 
 * Updated By   : 
 * Updated Date : 17-06-2019
 * Description :    
*/
function getGetRates() {
    return dispatch => {
        dispatch(request());
        taxRateService.getGetRates()
            .then(
                get_tax_rates => {
                    if (get_tax_rates && get_tax_rates.content) {
                        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                        // if (demoUser) {
                        //     GTM_OliverDemoUser("TaxSetting: Get tax rates")
                        // }
                        dispatch(success(get_tax_rates.content))
                    }
                    error => {
                        dispatch(failure(error.toString()))
                        dispatch(alertActions.error(error.toString()))
                    }
                }
            );
    };
    function request() { return { type: taxRateConstants.GET_TAX_RATES_REQUEST } }
    function success(get_tax_rates) { return { type: taxRateConstants.GET_TAX_RATES_SUCCESS, get_tax_rates } }
    function failure(error) { return { type: taxRateConstants.GET_TAX_RATES_FAILURE, error } }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 21-06-2019
 * Description  : for check single tax aplly or not.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getIsMultipleTaxSupport() {
    return dispatch => {
        dispatch(request());
        taxRateService.getIsMultipleTaxSupport()
            .then(
                multiple_tax_support => {
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if (demoUser) {
                    //     GTM_OliverDemoUser("TaxSetting: Multiple tax support setting")
                    // }
                    dispatch(success(multiple_tax_support))
                    error => {
                        dispatch(failure(error.toString()))
                    }
                }
            );
    };
    function request() { return { type: taxRateConstants.CHECK_MULTIPLE_TAX_RATES_REQUEST } }
    function success(multiple_tax_support) { return { type: taxRateConstants.CHECK_MULTIPLE_TAX_RATES_SUCCESS, multiple_tax_support } }
}
