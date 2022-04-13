import { demoShopConstants } from '../_constants';

export function updateDemoShopReducer(state = {}, action) {
    switch (action.type) {
        case demoShopConstants.UPDATE_DEMO_SHOP_SUCCESS:
            return {
                response: action.res
            };
        case demoShopConstants.UPDATE_DEMO_SHOP_ERROR:
            return {
                response: action.error
            };
        default:
            return state
    }
}

export function completeDemoShopReducer(state = {}, action) {
    switch (action.type) {
        case demoShopConstants.COMPLETE_DEMO_SHOP_SUCCESS:
            return {
                response: action.res
            };
        case demoShopConstants.COMPLETE_DEMO_SHOP_ERROR:
            return {
                response: action.error
            };
        default:
            return state
    }
}
