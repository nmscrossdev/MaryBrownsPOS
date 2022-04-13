import moment from 'moment';
import Config from '../../Config';
import  ActiveUser  from '../../settings/ActiveUser';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { RoundAmount } from "../../_components/TaxSetting";
const pageSize = ActiveUser.key.pdfFormate;
// var RoundAmount = (val) => {
//   //return  Math.round(val * 100) / 100;
//   var decimals = 2;
//   return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
// }

export const TicketEventPrint = {
  EventPrintElem,
};

//  Updated By:priyanka,updated Date:7/5/2019,Description:listitem array display ticketinfo array first and lastname in case //
function EventPrintElem(data, orderList, manager, register, location_name, site_name, ServedBy, inovice_Id, line_items = '', tempOrderId = '', print_bar_code, timeZoneDetail, type) {
  var address;
  var ticket_reciept = localStorage.getItem('orderreciept') ? JSON.parse(localStorage.getItem('orderreciept')) : "";
  var checkList = localStorage.getItem('placedOrderList') ? JSON.parse(localStorage.getItem('placedOrderList')) : "";
  var payment_TypeName = (typeof localStorage.getItem('PAYMENT_TYPE_NAME') !== 'undefined') ? JSON.parse(localStorage.getItem('PAYMENT_TYPE_NAME')) : null
  var checkList_Data = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
  var register_id = localStorage.getItem('register')

  var payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
  if (timeZoneDetail) {
    var gmtDateTime = ticket_reciept.ShowTime == true && ticket_reciept.ModifiedOn ? FormateDateAndTime.recieptFormatDateAndTime(timeZoneDetail.date_time, timeZoneDetail.time_zone) : FormateDateAndTime.formatDateAndTime(timeZoneDetail.date_time, timeZoneDetail.time_zone);
  } else {
    var gmtDateTime = ticket_reciept.ShowTime == true && checkList_Data.order_date ? moment.utc(checkList_Data.order_date).local().format(Config.key.DATETIME_FORMAT) : moment().format(Config.key.DATE_FORMAT)
  }
  location_name && location_name.map(item => {
    if (item.Id == register_id) {
      address = item;
    }
  })
  var baseurl = ticket_reciept.CompanyLogo ? Config.key.RECIEPT_IMAGE_DOMAIN + ticket_reciept.CompanyLogo : ''
  baseurl = encodeURI(baseurl);
  var barcode_image = ticket_reciept.AddBarcode == true ? Config.key.RECIEPT_IMAGE_DOMAIN + "/Content/img/ic_barcode.svg" : null
  var mywindow = window.open('#', 'my_div', 'width=600');
  var payments_type = "";
  orderList && orderList.map((item, index) => {
    var paytype = payment_TypeName.filter(itm => { return itm.Code == item.payment_type || itm.Code == item.type ? itm.Name : '' })
    var type = (paytype && paytype != null && paytype != "") ? paytype[0].Name : '';
    payments_type += (type && type != "" && payments_type != "" ? "," : "") + type;

  })
  var ItemsPrice = line_items ? line_items : checkList;
  var topLogo = '';
  var sideLogo = '';
  (pageSize.width =="80mm" || pageSize.width =="52mm") ?
  topLogo= `
  <tr class="item-row">
   <td class="item-logo" colspan="2">
       
       <div class="receipt-logo"> 
       ${ baseurl ?  
        ` <img src=${baseurl}  />` 
        : 
         `<b>${data.ShopName? data.ShopName:manager.shop_name}</b>`                            
       }
       </div>
   </td>
   </tr>`
   :null;

   (pageSize.width !=="80mm" && pageSize.width !=="52mm") ?
   sideLogo=`<td class="item-logo" colspan="2">
        
        <div class="receipt-logo"> 
        ${ baseurl ?  
         ` <img src=${baseurl}  />` 
         : 
          `<b>${data.ShopName? data.ShopName:manager.shop_name}</b>`                            
        }
        </div>
    </td>`:null
     
    var _barcode='';
    (pageSize.width !=="80mm" && pageSize.width !=="52mm") ?
    _barcode=`<td style="border: 0px; border-top: 1px solid #979797; text-align: right;">
                         <img src=${print_bar_code} width="100%" />  
                     </td>`
      :
      _barcode=`</tr><tr><td style="border: 0px; border-top: 1px solid #979797; text-align: right;">
      <img src=${print_bar_code} width="100%" />  
  </td>`;
  mywindow.document.write(`<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title  align="left"></title>
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">
<style>
* {
  margin: 0;
  padding: 0
}
@page {
  margin-top:0mm;
  margin-bottom:0mm;
}
body {
  font: 14px/1.4 Georgia, serif;
  color: #979797;
}

#page-wrap {
width:${pageSize.width}; overflow:hidden;
  margin: 0 auto;
}

table {
  border-collapse: collapse
}

table td,
table th {
  border: 1px solid #979797;
  padding: 10px 0px;
}
table.total_calculation th,
table.total_calculation td {
  padding: 7px 0px !important
}
.border-bottom {
  border-bottom: 1px solid #979797;
}
#address {
  width: 250px;
}

#customer {
  overflow: hidden
}

#items {
  clear: both;
  width: 100%;
  margin: 2px 0 0;
}

#items th {
  background: #eee
}
#items tr.item-row td {
  border: 0;
  vertical-align: top
}

#items td.description {
  width: 300px
}

#items td.item-name {
  width: 175px
}
#items td.item-logo {
  width: 175px
}

#items td.quantity{width:20px} 
#items td.total-line {
  border: 0;
}

#items td.total-value {
  border: 0;
  padding: 10px 0px;
  text-align: right;
}

.border-top {
  border-top: 1px solid #979797 !important;
}

.total_calculation {
  border-spacing: 0px;
  margin-bottom: 10px;
}
.d-inline-block {
  display: inline-block;
  width:100%;
}
#items td.blank {
  border: 0
}

#terms {
  text-align: center;
  margin: 20px 0 0
}

#terms h5 {
  text-transform: uppercase;
  font: 13px Helvetica, Sans-Serif;
  letter-spacing: 10px;
  border-bottom: 1px solid #979797;
  padding: 0 0 8px;
  margin: 0 0 8px
}
.receipt-logo {
  border: 1px solid #979797;
  border-radius: 4px;
  height: 98px;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  overflow: hidden;
  /* width: 135px; */
}
.receipt-logo img {
  width: 100%;
  height: 100%;
}
.shopUrl {
  font-weight: bold;
  text-align: center;
  padding: 15px 0px;
}
.printTopSection {
  height: calc(100vh - 220px);
}
</style></title>`);
  /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
  mywindow.document.write(`</head><body>`);
  mywindow.document.write(`
<!-- open bracket --> 

${data && data.map((item, data_index) => {
    //  Created By:priyanka,Created Date:28/6/2019,Description:print total price with add  tax //
    var isPrice = "";
    var total_is_price = 0;
    if (item.ticket_type_id !== '') {
      isPrice = ItemsPrice && ItemsPrice.find(ln_item => ln_item.product_id == item.ticket_type_id)
      total_is_price = isPrice ? isPrice.total + isPrice.subtotal_tax : ''
    }
    var FirstName = '';
    var LastName = '';
    checkList_Data && checkList_Data.ListItem && checkList_Data.ListItem.map(check_item => {
      check_item.ticket_info && check_item.ticket_info.map((itms, check_index) => {
        if (check_index == data_index) {
          FirstName = `${itms.first_name && itms.first_name !== '-' ? `<p>${LocalizedLanguage.firstName}:${itms.first_name ? itms.first_name : item.first_name}</p>` : ''}`
          LastName = `${itms.last_name && itms.last_name !== '-' ? `<p>${LocalizedLanguage.lastName}:${itms.last_name ? itms.last_name : item.last_name} </p>` : ''}`
        }
      })
    })

    return (
      ` 
      <div id="page-wrap">
      <div class="printTopSection">
          <table id="items">
              <tbody>
              ${topLogo}
                  <tr class="item-row">
                      <td colspan="2">
                          <div class="invoice-generated">
                              <p>${ticket_reciept && ticket_reciept.DateText ? ticket_reciept.DateText : LocalizedLanguage.date} : ${gmtDateTime ? gmtDateTime : ''}</p>
                              ${tempOrderId ?
                                `<p>${ticket_reciept && ticket_reciept.Sale ? ticket_reciept.Sale : LocalizedLanguage.sale+'#'}:${tempOrderId ? tempOrderId : ''} </p>`
                                : ''
                              }
                              ${ticket_reciept.ShowServedBy == true ?
                                `<p>${ticket_reciept && ticket_reciept.ServedBy ? ticket_reciept.ServedBy : LocalizedLanguage.servedBy} : ${manager && manager.display_name ? manager.display_name : ''}</p>`
                                : ''}
                                <p>${ticket_reciept && ticket_reciept.TaxIdText ? ticket_reciept.TaxIdText : LocalizedLanguage.taxID} :${ticket_reciept && ticket_reciept.TaxId ? ticket_reciept.TaxId : '0'} </p>

                                <p>${ticket_reciept && ticket_reciept.PaidWith ? ticket_reciept.PaidWith : LocalizedLanguage.paidWith} : ${payments_type ? payments_type : ''}</p>
                                </div>
                      </td>
                      ${sideLogo}
                  </tr>
                
              </tbody>
          </table>
          <table id="items" style="margin-top: 0px; border: 0px; border-top: 1px solid #979797;">
              <tbody>
                  <tr>
                      <td style="border: 0px; border-top: 1px solid #979797; padding: 0px;">
                      ${item.event_detail && item.event_detail.title &&
                        `<p>${item.event_detail.title}</p>`
                        }
                  ${type == 'activity' ?
                          `<p>${LocalizedLanguage.firstName}:${item.first_name ? item.first_name : ''} </p>`
                          :
                          item.first_name ? `<p>${LocalizedLanguage.firstName}:${item.first_name} </p>` : FirstName
                        }
                  ${type == 'activity' ?
                          `<p>${LocalizedLanguage.lastName}:${item.last_name ? item.last_name : ''} </p>`
                          : item.last_name ? `<p>${LocalizedLanguage.lastName}:${item.last_name}</p>` : LastName}
                  ${item.event_detail && item.event_detail.event_start_date_time &&
                        `<p>${item && item.event_detail ? LocalizedLanguage.startDate+": " + moment(item.event_detail.event_start_date_time).format('MMMM D ,YYYY') : ""}</p>`
                        }
                  ${item.event_detail && item.event_detail.event_end_date_time &&
                        `<p>${item && item.event_detail ? LocalizedLanguage.endDate+": " + moment(item.event_detail.event_end_date_time).format('MMMM D ,YYYY') : ""}</p>`
                        }
                  ${item.event_detail && item.event_detail.event_location &&
                        `<p>${item && item.event_detail ? LocalizedLanguage.address+" " + item.event_detail.event_location : ""}</p>`
                        } 
                      </td>
                      <td style="border:0px;"  valign="top"><div style="margin-top:0px;margin-bottom: 5px;text-align:right;">
                      <p>${total_is_price ? parseFloat(RoundAmount(total_is_price)).toFixed(2) : ''}</p></div>
                      </td>    
                  </tr>
              </tbody>
          </table> 
          </div>
          <div style="clear:both"></div>
          <table  style="margin-top: 0px; border: 0; width: 100%;">
          <tr>
              <td  style=" border: 0px; border-top: 1px solid #979797; ">
                  <address id="address">
                  ${address && address.Address1 ? address.Address1 : ''} ${address && address.Address2 ? address.Address2 : ''} 
                  ${address && address.Zip ? address.Zip : ''} ${address && address.City ? address.City : ''} ${address && address.CountryName ? address.CountryName : ''}
                  </address>
              </td>
             ${_barcode}
          </tr>
          <tr><td colspan="2" style="border: 0px; border-top: 1px solid #979797;text-align: center;">
             
               ${site_name ? site_name : ''}
          
          </td></tr>
      </table>
    
      </div>
`)
  }
  )
    }  
<!-- close bracket -->     
`)
  mywindow.document.write('</body></html>');
  mywindow.print();
  mywindow.close();
  return true;
}


