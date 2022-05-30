import Config from '../Config';
import moment from 'moment';
import { get_UDid } from '../ALL_localstorage';
import { FormateDateAndTime } from '../settings/FormateDateAndTime';
import ActiveUser from '../settings/ActiveUser';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { getAddonsField, getBookingField,productRetrunDiv,getInclusiveTaxType } from '../_components/CommonModuleJS';
import { productxArray, showSubTitle, showTitle } from '../_components';
import { showAndroidToast,showAndroidReceipt } from '../settings/AndroidIOSConnect';
import { history } from '../_helpers';
import { taxratelist } from '../_reducers/taxrate.reducer';
import CommonJs from './CommonJS';


const pageSize = ActiveUser.key.pdfFormate;

function stripHtml(html) {
  // Create a new div element
  var temporalDivElement = document && document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return (temporalDivElement.textContent || temporalDivElement.innerText || "").replace(/^"(.*)"$/, '$1');

}

/**
 * CreatedBy :Shakuntala Jatav
 * Created Date : 20-02-2020
 * @param {*} product_id get id
 * @param {*} productlist get all product list
 * Description: get product-x sub tilte list
 */
function showProductxSubTitle(product_id, productlist) {
  var productxValue = '';
  var productxSubList = productxArray(product_id, productlist);
  productxValue = productxSubList && productxSubList.props && productxSubList.props.children ? productxSubList.props.children : '';
  
  var productXData = localStorage.getItem('PRODUCTX_DATA') ? JSON.parse(localStorage.getItem('PRODUCTX_DATA')) : '';
  var bookingData = null
  if(productXData && productXData !== ''){
    productXData.map((itm)=>{
      if(itm.product_id == product_id && itm.booking){
        bookingData = getBookingField({booking : itm.booking})
      // var metaValues = bookingData && bookingData.join(";<br/>")
       // productxValue = metaValues && metaValues !== '' ? metaValues : productxValue
       productxValue=productRetrunDiv(bookingData,true);

      }

    })
  }
  

  return productxValue;
}

function showAddonsProductxSubTitle(product_id, addons,pricemeasurmentdata) {
  var addonsSubTitle = ''
  
    var _addons={};
    _addons['addons']= addons && addons.length>0 && JSON.parse(addons);
    //var prodXMeta = addons ? JSON.parse(addons) : ''
    _addons['pricing_item_meta_data']=pricemeasurmentdata;
    // get meta values from meta field for addons and measurment types    
    console.log("getAddonsField(_addons)",getAddonsField(_addons))
    var metaValues = getAddonsField(_addons);
    

    // var metaValues =metaValues.join(";<br/>")
    // addonsSubTitle = metaValues !== '' ? metaValues : addonsSubTitle
    addonsSubTitle=productRetrunDiv(metaValues,true);
  
  return addonsSubTitle

}
function getProductShortDesc(data,type,productID){
  var shortdesc;
  var getorderlist = "";
  var _data;
  if(type !=='activity'){
     _data=data.meta_datas && data.meta_datas[0]
     getorderlist= _data && _data._order_oliverpos_product_discount_amount
  }else{
    _data = data.meta_datas && data.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount') ;
    getorderlist=_data && _data.ItemValue && JSON.parse(_data.ItemValue);
  }        
    if(getorderlist){
      getorderlist.filter(itm=>  itm.product_id && itm.product_id== productID).map(prd=>{
        console.log("prd",prd)
        shortdesc=prd.shortDescription
      })
    }
  return shortdesc
  
}
function getDiscountPerItem(data,type,productID){
  var discountDetail;
  var getorderlist = "";
  var _data;
  if(type !=='activity'){
     _data=data.meta_datas && data.meta_datas[0]
     getorderlist= _data && _data._order_oliverpos_product_discount_amount
  }else{
    _data = data.meta_datas && data.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount') ;
    getorderlist= _data && _data.ItemValue && JSON.parse(_data.ItemValue);
  }        
    if(getorderlist){
      getorderlist.filter(itm=>  itm.product_id && (itm.variation_id== productID || itm.product_id== productID)).map(prd=>{
       // console.log("prd",prd)
        var typeRate=0;
        if(prd.discount_type== "Number"){
          var disPerc= ( prd.new_product_discount_amount*100)/prd.Price
          typeRate= disPerc.toFixed(2)
        }else{ 
          typeRate=prd.new_product_discount_amount
        }
        discountDetail={
        "discountApply" : typeRate,
         "discountAmount":(prd.product_discount_amount* (prd.discount_type=="Number"?1: prd.quantity)),
        "discounttype":prd.discount_type,
        "discountCart":prd.discountCart
       }
      })
    }
  return discountDetail
  
}
function calculateTaxRate(totalAmount, itemvalue){
  return  Math.round(((itemvalue)*100)/totalAmount,0)
}

