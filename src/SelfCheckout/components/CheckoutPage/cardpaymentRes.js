import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { history } from '../../../_helpers';
import { LoadingModal } from '../../../_components';
import { isMobileOnly } from "react-device-detect";

class CardpaymentRes extends React.Component {
    
    constructor(props) {
        super(props);        
        this.state = {
            status: false
        }
        this.backeventhandler = this.backeventhandler.bind(this);
    }
    backeventhandler()
    {
        history.push("/SelfCheckout")
    }
    cancel_payment() {
        if (this.props.type == 'refund') {
            if (isMobileOnly == true) { this.props.activeDivForGlobalPayment("", false) }
            $('.accordion_close').click();
            this.hideTab2(!this.state.status);
        } else {
            location.reload();
        }
    }
    hideTab(code) {
        const { closingTab, pay_amount } = this.props;
        closingTab(true);
        setTimeout(function () {
            if(code !== true)
            pay_amount(code);
        }, 500)
        if (this.props.type == 'refund') {
            this.props.hideCashTab(false);
        }
    }
    hideTab2(st) {
        this.setState({ status: st })
        this.props.activeDisplay(false)
    }
    render() {            
        const { pay_amount } = this.props;
        var landingScreen='';
        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
            var register_content = Register_Permissions ? Register_Permissions.content : '';
           if (Register_Permissions) {
                Register_Permissions.content && Register_Permissions.content.filter(item=>item. slug =="landing-screen").map(permission =>{
                     landingScreen = permission.value;                 
           })
        }
        return (  
            (isMobileOnly == true)?
                <div>
                 {/* open potrait view in mobile view */}
                 <div className="page-payment page-payment-card">
                            {/* <div className="payment-nav">
                                <button className="btn btn-success text-uppercase btn-14" onClick={() => this.backeventhandler()}>{LocalizedLanguage.goBack}</button>
                            </div> */}
                             <div className="appHeader shadow-none">
                        <button className="btn btn-success btn-block rounded-0 h-100 shodow-none fz-13" onClick={() => this.backeventhandler()}>{LocalizedLanguage.goBack}</button>
                    </div>
                            <div className="payment-content">
                                {this.props.msg && this.props.msg=="Waiting On Terminal"?
                                    <div className="w-100">
                                        <div className="payment-page-title">
                                            <img src={landingScreen} className="mx-auto" alt="" />
                                            <div className="spacer-40"></div>
                                        </div>
                                        <p className="text-white text-center payment-description font-lg">
                                                {LocalizedLanguage.globarPayInstruction}
                                        </p>
                                    </div>
                                    :
                                    <div className="w-100">
                                        <div className="text-white text-center payment-description font-lg">
                                            <p >{LocalizedLanguage.status}</p>
                                            <p >{this.props.msg}</p>
                                        </div>
                                        <div className="text-white text-center payment-description">
                                            <div className="col-sm-4 p-0">
                                                <img onClick={this.backeventhandler} src="../../assets/img/ic_gloabal_close_white.svg" width="36px" />
                                                <p className="font-sm"><small>{LocalizedLanguage.cancelPayment}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img onClick={() => { pay_amount('econduit'); }} src="../../assets/img/ic_gloabal_refresh_white.svg" width="36px" />
                                                <p className="font-sm"><small>{LocalizedLanguage.resendAmount}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img src="../../assets/img/ic_gloabal_done_white.svg" width="36px" onClick={() => { pay_amount("manual_global_payment"); this.hideTab(!this.state.status) }} />
                                                <p className="font-sm"><small>{LocalizedLanguage.manualAccept}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>        
                   
                </div>
                :
                <div>
                    <div className="portrait">
                        <div className="page-payment page-payment-card">
                            <div className="payment-nav">
                                <button className="btn btn-success text-uppercase btn-14" onClick={() => this.backeventhandler()}>{LocalizedLanguage.goBack}</button>
                            </div>
                            <div className="payment-content">
                                {this.props.msg && this.props.msg=="Waiting On Terminal"?
                                    <div className="w-100">
                                        <div className="payment-page-title">
                                            <img src={landingScreen} className="mx-auto" alt="" />
                                            <div className="spacer-40"></div>
                                        </div>
                                        <p className="text-white text-center payment-description font-lg">
                                                {LocalizedLanguage.globarPayInstruction}
                                        </p>
                                    </div>
                                    :
                                    <div className="w-100">
                                        <div className="text-white text-center payment-description font-lg">
                                            <p >{LocalizedLanguage.status}</p>
                                            <p >{this.props.msg}</p>
                                        </div>
                                        <div className="text-white text-center payment-description">
                                            <div className="col-sm-4 p-0">
                                                <img onClick={this.backeventhandler} src="../../assets/img/ic_gloabal_close_white.svg" width="36px" />
                                                <p className="font-sm"><small>{LocalizedLanguage.cancelPayment}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img onClick={() => { pay_amount('econduit'); }} src="../../assets/img/ic_gloabal_refresh_white.svg" width="36px" />
                                                <p className="font-sm"><small>{LocalizedLanguage.resendAmount}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img src="../../assets/img/ic_gloabal_done_white.svg" width="36px" onClick={() => { pay_amount("manual_global_payment"); this.hideTab(!this.state.status) }} />
                                                <p className="font-sm"><small>{LocalizedLanguage.manualAccept}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>        
                    </div>
                    <div className="landscape">
                        <div className="page-payment page-payment-pin">
                            <div className="payment-nav">
                                <button className="btn btn-success text-uppercase btn-14" onClick={() => this.backeventhandler()}>{LocalizedLanguage.goBack}</button>
                            </div>
                            <div className="payment-content payment-content-left">
                                <div className="container">
                                    <div className="row">                                    
                                        {this.props.msg && this.props.msg=="Waiting On Terminal"?
                                            <div className="col-sm-6 font-lg">
                                                <div className="payment-page-title">
                                                    <img src={landingScreen} className="mx-auto" alt=""/>
                                                    <div className="spacer-40"></div>
                                                </div>
                                                <p className="text-white text-center payment-description font-lg">
                                                    {LocalizedLanguage.globarPayInstruction}
                                                </p>
                                            </div>
                                            :
                                            <div className="col-sm-6">                                            
                                                <div className="text-white text-center payment-description font-lg">
                                            <p >{LocalizedLanguage.status}</p>
                                            <p >{this.props.msg}</p>
                                            </div>
                                            <div className="text-white text-center payment-description">
                                            <div className="col-sm-4 p-0">
                                                <img onClick={this.backeventhandler} src="../../assets/img/ic_gloabal_close_white.svg" width="36px" />
                                                <p className="font-sm"><small>{LocalizedLanguage.cancelPayment}</small></p>
                                                
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img onClick={() => { pay_amount('econduit'); }} src="../../assets/img/ic_gloabal_refresh_white.svg" width="36px" />
                                                <p className="font-sm"><small>{LocalizedLanguage.resendAmount}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img src="../../assets/img/ic_gloabal_done_white.svg" width="36px" onClick={() => { pay_amount("manual_global_payment"); this.hideTab(!this.state.status) }} />
                                                <p className="font-sm"><small>{LocalizedLanguage.manualAccept}</small></p>
                                            </div>
                                        </div>
                                            </div>
                                        }                                    
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>            
        )
    }
}
export default CardpaymentRes;