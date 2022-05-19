import React from 'react';
import { connect } from 'react-redux';
import { get_UDid } from '../../ALL_localstorage';
import { saveCustomerInOrderAction, cartProductActions, cloudPrinterActions } from '../../_actions';
import { LoadingModal, PrintPage, AndroidAndIOSLoader, getTotalTaxByName } from '../../_components';
import { history } from '../../_helpers';
import { TicketEventPrint, checkoutActions } from '..';
import { TaxSetting } from '../../_components/index';
import { showAndroidToast } from '../../settings/AndroidIOSConnect';
import Config from '../../Config';
import { activityActions } from '../../ActivityPage/index';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS,isSafari,isMobileSafari } from "react-device-detect";
import MobileSaleComplete from '../../_components/views/m.SaleComplete'
import ActiveUser from '../../settings/ActiveUser';
import moment from 'moment';
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import { CommonOrderStatusPopup } from '../../_components/CommanOrderStatusPopup'
import { AppMenuList } from '../../_components/AppmenuList';
import KeyAppsDisplay from '../../settings/KeyAppsDisplay';
import KeysOrderStaus from '../../settings/KeysOrderStaus';
import { CommonMsgModal } from '../../_components/CommonMsgModal';
import { SelfSaleComplete } from '../../SelfCheckout/components/SaleCompletePage/SelfSaleComplete';
import { serverRequest } from '../../CommonServiceRequest/serverRequest'
import {trackPage} from '../../_components/SegmentAnalytic'
import $ from 'jquery'
import { OnboardingShopViewPopup } from '../../onboarding/components/OnboardingShopViewPopup';
import { checkForEnvirnmentAndDemoUser, checkOrderStatus, getHostURLsBySelectedExt, onBackTOLoginBtnClick, sendClientsDetails, sendRegisterDetails, sendTipInfoDetails } from '../../_components/CommonJS';
import { settinglist } from '../../SettingPage';
import { ExtensionList } from '../../_components/ExtensionList';
import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
import { CloudPrinterListPopup } from '../../_components/CloudPrinterListPopup';
import { handleAppEvent } from '../../ExtensionHandeler/commonAppHandler';
import {isOpenCashDrawer} from '../../WrapperSettings/CommonWork'
var JsBarcode = require('jsbarcode');
var print_bar_code;


function callBackTickeraPrintApi(udid, orderList, manager, register, location_name, site_name, ServedBy = '', inovice_Id, line_items, tempOrderId, print_bar_code, type) {
    const API_URL = Config.key.OP_API_URL
    return serverRequest.clientServiceRequest('GET', `/orders/GetTicketDetails?udid=${udid}&orderId=${tempOrderId}`, '')
        .then(response => {
            if (response.is_success==true) { 
                return  response; 
            }
            throw new Error(response.statusText)
        })
        .then(function handleData(data) {
            var EventDetailArr = []
            var content =data.content;
            if (typeof data.content == 'object') {
                var ServedBy = '';
                var line_items = '';
                content && content.map(event => {
                    //var pp = JSON.parse(event);
                    EventDetailArr.push(JSON.parse(event));
                })
                setTimeout(function () {
                    TicketEventPrint.EventPrintElem(EventDetailArr, orderList, manager, register, location_name, site_name, ServedBy = '', inovice_Id, line_items, tempOrderId, print_bar_code, type)
                }, 500)
            } else {
                callBackTickeraPrintApi(udid, orderList, manager, register, location_name, site_name, ServedBy = '', inovice_Id, line_items, tempOrderId, print_bar_code, type)
            }
        }).catch(function handleError(error) {
            return error
        })
}

function textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
        format: "CODE39", displayValue: false, width: 1,
        height: 30,
    });
    print_bar_code = canvas.toDataURL("image/png");
    return print_bar_code;
}

