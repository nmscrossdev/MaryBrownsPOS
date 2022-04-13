import React from 'react';
import { connect } from 'react-redux';
import { cloudPrinterActions, saveCustomerInOrderAction, sendMailAction } from '../../_actions';
import { checkoutActions } from '../../CheckoutPage';
import { PrintPage } from '../../_components';
import { showAndroidToast } from '../../settings/AndroidIOSConnect';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import MobileSaleComplete from '../../_components/views/m.SaleComplete';
import { history } from "../../_helpers";
import Config from '../../Config';
import ActiveUser from '../../settings/ActiveUser';
import { AppMenuList } from '../../_components/AppmenuList';
import { get_UDid } from '../../ALL_localstorage';
import KeyAppsDisplay from '../../settings/KeyAppsDisplay';
import { CommonOrderStatusPopup } from '../../_components/CommanOrderStatusPopup';
import KeysOrderStaus from '../../settings/KeysOrderStaus';
import { activityActions } from '../../ActivityPage';
import { checkForEnvirnmentAndDemoUser, checkOrderStatus, getHostURLsBySelectedExt, sendClientsDetails, sendRegisterDetails, sendTipInfoDetails } from '../../_components/CommonJS';
import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
import { ExtensionList } from '../../_components/ExtensionList';
import { CloudPrinterListPopup } from '../../_components/CloudPrinterListPopup';

var JsBarcode = require('jsbarcode');

class RefundComplete extends React.Component {
    constructor(props) {
        super(props);
        this.goToShopview = this.goToShopview.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.CancelSale = this.CancelSale.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.printReceipt = this.printReceipt.bind(this);
        this.getTotalTaxByName = this.getTotalTaxByName.bind(this);
        this.textToBase64Barcode = this.textToBase64Barcode.bind(this);
        this.state = {
            customer_email: "",
            isLoading: false,
            mailsucces: '',
            IsEmailExist: true,
            valiedEmail: true,
            isOrderSyncComplete: false,
            orderId: '',
            showPrint: false,
            checkOrderStatusIncr : 0,
            extensionIframe : false, // extension state
            extHostUrl :'',
            extPageUrl : '',
            printerByLocalprinter : false,
            cloudPrintersData : [],
            cloudPrinterErr : ''
        }
    }

