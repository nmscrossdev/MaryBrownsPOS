import { demoShopConstants } from '../_constants';
import { demoShopService } from '../_services';
import { get_UDid } from '../ALL_localstorage'

export const demoShopActions = {
   updateDemoShop,
   completeDemoShop
};

function updateDemoShop(id) {
    return dispatch => {
        // dispatch(request());
        // let productlist = []
        // dispatch(success(productlist))
        demoShopService.updateDemoShop(id)
            .then(
                res => {
                    dispatch(success(res)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    // function request() { return { type: allProductConstants.PRODUCT_GETALL_REQUEST } }
    function success(res) { return { type: demoShopConstants.UPDATE_DEMO_SHOP_SUCCESS, res } }
    function failure(error) { return { type: demoShopConstants.UPDATE_DEMO_SHOP_ERROR, error } }
}

function completeDemoShop(cId,vId) {
    return dispatch => {
        demoShopService.completeDemoShop(cId,vId)
            .then(
                res => {
                    dispatch(success(res)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function success(res) { return { type: demoShopConstants.COMPLETE_DEMO_SHOP_SUCCESS, res } }
    function failure(error) { return { type: demoShopConstants.COMPLETE_DEMO_SHOP_ERROR, error } }
}


