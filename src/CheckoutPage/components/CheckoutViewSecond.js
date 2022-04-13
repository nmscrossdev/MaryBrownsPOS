import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { customerActions, CustomerView } from '../../CustomerPage'
import { get_UDid } from '../../ALL_localstorage';
import ActiveUser from '../../settings/ActiveUser';
import { CustomerViewEdit } from '../../CustomerPage/components/CustomerEdit';
import { CheckoutCustomer } from '../../CustomerPage/components/CheckoutCustomer'
import { LoadingModal, CommonHeader, AndroidAndIOSLoader, NavbarPage } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import Footer from '../../_components/views/m.Footer';
import $ from 'jquery';
//import Favicon from 'react-favicon';
import { selectRefresh } from '../../_components/CommonFunction'
import { handleAppEvent } from '../../ExtensionHandeler/commonAppHandler';

const { Email, RegisterName, LocationName } = ActiveUser.key;
var clientExtensionData = new Object();
var RoundAmount = (val) => {
    //return Math.round(val * 100) / 100;
    var decimals = 2;
    return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}

class CheckoutViewSecond extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkList: [],
            isShowExtentionDdl: false,
            showExtentionVal: '',
            orderType: '',
            saleRep: '',
            affiliate: '',
            active_true_diamond: false,
            true_dimaond_field: localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [],
            true_diamond_data: '',
            iFrameLoader: false,
            activeExtentionFieldName: "",
            activeContactDetail: false,
            ExtentionPaymentCalling:false
        }
        this.addPayment = this.addPayment.bind(this);
        this.showExtention = this.showExtention.bind(this);
        this.hideExtention = this.hideExtention.bind(this);
        this.activeTrueDiamond = this.activeTrueDiamond.bind(this);
        this.resyncIframeUrl = this.resyncIframeUrl.bind(this);
        this.backActiveExtensionList = this.backActiveExtensionList.bind(this);
    }
    /**
     * Description : listen the data of ifram 
     */
    componentWillMount() {
        var checkList = localStorage.getItem('CHECKLIST');
        this.setState({ checkList: JSON.parse(checkList) })
        // const { showExtention } = this.props;
        // window.addEventListener('message', function (e) {
        //     showExtention(e.data);
        // }, false);
        var showExtention = localStorage.getItem("showExtention");
        var sortTureDiamondArray = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
        var true_diamond_data = sortTureDiamondArray && sortTureDiamondArray.length > 0 ? sortTureDiamondArray.sort((a, b) => parseFloat(a.Order) - parseFloat(b.Order)) : "";
        this.setState({ true_dimaond_field: true_diamond_data })
        // console.log("sortTureDiamondArray", sortTureDiamondArray)
        if (true_diamond_data && true_diamond_data.length == 1 && true_diamond_data[0].Name == "Contact Details") {
            showExtention = "false";
        }
        if (showExtention == "true" && true_diamond_data && true_diamond_data.length > 0) {

            
            var nameOfActiveList = true_diamond_data[0].Name !== "Contact Details" ? true_diamond_data[0].Name :
                true_diamond_data.length >= 2 ? true_diamond_data[1].Name : "";
            ;
            //Do load default extension
            // console.log("nameOfActiveList", nameOfActiveList)
            // if (nameOfActiveList !== "Contact Details") {
            //     this.setState({ activeExtentionFieldName: nameOfActiveList })
            //     setTimeout(function () {
            //         $("#contact_details").removeClass("active")
            //         $("#true_diamond").addClass("active")
            //     }, 500)
            // }
            if (nameOfActiveList == "Contact Details") {
                this.setState({ activeContactDetail: true })
            }
            //do not load default extension
            // if (showExtention == "true") {
            //     var extId = true_diamond_data[0].Name !== "Contact Details" ? true_diamond_data[0].Id :
            //         true_diamond_data.length >= 2 ? true_diamond_data[1].Id : "";
            //     this.defaultActiveTrueDiamond(`true_${extId}`)
            //     //this.defaultActiveTrueDiamond(`true_${true_diamond_data[0].Id}`)
            // }
        }
    }

    defaultActiveTrueDiamond(id) {
        var CurrentUserActive = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '';
        var User_Email = CurrentUserActive && CurrentUserActive.user_email;
        var status = id;
        this.setState({
            active_true_diamond: status,
            iFrameLoader: true
        })
        if (status == 'false') {
            localStorage.setItem(`ACTIVE_TRUE_DIAMOND_${User_Email}`, `${status}`);
        } else {
            localStorage.setItem(`ACTIVE_TRUE_DIAMOND_${User_Email}`, `true`);
        }
        this.props.activeTrueDiamond(status);
        setTimeout(function () {
            this.updateIframeStatus()
        }.bind(this), 1000)
    }

    componentDidMount() {
        const { showExtention } = this.props;
        var _user = JSON.parse(localStorage.getItem("user"));
        // ************ Update _user.instance for local testing ************* //
        // _user.instance = window.location.origin
        // localStorage.setItem("user", JSON.stringify(_user));
        // ************ End ********* //
        window.addEventListener('message', (e) => {
            if (e.origin && _user && _user.instance) {
                try {
                    var extensionData = e.data && typeof e.data == 'string' ? JSON.parse(e.data) : e.data;
                    if (extensionData && extensionData !== "" && extensionData.oliverpos) {
                        showExtention(extensionData);
                    }
                   
                }
                catch (err) {
                    console.error(err);
                }
            }
        }, false);

        //      if(this.props.toggleExtentionStatus == false && this.props.toggleExtentionStatus !== ""){
        //       this.ifr.onload = () => {
        //           console.log("clientExtensionData", clientExtensionData)
        //           alert()
        //         //setTimeout(function(){
        //             this.ifr.contentWindow.postMessage(clientExtensionData, "*");
        //        // }.bind(this),1500)
        //       }
        //    }
        setTimeout(() => {
            selectRefresh();
        }, 200);


    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.extensionReadyToPost == true && nextProps.extensionReadyToPost !== "") {
            var checkCartList = this.props.checkoutlist ? this.props.checkoutlist : localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST')) ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
            const { checkList } = this.state;            
            var extentionTotal = checkList && checkList.totalPrice ? checkList.totalPrice : 0;
            var extentionCustomerDetail = checkList && checkList.customerDetail && checkList.customerDetail.content ? checkList.customerDetail.content : '';
            var extentionProductTax = checkCartList ? checkCartList.tax : checkList && checkList.tax ? checkList.tax : '';
            this.ExtentionCartDataEvent(extentionCustomerDetail, extentionProductTax, extentionTotal, checkCartList);
            if(clientExtensionData && clientExtensionData !="" && this.state.ExtentionPaymentCalling==false){
                this.sendMessageToExtention(JSON.stringify(clientExtensionData));
                this.state.ExtentionPaymentCalling=true;
            }
        }
    }

    Edit_Modal(id) {
        this.props.edit_status(true)
        var UID = get_UDid('UDID');
        this.props.dispatch(customerActions.getDetail(id, UID));
        if (isMobileOnly == true) {
            this.props.changeComponent("edit_customer")
        } else {
            this.Screen();
        }
    }

    Screen() {
        $('.disabled_popup_edit_close').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

    addPayment(type, store_credit) {
        var amount = 0;
        var calc_output = $('#calc_output').val();
        if (calc_output !== '' && typeof calc_output !== 'undefined') {
            amount = $('#calc_output').val();
        } else {
            amount = $('#my-input').val();
        }
        if (store_credit >= amount) {
            // this.props.addPayment(type, store_credit);
            //this.props.getPayment(type, amount);
            //this.props.setOrderPartialPayments(amount, type);
            this.props.updateStoreCreditPayment(amount, type, true);
        } else if (store_credit < amount) {
            this.props.extraPayAmount(`${LocalizedLanguage.storeCreditMsg} $${parseFloat(RoundAmount(store_credit))}`)
        } else if (type == 'lay_away') {
            this.props.getPayment(type);
        }
    }

    layAwayOrder(status) {
        this.props.orderPopup(status);
    }

    showExtention(Extention) {
        this.setState({ isShowExtentionDdl: true, showExtentionVal: Extention });
    }

    hideExtention(event) {
        var selectedval = event.target.value;
        if (selectedval && selectedval !== '') {
            this.setState({ showExtentionVal: selectedval })
            if (selectedval !== 'liTrueDiamond') {
                this.setState({
                    isShowExtentionDdl: false,
                    showExtentionVal: '',
                    orderType: '',
                    saleRep: '',
                    affiliate: ''
                });
            }
        }
    }

    activeTrueDiamond(event, name) {
        var CurrentUserActive = localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '';
        var User_Email = CurrentUserActive && CurrentUserActive.user_email;
        //var status = event.target.value;
        var status = event;
        this.setState({
            active_true_diamond: status,
            iFrameLoader: true
        })
        if (status == 'false') {
            localStorage.setItem(`ACTIVE_TRUE_DIAMOND_${User_Email}`, `${status}`);
            this.setState({ activeContactDetail: true, activeExtentionFieldName: "" })
        } else {
            localStorage.setItem(`ACTIVE_TRUE_DIAMOND_${User_Email}`, `true`);
            this.setState({ activeContactDetail: false, activeExtentionFieldName: name })
        }
        this.props.activeTrueDiamond(status);
        setTimeout(function () {
            this.updateIframeStatus()
        }.bind(this), 1000)
    }

    updateIframeStatus() {
        this.setState({
            iFrameLoader: false
        })
    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 14-08-2019
    // Description : call function client side
    sendMessageToExtention = (msg)=> {
        console.log("call sendMessage to extension",msg)
       
        var iframex =undefined;

        if(this.props.extensionIframe == true){
             iframex = document.getElementById("commoniframe") && document.getElementById("commoniframe").contentWindow;
        }else{
            //var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
             iframex = document.getElementById("iframeid") && document.getElementById("iframeid").contentWindow;
        }
        var _user = JSON.parse(localStorage.getItem("user"));
        if(iframex){
        iframex.postMessage(msg, '*');//_user.instance
        console.log("iframe success")
        }
        else
        console.log("iframe issue")

        this.props.extensionReady(false);
    }
    // Created by :Shakuntala Jatav
    // Cerated Date: 14-08-2019
    // Description : Preparing data to send with IFram URL
    ExtentionCartDataEvent(CustomerDetail, extentionProductTax, totalAmount, chekoutData) {
        const { countryName, stateName, countryCode, stateCode, getCountryAndStateName } = this.props;
        var products = this.productParameter();
        var _wc_points_redeemed = chekoutData && chekoutData._wc_points_redeemed ? chekoutData._wc_points_redeemed : 0
        var _addressLine1 = "";
        var _addressLine2 = "";
        var _city = "";
        var _zip = "";
        var _country = "";
        var _state = "";
        var _email = CustomerDetail ? CustomerDetail.Email : "";
        var _customerId = CustomerDetail ? CustomerDetail.UID : "";
        if (CustomerDetail) {
            if (CustomerDetail.customerAddress) {
                if (CustomerDetail.customerAddress.length > 0) {
                    var customerAddress = CustomerDetail.customerAddress ? CustomerDetail.customerAddress.find(Items => Items.TypeName == "billing") : '';
                    _addressLine1 = customerAddress ? customerAddress.Address1 : '';
                    _addressLine2 = customerAddress ? customerAddress.Address2 : '';
                    _city = customerAddress ? customerAddress.City : '';
                    _zip = customerAddress ? customerAddress.PostCode : '';
                    _country = customerAddress ? customerAddress.Country : '';
                    _state = customerAddress ? customerAddress.State : '';

                }
            } else {
                _addressLine1 = CustomerDetail ? CustomerDetail.StreetAddress : '';
                _addressLine2 = CustomerDetail ? CustomerDetail.StreetAddress2 : '';
                _city = CustomerDetail ? CustomerDetail.City : '';
                _zip = CustomerDetail ? CustomerDetail.Pincode : '';
                _country = CustomerDetail ? CustomerDetail.Country : '';
                _state = CustomerDetail ? CustomerDetail.State : '';

            }
        }
       var clientDetails = localStorage.getItem('clientDetail') ?JSON.parse(localStorage.getItem('clientDetail'))  : null 
       var client_guid = clientDetails && clientDetails.subscription_detail ? clientDetails.subscription_detail.client_guid : null
       var registerId = localStorage.getItem('register') ? localStorage.getItem('register')  : null;      
       var locationId = localStorage.getItem('Location') ? localStorage.getItem('Location')  : null; 

        if (!countryCode && _country !== "") {
            getCountryAndStateName(_state, _country);
        }
       
        var clientJSON =
        {
            oliverpos:
            {
                event: "shareCheckoutData"
            },
            data:
            {
                checkoutData:
                {
                    "email": _email,
                    "wordpressId": _customerId,
                    "totalTax": extentionProductTax,
                    "cartProducts": products,
                    "addressLine1": _addressLine1,
                    "addressLine2": _addressLine2,
                    "city": _city,
                    "zip": _zip,
                    "countryCode": countryCode,
                    "country": countryName,
                    "stateCode": stateCode,
                    "state": stateName,
                    "total": totalAmount,
                    "_wc_points_redeemed": _wc_points_redeemed
                },
                client_guid:client_guid,
                register_id:registerId,
                location_id:locationId,
                customer_email:_email
            }
        };

        // Make sure you are sending a string, and to stringify JSON
        clientExtensionData = clientJSON;
       // console.log("clientJSON--", clientExtensionData)
        

        // if(products && products.length > 0){
        //  console.log("products", products);
        //  console.log("clientJSON", clientJSON)
        // setTimeout(function () {
        //     this.sendMessageToExtention(JSON.stringify(clientJSON));
        // }.bind(this), 1500)
        // }

    }

    productParameter() {
        var checkList = this.props.checkoutlist ? this.props.checkoutlist : localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST')) ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
        var listItems = checkList ? checkList.ListItem : this.state.checkList && this.state.checkList.ListItem;
        //var listItems =  this.state.checkList && this.state.checkList.ListItem;
        var itemsForExtention = [];
        listItems && listItems.length > 0 && listItems.map(items => {
            if (items.product_id) {
                itemsForExtention.push({
                    "amount": items.Price,
                    "productId": items.product_id,
                    "variationId": items.variation_id,
                    "tax": (items.excl_tax + items.incl_tax),
                    "discountAmount": items.discount_amount,
                    "quantity": items.quantity,
                    "title": items.Title
                })
            }
        })
        return itemsForExtention;
    }

    /**
     * Created By :Shakuntala Jatav
     * Created Dtae L 06-03-2020
     * @param {*} HostUrl 
     * Description : Again set iframe url or reload
     */
    resyncIframeUrl() {
        if(document.getElementById('iframeid')){
            document.getElementById('iframeid').src += '';
        }
    }

    /**
     * Created By : Shakuntala Jatav
     * Created Date : 25-03-2020
     * Description : Update state for customer view and extesion view
     */
    backActiveExtensionList() {
        // var showExtention = localStorage.getItem("showExtention");
        // if (showExtention && showExtention == "true") {
            this.setState({ activeContactDetail: false, activeExtentionFieldName: "" })
        //}
    }

    render() {
        var checkCartList = this.props.checkoutlist ? this.props.checkoutlist : localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST')) ? JSON.parse(localStorage.getItem('CHECKLIST')) : '';
        const { single_cutomer_list, customerData } = this.props;
        const { checkList, true_dimaond_field, active_true_diamond, iFrameLoader, activeExtentionFieldName, activeContactDetail } = this.state;
        var showExtention = localStorage.getItem("showExtention");
        var extentionCustomerDetail = checkList && checkList.customerDetail && checkList.customerDetail.content ? checkList.customerDetail.content : '';
        var extentionTotal = checkList && checkList.totalPrice ? checkList.totalPrice : 0;
        var extentionProductTax = checkCartList ? checkCartList.tax : checkList && checkList.tax ? checkList.tax : '';
        var checkoutList = (typeof single_cutomer_list !== 'undefined') && single_cutomer_list.content !== null ? single_cutomer_list.content.Email ? single_cutomer_list.content : single_cutomer_list.content.customerDetails : checkList && checkList.customerDetail && checkList.customerDetail.content;
        var customerAddress = checkoutList && checkoutList.customerAddress ? checkoutList.customerAddress.find(Items => Items.TypeName == "billing") : customerData && customerData.customerAddress ? customerData.customerAddress.find(Items => Items.TypeName == "billing") : extentionCustomerDetail && extentionCustomerDetail.customerAddress ? extentionCustomerDetail.customerAddress.find(Items => Items.TypeName == "billing") : '';
        var active_true_diamond_field = active_true_diamond !== 'false' && true_dimaond_field !="" ? true_dimaond_field.find(Items => `true_${Items.Id}` == active_true_diamond) : '';
        var HostUrl = ''
        if (active_true_diamond_field) {
            // var extentionUrl = active_true_diamond_field.ShowAtCheckout == true ? active_true_diamond_field.HostUrl + '/' + active_true_diamond_field.PageUrl : '';
            
            var extentionUrl=""
            if(active_true_diamond_field.PageUrl && validator.isURL(active_true_diamond_field.PageUrl)){   //check PageUrl is full URL
                extentionUrl = active_true_diamond_field.ShowAtCheckout == true ?  active_true_diamond_field.PageUrl : '';
            }else{
            extentionUrl = active_true_diamond_field.ShowAtCheckout == true ? active_true_diamond_field.HostUrl + '/' + active_true_diamond_field.PageUrl : '';
            }

            var extentionUrlContansQryMark = extentionUrl.includes("?") ? '&' : '?';
            extentionUrl += extentionUrlContansQryMark;
            var extentionUserEmail = Email;
            if (extentionUrl) {
                this.ExtentionCartDataEvent(extentionCustomerDetail, extentionProductTax, extentionTotal, checkCartList);
            }
            HostUrl = extentionUrl + encodeURIComponent(`userEmail=${extentionUserEmail}&location=${LocationName}&register=${RegisterName}&total=${extentionTotal}`);
        }
        if (!HostUrl.includes("http")) {
            HostUrl = "";
        }
        //HostUrl= "http://localhost:3000/externalApp/cartapp.html"
        var customerDetail = customerData ? customerData : extentionCustomerDetail;
        var extcount = true_dimaond_field && true_dimaond_field.filter((item) => (item.Name !== 'Contact Details')).length;
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;

        if(this.props.extensionIframe==false){
            this.state.ExtentionPaymentCalling=false;
        }
        return (
            (isMobileOnly == true) ?
                <div>
                    {iFrameLoader == true ? <AndroidAndIOSLoader /> : null}
                    <CommonHeader {...this.props} backActiveExtensionList={this.backActiveExtensionList} resyncIframeUrl={this.resyncIframeUrl} active_true_diamond={(activeExtentionFieldName == "" && activeContactDetail == true) ? "cust_view " : (activeExtentionFieldName !== "" && activeContactDetail == false) ? "extension_view" : ""} activeContactDetail={activeContactDetail} />
                    <NavbarPage  {...this.props} />
                    <div className="appCapsule h-100 overflow-auto vh-100" style={{ paddingBottom: 143 }}>
                        <div className="container-fluid pt-3">
                            {showExtention && showExtention == "true" && activeExtentionFieldName == "" && activeContactDetail == false &&
                                <div style={{ borderWidth: 0 }} className="panel panel-default panel-flex">
                                    <div className="panel-heading bg-white">
                                        <h4 className="panel--title">
                                            {LocalizedLanguage.oliverExtension}
                                        </h4>
                                    </div>
                                    <div className="panel-body">
                                        <div className="extention-menus">
                                            <div className="row">
                                                {true_dimaond_field && true_dimaond_field.length > 0 && true_dimaond_field.map((Items, index) => {
                                                    return (
                                                        ((Items.PluginId==0) || (Items.viewManagement && Items.viewManagement !== [] && Items.viewManagement.find(type => type.ViewSlug == 'Checkout'))) && //check for display the Automatic Apps extension only not apps 
                                                        <div key={index} className="col-sm-4" style={{ width: '50%' }}>
                                                            <div className="extension-box" onClick={() => this.activeTrueDiamond(Items.Name == 'Contact Details' ? "false" : `true_${Items.Id}`, Items.Name)}>
                                                                <div className="extension-image" >
                                                                    {Items.Name == 'Contact Details' ? <img src="assets/img/Customers.svg" />: Items.logo && Items.logo!== "" ?
                                                                    //  : Items.HostUrl && Items.HostUrl !== "" ?
                                                                        // <img src={"https://www.google.com/s2/favicons?domain=" + Items.HostUrl}></img>
                                                                        <img src={Items.logo}></img>
                                                                        : <img src="asseItems.logots/img/Questionsmark.svg" />}
                                                                </div>
                                                                <div className="extension-title">
                                                                    {Items.Name}
                                                                </div>
                                                            </div>
                                                        </div>                                                       
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {activeExtentionFieldName == "" && activeContactDetail == true &&
                                <div style={{ marginTop: 10 }}>
                                    <h6 style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        {customerDetail ? customerDetail.FirstName : checkoutList ? checkoutList.FirstName : ''}{" "}{customerDetail ? customerDetail.LastName : checkoutList ? checkoutList.LastName : LocalizedLanguage.shortCustomerInfo}
                                        {customerDetail || checkoutList ? <a className="edit-info" onClick={() => this.Edit_Modal(customerDetail ? customerDetail.UID : checkoutList.UID ? checkoutList.UID : checkoutList.WPId ? checkoutList.WPId : checkoutList.Id)}> <img src="mobileAssets/img/edit.png" style={{ width: 35, height: 35, padding: 10 }} /></a> : ""}
                                    </h6>
                                    <strong>{LocalizedLanguage.personalInfo}</strong>
                                    <table style={{ fontSize: 16 }}>
                                        <tbody>
                                            <tr>
                                                <th>{LocalizedLanguage.email}</th>
                                                <th style={{ width: 0 }}>:</th>
                                                <td>{customerDetail ? customerDetail.Email.length > 20 ? customerDetail.Email && customerDetail.Email.substring(0, 20) + '...' : customerDetail.Email : checkoutList ? checkoutList.Email && checkoutList.Email.length > 20 ? checkoutList.Email.substring(0, 20) + '...' : checkoutList.Email : ''}</td>
                                            </tr>
                                            <tr>
                                                <th>{LocalizedLanguage.addressOne}</th>
                                                <th style={{ width: 0 }}>:</th>
                                                <td>{customerAddress ? customerAddress.Address1 : checkoutList && checkoutList.StreetAddress ? checkoutList.StreetAddress : ''}</td>
                                            </tr>
                                            <tr>
                                                <th>{LocalizedLanguage.addressTwo}</th>
                                                <th style={{ width: 0 }}>:</th>
                                                <td>{customerAddress ? customerAddress.Address2 : checkoutList && checkoutList.StreetAddress2 ? checkoutList.StreetAddress2 : ''}</td>
                                            </tr>
                                            <tr>
                                                <th>{LocalizedLanguage.phone}</th>
                                                <th style={{ width: 0 }}>:</th>
                                                <td>{customerDetail ? customerDetail.PhoneNumber : checkoutList ? checkoutList.PhoneNumber ? checkoutList.PhoneNumber : checkoutList.Contact ? checkoutList.Contact : checkoutList.Phone : ''}</td>
                                            </tr>
                                            <tr>
                                                <th>{LocalizedLanguage.notes}</th>
                                                <th style={{ width: 0 }}>:</th>
                                                <td>{customerDetail ? customerDetail.Notes : checkoutList ? checkoutList.Notes ? checkoutList.Notes : checkoutList.notes : ''}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div style={{ marginTop: 10 }} >
                                        <strong>{LocalizedLanguage.accountInfo}</strong>
                                        <p style={{ fontSize: 16 }}>
                                            <span>{LocalizedLanguage.stroeCredit}: </span>
                                            <span>{customerDetail ? customerDetail.StoreCredit : checkoutList ? checkoutList.StoreCredit ? checkoutList.StoreCredit : checkoutList.store_credit : '0'}</span>
                                        </p>
                                    </div>
                                </div>
                            }
                            {activeExtentionFieldName !== "" && activeContactDetail == false &&
                                <div className="row" id="true_diamond" style={{ marginTop: 10 }}>
                                    <div className="col-sm-12">
                                        {HostUrl !== '' ?
                                            <iframe
                                                width="100%"
                                                height="450px"
                                                sandbox="allow-scripts allow-same-origin allow-forms"
                                                className="embed-responsive-item diamondSectionHeight"
                                                ref={(f) => this.ifr = f}
                                                src={HostUrl}
                                               //src={'../../externalApp/print.html'}
                                                id="iframeid"
                                            /> : null}
                                    </div>
                                </div>
                            }
                        </div>
                        <Footer active="extansion" {...this.props} />
                    </div>
                </div>
                :
                <div className="col-lg-7 col-md-7 col-sm-6 col-xs-6 pt-4 plr-8">
                    {/* {console.log("activeExtentionFieldName", activeExtentionFieldName)} */}
                    {/* {console.log("activeContactDetail", activeContactDetail)} */}                   
                    { activeExtentionFieldName == "" && activeContactDetail == false &&
                        // <div className= {isDemoUser ? "panel panel-default panel-flex pg-current-checkout-if_footer":"panel panel-default panel-flex"}>
                        <div className="panel panel-default panel-flex ">
                            <div className="panel-heading bg-white">
                                <h4 className="panel--title">
                                    {LocalizedLanguage.oliverApps}
                                </h4>
                            </div>
                            <div className="panel-body">
                                <div className="extention-menus">
                                    <div className="row">                                    
                                        {/* <div className="row"> */}
                                        {true_dimaond_field && true_dimaond_field.length > 0 && true_dimaond_field.map((Items, index) => {
                                            return (
                                                ((Items.PluginId==0) || (Items.viewManagement && Items.viewManagement !== [] && Items.viewManagement.find(type => type.ViewSlug == 'Checkout'))) && //check for display the Automatic Apps extension only not apps 
                                                <div key={index} className="col-md-4 col-sm-6 col-xs-6" >
                                                    <div className={Items.Name == 'Contact Details' ? 'extension-box' : ''} onClick={() => this.activeTrueDiamond(Items.Name == 'Contact Details' ? "false" : `true_${Items.Id}`, Items.Name)}>
                                                        <div className="extension-image scroll-hidden">
                                                            {/* {Items.Name == 'Contact Details' ? <img src="assets/img/Customers.svg" /> :
                                                                Items.HostUrl && Items.HostUrl !== "" ?
                                                                    <img src={"https://www.google.com/s2/favicons?domain=" + Items.HostUrl}></img>
                                                                    : <img src="assets/img/Questionsmark.svg" />
                                                            } */}
                                                            {Items.Name == 'Contact Details' ? <img src="assets/img/Customers.svg" />
                                                                : ''
                                                            }
                                                        </div>
                                                        <div className={Items.Name == 'Contact Details' ? 'extension-title' : ''}>
                                                            {/* {Items.Name} */}
                                                            {Items.Name !== 'Contact Details' ? '' : LocalizedLanguage.customers}
                                                        </div>
                                                    </div>
                                                </div>                                               
                                            )
                                        })}
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                            {showExtention && showExtention == "true" && extcount > 0 && true_dimaond_field.removed_from_origin !==true ?
                                <div className="panel-heading bg-white  overflow-auto ">
                                    <h4 className="panel--inner-title">
                                        {LocalizedLanguage.automaticExtension}
                                    </h4>
                                    <div className="row">
                                {true_dimaond_field && true_dimaond_field.length > 0 && true_dimaond_field.map((Items, index) => {
                                    var x = false
                                    return (
                                        // Items.PluginId == 0 && //check for display the Automatic Apps extension only not apps 
                                        <div key={index}>
                                            {(Items.PluginId == 0 && Items.Name !== 'Contact Details' && Items.ShowAtCheckout === true) ||
                                                (Items.viewManagement && Items.viewManagement !== [] && Items.viewManagement.find(type => type.ViewSlug == 'Checkout')) ?
                                                <div className="col-sm-4">
                                                    <div className={Items.Name !== 'Contact Details' ? 'extension-box' : ''} onClick={() => this.activeTrueDiamond(Items.Name == 'Contact Details' ? "false" : `true_${Items.Id}`, Items.Name)}>
                                                        <div className='extension-image'>
                                                            {Items.Name !== 'Contact Details' ? Items.logo && Items.logo !== ""
                                                                ? <img src={Items.logo}></img>
                                                                : <img src="assets/img/Questionsmark.svg" />
                                                                : ''
                                                            }
                                                        </div>
                                                        <div className={Items.Name !== 'Contact Details' ? 'extension-title' : ''}>
                                                            {Items.Name == 'Contact Details' ? '' : Items.Name}
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                            }
                                        </div>
                                            )
                                        })}
                                    </div>
                                </div> : null}
                        </div>}
                    {activeExtentionFieldName == "" && activeContactDetail == true &&
                        <div className="panel panel-default panel-flex">
                            <div className="panel-heading bg-white">
                                <div className="panel-flex-box">
                                    <div className="panel-flex-box-buttons" onClick={() => this.backActiveExtensionList()}>
                                        <i className="icons8-extensions"></i>
                                    </div>
                                    <h4 className="panel--title">
                                        {customerData ? customerData.FirstName : checkoutList ? checkoutList.FirstName : ''}{" "}{customerData ? customerData.LastName : checkoutList ? checkoutList.LastName : LocalizedLanguage.CustomerDetails}
                                    </h4>
                                    <div className="panel-flex-box-buttons">
                                        {/* <i className="icons8-restart"></i> */}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="panel-body"> */}
                            {/* <div className="singleName">
                                    <h4 className="mb-2">{customerData ? customerData.FirstName : checkoutList ? checkoutList.FirstName : ''}{" "}{customerData ? customerData.LastName : checkoutList ? checkoutList.LastName : LocalizedLanguage.shortCustomerDetails}{customerData || checkoutList ? <a className="edit-info" onClick={() => this.Edit_Modal(customerData ? customerData.UID : checkoutList.UID ? checkoutList.UID : checkoutList.WPId ? checkoutList.WPId : checkoutList.Id)}>{LocalizedLanguage.edit} <span className="hide_small">{LocalizedLanguage.information}</span></a> : ""}</h4>
                                </div> */}
                            <CustomerView />
                        </div>
                    }
                    {activeExtentionFieldName !== "" && activeContactDetail == false &&
                        <div className="panel panel-default panel-flex">
                            <div className="panel-heading bg-white">
                                <div className="panel-flex-box">
                                    <div className="panel-flex-box-buttons" onClick={() => this.backActiveExtensionList()}>
                                        <i className="icons8-extensions"></i>
                                    </div>
                                    <h4 className="panel--title">
                                        {activeExtentionFieldName}
                                    </h4>
                                    <div className="panel-flex-box-buttons" onClick={() => this.resyncIframeUrl()}>
                                        <i className="icons8-restart"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-body center-center">
                                {iFrameLoader == true ? <LoadingModal /> : null}
                                {HostUrl !== '' ?
                                    <iframe
                                        width="100%"
                                        height="450px"
                                        sandbox="allow-scripts allow-same-origin allow-forms"
                                        className="embed-responsive-item diamondSectionHeight"
                                        ref={(f) => this.ifr = f}
                                        // src={'../extensionTestPage/addCustomer.html'} // added for local test
                                        src={HostUrl}
                                       //src={'./externalApp/paymentApp.html'}
                                        id="iframeid"
                                    />
                                    :
                                    <div className="w-100">
                                        <div className="no-product-find AppModal">
                                            {/* <i className="icons8-cloud-link"></i> */}
                                            <img src="../assets/img/icons8-cloud-sync.svg" />
                                            <p>Loading Your Extension..</p>
                                        </div>
                                        {/* <AppMenuList/> */}
                                    </div>}
                            </div>
                        </div>}
                </div>
        )
    }
}
function mapStateToProps(state) {
    const { checkoutlist, checkout_list, single_cutomer_list } = state;
    return {
        checkoutlist: checkoutlist.items,
        checkout_list: checkout_list.items,
        single_cutomer_list: single_cutomer_list.items,
    };
}
const connectedCheckoutViewSecond = connect(mapStateToProps)(CheckoutViewSecond);
export { connectedCheckoutViewSecond as CheckoutViewSecond };