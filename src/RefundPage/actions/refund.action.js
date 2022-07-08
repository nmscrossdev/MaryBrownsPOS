import { refundConstants, refundService } from '../';
import { idbProductActions } from '../../_actions';
import Config from '../../Config';
import moment from 'moment';
import {cashManagementAction} from '../../CashManagementPage/actions/cashManagement.action'

export const refundActions = {
    refundOrder,
};

function myFunction(text) {
    var txt = alert(text);
    if (typeof txt == 'undefined') {
        window.location = 'activity';
    }
}

function refundOrder(data) {
    var CurrentUserActive = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '';
    return dispatch => {
        dispatch(request());
        refundService.refundOrder(data)
            .then(
                // refundOrderResponse => dispatch(success( refundOrderResponse )),  
                refundOrderResponse => {
                    //update Refund qty for product......................
                    refundOrderResponse.is_success ? dispatch(idbProductActions.updateOrderProductDB(null, data)) : "";
                    //---------------------------------------------------- 
                    var TempOrders = [];
                    if (localStorage.getItem(`TempOrders_${CurrentUserActive && CurrentUserActive.user_email}`)) {
                        TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${CurrentUserActive && CurrentUserActive.user_email}`));
                    }
                    var orderDetails = localStorage.getItem('getorder') && JSON.parse(localStorage.getItem('getorder'))
                    var reciptId = orderDetails && orderDetails.OliverReciptId    

                    TempOrders.push({ "TempOrderID": reciptId, "Status": "true", "Index": TempOrders.length, "OrderID": refundOrderResponse.content, 'order_status': 'refunded', 'date': moment().format(Config.key.NOTIFICATION_FORMAT) });
                    localStorage.setItem(`TempOrders_${CurrentUserActive && CurrentUserActive.user_email}`, JSON.stringify(TempOrders));
                    (refundOrderResponse.is_success) ?
                        setTimeout(function () {
                            localStorage.setItem("REFUND_DATA", JSON.stringify(data))
                            //Created By : Aman
                            // Created Date: 29/07/2020
                            // Desc : Save the refund log 
                                    try {         
                                        var d = new Date();
                                        var refundPayments = localStorage.getItem("REFUND_DATA") ?JSON.parse(localStorage.getItem("REFUND_DATA")):"";
                                        // console.log('refundPayments', refundPayments)
                                        var cashmanagementID = localStorage.getItem("Cash_Management_ID")
                                        var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
                                        var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
                                        var localTimeZoneType = moment.tz.guess(true);
                                        var user = JSON.parse(localStorage.getItem("user"));
                                        
                                        var refundLog=[];
                                        var refundPaymentStatus={}
                                        if(refundPayments && refundPayments.order_refund_payments && refundPayments.order_refund_payments.length){
                                            refundPayments.order_refund_payments.map(item=>{
                                                refundPaymentStatus= {"paymentType":item.payment_type,"status": "completed"}
                                                refundLog.push({
                                                    CashManagementId: cashmanagementID,
                                                    AmountIn: 0,
                                                    AmountOut: item.amount,
                                                    LocalDateTime: dateStringWithTime,
                                                    LocalTimeZoneType: localTimeZoneType,
                                                    TimeZoneOffsetValue:getLocalTimeZoneOffsetValue,
                                                    SalePersonId: user && user.user_id ? user.user_id : '',                                       
                                                    SalePersonName: user && user.display_name ? user.display_name : '',     
                                                    SalePersonEmail: user && user.user_email ? user.user_email : '',
                                                    OliverPOSReciptId:  refundPayments && refundPayments.order_id ,
                                                    PaymentTypeName: item.payment_type,
                                                    PaymentTypeSlug: item.payment_type,
                                                    EODReconcilliation : true,
                                                    Notes: ''
                                                    }
                                                )
                                            })
                                            // console.log("refundLog",refundLog)
                                            
                                            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                                            // if(demoUser){                   
                                            //     GTM_OliverDemoUser("Refund: Adding refund payment list")
                                            // }
                                            // set the current trnasaction status, Used for APP Command "TransactionStatus"
                                            localStorage.setItem("CurrentTransactionStatus", JSON.stringify(refundPaymentStatus))
                                            dispatch(cashManagementAction.addPaymentListLog(refundLog));
                                        }
                                        //----------------------------------------------------------
                    
                                } catch (error) {
                                    console.log("cashManagementLog Error",error)
                                    localStorage.setItem("CurrentTransactionStatus", JSON.stringify({"paymentType":"","status": "cancelled"}))
                                }
                                setTimeout(function () {
                                    if (JSON.parse(localStorage.getItem("user")).display_sale_refund_complete_screen == false) {
                                        window.location = 'activity';
                                    } else {
                                        window.location = '/refund_complete';
                                    }
                                },1000)
                        }, 1000)
                        :
                       // myFunction(refundOrderResponse.Message),
                        dispatch(failure(refundOrderResponse))
                       // error => dispatch(failure(error.toString()))
                });
    };
    function request() { return { type: refundConstants.REFUND_GETALL_REQUEST } }
    function success(refundOrderResponse) { return { type: refundConstants.REFUND_GETALL_SUCCESS, refundOrderResponse } }
    function failure(error) { return { type: refundConstants.REFUND_GETALL_FAILURE, error } }
}