import Config from '../../Config'
import { get_UDid } from '../../ALL_localstorage'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const checkoutService = {
    getAll,
    save,
    orderToVoid,
    getCashRounding,
    getPaymentTypeName,
    getMakePayment,
    orderToCancelSale,
    getOrderReceiptDetail,
    updatePoducts,
    checkTempOrderSync,
    recheck_TempOrderSync,
    checkTempOrderStatus,
    GetExtensions,
    getDoSale,
    updateOrderStatus,
    makeOnlinePayments
};

const API_URL = Config.key.OP_API_URL
function getPaymentTypeName(udid, registerId) {
    return serverRequest.clientServiceRequest('GET', `/PaymentType/Get?RegisterId=${registerId}`, '')
        .then(res => {
            return res
        })
}

function getAll() {

    return serverRequest.clientServiceRequest('GET', `/users`, '')
        .then(res => {
            return res
        });
}

function orderToVoid(order_id, udid,WarehouseId) {

    return serverRequest.clientServiceRequest('GET', `/orders/VoidSale?udid=${udid}&OrderId=${order_id}&WarehouseId=${WarehouseId}`, '')
        .then(res => {
            return res
        })
}

function orderToCancelSale(order_id, udid,WarehouseId) {

    return serverRequest.clientServiceRequest('GET', `/orders/CancelledSale?udid=${udid}&OrderId=${order_id}&WarehouseId=${WarehouseId}`, '')
        .then(res => {
return res
        })
}
/** 
 * Created By: 
 *  created Date: 
 * Modified By : Nagendra
 *  Modified Date: 26/06/2019
 *  Decription: Modify for creating temp order that will show in notification 
*/
function save(shop_order) {

    return serverRequest.clientServiceRequest('POST', `/orders/CreateOliverOrder`, shop_order)
        .then(shop_order => {
            return shop_order;
        });
}
/** 
 * Created By: Nagendra
 *  created Date: 05/05/02020
 
 *  Decription: Update order status 
*/
function updateOrderStatus(shop_order) {
    return serverRequest.clientServiceRequest('POST', `/orders/ChangeStatus`, shop_order)
        .then(shop_order => {
            return shop_order;
        });
}
function getOrderReceiptDetail() {
    var UDID = get_UDid('UDID');
    try {
        return serverRequest.clientServiceRequest('GET', `/PrintSettings/Get`, '',2)
            .then(reciept => {
                var reciepts = reciept.content
                return reciepts;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}

function getCashRounding(udid) {
    try {
        return serverRequest.clientServiceRequest('GET', `/orders/GetCashRounding?udid=${udid}`, '')

            .then(cashRes => {
                return cashRes;
            })
            .catch(error => console.log(error));
    }
    catch (error) {
        console.log(error);
    }
}

function getMakePayment(udid, registerId, paycode, amount, command, transId) {

  var parma={"registerId":registerId,"paycode":paycode,"amount":amount,"command":command, "refId" : transId};
  // var parma={"registerId":registerId,"paycode":'test_tip',"amount":amount,"command":command, "refId" : transId};
    return serverRequest.clientServiceRequest('POST', `/Payments/RunTransaction`,parma)
        .then(res => {
            return res
         })
         .catch(error =>{
                return {"is_success":false,"message":error !== "" && error.Message ? error.Message : 'An error has occurred.',"content":null,"exceptions":null,"status_code":202,"subscription_expired":false}
         })
        }
    

function updatePoducts(cartlist) {
    var items = [];
    var data;
    var udid = get_UDid('UDID');
    if (cartlist != null) {
        cartlist && cartlist.map(value => {
            items.push({
                ProductId: value.variation_id == 0 ? value.product_id : value.variation_id,
                Quantity: value.quantity,
                possition: 0,
                success: false
            })
        })
    }
    data = {
        udid: udid,
        productinfos: items,
        WarehouseId:localStorage.getItem("WarehouseId")? parseInt(localStorage.getItem("WarehouseId")):0
    }
    return serverRequest.clientServiceRequest('POST', `/Product/CheckStock`, data)
        .then(result => {
            return result
        })
}


/**
 * Created By: Shakuntala Jatav
 * Created Date : 06-08-2019
 * Description: get dynamic true diamond html url
 * @param // udid is int
 */
function GetExtensions() {

    var UDID = get_UDid('UDID');
    //Added by Aatifa 15/7/2020
    try {
        return serverRequest.clientServiceRequest('GET', `/Extensions/Get`, '')
            .then(result => {
                var result = result.content
                return result;
            })
            .catch(error => {
                return error
            });
    }
    catch (error) {
        console.log(error);
    }
    ///////////////////////////
}

/**
 * Created By: Shakuntala Jatav
 * Created Date : 04-10-2019
 * Description: 
 * @param // udid is int
 */
function getDoSale() {

    var UDID = get_UDid('UDID');
    return serverRequest.clientServiceRequest('GET', `/orders/CheckSaleLimit`, '')
        .then(result => {
            return result;
        });
}


function TicketEvent(udid, eventarray) {
    return serverRequest.clientServiceRequest('GET', `/Tickera/GetEventByEventId?udid=${udid}&event_id=${eventarray}`, '')
        .then(events => {
            /// Ticket_event.push(events)
            //  console.log("Ticket_event",Ticket_event);

            // if(Ticket_event.length == eventarray.length ){
            //        console.log("barbar ho gaye",Ticket_event.length,eventarray.length,Ticket_event)
            //     return Ticket_event
            //   }
            return events;
        })

    //    })
}

/**  
 * Created By   : Nagendra
 *  Created Date : 26-06-2019
 *  Description  : Check temp order synced or not
 *  Modified By  : 
 *  Modified Date: 
 *  Decription   : 
*/
function checkTempOrderSync(udid, tempOrderId) {
    return serverRequest.clientServiceRequest('GET', `/orders/IsSynced?OrderId=${tempOrderId}`, '')
        .then(synckRes => {
            console.log("synckRes", synckRes);
            return synckRes;
        });

}

/**  
 * Created By   : Nagendra
 *  Created Date : 15-10-2019
 *  Description  : Check temp order status
 *  Modified By  : 
 *  Modified Date: 
 *  Decription   : 
*/
function checkTempOrderStatus(udid, tempOrderId) {
    return serverRequest.clientServiceRequest('GET', `/orders/Status?OrderId=${tempOrderId}`, '')
        .then(synckRes => {
            console.log("orderStatus", synckRes);
            return synckRes;
        });

}

function recheck_TempOrderSync(udid, orderId) {
    return serverRequest.clientServiceRequest('GET', `/orders/Sync?OrderId=${orderId}`, '')
        .then(synckResponse => {
            return synckResponse;
        });

}

// online payment service
function makeOnlinePayments(cardData) {
    return serverRequest.clientServiceRequest('POST', `/OnlinePayments/RunTransaction`,cardData)

    //  return serverRequest.clientServiceRequest('POST', `/OnlinePayments/ChargeCreditCard`,cardData)
         .then(res => {
             return res
          })
 }
