import React from 'react';
import { connect } from 'react-redux';
import { NavbarPage, CommonHeaderTwo, CommonHeaderThree, CommonHeader, LoadingModal, CommonMsgModal, ConfirmationPopup, AndroidAndIOSLoader } from '../../_components';
import { history } from '../../_helpers';
import Config from '../../Config'
import { get_UDid } from '../../ALL_localstorage'
import { setAndroidKeyboard } from "../../settings/AndroidIOSConnect";
import { CustomerViewFirst, CustomerViewSecond, CustomerViewEdit, customerActions } from '../';
import { CheckoutCustomer } from './CheckoutCustomer'
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import MobileCustomerView from '../views/m.CustomerView';
import WarningMessage from '../../_components/views/m.WarningMessage';
import { AdjustCreditpopup } from '../../_components/AppsComponent/AdjustCreditpopup';
import { AddCustomersNotepoup } from '../../_components/AppsComponent/AddCustomersNotepoup';
import KeyAppsDisplay from '../../settings/KeyAppsDisplay';
import { updaterefreshwebManu } from '../../_components/CommonFunction'
import { refresh } from '../../_components/views/m.commonjs';
import { refreshToggle } from '../../_components/CommonFunction';
import { cashManagementAction } from '../../CashManagementPage/actions/cashManagement.action';
import { OpeningFloatPopup } from '../../CashManagementPage/components/OpeningFloatPopup';
import { CloseRegisterPopupTwo } from '../../CashManagementPage/components/CloseRegisterPopupTwo';
import { PlanUpgradePopup } from '../../_components/PlanUpgradePopup';
import { OnBoardingAllModal } from '../../onboarding'
import $ from 'jquery';
import { CommonDemoShopButton } from '../../_components/CommonDemoShopButton';
import { LoadingSmallModal } from '../../_components/LoadingSmallModal';
import { GTM_OliverDemoUser } from '../../_components/CommonfunctionGTM';
import { trackPage } from '../../_components/SegmentAnalytic'
import ActiveUser from '../../settings/ActiveUser';
import { getHostURLsBySelectedExt, onBackTOLoginBtnClick, sendClientsDetails, sendRegisterDetails, sendTipInfoDetails } from '../../_components/CommonJS';
import { OnboardingShopViewPopup } from '../../onboarding/components/OnboardingShopViewPopup';
import { CommonExtensionPopup } from '../../_components/CommonExtensionPopup';
import { addExtensionCustomer, updateExtensionCustomer } from '../../_components/CommonExtensions';
import { handleAppEvent, postClientExtensionResponse } from '../../ExtensionHandeler/commonAppHandler';
import * as PageFunctions from "../../appManager/PageFunctions"
import { TriggerCallBack } from '../../appManager/FramManager';
class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        var UID = get_UDid('UDID');
        this.state = {
            submitted: false,
            active: history.location.state ? 0 : '',
            activeFilter: false,
            set_active_index: history.location.state ? 0 : '',
            UDID: UID,
            Cust_ID: '',
            user_store_credit: '',
            pageOfItems: [],
            search: '',
            backUrl: history.location.state ? history.location.state : sessionStorage.getItem("backurl") ? sessionStorage.getItem("backurl") : null,
            emailValid: '',
            nameValid:null,
            lastValid:null,
            loading: false,
            isContactValid: true,
            //-----Customer paging----------
            TotalRecords: 0,
            PageSize: Config.key.CUSTOMER_PAGE_SIZE,
            PageNumber: 0,
            isSearch: false,
            customerList: [],
            isCustomerListLoaded: true,

            ID: '',
            FirstName: '',
            LastName: '',
            Email: '',
            PhoneNumber: '',
            FirstName: '',
            LastName: '',
            // Address: '',
            Notes: '',
            StoreCredit: '',
            AccountBalance: '',
            Details: '',
            onClick: '',
            singleStatus: true,
            custmerPin: '',
            getCountryList: localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('countrylist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '',
            getStateList: localStorage.getItem('statelist') && localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
                Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '',
            state_name: '',
            country_name: '',
            Street_Address: '',
            Street_Address2: '',
            /* Created By:priyanka,Created Date:6/6/2019,Description:popup_status is used to manage  message popup for edit case */
            popup_status: false,
            display_status: false,
            /* Created By:priyanka,Created Date:7/6/2019,Description:updateCustomer  status managed localstorage data after save and update customer  */
            updateCustomer: false,
            create: '',
            filter_dataStatus: false,
            common_Msg: '',
            stateName: '',
            activeCreateEditDiv: false,
            ActiveAddToSale: false,
            ActiveAddToSaleEmail: "",
            city: "",
            customerDeleteActive: false,
            tabLoading: false,
            activityTab: false,
            extensionIframe: false,
            extHostUrl: '',
            extPageUrl: '',
            showNewAppExtension:false,
            // customerEvents:[]
            //-----------------------
        };
        this.handleChange = this.handleChange.bind(this);
        this.onChangeStateList = this.onChangeStateList.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.filterCustomer = this.filterCustomer.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        this.popup_status = this.popup_status.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.activeClass = this.activeClass.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.waitForAddToSale = this.waitForAddToSale.bind(this);
        this.addNewCustomter = this.addNewCustomter.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.closeMsgModal = this.closeMsgModal.bind(this);
        this.CommonMsg = this.CommonMsg.bind(this);
        this.customerDeleteButton = this.customerDeleteButton.bind(this);
        if (window.location.pathname !== '/checkout') {
            this.loadMore(1);
            // sessionStorage.setItem("CUSTOMER_ID", customerlist.content && customerlist.content.Records && customerlist.content.Records[0].WPId)
        }
        //   //Geting cash Summary---------------------------------------   
        //   var registerId = localStorage.getItem('register');     
        //   var CashManagementId= localStorage.getItem('Cash_Management_ID');
        //   var user = JSON.parse(localStorage.getItem("user"));
        //   var LoggenInUserId =user && user.user_id ? user.user_id : '';
        //   if (CashManagementId && CashManagementId !==null && registerId && registerId > 0 )
        //   this.props.dispatch(cashManagementAction.getSummery(CashManagementId,registerId,LoggenInUserId));
        //   /// ------------------------------------------------------
    }

    popup_status(status) {
        this.setState({ popup_status: status })
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    getExistingCustomerEmail(email) {
        var Exist = false;
        this.state.customerList && this.state.customerList.map(cust => {
            if (cust.Email == email)
                Exist = true;
        })
        return Exist;
    }

    ValidateEmail(inputText) {
        var x = inputText;
        var atposition = x.indexOf("@");
        var dotposition = x.lastIndexOf(".");
        if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= x.length) {
            return false;
        } else {
            return true
        }
    }

    handleChange(e) {
        var emailValid = this.state.emailValid;
        var nameValid = this.state.nameValid;
        var lastValid = this.state.lastValid;
        var custmerPin = this.state.custmerPin;
        var isContactValid = this.state.isContactValid;
        var { name, value } = e.target;
        var pin;
        switch (name) {
            case 'Email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false;
                emailValid === true && (value.length <= 60) ? this.setState({ emailValid: '' }) : this.setState({ emailValid: LocalizedLanguage.emailErr });
                break;
            case 'Pincode':
                custmerPin = value[0];
                pin = value.match(/^([1-9]|10)$/)
                break;
            case 'PhoneNumber':
                value = value.match(/^[0-9]*$/) ? value : this.state.PhoneNumber
                this.setState({ isContactValid: value && value != "" ? value.match(/^[0-9]*$/) ? true : false : true })
                break;
            case 'FirstName':
                if(value!==''){
                nameValid = value.match('^[a-zA-Z ]+$') ? true : false;
                nameValid === true && (value.length <= 60) ? this.setState({ nameValid: '' }) : this.setState({ nameValid: LocalizedLanguage.nameErr });
                }
                break;
            case 'LastName':
                if(value!==''){
                lastValid = value.match('^[a-zA-Z ]+$') ? true : false;
                lastValid === true && (value.length <= 60) ? this.setState({ lastValid: '' }) : this.setState({ lastValid: LocalizedLanguage.nameErr });
                }
                break;
            default:
                break;
        }
        //    if (custmerPin && custmerPin < 1) {
        //         this.setState({ custmerPin: 'not accept' })
        //     } else 
        if (pin || pin == '') {
            this.setState({ custmerPin: '' })
        } else if (custmerPin == null || custmerPin == ' ') {
            this.setState({ custmerPin: '' })
        }
        this.setState({ [name]: value });
    }
    /** 
     * Updated By:priyanka
     * Updated Date :6/6/2019
     * Description :use common popup  for save and update customer detail
     * */
    handleSubmit() {
        // console.log("HendleSubmit")
        this.setState({
            submitted: true,
            loading: false,
            display_status: true,
            updateCustomer: window.location.pathname == '/checkout' ? false : true
        });
        $(".button_with_checkbox input").prop("checked", false);
        const { UDID,
            Street_Address, city, PhoneNumber, FirstName, emailValid,nameValid,lastValid,
            LastName, Pincode, Notes, Cust_ID, Email, Street_Address2, country_name, state_name,
        } = this.state;

        const { dispatch } = this.props;
        //console.log("Cust_ID",Cust_ID)

        if ((!Email && Email == "") || (emailValid !== '' && emailValid !== false)) {
            this.setState({
                display_status: false,
                submitted: false,
                updateCustomer: false,
                loading: true,
                emailValid: Email == "" ? LocalizedLanguage.FieldRequire : LocalizedLanguage.emailErr
            })
        }  else if(FirstName && (  FirstName !== "" && (nameValid && nameValid !== '' && nameValid !== false))){
            this.setState({
                display_status: false,
                submitted: false,
                updateCustomer: false,
                loading: true,
                nameValid: FirstName == "" ? LocalizedLanguage.FieldRequire : LocalizedLanguage.nameErr
            })

        }
        else if(LastName && (LastName !== "" && (lastValid && lastValid !== '' && lastValid !== false))){
            this.setState({
                display_status: false,
                submitted: false,
                updateCustomer: false,
                loading: true,
                lastValid: LastName == "" ? LocalizedLanguage.FieldRequire : LocalizedLanguage.nameErr
            })

        }
        else if (!(Cust_ID) || Cust_ID == null || Cust_ID == "") {
            var userExist = false;
            userExist = this.getExistingCustomerEmail(Email);
            if (userExist == true) {
                this.setState({
                    display_status: false,
                    common_Msg: LocalizedLanguage.alreadyExistEmailMsg,
                    submitted: false,
                    updateCustomer: false,
                    loading: true
                })
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show'); }
                showModal('common_msg_popup');
                //$('#common_msg_popup').modal('show');
            } else {
                //console.log("save Email",Email)
                if (Email && Email !== "" && emailValid == '') {
                    const save = {
                        WPId: "",
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
                    this.setState({ create: 'create', activeFilter: false, search: '', Details: '' })
                    setTimeout(() => {
                        dispatch(customerActions.save(save, 'create', this.state.backUrl));
                    }, 500);
                    updaterefreshwebManu();
                    this.setState({ activeCreateEditDiv: false })
                    if (window.location.pathname !== '/checkout') {
                        $(".close").click();
                    }
                }

                if ((!Email && Email == "") || emailValid !== '') {
                    this.setState({
                        display_status: false,
                        submitted: false,
                        updateCustomer: false,
                        loading: true,
                        emailValid: Email == "" ? LocalizedLanguage.FieldRequire : LocalizedLanguage.emailErr
                    })
                }
            }
        } else if (Cust_ID && Cust_ID != "") {
            const update = {
                WPId: Cust_ID,
                FirstName: FirstName,
                LastName: LastName,
                Contact: PhoneNumber,
                startAmount: 0,
                Email: Email,
                udid: UDID,
                notes: Notes,
                StreetAddress: typeof Street_Address == 'undefined' ? '' : Street_Address,
                Pincode: Pincode,
                City: city,
                Country: country_name,
                State: state_name,
                StreetAddress2: Street_Address2,
            }
            if (window.location.pathname !== '/checkout') {
                $(".close").click();
            }
            dispatch(customerActions.update(update, 'update'));
            this.setState({ activeCreateEditDiv: false })
        }
    }

    componentDidMount() {
        refreshToggle();
        // setTimeout(function () {
        //     setHeightDesktop();
        // }, 500);)
       
        var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
        // console.log("CUSTOMER_ID",CUSTOMER_ID)
        if (typeof CUSTOMER_ID !== 'undefined' && CUSTOMER_ID !== null) {
            this.setState({ active: 0 })
            var UID = get_UDid('UDID');
            this.props.dispatch(customerActions.getDetail(CUSTOMER_ID, UID));
            // test commented
            // this.props.dispatch(customerActions.getAllEvents(CUSTOMER_ID, UID));


        } else {
            // console.log("props customer id:", CUSTOMER_ID)
            this.setState({
                active: 0,
                set_active_index: 0,
                Address: '',
                PhoneNumber: '',
                FirstName: '',
                LastName: '',
                city: '',
                Cust_ID: '',
                StoreCredit: '',
                Street_Address: '',
                country_name: '',
                Pincode: '',
                filteredList: null,
                Details: [],
                popup_status: true,
                statename: '',
                display_status: false
            })
        }
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
            GTM_OliverDemoUser("Visited Cutomer View")
        }

        trackPage(history.location.pathname, "Customers", "CustomerView", "CustomerView");

        // *** Customer extension code *** //
            //Load backgroud apps into ifame------------------
            // var appFields=localStorage.getItem("GET_EXTENTION_FIELD");
            // appFields=appFields? JSON.parse(appFields):null;
            // if(appFields && appFields.length>0)
            // appFields.map(app=>{
            //     if(PageFunctions.LoadIframs){
            //         if(app.PageUrl !=='ContactDetails'){
            //             PageFunctions.LoadIframs('./externalApp/bg_customerApp.html');//app.PageUrl
            //         }
                
            //     }
            // })
            //-------------------------------------------------
        var _user = JSON.parse(localStorage.getItem("user"));
        // ************ Update _user.instance for local testing ************* //
        // _user.instance = window.location.origin
        // localStorage.setItem("user", JSON.stringify(_user));
        // ************ End ********* //
        window.addEventListener('message', (e) => {
            if (e.origin && _user && _user.instance) {
                try {
                    var extensionData = typeof e.data == 'string' ? JSON.parse(e.data) : e.data; 
                    if (extensionData && extensionData !== "" ) {

                        handleAppEvent(extensionData,"CustomerView",true);
                        if(extensionData && extensionData.command && extensionData.comman !== ""){
                             this.setState({ showNewAppExtension:true})
                        }                      
                       
                    }
                    if (extensionData && extensionData !== "" && extensionData.oliverpos) {
                        this.showExtention(extensionData);
                    }
                   
                }
                catch (err) {
                    console.error(err);
                }
            }
        }, false);
        // *** Customer extension code end *** //
    }

    closeCreditScorepopup = () => {
        if (this.state.activityTab == true) {
            const { dispatch } = this.props;
            var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
            this.setState({ tabLoading: true })
            dispatch(customerActions.getAllEvents(CUSTOMER_ID, this.state.UDID));
        }
        // $('#AdjustCredit').modal("hide");
        hideModal('AdjustCredit');
        $('AdjustCredit').removeClass('show');
    }


    closeNotespopup = () => {
        if (this.state.activityTab == true) {
            const { dispatch } = this.props;
            this.setState({ tabLoading: true })
            var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
            dispatch(customerActions.getAllEvents(CUSTOMER_ID, this.state.udid));
        }
        // $('#AddCustomerNote').modal("hide");
        hideModal('AddCustomerNote');
        $('closeNotespopup').removeClass('show');
    }
    UpdateCustomerDetail(props, customer_Id, udid, tabType = '') {
        if (tabType == 'activity') {
            this.setState({ tabLoading: true })
            setTimeout(() => {
                props.dispatch(customerActions.getAllEvents(customer_Id, udid));
            }, 1000);
        }
        else if (tabType == 'customer') {
            setTimeout(() => {
                //  props.dispatch(customerActions.getDetail(customer_Id, udid));
            }, 1000);
        }
    }



    /** 
     *  Created By:priyanka
     * Created Date:6/6/2019
     * Description:deselected the button
     */
    activeClass(item, index) {
        const { dispatch } = this.props;
        dispatch(customerActions.nullUpdate());
        var udid = get_UDid('UDID');
        if (this.state.activityTab == true) {
            dispatch(customerActions.getAllEvents(item.WPId, udid));
        }

        // console.log("item.WPId", item.WPId)
        $(".button_with_checkbox input").prop("checked", false);
        var customerDetail = '';
        var customerAddress = '';
        var customerOrders = '';
        //var customerEvents=[];
        if (this.props.single_cutomer_list && this.props.single_cutomer_list.content && this.props.single_cutomer_list.content.customerDetails !== undefined) {
            var selected_customer = this.props.single_cutomer_list.content
            customerDetail = selected_customer.customerDetails;
            customerAddress = customerDetail && customerDetail.customerAddress.find(Items => Items.TypeName == "billing");
            customerOrders = customerDetail.orders;
        }
        // if (this.props.customer_events && this.props.customer_events.events) {           
        //     customerEvents = this.props.customer_events.events.content;
        // }
        if (item && item.Country == '') {
            this.setState({
                country_name: '',
                state_name: '',
                selectedCountryName: '',
                viewStateList: '',
                stateName: ''
            })
        }
        if (item.WPId && item.WPId !== 0) {
            dispatch(customerActions.getDetail(item.WPId, udid));
        }

        this.setState({
            active: index,
            set_active_index: index,
            Address: item ? item.StreetAddress : (typeof customerDetail !== 'undefined' && item.WPId == customerDetail.UID) ? customerAddress.Address1 : '',
            PhoneNumber: item ? item.Contact : (typeof customerDetail !== 'undefined' && item.WPId == customerDetail.UID) ? customerDetail.PhoneNumber : '',
            city: item ? item.City : (typeof customerDetail !== 'undefined' && item.WPId == customerDetail.UID) ? customerAddress.City : '',
            Cust_ID: item.WPId ? item.WPId : (typeof customerDetail !== 'undefined' && item.WPId == customerDetail.UID) ? customerDetail.UID : '',
            StoreCredit: item.store_credit ? item.store_credit : (typeof customerDetail !== 'undefined' && item.WPId == customerDetail.UID) ? customerDetail.StoreCredit : '',
            Street_Address: item ? item.StreetAddress2 : (typeof customerDetail !== 'undefined' && customerAddress && item.WPId == customerDetail.UID) ? customerAddress.Address2 : '',
            country_name: item ? item.Country : (typeof customerDetail !== 'undefined' && customerAddress && item.WPId == customerDetail.UID) ? customerAddress.Country : '',
            Pincode: item ? item.Pincode : (typeof customerDetail !== 'undefined' && item.WPId == customerDetail.UID) ? customerDetail.Pincode : '',
            filteredList: null,
            Details: customerOrders && item.WPId == customerDetail.UID ? customerOrders : [],
            popup_status: true,
            statename: item ? item.State : (typeof customerDetail !== 'undefined' && customerAddress && item.WPId == customerDetail.UID) ? customerAddress.State : '',
            display_status: false,
            // customerEvents:customerEvents
        })
        sessionStorage.setItem("CUSTOMER_ID", item.WPId);
        if (item.Country !== '') {
            this.EditCountryToStateList(item.Country, item.State)
            this.getCountryAndStateName(item.State, item.Country)
        }

        //  dispatch(customerActions.nullUpdate());
        // if(window.location.pathname !== '/checkout') { 
        // this.loadMore(0);
        // }
    }

    deleteCustomer() {
        this.setState({ submitted: true, loading: false });
        const { UDID, Cust_ID } = this.state;
        const { dispatch } = this.props;
        // var isConfirm = confirm(LocalizedLanguage.sureDeleteMesg);    
        if (isMobileOnly == true) { $('delete-information').removeClass('show'); }
        if (Cust_ID, UDID) {
            dispatch(customerActions.Delete(Cust_ID, UDID));
        } else {
            this.setState({ submitted: false, loading: false });
        }
    }
    /** 
     * Created By:priyanka
     * Created Date:17/6/2019
     * Description:update goBack(),update localstorage  
     **/
    /** 
     * Updated By:Aman
     * Updated Date:31/7/2020
     * Description:Bugsnag error of Email undefined, commented line no 475 and added 474  
     **/
    goBack(cutomer_data) {

        // var single_cutomer_list = this.props.customer_save_data && this.props.customer_save_data !== 'undefined' && this.props.customer_save_data.content && this.props.customer_save_data.content.Email ?
        //     this.props.customer_save_data.content : cutomer_data.content && cutomer_data.content.Email ? cutomer_data.content : cutomer_data.content.customerDetails
        // var content = single_cutomer_list
        var customerContent = cutomer_data ? cutomer_data.content ? cutomer_data.content : cutomer_data.WPId ? cutomer_data : null : null
        var Custdata = customerContent ? customerContent.Email ? customerContent : customerContent && customerContent.customerDetails ? customerContent.customerDetails : '' : '';
        var single_cutomer_list = this.props.customer_save_data && this.props.customer_save_data !== 'undefined' && this.props.customer_save_data.content && this.props.customer_save_data.content.Email ?
            this.props.customer_save_data.content : Custdata ? Custdata : ''
        var content = single_cutomer_list

        var data = {
            content
        }

        if (single_cutomer_list != null && this.state.backUrl && sessionStorage.getItem("CUSTOMER_ID")) {
            if ((typeof single_cutomer_list.Email !== 'undefined') && single_cutomer_list.Email !== null) {
                localStorage.setItem('AdCusDetail', JSON.stringify(data))
            } else {
                if (this.props.customer_save_data !== null && this.props.customer_save_data !== 'undefined' && this.props.customer_save_data) {
                    if (parseInt(this.props.customer_save_data.content.UID) == parseInt(single_cutomer_list.UID)) {
                        var content = this.props.customer_save_data
                        localStorage.setItem('AdCusDetail', JSON.stringify(content))

                    } else if (parseInt(this.props.customer_save_data.content.UID) !== parseInt(single_cutomer_list.UID)) {
                        localStorage.setItem('AdCusDetail', JSON.stringify(data))
                    }
                } else {
                    localStorage.setItem('AdCusDetail', JSON.stringify(data))
                }
            }
            var list = localStorage.getItem('CHECKLIST') !== null ? (typeof localStorage.getItem('CHECKLIST') !== 'undefined') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: list.ListItem,
                    customerDetail: data ? data : [],
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    TaxRate: list.TaxRate,
                    oliver_pos_receipt_id: list.oliver_pos_receipt_id,
                    order_date: list.order_date,
                    order_id: list.order_id,
                    status: list.status,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
            }

            sessionStorage.removeItem("backurl");
            if (isMobileOnly)
                history.push(this.state.backUrl);
            else
                window.location = this.state.backUrl;
        } else {
            if (single_cutomer_list !== null) {
                if (cutomer_data && typeof cutomer_data.Email !== 'undefined' && cutomer_data.Email !== null) {
                    // if ((typeof cutomer_data.Email !== 'undefined') && cutomer_data.Email !== null) {
                    var content = cutomer_data
                    var data = {
                        content
                    }
                    localStorage.setItem('AdCusDetail', JSON.stringify(data))
                } else {
                    if (this.props.customer_save_data !== null && this.props.customer_save_data !== 'undefined' && this.props.customer_save_data) {
                        if (parseInt(this.props.customer_save_data.content.WPId) == parseInt(single_cutomer_list.UID)) {
                            var content = this.props.customer_save_data.content
                            var data = {
                                content
                            }
                            localStorage.setItem('AdCusDetail', JSON.stringify(data))
                        } else if (parseInt(this.props.customer_save_data.content.WPId) !== parseInt(single_cutomer_list.UID)) {
                            localStorage.setItem('AdCusDetail', JSON.stringify(data))
                        }
                    } else {
                        localStorage.setItem('AdCusDetail', JSON.stringify(data))
                    }
                }
                if (isMobileOnly)
                    history.push('/shopview');
                else
                    window.location = '/shopview';
            }
        }
        if (single_cutomer_list == null) {
            // { console.log("Customer list" + sing); }
            // $('#edit-information').modal('show')
            showModal('edit-information');
        }
    }

    filterCustomer(e) {
        var filtered = [];
        const { value } = e.target;
        this.setState({ filter_dataStatus: true })
        if (value && value !== null && value.length == 0) {
            this.state.activeFilter = false
            this.setState({ activeFilter: false, filteredList: [] })
            this.clearInput()
            this.props.dispatch(customerActions.nullUpdate());
            this.props.dispatch(customerActions.filteredList(null, null, null))
        }
        this.setState({ search: value })
        var UID = get_UDid('UDID');
        this.props.dispatch(customerActions.filteredList(UID, this.state.PageSize, value))
        if (value && value.length !== 0) {
            this.setState({ activeFilter: true })
        }
    }

    clearInput() {
        var UID = get_UDid('UDID');
        if (this.state.customerList && (this.state.customerList[0] !== undefined || this.state.customerList[0] !== null && this.state.customerList.length > 0)) {
            sessionStorage.setItem("CUSTOMER_ID", this.state.customerList[0].WPId);
        }
        if (this.state.customerList && this.state.customerList.length > 0 && this.state.customerList[0].WPId !== 0) {
            this.props.dispatch(customerActions.getDetail(this.state.customerList[0].WPId, UID));
            // test commented
            // this.props.dispatch(customerActions.getAllEvents(this.state.customerList[0].WPId, UID));
        }

        this.setState({
            ID: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
            FirstName: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].FirstName : '',
            LastName: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].LastName : '',
            Email: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].Email : '',
            PhoneNumber: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].PhoneNumber : '',
            Address: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].StreetAddress : '',
            Notes: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].notes : '',
            StoreCredit: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].StoreCredit : '',
            AccountBalance: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].AccountBalance : '',
            Details: this.state.customerList[0] && this.props.single_cutomer_list ? this.props.single_cutomer_list.content.orders : [],
            Street_Address: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].StreetAddress2 : '',
            Pincode: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].cust_pin : '',
            city: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].City : '',
            Cust_ID: this.state.customerList[0] && this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
            active: 0,
            // customerEvents : this.props.customer_events? this.props.customer_events.events.content:[]

        })
        this.setState({
            search: '',
            activeFilter: false,
            filteredList: null,
        })
    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({
                loading: true
            })
        }, 3000);
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 1000);

        KeyAppsDisplay.DisplayApps(["adjust_credit", "customer_addnotes"])
    }

    componentWillReceiveProps(nextProp) {
        // if(window.location.pathname !== '/checkout') { 
        var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
        // console.log("customer_id", CUSTOMER_ID)
        // console.log("componentWillReceiveProps", nextProp,this.props)
        var customerDetail = '';
        var customerOrders = '';
        var customerAddress = '';
        if (nextProp.customer_Delete && nextProp.customer_Delete.error && nextProp.customer_Delete.error !== "") {
            this.setState({ common_Msg: nextProp.customer_Delete.error, submitted: false, loading: false });
            if (isMobileOnly == true) { $('#common_msg_popup').addClass('show'); }           
           if(this.state.showNewAppExtension==false){
                showModal('common_msg_popup');
           }else {   
            //New App extension V1.0 Response to the client---------------
            if(this.state.showNewAppExtension==true){
                postClientExtensionResponse("delete",false,nextProp.customer_Delete.error)
                this.state.showNewAppExtension=false;
            }
            //------------------------------------------------
            }
        }
        if (nextProp.customer_Delete && nextProp.customer_Delete && nextProp.customer_Delete.is_success  == true) {
            TriggerCallBack("customer-save-notification",nextProp.customer_Delete.message)
        }
        if (nextProp.customerlist && nextProp.customerlist.content && nextProp.customerlist.is_success == true) {
            this.setState({ isCustomerListLoaded: false });
        }
        //Update Customer..................................
        if (nextProp.customer_update_data && (nextProp.customer_update_data.is_success == false || nextProp.customer_update_data.is_success == true)) {
            this.setState({
                display_status: false,
                submitted: false,
                updateCustomer: false
            })
            //New App extension V1.0 Response to the client---------------
                if(this.state.showNewAppExtension==true){
                    postClientExtensionResponse("update",nextProp.customer_update_data.is_success,nextProp.customer_update_data.message)
                    this.state.showNewAppExtension=false;
                      //backgroud App---
                TriggerCallBack("customer-save-notification",nextProp.customer_update_data.message)
                //------------------------------------------------
                }
              
        }
        //-----------------------------------------------------------------------------------------
        // ------Response when save customer and customer already exist----------------------------
        if (nextProp.customer_save_data && nextProp.customer_save_data.is_success == false && this.state.activityTab !== true) {
            this.setState({
                display_status: false,
                common_Msg: nextProp.customer_save_data.message,//LocalizedLanguage.alreadyExistEmailMsg,
                submitted: false,
                updateCustomer: false,
                loading: true,
                tabLoading: false,
               
            })
            //New App extension V1.0 Response to the client---------------
            if(this.state.showNewAppExtension==true){
                postClientExtensionResponse("save",false,nextProp.customer_save_data.message)
                this.state.showNewAppExtension=false;
            }
            //------------------------------------------------
           
            if (isMobileOnly == true) { $('#common_msg_popup').addClass('show'); }
            if (window.location.pathname !== '/checkout') {
                showModal('common_msg_popup');
            }
        }
        else {
            if (nextProp.customer_save_data && (nextProp.customer_save_data.is_success == false || nextProp.customer_save_data.is_success == true)) {
                this.setState({
                    display_status: false,
                    submitted: false,
                    updateCustomer: false
                })
                //New App extension V1.0 Response to the client---------------
                    if(this.state.showNewAppExtension==true){
                        postClientExtensionResponse("save",nextProp.customer_save_data.is_success,nextProp.customer_save_data.message)
                        this.state.showNewAppExtension=false;
                          //backgroud App---
                    TriggerCallBack("customer-save-notification",nextProp.customer_save_data.message)
                    //------------------------------------------------
                    }
                  
            }
            
            // console.log("nextProp",nextProp,nextProp.customer_events )
            if ((nextProp.customer_events && nextProp.customer_events.events && nextProp.customer_events.events.content)) {
                this.setState({ tabLoading: false });
            }

            if ((nextProp.customer_events && nextProp.customer_events.events && nextProp.customer_events.events.is_success == false)) {
                this.setState({ tabLoading: false, loading: true, });
            }

            //console.log("nextProp",this.state.customerEvents);
            if (nextProp.single_cutomer_list && nextProp.customerlist && nextProp.single_cutomer_list !== 'undefined') {
                this.setState({
                    // submitted: false,
                    loading: true
                });
                this.setState({ singleStatus: false })
            }

            if (this.state.PageNumber == 1) {
                localStorage.setItem("CustomerList", []);
            }
            if (nextProp.customerlist && nextProp.customerlist.content && nextProp.customerlist.content.PageNumber) {
                var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
                if (this.state.singleStatus == true && CUSTOMER_ID) {
                    this.props.dispatch(customerActions.getDetail(CUSTOMER_ID, this.state.UDID));
                    // this.props.dispatch(customerActions.getAllEvents(CUSTOMER_ID, this.state.UDID));

                }
                this.setState({
                    PageNumber: nextProp.customerlist.content.PageNumber,
                    TotalRecords: nextProp.customerlist.content.TotalRecords
                });
            }
            var custList = [];
            if (localStorage.getItem("CustomerList") && this.state.updateCustomer == false) {
                var custListState = [];
                var custListState1 = localStorage.getItem("CustomerList");
                custListState = custListState1 !== null && custListState1 !== undefined ? JSON.parse(custListState1) : null;
                if (custListState !== null) {
                    custListState.map(element => {
                        var ItemExit = false;
                        custList.map(item => {
                            if (item.WPId == element.WPId) {
                                ItemExit = true;
                            }
                        })
                        if (ItemExit == false)
                            custList.push(element);
                    });
                }
            } else if (this.state.updateCustomer == true) {
                this.loadMore(0);
                this.state.updateCustomer = false
            }

            if (nextProp.customerlist && nextProp.customerlist.content && nextProp.customerlist.content.Records != 'undefined') {
                var newArrList = [];
                nextProp.customerlist.content.Records && nextProp.customerlist.content.Records.forEach(element => {
                    var ItemExit = false;
                    custList.map(item => {
                        if (item.WPId == element.WPId) {
                            ItemExit = true;
                        }
                    })
                    if (ItemExit == false)

                        custList.push(element);
                });
                this.state.customerList = custList;
                this.setState({ customerList: custList, isCustomerListLoaded: false });

                if (nextProp.single_cutomer_list) {
                    var selected_customer_list = nextProp.single_cutomer_list && nextProp.single_cutomer_list.content;
                    customerDetail = selected_customer_list && selected_customer_list.customerDetails;
                    customerOrders = selected_customer_list && selected_customer_list.orders;
                    customerAddress = customerDetail && customerDetail.customerAddress.find(Items => Items.TypeName == "billing");
                }
                this.setState({
                    ID: customerDetail ? customerDetail.WPId : this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
                    FirstName: customerDetail ? customerDetail.FirstName : this.state.customerList.length > 0 ? this.state.customerList[0].FirstName : '',
                    LastName: customerDetail ? customerDetail.LastName : this.state.customerList.length > 0 ? this.state.customerList[0].LastName : '',
                    Email: customerDetail ? customerDetail.Email : this.state.customerList.length > 0 ? this.state.customerList[0].Email : '',
                    PhoneNumber: customerDetail ? customerDetail.PhoneNumber : this.state.customerList.length > 0 ? this.state.customerList[0].Contact : '',
                    Street_Address: customerAddress ? customerAddress.Address1 : this.state.customerList.length > 0 ? this.state.customerList[0].StreetAddress : '',
                    Notes: customerAddress ? customerAddress.Notes : this.state.customerList.length > 0 ? this.state.customerList[0].notes : '',
                    StoreCredit: customerDetail ? customerDetail.StoreCredit : this.state.customerList.length > 0 ? this.state.customerList[0].store_credit : '',
                    AccountBalance: customerDetail ? customerDetail.AccountBalance : this.state.customerList.length > 0 ? this.state.customerList[0].AccountBalance : '',
                    Details: customerOrders ? customerOrders : [],
                    Street_Address2: customerAddress ? customerAddress.Address2 : this.state.customerList.length > 0 ? this.state.customerList[0].StreetAddress2 : '',
                    country_name: customerAddress ? customerAddress.Country : this.state.customerList.length > 0 ? this.state.customerList[0].Country : '',
                    Pincode: customerAddress ? customerAddress.Pincode : this.state.customerList.length > 0 ? this.state.customerList[0].Pincode : '',
                    city: customerAddress ? customerAddress.City : this.state.customerList.length > 0 ? this.state.customerList[0].city : '',
                    Cust_ID: customerDetail ? customerDetail.WPId : this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
                    //customerEvents : this.props.customer_events && this.props.customer_events.events? this.props.customer_events.events.content:[]
                })
                var statename = customerAddress ? customerAddress.State : ''
                var coun = customerAddress ? customerAddress.Country : '';
                if (coun) {
                    this.EditCountryToStateList(coun, statename);
                    this.getCountryAndStateName(statename, coun);
                }
                if (!coun) {
                    this.setState({
                        country_name: '',
                        state_name: '',
                        selectedCountryName: '',
                        viewStateList: '',
                        stateName: ''
                    })
                }
            }
            localStorage.setItem("CustomerList", JSON.stringify(custList));
            if (nextProp.filteredList && nextProp.filteredList.content && nextProp.filteredList.content.Records !== 'undefined') {
                if (nextProp.filteredList.content.Records.length == 1 && this.state.filter_dataStatus == true) {
                    var WPId = nextProp.filteredList.content.Records[0].WPId
                    var UID = get_UDid('UDID');
                    this.setState({ filter_dataStatus: false })
                    sessionStorage.setItem("CUSTOMER_ID", WPId);
                    this.props.dispatch(customerActions.getDetail(WPId, UID));

                    // test commented
                    // this.props.dispatch(customerActions.getAllEvents(WPId, UID));

                }
                this.setState({ filteredList: nextProp.filteredList.content.Records })
                 //New App extension V1.0 Response to the client---------------
                    if(this.state.showNewAppExtension==true && nextProp.filteredList.is_success==true){
                        var _response=nextProp.filteredList.content.Records && nextProp.filteredList.content.Records.length>0?
                                        nextProp.filteredList.content.Records[0]:'No customer found'
                            var data;
                        if(nextProp.filteredList.content.Records && nextProp.filteredList.content.Records.length>0){
                            data={ 
                                Id: nextProp.filteredList.content.Records[0].WPId ,
                                first_name:  nextProp.filteredList.content.Records[0].FirstName ,
                                last_name:  nextProp.filteredList.content.Records[0].LastName ,
                                email:   nextProp.filteredList.content.Records[0].Email ,
                                phone_number:  nextProp.filteredList.content.Records[0].Contact , 
                                //StoreCredit: nextProp.filteredList.content.Records[0].store_credit ,
                                address_line_one: nextProp.filteredList.content.Records[0].StreetAddress ,
                                address_line_two: nextProp.filteredList.content.Records[0].StreetAddress2 ,
                                country:  nextProp.filteredList.content.Records[0].Country ,
                                postal_code:  nextProp.filteredList.content.Records[0].Pincode ,
                                city:  nextProp.filteredList.content.Records[0].City,
                                state :nextProp.filteredList.content.Records[0].State,
                                notes:  nextProp.filteredList.content.Records[0].notes ,                             
                            }   
                        }    
                        if(_response=='No customer found'){
                            postClientExtensionResponse("save",false,_response,"CustomerDetails","")
                        }else{
                             postClientExtensionResponse("save",nextProp.filteredList.is_success,_response,"CustomerDetails",data)
                        }
                       
                        this.state.showNewAppExtension=false;
                    }
                //------------------------------------------------
              
            }
            if (nextProp.single_cutomer_list) {
                var selected_customer_list = nextProp.single_cutomer_list && nextProp.single_cutomer_list.content;
                customerDetail = selected_customer_list && selected_customer_list.customerDetails;
                customerOrders = selected_customer_list && selected_customer_list.orders;
                customerAddress = customerDetail && customerDetail.customerAddress.find(Items => Items.TypeName == "billing");
                TriggerCallBack("customer-detail-view",customerDetail)
            } else {
                // customerDetail = this.state.customerList[0];
            }
            if (nextProp.customer_save_data && nextProp.customer_save_data.content) {
                customerDetail = nextProp.customer_save_data && nextProp.customer_save_data.content;
            }
            if (customerDetail) {
                this.setState({
                    ID: customerDetail ? customerDetail.UID ? customerDetail.UID : customerDetail.WPId : '',
                    FirstName: customerDetail ? customerDetail.FirstName : '',
                    LastName: customerDetail ? customerDetail.LastName : '',
                    Email: customerDetail ? customerDetail.Email : '',
                    PhoneNumber: customerDetail ? customerDetail.PhoneNumber ? customerDetail.PhoneNumber : customerDetail.Contact : '',
                    Street_Address: customerDetail.StreetAddress ? customerDetail.StreetAddress : customerAddress && customerAddress.Address1 ? customerAddress.Address1 : '',
                    Notes: customerDetail ? customerDetail.Notes ? customerDetail.Notes : customerDetail.notes : '',
                    StoreCredit: customerDetail ? customerDetail.StoreCredit ? customerDetail.StoreCredit : customerDetail.store_credit : '',
                    AccountBalance: customerDetail ? customerDetail.AccountBalance : '',//check account balance field 
                    Details: customerOrders ? customerOrders : [],
                    Street_Address2: customerDetail.StreetAddress2 ? customerDetail.StreetAddress2 : customerAddress && customerAddress.Address2 ? customerAddress.Address2 : '',
                    country_name: customerDetail.Country ? customerDetail.Country : customerAddress && customerAddress.Country ? customerAddress.Country : '',
                    Pincode: customerDetail.Pincode ? customerDetail.Pincode : customerAddress ? customerAddress.PostCode ? customerAddress.PostCode : '' : '',
                    city: customerDetail.City ? customerDetail.City : customerAddress && customerAddress.City ? customerAddress.City : '',
                    Cust_ID: customerDetail ? customerDetail.UID ? customerDetail.UID : customerDetail.WPId : '',
                })
            }
            var countNme = customerDetail && customerDetail.Country ? customerDetail.Country : customerAddress ? customerAddress.Country : ''
            var statename = customerDetail && customerDetail.State ? customerDetail.State : customerAddress ? customerAddress.State : ''
            if (countNme) {
                this.EditCountryToStateList(countNme, statename)
                this.getCountryAndStateName(statename, countNme);
            }
            if (!countNme) {
                this.setState({
                    country_name: '',
                    state_name: '',
                    selectedCountryName: '',
                    viewStateList: '',
                    stateName: ''
                })
            }
            /* Created By:priyanka,Created Date:7/6/2019,Description:secountNmet state active for selected row after update customer */
            (this.state.activeFilter == false && this.state.display_status == true && typeof nextProp.customer_save_data !== 'undefined' && nextProp.customer_save_data !== '' && nextProp.customer_save_data) ? this.state.customerList && this.state.customerList.map((item, index) => {
                if (nextProp.customer_save_data && nextProp.customer_save_data.content && item.WPId == nextProp.customer_save_data.content.WPId) {
                    sessionStorage.setItem("CUSTOMER_ID", nextProp.customer_save_data.content.WPId);
                    this.setState({
                        active: index,
                        popup_status: true,
                        ID: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.WPId : this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
                        FirstName: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.FirstName : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].FirstName : '',
                        LastName: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.LastName : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].LastName : '',
                        Email: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Email : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].Email : '',
                        PhoneNumber: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Contact : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].PhoneNumber : '',
                        Street_Address: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.StreetAddress : '',
                        Notes: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.notes : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].notes : '',
                        StoreCredit: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.store_credit : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].store_credit : '',
                        Street_Address2: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.StreetAddress2 : '',
                        country_name: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Country : '',
                        Pincode: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Pincode : this.state.customerList.length > 0 ? this.state.customerList[0].Pincode : '',
                        city: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.City : '',
                        Cust_ID: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.WPId : this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
                        Details: (typeof nextProp.customer_save_data !== 'undefined') && customerDetail
                            ? customerDetail.UID == nextProp.customer_save_data.content.WPId ? customerOrders : '' : ''
                    })
                    var countNme = (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Country : ''
                    var statename = (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.State : ''
                    if (countNme) {
                        this.EditCountryToStateList(countNme, statename)
                        this.getCountryAndStateName(statename, countNme);
                    }
                    if (!countNme) {
                        this.setState({
                            country_name: '',
                            state_name: '',
                            selectedCountryName: '',
                            stateName: ''
                        })
                    }
                }
            }) :
                (this.state.activeFilter == true && this.state.display_status == true && typeof nextProp.customer_save_data !== 'undefined' && nextProp.customer_save_data !== '' && nextProp.customer_save_data) ? this.state.filteredList && this.state.filteredList.map((item, index) => {
                    if (nextProp.customer_save_data && item.WPId == nextProp.customer_save_data.content.WPId) {
                        sessionStorage.setItem("CUSTOMER_ID", nextProp.customer_save_data.content.WPId);
                        this.setState({
                            active: index,
                            popup_status: true,
                            ID: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.WPId : this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
                            FirstName: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.FirstName : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].FirstName : '',
                            LastName: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.LastName : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].LastName : '',
                            Email: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Email : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].Email : '',
                            PhoneNumber: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Contact : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].PhoneNumber : '',
                            Street_Address: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.StreetAddress : '',
                            Notes: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.notes : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].notes : '',
                            StoreCredit: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.store_credit : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].store_credit : '',
                            Street_Address2: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.StreetAddress2 : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].StreetAddress2 : '',
                            country_name: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Country : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].Country : '',
                            Pincode: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Pincode : this.state.customerList.length > 0 ? this.state.customerList[0].Pincode : '',
                            city: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.City : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].City : '',
                            Cust_ID: (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.WPId : this.state.customerList.length > 0 ? this.state.customerList[0].WPId : '',
                            Details: (typeof nextProp.customer_save_data !== 'undefined') && customerDetail ? customerDetail.UID == nextProp.customer_save_data.content.WPId ? customerOrders : '' : ''
                        })
                        var countNme = (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.Country : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].Country : '';
                        var statename = (typeof nextProp.customer_save_data !== 'undefined') ? nextProp.customer_save_data.content.State : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].State : '';
                        if (countNme) {
                            this.EditCountryToStateList(countNme, statename)
                            this.getCountryAndStateName(statename, countNme);
                        }
                    }
                }) : ''


            if (this.state.backUrl && this.state.backUrl !== 'undefined' && this.state.backUrl !== '' && nextProp.customer_save_data !== '' && nextProp.customer_save_data && this.state.create == 'create') {

                var data = nextProp.customer_save_data !== '' && nextProp.customer_save_data
                this.setState({ create: '' })
                this.goBack(data)
            }

            // add customer for sale in mobile check box click
            if (this.state.ActiveAddToSale == true && this.state.ActiveAddToSaleEmail !== "" && nextProp.single_cutomer_list) {
                var selected_customer_list = nextProp.single_cutomer_list && nextProp.single_cutomer_list.content;
                customerDetail = selected_customer_list && selected_customer_list.customerDetails;
                if (customerDetail && this.state.ActiveAddToSaleEmail == customerDetail.Email)
                    this.setState({ ActiveAddToSale: false })
                this.goBack(nextProp.single_cutomer_list)
            }
            // }
        }
    }

    adjustpopupopen() {
        showModal('AdjustCredit');
    }
    addCustomerNotes() {
        showModal('AddCustomerNote');
    }


    createCustomer() {
        this.setState({
            Cust_ID: '',
            user_store_credit: '',
            state_name: '',
            FirstName: '',
            LastName: '',
            Email: '',
            Street_Address: '',
            Notes: '',
            StoreCredit: '',
            AccountBalance: '',
            selectedCountryName: '',
            Details: '',
            Street_Address2: '',
            country_name: '',
            Cust_ID: '',
            popup_status: true,
            Pincode: '',
            city: '',
            ID: '',
            statename: '',
            PhoneNumber: '',
            emailValid: '',
            nameValid:'',
            lastValid:'',
            viewStateList: '',
            isContactValid : true
        })
        customerActions.nullUpdate();
        $(".button_with_checkbox input").prop("checked", false);
        setTimeout(() => {
            //$('#edit-information').modal('show')
            showModal('edit-information ');
        }, 500);

        setAndroidKeyboard("createCustomer");
    }

    loadMore(number) {
        if (this.state.TotalRecords == 0 || (this.state.TotalRecords / this.state.PageSize) >= (this.state.PageNumber)
            || ((this.state.PageSize * (this.state.PageNumber + number)) > 0)) {
            this.state.PageNumber = this.state.PageNumber + number;
            var UID = get_UDid('UDID');
            this.props.dispatch(customerActions.getPage(UID, this.state.PageSize, this.state.PageNumber));
        }
        // console.log("looog: ", this.props);
    }

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
        this.state.selectedCountryName = count_name ? count_name.Name : countryCode;
        this.state.country_name = count_code
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
        this.state.state_name = stateCode;
        this.setState({
            state_name: stateCode,
            stateName: stat_name.Name ? stat_name.Name : ''
        })
    }
    /** 
     *  Updated by :Shakuntala Jatav
     * Cerated Date: 22-07-2019
     * Description : for set state of state list
     **/
    EditCountryToStateList(country_name, state_name) {
        var count_code = '';
        var finalStatelist = [];
        this.state.getCountryList && this.state.getCountryList.find(function (element) {
            if (element.Code == country_name || element.Name.replace(/[^a-zA-Z]/g, ' ') == country_name) {
                count_code = element.Code
            }
        })
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Country == count_code) {
                finalStatelist.push(element)
            } else if (element.Country == country_name) {
                finalStatelist.push(element)
            }
        })
        if (finalStatelist && finalStatelist !== null && finalStatelist.length > 0) {
            this.setState({
                viewStateList: finalStatelist,
            })
        }
    }

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
            state_name: '',
            stateName: ''
        })
    }

    onChangeStateList(e) {
        this.setState({
            state_name: e.target.value,
        })
    }
    /** *
     *  Created By:priyanka
     * Created Date:5/5/2019
     * Description:set state for selected customer on handle close
*/
    handleClose() {
        var customerDetail = '';
        var customerOrders = '';
        var customerAddress = ''
        if (this.props.customer_save_data) {
            customerDetail = this.props.customer_save_data.content;
            if (this.props.single_cutomer_list) {
                var selected_customer_list = this.props.single_cutomer_list && this.props.single_cutomer_list.content;
                customerOrders = selected_customer_list && selected_customer_list.orders;
            }
        } else if (this.props.single_cutomer_list) {
            var selected_customer_list = this.props.single_cutomer_list && this.props.single_cutomer_list.content;
            customerDetail = selected_customer_list && selected_customer_list.customerDetails;
            customerOrders = selected_customer_list && selected_customer_list.orders;
            customerAddress = customerDetail && customerDetail.customerAddress.find(Items => Items.TypeName == "billing");
        } else {
            customerDetail = this.state.customerList[0];
        }
        var cusDataSave = this.props.customer_save_data && this.props.customer_save_data.content ? this.props.customer_save_data.content : ''
        if (customerDetail) {
            this.setState({
                ID: customerDetail ? customerDetail.UID ? customerDetail.UID : customerDetail.WPId : '',
                FirstName: customerDetail ? customerDetail.FirstName : '',
                LastName: customerDetail ? customerDetail.LastName : '',
                Email: customerDetail ? customerDetail.Email : '',
                PhoneNumber: customerDetail ? customerDetail.PhoneNumber ? customerDetail.PhoneNumber : customerDetail.Contact : '',
                Street_Address: customerAddress && customerAddress.Address1 ? customerAddress.Address1 : customerDetail.StreetAddress ? customerDetail.StreetAddress : '',
                Notes: customerDetail ? customerDetail.Notes ? customerDetail.Notes : customerDetail.notes : '',
                StoreCredit: customerDetail ? customerDetail.StoreCredit ? customerDetail.store_credit : customerDetail.store_credit : '',
                AccountBalance: customerDetail ? customerDetail.AccountBalance : '',//check account balance field 
                Details: customerDetail ? cusDataSave ? customerDetail.UID == cusDataSave.WPId : customerOrders ? customerOrders : [] : '',
                Street_Address2: customerAddress && customerAddress.Address2 ? customerAddress.Address2 : customerDetail.StreetAddress2 ? customerDetail.StreetAddress2 : '',
                country_name: customerAddress && customerAddress.Country ? customerAddress.Country : customerDetail.Country ? customerDetail.Country : '',
                Pincode: customerAddress ? customerAddress.PostCode ? customerAddress.PostCode : '' : customerDetail.Pincode ? customerDetail.Pincode : '',
                city: customerAddress && customerAddress.City ? customerAddress.City : customerDetail.City ? customerDetail.City : '',
                Cust_ID: customerDetail ? customerDetail.UID ? customerDetail.UID : customerDetail.WPId : '',
                loading: true,
                submitted: false,
                updateCustomer: false,
            })
        }
        var countNme = customerAddress ? customerAddress.Country : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].Country : ''
        var statename = customerAddress ? customerAddress.State : this.state.customerList.length > 0 && this.state.Cust_ID == this.state.customerList[0].WPId ? this.state.customerList[0].State : ''
        if (countNme) {
            this.EditCountryToStateList(countNme, statename)
            this.getCountryAndStateName(statename, countNme);
        }
        $(".button_with_checkbox input").prop("checked", false);
    }

    /**
     * Created Date :30-12-2019
     * Created By :Shakuntala Jatav
     * Description : show div for create and edit suctomer
     */
    addNewCustomter(st) {
        if (st == "create") {
            this.setState({
                Cust_ID: '',
                user_store_credit: '',
                Street_Address: '',
                country_name: '',
                state_name: '',
                FirstName: '',
                LastName: '',
                Email: '',
                Street_Address2: '',
                Notes: '',
                StoreCredit: '',
                AccountBalance: '',
                selectedCountryName: '',
                Details: '',
                popup_status: true,
                Pincode: '',
                city: '',
                ID: '',
                PhoneNumber: ''
            })
        }
        this.setState({ activeCreateEditDiv: st })
    }

    waitForAddToSale(st, email) {
        this.setState({
            ActiveAddToSale: st,
            ActiveAddToSaleEmail: email ? email : ""
        })
    }

    closeMsgModal() {
        if (isMobileOnly == true) {
            $('#common_msg_popup').removeClass('show');
        }
        this.setState({
            common_Msg: '',
            submitted: false,
            updateCustomer: false,
            loading: true
        })
    }

    CommonMsg(text) {
        this.setState({ common_Msg: text })
    }

    customerDeleteButton(tab_type) {
        if (tab_type == 'activity') {
            this.setState({ customerDeleteActive: true, activityTab: true });
            var custId = this.state.Cust_ID && this.state.Cust_ID !== '' ? this.state.Cust_ID :
                this.props.single_cutomer_list.content && this.props.single_cutomer_list.content.customerDetails ? this.props.single_cutomer_list.content.customerDetails.WPId :
                    this.state.customerList && this.state.customerList[0] && this.state.customerList[0].WPId
            setTimeout(() => {
                this.UpdateCustomerDetail(this.props, custId, this.state.UDID, tab_type)
            }, 1000);
        }
        else {
            this.setState({ customerDeleteActive: false, activityTab: false })
            if (tab_type == 'customer') {
                setTimeout(() => {
                    this.UpdateCustomerDetail(this.props, this.state.Cust_ID, this.state.UDID, tab_type)
                }, 1000);
            }
        }
    }

    // *** customer extension code start *** ///
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
        const { single_cutomer_list } = this.props
        var customer_wpid = single_cutomer_list && single_cutomer_list.content && single_cutomer_list.content.customerDetails ? single_cutomer_list.content.customerDetails.WPId : ''
        var jsonMsg = value ? value : '';
      
        var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (clientEvent && clientEvent !== '') {
            // console.log("clientEvent", jsonMsg)
            switch (clientEvent) {
                case "extensionReady":
                    this.extensionReady()
                    break;
                case "addCustomer":
                    addExtensionCustomer(jsonMsg.data)
                    break;
                case "updateCustomer":
                    updateExtensionCustomer(jsonMsg.data, customer_wpid)
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
                break;
                default: // extensionFinished
                    console.error('App Error : Extension event does not match ', jsonMsg)
                    break;
            }

        }
    }
    
    extensionReadyV1=()=> {
        const { single_cutomer_list } = this.props
        var customerDetail = single_cutomer_list && single_cutomer_list.content && single_cutomer_list.content.customerDetails
       
       responseData= {
        command: 'appReady/v1',
        method: 'get',
        status: 200,
        data: customerDetail,
        error: null
    }
    if (clientJSON != "") {
        this.postmessage(clientJSON);
      }
}
postmessage(clientJSON) {
    var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
    iframex.postMessage(JSON.stringify(clientJSON), '*');
  }   

  extensionReady = () => {
        const { single_cutomer_list } = this.props
        var customerDetail = single_cutomer_list && single_cutomer_list.content && single_cutomer_list.content.customerDetails
        var clientJSON =
        {
            oliverpos:
            {
                event: "customerData"
            },
            data:
            {
                customerDetails:
                {
                    ...customerDetail
                },
                transactionHistory: [],
            }
        };

        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
        var _user = JSON.parse(localStorage.getItem("user"));
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }
    // *** customer extension code end *** ///

    render() {
        const customerlist = this.state.customerList;
        const { single_cutomer_list, customerName, customerAddress } = this.props;
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        //console.log("props", this.props)
        // console.log("this.state.loading", this.state.loading)
        // console.log("city",  customerAddress.customerAddress.City)
        const {
            PhoneNumber,
            Street_Address,
            Street_Address2,
            submitted,
            country_name,
            state_name,
            FirstName,
            LastName,
            Email,
            Notes,
            Pincode,
            city,
            active,
            UDID,
            Cust_ID,
            activeFilter,
            pageOfItems,
            search,
            emailValid,
            nameValid,
            lastValid,
            common_Msg
        } = this.state;
        const tdNotFound = {
            textAlign: "unset"
        };
        const pStylenotFound = {
            textAlign: 'center'
        };
        return (
            (isMobileOnly == true) ?
                <div>
                    {this.state.loading == false && this.state.submitted == true || this.state.updateCustomer == true ? <AndroidAndIOSLoader /> : this.state.loading == false && this.state.customerList == '' ? <AndroidAndIOSLoader /> : ''}
                    <MobileCustomerView
                        {...this.props}
                        {...this.state}
                        setAndroidKeyboard={setAndroidKeyboard}
                        clearInput={this.clearInput}
                        LocalizedLanguage={LocalizedLanguage}
                        activeClass={this.activeClass}
                        createCustomer={this.createCustomer}
                        loadMore={this.loadMore}
                        goBack={this.waitForAddToSale}
                        NavbarPage={NavbarPage}
                        CommonHeader={CommonHeader}
                        filterCustomer={this.filterCustomer}
                        addNewCustomter={this.addNewCustomter}
                        activeCreateEditDiv={this.state.activeCreateEditDiv}
                        onChange={this.handleChange}
                        onClick={this.handleSubmit}
                        onChangeList={this.handleChangeList}
                        onChangeStateList={this.onChangeStateList}
                        getState={this.state.viewStateList ? this.state.viewStateList : ''}
                        //onRef={ref => (this.deleteCustomer = ref)} 
                        // deleteCustomer={this.deleteCustomer}
                        msg={this.CommonMsg}
                    />
                    <WarningMessage msg_text={common_Msg} close_Msg_Modal={this.closeMsgModal}
                    />
                    <ConfirmationPopup deleteCustomer={this.deleteCustomer} Cust_ID={Cust_ID} popup_status={this.state.popup_status} />
                </div>
                :
                <div>
                    {window.location.pathname == '/checkout' ?
                        <CheckoutCustomer
                            onChange={this.handleChange}
                            onClick={() => this.handleSubmit()}
                            Street_Address={Street_Address ? Street_Address : ""}
                            city={city ? city : ''}
                            PhoneNumber={PhoneNumber ? PhoneNumber : ""}
                            //{user_contact ? user_contact : cust_phone_number ? cust_phone_number : ""}
                            FirstName={FirstName ? FirstName : ''}
                            LastName={LastName ? LastName : ''}
                            Email={Email ? Email : ''}
                            Notes={Notes ? Notes : ''}
                            Pincode={Pincode ? Pincode : ''}
                            submitted={submitted}
                            getCountryList={this.state.getCountryList}
                            getState={this.state.viewStateList ? this.state.viewStateList : ''}
                            Street_Address2={this.state.Street_Address2 ? this.state.Street_Address2 : ''}
                            country_name={this.state.country_name ? this.state.country_name : ''}
                            state_name={this.state.state_name ? this.state.state_name : ''}
                            onChangeList={this.handleChangeList}
                            onChangeStateList={this.onChangeStateList}
                            emailValid={emailValid}
                            nameValid={nameValid}
                            lastValid={lastValid}
                            Cust_ID={Cust_ID}
                            custmerPin={this.state.custmerPin}
                            // onClick1={this.handleClose}
                            {...this.props} />
                        :
                        <div>
                            <div className="wrapper">
                                <div className="overlay"></div>
                                <NavbarPage {...this.props} />
                                <div id="content">
                                    {this.state.loading == false && (this.state.submitted == true || this.state.updateCustomer == true) ? <LoadingModal /> : ''}
                                    {/* this.state.loading == false && (this.state.customerList == '' || !single_cutomer_list) ? <LoadingModal /> : */}
                                    {this.state.backUrl ?
                                        <CommonHeaderThree />
                                        // : <CommonHeaderTwo {...this.props} />
                                        : <CommonHeader {...this.props} />
                                    }
                                    <div className="inner_content bg-light-white clearfix">
                                        <div className="content_wrapper">
                                            <div className="col-xs-5 col-sm-3 p-0">
                                                <div className="card card-custom">
                                                    <div className="card-header no-padding">
                                                        <div className="webSearch">
                                                            <div className="search-icon">
                                                                <i className="icons8-search-more"></i>
                                                            </div>
                                                            <input type="search" className="form-control bg-white pr-2" onClick={setAndroidKeyboard("search")} onChange={this.filterCustomer} placeholder={LocalizedLanguage.placeholderSearchOfCustomer} id="searchUser" value={search} data-column-index="0"></input>
                                                            <div className="close-icon">
                                                                {activeFilter == true ?
                                                                    <div className="card-close" onClick={() => this.clearInput()}>
                                                                        <i className="icons8-cancel"></i>
                                                                    </div> :
                                                                    ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className="card card-inner pg-current-checkout"> */}
                                                    <div className={isDemoUser ? 'card card-inner pg-current-checkout pg-current-checkout-if_footer' : "card card-inner pg-current-checkout"} >
                                                        <div className="card-body no-padding overflowscroll" style={{ height: 250 }}>
                                                            <div className="Checkout_activity">
                                                                {this.state.isCustomerListLoaded == true ?
                                                                    <div className="no-product-find AppModal w-100" style={{ height: "70vh" }}>
                                                                        <LoadingSmallModal />
                                                                    </div>
                                                                    :
                                                                    <div className="widget_day_record">
                                                                        <table className="table table-customise table-day-record fixed-table-cell" id="customer-list">
                                                                            <tbody>
                                                                                {activeFilter == true && this.state.filteredList && this.state.filteredList.length > 0 ?
                                                                                    this.state.filteredList.map((item, index) => {
                                                                                        return (
                                                                                            item.WPId ?
                                                                                                <CustomerViewFirst
                                                                                                    key={index}
                                                                                                    onClick={() => this.activeClass(item, index)}
                                                                                                    FirstName={item.FirstName}
                                                                                                    LastName={item.LastName}
                                                                                                    PhoneNumber={item.Contact}
                                                                                                    Email={item.Email}
                                                                                                    className={active == index ? 'table-primary-label' : ''} /> : ''

                                                                                        )
                                                                                    })
                                                                                    :
                                                                                    activeFilter == false && customerlist && customerlist.length > 0 ?
                                                                                        customerlist.map((item, index) => {
                                                                                            return (
                                                                                                item.WPId ?
                                                                                                    <CustomerViewFirst
                                                                                                        key={index}
                                                                                                        onClick={() => this.activeClass(item, index)}
                                                                                                        FirstName={item.FirstName}
                                                                                                        LastName={item.LastName}
                                                                                                        PhoneNumber={item.Contact}
                                                                                                        Email={item.Email}
                                                                                                        className={active == index ? 'table-primary-label' : ''} /> : ''
                                                                                            )
                                                                                        })
                                                                                        :
                                                                                        <tr>
                                                                                            <td style={tdNotFound}><p style={pStylenotFound}>{LocalizedLanguage.noFound}</p></td>
                                                                                        </tr>
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                        {(this.state.TotalRecords > (this.state.PageNumber * this.state.PageSize)) && activeFilter == false ?
                                                                            <div className="createnewcustomer mb-2">
                                                                                <button type="button" className="btn btn-block btn-primary total_checkout" onClick={() => this.loadMore(1)}>{LocalizedLanguage.loadMore}</button>
                                                                            </div>
                                                                            : <div></div>}
                                                                    </div>
                                                                }
                                                                {/* <div className="widget_day_record">
                                                                    <table className="table table-customise table-day-record fixed-table-cell" id="customer-list">
                                                                        {/* <colgroup>
                                                                            <col width="*" />
                                                                            <col width="60" />
                                                                        </colgroup> */}
                                                                {/* <tbody>
                                                                            {activeFilter == true &&
                                                                                this.state.filteredList && this.state.filteredList.map((item, index) => {
                                                                                    return (
                                                                                        <CustomerViewFirst
                                                                                            key={index}
                                                                                            onClick={() => this.activeClass(item, index)}
                                                                                            FirstName={item.FirstName}
                                                                                            LastName={item.LastName}
                                                                                            PhoneNumber={item.Contact}
                                                                                            Email={item.Email}
                                                                                            className={active == index ? 'table-primary-label' : ''}
                                                                                        />
                                                                                    )
                                                                                })}
                                                                            {activeFilter == false &&
                                                                                customerlist &&
                                                                                customerlist.map((item, index) => {
                                                                                    return (
                                                                                        <CustomerViewFirst
                                                                                            key={index}
                                                                                            onClick={() => this.activeClass(item, index)}
                                                                                            FirstName={item.FirstName}
                                                                                            LastName={item.LastName}
                                                                                            PhoneNumber={item.Contact}
                                                                                            Email={item.Email}
                                                                                            className={active == index ? 'table-primary-label' : ''}
                                                                                        />
                                                                                    )
                                                                                })}
                                                                        </tbody>
                                                                    </table>
                                                                    {(this.state.TotalRecords > (this.state.PageNumber * this.state.PageSize)) && activeFilter == false ?
                                                                        <div className="createnewcustomer mb-2">
                                                                            <button type="button" className="btn btn-block btn-primary total_checkout bg-blue" onClick={() => this.loadMore(1)}>{LocalizedLanguage.loadMore}</button>
                                                                        </div>
                                                                        : <div></div>}
                                                                </div> */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* </div> */}
                                            </div>
                                            <CustomerViewSecond
                                                adjustCreditpoup={this.adjustpopupopen}
                                                addcustomernotes={this.addCustomerNotes}
                                                newCustomer={this.createCustomer}
                                                onChangePage={this.onChangePage}
                                                pageOfItems={pageOfItems}
                                                Props={this.props}
                                                UDID={UDID}
                                                ID={this.state.ID ? this.state.ID : this.state.Cust_ID}
                                                onclick={() => { this.goBack((typeof single_cutomer_list !== 'undefined') ? single_cutomer_list : customerlist[0]) }}
                                                FirstName={this.state.FirstName}
                                                LastName={this.state.LastName}
                                                Email={this.state.Email}
                                                PhoneNumber={this.state.PhoneNumber}// ? this.state.PhoneNumber : this.state.user_contact}
                                                getCountryList={this.state.getCountryList}
                                                Address={this.state.Street_Address}
                                                Notes={this.state.Notes}
                                                StoreCredit={this.state.StoreCredit}
                                                AccountBalance={this.state.AccountBalance}
                                                Details={this.state.Details ? this.state.Details : []}
                                                state_name={this.state.state_name ? this.state.state_name : ''}
                                                country_name={this.state.country_name ? this.state.country_name : ''}
                                                Street_Address={this.state.Street_Address2}
                                                Pincode={this.state.Pincode}
                                                city={this.state.city}
                                                popup_status={this.popup_status}
                                                StateName={this.state.stateName}
                                                submitted={submitted}
                                                loading={this.state.loading}
                                                emailValid={emailValid}
                                                nameValid={nameValid}
                                                lastValid={lastValid}
                                                Cust_ID={Cust_ID}
                                                custmerPin={this.state.custmerPin}
                                                getState={this.state.viewStateList ? this.state.viewStateList : ''}
                                                onChangeList={this.handleChangeList}
                                                onChangeStateList={this.onChangeStateList}
                                                onChange={this.handleChange}
                                                onClick={() => this.handleSubmit()}
                                                // onClick1={this.handleClose}
                                                customerDeleteActive={this.state.customerDeleteActive}
                                                customerDeleteButton={this.customerDeleteButton}
                                                // customerEvents={this.state.customerEvents}
                                                isDemoUser={isDemoUser}
                                                tabLoading={this.state.tabLoading}
                                                showExtensionIframe={this.showExtensionIframe} // For customer extension
                                                {... this.props}
                                            />
                                        </div>
                                    </div>
                                    {isDemoUser && (isDemoUser == 'true' || isDemoUser == true) &&
                                        <CommonDemoShopButton />
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    {/*Updated By:priyanka,Updated Date :6/6/2019,Description :CustomerViewEdit  popup   is used for both  save and update customer detail*/}
                    {Cust_ID == ' ' || Cust_ID !== ' ' && this.state.popup_status == true ? (
                        <div id="edit-information" className="modal fade popUpMid">
                            <CustomerViewEdit
                                onChange={this.handleChange}
                                onClick={() => this.handleSubmit()}
                                Street_Address={Street_Address ? Street_Address : ""}
                                city={city ? city : ''}
                                PhoneNumber={PhoneNumber ? PhoneNumber : ""}
                                //{user_contact ? user_contact : cust_phone_number ? cust_phone_number : ""}
                                FirstName={FirstName ? FirstName : ''}
                                LastName={LastName ? LastName : ''}
                                Email={Email ? Email : ''}
                                Notes={Notes ? Notes : ''}
                                Pincode={Pincode ? Pincode : ''}
                                submitted={submitted}
                                getCountryList={this.state.getCountryList}
                                getState={this.state.viewStateList ? this.state.viewStateList : ''}
                                Street_Address2={this.state.Street_Address2 ? this.state.Street_Address2 : ''}
                                country_name={this.state.country_name ? this.state.country_name : ''}
                                state_name={this.state.state_name ? this.state.state_name : ''}
                                onChangeList={this.handleChangeList}
                                onChangeStateList={this.onChangeStateList}
                                emailValid={emailValid}
                                nameValid={nameValid}
                                lastValid={lastValid}
                                isContactValid={this.state.isContactValid}
                                Cust_ID={Cust_ID}
                                custmerPin={this.state.custmerPin}
                            // onClick1={this.handleClose}
                            />
                        </div>
                    ) : Cust_ID == ' ' || Cust_ID !== ' ' && this.state.popup_status == false ?
                        <div id="edit-information" className="modal modal-wide modal-wide1 fade">
                            <div className="modal-dialog" id="dialog-midle-align">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                            <img src="../assets/img/Close.svg" />
                                        </button>
                                        <h4 className="error_model_title modal-title" id="epos_error_model_title">{LocalizedLanguage.messageTitle}</h4>
                                    </div>
                                    <div className="modal-body p-0">
                                        <h3 id="epos_error_model_message" className="popup_payment_error_msg">{LocalizedLanguage.chooseCustomerMsg}</h3>
                                    </div>
                                    <div className="modal-footer p-0">
                                        <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" aria-hidden="true">{LocalizedLanguage.okTitle}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                    }
                    <ConfirmationPopup deleteCustomer={this.deleteCustomer} Cust_ID={Cust_ID} popup_status={this.state.popup_status} />
                    {window.location.pathname !== '/checkout' ?
                        <CommonMsgModal msg_text={common_Msg} />
                        : ''
                    }

                    <CommonExtensionPopup
                        showExtIframe={this.state.extensionIframe}
                        close_ext_modal={this.close_ext_modal}
                        extHostUrl={this.state.extHostUrl}
                        extPageUrl={this.state.extPageUrl}
                    />
                    <AdjustCreditpopup storecredit={this.state.StoreCredit} customer_Id={Cust_ID} udid={this.state.UDID}
                        closeCreditScorepopup={this.closeCreditScorepopup}
                        UpdateCustomerDetail={this.UpdateCustomerDetail} />
                    <AddCustomersNotepoup customer_Id={Cust_ID} udid={this.state.UDID}
                        closeNotespopup={this.closeNotespopup}
                        UpdateCustomerDetail={this.UpdateCustomerDetail} />
                    <OpeningFloatPopup />
                    <CloseRegisterPopupTwo />
                    <PlanUpgradePopup />
                    <OnBoardingAllModal />
                    <OnboardingShopViewPopup
                        title={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_TITLE}
                        subTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE}
                        subTitle2={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE_TWO}
                        onClickContinue={onBackTOLoginBtnClick}
                        imageSrc={''}
                        btnTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_BUTTON_TITLE}
                        id={'firebaseRegisterAlreadyusedPopup'}
                    />
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { single_cutomer_list, customerlist, customer_Delete, filteredList, customer_save_data,customer_update_data, customer_events, cashSummery } = state;
    return {
        single_cutomer_list: single_cutomer_list.items,
        customerlist: customerlist.items ? customerlist.items : customerlist,
        filteredList: filteredList.items,
        customer_save_data: customer_save_data.items,
        customer_events: customer_events,
        cashSummery: cashSummery,
        customer_Delete: customer_Delete,
        customer_update_data: customer_update_data && customer_update_data.items && customer_update_data.items,
    };
}
const connectedCustomerView = connect(mapStateToProps)(CustomerView);
export { connectedCustomerView as CustomerView };