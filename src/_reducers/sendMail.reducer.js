import { sendMailConstants } from '../_constants';

export function sendEmail(state = {}, action) {
    switch (action.type) {
        case sendMailConstants.SM_SUCCESS:
            return {
                sendEmail: action.getSuccess
            };
        case sendMailConstants.SM_FAILURE:
            return {
                error: action.error
            };
        case sendMailConstants.SM_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}