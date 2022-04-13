import { onboardingConstants as userConstants } from '../constants/onboarding.constants';

export function onboardingcall(state = {}, action) {
    switch (action.type) {
        case userConstants.ONBOARDING_LOGIN_REQUEST:
            return {
                loading: true
            };
            case userConstants.ONBOARDING_LOGIN_SUCCESS:
                return {
                loading: false,
                loginRes: action.loginRes
            };
        case userConstants.ONBOARDING_LOGIN_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function encriptData(state = {}, action) {
    switch (action.type) {
        case userConstants.ENCRIPT_DATA_REQUEST:
            return {
                loading: true
            };
        case userConstants.ENCRIPT_DATA_SUCCESS:
            return {
                encriptedData: action.encriptedData
            };
        case userConstants.ENCRIPT_DATA_SUCCESS:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function CheckShopConnected(state={}, action) {
    switch (action.type) {
        case userConstants.CHECKSHOP_CONNECTED_REQUEST:
            return {
                loading: true
            };
        case userConstants.CHECKSHOP_CONNECTED_SUCCESS:
            return {
                checkShopResponse: action.res
            };
        case userConstants.CHECKSHOP_CONNECTED_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
} 
export function UpdateGoToDemo(state={}, action) {
    switch (action.type) {
        case userConstants.UPDATE_GO_TO_DEMO_REQUEST:
            return {
                loading: true
            };
        case userConstants.UPDATE_GO_TO_DEMO_SUCCESS:
            return {
                response: action.res
            };
        case userConstants.UPDATE_GO_TO_DEMO_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
} 
