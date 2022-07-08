import { get_UDid } from "../ALL_localstorage";
import { customerActions } from "../CustomerPage";
import { history, store } from "../_helpers";
import Config from '../Config'
import { PrintAppData } from "../_components/PrintAppData";
import { TriggerCallBack } from '../appManager/FramManager'
import { isMobileOnly, isIOS } from "react-device-detect";
import { activityActions } from "../ActivityPage";
import FetchIndexDB from "../settings/FetchIndexDB";
import { cartProductActions } from "../_actions";
import { checkoutActions } from "../CheckoutPage";
import { changeTaxRate, getTaxAllProduct, PrintPage } from "../_components";
import ActiveUser from '../settings/ActiveUser';
import { serverRequest } from "../CommonServiceRequest/serverRequest";
import { TaxSetting } from "../_components/TaxSetting";
import moment from 'moment';
import {  checkOrderStatus } from '../_components/CommonJS';
var JsBarcode = require('jsbarcode');
var print_bar_code;
export const textToBase64Barcode = (text) => {
  var canvas = document.createElement("canvas");
  JsBarcode(canvas, text, {
    format: "CODE39", displayValue: false, width: 1,
    height: 30,
  });
  print_bar_code = canvas.toDataURL("image/png");
  return print_bar_code;
}
export const handleAppEvent = (value, whereToview, isbackgroudApp = false) => {


  var jsonMsg = value ? value : '';
  var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.command ? jsonMsg.command : '';
  // console.log("whereToview",whereToview)
  // console.log("clientEvent",clientEvent)
  var appResponse = '';
  if (clientEvent && clientEvent !== '') {
    // console.log("clientEvent", jsonMsg)
    //this.setState({ showNewAppExtension:true})
    switch (clientEvent) {
      case "appReady":
        appReady(whereToview, isbackgroudApp, isbackgroudApp)
        break;
      case "DataToReceipt":
        appResponse = DataToReceipt(jsonMsg, whereToview, isbackgroudApp);
        break;
      case "Receipt":
        PrintReceiptWithAppData(jsonMsg, isbackgroudApp)
        break;
      case "CartValue":
        handleCartValue(jsonMsg, isbackgroudApp)
        break;
      case "Cart":
        handleCart(jsonMsg, isbackgroudApp)
        break;

      case "Customers":         //Handle Customer events
        handleCustomer(jsonMsg, isbackgroudApp);
        break;
      case "CustomerDetails":
        sendCustomerDetail(jsonMsg, isbackgroudApp)
        break;
      case "CustomerInSale":
        retrieveCustomerInSale(jsonMsg, isbackgroudApp)
        break;
      case "CustomerToSale":
        CustomerToSale(jsonMsg, isbackgroudApp)
        break;
      case "productDetail":
        productDetail(jsonMsg, isbackgroudApp)
        break
      case "Payment":
        appResponse = payfromApp(jsonMsg, isbackgroudApp)
        break
      case "rawProductData":
        rawProductData(jsonMsg, isbackgroudApp)
        break
      case "cartDiscount":
        appResponse = addCartDiscount(jsonMsg, isbackgroudApp, whereToview)
        break
      case "cartTaxes":
        appResponse = cartTaxes(jsonMsg, isbackgroudApp)
        break
      case "addProductToCart":
        appResponse = addProductToCart(jsonMsg, isbackgroudApp, whereToview)
        break
      case "Notes":
        appResponse = Notes(jsonMsg, isbackgroudApp, whereToview)
        break
      case "Environment":
        Environment(jsonMsg, isbackgroudApp, whereToview)
        break
      case "lockEnvironment":
        appResponse = lockEnvironment(jsonMsg, isbackgroudApp, whereToview)
        break
      case "productPriceUpdate":
        appResponse = productPriceUpdate(jsonMsg, isbackgroudApp, whereToview)
        break
      case "sendProductQuantity":
        appResponse = sendProductQuantity(jsonMsg, isbackgroudApp, whereToview)
        break
      case "CloseExtension":
        CloseExtension();
        break;
      case "ClientInfo":
        appResponse = sendClientsDetails(jsonMsg)
        break
      case "OrderStatus":
        appResponse = getOrderStatus(jsonMsg)
        break
      case "ParkSale":
        appResponse = doParkSale(jsonMsg)
        break
      case "CustomFee":
        appResponse = doCustomFee(jsonMsg)
        break
      case "ReceiptData":
        appResponse = getReceiptData(jsonMsg)
        break
      case "Transaction":
        appResponse = transactionApp(jsonMsg)
        break
      case "TransactionStatus": //same as payment
        appResponse = transactionStatus(jsonMsg, isbackgroudApp)
        break;
      default: // extensionFinished
        var clientJSON = {
          command: jsonMsg.command,
          version: jsonMsg.version,
          method: jsonMsg.method,
          status: 406,
          error: "Invalid Command" //GR[2]
        }
        postmessage(clientJSON)
        console.error('App Error : Extension event does not match ', jsonMsg)
        break;
    }
    return appResponse;
  }
}
export const appReady = (whereToview, isbackgroudApp) => {
  var clientDetails = localStorage.getItem('clientDetail') ?
    JSON.parse(localStorage.getItem('clientDetail')) : 0
  var client_guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : ''

  if (whereToview == 'ActivityView') {
    // var pagesize = Config.key.ACTIVITY_PAGE_SIZE
    // var UID = get_UDid('UDID');
    // var pagno = 0;
    //store.dispatch(activityActions.getOne(UID,pagesize,pagno));
    setTimeout(() => {
      const state = store.getState();
      console.log("state", state)
      if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
        var _OrderId = state.single_Order_list.items.content.order_id;
        var OliverReciptId = state.single_Order_list.items.content.OliverReciptId;
        var _customerId = state.single_Order_list.items.content.customer_id;
        var clientJSON = {
          command: "appReady",
          version: "1.0",
          method: "get",
          status: 200,
          data:
          {
            OrderId: _OrderId,
            WooCommerceId: _customerId,
            clientGUID: client_guid,
            view: whereToview,
            privilege: clientDetails && clientDetails.user_role,
            viewport: isMobileOnly == true ? "Mobile" : "desktop"
          },
          error: null
        }
        postmessage(clientJSON)
      }
    }, 1000);

  } else if (whereToview == 'CheckoutView' || whereToview == 'RefundView') {
    var clientJSON = {
      command: "appReady",
      version: "1.0",
      method: "get",
      status: 200,
      data:
      {
        clientGUID: client_guid,
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly == true ? "Mobile" : "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
  } else if (whereToview == 'CustomerView') {
    //var UID = get_UDid('UDID');
    //store.dispatch(customerActions.getAllEvents(UID));
    setTimeout(() => {
      const state = store.getState();
      console.log("state", state)
      if (state.single_cutomer_list && state.single_cutomer_list.items && state.single_cutomer_list.items.content) {
        var _CustomerId = state.single_cutomer_list.items.content.customerDetails.WPId;
        var clientJSON = {
          command: "appReady",
          version: "1.0",
          method: "get",
          status: 200,
          data:
          {
            CustomerId: _CustomerId,
            clientGUID: client_guid,
            view: whereToview,
            privilege: clientDetails && clientDetails.user_role,
            viewport: isMobileOnly == true ? "Mobile" : "desktop"
          },
          error: null
        }
        postmessage(clientJSON)
      }
    }, 1000);
  } else if (whereToview == 'ProductView') {  // this is not in used. 
    var clientJSON = {
      command: "appReady",
      version: "1.0",
      method: "get",
      status: 200,
      data:
      {
        ProductId: 445667,
        view: whereToview,
        privilege: clientDetails && clientDetails.user_role,
        viewport: isMobileOnly == true ? "Mobile" : "desktop"
      },
      error: null
    }
    postmessage(clientJSON)
    console.log("clientJSON from shopview", clientJSON)
  }

}
export const postmessage = (clientJSON) => {
  //var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
  var iframex = undefined;
  if (document.getElementById("commoniframe")) {
    iframex = document.getElementById("commoniframe").contentWindow;
    if (!iframex)
      iframex = document.getElementById("iframeid").contentWindow;
  } else if (document.getElementById("iframeid")) {
    iframex = document.getElementById("iframeid").contentWindow;
  }

  console.log(iframex)
  if (iframex) {
    iframex.postMessage(JSON.stringify(clientJSON), '*');
  }

}

const validateRequest = (RequestData) => {

  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  var urlReg = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

  var isValidationSuccess = true;
  var clientJSON = {
    command: RequestData.command,
    version: RequestData.version,
    method: RequestData.method,
    status: 406,
  }
  if (RequestData.command == 'Customers' || RequestData.command == 'CustomerDetails') {
    //missing attributes
    if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method == 'put' || RequestData.method == 'delete')) { // main attributes for customer update/delete 
      if (RequestData && !RequestData.email) {
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)" //GR[3]
      }
      else if (RequestData && RequestData.email && (RequestData.email == null || RequestData.email == '')) { // for customer update 
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Value" //GR[6]
      } else if (RequestData && !isNaN(RequestData.email)) { //not a string
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Data Type" //GR[4]
      }
      else if (!(emailReg.test(RequestData.email))) { //invalid Email          
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[5]                     
      }
    } else if (RequestData.method == 'put' || RequestData.method == 'post') { //data validations
      if (RequestData && (!RequestData.data || !RequestData.data.email)) { //missing email arribute to add customer
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute" //GR[1]          
      }
      else if (RequestData && RequestData.data && (RequestData.data.email == null || RequestData.data.email == '')) { // email
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Value" //GR[6]          
      }
      else if (!(emailReg.test(RequestData.data.email))) { //invalid Email          
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value" //GR[4]                     
      }
    }

    return { isValidationSuccess, clientJSON };
  }
  else if (RequestData.command == 'DataToReceipt' || RequestData.command == 'Receipt') {
    if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    } else if (RequestData && !RequestData.url) {
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Attribute(s)" //GR[3]

    } else if (RequestData && !urlReg.test(RequestData.url)) {
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Value" //GR[5]  
    }

  }
  else if (RequestData.command == 'CartValue') { //|| RequestData.command=='Receipt'
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData && RequestData.method && RequestData.method == 'put') {
      if (RequestData.data && RequestData.data.discount && RequestData.data.tender_amt) {
        if (typeof RequestData.data.discount == 'string' || typeof RequestData.data.tender_amt == 'string') {
          isValidationSuccess = false;
          clientJSON['error'] = "Invalid Value" //GR[4]  
        }
      } else {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    }
  }
  else if (RequestData.command == 'Cart') { //|| RequestData.command=='Receipt'
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    // else if (RequestData && (RequestData.method || !RequestData.method=='post')) { //missing attribut/invalid attribute name
    //   isValidationSuccess=false;        
    //   clientJSON['error']= "Invalid Attribute"          
    // }else if (RequestData  && !RequestData.url){ 
    //   isValidationSuccess=false;
    //     clientJSON['error']="Missing Attribute(s)" //GR[3]

    // }else if (RequestData  && !urlReg.test(RequestData.url)){ 
    //   isValidationSuccess=false;
    //   clientJSON['error']=  "Invalid Value" //GR[5]  
    // }      

  }
  else if (RequestData.command == 'productDetail') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'get')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }


  }
  else if (RequestData.command == "CustomerToSale") {
    //missing attributes
    if (RequestData && (!RequestData.command || !RequestData.method)) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"

    }
    else if (RequestData && !RequestData.email) { //missing email
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Attribute(s)"
    }
    else if (!(emailReg.test(RequestData.email))) { //invalid Email
      {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value"

      }
    }
    // else if (notFound) {   // if Customer data not found
    //   clientJSON = {
    //     command: "CustomerToSale",
    //     version:"1.0",
    //     method: "get",
    //     status: 406,
    //     error: 'No customer found in sale'    
    //   }

    // }
  }
  else if (RequestData.command == 'Payment') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'post') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data.payment_type || !RequestData.data.payment_type.name))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData && RequestData.data && !RequestData.data.payment_type.data) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData && !RequestData.data.payment_type.data.amt) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    } else if (RequestData.method == 'get') {
      if (!RequestData.order_id) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Command" //GR[2]
      }
    } else {
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command == 'Transaction') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'post') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data || !RequestData.data.processor || !RequestData.data.amount))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    }
  }
  else if (RequestData.command == 'TransactionStatus') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'put') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data || !RequestData.data.transaction_status))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    }
  }
  else if (RequestData.command == 'rawProductData') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'get')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && (!RequestData.product_id || RequestData.product_id == null))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Value"  //GR[6]          
    }

  }
  else if (RequestData.command == 'cartDiscount') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && RequestData.method == 'get')) {
      //NOTHING
    } else {
      if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
      else if (RequestData && (RequestData.method && (!RequestData.amount_type || !RequestData.amount))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
      }
      else if (RequestData && (RequestData.method && (RequestData.amount_type == null || RequestData.amount == null))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Value"  //GR[5]          
      }
      else if (RequestData && (RequestData.method && isNaN(RequestData.amount))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Data Type"  //GR[4]          
      }
    }


  }
  else if (RequestData.command == 'cartTaxes') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && (!RequestData.tax_name || !RequestData.amount))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
    }
    else if (RequestData && (RequestData.method && (RequestData.tax_name == null || RequestData.amount == null))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Value"  //GR[5]          
    }
    else if (RequestData && (RequestData.method && isNaN(RequestData.amount))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Data Type"  //GR[4]          
    }
    else if (RequestData && parseInt(RequestData.amount) >= 100) {
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Value-amount must be < 100 %"  //GR[5]          
    }
  }
  else if (RequestData.command == 'addProductToCart') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method && (!RequestData.product_id || !RequestData.product_name || !RequestData.quantity || !RequestData.total_price))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Missing Attribute(s)"  //GR[3]          
    }
    else if (RequestData && (RequestData.method && (RequestData.product_id == null || RequestData.total_price == null || RequestData.quantity == null))) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Value"  //GR[5]          
    }
    else if (RequestData && (RequestData.method && isNaN(RequestData.total_price))) {
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Data Type"  //GR[4]          
    }

  }
  else if (RequestData.command == 'productPriceUpdate') {
    if (RequestData && (!RequestData.method || !RequestData.method == 'post')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command == 'Notes') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData.method == 'put' || RequestData.method == 'post') {
      if (RequestData && RequestData && (RequestData.title == null || RequestData.title == '')) {

        isValidationSuccess = false;
        clientJSON['error'] = "Missing attribute" //GR[3] 
      }
      //  else if (RequestData && RequestData && (RequestData.description == null || RequestData.description == '')) {

      //   isValidationSuccess = false;
      //   clientJSON['error'] = "Missing attribute" //GR[3] 
      // }
    }
    else {
      if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Method"
      }
      else if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) { // missing commond and invalid
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Command" //GR[4]
      }
    }
  } else if (RequestData.command == 'lockEnvironment') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    else if (RequestData && (RequestData.method == 'post' || RequestData.method == 'get')) {
      if (RequestData && RequestData && (RequestData.command == null || RequestData.command == '')) {
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Command" //GR[2]
      }
      else if (RequestData && RequestData && RequestData.method == 'post' && (RequestData.state == null || RequestData.state == '')) {
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute - State" //GR[4]
      }
    }
  }
  else if (RequestData.command == 'Environment') {
    if (RequestData && (!RequestData.method || !RequestData.method == 'get')) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command == 'ClientInfo') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command == 'OrderStatus') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  else if (RequestData.command == 'ParkSale') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'get') {
      if (RequestData && (RequestData.method &&
        ( !RequestData.wc_order_no))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Invalid Attribute"
      }
    }
  }
  else if (RequestData.command == 'CustomFee') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
    if (RequestData.method == 'put' || RequestData.method == 'post') {
      if (RequestData && (RequestData.method &&
        (!RequestData.data || !RequestData.data.amount || !RequestData.data.name || !RequestData.data.hasOwnProperty("is_taxable")))) { //missing attribut/invalid attribute name
        isValidationSuccess = false;
        clientJSON['error'] = "Missing Attribute"
      }
    }
  }
  else if (RequestData.command == 'ReceiptData') {
    if (RequestData && !RequestData.method) { //missing attribut/invalid attribute name
      isValidationSuccess = false;
      clientJSON['error'] = "Invalid Attribute"
    }
  }
  

  else {// no command found
    isValidationSuccess = false;
    clientJSON['error'] = "Invalid Value" //GR[5]          
  }
  return { isValidationSuccess, clientJSON };
}

