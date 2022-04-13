import Config from '../Config';
import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const inventoryService = {
    addInventoryQuantity,
    getTicketSeatForm,
    getReservedTikeraChartSeat
};

const API_URL = Config.key.OP_API_URL
function addInventoryQuantity(data) {
    // return serverRequest.clientServiceRequest('GET', `/ShopData/GetUpdateInventory?udid=${data.udid}&wpid=${data.wpid}&quantity=${data.quantity}`, '')

    return serverRequest.clientServiceRequest('POST', `/Product/UpdateInventory`, {'wpid' : data.wpid  ,"Quantity" :parseInt(data.quantity),"WarehouseId":data.WarehouseId })
        .then(response => {
            return response;
        });
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 20-06-2019
 * Description  : call api for tiket seating form.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getTicketSeatForm(event_id, product_id, udid) {
    
    return serverRequest.clientServiceRequest('GET', `/Tickera/GetChartsByEventandProductId?udid=${udid}&event_id=${event_id}&product_id=${product_id}`, '')
        .then(response => {
            return response;
        });
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 20-06-2019
 * Description  : call api for tiket seating form.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
function getReservedTikeraChartSeat(udid, chart_id) {
    return serverRequest.clientServiceRequest('GET', `/Tickera/GetTikeraUpdetedChartSeat?udid=${udid}&chart_id=${chart_id}`, '')
        .then(response => {
            return response;
        });
}
