import { checkShopStatusConstants,getProductCountConstants  } from '../_constants';
import { checkShopStatusService } from '../_services';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';

export const checkShopSTatusAction = {
    getStatus,
    getProductCount
};

function getStatus() {
    return dispatch => {
        // dispatch(request());
        checkShopStatusService.getStatus()
            .then(
                shopstatus => {
                    if (shopstatus && shopstatus != null) {
                        localStorage.setItem("shopstatus", JSON.stringify(shopstatus))
                        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                        if(demoUser){                   
                            GTM_OliverDemoUser("CheckShop Status: Check shop status")
                        }
                        dispatch(success(shopstatus)),
                            error => {
                                dispatch(failure(error.toString()))
                            }
                    }
                    else {
                        dispatch(failure("Unable to get shop status"))
                    }
                }
            );
    };
    function request() { return { type: checkShopStatusConstants.SHOPSTATUS_REQUEST } }
    function success(shopstatus) { return { type: checkShopStatusConstants.SHOPSTATUS_SUCCESS, shopstatus } }
    function failure(error) { return { type: checkShopStatusConstants.SHOPSTATUS_FAILURE, error } }
}

function getProductCount() {
    return dispatch => {
        // dispatch(request());
        checkShopStatusService.getProductCount()
            .then(
                productcount => {
                    if (productcount && productcount != null) {
                        if(productcount.content && productcount.content.count)
                        {
                            localStorage.setItem("productcount", productcount.content.count)
                        }
                        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                        if(demoUser){                   
                            GTM_OliverDemoUser("CheckShop Status: Get Product Count")
                        }
                        dispatch(success(productcount)),
                            error => {
                                dispatch(failure(error.toString()))
                            }
                    }
                    else {
                        dispatch(failure("Unable to get product count"))
                    }
                }
            );
    };
    function request() { return { type: getProductCountConstants.PRODUTCTCOUNT_REQUEST } }
    function success(productcount) { return { type: getProductCountConstants.PRODUTCTCOUNT_SUCCESS, productcount } }
    function failure(error) { return { type: getProductCountConstants.PRODUTCTCOUNT_FAILURE, error } }
}
