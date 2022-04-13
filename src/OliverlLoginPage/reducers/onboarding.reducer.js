import { onboardingConstants } from '../';

export function onboardingReducers(state = {}, action) {
    switch (action.type) {
        case onboardingConstants.OLIVER_LOGIN_REQUEST:
            return {
                loading: true
            };
        case onboardingConstants.OLIVER_LOGIN_SUCCESS:
            return {
                oliverExternalLoginRes: action.oliverExternalLoginRes
            };
        case onboardingConstants.OLIVER_LOGIN_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}
export function GetUserProfile(state = {}, action) {
    switch (action.type) {
        case onboardingConstants.GET_PROFILE_REQUEST:
            return {
                loading: true
            };
        case onboardingConstants.GET_PROFILE_SUCCESS:
            return {
                profileData: action.profileData,
                loading: false
            };
        case onboardingConstants.OLIVER_LOGIN_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}


