import { customerConstants } from '../';

export function customerlist(state = {}, action) {
    switch (action.type) {
        case customerConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GETALL_SUCCESS:
            return {
                ...state,
                items: action.customerlist
            };
        case customerConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
/** 
 * Created By:priyanka
 * Created Date:7/6/2019
 * Description:get data of current save and update customer
 **/
export function customer_save_data(state = {}, action) {
    switch (action.type) {
        case customerConstants.INSERT_REQUEST:
            return {
                loading: true
            };
        case customerConstants.INSERT_SUCCESS:
            return {
                ...state,
                items: action.customer
            };
        case customerConstants.INSERT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function customer_update_data(state = {}, action) {
    switch (action.type) {
        case customerConstants.UPDATE_REQUEST:
            return {
                loading: true
            };
        case customerConstants.UPDATE_SUCCESS:
            return {
                ...state,
                items: action.customer
            };
        case customerConstants.UPDATE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function countrylist(state = {}, action) {
    switch (action.type) {
        case customerConstants.GETALL_COUNTRY_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GETALL__COUNTRY_SUCCESS:
            return {
                ...state,
                items: action
            };
        case customerConstants.GETALL_COUNTRY_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function single_cutomer_list(state = {}, action) {
    switch (action.type) {
        case customerConstants.GET_DETAIL_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GET_DETAIL_SUCCESS:
            return {
                ...state,
                items: action.single_cutomer_list
            };
        case customerConstants.GET_DETAIL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function filteredList(state = {}, action) {
    switch (action.type) {
        case customerConstants.GET_FILTER_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GET_FILTER_SUCCESS:
            return {
                ...state,
                items: action.filteredList
            };
        case customerConstants.GET_FILTER_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}


export function store_credit(state = {}, action) {
    switch (action.type) {
        case customerConstants.REMOVE_STORE_CREDIT_REQUEST:
            return {
                loading: true
            };
        case customerConstants.REMOVE_STORE_CREDIT_SUCCESS:
            return {
                ...state,
                items: action.remove_customer
            };
        case customerConstants.REMOVE_STORE_CREDIT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function update_store_credit(state = {}, action) {
    switch (action.type) {
        case customerConstants.UPDATE_STORE_CREDIT_REQUEST:
            return {
                loading: true
            };
        case customerConstants.UPDATE_STORE_CREDIT_SUCCESS:
            return {
                ...state,
                data: action.updatestorecredit
            };
        case customerConstants.UPDATE_STORE_CREDIT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function update_customer_note(state = {}, action) {
    switch (action.type) {
        case customerConstants.UPDATE_CUSTOMER_NOTES_REQUEST:
            return {
                loading: true
            };
        case customerConstants.UPDATE_CUSTOMER_NOTES_SUCCESS:
            return {
                ...state,
                data: action.updatecustomernote
            };
        case customerConstants.UPDATE_CUSTOMER_NOTES_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function customer_events(state = {}, action) {
    switch (action.type) {
        case customerConstants.GET_EVENTS_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GET_EVENTS_SUCCESS:
            return {
                ...state,
                events: action.customer_events
            };
        case customerConstants.GET_EVENTS_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function customer_Delete(state = {}, action) {
    switch (action.type) {
        case customerConstants.DELETE_REQUEST:
            return {
                loading: true
            };
        case customerConstants.DELETE_SUCCESS:
            return {
                ...state,
                events: action.customer
            };
        case customerConstants.DELETE_FAILURE:
            return {
                error: action.error  && action.error !==''? action.error :'An error has occurred',
                loading: false
            };
        default:
            return state
    }
}
