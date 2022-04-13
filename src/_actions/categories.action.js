import { categoriesConstants } from '../_constants';
import { categoriesService } from '../_services';

export const categoriesActions = {
    getAll,
    refresh
};

function getAll() {
    return dispatch => {
        dispatch(request());
        categoriesService.getAll()
            .then(
                categorieslist => {
                    localStorage.setItem("categorieslist", JSON.stringify(categorieslist));
                    dispatch(success(categorieslist)),
                        error => dispatch(failure(error.toString()))
                }
            );
    };
    function request() { return { type: categoriesConstants.CATEGORY_GETALL_REQUEST } }
    function success(categorylist) { return { type: categoriesConstants.CATEGORY_GETALL_SUCCESS, categorylist } }
    function failure(error) { return { type: categoriesConstants.CATEGORY_GETALL_FAILURE, error } }
}

function refresh() {
    return { type: categoriesConstants.CATEGORY_GETALL_REFRESH };
}

