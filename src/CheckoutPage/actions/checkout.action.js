import { checkoutConstants } from '../constants/checkout.constants'
import { checkoutService } from '../services/checkout.service';
import { alertActions, cartProductActions } from '../../_actions'
import { idbProductActions } from '../../_actions/idbProduct.action';
import { sendMailAction } from '../../_actions/sendMail.action'
import { get_UDid } from '../../ALL_localstorage';
import { openDb } from 'idb';
import Config from '../../Config';
import moment from 'moment';
import ActiveUser from '../../settings/ActiveUser';
import { ConsoleView } from 'react-device-detect';
import {GTM_oliverOrderComplete} from '../../_components/CommonfunctionGTM'
import { history } from '../../_helpers';
import {cashManagementAction} from '../../CashManagementPage/actions/cashManagement.action'
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import {trackOliverOrderComplete} from '../../_components/SegmentAnalytic'

const tick_event = []
export const checkoutActions = {
    getAll,
    checkItemList,
    save,
    orderToVoid,
    cashRounding,
    getPaymentTypeName,
    getMakePayment,
    orderToCancelledSale,
    Get_TicketEvent,
    getOrderReceipt,
    checkTempOrderSync,
    changeStatusSaleToVoid,
    recheckTempOrderSync,
    GetExtensions,
    getDoSale,
    checkTempOrderStatus,
    updateOrderStatus,
    makeOnlinePayments
};
/**
 *  Updated by :Shakuntala Jatav
 *  Cerated Date:14-08-2019
 *  Description : for update cartlist and checkout list
*/
function getAll(cartlist) {
    return dispatch => {
        
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        // if(demoUser){                   
        //      GTM_OliverDemoUser("CheckoutView: Get All cart list")
        // }
        dispatch(request());
        dispatch(success(cartlist))
        //  error => dispatch(failure(error.toString()))
        // );
    };
    function request() { return { type: checkoutConstants.GETALL_REQUEST } }
    function success(checkoutlist) { return { type: checkoutConstants.GETALL_SUCCESS, checkoutlist } }
    function failure(error) { return { type: checkoutConstants.GETALL_FAILURE, error } }
}

function checkItemList(checkout_list) {
    //var list_item = checkout_list ? checkout_list.ListItem : null;   
    var list_item = checkout_list  && checkout_list.ListItem ? checkout_list.ListItem.filter(item => {return (item.ManagingStock !==false)}) :null; 
    return dispatch => {
        if( ! list_item || list_item ==null || list_item.length==0) {
           var _item=[];
                if(checkout_list  && checkout_list.ListItem){
                    checkout_list.ListItem.map(item=>{
                        _item.push({Message: "",ProductId: item.product_id,Quantity: item.quantity,Message: "",success: true,psummary:item.psummary});
                    });
                }            
             dispatch(success( _item ));
        } else{
            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            if(demoUser == false){
                checkoutService.updatePoducts(list_item).then(response => {
                    if (response.is_success == true) {
                        dispatch(success(response.content))
                        // localStorage.removeItem("oliver_order_payments")
                        // window.location = '/checkout';
                        // history.push('/checkout')
                    } else {
                        dispatch(success())
                    }
                })
            }
        }
       
    };
    function success(checkout_list) { return { type: checkoutConstants.GET_CHECKOUT_LIST_SUCCESS, checkout_list } }
}

