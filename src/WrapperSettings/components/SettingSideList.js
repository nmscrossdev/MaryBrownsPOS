import React from 'react';
import { connect } from 'react-redux';
// import { userActions } from '../../_actions/user.actions';
// import { demoShopActions } from '../../_actions/demoShop.action';
// import { setAndroidKeyboard } from "../../settings/AndroidIOSConnect";
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { history } from '../../_helpers';
class SettingSideList extends React.Component {
    logout() {
        // if(localStorage.getItem('Cash_Management_ID'))
        // {
        // showModal('ClosingFloat');
        // }else{

        // Call Api to complete demo shop
        // var demoUser = localStorage.getItem('demoUser') || ''
        // if (demoUser == 'true') {
        //     var clientDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : ''
        //     var visitorId = localStorage.getItem('VisiterUserID') || ''
        //     if (clientDetails != '' && clientDetails.subscription_detail  && visitorId != '' && clientDetails.subscription_detail.client_guid && clientDetails.subscription_detail.client_guid !== undefined) {
        //         this.props.dispatch(demoShopActions.completeDemoShop(clientDetails.subscription_detail.client_guid, visitorId))
        //     }
        // }
        // localStorage.removeItem("CUSTOMER_TO_OrderId")
        // localStorage.removeItem('CASH_ROUNDING');

        // //Webview Android keyboard setting.................... 
        // localStorage.setItem('logoutclick', "true");
        // setAndroidKeyboard('logout');
        // //--------------------------------------------------------

        // this.props.dispatch(userActions.logout())


        if ((typeof Android !== "undefined" && Android !== null) && (Android.getDatafromDevice("isWrapper")==true))
        {
            Android.wrapperLogout();
        }
        // var env = localStorage.getItem('env_type');
        // var url = env && (env == 'ios' || env == 'android' || env == 'Android') ? "/login" : "/login";
        //     if (env && (env == 'ios' || env == 'android' || env == 'Android')) {
        //         url = url + "?goto=logout";
        //         window.location = url;
        //     }
        else
        {
            history.push('/login');
        }
        //}
    }
    launch_oliver()
    {
        var urlParam = this.props.location.search;
        if(urlParam && typeof urlParam!="undefined")
        {
            var splParam = urlParam.replace("?", "");
            console.log("----urlParam---"+splParam)
            history.push(splParam);
        }
    }
    render() {
        return (
            <div className="col-xs-5 col-sm-3 p-0">
                <div className="items">
                    <div className="panel panel-default panel-product-list p-0 bor-customer">
                        <div className="overflowscroll window-header-search-printer">
                        <ul className="nav nav-pills nav-stacked general-setting-tabs">
                                <li className="active"><a data-toggle="tab" href="#general-setting" aria-expanded="false">General Settings</a></li>
                                <li><a data-toggle="tab" href="#printer-setting" aria-expanded="true" >Printer Settings</a></li>
                                <li><a data-toggle="tab" href="#ff-display-settings" aria-expanded="true" >Front Facing Display</a></li>
                                <li><a data-toggle="tab" href="#cdrawer-setting" aria-expanded="false" >{LocalizedLanguage.cashdrawer}</a></li>
                            </ul>
                        </div>
                        <div className="searchDiv relDiv border-bottom">
                           <button className="btn btn-block btn-primary total_checkout" style={{ height: '100%',paddingLeft:15 }} onClick={() => this.launch_oliver()}>
                                Continue
                            </button>
                        </div>
                        <div className="searchDiv relDiv">
                            <button className="btn btn-block btn-primary total_checkout" style={{ height: '100%',paddingLeft:15 }} onClick={() => this.logout()}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
     return {};
}
const connectedSettingSideList = connect(mapStateToProps)(SettingSideList);
export { connectedSettingSideList as SettingSideList };