// }
export const PrintPage = {
  PrintElem
};
var RoundAmount = (val) => {

  return Math.round(val * 100) / 100;
  //var decimals = 2;
  //return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}
//
var currentWidth = screen.width;
function PrintElem(data, getPdfdateTime, isTotalRefund, cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, redeemPointsToPrint,appResponse) {
  console.log("------------------data------------",data)

 var displayExtensionAppData;
  if(appResponse){
    // var appdata= JSON.parse(appResponse);
     if(appResponse && appResponse.command && appResponse.command=='DataToReceipt')
    displayExtensionAppData=appResponse;

    console.log("prinData",displayExtensionAppData)
  }
  //console.log("Data", data);

 
  // var groupSaleName =  data.meta_datas ?  data.meta_datas.find(data => data.ItemName == '_order_oliverpos_group_name') : null;
  // var groupSaleSlug =  data.meta_datas ?  data.meta_datas.find(data => data.ItemName == '_order_oliverpos_group_slug') : null;
  var groupSaleLabel =""
  if( type=="activity"){
    var item= data.meta_datas && type=="activity" ?  data.meta_datas.find(data => data.ItemName == '_order_oliverpos_group_label') :null;
    if(item)
    groupSaleLabel=item.ItemValue;
  }else{
    groupSaleLabel= data.meta_datas && data.meta_datas[0]._order_oliverpos_group_label? data.meta_datas[0]._order_oliverpos_group_label:"";
  }
   
                                                               
 

  var realWidth = 250;
  if (currentWidth < 250) { realWidth = "90%"; }
  else { realWidth = "250px"; }
  var isDemoUser = localStorage.getItem('demoUser');
  var demoUserName = Config.key.DEMO_USER_NAME;
  var redeemPointsForActivity = redeemPointsToPrint ? +redeemPointsToPrint.match(/\d+/) : 0
  var taxrate_name = "";
  var site_name = '';
  var address;
  // var decodedString = localStorage.getItem('sitelist');
  // var decod = decodedString ? window.atob(decodedString) : '';
  // var siteName = decod && decod != '' ? JSON.parse(decod) : '';
  var _tipAmount=0;
  var _tipLable='';
  var taxInclusiveName=getInclusiveTaxType(data.meta_datas);
  var siteName = localStorage.getItem('clientDetail') && JSON.parse(localStorage.getItem('clientDetail'));
  var udid = get_UDid('UDID');
  var register_id = localStorage.getItem('register')
  var location_name = localStorage.getItem('UserLocations') ? JSON.parse(localStorage.getItem('UserLocations')) : '';
  var currentUserLocation = localStorage.getItem('Location') ? localStorage.getItem('Location') : '';
  var manager = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
  var order_reciept = localStorage.getItem('orderreciept') && localStorage.getItem('orderreciept') !== 'undefined' ? JSON.parse(localStorage.getItem('orderreciept')) : "";
  var selectedRegister = localStorage.getItem('selectedRegister') && localStorage.getItem('selectedRegister') !== 'undefined' ? JSON.parse(localStorage.getItem('selectedRegister')) : "";
  var LocalLocationName = localStorage.getItem('LocationName')
  var payment_TypeName = (typeof localStorage.getItem('PAYMENT_TYPE_NAME') !== 'undefined') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : null
  var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : '';
 
  
if(data.orderCustomerInfo)
  var labelCustomerName = '';
  if(order_reciept && order_reciept.CustomerNameLabel && order_reciept.CustomerNameLabel !== '')
  {
    labelCustomerName = order_reciept.CustomerNameLabel
  }else{
    labelCustomerName ="Customer Name"
  }

  var labelCustomerAddress = '';
  if(order_reciept && order_reciept.CustomerAddressDisplayLabel && order_reciept.CustomerAddressDisplayLabel !== '')
  {
    labelCustomerAddress = order_reciept.CustomerAddressDisplayLabel
  }else{
    labelCustomerAddress ="Customer Address"
  }
 

  var labelTotalDiscount = '';
  if(order_reciept && order_reciept.DiscountDisplayLabel && order_reciept.DiscountDisplayLabel !== '')
  {
    labelTotalDiscount = order_reciept.DiscountDisplayLabel
  }else{
    labelTotalDiscount ="Total Discount"
  }
 
  var labelsubTotal = '';
  if(order_reciept && order_reciept.SubTotalDisplayLabel && order_reciept.SubTotalDisplayLabel !== '')
  {
    labelsubTotal = order_reciept.SubTotalDisplayLabel
  }else{
    labelsubTotal ="Sub Total"
  }
 
  var labelTableNumber = '';
  if(order_reciept && order_reciept.TableNumberDisplayLabel && order_reciept.TableNumberDisplayLabel !== '')
  {
    labelTableNumber = order_reciept.TableNumberDisplayLabel
  }else{
    labelTableNumber ="Table Number"
  }

  var labelDateDisplay = '';
  if(order_reciept && order_reciept.DateDisplayLabel && order_reciept.DateDisplayLabel !== '')
  {
    labelDateDisplay = order_reciept.DateDisplayLabel
  }else{
    labelDateDisplay ="Date"
  }
 
  var labelSale = '';
  if(order_reciept && order_reciept.SaleDisplayLabel && order_reciept.SaleDisplayLabel !== '')
  {
    labelSale = order_reciept.SaleDisplayLabel
  }else{
    labelSale ="Sale"
  }
 
  var labelServed = '';
  if(order_reciept && order_reciept.ServedByDisplayLabel && order_reciept.ServedByDisplayLabel !== '')
  {
    labelServed = order_reciept.ServedByDisplayLabel
  }else{
    labelServed ="Served By"
  }
  var labelTaxId = '';
  if(order_reciept && order_reciept.TaxIdText && order_reciept.TaxIdText !== '')
  {
    labelTaxId = order_reciept.TaxIdText
  }else{
    labelTaxId =LocalizedLanguage.taxId
  }
  
  var labelTax = '';
  if(order_reciept && order_reciept.TaxDisplayLabel && order_reciept.TaxDisplayLabel !== '')
  {
    labelTax = order_reciept.TaxDisplayLabel
  }else{
    labelTax ="Tax"
  }
// var _rateRate=0.0;
//   TotalTaxByName && TotalTaxByName.map(name => {_rateRate+= parseFloat(name.TaxRate)})
//   labelTax += order_reciept.PercentageTaxOfEntireOrder ==true? "("+_rateRate.toFixed(0)+"%)":""
 

  var labelTime = '';
  if(order_reciept && order_reciept.TimeDisplayLabel && order_reciept.TimeDisplayLabel !== '')
  {
    labelTime = order_reciept.TimeDisplayLabel
  }else{
    labelTime ="Time"
  }
 
  var labelTotalOrder = '';
  if(order_reciept && order_reciept.TotalDisplayLabel && order_reciept.TotalDisplayLabel !== '')
  {
    labelTotalOrder = order_reciept.TotalDisplayLabel
  }else{
    labelTotalOrder =LocalizedLanguage.total
  }

 
  if(order_reciept && order_reciept.TipsDisplayLabel && order_reciept.TipsDisplayLabel !== '')
  {
    _tipLable = order_reciept.TipsDisplayLabel
  }


  var _returnPolicyText = '';
  if(order_reciept && order_reciept.ReturnpolicyText && order_reciept.ReturnpolicyText !== '')
  {
    _returnPolicyText = order_reciept.ReturnpolicyText
  }else{
    _returnPolicyText ="";
  }



  
  //for Android Print-----
  var receipt='\n';
  var PrintAndroidReceiptData={};
  var PrintAndroidData=[]
  var rowNumber=0;
 //---------------- 
  
  var baseurl = "";
  var shopName="";
  var gmtDateTime = '';
  var time ="";
  var receiptId="";
  var servedBy="";
  var customershow_name = '';
  var CustomerAddress="";
  var taxId=""
  var registerName=""
  var locationName=""
  var customeText=""

  PrintAndroidReceiptData["print_type"]=  type == 'activity'?'activity':"create-order";
  // PrintAndroidReceiptData["register_id"]: 1,
  // PrintAndroidReceiptData["location_id"]: 1,
  if(order_reciept.ShowLogo == true){
    if(order_reciept.CompanyLogo && order_reciept.CompanyLogo !==null){
    baseurl =  Config.key.RECIEPT_IMAGE_DOMAIN + order_reciept.CompanyLogo ;
    baseurl = baseurl != "" ? encodeURI(baseurl) : "";
    }
    receipt+="----------"+baseurl+"\n";
    PrintAndroidReceiptData['logo_img']=order_reciept.CompanyLogo; 
  }

  shopName= data && data.ShopName ? data.ShopName : manager && manager.shop_name;
  receipt+="----------"+shopName+"\n";
  PrintAndroidReceiptData['logo_text']=shopName;

  PrintAndroidReceiptData['print_slip_size']=pageSize.width;
  var printerIds=[]
  var printersList = localStorage.getItem('cloudPrinters') ? JSON.parse(localStorage.getItem('cloudPrinters')) : []
   printersList && printersList.content && printersList.content.map(item=> {
     printerIds.push(item.Id);
   })
  
  PrintAndroidReceiptData['printer_ids']=printerIds; 
  
  if(order_reciept.ShowDate == true)
  {
    gmtDateTime = FormateDateAndTime.formatDateAndTime(oprationalDate, data.time_zone);
    gmtDateTime = moment(gmtDateTime).format(ActiveUser.key.orderRecieptDateFormate)

    var ckdateisValid = false
    if (gmtDateTime !== null && gmtDateTime !== undefined) {
      ckdateisValid = moment(gmtDateTime).isValid();
      if (ckdateisValid == false) {
        var currentdate = new Date;
        gmtDateTime = FormateDateAndTime.formatDateAndTime(currentdate, data.time_zone);
        gmtDateTime = moment(gmtDateTime).format(ActiveUser.key.orderRecieptDateFormate)
      }
    }
    receipt+=(order_reciept.DateDisplayLabel)+": "+gmtDateTime +"\n";   
    PrintAndroidData.push({ "rn": rowNumber,"cms": 1,"c1": labelDateDisplay+": "+gmtDateTime,"c2": "","c3": "", "bold": "0,0,0","fs": "24","alg": "0"}); 
  }
  if(order_reciept.ShowTime == true)
  {
   
    if(data.time_zone)
     time=FormateDateAndTime.formatDateWithTime(data.date_time, data.time_zone);
     else
     time=FormateDateAndTime.formatDateWithTime(data.order_date);//date_time

    receipt+="Time: "+time+"\n";
    rowNumber +=1;
    PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":"Time: "+time,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
  }
  if(order_reciept.ShowSale == true )
  {
    receiptId= data.OliverReciptId ? data.OliverReciptId : tempOrderId?tempOrderId:"";
    receipt+= (labelSale?labelSale:"").trim()+": #"+receiptId+"\n";
    rowNumber +=1;
    PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":(labelSale?labelSale:"").trim()+": #"+receiptId,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
  }
 
  if(order_reciept.ShowServedBy == true)
  {
      servedBy=isDemoUser ? demoUserName : manager && manager.display_name ? manager.display_name:"";
      if(servedBy){
        receipt+=(labelServed?labelServed:"") +": "+servedBy+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":labelServed+": "+servedBy,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
     }
  }
  if(order_reciept.ShowCustomer==true)
  {
    if (order_reciept.CustomerNameLabel !== null && order_reciept.CustomerNameLabel !== undefined && order_reciept.ShowCustomer == true) {
      if (data.orderCustomerInfo !== null && data.orderCustomerInfo !== undefined) // case of activity view
      {
        customershow_name = data.orderCustomerInfo.customer_name && data.orderCustomerInfo.customer_name !== undefined && data.orderCustomerInfo.customer_name.trim() !== "" ? data.orderCustomerInfo.customer_name
          : data.orderCustomerInfo.customer_email && data.orderCustomerInfo.customer_email.trim() != "" ? data.orderCustomerInfo.customer_email : ''
  
      }
      else if (data.customerDetail !== null && data.customerDetail !== undefined && data.customerDetail.content && data.customerDetail.content !== undefined)// case of order create 
      {      
        customershow_name = data.customerDetail.content.FirstName && data.customerDetail.content.FirstName !== undefined ?
          data.customerDetail.content.FirstName + " " + data.customerDetail.content.LastName
          : data.customerDetail.content.Email !== null && data.customerDetail.content.Email !== undefined ? data.customerDetail.content.Email : ''
       }
    }
    if(customershow_name !==""){
      receipt+=(labelCustomerName).trim()+": "+customershow_name+"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":labelCustomerName+": "+customershow_name,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
      }
  }
  if(order_reciept.ShowCustomerAddress==true)
  {
    if (order_reciept.CustomerNameLabel !== null && order_reciept.CustomerNameLabel !== undefined && order_reciept.ShowCustomer == true) {
      if (data.orderCustomerInfo !== null && data.orderCustomerInfo !== undefined) // case of activity view
      {
       CustomerAddress= data.orderCustomerInfo.customer_address+ " "+data.orderCustomerInfo.customer_city+" " +data.orderCustomerInfo.customer_State+" " +data.orderCustomerInfo.customer_Country+ " "+data.orderCustomerInfo.customer_post_code;
      }
      else if (data.customerDetail !== null && data.customerDetail !== undefined && data.customerDetail.content && data.customerDetail.content !== undefined)// case of order create 
      { 
        CustomerAddress= data.customerDetail.content.StreetAddress+ " "+data.customerDetail.content.City+ " "+data.customerDetail.content.Pincode;
      }
    }
     if(CustomerAddress !==""){
      receipt+=labelCustomerAddress+": "+CustomerAddress+"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":labelCustomerAddress+": "+CustomerAddress,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
       }
  }
 if(order_reciept.ShowTaxId==true && order_reciept.TaxId)
 {
   taxId=order_reciept.TaxId ? order_reciept.TaxId : '';
   if(taxId !==""){
    receipt+= (labelTaxId?labelTaxId:"") +": "+ taxId+"\n";
    rowNumber +=1;
    PrintAndroidData.push({"rn":rowNumber,"cms":1,"c1":(labelTaxId?labelTaxId:"")+": "+taxId,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
   } 
  }
 
  if(order_reciept.ShowRegisterDetails==true)
  {
    registerName=window.location.pathname !== '/salecomplete' ?  data.RegisterName  : selectedRegister.name;
      if(registerName!==""){      
        receipt+= LocalizedLanguage.register+": "+registerName+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":LocalizedLanguage.register+": "+registerName,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
      }    
  }
  if(order_reciept.ShowLocationDetails==true)
  {
    locationName=window.location.pathname !== '/salecomplete' ?data.LocationName : LocalLocationName ;
    if(locationName !==""){
      receipt+= LocalizedLanguage.location+": "+locationName +"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":LocalizedLanguage.location+": "+locationName,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
    }      
  }
  receipt+="-----------------------------------"+"\n";
  rowNumber +=1;
  PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 

if(order_reciept.ShowCustomText)
  {
      customeText= order_reciept.CustomText == "*CUSTOM TEXT HERE*" ? "" : order_reciept.CustomText;
      if(customeText !==""){
        receipt+=order_reciept.CustomText+"\n" ;
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":order_reciept.CustomText,"c2":"","c3":"","bold":"1,1,1","fs":"24","alg":"1"}); 
      }     
  }



 // if (order_reciept.ShowTotalTax == true) {
    TotalTaxByName && TotalTaxByName.map(name => {
      taxrate_name += name.tax_amount > 0 ? `<tr>
      <td class="total-line" style="text-align:left;">Tax ${ order_reciept.PercentageTaxOfEntireOrder ==true? "("+name.TaxRate+")":""}</td>
      <td class="total-line" style="text-align:left;">${name.tax_name}</td>
    <td class="total-value" style="text-align:right;"> ${(name.tax_amount).toFixed(2)}</td></<tr>` : ``
    })
 // }
  // ${taxrate_name !== "" ? taxrate_name : ''}
  if (siteName && siteName.subscription_detail && siteName.subscription_detail !== '') {
    if (siteName.subscription_detail.udid == udid) {
      site_name = siteName.subscription_detail.host_name && siteName.subscription_detail.host_name != undefined && siteName.subscription_detail.host_name.trim() !== 'undefined' ? siteName.subscription_detail.host_name : ""
    }
  }

  location_name && location_name.map(item => {
    if (item.id == currentUserLocation) {
      address = item;
    }
  })
  

  var subtotal = null;
  if (data && order_reciept.ShowSubTotal==true) {
    if (type == 'activity') {
      subtotal = parseFloat(parseFloat((data.total_amount - data.refunded_amount)) - parseFloat((taxInclusiveName ==''?data.total_tax:0) - data.tax_refunded)).toFixed(2);
    } else {
      subtotal = data && data.subTotal ? parseFloat(RoundAmount(parseFloat(data.subTotal) +(taxInclusiveName !==''?data.tax:0 ) )).toFixed(2) : '0.00'
    }
  }
  var refundpayments = data ? data.order_Refund_payments : '';
  var barcode_image = order_reciept.AddBarcode == true ? Config.key.RECIEPT_IMAGE_DOMAIN + "/Content/img/ic_barcode.svg" : ''
  
  var oprationalDate = null
  if (data !== null && data.date_time !== undefined && Reflect.has(data, data.date_time)) {
    oprationalDate = data.date_time;
  }
  else {
    oprationalDate = data.create_date;
  }

  
  var displayRefundPayment = '';
  var refundPay = '';
  var isPaymentCash=false;
  refundpayments && refundpayments.map((item, index) => { 
  //CHECK FOR THE CASH PAYMENT----
  if(item.type && item.amount>0)
    {
        if(item.type==="cash")
        {
            isPaymentCash=true;
        }
    }

    var localDate = FormateDateAndTime.formatDateAndTime(item.payment_date, data.time_zone)
    var paytype = payment_TypeName.filter(itm => { return itm.Code == item.type })
    var paymentName = item.type !== "store-credit" ? paytype && paytype.length > 0 ? paytype[0].Name : item.type ? item.type : '' : 'store-credit';
    refundPay = refundPay + ' <tr><td >' + paymentName + "(" + localDate + ')</td>'
      + '<td class="total-value balance" colspan="2"><div class="due" align="right">' + item.amount.toFixed(2) + '</td></tr> '
  })
  if(refundPay !=''){
    displayRefundPayment = '<table class="item-details-total" style="margin-top:0"><tbody><tfoot>';
    displayRefundPayment +='<tr><td colspan="2">Refund Payments</td></tr>' +refundPay;
    displayRefundPayment +='<tr><td colspan="2"><div class="double-border"></div></td></tr></tfoot></tbody></table>';
  }
 

  var displayPayments =""
  var order_payments = data && data.order_payments ? data.order_payments : orderList ? orderList : [];
  order_payments && order_payments.map((item, index) => {
    if (item.type !== null && item.amount !== 0) {
      // var gmtDateTime = moment.utc(item.payment_date)
      // var localDate = gmtDateTime.local().format(Config.key.DATE_FORMAT);
    var _emvData=''
     if(item.description && item.description !==""){
       try{
            var _desc= JSON.parse(item.description);
            for (var key in _desc) {
              console.log(key);
              console.log(_desc[key]);
              _emvData +=`<tr><td>${key}</td><td align="right">${_desc[key]}</td></tr>`
          }
        if(_emvData !==''){
          _emvData='<table class="item-details-total" style="margin-top:0"><tbody>'+_emvData+'</tbody></table>'
        }
       }catch(e){
         console.log(e)
       }
       
     } 

      var localDate = FormateDateAndTime.formatDateAndTime(item.payment_date, data.time_zone)
      var paytype = payment_TypeName.filter(itm => { return type == 'activity' ? itm.Code == item.type ? itm.Name : '' : item.payment_type && itm.Code == item.payment_type ? itm.Name :'' })
      var paymentName = type == 'activity' ? item.type !== "store-credit" ? paytype && paytype.length > 0 ? paytype[0].Name : item.type ?item.type :'' : 'store-credit' : item.payment_type && item.payment_type !== "store-credit" ? paytype && paytype.length > 0 ? paytype[0].Name : item.payment_type ? item.payment_type : '' : 'store-credit';
      //  var paymentName= paytype && paytype.length > 0 ? paytype[0].Name :''
      var amount = type == 'activity' ? item.amount ? item.amount.toFixed(2) : '0.00' : item.payment_amount ? parseFloat(RoundAmount(item.payment_amount)).toFixed(2) : '0.00';
      displayPayments += ' <tr><td>' + paymentName + '(' + localDate + ')</td><td align="right">' + amount.toString() + '</td></tr> '
        displayPayments+= ' <tr><td colspan="2">' + _emvData+ '</td></tr> ';

        
    }
  })
 
  // cash change payment
  var GTM_ORDER = localStorage.getItem('GTM_ORDER') ? JSON.parse(localStorage.getItem('GTM_ORDER')) : null
  var cashChange = ''
  var cashPayment = ''
  var cashOrderData = ''
  if (type == 'activity') {
    var metaData = data && data.meta_datas ? data.meta_datas : [];
    metaData && metaData.map((metaData, index) => {
      if (metaData.ItemName == '_order_oliverpos_cash_change') {
        cashOrderData = metaData.ItemValue && metaData.ItemValue !== '' ? metaData.ItemValue : ''
      }
    })
    if (cashOrderData && cashOrderData !== '') {
      cashOrderData = JSON.parse(cashOrderData)
      cashChange = cashOrderData.change
      cashPayment = cashOrderData.cashPayment
    }
  }

  if (type !== 'activity' && GTM_ORDER) {
    GTM_ORDER.order_meta && GTM_ORDER.order_meta.map((meta) => {
      if (meta._order_oliverpos_cash_change) {
        cashChange = meta._order_oliverpos_cash_change.change
        cashPayment = meta._order_oliverpos_cash_change.cashPayment
      }
    })
  }
  if (cashChange && cashChange !== '' && cashPayment !== '') {
    displayPayments += '<tr><td> Change  </td><td align="right">' + parseFloat(RoundAmount(cashChange)).toFixed(2) + '</td></tr>'+
      '<tr><td> Cash Payment </td><td align="right">' + parseFloat(RoundAmount(cashPayment)).toFixed(2) + '</td></tr>'
  }
  if(displayPayments !==""){
    displayPayments='<table class="item-table" style="margin-top:0"><tbody><tr><td colspan="2"><div class="double-border"></div></td></tr><tfoot>'
                    +displayPayments;
    displayPayments += '<tr><td colspan="2"><div class="double-border"></div></td></tr></tfoot></tbody></table>';

  }
   var Order_subTotal=0.0;
  var Total_IndividualProductDiscount=0.0;
  var Order_cartDiscount;
  var order_totalTaxPercent=""
// var _rateRate=0.0;
//   TotalTaxByName && TotalTaxByName.map(name => {_rateRate+= parseFloat(name.TaxRate)})
//   labelTax += order_reciept.PercentageTaxOfEntireOrder ==true? "("+_rateRate.toFixed(0)+"%)":""
 


  var item_detail = data.line_items ? data.line_items : data.ListItem
  var lineItem = '';
  
  item_detail && item_detail.filter(u => !u.extention_custom_id ).map(item => { //Remove tip item into itemlist
    if( item.Title && item.Title.includes('Tip')){
      //ekip tip
      _tipAmount +=item.Price ? parseFloat(item.Price):0;
     // _tipLable=item.Title;
    }
    else{

        var itemName = stripHtml(item.name ? item.name : item.Title)
        var skuName = item.sku && item.sku !== "N/A" && item.sku !== undefined ? 'SKU <br/>' + item.sku + ' <br/>' : item.Sku && item.Sku !== "N/A" && item.Sku !== undefined ? 'SKU <br/>' + item.Sku + ' <br/>' : '';
        var skuName_android = item.sku && item.sku !== "N/A" && item.sku !== undefined ? 'SKU ' + item.sku + '' : item.Sku && item.Sku !== "N/A" && item.Sku !== undefined ? 'SKU ' + item.Sku + '' : '';
      
   
            var lineitem_taxType = []
            var itemvalue = item.Taxes && item.Taxes !==null &&  item.Taxes !=="" ? (type !== 'activity') ? item.Taxes:JSON.parse(item.Taxes).total:""
           var taxRate= JSON.parse(localStorage.getItem("SHOP_TAXRATE_LIST") )
           var TotalTax=0  
           if(type == 'activity') { // for activity
                  itemvalue !="" && Object.keys(itemvalue).map(key=>{
                  var taxvalue=itemvalue[key];          
                  data.order_taxes && data.order_taxes.map(tm=>{
                 // taxRate && taxRate.map(tm=>{
                        if(tm.RateId==key){  
                          var taxname= tm.Title; //tm.TaxName;  
                         var TaxRate= calculateTaxRate(parseFloat(item.price * item.quantity), parseFloat(taxvalue));
                          if(order_reciept ){
                            if( order_reciept.PercentageTaxPerItem==true){
                              taxname+="("+TaxRate+"%)";
                            }
                            TotalTax +=parseFloat(TaxRate)
                          }                
                          lineitem_taxType.push({"tax":taxname,"value":taxvalue})
                        }
                      })
                })
            }else{//for sale complete
                  itemvalue !="" && itemvalue.map(myObj=>{
                    var taxvalue=""
                    var key=""
                    for (const x in myObj) {
                      key=x;
                      taxvalue = myObj[x]
                    }             
                    taxRate && taxRate.map(tm=>{
                          if(tm.TaxId==key){ 
                            var taxname= tm.TaxName;  
                            if(order_reciept && order_reciept.PercentageTaxPerItem==true){
                              taxname+="("+tm.TaxRate+")"
                               }
                               TotalTax +=parseFloat(tm.TaxRate)
                                         
                            lineitem_taxType.push({"tax":taxname,"value":taxvalue})
                          }
                        })
                  })
                }
          order_totalTaxPercent= TotalTax !==0 ? "("+TotalTax.toFixed(0)+"%)" :"" 
          var lineItem_DiscountDetail=  getDiscountPerItem(data,type,item.product_id)
          var lineitem_AcutalPrice = parseFloat(item.subtotal? item.subtotal: item.subtotalPrice? item.subtotalPrice: item.Price?item.Price:0)+
                                      (taxInclusiveName !==''? type=='activity'?item.total_tax: (item.totaltax?item.totaltax:0):0)
                                      //-(taxInclusiveName ==''? type=='activity'?item.total_tax: (item.totaltax?item.totaltax:0):0); //in case of exclusive tax,remove tax from sub total to display actual price

          var lineitem_Title=(type !== 'activity') ? itemName : showTitle(item) !== "" ? itemName : ''
          var lineitem_TotalQty=  (item.quantity_refunded < 0 || isTotalRefund == true && item.quantity_refunded == item.quantity) ? isTotalRefund == true && item.quantity_refunded == item.quantity ? 0 : item.quantity + item.quantity_refunded:item.quantity;
          var lineitem_refundedQty=item.quantity_refunded ?item.quantity_refunded:null
          
          //----- refunded qty tax amount--------------
          var refundedTax=item.amount_refunded>0?((item.subtotal_tax/item.quantity)* item.quantity_refunded) *-1 :0;
          var lineitem_refundAmount=  (parseFloat(item.amount_refunded) 
                                    + (type=='activity'?parseFloat((isTotalRefund == true?item.total_tax:refundedTax))
                                        : (item.totaltax?parseFloat(item.totaltax):0)
                                    ))
          
         // var lineitem_refundAmount=  (parseFloat(item.amount_refunded) + (taxInclusiveName !==''? type=='activity'?parseFloat((isTotalRefund == true?item.total_tax:refundedTax)): (item.totaltax?parseFloat(item.totaltax):0):0))
          
          var lineitem_sku= order_reciept.ShowSKU == true ? skuName : null       
          var lineitem_subTitle=(type == 'activity') ? item.meta && item.meta !=='[]' ? CommonJs.showAddons(type, JSON.parse(item.meta)) :'' 
                                          :(item && item.addons_meta_data) ? CommonJs.showAddons(type, item.addons_meta_data)
                                                                        :(productxList && productxList.length > 0) && showProductxSubTitle(item.product_id, AllProductList) ? showProductxSubTitle(item.product_id, AllProductList) 
                                                                                                                                                                              : showSubTitle(item) !== "" ? itemName : ''
          
          var lineitem_Discount= lineItem_DiscountDetail && lineItem_DiscountDetail.discountAmount? lineItem_DiscountDetail.discountAmount:0;
          Total_IndividualProductDiscount +=lineitem_Discount;
           if(lineItem_DiscountDetail && lineItem_DiscountDetail.discountCart)
            { Order_cartDiscount= lineItem_DiscountDetail.discountCart}
          //item.discount_amount && item.discount_amount !==0? (item.discount_amount).toFixed(2):undefined         
         
          var lineitem_Dis_Percent= lineItem_DiscountDetail && lineItem_DiscountDetail.discountApply && "("+ lineItem_DiscountDetail.discountApply+"%)";
          //order_reciept.PercentageDiscountPerItem==true ? "(" +Math.round(((item.discount_amount *100)/lineitem_AcutalPrice)).toFixed(0)+"%)":"";
          var lineItemTax="";         
          (order_reciept.IndividualizedTaxAmountPerItem==true || order_reciept.PercentageTaxPerItem==true) &&  lineitem_taxType && lineitem_taxType.length>0 ?lineitem_taxType.map(txtitem=>{
              lineItemTax+= `<tr><td>${txtitem.tax}</td><td align="right">${ parseFloat(txtitem.value).toFixed(2)}</td></tr>`;
               }):""
              var _lineitemTax =(taxInclusiveName !=='' || order_reciept.IndividualizedTaxAmountPerItem==true? item.total_tax?item.total_tax: item.totaltax?item.totaltax:0:0)            
              
      var _activitylineItemTotal=(item.amount_refunded > 0 && item.quantity+item.quantity_refunded == 0) ?parseFloat(item.total - item.amount_refunded-lineitem_Discount) 
                                          : 
                                          (data.discount != 0 && item.total !== 0 && item.subtotal != item.total) ?  parseFloat(item.subtotal- (taxInclusiveName !=='' ?(isTotalRefund == true?item.total_tax:refundedTax) :0)-lineitem_Discount).toFixed(2) 
                                          : parseFloat(item.total+(taxInclusiveName !=='' ?_lineitemTax:0)- lineitem_Discount-item.amount_refunded-(taxInclusiveName !=='' ?refundedTax:0) )   
              var lineitem_Total= type == 'activity' ?_activitylineItemTotal                                                             
                                       // parseFloat(item.subtotal+ (taxInclusiveName !=='' ?item.total_tax :0)-lineitem_Discount).toFixed(2) : parseFloat(item.subtotal+ (taxInclusiveName !=='' ?item.total_tax :0)-lineitem_Discount)         
                                    :
                                    (item.product_id ?   parseFloat(parseFloat(item.subtotalPrice?item.subtotalPrice:0) - parseFloat(lineitem_Discount)+ (item.totaltax?parseFloat((_lineitemTax)):0) )//(taxInclusiveName !==''? (item.totaltax?item.totaltax:0):0) ))
                                    : item.Price ? parseFloat(parseFloat(item.Price) - parseFloat(lineitem_Discount)+ (item.totaltax?parseFloat((_lineitemTax)):0) )//(taxInclusiveName !==''? (item.totaltax?item.totaltax:0):0) ))
                                      :0
                                     // item.product_id ? data.discountCalculated == 0 || data.redeemedAmountToPrint == data.discountCalculated ?parseFloat(RoundAmount(parseFloat(item.totalPrice)+(taxInclusiveName ==''?item.totaltax:0) )).toFixed(2) :
                                            
                                          //: item.Price ? parseFloat(RoundAmount(parseFloat(item.Price)+(taxInclusiveName ==''?item.totaltax:0))).toFixed(2) : ''
                                    )
        Order_subTotal += parseFloat(lineitem_Total);    
      
    //======For Android print===============================       
        var lineitem_shortDesc=  getProductShortDesc(data,type,item.product_id)
        receipt+=lineitem_TotalQty+"  "+lineitem_Title+" "+lineitem_AcutalPrice.toFixed(2)+"\n";
        rowNumber +=1;
        if(lineitem_TotalQty && typeof lineitem_TotalQty!="undefined")
        {
          PrintAndroidData.push({"rn": rowNumber,"cms":3,"c1":lineitem_TotalQty.toString(),"c2":lineitem_Title,"c3":lineitem_AcutalPrice.toFixed(2).toString(),"bold":"0,0,0","fs":"24","alg":"0,1,2"}); 
        }
        else
        {
          PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":lineitem_Title,"c2":lineitem_AcutalPrice.toFixed(2).toString(),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
        }
        
        /* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */
        if(item.psummary && typeof item.psummary!="undefined" &&item.psummary!="")
        {
          PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":item.psummary,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
        }
        if(item.ProductSummery && typeof item.ProductSummery!="undefined" && item.ProductSummery!="")
        {
          PrintAndroidData.push({"rn": rowNumber++,"cms":1,"c1":item.ProductSummery.toString(),"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
        }
        
        if(order_reciept.ShowSKU==true ){
          receipt+=skuName_android+"\n";
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1": skuName_android,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
        }
        if(order_reciept.ShowShortDescription==true ){
          receipt+="Description: "+lineitem_shortDesc+"\n";
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":"Description: "+ lineitem_shortDesc,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
        }
        if(lineitem_Discount ){
          receipt+="\nItem Discount:"+ lineitem_Dis_Percent +lineitem_Discount.toFixed(2)+"\n";
          receipt+="-----------------------------------"+"\n";      
          rowNumber +=1;    
          PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":"Item Discount:"+lineitem_Dis_Percent,"c2":lineitem_Discount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
        }
        else
        {
            receipt+="-----------------------------------"+"\n";
            rowNumber +=1;
            PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
        }

        if(order_reciept.IndividualizedTaxAmountPerItem==true)
        {
          lineitem_taxType && lineitem_taxType.length>0 && lineitem_taxType.map(txtitem=>{
            receipt+= txtitem.tax+parseFloat(txtitem.value).toFixed(2)+"\n";
            rowNumber +=1;
            PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":txtitem.tax,"c2":parseFloat(txtitem.value).toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
            })
        }
        if(item.quantity_refunded && item.quantity_refunded !=0){
          receipt+= lineitem_refundAmount.toFixed(2)+"\n";
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":"Refund","c2": lineitem_refundAmount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});          
        }
        // receipt+="-----------------------------------"+"\n";
        // rowNumber +=1;
        // PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
       
        if((order_reciept.IndividualizedTaxAmountPerItem == true || order_reciept.PercentageTaxPerItem == true  ||  order_reciept.PercentageDiscountPerItem == true || order_reciept.AmountDiscountPerItem == true   || order_reciept.ShowTotalAmountPerItem == true) && lineitem_TotalQty && typeof lineitem_TotalQty!="undefined")
        {
          receipt+="Product Total   "+ parseFloat(lineitem_Total).toFixed(2)+"\n\n";
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":"Product Total","c2":parseFloat(lineitem_Total).toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
        }
        order_reciept.IndividualizedTaxAmountPerItem==true &&  lineitem_taxType && lineitem_taxType.length>0  && lineitem_taxType.map(txtitem=>{
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":txtitem.tax,"c2":parseFloat(txtitem.value).toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
        })
        //======End For Android print===============================

        lineItem += `<table class="item-table">
                <tbody><tr>
                  <td>${lineitem_TotalQty? `<div class="item-quantity"> ${lineitem_TotalQty}</div>`:''} ${lineitem_Title}</td>
                  <td align="right">${lineitem_AcutalPrice.toFixed(2) }</td>
                </tr>
                ${item.psummary && typeof item.psummary!="undefined" && item.psummary!=""?`<tr><td style="text-transform: capitalize;font-size:10px;">${item.psummary}</td></tr>`:``}
                ${item.ProductSummery && typeof item.ProductSummery!="undefined" && item.ProductSummery!=""?`<tr><td style="text-transform: capitalize;font-size:10px;">${item.ProductSummery.toString()}</td></tr>`:``}
                <tr>
                  <td>
                      <div class="item-addon-items">
                      ${lineitem_sku && order_reciept.ShowSKU==true ? `<p>${lineitem_sku && lineitem_sku} </p>`:``}
                       ${order_reciept.ShowShortDescription==true && lineitem_shortDesc  && lineitem_shortDesc !==""?`<p> ${lineitem_shortDesc} </p>`:``}                        
                       ${lineitem_subTitle && lineitem_subTitle !==""?`<p>${ lineitem_subTitle} </p>`:``}
                       </div>
                  </td>
                  <td ></td>
                </tr> `
                   
        lineItem += (order_reciept.PercentageDiscountPerItem == true || order_reciept.AmountDiscountPerItem == true ) && lineitem_Discount ? `<tr>
                        <td colspan="2">
                            <div class="item-subaddon">
                                <table>
                                      <tfoot>
                                      <tr>
                                          <td>Item Discount ${order_reciept.PercentageDiscountPerItem == true? lineitem_Dis_Percent:''}</td>
                                          <td align="right">-${lineitem_Discount.toFixed(2)}</td>
                                      </tr>
                                      </tfoot>
                                   
                                </table>
                            </div>        
                        </td>
                    </tr>`:''
    
    lineItem += lineItemTax ? `<tr>
                       <td colspan="2">
                           <div class="item-total-tax">
                                <table>
                               
                                ${ lineItemTax}
                              
                                </table>
                           </div>
                       </td>
                   </tr>`:``
    lineItem += item.quantity_refunded && item.quantity_refunded !=0 ? `<tr>
                   <td colspan="2">
                       <div class="item-total-tax">
                            <table>
                            <tbody>
                            <tr>
                                  <td>Refund</td>
                                  <td align="right">-${lineitem_refundAmount.toFixed(2)}</td>
                                </tr>
                            </tbody>
                            </table>
                       </div>
                   </td>
               </tr>`:``
                
          lineItem += (order_reciept.IndividualizedTaxAmountPerItem == true || order_reciept.PercentageTaxPerItem == true  ||  order_reciept.PercentageDiscountPerItem == true || order_reciept.AmountDiscountPerItem == true   || order_reciept.ShowTotalAmountPerItem == true) &&lineitem_TotalQty ? `</tbody>
                <tfoot>
                    <tr>
                        <td>
                            Product Total 
                        </td>
                        <td align="right">${ parseFloat(lineitem_Total).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>` :``
            
         
    }
  })

 var _CustomeFee = '<table class="item-table"><tbody>';
 var _CustomeFeeRow=""
 var _totalcustomeFee=0
  data.order_custom_fee && data.order_custom_fee.map((item_fee, index) => {
    if( item_fee.note && item_fee.note.includes('Tip')){
      //ekip tip
      _tipAmount +=item_fee.amount ? parseFloat(item_fee.amount):0;
      //_tipLable=item_fee.note;
    }
    else{    
      _CustomeFeeRow +=`<tr>
                    <td>${item_fee.note ? item_fee.note : ''}</td>
                    <td align="right">${item_fee.amount ? parseFloat(item_fee.amount).toFixed(2) : ''}</td>
                  </tr>
                  
                  `
      _totalcustomeFee +=parseFloat(item_fee.amount); 

      receipt+=item_fee.note+" "+parseFloat(item_fee.amount).toFixed(2)+"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":item_fee.note,"c2":parseFloat(item_fee.amount).toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
    }
  })
  Order_subTotal +=_totalcustomeFee;
  var customFeefooter=`<tfoot><tr><td>Product Total</td><td align="right">${ parseFloat(_totalcustomeFee).toFixed(2)}</td></tr></tfoot>`

   _CustomeFee =_CustomeFeeRow !=="" ? (_CustomeFee+_CustomeFeeRow+ customFeefooter+`</tbody></table>`):"";

  var _Notes = '<table class="item-table"><tbody>'
 var _notesdisp=""
  data.order_notes && data.order_notes.map((item_note, index) => {
    var parser = new DOMParser();
    var doc =parser.parseFromString(item_note.note?item_note.note:"", "text/html");
  
  _notesdisp +=  item_note.note.toLowerCase().match(/payment done with:/) ? ''
            : item_note.is_extension_note && item_note.is_extension_note == true  ? '' :
                `<tr>
                <td>${LocalizedLanguage.notes }</td>
                <td align="right">${  item_note.note ? doc.body.innerHTML : ''}
                          </td> 
                  </tr>` 
       //for android............
     if(! item_note.note.toLowerCase().match(/payment done with:/)  &&  ! (item_note.is_extension_note && item_note.is_extension_note == true) ){ 
      receipt+=LocalizedLanguage.notes + item_note.note ? item_note.note:''+"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1": "Notes "+LocalizedLanguage.notes + item_note.note ? item_note.note:'',"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
     }
    //---------------   
  })
    
    _Notes =_notesdisp==""?"": _Notes + _notesdisp+"</tbody></table>"
   
  var getorderlist = data.meta_datas ? data.meta_datas.find(data => data.ItemName == '_order_oliverpos_product_discount_amount') : null;
  var orderData = [];
  if (data.meta_datas !== null && data.meta_datas !== "" && getorderlist !== null) {
    getorderlist = getorderlist && getorderlist !== undefined && getorderlist.ItemValue && getorderlist.ItemValue !== undefined && JSON.parse(getorderlist.ItemValue);
    getorderlist && getorderlist.map((item, index) => {
      if (item.order_notes !== null) {
        item.order_notes && item.order_notes.map((item, index) => {
          if (item.is_customer_note !== undefined && item.is_customer_note !== null) { }
          else { orderData.push(item); }
        });
      } 
    });
  }

  var _PayNotes = '';
  orderData && orderData.map((item_note, index) => {
    _PayNotes += item_note.note.match(/Extension/) ?
      ''
      :
      ` <tr  class="item-row"> 
                  <td>Notes </td>
                 <td colspan="3" class="description">${item_note.note.match(/Extension/) ? ' ' : LocalizedLanguage.notes + item_note.note ? item_note.note : ''}
                 </td> 
        </tr>`
         //for android............
     if(! item_note.note.match(/Extension/)){ 
      receipt+=LocalizedLanguage.notes + item_note.note ? item_note.note : ''+"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":LocalizedLanguage.notes + item_note.note ? item_note.note : '',"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
     }
    //---------------
  })

  var payments = 0
  
  orderList && orderList.map((item, index) => {

    //CHECK FOR THE CASH PAYMENT----
    if(item.payment_type && item.payment_amount>0 && refundPay=="")
        {
            if(item.payment_type==="cash")
            {
                isPaymentCash=true;
            }
        }

    //  var paytype= payment_TypeName.filter(itm=>{ return itm.Code==item.payment_type ?itm.Name:''})
    // order_refund_amount += (order_refund_amount != "" ? "," : "") + item.amount;
    payments += item && item.payment_amount ? parseFloat(item.payment_amount) : 0

  })
  var total_cashround = data && parseFloat(data.totalPrice).toFixed(2) ? payments - parseFloat(data.totalPrice).toFixed(2) : 0
                  if(total_cashround==0 && cash_rounding_amount && cash_rounding_amount !== 0 && cash_rounding_amount !== '')
                  {total_cashround=cash_rounding_amount}
                 
  if(isPaymentCash==false && ActiveUser.key.isSelfcheckout == true)
  {
    total_cashround=0;
  }

  // console.log("Shop Name", data && data.ShopName);
  var topLogo = '';
  var sideLogo = '';
  var total_Tax=   data ? ((type=='activity' && data.total_tax) ? parseFloat(RoundAmount(data.total_tax- (data.tax_refunded?data.tax_refunded:0 ) )).toFixed(2) : parseFloat(RoundAmount(data.tax?data.tax:0)).toFixed(2)): '0.00'
  var totalProdDisc=Total_IndividualProductDiscount ? parseFloat(Total_IndividualProductDiscount).toFixed(2):0;
  var total_discount=  data ? (data.discount ? parseFloat(data.discount-totalProdDisc):parseFloat(data.discountCalculated) ? parseFloat(RoundAmount(data.discountCalculated)-totalProdDisc) : 0):0
  var total_RedeemPoint= (data.redeemedAmountPoints && data.redeemedAmountPoints != 0 && data.redeemedAmountPoints != undefined) || (redeemPointsForActivity != 0 && redeemPointsForActivity != '')
                          ?  type == 'activity'?
                                    parseInt(redeemPointsForActivity).toFixed(2)
                                    : parseFloat(RoundAmount(data.redeemedPoints)).toFixed(2)
                          :0
var total_amount = parseFloat( (type == 'activity')?data.total_amount :
                    data && data.totalPrice ? parseFloat(RoundAmount(parseFloat(data.totalPrice) + parseFloat(total_cashround))).toFixed(2):'0.00'
                  )
               
 var total_cartDiscountPercentLable= order_reciept.PercentageDiscountOfEntireOrder==true ? "("+
                                    (Order_cartDiscount && Order_cartDiscount.discountType=="Percentage"?Order_cartDiscount.discount_amount :
                                    ((total_discount*100)/Order_subTotal).toFixed(2)
                                    )+"%)": ""    
var tipPercent= order_reciept.PercentageTipsOfEntireOrder==true ? "("+((_tipAmount*100)/Order_subTotal).toFixed(2)+"%)": ""
             
  //(pageSize.width == "80mm" || pageSize.width == "52mm") ?
    topLogo = `
       ${baseurl && baseurl !== "" && baseurl !== '' && encodeURI(baseurl) ?
      `  <img style= 'max-width: ${(pageSize.width=='52mm' || pageSize.width=='58mm') ? "190px" :  pageSize.width=='80mm'? "280px":"300px"}' src='${baseurl}' alt=${shopName}/>`
      :
      `<b>${shopName}</b>`
    }
     `
   // Android ..................................
      receipt+=labelsubTotal+" "+Order_subTotal.toFixed(2)+"\n";
      rowNumber +=1;
      PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":labelsubTotal,"c2":Order_subTotal.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
   
        if(order_reciept.ShowTotalDiscount==true && total_discount>0){
          receipt+=labelTotalDiscount+total_cartDiscountPercentLable+" "+total_discount.toFixed(2)+"\n";
          rowNumber +=1;
          PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":labelTotalDiscount+total_cartDiscountPercentLable,"c2":total_discount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
        }
       if(order_reciept.ShowTotalTax == true){
        receipt+=labelTax+order_totalTaxPercent+" "+total_Tax+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":labelTax+order_totalTaxPercent,"c2":total_Tax,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
       }
       if(total_RedeemPoint != 0 ){
        receipt+="Redeemed Point"+" "+total_RedeemPoint+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":"Redeemed Point","c2":total_RedeemPoint,"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
        }
       if(total_cashround && total_cashround !== 0 && total_cashround !== "0.00"){
        receipt+=LocalizedLanguage.cashRounding+" "+parseFloat(RoundAmount(total_cashround)).toFixed(2)+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":LocalizedLanguage.cashRounding,"c2":parseFloat(RoundAmount(total_cashround)).toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
       }
       if(order_reciept.ShowTotalTip==true && _tipAmount && _tipAmount !== 0){
        receipt+=_tipLable+tipPercent+" "+parseFloat(RoundAmount(_tipAmount)).toFixed(2)+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":_tipLable+tipPercent,"c2":parseFloat(RoundAmount(_tipAmount)).toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
       }
       if(data.refunded_amount > 0){
        receipt+=LocalizedLanguage.refundAmount+" "+data.refunded_amount.toFixed(2)+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":LocalizedLanguage.refundAmount,"c2":data.refunded_amount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
       }
       receipt+="-----------------------------------"+"\n";
       rowNumber +=1;
       PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
       
       if(order_reciept.ShowOrderTotal == true){
        receipt+=labelTotalOrder+" "+(data.refunded_amount > 0) ?  (total_amount - data.refunded_amount).toFixed(2).toString() : total_amount.toFixed(2).toString()+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1":labelTotalOrder,"c2":(data.refunded_amount > 0) ?  (total_amount - data.refunded_amount).toFixed(2) : total_amount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
        // receipt+="-----------------------------------"+"\n";
        receipt+="-----------------------------------"+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
        // rowNumber +=1;
        // PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
       }
      //Payments
      if(order_payments && order_payments.length>0)
      {
        order_payments.map((item, index) => {
        if (item.type !== null && item.amount !== 0) {
        let _emvData=[];
         if(item.description && item.description !==""){
           try{
                let _desc= JSON.parse(item.description);
                for (var key in _desc) {
                  _emvData.push({"rn": rowNumber,"cms":2,"c1":key,"c2":_desc[key],"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
              }
           }catch(e){
             console.log(e)
           }
         } 
          let localDate = FormateDateAndTime.formatDateAndTime(item.payment_date, data.time_zone)
          let paytype = payment_TypeName.filter(itm => { return type == 'activity' ? itm.Code == item.type ? itm.Name : '' : item.payment_type && itm.Code == item.payment_type ? itm.Name :'' })
          let paymentName = type == 'activity' ? item.type !== "store-credit" ? paytype && paytype.length > 0 ? paytype[0].Name : item.type ?item.type :'' : 'store-credit' : item.payment_type && item.payment_type !== "store-credit" ? paytype && paytype.length > 0 ? paytype[0].Name : item.payment_type ? item.payment_type : '' : 'store-credit';
          let amount = type == 'activity' ? item.amount ? item.amount.toFixed(2) : '0.00' : item.payment_amount ? parseFloat(RoundAmount(item.payment_amount)).toFixed(2) : '0.00';
            PrintAndroidData.push({"rn": rowNumber,"cms":2,"c1": paymentName + '(' + localDate + ')',"c2":amount.toString(),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"}); 
            _emvData && _emvData.map((emv, index) => {
              PrintAndroidData.push(emv);
            });
        }
      })
        PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
      }
      //Refund payment
      if(refundpayments && refundpayments.length>0)
      {
        var displayRefundPayment = '';
        var refundPay = [];
        refundpayments.map((item, index) => { 
          var localDate = FormateDateAndTime.formatDateAndTime(item.payment_date, data.time_zone)
          var paytype = payment_TypeName.filter(itm => { return itm.Code == item.type })
          var paymentName = item.type !== "store-credit" ? paytype && paytype.length > 0 ? paytype[0].Name : item.type ? item.type : '' : 'store-credit';
          refundPay.push({"rn": rowNumber,"cms":2,"c1":paymentName + "(" + localDate + ')',"c2":item.amount.toFixed(2),"c3":"","bold":"0,0,0","fs":"24","alg":"0,2"});
        })
        if(refundPay && refundPay.length>0){
          PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
          PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":"Refund Payments","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"0"}); 
          refundPay && refundPay.map((emv, index) => {
            PrintAndroidData.push(emv);
          });
          PrintAndroidData.push({"rn": rowNumber,"cms":0,"c1":"d_lne","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
        }
      }

   // ...........................................

  var _total_mm = `<table class="item-total">
              <tbody>                 
                    ${subtotal ?
                      ` <tr>
                      <td colspan="2">${order_reciept.SubTotal ? order_reciept.SubTotal : `${labelsubTotal}`}</td>
                      <td align="right"> ${Order_subTotal.toFixed(2)}</td>
                        </tr>`
                      :
                      ''}

      ${taxrate_name !== "" ? taxrate_name : ''}
      ${ order_reciept.ShowTotalDiscount==true && total_discount>0?
      `<tr>
        <td colspan="2">${labelTotalDiscount} ${total_cartDiscountPercentLable}</td>
        <td align="right">-${total_discount.toFixed(2)}
           </td></tr>`
      :''}    

    ${order_reciept.ShowTotalTax == true ? 
      `<tr>
      <td colspan="2">${labelTax} ${order_reciept.PercentageTaxOfEntireOrder==true? order_totalTaxPercent:''}</td>
      <td align="right"> ${total_Tax}</td>
      </tr>` : ''  }

      ${(total_RedeemPoint != 0 ) ?
      `<tr>
      <td colspan="2">Redeemed Point</td>
      <td align="right">${total_RedeemPoint}</td>       
      </tr>`
      : ''}
      
    
        ${total_cashround && total_cashround !== 0 && total_cashround !== "0.00" ?
        `<tr>
              <td colspan="2">${LocalizedLanguage.cashRounding}</td>
              <td align="right">${parseFloat(RoundAmount(total_cashround)).toFixed(2)}
              </td>
          </tr>`
        :''}

        ${ order_reciept.ShowTotalTip==true && _tipAmount && _tipAmount !== 0 ?
          `<tr>
            <td colspan="2">${_tipLable}${tipPercent}</td>
            <td align="right">${parseFloat(RoundAmount(_tipAmount)).toFixed(2)}
              </td>
          </tr>`:''
         }   
        ${data.refunded_amount > 0 ?
      `<tr>
           <td colspan="2"> ${LocalizedLanguage.refundAmount}</td>
            <td align="right">-${(data.refunded_amount > 0) ? data.refunded_amount.toFixed(2) : ''}
            </td>
        </tr>`
      :
      ''} 
       ${order_reciept.ShowTax == false ?
      `<tr id="hiderow">
        <td colspan="2" style="border-left: 0px; border-right: 0px;">${order_reciept.ShowTax == false ? order_reciept.TaxIncludedDisclaimer ? order_reciept.TaxIncludedDisclaimer : '' : ''}</td>
       </tr>   
       
       `
      : ''}  
     
  ${order_reciept.ShowOrderTotal == true ?   
    `<tfoot><tr class="border-bottom">
        <td colspan="2">${labelTotalOrder}</td>
      <td align="right"> ${(data.refunded_amount > 0) ?  (total_amount - data.refunded_amount).toFixed(2) : total_amount.toFixed(2)}</td>      
       </tr></tfoot>`                
       : ''}   
 </tbody>
         </table>
              
         `

// For Android -----------------------------
    if( displayExtensionAppData && displayExtensionAppData !==null && displayExtensionAppData.url)
    {
        receipt+=displayExtensionAppData.url+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1": "d_img","c2":displayExtensionAppData.url,"c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
    }
    if(order_reciept && order_reciept.ShowOrderNotes && order_reciept.ShowOrderNotes == true)
    {
        receipt+="*ORDER NOTES*"+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":"*ORDER NOTES*","c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
    }
    if(order_reciept && order_reciept.ShowReturnPolicy && order_reciept.ShowReturnPolicy == true && order_reciept.ReturnPolicyText!=null)
    {
        receipt+=order_reciept.ReturnPolicyText+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":order_reciept.ReturnPolicyText,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
    }
    if(order_reciept && order_reciept.ShowBarcode == true  && print_bar_code!=null && print_bar_code!="")
    {
        receipt+=print_bar_code+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":"d_br","c2":print_bar_code,"c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
    }
    if(order_reciept && order_reciept.ShowWebsiteLink == true && site_name!='')
    {
        receipt+=site_name+"\n";
        rowNumber +=1;
        PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":site_name,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
    }
   
    if(address && (address.address_1 != '' || address.address_2 != '' || address.zip != '' || address.city != '' || address.country_name != ''))
    {
     rowNumber +=1;
     var _Add= (address && address.address_1 ? address.address_1 : '')+' '+ (address && address.address_2 ? address.address_2 : '');
     PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":_Add,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
     rowNumber +=1;
     var _Add1= (address && address.zip ? address.zip : '')+''+ (address && address.city ? ', '+address.city : '' )+''+(address && address.country_name ?', '+ address.country_name : '');
     PrintAndroidData.push({"rn": rowNumber,"cms":1,"c1":_Add1,"c2":"","c3":"","bold":"0,0,0","fs":"24","alg":"1"}); 
    }
   
//-----------------------------------------

  var _footer = '';

  var barcodewidth = (pageSize.width !== "80mm" && pageSize.width !== "52mm") ? "'padding:0px ; width:" + realWidth + " ;height:60px;image-rendering: pixelated;'" : "'padding:0px ; width:80% ; height:60px;image-rendering: pixelated; image-rendering: auto;image-rendering:-moz-crisp-edges;image-rendering: crisp-edges;image-rendering: pixelated;'";
  _footer = ` <div>
            <table class="footer-informations">
            ${order_reciept.ShowOrderNotes && order_reciept.ShowOrderNotes == true ?
              ` <tr><td>*ORDER NOTES*</td></tr>`
              : ``}
              
              ${order_reciept.ShowReturnPolicy && order_reciept.ShowReturnPolicy == true && _returnPolicyText !== "" ?
                
                  ` <tr><td> ${_returnPolicyText}</td></tr>`
                  : ``}
              ${order_reciept.ShowBarcode == true && print_bar_code ?
                  `<tr><td><img src=${order_reciept.ShowBarcode == true ? print_bar_code : ''} style=${order_reciept.ShowBarcode == true ? barcodewidth : ''}/></td></tr> `
                  : ``}      
                <tr><td>          
                ${order_reciept && order_reciept.ShowWebsiteLink == true ? site_name : ''}        
                </td></tr>
                ${address && (address.address_1 != '' || address.address_2 != '' || address.zip != '' || address.city != '' || address.country_name != '') ?
                  `<tr><td>      
                              ${address && address.address_1 ? address.address_1 : ''} ${address && address.address_2 ? address.address_2 : ''} </br>
                              ${address && address.zip ? address.zip : ''} ${address && address.city ? ', '+address.city : ''} ${address && address.country_name ?', '+ address.country_name : ''}
                              </td></tr>`
                  : ``}
    
   
    </table>
 </div>`
 
 var _externalApp=  displayExtensionAppData && displayExtensionAppData !==null ?
  ` <div class="">
  <table class="additional-informations">
      <tr>
          <td>
          ${displayExtensionAppData && displayExtensionAppData !==null && displayExtensionAppData.url ?
          `<img src=${ displayExtensionAppData.url}`
          : `App to add <br> information here.`}  </td>
          </tr>
      </table>
  </div>` :''



  var htmlbody = (`<html><head><meta charset="utf-8"> 
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title  align="left"></title>
  
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
  <head>
  <style>
  body {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    line-height: 19px;
}
body, h1,h2,h3,h4,h5,h6 {
    margin: 0;
    padding: 0;
}
.table-common {
    margin-bottom: 10px;
}
.item-report td {
    padding: 3px;
    padding-left: 0px;
}
table.item-table {
    width: 100%;
}
.item-details-total {
    margin-top: 30px;
}
table.item-table .item-quantity {
    width: auto;
    display: inline-block;
}
table.item-table p {
    margin: 0;
    text-align: left;
}
.item-subaddon table{
    width: 100%;
}
table {
    width: 100%;
}
.item-total-tax {
    width: 100%;
    border: 1px solid #979797;
    border-left: 0;
    border-right: 0;
}

.item-subaddon {
    padding-top: 5px;
}
.item-subaddon tbody td {
    padding-left: 15px;
}

.double-border {
    width: 100%;
    border: 1px solid #979797;
    border-left: 0;
    border-right: 0;
    height: 7px;
}
.table-common {
    margin-bottom: 10px;
}
.table-common td {
    padding-top: 5px;
    padding-bottom: 5px;
}
.table-common tr:first-child td {
    padding-top: 6px;
}
.table-common thead th{
    border-bottom: 1px solid #050505;
    padding-bottom: 10px;
}
.table-common tr:last-child td {
    padding-bottom: 8px;
    border-bottom: 1px solid #050505;
}
.font-bold {
    font-weight: 600;
}

.section-heading{
    font-weight: 500;
    border-bottom: 1px solid #050505;
    padding-bottom: 10px;
    font-size: 14px;
}
.additional-informations {
    background-color: #F0F2F4;
    margin-top: 30px;
    text-align: center;
    height: 171px;
}
.footer-informations {
    text-align: center;
    margin-top: 5px;
}
.logo {
    
    text-align: center;
    margin-bottom: 10px;
}

.pagesize{
  width:${pageSize.width}; overflow:hidden;
    margin: 0 auto;
}
</style>
   </head>
   <body >
   <div style= 'padding:${pageSize.width=='80mm'?"2px" :(pageSize.width=='52mm' || pageSize.width=='58mm')? "2px" :"5px"};'   class='pagesize'>
        <div>
            <table class="logo" >
                <tr><td> ${order_reciept.ShowLogo == true ? topLogo : shopName  }</td></tr>
            </table>
        </div>
            
        <table class="table-common" style="width: 100%;text-align: left;border-collapse: collapse;">        
        <tbody>
            ${order_reciept.ShowDate == true?
            `<tr>       
              <td colspan="2">${order_reciept.DateText ? order_reciept.DateText : labelDateDisplay}:${gmtDateTime ? gmtDateTime : ''}</td>
              </tr>`:""}

              ${order_reciept.ShowTime == true?
                `<tr>       
              <td colspan="2">${labelTime } : ${ time ? time : ''} </td>
              </tr>`:""}

              ${order_reciept.ShowSale==true ?
              `<tr>       
              <td colspan="2">${labelSale} : #${receiptId}</td>
              </tr>`:""}

              ${order_reciept.ShowServedBy == true ?
              `<tr>       
                <td colspan="2">${labelServed} : ${ servedBy} </td>
              </tr>`: ''}

              ${customershow_name !== null && customershow_name !== "" ?
                  `<tr>       
                  <td colspan="2"> ${labelCustomerName} : ${ customershow_name} </td>
                  </tr>`
                  :""}
                  ${order_reciept.ShowCustomerAddress !== false && CustomerAddress !=="" ?
                  `<tr><td colspan="2">${labelCustomerAddress} : ${CustomerAddress}   </td>
                  </tr>`
                  :""}
              
              ${order_reciept.ShowTaxId && order_reciept.TaxId ?
                `<tr>       
                <td colspan="2"> ${labelTaxId} : ${taxId}</td>     
                </tr>`:""}  
            
            ${order_reciept.ShowRegisterDetails !==false ?
            `<tr>       
              <td colspan="2">${LocalizedLanguage.register} :${registerName}
            </td></tr>`: ''}
            ${order_reciept.ShowLocationDetails !==false ?
            `<tr>       
                <td colspan="2"> ${LocalizedLanguage.location} :${locationName}
              </td></tr>`: ''}
            ${order_reciept.ShowTableNumber !== false && groupSaleLabel !=="" ?
              `<tr>       
                <td colspan="2">
                ${labelTableNumber} :${groupSaleLabel && groupSaleLabel?groupSaleLabel:""}</td>
              </tr>`:''}
          </tbody>
      </table>
<div class="item-report">
      <h3 style="text-align: center;">${order_reciept.ShowCustomText && order_reciept.ShowCustomText==true && customeText!==null ? customeText : ''} </h3>
     
            ${lineItem}
            ${_CustomeFee}
            ${_Notes}
            ${_total_mm}
            ${displayPayments}
            ${displayRefundPayment}
            ${_externalApp}
            ${_footer}
           
           `         
  );
  htmlbody += ' </div></div></body ></html>'
  // console.log("------Printreceipt---"+JSON.stringify(PrintAndroidData));

 //CASH DRAWER OPENING AS PER THE SETTING
  if( type!="activity" && (typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
  {
    var whenToOpenDrawer=localStorage.getItem('selected_drawer');
    if((isPaymentCash==true && (typeof whenToOpenDrawer!="undefined" && whenToOpenDrawer!="" && whenToOpenDrawer=="cash-only"))|| (typeof whenToOpenDrawer!="undefined" && whenToOpenDrawer!="" && whenToOpenDrawer=="every-sale"))
    {
      Android.openCahsDrawer();
      //console.log("---------drawer opening-------");
    }
  }

  var env = localStorage.getItem("env_type");
  if(  (env && env !='' && env !='ios')){ //typeof Android != "undefined" || Android != null ||
       PrintAndroidReceiptData["data"]=PrintAndroidData;
       showAndroidReceipt( receipt,PrintAndroidReceiptData) 
  }else{
      var mywindow = window.open('#', 'my div', "width='400', 'A2'");
      mywindow && mywindow.document && mywindow.document.write(htmlbody);
      // document.write(htmlbody);

     // console.log("htmlbody",htmlbody)

      if (mywindow) {
        setTimeout(() => {
          mywindow.print();
          mywindow.close();
        }, 300);
      }
  }


  return true;
}

//TAx
 // <tr>
      //    ${type == 'activity' && data.total_tax !== 0 && data.tax_refunded == 0 ?
      // ` <td colspan="2">${order_reciept.ShowTax == true ? (order_reciept.Tax ? order_reciept.Tax : 'Total-Tax')  : ''}</td>
      //   <td align="right"> ${order_reciept.ShowTax == true ? (data.tax_refunded > 0) ? `${(data.total_amount - data.refunded_amount) == 0 ? "0.00" : (data.total_tax - data.tax_refunded).toFixed(2)} <del style={{ marginLeft: 5 }}>${data.total_tax.toFixed(2)}</del> ` : (data.total_amount - data.refunded_amount) == 0 ? "0.00" : data.total_tax.toFixed(2)
      //   : ''}</td>`
      // : type == 'activity' && data.tax_refunded > 0 ?
      //   `<td colspan="2">${order_reciept.ShowTax == true ? (order_reciept.Tax ? order_reciept.Tax : 'Total-Tax') : ''}</td>
      //   <td align="right"> ${order_reciept.ShowTax == true ? (data.tax_refunded > 0) ? `<del style={{ marginLeft: 5 }}>${data.total_tax.toFixed(2)}</del> ${(data.total_tax - data.tax_refunded).toFixed(2)}  ` : data.total_tax.toFixed(2)
      //     : ''}</td>`

      //   : data.tax > 0 ?
      //     `<td colspan="2">${order_reciept.ShowTax == true ? (order_reciept.Tax ? order_reciept.Tax : 'Total-Tax') : ''}</td>
      //     <td align="right"> ${order_reciept.ShowTax == true ? data && data.tax ? parseFloat(RoundAmount(data.tax)).toFixed(2) : 0 : ''}</td>`
      //     : ''}
       // </tr>
