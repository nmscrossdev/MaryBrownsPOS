import { get_UDid } from "../ALL_localstorage";
import { customerActions } from "../CustomerPage";
import { store } from "../_helpers";

/**
    * 
    * add extension customer to sale and create on woocommerce 
    */
export const addExtensionCustomer = (data) => {
  try {
    var UID = get_UDid('UDID');
    if (data && data.customerDetail) {
      data.customerDetail['udid'] = UID
      data.customerDetail['WPId'] = ''
      data.customerDetail['StreetAddress'] = data.customerDetail.Address1
      data.customerDetail['StreetAddress2'] = data.customerDetail.Address2
      data.customerDetail['notes'] = data.customerDetail.Notes
      store.dispatch(customerActions.save(data.customerDetail, 'create', null));
    }
  } catch (error) {
    console.error('App Error : ', error);
  }

}
export const updateExtensionCustomer = (data, WPId = '') => {
  try {
    var UID = get_UDid('UDID');
    if (data && data.customerDetail) {
      data.customerDetail['udid'] = UID
      data.customerDetail['WPId'] = WPId
      data.customerDetail['StreetAddress'] = data.customerDetail.Address1
      data.customerDetail['StreetAddress2'] = data.customerDetail.Address2
      data.customerDetail['notes'] = data.customerDetail.Notes
      store.dispatch(customerActions.update(data.customerDetail, 'update'));
      setTimeout(() => {
        hideModal('common_ext_popup')
      }, 1000);
    }
  } catch (error) {
    console.error('App Error : ', error)
  }

}