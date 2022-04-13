import Config from '../Config'
import { history } from '../_helpers';
import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'
import { redirectToURL } from '../_components/CommonJS';

export const taxRateService = {
    refresh,
    getTaxSetting,
    getTaxRateList,
    getGetRates,
    getIsMultipleTaxSupport
};

const API_URL = Config.key.OP_API_URL

function refresh() {
    // remove user from local storage to log user out
}

function getTaxSetting() {
    var UDID = get_UDid('UDID');

    //Added by Aatifa 15/7/2020
    try {
        return serverRequest.clientServiceRequest('GET', `/Tax/Privileges`, '')
            .then(response => {
                return response;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error);
        return error;
    }
    ////////////////////////
}

/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : for call api local tax  rate  list .
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getTaxRateList(udid) {

    try {
        return serverRequest.clientServiceRequest('GET', `/Tax/Get`, '')
            .then(response => {
                return response;
            }).catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}

/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 17-06-2019
 * Description  : get first time all tax rate.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getGetRates() {
    var UserLocation = localStorage.getItem('UserLocations') ? JSON.parse(localStorage.getItem('UserLocations')) : [];
    var UDID = get_UDid('UDID');
    var loc_country = "";
    var loc_country_state = "";
    var loc_city = "";
    var loc_postcode = "";
    var loc_address_1 = "";
    var isDemoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
    if (isDemoUser) {
        if (UserLocation && UserLocation.length > 0) {
            UserLocation.map(loc => {
                loc_country = loc.country_name;
                loc_country_state = loc.state_name;
                loc_city = loc.city;
                loc_postcode = loc.zip?loc.zip.replace(/[^a-zA-Z0-9]/g, ''):""; //to change all characters except numbers and letters
                loc_address_1 = loc.address_1;
            })
        } else {
            // history.push('/loginpin');
            redirectToURL()
        }
    }
    else {
        if (UserLocation && localStorage.getItem("Location") && UserLocation.length > 0) {
            UserLocation.map(loc => {
                if (loc.id == localStorage.getItem("Location")) {
                    loc_country = loc.country_name;
                    loc_country_state = loc.state_name;
                    loc_city = loc.city;
                    loc_postcode = loc.zip?loc.zip.replace(/[^a-zA-Z0-9]/g, ''):"";
                    loc_address_1 = loc.address_1;
                }
            })
        } else {
            // history.push('/loginpin');
            redirectToURL()
        }
    }

    //Added by Aatifa 15/7/2020
    try {
        return serverRequest.clientServiceRequest('POST', `/Tax/Search`, { UDID, loc_country, loc_country_state, loc_city, loc_postcode, loc_address_1 })
            .then(response => {
                return response;
            })
            .catch(error => {
                console.log(error);
                return error
            });
    }
    catch (error) {
        console.log(error);
    }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 21-06-2019
 * Description  : get first time all tax rate.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getIsMultipleTaxSupport() {
    var UDID = get_UDid('UDID');

    return serverRequest.clientServiceRequest('GET', `/Tax/IsSupportMultipe`, '')
        .then(response => {
            return response.content;
        });
}





