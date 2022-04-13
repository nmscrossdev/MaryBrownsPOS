import { cartProductConstants } from '../_constants';

export function cartproductlist(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.PRODUCT_ADD_REQUEST:
            return {
                loading: state
            };
        case cartProductConstants.PRODUCT_ADD_SUCCESS:
            return {
                cartproductlist: action.cartproductlist
            };
        default:
            return state
    }
}

export function selecteditem(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.SELECTED_PRODUCT_DISCOUNT_REQUEST:
            return {
                selecteditem: state
            };
        case cartProductConstants.SELECTED_PRODUCT_DISCOUNT_SUCCESS:
            return {
                selecteditem: action.selecteditem
            };
        default:
            return state
    }
}

export function single_product(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.PRODUCT_SINGLE_ADD_SUCCESS:
            return {
                items: action.single_product
            };
        case cartProductConstants.PRODUCT_SINGLE_ADD_FAILURE:
            return {
                error: action.error
            };
        case cartProductConstants.PRODUCT_SINGLE_ADD_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}

export function get_single_inventory_quantity(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.GET_SINGAL_INVENTORY_SUCCESS:
            return {
                items: action.inventory_quantitiy
            };
        case cartProductConstants.GET_SINGAL_INVENTORY_FAILURE:
            return {
                error: action.error
            };
        case cartProductConstants.GET_SINGAL_INVENTORY_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}

export function showSelectedProduct(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.SHOW_SELECTED_PRODUCT_REQUEST:
            return {
                loading: true
            };
        case cartProductConstants.SHOW_SELECTED_PRODUCT_SUCCESS:
            return {
                items: action.showSelectedProduct
            };
        default:
            return state
    }
}

/**
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : dispatch data in all apges as requir.
 * 
 * Updated By   : 
 * Updated Date : 
 * Description :    
*/
export function taxlist(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.TAXLIST_GET_REQUEST:
            return {
                loading: true
            };
        case cartProductConstants.TAXLIST_GET_SUCCESS:
            return {
                items: action.taxlist
            };
        default:
            return state
    }
}


/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 19-06-2019
 * Description  : for call update tax list apply in all product .
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export function updateTaxRateList(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.UPDATE_TAX_RATE_LIST_REQUEST:
            return {
                loading: action.updatetaxlist
            };
        case cartProductConstants.UPDATE_TAX_RATE_LIST_SUCCESS:
            return {
                items: action.updatetaxlist
            };
        default:
            return state
    }
}

/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 20-06-2019
 * Description  : call module for manage props and state for ticket seating form.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export function form_ticket_seating(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.GET_TICKET_SEATING_FORM_REQUEST:
            return {
                loading: true
            };
        case cartProductConstants.GET_TICKET_SEATING_FORM_SUCCESS:
            return {
                items: action.form_ticket_seating
            };
        case cartProductConstants.GET_TICKET_SEATING_FORM_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 09-06-2019
 * Description  : call module for manage props and state for ticket reserced seats.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export function reserved_tikera_seat(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.RESERVED_TIKERA_SEAT_REQUEST:
            return {
                loading: true
            };
        case cartProductConstants.RESERVED_TIKERA_SEAT_SUCCESS:
            return {
                items: action.reserved_tikera_seat
            };
        case cartProductConstants.RESERVED_TIKERA_SEAT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}


/**
 * Created By   : Shakuntala Jatav
 * Created Date : 09-06-2019
 * Description  : call module for manage props and state for ticket reserced seats.
 * 
 * Updated By   :
 * Updated Date :
 * Description :    
*/
export function booked_seats(state = {}, action) {
    switch (action.type) {
        case cartProductConstants.BOOKED_SEATS_REQUEST:
            return {
                loading: true
            };
        case cartProductConstants.BOOKED_SEATS_SUCCESS:
            return {
                items: action.booked_seats
            };
        default:
            return state
    }
}
