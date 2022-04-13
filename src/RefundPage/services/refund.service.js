import Config from '../../Config'
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export const refundService = {
    refundOrder
};

const API_URL = Config.key.OP_API_URL
function refundOrder(data) {
    
    return serverRequest.clientServiceRequest('POST', `/orders/Refund`, data)
        .then(refundResponse => {
            var refund = refundResponse;
            return refund;
        });
}