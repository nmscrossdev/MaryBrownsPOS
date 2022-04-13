import { saveCustomerInOrderConstants } from '../_constants';
import { saveCustomerInOrderService } from '../_services';
import Config from '../Config';
import ActiveUser from '../settings/ActiveUser';
export const saveCustomerInOrderAction = {
    saveCustomerInOrder,
    saveCustomerToTempOrder
};

function saveCustomerInOrder(udid, order_id, email_id) {
    return dispatch => {
        dispatch(request());
        saveCustomerInOrderService.saveCustomer(udid, order_id, email_id)
            .then(
                getSuccess => {
                    dispatch(success(getSuccess)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: saveCustomerInOrderConstants.SCIO_REQUEST } }
    function success(getSuccess) { return { type: saveCustomerInOrderConstants.SCIO_SUCCESS, getSuccess } }
    function failure(error) { return { type: saveCustomerInOrderConstants.SCIO_FAILURE, error } }
}
/** 
 * Created By: 
 * created Date:
 *  Modified By : Nagendra
 * Modified Date: 26/06/2019
 * Decription: function for attaching the new customer to order
*/
function saveCustomerToTempOrder(udid, order_id, email_id) {
    var notificationLimit = Config.key.NOTIFICATION_LIMIT;
    return dispatch => {
        dispatch(request());
        saveCustomerInOrderService.saveCustomerToTempOrder(udid, order_id, email_id)
            .then(
                getSuccess => {
                    var _status = "true";
                    var _emailSend = true;
                    // Add Customer order success ------------------------------------
                    var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                    if (TempOrders && TempOrders.length > 0) {
                        if (TempOrders.length > notificationLimit) {
                            TempOrders.splice(0, 1);
                        }
                        TempOrders.map(ele => {
                            if (ele.TempOrderID == order_id && ele.new_customer_email !== "") {

                                ele.Status = _status;
                                ele.isCustomerEmail_send = _emailSend;
                                ele.Sync_Count = ele.Sync_Count + 1
                                //  recheckTempOrderSync(udid,ele.TempOrderID)                                
                            }
                        })
                        localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders))
                    }
                    //--------------------------------------------------------------

                    dispatch(success(getSuccess)),
                        error => {
                            dispatch(failure(error.toString()))
                            _status = "true";
                            _emailSend = false;
                        }


                }
            );
    };
    function request() { return { type: saveCustomerInOrderConstants.SEND_MAIL_TEMP_ORDER_REQUEST } }
    function success(getSuccess) { return { type: saveCustomerInOrderConstants.SEND_MAIL_TEMP_ORDER_SUCCESS, getSuccess } }
    function failure(error) { return { type: saveCustomerInOrderConstants.SEND_MAIL_TEMP_ORDER_FAILURE, error } }
}