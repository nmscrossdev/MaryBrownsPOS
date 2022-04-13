import { pinLoginConstants } from '../';

export function pinlogin(state = {}, action) {
    switch (action.type) {
        case pinLoginConstants.PIN_LOGIN_REQUEST:
            return {
                loading: true
            };
        case pinLoginConstants.PIN_LOGIN_SUCCESS:
            return {
                loading: false,
                alert: action.logindetail
            };
        case pinLoginConstants.PIN_LOGIN_FAILURE:
            return {
                loading: false,
                error: action.error
            };
        default:
            return {
                loading: false,
                state
            }
    }
}

// create pin
export function createPin(state = {}, action) {
    switch (action.type) {
        case pinLoginConstants.CREATE_PIN_REQUEST:
            return {
                loading: true
            };
        case pinLoginConstants.CREATE_PIN_SUCCESS:
            return {
                loading: false,
                alert: action.res
            };
        case pinLoginConstants.CREATE_PIN_FAILURE:
            return {
                loading: false,
                error: action.error
            };
        default:
            return {
                loading: false,
                state
            }
    }
}

export function getversioninfo(state = {}, action) {
     switch (action.type) {
        case pinLoginConstants.GET_VERSION_REQUEST:
            return {
                loading: true
            };
        case pinLoginConstants.GET_VERSION_SUCCESS:
            return {
                items: action.getversioninfo
            };
        case pinLoginConstants.GET_VERSION_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
