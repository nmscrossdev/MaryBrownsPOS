import { serverRequest } from "../../CommonServiceRequest/serverRequest"

export const paymentService = {
    make_payconiq_payment,
    check_payconiq_pay_status,
    cancel_payconiq_payment
}


function make_payconiq_payment (requestParam) {
    return serverRequest.clientServiceRequest('POST', `/UPIPayment/RunTransaction`, requestParam)
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}
function check_payconiq_pay_status (sessionId) {
    return serverRequest.clientServiceRequest('GET', `/UPIPayment/GetStatus?_S=${sessionId}`, '')
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}
function cancel_payconiq_payment (data) {
    return serverRequest.clientServiceRequest('POST', `/UPIPayment/CancelPayment`, data)
        .then(res => {
            return res
        })
        .catch(error => {
            return { "is_success": false, "message": error !== "" && error.Message ? error.Message : 'An error has occurred.' }
        })
}