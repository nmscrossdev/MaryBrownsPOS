import { paymentConstants } from "../constants/payments.constants";
import { paymentService } from '../services/payments.service';

export const paymentActions = {
    make_payconiq_payment,
    check_payconiq_pay_status,
    cancel_payconiq_payment
};

function make_payconiq_payment (requestParam) {
    return dispatch => {
        dispatch(request());
        if(requestParam == null){
            dispatch(success(null));
        }else{
            paymentService.make_payconiq_payment(requestParam).then(
                payconiq_payment => {
                        if(payconiq_payment && payconiq_payment.is_success){
                            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                            if (demoUser) {
                                GTM_OliverDemoUser("ShopView: Add Tile to Favourite")
                            }
                            // localStorage.setItem('PAYCONIQ_PAYMENT_RESPONSE', JSON.stringify(payconiq_payment));
                            dispatch(success(payconiq_payment));
                        }
                        else if(payconiq_payment && payconiq_payment.is_success == false){
                            dispatch(failure(payconiq_payment.message));
                        }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
        }
    };
    function request() { return { type: paymentConstants.PAYCONIQ_PAYMENTS_REQUEST } }
    function success(payconiq_payment) { return { type: paymentConstants.PAYCONIQ_PAYMENTS_SUCCESS, payconiq_payment } }
    function failure(error) { return { type: paymentConstants.PAYCONIQ_PAYMENTS_FAILURE, error } }
}

function check_payconiq_pay_status(sessionId) {
    return dispatch => {
        dispatch(request());
        if(sessionId == null){
            dispatch(success(null));
        }
        else{
            paymentService.check_payconiq_pay_status(sessionId).then(
                payconiq_status => {
                    if(payconiq_status && payconiq_status.is_success){
                        if(payconiq_status.content && payconiq_status.content.RefrenceID && payconiq_status.content.Status == 'SUCCEEDED'){
                            localStorage.setItem('PAYCONIQ_PAYMENT_RESPONSE', JSON.stringify(payconiq_status));
                            localStorage.setItem('PAYMENT_RESPONSE', JSON.stringify(payconiq_status));
                        }
                        dispatch(success(payconiq_status));
                    }else if(payconiq_status && payconiq_status.is_success == false){
                        dispatch(failure(payconiq_status.message));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
        }
    };
    function request() { return { type: paymentConstants.PAYCONIQ_STATUS_REQUEST } }
    function success(payconiq_status) { return { type: paymentConstants.PAYCONIQ_STATUS_SUCCESS, payconiq_status } }
    function failure(error) { return { type: paymentConstants.PAYCONIQ_STATUS_FAILURE, error } }

}
// cancel payconiq payment

function cancel_payconiq_payment(data) {
    return dispatch => {
        dispatch(request());
        if(data == null){
            dispatch(success(data));
        }else{
            paymentService.cancel_payconiq_payment(data).then(
                payconiq_cancel_res => {
                    if(payconiq_cancel_res && payconiq_cancel_res.is_success){
                        dispatch(success(payconiq_cancel_res));
                    }else if(payconiq_cancel_res && payconiq_cancel_res.is_success == false){
                        dispatch(failure(payconiq_cancel_res.message));
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
        }
    };
    function request() { return { type: paymentConstants.PAYCONIQ_CANCEL_REQUEST } }
    function success(payconiq_cancel_res) { return { type: paymentConstants.PAYCONIQ_CANCEL_SUCCESS, payconiq_cancel_res } }
    function failure(error) { return { type: paymentConstants.PAYCONIQ_CANCEL_FAILURE, error } }

}