/** 
 *  Created By   : Shakuntala Jatav
 *  Created Date : 10-06-2019
 *  Description  : for set default tax setting.
 * 
 *  Modified By : Nagendra
 *  Modified Date: 26/06/2019
 *  Decription: Update for saving order on temp DB
*/
function save(shopOrder, path) {
    localStorage.removeItem("BACK_CHECKOUT");
    localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
    //localStorage.removeItem('TAXT_RATE_LIST');
    //localStorage.removeItem("SELECTED_TAX");
    var line_items = shopOrder.line_items;
    return dispatch => {
        dispatch(request(shopOrder));
        checkoutService.save(shopOrder).then(
            shop_order => {
                if (shop_order.is_success == true) {
                    localStorage.removeItem('extensionUpdateCart');
                    localStorage.removeItem('TIKERA_SELECTED_SEATS');
                    localStorage.removeItem("TIKERA_SEAT_CHART");
                    localStorage.removeItem("selectedGroupSale");
                    var taxData = localStorage.getItem("SELECTED_TAX") && JSON.parse(localStorage.getItem("SELECTED_TAX"));
                    if (taxData) {
                        localStorage.setItem("TAXT_RATE_LIST", JSON.stringify(taxData[0]));
                    }
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("CheckoutView: Order placed ")
                    }
                    dispatch(success(shop_order));

                //Created By : Nagendra
                // Modified Date: 03/07/2020
                // Desc : Save the payment log 
                   try {         
                            var d = new Date();
                            var orderPayments=localStorage.getItem("oliver_order_payments") ?JSON.parse(localStorage.getItem("oliver_order_payments")):"";
                            var cashmanagementID=localStorage.getItem("Cash_Management_ID")
                            var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
                            var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
                            var localTimeZoneType = moment.tz.guess(true);
                            var user = JSON.parse(localStorage.getItem("user"));
                            
                            var paymentLog=[];
                            if(orderPayments && orderPayments.length)
                            {
                                orderPayments.map(item=>{
                                    if(item.Id==0){ // only new payment should be log
                                        paymentLog.push({
                                            CashManagementId: cashmanagementID,
                                            AmountIn: item.payment_amount,
                                            AmountOut: 0,
                                            LocalDateTime: dateStringWithTime,
                                            LocalTimeZoneType: localTimeZoneType,
                                            TimeZoneOffsetValue:getLocalTimeZoneOffsetValue,
                                            SalePersonId: user && user.user_id ? user.user_id : '',                                       
                                            SalePersonName: user && user.display_name ? user.display_name : '',     
                                            SalePersonEmail: user && user.user_email ? user.user_email : '',
                                            OliverPOSReciptId:  shop_order.content && shop_order.content.tempOrderId && shop_order.content.tempOrderId,
                                            PaymentTypeName: item.payment_type,
                                            PaymentTypeSlug: item.payment_type,
                                            EODReconcilliation : true,
                                            Notes: item.description
                                            })
                                    }
                                })                            
                                console.log("paymentLog",paymentLog)
                                if(paymentLog.length>0){
                                    dispatch(cashManagementAction.addPaymentListLog(paymentLog));
                                }
                            }
                            //----------------------------------------------------------

                    } catch (error) {
                        console.log("cashManagementLog Error",error)
                    }
                    

                    // //Send Email----------------------------------              
                    //     var udid = get_UDid('UDID');
                    //     var order_id =shop_order.Content;
                    //     var email_id = shopOrder.billing_address.length>0?shopOrder.billing_address[0].email:"";

                    //     var requestData = {
                    //         "Udid": udid,
                    //         "OrderNo": order_id,
                    //         "EmailTo": email_id,
                    //     }
                    //         console .log("emailrequestData",requestData);
                    //    dispatch(sendMailAction.sendMail(requestData));
                    //update Refund qty for product......................
                    dispatch(idbProductActions.updateOrderProductDB(line_items));
                    // },3000)
                    //dispatch(idbProductActions.updateProductDB());         
                    //----------------------------------------------------  
                    setTimeout(function () {
                        if (shop_order.content && shop_order.content.tempOrderId && shop_order.content.tempOrderId != '') {
                            localStorage.setItem('tempOrder_Id', JSON.stringify(shop_order.content.tempOrderId));
                            //OrderID=shop_order.content.tempOrderId
                            //Create localstorage to store temporary orders--------------------------

                            // inventory check lay-away and park sale
                            var pending_payments = localStorage.getItem('PENDING_PAYMENTS') ? JSON.parse(localStorage.getItem('PENDING_PAYMENTS')) : null
                            var checklist = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null
                            var list_item = []
                            var itemExists = []
                            if (pending_payments && checklist && pending_payments.orderId == checklist.orderId) {
                                pending_payments && pending_payments.ListItem && pending_payments.ListItem.filter((pending) => {
                                    return checklist && checklist.ListItem && checklist.ListItem.filter((check) => {
                                        if (pending.line_item_id == check.line_item_id) {
                                            itemExists.push(pending)
                                            return pending
                                        }
                                    })
                                })
                                list_item = pending_payments && pending_payments.ListItem && pending_payments.ListItem.filter((item) => !itemExists.includes(item))

                                checklist && checklist.ListItem && checklist.ListItem.map((itm) => {
                                    list_item && list_item.map((list) => {
                                        var checkProId = itm.variation_id == 0 ? itm.product_id : itm.variation_id ? itm.variation_id : itm.product_id
                                        var listProId = list.variation_id == 0 ? list.product_id : list.variation_id ? list.variation_id : list.product_id

                                        if (checkProId == listProId && list.quantity && itm.quantity && list.quantity > itm.quantity) {
                                            if (list.quantity > itm.quantity) {
                                                list.quantity = list.quantity - itm.quantity
                                            }
                                        }
                                    })
                                })

                                if (list_item && list_item.length) {
                                    var udid = get_UDid('UDID')
                                    var productList = []
                                    const dbPromise = openDb('ProductDB', 1, upgradeDB => {
                                        upgradeDB.createObjectStore(udid);
                                    });
                                    const idbKeyval = {
                                        async get(key) {
                                            const db = await dbPromise;
                                            return db.transaction(udid).objectStore(udid).get(key);
                                        },
                                        // async set(key, val) {
                                        //     const db = await dbPromise;
                                        //     const tx = db.transaction(udid, 'readwrite');
                                        //     tx.objectStore(udid).put(val, key);
                                        //     return tx.complete;
                                        // },
                                    };
                                    idbKeyval.get('ProductList').then(val => {
                                        productList = val;
                                        list_item && list_item.map(itm => {
                                            productList && productList.find(value => {
                                                var pro_id = itm.variation_id == 0 ? itm.product_id : itm.variation_id ? itm.variation_id : itm.product_id
                                                if (value.WPID === pro_id) {
                                                    itm['StockQuantity'] = value['StockQuantity'];

                                                    var qtyData = {
                                                        udid: get_UDid('UDID'),
                                                        quantity: value && value['StockQuantity'] ? value['StockQuantity'] + itm.quantity : itm.quantity,
                                                        wpid: pro_id
                                                    }

                                                    dispatch(cartProductActions.addInventoryQuantity(qtyData, list_item));
                                                    return true;
                                                }
                                            })
                                        })
                                    })

                                }
                            }
        //**************  ************//




                            var TempOrders = [];
                            if (localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) {
                                TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`));
                            }
                            TempOrders.push({ "TempOrderID": shop_order.content.tempOrderId, "Status": "false", "Index": TempOrders.length, "OrderID": 0, 'order_status': "completed", 'date': moment().format(Config.key.NOTIFICATION_FORMAT), 'Sync_Count': 0, 'new_customer_email': '', 'isCustomerEmail_send': false });
                            localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders));
                            //-----------------------------------------------------------------------
                        }
                        // path = 1  is payment complete
                        // path = 2  is payments lay.park sale
                        if (path == 1) {
                            var OrderID;
                            //Call GTM Checkout---------------------------
                            if(process.env.ENVIRONMENT=='production' )
                            {
                                 GTM_oliverOrderComplete()
                           }
                           trackOliverOrderComplete();
                            //------------------------------------------------
                            localStorage.setItem("ORDER_ID", JSON.stringify(0));
                            // if (JSON.parse(localStorage.getItem("user")).display_sale_refund_complete_screen == false) {
                            //     localStorage.removeItem('PRODUCT');
                            //     localStorage.removeItem("CART");
                            //     localStorage.removeItem('CHECKLIST');
                            //     localStorage.removeItem('AdCusDetail');
                            //     localStorage.removeItem('CARD_PRODUCT_LIST');
                            //     localStorage.removeItem("PRODUCTX_DATA");
                            //     localStorage.removeItem("PENDING_PAYMENTS");
                            //     window.location = '/shopview';

                            // } else 
                            {
                                // localStorage.removeItem("PRODUCTX_DATA");
                               // window.location = '/salecomplete';
                                history.push('/salecomplete');
                            }
                        } else {
                            localStorage.removeItem("PRODUCTX_DATA");
                            localStorage.removeItem('PRODUCT');
                            localStorage.removeItem("CART");
                            localStorage.removeItem('CHECKLIST');
                            localStorage.removeItem('AdCusDetail');
                            localStorage.removeItem('CARD_PRODUCT_LIST');
                            if(ActiveUser.key.isSelfcheckout == true)
                            {
                                history.push('/salecomplete');
                            }
                            else
                            {
                                window.location = '/shopview';
                            }
                        }
                    }, 500)
                    dispatch(alertActions.success('save custmoer order successfully'));
                } else {
                    if (!shop_order.message || shop_order.message == "") {
                        dispatch(failure('An error has occurred.'));
                    } else {
                        dispatch(failure(shop_order.message));
                    }
                    // $('#ordernotSuccesModal').modal('show')
                }
            },
            error => {
                if (!error || error == "") {
                    dispatch(failure('An error has occurred.'));
                } else {
                    dispatch(failure(error.toString()));
                }
                //dispatch(alertActions.error(error.toString()));
            }
        );
    };
    function request() { return { type: checkoutConstants.INSERT_REQUEST } }
    function success(shop_order) { return { type: checkoutConstants.INSERT_SUCCESS, shop_order } }
    function failure(error) { return { type: checkoutConstants.INSERT_FAILURE, error } }
}

/** 
 * Created By: Nagendra
 *  created Date: 05/05/02020
 
 *  Decription: Update order status 
*/
function updateOrderStatus(shopOrder) {     
    var d = new Date();
    var Cash_Management_ID=localStorage.getItem('Cash_Management_ID');
    shopOrder["CashManagementId"] = Cash_Management_ID?Cash_Management_ID:0;
    shopOrder["LocalDateTime"] = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
    shopOrder["localTimeZoneType"] = moment.tz.guess(true);
    shopOrder["LocalTimeZoneOffsetValue"]=  d.getTimezoneOffset();     

    var user = JSON.parse(localStorage.getItem("user"));
    shopOrder["SalePersonId"] = user && user.user_id ? user.user_id : '';
    shopOrder["SalePersonName"]=user && user.display_name ? user.display_name : '';
    shopOrder["SalePersonEmail"]=user && user.user_email ? user.user_email : '';
    var WarehouseId =localStorage.getItem("WarehouseId") && localStorage.getItem("WarehouseId") !==null? parseInt(localStorage.getItem("WarehouseId")):0;
    shopOrder["WarehouseId"]=WarehouseId;
    return dispatch => {
        dispatch(request(shopOrder));
        checkoutService.updateOrderStatus(shopOrder).then(
            order_status_update => {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                if(demoUser){                   
                        GTM_OliverDemoUser("CheckoutVuew: Update orderStatus")
                }
                dispatch(success(order_status_update));               
            },
            error => {
                    dispatch(failure(error.toString()));              
            }
        );
    };
    function request() { return { type: checkoutConstants.ORDERSTATUS_UPDATE_REQUEST } }
    function success(order_status_update) { return { type: checkoutConstants.ORDERSTATUS_UPDATE_SUCCESS, order_status_update } }
    function failure(error) { return { type: checkoutConstants.ORDERSTATUS_UPDATE_FAILURE, error } }
}
function Get_TicketEvent(event_id) {
    var udid = get_UDid('UDID');
    return dispatch => {
        dispatch(request());
        dispatch(success(tick_event));
    };
    // return dispatch => {
    //     dispatch(request(udid,event_id));
    //     checkoutService.TicketEvent(udid,event_id).then(
    //         ticket_events => {

    //             dispatch(success(tick_event));

    //         },
    error => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
    }

    function request() { return { type: checkoutConstants.TICKET_EVENT_REQUEST } }
    function success(tick_event) { return { type: checkoutConstants.TICKET_EVENT_SUCCESS, tick_event } }
    function failure(error) { return { type: checkoutConstants.TICKET_EVENT_FAILURE, error } }
}

function getOrderReceipt() {
    return dispatch => {
        checkoutService.getOrderReceiptDetail()
            .then(
                orderreciept => {
                    localStorage.setItem('orderreciept', JSON.stringify(orderreciept))
                    error => {
                    }
                }
            );
    };

    // function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
    // function success(productlist) { return { type: allProductConstants.PRODUCT_GETALL_SUCCESS, productlist } }
    // function failure(error) { return { type: allProductConstants.PRODUCT_GETALL_FAILURE, error } }
}

function orderToCancelledSale(order_id, udid) {
    return dispatch => {
        dispatch(request(order_id, udid));
        var WarehouseId =localStorage.getItem("WarehouseId") && localStorage.getItem("WarehouseId") !==null? parseInt(localStorage.getItem("WarehouseId")):0;
        checkoutService.orderToCancelSale(order_id, udid,WarehouseId).then(
            cancel_order => {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                if(demoUser){                   
                     GTM_OliverDemoUser("CheckoutView: Cancelled order")
                }
                dispatch(idbProductActions.updateProductDB());
                dispatch(success(cancel_order));
                localStorage.removeItem('AdCusDetail');
                localStorage.removeItem('CARD_PRODUCT_LIST');
                setTimeout(function () {
                    window.location = '/shopview';
                    dispatch(alertActions.success('custmoer order cancel successfully'));
                }, 5000)
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };

    function request() { return { type: checkoutConstants.ORDER_VOID_REQUEST } }
    function success(void_order) { return { type: checkoutConstants.ORDER_VOID_SUCCESS, void_order } }
    function failure(error) { return { type: checkoutConstants.ORDER_VOID_FAILURE, error } }
}
/** 
 *  UpdateBy :shakuntala Jatav
 * UpdateDate:09-07-2019
 *  Desceiption: update order id is Zero. 
*/
function orderToVoid(order_id, udid) {
    return dispatch => {
        if (order_id == 0) {
            localStorage.removeItem('PRODUCT');
            localStorage.removeItem("CART");
            localStorage.removeItem('CHECKLIST');
            localStorage.removeItem('AdCusDetail');
            localStorage.removeItem('CARD_PRODUCT_LIST');
            window.location = '/shopview';
        } else {
            dispatch(request(order_id, udid));
            var WarehouseId =localStorage.getItem("WarehouseId") && localStorage.getItem("WarehouseId") !==null? parseInt(localStorage.getItem("WarehouseId")):0;
            checkoutService.orderToVoid(order_id, udid,WarehouseId).then(
                void_order => {
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("CheckoutView: Void order")
                    }
                    dispatch(success(void_order));
                    localStorage.removeItem('AdCusDetail');
                    localStorage.removeItem("CHECKLIST");
                    window.location = '/activity';                    
                    dispatch(alertActions.success('custmoer order void successfully'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
        }
    };
    function request() { return { type: checkoutConstants.ORDER_VOID_REQUEST } }
    function success(void_order) { return { type: checkoutConstants.ORDER_VOID_SUCCESS, void_order } }
    function failure(error) { return { type: checkoutConstants.ORDER_VOID_FAILURE, error } }
}

function cashRounding() {
    var udid = get_UDid('UDID');
    return dispatch => {
        dispatch(request(udid));
        udid !== '' ?
            checkoutService.getCashRounding(udid).then(
                cash_rounding => {
                    if (cash_rounding && cash_rounding.is_success == true) {
                        localStorage.setItem('CASH_ROUNDING', cash_rounding.content)
                        dispatch(success(cash_rounding));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            ) : dispatch(failure("User not available"));;
    };
    function request() { return { type: checkoutConstants.CASH_ROUNDING_REQUEST } }
    function success(cash_rounding) { return { type: checkoutConstants.CASH_ROUNDING_SUCCESS, cash_rounding } }
    function failure(error) { return { type: checkoutConstants.CASH_ROUNDING_FAILURE, error } }
}

function getPaymentTypeName(udid, registerId) {
    return dispatch => {
        dispatch(request());
        checkoutService.getPaymentTypeName(udid, registerId)
            .then(
                paymentTypeName => {
                    localStorage.setItem("PAYMENT_TYPE_NAME", JSON.stringify(paymentTypeName.content))
                    dispatch(success(paymentTypeName.content))
                        ,
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: checkoutConstants.GET_PAYMENT_TYPE_REQUEST } }
    function success(paymentTypeName) { return { type: checkoutConstants.GET_PAYMENT_TYPE_SUCCESS, paymentTypeName } }
    function failure(error) { return { type: checkoutConstants.GET_PAYMENT_TYPE_FAILURE, error } }
}

function getMakePayment(udid, registerId, paycode, amount, command, transId = '') {
    return dispatch => {
        dispatch(request());
        checkoutService.getMakePayment(udid, registerId, paycode, amount, command,transId).then(
            global_payment => {
                setTimeout(function () {
                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("ShopView: Add Tile to Favourite")
                    }
                    localStorage.setItem('GLOBAL_PAYMENT_RESPONSE', JSON.stringify(global_payment));
                    localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(global_payment));

                    dispatch(success(global_payment));
                }, 1000)
            },
            error => {
                dispatch(failure(error.toString()));
            }
        );
    };
    function request() { return { type: checkoutConstants.GLOBAL_PAYMENTS_REQUEST } }
    function success(global_payment) { return { type: checkoutConstants.GLOBAL_PAYMENTS_SUCCESS, global_payment } }
    function failure(error) { return { type: checkoutConstants.GLOBAL_PAYMENTS_FAILURE, error } }
    // https://app.creativemaple.ca/api/ShopPaymentType/GetMakePayment?udid=4040246198&registerId=1&paycode=global_payments&command=sale&amount=2.00
}
/** 
 * CeratedBy :shakuntala Jatav
 * CeateDate:09-07-2019
 * Desceiption: for update props data to sale to void in payment by checkout page.
*/
function changeStatusSaleToVoid(voidSale) {
    return dispatch => {
        dispatch(success(voidSale));
    };
    function success(sale_to_void_status) { return { type: checkoutConstants.VOID_SALE_SUCCESS, sale_to_void_status } }
}

function checkTempOrderSync(udid, tempOrderId) {
    var notificationLimit = Config.key.NOTIFICATION_LIMIT;
    return dispatch => {
        dispatch(request(udid, tempOrderId));
        checkoutService.checkTempOrderSync(udid, tempOrderId).then(
            void_order => {
                dispatch(success(void_order));
                // Update Temp Order Status------------------------------------
                var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                if (TempOrders && TempOrders.length > 0) {
                    if (TempOrders.length > notificationLimit) {
                        TempOrders.splice(0, 1);
                    }
                    TempOrders.map(ele => {
                        if (ele.TempOrderID == tempOrderId) {
                            if (void_order.content && void_order.content !== null && void_order.content.toString() !== "0") {
                                var placedOrderList = localStorage.getItem('placedOrderList') ? JSON.parse(localStorage.getItem('placedOrderList')) : "";
                                if (placedOrderList) {
                                    // for order complete then call api for pruduct quantity update
                                    //localStorage.removeItem('placedOrderList')
                                    dispatch(idbProductActions.updateOrderProductDB(placedOrderList));
                                    setTimeout(function () {
                                        dispatch(idbProductActions.updateConfirmProductDB(true));
                                        dispatch(idbProductActions.updateProductDB());
                                        //AllProduct.someMethod()
                                        // history.push('/shopview')
                                        // location.reload()
                                    }, 1000)
                                }
                                ele.Status = "true";
                                ele.OrderID = void_order.content;
                                ele.Sync_Count = ele.Sync_Count + 1
                            }
                            else {
                                dispatch(idbProductActions.updateProductDB());
                                ele.Sync_Count = ele.Sync_Count + 1
                                //  recheckTempOrderSync(udid,ele.TempOrderID)
                            }
                        }
                    })
                    localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders))
                }
                //--------------------------------------------------------------
                // dispatch(alertActions.success('custmoer order void successfully'));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };
    function request(udid, orderId) { return { type: checkoutConstants.TEMP_ORDER_SYNC_REQUEST, orderId } }
    function success(orderId) { return { type: checkoutConstants.TEMP_ORDER_SYNC_SUCCESS, orderId } }
    function failure(error) { return { type: checkoutConstants.TEMP_ORDER_SYNC_FAILURE, error } }
}

function checkTempOrderStatus(udid, tempOrderId) {
    var notificationLimit = Config.key.NOTIFICATION_LIMIT;
    return dispatch => {
        dispatch(request(udid, tempOrderId));
        checkoutService.checkTempOrderStatus(udid, tempOrderId).then(
            void_order => {
                dispatch(success(void_order));
                //console.log("OrderStatusRes", void_order);
                // Update Temp Order Status------------------------------------
                var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                if (TempOrders && TempOrders.length > 0) {
                    if (TempOrders.length > notificationLimit) {
                        TempOrders.splice(0, 1);
                    }
                    TempOrders.map(ele => {
                        if (ele.TempOrderID == tempOrderId) {
                            if (void_order && void_order.message == "Success") {

                                var placedOrderList = localStorage.getItem('placedOrderList') ? JSON.parse(localStorage.getItem('placedOrderList')) : "";
                                if (placedOrderList) {
                                    // for order complete then call api for pruduct quantity update
                                    //localStorage.removeItem('placedOrderList')
                                    dispatch(idbProductActions.updateOrderProductDB(placedOrderList));
                                    setTimeout(function () {
                                        dispatch(idbProductActions.updateConfirmProductDB(true));
                                        //AllProduct.someMethod()
                                        // history.push('/shopview')
                                        // location.reload()
                                    }, 1000)
                                }
                                ele.Status = "true";
                                ele.OrderID = void_order.content.OrderNumber;
                                console.log("OrderStatusSuccess", ele);
                                ele.Sync_Count = ele.Sync_Count + 1
                            }
                            else {
                                ele.Sync_Count = ele.Sync_Count + 1
                                if (ele.Sync_Count === Config.key.SYNC_COUNT_LIMIT)
                                    ele.Status = "failed";
                                console.log("OrderStatusFailed", ele);
                                //  recheckTempOrderSync(udid,ele.TempOrderID)
                            }
                        }
                    })
                    localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders))
                }
                //--------------------------------------------------------------
                // dispatch(alertActions.success('custmoer order void successfully'));
            },
            error => {
                dispatch(failure(error.toString()));
                dispatch(alertActions.error(error.toString()));
            }
        );
    };
    function request(udid, orderId) { return { type: checkoutConstants.TEMP_ORDER_SYNC_REQUEST, orderId } }
    function success(orderId) { return { type: checkoutConstants.TEMP_ORDER_SYNC_SUCCESS, orderId } }
    function failure(error) { return { type: checkoutConstants.TEMP_ORDER_SYNC_FAILURE, error } }
}

function recheckTempOrderSync(udid, orderId) {
    return dispatch => {
        dispatch(request(udid, orderId));
        checkoutService.recheck_TempOrderSync(udid, orderId).then(
            temp_order => {

                //If sync limit exit then reduce limit, so order can sync again 
                var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                TempOrders.map(ele => {
                    if (ele.TempOrderID == orderId) {
                        if (ele.Sync_Count >= Config.key.SYNC_COUNT_LIMIT) {
                            ele.Sync_Count = ele.Sync_Count - 2;
                        }
                        //   console.log("TempOrders",TempOrders);

                    }
                });
                localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders));
                //console.log("temp_order123", temp_order)
            },
            error => {
                dispatch(failure(error.toString()));
            }
        );
    }
    function request(udid, orderId) { return { type: checkoutConstants.TEMP_ORDER_SYNC_REQUEST, orderId } }
    function success(orderId) { return { type: checkoutConstants.TEMP_ORDER_SYNC_SUCCESS, orderId } }
    function failure(error) { return { type: checkoutConstants.TEMP_ORDER_SYNC_FAILURE, error } }
}

/**
 * Created By: Shakuntala Jatav
 * Created Date : 06-08-2019
 * Description: get dynamic true diamond html url
 * 
 */
function GetExtensions() {
    return dispatch => {
        dispatch(request());
        checkoutService.GetExtensions().then(
            get_extention => {
                localStorage.setItem('GET_EXTENTION_FIELD', JSON.stringify(get_extention))
                dispatch(success(get_extention));
            },
            error => {
                dispatch(failure(error.toString()));
            }
        );
    }
    function request() { return { type: checkoutConstants.GET_EXTENTION_REQUEST } }
    function success(get_extention) { return { type: checkoutConstants.GET_EXTENTION_SUCCESS, get_extention } }
    function failure(error) { return { type: checkoutConstants.GET_EXTENTION_FAILURE, error } }
}


/**
 * Created By: Shakuntala Jatav
 * Created Date : 04-10-2019
 * Description: get subscription type status
 * 
 */
function getDoSale() {
    var udid = get_UDid('UDID');
    return dispatch => {
        dispatch(request(udid));
        checkoutService.getDoSale(udid).then(
            response => {
                if (response.IsSuccess == true) {
                    var Content = {
                        "DoSale": true,
                        "SaleLimit": 30000.0,
                        "TotalSale": 11063.56
                    }
                    dispatch(success(Content));
                    // dispatch(success(response.Content));
                }
            },
            error => {
                dispatch(failure(error.toString()));
            }
        );
    };
    function request() { return { type: checkoutConstants.GET_DO_SALE_REQUEST } }
    function success(get_do_sale) { return { type: checkoutConstants.GET_DO_SALE_SUCCESS, get_do_sale } }
    function failure(error) { return { type: checkoutConstants.GET_DO_SALE_FAILURE, error } }
}


// online payment action
function makeOnlinePayments(data) {
    return dispatch => {
        if(data == null){
            dispatch(success(data));
            return false
        }
        dispatch(request());
        checkoutService.makeOnlinePayments(data).then(
            online_payments => {
                setTimeout(function () {
                    if (online_payments.is_success == true) {
                        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                        if (demoUser) {
                            GTM_OliverDemoUser("ShopView: Add Tile to Favourite")
                        }
                        localStorage.setItem('ONLINE_PAYMENT_RESPONSE', JSON.stringify(online_payments));
                        localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(online_payments));

                        dispatch(success(online_payments));
                    }else{
                        
                        dispatch(failure(online_payments.message));
                    }

                }, 1000)
            },
            error => {
                if(error == ""){
                    dispatch(failure('Something went wrong!'.toString()));
                }else{
                    dispatch(failure(error.toString()));
                }

            }
        );
    };
    function request() { return { type: checkoutConstants.ONLINE_PAYMENTS_REQUEST } }
    function success(online_payments) { return { type: checkoutConstants.ONLINE_PAYMENTS_SUCCESS, online_payments } }
    function failure(error) { return { type: checkoutConstants.ONLINE_PAYMENTS_FAILURE, error } }
}
