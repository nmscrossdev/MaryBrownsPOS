import { categoriesConstants  } from '../_constants';

export function categorylist(state = {}, action) {
    switch (action.type) {
        case categoriesConstants.CATEGORY_GETALL_REQUEST:
            return {
                loading: true
            };
        case categoriesConstants.CATEGORY_GETALL_SUCCESS:
            return {
                categorylist: action.categorylist
            };
        case categoriesConstants.CATEGORY_GETALL_FAILURE:
            return {
                error: action.error
            };
            default:
            return state
    }
}
