
import { isMobileOnly } from 'react-device-detect'
import { connect } from 'react-redux';
import React from 'react';
import { history } from '../../../_helpers';
import { Markup } from 'interweave';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import $ from 'jquery'
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import { onBackTOLoginBtnClick } from '../../../_components/CommonJS';
import ActiveUser from '../../../settings/ActiveUser'
var JsBarcode = require('jsbarcode');
var print_bar_code;

function textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
        format: "CODE39", displayValue: false, width: 1,
        height: 30,
    });
    print_bar_code = canvas.toDataURL("image/png");
    return print_bar_code;
}

class SelfSaleComplete extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const{ printReceipt, sendMail, baseurl, barcode_image, tempOrderId,handleContinue} = this.props;
        return (
            (isMobileOnly == true)?
            <div className="h-100">
                <div style={{ display: 'none' }}>
                    <img src={baseurl} width="50px" />
                </div>
                <div style={{ display: 'none' }} >
                    <img src={barcode_image} width="50px" />
                </div>
                <div style={{ display: 'none' }} >
                    <img src={textToBase64Barcode(tempOrderId)} />
                </div>
                <div className="sidenav-overlay" data-target="slide-out"></div>
                {/* <div className="appCapsule bg-primary h-100 text-white fz-14 text-center pt-0" style={{paddingBottom: '122px'}}> */}
                <div className="appCapsule bg-primary h-100 text-white fz-14 text-center vh-100" style={{paddingBottom: '122px'}}>
                    <div className="content-center-center h-100 w-75 mx-auto">
                        <div className="page-title mx-auto">
                            <img src="../../assets/img/checked.svg" alt="" className="w-80"/>
                            <h1 className="h1 fz-18">{LocalizedLanguage.completeSale}</h1>
                        </div>
                        <div className="spacer-10"></div>
                            {LocalizedLanguage.msgforreciept}                        
                        <div className="spacer-20"></div>
                        <div className="w-100 overflow-auto scrollbar">
                            <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 btn-uppercase" onClick={sendMail} style={{display:"none"}} >{LocalizedLanguage.email}</button>
                            <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 btn-uppercase" onClick={ printReceipt}>{LocalizedLanguage.print}</button>
                            <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 btn-uppercase"  onClick={() =>handleContinue()}>{LocalizedLanguage.Continue}</button>
                        </div>
                    </div>
                </div>        
                <div className="appBottomMenu h-auto bg-primary shadow-none">
                    <div className="text-white text-center pb-30">
                        {LocalizedLanguage.selfcheckout}<br></br>
                        <small>{LocalizedLanguage.by}</small>
                        <br></br>
                        <img src="../../assets/img/images/logo-light.svg" alt=""/>
                    </div>    
                </div>
            </div>
            :
            <div>
                <div style={{ display: 'none' }}>
                    <img src={baseurl} width="50px" />
                </div>
                <div style={{ display: 'none' }} >
                    <img src={barcode_image} width="50px" />
                </div>
                <div style={{ display: 'none' }} >
                    <img src={textToBase64Barcode(tempOrderId)} />
                </div>
                <div className="portrait">
                    <div className="page-payment">
                        <div className="payment-content">
                            <div className="w-100">
                                <div className="payment-page-title">
                                    <img src="../../assets/img/Checked.svg" className="mx-auto" alt="" />
                                    <h3 className="h4-title text-center text-white font-light">{LocalizedLanguage.completeSale}</h3>
                                    <div className="spacer-40"></div>
                                    <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.completeSale}</h1>
                                </div>
                                <div className="payment-button-group">
                                    <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => sendMail()}  style={{display:"none"}}>{LocalizedLanguage.email}</button>
                                    <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() =>  printReceipt()}>{LocalizedLanguage.print}</button>
                                    <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() =>  handleContinue()}>{LocalizedLanguage.Continue}</button>
                                </div>
                            </div>
                        </div>
                        <div className="payment-footer text-center">
                            <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                            {/* <img src="../../assets/img/logo-2-sm.png" alt="" /> */}
                            <img src="../../assets/img/images/logo-light.svg" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="landscape">
                    <div className="page-payment">
                        <div className="payment-content">
                            <div className="w-100 d-flex">
                                <div className="col-sm-6">
                                    <div className="payment-page-title">
                                        <img src="../../assets/img/Checked.svg" width="190" className="mx-auto" alt=""/>
                                        <h3 className="text-center text-white font-light text---xl">{LocalizedLanguage.completeSale}</h3>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="spacer-40"></div>
                                    <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.msgforreciept}</h1>
                                    <div className="self-checkout-receipt-product">
                                        <div className="payment-button-group pb-0">
                                            <button className="btn btn-default btn-block btn-90 btn-uppercase" style={{display:"none"}}
                                                onClick={() => sendMail()}>{LocalizedLanguage.email}</button>
                                            <button className="btn btn-default btn-block btn-90 btn-uppercase"
                                                onClick={() =>  printReceipt()}>{LocalizedLanguage.print}</button>

                                            <button className="btn btn-default btn-block btn-90 btn-uppercase"
                                                onClick={() =>  handleContinue()}>{LocalizedLanguage.Continue}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="spacer-40"></div>
                        <div className="d-flex align-items-center">
                            <div className="col-sm-6 col-xs-6">
                                <div className="payment-footer text-center p-0">
                                    <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                                    {/* <img src="../../assets/img/logo-2-sm.png" alt=""/> */}
                                    <img src="../../assets/img/images/logo-light.svg" alt=""/>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xs-6">
                            </div>
                        </div>
                    </div>
                </div>
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
    return {
    };
}
var connectedSelfSaleComplete = connect(mapStateToProps)(SelfSaleComplete);
export { connectedSelfSaleComplete as SelfSaleComplete };