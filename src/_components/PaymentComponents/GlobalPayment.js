import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import ActiveUser from '../../settings/ActiveUser';
import { CommonTerminalPopup } from "./CommonTerminalPopup";

class GlobalPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentButtonDisplay: true,
            buttonClicked:false
        }
    }

    cancel_payment() {
        if (this.props.type == 'refund') {
            $('.accordion_close').click();
            this.handlePayDisplay2(!this.state.paymentButtonDisplay);
        } else {
            location.reload();
        }
        this.setState({ paymentButtonDisplay: true })
    }

    handlePayDisplay(code) {
        if(this.state.buttonClicked==false){ //check for bouble button clicked 
            this.state.buttonClicked=true;    
            const { closingTab, pay_amount, paymentDetails } = this.props;
            // closingTab(true);
            if(paymentDetails && paymentDetails.HasTerminal== true && paymentDetails.TerminalCount== 0 && paymentDetails.Support== "Terminal"){
                this.props.terminalPopup(LocalizedLanguage.terminalnotconnected)
            }
            else{
                this.setState({ paymentButtonDisplay: false })
                setTimeout(function () {
                    if (code !== true) {
                        pay_amount(code);
                    }
                }, 500)
            }
            setTimeout(() => { //enabled after 2 second
                this.state.buttonClicked=false;  
            }, 2000);
        }
    }

    handlePayDisplay2(st) {
        this.setState({ paymentButtonDisplay: true })
        this.props.activeDisplay(false)
    }

    render() {
        const { isOrderPaymentGlobal, color, Name, code, pay_amount, msg, styles } = this.props;
        return (
            (ActiveUser.key.isSelfcheckout == true && this.state.paymentButtonDisplay == true) ?
                
            // <div className="row">
                <button onClick={() => { this.handlePayDisplay(code) }}>{Name}<input type="hidden" value={code} id="pay_amount"></input></button>
            // </div>

                // <div style={{ marginBottom: 15 }}>
                //     <button className={isMobileOnly == true ? "btn btn-light text-dark btn-block h-60 shadow-none fz-14" : "btn btn-default btn-block btn-90 btn-uppercase"} onClick={() => { this.handlePayDisplay(code) }}>{Name}
                //         <input type="hidden" value={code} id="pay_amount"></input>
                //     </button>
                //  </div>
                :
                (isMobileOnly == true && this.state.paymentButtonDisplay == true) ?
                    // activeGlobalSplitDiv == false ?
                    <button data-target="splitpayment" type="submit" style={{ borderLeftColor: color, marginBottom: 15 }} className="btn btn-default btn-lg btn-block btn-style-02" onClick={() => { this.handlePayDisplay(code) }}>{Name}</button>
                    :
                    this.state.paymentButtonDisplay == true ?
                        <div style={isOrderPaymentGlobal == false ? { display: styles, pointerEvents: 'none', borderColor: '#765b72', marginBottom: 15, opacity: 0.5 } : { display: styles }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0"  >
                            {/* <div style={{ display: styles, pointerEvents : isOrderPaymentGlobal == false ? 'none' : '' }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0"  > */}
                            <input type="hidden" value={code} id="pay_amount"></input>
                            <div className="section">
                                <div className="accordion_header">
                                    <div className="pointer">
                                        <div style={{ borderColor: color }} className="d-flex box-flex box-flex-border-left box-flex-background-global border-dynamic">
                                            <div className="box-flex-text-heading">
                                                <h2 onClick={() => { this.handlePayDisplay(code) }}>
                                                    {Name}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        this.state.paymentButtonDisplay == false ?
                            <div>
                                <CommonTerminalPopup
                                    errorMsgColor={'red'}
                                    error_msg={msg}
                                    handleCancelButton={() => this.cancel_payment()}
                                    button1Title={LocalizedLanguage.resendAmount}
                                    handleButton1Click={() => pay_amount(code)}
                                    button2Title={LocalizedLanguage.manualAccept}
                                    handleButton2Click={() => pay_amount("manual_global_payment")}
                                    showTerinalwaitingMsg = {msg  && msg !=='' ? false : true}
                                /> </div> : ''
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedCardPayment = connect(mapStateToProps)(GlobalPayment);
export { connectedCardPayment as GlobalPayment };