//Print the app data on the exsting receit
export const DataToReceipt = (RequestData, whereToview, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {
    clientJSON = {
      command: RequestData.command,
      version: "1.0",
      method: RequestData.method,
      status: 200,
      error: null
    }

  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {

    // if(isbackgroudApp==true)
    //   TriggerCallBack("product-detail",clientJSON);
    // else
    postmessage(clientJSON)

    if (validationResponse.isValidationSuccess == false)
      return null;
    else return RequestData;
  }

}
//Print new receipt with app data only
export const PrintReceiptWithAppData = (RequestData, whereToview, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {


    clientJSON = {
      command: RequestData.command,
      version: "1.0",
      method: RequestData.method,
      status: 200,
      error: null
    }
    //call print function
    PrintAppData.Print(RequestData);
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    //   TriggerCallBack("product-detail",clientJSON);
    // else
    postmessage(clientJSON)
  }

}

//**** Cart Value handle**************
//send the cart information tp app
export const handleCartValue = (RequestData, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {
    var checklist = JSON.parse(localStorage.getItem("CHECKLIST"));
    var clientDetail = JSON.parse(localStorage.getItem("clientDetail"));
    //var tenderAmt= $('#my-input').val();

    var tenderAmt = checklist && checklist.totalPrice;
    clientJSON = {
      command: RequestData.command,
      version: "1.0",
      method: RequestData.method,
      status: 200,
      error: null,
      data: {
        sub_total: checklist && checklist.subTotal,
        total_tax: checklist && checklist.tax,
        discount: checklist && checklist.discountCalculated,
        balance: checklist && checklist.totalPrice,
        tender_amt: tenderAmt && tenderAmt,
        currency: clientDetail && clientDetail.currency
      }
    }
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    //   if(isbackgroudApp==true)
    //   TriggerCallBack("product-detail",clientJSON);
    // else
    postmessage(clientJSON)
  }

}
export const handleCart = (RequestData, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {
    var checklist = JSON.parse(localStorage.getItem("CHECKLIST"));
    //var clientDetail=JSON.parse(localStorage.getItem("clientDetail"));

    clientJSON = {
      command: RequestData.command,
      version: "1.0",
      method: RequestData.method,
      status: 200,
      error: null,
    }
    if (RequestData.method == 'get') {
      var items = { "items": checklist && checklist.ListItem }
      console.log("items", items.items)
      items && items.items && items.items.map(itm => {
        delete itm.line_item_id;
        delete itm.after_discount;
        delete itm.cart_after_discount;
        delete itm.cart_discount_amount;
        delete itm.product_after_discount;
        delete itm.product_discount_amount;
        delete itm.old_price;
        delete itm.ticket_status;
        delete itm.ticket_info;
        delete itm.product_ticket;
        delete itm.discount_type;
        delete itm.tcForSeating;
        delete itm.Type;
        delete itm.ManagingStock;
      })

      clientJSON['data'] = items;
    }
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    //   TriggerCallBack("product-detail",clientJSON);
    // else
    postmessage(clientJSON)
  }

}

//************ Customer's Apps  handlers*/
export const sendCustomerDetail = (RequestData, isbackgroudApp) => {
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {

    // if(isbackgroudApp==true)
    //   TriggerCallBack("product-detail",validationResponse.clientJSON);
    // else
    postmessage(validationResponse.clientJSON);
  } else {

    var UID = get_UDid('UDID');
    store.dispatch(customerActions.filteredList(UID, Config.key.CUSTOMER_PAGE_SIZE, RequestData.email))
  }

}

export const handleCustomer = (RequestData, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {
    // addExtensionCustomer(RequestData.data);
    var UID = get_UDid('UDID');
    var data = {};
    if (RequestData.data) {
      data['udid'] = UID
      data['WPId'] = ''
      data['FirstName'] = RequestData.data.first_name,
        data['LastName'] = RequestData.data.last_name,
        data['Contact'] = RequestData.data.phone_number,
        data['startAmount'] = 0,
        data['Email'] = RequestData.data.email,
        data['Pincode'] = RequestData.data.postal_code,
        data['City'] = RequestData.data.city,
        data['Country'] = RequestData.data.country,
        data['State'] = RequestData.data.state,
        data['StreetAddress'] = RequestData.data.address_line_one
      data['StreetAddress2'] = RequestData.data.address_line_two
      data['notes'] = RequestData.data.notes
    }
    if (RequestData.method == "post") {
      store.dispatch(customerActions.save(data, 'create'));
    } else if (RequestData.method == "put") {
      store.dispatch(customerActions.update(data, 'update'));
    } else if (RequestData.method == "delete") {
      var Cust_ID = RequestData.email;
      store.dispatch(customerActions.Delete(Cust_ID, UID));
    }


  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    // TriggerCallBack("product-detail",clientJSON);
    // else
    postmessage(clientJSON)
  }


  // var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
  // var _user = JSON.parse(localStorage.getItem("user"));
  // iframex.postMessage(JSON.stringify(clientJSON), '*');
}

export const CustomerToSale = (RequestData, isbackgroudApp) => {
  var clientJSON = ""
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {

    var UID = get_UDid('UDID');
    var data = {};
    if (RequestData.email) {
      data['udid'] = UID
      data['WPId'] = ''
      // data['FirstName']= RequestData.data.first_name &&  RequestData.data.first_name
      // data['LastName']= RequestData.data.last_name && RequestData.data.last_name
      // data['Contact']=  RequestData.data.phone_number && RequestData.data.phone_number
      // data['startAmount']= 0
      data['Email'] = RequestData.email
      // data['Pincode']= RequestData.data.postal_code && RequestData.data.postal_code
      // data['City']= RequestData.data.city && RequestData.data.city
      // data['Country']= RequestData.data.country && RequestData.data.country
      // data['State']= RequestData.data.state && RequestData.data.state     
      // data['StreetAddress'] =RequestData.data.address_line_one && RequestData.data.address_line_one
      // data['StreetAddress2'] = RequestData.data.address_line_two && RequestData.data.address_line_two
      // data['notes'] = RequestData.data.notes && RequestData.data.notes
    }
    if (RequestData.method == "post") {
      var url = '/checkout';
      sessionStorage.setItem("backurl", url);
      // window.location = '/customerview'
      sessionStorage.setItem("handleApps", true);
      store.dispatch(customerActions.save(data, 'create'));
    }

  }

}
export const retrieveCustomerInSale = (RequestData, isbackgroudApp) => {
  var checkoutList = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'));

  var clientJSON = ""
  var notFound = false;
  //missing attributes
  if (checkoutList && (!checkoutList.customerDetail || !checkoutList.customerDetail.content)) {   // if Customer data not found
    clientJSON = {
      command: "CustomerInSale",
      version: "1.0",
      method: "get",
      status: 406,
      error: 'No customer found in sale'
    }

  }
  else {
    var customer = checkoutList.customerDetail.content;
    var address = customer && customer.customerAddress && customer.customerAddress.find(i => (i.TypeName == "billing"))
    //var address= customerAddress && customerAddress.length && customerAddress.length>0 && customerAddress[0]
    clientJSON = {
      command: "CustomerInSale",
      version: "1.0",
      method: "get",
      status: 200,
      data: {
        first_name: customer.FirstName,
        last_name: customer.LastName,
        email: customer.Email,
        address_line_one: address && address.Address1,
        address_line_two: address && address.Address2,
        country: address && address.Country,
        state: address && address.State,
        city: address && address.City,
        postal_code: address && address.PostCode,
        notes: customer.null
      },
      error: null
    }
  }
  // const { single_cutomer_list } = this.props
  if (clientJSON !== "") {
    // if(isbackgroudApp==true)
    // TriggerCallBack("product-detail",clientJSON);
    // else
    postmessage(clientJSON)
  }


}
//** End Customer Handler */


// *** Product Detail ***************
export const productDetail = (RequestData, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  else {
    var selectedProduct = JSON.parse(localStorage.getItem("productSelected"));
    if (selectedProduct) {
      var ProductMetaJson = ({
        "MetaData": JSON.parse(selectedProduct.ProductMetaJson),
        "Price": selectedProduct.Price,
        "addons_meta_data": selectedProduct.addons_meta_data ? selectedProduct.addons_meta_data : ""
      });
      //addons_meta_data : for sending wocommerce to show selected attribute when edit the product from cart

      console.log("ProductMetas", ProductMetaJson);
      clientJSON = {
        command: RequestData.command,
        version: "1.0",
        method: RequestData.method,
        status: 200,
        error: null,
        data: ProductMetaJson
      }

    }
    // const { single_cutomer_list } = this.props
    if (clientJSON !== "") {
      // if(isbackgroudApp==true)
      // TriggerCallBack("product-detail",clientJSON);
      // else
      postmessage(clientJSON)

    }
  }

}
// *** Payment Detail ***************
export const payfromApp = (RequestData, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
    if (RequestData.method == 'post')  //for payment through APP
    {
      return 'app_do_payment'   //on checkout we check this value and process according
    }
    else if (RequestData.method == 'get') {
      var UID = get_UDid('UDID');
      store.dispatch(activityActions.getDetail(RequestData.order_id, UID));
      setTimeout(() => {
        const state = store.getState();
        console.log("state", state)
        if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
          var _order = state.single_Order_list && state.single_Order_list.items.content;
          clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status: 200,
            error: null,
            total_amount: _order.total_amount,
            //data: JSON.stringify(order_payments)
            payments: _order.order_payments ? _order.order_payments : []
          }

          postmessage(clientJSON);
        }
      }, 1000);

    }

  }
}

