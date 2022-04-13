import { registerConstants } from '../';

export function registers(state = {}, action) {
    switch (action.type) {
        case registerConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case registerConstants.GETALL_SUCCESS:
            return {
                registers: action.registers
            };
        case registerConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function register_single_list(state = {}, action) {
    switch (action.type) {
        case registerConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case registerConstants.GETALL_SUCCESS:
            return {
                items: action.register_single_list
            };
        case registerConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function registerPermission(state = {}, action) {
    switch (action.type) {
        case registerConstants.PERMISSION_REQUEST:
            return {
                loading: true
            };
        case registerConstants.PERMISSION_SUCCESS:
            return {
                registerPermission: action.registerPermission
            };
        case registerConstants.PERMISSION_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}