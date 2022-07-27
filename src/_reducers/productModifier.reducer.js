import { productModifierConstants } from '../_constants';

export function productModifier(state = {}, action) {
    switch (action.type) {
        case productModifierConstants.MODIFIER_GETALL_REQUEST:
            return {
                loading: true
            };
        case productModifierConstants.MODIFIER_GETALL_SUCCESS:
            return {
                modifires: action.response
            };
        case productModifierConstants.MODIFIER_GETALL_FAILURE:
            return { error: action.error}
        default:
            return state
    }
}
