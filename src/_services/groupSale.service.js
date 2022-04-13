import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const groupSaleService = {
    getTableRecord
};

function getTableRecord(locationId,group_sales) {
 
    try {
        return serverRequest.clientServiceRequest('GET', `/TableRecord/GetAll?LocationId=${locationId}&groupname=${group_sales}`, '')
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
  
}




