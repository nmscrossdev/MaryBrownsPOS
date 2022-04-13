import { get_UDid } from '../../ALL_localstorage';
import { store } from '../../_helpers/store'
import { customerActions } from '../../CustomerPage';
import Config from '../../Config'
import { firebaseAdminActions } from '..';
export const getAllCustomer = (notificationData) => {
    var udid = get_UDid('UDID');
    if (notificationData && notificationData.event_title == "Customer Update") {
        if (localStorage.getItem('AdCusDetail')) {
        store.dispatch(firebaseAdminActions.getUpdatedCustomerDetail(notificationData.customer_id, udid))
        }
    }
    store.dispatch(customerActions.getPage(udid, Config.key.CUSTOMER_PAGE_SIZE, 1));

}

export const updateNewCustomerList = {
    getAllCustomer
}


