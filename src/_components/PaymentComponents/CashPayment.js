import React from 'react';
import { connect } from 'react-redux';
import { GetRoundCash } from '../../CheckoutPage/Checkout';
import ActiveUser from '../../settings/ActiveUser';
import { isMobileOnly, isIOS } from "react-device-detect";

var cash_rounding = ActiveUser.key.cash_rounding;

class CashPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            paidAmount: this.props.paidAmount,
            paidAmountStatus: false,
            temporary_vaule: '',
            activeDisplay: false,
            envfocus: this.props.envType
        }
        this.calcInp2 = this.calcInp2.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBack = this.handleBack.bind(this);

    }

    handleBack(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            const { pay_amount, code } = this.props;
            pay_amount(code)
            this.hideTab2(!this.state.status)
        }
    }

    getRemainingPriceForCash() {
        var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
        var paid_amount = 0;
        var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
        if (getPayments !== null) {
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
            });
        }
        var totalPrice = checkList && checkList.totalPrice ? parseFloat(checkList.totalPrice).toFixed(2) : 0;
        this.state.CashRound = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        var cashRoundReturn = parseFloat(GetRoundCash(cash_rounding, totalPrice - paid_amount))
        var new_total_price = (totalPrice - paid_amount) + parseFloat(cashRoundReturn)
        return new_total_price;
    }

    hideTab(st) {
        if (this.state.envfocus) {
            $('#calc_output_cash').attr('readonly', true)
            $('#my-input').attr('readonly', true);
            $('#calc_output').attr('readonly', true);
        }
        setTimeout(function () {
            boxHeight();
            if (typeof setCalculatorHeight != "undefined"){  setCalculatorHeight()};            
        }, 50);
        if (st == true) {
            this.props.activeDisplay(`${this.props.code}_true`)
        } else {
            this.state.temporary_vaule = ''
            this.state.paidAmountStatus = false
            this.props.activeDisplay(false);
            this.props.activeForCash(false);
        }
        if (this.props.type == 'refund') {
            this.setState({
                status: st,
                paidAmount: this.props.placeholder,
                temporary_vaule: '',
                paidAmountStatus: false
            })
            if (st == true) {
                this.props.hideCashTab(false)
            } else {
                this.props.hideCashTab(true);
            }
            this.props.normapNUM(this.props.placeholder)
        } else {
            const getRemainingPriceForCash = this.getRemainingPriceForCash();
            this.setState({
                status: st,
                paidAmount: parseFloat(getRemainingPriceForCash).toFixed(2),
                temporary_vaule: '',
                paidAmountStatus: false
            })
        }
        this.props.closingTab(true)
    }

    hideTab2(st) {
        this.setState({ status: st })
        this.props.closingTab(false)
        this.props.activeDisplay(false)
        if (this.props.type == 'refund') {
            this.props.hideCashTab(false, 'cash')
        }
        this.props.activeForCash(false)
    }

    calcInp2(input) {
        this.setState({
            paidAmount: '',
            paidAmountStatus: true
        })
        var elemJ = jQuery('#calc_output_cash');
        if (this.state.emptyPaymentFlag || elemJ.val() == "0") {
            elemJ.val('');
            this.setState({
                emptyPaymentFlag: false,
            });
        }

        switch (input) {
            case 1:
                this.SetValue(elemJ, '1');
                break;
            case 2:
                this.SetValue(elemJ, '2');
                break;
            case 3:
                this.SetValue(elemJ, '3');
                break;
            case 4:
                this.SetValue(elemJ, '4');
                break;
            case 5:
                this.SetValue(elemJ, '5');
                break;
            case 6:
                this.SetValue(elemJ, '6');
                break;
            case 7:
                this.SetValue(elemJ, '7');
                break;
            case 8:
                this.SetValue(elemJ, '8');
                break;
            case 9:
                this.SetValue(elemJ, '9');
                break;
            case 0:
                this.SetValue(elemJ, '0');
                break;
            case '.':
                if (elemJ.val() == "") {
                    this.SetValue(elemJ, '0.');
                } else {
                    if (elemJ.val().includes(".")) {

                    } else {
                        this.SetValue(elemJ, '.');
                    }
                }
                break;
        }
    }

    rmvInp2() {
        var str = $('#calc_output_cash').val();
        str = str.slice(0, -1);
        if (str == "" || str == " ") {
            $('#calc_output_cash').val('0');
        } else { }

        this.setState({
            temporary_vaule: str,
            paidAmountStatus: true
        })
        if (str == '') {
            this.state.paidAmount = 0;
            this.state.paidAmountStatus = true;
        }
        this.props.normapNUM(str)
    }

    SetValue(eleT, val) {
        var v1 = this.state.temporary_vaule + val;
        eleT.html(eleT.html().replace(' ', '') + val + ' ');
        this.setState({ temporary_vaule: v1 })
        this.props.normapNUM(v1)
    }

    handleChange(e) {
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (e.target.value === '' || re.test(e.target.value)) {
            const { value } = e.target;
            this.props.normapNUM(value);
            this.setState({
                paidAmount: '',
                paidAmountStatus: true,
                temporary_vaule: value
            })
        }
    }

    componentDidMount() {
        if (isMobileOnly == true) {
            setTimeout(function () {
                if (typeof setCalculatorHeight != "undefined"){  setCalculatorHeight()};               
            }, 500)
        }
    }

    render() {
        const { color, Name, placeholder, pay_amount, code, styles, paidAmounts, detail, activeDivForCashPayment, activeCashSplitDiv } = this.props;
        const { status, paidAmount, paidAmountStatus, temporary_vaule } = this.state;
        //console.log("activeCashSplitDiv", activeCashSplitDiv)
        return (
            (isMobileOnly == true ) ?
                activeCashSplitDiv == false ?
                    <button data-target="splitpayment" type="submit" style={{ borderLeftColor: color, marginBottom: 15 }} className="btn btn-default btn-lg btn-block btn-style-02" onClick={() => { activeDivForCashPayment(detail, true); this.hideTab(!status) }}>{Name}</button>
                    :
                    <div>
                        <div className="appOffCanvasFooter" id="splitpayment" style={{ transform: 'translateY(0%)'}}>
                            <div className="offcanvasOverlay">
                                {/* <div onClick={() => { activeDivForCashPayment("", false); this.hideTab(!status) }} style={{ textAlign: 'center', backgroundColor: color }}>close</div> */}
                                <table className="table table-layout-fixed fw700 mb-0 tbl-calculator">
                                    <thead>
                                        <tr className="calculatorSetHeight" >
                                            <th colSpan="2" className="text-right">
                                                {paidAmountStatus == true ?
                                                    <input placeholder="0.00" id="calc_output_cash" value={temporary_vaule !== '' ? temporary_vaule : paidAmount} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete='off' autoFocus={this.state.envfocus ? false : true} readOnly={this.state.envfocus ? true : false} />
                                                    :
                                                    // <input placeholder={placeholder} id="calc_output_cash" value={paidAmounts ? paidAmounts : paidAmount} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete='off' autoFocus={this.state.envfocus ? false : true} readOnly={this.state.envfocus ? true : false} />
                                                    <input placeholder={placeholder} id="calc_output_cash" value={paidAmounts ? paidAmounts : placeholder} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete='off' autoFocus={this.state.envfocus ? false : true} readOnly={this.state.envfocus ? true : false} />
                                                }</th>
                                            <th><img onClick={() => this.rmvInp2()} src="../mobileAssets/img/backarrow.svg" alt="" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="calculatorSetHeight" >
                                            <td onClick={() => this.calcInp2(1)}>1</td>
                                            <td onClick={() => this.calcInp2(2)}>2</td>
                                            <td onClick={() => this.calcInp2(3)}>3</td>
                                        </tr>
                                        <tr className="calculatorSetHeight" >
                                            <td onClick={() => this.calcInp2(4)}>4</td>
                                            <td onClick={() => this.calcInp2(5)}>5</td>
                                            <td onClick={() => this.calcInp2(6)}>6</td>
                                        </tr>
                                        <tr className="calculatorSetHeight" >
                                            <td onClick={() => this.calcInp2(7)}>7</td>
                                            <td onClick={() => this.calcInp2(8)}>8</td>
                                            <td onClick={() => this.calcInp2(9)}>9</td>
                                        </tr>
                                        <tr className="calculatorSetHeight" >
                                            <td onClick={() => this.calcInp2(".")}>.</td>
                                            {/* <td onClick={() => this.calcInp(1)}>,</td> */}
                                            <td onClick={() => this.calcInp2(0)}>0</td>
                                            <td onClick={() => { activeDivForCashPayment("", false); this.hideTab(!status) }} >Close</td>
                                        </tr>
                                        <tr className="calculatorSetHeight" >
                                            <td colSpan="3" className="p-0 border-0">
                                                <button style={{ backgroundColor: color }} onClick={() => { pay_amount(code); this.hideTab2(!status); activeDivForCashPayment("", false) }} className="btn btn-primary border-0 rounded-0 btn-block offcanvasOverlaySPLIT p-0">
                                                    Enter
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="appOffCanvasFooterOverlay" data-target="splitpayment" style={{ display: 'block', opacity: 0.36 }}></div>
                    </div>
                :
                status !== true ?
                    // <div onClick={() => this.hideTab(!status)} style={{ display: styles }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0" >
                    //     <div className="section">
                    //         <div className="" data-isopen="">
                    //             <div className="pointer">
                    //                 <div style={{ borderColor: color }} id="CheckPayment" className="d-flex box-flex box-flex-border-left box-flex-background-cash border-dynamic">
                    //                     <div className="box-flex-text-heading">
                    //                         <h2>{Name}</h2>
                    //                     </div>
                    //                 </div>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>
                    // <div className="row" style={{ display: styles }}>
                         <button onClick={() => this.hideTab(!status)} >{Name}</button>
                    // </div>
                    :
                    <div className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0" >
                        <div className="section">
                            <div className="" >
                                <div style={{ backgroundColor: color }} className="box__block_caption secondry-theme-background b-0 round-top-corner" data-title="Cash">
                                    <img src="../assets/img/cross_white.svg" className="" onClick={() => this.hideTab(!status)} />
                                </div>
                                <div className="box__block_calculator" >
                                    <table className="table table-responsive table-layout-fixed mb-0">
                                        <tbody>
                                            <tr className="cash-row">
                                                <td className="b-0">
                                                    <img src="../assets/img/back_payment.svg" className="ic_table" onClick={() => this.rmvInp2()} />
                                                </td>
                                                <td colSpan="2" className="border-left-0 b-0">
                                                    {paidAmountStatus == true ?
                                                        <input placeholder="0.00" id="calc_output_cash" value={temporary_vaule !== '' ? temporary_vaule : paidAmount} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete='off' autoFocus={this.state.envfocus ? false : true} readOnly={this.state.envfocus ? true : false} />
                                                        :
                                                        <input placeholder={placeholder} id="calc_output_cash" value={paidAmounts ? paidAmounts : paidAmount} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount placeholder-color" autoComplete='off' autoFocus={this.state.envfocus ? false : true} readOnly={this.state.envfocus ? true : false} />
                                                    }
                                                </td>
                                            </tr>
                                            <tr className="cash-row">

                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline" onClick={() => this.calcInp2(1)} value="1" placeholder="1" />
                                                </td>
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(2)} value="2" placeholder="2" />
                                                </td>
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(3)} value="3" placeholder="3" />
                                                </td>
                                            </tr>
                                            <tr className="cash-row">
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(4)} value="4" placeholder="4" />
                                                </td>
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(5)} value="5" placeholder="5" />
                                                </td>
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(6)} value="6" placeholder="6" />
                                                </td>
                                            </tr>
                                            <tr className="cash-row">
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(7)} value="7" placeholder="7" />
                                                </td>
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(8)} value="8" placeholder="8" />
                                                </td>
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(9)} value="9" placeholder="9" />
                                                </td>
                                            </tr>
                                            <tr className="cash-row">
                                                <td>
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2('.')} value="." placeholder="." />
                                                </td>
                                                <td colSpan="2" className="border-left-0">
                                                    <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp2(0)} value="0" placeholder="0" />
                                                </td>
                                            </tr>
                                            <tr className="cash-row" onClick={() => { pay_amount(code); this.hideTab2(!status) }}>
                                                <td colSpan="3">
                                                    <input style={{ backgroundColor: color }} type="button" className="secondry-theme-background border-0 color-4b no-outline btn-enter " value="Enter" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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

const connectedCardPayment = connect(mapStateToProps)(CashPayment);
export { connectedCardPayment as CashPayment };