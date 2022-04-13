import { alertActions } from '../../_actions';
import { history } from '../../_helpers';
import { customerConstants, customerService } from '../'
import { isMobileOnly } from 'react-device-detect';
import ActiveUser from '../../settings/ActiveUser';
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import {trackPage} from '../../_components/SegmentAnalytic'
export const customerActions = {
    getAll,
    getPage,
    save,
    getDetail,
    Delete,
    filteredList,
    removeStoreCredit,
    getCountry,
    getState,
    update,
    nullUpdate,
    removeSelected,
    updateCreditScore,
    updateCustomerNote,
    getAllEvents
};

function getPage(UID, PageSize, PageNumber) {
    return dispatch => {
        dispatch(request());
        customerService.getPage(UID, PageSize, PageNumber)
            .then(
                customerlist => {
                    // if (customerlist.content && customerlist.content.Records && customerlist.content.Records[0]) {
                    //     sessionStorage.setItem("CUSTOMER_ID", customerlist.content && customerlist.content.Records && customerlist.content.Records[0].WPId)
                    // }
                    dispatch(success(customerlist))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: customerConstants.GETALL_REQUEST } }
    function success(customerlist) { return { type: customerConstants.GETALL_SUCCESS, customerlist } }
    function failure(error) { return { type: customerConstants.GETALL_FAILURE, error } }
}

function getCountry() {
    return dispatch => {
        dispatch(request());
        customerService.getCountryList()
            .then(
                countrylist => {
                    dispatch(success(countrylist))
                    localStorage.setItem('countrylist', JSON.stringify(countrylist.content))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: customerConstants.GETALL_COUNTRY_REQUEST } }
    function success(countrylist) { return { type: customerConstants.GETALL__COUNTRY_SUCCESS, countrylist } }
    function failure(error) { return { type: customerConstants.GETALL_COUNTRY_FAILURE, error } }
}

function getState() {
    return dispatch => {
        customerService.getStateList()
            .then(
                statelist => {
                    localStorage.setItem('statelist', JSON.stringify(statelist.content))
                },
                error => (console.log("error", error))
            );
    };
}

function getAll(UID) {
    return dispatch => {
        dispatch(request());
        customerService.getAll(UID)
            .then(
                customerlist => {
                    dispatch(success(customerlist))
                    sessionStorage.setItem("CUSTOMER_ID", customerlist.content && customerlist.content[0].WPId)
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: customerConstants.GETALL_REQUEST } }
    function success(customerlist) { return { type: customerConstants.GETALL_SUCCESS, customerlist } }
    function failure(error) { return { type: customerConstants.GETALL_FAILURE, error } }
}

function getDetail(ID, UID) {
    return dispatch => {
        dispatch(request());
        customerService.getDetail(ID, UID)
            .then(
                single_cutomer_list => {                 
                    dispatch(success(single_cutomer_list))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: customerConstants.GET_DETAIL_REQUEST } }
    function success(single_cutomer_list) { return { type: customerConstants.GET_DETAIL_SUCCESS, single_cutomer_list } }
    function failure(error) { return { type: customerConstants.GET_DETAIL_FAILURE, error } }
}

//Fetching all events of customer
function getAllEvents(ID, UID) {
    return dispatch => {
        dispatch(request());
        customerService.getAllEvents(ID, UID)
            .then(
                customer_events => {                 
                    dispatch(success(customer_events))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: customerConstants.GET_EVENTS_REQUEST } }
    function success(customer_events) { return { type: customerConstants.GET_EVENTS_SUCCESS, customer_events } }
    function failure(error) { return { type: customerConstants.GET_EVENTS_FAILURE, error } }
}

function nullUpdate() {
    return dispatch => {
        dispatch(request());
        dispatch(success());
    }
    function request() { return { type: customerConstants.INSERT_REQUEST } }
    function success(customer) { return { type: customerConstants.INSERT_SUCCESS, customer } }
    function success(single_cutomer_list) { return { type: customerConstants.GET_DETAIL_SUCCESS, single_cutomer_list } }
}
function removeSelected() {
    return dispatch => {
        dispatch(request());
        dispatch(success());
    }
    function request() { return { type: customerConstants.GET_DETAIL_REQUEST } }
    function success(single_cutomer_list) { return { type: customerConstants.GET_DETAIL_SUCCESS, single_cutomer_list } }
}
function update(customer, status, backUrl) { 
    var ID = customer.Id;
    return dispatch => {
        dispatch(request(customer));
        if ((!customer.Email) || customer.Email == "") {
            dispatch(success({ content : null, is_success: false, message : "Email can't be emplty"}));;
        } else {
            customerService.update(customer)
                .then(
                    customer => {
                        trackPage(history.location.pathname,"Update Customer","CustomerView","CustomerEdit");
                        dispatch(success(customer));
                        sessionStorage.setItem("CUSTOMER_ID", customer.content ? customer.content.WPId : sessionStorage.getItem("CUSTOMER_ID"));
                        if ((typeof localStorage.getItem('CHECKLIST') == 'undefined') || localStorage.getItem('CHECKLIST') == null) {
                            //nothing
                            /* Created By:priyanka,Created Date:14/6/2019,Description:update localstorage on the basis of customer id */
                            if (localStorage.getItem('AdCusDetail')) {
                                var AdCusDetail = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : '';
                                if (customer && customer.content) {
                                    if (AdCusDetail.content && AdCusDetail.content.WPId == customer.content.WPId) {
                                        localStorage.setItem('AdCusDetail', JSON.stringify(customer))
                                    }
                                }
                            }
                        } else {
                            /* Created By:priyanka,Created Date:14/6/2019,Description:update localstorage on the basis of customer id */
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
                        if (checkList !== null && customer && customer.content) {
                            var orderCustomerInfo = customer && customer.content;
                            var customerDetail = []
                            if (status !== 'create') {
                                customerDetail = {
                                    content: {
                                        AccountBalance: orderCustomerInfo ? orderCustomerInfo.AccountBalance : 0,
                                        City: orderCustomerInfo ? orderCustomerInfo.City : '',
                                        Email: orderCustomerInfo ? orderCustomerInfo.Email : '',
                                        FirstName: orderCustomerInfo ? orderCustomerInfo.FirstName : '',
                                        Id: orderCustomerInfo ? orderCustomerInfo.WPId : '',
                                        LastName: orderCustomerInfo ? orderCustomerInfo.LastName : '',
                                        Notes: orderCustomerInfo ? orderCustomerInfo.notes : '',
                                        Phone: orderCustomerInfo ? orderCustomerInfo.Contact : 0,
                                        Pin: orderCustomerInfo ? orderCustomerInfo.Pin : '',
                                        Pincode: orderCustomerInfo ? orderCustomerInfo.Pincode : '',
                                        StoreCredit: orderCustomerInfo ? orderCustomerInfo.store_credit : 0,
                                        StreetAddress: orderCustomerInfo ? orderCustomerInfo.StreetAddress : '',
                                        StreetAddress2: orderCustomerInfo ? orderCustomerInfo.StreetAddress2 : '',
                                        Country: orderCustomerInfo ? orderCustomerInfo.Country : '',
                                        State: orderCustomerInfo ? orderCustomerInfo.State : '',
                                    }
                                }
                            } else {
                                customerDetail = {
                                    content: {
                                        AccountBalance: orderCustomerInfo ? orderCustomerInfo.AccountBalance : 0,
                                        City: orderCustomerInfo ? orderCustomerInfo.City : '',
                                        Email: orderCustomerInfo ? orderCustomerInfo.Email : '',
                                        FirstName: orderCustomerInfo ? orderCustomerInfo.FirstName : '',
                                        Id: orderCustomerInfo ? orderCustomerInfo.WPId : '',
                                        LastName: orderCustomerInfo ? orderCustomerInfo.LastName : '',
                                        Notes: orderCustomerInfo ? orderCustomerInfo.notes : '',
                                        Phone: orderCustomerInfo ? orderCustomerInfo.Contact : 0,
                                        Pin: orderCustomerInfo ? orderCustomerInfo.Pin : '',
                                        Pincode: orderCustomerInfo ? orderCustomerInfo.Pincode : '',
                                        StoreCredit: orderCustomerInfo ? orderCustomerInfo.store_credit : 0,
                                        StreetAddress: orderCustomerInfo ? orderCustomerInfo.StreetAddress : '',
                                        StreetAddress2: orderCustomerInfo ? orderCustomerInfo.StreetAddress2 : '',
                                        Country: orderCustomerInfo ? orderCustomerInfo.Country : '',
                                        State: orderCustomerInfo ? orderCustomerInfo.State : '',
                                    }
                                }
                            }
                            checkList['customerDetail']=  customerDetail;
                            // CheckoutList = {
                            //     ListItem: checkList.ListItem,
                            //     customerDetail:customerDetail,
                            //    // customerDetail: backUrl && backUrl !== '' && backUrl !== 'undefined' && status == 'create' || status == 'check_customer' ? customerDetail : [],
                            //     totalPrice: checkList.totalPrice,
                            //     discountCalculated: checkList.discountCalculated,
                            //     tax: checkList.tax,
                            //     subTotal: checkList.subTotal,
                            //     TaxId: checkList.TaxId,
                            //     status: checkList.status,
                            //     order_id: checkList.order_id,
                            //     order_date: checkList.order_date,
                            //     showTaxStaus: checkList.showTaxStaus,
                            //     oliver_pos_receipt_id: checkList && checkList !== null && checkList.oliver_pos_receipt_id ? checkList.oliver_pos_receipt_id : 0,
                            // }
                            localStorage.setItem("CHECKLIST", JSON.stringify(checkList))
                        }
                        setTimeout(function () {
                            if ((status == 'create' || status == 'update') &&  window.location.pathname !== '/checkout') {
                                history.push('/customerview')
                            } else {
                                if(window.location.pathname !== '/refund')
                                location.reload();
                            }                 
                            dispatch(success(customer));           
                            dispatch(alertActions.success('Update custmoer detail successfully'));
                        }, 500)
                    },
                    error => {
                        dispatch(failure(error.toString()));
                        dispatch(alertActions.error(error.toString()));
                    }
                );
        }
    };
    function request() { return { type: customerConstants.UPDATE_REQUEST } }
    function success(customer) { return { type: customerConstants.UPDATE_SUCCESS, customer } }
    function failure(error) { return { type: customerConstants.UPDATE_FAILURE, error } }
}

function save(customer, status, backUrl = null) {
    var ID = customer.Id;
    return dispatch => {
        dispatch(request(customer));
        if ((!customer.Email) || customer.Email == "") {
            dispatch(failure("Email can't be emplty"));
        } else {
            customerService.save(customer)
                .then(
                    customer => {
                        trackPage(history.location.pathname,"Create Customer","CustomerView","CustomerEdit");
                        dispatch(success(customer));
                        sessionStorage.setItem("CUSTOMER_ID", customer.content ? customer.content.WPId : 0);

                        if(status == 'create' && window.location.pathname == '/checkout' || backUrl == '/checkout' || backUrl == 'checkout') {
                            if (customer && customer.content) {
                               localStorage.setItem('AdCusDetail', JSON.stringify(customer));
                            }
                        }
                        else if (status == 'create') {                           
                        } else if ((typeof localStorage.getItem('CHECKLIST') == 'undefined') || localStorage.getItem('CHECKLIST') == null) {
                            //nothing
                            /* Created By:priyanka,Created Date:14/6/2019,Description:update localstorage on the basis of customer id */
                            if (localStorage.getItem('AdCusDetail')) {
                                var AdCusDetail = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : '';
                                if (customer && customer.content) {
                                    if (AdCusDetail.content && AdCusDetail.content.WPId == customer.content.WPId) {
                                        localStorage.setItem('AdCusDetail', JSON.stringify(customer))
                                    }
                                }
                            }
                        } else {
                            /* Created By:priyanka,Created Date:14/6/2019,Description:update localstorage on the basis of customer id */
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
                        checkList['customerDetail']=  customerDetail;
                            // CheckoutList = {
                            //     ListItem: checkList.ListItem,
                            //     customerDetail:  customerDetail ,
                            //     // customerDetail: backUrl && backUrl !== '' && backUrl !== 'undefined' && status == 'create' || status == 'check_customer' ? customerDetail : [],
                            //     totalPrice: checkList.totalPrice,
                            //     discountCalculated: checkList.discountCalculated,
                            //     tax: checkList.tax,
                            //     subTotal: checkList.subTotal,
                            //     TaxId: checkList.TaxId,
                            //     status: checkList.status,
                            //     order_id: checkList.order_id,
                            //     order_date: checkList.order_date,
                            //     showTaxStaus: checkList.showTaxStaus,
                            //     oliver_pos_receipt_id: checkList && checkList !== null && checkList.oliver_pos_receipt_id ? checkList.oliver_pos_receipt_id : 0,
                            // }
                            localStorage.setItem("CHECKLIST", JSON.stringify(checkList))
                        }
                        if(customer.content){
                           // setTimeout(function () {
                             var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                            if(demoUser){                   
                                GTM_OliverDemoUser("CustomerView: Customer Added")
                            }
                            dispatch(alertActions.success('New custmoer added successfully'));
                            dispatch(success(customer));
                            backUrl = backUrl && backUrl !== null ? backUrl : sessionStorage.getItem("backurl");
                         
                            if ((status == 'create' || status == 'update') && (window.location.pathname !== '/checkout' 
                            && window.location.pathname !== '/customerview' && window.location.pathname !== '/SelfCheckoutView' 
                            && backUrl !== '/shopview' && backUrl !== '/checkout' && backUrl !== 'checkout' && backUrl !== "/checkout")) {
                                location.reload();   
                            } 
                            /* Created By:Aman Singhai, Created Date:25/08/2020, Description:For closing create profile popup */
                            //else
                           var apphedle= sessionStorage.getItem("handleApps")
                            if(apphedle && apphedle=="true"){
                                sessionStorage.removeItem("handleApps");
                                location.reload();   
                            }

                            if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == true){
                                $('createProfle').removeClass('show');
                                hideModal('createProfle');
                            }
                            else if(backUrl !== '/shopview' && backUrl !== '/checkout' && backUrl !== 'checkout' && backUrl !== "/checkout") {
                                location.reload();                               
                            }
                        }
                        else{
                            dispatch(failure(customer.message));
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

function Delete(ID, UID) {
    return dispatch => {
        dispatch(request());
        customerService.Delete(ID, UID)
            .then(
                customer => {
                    if(customer.is_success == true)
                    {
                        sessionStorage.removeItem("CUSTOMER_ID");
                        sessionStorage.removeItem("AdCusDetail")
                        getDetail(null, UID);
                        setTimeout(function () {
                            // history.go()
                            location.reload();                            
                            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                            if(demoUser){                   
                                GTM_OliverDemoUser("CustomerView: Delete customer")
                            }
                            dispatch(success(customer));
                        }, 2000)
                    }
                    else{
                        if (!customer.message || customer.message == "") {
                            dispatch(failure('An error has occurred.'));
                        } else {
                            dispatch(failure(customer.message));
                        }
                    }
                    // window.location='/CustomerView';
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: customerConstants.DELETE_REQUEST } }
    function success(customer) { return { type: customerConstants.DELETE_SUCCESS, customer } }
    function failure(error) { return { type: customerConstants.DELETE_FAILURE, error } }
}

////--server Side-----------
function filteredList(udid, pagesize, filtere) {
    return dispatch => {
        dispatch(request());
        customerService.filteredList(udid, pagesize, filtere)
            .then(
                filteredList => {
                    dispatch(success(filteredList));
                },
                error => {
                    dispatch(failure(error.toString()));
                });
    }
    function success(filteredList) { return { type: customerConstants.GET_FILTER_SUCCESS, filteredList } }
    function request() { return { type: customerConstants.GET_FILTER_REQUEST } }
    function failure(error) { return { type: customerConstants.GET_FILTER_FAILER, error } }
}

function removeStoreCredit(UDID, Id, amount) {
    return dispatch => {
        dispatch(request(UDID, Id, amount));
        customerService.removeStoreCredit(UDID, Id, amount)
            .then(
                remove_customer => {                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("CustomerView: Remove store credit")
                    }
                    dispatch(success(remove_customer));
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };
    function request() { return { type: customerConstants.REMOVE_STORE_CREDIT_REQUEST } }
    function success(remove_customer) { return { type: customerConstants.REMOVE_STORE_CREDIT_SUCCESS, remove_customer } }
    function failure(error) { return { type: customerConstants.REMOVE_STORE_CREDIT_FAILURE, error } }
}


/**
 * Created By: Nagendra
 * Created Date : 14-05-2020
 * Description: Update the customer's store Credits
 * 
 */
function updateCreditScore(CustomerWpid,AddPoint,DeductPoint,Notes,Udid) {
    return dispatch => {
        dispatch(request());
        customerService.updateCreditScore(CustomerWpid,AddPoint,DeductPoint,Notes,Udid)
            .then(
                updatestorecredit => {  
                    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("Customer: Updated creadit score")
                    }               
                    dispatch(success(updatestorecredit))
                        ,
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: customerConstants.UPDATE_STORE_CREDIT_REQUEST } }
    function success(updatestorecredit) { return { type: customerConstants.UPDATE_STORE_CREDIT_SUCCESS, updatestorecredit } }
    function failure(error) { return { type: customerConstants.UPDATE_STORE_CREDIT_FAILURE, error } }
}

/**
 * Created By: Aatifa
 * Created Date : 18-05-2020
 * Description: Update the customer's notes
 * 
 */
function updateCustomerNote(CustomerWpid,Notes,Udid, metaData) {
    return dispatch => {
        dispatch(request());
        customerService.updateCustomerNote(CustomerWpid,Notes,Udid, metaData)
            .then(
                updatecustomernote => { 
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                            GTM_OliverDemoUser("Customer: Update customer notes")
                    }             
                    dispatch(success(updatecustomernote))
                        ,
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: customerConstants.UPDATE_CUSTOMER_NOTES_REQUEST} }
    function success(updatecustomernote) { return { type: customerConstants.UPDATE_CUSTOMER_NOTES_SUCCESS, updatecustomernote} }
    function failure(error) { return { type: customerConstants.UPDATE_CUSTOMER_NOTES_FAILURE, error } }
}