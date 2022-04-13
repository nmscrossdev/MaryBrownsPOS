
import { store } from '../../_helpers/store'
import {firebaseAdminActions} from '../action/firebaseAdmin.action'
export const updateQuantity = (productId) => {
    // productId = 76 // test product id data
    store.dispatch(firebaseAdminActions.updateOrderProductDB(productId));
}

export const updatQuantityOnIndexDB = {
    updateQuantity
}



