import { alertActions } from '../../_actions';
import { history } from '../../_helpers';
import {  customerService } from '..'
import { selfcheckoutService } from '../services/selfcheckout.service';
import { selfcheckoutConstants } from '../constants/selfcheckout.constants';
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';

export const selfCheckoutActions = {    
    save,
    get_selfcheckout_setting
};

function save(customer, status, backUrl) {
    var ID = customer.Id;
    return dispatch => {
        dispatch(request(customer));
        if ((!customer.Email) || customer.Email == "") {
            dispatch(failure("Email can't be emplty"));;
        } else {
            customerService.save(customer)
                .then(
                    customer => {
                        dispatch(success(customer));
                        sessionStorage.setItem("CUSTOMER_ID", customer.content && customer.content.WPId);

                        if(status == 'create' && window.location.pathname == '/checkout') {
                            if (customer && customer.content) {
                            localStorage.setItem('AdCusDetail', JSON.stringify(customer));
                            }
                        }
                        else if (status == 'create') {                           
                        } else if ((typeof localStorage.getItem('CHECKLIST') == 'undefined') || localStorage.getItem('CHECKLIST') == null) {
                            if (localStorage.getItem('AdCusDetail')) {
                                var AdCusDetail = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : '';
                                if (customer && customer.content) {
                                    if (AdCusDetail.content && AdCusDetail.content.WPId == customer.content.WPId) {
                                        localStorage.setItem('AdCusDetail', JSON.stringify(customer))
                                    }
                                }
                            }
                        } else {
                            if (localStorage.getItem('AdCusDetail')) {
                                var AdCusDetail = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : '';
                                if (customer && customer.content) {
                                    if (AdCusDetail.content && AdCusDetail.content.WPId == customer.content.WPId) {
                                        localStorage.setItem('AdCusDetail', JSON.stringify(customer))
                                    }
                                }
                            }
                        }
                        var CheckoutList;
                        var checkList = (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
                        if (checkList !== null) {
                            var orderCustomerInfo = customer && customer.content;
                            var customerDetail = []
                            if (status !== 'create') {
                                customerDetail = {
                                    content: {
                                        AccountBalance: orderCustomerInfo ? orderCustomerInfo.AccountBalance : 0,
                                        City: orderCustomerInfo ? orderCustomerInfo.City : '',
                                        Email: orderCustomerInfo ? orderCustomerInfo.Email : '',
                                        FirstName: orderCustomerInfo ? orderCustomerInfo.FirstName : '',
                                        Id: orderCustomerInfo ? orderCustomerInfo.UID ? orderCustomerInfo.UID : orderCustomerInfo.WPId : '',
                                        LastName: orderCustomerInfo ? orderCustomerInfo.LastName : '',
                                        Notes: orderCustomerInfo ? orderCustomerInfo.notes : '',
                                        Phone: orderCustomerInfo ? orderCustomerInfo.Contact : 0,
                                        Pin: orderCustomerInfo ? orderCustomerInfo.Pin : '',
                                        Pincode: orderCustomerInfo ? orderCustomerInfo.Pincode : '',
                                        StoreCredit: orderCustomerInfo ? orderCustomerInfo.store_credit : 0,
                                        StreetAddress: orderCustomerInfo ? orderCustomerInfo.StreetAddress : '',
                                        StreetAddress2: orderCustomerInfo ? orderCustomerInfo.StreetAddress2 : '',
                                    }
                                }
                            }
                            if(orderCustomerInfo){
                            customerDetail = {
                                content: {
                                    AccountBalance: orderCustomerInfo ? orderCustomerInfo.AccountBalance : 0,
                                    City: orderCustomerInfo ? orderCustomerInfo.City : '',
                                    Email: orderCustomerInfo ? orderCustomerInfo.Email : '',
                                    FirstName: orderCustomerInfo ? orderCustomerInfo.FirstName : '',
                                    Id: orderCustomerInfo ? orderCustomerInfo.UID ? orderCustomerInfo.UID : orderCustomerInfo.WPId : '',
                                    LastName: orderCustomerInfo ? orderCustomerInfo.LastName : '',
                                    Notes: orderCustomerInfo ? orderCustomerInfo.notes : '',
                                    Phone: orderCustomerInfo ? orderCustomerInfo.Contact : 0,
                                    Pin: orderCustomerInfo ? orderCustomerInfo.Pin : '',
                                    Pincode: orderCustomerInfo ? orderCustomerInfo.Pincode : '',
                                    StoreCredit: orderCustomerInfo ? orderCustomerInfo.store_credit : 0,
                                    StreetAddress: orderCustomerInfo ? orderCustomerInfo.StreetAddress : '',
                                    StreetAddress2: orderCustomerInfo ? orderCustomerInfo.StreetAddress2 : '',
                                }
                            }
                        }
                            CheckoutList = {
                                ListItem: checkList.ListItem,
                                customerDetail:  customerDetail ,
                                totalPrice: checkList.totalPrice,
                                discountCalculated: checkList.discountCalculated,
                                tax: checkList.tax,
                                subTotal: checkList.subTotal,
                                TaxId: checkList.TaxId,
                                status: checkList.status,
                                order_id: checkList.order_id,
                                order_date: checkList.order_date,
                                showTaxStaus: checkList.showTaxStaus
                            }
                            localStorage.setItem("CHECKLIST", JSON.stringify(CheckoutList))
                        }
                        if(customer.content){
                            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                            // if(demoUser){                   
                            //      GTM_OliverDemoUser("SelfCheckout: Working on SelfcheckoutAction")
                            // }
                            dispatch(alertActions.success('New custmoer added successfully'));
                                if ((status == 'create' || status == 'update') &&  window.location.pathname !== '/checkout') {
                                    location.reload();   
                                } else {                                    
                                    location.reload();                               
                                }
                        }
                        else{
                            dispatch(failure(customer.Message));
                        }
                    },
                    error => {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                );
        }
    };
    function request() { return { type: customerConstants.INSERT_REQUEST } }
    function success(customer) { return { type: customerConstants.INSERT_SUCCESS, customer } }
    function failure(error) { return { type: customerConstants.INSERT_FAILURE, error } }
}
function get_selfcheckout_setting()
{
    return dispatch => {
        dispatch(request());
        selfcheckoutService.get_selfcheckout_setting().then(
            self_settings => {
                console.log("--------self checkout data setttings--->"+JSON.stringify(self_settings))
                if(self_settings.is_success==true && self_settings.message=="Success")
                {
                    dispatch(success(self_settings));
                    localStorage.setItem("selfcheckout_setting",JSON.stringify(self_settings.content) )
                }
                else
                {
                    dispatch(success(self_settings));
                }
            },
            error => {
                dispatch(failure(error.toString()));
            }
        );
    };

    function request() { return { type: selfcheckoutConstants.SELF_CHECKOUT_SETTING_REQUEST } }
    function success(self_settings) { return { type: selfcheckoutConstants.SELF_CHECKOUT_SETTING_SUCCESS, self_settings } }
    function failure(error) { return { type: selfcheckoutConstants.SELF_CHECKOUT_SETTING_FAILURE, error } }
}