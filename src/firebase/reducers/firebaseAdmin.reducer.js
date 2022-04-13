import { firebaseAdminConstants } from '../';

export function firebaseAdmin(state = {}, action) {
    switch (action.type) {
        case firebaseAdminConstants.FIREBASE_ADMIN_REQUEST:
            return {
                loading: true
            };
        case firebaseAdminConstants.FIREBASE_ADMIN_SUCCESS:
            return {
                loading: false,
                alert: action.detail
            };
        case firebaseAdminConstants.FIREBASE_ADMIN_FAILURE:
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
export function sendTokenToFirebase(state = {}, action) {
    switch (action.type) {
        case firebaseAdminConstants.SEND_FIREBASE_TOKEN_REQUEST:
            return {
                loading: true
            };
        case firebaseAdminConstants.SEND_FIREBASE_TOKEN_SUCCESS:
            return {              
                sendNotification: action.notificationRes
            };
        case firebaseAdminConstants.SEND_FIREBASE_TOKEN_FAILURE:
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

export function getFirebaseRegisters(state = {}, action) {
    switch (action.type) {
        case firebaseAdminConstants.FIREBASE_ADMIN_REGISTER_REQUEST:
            return {
                loading: true
            };
        case firebaseAdminConstants.FIREBASE_ADMIN_REGISTER_SUCCESS:
            return {
                loading: false,
                usedregisters: action.registers
            };
        case firebaseAdminConstants.FIREBASE_ADMIN_REGISTER_FAILURE:
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