export const rawProductData = (RequestData, isbackgroudApp) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
    var idbKeyval = FetchIndexDB.fetchIndexDb();
    idbKeyval.get('ProductList').then(val => {
      if (!val || val.length == 0 || val == null || val == "") {
        //do nothing

      }
      else {
        var item = val.find(item => (item.WPID == RequestData.product_id))
        console.log("item", item)
        clientJSON = {
          command: RequestData.command,
          version: "1.0",
          method: RequestData.method,
        }
        if (!item) {
          clientJSON['status'] = 406;
          clientJSON['error'] = 'No data found'

        } else {
          clientJSON['status'] = 200;
          clientJSON['error'] = null;
          clientJSON['data'] = JSON.stringify(item);
        }
        postmessage(clientJSON)

      }
    });

  }
}

export const addCartDiscount = (RequestData, isbackgroudApp, whereToview) => {
  if (whereToview !== 'CheckoutView') {
    return;
  }
  var clientJSON = ""
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    return postmessage(clientJSON)
  }
  if (RequestData.method == 'get') {

    clientJSON = {
      command: RequestData.command,
      version: "1.0",
      method: RequestData.method,
      status_code: 200,
      error: null
    }
    const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';

    if (CartDiscountAmount && CartDiscountAmount !== "") {
      clientJSON['discount_name'] = "";
      clientJSON['amount'] = CartDiscountAmount.discount_amount;
      if (CartDiscountAmount.discountType.toLowerCase() == "number" || CartDiscountAmount.discountType.toLowerCase() == "$") {
        clientJSON['amount_type'] = "$";
      } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" || CartDiscountAmount.discountType.toLowerCase() == "%") {
        clientJSON['amount_type'] = "%";
      }

    } else {
      clientJSON['status_code'] = 406,
        clientJSON['error'] = 'No discount applied'
    }
    postmessage(clientJSON)
  }
  else {
    try {
      var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
      const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
      const CartDiscountAmount = localStorage.getItem("CART") ? JSON.parse(localStorage.getItem("CART")) : '';
      var subTotal = checkList && checkList.subTotal;
      var previousCartDiscount = 0;
      var product_after_discount = 0;
      var totalPrice = 0;
      var discount_amount = 0;
      var status = false;
      var discount_type = RequestData && RequestData.amount_type && RequestData.amount_type == '%' ? 'percent' : RequestData.amount_type == '$' ? 'number' : 'number';
      cartproductlist && cartproductlist.map((item, index) => {
        product_after_discount += parseFloat(item.product_discount_amount);
        if (item.product_id) {//donothing
          totalPrice += item.Price
        }
      })

      if (CartDiscountAmount) {
        if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "percent") {
          previousCartDiscount = percentage(CartDiscountAmount.discount_amount, totalPrice - product_after_discount)
        } else if (CartDiscountAmount.discountType.toLowerCase() == "percentage" && discount_type == "number") {
          previousCartDiscount = number(CartDiscountAmount.discount_amount, subTotal - product_after_discount)
        } else if (CartDiscountAmount.discountType.toLowerCase() == "number" && discount_type == "number") {
          previousCartDiscount = CartDiscountAmount.discount_amount;
        } else {
          previousCartDiscount = CartDiscountAmount.discount_amount;
        }
      }
      discount_amount = RequestData && RequestData.amount ? parseFloat(RequestData.amount) + parseFloat(previousCartDiscount) : 0;
      if (discount_type == "percent") {
        if (discount_amount > 100) {
          status = true
          setTimeout(function () {
            showModal('no_discount');
          }, 100)
        }
      }
      if (discount_type == "number") {
        if (discount_amount > totalPrice) {
          status = true
          setTimeout(function () {
            showModal('no_discount');
          }, 100)
        }
      }

      if (status == false) {
        var cart = {
          type: 'card',
          discountType: RequestData && RequestData.amount_type ? RequestData.amount_type == "%" ? "Percentage" : "Number" : "Number",
          discount_amount: parseFloat(RequestData.amount) + parseFloat(previousCartDiscount),
          Tax_rate: 0
        }

        localStorage.setItem("CART", JSON.stringify(cart))
        store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
        setTimeout(() => {
          var _price = 0;
          var _tax = 0;
          var _discount = 0;
          var _incltax = 0;
          var _excltax = 0;
          var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
          checkList.ListItem = cartproductlist;
          checkList.ListItem.map(items => {
            if (items.Price) {
              _price += parseFloat(items.Price);
              _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
              _discount += parseFloat(items.discount_amount);
              _incltax += parseFloat(items.incl_tax);
              _excltax += parseFloat(items.excl_tax)
            }
          })

          const CheckoutList = {
            ListItem: checkList.ListItem,
            customerDetail: checkList.customerDetail,
            totalPrice: (_price + _excltax) - _discount,
            discountCalculated: _discount,
            tax: _tax,
            subTotal: _price - _discount,
            TaxId: checkList.TaxId,
            order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
            showTaxStaus: checkList.showTaxStaus,
            _wc_points_redeemed: checkList._wc_points_redeemed,
            _wc_amount_redeemed: checkList._wc_amount_redeemed,
            _wc_points_logged_redemption: checkList._wc_points_logged_redemption
          }
          localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
          store.dispatch(checkoutActions.getAll(CheckoutList));
          clientJSON = {
            command: RequestData.command,
            version: "1.0",
            method: RequestData.method,
            status_code: 200,
            error: null
          }
          postmessage(clientJSON)

        }, 500);

        return "app-modificaiton-external"


      }
    } catch (error) {
      console.error('App Error : ', error);
    }
  }

}

