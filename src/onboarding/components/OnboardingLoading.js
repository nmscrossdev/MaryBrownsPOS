import React from 'react';
import { connect } from 'react-redux';
import { checkoutActions } from '../../CheckoutPage';
import { chunkArray } from '../../ALL_localstorage';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { checkShopSTatusAction, discountActions, attributesActions, cartProductActions,categoriesActions } from '../../_actions';
import { favouriteListActions } from '../../ShopView';
import { get_UDid } from '../../ALL_localstorage';
import { getBrowserVersionAndName, getWebAppVersion } from '../../settings/GetAPIBrowserVersion';
import { BrowserVersionModal } from "../../App/BrowserVersionModal";
import { OliverVersionModal } from "../../App/OliverVersionModal";
import compareVersions from 'compare-versions';
import { GTM_ClientDetail } from '../../_components/CommonfunctionGTM';
import { registerActions } from '../../LoginRegisterPage/actions/register.action';
import { cashManagementAction } from "../../CashManagementPage/actions/cashManagement.action";
import { history } from '../../_helpers';
import LoaderOnboarding from './LoaderOnboarding'
import moment from 'moment';

class OnboardingLoading extends React.Component {
    constructor(props) {
        super(props);
    localStorage.setItem("ReloadCount", 0);
    localStorage.setItem("SelfCheckout", true);
    localStorage.removeItem('UPDATE_PRODUCT_LIST')
    localStorage.removeItem('SELECTED_TAX');
    localStorage.removeItem('TAXT_RATE_LIST');
    
   
    /*Created By :Priyanka Created Date :4-07-2019,Description :userList function  get staff user list. */
    const UID = get_UDid('UDID');
    if (sessionStorage.getItem("AUTH_KEY")) {
       // this.props.dispatch(checkShopSTatusAction.getProductCount());
       this.props.dispatch(attributesActions.getAll());
       this.props.dispatch(categoriesActions.getAll())
        this.props.dispatch(checkShopSTatusAction.getStatus());
        this.props.dispatch(favouriteListActions.userList());
        this.props.dispatch(favouriteListActions.get_TickeraSetting());
        this.props.dispatch(checkoutActions.cashRounding());
        this.props.dispatch(checkoutActions.getOrderReceipt());
        this.props.dispatch(discountActions.getAll());
       
       // this.props.dispatch(pinLoginActions.getBlockerInfo())
        this.props.dispatch(cartProductActions.getTaxRateList());
        const register_Id = localStorage.getItem('register');
        if(register_Id && register_Id !==null){
             this.props.dispatch(registerActions.GetRegisterPermission(register_Id));
        }       
        if (UID && register_Id) {
            this.props.dispatch(favouriteListActions.getAll(UID, register_Id));
            var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
            var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';

            //Remove Temp order notificataion------------------  
            var user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '';                 
            if(user && user.user_email){             
                var temp_Order = 'TempOrders_' + (user.user_email);
                localStorage.removeItem(temp_Order);
            }
        }
            //-----------------------------------------------

            // if (client && client.AllowCashManagement == true && selectedRegister && selectedRegister.EnableCashManagement == true) {
            //     this.props.dispatch(cashManagementAction.GetOpenRegister(register_Id));
            // }
            // else {
            //     localStorage.setItem("IsCashDrawerOpen", "false");
            // }

            var d = new Date();
        var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');
        var getLocalTimeZoneOffsetValue = d.getTimezoneOffset();
        var localTimeZoneType = moment.tz.guess(true);
        var user = JSON.parse(localStorage.getItem("user"));
        var registerName = (localStorage.getItem("registerName"));
        var last_login_register_id = (localStorage.getItem("register"));
        var LocationName = (localStorage.getItem("LocationName"));
        var last_login_Location_id = (localStorage.getItem("Location"));
        var open_register_param = {
            "RegisterId": last_login_register_id,
            "RegisterName": registerName,
            "LocationId": last_login_Location_id,
            "LocationName": LocationName,
            "LocalDateTime": dateStringWithTime,
            "LocalTimeZoneType": localTimeZoneType,
            "SalePersonId": user && user.user_id ? user.user_id : '',
            "SalePersonName": user && user.display_name ? user.display_name : '',
            "SalePersonEmail": user && user.user_email ? user.user_email : '',
            "ActualOpeningBalance": 0,
            "OpeningNote": '',
            "LocalTimeZoneOffsetValue": getLocalTimeZoneOffsetValue
        }
        this.props.dispatch(cashManagementAction.openRegister(open_register_param));
    }
    setTimeout(() => {
        history.push('/')
    }, 1500);
}

    render() {
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        return (
            <LoaderOnboarding  isDemoUser={isDemoUser}/>
        )
    }
}
function mapStateToProps(state) {
    const { alert, getversioninfo } = state;
    return {
        alert: alert.message,
        };
}
const connectedOnboardingLoading = connect(mapStateToProps)(OnboardingLoading);
export { connectedOnboardingLoading as OnboardingLoading };