    componentDidMount() {
         // cloud printer list from localstorage
         var cloudPrinters = localStorage.getItem('cloudPrinters') ? JSON.parse(localStorage.getItem('cloudPrinters')) : []
         this.setState({
             cloudPrintersData: cloudPrinters
         })
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (setHeightDesktop()) { setHeightDesktop() };
        }, 2000);
        var reciptId = localStorage.getItem('getorder') ? JSON.parse(localStorage.getItem('getorder')) : ''
        //var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
        // && checkPrintreciept && checkPrintreciept == true
        if ((!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false)) {
            var udid = get_UDid('UDID');
            if(udid !== null){
                this.props.dispatch(activityActions.getDetail(reciptId.order_id, udid));
            }
        }
        //Check order synced status----------------
        var isValidENV = checkForEnvirnmentAndDemoUser()
        if (reciptId && reciptId.OliverReciptId) {
                if(isValidENV == false){
                    this.timer = checkOrderStatus(reciptId.OliverReciptId)
                    // this.timer = setInterval(() => this.checkOrderStatus(reciptId.OliverReciptId), 1000)
                }
                else{
                    // setInterval(() => this.updateOrderSyncStatusOnOrderNotification(reciptId.OliverReciptId), 2000)
                   var intervalTimer =  setInterval(() => {
                        var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                        var reciptId = localStorage.getItem('getorder') ? JSON.parse(localStorage.getItem('getorder')) : ''
                        TempOrders && TempOrders.map(ele => {
                            if (reciptId && ele.TempOrderID == reciptId.OliverReciptId) {
                                if (ele.OrderID && ele.Status == "true") {
                                    this.setState({ isOrderSyncComplete: true, orderId: ele.OrderID })
                                    clearInterval(intervalTimer)
                                } else {
                                    this.setState({ checkOrderStatusIncr: this.state.checkOrderStatusIncr + 1 })
                                    if (this.state.checkOrderStatusIncr > Config.key.FIREBASE_NOTIFICATION_COUNT) {
                                        checkOrderStatus(reciptId.OliverReciptId)
                                        clearInterval(intervalTimer)
                                    }
                                }
                                
                            }
                        });
                    }, 2000);
                }
        }

         // *** checkout complete extension event listner *** //
         var _user = JSON.parse(localStorage.getItem("user"));
        // ************ Update _user.instance for local testing ************* //
        // _user.instance = window.location.origin
        // localStorage.setItem("user", JSON.stringify(_user));
        // ************ End ********* //
        window.addEventListener('message', (e) => {
            if (e.origin && _user && _user.instance) {
                try {
                    var extensionData = typeof e.data == 'string' ? JSON.parse(e.data) : e.data;
                    if (extensionData && extensionData !== "" && extensionData.oliverpos) {
                        this.showExtention(extensionData);
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        }, false);
 
         // *** checkout complete extension event listner end*** //
    }

    updateStatus = () => {
        showModal('updateStatus');
    }

    // checkOrderStatus(tempOrderId) {
    //     if (this.state.isOrderSyncComplete == false) {
    //         const { Email } = ActiveUser.key;
    //         var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : [];
    //         if (TempOrders && TempOrders.length > 0) {
    //             TempOrders = TempOrders.filter(item => item.TempOrderID == tempOrderId)
    //             // && (item.OrderID == 0 || item.Status.toString() == "false" || item.Status.toString() == "failed") && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
    //             if (TempOrders && TempOrders.length > 0) {
    //                 var _OrderID = TempOrders[0].OrderID;
    //                 var syncTempOrderID = TempOrders[0].TempOrderID;
    //                 var udid = get_UDid('UDID') !== null ? get_UDid('UDID') : 0 ;
    //                 var _status = TempOrders[0].TempOrderID;
    //                 if (_OrderID == 0 && udid !== null) {
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


    getTotalTaxByName = (order_taxes) => {
        var tax_names = new Array();
        if (order_taxes && order_taxes.length > 0) {
            order_taxes.map(val => {
                tax_names.push({ 'tax_name': val.Title, "tax_amount": parseFloat(val.Total) })
            })
        }
        return tax_names.length > 0 ? tax_names : "";
    }

    textToBase64Barcode = (text) => {
        var canvas = document.createElement("canvas");
        JsBarcode(canvas, text, {
            format: "CODE39", displayValue: false, width: 1,
            height: 30,
        });
        var print_bar_code = canvas.toDataURL("image/png");
        return print_bar_code;
    }
    callPrintFUnction = () => {       
          this.printReceipt();         
        //this.handlePrintClick();
    }

    // print function for refund
    printReceipt = async () => {
        this.setState({ showPrint: false })
        var printData = localStorage.getItem('getorder') && JSON.parse(localStorage.getItem('getorder'))
        var mydate = new Date();
        var getPdfdate = (mydate.getMonth() + 1) + '/' + mydate.getDate() + '/' + mydate.getFullYear();
        var productxList = ''
        var AllProductList = ''
        var type = 'activity'
        var orderList = printData ? printData.order_payments : ''
        var cash_rounding_amount = printData.cash_rounding_amount
        var barCodeId = printData && printData.OliverReciptId
        var print_bar_code = await this.textToBase64Barcode(barCodeId)
        var order_reciept = localStorage.getItem('orderreciept') ? localStorage.getItem('orderreciept') === "undefined" ? null : JSON.parse(localStorage.getItem('orderreciept')) : "";
        var TotalTaxByName = (order_reciept && order_reciept.ShowCombinedTax == false) ? printData && printData.order_taxes && this.getTotalTaxByName(printData.order_taxes) : "";
        var redeemPointsToPrint = printData && printData.meta_datas && printData.meta_datas.find(item =>  item.ItemName == "_wc_points_logged_redemption" )
        redeemPointsToPrint = redeemPointsToPrint && redeemPointsToPrint.ItemValue ? redeemPointsToPrint.ItemValue : 0

        var isTotalRefund = false;
        var Totalamount = printData ? printData.total_amount : 0
        var refunded_amount = printData ? printData.refunded_amount : 0
        if ((Totalamount - refunded_amount).toFixed(2) == '0.00') {
            isTotalRefund = true
        }
        var data = this.props.single_Order_list && this.props.single_Order_list.content
        // {(!_env || _env=="ios") && <input type="radio" id="test3" name="radio-group" onClick={props.Details != "" ? () => PrintPage.PrintElem(props.Details, props.getPdfdateTime, isTotalRefund, props.cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, props.redeemPointsToPrint) : props.printPOP} />}
        if (data) {
            PrintPage.PrintElem(data, getPdfdate, isTotalRefund, cash_rounding_amount, print_bar_code, orderList, type, productxList, AllProductList, TotalTaxByName, redeemPointsToPrint)
        }
    }
    // end print fun...

    goToShopview() {
        localStorage.removeItem("REFUND_DATA")
        //history.push('/shopview');
        window.location = '/shopview';
    }

    CancelSale() {
        this.setState({ isLoading: true })
        this.props.dispatch(checkoutActions.orderToCancelledSale(this.state.order_id, this.state.udid));
    }

    componentWillMount() {
        KeyAppsDisplay.DisplayApps(["update_status"]);

        var data = JSON.parse(localStorage.getItem("REFUND_DATA"));
        if (data) {
            this.setState({
                customer_email: data.customer_email,
                order_id: data.order_id,
                udid: data.udid,
            })
            // showAndroidToast(data.udid, data.order_id);
            this.printReceipt()
        }       
    }

    sendMail() {
        $(".emialsuctes").css("display", "block");
        if(isMobileOnly == true){
            $(".suctext").css("display", "block");
        }
        var udid = this.state.udid;
        var order_id = this.state.order_id;
        var email_id = $("#customer-email").val();
        this.setState({ mailsucces: null });
        var requestData = {
            "Udid": udid,
            "OrderNo": order_id,
            "EmailTo": email_id,
        }
        // if ( $(".checkmark").hasClass("isCheck") ) {
        //     this.props.dispatch(saveCustomerInOrderAction.saveCustomerInOrder(udid, order_id, email_id));
        // }
        // this.props.dispatch( sendMailAction.sendMail( requestData ) );
        if (!email_id || email_id == "") {
            this.setState({ IsEmailExist: false })
        } else {
            this.setState({ IsEmailExist: true })
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id)) {
                this.setState({ valiedEmail: true })
                if ($(".checkmark").hasClass("isCheck")) {
                    this.props.dispatch(saveCustomerInOrderAction.saveCustomerInOrder(udid, order_id, email_id));
                }
                this.props.dispatch(sendMailAction.sendMailExternal(requestData));
            } else {
                // this.state.mailsucces =false;
                this.setState({ valiedEmail: false })
            }
        }
    }

    handleInputChange() {
        $(".checkmark").toggleClass("isCheck");
    }

    componentWillReceiveProps(nextprops) {  
        var data = nextprops.single_Order_list && nextprops.single_Order_list.content
        if (data && !(nextprops.setOrderTocloudPrinter)) {
            var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
            if( checkPrintreciept && checkPrintreciept === true){
                this.setState({ showPrint: true })
            }
        }
         // handle cloud printer response
         if (nextprops && nextprops.setOrderTocloudPrinter && nextprops.setOrderTocloudPrinter && nextprops.setOrderTocloudPrinter.is_success == true) {
            this.closeCloudPopup()
        }
        
        if ((typeof nextprops.sendEmail !== 'undefined') && nextprops.sendEmail !== '') {
            this.setState({
                mailsucces: nextprops.sendEmail ? nextprops.sendEmail.is_success : null,
                showPrint: false
            })
            if (nextprops.sendEmail && nextprops.sendEmail.is_success == true) {
                setTimeout(
                    this.goToShopview()
                    , 2000);
            }
        }

        if (nextprops && nextprops.shop_orderstatus_update && nextprops.shop_orderstatus_update.order_status_update) {
            if (nextprops.shop_orderstatus_update.order_status_update.is_success == true) {
                this.setState({ isOrderSyncComplete: false })
            }
        }

        if (nextprops && nextprops.syncTemporderStatus) {
            if (nextprops.syncTemporderStatus.items && nextprops.syncTemporderStatus.items.content && nextprops.syncTemporderStatus.items.content.OrderNumber == 0) {
                setTimeout(() => {
                    var reciptId = localStorage.getItem('getorder') ? JSON.parse(localStorage.getItem('getorder')) : ''
                    checkOrderStatus(reciptId.OliverReciptId)
                }, 5000);
            }
        }
        if (nextprops.syncTemporderStatus.items && nextprops.syncTemporderStatus.items.content && nextprops.syncTemporderStatus.items.content.OrderNumber > 0) {
            this.setState({ isOrderSyncComplete: true, orderId: nextprops.syncTemporderStatus.items.content.OrderNumber });
        }
       
    }

         // *** refund complete extension code start *** ///
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
                    console.error('App Error : Extension Event does not match ', jsonMsg);
                    break;
            }
        }
    }

    extensionReady = () => {
        var clientJSON =
        {
            oliverpos:
            {
                event: "refundComplete"
            },
            data:
            {
                orderDetails:
                {
                    
                },
                orderStatus:
                {
                    
                },
            }
        };

        var iframex = document.getElementById("commoniframe").contentWindow;
        var _user = JSON.parse(localStorage.getItem("user"));
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }

    // *** refund complete extension code end *** ///

    // *** cloud printer handle functions *** //

    handlePrintClick = () => {
        const { cloudPrintersData } = this.state
        if (cloudPrintersData && cloudPrintersData !== [] && cloudPrintersData.content && cloudPrintersData.content.length) {
            setTimeout(() => {
                if(isMobileOnly == true){
                    $('#cloudPrinterListPopup').addClass('show')
                   }
                showModal('cloudPrinterListPopup')
            }, 500);
        }
        else {
            this.printReceipt()
        }
    }

    handleCloudPrinterClick = () => {
        const { dispatch, single_Order_list} = this.props
        var orderId = single_Order_list && single_Order_list.content && single_Order_list.content.order_id ? single_Order_list.content.order_id : 0
        var cloudPrinterIds = []
        // Check all checked checkbox on popup for cloud printer 
        // check if local printer clicked
        $("input:checkbox[name=setLocalPrinter]:checked").each(function () {
            cloudPrinterIds.push($(this).val());
        });
        $("input:checkbox[name=setCloudPrinter]:checked").each(function () {
            cloudPrinterIds.push(parseInt($(this).val()));
        });
        if (cloudPrinterIds && cloudPrinterIds.length) {
            var isLocalPrinterExist = cloudPrinterIds.find(itm => itm == 'localPrinter')
            if (isLocalPrinterExist) {
                this.setState({
                    printerByLocalprinter: true,
                    cloudPrinterErr: '',
                })
                this.printReceipt()
                setTimeout(() => {
                    this.closeCloudPopup()
                }, 200);
            } else if (cloudPrinterIds.find(itm => itm !== 'localPrinter')) {
                var data = {
                    type: 'refundComplete', // type field will not send to API request, only use to check condition
                    printerId: cloudPrinterIds,
                    orderId: orderId
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
    handlePrinterIdClick = (printerId) => {
        this.setState({
            cloudPrinterErr: ''
        })
    }
    // handle close cloud popup  
    closeCloudPopup = () => {
        this.setState({
            printerByLocalprinter: false,
            cloudPrinterErr: '',
            showPrint : false
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
        const { showPrint } = this.state
        var checkPrintreciept = localStorage.getItem("user") && localStorage.getItem("user") !== '' ? JSON.parse(localStorage.getItem("user")).print_receipt_on_sale_complete : '';
        var printData = localStorage.getItem('getorder') && JSON.parse(localStorage.getItem('getorder'))
        var order_reciept = localStorage.getItem('orderreciept') ? localStorage.getItem('orderreciept') === "undefined" ? null : JSON.parse(localStorage.getItem('orderreciept')) : "";
        // var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''

        var barCodeId = printData && printData.OliverReciptId
        var baseurl = order_reciept && order_reciept.CompanyLogo ? Config.key.RECIEPT_IMAGE_DOMAIN + order_reciept.CompanyLogo : '';
        baseurl = encodeURI(baseurl);
        var barcode_image = Config.key.RECIEPT_IMAGE_DOMAIN + "/Content/img/ic_barcode.svg";
        // // show local printer in case local printer clicked on popup
        // if(this.state.printerByLocalprinter == true){
        //     this.printReceipt()
        // }
        return (
            (isMobileOnly == true) ?
                <div>
                    {(!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false) && checkPrintreciept && checkPrintreciept == true && showPrint == true ? this.callPrintFUnction() : ''}
                    <div style={{ display: 'none' }}>
                        <img src={baseurl} width="50px" />
                    </div>
                    <div style={{ display: 'none' }}>
                        <img src={barcode_image} width="50px" />
                    </div>
                    <div style={{ display: 'none' }} >
                        <img src={this.textToBase64Barcode(barCodeId)} />
                    </div>
                    <MobileSaleComplete
                        type="refund"
                        LocalizedLanguage={LocalizedLanguage}
                        {...this.state}
                        goToShopview={this.goToShopview}
                        CancelSale={this.CancelSale}
                        handleInputChange={this.handleInputChange}
                        sendMail={this.sendMail}
                        CancelOrder={this.state.isLoading}
                        printReceipt={this.handlePrintClick}
                        // printReceipt={this.printReceipt}
                        tempOrderId={barCodeId}
                        order_reciept={order_reciept}
                        baseurl={baseurl}
                        barcode_image={barcode_image}
                    />
                    <CloudPrinterListPopup
                        cloudPrintersData={this.state.cloudPrintersData}
                        cloudPrinterErr={this.state.cloudPrinterErr}
                        handleCloudPrinterClick={() => this.handleCloudPrinterClick()}
                        closeCloudPopup={() => this.closeCloudPopup()}
                        handlePrinterIdClick={(setPrinterId) => this.handlePrinterIdClick(setPrinterId)}
                    />
                </div>
                :
                <div className="sale-complete">
                    {(!ActiveUser.key.isSelfcheckout || ActiveUser.key.isSelfcheckout === false) && checkPrintreciept && checkPrintreciept == true && showPrint == true ? this.callPrintFUnction() : ''}
                    <div style={{ display: 'none' }}>
                        <img src={baseurl} width="50px" />
                    </div>
                    <div style={{ display: 'none' }} >
                        <img src={barcode_image} width="50px" />
                    </div>
                    <div style={{ display: 'none' }} >
                        <img src={this.textToBase64Barcode(barCodeId)} />
                    </div>
                    <div className="sale-complete-logo">
                        {/* <img src="../assets/images/logo-dark.svg" width="100%" alt=""> */}
                        <img src="../assets/images/logo-dark.svg" className="w-100" alt="" />
                    </div>
                    <div className="sale-complete-strached">
                        <div className="sale_complete">
                            <div className="widget__list_2">
                                <img src="../assets/images/check-green.svg" className="widget__list_icon" alt="" />
                                <h4>{LocalizedLanguage.refundComplete}</h4>
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
                                                        {/* refund Complete extesnsion button  */}
                                                        <ExtensionList type={'Checkout Complete'} showExtensionIframe={this.showExtensionIframe} />
                                                        {/* refund Complete extesnsion buttons  */}
                                                    </div>

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
                                                                    <input type="hidden" id="order-id" defaultValue={(typeof barCodeId !== "undefined") ? barCodeId : 0} />
                                                                    <input type="text" defaultValue={(this.state.customer_email) ? this.state.customer_email : ''}
                                                                        className="form-control" id="customer-email" placeholder="example@gmail.com"
                                                                        disabled={(this.state.customer_email) ? true : false}
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
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <button className="btn btn-primary btn-block btn-lg" id="btnSubmit" onClick={() => this.sendMail()}
                                                                            disabled={(this.state.customer_email) ? false : false} >{LocalizedLanguage.emailReceipt}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="emialsuctes text-primary" style={{ display: "none" }}>
                                                                {this.state.IsEmailExist == false ? LocalizedLanguage.enterEmail :
                                                                    this.state.valiedEmail == false ? LocalizedLanguage.invalidEmail :
                                                                        this.state.mailsucces == null ? LocalizedLanguage.pleaseWait :
                                                                            this.state.mailsucces && this.state.mailsucces == true ? LocalizedLanguage.successSendEmail
                                                                                : this.state.mailsucces == false ? LocalizedLanguage.failedSendEmail : ""
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
                                        <button className="btn btn-info btn-lg btn-block text-uppercase btn-sale" onClick={() => this.goToShopview()}>
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
                    <CloudPrinterListPopup
                        cloudPrintersData={this.state.cloudPrintersData}
                        cloudPrinterErr={this.state.cloudPrinterErr}
                        handleCloudPrinterClick={() => this.handleCloudPrinterClick()}
                        closeCloudPopup={() => this.closeCloudPopup()}
                        handlePrinterIdClick={(setPrinterId) => this.handlePrinterIdClick(setPrinterId)}
                    />
                    <CommonOrderStatusPopup
                        orderId={this.state.orderId}
                        currentOrderStaus={this.state.isOrderSyncComplete == true ? KeysOrderStaus.key.completed : KeysOrderStaus.key.pending}
                    // Cust_ID={checkList && checkList.customerDetail && checkList.customerDetail.Content}
                    />
                </div>
            //     /* // }
            // // <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} /> */}
        )
    }

}

function mapStateToProps(state) {
    const { sendEmail, single_Order_list,syncTemporder,setOrderTocloudPrinter } = state;
    return {
        sendEmail: sendEmail.sendEmail,
        single_Order_list: single_Order_list.items,
        loading: single_Order_list.loading,
        syncTemporderStatus : syncTemporder,
        setOrderTocloudPrinter : setOrderTocloudPrinter.printerRes
    };
}
const connectedRefundComplete = connect(mapStateToProps)(RefundComplete);
export { connectedRefundComplete as RefundComplete };