export const cartTaxes = (RequestData, isbackgroudApp) => {
  var clientJSON = ""
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    return postmessage(clientJSON)
  }

  // $('div .dropup').addClass('open');
  // var taxRateList = this.state.taxRateList && this.state.taxRateList.length > 0 ? this.state.taxRateList : [];
  var taxRateList = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : []
  var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;

  var _newtaxRate = {
    check_is: true,
    TaxRate: RequestData.amount,
    TaxName: RequestData.tax_name,
    TaxId: '',
    Country: '',
    State: '',
    TaxClass: ''
  }
  if (taxRateList.length == 0) {
    taxRateList.push(_newtaxRate)
  } else {
    var FindId = taxRateList.find(isName => isName.TaxName === RequestData.tax_name);
    if (FindId) {
      taxRateList.map(item => {
        if (item.TaxId == FindId.TaxId) {
          item['check_is'] = true; //FindId.check_is == true ? false : true
        }
      })
    } else {
      taxRateList.push(_newtaxRate)
    }
  }

  var updateTaxCarproduct = changeTaxRate(taxRateList, 1);
  store.dispatch(cartProductActions.updateTaxRateList(taxRateList));
  store.dispatch(cartProductActions.addtoCartProduct(updateTaxCarproduct));
  console.log("TAXT_RATE_LIST", localStorage.getItem("TAXT_RATE_LIST"))
  setTimeout(() => {
    var _price = 0;
    var _tax = 0;
    var _discount = 0;
    var _incltax = 0;
    var _excltax = 0;
    //var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    checkList.ListItem = updateTaxCarproduct;
    checkList.ListItem.map(items => {
      if (items.Price) {
        _price += parseFloat(items.Price);
        _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
        _discount += parseFloat(items.discount_amount);
        _incltax += parseFloat(items.incl_tax);
        _excltax += parseFloat(items.excl_tax)
      }
    })
    const CheckoutList = {
      ListItem: checkList.ListItem,
      customerDetail: checkList.customerDetail,
      totalPrice: (_price + _excltax) - _discount,
      discountCalculated: _discount,
      tax: _tax,
      subTotal: _price - _discount,
      TaxId: checkList.TaxId,
      order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
      showTaxStaus: checkList.showTaxStaus,
      _wc_points_redeemed: checkList._wc_points_redeemed,
      _wc_amount_redeemed: checkList._wc_amount_redeemed,
      _wc_points_logged_redemption: checkList._wc_points_logged_redemption
    }
    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
    store.dispatch(checkoutActions.getAll(CheckoutList));
    clientJSON = {
      command: RequestData.command,
      version: "1.0",
      method: RequestData.method,
      status_code: 200,
      error: null
    }
    postmessage(clientJSON)

  }, 500);
  return "app-modificaiton-external"
}

export const addProductToCart = (RequestData, isbackgroudApp, whereToview) => {

  if (whereToview !== 'CheckoutView') {
    return;
  }
  var clientJSON = ""
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    return postmessage(clientJSON)
  }


  //check the requested product exist into the index DB 
  var item;

  var idbKeyval = FetchIndexDB.fetchIndexDb();

  idbKeyval.get('ProductList').then(val => {

    if (!val || val.length == 0 || val == null || val == "") {
      //do nothing

    }
    else {
      var itemarry = val.filter(item => (item.WPID == RequestData.product_id))
      console.log("item", itemarry)
      if (itemarry && itemarry.length > 0) {
        itemarry = getTaxAllProduct(itemarry);
        item = itemarry[0];
      }
    }
  });
  setTimeout(() => {

    if (item) {
      const cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
      //
      item["product_id"] = item.WPID
      item["quantity"] = RequestData.quantity;
      item["Price"] = item.Price * RequestData.quantity;
      cartproductlist.push(item)

      store.dispatch(cartProductActions.addtoCartProduct(cartproductlist));

      //checkList.ListItem= cartproductlist ;


      setTimeout(() => {
        var _price = 0;
        var _tax = 0;
        var _discount = 0;
        var _incltax = 0;
        var _excltax = 0;
        var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
        var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        checkList.ListItem = cartproductlist;
        checkList.ListItem.map(items => {
          if (items.Price) {
            _price += parseFloat(items.Price);
            _tax += parseFloat(items.excl_tax) + parseFloat(items.incl_tax);
            _discount += parseFloat(items.discount_amount);
            _incltax += parseFloat(items.incl_tax);
            _excltax += parseFloat(items.excl_tax)
          }
        })

        const CheckoutList = {
          ListItem: checkList.ListItem,
          customerDetail: checkList.customerDetail,
          totalPrice: (_price + _excltax) - _discount,
          discountCalculated: _discount,
          tax: _tax,
          subTotal: _price - _discount,
          TaxId: checkList.TaxId,
          order_id: checkList.order_id !== 0 ? checkList.order_id : 0,
          showTaxStaus: checkList.showTaxStaus,
          _wc_points_redeemed: checkList._wc_points_redeemed,
          _wc_amount_redeemed: checkList._wc_amount_redeemed,
          _wc_points_logged_redemption: checkList._wc_points_logged_redemption
        }
        localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
        store.dispatch(checkoutActions.getAll(CheckoutList));
      }, 700);


      clientJSON = {
        command: RequestData.command,
        version: "1.0",
        method: RequestData.method,
        status_code: 200,
        error: null
      }
      postmessage(clientJSON)

    } else {
      clientJSON = {
        command: RequestData.command,
        version: "1.0",
        method: RequestData.method,
        status_code: 406,
        error: 'Product not exist!'
      }
      postmessage(clientJSON)
    }
  }, 100);


  return "app-modificaiton-external"
}

