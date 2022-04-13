import Config from '../Config'
import { get_UDid } from '../ALL_localstorage'
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const categoriesService = {
    getAll,
    refresh
};

const API_URL = Config.key.OP_API_URL
function refresh() {
    // remove user from local storage to log user out
}

function getAll() {
   
    var UDID = get_UDid('UDID');
    //Added by Aatifa 15/7/2020
    try{
        return serverRequest.clientServiceRequest('GET', `/Category/Get`, '')
            .then(categorylist => {
                return categorylist.content;
            }).catch(error => {
                return error
            });;
    }
    catch(error)
    {
        console.log(error);
    }
    ////////////////////////
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}