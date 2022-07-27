// import Config from '../Config'
// import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'
export const productModifier = {
    getAll,
    refresh,
};

// const API_URL = Config.key.OP_API_URL
function refresh() {
    // remove user from local storage to log user out
}

function getAll(pageSize,pageNumber) {
    try {
        return serverRequest.clientServiceRequest('GET', `/ProductModifier/Records?pageSize=${pageSize}&pageNumber=${pageNumber}`, '')
            .then(productlst => {
                return productlst.content;
            })
            .catch(error => {
                return error
            });
    } catch (error) {
        console.log(error);
    }
    /////////////////////////
}




