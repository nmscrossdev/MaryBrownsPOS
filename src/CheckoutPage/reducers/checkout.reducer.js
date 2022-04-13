import { checkoutConstants } from '../constants/checkout.constants';

export function checkoutlist(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.GETALL_SUCCESS:
            return {
                items: action.checkoutlist
            };
        case checkoutConstants.GETALL_FAILURE:
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
        case checkoutConstants.GET_CHECKOUT_LIST_SUCCESS:
            return {
                items: action.checkout_list
            };
        default:
            return state
    }
}

export function tick_event(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.TICKET_EVENT_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.TICKET_EVENT_SUCCESS:
            return {
                items: action.tick_event
            };
        case checkoutConstants.TICKET_EVENT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }

}

export function shop_order(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.INSERT_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.INSERT_SUCCESS:
            return {
                items: action.shop_order
            };
        case checkoutConstants.INSERT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function shop_orderstatus_update(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.ORDERSTATUS_UPDATE_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.ORDERSTATUS_UPDATE_SUCCESS:
            return {
                order_status_update: action.order_status_update
            };
        case checkoutConstants.ORDERSTATUS_UPDATE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function cash_rounding(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.CASH_ROUNDING_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.CASH_ROUNDING_SUCCESS:
            return {
                items: action.cash_rounding
            };
        case checkoutConstants.CASH_ROUNDING_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}


export function paymentTypeName(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.GET_PAYMENT_TYPE_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.GET_PAYMENT_TYPE_SUCCESS:
            return {
                items: action.paymentTypeName
            };
        case checkoutConstants.GET_PAYMENT_TYPE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function global_payment(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.GLOBAL_PAYMENTS_REQUEST:
            return {
                items: action.global_payment
            };
        case checkoutConstants.GLOBAL_PAYMENTS_SUCCESS:
            return {
                items: action.global_payment
            };
        case checkoutConstants.GLOBAL_PAYMENTS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

/** 
 * CeratedBy :Nagendra Suryawanshi
 *  CeateDate:06-07-2019
 *  Desceiption: Synck temp order
 */
export function syncTemporder(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.TEMP_ORDER_SYNC_REQUEST:
            return {
                items: action.orderId
            };
        case checkoutConstants.TEMP_ORDER_SYNC_SUCCESS:
            return {
                items: action.orderId
            };
        case checkoutConstants.TEMP_ORDER_SYNC_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
/** 
 * CeratedBy :shakuntala Jatav
 *  CeateDate:09-07-2019
 *  Desceiption: for update props data to sale to void in payment by checkout page . 
*/
export function sale_to_void_status(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.VOID_SALE_SUCCESS:
            return {
                items: action.sale_to_void_status
            };
        default:
            return state
    }
}

/** 
 * CeratedBy :shakuntala jatav
 *  CeateDate:04-10-2019
 *  Desceiption: 
 */
export function get_do_sale(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.GET_DO_SALE_REQUEST:
            return {
                loading: true
            };
        case checkoutConstants.GET_DO_SALE_SUCCESS:
            return {
                items: action.get_do_sale
            };
        case checkoutConstants.GET_DO_SALE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

// online payment reducer
export function online_payment(state = {}, action) {
    switch (action.type) {
        case checkoutConstants.ONLINE_PAYMENTS_REQUEST:
            return {
                loading: true,
                items: action.online_payments
            };
        case checkoutConstants.ONLINE_PAYMENTS_SUCCESS:
            return {
                loading: false,
                items: action.online_payments
            };
        case checkoutConstants.ONLINE_PAYMENTS_FAILURE:
            return {
            loading: false,
            error: action.error
            };
        default:
            return state
    }
}