export const Notes = (RequestData, isbackgroudApp, whereToview) => {
  var clientJSON = ""
  // if(whereToview !=='CheckoutView'){
  //   return;
  // }
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  } else if (RequestData.method == 'post') {
    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      note_id: RequestData.note_id
    }

    var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
    cartlist.push({ "Title": RequestData.title + (RequestData.description ? ":" + RequestData.description : "") })

    store.dispatch(cartProductActions.addtoCartProduct(cartlist));
    var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
    if (list != null) {
      // const CheckoutList = {
      //   ListItem: cartlist,
      // }
      list.ListItem = cartlist
      localStorage.setItem('CHECKLIST', JSON.stringify(list))

      setTimeout(() => {
        store.dispatch(checkoutActions.getAll(list));

      }, 500)
    }
    postmessage(clientJSON)
    return "app-modificaiton-external"
  }
}
export const Environment = (RequestData, isbackgroudApp, whereToview) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  } else {

    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      error: null,
      note_id: RequestData.note_id
    }

    var registerId = localStorage.getItem('register') ? localStorage.getItem('register') : null;
    var registerName = localStorage.getItem('registerName') ? localStorage.getItem('registerName') : null;
    var locationId = localStorage.getItem('Location') ? localStorage.getItem('Location') : null;
    var LocationName = localStorage.getItem('LocationName') ? localStorage.getItem('LocationName') : null;

    var clientDetails = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : null;
    var pdf_format = localStorage.getItem("pdf_format") ? JSON.parse(localStorage.getItem("pdf_format")) : null;
    clientJSON['Print_size'] = pdf_format && pdf_format.length > 0 && pdf_format[0].recipt_format_value;
    clientJSON['register_id'] = registerId;
    clientJSON['location_data'] = { location_id: locationId, outlet: LocationName }
    clientJSON['employee_data'] = {
      admin_id: clientDetails && clientDetails.user_id,
      designation: clientDetails && clientDetails.user_role
    }
  }
  postmessage(clientJSON)

}
export const lockEnvironment = (RequestData, isbackgroudApp, whereToview) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  } else {

    clientJSON = {
      command: RequestData.command,
      method: RequestData.method,
      version: "1.0",
      status_code: 200,
      error: null
    }


  }

  if (RequestData.method == 'get') {
    return "app-get-lock-env"
  }
  else {
    postmessage(clientJSON);
    if (RequestData.state == 'lock')
      return "app-modificaiton-lock-env"
    else
      return "app-modificaiton-unlock-env"

  }
}
export const productPriceUpdate = (RequestData, isbackgroudApp, whereToview) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
  }
  if (RequestData.method == 'post') {
    return "product_price_update"
  }

}
export const sendProductQuantity = (RequestData, isbackgroudApp, whereToview) => {
  var clientJSON = ""

  // var validationResponse = validateRequest(RequestData)
  // if (validationResponse.isValidationSuccess == false) {
  //   clientJSON = validationResponse.clientJSON;
  // }
  // if(RequestData.method=='post'){
  //    return "product_price_update" 
  // }     
  clientJSON = {
    command: RequestData.command,
    method: RequestData.method,
    version: "1.0",
    status_code: 200,
    quantity: RequestData.quantity
  }
  postmessage(clientJSON);
}

export const percentage = (num, per) => {
  return (parseFloat(num) / 100) * parseFloat(per);
}

export const number = (num, per) => {
  return parseFloat(num) * 100 / parseFloat(per);
}



export const postClientExtensionResponse = (method, isSuccess, message, command = "Customers", data = "") => {
  var _method = command == "CustomerDetails" ? 'get' :
    method == 'save' ? 'post' :
      method == 'update' ? 'put' :
        method == 'delete' ? 'delete' : 'get'

  var clientJSON = {
    command: command,
    version: "1.0",
    method: _method,
    status: isSuccess == true ? 200 : 406,
    error: isSuccess == true ? null : message
  }
  if (isSuccess == true && data !== "") {
    clientJSON['data'] = data
  }
  postmessage(clientJSON);

}
//export const checkStoreValue()

// Product Detail end****************
export const CloseExtension = () => {
  hideModal('common_ext_popup');
}

//app 2.0 implementation------
// *** Payment Detail ***************
export const transactionApp = (RequestData) => {
  var clientJSON = ""

  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
    if (RequestData.method == 'post')  //for payment through APP
    {
      return 'app_do_transaction'   //on checkoutview, we check this value and process according      
    }
    else if (RequestData.method == 'get') {
      var UID = get_UDid('UDID');

      const state = store.getState();

      var refundPayments = null;

      var orderPayments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : null;
      if (orderPayments == null) {
        if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
          orderPayments = state.single_Order_list.items.content.order_payments;
          if (state.single_Order_list.items.content.order_Refund_payments) {
            refundPayments = state.single_Order_list.items.content.order_Refund_payments;
          }

        }
      }

      if (orderPayments) {
        var _totalAmount = 0;
        var _payments = []
        // All sale payments ---------------------
        orderPayments && orderPayments.map(payment => {

          var obj = {
            "processor": payment.type ? payment.type : payment.payment_type,
            "amount": payment.amount ? payment.amount : payment.payment_amount,
            "transaction_id": payment.transaction_id,
            "emv_data": payment.emv_data,
            "transaction_type": "sale"
          }

          _payments.push(obj);
        })
        // // All refund payments ---------------------
        refundPayments && refundPayments.length > 0 && refundPayments.map(payment => {

          var obj = {
            "processor": payment.type ? payment.type : payment.payment_type,
            "amount": payment.amount ? payment.amount : payment.payment_amount,
            "transaction_id": payment.transaction_id,
            "emv_data": payment.emv_data,
            "transaction_type": "refund"
          }
          _payments.push(obj);
        })
        //if request has processor then remove other payment except the processor
        if (RequestData.processor && RequestData.processor !== "") {
          _payments = _payments.filter(p => p.processor == RequestData.processor)
        }
        //if request has transaction_type then remove other payment except the transaction_type
        if (RequestData.transaction_type && RequestData.transaction_type !== "") {
          _payments = _payments.filter(p => p.transaction_type == RequestData.transaction_type)
        }

        if (_payments) {
          _payments && _payments.map(p => {
            _totalAmount += p.amount;
          })
        }
        clientJSON = {
          command: RequestData.command,
          version: "2.0",
          method: RequestData.method,
          status: 200,
          error: null,
          data: {
            total_amount: _totalAmount,
            payments: _payments ? _payments : []
          }
        }

        postmessage(clientJSON);
      }
      // }, 1000);

    }

  }
}
export const transactionStatus = (RequestData, isbackgroudApp) => {
  var clientJSON = ""
      clientJSON= {
        command: RequestData.command,
        version:"2.0",
        method: RequestData.method,
        status: 200,
      }
    var validationResponse= validateRequest(RequestData) 

    if(validationResponse.isValidationSuccess==false){
          clientJSON=validationResponse.clientJSON;
          postmessage(clientJSON) 
    }  
    else{
    var tempOrdrId = localStorage.getItem("tempOrder_Id") ? JSON.parse(localStorage.getItem("tempOrder_Id")) : null;
    const { Email } = ActiveUser.key;
    var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
      var filteredOrder = null;
      if (TempOrders && TempOrders.length > 0) {
        filteredOrder = TempOrders && TempOrders.filter(tOrder => tOrder.TempOrderID == tempOrdrId)
      }
      clientJSON = {
        command: RequestData.command,
        version: "2.0",
        method: RequestData.method,
        status: 200,
      }
      if(RequestData.method=='get'){   
        var transStatus=localStorage.getItem("CurrentTransactionStatus")? JSON.parse(localStorage.getItem("CurrentTransactionStatus")) :"";
        
        if(transStatus){
          clientJSON['data']={transaction_status: transStatus.status}
        }
        else
        {
          clientJSON['error']=="no transaction found"
        }
      }
      else if (RequestData.method == 'put') {
        if(RequestData.data && (RequestData.data.transaction_status=="cancel" || RequestData.data.transaction_status=="cancelled")) {
          return 'app_cancle_transaction' 
         }
        //  else if(RequestData.data && RequestData.data.transaction_status=="cancel") {
        //   return 'app_cancle_transaction' 
        //  }
        //  else if(RequestData.data && RequestData.data.transaction_status=="cancel") {
        //   return 'app_cancle_transaction' 
        //  }
        // var _orderID = tempOrdrId;
        // if (filteredOrder && filteredOrder.length > 0 && filteredOrder[0].OrderID !== 0) {
        //   _orderID = filteredOrder[0].OrderID;
        // }

        // //setTimeout(() => {
        // if (tempOrdrId && tempOrdrId !== '' && tempOrdrId > 0) {
        //   var option = { "udid": get_UDid('UDID'), "orderId": _orderID, "status": RequestData.data.transaction_status }
        //   store.dispatch(checkoutActions.updateOrderStatus(option));
        // }
        // // }, 500);
        // clientJSON['data'] = { transaction_status: RequestData.data.transaction_status }
        
      }
      postmessage(clientJSON);
    }
  }
}

export const sendClientsDetails = (RequestData) => {
  var clientJSON = {};
  var validationResponse = validateRequest(RequestData)
  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
  var clientDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : 0
  var guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : '';
  var account_type = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.subscription_name : '';
  var store_url = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.url : '';
  var business_name = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.company_name : '';
  var account_monthly_price = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.MonthlyPrice : ''
  var email = clientDetails && clientDetails.user_email ? clientDetails.user_email : ''
  var currency = clientDetails && clientDetails.currency ? clientDetails.currency : '';
  var account_creation_date = clientDetails && clientDetails.register_unix_date ? clientDetails.register_unix_date : '';

  clientJSON =
  {
    oliverpos:
    {
      command: RequestData.command,
      method: RequestData.method,
      version: "2.0",
      status: 200,
    },
    data:
    {
      guid: guid,
      account_creation_date: account_creation_date,
      account_type: account_type,
      account_monthly_price: account_monthly_price,
      store_url: store_url,
      email: email,
      currency: currency,
      business_name: business_name
    }
  };
  postmessage(clientJSON);
}
}

// export const getOrderStatus=(RequestData)=>{
//   var clientJSON ={};

