import { cloudPrinterConstants  } from '../_constants';

export function cloudPrinterList(state = {}, action) {
    switch (action.type) {
        case cloudPrinterConstants.GET_CLOUD_PRINTER_REQUEST:
            return {
                loading: true
            };
        case cloudPrinterConstants.GET_CLOUD_PRINTER_SUCCESS:
            return {
                cloudPrinters: action.cloudPrinters
            };
        case cloudPrinterConstants.GET_CLOUD_PRINTER_FAILURE:
            return {
                error: action.error
            };
            default:
            return state
    }
}

export function setOrderTocloudPrinter(state = {}, action) {
    switch (action.type) {
        case cloudPrinterConstants.SET_CLOUD_PRINTER_REQUEST:
            return {
                loading: true
            };
        case cloudPrinterConstants.SET_CLOUD_PRINTER_SUCCESS:
            return {
                printerRes: action.printerRes
            };
        case cloudPrinterConstants.SET_CLOUD_PRINTER_FAILURE:
            return {
                error: action.error
            };
            default:
            return state
    }
}
