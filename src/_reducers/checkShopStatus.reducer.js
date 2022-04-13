import { checkShopStatusConstants } from '../_constants';

export function checkshopstatus(state = {}, action) {
    switch (action.type) {
        case checkShopStatusConstants.SHOPSTATUS_SUCCESS:
            return {
                shopstatus: action.shopstatus
            };
        case checkShopStatusConstants.SHOPSTATUS_FAILURE:
            return {
                error: action.error
            };
        case checkShopStatusConstants.SHOPSTATUS_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}
