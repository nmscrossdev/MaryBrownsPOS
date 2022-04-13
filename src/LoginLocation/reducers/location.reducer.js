import { locationConstants  } from '../';

export function locations(state = {}, action) {
    switch (action.type) {
        case locationConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case locationConstants.GETALL_SUCCESS:
            return {
                locations: action.locations
            };
        case locationConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

