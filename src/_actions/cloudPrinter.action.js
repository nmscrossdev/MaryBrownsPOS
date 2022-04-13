import { cloudPrinterConstants } from '../_constants';
import { cloudPrinterService } from '../_services';

export const cloudPrinterActions = {
    getCloudPrinters,
    sendOrderToCloudPrinter
};

function getCloudPrinters(locationId) {
    return dispatch => {
        dispatch(request());
        cloudPrinterService.getCloudPrinters(locationId)
            .then(
                cloudPrinters => {
                    if(cloudPrinters && cloudPrinters.is_success == true && cloudPrinters.content ){
                        // var data = [cloudPrinters.content]
                        // cloudPrinters.content = data
                        localStorage.setItem("cloudPrinters", JSON.stringify(cloudPrinters));
                        dispatch(success(cloudPrinters))
                    }
                    else{
                        dispatch(failure(cloudPrinters))

                    }
                }
            ).catch((err)=>{
            dispatch(failure(err.toString()))

            })
    };
    function request() { return { type: cloudPrinterConstants.GET_CLOUD_PRINTER_REQUEST } }
    function success(cloudPrinters) { return { type: cloudPrinterConstants.GET_CLOUD_PRINTER_SUCCESS, cloudPrinters } }
    function failure(error) { return { type: cloudPrinterConstants.GET_CLOUD_PRINTER_FAILURE, error } }
}

function sendOrderToCloudPrinter(data) {
    return dispatch => {
        if(data == null){
            dispatch(success([]))
            return false
        }
        dispatch(request());
        cloudPrinterService.sendOrderToCloudPrinter(data)
            .then(
                printerRes => {
                    if(printerRes && printerRes.is_success == true ){
                        dispatch(success(printerRes))
                    }
                    else{
                        dispatch(failure(printerRes))

                    }
                }
            ).catch((err)=>{
            dispatch(failure(err.toString()))

            })
    };
    function request() { return { type: cloudPrinterConstants.SET_CLOUD_PRINTER_REQUEST } }
    function success(printerRes) { return { type: cloudPrinterConstants.SET_CLOUD_PRINTER_SUCCESS, printerRes } }
    function failure(error) { return { type: cloudPrinterConstants.SET_CLOUD_PRINTER_FAILURE, error } }
}


