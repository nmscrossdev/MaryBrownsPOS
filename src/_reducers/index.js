import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { activities, single_Order_list, filteredListOrder, mail_success,deleteDuplicateOrder } from '../ActivityPage/reducers/activity.reducer';
import { customerlist, single_cutomer_list, filteredList, customer_save_data, update_store_credit, update_customer_note, customer_events, customer_Delete,customer_update_data } from '../CustomerPage/reducers/customer.reducer';
import { checkoutlist, checkout_list, shop_order, cash_rounding, paymentTypeName, global_payment,online_payment, tick_event, syncTemporder, sale_to_void_status, get_do_sale, shop_orderstatus_update } from '../CheckoutPage/reducers/checkout.reducer';
import{ make_payconiq_payment, check_payconiq_pay_status,cancel_payconiq_payment } from '../CheckoutPage/reducers/payments.reducer'
// import { cash_reportlist } from '../CashReportPage/reducers/cash_report.reducer';
import { settinglist } from '../SettingPage/reducers/setting.reducer';
import { sitelist } from '../SiteLinkPage/reducers/site_link.reducer';
import { registers, registerPermission } from '../LoginRegisterPage/reducers/register.reducer';
import { locations } from '../LoginLocation/reducers/location.reducer';
import { productlist, attributelist, filteredProduct, ticketfield, update_product_DB,productWarehouseQuantity } from './allProduct.reducer';
import { sendEmail } from './sendMail.reducer'
import { cartproductlist, selecteditem, single_product, get_single_inventory_quantity, showSelectedProduct, taxlist, updateTaxRateList, form_ticket_seating, reserved_tikera_seat, booked_seats } from './cartProduct.reducer';
import { favourites, favouritesChildCategoryList, favouritesSubAttributeList, variationProductList, favProductDelete, favouritesProductAdd } from '../ShopView/reducers/favouriteList.reducer';
import { categorylist } from './categoies.reducer';
import { discountlist } from './discount.reducer';
import { refundOrder } from '../RefundPage/reducers/refund.reducer';
import { externalLogin } from '../ExternalLogin/reducers/externalLogin.reducer';
import { taxratelist, get_tax_setting, selectedTaxList, get_tax_rates, multiple_tax_support } from './taxrate.reducer';
import { pinlogin, getversioninfo, createPin } from '../PinPage/reducers/pinlogin.reducer';
import { checkshopstatus } from '../_reducers/checkShopStatus.reducer';
import { getSuccess, saveCustomer } from '../_reducers/saveCustomerInOrder.reducer';
import { cashRecords, cashDetails, open_register, cashSummery, cashDrawerBalance, addPaymentListLog, getCashDrawerPaymentDetail, closeRegister, addRemoveCash, cashRegister } from '../CashManagementPage/reducers/cash_management.reducer'
import { onboardingReducers, GetUserProfile } from '../OliverlLoginPage/reducers/onboarding.reducer';
import { onboardingcall, encriptData, UpdateGoToDemo, CheckShopConnected } from '../onboarding/reducers/onboarding.reducer'
import { updateDemoShopReducer, completeDemoShopReducer } from './demoShop.reducer'
import { firebaseAdmin,getFirebaseRegisters,sendTokenToFirebase } from '../firebase/reducers/firebaseAdmin.reducer'
import{exchnagerate} from '../_reducers/exchangerate.reducer'
import {cloudPrinterList, setOrderTocloudPrinter} from './cloudPrinter.reducer'
import {tipslist} from './tips.reducer'
import {tableRecord} from './groupSale.reducer'
import { productModifier } from './productModifier.reducer';
const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  activities,
  customerlist,
  single_cutomer_list,
  checkoutlist,
  // cash_reportlist,
  settinglist,
  sitelist,
  registers,
  locations,
  productlist,
  attributelist,
  favourites,
  productlist,
  single_Order_list,
  
  filteredList,
  categorylist,
  cartproductlist,
  discountlist,
  filteredListOrder,
  filteredProduct,
  mail_success,
  deleteDuplicateOrder,
  refundOrder,
  taxratelist,
  checkout_list,
  favouritesChildCategoryList,
  favouritesSubAttributeList,
  variationProductList,
  shop_order,
  selecteditem,
  externalLogin,
  pinlogin,
  createPin,
  cash_rounding,
  paymentTypeName,
  global_payment,online_payment,
  sendEmail,
  ticketfield,
  tick_event,
  get_tax_setting,
  single_product,
  get_single_inventory_quantity,
  checkshopstatus,
  showSelectedProduct,
  taxlist,
  selectedTaxList,
  customer_save_data,
  customer_update_data,
  get_tax_rates,
  updateTaxRateList,
  multiple_tax_support,
  sale_to_void_status,
  syncTemporder,
  form_ticket_seating,
  reserved_tikera_seat,
  booked_seats,
  update_product_DB,
  productWarehouseQuantity,
  getSuccess,
  saveCustomer,
  favProductDelete,
  favouritesProductAdd,
  get_do_sale,
  getversioninfo,
  shop_orderstatus_update,
  update_store_credit,
  update_customer_note,
  customer_events,
  customer_Delete,
  registerPermission,
  cashRecords,
  onboardingReducers,GetUserProfile,
  cashDetails, open_register, cashSummery, cashDrawerBalance, addPaymentListLog, closeRegister, addRemoveCash, cashRegister,
  onboardingcall, encriptData, UpdateGoToDemo, CheckShopConnected,
  updateDemoShopReducer, completeDemoShopReducer,
  firebaseAdmin,getFirebaseRegisters,sendTokenToFirebase,
  exchnagerate  ,
  make_payconiq_payment, check_payconiq_pay_status, cancel_payconiq_payment,
  cloudPrinterList, setOrderTocloudPrinter,
  tipslist,
  tableRecord,
  productModifier
});

export default rootReducer;