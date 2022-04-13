import { settingConstants, settingService } from '../';

export const settingActions = {
    getAll
};

function getAll() {
    return dispatch => {
        dispatch(request());
        settingService.getAll()
            .then(
                settinglist => dispatch(success(settinglist)),
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: settingConstants.GETALL_REQUEST } }
    function success(settinglist) { return { type: settingConstants.GETALL_SUCCESS, settinglist } }
    function failure(error) { return { type: settingConstants.GETALL_FAILURE, error } }
}



