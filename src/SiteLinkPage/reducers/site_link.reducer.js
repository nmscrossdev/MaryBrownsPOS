import { siteConstants } from '../';

export function sitelist(state = {}, action) {
    switch (action.type) {
        case siteConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case siteConstants.GETALL_SUCCESS:
            return {
                items: action.sitelist
            };
        case siteConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

