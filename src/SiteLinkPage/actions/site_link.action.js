import { siteConstants, siteService } from '../';

export const siteActions = {
    getAll,
};

function getAll() {
    return dispatch => {
        dispatch(request());
        var sitelist = []
        dispatch(success(sitelist))
        // siteService.getAll()
        //     .then(
        //         sitelist => dispatch(success(sitelist)),
        //         error => dispatch(failure(error.toString()))
        //     );
    };

    function request() { return { type: siteConstants.GETALL_REQUEST } }
    function success(sitelist) { return { type: siteConstants.GETALL_SUCCESS, sitelist } }
    function failure(error) { return { type: siteConstants.GETALL_FAILURE, error } }
}



