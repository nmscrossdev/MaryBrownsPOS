import { favouriteListConstants } from '../';

export function favourites(state = {}, action) {
    switch (action.type) {

        case favouriteListConstants.FAVOURITE_LIST_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.FAVOURITE_LIST_SUCCESS:
            return {
                items: action.favouriteList
            };
        case favouriteListConstants.FAVOURITE_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function favouritesProductAdd(state = {}, action) {
    switch (action.type) {
        case favouriteListConstants.SAVE_LIST_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.SAVE_LIST_SUCCESS:
            return {
                items: action.favouritesProductAdd
            };
        case favouriteListConstants.SAVE_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function favouritesChildCategoryList(state = {}, action) {
    switch (action.type) {
        case favouriteListConstants.FAVOURITE_CHILD_CATEGORY_LIST_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.FAVOURITE_CHILD_CATEGORY_LIST_SUCCESS:
            return {
                items: action.ChildCategoryList
            };
        case favouriteListConstants.FAVOURITE_CHILD_CATEGORY_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function favouritesSubAttributeList(state = {}, action) {
    switch (action.type) {
        case favouriteListConstants.FAVOURITE_GET_SUBATTRIBUTES_LIST_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.FAVOURITE_GET_SUBATTRIBUTES_LIST_SUCCESS:
            return {
                items: action.SubAttributesList
            };
        case favouriteListConstants.FAVOURITE_GET_SUBATTRIBUTES_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function variationProductList(state = {}, action) {
    switch (action.type) {
        case favouriteListConstants.GET_VARIATION_PRODUCT_LIST_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.GET_VARIATION_PRODUCT_LIST_SUCCESS:
            return {
                items: action.variationProdList
            };
        case favouriteListConstants.GET_VARIATION_PRODUCT_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}

export function favProductDelete(state = {}, action) {
    switch (action.type) {
        case favouriteListConstants.SUBATTRIBUTES_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.SUBATTRIBUTES_SUCCESS:
            return {
                items: action.favProductDelete
            };
        case favouriteListConstants.SUBATTRIBUTES_FAILURE:
            return {
                error: action.error
            };
        case favouriteListConstants.FAVOURITE_PRODUCT_DELETE_REQUEST:
            return {
                loading: true
            };
        case favouriteListConstants.FAVOURITE_PRODUCT_DELETE_SUCCESS:
            return {
                items: action.favProductDelete
            };
        case favouriteListConstants.FAVOURITE_PRODUCT_DELETE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}