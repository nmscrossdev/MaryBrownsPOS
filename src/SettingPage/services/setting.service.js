import Config from '../../Config'
import {serverRequest} from '../../CommonServiceRequest/serverRequest'
export const settingService = {
    getAll
};

const API_URL = Config.key.OP_API_URL
function getAll() {
    return serverRequest.clientServiceRequest('GET', `/users`, '')
        .then(res => {
            console.log('res', res);
            return res
        });
}