//       var UID = get_UDid('UDID');
//       store.dispatch(activityActions.getDetail(529, UID));     
//       setTimeout(() => {
//          const state = store.getState();
//          if(state.single_Order_list &&  state.single_Order_list.items  && state.single_Order_list.items.content){
//            var _order=state.single_Order_list && state.single_Order_list.items.content;
//           clientJSON= {
//             oliverpos:
//             {
//               command: RequestData.command,
//               method: RequestData.method,
//               version: "2.0",
//               status: 200,
//             },
//             data:
//             {
//               wc_status: _order.order_status,
//               wc_order_id:_order.order_id,
//               oliver_order_id:_order.OliverReciptId
//             }
//             }
//             postmessage(clientJSON) ;
//          }
//       }, 2000);
// }
export const getOrderStatus = (RequestData) => {
  var clientJSON = {};
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
    var tempOrdrId = localStorage.getItem('tempOrder_Id') && localStorage.getItem('tempOrder_Id') !== undefined ? JSON.parse(localStorage.getItem("tempOrder_Id")) : null;


    const { Email } = ActiveUser.key;
    var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
      var filteredOrder = null;
      if (TempOrders && TempOrders.length > 0) {
        filteredOrder = TempOrders && TempOrders.filter(tOrder => tOrder.TempOrderID == tempOrdrId)
      }
    }
    if (RequestData.method == 'get') {
      clientJSON = {
        command: RequestData.command,
        version: "2.0",
        method: RequestData.method,
        status: 200,
      }

      if (filteredOrder && filteredOrder.length > 0) {
        clientJSON['data'] = {
          wc_status: filteredOrder && filteredOrder[0].order_status,
          wc_order_no: filteredOrder && filteredOrder[0].OrderID,
          oliver_order_id: filteredOrder && filteredOrder[0].TempOrderID

        }
      } else {
        const state = store.getState();
        if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
          var _order = state.single_Order_list.items.content
          if (_order) {
            clientJSON['data'] = {
              wc_status: _order.order_status,
              wc_order_no: _order.order_id,
              oliver_order_id: _order.OliverReciptId
            }
          }


        }
      }
    }
    else {
      clientJSON['error'] == "no transaction found"
    }
    postmessage(clientJSON);
  }

}
export const doParkSale = (RequestData) => {
  var clientJSON = {};
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
    if (RequestData.method == "get" && RequestData.wc_order_no) {
      var productList = []
      var idbKeyval = FetchIndexDB.fetchIndexDb();
      idbKeyval.get('ProductList').then(val => {
        if (!val || val.length == 0 || val == null || val == "") {
        } else { productList = val; }
      });
      //var wc_order_no= RequestData.wc_order_no;
      var UID = get_UDid('UDID');
      store.dispatch(activityActions.getDetail(RequestData.wc_order_no, UID));
      var single_Order_list = {};
      //setTimeout(() => {
      const myInterval = setInterval(() => {
        const state = store.getState();
        if (state.single_Order_list && state.single_Order_list.items && state.single_Order_list.items.content) {
          single_Order_list = state.single_Order_list && state.single_Order_list.items.content;

          localStorage.removeItem("oliver_order_payments"); //remove existing payments   
          // sessionStorage.getItem("OrderDetail") for mobile view.............
          //var single_Order_list = sessionStorage.getItem("OrderDetail") && sessionStorage.getItem("OrderDetail") !== undefined ? JSON.parse(sessionStorage.getItem("OrderDetail")) : this.props.single_Order_list.content;
          var addcust;
          var typeOfTax = TaxSetting.typeOfTax()
          var setOrderPaymentsToLocalStorage = new Array();
          if (typeof single_Order_list.order_payments !== 'undefined') {
            single_Order_list.order_payments.map(pay => {
              var _payDetail = {
                "Id": pay.Id,
                "payment_type": pay.type,
                "payment_amount": pay.amount,
                "order_id": single_Order_list.order_id,
                "type": pay.type,
                "transection_id": pay.transection_id
              }
              if (pay.payment_date && pay.payment_date != "") {
                _payDetail["payment_date"] = pay.payment_date;
              }
              setOrderPaymentsToLocalStorage.push(_payDetail);

            })
          }
          localStorage.setItem("oliver_order_payments", JSON.stringify(setOrderPaymentsToLocalStorage))
          localStorage.setItem("VOID_SALE", "void_sale");
          var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') && localStorage.getItem('APPLY_DEFAULT_TAX') !== undefined ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
          var ListItem = new Array();
          var taxIds = null;
          if (single_Order_list.line_items !== null && single_Order_list.line_items[0] && single_Order_list.line_items[0].Taxes !== null && single_Order_list.line_items[0].Taxes !== 'undefined' && single_Order_list.line_items.length > 0) {
            taxIds = single_Order_list.line_items && single_Order_list.line_items[0].Taxes;
          }
          var taxArray = taxIds && taxIds !== undefined ? JSON.parse(taxIds).total : null;
          var Taxes = taxArray ? Object.entries(taxArray).map(item => ({ [item[0]]: item[1] })) : deafult_tax;
          // console.log("taxIds", taxIds)
          // console.log("Taxes", Taxes)
          single_Order_list.line_items.map(item => {
            //productList from mobile view
            var _productList = productList && productList.length > 0 ? productList : this.state.productList;
            var productData = _productList.find(prdID => prdID.WPID == item.product_id && (item.bundled_parent_key == '' || item.bundled_parent_key == null));
            var SingleOrderMetaData = single_Order_list && single_Order_list.meta_datas && single_Order_list.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount')
            SingleOrderMetaData = SingleOrderMetaData ? SingleOrderMetaData.ItemValue : []
            var productDiscountData = SingleOrderMetaData && SingleOrderMetaData !== undefined ? SingleOrderMetaData.length > 0 && JSON.parse(SingleOrderMetaData) : []
            var orderMetaData = productDiscountData && productDiscountData != [] && productDiscountData.find(metaData => metaData.variation_id ? metaData.variation_id == item.product_id : metaData.product_id == item.product_id);
            if (orderMetaData && orderMetaData.discountCart) {
              var cart = {
                type: 'card',
                discountType: (orderMetaData.discountCart.discountType == '%' || orderMetaData.discountCart.discountType == "Percentage") ? "Percentage" : "Number",
                discount_amount: orderMetaData.discountCart.discount_amount,
                Tax_rate: orderMetaData.discountCart.Tax_rate
              }
              localStorage.setItem("CART", JSON.stringify(cart))
            }
            if (productData || orderMetaData) {
              ListItem.push({
                Price: orderMetaData && orderMetaData.Price ? orderMetaData.Price : item.subtotal,
                // Price: item.subtotal,
                // Title: item.name,
                Title: orderMetaData ? orderMetaData.Title : item.name,
                Sku: orderMetaData ? orderMetaData.Sku : productData && productData.Sku,
                // product_id: 
                product_id: orderMetaData ? orderMetaData.product_id : (productData && productData.Type == "variation") ? productData.ParentId : item.product_id,
                // quantity: item.quantity,
                quantity: orderMetaData ? orderMetaData.quantity : item.quantity,
                after_discount: orderMetaData ? orderMetaData.after_discount : (item.total == item.subtotal) ? 0 : item.total,
                discount_amount: orderMetaData ? orderMetaData.discount_amount : (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                // variation_id: (productData.Type == "variation") ? item.product_id : 0,
                variation_id: orderMetaData ? orderMetaData.variation_id : (productData && productData.Type == "variation") ? item.product_id : 0,
                cart_after_discount: orderMetaData ? orderMetaData.cart_after_discount : (item.total == item.subtotal) ? 0 : item.total,
                cart_discount_amount: orderMetaData ? orderMetaData.cart_discount_amount : 0,
                product_after_discount: orderMetaData ? orderMetaData.product_after_discount : 0,
                product_discount_amount: orderMetaData ? orderMetaData && orderMetaData.product_discount_amount ? orderMetaData.product_discount_amount : 0 : 0,
                old_price: orderMetaData ? orderMetaData.old_price : productData ? productData.Price : 0,
                discount_type: orderMetaData ? orderMetaData.discount_type : null,
                new_product_discount_amount: orderMetaData ? orderMetaData.new_product_discount_amount : 0,
                line_item_id: item.line_item_id,
                subtotalPrice: item.subtotal,
                subtotaltax: item.subtotal_tax,
                totalPrice: item.total,
                totaltax: item.total_tax,
                // after_discount: (item.total == item.subtotal) ? 0 : item.total,
                // discount_amount: (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                // old_price: productData.Price,
                incl_tax: typeOfTax == 'incl' ? item.subtotal_tax : 0,
                excl_tax: typeOfTax == 'Tax' ? item.subtotal_tax : 0,
                Taxes: item.Taxes,
                // product_discount_amount: (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                // TaxClass: productData.TaxClass,
                // TaxStatus: productData.TaxStatus,
                isTaxable: productData && productData.Taxable,
                // ticket_status: productData.IsTicket,
                ticket_status: orderMetaData ? orderMetaData.ticket_status : null,
                tick_event_id: orderMetaData ? orderMetaData.tick_event_id : null,
                ticket_info: orderMetaData ? orderMetaData.ticket_info : null,
                product_ticket: orderMetaData ? orderMetaData.product_ticket : null,
                TaxStatus: orderMetaData ? orderMetaData.TaxStatus : productData && productData.TaxStatus,
                tcForSeating: orderMetaData ? orderMetaData.tcForSeating : null,
                TaxClass: orderMetaData ? orderMetaData.TaxClass : productData && productData.TaxClass,
                addons: item.meta && item.meta ? JSON.parse(item.meta) : '',
                strProductX: ''
              })
            }
          })

          // add custom fee to the CARD_PRODUCT_LIST
          var orderMeta = single_Order_list && single_Order_list.meta_datas && single_Order_list.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount');
          orderMeta = orderMeta ? orderMeta.ItemValue : [];
          var parsedFeeData = orderMeta && orderMeta !== undefined ? orderMeta.length > 0 && JSON.parse(orderMeta) : [];
          var orderFeeData = parsedFeeData && parsedFeeData !== [] && parsedFeeData.find(item => item.order_custom_fee);

          if (orderFeeData && orderFeeData.order_custom_fee.length > 0 && orderFeeData.order_custom_fee) {
            orderFeeData && orderFeeData.order_custom_fee.map(item => {
              ListItem.push({
                Title: item.note,
                Price: item.amount !== 0 ? item.amount : null,
                TaxClass: item.TaxClass,
                TaxStatus: item.TaxStatus,
                after_discount: item.after_discount,
                cart_after_discount: item.cart_after_discount,
                cart_discount_amount: item.cart_discount_amount,
                discount_amount: item.discount_amount,
                discount_type: item.discount_type,
                excl_tax: item.excl_tax,
                incl_tax: item.incl_tax,
                isTaxable: item.isTaxable,
                new_product_discount_amount: item.new_product_discount_amount,
                old_price: item.old_price,
                product_after_discount: item.product_after_discount,
                product_discount_amount: item.product_discount_amount,
                quantity: item.quantity,

              })
            })
          }

          // add notes in cart list
          if ((typeof single_Order_list.order_notes !== 'undefined') && single_Order_list.order_notes.length !== 0) {
            single_Order_list.order_notes.map(item => {
              ListItem.push({
                Title: item.note,
                id: item.note_id
              })
            })
          }

          if ((typeof single_Order_list.order_payments !== 'undefined') && single_Order_list.order_payments.length == 0 && single_Order_list && single_Order_list.order_id == 0) {
            //this.props.single_Order_list && this.props.single_Order_list.order_id == 0) {
            localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(ListItem))
            localStorage.removeItem("VOID_SALE")
          } else {
            if (single_Order_list.order_status != "park_sale" && single_Order_list.order_status != "pending" && single_Order_list.order_status !== 'on-hold' && single_Order_list.order_status !== 'lay_away') {
              // if (single_Order_list.order_status != "park_sale" && single_Order_list.order_status != "pending") {
              localStorage.setItem("VOID_SALE", "void_sale")
              localStorage.removeItem("CARD_PRODUCT_LIST")
              // remove void sale for park_sale
            } else {
              localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(ListItem))
              if (localStorage.getItem("oliver_order_payments") == null || (typeof single_Order_list.order_payments !== 'undefined') && single_Order_list.order_payments.length == 0) {
                localStorage.removeItem("VOID_SALE")
              }
            }
          }
          var orderCustomerInfo = (typeof single_Order_list.orderCustomerInfo !== 'undefined') && single_Order_list.orderCustomerInfo !== null ? single_Order_list.orderCustomerInfo : null;
          if (orderCustomerInfo !== null) {
            addcust = {
              content: {
                AccountBalance: 0,
                City: orderCustomerInfo.customer_city ? orderCustomerInfo.customer_city : '',
                Email: orderCustomerInfo.customer_email ? orderCustomerInfo.customer_email : '',
                FirstName: orderCustomerInfo.customer_first_name ? orderCustomerInfo.customer_first_name : '',
                Id: orderCustomerInfo.customer_id ? orderCustomerInfo.customer_id : single_Order_list.customer_id,
                LastName: orderCustomerInfo.customer_last_name ? orderCustomerInfo.customer_last_name : '',
                Notes: orderCustomerInfo.customer_note ? orderCustomerInfo.customer_note : '',
                Phone: orderCustomerInfo.customer_phone ? orderCustomerInfo.customer_phone : '',
                Pin: 0,
                Pincode: orderCustomerInfo.customer_post_code ? orderCustomerInfo.customer_post_code : '',
                StoreCredit: orderCustomerInfo.store_credit ? orderCustomerInfo.store_credit : '',
                StreetAddress: orderCustomerInfo.customer_address ? orderCustomerInfo.customer_address : '',
                UID: 0,
                WPId: orderCustomerInfo.customer_id ? orderCustomerInfo.customer_id : single_Order_list.customer_id,
              }
            }
            localStorage.setItem('AdCusDetail', JSON.stringify(addcust));
            sessionStorage.setItem("CUSTOMER_ID", orderCustomerInfo.customer_id ? orderCustomerInfo.customer_id : single_Order_list.customer_id)
          }
          // single_Order_list.line_items.map(item => {

          // var discountOrderMeta = single_Order_list && single_Order_list.meta_datas[2] ? single_Order_list.meta_datas[2].ItemValue : []
          var SingleOrderMetaData = single_Order_list && single_Order_list.meta_datas && single_Order_list.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount')
          SingleOrderMetaData = SingleOrderMetaData && SingleOrderMetaData !== undefined ? SingleOrderMetaData.ItemValue : []
          var productDiscountData = SingleOrderMetaData.length > 0 && JSON.parse(SingleOrderMetaData)
          // var orderMetaData = productDiscountData && productDiscountData != [] && productDiscountData.find(metaData => metaData.product_id);

          // total_subTotal_fileds sent from checkout in meta when we order as a park or lay-away
          var orderMetaData = productDiscountData && productDiscountData != [] && productDiscountData.find(itm => itm.total_subTotal_fileds);
          // });
          orderMetaData = orderMetaData && orderMetaData.total_subTotal_fileds && orderMetaData.total_subTotal_fileds.totalPrice && orderMetaData.total_subTotal_fileds.subTotal ? orderMetaData.total_subTotal_fileds : null
          var CheckoutList = {
            ListItem: ListItem,
            customerDetail: orderCustomerInfo ? addcust : null,
            totalPrice: orderMetaData ? orderMetaData.totalPrice : single_Order_list.total_amount,
            // totalPrice: single_Order_list.total_amount,
            discountCalculated: single_Order_list.discount,
            tax: single_Order_list.total_tax,
            subTotal: orderMetaData ? parseFloat(orderMetaData.subTotal) : parseFloat(single_Order_list.total_amount) - parseFloat(single_Order_list.total_tax),
            // subTotal: parseFloat(single_Order_list.total_amount) - parseFloat(single_Order_list.total_tax),
            // TaxId: deafult_tax && deafult_tax[0] ? deafult_tax[0].TaxId : 0,
            TaxId: Taxes ? Taxes : 0,
            status: single_Order_list.order_status,
            order_id: single_Order_list && single_Order_list.order_id,
            oliver_pos_receipt_id: single_Order_list && single_Order_list.OliverReciptId,
            order_date: moment(single_Order_list.OrderDateTime).format(Config.key.DATETIME_FORMAT),
            showTaxStaus: typeOfTax == 'Tax' ? typeOfTax : 'Incl. Tax',
          }
          localStorage.removeItem('PENDING_PAYMENTS');
          localStorage.setItem("CHECKLIST", JSON.stringify(CheckoutList))
          var addonsItem = []
          ListItem && ListItem.map((list) => {
            if (list && list.addons && list.addons !== '' && list.addons.length > 0) {
              list['Type'] = list.variation_id && list.variation_id !== 0 ? 'variable' : 'simple'
              list['line_subtotal'] = list.Price
              list['line_subtotal_tax'] = list.subtotaltax
              list['line_tax'] = list.totaltax
              list['strProductX'] = ''
              addonsItem.push(list)
            }
          })
          localStorage.setItem("PRODUCTX_DATA", JSON.stringify(addonsItem))
          localStorage.setItem("BACK_CHECKOUT", true)
          window.location = '/checkout';
          clientJSON =
          {
            oliverpos:
            {
              command: RequestData.command,
              method: RequestData.method,
              version: "2.0",
              status: 200,
            }
          };
          clearInterval(myInterval);
        }

      }, 500);

      //var wc_order_no= RequestData.wc_order_no;
    }
    else if (RequestData.method == "post" && RequestData.tempOrderId) {

    var tempOrdrId = RequestData.tempOrderId;


    const { Email } = ActiveUser.key;

    const myInterval = setInterval(() => {
      
    var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
      var filteredOrder = null;
      if (TempOrders && TempOrders.length > 0) {
        filteredOrder = TempOrders && TempOrders.filter(tOrder => tOrder.TempOrderID == tempOrdrId)
      }
       var _orderID = tempOrdrId;
        if (filteredOrder && filteredOrder.length > 0 && filteredOrder[0].OrderID !== 0) {
          _orderID = filteredOrder[0].OrderID;

          clientJSON =
          {
            oliverpos:
            {
              command: RequestData.command,
              method: RequestData.method,
              version: "2.0",
              status: 200,
            },
            data:
            {
              oliver_order_id: RequestData.tempOrderId,
              wc_order_no: _orderID,
            }
          };
          postmessage(clientJSON);
          clearInterval(myInterval);
          setTimeout(() => {
            history.push('/salecomplete');
        }, 3000);
        }
        else
        {
          checkOrderStatus(tempOrdrId);
        }
    }
  }, 300);
    }
    clientJSON =
          {
            oliverpos:
            {
              command: RequestData.command,
              method: RequestData.method,
              version: "2.0",
              status: 200,
            },
            data:
              'Processing...'
          };
    postmessage(clientJSON)
  }
}

