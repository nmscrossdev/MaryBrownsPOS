import { alertActions } from '../../_actions';
import { cash_managementService } from '../services/cash_management.service';
import { cash_managementConstants } from '../constants/cash_management.constants';
import { GTM_OliverDemoUser } from '../../../src/_components/CommonfunctionGTM';

export const cashManagementAction = {
    cashRecords,
    getDetails,
    openRegister,
    getSummery,
    addPaymentListLog,
    getCashDrawerAmount,
    closeRegister,
    addRemoveCash,
    GetOpenRegister,
    SaveClosingNote
};

/** 
 * Created By:Aman Singhai
 * Created Date:23/06/2020
 * Description:Fetching all events of cash drawer
 **/
function cashRecords(registerId,pageSize,pageNumber) {
    return dispatch => {
        dispatch(request());
        cash_managementService.cashRecords(registerId,pageSize,pageNumber)
            .then(
                cashRecords => {   
                    console.log('cashRecords', cashRecords)
                    var _RecordArray = cashRecords && cashRecords.content ? cashRecords.content.Records : [];
                    if(_RecordArray.length>0){
                        _RecordArray.sort(function (a, b) {
                            var keyA = new Date(a.LogDate),
                                keyB = new Date(b.LogDate);
                            // Compare the 2 dates
                            if (keyA < keyB) return -1;
                            if (keyA > keyB) return 1;
                            return 0;
                        });
                        _RecordArray.reverse();
                           var openingCashDrawerRecord=  _RecordArray ? _RecordArray.find(Items => Items.ClosedTimeUtc == null) :null;
                       if(openingCashDrawerRecord && openingCashDrawerRecord.Id){
                           localStorage.setItem("Cash_Management_ID",openingCashDrawerRecord.Id)
                           localStorage.setItem("IsCashDrawerOpen","true");
                       }
                    }
                   var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                   dispatch(success(_RecordArray))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: cash_managementConstants.GET_CASH_DRAWER_RECORDS_REQUEST } }
    function success(cashRecords) { return { type: cash_managementConstants.GET_CASH_DRAWER_RECORDS_SUCCESS, cashRecords } }
    function failure(error) { return { type: cash_managementConstants.GET_CASH_DRAWER_RECORDS_FAILURE, error } }
}


function getDetails(cashManagementId) {
   return dispatch => {
        dispatch(request());
        cash_managementService.getDetails(cashManagementId)
            .then(
                cashDetail => {    
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                      dispatch(success(cashDetail))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: cash_managementConstants.GET_CASH_DETAIL_REQUEST } }
    function success(cashDetail) { return { type: cash_managementConstants.GET_CASH_DETAIL_SUCCESS, cashDetail } }
    function failure(error) { return { type: cash_managementConstants.GET_CASH_DETAIL_FAILURE, error } }
}
function getSummery(CashManagementId,RegisterId,LoggenInUserId) {
    return dispatch => {
        dispatch(request());
        cash_managementService.getSummery(CashManagementId,RegisterId,LoggenInUserId)
            .then(
                getSummery => {                 
                    dispatch(success(getSummery))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: cash_managementConstants.GET_CASH_SUMMERY_REQUEST } }
    function success(getSummery) { return { type: cash_managementConstants.GET_CASH_SUMMERY_SUCCESS, getSummery } }
    function failure(error) { return { type: cash_managementConstants.GET_CASH_SUMMERY_FAILURE, error } }
}
function addPaymentListLog(PaymentLogs) {
    return dispatch => {
        dispatch(request());
        cash_managementService.addPaymentListLog(PaymentLogs)
            .then(
                paymentLogs => {                 
                    dispatch(success(paymentLogs))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: cash_managementConstants.ADD_PAYMENTLOG_LIST_REQUEST } }
    function success(paymentLogs) { return { type: cash_managementConstants.ADD_PAYMENTLOG_LIST_SUCCESS, paymentLogs } }
    function failure(error) { return { type: cash_managementConstants.ADD_PAYMENTLOG_LIST_FAILURE, error } }
}


    /** 
 * Created By: Aman Singhai
 *  created Date: 01/07/2020
 *  Decription: For opening register 
*/
function openRegister(open_register_param) {      
    return dispatch => {
        dispatch(request(open_register_param));
        cash_managementService.openRegister(open_register_param).then(
            open_register => {
                if(open_register.content){
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                        localStorage.setItem("Cash_Management_ID", open_register.content.Id);
                        localStorage.setItem("IsCashDrawerOpen","true");
                        dispatch(success(open_register));
                    }
                    if(open_register.exceptions){
                        dispatch(success(open_register));
                    }
                },
            error => {
                dispatch(failure(error.toString()));              
            }
        );
    };
    function request() { return { type: cash_managementConstants.OPEN_REGISTER_REQUEST } }
    function success(open_register) { return { type: cash_managementConstants.OPEN_REGISTER_SUCCESS, open_register } }
    function failure(error) { return { type: cash_managementConstants.OPEN_REGISTER_FAILURE, error } }
}

function GetOpenRegister(RegisterId) {      
    return dispatch => {
        dispatch(request());
        cash_managementService.GetOpenRegister(RegisterId).then(
            cashRegister => {
                console.log("cashRegister",cashRegister.content)
                if(cashRegister.content && cashRegister.content !=='' && cashRegister.content !==0){
                   localStorage.setItem("IsCashDrawerOpen","true");
                   localStorage.setItem("Cash_Management_ID",cashRegister.content.Id);                  
                }else{
                    localStorage.setItem("IsCashDrawerOpen","false");
                    localStorage.removeItem("Cash_Management_ID");
                }
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;                   
                dispatch(success(cashRegister));               
            },
            error => {
                dispatch(failure(error.toString()));              
            }
        );
    };
    function request() { return { type: cash_managementConstants.CASH_REGISTER_REQUEST } }
    function success(cashRegister) { return { type: cash_managementConstants.CASH_REGISTER_SUCCESS, cashRegister } }
    function failure(error) { return { type: cash_managementConstants.CASH_REGISTER_FAILURE, error } }
}

/** 
 * Created By:Aman Singhai
 * Created Date:02/07/2020
 * Description:For getting the cash drawer balance
 **/
function getCashDrawerAmount(registerId) {
    return dispatch => {
        dispatch(request());
        cash_managementService.getCashDrawerAmount(registerId)
            .then(
                cashDrawerBalance => {                 
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                   dispatch(success(cashDrawerBalance))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: cash_managementConstants.GET_CASH_DRAWER_AMOUNT_REQUEST } }
    function success(cashDrawerBalance) { return { type: cash_managementConstants.GET_CASH_DRAWER_AMOUNT_SUCCESS, cashDrawerBalance } }
    function failure(error) { return { type: cash_managementConstants.GET_CASH_DRAWER_AMOUNT_FAILURE, error } }
}

/** 
 * Created By: Aman Singhai
 *  created Date: 08/07/2020
 *  Decription: For closing register 
*/
function closeRegister(closeRegisterParm) {      
    return dispatch => {
        dispatch(request(closeRegisterParm));
        cash_managementService.closeRegister(closeRegisterParm).then(
            closeRegister => {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("Cash Management: close Register")
                    }
                dispatch(success(closeRegister));               
            },
            error => {
                dispatch(failure(error.toString()));              
            }
        );
    };
    function request() { return { type: cash_managementConstants.CLOSE_REGISTER_REQUEST } }
    function success(closeRegister) { return { type: cash_managementConstants.CLOSE_REGISTER_SUCCESS, closeRegister } }
    function failure(error) { return { type: cash_managementConstants.CLOSE_REGISTER_FAILURE, error } }
}
function SaveClosingNote(parameters) {      
    return dispatch => {
        dispatch(request());
        cash_managementService.SaveClosingNote(parameters).then(
            closeRegister => {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("Cash Management: Save Closing notes")
                    }
                dispatch(success(closeRegister));               
            },
            error => {
                dispatch(failure(error.toString()));              
            }
        );
    };
    function request() { return { type: cash_managementConstants.CLOSE_REGISTER_REQUEST } }
    function success(closeRegister) { return { type: cash_managementConstants.CLOSE_REGISTER_SUCCESS, closeRegister } }
    function failure(error) { return { type: cash_managementConstants.CLOSE_REGISTER_FAILURE, error } }
}

/** 
 * Created By: Aman Singhai
 *  created Date: 08/07/2020
 *  Decription: For adding and removing cash 
*/
function addRemoveCash(addRemoveCashParm) {      
    return dispatch => {
        dispatch(request(addRemoveCashParm));
        cash_managementService.addRemoveCash(addRemoveCashParm).then(
            addRemoveCash => {
                var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    if(demoUser){                   
                         GTM_OliverDemoUser("Cash Management: Add remove cash")
                    }
                dispatch(success(addRemoveCash));               
            },
            error => {
                dispatch(failure(error.toString()));              
            }
        );
    };
    function request() { return { type: cash_managementConstants.ADD_REMOVE_CASH_REQUEST } }
    function success(addRemoveCash) { return { type: cash_managementConstants.ADD_REMOVE_CASH_SUCCESS, addRemoveCash } }
    function failure(error) { return { type: cash_managementConstants.ADD_REMOVE_CASH_FAILURE, error } }
}