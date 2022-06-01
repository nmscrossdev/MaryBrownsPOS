import React from 'react';
import { connect } from 'react-redux';
import { checkShopSTatusAction,cartProductActions,taxRateAction } from '../../_actions';
import WebSiteLinkView from '../views/wSiteLink';
import MobileSiteLinkView from '../views/mSiteLink';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import $ from 'jquery';
import {trackPage} from '../../_components/SegmentAnalytic'
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { selfCheckoutActions } from '../../SelfCheckout/actions/selfCheckout.action';
class SiteLinkView extends React.Component {
    constructor(props) {
        super(props);
        if (!localStorage.getItem("shopstatus") && localStorage.getItem('UDID')) {
            this.props.dispatch(checkShopSTatusAction.getStatus());
        }
        if (sessionStorage.getItem("AUTH_KEY")) {
            this.props.dispatch(checkShopSTatusAction.getProductCount());
            this.props.dispatch(selfCheckoutActions.get_selfcheckout_setting());
            this.props.dispatch(cartProductActions.getTaxRateList());
            this.props.dispatch(taxRateAction.getGetRates());
            this.props.dispatch(taxRateAction.getIsMultipleTaxSupport());
        }
    }

    componentWillMount() {
        this.autoFocusIs();
        var test=LocalizedLanguage.LocalizedLanguage; // just used for language refresh
       
    }
componentDidMount(){
    trackPage(window.location.pathname,"Sites","site_link","site_link");
    var lang = localStorage.getItem('LANG') ? localStorage.getItem('LANG').toString() : 'en';
    var currentLanguage =LocalizedLanguage.getLanguage();
    console.log("currentlanguage",currentLanguage ," local" ,lang )
    if(lang !==currentLanguage){
          window.location.reload() // to set language need refresh page
    }
  
}
    autoFocusIs() {
        setTimeout(function () {
            $('#siteLinkTab0').focus();
        }, 300);
    }

    render() {
        return (
            (isMobileOnly == true) ?
                // <MobileSiteLinkView autoFocusIs={this.autoFocusIs} />
                <WebSiteLinkView autoFocusIs={this.autoFocusIs} />
                :
                <WebSiteLinkView autoFocusIs={this.autoFocusIs} />
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        sitelist: authentication.sitelist
    };
}
const connectedSiteLinkView = connect(mapStateToProps)(SiteLinkView);
export { connectedSiteLinkView as SiteLinkView };