class SaleComplete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkList: localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null,
            CancelOrder: false,
            mailsucces: null,
            tick_event_status: false,
            IsEmailExist: true,
            valiedEmail: true,
            orderId: "",
            isOrderSyncComplete: false,
            common_Msg: '',
            loader: false,
            checkOrderStatusIncr : 0,
            extensionIframe : false, // extension state
            extHostUrl :'',
            extPageUrl : '',
            printerByLocalprinter : false,
            cloudPrintersData : [],
            cloudPrinterErr : '',
            emailSendingMessage:'',
            appreposnse:null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.clear = this.clear.bind(this);
        this.closeMsgModal = this.closeMsgModal.bind(this)
        this.printdetails = this.printdetails.bind(this);
        this.HandleContinue = this.HandleContinue.bind(this);
        
        this.printdetails();
    }
    componentWillMount() {
        ///Apps ----------------------------
        KeyAppsDisplay.DisplayApps(["update_status"]);
        //    console.log("_displayApp",_displayApp)
        //        Object.keys(_displayApp).map((item, index) => {           
        //               _displayApp[item].disabled=true;         
        //        });
        //        Object.keys(_displayApp).map((item, index) => {
        //            if(item=="update_status")
        //            {
        //               _displayApp[item].disabled=false;
        //            }
        //        });
        //    console.log("_displayApp1",_displayApp)
        //----------------------------------
    }

    //Created By Aatifa @ 22/07/2020 for Print receipt details
    printdetails() {

        var ListItem = new Array();
        var typeOfTax = TaxSetting.typeOfTax()
        var addcust;
        var PrintDetails = localStorage.getItem('GTM_ORDER') ? JSON.parse(localStorage.getItem('GTM_ORDER')) : null;

        if (PrintDetails && PrintDetails !== null ){
            if( PrintDetails && PrintDetails.productx_line_items && PrintDetails.productx_line_items !== null && PrintDetails.productx_line_items.length > 0) {
                PrintDetails.productx_line_items.map(item => {
                ListItem.push({
                    line_item_id: 0,
                    quantity: item.quantity,
                    Title: item.Title && item.Title !== "" ? item.Title : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A',
                    Sku: (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : (item.SKu && item.SKu !== "" && item.SKu !== "False") ? item.SKu : 'N/A',
                    Price: item.line_subtotal ?parseFloat(item.line_subtotal).toFixed(3).slice(0, -1):0.00,
                    subtotalPrice: item.line_subtotal,
                    subtotaltax: item.line_subtotal_tax,
                    totalPrice: item.line_total,
                    totaltax: item.line_tax,
                    product_id: item.product_id, //(productData.Type == "variation") ? productData.ParentId : item.product_id,
                    variation_id: item.variation_id,//(productData.Type == "variation") ? item.product_id : 0,
                    after_discount: (item.line_total == item.line_subtotal) ? 0 : item.line_total,
                    discount_amount: (item.line_total == item.line_subtotal) ? 0 : item.line_subtotal - item.line_total,
                    //old_price: productData.Price,line_
                    incl_tax: typeOfTax == 'incl' ? item.line_subtotal_tax : 0,
                    excl_tax: typeOfTax == 'Tax' ? item.line_subtotal_tax : 0,
                    Taxes: item.line_total_taxes,//item.Taxes
                    addons_meta_data: item && item.addons && item.addons.length>0 && item.addons ?JSON.stringify(item.addons):'',
                    pricing_item_meta_data:item && item.pricing_item_meta_data  ?item.pricing_item_meta_data:'',

                    product_ticket:item && item.product_ticket  ?item.product_ticket:'',
                    tcForSeating:item && item.tcForSeating  ?item.tcForSeating:'',
                    tick_event_id:item && item.tick_event_id  ?item.tick_event_id:'',
                    ticket_info:item && item.ticket_info  ?item.ticket_info:'',
                    ticket_status:item && item.ticket_status  ?item.ticket_status:'',
                    psummary:item &&  item.psummary?item.psummary:''
                })
            })
            }
        }
        if (PrintDetails && PrintDetails.line_items !== null) {
            if(PrintDetails && PrintDetails.line_items && PrintDetails.line_items.length > 0){
                PrintDetails.line_items.map(item => {
                var Proprice = item.subtotal && item.subtotal != "" ? parseFloat(item.subtotal).toFixed(3).slice(0, -1) : 0.00;
                //productList from mobile view
                // var _productList = productList && productList.length > 0 ? productList : this.state.productList;
                // var productData = _productList.find(prdID => prdID.WPID == item.product_id);
                ListItem.push({
                    line_item_id: item.line_item_id,
                    quantity: item.quantity,
                    Title: item.name && item.name !== "" ? item.name : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A',
                    Sku: item.Sku,
                    Price: Proprice,
                    subtotalPrice: item.subtotal,
                    subtotaltax: item.subtotal_tax,
                    totalPrice: item.total,
                    totaltax: item.total_tax,
                    product_id: item.product_id, //(productData.Type == "variation") ? productData.ParentId : item.product_id,
                    variation_id: item.variation_id,//(productData.Type == "variation") ? item.product_id : 0,
                    after_discount: (item.total == item.subtotal) ? 0 : item.total,
                    discount_amount: (item.total == item.subtotal) ? 0 : item.subtotal - item.total,
                    //old_price: productData.Price,
                    incl_tax: typeOfTax == 'incl' ? item.subtotal_tax : 0,
                    excl_tax: typeOfTax == 'Tax' ? item.subtotal_tax : 0,
                    Taxes: item.total_taxes,//item.Taxes
                    addons_meta_data : item.addons_meta_data,
                    pricing_item_meta_data:item && item.pricing_item_meta_data ?item.pricing_item_meta_data:'',

                    product_ticket:item && item.product_ticket  ?item.product_ticket:'',
                    tcForSeating:item && item.tcForSeating  ?item.tcForSeating:'',
                    tick_event_id:item && item.tick_event_id  ?item.tick_event_id:'',
                    ticket_info:item && item.ticket_info  ?item.ticket_info:'',
                    ticket_status:item && item.ticket_status  ?item.ticket_status:'',
                    psummary:item && item.psummary?item.psummary:''
                })
            })
            }
        }
        if (PrintDetails && (typeof PrintDetails.order_custom_fee !== 'undefined') && PrintDetails.order_custom_fee.length !== 0) {
            PrintDetails.order_custom_fee.map(item => {
                ListItem.push({
                    Title: item.note,
                    Price: item.amount !== 0 ? item.amount : null,
                })
            })
        }
        PrintDetails && PrintDetails.billing_address && PrintDetails.billing_address.map(item => {           
            addcust = {
                content: {
                    AccountBalance: 0,
                    City: item.city ? item.city : '',
                    Email: item.email ? item.email : '',
                    FirstName: item.first_name ? item.first_name : '',
                    Id: item.customer_id ? item.customer_id : PrintDetails.customer_id,
                    LastName: item.last_name ? item.last_name : '',
                    Notes: item.customer_note ? item.customer_note : '',
                    Phone: item.phone ? item.phone : '',
                    Pin: 0,
                    Pincode: item.postcode ? item.postcode : '',
                    StoreCredit: item.store_credit ? item.store_credit : '',
                    StreetAddress: item.address_1 ? item.address_1 + (item.address_2 && item.address_2) : '',
                    UID: 0,
                }
            }
        })
        var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
        var taxIds
        if (PrintDetails && PrintDetails.line_items && PrintDetails.line_items.length > 0) {
            taxIds = PrintDetails && PrintDetails.line_items !== null ? PrintDetails.line_items[0].total_taxes ? PrintDetails.line_items[0].total_taxes : 0 : 0;
        }
        if (PrintDetails !== null ){
            if( PrintDetails.productx_line_items !== null && PrintDetails.productx_line_items.length > 0)
                taxIds = PrintDetails && PrintDetails.productx_line_items && PrintDetails.productx_line_items[0].line_total_taxes;
        }
        var taxArray = taxIds ? JSON.parse(JSON.stringify(taxIds)) : null;//JSON.parse(taxIds).total
        var Taxes = taxArray !== null && taxArray !== undefined && taxArray.length > 0 ? Object.entries(taxArray).map(item => ({ [item[0]]: item[1] })) : deafult_tax;
        // get redeem points from localstorage
        var redeemedPointsToPrint = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem("CHECKLIST"))._wc_points_redeemed : 0;
        var redeemedAmountToPrint = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem("CHECKLIST"))._wc_amount_redeemed : 0;
        var PrototalDis = PrintDetails && PrintDetails !== undefined && PrintDetails.order_discount && parseFloat(PrintDetails.order_discount).toFixed(3).slice(0, -1)
        var CheckoutList = {
            ListItem: ListItem,
            customerDetail: addcust ? addcust : null,
            totalPrice: PrintDetails && PrintDetails.order_total,
            discountCalculated: PrototalDis,
            tax: PrintDetails && PrintDetails.order_tax,
            subTotal: PrintDetails && parseFloat(PrintDetails.order_total) - parseFloat(PrintDetails.order_tax),
            subTotal: PrintDetails && parseFloat(PrintDetails.order_total) - parseFloat(PrintDetails.order_tax),
            // TaxId: deafult_tax && deafult_tax[0] ? deafult_tax[0].TaxId : 0,
            TaxId: Taxes ? Taxes : 0,
            status: PrintDetails && PrintDetails.status,
            order_id: PrintDetails && PrintDetails && PrintDetails.order_id,
            oliver_pos_receipt_id: PrintDetails && PrintDetails.OliverReciptId,
            order_date: PrintDetails && PrintDetails.OrderDateTime ? moment(PrintDetails.OrderDateTime).format(Config.key.DATETIME_FORMAT) : 
                                    PrintDetails &&  PrintDetails._currentTime ? moment(PrintDetails._currentTime).format(Config.key.DATETIME_FORMAT) : null,
            showTaxStaus: typeOfTax == 'Tax' ? typeOfTax : 'Incl. Tax',
            order_notes: PrintDetails && PrintDetails.order_notes,
            // PUTTING redeemedPointsToPrint IN Printcheckout
            redeemedPoints: redeemedPointsToPrint ? redeemedPointsToPrint : 0,
            redeemedAmountToPrint: redeemedAmountToPrint ? redeemedAmountToPrint : 0,
            meta_datas: PrintDetails && PrintDetails.order_meta,
        }
        localStorage.setItem("PrintCHECKLIST", JSON.stringify(CheckoutList));
        //localStorage.removeItem("CHECKLIST");
    }

    componentDidMount() {

        var orderList = localStorage.getItem('oliver_order_payments') ? JSON.parse(localStorage.getItem('oliver_order_payments')) : "";
        if(orderList!="")
        {
            isOpenCashDrawer(orderList);
        }
         // cloud printer list from localstorage
         var cloudPrinters = localStorage.getItem('cloudPrinters') ? JSON.parse(localStorage.getItem('cloudPrinters')) : []
         this.setState({
             cloudPrintersData: cloudPrinters
         })

        if (localStorage.getItem('demoUser') == 'true') {
            window.history.replaceState(null, null, "?_u=demo");
        }
       setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 2000);


        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            var is_autoprint_receipt= localStorage.getItem('is_autoprint_receipt');
            if(is_autoprint_receipt && typeof is_autoprint_receipt!="undefined" && is_autoprint_receipt=="yes")
            {
                this.printReceipt();
            }
        }
        else
        {
            var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
            if ((!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false) && checkPrintreciept && checkPrintreciept == true) {
              
                this.printReceipt();             
            // // open popup show check any cloud printers
            // setTimeout(() => {
            //     this.handlePrintClick()
            // }, 200);
            }
        }
        
        var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
        var isValidENV = checkForEnvirnmentAndDemoUser()
        if (tempOrderId) {
                if(isValidENV == false){
                    this.timer =  checkOrderStatus(tempOrderId)
                    // this.timer = setInterval(() => this.checkOrderStatus(tempOrderId), 2000)
                }
                else{
                    // update orderSyncStatus on order notification
                     var intervalTimer = setInterval(() => {
                         var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                         var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
                         TempOrders && TempOrders.map(ele => {
                             if (ele.TempOrderID == tempOrderId) {
                                 if(ele.OrderID && ele.Status == "true"){
                                     this.setState({isOrderSyncComplete : true,orderId : ele.OrderID})                    
                                     clearInterval(intervalTimer)
                                    }else{
                                        this.setState({checkOrderStatusIncr : this.state.checkOrderStatusIncr + 1})
                                        if(this.state.checkOrderStatusIncr > Config.key.FIREBASE_NOTIFICATION_COUNT){
                                            // setInterval(() => this.checkOrderStatus(tempOrderId), 1000)
                                            checkOrderStatus(tempOrderId) //  function in commonJS 
                                            clearInterval(intervalTimer)
                                        }
                                    }
                                    
                                }
                            });
                        }, 2000); {
                    }
                    
                }
        }

        //----------------------------------------
        trackPage(history.location.pathname,"Sale Completed","salecomplete","salecomplete");

        // *** checkout complete extension event listner *** //
        // var _user = JSON.parse(localStorage.getItem("user"));
        // // ************ Update _user.instance for local testing ************* //
        // // _user.instance = window.location.origin
        // // localStorage.setItem("user", JSON.stringify(_user));
        // // ************ End ********* //
        // window.addEventListener('message', (e) => {
        //     if (e.origin && _user && _user.instance) {
        //         try {
        //             var extensionData = e.data && typeof e.data == 'string' && e.data !=="" ? JSON.parse(e.data) : e.data;
        //             if (extensionData && extensionData !== "" && extensionData.oliverpos) {
        //                 this.showExtention(extensionData);
        //             }
        //             // display app v1.0-------------------------------------
        //             if (extensionData && extensionData !== "" ) {                
        //                 var appresponse=  handleAppEvent(extensionData,"activity");
        //                 console.log("appResponse1",appresponse)
        //                 if(appresponse){
        //                     this.printReceipt(appresponse) ;                       
        //                 }
        //               }
        //               //----------------------------------------
        //         }
        //         catch (err) {
        //             console.error(err);
        //         }
        //     }
        // }, false);
        // *** checkout complete extension event listner end*** //
    }

    // update orderSyncStatus on order notification
    updateOrderSyncStatusOnOrderNotification = (tempOrderId) => {
        var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
        var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
        TempOrders && TempOrders.map(ele => {
            if (ele.TempOrderID == tempOrderId) {
                if(ele.OrderID && ele.Status == "true"){
                    this.setState({isOrderSyncComplete : true,orderId : ele.OrderID})                    
                }else{
                    this.setState({checkOrderStatusIncr : this.state.checkOrderStatusIncr + 1})
                    if(this.state.checkOrderStatusIncr > Config.key.FIREBASE_NOTIFICATION_COUNT){
                        setInterval(() => this.checkOrderStatus(tempOrderId), 3000)
                    }
                }

            }
        });
    }
    printReceipt(appResponse=undefined) {
        var type = 'completecheckout';
        var env = localStorage.getItem("env_type");
        var event_array = []
        var address;
        var site_name;
        var inovice_Id = localStorage.getItem("ORDER_ID") && JSON.parse(localStorage.getItem("ORDER_ID")).Content;
        var manager = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
        var register = localStorage.getItem('registerName')
        var register_id = localStorage.getItem('register')
        var location_name = localStorage.getItem('UserLocations') && JSON.parse(localStorage.getItem('UserLocations'));
        // var decodedString = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : "";
        // var decod = decodedString !== "" ? window.atob(decodedString) : "";
        var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
        // var siteName = decod && decod !== "" ? JSON.parse(decod) : "";
        var siteName = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail')) ;

        var udid = get_UDid('UDID');
        var AllProductList = []
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
            } else { AllProductList = val; }
        });

        //showAndroidToast(udid, tempOrderId, "temporderid");
        if(siteName && siteName.subscription_detail && siteName.subscription_detail  !== ""){
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
        var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
        var orderMeta = localStorage.getItem("GTM_ORDER") && localStorage.getItem("GTM_ORDER") !== undefined ? JSON.parse(localStorage.getItem("GTM_ORDER")) : null;
        var cash_rounding_total = '';
        if(orderMeta !== null && orderMeta.order_meta !==null && orderMeta.order_meta !== undefined)
        {
            cash_rounding_total = orderMeta.order_meta[0].cash_rounding && orderMeta.order_meta[0].cash_rounding !== null && orderMeta.order_meta[0].cash_rounding !== undefined && orderMeta.order_meta[0].cash_rounding !== 0 ? orderMeta.order_meta[0].cash_rounding : '';
        }
        var findTicketInfo = "";
        if (checkList && checkList != "") {
            findTicketInfo = checkList.ListItem.find(findTicketInfo => (findTicketInfo.ticket_info && findTicketInfo.ticket_info.length > 0))
        }
      // // if ((env == null || env == "") || (ActiveUser.key.isSelfcheckout == true  && (typeof Android == "undefined" || Android == null)))  //Print only in web
    //    if (env !==null && env !== "" && ActiveUser.key.isSelfcheckout == true ){
    //     showAndroidToast(udid, tempOrderId, "temporderid") 
    //    }
    //    if ((env == null || env == "") || (ActiveUser.key.isSelfcheckout == true ))  //Print only in web
    //     {
            if (tempOrderId) {
                setTimeout(function () {
                    var getPdfdateTime = ''; var isTotalRefund = ''; var cash_rounding_amount = '';
                    // console.log("Checklst", checkList);
                    if (ActiveUser.key.isSelfcheckout == true) {
                        PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, textToBase64Barcode(tempOrderId), orderList, type, productxList, AllProductList, TotalTaxByName,appResponse)
                    }
                    else {
                        PrintPage.PrintElem(checkList, getPdfdateTime = '', isTotalRefund = '', cash_rounding_amount = cash_rounding_total, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, 0,appResponse)
                    }
                    if (ActiveUser.key.isSelfcheckout == true) {
                        setTimeout(function () {
                            history.push('/selfcheckout')
                        }, 500);
                    }
                }, 1000);
                var ServedBy = ''
                var line_items = '';
                if (typeof findTicketInfo !== 'undefined' && findTicketInfo !== "") {
                    callBackTickeraPrintApi(udid, orderList, manager, register, location_name, site_name, ServedBy = '', inovice_Id, line_items, tempOrderId, print_bar_code, type);
                }
            }
        // }else{
        //     showAndroidToast(udid, tempOrderId, "temporderid") 
        //     console.log('---android print call---');
        //     if (ActiveUser.key.isSelfcheckout == true) {
        //         setTimeout(function () {
        //             history.push('/selfcheckout')
        //         }, 500);
        //     }
        // }
    }
    HandleContinue() {
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem('GTM_ORDER');        
        const { dispatch } = this.props;
        localStorage.removeItem('ORDER_ID');
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem("CART");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem('PRODUCTX_DATA');
        localStorage.removeItem('PAYCONIQ_PAYMENT_RESPONSE');
        localStorage.removeItem('ONLINE_PAYMENT_RESPONSE');
        localStorage.removeItem('STRIPE_PAYMENT_RESPONSE');
        localStorage.removeItem('GLOBAL_PAYMENT_RESPONSE');
        localStorage.removeItem('PAYMENT_RESPONSE');
        localStorage.removeItem('PENDING_PAYMENTS');
        localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
        dispatch(cartProductActions.addtoCartProduct(null));
        // history.push('/selfcheckout');
        history.push('/SelfCheckoutView');
        
    }
    // checkOrderStatus(tempOrderId) {
    //     if (this.state.isOrderSyncComplete == false) {
    //         const { Email } = ActiveUser.key;
    //         var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : [];
    //         if (TempOrders && TempOrders.length > 0) {
    //             TempOrders = TempOrders.filter(item => item.TempOrderID === tempOrderId)
    //             // && (item.OrderID == 0 || item.Status.toString() == "false" || item.Status.toString() == "failed") && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
    //             if (TempOrders && TempOrders.length > 0) {
    //                 var _OrderID = TempOrders[0].OrderID;
    //                 var syncTempOrderID = TempOrders[0].TempOrderID;
    //                 var udid = get_UDid('UDID');
    //                 var _status = TempOrders[0].TempOrderID;
    //                 if (_OrderID == 0) {
    //                     console.log("checkOrderStatus", syncTempOrderID);
    //                     this.props.dispatch(checkoutActions.checkTempOrderStatus(udid, tempOrderId));
    //                 }
    //                 else if (_OrderID > 0) {
    //                     this.setState({ isOrderSyncComplete: true, orderId: _OrderID });
    //                 }
    //             }
    //         }
    //     }
    // }

    CancelSale() {
        this.setState({ CancelOrder: true });
        var udid = get_UDid('UDID');
        var Order_Id = JSON.parse(localStorage.getItem("ORDER_ID")).Content;
        this.props.dispatch(checkoutActions.orderToCancelledSale(Order_Id, udid));
    }

    clear() {
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem('GTM_ORDER');        
        const { dispatch } = this.props;
        localStorage.removeItem('ORDER_ID');
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem("CART");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem('PRODUCTX_DATA');
        localStorage.removeItem('PAYCONIQ_PAYMENT_RESPONSE');
        localStorage.removeItem('ONLINE_PAYMENT_RESPONSE');
        localStorage.removeItem('STRIPE_PAYMENT_RESPONSE');
        localStorage.removeItem('GLOBAL_PAYMENT_RESPONSE');
        localStorage.removeItem('PAYMENT_RESPONSE');
        localStorage.removeItem('PENDING_PAYMENTS');
        localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
        dispatch(cartProductActions.addtoCartProduct(null));
        if(isMobileOnly == true){
            history.push('/shopview')
        }else{
            window.location = '/shopview';
        }
    }

    closeMsgModal() {
        this.setState({ common_Msg: '' })
    }

    sendMail() {
            $(".suctext").css("display", "block");
            var udid = get_UDid('UDID');
            var order_id = $("#order-id").val();
            var email_id = $("#customer-email").val();
            // console.log("email_id", email_id)
            $(".emialsuctes").css("display", "block");
            this.setState({ mailsucces: null,emailSendingMessage:'' });
            var requestData = {
                "Udid": udid,
                "OrderNo": order_id,
                "EmailTo": email_id,
            }
            if (!email_id || email_id == "") {
                this.setState({ IsEmailExist: false, common_Msg: 'Email is not exist!' })
                // setTimeout(function () {
                //     showModal('common_msg_popup');
                // }, 100)
            }
            if (ActiveUser.key.isSelfcheckout == true) {
                var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
                var defaultVal = ((checkList.customerDetail && checkList.customerDetail.content &&
                    typeof checkList.customerDetail.content.Email !== "undefined") ? checkList.customerDetail.content.Email : '')
                if (defaultVal !== '') {
                    this.setState({ common_Msg: 'Email is not exist!' })
                    showModal('common_msg_popup');
                }
            } else {
                this.setState({ IsEmailExist: true })
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id)) {
                    this.setState({
                        valiedEmail: true,
                        loader: true
                    })
                    // if ($(".checkmark").hasClass("isCheck")) {
                    // save new customer on sale complete
                    this.props.dispatch(saveCustomerInOrderAction.saveCustomerToTempOrder(udid, order_id, email_id))
                    // Add into notfication list ----------------------------------------
                    // Create localstorage to store temporary orders--------------------------
                    $("#btnSubmit").attr("disabled", true);
                    var TempOrders = [];
                    if (localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) {
                        TempOrders = JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`));
                    }
                    TempOrders.push({ "TempOrderID": order_id, "Status": "false", "Index": TempOrders.length, "OrderID": 0, 'order_status': "completed", 'date': moment().format(Config.key.NOTIFICATION_FORMAT), 'Sync_Count': 0, 'new_customer_email': email_id, 'isCustomerEmail_send': false });
                    localStorage.setItem(`TempOrders_${ActiveUser.key.Email}`, JSON.stringify(TempOrders));
                    $("#btnSendEmail").attr("readonly", true);
                    // this.clear();
                } else {
                    if (!email_id || email_id == "") {
                        this.setState({ IsEmailExist: false})
                    }
                    this.setState({ valiedEmail: false })
                }
            }
       
    }

    handleInputChange() {
        $(".checkmark").toggleClass("isCheck");
    }

    updateStatus() {
        //$('#updateStatus').modal('show');
        showModal('updateStatus');
        
    }

    componentWillReceiveProps(nextProp) {
        //console.log("dt", nextProp);
        if ((typeof nextProp.getSuccess !== 'undefined') && nextProp.getSuccess !== '') {
            this.setState({
                mailsucces: nextProp.getSuccess ? nextProp.getSuccess.is_success : null,
                emailSendingMessage:nextProp.getSuccess && nextProp.getSuccess.message?nextProp.getSuccess.message:'',
                loader: false
            })
            if (nextProp.getSuccess && nextProp.getSuccess.is_success == true) {
                localStorage.removeItem('CARD_PRODUCT_LIST');
                localStorage.removeItem('GTM_ORDER');
                setTimeout(
                    this.clear()
                    , 1000);
            }
        }
        if (nextProp.tick_event !== '' && (typeof nextProp.tick_event !== 'undefined')) {
        }
        if (nextProp && nextProp.shop_orderstatus_update && nextProp.shop_orderstatus_update.order_status_update) {
            if (nextProp.shop_orderstatus_update.order_status_update.is_success == true) {
                this.setState({ isOrderSyncComplete: false })
            }
        }
        
        if (nextProp && nextProp.syncTemporderStatus) {
            if (nextProp.syncTemporderStatus.items && nextProp.syncTemporderStatus.items.content && nextProp.syncTemporderStatus.items.content.OrderNumber == 0) {
                setTimeout(() => {
                    var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
                    checkOrderStatus(tempOrderId)
                }, 5000);
            }
        }
        if (nextProp.syncTemporderStatus.items && nextProp.syncTemporderStatus.items.content && nextProp.syncTemporderStatus.items.content.OrderNumber > 0) {
            this.setState({ isOrderSyncComplete: true, orderId: nextProp.syncTemporderStatus.items.content.OrderNumber });
        }
        // handle cloud printer response
        if(nextProp && nextProp.setOrderTocloudPrinter && nextProp.setOrderTocloudPrinter.is_success == true){
            this.closeCloudPopup()
            if (ActiveUser.key.isSelfcheckout == true) {
                setTimeout(function () {
                    history.push('/selfcheckout')
                }, 500);
            }
        }
        
    }

     // *** checkout complete extension code start *** ///
    // get extension pageUrl and hostUrl of current clicked extension
    showExtensionIframe = (ext_id) => { 
        // get host and page url from common fucnction   
        var data = getHostURLsBySelectedExt(ext_id)
        this.setState({
            extHostUrl: data ? data.ext_host_url : '',
            extPageUrl: data ? data.ext_page_url : ''
        })
        this.setState({ extensionIframe: true })
        setTimeout(() => {
            showModal('common_ext_popup')
        }, 500);
    }
    
    close_ext_modal =()=>{
        this.setState({ extensionIframe: false })
    }

    showExtention = (value) => {
        var jsonMsg = value ? value : '';
        var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (clientEvent && clientEvent !== '') {
            // console.log("clientEvent", jsonMsg)
            switch (clientEvent) {
                case "extensionReady":
                    this.extensionReady()
                    break;
                case "registerInfo":
                    sendRegisterDetails()
                    break;
                case "clientInfo":
                    sendClientsDetails()
                    break;
                    case "tipInfo":
                    sendTipInfoDetails()
                    break;
                default: // extensionFinished
                console.error('App Error : Extension Event does not match ',jsonMsg);
                    break;
            }
        }
    }

    extensionReady = () => {
        var orderDetails = localStorage.getItem('GTM_ORDER') ? JSON.parse(localStorage.getItem('GTM_ORDER')) : {};
        var orderStatus = orderDetails && orderDetails.status
        var _orderid=this.state.orderId;
        if(_orderid && _orderid !==""){
            orderDetails["order_id"]=_orderid
        }
        var clientJSON =
        {
            oliverpos:
            {
                event: "checkoutComplete"
            },
            data:
            {
                orderDetails:
                {
                    ...orderDetails
                },
                orderStatus:
                {
                    status : orderStatus
                },
            }
        };

        var iframex = document.getElementById("commoniframe").contentWindow;
        var _user = JSON.parse(localStorage.getItem("user"));
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }
    // *** checkout complete extension code end *** ///

      // *** cloud printer handle functions *** //

       handlePrintClick = () => {
           const {cloudPrintersData} = this.state
        //    if(isMobileOnly == true){
        //        this.printReceipt()
        //         return false
        //    }

        if((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            var selected_printer= localStorage.getItem('selected_printer');
            if(selected_printer && typeof selected_printer!="undefined" && selected_printer=="cloud-printer")
            {
                console.log("-----colud printer setting selected-----")
                if(cloudPrintersData && cloudPrintersData !== [] && cloudPrintersData.content && cloudPrintersData.content.length){
                    setTimeout(() => {
                        if(isMobileOnly == true){
                         $('#cloudPrinterListPopup').addClass('show')
                        }
                        showModal('cloudPrinterListPopup')
                    }, 500);
                }
            }
            else{
                setTimeout(() => {
                   this.printReceipt()
                },500);
               }
        }
        else
        {
            if(cloudPrintersData && cloudPrintersData !== [] && cloudPrintersData.content && cloudPrintersData.content.length){
                setTimeout(() => {
                    if(isMobileOnly == true){
                     $('#cloudPrinterListPopup').addClass('show')
                    }
                    showModal('cloudPrinterListPopup')
                }, 500);
            }
            else{
             setTimeout(() => {
                this.printReceipt()
             },500);
            }
        }
           
    }

      handleCloudPrinterClick = (printerId) => {
          const { dispatch } = this.props
          var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
          var cloudPrinterIds = []
          // Check all checked checkbox on popup for cloud printer 
          // check if local printer clicked
          $("input:checkbox[name=setLocalPrinter]:checked").each(function () {
              cloudPrinterIds.push($(this).val());
          });
          $("input:checkbox[name=setCloudPrinter]:checked").each(function () {
              cloudPrinterIds.push(parseInt($(this).val()));
          });
          if(cloudPrinterIds && cloudPrinterIds.length){
            var isLocalPrinterExist = cloudPrinterIds.find(itm=>itm =='localPrinter')
            if (isLocalPrinterExist) {
                  this.setState({
                      printerByLocalprinter: true,
                      cloudPrinterErr: '',
                  })
                  setTimeout(() => {
                      this.closeCloudPopup()
                  }, 200);
              } else if(cloudPrinterIds.find(itm=>itm !=='localPrinter')) {
                  var data = {
                      type: 'saleComplete', // type field will not send to API request, only use to check condition
                      printerId: cloudPrinterIds,
                      orderId: tempOrderId
                  }
                  dispatch(cloudPrinterActions.sendOrderToCloudPrinter(data))
              }
          }
          else {
              this.setState({
                  cloudPrinterErr: 'Please select printer'
              })
          }
      }
   
    //   blank cloudPrinterErr in case printer selected
    handlePrinterIdClick = (printerId)=>{
        this.setState({
            cloudPrinterErr : ''
        })
    }
    // handle close cloud popup  
    closeCloudPopup = ()=>{
        this.setState({
            printerByLocalprinter : false,
            cloudPrinterErr : '',
        })
        //  unchecked all checked checkbox on popup
        $('input[name=setCloudPrinter]:checked').click();
        $('input[name=setLocalPrinter]:checked').click();
        setTimeout(() => {
            if(isMobileOnly == true){
                $('#cloudPrinterListPopup').removeClass('show')
               }
            hideModal('cloudPrinterListPopup')
            this.props.dispatch(cloudPrinterActions.sendOrderToCloudPrinter(null))
        }, 200);
    }
    // *** cloud printer handle functions end *** //


    render() {
        var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
        var inovice_Id = localStorage.getItem("ORDER_ID") && JSON.parse(localStorage.getItem("ORDER_ID")).Content;
        var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
        var order_reciept = localStorage.getItem('orderreciept') && typeof localStorage.getItem('orderreciept') !== 'undefined' && localStorage.getItem('orderreciept') !== 'undefined' ? JSON.parse(localStorage.getItem('orderreciept')) : "";
        var baseurl = order_reciept && order_reciept.CompanyLogo ? Config.key.RECIEPT_IMAGE_DOMAIN + order_reciept.CompanyLogo : '';
        baseurl = encodeURI(baseurl);
        var barcode_image = Config.key.RECIEPT_IMAGE_DOMAIN + "/Content/img/ic_barcode.svg";
        const { loader } = this.state

        // show local printer in case local printer clicked on popup
        if(this.state.printerByLocalprinter == true){
            this.printReceipt()
        }
        return (
            <div className='bodyCenter'>               
                {(ActiveUser.key.isSelfcheckout == true) ?
                    <SelfSaleComplete
                        printReceipt={this.handlePrintClick}
                        // printReceipt={this.printReceipt}
                        sendMail={this.sendMail}
                        baseurl={baseurl}
                        barcode_image={barcode_image}
                        tempOrderId={tempOrderId}
                        orderId={this.state.orderId}
                        handleContinue={this.HandleContinue} />
                    :
                    (isMobileOnly == true) ?
                        <div>
                            <div style={{ display: 'none' }}>
                                <img src={baseurl} width="50px" />
                            </div>
                            <div style={{ display: 'none' }}>
                                <img src={barcode_image} width="50px" />
                            </div>
                            <div style={{ display: 'none' }} >
                                <img src={textToBase64Barcode(tempOrderId)} />
                            </div>
                            <MobileSaleComplete
                                checkList={checkList}
                                tempOrderId={tempOrderId}
                                order_reciept={order_reciept}
                                baseurl={baseurl}
                                barcode_image={barcode_image}
                                {...this.state}
                                goToShopview={this.clear}
                                LocalizedLanguage={LocalizedLanguage}
                                handleInputChange={this.handleInputChange}
                                sendMail={this.sendMail}
                                // printReceipt={this.printReceipt}
                                printReceipt={this.handlePrintClick}
                                clear={this.clear}
                            />
                            <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />        
                            <CloudPrinterListPopup
                                cloudPrintersData={this.state.cloudPrintersData}
                                cloudPrinterErr={this.state.cloudPrinterErr}
                                handleCloudPrinterClick={() => this.handleCloudPrinterClick()}
                                closeCloudPopup={() => this.closeCloudPopup()}
                                handlePrinterIdClick={(setPrinterId)=>this.handlePrinterIdClick(setPrinterId)}
                    />
                        </div>
                        :
                        <div className="sale-complete">
                             {loader ? <LoadingModal /> : ''}
                            <div style={{ display: 'none' }}>
                                <img src={baseurl} width="50px" />
                            </div>
                            <div style={{ display: 'none' }} >
                                <img src={barcode_image} width="50px" />
                            </div>
                            <div style={{ display: 'none' }} >
                                <img src={textToBase64Barcode(tempOrderId)} />
                            </div>
                            <div className="sale-complete-logo">
                                {/* <img src="../assets/images/logo-dark.svg" width="100%" alt=""> */}
                                <img src="../assets/images/logo-dark.svg" className="w-100" alt="" />
                            </div>
                            <div className="sale-complete-strached">
                                <div className="sale_complete">
                                    <div className="widget__list_2">
                                        <img src="../assets/images/check-green.svg" className="widget__list_icon" alt="" />
                                        <h4>{LocalizedLanguage.completeSale}</h4>
                                    </div>
                                </div>
                                <div className="sale__complete">
                                    <div className="sale__complete_inner">
                                        <div className="sale__complete_inner_01">
                                            <div className="sale_panel">
                                                <div className="row row-stretch m-0">
                                                    <div className="col-md-5 col-sm-12 sale-hightlight text-center">
                                                        <div className="sale_light" style  = {{'height' : '70vh', 'overflowY' : 'scroll'}}>
                                                            <h3 className="sale_panel_text">{LocalizedLanguage.apps}</h3>
                                                            <div className={"sale-product"} >
                                                                <AppMenuList cssclassname="sale-product"
                                                                    updateOrderStatus={() => this.updateStatus()}
                                                                    isdisabled={this.state.isOrderSyncComplete == false ? true : false}
                                                                />
                                                                </div>
                                                            <div className={"sale-product"} >
                                                                {/* checkoutComplete extesnsion button  */}
                                                                <ExtensionList type={'Checkout Complete'} showExtensionIframe={this.showExtensionIframe} />
                                                                {/* checkoutComplete extesnsion buttons  */}
                                                            </div>
                                                            {/* orderId={this.state.orderId} isOrderSyncComplete={this.state.isOrderSyncComplete} */}

                                                            <div className="sale-waiting">
                                                                <h6>{LocalizedLanguage.status}</h6>
                                                                <a href="#" className={this.state.isOrderSyncComplete == false ? "text-primary" : "text-info"}>{this.state.isOrderSyncComplete == false ? LocalizedLanguage.waitingOnWebshop : LocalizedLanguage.alldone}</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7 col-sm-12">
                                                        <div className="sale_form">
                                                            <div className="sale-form-inner">
                                                                <h3 className="sale_panel_text">{LocalizedLanguage.rememberPurchase}</h3>
                                                                <div className="form-addon">
                                                                    <div className="form-group">
                                                                        <div className="input-group">
                                                                            <div className="input-group-addon">{LocalizedLanguage.email}</div>
                                                                            <input type="hidden" id="order-id" defaultValue={(typeof tempOrderId !== "undefined") ? tempOrderId : 0} />
                                                                            <input type="text" defaultValue={(checkList.customerDetail && checkList.customerDetail.content &&
                                                                                typeof checkList.customerDetail.content.Email !== "undefined") ? checkList.customerDetail.content.Email : ''}
                                                                                className="form-control" id="customer-email" placeholder="example@gmail.com"
                                                                                disabled={(checkList.customerDetail && checkList.customerDetail.content &&
                                                                                    typeof checkList.customerDetail.content.Email !== "undefined") ? true : false}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <div className="input-group-checkbox">
                                                                            <div className="input-group-text">{LocalizedLanguage.rememberCustomer}</div>
                                                                            <input type="checkbox" className="form-checkbox" defaultChecked />
                                                                            <span className="checkmark" onClick={() => this.handleInputChange()}></span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <div className="row">
                                                                            <div className="col-sm-6">
                                                                                <button className="btn btn-primary btn-block btn-lg" onClick={() => this.handlePrintClick()}>{LocalizedLanguage.printReceipt}</button>
                                                                                {/* <button className="btn btn-primary btn-block btn-lg" onClick={() => this.printReceipt()}>{LocalizedLanguage.printReceipt}</button> */}
                                                                            </div>
                                                                            <div className="col-sm-6">
                                                                                <button className="btn btn-primary btn-block btn-lg" id="btnSubmit" onClick={() => this.sendMail()}
                                                                                    disabled={(checkList.customerDetail && checkList.customerDetail.content &&
                                                                                        typeof checkList.customerDetail.content.Email !== "undefined") ? false : false} >
                                                                                    {LocalizedLanguage.emailReceipt}</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="emialsuctes text-primary" style={{ display: "none" }}>
                                                                        {this.state.IsEmailExist == false ? LocalizedLanguage.enterEmail :
                                                                            this.state.valiedEmail == false ? LocalizedLanguage.invalidEmail :
                                                                                this.state.mailsucces == null ? LocalizedLanguage.pleaseWait :
                                                                                    this.state.mailsucces && this.state.mailsucces == true ? LocalizedLanguage.successSendEmail
                                                                                        : this.state.mailsucces == false ? this.state.emailSendingMessage !='' ?this.state.emailSendingMessage: LocalizedLanguage.failedSendEmail : ""
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sale__complete_inner_02">
                                            <div className="wid-361 push-right">
                                                <button className="btn btn-info btn-lg btn-block text-uppercase btn-sale" onClick={() => this.clear()}>
                                                    {LocalizedLanguage.newSale}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CommonExtensionPopup
                                showExtIframe={this.state.extensionIframe}
                                close_ext_modal={this.close_ext_modal}
                                extHostUrl={this.state.extHostUrl}
                                extPageUrl={this.state.extPageUrl}
                            />
                            <CommonOrderStatusPopup
                                orderId={this.state.orderId}
                                currentOrderStaus={this.state.isOrderSyncComplete == true ? KeysOrderStaus.key.completed : KeysOrderStaus.key.pending}
                                Cust_ID={checkList && checkList.customerDetail && checkList.customerDetail.content}/>
                            <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
                        </div>
                }
              <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
                     <CloudPrinterListPopup
                        cloudPrintersData={this.state.cloudPrintersData}
                        cloudPrinterErr = {this.state.cloudPrinterErr}
                        handleCloudPrinterClick={() => this.handleCloudPrinterClick()}
                        closeCloudPopup={() => this.closeCloudPopup()}
                        handlePrinterIdClick = {(setPrinterId)=>this.handlePrinterIdClick(setPrinterId)}
                    />
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { tick_event, getSuccess,syncTemporder,setOrderTocloudPrinter } = state;
    return {
        tick_event: tick_event.items,
        getSuccess: getSuccess.items,
        syncTemporderStatus : syncTemporder,
        setOrderTocloudPrinter : setOrderTocloudPrinter.printerRes
    };
}
const connectedCompleteRefund = connect(mapStateToProps)(SaleComplete);
export { connectedCompleteRefund as SaleComplete };
