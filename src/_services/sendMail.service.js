import Config from '../Config'
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const sendMailService = {
    send,sendExternal
};

const API_URL = Config.key.OP_API_URL
function send(data) {
    
    return serverRequest.clientServiceRequest('POST', `/Mail/Send`, data)
        .then(response => {
            return response;
        });
}
function sendExternal(data) {
    
    return serverRequest.clientServiceRequest('POST', `/Mail/ExternalSend`, data)
        .then(response => {
            return response;
        });
}




