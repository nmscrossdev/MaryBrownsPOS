import { discountConstants } from '../_constants';
import { discountService } from '../_services';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';

export const discountActions = {
    getAll,
    refresh
};

function getAll() {
    return dispatch => {
        dispatch(request());
        var discountlist = []
        dispatch(success(discountlist))
        discountService.getAll()
            .then(
                discountlist => {
                    var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //      GTM_OliverDemoUser("Discount: Get all discount list")
                    // }
                    dispatch(success(discountlist)),

                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: discountConstants.GETALL_REQUEST } }
    function success(discountlist) { return { type: discountConstants.GETALL_SUCCESS, discountlist } }
    function failure(error) { return { type: discountConstants.GETALL_FAILURE, error } }
}

function refresh() {
    return { type: discountConstants.GETALL_REFRESH };
}