export const doCustomFee = (RequestData) => {

  var clientJSON = {};
  var _error="";
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
    if (RequestData.method == "get") {
      var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
      var customFes = [];
      if (cartlist.length > 0) {
        cartlist.map(item => {
          if (item && !item.hasOwnProperty("product_id") && item.Price) {
            customFes.push({ name: item.Title, amount: item.Price, is_taxable: item.TaxStatus == "taxable" ? true : false });
          }
        });
        if (RequestData.hasOwnProperty('name') && RequestData.name != "") {
          customFes = customFes.filter(item => (item.name == RequestData.name));
        }
      }
      clientJSON =
      {
        oliverpos:
        {
          command: RequestData.command,
          method: RequestData.method,
          version: "2.0",
          status: 200,
        },
        data:
        {
          fees: customFes
        }
      };
      postmessage(clientJSON);
    }
    else if (RequestData.method == "post" || RequestData.method == "put") {
      var amount = RequestData.data.amount;
      if(parseFloat(amount)>=100)
      {
        amount=parseFloat(amount)/100;
      }
      let add_title = RequestData.data.name;
      let isfeeTaxable = RequestData.data.is_taxable;

      var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
      cartlist = cartlist == null ? [] : cartlist;
      var new_title = add_title !== '' ? add_title : LocalizedLanguage.customFee;
      var title = new_title;
      var new_array = [];
      var isCustomFeeFound=false;
      if (cartlist.length > 0) {
        cartlist.map(item => {

          if (item && RequestData.method == "put" && (typeof item.product_id == 'undefined' || item.product_id == null)) {
            if (item.Title == add_title) {
              isCustomFeeFound==true;
              item.Price = parseFloat(amount);
              item.old_price = isfeeTaxable == true && parseFloat(amount);
              item.isTaxable = isfeeTaxable;
              item.TaxStatus = isfeeTaxable == true ? "taxable" : "none";
            }
            
          }

          if (item && typeof item.product_id == 'undefined') {
            if (item.Price !== null) {
              new_array.push(item)
            }
          }
        })
      }
      if(isCustomFeeFound==false && RequestData.method == "put")
            {
              _error="No matching fee found"
              clientJSON =
              {
                oliverpos:
                {
                  command: RequestData.command,
                  method: RequestData.method,
                  version: "2.0",
                  status: 200,
                },
                data:{error:_error}
              };
              postmessage(clientJSON);
              return;
            }
     if(_error==""){
      if (amount != 0) {
        if (new_array.length > 0) {
          var withNoDigits = new_array.map(item => {
            var remveNum = item.Title.replace(/[0-9]/g, '')
            return remveNum;
          });
          withNoDigits.length > 0 && withNoDigits.map((item, index) => {
            if (item == title) {
              var incr = index + 1
              new_title = item + incr;
            } else {
              new_title = new_title
            }
          })
        }
        var data = {
          Title: new_title,
          Price: parseFloat(amount),
          old_price: isfeeTaxable == true && parseFloat(amount),
          isTaxable: isfeeTaxable,
          TaxStatus: isfeeTaxable == true ? "taxable" : "none",
          TaxClass: '',
          quantity: 1
        }
        if (RequestData.method != "put") {
          cartlist.push(data)
        }
        cartlist && cartlist.map(itm => {
          if ((!itm.TaxStatus) ||itm.TaxStatus == "none") {
            itm.incl_tax = 0;
            itm.excl_tax = 0;
          }
        });
        store.dispatch(cartProductActions.addtoCartProduct(cartlist));
        setTimeout(() => {
          var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
          if (list != null) {

            // var subTotal = parseFloat(list.subTotal + data.Price).toFixed(2);
            //var tax= parseFloat(list.tax +  data.Price).toFixed(2);
            const CheckoutList = {
              ListItem: cartlist,
              customerDetail: list.customerDetail,
              totalPrice: parseFloat((list.subTotal) + parseFloat(list.tax)),
              discountCalculated: list.discountCalculated,
              tax: list.tax,
              subTotal: list.subTotal,
              TaxId: list.TaxId,
              order_id: list.order_id !== 0 ? list.order_id : 0,
              showTaxStaus: list.showTaxStaus,
              _wc_points_redeemed: list._wc_points_redeemed,
              _wc_amount_redeemed: list._wc_amount_redeemed,
              _wc_points_logged_redemption: list._wc_points_logged_redemption,

            }
            localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
          }
        }, 500);

      }
      clientJSON =
      {
        oliverpos:
        {
          command: RequestData.command,
          method: RequestData.method,
          version: "2.0",
          status: 200,
        }
      };
      if (RequestData.method == "put") {
        clientJSON["data"] = {
          name: add_title,
          amount: amount
        }
      }
      postmessage(clientJSON);
    }
    }
    else if (RequestData.method == "delete") {
      var name = '';
      var amount = 0;
      var is_taxable = false;
      var cartlist_fee = [];
      var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
      var i = 0;
      var index = null;
      if (RequestData.hasOwnProperty('name') && RequestData.name != "") {
        for (i = 0; i < cartlist.length; i++) {
          if (cartlist[i].Title == RequestData.name && cartlist[i].Price && cartlist[i].Price != 0) {
            index = i;
            name = cartlist[i].Title;
            amount = cartlist[i].Price;
            is_taxable = cartlist[i].TaxStatus == "taxable" ? true : false
          }
        }
        if (index != null)
          cartlist.splice(index, 1);
      }
      else {
        cartlist_fee = cartlist.filter(item => !item.hasOwnProperty("product_id") && item.Price)
        cartlist = cartlist.filter((el) => !cartlist_fee.includes(el));
      }
      localStorage.setItem("CARD_PRODUCT_LIST", JSON.stringify(cartlist));
      store.dispatch(cartProductActions.addtoCartProduct(cartlist));

      clientJSON =
      {
        oliverpos:
        {
          command: RequestData.command,
          method: RequestData.method,
          version: "2.0",
          status: 200,
        },
        data:
        {
          name: name,
          amount: amount,
          is_taxable: is_taxable
        }
      };
      if (cartlist_fee && cartlist_fee.length > 0) {
        var deleted_fees = [];
        cartlist_fee.map(itm => {
          deleted_fees.push({ name: itm.Title, amount: itm.Price, is_taxable: itm.TaxStatus == "taxable" ? true : false })
        });
        clientJSON["data"] = {};
        clientJSON.data["fees"] = deleted_fees;
      }
      postmessage(clientJSON);
    }
  } 
}

