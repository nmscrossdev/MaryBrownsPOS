import { isMobileOnly } from 'react-device-detect'
import { connect } from 'react-redux';
import React from 'react';
import { history } from '../../../_helpers';
import { Markup } from 'interweave';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import $ from 'jquery'
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import { onBackTOLoginBtnClick,getHostURLsBySelectedExt } from '../../../_components/CommonJS';
import ActiveUser from '../../../settings/ActiveUser'
import {SendMailComponent} from './SendMailComponent'
import { cartProductActions } from '../../../_actions'
import {_key,setThemeColor,getCustomLogo,getApps,centerView} from '../../../settings/SelfCheckoutSettings';
import BottomApps from '../../../SelfCheckout/components/BottomApps';
import { CommonExtensionPopup } from '../../../_components/CommonExtensionPopup';
import Config from '../../../Config';
import ScreenSaver from '../../../SelfCheckout/components/ScreenSaver';
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
        this.state = {
            emailSend: false,
            extensionIframe: false,
            extHostUrl:'',
            extPageUrl:'',
            extName:'',
            extLogo:''
        }
        this.sendMail = this.sendMail.bind(this);
        this.clear = this.clear.bind(this);
        setThemeColor();
    }
    // get extension pageUrl and hostUrl of current clicked extension
    showExtensionIframe = (ext_id) => { 
        // get host and page url from common fucnction   
        var data = getHostURLsBySelectedExt(ext_id)
        this.setState({
            extHostUrl: data ? data.ext_host_url : '',
            extPageUrl: data ? data.ext_page_url : '',
            extName: data ? data.ext_name : '',
            extLogo: data ? data.ext_logo : ''
        })
        this.setState({ extensionIframe: true })
        setTimeout(() => {
            showModal('common_ext_popup')
        }, 500);
    }
    close_ext_modal = () => {
        this.setState({ extensionIframe: false });
        hideModal('common_ext_popup');
    }
    sendMail(isBack=false) {
        if(isBack==true)
        {
            this.setState({emailSend:false})
        }
        else
        {
            this.setState({emailSend:true})
        }
       
    }
    clear() {
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem('GTM_ORDER');        
        const { dispatch } = this.props;
        localStorage.removeItem('ORDER_ID');
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem("CART");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem('PRODUCTX_DATA');
        localStorage.removeItem('PAYCONIQ_PAYMENT_RESPONSE');
        localStorage.removeItem('ONLINE_PAYMENT_RESPONSE');
        localStorage.removeItem('STRIPE_PAYMENT_RESPONSE');
        localStorage.removeItem('GLOBAL_PAYMENT_RESPONSE');
        localStorage.removeItem('PAYMENT_RESPONSE');
        localStorage.removeItem('PENDING_PAYMENTS');
        localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
        dispatch(cartProductActions.addtoCartProduct(null));
        history.push('/SelfCheckoutView')
        // window.location='/SelfCheckoutView';
    }
    render() {
        const { printReceipt, yur4, baseurl, barcode_image, orderId, tempOrderId, handleContinue } = this.props;
        var custom_logo=getCustomLogo();
        var apps=getApps(_key.RECEIPT_PAGE);
        return (
            // (isMobileOnly == true) ?
            //     <div className="h-100">
            //         <div style={{ display: 'none' }}>
            //             <img src={baseurl} width="50px" />
            //         </div>
            //         <div style={{ display: 'none' }} >
            //             <img src={barcode_image} width="50px" />
            //         </div>
            //         <div style={{ display: 'none' }} >
            //             <img src={textToBase64Barcode(tempOrderId)} />
            //         </div>
            //         <div className="sidenav-overlay" data-target="slide-out"></div>
            //         {/* <div className="appCapsule bg-primary h-100 text-white fz-14 text-center pt-0" style={{paddingBottom: '122px'}}> */}
            //         <div className="appCapsule bg-primary h-100 text-white fz-14 text-center vh-100" style={{ paddingBottom: '122px' }}>
            //             <div className="content-center-center h-100 w-75 mx-auto">
            //                 <div className="page-title mx-auto">
            //                     <img src="../../assets/img/checked.svg" alt="" className="w-80" />
            //                     <h1 className="h1 fz-18">{LocalizedLanguage.completeSale}</h1>
            //                 </div>
            //                 <div className="spacer-10"></div>
            //                 {LocalizedLanguage.msgforreciept}
            //                 <div className="spacer-20"></div>
            //                 <div className="w-100 overflow-auto scrollbar">
            //                     <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 btn-uppercase" onClick={()=>this.sendMail()} style={{ display: "none" }} >{LocalizedLanguage.email}</button>
            //                     <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 btn-uppercase" onClick={printReceipt}>{LocalizedLanguage.print}</button>
            //                     <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 btn-uppercase" onClick={() => handleContinue()}>{LocalizedLanguage.Continue}</button>
            //                 </div>
            //             </div>
            //         </div>
            //         <div className="appBottomMenu h-auto bg-primary shadow-none">
            //             <div className="text-white text-center pb-30">
            //                 {LocalizedLanguage.selfcheckout}<br></br>
            //                 <small>{LocalizedLanguage.by}</small>
            //                 <br></br>
            //                 <img src="../../assets/img/images/logo-light.svg" alt="" />
            //             </div>
            //         </div>
            //     </div>
            //     :
                this.state.emailSend == true  ? <SendMailComponent
                                                {...this.props}
                                                {...this.state}
                                                goBack={this.sendMail}
                                                orderId={this.props.orderId}
                                                tempOrderId={this.props.tempOrderId}
                /> : 
                // <div>
                //     <div style={{ display: 'none' }}>
                //         <img src={baseurl} width="50px" />
                //     </div>
                //     <div style={{ display: 'none' }} >
                //         <img src={barcode_image} width="50px" />
                //     </div>
                //     <div style={{ display: 'none' }} >
                //         <img src={textToBase64Barcode(tempOrderId)} />
                //     </div>
                //     <div className="portrait">
                //         <div className="page-payment">
                //             <div className="payment-content">
                //                 <div className="w-100">
                //                     <div className="payment-page-title">
                //                         <img src="../../assets/img/Checked.svg" className="mx-auto" alt="" />
                //                         <h3 className="h4-title text-center text-white font-light">{LocalizedLanguage.completeSale}</h3>
                //                         <div className="spacer-40"></div>
                //                         <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.completeSale}</h1>
                //                     </div>
                //                     <div className="payment-button-group">
                //                         <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => sendMail()}  style={{display:"none"}}>{LocalizedLanguage.email}</button>
                //                         <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() =>  printReceipt()}>{LocalizedLanguage.print}</button>
                //                         <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() =>  handleContinue()}>{LocalizedLanguage.Continue}</button>
                //                     </div>
                //                 </div>
                //             </div>
                //             <div className="payment-footer text-center">
                //                 <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                //                 {/* <img src="../../assets/img/logo-2-sm.png" alt="" /> */}
                //                 <img src="../../assets/img/images/logo-light.svg" alt=""/>
                //             </div>
                //         </div>
                //     </div>
                //     <div className="landscape">
                //         <div className="page-payment">
                //             <div className="payment-content">
                //                 <div className="w-100 d-flex">
                //                     <div className="col-sm-6">
                //                         <div className="payment-page-title">
                //                             <img src="../../assets/img/Checked.svg" width="190" className="mx-auto" alt=""/>
                //                             <h3 className="text-center text-white font-light text---xl">{LocalizedLanguage.completeSale}</h3>
                //                         </div>
                //                     </div>
                //                     <div className="col-sm-6">
                //                         <div className="spacer-40"></div>
                //                         <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.msgforreciept}</h1>
                //                         <div className="self-checkout-receipt-product">
                //                             <div className="payment-button-group pb-0">
                //                                 <button className="btn btn-default btn-block btn-90 btn-uppercase" style={{display:"none"}}
                //                                     onClick={() => sendMail()}>{LocalizedLanguage.email}</button>
                //                                 <button className="btn btn-default btn-block btn-90 btn-uppercase"
                //                                     onClick={() =>  printReceipt()}>{LocalizedLanguage.print}</button>

                //                                 <button className="btn btn-default btn-block btn-90 btn-uppercase"
                //                                     onClick={() =>  handleContinue()}>{LocalizedLanguage.Continue}</button>
                //                             </div>
                //                         </div>
                //                     </div>
                //                 </div>
                //             </div>
                //             <div className="spacer-40"></div>
                //             <div className="d-flex align-items-center">
                //                 <div className="col-sm-6 col-xs-6">
                //                     <div className="payment-footer text-center p-0">
                //                         <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                //                         {/* <img src="../../assets/img/logo-2-sm.png" alt=""/> */}
                //                         <img src="../../assets/img/images/logo-light.svg" alt=""/>
                //                     </div>
                //                 </div>
                //                 <div className="col-sm-6 col-xs-6">
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                
                // </div>
                <div className="payment-view complete-payment">
                <div className="wrapper">
                {custom_logo?<img src={Config.key.RECIEPT_IMAGE_DOMAIN+custom_logo.Value} alt="" />:""}
                    {/* <img src="../assets/image/mblogobig.png" alt="" /> */}
                    <svg width={118} height={120} viewBox="0 0 118 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M114.782 59.7733C114.782 91.331 89.7651 116.82 59.0197 116.82C28.2744 116.82 3.25781 91.331 3.25781 59.7733C3.25781 28.2156 28.2744 2.72656 59.0197 2.72656C89.7651 2.72656 114.782 28.2156 114.782 59.7733Z" fill="var(--secondary)" fillOpacity="0.1" stroke="var(--primary)" strokeWidth={5} />
                        <path d="M29.8887 64.0422L52.0582 86.7006L89.0074 41.3839" stroke="var(--primary)" strokeWidth="8.625" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="style1">Your order is complete!</p>
                    <p className="style2">Your order number is</p>
                    <p className="style3">{tempOrderId ? tempOrderId.substr(-4) : ""}</p>
                    <p className="style4">How would you like to receive your reciept?</p>
                    <button onClick={() => printReceipt()} id="printButton">{LocalizedLanguage.print}</button>
                    <button onClick={() => this.sendMail()} id="emailButton">{LocalizedLanguage.email}</button>
                    <button className='style2' onClick={() => this.clear()} id="noReceiptButton">No Receipt</button>
                    {/* <button onClick={() => handleContinue()}>{LocalizedLanguage.Continue}</button> */}
                   {apps && apps.length>0?
                    <BottomApps apps={apps}  showExtensionIframe={this.showExtensionIframe}></BottomApps>
                    :null}
                    {
                this.state.extensionIframe==true?
                <CommonExtensionPopup
                            showExtIframe={this.state.extensionIframe}
                            close_ext_modal={this.close_ext_modal}
                            extHostUrl={this.state.extHostUrl}
                            extPageUrl={this.state.extPageUrl}
                            extName={this.state.extName}
                            extLogo={this.state.extLogo}
                        />:null}
                    {/* <div className="row">
                        <button className="icon">
                            <svg width={29} height={29} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M26.1 0H2.9C1.305 0 0 1.305 0 2.9V29L5.8 23.2H26.1C27.695 23.2 29 21.895 29 20.3V2.9C29 1.305 27.695 0 26.1 0ZM26.1 20.3H5.8L2.9 23.2V2.9H26.1V20.3ZM7.25 10.15H10.15V13.05H7.25V10.15ZM13.05 10.15H15.95V13.05H13.05V10.15ZM18.85 10.15H21.75V13.05H18.85V10.15Z" fill="white" />
                            </svg>
                            <p>SMS</p>
                        </button>
                        <button className="icon">
                            <svg width={32} height={31} viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.8134 18.9441C14.7554 18.9441 15.6589 19.3183 16.325 19.9844C16.9912 20.6506 17.3654 21.554 17.3654 22.4961V24.8673L17.3528 25.0378C16.8634 28.3956 13.8481 30.009 8.78847 30.009C3.74777 30.009 0.683565 28.4145 0.0221013 25.0962L0 24.8641V22.4961C0 21.554 0.374229 20.6506 1.04036 19.9844C1.70649 19.3183 2.60996 18.9441 3.55201 18.9441H13.8134ZM13.8134 21.3121H3.55201C3.238 21.3121 2.93684 21.4368 2.7148 21.6589C2.49275 21.8809 2.36801 22.1821 2.36801 22.4961V24.7378C2.81004 26.6322 4.81495 27.641 8.78847 27.641C12.7604 27.641 14.6769 26.6448 14.9974 24.7741V22.4961C14.9974 22.1821 14.8727 21.8809 14.6506 21.6589C14.4286 21.4368 14.1274 21.3121 13.8134 21.3121ZM8.6827 6.31469C9.4083 6.31469 10.1268 6.45761 10.7972 6.73529C11.4675 7.01296 12.0766 7.41996 12.5897 7.93303C13.1028 8.44611 13.5098 9.05522 13.7875 9.72559C14.0651 10.396 14.2081 11.1144 14.2081 11.84C14.2081 12.5656 14.0651 13.2841 13.7875 13.9545C13.5098 14.6249 13.1028 15.234 12.5897 15.7471C12.0766 16.2601 11.4675 16.6671 10.7972 16.9448C10.1268 17.2225 9.4083 17.3654 8.6827 17.3654C7.21729 17.3654 5.81189 16.7833 4.77569 15.7471C3.73948 14.7109 3.15735 13.3055 3.15735 11.84C3.15735 10.3746 3.73948 8.96924 4.77569 7.93303C5.81189 6.89683 7.21729 6.31469 8.6827 6.31469ZM28.0215 0C28.9635 0 29.867 0.374229 30.5331 1.04036C31.1992 1.70649 31.5735 2.60996 31.5735 3.55201V9.07737C31.5735 9.54383 31.4816 10.0057 31.3031 10.4367C31.1246 10.8676 30.8629 11.2592 30.5331 11.589C30.2033 11.9189 29.8117 12.1805 29.3807 12.359C28.9498 12.5375 28.4879 12.6294 28.0215 12.6294H25.7245L22.3051 16.0093C22.0283 16.2831 21.6768 16.4688 21.2947 16.5432C20.9126 16.6177 20.517 16.5774 20.1578 16.4276C19.7985 16.2777 19.4916 16.025 19.2756 15.7011C19.0597 15.3772 18.9443 14.9967 18.9441 14.6075V12.6073C18.0758 12.5102 17.2737 12.0965 16.6913 11.4453C16.1088 10.7941 15.7868 9.95107 15.7867 9.07737V3.55201C15.7867 2.60996 16.161 1.70649 16.8271 1.04036C17.4932 0.374229 18.3967 0 19.3387 0H28.0215ZM8.6827 8.6827C7.84532 8.6827 7.04224 9.01535 6.45012 9.60747C5.858 10.1996 5.52536 11.0027 5.52536 11.84C5.52536 12.6774 5.858 13.4805 6.45012 14.0726C7.04224 14.6647 7.84532 14.9974 8.6827 14.9974C9.52008 14.9974 10.3232 14.6647 10.9153 14.0726C11.5074 13.4805 11.84 12.6774 11.84 11.84C11.84 11.0027 11.5074 10.1996 10.9153 9.60747C10.3232 9.01535 9.52008 8.6827 8.6827 8.6827ZM28.0215 2.36801H19.3387C19.0247 2.36801 18.7236 2.49275 18.5015 2.7148C18.2795 2.93684 18.1547 3.238 18.1547 3.55201V9.07737C18.1547 9.73094 18.6852 10.2614 19.3387 10.2614H21.3105V13.6618L24.7536 10.2614H28.023C28.337 10.2614 28.6382 10.1366 28.8602 9.91459C29.0823 9.69254 29.207 9.39139 29.207 9.07737V3.55201C29.207 3.238 29.0823 2.93684 28.8602 2.7148C28.6382 2.49275 28.337 2.36801 28.023 2.36801H28.0215Z" fill="white" />
                            </svg>
                            <p>Feedback</p>
                        </button>
                        <button className="icon">
                            <svg width={30} height={28} viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.94737 16.2091L16.2105 16.2105C16.9541 16.2103 17.6703 16.4911 18.2155 16.9967C18.7608 17.5023 19.0948 18.1954 19.1505 18.9368L19.1579 19.1579V21.3684C19.1564 26.5263 13.6817 28 9.57895 28C5.56758 28 0.243158 26.5912 0.00736859 21.7074L0 21.3684V19.1564C0 17.6032 1.20253 16.3299 2.72632 16.2164L2.94737 16.2105V16.2091ZM19.4821 16.2105H26.5263C27.2696 16.2107 27.9855 16.4917 28.5304 16.9972C29.0753 17.5028 29.4091 18.1956 29.4648 18.9368L29.4737 19.1579V20.6316C29.4722 25.144 25.2619 26.5263 22.1053 26.5263C21.0361 26.5288 19.9727 26.3688 18.9516 26.0518C19.4467 25.4829 19.8461 24.8331 20.1335 24.0962C20.7808 24.2409 21.442 24.3145 22.1053 24.3158L22.4987 24.3069C23.9503 24.2436 27.0465 23.772 27.2528 20.9337L27.2632 20.6316V19.1579C27.2629 18.9855 27.2024 18.8186 27.092 18.6862C26.9817 18.5538 26.8285 18.4642 26.6589 18.4328L26.5263 18.4211H20.5564C20.4346 17.6996 20.133 17.0205 19.6796 16.4463L19.4821 16.2105ZM2.94737 18.4196L2.8 18.4343C2.65856 18.4638 2.5286 18.5333 2.42568 18.6347C2.32426 18.737 2.25465 18.8665 2.22526 19.0076L2.21053 19.1564V21.3684C2.21053 22.8554 2.87368 23.9061 4.29874 24.6724C5.516 25.3282 7.25053 25.7246 9.11179 25.7821L9.57895 25.7895L10.0461 25.7821C11.9074 25.7246 13.6404 25.3282 14.8592 24.6724C16.1943 23.9533 16.8619 22.9851 16.94 21.6411L16.9474 21.3669V19.1579C16.9471 18.9855 16.8866 18.8186 16.7762 18.6862C16.6659 18.5538 16.5127 18.4642 16.3432 18.4328L16.2105 18.4211L2.94737 18.4196ZM9.57895 0C11.3378 0 13.0245 0.698682 14.2682 1.94234C15.5118 3.18601 16.2105 4.87278 16.2105 6.63158C16.2105 8.39038 15.5118 10.0772 14.2682 11.3208C13.0245 12.5645 11.3378 13.2632 9.57895 13.2632C7.82014 13.2632 6.13338 12.5645 4.88971 11.3208C3.64605 10.0772 2.94737 8.39038 2.94737 6.63158C2.94737 4.87278 3.64605 3.18601 4.88971 1.94234C6.13338 0.698682 7.82014 0 9.57895 0ZM22.8421 2.94737C24.2101 2.94737 25.522 3.49079 26.4893 4.45808C27.4566 5.42537 28 6.7373 28 8.10526C28 9.47322 27.4566 10.7852 26.4893 11.7524C25.522 12.7197 24.2101 13.2632 22.8421 13.2632C21.4741 13.2632 20.1622 12.7197 19.1949 11.7524C18.2276 10.7852 17.6842 9.47322 17.6842 8.10526C17.6842 6.7373 18.2276 5.42537 19.1949 4.45808C20.1622 3.49079 21.4741 2.94737 22.8421 2.94737ZM9.57895 2.21053C7.14147 2.21053 5.15789 4.19411 5.15789 6.63158C5.15789 9.06905 7.14147 11.0526 9.57895 11.0526C12.0164 11.0526 14 9.06905 14 6.63158C14 4.19411 12.0164 2.21053 9.57895 2.21053ZM22.8421 5.15789C21.2166 5.15789 19.8947 6.47979 19.8947 8.10526C19.8947 9.73074 21.2166 11.0526 22.8421 11.0526C24.4676 11.0526 25.7895 9.73074 25.7895 8.10526C25.7895 6.47979 24.4676 5.15789 22.8421 5.15789Z" fill="white" />
                            </svg>
                            <p>Careers</p>
                        </button>
                    </div> */}
                </div>
                {/* <img src="../../assets/images/SVG/oliver-watermark.svg" alt="" class="oliver-mark hide" /> */}
                <ScreenSaver hide={true}></ScreenSaver>
                <div style={{display:"none"}}>
          {//Page Setup
          setTimeout(() => {
            scaleSVG();
            centerView("complete-payment");
            //Custom resize listener
            var customResizeTimer;
            window.addEventListener("resize", function () {
            clearTimeout(customResizeTimer);
            customResizeTimer = setTimeout(function () {
            centerView();
            }, 100);
            });
          }, 100)

}
        </div>
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