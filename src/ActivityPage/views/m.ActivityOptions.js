import React from 'react';
import { get_UDid } from '../../ALL_localstorage';
import { textToBase64Barcode } from "../../_components/CommonFunction";
import { PrintPage } from '../../_components/PrintPage';
import { sendMailAction } from '../../_actions/index';
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage'
import { showAndroidToast } from '../../settings/AndroidIOSConnect';
import { mobileModel, deviceDetect } from "react-device-detect";
import WarningMessage from '../../_components/views/m.WarningMessage';
import { CommonModuleJS } from '../../_components'
import { isMobileOnly } from "react-device-detect";

import Config from '../../Config'
function sendEmail(orderDetail) {
    if (orderDetail.orderCustomerInfo != null) {
        var email = orderDetail.orderCustomerInfo.customer_email
        var UID = get_UDid('UDID');
        var requestData = {
            "OrderNo": orderDetail.order_id,
            "EmailTo": email,
            "Udid": UID,
        }
        //this.setState({ Emailstatus: true, loading: false })
        const mapDispatchToProps = dispatch => {
            return {
                emailsend: sendMailAction.sendMail(requestData)
            }
        };

        alert("Email sent successfully");
    }
}
function PrintReceipt(orderDetail) {
    var type = 'activity';
    var site_name;
    var EventDetailArr = []
    var line_items = orderDetail && orderDetail.line_items ? orderDetail.line_items : ''
    var data = orderDetail ? orderDetail.TicketDetails : ''
    var orderList = orderDetail ? orderDetail.order_payments : ''
    var inovice_Id = orderDetail ? orderDetail.order_id : ''
    var manager = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';
    var ServedBy = orderDetail ? orderDetail.ServedBy : ''
    var register = orderDetail ? orderDetail.RegisterName : ''
    var register_id = localStorage.getItem('register')
    var address = localStorage.getItem('UserLocations') ? JSON.parse(localStorage.getItem('UserLocations')) : '';
    // var decodedString = localStorage.getItem('sitelist') ? localStorage.getItem('sitelist') : "";
    // var decod = decodedString != "" ? window.atob(decodedString) : "";
    // var siteName = decod && decod != "" ? JSON.parse(decod) : "";
    var siteName=localStorage.getItem('sitelist') ? JSON.parse(localStorage.getItem('sitelist')) : "";
    var udid = get_UDid('UDID');
    var timeZoneDetail = orderDetail ? orderDetail : '';
    var OliverReciptId = orderDetail !== null && orderDetail.OliverReciptId !== null ? orderDetail.OliverReciptId : ''
    if (siteName && siteName != "") {
        if(siteName && siteName.subscription_detail && siteName.subscription_detail !== ''){
            if (siteName.subscription_detail.udid == udid) {
            site_name = siteName.subscription_detail.host_name && siteName.subscription_detail.host_name !=undefined  && siteName.subscription_detail.host_name.trim() !=='undefined' ?siteName.subscription_detail.host_name  :""
            }
          }
        // siteName && siteName.map(site => {
        //     if (site.UDID == udid) {
        //         site_name = site.StatusOpt && site.StatusOpt.instance
        //     }
        // })
    }
    data && data.map(event => {
        var pp = JSON.parse(event)
        EventDetailArr.push(pp)
    })
    var print_bar_code = textToBase64Barcode(OliverReciptId);
    var isTotalRefund = orderDetail.refunded_amount == 0 ? false : true;

  

    var deviceDetail = deviceDetect();
    if (EventDetailArr && (mobileModel !== "none")) {  //currently do not call for mobile device V2_PRO.
        PrintPage.PrintElem(orderDetail, orderDetail.getPdfdateTime, isTotalRefund, orderDetail.cash_rounding_amount, print_bar_code, orderList, type)
    }
    // else 
    // { 
       //  showAndroidToast(udid, inovice_Id,type);
        //}
}
const redirectToRefund = () => {
    if (CommonModuleJS.permissionsForRefund() == false) {
        $('#common_msg_popup').addClass('show');
        $('#common_msg_popup').modal('show');

    } else {
        if(isMobileOnly == true){
            // history.push("/refund");
            window.location = "/refund"
        }
        else{
            window.location = "/refund"
        }
    }
}
const MobileActivityOptions = (props) => {
    //console.log("%cmobile view props", 'color:#E16B6B', props);
    var orderDetail = sessionStorage.getItem("OrderDetail") ? JSON.parse(sessionStorage.getItem("OrderDetail")) : null;
    const { user, registerName,  logout, supportPopup, Language, shop_name, match } = props;
    //console.log("Update", orderDetail, orderDetail.total_amount, orderDetail.refunded_amount)
     var order_reciept = localStorage.getItem('orderreciept') ? JSON.parse(localStorage.getItem('orderreciept')) : "";
    var CompanyLogo = order_reciept && order_reciept.CompanyLogo ? order_reciept.CompanyLogo : '';
    var baseurl = Config.key.RECIEPT_IMAGE_DOMAIN + CompanyLogo;    
    baseurl = encodeURI(baseurl);
    
    return (
        <div>
              <div style={{ display: 'none' }} >
                <img src={baseurl} width="50px" />
            </div>
            <div style={{ display: 'none' }} >
                <img src={textToBase64Barcode(orderDetail && orderDetail.OliverReciptId)} />
            </div>
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="d-flex align-items-center justify-content-center">
                        {LocalizedLanguage.option}
                        <a className="icon-less-right" onClick={() => history.push('/activity')}>
                            <img src="../mobileAssets/img/less.svg" className="w-40" alt="" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="appCapsule h-100 overflow-auto">
                <div className="container-fluid pt-3">
                    <div className="row">
                        <div className="col-sm-12">
                            {orderDetail ?
                                <div className="button-style-01">

                                    <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01 text-danger" disabled={(orderDetail.total_amount == orderDetail.refunded_amount) || orderDetail.order_status !== "completed" ? "disabled" : ""} onClick={() => { redirectToRefund() }} >{LocalizedLanguage.issueRefund}</button>
                                    <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" onClick={() => { PrintReceipt(orderDetail) }}>{LocalizedLanguage.printReceipt}</button>
                                    <button type="submit" className="btn btn-default btn-lg btn-block btn-style-01" disabled={orderDetail.orderCustomerInfo && orderDetail.orderCustomerInfo.customer_email ? "" : "disabled"} onClick={() => { orderDetail.orderCustomerInfo && orderDetail.orderCustomerInfo.customer_email && sendEmail(orderDetail) }}>{LocalizedLanguage.emailReceipt}</button>
                                </div>
                                :
                                <div className="button-style-01"> {LocalizedLanguage.noFound} </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <WarningMessage msg_text={LocalizedLanguage.refundPermissionerror} />
            <div className="appBottomMenu">
            </div>

        </div>
    )
}

export default MobileActivityOptions;