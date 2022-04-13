import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import ActiveUser from '../../settings/ActiveUser';

class GlobalPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false
        }
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
            if(code !== true){
                pay_amount(code);
            }
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
        const { isOrderPaymentGlobal, color, Name, code, pay_amount, msg, styles, detail, activeGlobalSplitDiv, activeDivForGlobalPayment } = this.props;
        return (
            (ActiveUser.key.isSelfcheckout == true)?
            // <div style={{ marginBottom: 15 }}>
                <button className={isMobileOnly == true ? "btn btn-light text-dark btn-block h-60 shadow-none fz-14":"btn btn-default btn-block btn-90 btn-uppercase"} onClick={() => { pay_amount(code); this.hideTab(!this.state.status) }}>{Name}
                <input type="hidden" value={code} id="pay_amount"></input>
                </button>
            //     {/*
            //     btn btn-light text-dark btn-block h-60 shadow-none fz-14*/}
            // // </div>
           
            :(isMobileOnly == true) ?
                activeGlobalSplitDiv == false ?
                    <button data-target="splitpayment" type="submit" style={{ borderLeftColor: color, marginBottom: 15 }} className="btn btn-default btn-lg btn-block btn-style-02" onClick={() => { activeDivForGlobalPayment(detail, true); this.hideTab(code) }}>{Name}</button>
                    :
                    <div>
                        <div className="appOffCanvasFooter" id="splitpayment" style={{ transform: 'translateY(0%)' }}>
                            <div className="offcanvasOverlay">
                                <table className="table table-layout-fixed fw700 mb-0 tbl-calculator">
                                    <thead>
                                        <tr className="calculatorSetHeight">
                                            <th colSpan="3" className="text-center">{LocalizedLanguage.status}</th>
                                        </tr>
                                        <tr className="calculatorSetHeight">
                                            <th colSpan="3" className="text-center" >{msg}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="calculatorSetHeight" >
                                            <td><img onClick={() => this.cancel_payment()} src="assets/img/ic_gloabal_close.svg" width={50} /><br />{LocalizedLanguage.cancelPayment}</td>
                                            <td > <img onClick={() => { this.hideTab(code) }} src="assets/img/ic_gloabal_refresh.svg" width={50} /><br />{LocalizedLanguage.resendAmount}</td>
                                            <td><img onClick={() => { this.hideTab("manual_global_payment"); activeDivForGlobalPayment("", false); }} src="assets/img/ic_gloabal_done.svg" width={50} /><br />{LocalizedLanguage.manualAccept}</td>
                                        </tr>
                                        <tr className="calculatorSetHeight" >
                                            <td colSpan="3" onClick={() => { activeDivForGlobalPayment("", false); this.hideTab2(!this.state.status) }} >Close</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="appOffCanvasFooterOverlay" data-target="splitpayment" style={{ display: 'block', opacity: 0.36 }}></div>
                    </div>
                :
                <div style={isOrderPaymentGlobal == false ? {display : styles, pointerEvents: 'none', borderColor: '#765b72', marginBottom: 15, opacity: 0.5 } : {display : styles}}className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0"  >
                {/* <div style={{ display: styles, pointerEvents : isOrderPaymentGlobal == false ? 'none' : '' }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0"  > */}
                    <input type="hidden" value={code} id="pay_amount"></input>
                    <div className="section">
                        <div className="accordion_header" data-isopen="true">
                            <div className="pointer"    >
                                <div style={{ borderColor: color }} className="d-flex box-flex box-flex-border-left box-flex-background-global border-dynamic">
                                    <div className="box-flex-text-heading">
                                        <h2 onClick={() => { pay_amount(code); this.hideTab(!this.state.status) }}>
                                            {Name}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="expandable_accordion">
                            <div className="border-color overflowHidden">
                                <div style={{ backgroundColor: color }} className="box__block_caption theme-background b-0 round-top-corner" data-title={Name}  >
                                    <img src="../assets/img/cross_white.svg" className="accordion_close" onClick={() => this.hideTab2(!this.state.status)} />
                                </div>
                                <div className="overflowscroll global-body">
                                    <div className="clearfix center-center d-column global_body">
                                        <div className="line-height-30 mb-3">
                                            <p className="fs16 color-4b">{LocalizedLanguage.status}</p>
                                            <p className="fs24 theme-color">{msg}</p>
                                        </div>
                                        <div className="row w-75">
                                            <div className="col-sm-4 p-0">
                                                <img onClick={() => this.cancel_payment()} src="assets/img/ic_gloabal_close.svg" width="50px" />
                                                <p><small>{LocalizedLanguage.cancelPayment}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img onClick={() => { pay_amount(code); this.hideTab(!this.state.status) }} src="assets/img/ic_gloabal_refresh.svg" width="50px" />
                                                <p><small>{LocalizedLanguage.resendAmount}</small></p>
                                            </div>
                                            <div className="col-sm-4 p-0">
                                                <img src="assets/img/ic_gloabal_done.svg" width="50px" onClick={() => { pay_amount("manual_global_payment"); this.hideTab(!this.state.status) }} />
                                                <p><small>{LocalizedLanguage.manualAccept}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
const connectedCardPayment = connect(mapStateToProps)(GlobalPayment);
export { connectedCardPayment as GlobalPayment };