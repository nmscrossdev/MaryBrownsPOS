import React from 'react';
import { connect } from 'react-redux';
import Language from '../_components/Language';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';
import { BrowserView, MobileView, isBrowser, isMobileOnly, isIOS } from "react-device-detect";
import MobileSimpleHeader from './views/m.SimpleHeader';
import { history} from '../_helpers'
import BarcodeReader from 'react-barcode-reader'
import $ from 'jquery';
class CommonHeader extends React.Component {
    constructor(props) {
        super(props);
        this.handleActivityScan = this.handleActivityScan.bind(this);
    }
    componentDidMount() {
        // const page  = this.props;
        //this.handleActivityScan("Test");
    }

    action() {
        //window.location = '/activity' ;
    }
    // Updated by :Shakuntala Jatav
    // Created Date: 22-07-2019
    // Description : add header for customer view.
    redirectPage(url) {
        // refreshwebManu();
 
         history.push(url)
     }

     handleActivityScan(data) {       
        var scanBarcode = data
        var productlist = [];
        // $("#search-orders").val(data);
        // this.props.applyServerFilter();
        this.props.handleBarcodeData(data);
       // console.log("Product Scan Start with: ",scanBarcode);
    }

    handleError(err) {
        console.error(err)
    }

    render() {
        const { match, windowLocation1, applyfilter } = this.props;
        var _title=match ? match.path == '/activity' ? "Activity View" : match.path == '/customerview' ? "Customer View" : match.path == '/cashdrawer'?"Cash Drawer":"":"";
        if(_title !==""){
            document.title="Oliver POS"+" | "+ _title;
        }
        return (
            (isMobileOnly == true)?
            <MobileSimpleHeader 
                {...this.props} 
                LocalizedLanguage={LocalizedLanguage} 
                windowLocation1={windowLocation1}/>
            :
            <nav className="navbar navbar-default" id="colorFullHeader">
                <BarcodeReader
                    onError={this.handleError}
                    onScan={this.handleActivityScan}/>              
                <div className="col-lg-9 col-sm-8 col-xs-8 p-0">
                    {/* Activity View */}
                    {match && match.path == '/activity' ?
                   
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                <button onClick={() => this.action()} type="button" id="sidebarCollapse" className="navbar-btn active  p-0 text-left">
                                    {/* <i className="icons8-menu icon-css-override fs36 text-white push-top-6"></i> */}
                                    <img alt="Logo" src="../assets/images/menu.svg" />
                                </button>
                            </div>
                            <div className="mobile_menu clearfix">
                                <ul>
                                    <li className="active">
                                        <a  onClick={()=>this.redirectPage("/activity")}>{LocalizedLanguage.activityView}</a>
                                    </li>
                                </ul>
                            </div>
                            {sessionStorage.setItem("ComponentTitle",LocalizedLanguage.activityView)}
                            {/* <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left pointer">
                              
                                    <li className="active"><a href="javascript:void(0);">{LocalizedLanguage.activityView}</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                </ul>
                            </div> */}
                        </div>
                        : null}

                    {/* Customer View */}
                    {match && match.path == '/customerview'  ?
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                <button onClick={() => this.action()} type="button" id="sidebarCollapse" className="navbar-btn active  p-0 text-left">
                                    {/* <i className="icons8-menu icon-css-override fs36 text-white push-top-6"></i> */}
                                    <img alt="Logo" src="../assets/images/menu.svg" />
                                </button>
                            </div>
                            <div className="mobile_menu clearfix">
                                <ul>
                                    <li className="active">
                                        <a  onClick={()=>this.redirectPage("/customerview")}>{LocalizedLanguage.customerView}</a>
                                    </li>
                                </ul>
                            </div>
                                                     
                            {/* onClick={()=>this.redirectPage("/customerview")} */}
                            {/* <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left pointer">
                                
                                    <li className="active"><a href="javascript:void(0);">{LocalizedLanguage.customerView}</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                </ul>
                            </div> */}
                        </div>
                        : null}
                        {match && match.path == '/cashdrawer' ?
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                <button onClick={() => this.action()} type="button" id="sidebarCollapse" className="navbar-btn active  p-0 text-left">
                                    {/* <i className="icons8-menu icon-css-override fs36 text-white push-top-6"></i> */}
                                    <img alt="Logo" src="../assets/images/menu.svg" />
                                </button>
                            </div>
                            <div className="mobile_menu clearfix">
                                <ul>
                                    <li className="active">
                                        <a  onClick={()=>this.redirectPage("/cashdrawer")}>{LocalizedLanguage.cashdrawer}</a>
                                    </li>
                                </ul>
                            </div>
                            {sessionStorage.setItem("ComponentTitle",LocalizedLanguage.cashdrawer)}
                            {/* onClick={()=>this.redirectPage("/cashdrawer")} */}
                            {/* <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left pointer">
                                
                                    <li className="active"><a href="javascript:void(0);">{LocalizedLanguage.cashdrawer}</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                </ul>
                            </div> */}
                        </div>
                        : null}
                    {/* Cash Report */}
                    {match && match.path == '/cash_report' ?
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                <button type="button" id="sidebarCollapse" className="navbar-btn active  p-0 text-left">
                                    {/* <i className="icons8-menu icon-css-override fs36 text-white push-top-6"></i> */}
                                    <img alt="Logo" src="../assets/images/menu.svg" />
                                </button>
                            </div>
                            <div className="mobile_menu clearfix">
                                <ul>
                                    <li className="active">
                                        <a href="/cash_report">{LocalizedLanguage.cashReport}</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left">
                                    <li className="active"><a href="/cash_report">{LocalizedLanguage.cashReport}</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                </ul>
                            </div>
                        </div>
                        : null}
                    {/* General */}
                    {match && match.path == '/setting' ?
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                <button type="button" id="sidebarCollapse" className="navbar-btn active  p-0 text-left">
                                    <i className=""></i>
                                </button>
                            </div>
                            <div className="mobile_menu clearfix">
                                <ul>
                                    <li className="active">
                                        <a href="/setting">{LocalizedLanguage.general}</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left">
                                    <li className="active"><a href="/setting">{LocalizedLanguage.general}</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                </ul>
                            </div>
                        </div>
                        : match && match.path == '/wsetting?shopview' ?
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                
                                {/* <button type="button" id="sidebarCollapse" className="navbar-btn active  p-0 text-left">
                                    <i className=""></i>
                                </button> */}
                                <button type="button" id="sidebarCollapse" class="navbar-btn active p-0 text-left"><img alt="Logo" src="../assets/images/menu.svg"></img></button>
                            </div>
                            {/* <div className="mobile_menu clearfix">
                                <ul>
                                    <li className="active">
                                        <a href="/setting">{LocalizedLanguage.general}</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left">
                                    <li className="active"><a href="/setting">{LocalizedLanguage.general}</a></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                </ul>
                            </div> */}
                        </div>
                        : null}
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    const { sale_to_void_status } = state;
    return {
        sale_to_void_status: sale_to_void_status.items
    };
}
const connectedCommonHeader = connect(mapStateToProps)(CommonHeader);
export { connectedCommonHeader as CommonHeader };