import React from 'react';
import { ActivityViewTable } from './ActivityOrderTable'
import { Markup } from 'interweave';
import { default as NumberFormat } from 'react-number-format';
import { get_UDid } from '../../ALL_localstorage'
import Config from '../../Config'
import { TicketEventPrint } from '../../CheckoutPage/components/TicketEventPrint';
import { PrintPage } from '../../_components/PrintPage';
import { showAndroidToast } from '../../settings/AndroidIOSConnect';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { showSubTitle, showTitle } from '../../_components';
import { AppMenuList } from '../../_components/AppmenuList';
import KeyAppsDisplay from '../../settings/KeyAppsDisplay';
import { TaxSetting } from '../../_components/index';
import moment from 'moment';
import ActiveUser from '../../settings/ActiveUser';
import { ExtensionList } from '../../_components/ExtensionList';
import {getInclusiveTaxType} from '../../_components/CommonModuleJS'
import CommonJs from '../../_components/CommonJS';

var JsBarcode = require('jsbarcode');
var _env = localStorage.getItem('env_type');
var print_bar_code;
var appreposnse;
function textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
        format: "CODE39", displayValue: false, width: 1,
        height: 30,
    });
    print_bar_code = canvas.toDataURL("image/png");
    return print_bar_code;
}


function Capitalize(val) {
    var str = val ? val.replace(/_/g, '\u00a0') : '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTotalTaxByName(order_taxes, taxType,orderToalAmount=0) {   
    var tax_names = new Array();
    if (order_taxes && order_taxes.length > 0) {
        order_taxes.map(val => {
            var perc= orderToalAmount==0?0: (parseFloat(val.Total)*100/ orderToalAmount).toFixed(0)
            tax_names.push({ 'tax_name': val.Title, "tax_amount": parseFloat(val.Total),"TaxRate":perc })
        })
    }
    return tax_names.length > 0 ? tax_names : "";
}

