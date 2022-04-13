import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../_actions/user.actions';
import { demoShopActions } from '../_actions/demoShop.action';
import { activityActions } from '../ActivityPage/actions/activity.action';
import { customerActions } from '../CustomerPage/actions/customer.action';
import { get_UDid } from '../ALL_localstorage'
import Config from '../Config'
import { setAndroidKeyboard } from "../settings/AndroidIOSConnect";
import Language from '../_components/Language';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import MobileNabvar from './views/m.Navbar';
import { history } from '../_helpers'
import { refreshwebManu } from './CommonFunction'
import $ from "jquery";

class NavbarPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            manager_name: '',
            managerData: localStorage.getItem('user'),
            shop_name: '',
            opemIfram: ''
        }
        var udid = get_UDid('UDID');
        this.props.dispatch(activityActions.getOne(udid, Config.key.ACTIVITY_PAGE_SIZE, 1));
        this.logout = this.logout.bind(this);
        this.supportPopup = this.supportPopup.bind(this);
        this.openRegisterPopup = this.openRegisterPopup.bind(this)
    }

    componentDidMount() {
        // call API to updateDemo Shop in every 5min
        var demoUser = localStorage.getItem('demoUser') || ''
        if (demoUser == 'true') {
            this.demoInterval = setInterval(() => {
                var clientDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : ''
                if (clientDetails != '') {
                    this.props.dispatch(demoShopActions.updateDemoShop(clientDetails.subscription_detail.client_guid));
                } else {
                    clearInterval(this.demoInterval)
                }

            }, Config.key.DEMO_USER_PING_INTERVAL);
        }

        if (!isMobileOnly) {
            refreshwebManu();
        }
        const { managerData } = this.state;
        if (!managerData) {
            this.setState({
                manager_name: "",
                shop_name: "",
            })
        }
        else if (managerData && managerData.display_name !== " " && managerData.display_name !== 'undefined') {
            this.setState({
                manager_name: managerData.display_name,
                shop_name: managerData.shop_name,
            })
        } else {
            this.setState({
                manager_name: managerData.user_email,
                shop_name: managerData.shop_name,
            })
        }

    }

    logout() {
        // if(localStorage.getItem('Cash_Management_ID'))
        // {
        // showModal('ClosingFloat');
        // }else{

        // Call Api to complete demo shop
        var demoUser = localStorage.getItem('demoUser') || ''
        if (demoUser == 'true') {
            var clientDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : ''
            var visitorId = localStorage.getItem('VisiterUserID') || ''
            if (clientDetails != '' && clientDetails.subscription_detail  && visitorId != '' && clientDetails.subscription_detail.client_guid && clientDetails.subscription_detail.client_guid !== undefined) {
                this.props.dispatch(demoShopActions.completeDemoShop(clientDetails.subscription_detail.client_guid, visitorId))
            }
        }
        localStorage.removeItem("CUSTOMER_TO_OrderId")
        localStorage.removeItem('CASH_ROUNDING');

        //Webview Android keyboard setting.................... 
        localStorage.setItem('logoutclick', "true");
        setAndroidKeyboard('logout');
        //--------------------------------------------------------

        this.props.dispatch(userActions.logout())
        //}
    }
    /** 
     *  Updated By:priyanka
     * Created Date:19/6/2019
     * Description:open link in new tab
     */
    supportPopup(url) {
        window.open(url)
    }

    redirectPage(url) {
        // setTimeout(() => {
        //     siderbarInit();
        // }, 500);

        // if(url=='/customerview')
        // {
        sessionStorage.removeItem("CUSTOMER_ID");
        localStorage.removeItem('CHECKLIST');
        // }
        //Remove Selected customer----------------------------
        this.props.dispatch(customerActions.removeSelected());
        //------------------------------------------------------

        if (url == '/customerview') {
            { console.log("Testing Customer view: true"); }
            localStorage.removeItem("CustomerList");
        }
        //history.push(url)
        window.location = url;
    }
    redirectPageWeb(url) {
        window.location = url;
    }

    /** 
     *  Created By: Aman
     * Created Date:20/07/2020
     * Description: For opening the popup
     */
    notInCurrentPlan() {
        showModal('cashmanagementrestrication')
    }

    openRegisterPopup() {
        showModal('OpeningFloat');
        changeOverlay();
    }

    closeRegisterPopup() {
        showModal('ClosingFloat')
    }

    render() {
        const { match, user, popup, viewOrderEvent, onCancelOrderHandler, onEventHandling, SignInPopup } = this.props;
        const { manager_name, shop_name } = this.state;
        var Env = localStorage.getItem('env_type');
        var registerName = localStorage.getItem('registerName');
        var locationName = localStorage.getItem('LocationName');
        var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
        var CashManagementId = localStorage.getItem('Cash_Management_ID') ? localStorage.getItem('Cash_Management_ID') : '';
        var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen");
        var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
        var isDemoUser = localStorage.getItem('demoUser');
        var demoUserName = Config.key.DEMO_USER_NAME;
        return (
            (isMobileOnly == true) ?
                <MobileNabvar
                    {...this.props}
                    {...this.state}
                    registerName={registerName}
                    Env={Env}
                    LocalizedLanguage={LocalizedLanguage}
                    Language={Language}
                    logout={this.logout}
                    supportPopup={this.supportPopup}
                    viewOrderEvent={viewOrderEvent}
                    onCancelOrderHandler={onCancelOrderHandler}
                    onEventHandling={onEventHandling}
                    SignInPopup={SignInPopup} />
                :
                (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && CashManagementId == '' && isDrawerOpen == 'false' && selectedRegister && selectedRegister.EnableCashManagement == true) ?
                    <nav id="sidebar" className="sidebarChanges active cm-menus block___open_register_menu navbarfixed">
                        <div className="cm-body">
                            <div className="cm-body-init-scroll2 overflowscroll center-center">
                                <div className="block___open_register_desc">
                                    <div className="block___open_register__desc ">
                                        <div className="block___open_register__text">
                                            <img src="../../assets/images/logo-light.svg" alt="" />
                                            <div className="text-view">
                                                <h3>{this.state.shop_name ? this.state.shop_name : Language.key.OLIVER_POS}</h3>
                                                <p>{locationName}/{registerName}</p>
                                            </div>
                                            <div className="radio--custom radio--white" onClick={() => this.openRegisterPopup()}>
                                                <input type="radio" value="" />
                                                <label htmlFor="" className="radio--250">Let's Begin</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="block___open_register__link">
                                        <i className="icons8-logout-rounded-left"></i> Log Out
                                    </div> */}
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                        <div className="cm-sec-acc clearfix" onClick={() => this.logout()}>
                            <ul className="list-unstyled ulsidebar mb-0 pl-0 nav-bar">
                                <li>
                                    <a href="javascript:void(0);" className="text-sm">
                                        <span className="txt_menu animated txt_menu_align text-white">
                                            <i className="icons8-logout-rounded-left icon-time-line icon-css-override icon menu-icon float-left"></i>
                                            Log Out
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    :
                    <nav id="sidebar" className={"sidebarChanges active cm-menus" + (client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && CashManagementId == '' && selectedRegister && selectedRegister.EnableCashManagement == true ? "" : " active")} >
                        <div className="cm-switcher clearfix">
                            <div className="cm-user">
                                <h4>
                                    {this.state.shop_name ? this.state.shop_name : Language.key.OLIVER_POS}
                                </h4>
                                <p>{registerName}/{isDemoUser ? demoUserName : user && user.display_name != "" && user.display_name != " " ? user.display_name : user ? user.user_email : ""} </p>
                            </div>
                            {/* <div className="cm-user">
                        {user.display_name}
                        <h4>{user.user_email}</h4>
                            <p>{user.shop_name}</p>
                        </div> */}
                            {/* { client && client.AllowCashManagement==true &&
                        <div className="cm-user-switcher">
                            <div className="flat-toggle cm-flat-toggle on">
                                <span data-open="Open" data-close="Close" ></span>
                                <input value="0" type="hidden" />
                            </div>
                        </div>} */}
                        </div>
                        <div className="cm-body">
                            <div className="cm-body-init-scroll overflowscroll">
                                <ul className="list-unstyled ulsidebar mb-0 pl-0 nav-bar">
                                    <li className={'pt-2 pb-2' + (match && match.path == '/register' || match && match.path == '/shopview' ? ' active ' : null)} >
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/shopview')} className="text-sm">
                                            {/* <span className="strip_icon register"></span> */}
                                            <span className="txt_menu animated txt_menu_align"><i className="icons8-cash-register icon-css-override icon menu-icon float-left"></i>{LocalizedLanguage.register}</span>
                                        </a>
                                    </li>
                                    {/* <li className={match.path == '/customerview' ? "active" : null}><a href="/customerview">Customer View</a></li> */}
                                    <li className={'pt-2 pb-2' + (match && match.path == '/customerview' ? ' active ' : null)}>
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/customerview')} className="text-sm">
                                            {/* <span className="strip_icon activity"></span> */}
                                            <span className="txt_menu animated txt_menu_align"> <i className="icons8-payroll icon-css-override icon menu-icon float-left"></i>{LocalizedLanguage.customerView}</span>
                                        </a>
                                    </li>
                                    <li className={'pt-2 pb-2' + (match && match.path == '/activity' ? ' active ' : null)}>
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/activity')} className="text-sm">
                                            {/* <span className="strip_icon activity"></span> */}
                                            <span className="txt_menu animated txt_menu_align"><i className="icons8-time-machine icon-css-override icon menu-icon float-left"></i>{LocalizedLanguage.activityView}</span>
                                        </a>
                                    </li>
                                    {/* <li className={'pt-2 pb-2' + (match && match.path == '/selfcheckout' ? ' active ' : null)}>
                                    <a href="javascript:void(0);" onClick={() => this.redirectPage('/selfcheckout')}>
                                       
                                        <span className="txt_menu animated txt_menu_align"> <i className="icons8-add-user-male icon-customer-2 icon-css-override icon menu-icon float-left"></i>SlefCheckout</span>
                                    </a>
                                </li> */}
                                    {client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true ?
                                        <li className={'pt-2 pb-2' + (match && match.path == '/cashdrawer' ? ' active ' : null)}>
                                            <a href="javascript:void(0);" onClick={() => this.redirectPage('/cashdrawer')} className="text-sm">
                                                <span className="txt_menu animated txt_menu_align">
                                                    <i className="icons8-deposit-1 icon-css-override icon menu-icon float-left"></i>
                                                    {LocalizedLanguage.cashdrawer}
                                                </span>
                                            </a>
                                        </li>
                                        :
                                        <li className="pt-2 pb-2 menu-disabled">
                                            <a href="javascript:void(0);" className="text-sm" onClick={() => this.notInCurrentPlan()}>
                                                <span className="txt_menu animated txt_menu_align space-between">
                                                    <span className="txt_menu_align">
                                                        <i className="icons8-deposit-1 icon-css-override icon menu-icon float-left"></i>
                                                        {LocalizedLanguage.cashdrawer}
                                                    </span>
                                                    <i className="icons8-lock icon-css-override icon menu-icon float-right mr-0 text-md"></i>
                                                </span>
                                            </a>
                                        </li>
                                    }
                                    {Env && Env !== '' &&
                                        <li className={'pt-2 pb-2' + (match && match.path == '/shopview?goto=setting' ? 'active' : null)}>
                                            {
                                                 (typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true)?
                                                 <a href="/wsetting?shopview" className="text-sm">
                                                <span className="txt_menu animated txt_menu_align"><i className="icons8-gear icon-setting icon-css-override icon menu-icon float-left"></i>{LocalizedLanguage.settings}</span>
                                                </a>
                                                :<a href="/shopview?goto=setting" className="text-sm">
                                                    <span className="txt_menu animated txt_menu_align"><i className="icons8-gear icon-setting icon-css-override icon menu-icon float-left"></i>{LocalizedLanguage.settings}</span>
                                                </a>
                                            }
                                            
                                        </li>

                                    }
                                    {/* <li className={'pt-2 pb-2' + (match.path=='/cash_report'?' active ': null )}>
                                <a href="/cash_report">
                                    <span className="strip_icon cashdrable"></span>
                                    <span className="txt_menu animated">Cash Drawer</span>
                                </a>
                            </li> */}
                                    {/* <li className={'pt-2 pb-2' + (match.path=='/setting'?' active ': null )}>
                                <a href="/setting">
                                    <span className="strip_icon setting"></span>
                                    <span className="txt_menu animated">Settings</span>
                                </a>
                            </li> */}
                                </ul>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                        <div className="cm-sec-acc clearfix cm-footer">
                            <ul className="list-unstyled ulsidebar mb-0 pl-0 nav-bar">
                                {client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true ?
                                    <li className="pt-2 pb-2" onClick={() => this.closeRegisterPopup()}>
                                        <a href="javascript:void(0);" className="text-sm">
                                            <span className="txt_menu animated txt_menu_align">
                                                <i className="icons8-close-pane icon-css-override icon menu-icon float-left"></i>
                                                {LocalizedLanguage.closeRegister}
                                            </span>
                                        </a>
                                    </li>
                                    :
                                    <li className="pt-2 pb-2" >
                                    </li>}
                                <li className="pt-2 pb-2" onClick={() => this.logout()}>
                                    <a href="javascript:void(0)" className="text-sm">
                                        <span className="txt_menu animated txt_menu_align">
                                            <i className="icons8-logout-rounded-left icon-css-override icon menu-icon float-left"></i>
                                            {LocalizedLanguage.logout}
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* <div className="cm-sec-acc clearfix">
                        <div className="cm-sec-accTop">
                            <ul className="list-unstyled ulsidebar mb-0 pl-0">
                                <li className='w-50' onClick={() => this.supportPopup('http://help.oliverpos.com/')}>
                                    <a href="javascript:void(0)" className="text-sm">
                                        <span className="txt_menu animated line-height-26" ><i className="icon icon-support icon-css-override menu-icon-center"></i>
                                            {LocalizedLanguage.support}</span>
                                    </a>
                                </li>
                                <li className='w-50' onClick={() => this.logout()}>
                                    <a href="javascript:void(0)" className="text-sm">
                                        <span className="txt_menu animated line-height-26">
                                            <i className="icons8-logout-rounded-left icon icon-logout-open icon-css-override menu-icon-center"></i>
                                            {LocalizedLanguage.logout}</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div> */}

                        {/* <span className="strip_icon support"></span> */}
                        {/* <span className="strip_icon logout"></span> */}
                        {/* <li className="">
                        <a href="/login">
                        <span className="strip_icon wp_panel"></span>
                        <span className="txt_menu animated">WP Panel</span>
                        </a>
                    </li> */}
                        {/*   <div className="cm-sec-accBottom clearfix">
                        <div className="secmk secmka">
                            <button className="swipclock">
                                MK
                            </button>
                            <div className="simply-countdown-one"></div>
                        </div> 
                    </div>*/}
                        {/* {this.state.opemIfram == true? */}
                        {/* <div>
                <iframe id="forPostyouradd" data-src="http://www.w3schools.com" src="about:blank"  style={{backgroundColor:'#ffffff',width:'500', height:'500'}} allowFullScreen></iframe>    
            </div>  */}
                        {/* :""} */}
                    </nav>
        )
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        user: authentication.user,
    };
}
const connectedNavbarPage = connect(mapStateToProps)(NavbarPage);
export { connectedNavbarPage as NavbarPage };