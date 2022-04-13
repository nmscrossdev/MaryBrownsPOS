import { sendMailConstants } from '../_constants';
import { sendMailService } from '../_services';

export const sendMailAction = {
    sendMail,sendMailExternal
};

function sendMail(data) {
    return dispatch => {
        dispatch(request());
        sendMailService.send(data)
            .then(
                getSuccess => {
                    dispatch(success(getSuccess)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: sendMailConstants.SM_REQUEST } }
    function success(getSuccess) { return { type: sendMailConstants.SM_SUCCESS, getSuccess } }
    function failure(error) { return { type: sendMailConstants.SM_FAILURE, error } }
}
function sendMailExternal(data) {
    return dispatch => {
        dispatch(request());
        sendMailService.sendExternal(data)
            .then(
                getSuccess => {
                    dispatch(success(getSuccess)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: sendMailConstants.SM_REQUEST } }
    function success(getSuccess) { return { type: sendMailConstants.SM_SUCCESS, getSuccess } }
    function failure(error) { return { type: sendMailConstants.SM_FAILURE, error } }
}

