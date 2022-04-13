import { settingConstants } from '../';

export function settinglist(state = {}, action) {
    switch (action.type) {
        case settingConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case settingConstants.GETALL_SUCCESS:
            return {
                items: action.settinglist
            };
        case settingConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

