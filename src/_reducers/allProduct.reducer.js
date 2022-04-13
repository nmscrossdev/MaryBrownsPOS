import { allProductConstants } from '../_constants';

export function productlist(state = {}, action) {
    switch (action.type) {
        case allProductConstants.PRODUCT_GETALL_REQUEST:
            return {
                loading: true
            };
        case allProductConstants.PRODUCT_GETALL_SUCCESS:
            return {
                response: action.response
            };
        default:
            return state
    }
}

export function attributelist(state = {}, action) {
    switch (action.type) {
        case allProductConstants.ATTRIBUTE_GETALL_SUCCESS:
            return {
                attributelist: action.attributelist
            };
        case allProductConstants.ATTRIBUTE_GETALL_FAILURE:
            return {
                error: action.error
            };
        case allProductConstants.ATTRIBUTE_GETALL_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}
//filteredProduct
export function ticketfield(state = {}, action) {
    switch (action.type) {

        case allProductConstants.TICKET_FIELD_GETALL_SUCCESS:
            return {
                ticketfieldList: action.ticketfield
            };
        case allProductConstants.TICKET_FIELD_GETALL_FAILURE:
            return {
                error: action.error
            };
        case allProductConstants.TICKET_FIELD_GETALL_REQUEST:
            return {
                loading: true
            };
        default:
            return state
    }
}

export function filteredProduct(state = {}, action) {
    switch (action.type) {
        case allProductConstants.FILTERED_ALL_PRODUCTS_REQUEST:
            return {
                loading: true
            };
        case allProductConstants.FILTERED_ALL_PRODUCTS_SUCCESS:
            return {
                items: action.filteredProduct
            };
        default:
            return state
    }
}
/** 
 * Created By   : Shakuntala Jatav
 * Created Date : 23-07-2019
 * Description  : update props for after inventory of product is increase/decraese.
*/
export function update_product_DB(state = {}, action) {
    switch (action.type) {
        case allProductConstants.PRODUCT_UPDATE_IN_DB_SUCCESS:
            return {
                items: action.update_product_DB
            };
        default:
            return state
    }
}

export function productWarehouseQuantity(state = {}, action) {
    switch (action.type) {
        case allProductConstants.PRODUCT_QTY_REQUEST:
            return {
                loading: true
            };
        case allProductConstants.PRODUCT_QTY_SUCCESS:
            return {
                detail: action.productDetail
            };
        case allProductConstants.PRODUCT_QTY_FAILURE:
            return {
                loading: true
            };
        default:
            return state
    }
}