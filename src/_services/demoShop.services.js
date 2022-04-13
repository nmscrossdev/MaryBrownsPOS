import { serverRequest } from '../CommonServiceRequest/serverRequest'
export const demoShopService = {
    updateDemoShop,
    completeDemoShop
};

function updateDemoShop(id) {
    return serverRequest.clientServiceRequest('GET', `/Subcriptions/UpdateDemoShop?guid=${id}`, '').then(res => {
        return res;
    })
        .catch(error => {
            return error
        });
}

function completeDemoShop(clientId, visitorId) {
    try {
        return serverRequest.clientServiceRequest('GET', `/Subcriptions/CompleteDemo?guid=${clientId}&UsingBy=${visitorId}`, '').then(res => {
            return res;
        })
            .catch(error => {
                return error
            });
    } catch (err) {
        console.log(err);
    }

}




