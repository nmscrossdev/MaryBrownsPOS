import { allProductConstants } from '../_constants';
import { allProductService } from '../_services';
import { GTM_OliverDemoUser } from '../_components/CommonfunctionGTM';

export const attributesActions = {
    getAll,refresh   
};

function getAll() {
    return dispatch => {
        dispatch(request());
        allProductService.getAttributes()
            .then(               
                attributelist => 
               { 
                   localStorage.setItem("attributelist",JSON.stringify(attributelist));
                   var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
                    // if(demoUser){                   
                    //      GTM_OliverDemoUser("All attributes: Get attributes list")
                    // }
                dispatch(success(attributelist)),
                error => dispatch(failure(error.toString()))
               }
            );
    };

    function request() { return { type: allProductConstants.ATTRIBUTE_GETALL_REQUEST } }
    function success(attributelist) { return { type: allProductConstants.ATTRIBUTE_GETALL_SUCCESS, attributelist } }
    function failure(error) { return { type: allProductConstants.ATTRIBUTE_GETALL_FAILURE, error } }
}

function refresh() {   
    return { type: allProductConstants.ATTRIBUTE_GETALL_REFRESH };
}

