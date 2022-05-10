import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { get_UDid } from '../../ALL_localstorage';
import config from '../../Config';
import Permissions from '../../settings/Permissions';
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import { ActivityOrderList, ActivitySecondView, activityActions } from '../index';
import { CommonMsgModal, NavbarPage, CommonHeader, LoadingModal, TaxSetting, AndroidAndIOSLoader, CommonModuleJS } from '../../_components/index';
import { cloudPrinterActions, sendMailAction } from '../../_actions/index';
import { customerActions, CustomerViewEdit } from '../../CustomerPage/index';
import { checkoutActions } from '../../CheckoutPage/index';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import MobileActivityView from '../views/m.ActivityView';
import { CommonOrderStatusPopup } from '../../_components/CommanOrderStatusPopup';
import KeysOrderStaus from '../../settings/KeysOrderStaus'
import { OpeningFloatPopup } from '../../CashManagementPage/components/OpeningFloatPopup';
import { CloseRegisterPopupTwo } from '../../CashManagementPage/components/CloseRegisterPopupTwo'
import Select from 'react-select'
import $ from 'jquery';
import { refreshToggle } from '../../_components/CommonFunction'
import { cashManagementAction } from '../../CashManagementPage/actions/cashManagement.action';
import { PlanUpgradePopup } from '../../_components/PlanUpgradePopup';
import { CommonDemoShopButton } from '../../_components/CommonDemoShopButton';
import { OnBoardingAllModal } from '../../onboarding';
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import { trackPage } from '../../_components/SegmentAnalytic'
import { OnboardingShopViewPopup } from '../../onboarding/components/OnboardingShopViewPopup';
import { getHostURLsBySelectedExt, onBackTOLoginBtnClick, sendClientsDetails, sendRegisterDetails, sendTipInfoDetails } from '../../_components/CommonJS';
import ActiveUser from '../../settings/ActiveUser';
import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
import { CloudPrinterListPopup } from '../../_components/CloudPrinterListPopup';
import { handleAppEvent } from '../../ExtensionHandeler/commonAppHandler';
import { useSearchParams } from "react-router-dom";

var moment_time_zone = require('moment-timezone');

