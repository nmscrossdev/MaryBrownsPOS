import { tipsConstants } from '../_constants';
import { tipsService } from '../_services';

export const tipsActions = {
    getAll,
};

function getAll() {
    return dispatch => {
        dispatch(request());
        var tipslst = []
        dispatch(success(tipslst))
        tipsService.getAll()
            .then(
                tipslst => {                            
                    dispatch(success(tipslst)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: tipsConstants.GETALL_REQUEST } }
    function success(tipslst) { return { type: tipsConstants.GETALL_SUCCESS, tipslst } }
    function failure(error) { return { type: tipsConstants.GETALL_FAILURE, error } }
}