export const getReceiptData = (RequestData) => {
  var clientJSON = {};
  var validationResponse = validateRequest(RequestData)

  if (validationResponse.isValidationSuccess == false) {
    clientJSON = validationResponse.clientJSON;
    postmessage(clientJSON)
  }
  else {
  var type = 'completecheckout';
  var address;
  var site_name;
  var register_id = localStorage.getItem('register')
  var location_name = localStorage.getItem('UserLocations') && JSON.parse(localStorage.getItem('UserLocations'));
  var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
  var siteName = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail'));

  var udid = get_UDid('UDID');
  var AllProductList = []
  var idbKeyval = FetchIndexDB.fetchIndexDb();
  idbKeyval.get('ProductList').then(val => {
    if (!val || val.length == 0 || val == null || val == "") {
    } else { AllProductList = val; }
  });

  if (siteName && siteName.subscription_detail && siteName.subscription_detail !== "") {
    if (siteName.subscription_detail.udid == udid) {
      site_name = siteName.subscription_detail.host_name && siteName.subscription_detail.host_name
    }
  }

  location_name && location_name.map(item => {
    if (item.Id == register_id) {
      address = item;
    }
  })
  var order_reciept = localStorage.getItem('orderreciept') && localStorage.getItem('orderreciept') !== 'undefined' ? JSON.parse(localStorage.getItem('orderreciept')) : "";
  var productxList = localStorage.getItem('PRODUCTX_DATA') ? JSON.parse(localStorage.getItem('PRODUCTX_DATA')) : "";
  var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? getTotalTaxByName(type, productxList) : "";
  var checkList = localStorage.getItem('PrintCHECKLIST') ? JSON.parse(localStorage.getItem('PrintCHECKLIST')) : ""; // localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
  var orderList = localStorage.getItem('oliver_order_payments') ? JSON.parse(localStorage.getItem('oliver_order_payments')) : "";
  var orderMeta = localStorage.getItem("GTM_ORDER") && localStorage.getItem("GTM_ORDER") !== undefined ? JSON.parse(localStorage.getItem("GTM_ORDER")) : null;
  var cash_rounding_total = '';
  if (orderMeta !== null && orderMeta.order_meta !== null && orderMeta.order_meta !== undefined) {
    cash_rounding_total = orderMeta.order_meta[0].cash_rounding && orderMeta.order_meta[0].cash_rounding !== null && orderMeta.order_meta[0].cash_rounding !== undefined && orderMeta.order_meta[0].cash_rounding !== 0 ? orderMeta.order_meta[0].cash_rounding : '';
  }
  var findTicketInfo = "";
  if (checkList && checkList != "") {
    findTicketInfo = checkList.ListItem.find(findTicketInfo => (findTicketInfo.ticket_info && findTicketInfo.ticket_info.length > 0))
  }

  var printData = {};
  if (tempOrderId) {
    var getPdfdateTime = ''; var isTotalRefund = ''; var cash_rounding_amount = '';
    if (ActiveUser.key.isSelfcheckout == true) {
      printData = PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, textToBase64Barcode(tempOrderId), orderList, type, productxList, AllProductList, TotalTaxByName, 0, null, false)
    }
    else {
      printData = PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, 0, null, false)
    }
  }

  var clientJSON =
  {
    oliverpos:
    {
      command: RequestData.command,
      method: RequestData.method,
      version: "2.0",
      status: 200,
    },
    data:
    {
      logo_img: printData.logo_img,
      logo_text: printData.logo_text,
      print_slip_size: printData.print_slip_size,
      rows: printData.data
    }
  };
  postmessage(clientJSON);
  }
}