var _platform = [{ key: "both", value: "Both" }, { key: "oliver-pos", value: "Oliver POS" }, { key: "web-shop", value: "Webshop" }];
var _orderstatus = [{ key: "", value: "All" }, { key: "pending", value: "Parked" }, { key: "on-hold", value: "Lay-Away" }, { key: "cancelled", value: "Voided" }, { key: "refunded", value: "Refunded" }, { key: "completed", value: "Closed" }];
class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            CreatedDate: null,
            pagenumber: 2,
            getPdfdateTime: null,
            activeFilter: false,
            activityBuffer: new Array(),
            search: '',
            pushInactivityBuffer: true,
            loading: false,
            Emailstatus: false,
            productList: [],
            selected_row: false,
            ////////////add customer  parameter//////////////
            FirstName: '',
            LastName: '',
            Street_Address: '',
            city: '',
            PhoneNumber: '',
            user_notes: '',
            Email: '',
            Pincode: '',
            user_id: '',
            UDID: '',
            add_note: null,
            paid_amount: null,
            store_credit: 0,
            Street_Address2: '',
            getCountryList: localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('countrylist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '',
            getStateList: localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '',
            country_name: '',
            state_name: '',
            common_Msg: '',
            scrollTopStatus: false,
            filterButtonText: LocalizedLanguage.filter,
            filterByPlatform: '',
            filterByStatus: '',
            filterByUser: '',
            filterByFromDate: '',
            filterByToDate: '',
            // filterApplyServerside:false,
            selectedOption: '',
            extensionIframe: false, // extension state
            extHostUrl: '',
            extPageUrl: '',
            printerByLocalprinter: false,
            cloudPrintersData: [],
            cloudPrinterErr: '',
            appreposnse:null

        }
        this.filterCustomerOrder = this.filterCustomerOrder.bind(this);
        this.activeClass = this.activeClass.bind(this);
        this.activityTableFilter = this.activityTableFilter.bind(this);
        this.load = this.load.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleGroupChange = this.handleGroupChange.bind(this);
        this.handleBarcodeData = this.handleBarcodeData.bind(this);
        // this.applyServerFilter = this.applyServerFilter.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.onChangeStateList = this.onChangeStateList.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.CommonMsg = this.CommonMsg.bind(this)
        this.showExtention = this.showExtention.bind(this)
        this.deleteDuplicateOrder = this.deleteDuplicateOrder.bind(this)
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            this.setState({ productList: TaxSetting.getTaxAllProduct(val) })
        });
    }


    deleteDuplicateOrder(orderId){
        const {  single_Order_list } = this.props;
        var orderId= single_Order_list ? single_Order_list.content && single_Order_list.content && single_Order_list.content.order_id : null
        if(orderId){
        this.props.dispatch(activityActions.deleteDuplicateOrder(orderId));
        }
    }

    /**
     *  Created By:priyanka
     * Created Date:20/6/2019
     * Description:reload siderbar javascript  
    //  */
    componentDidMount() {

        refreshToggle();
        //....Create script tag dynemicaly------------
        var head = document.head;
        var _script = document.createElement("SCRIPT");
        _script.src = "./mobileAssets/www/customScript.js";
        head.appendChild(_script);
        //--------------------------------------

        this.reload();
        sessionStorage.removeItem('OrderDetail');
        localStorage.removeItem("oliver_order_payments");
        if (localStorage.getItem('selected_row') == 'customerview') {
            // setTimeout(function () {
            //     siderbarInit();
            // }, 500)
        }
        if (localStorage.getItem("BACK_CHECKOUT") && localStorage.getItem("BACK_CHECKOUT") == "true") {
            localStorage.removeItem("BACK_CHECKOUT")
            localStorage.removeItem("AdCusDetail")
        }

        // this.FillUser();
        /**
         *  Created By:aman 
         * Created Date:22/07/2020
         * Description : for automatically show the toggle open, when clicking cross button of close register popup.   
         */
        $('#closeRegister').on('click', function () {
            $('.flat-toggle.cm-flat-toggle').addClass("on");
            $('.cm-user-switcher .flat-toggle').find("span").addClass('open');
            $('.cm-user-switcher .flat-toggle').find("span").removeClass('close');
        });

        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        if (demoUser) {
            GTM_OliverDemoUser("Visited Acitvity View")
        }
        trackPage(window.location.pathname, "Activity View", "ActivityView", "ActivityView");

        // *** activity extension code *** //

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

                    // display app v1.0-------------------------------------
                    if (extensionData && extensionData !== "" ) {                
                      var appresponse=  handleAppEvent(extensionData,"ActivityView");
                      //console.log("appResponse1",appresponse)
                      if(appresponse){
                          if(this.setState.appreposnse !==appresponse){
                               this.setState({"appreposnse": appresponse});
                          }
                      
                      }
                    }
                    //----------------------------------------
                }
                catch (err) {
                    console.error('App Error : ', err)
                }
            }
        }, false);

        // *** activity extension code end *** //
        // cloud printer list from localstorage
        var cloudPrinters = localStorage.getItem('cloudPrinters') ? JSON.parse(localStorage.getItem('cloudPrinters')) : []
        this.setState({
            cloudPrintersData: cloudPrinters,
            // printerByLocalprinter : cloudPrinters && cloudPrinters !==[] && cloudPrinters.content ? false : true
        })
    }
   
    handleBarcodeData(data) {
        $("#search-orders").val(data);
        this.applyServerFilter();
    }

    /**
     *  Created By:priyanka 
     * Created Date:8/7/2019
     * Description : handleChangeList() is used to get state list in based of country code   
     */
    handleChangeList(e) {
        var finalStatelist = [];
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Country == e.target.value) {
                finalStatelist.push(element)
            }
        })
        this.setState({
            viewStateList: finalStatelist,
            country_name: e.target.value,
            state_name: ''
        })
    }
    /** 
     * Created By:priyanka
     * Created Date:8/7/2019
     * onChangeStateList() is set state code   
     */
    onChangeStateList(e) {
        this.setState({
            state_name: e.target.value,
        })
    }

    handleSubmit(e) {
        const { UDID, user_id, Street_Address, city, country_name, state_name, PhoneNumber, Email, FirstName, LastName, Notes, Pincode, Street_Address2 } = this.state;
        const { dispatch } = this.props;
        if (UDID && user_id && Email) {
            const update = {
                WPId: user_id,
                FirstName: FirstName,
                LastName: LastName,
                Contact: PhoneNumber,
                startAmount: 0,
                Email: Email,
                udid: UDID,
                notes: Notes,
                StreetAddress: Street_Address,
                Pincode: Pincode,
                City: city,
                Country: country_name,
                State: state_name,
                StreetAddress2: Street_Address2,
            }
            dispatch(customerActions.update(update));
            $(".close").click();
            localStorage.setItem('custActive', 'false')
        }
    }

    componentWillMount() {
        setTimeout(function () {
            this.setState({
                loading: true
            })
        }.bind(this), 2000);
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 1000);
    }

    reload(pagno) {
        var UID = get_UDid('UDID');
        this.setState({ UDID: UID })
        var pagesize = config.key.ACTIVITY_PAGE_SIZE
        this.state.selected_row = true
        this.setState({ selected_row: true })

        this.props.dispatch(activityActions.getAll(UID, pagesize, pagno));
    }

    load() {
        localStorage.removeItem("CUSTOMER_TO_OrderId")
        this.setState({
            pushInactivityBuffer: true,
        })
        if (this.state.pagenumber) {
            this.setState({
                pagenumber: this.state.pagenumber + 1,
                scrollTopStatus: true
            });
            if (this.state.pagenumber != 1) {
                this.reload(this.state.pagenumber);
            }
        }
    }
    /**
     *  Created By:priyanka
     * Created Date:19/6/2019
     * Description:get  order id to display selected order  
     */
    componentWillReceiveProps(nextprops) {
        var AdCusDetail = nextprops.single_cutomer_list && nextprops.single_cutomer_list.content && nextprops.single_cutomer_list.content.customerDetails;
        var customer_id = AdCusDetail ? AdCusDetail.UID : '';
        var customerAddress = AdCusDetail ? AdCusDetail.customerAddress.find(Items => Items.TypeName == "billing") : '';
        if ((typeof AdCusDetail !== 'undefined') && AdCusDetail != null) {
            this.setState({
                FirstName: AdCusDetail.FirstName ? AdCusDetail.FirstName : '',
                LastName: AdCusDetail.LastName,
                Street_Address: customerAddress ? customerAddress.Address1 : '',
                city: customerAddress ? customerAddress.City : '',
                PhoneNumber: AdCusDetail.Contact,
                Notes: AdCusDetail.Notes,
                Email: AdCusDetail.Email,
                Pincode: customerAddress ? customerAddress.PostCode : '',
                user_id: AdCusDetail.WPId ? AdCusDetail.WPId : AdCusDetail.UID,
                user_store_credit: AdCusDetail && AdCusDetail.StoreCredit ? AdCusDetail.StoreCredit : '',
                Street_Address2: customerAddress ? customerAddress.Address2 : '',
                country_name: customerAddress ? customerAddress.Country : '',
            })
            var state = customerAddress && customerAddress.State != '' ? customerAddress.State : ''
            var country = customerAddress.Country != '' ? customerAddress.Country : '';
            if (country) {
                this.setCountryToStateList(country, state)
                this.getCountryAndStateName(state, country)
            }
            this.setState({ isLoading: false });
            if (typeof localStorage.getItem('custActive') !== "undefined") {
                if (localStorage.getItem('custActive') == 'true' && localStorage.getItem('custActive') !== '' && customer_id !== '') {
                    showModal('edit-info');
                    // $('#edit-info').modal('show');
                    //       this.freezEditScreen()
                }
            }
        }
        if (nextprops.sendEmail && (typeof nextprops.sendEmail !== 'undefined') && nextprops.sendEmail !== '' && nextprops.sendEmail.is_success == true && this.state.Emailstatus == true) {
            this.CommonMsg(LocalizedLanguage.sendEmailRecipt);
            // $('#common_msg_popup').modal('show');
            this.setState({ Emailstatus: false, loading: false });
            showModal('common_msg_popup');

        } else if (nextprops.sendEmail && (typeof nextprops.sendEmail !== 'undefined') && nextprops.sendEmail !== '' && nextprops.sendEmail.is_success == false && this.state.Emailstatus == true) {
            this.CommonMsg(LocalizedLanguage.sendEmailFailed);
            //$('#common_msg_popup').modal('show');
            this.setState({ Emailstatus: false, loading: false });
            showModal('common_msg_popup');
        }

        // handle cloud printer response
        if (nextprops && nextprops.setOrderTocloudPrinter && nextprops.setOrderTocloudPrinter.is_success == true) {
            this.closeCloudPopup()
        }
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 1000);
        var UID = get_UDid('UDID');
        this.setState({ UDID: UID })
        var customer_to_OrderId = (typeof localStorage.getItem("CUSTOMER_TO_OrderId") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_OrderId") !== null) ? localStorage.getItem("CUSTOMER_TO_OrderId") : null;
        if (customer_to_OrderId !== null && this.state.selected_row == true) {
            localStorage.removeItem("CUSTOMER_TO_ACTVITY")
            this.setState({ selected_row: false })
            if (customer_to_OrderId !== "undefined")
                this.props.dispatch(activityActions.getDetail(customer_to_OrderId, UID));
        }
        var customer_to_activity_id = (typeof localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null) ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : null;
        if (customer_to_activity_id !== null && this.state.selected_row == true || customer_to_OrderId == null || customer_to_OrderId == '' || !customer_to_OrderId) {
            this.setState({ selected_row: false })
            localStorage.setItem('CUSTOMER_TO_OrderId', 'undefined')
            if (customer_to_activity_id && customer_to_activity_id !== null && customer_to_activity_id !== "undefined") {
                this.props.dispatch(activityActions.getDetail(customer_to_activity_id, UID));
            }
        }
        // if(nextprops.activities && nextprops.activities.activities && nextprops.activities.filterActivities){
        //     this.setState({activityBuffer:nextprops.activities.filterActivities});
        //     console.log("setActivityBuffer",this.state.activityBuffer);
        // }


        if (this.state.pagenumber > 2 && this.state.scrollTopStatus == true) {
            // console.log("pagno", this.state.pagenumber)
            var pgNm = this.state.pagenumber
            setTimeout(function () {
                // $(".customer_active").scrollTop();
                //    var topMenu = $("#mCSB_2");
                //    console.log("topMenu", topMenu, pgNm)
                var heightIs = 40 * pgNm;
                //      console.log("heightIs", heightIs)
                //    var topMenuHeight = topMenu.outerHeight()+ heightIs;
                //     console.log("topMenuHeight", topMenuHeight)
                //     var fromTop = $("#mCSB_2").scrollTop()+topMenuHeight;
                //     console.log("fromTop", fromTop)
                //     $("#mCSB_2").animate({ 
                //         scrollTop: fromTop
                //     }, 2000);  
                //      var topMenu = $('.customer_active').offset().top;
                //    console.log("topMenu", topMenu)
                var nav = $('.customer_active');
                var custId = localStorage.getItem("CUSTOMER_TO_ACTVITY") !== 'undefined' && localStorage.getItem("CUSTOMER_TO_ACTVITY") !== null ? localStorage.getItem("CUSTOMER_TO_ACTVITY") : ""
                var ids = $(`#activity-order-${custId}`);
                //  console.log("nav", ids)
                // var topHeight = 7550 * (pgNm - 2)
                // console.log("topHeight", topHeight)
                // $("#mCSB_2_container").css("top", `-${topHeight}px`)
                if (ids.length) {
                    var topMenu = ids.offset().top;
                    //  console.log("topMenu", topMenu)
                    // $("#mCSB_2_container").css("top", `-${topHeight}px`)
                    $('#mCSB_2').animate({
                        scrollTop: ids.offset().top - heightIs
                    }, 2000);
                } else {
                    $('#mCSB_2').animate({
                        scrollTop: ids.offset().top - heightIs
                    }, 2000);
                }

                //$("#mCSB_2").css("overflow", "auto")


                //        $("#mCSB_2").animate({ 
                //         scrollTop: $(ids).offset() - heightIs
                //     }, 2000);  

                // $(document).ready(function(){
                //     $('.scrollbar-dynamic').scrollbar();
                // });
            }, 1000)
            this.setState({ scrollTopStatus: false })

        }
    }

    freezEditScreen() {
        // $('.disabled_popup_edit_close').modal({
        //     backdrop: 'static',
        //     keyboard: false
        // })
    }
    /** 
     * Created By:priyanka
     * Created Date:8/7/2019
     * getCountryAndStateName() is used to find country and state name.
     */
    getCountryAndStateName(stateCode, countryCode) {
        var stat_name = ''
        var count_name = ''
        var count_code = ''
        var finalStatelist = []
        this.state.getCountryList && this.state.getCountryList.find(function (element) {
            if (element.Code == countryCode || element.Name.replace(/[^a-zA-Z]/g, ' ') == countryCode) {
                count_name = element
                count_code = element.Code
            }
        })
        this.setState({
            selectedCountryName: count_name ? count_name.Name : countryCode,
            country_name: count_code
        })
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Code === stateCode && count_code === element.Country) {
                stat_name = element
            } else if (element.Code === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && count_code === element.Country) {
                stat_name = element
            }
        })
        this.setState({ state_name: stateCode })
    }
    /**
     * Updated by :Shakuntala Jatav
     * Cerated Date: 22-07-2019
     * Description : for set state of state list
     * @param {*} country_name 
     * @param {*} state_name 
     */
    setCountryToStateList(country_name, state_name) {
        const { getStateList, getCountryList } = this.state;
        var count_code = '';
        var finalStatelist = [];
        getCountryList && getCountryList.find(function (element) {
            if (element.Code == country_name || element.Name.replace(/[^a-zA-Z]/g, ' ') == country_name) {
                count_code = element.Code
            }
        })
        getStateList && getStateList.find(function (element) {
            if (element.Country == count_code) {
                finalStatelist.push(element)
            } else if (element.Country == country_name) {
                finalStatelist.push(element)
            }
        })
        if (finalStatelist.length > 0) {
            this.setState({
                viewStateList: finalStatelist,
            })
        }
    }

    activeClass(item, index, isMobileClicked) {
        var _item = JSON.stringify(item);
        //console.log("Detail", _item, index, isMobileClicked);
        if (isMobileClicked == true) {
            sessionStorage.setItem("OrderDetail", _item);
        }
        if (isMobileOnly == false && (item.order_id == localStorage.getItem("CUSTOMER_TO_OrderId") || item.order_id == localStorage.getItem("CUSTOMER_TO_ACTVITY"))) {

        } else {
            localStorage.removeItem("CUSTOMER_TO_ACTVITY")
            this.setState({ custActive: false, common_Msg: '' })
            localStorage.removeItem("CUSTOMER_TO_OrderId");
            $(".activity-order").removeClass("table-primary-label");
            $(`#activity-order-${index}`).addClass("table-primary-label");
            var mydate = new Date(item.date);
            var getPdfdate = (mydate.getMonth() + 1) + '/' + mydate.getDate() + '/' + mydate.getFullYear() + ' ' + item.time;
            var itemCreatedDate = FormateDateAndTime.formatDateAndTime(item.date_time, item.time_zone)
            this.setState({
                active: index,
                CreatedDate: itemCreatedDate,
                getPdfdateTime: getPdfdate,
                pushInactivityBuffer: false
            })
            var UID = get_UDid('UDID');
            if (item.order_id) {
                this.props.dispatch(activityActions.getDetail(item.order_id, UID));
            }
            //this.props.dispatch(checkoutActions.getOrderReceipt());
            $(".button_with_checkbox input").prop("checked", false);
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleUserChange(selectedOption) {
        // const { name, value } = e.target;
        // this.setState({ [name]: value });
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
        this.SetFilterStatus("user", selectedOption.value)
    }


    handleGroupChange(selectedGroupOption){
        this.setState({ selectedGroupOption });
        this.SetFilterStatus("groupList", selectedGroupOption.id)
    }


    closePopup() {
        localStorage.setItem('custActive', 'false')
        // $("#edit-info").modal("hide")
        hideModal("edit-info")

    }

    filterCustomerOrder(e) {
        var filtered = [];
        const { value } = e.target;
        this.setState({ search: value })
        const orderlist = this.props.activities && this.props.activities.activities;
        orderlist.map((item) => {
            if (item.order_status.toUpperCase().toString().indexOf(value) != -1 || item.order_status.toLowerCase().toString().indexOf(value) != -1
                || item.total.toString().indexOf(value) != -1 || item.time.toString().indexOf(value) != -1
            )
                filtered.push(item);
            this.setState({ activeFilter: true })
        })
        if (filtered.length == 0) {
            this.setState({ activeFilter: false })
        }
        this.props.dispatch(activityActions.filteredListOrder(filtered))
    }

    clearInput() {
        $("#search-orders").val(null);
        this.setState({
            search: '',
            activeFilter: false
        })
        this.state.activeFilter = false;
        this.reload(0)
    }

    CommonMsg(text) {
        this.setState({ common_Msg: text })
    }

    windowLocation1(type, id, productList = []) {
        if (type == 'statuscompleted' && id) {
            //if (Permissions.key.allowRefund == false) {
            if (CommonModuleJS.permissionsForRefund() == false) {
                this.setState({ common_Msg: '' })
                // $('#common_msg_popup').modal('show');
                showModal('common_msg_popup');
            } else {
                var single_Order_list = this.props.single_Order_list.content;
                single_Order_list.order_custom_fee && single_Order_list.order_custom_fee.length > 0 &&
                    single_Order_list.order_custom_fee.map(item => {
                        item['line_item_id'] = item.fee_id;
                        item['quantity'] = 1;
                        item['total'] = item.amount;
                        item['subtotal'] = item.amount;
                        item['subtotal_tax'] = 0;
                        item['total_tax'] = item.total_tax;
                        item['name'] = item.note;
                        item['is_ticket'] = false;
                        item['product_id'] = 0;
                        item['parent_id'] = 0;
                        item['Taxes'] = 0;
                        item['variation_id'] = 0;
                        item['amount_refunded'] = item.amount_refunded;
                        item['quantity_refunded'] = item.amount_refunded > 0 ? -1 : 0;
                    })
                setTimeout(function () {
                    localStorage.setItem("getorder", JSON.stringify(single_Order_list))
                    window.location = '/refund'
                }, 1000)
            }
        }
        if (type == 'statuspending' && id) {
            localStorage.removeItem("oliver_order_payments"); //remove existing payments   
            // sessionStorage.getItem("OrderDetail") for mobile view.............
            var single_Order_list = sessionStorage.getItem("OrderDetail") && sessionStorage.getItem("OrderDetail") !== undefined ? JSON.parse(sessionStorage.getItem("OrderDetail")) : this.props.single_Order_list.content;
            var addcust;
            var typeOfTax = TaxSetting.typeOfTax()
            var setOrderPaymentsToLocalStorage = new Array();
            if (typeof single_Order_list.order_payments !== 'undefined') {
                single_Order_list.order_payments.map(pay => {
                    var _payDetail={
                        "Id": pay.Id,
                        "payment_type": pay.type,
                        "payment_amount": pay.amount,
                        "order_id": single_Order_list.order_id,
                        "type": pay.type,
                        "transection_id": pay.transection_id
                    }
                    if(pay.payment_date && pay.payment_date !=""){
                        _payDetail["payment_date"]=pay.payment_date;
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
                        discountType: (orderMetaData.discountCart.discountType == '%' || orderMetaData.discountCart.discountType=="Percentage") ? "Percentage" : "Number",
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
                        strProductX : ''
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

            // if ( (typeof single_Order_list.order_custom_fee !== 'undefined') && single_Order_list.order_custom_fee.length !== 0) {
            //     single_Order_list.order_custom_fee.map(item => {
            //         ListItem.push({
            //             Title: item.note,
            //             Price: item.amount !== 0 ? item.amount : null,

            //             // Price: item.Price,
            //             TaxClass: item.TaxClass,
            //             TaxStatus: item.TaxStatus,
            //             // Title: item.Title,
            //             after_discount: item.after_discount,
            //             cart_after_discount: item.cart_after_discount,
            //             cart_discount_amount: item.cart_discount_amount,
            //             discount_amount: item.discount_amount,
            //             discount_type: item.discount_type,
            //             excl_tax: item.excl_tax,
            //             incl_tax: item.incl_tax,
            //             isTaxable: item.isTaxable,
            //             new_product_discount_amount: item.new_product_discount_amount,
            //             old_price: item.old_Price,
            //             product_after_discount: item.product_after_discount,
            //             product_discount_amount: item.product_discount_amount,
            //             quantity: item.quantity,
            //             subtotal: item.subtotal,
            //             subtotal_tax: item.subtotal_tax,
            //             total: item.total,
            //             total_tax: item.total_tax
            //         })
            //     })
            // }
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
            orderMetaData = orderMetaData && orderMetaData.total_subTotal_fileds && orderMetaData.total_subTotal_fileds.totalPrice && orderMetaData.total_subTotal_fileds.subTotal? orderMetaData.total_subTotal_fileds : null
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
                order_date: moment(single_Order_list.OrderDateTime).format(config.key.DATETIME_FORMAT),
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
        }
    }

    openModal(type, content) {
        const { dispatch } = this.props;
        this.setState({ Emailstatus: true, loading: true });
        var id = content.order_id ? content.order_id : "";
        var cust_id = content && content.orderCustomerInfo ? content.orderCustomerInfo.customer_id : '';
        var isShowingModel = false;
        if (type == 'print' || type == 'email' && !id) {
            this.CommonMsg(LocalizedLanguage.selectOrder);
            isShowingModel = true;
            showModal('common_msg_popup');
        }

        if (type == 'email' && id) {
            if (!content.orderCustomerInfo && content.orderCustomerInfo == null) {
                this.CommonMsg(LocalizedLanguage.emailNotDefine);
                isShowingModel = true;
                showModal('common_msg_popup');
            }
            if (content.orderCustomerInfo != null) {
                var email = content.orderCustomerInfo.customer_email
                var UID = get_UDid('UDID');
                var requestData = {
                    "OrderNo": id,
                    "EmailTo": email,
                    "Udid": UID,
                }
                isShowingModel = false;
                // this.setState({ Emailstatus: true, loading: false })
                dispatch(sendMailAction.sendMail(requestData));
            }
        }
        if (type == 'refund' && id) {
            this.CommonMsg(LocalizedLanguage.selectRefundOrder);
            isShowingModel = true;
            showModal('common_msg_popup');
        }
        if (type == 'voidsale' && id) {
            this.CommonMsg(LocalizedLanguage.cancelRefundOrder);
            isShowingModel = true;
            showModal('common_msg_popup');
        }

        if (type == 'print' && id) {
        }
        if (type == 'editpop') {
            this.setState({ Emailstatus: false, loading: false });
            localStorage.setItem('custActive', 'true')
            var UID = get_UDid('UDID');
            dispatch(customerActions.getDetail(cust_id, UID));
            this.freezEditScreen()
        }
        if (isShowingModel == true) {
            this.setState({ Emailstatus: false, loading: false });
        }
    }

    Email_Ok() {
        if (this.state.common_Msg !== "") {
            this.setState({ Emailstatus: false, common_Msg: '' })
        }
    }

    activityTableFilter() {
        this.setState({ filterButtonText: LocalizedLanguage.searchactivity });
        if (isMobileOnly === true) {
            this.applyServerFilter();
        }
        // // Declare variables 
        // var filter, table, tr, td, i, txtValue;
        // filter = $("#search-orders").val();
        // if (filter == '' && !filter) {
        //     $("#search-orders").val(null);
        //     this.clearInput()
        //     this.setState({ activeFilter: false })
        //     this.state.activeFilter = false
        // }
        // table = document.getElementsByClassName("CurrentActivityTable");
        // tr = document.getElementsByClassName("activity-order");
        // this.setState({ activeFilter: true })
        // // Loop through all table rows, and hide those who don't match the search query
        // for (i = 0; i < tr.length; i++) {
        //     var status = tr[i].getElementsByTagName("td")[0]
        //     var email = tr[i].getElementsByTagName("td")[1];
        //     var name = tr[i].getElementsByTagName("td")[2];
        //     var phone = tr[i].getElementsByTagName("td")[3];
        //     if (status || email || name || phone) {
        //         txtValue = status.textContent + " " + email.textContent + " " + name.textContent + " " + phone.textContent;
        //         if (txtValue.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
        //             tr[i].style.display = "";
        //         } else {
        //             tr[i].style.display = "none";
        //         }
        //     }
        // }
    }

    // Created by Nagendra
    // Created Date: 27/04/2020
    //Description: Display the filter options/ OrderList  
    showFilter() {
        var dvFilter = document.getElementById("activityFilter");
        if (dvFilter) {
            if (this.state.filterButtonText == LocalizedLanguage.filter || this.state.filterButtonText == LocalizedLanguage.searchactivity) {
                dvFilter.style.display = "block";
                this.setState({ filterButtonText: LocalizedLanguage.cancel });
                if (this.state.filterButtonText == LocalizedLanguage.searchactivity) {
                    this.applyServerFilter();
                }
            } else {
                this.setState({ filterButtonText: LocalizedLanguage.filter });
                //if(this.state.activeFilter==true){
                this.clearInput();//Clear filter and reload activity list;
                // }  
                //clear server side filter--------------
                this.removeActiveCss('platform');
                this.removeActiveCss('status');
                var fromdate = document.getElementById("txtfromdate");
                var txttodate = document.getElementById("txttodate");
                fromdate.value = "";
                txttodate.value = "";
                this.setState({ filterByPlatform: "", filterByStatus: "", filterByUser: "",selectedGroupOption:null });
                $("#search-orders").val('');
                // $('#userList').empty();   
                this.state.selectedOption = '';
                // this.FillUser();
                //--------------------------------------
                dvFilter.style.display = "none";
            }
        }
    }

    // Created by Nagendra
    // Created Date: 28/04/2020
    //Description: Call Service to apply server side filter on activity
    applyServerFilter() {

        // this.setState({ activityBuffer:[],       
        // });

        var UID = get_UDid('UDID');
        this.setState({ UDID: UID, activeFilter: true })
        var pagesize = config.key.ACTIVITY_PAGE_SIZE
        this.state.selected_row = true
        this.setState({ selected_row: true })
        var fromdate = document.getElementById("txtfromdate");
        var txttodate = document.getElementById("txttodate");
        var txtSearch = $("#search-orders").val();
        var _startdate = fromdate && fromdate.value !== "" ? new Date(fromdate.value) : "";
        var _enddate = txttodate && txttodate.value !== "" ? new Date(txttodate.value) : "";
        var s_dd = 0;
        var s_mm = 0;
        var s_yy = 0;
        var e_dd = 0;
        var e_mm = 0;
        var e_yy = 0;
        if (_startdate && _startdate !== "") {
            s_dd = _startdate.getDate();
            s_mm = _startdate.getMonth() + 1;
            s_yy = _startdate.getFullYear();
        }
        if (_enddate && _enddate !== "") {
            e_dd = _enddate.getDate();
            e_mm = _enddate.getMonth() + 1;
            e_yy = _enddate.getFullYear();
        }
        var _filterParameter = {
            "PageSize": pagesize,
            "PageNumber": 0,
            "isSearch": "true",
            "udid": UID,
            "plateform": this.state.filterByPlatform,
            "status": this.state.filterByStatus,
            "userId": this.state.filterByUser,
            "SatrtDay": s_dd,
            "SatrtMonth": s_mm,
            "SatrtYear": s_yy,
            "EndDay": e_dd,
            "EndMonth": e_mm,
            "EndYear": e_yy,
            "searchVal": txtSearch,
            "groupSlug": this.state.filterByGroupList,
            
        };
        this.props.dispatch(activityActions.getFilteredActivities(_filterParameter));
        //Display List
        var dvFilter = document.getElementById("activityFilter");
        if ((dvFilter || (txtSearch && txtSearch !== '')) && isMobileOnly !== true) {
            dvFilter.style.display = "none"
            this.setState({ filterButtonText: LocalizedLanguage.cancel });
        }
    }

    // Created by Nagendra
    // Created Date: 28/04/2020
    //Description: Fill the user list of the shop for filter
    FillUser() {
        var _userList = localStorage.getItem('user_List') && localStorage.getItem('user_List') !== 'undefined' && typeof (localStorage.getItem('user_List')) !== undefined && localStorage.getItem('user_List') !== null ? JSON.parse(localStorage.getItem('user_List')) : null;
        if (_userList && _userList.length > 0) {
            var ddlUserlist = document.getElementById("userList");
            if (ddlUserlist) {
                var option = document.createElement("option");
                option.text = "All";
                ddlUserlist.appendChild(option);
                _userList.map((user) => {
                    var option = document.createElement("option");
                    option.value = user.Id;
                    option.text = user.Name;
                })
            }
        }
    }

    // Created by Nagendra
    // Created Date: 28/04/2020
    //Description: Set filter Status
    SetFilterStatus(filterType, FilterValue) {
        if (filterType == 'platform') {
            this.setState({ "filterByPlatform": FilterValue })
            this.removeActiveCss('platform');
        }
        if (filterType == 'status') {
            this.setState({ "filterByStatus": FilterValue })
            this.removeActiveCss('status');
        }
        if (filterType == 'user') {
            if (FilterValue !== "") {
                this.setState({ "filterByUser": FilterValue })
            }
        }
        if (filterType == 'datefrom') {

            this.setState({ "filterByFromDate": FilterValue })
        }
        if (filterType == 'dateTo') {

            this.setState({ "filterByToDate": FilterValue })
        }
        if (filterType == 'status') {
            this.setState({ "filterByStatus": FilterValue })
            this.removeActiveCss('status');
        }
        if (filterType == 'user') {
            if (FilterValue !== "") {
                this.setState({ "filterByUser": FilterValue })
            }
        }
        if (filterType == 'groupList') {
            if (FilterValue !== "") {
                this.setState({ "filterByGroupList": FilterValue })
            }
        }


    }

    removeActiveCss(pltform) {

        var x, i;
        if (pltform == 'platform') {
            x = document.querySelectorAll(".platform");
        }
        if (pltform == 'status') {
            x = document.querySelectorAll(".orderstaus");
        }
        if (x) {
            for (i = 0; i <= x.length; i++) {
                if (x && x[i]) {
                    x[i].classList.remove('active');
                }
            }
        }
    }
    updateStatus() {
        showModal('updateStatus');
        // $('#updateStatus').modal('show');
    }

    // *** activity extension code start *** ///
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

    close_ext_modal = () => {
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
                case "updateOrderStatus":
                    this.updateOrderStatusExt(jsonMsg.data)
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
                    console.error('App Error : Extension event does not match ', jsonMsg);
                    break;
            }
        }
    }

    // 
    getClientAndRegisterIdByExt = (data)=>{
        console.log('Extension response : ', data)
    }

    extensionReady = () => {
        const { single_Order_list } = this.props
        var orderDetails = single_Order_list && single_Order_list.content
        var clientJSON =
        {
            oliverpos:
            {
                event: "orderData"
            },
            data:
            {
                orderData:
                {
                    ...orderDetails
                },
                customerData: orderDetails.orderCustomerInfo && orderDetails.orderCustomerInfo,
            }
        };

        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
        var _user = JSON.parse(localStorage.getItem("user"));
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }

    updateOrderStatusExt = (data) => {
        try {
            const { single_Order_list, dispatch } = this.props
            var UID = get_UDid('UDID');
            var _orderId = data.orderData && data.orderData.order_id ? data.orderData.order_id : single_Order_list && single_Order_list.content.order_id
            var _orderId = data && data.orderData && data.orderData.order_id ? data.orderData.order_id : single_Order_list && single_Order_list.content.order_id
            var param = { "udid": UID, "orderId": _orderId, "status": data.orderData.status }
            dispatch(checkoutActions.updateOrderStatus(param));
        } catch (error) {
            console.error('App Error : ', error)
        }
    }

    // *** activity extension code end *** ///

    // *** cloud printer handle functions *** //
    handleCloudPrinterClick = () => {
        const { single_Order_list, dispatch } = this.props
        // Check all checked checkbox on popup for cloud printer 
        var cloudPrinterIds = []
        // check if local printer clicked
        $("input:checkbox[name=setLocalPrinter]:checked").each(function () {
            cloudPrinterIds.push($(this).val());
        });
        $("input:checkbox[name=setCloudPrinter]:checked").each(function () {
            cloudPrinterIds.push(parseInt($(this).val()));
        });

        if (cloudPrinterIds && cloudPrinterIds.length) {
            // if localPrinter selected from popup print on local and don't call cloud API 
            var isLocalPrinterExist = cloudPrinterIds.find(itm => itm == 'localPrinter')
            if (isLocalPrinterExist) {
                this.setState({
                    printerByLocalprinter: true,
                    cloudPrinterErr: '',
                })
                setTimeout(() => {
                    this.closeCloudPopup()
                }, 200);
            } else if (cloudPrinterIds.find(itm => itm !== 'localPrinter')) {
                var orderId = single_Order_list && single_Order_list.content ? single_Order_list.content.order_id : 0
                var data = {
                    type: 'activity',
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
    closeCloudPopup = () => {
        this.setState({
            printerByLocalprinter: false,
            cloudPrinterErr: ''
        })
        //  unchecked all checked checkbox on popup
        $('input[name=setCloudPrinter]:checked').click();
        $('input[name=setLocalPrinter]:checked').click();
        setTimeout(() => {
            this.props.dispatch(cloudPrinterActions.sendOrderToCloudPrinter(null))
            hideModal('cloudPrinterListPopup')

        }, 200);
    }
    // *** cloud printer handle functions end *** //

    /** 
    * Created By:priyanka 
    * Created Date:8/7/2019
    * CustomerViewEdit  popup   is used to   update customer detail  
    */

    render() {
        const { activities, single_Order_list, mail_success } = this.props;
        const { activeFilter, activityBuffer, pushInactivityBuffer, common_Msg } = this.state;
        var _newActivities = activities.filterActivities ? activities.filterActivities : activities.activities;
        var data = {
            items: activities ? _newActivities : '',
            isLoading: true
        }

        if (pushInactivityBuffer) {

            _newActivities && _newActivities.map(item => {
                if (item.order_id !== null && item.order_id !== 0) {
                    var isExist = false;
                    activityBuffer && activityBuffer.map(order => {
                        if (order.order_id === item.order_id) {
                            isExist = true;
                        }
                    })
                    if (isExist == false) {
                        activityBuffer.push(item);
                        isExist = false;
                    }
                }
            })
        }
        var getDistinctActivity = {};
        var _activity = activities.filterActivities ? activities.filterActivities : activityBuffer;

        _activity && _activity.map(item => {
            var dateKey = FormateDateAndTime.formatDateAndTime(item.date_time && item.date_time !== undefined ? item.date_time : item.CreatedDate, item.time_zone);
            if (!getDistinctActivity.hasOwnProperty(dateKey)) {
                getDistinctActivity[dateKey] = new Array(item);
            } else {
                if (typeof getDistinctActivity[dateKey] !== 'undefined' && getDistinctActivity[dateKey].length > 0) {
                    getDistinctActivity[dateKey].push(item)
                }
            }
        })

        if (mail_success == 'sent') {
            // this.CommonMsg('Selected order has been Cancelled.');
            // $('#common_msg_popup').modal('show');
            showModal('common_msg_popup');
        }
        const options = [];
        options.push({ value: "", label: "All" });
        // console.log("TAta", typeof(localStorage.getItem('user_List')) !== undefined);
        // if (typeof (localStorage.getItem('user_List')) !== undefined) {

        // }
        // else {
        var _userList = null
        _userList = localStorage.getItem('user_List') && localStorage.getItem('user_List') !== 'undefined' && typeof (localStorage.getItem('user_List')) !== undefined ? JSON.parse(localStorage.getItem('user_List')) : null;
        if (_userList !== null) {
            _userList.map((user) => {
                var option = { value: user.Id, label: user.Name };
                options.push(option);
            })
        }
        //}
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        // console.log("Options",options);

        var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
        const optionsale = [];
        var groupSale=localStorage.getItem("GroupSaleRecord")? JSON.parse(localStorage.getItem("GroupSaleRecord")):null
        if (groupSale !== null) {
            groupSale.map((groupsale) => {
                var option = { id: groupsale.Slug, label: groupsale.Label };
                optionsale.push(option);
            })
        }        
        //const [searchParams] = useSearchParams();
       //var requestParameter=searchParams.get("showdeleteoption")
       var url_string = window.location.href
        var url = new URL(url_string);
        var requestParameter = url.searchParams.get("showdeleteoption");
        return (
            (isMobileOnly == true) ?
                <MobileActivityView
                    {...this.props}
                    {...this.state}
                    getDistinctActivity={getDistinctActivity}
                    data={data}
                    LocalizedLanguage={LocalizedLanguage}
                    activityTableFilter={this.activityTableFilter}
                    clearInput={this.clearInput}
                    activeClass={this.activeClass}
                    windowLocation1={this.windowLocation1}
                    openModal={this.openModal}
                    NavbarPage={NavbarPage}
                    CommonHeader={CommonHeader}
                    ActivityOrderList={ActivityOrderList}
                    ActivitySecondView={ActivitySecondView}
                    CustomerViewEdit={CustomerViewEdit}
                    AndroidAndIOSLoader={AndroidAndIOSLoader}
                    load={this.load}
                    config={config}
                    activeFilter={this.state.activeFilter}
                />
                :
                <div>
                    <div className="wrapper">
                        <div className="overlay"></div>
                        <NavbarPage {...this.props} />
                        <div id="content">
                            {this.state.Emailstatus == true && this.state.loading == true ? <LoadingModal /> : ''}
                            {/* {this.state.loading == false ? !activityBuffer || activityBuffer.length == 0 || this.state.Emailstatus == true ? <LoadingModal /> : '' : ''} */}
                            <CommonHeader {...this.props} handleBarcodeData={this.handleBarcodeData} />
                            <div className="inner_content bg-light-white clearfix">
                                <div className="content_wrapper">
                                    <div className="col-xs-5 col-sm-3 p-0">
                                        {/* {this.state.loading == false ? !_newActivities || _newActivities.length == 0 || this.state.Emailstatus == true ? <LoadingModal /> : '' : ''} */}
                                        <div className="card card-custom">
                                            <div className="card-header no-padding">
                                                <div className="webSearch">
                                                    <div className="search-icon">
                                                        <i className="icons8-search-more"></i>
                                                    </div>
                                                    <input type="search" className="form-control bg-white" onChange={this.activityTableFilter} placeholder={LocalizedLanguage.placeholderSearchOfCustomer} id="search-orders" data-column-index="0"  ></input>
                                                    <div className="close-icon" >
                                                        <button type="button" className={this.state.filterButtonText == LocalizedLanguage.cancel ? 'btn shadow-none btn-sm btn-secondary-custom ol-outline-danger' : "btn shadow-none btn-sm btn-secondary-custom  btn-outline-secondary"} onClick={() => this.showFilter()}>{this.state.filterButtonText}</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card card-inner pg-section-filter" id="activityFilter" style={{ display: "none" }}>
                                                {/* style={{height: 260}} */}
                                                <div className="card-body no-padding overflowscroll pgsectionfilter">
                                                    <div className="card-body-content mb-0">
                                                        <h6 className="card-title">{LocalizedLanguage.platform}</h6>
                                                        <div className="card-wrap">
                                                            {
                                                                _platform && _platform.length > 0 && _platform.map((item, index) => {
                                                                    return (<div key={"Platform" + index} className="btn-group-toggle mr-2 mb-2 " data-toggle="buttons" onClick={() => this.SetFilterStatus("platform", item.key)}>
                                                                        <label className="btn ol-outline-primary btn-sm shadow-none platform" >
                                                                            <input type="radio" name="optplatform" /> {item.value}
                                                                        </label>
                                                                    </div>)
                                                                })
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="card-body-content mb-0">
                                                        <h6 className="card-title">{LocalizedLanguage.status}</h6>
                                                        <div className="card-wrap">
                                                            {
                                                                _orderstatus && _orderstatus.length > 0 && _orderstatus.map((item, index) => {
                                                                    return (<div key={"status" + index} className="btn-group-toggle mr-2 mb-2" data-toggle="buttons" onClick={() => this.SetFilterStatus("status", item.key)}>
                                                                        <label className="btn ol-outline-primary btn-sm shadow-none orderstaus">
                                                                            <input type="radio" name="optstatus" /> {item.value}
                                                                        </label>

                                                                    </div>);
                                                                })
                                                            }

                                                        </div>
                                                    </div>

                                                   { user && user.group_sales==true &&
                                                    <div className="card-body-content mb-0">
                                                        <h6 className="card-title">{user.group_sales_by}</h6>                                                      
                                                        <Select id="groupList" options={optionsale}
                                                             value={this.state.selectedGroupOption}
                                                           onChange={this.handleGroupChange}/>                                                       
                                                    </div>
                                                    }

                                                    <div className="card-body-content mb-0">
                                                        <h6 className="card-title">{LocalizedLanguage.employee}</h6>
                                                        <Select id="userList" options={options}
                                                            value={this.state.selectedOption}
                                                            onChange={this.handleUserChange} />
                                                        {/* <select className="" id="userList" onChange={(e)=>this.SetFilterStatus("user",e.target.value)}>
                                           
                                        </select> */}
                                                    </div>
                                                    <div key="devdatefrom" className="card-body-content mb-0">
                                                        <h6 className="card-title">{LocalizedLanguage.dates}</h6>
                                                        <div className="input-group date datepicker" data-provide="datepicker">
                                                            <input type="text" className="form-control" placeholder="From - 01/01/2020" onBlur={(e) => this.SetFilterStatus("datefrom", e.target.value)} id="txtfromdate" />
                                                            <span className="input-group-addon">
                                                                <span className="icons8-extensions" onBlur={(e) => this.SetFilterStatus("datefrom", e.target.value)}></span>
                                                            </span>
                                                        </div>
                                                        <div key="devdateto" className="input-group date datepicker" data-provide="datepicker"  >
                                                            <input type="text" className="form-control" placeholder="To - 01/01/2020" onBlur={(e) => this.SetFilterStatus("dateTo", e.target.value)} id="txttodate" />
                                                            <span className="input-group-addon">
                                                                <span className="icons8-extensions"></span>
                                                            </span>
                                                        </div>
                                                        {/* <div className="padding-20"></div> */}
                                                    </div>
                                                </div>
                                                <div className="card-footer no-padding">
                                                    <button className="btn btn-block btn-primary ol-button-lg" onClick={() => this.applyServerFilter()}>
                                                        {LocalizedLanguage.applyfilter}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={isDemoUser ? 'card card-inner pg-current-checkout pg-current-checkout-if_footer' : "card card-inner pg-current-checkout"} id="activityList">
                                                {/* <div className="card card-inner pg-current-checkout" id="activityList"> */}
                                                <div className="card-body no-padding overflowscroll" style={{ height: 250 }}>
                                                    <ActivityOrderList orders={getDistinctActivity} loader={data} click={this.activeClass} activeFilter={this.state.activeFilter} />
                                                </div>
                                                {_newActivities && !_newActivities.length == 0 && _newActivities.length >= config.key.ACTIVITY_PAGE_SIZE ?
                                                    <div className="createnewcustomer">
                                                        <button type="button" className="btn btn-block btn-primary total_checkout" onClick={() => this.load()}>{LocalizedLanguage.loadMore}</button>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <ActivitySecondView
                                        status={true}
                                        onClick1={() => { this.windowLocation1('statuscompleted', single_Order_list ? single_Order_list.content && single_Order_list.content.order_id : '') }}
                                        onClick2={() => { this.windowLocation1('statuspending', single_Order_list ? single_Order_list.content && single_Order_list.content.order_id : '') }}
                                        printPOP={() => this.openModal('print', single_Order_list ? single_Order_list.content : '')}
                                        customerPOP={() => this.openModal('editpop', single_Order_list ? single_Order_list.content : '')}
                                        emailPOP={() => this.openModal('email', single_Order_list ? single_Order_list.content && single_Order_list.content : '')}
                                        RefundPOP={() => this.openModal('refund', single_Order_list ? single_Order_list.content && single_Order_list.content : '')}
                                        VoidPOP={() => this.openModal('voidsale', single_Order_list ? single_Order_list.content && single_Order_list.content : '')}
                                        Reciept={single_Order_list ? single_Order_list.content && single_Order_list.content && single_Order_list.content.order_id : ''}
                                        OliverReciptId={single_Order_list ? single_Order_list.content && single_Order_list.content && single_Order_list.content.OliverReciptId : ''}
                                        CustomerInfo={single_Order_list && single_Order_list.content && single_Order_list.content.orderCustomerInfo ? single_Order_list.content.orderCustomerInfo.customer_name.trim() != "" ?
                                            single_Order_list.content.orderCustomerInfo.customer_name :
                                            single_Order_list.content.orderCustomerInfo.customer_email : ''}
                                        Orderstatus={single_Order_list ? single_Order_list.content && single_Order_list.content.order_status : ''}
                                        Totalamount={single_Order_list ? single_Order_list.content && single_Order_list.content.total_amount : 0}
                                        total_tax={single_Order_list ? single_Order_list.content && single_Order_list.content.total_tax : 0}
                                        refunded_amount={single_Order_list ? single_Order_list.content && single_Order_list.content.refunded_amount : 0}
                                        tax_refunded={single_Order_list ? single_Order_list.content && single_Order_list.content.tax_refunded : 0}
                                        Balance={0}
                                        Details={single_Order_list ? single_Order_list.content : ''}
                                        CreatedDate={this.state.CreatedDate}
                                        getPdfdateTime={this.state.getPdfdateTime}
                                        UserInfo={single_Order_list ? single_Order_list.content && single_Order_list.content.ServedBy : ''}
                                        cash_rounding_amount={single_Order_list ? single_Order_list.content && single_Order_list.content.cash_rounding_amount : 0}
                                        updateOrderStatus={() => this.updateStatus()}
                                        redeemPointsToPrint={single_Order_list ? single_Order_list.content && single_Order_list.content.meta_datas && single_Order_list.content.meta_datas[1] ? single_Order_list.content.meta_datas[1].ItemValue : 0 : 0}
                                        showExtensionIframe={this.showExtensionIframe}
                                        printerByLocalprinter={this.state.printerByLocalprinter}
                                        cloudPrintersData={this.state.cloudPrintersData}
                                        appreposnse={this.state.appreposnse}
                                        deleteDuplicateOrder={() =>this.deleteDuplicateOrder()}
                                        requestParameter={requestParameter}
                                    />

                                </div>
                            </div>
                            {/* add connect your shop button for guest user */}
                            {isDemoUser && (isDemoUser == 'true' || isDemoUser == true) &&
                                <CommonDemoShopButton />

                            }
                        </div>

                    </div>
                    {/* {console.log("single_Order_list",  single_Order_list.content.customer_id)} */}
                    <CommonMsgModal msg_text={common_Msg ? common_Msg : LocalizedLanguage.refundPermissionerror} close_Msg_Modal={() => this.Email_Ok()} />
                    <CommonOrderStatusPopup
                        orderId={single_Order_list && single_Order_list.content && single_Order_list.content.order_id}
                        Cust_ID={single_Order_list && single_Order_list.content && single_Order_list.content.customer_id}
                        currentOrderStaus={single_Order_list && single_Order_list.content && single_Order_list.content.order_status}
                    />
                   
                    <div id="edit-info" className="modal fade popUpMid">
                        <CustomerViewEdit
                            onClick={() => this.handleSubmit()}
                            onChange={this.handleChange}
                            Street_Address={this.state.Street_Address ? this.state.Street_Address : ''}
                            city={this.state.city ? this.state.city : ''}
                            PhoneNumber={this.state.PhoneNumber ? this.state.PhoneNumber : ''}
                            FirstName={this.state.FirstName ? this.state.FirstName : ''}
                            LastName={this.state.LastName ? this.state.LastName : ''}
                            Email={this.state.Email ? this.state.Email : ''}
                            Notes={this.state.Notes ? this.state.Notes : ''}
                            Pincode={this.state.Pincode ? this.state.Pincode : ''}
                            getCountryList={this.state.getCountryList}
                            getState={this.state.viewStateList ? this.state.viewStateList : ''}
                            Street_Address2={this.state.Street_Address2 ? this.state.Street_Address2 : ''}
                            country_name={this.state.country_name ? this.state.country_name : ''}
                            state_name={this.state.state_name ? this.state.state_name : ''}
                            onChangeList={this.handleChangeList}
                            onChangeStateList={this.onChangeStateList}
                            Cust_ID={this.state.user_id}
                            onClick1={() => this.closePopup()}
                        />
                    </div>
                    <CloudPrinterListPopup
                        cloudPrintersData={this.state.cloudPrintersData}
                        cloudPrinterErr={this.state.cloudPrinterErr}
                        handleCloudPrinterClick={() => this.handleCloudPrinterClick()}
                        closeCloudPopup={() => this.closeCloudPopup()}
                        handlePrinterIdClick={(setPrinterId) => this.handlePrinterIdClick(setPrinterId)}
                    />
                    <CommonExtensionPopup
                        showExtIframe={this.state.extensionIframe}
                        close_ext_modal={this.close_ext_modal}
                        extHostUrl={this.state.extHostUrl}
                        extPageUrl={this.state.extPageUrl}
                    />
                    <OpeningFloatPopup />
                    <CloseRegisterPopupTwo />
                    <PlanUpgradePopup />
                    <OnBoardingAllModal />
                    
                </div>
        );
    }
}

function mapStateToProps(state) {
    const { activities, single_Order_list, mail_success, single_cutomer_list, sendEmail, cashSummery, setOrderTocloudPrinter } = state;
    return {
        activities,
        single_Order_list: single_Order_list.items,
        mail_success: mail_success.items,
        single_cutomer_list: single_cutomer_list.items,
        sendEmail: sendEmail.sendEmail,
        cashSummery: cashSummery,
        setOrderTocloudPrinter: setOrderTocloudPrinter.printerRes
    };
}
const connectedActivity = connect(mapStateToProps)(Activity);
export { connectedActivity as Activity };
