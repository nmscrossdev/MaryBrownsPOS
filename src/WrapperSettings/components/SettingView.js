import React from 'react';
import { connect } from 'react-redux';
import { NavbarPage, CommonHeader } from '../../_components';
import {  PrinterSetting, FFDisplaySettings, SettingSideList,CashDSettings,GeneralSetting } from '../';
import MobileSettingView from '../views/MobileSettingView';
import MobilePrinterSetting from '../views/MobilePrinterSetting';

// import Footer from '../../_components/views/m.Footer';
import { isMobileOnly, isIOS } from "react-device-detect";
// import {removeActiveCss,showSelected} from '../CommonWork';
// import LocalizedLanguage from '../../settings/LocalizedLanguage';

class SettingView_Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isPrinterSettingOn:false
        }
        localStorage.setItem('showPrinterSetting','false');
    }
  
    showPrinterSetting=()=>
    {
        this.setState({isPrinterSettingOn:true});
        localStorage.setItem('showPrinterSetting','true');
    }
    hidePrinterSetting=()=>
    {
        this.setState({isPrinterSettingOn:false});
        localStorage.setItem('showPrinterSetting','false');
    }
    render() {
        return (
            isMobileOnly == true?
            this.state.isPrinterSettingOn==false?
            <MobileSettingView {...this.props} CommonHeader={CommonHeader} NavbarPage={NavbarPage} showPrinterSetting={this.showPrinterSetting}/>
                :
                <MobilePrinterSetting {...this.props} CommonHeader={CommonHeader} NavbarPage={NavbarPage} hidePrinterSetting={this.hidePrinterSetting}/>
            :
            <div className="wrapper">
                {localStorage.getItem('register')?<div className="overlay"></div>:null }
                {localStorage.getItem('register')?<NavbarPage {...this.props} />:null }
                
                <div id="content" className="general-settings">
                    <CommonHeader {...this.props} />
                    <div className="inner_content bg-light-white clearfix">
                        <div className="content_wrapper">
                            <SettingSideList {...this.props} />
                            <div className="col-xs-7 col-sm-9 mt-4">
                                <div className="tab-content">
                                    <GeneralSetting  {...this.props} />
                                    <PrinterSetting  {...this.props} />
                                    <FFDisplaySettings {...this.props} />
                                    <CashDSettings {...this.props} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const connectedSettingView = connect(mapStateToProps)(SettingView_Wrapper);
export { connectedSettingView as SettingView_Wrapper };