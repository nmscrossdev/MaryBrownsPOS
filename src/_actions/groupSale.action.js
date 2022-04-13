import { groupSaleConstants } from '../_constants';
import { groupSaleService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';

export const groupSaleAction = {
    //refresh,
    getTableRecord,
    // getTableRecord,
    // getGetRates,
    // getIsMultipleTaxSupport
};

// function refresh() {
//     return { type: groupSaleConstants.GETALL_REFRESH };
// }
/** 
 * Created By   : Nagendra
 * Created Date : 29-10-2021
 * Description  :
 * 

*/
function getTableRecord(locationId,group_sales) {
       return dispatch => {
        dispatch(request());
        groupSaleService.getTableRecord(locationId,group_sales)
            .then(
                get_table_Record => {
                    if (get_table_Record && get_table_Record.is_success == true ) {
                       localStorage.setItem("GroupSaleRecord",JSON.stringify(get_table_Record.content))
                       dispatch(success(get_table_Record.content))
                    }
                    error => {
                        dispatch(failure(error.toString()))
                        dispatch(alertActions.error(error.toString()))
                    }
                }
            );
    };
    function request() { return { type: groupSaleConstants.GET_TABLE_RECORD_REQUEST } }
    function success(get_table_Record) { return { type: groupSaleConstants.GET_TABLE_RECORD_SUCCESS, get_table_Record } }
    function failure(error) { return { type: groupSaleConstants.GET_TABLE_RECORD_FAILURE, error } }
}

/**
 * Updated By   : Aman
 * Updated Date : 31-07-2020
 * Description : IsSuccess of undefined Bugsnag issue, defined get_tax_setting on line no 46.  
*/
// function getTaxSetting() {
//     return dispatch => {
//         dispatch(request());
//         groupSaleService.getTaxSetting()
//             .then(
//                 get_tax_setting => {
//                     if (get_tax_setting && get_tax_setting.is_success == false && get_tax_setting.message == "You are not authorized.") {
//                         history.push('/login');
//                     }
//                     var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
//                     // if (demoUser) {
//                     //     GTM_OliverDemoUser("TaxSetting: Getting tax setting details")
//                     // }
//                     dispatch(success(get_tax_setting))
//                     if (get_tax_setting && get_tax_setting.content) {
//                         localStorage.setItem("TAX_SETTING", JSON.stringify(get_tax_setting.content))
//                     }
//                     error => {
//                         dispatch(failure(error.toString()))
//                         dispatch(alertActions.error(error.toString()))
//                     }
//                 }
//             );
//     };
//     function request() { return { type: groupSaleConstants.GET_TAXSETTING_REQUEST } }
//     function success(get_tax_setting) { return { type: groupSaleConstants.GET_TAXSETTING_SUCCESS, get_tax_setting } }
//     function failure(error) { return { type: groupSaleConstants.GET_TAXSETTING_FAILURE, error } }

// }
// /** 
//  * Created By   : Nagendra
//  * Created Date : 29-10-2021
//  * Description  : get first time all tax rate.
//  * 
//  * Updated By   : 
//  * Updated Date : 17-06-2019
//  * Description :    
// */
// function getGetRates() {
//     return dispatch => {
//         dispatch(request());
//         groupSaleService.getGetRates()
//             .then(
//                 get_tax_rates => {
//                     if (get_tax_rates && get_tax_rates.content) {
//                         var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
//                         // if (demoUser) {
//                         //     GTM_OliverDemoUser("TaxSetting: Get tax rates")
//                         // }
//                         dispatch(success(get_tax_rates.content))
//                     }
//                     error => {
//                         dispatch(failure(error.toString()))
//                         dispatch(alertActions.error(error.toString()))
//                     }
//                 }
//             );
//     };
//     function request() { return { type: groupSaleConstants.GET_TAX_RATES_REQUEST } }
//     function success(get_tax_rates) { return { type: groupSaleConstants.GET_TAX_RATES_SUCCESS, get_tax_rates } }
//     function failure(error) { return { type: groupSaleConstants.GET_TAX_RATES_FAILURE, error } }
// }
// /** 
//  * Created By   : Nagendra
//  * Created Date : 21-06-2019
//  * Description  : for check single tax aplly or not.
//  * 
//  * Updated By   :
//  * Updated Date :
//  * Description :    
// */
// function getIsMultipleTaxSupport() {
//     return dispatch => {
//         dispatch(request());
//         groupSaleService.getIsMultipleTaxSupport()
//             .then(
//                 multiple_tax_support => {
//                     var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
//                     // if (demoUser) {
//                     //     GTM_OliverDemoUser("TaxSetting: Multiple tax support setting")
//                     // }
//                     dispatch(success(multiple_tax_support))
//                     error => {
//                         dispatch(failure(error.toString()))
//                     }
//                 }
//             );
//     };
//     function request() { return { type: groupSaleConstants.CHECK_MULTIPLE_TAX_RATES_REQUEST } }
//     function success(multiple_tax_support) { return { type: groupSaleConstants.CHECK_MULTIPLE_TAX_RATES_SUCCESS, multiple_tax_support } }
// }
