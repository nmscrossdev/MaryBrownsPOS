import { exchangeRateConstants } from '../_constants';
import { exchangerateService } from '../_services';

export const exchangerateActions = {
    getUSDConversionRate
};



/**
 * Updated By   : Nagendra
 * Updated Date : 27-01-2021
 * Description : Get the current exchange rate of $
*/
function getUSDConversionRate() {
    return dispatch => {
        dispatch(request()); 
        exchangerateService.getUSDConversionRate()
            .then(
                response => {
                    if (response ) {
                      localStorage.setItem("USDConversionRate", response);
                    }                   
                    dispatch(success(response))                   
                    error => {
                        dispatch(failure(error.toString()))                       
                    }
                }
            );
    };
    function request() { return { type: exchangeRateConstants.GETALL_REQUEST} }
    function success(exchnagerate) { return { type: exchangeRateConstants.GETALL_SUCCESS, exchnagerate } }
    function failure(error) { return { type: exchangeRateConstants.GETALL_FAILURE, error } }

}
