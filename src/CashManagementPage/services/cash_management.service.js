import Config from '../../Config'
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
export const cash_managementService = {
    cashRecords,
    getDetails,
    openRegister,
    getSummery,
    getCashDrawerAmount,
    addPaymentListLog,
    closeRegister,
    addRemoveCash,
    GetOpenRegister,
    SaveClosingNote
};

const API_URL = Config.key.OP_API_URL

/** 
 * Created By:Aman Singhai
 * Created Date:23/06/2020
 * Description:Fetching all events of cash drawer
 **/
function cashRecords(registerId, pageSize, pageNumber) {

    return serverRequest.clientServiceRequest('GET', `/CashManagement/Records?registerId=${registerId}&pageSize=${pageSize}&pageNumber=${pageNumber}`, '')
        .then(singleCashDrawerList => {
            return singleCashDrawerList;
        })
}
function getDetails(cashManagementId) {

    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetDetail?id=${cashManagementId}`, '')
        .then(cashDetail => {
            return cashDetail;
        })
}
function getSummery(CashManagementId, RegisterId, LoggenInUserId) {

    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetSummery?id=${CashManagementId}&registerId=${RegisterId}&salesPersonId=${LoggenInUserId}`, '')
        .then(cashDetail => {
            return cashDetail;
        })
}

function SaveClosingNote(prameters) {

    return serverRequest.clientServiceRequest('POST', `/CashManagement/SaveClosingNote`, prameters)
        .then(result => {
            return result;
        });
}
function addPaymentListLog(PaymentLogs) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/addPaymentListLog`, PaymentLogs)
        .then(result => {
            return result;
        });
}
/** 
 * Created By: Aman Singhai
 *  created Date: 01/07/2020
 *  Decription: For opening register
*/
function openRegister(open_register_param) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/OpenRegister`, open_register_param)
        .then(result => {
            return result;
        });
}

/** 
 * Created By:Aman Singhai
 * Created Date:02/07/2020
 * Description:For getting the cash drawer balance
 **/
function getCashDrawerAmount(registerId) {
    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetCashDrawerAmount?registerId=${registerId}`, '')
        .then(cashDrawerBalance => {
            return cashDrawerBalance;
        })
}

function closeRegister(closeRegisterParm) {
    return serverRequest.clientServiceRequest('POST', `/CashManagement/CloseRegister`, closeRegisterParm)

        .then(result => {
            return result;
        });
}

function addRemoveCash(addRemoveCashParm) {

    return serverRequest.clientServiceRequest('POST', `/CashManagement/AddRemoveCash`, addRemoveCashParm)
        .then(result => {
            return result;
        });
}
function GetOpenRegister(RegisterId) {
    //console.log("Servicecall",RegisterId);
    // console.log("Param", RegisterId)
    return serverRequest.clientServiceRequest('GET', `/CashManagement/GetOpenRegister?registerId=${RegisterId}&salesPersonId=''`, '')
        .then(cashDetail => {
            console.log("cashDetail", cashDetail);
            return cashDetail;
        })
}