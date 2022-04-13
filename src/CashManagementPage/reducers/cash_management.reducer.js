import { cash_managementConstants } from '../';

/** 
 * Created By:Aman Singhai
 * Created Date:23/06/2020
 **/
export function cashRecords(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.GET_CASH_DRAWER_RECORDS_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.GET_CASH_DRAWER_RECORDS_SUCCESS:
            return {
                ...state,
                cashRecord: action.cashRecords
            };
        case cash_managementConstants.GET_CASH_DRAWER_RECORDS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function cashDetails(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.GET_CASH_DETAIL_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.GET_CASH_DETAIL_SUCCESS:
            return {
                ...state,
                cashDetail: action.cashDetail
            };
        case cash_managementConstants.GET_CASH_DETAIL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function cashSummery(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.GET_CASH_SUMMERY_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.GET_CASH_SUMMERY_SUCCESS:
            return {
                ...state,
                cashSummery: action.getSummery
            };
        case cash_managementConstants.GET_CASH_SUMMERY_FAILURES:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function addPaymentListLog(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.ADD_PAYMENTLOG_LIST_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.ADD_PAYMENTLOG_LIST_SUCCESS:
            return {
                ...state,
                paymentLogs : action.paymentLogs
            };
        case cash_managementConstants.ADD_PAYMENTLOG_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
/** 
 * Created By:Aman Singhai
 * Created Date:01/07/2020
 **/
export function open_register(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.OPEN_REGISTER_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.OPEN_REGISTER_SUCCESS:
            return {
                ...state,
                items : action.open_register
            };
        case cash_managementConstants.OPEN_REGISTER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
/** 
 * Created By:Aman Singhai
 * Created Date:02/07/2020
 **/
export function cashDrawerBalance(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.GET_CASH_DRAWER_AMOUNT_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.GET_CASH_DRAWER_AMOUNT_SUCCESS:
            return {
                ...state,
                cashDrawerBalance: action.cashDrawerBalance
            };
        case cash_managementConstants.GET_CASH_DRAWER_AMOUNT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function closeRegister(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.CLOSE_REGISTER_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.CLOSE_REGISTER_SUCCESS:
            return {
                ...state,
                closeRegister : action.closeRegister
            };
        case cash_managementConstants.CLOSE_REGISTER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function addRemoveCash(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.ADD_REMOVE_CASH_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.ADD_REMOVE_CASH_SUCCESS:
            return {
                ...state,
                addRemoveCash : action.addRemoveCash
            };
        case cash_managementConstants.ADD_REMOVE_CASH_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function cashRegister(state = {}, action) {
    switch (action.type) {
        case cash_managementConstants.CASH_REGISTER_REQUEST:
            return {
                loading: true
            };
        case cash_managementConstants.CASH_REGISTER_SUCCESS:
            return {
                ...state,
                cashRegister : action.cashRegister
            };
        case cash_managementConstants.CASH_REGISTER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}