export const ActivitySecondView = (props) => {
    //var TotalTaxByName = props.Details && props.Details.line_items && getTotalTaxByName(props.Details.line_items);
    var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
   // localStorage.setItem("selectedGroupSale",JSON.stringify({"LocationId":1,"Location":null,"Label":"table 102","Slug":"table_102","GroupName":"Table","UDID":null,"QRCode":"10000005","Old_QRCode":null,"AccessUrl":"https://qa1.order.olivertest.com/4040246672/table_102","CreatedOn":null,"CreatedBy":null,"ModifiedOn":null,"ModifiedBy":null,"DeletedOn":null,"DeletedBy":null,"Id":8,"IsDeleted":false}));
 
   var groupSaleName =  props.Details.meta_datas ?  props.Details.meta_datas.find(data => data.ItemName == '_order_oliverpos_group_name') : null;
   var groupSaleSlug =  props.Details.meta_datas ?  props.Details.meta_datas.find(data => data.ItemName == '_order_oliverpos_group_slug') : null;
   var groupSaleLabel =  props.Details.meta_datas ?  props.Details.meta_datas.find(data => data.ItemName == '_order_oliverpos_group_label') : null;
  
   var selectedGroupSale=localStorage.getItem('selectedGroupSale') ? JSON.parse(localStorage.getItem('selectedGroupSale')).Label : ""; 
    
    
    var isTotalRefund = false;
    if ((props.Totalamount - props.refunded_amount).toFixed(2) == '0.00') {
        isTotalRefund = true
    }
    var tipInfo=null;
    var subtotal = 0.0;
    if (props.Details) {

        subtotal = parseFloat(parseFloat((props.Details.total_amount - props.Details.refunded_amount)) - parseFloat(props.Details.total_tax - props.Details.tax_refunded)).toFixed(2);
    }
    function Ticket_print() {
        var type = 'activity';
        var site_name;
        var EventDetailArr = [];
        var line_items = props.Details && props.Details.line_items ? props.Details.line_items : ''
        var data = props.Details ? props.Details.TicketDetails : ''
        var orderList = props.Details ? props.Details.order_payments : ''
        var inovice_Id = props.Details ? props.Details.order_id : ''
        var manager = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
        var ServedBy = props.Details ? props.Details.ServedBy : ''
        var register = props.Details ? props.Details.RegisterName : ''
        var register_id = localStorage.getItem('register')
        var address = localStorage.getItem('UserLocations') ? JSON.parse(localStorage.getItem('UserLocations')) : '';
        // var decodedString = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : "";
        // var decod = decodedString != "" ? window.atob(decodedString) : "";
        // var siteName = decod && decod != "" ? JSON.parse(decod) : "";
        var siteName = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail'));
        var udid = get_UDid('UDID');
        var timeZoneDetail = props.Details ? props.Details : '';
        var OliverReciptId = props.Details ? props.Details.OliverReciptId : '';
        if (siteName && siteName.subscription_detail && siteName.subscription_detail !== '') {
            if (siteName.subscription_detail.udid == udid) {
              site_name = siteName.subscription_detail.host_name && siteName.subscription_detail.host_name != undefined && siteName.subscription_detail.host_name.trim() !== 'undefined' ? siteName.subscription_detail.host_name : ""
            }
          }
        data && data.map(event => {
            var pp = JSON.parse(event)
            EventDetailArr.push(pp)
        })
        if (EventDetailArr) {
            TicketEventPrint.EventPrintElem(EventDetailArr, orderList, manager, register, address, site_name, ServedBy, inovice_Id, line_items, OliverReciptId, print_bar_code, timeZoneDetail, type)
        }
    }
    var DateTime = props.Details && props.Details;
    var gmtDateTime = "";
    if (DateTime && DateTime.OrderDateTime && DateTime.time_zone) {
        gmtDateTime = FormateDateAndTime.formatDateAndTime(DateTime.OrderDateTime, DateTime.time_zone)
    }
    var CreateDate = props.CreatedDate && props.CreatedDate !== 'Invalid date' ? props.CreatedDate : gmtDateTime == "" ? "" : gmtDateTime;
    var order_reciept = localStorage.getItem('orderreciept') ? localStorage.getItem('orderreciept') === "undefined" ? null : JSON.parse(localStorage.getItem('orderreciept')) : "";
    var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? props.Details && props.Details.order_taxes && getTotalTaxByName(props.Details.order_taxes,props.Details.order_include_tax,props.Details.total_amount-props.Details.total_tax) : "";
    var TaxSetting = localStorage.getItem("TAX_SETTING") ? JSON.parse(localStorage.getItem("TAX_SETTING")) : null;
    var CompanyLogo = order_reciept && order_reciept.CompanyLogo ? order_reciept.CompanyLogo : '';
    var baseurl = Config.key.RECIEPT_IMAGE_DOMAIN + CompanyLogo;
    baseurl = encodeURI(baseurl);
    var barcode_image = Config.key.RECIEPT_IMAGE_DOMAIN + "/Content/img/ic_barcode.svg"
    var barCodeId = props.OliverReciptId ? props.OliverReciptId : props.Details && props.Details.order_id ? props.Details.order_id : null;
    var type = 'activity';
    var orderList = ''
    var udid = get_UDid('UDID');
    var productxList = ""; var AllProductList = "";
    var _customerName = props.CustomerInfo ? props.CustomerInfo : '';
    if (_customerName && props.CustomerInfo.length >= 25)
        _customerName = props.CustomerInfo.substring(0, 22) + '...'

    var isDemoUser = localStorage.getItem('demoUser');
    var demoUserName = Config.key.DEMO_USER_NAME;

    var getorderlist = props.Details && props.Details.meta_datas && props.Details.meta_datas !== null ? props.Details.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount') : null;
    var notesList = props.Details && props.Details.order_notes ? props.Details.order_notes : []
    
    console.log("appreposnseonActivity",appreposnse);
    if( props.appreposnse && appreposnse !== props.appreposnse){
        appreposnse=props.appreposnse;
        handlePrintClick()
      
    }
    var orderData = [];
    if (props.Details !== null && props.Details !== "" && getorderlist !== null) {
        getorderlist = getorderlist && getorderlist.ItemValue && JSON.parse(getorderlist.ItemValue);
        getorderlist && getorderlist.map((item, index) => {
            if (item.order_notes !== null) {
                item.order_notes && item.order_notes.map((item, index) => {
                    if (item.is_customer_note !== undefined && item.is_customer_note !== null) { }
                    else { 
                        if(notesList && notesList !== []){
                            var isSameNoteExist = notesList.find((list)=>list.note == item.note)
                            if(!isSameNoteExist){
                                orderData.push(item); 
                            }
                        }else{
                            orderData.push(item); 
                        }
                    }
                });
            }
        });
    }
    // call local priter when clicked on local printer on cloud popup
    if(props.printerByLocalprinter == true){
        PrintPage.PrintElem(props.Details, props.getPdfdateTime, isTotalRefund, props.cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, props.redeemPointsToPrint)
    }
    function PrintClick() {
        appreposnse=null;
        handlePrintClick()
    }
    function DeleteOrder() {
        appreposnse=null;
        if(props.Reciept){
        props.deleteDuplicateOrder(props.Reciept)
        }
    }
   
    // print by local printer in case no cloud printer available or if any available show cloud popup
    function handlePrintClick() {
        var printersList = props.cloudPrintersData && props.cloudPrintersData.content && props.cloudPrintersData.content.length
        if (printersList) {
            showModal('cloudPrinterListPopup')
        }else{
            PrintPage.PrintElem(props.Details, props.getPdfdateTime, isTotalRefund, props.cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, props.redeemPointsToPrint
                ,appreposnse)

            //For Tickera ------------------------------------            
            if (props.Details && props.Details.TicketDetails && props.Details.TicketDetails != "" && props.Details.TicketDetails.length > 0) {
                Ticket_print();
            }
            //--------------------------------------------
        }
    } 
    
    
    ///Apps ----------------------------
    KeyAppsDisplay.DisplayApps(["update_status"]);
    //----------------------------------
var _objOrderNotes
var _totalProductIndividualDiscount=0;
var _indivisualProductDiscountArray=[];
var _indivisualProductCartDiscountArray=[]
props.Details && props.Details && props.Details !=="" && props.Details.meta_datas && props.Details.meta_datas.map((item, index)=> {                                                           
    if(item.ItemName=='_order_oliverpos_product_discount_amount'){
        var _arrNote=item.ItemValue && item.ItemValue !="" && JSON.parse(item.ItemValue);
        _arrNote && _arrNote !="" && _arrNote.map((item, index)=> {
                if(item.order_notes){
                _objOrderNotes= item.order_notes;    
                }

                if(item.product_discount_amount){  //getting the product discount amount
                    _totalProductIndividualDiscount+=(item.product_discount_amount * (item.discount_type=="Percentage"?item.quantity:1))
                    _indivisualProductDiscountArray.push({"ProductId": item.variation_id && item.variation_id !==0?item.variation_id: item.product_id,"discountAmount":item.product_discount_amount})
                    _indivisualProductCartDiscountArray.push({"ProductId":item.variation_id && item.variation_id !==0?item.variation_id:item.product_id,"discountAmount":item.cart_discount_amount})
                }
        });
    }
});
var taxInclusiveName= "";
if(props.Details && props.Details && props.Details.meta_datas){
    taxInclusiveName =getInclusiveTaxType(props.Details.meta_datas);
}
    return (
        <div className="col-xs-7 col-sm-9">
            <div style={{ display: 'none' }}>
                <img src={baseurl} width="50px" />
            </div>
            <div style={{ display: 'none' }} >
                <img src={barcode_image} width="50px" />
            </div>
            <div style={{ display: 'none' }} >
                <img src={textToBase64Barcode(barCodeId)} />
            </div>
            <div className="padding-content">
                <div className='d-flex space-between align-items-center'>
                    <div className="product-list pl-move horizontalScroll">
                        <AppMenuList updateOrderStatus={props.updateOrderStatus} isdisabled={false} />

                        {/* Activity extesnsion code  */}
                        <ExtensionList type={'Activity View'} showExtensionIframe={props.showExtensionIframe} />
                        {/* Activity extesnsion code  */}
                    </div>
                </div>

                <div className="checkoutlistdetails"> 
                    <div className="checkoutActivityDetails">
                        <div className="card">
                            <div className="card-header no-border topRecordPanel">
                                <h6 className="card-text text-center">
                                    {props.Reciept !== '' || props.CustomerInfo !== '' || props.UserInfo !== '' || props.Orderstatus !== '' || CreateDate !== 'Invalid date' ?
                                        CreateDate !== '' && CreateDate !== 'Invalid date' ? CreateDate : ''
                                        : LocalizedLanguage.noFound
                                    }
                                </h6>
                            </div>
                            <div className="card-body pb-0 pt-0 topRecordPanelTwo">
                                <div className="container-fluid no-padding">
                                    <div className="row">
                                        <div className="col-xs-6 col-sm-9 col-lg-9 col-xl-9">
                                            <div className="widget_list widget_items_width">
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">{LocalizedLanguage.oliverReceipt}</h5>
                                                        <p className="card-text">{props.Reciept ? props.OliverReciptId : '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">{LocalizedLanguage.customerDetails}</h5>
                                                        <p className="card-text pointer" onClick={_customerName ? props.customerPOP : null} ><span className="text-primary">
                                                            {_customerName ? _customerName : '-'}</span></p>
                                                    </div>
                                                </div>
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">{LocalizedLanguage.user} :</h5>
                                                        <p className="card-text">{isDemoUser ? demoUserName : props.UserInfo ? props.UserInfo : '-'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="widget_list widget_items_width">
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">{LocalizedLanguage.wcOrder}</h5>
                                                        <p className="card-text"> {props.Reciept ? props.Reciept : '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">{LocalizedLanguage.orderStatus}</h5>
                                                        <p className="card-text">{Capitalize(props.Orderstatus ? props.Orderstatus : '-')}</p>
                                                    </div>
                                                </div>
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">{LocalizedLanguage.totalAmount}</h5>
                                                        <p className="card-text"><span className="text-primary">{(props.Totalamount - props.refunded_amount).toFixed(2)}</span></p>
                                                    </div>
                                                </div>
                                            </div>

                                            {groupSaleSlug && groupSaleLabel && groupSaleLabel.ItemValue && <div className="widget_list widget_items_width">
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title">  { user.group_sales_by}</h5>
                                                        <p className="card-text"> {groupSaleLabel && groupSaleLabel.ItemValue}</p>
                                                    </div>
                                                </div>
                                                
                                               
                                            </div>}

                                            {props  && props.requestParameter && props.requestParameter=="true" &&  props.Reciept  && 
                                              <div className="widget_list widget_items_width">
                                                <div className="widget_item">
                                                    <div className="card-flex-details">
                                                        <h5 className="card-title"> Location ID: { localStorage.getItem("Location")}</h5>
                                                        <p className="card-title"> Register ID: { localStorage.getItem("register")}</p>
                                                    </div>
                                                </div>
                                                
                                               
                                            </div>}

                                        </div>
                                        <div className="col-xs-6 col-sm-3 col-lg-3 col-xl-3 card-border-left card-justify-buttons">
                                            <form action="#">
                                                <div className={(props.Orderstatus == "refunded" || props.Orderstatus == "") ? "w-100-block button_with_checkbox disabled" : "w-100-block button_with_checkbox"}
                                                    onClick={
                                                        props.Orderstatus == 'completed' ? props.onClick1
                                                            : (props.Orderstatus == "pending" || props.Orderstatus == "lay_away" || props.Orderstatus == "on-hold" || props.Orderstatus == "park_sale" || props.Orderstatus == "init sale" || props.Orderstatus == "processing") ? props.onClick2
                                                                : props.Orderstatus == "refunded" ? props.RefundPOP
                                                                    : (props.Orderstatus == "void_sale" || props.Orderstatus == "cancelled" || props.Orderstatus == "cancelled_sale" ) ? props.VoidPOP
                                                                        : null
                                                    }>
                                                    <input type="radio" id="test1" name="radio-group" />
                                                    <label htmlFor="test1" className="label_select_button">
                                                        {props.Orderstatus == 'completed' ? LocalizedLanguage.refundSale
                                                            : (props.Orderstatus == "pending" || props.Orderstatus == "lay_away" || props.Orderstatus == "on-hold"
                                                                || props.Orderstatus == "park_sale" || props.Orderstatus == "init sale" || props.Orderstatus == "processing"
                                                                || props.Orderstatus == "") ? LocalizedLanguage.openSale
                                                                : props.Orderstatus == "refunded" ? LocalizedLanguage.refundedSale
                                                                    : (props.Orderstatus == "void_sale" || props.Orderstatus == "cancelled" || props.Orderstatus == "cancelled_sale") ? LocalizedLanguage.cancel
                                                                        : null
                                                        }
                                                    </label>
                                                </div>
                                                <div className="w-100-block text-center mt-1 mb-1 notes">
                                                    <div className="line-copy "></div>
                                                </div>
                                                <div className={props.Details && props.Details.orderCustomerInfo && props.Details.orderCustomerInfo != null ? 'w-100-block button_with_checkbox' : "w-100-block button_with_checkbox disabled"} >
                                                    <input type="radio" id="test2" name="radio-group" onClick={props.Details && props.Details.orderCustomerInfo && props.Details.orderCustomerInfo != null ? props.emailPOP : null} />
                                                    <label htmlFor="test2" className="label_select_button">{LocalizedLanguage.emailReceipt}</label>
                                                </div>
                                                <div className="w-100-block button_with_checkbox" id="printReceipt">
                                                 <input type="radio" id="test3" name="radio-group" onClick={props.Details != "" ? () => PrintClick() : props.printPOP} />
                                                    {/* {(!_env || _env == "ios") && <input type="radio" id="test3" name="radio-group" onClick={props.Details != "" ? () => PrintClick() : props.printPOP} />} */}
                                                    {/* {_env && _env !== '' && <input type="radio" id="test3" name="radio-group" 
                                                        onClick={props.Details && props.Details != "" ? () => showAndroidToast(udid, props.Details.order_id) : props.printPOP} />} */}
                                                    <input type="radio" id="test3" name="radio-group" />
                                                    <label htmlFor="test3" className="label_select_button">{LocalizedLanguage.printReceipt}</label>
                                                </div>
                                                {props  && props.requestParameter && props.requestParameter=="true" &&  props.Reciept && 
                                                <div className="w-100-block button_with_checkbox" id="deleteOrder">
                                                 <input type="radio" id="test4" name="radio-group" onClick={props.Reciept?()=> DeleteOrder():null } />
                                                    <input type="radio" id="test4" name="radio-group" />
                                                    <label htmlFor="test4" className="label_select_button">Delete</label>
                                                </div>}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card no-border overflow-auto">
                                <div className="card-header border-width-2 pb-2 border-dark topRecordPanelTitle">
                                    <h6 className="card-text label-dark">{LocalizedLanguage.item}</h6>
                                </div>
                                <div className="card-body overflowscroll no-padding p-0 window-header-cname_chistory">
                                    <div className="card no-border">
                                        <div className="card-body no-padding">
                                            <table className="table table-borderless table-no-margin">
                                                <tbody>
                                                    {
                                                       props.Details && props.Details && props.Details.line_items ? props.Details.line_items.map((item, index) => {
                                                            var varDetail = item.ProductSummery.toString();
                                                            var _style = varDetail ? "baseline" : "middle";
                                                            var prodXMeta = item.meta && item.meta !== '[]' && item.meta !== [] ? JSON.parse(item.meta) : ''

                                                            // get meta values from meta field for addons and measurment types
                                                            var metaValues = prodXMeta && prodXMeta !== '' ? prodXMeta.map(function (el) {
                                                                // check if value contains url and get last index of url
                                                                let metaLable =''
                                                                if (new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(el.value)) {
                                                                    var urlData = (el.value.substring(el.value.lastIndexOf('/') + 1))// extract last index of url
                                                                     metaLable = el.label ? el.label : el.key
                                                                     return ` ${metaLable} - ${urlData} `
                                                                    }
                                                                    
                                                                    // **** formate start and end date for booking data ***//
                                                                    if(el.key == '_booking_start' || el.key == '_booking_end' ){
                                                                        var dateVal = parseFloat(el.value)

                                                                        // var bookingDate = new Date((dateVal))
                                                                       var bookingDate = moment.unix(dateVal).format(`${ActiveUser.key.orderRecieptDateFormate}, ${ActiveUser.key.orderRecieptTimeFormate}`);

                                                                        metaLable = el.label ? el.label : el.key
                                                                        return ` ${metaLable} - ${bookingDate} `
                                                                    }
                                                                    // **** end ***//
                                                                    
                                                                metaLable =  el.label ? el.label : el.key
                                                                if(metaLable)

                                                                return  el.key? ` ${metaLable} - ${el.value} <br/>` : el ? JSON.stringify(el):"" // return key and value of meta data
                                                                else if(el._booking_start && el._booking_end && el._booking_id){                                                                    

                                                                    var _startDate = new Date((parseFloat(el._booking_start)))
                                                                        _startDate = moment(_startDate).format(`${ActiveUser.key.orderRecieptDateFormate}, ${ActiveUser.key.orderRecieptTimeFormate}`);
                                                                    var _endDate = new Date((parseFloat(el._booking_end)))
                                                                        _endDate = moment(_endDate).format(`${ActiveUser.key.orderRecieptDateFormate}, ${ActiveUser.key.orderRecieptTimeFormate}`);

                                                                  return  ` booking id:${el._booking_id};<br/> booking start - ${_startDate};<br/> booking end - ${_endDate} `

                                                                }

                                                            }) : '';
                                                            if(item.ProductSummery && item.ProductSummery.length==0){
                                                                varDetail=""
                                                                if(prodXMeta && prodXMeta.length>0 ){
                                                                    varDetail=CommonJs.showAddons("activity",prodXMeta,false)
                                                                }                                                              
                                                            }                                                           
                                                            var isIndivisualDiscountApply= _indivisualProductDiscountArray && _indivisualProductDiscountArray.filter(x => x.ProductId === item.product_id);
                                                            var _productCartDiscountAmount=0;
                                                            if(_indivisualProductCartDiscountArray && _indivisualProductCartDiscountArray.length>0){
                                                                _indivisualProductCartDiscountArray && _indivisualProductCartDiscountArray.map(x=>{
                                                                      if(x.ProductId === item.product_id)
                                                                      _productCartDiscountAmount=x.discountAmount     
                                                                });
                                                            }
                                                            var refundItemTax=((item.subtotal_tax/item.quantity)* item.quantity_refunded)

                                                            var achulRefundedAmount= (item.total
                                                                                        +(taxInclusiveName !=="" ?item.subtotal_tax:0)
                                                                                        +((taxInclusiveName==""?0:refundItemTax))
                                                                                        - item.amount_refunded)
                                                                                       
                                                            return (
                                                                <tr key={'LI' + index}>
                                                                    <td className="table-quantity">
                                                                        {
                                                                            (item.quantity_refunded < 0 || (isTotalRefund == true && item.quantity == item.quantity_refunded)) ? (item.quantity_refunded < 0) ? <div>{isTotalRefund == true && item.quantity == item.quantity_refunded ? 0 : item.quantity + item.quantity_refunded}<del style={{ marginLeft: 5 }}>{item.quantity}</del></div> : showSubTitle(item) !== "" ? null : item.quantity : showSubTitle(item) !== "" ? null : item.quantity
                                                                        }
                                                                    </td>
                                                                    <td>{showTitle(item) !== "" ? <Markup content={item.name} /> : null}
                                                                        {showSubTitle(item) !== "" ? <p className="help-block help-text"><Markup content={item.name} /> </p> : null}
                                                                        {varDetail ? <p className="help-block help-text"><Markup content={varDetail} /> </p> : null}
                                                                    </td>
                                                                    <td className="w-101" align="right">
                                                                        {
                                                                            (item.amount_refunded > 0 || isTotalRefund == true) ?
                                                                                (item.quantity_refunded < 0) ?
                                                                                    <div><del style={{ marginRight: 10 }}>
                                                                                        <NumberFormat value={item.total+(taxInclusiveName !==""? item.subtotal_tax:0)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del><NumberFormat value={achulRefundedAmount.toFixed(2)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </div>
                                                                                    :
                                                                                    <NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                :
                                                                                ((item.subtotal - item.total) != 0) && isIndivisualDiscountApply.length>0 ?
                                                                                    TaxSetting && TaxSetting.pos_prices_include_tax == 'no' ?
                                                                                        <div><del style={{ marginRight: 10 }}>{item.subtotal.toFixed(2)}</del><NumberFormat value={item.total +_productCartDiscountAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                                                                        : <div><del style={{ marginRight: 10 }}>{(item.subtotal+(taxInclusiveName==""?0:item.subtotal_tax)).toFixed(2)}</del><NumberFormat value={(item.total+(taxInclusiveName==""?0:item.subtotal_tax) +_productCartDiscountAmount).toFixed(2)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </div>
                                                                                    : <NumberFormat value={item.subtotal+(taxInclusiveName==""?0:item.subtotal_tax)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) : null
                                                    }
                                                    {props.Details ?
                                                        props && props.Details && props.Details.order_custom_fee && props.Details.order_custom_fee.map((item, index) => {
                                                               if(item.note && item.note.includes('Tip')){ //remove tip to disply from custom fee 
                                                                subtotal -= item.amount;
                                                                tipInfo=item
                                                                return null;
                                                               } else{
                                                                return (<tr key={index}>
                                                                    <td></td>
                                                                    <td>{item.note ? item.note : ''}</td>
                                                                    <td className="text-right">{item.amount_refunded > 0 ? <div><del style={{ marginRight: 10 }}><NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del><NumberFormat value={item.amount - item.amount_refunded} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div> : <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</td>
                                                                </tr> )
                                                               }
                                                           
                                                        })
                                                        : null
                                                    }
                                                   
                                                   {/* {_objOrderNotes  && _objOrderNotes !== null ?
                                                        _objOrderNotes && _objOrderNotes.map((item, index) => {
                                                            return (                                                              
                                                                item.is_extension_note && item.is_extension_note==true?'':
                                                                    <tr key={index}>
                                                                        <td>{LocalizedLanguage.notes}</td>
                                                                        <td>{item.note ? item.note : ''}</td>
                                                                        <td className="text-right"> </td>
                                                                    </tr>
                                                            )
                                                        })
                                                        : null
                                                    } */}
                                                    {props.Details && props.Details.order_notes && props.Details.order_notes !== null ?
                                                        props && props.Details && props.Details.order_notes.map((item, index) => {
                                                            return (
                                                                item.note.toLowerCase().match(/payment done with:/) ?
                                                                    ''
                                                                    :
                                                                    <tr key={index}>
                                                                        <td>{LocalizedLanguage.notes}</td>
                                                                        <td>  {item.note ? <Markup content={item.note} />  : ''}</td>
                                                                        <td className="text-right"> </td>
                                                                    </tr>
                                                            )
                                                        })
                                                        : null
                                                    }
                                                    {/* {orderData && orderData.length !== 0 && orderData !== undefined ? orderData.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{LocalizedLanguage.notes} </td>
                                                                <td>{item.note ? item.note : ''}</td>
                                                                <td className="text-right"> </td>
                                                            </tr>
                                                        )
                                                    })
                                                        : null
                                                    } */}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="card-footer no-padding">
                                            {props.Details &&
                                                <ActivityViewTable
                                                    Subtotal={subtotal ? subtotal : 0}
                                                    Discount={props.Details.discount}
                                                    TotalTax={props.Details.total_tax}
                                                    tax_refunded={props.Details.tax_refunded}
                                                    TotalAmount={props.Details.total_amount}
                                                    refunded_amount={props.Details.refunded_amount}
                                                    OrderPayment={props.Details.order_payments}
                                                    refundPayments={props.Details.order_Refund_payments}
                                                    cash_round={props.cash_rounding_amount}
                                                    balence={props.Balance}
                                                    TimeZone={props.Details.time_zone}
                                                    refundCashRounding={props.Details.refund_cash_rounding_amount}
                                                    redeemPointsToPrint={props.redeemPointsToPrint}
                                                    orderMetaData={props.Details.meta_datas}
                                                    tipInfo={tipInfo}

                                                    TotalIndividualProductDiscount= {_totalProductIndividualDiscount}

                                                    requestParameter={props  && props.requestParameter ? props.requestParameter:null}

                                                />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
