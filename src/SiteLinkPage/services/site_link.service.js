import Config from '../../Config';
import { serverRequest } from "../../CommonServiceRequest/serverRequest";
export const siteService = {
    getAll
};

const API_URL = Config.key.OP_API_URL
function getAll() {
    return serverRequest.clientServiceRequest('GET', `/users`, '')
    .then(res=>{

    });
}
