import { serverRequest } from '../CommonServiceRequest/serverRequest'

export const cloudPrinterService = {
    getCloudPrinters,
    sendOrderToCloudPrinter
};

function getCloudPrinters(locationId) {
    try {
        return serverRequest.clientServiceRequest('GET', `/CloudPrinter/GetPrinterByLocation?id=${locationId}`, '')
            .then(cloudPrinter => {
                return cloudPrinter;
            }).catch(error => {
                return error
            });;
    }
    catch (error) {
        return error
    }
}

function sendOrderToCloudPrinter(data) {
    try {
        // set url as per the view type e.g. activity or sale complete
        // data = {
        //     type : 'activity / saleComplete',
        //     printerId : 'xxx',
        //     orderId : 'xxx'
        // }
        var param = {}
        if (data.type == 'activity' || data.type == 'refundComplete') {
            param = {
                printerIds : data.printerId,
                OrderNumber : data.orderId
            }
        }
        else{
             param = {
                printerIds : data.printerId,
                OliverRecieptId : data.orderId
            }
        }
        var url = data.type == 'activity' || data.type == 'refundComplete'  ? `/CloudPrinter/OrderPrint`
            : data.type == 'saleComplete' ? `/CloudPrinter/TempOrderPrint` : ''

        return serverRequest.clientServiceRequest('POST', url, param)
            .then(response => {
                return response;
            }).catch(error => {
                return error
            });;
    }
    catch (error) {
        return error
    }
}