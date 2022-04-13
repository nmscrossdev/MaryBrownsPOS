import { externalLoginConstants as userConstants } from '../constants/externalLogin.constants';

export function externalLogin(state = {}, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                loading: true
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loginRes: action.loginRes
            };
        case userConstants.LOGIN_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function checkout_list(state = {}, action) {
    switch (action.type) {
        // case checkoutConstants.PRODUCT_ADD_REQUEST:
        //     return {
        //         loading: true
        //     };
        case userConstants.GET_CHECKOUT_LIST_SUCCESS:
            return {
                items: action.checkout_list
            };

        default:
            return state
    }
}

export function shop_order(state = {}, action) {
    switch (action.type) {
        // case checkoutConstants.PRODUCT_ADD_REQUEST:
        //     return {
        //         loading: true
        //     };
        case userConstants.INSERT_SUCCESS:
            localStorage.setItem("ORDER_ID", JSON.stringify(action.shop_order));
            return {
                items: action.shop_order
            };
        default:
            return state
    }
}

