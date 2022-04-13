import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'


export const exchangerateService = {
    getUSDConversionRate
};

function getUSDConversionRate() {  
    try {

        var UDID = get_UDid('UDID');
        try {
            return serverRequest.clientServiceRequest('GET', `/Shop/GetUSDConversionRate`, '')
                .then(discountlst => {                   
                    return discountlst.content;
                })
                .catch(error => console.log(error));
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }   
}




