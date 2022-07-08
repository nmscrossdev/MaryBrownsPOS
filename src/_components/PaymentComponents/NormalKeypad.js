import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";

class NormalKeypad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paidAmount: this.props.paidAmount,
            status: false,
            paidAmountStatus: false,
            emptyPaymentFlag: true,
            getRemainingPrice: this.getRemainingPrice(),
            temporary_vaule: '',
            envfocus: this.props.envType
        }
        this.calcInp = this.calcInp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }


    handleChange(e) {
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (e.target.value === '' || re.test(e.target.value)) {
            const { value } = e.target;
            if (this.props.parkOrder == 'refund') {
                this.props.hideCashTab(false)
            }
            this.props.normapNUM(value);
            this.props.activeForCash(false)
            this.setState({
                paidAmount: '',
                paidAmountStatus: true,
                temporary_vaule: value,
            })
            // set the current trnasaction status, Used for APP Command "TransactionStatus"
            localStorage.setItem("CurrentTransactionStatus", JSON.stringify({"paymentType":this.props.code,"status": "completed"}))
        }
    }

    handleBack(e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            this.hideTab2(!this.state.status)
        }
    }

    hideTab(st) {
        this.props.activeForCash(false);
        if (this.state.status == false) {
            if (this.state.envfocus) {
                $('#my-input').attr('readonly', true);
                $('#calc_output').attr('readonly', true);
            } else {
                setTimeout(function () {
                    $(`#calc_output`).focus();
                }, 500)
            }
        }
        setTimeout(function () {
            boxHeight();
        }, 50);
        if (st == true) {
            this.props.activeDisplay(`${this.props.code}_true`)
        } else {
            this.props.activeDisplay(false);
        }
        if (this.props.parkOrder == 'refund') {
            this.props.hideCashTab(false)
        }
        this.setState({
            status: st,
            emptyPaymentFlag: true,
            paidAmount: this.state.getRemainingPrice ? parseFloat(this.state.getRemainingPrice.toFixed(2)):0,
            paidAmountStatus: false,
            temporary_vaule: '',
        })
        if (isMobileOnly == true && this.props.parkOrder !== 'refund') {
            var amount = this.getRemainingPrice();
            this.props.normapNUM(parseFloat(amount).toFixed(2))
        }
    }

    getRemainingPrice() {
        if (this.props.parkOrder == 'refund') {
            this.props.hideCashTab(false)
            return 0
        } else {
            var checkList = JSON.parse(localStorage.getItem("CHECKLIST"));
            var paid_amount = 0;
            var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : [];
            if (getPayments !== null) {
                getPayments.forEach(paid_payments => {
                    paid_amount += parseFloat(paid_payments.payment_amount);
                });
            }
            if (checkList && checkList.totalPrice >= paid_amount) {
                return (parseFloat(checkList.totalPrice) - paid_amount);
            }
        }
    }

    hideTab2(st) {
        if (this.state.envfocus) {
            $('#my-input').attr('readonly', true);
            $('#calc_output').attr('readonly', true);
        }
        this.setState({ status: st })
        this.props.activeDisplay(false);
        this.props.activeForCash(true);
        if (this.props.parkOrder == 'refund') {
            this.props.hideCashTab(false)
        }
    }

    SetValue(eleT, val) {
        var v1 = this.state.temporary_vaule + val;
        eleT.html(eleT.html().replace(' ', '') + val + ' ');
        this.setState({
            temporary_vaule: v1
        })
        if (this.props.parkOrder == 'refund') {
            this.props.hideCashTab(false)
        }
        this.props.normapNUM(v1)
    }

    calcInp(input) {
        this.setState({
            paidAmountStatus: true,
            paidAmount: ''
        })
        var elemJ = jQuery('#calc_output');
        if (this.state.emptyPaymentFlag || elemJ.val() == "0") {
            elemJ.val('');
            this.setState({
                emptyPaymentFlag: false
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

    rmvInp() {
        var str = $('#calc_output').val();
        str = str.slice(0, -1);
        if (str == "" || str == " ") {
            $('#calc_output').val('0');
        } else { }
        this.setState({
            temporary_vaule: str,
            paidAmountStatus: true
        })
        if (this.props.parkOrder == 'refund') {
            this.props.hideCashTab(false)
        }
        if (str == '') {
            this.state.paidAmount = 0;
            this.state.paidAmountStatus = true;
        }
        this.props.normapNUM(str)

    }

    componentWillReceiveProps() {
        if (this.props.closing_Tab == true) {
            this.setState({
                paidAmountStatus: false,
                paidAmount: '',
            })
            this.props.closingTab(false)
            if (this.props.parkOrder == 'refund') {
                this.props.hideCashTab(false)
            }
        }
        if (isMobileOnly == true && this.props.activeCashSplitDiv == false && this.props.parkOrder != "refund") {
            this.setState({
                paidAmountStatus: false,
                paidAmount: '',
            })
        }
        if (this.props.parkOrder == 'refund' && this.props.blankTempValue == true) {
            this.setState({
                temporary_vaule: ''
            })
        }
    }

    parkOrder() {
        this.props.parkOrder('park_sale')
    }

    blankTempValue(st) {
        if (st == true && this.props.parkOrder == 'refund') {
            this.setState({
                paidAmount: this.props.placeholder,
                temporary_vaule: '',
            })
            this.props.ChangeTempValue()
        }
    }

    setSplipaymentDiv() {
        this.setState({ paidAmountStatus: false })
        // $('button[data-target="splitpayment"]').click(function () {
        // var target = $(this).data("target");
        $(".appOffCanvasFooter").css({ "transform": "translateY(0%)" });
        $(".appOffCanvasFooterOverlay").css({
            "display": "block",
            "opacity": 0.36
        });
        $(".calculatorSetHeight,.offcanvasOverlaySPLIT").height(($(".offcanvasOverlay").height() - $(".appBottomOnboarding").height()) / 6);
        // });
    }

    removeSplipaymentDiv() {
        $(".appOffCanvasFooter").removeAttr("style");
        $(".appOffCanvasFooterOverlay").removeAttr("style");
    }

    render() {
        const { parkOrder, placeholder, handleFocus, styles, blankTempValue } = this.props;
        const { paidAmountStatus } = this.state;
        if (parkOrder == 'refund' && blankTempValue == true) {
            this.blankTempValue(blankTempValue)
        }
        var isDemoUser = localStorage.getItem('demoUser')
        return (
            (isMobileOnly == true) ?
                <div>
                    <div className="appOffCanvasFooter" id="splitpayment">
                        {/* <div onClick={() => { this.hideTab(!this.state.status); this.removeSplipaymentDiv() }} style={{ textAlign: 'center', backgroundColor: "#46A9D4" }}>close</div> */}
                        <div className="offcanvasOverlay">
                            <table className="table table-layout-fixed fw700 mb-0 tbl-calculator">
                                <thead>
                                    <tr className="calculatorSetHeight">
                                        <th colSpan="2" className="text-right">
                                            {paidAmountStatus == true ?
                                                <input placeholder="0.00" id="calc_output" value={this.state.temporary_vaule !== '' ? this.state.temporary_vaule : this.state.paidAmount} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount" autoComplete='off' />
                                                :
                                                <input placeholder="0.00" id="calc_output" value={placeholder} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount" autoComplete='off' onFocus={handleFocus} />
                                            }
                                        </th>
                                        <th><img onClick={() => this.hideTab(!this.state.status)} src="../mobileAssets/img/backarrow.svg" alt="" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="calculatorSetHeight">
                                        <td onClick={() => this.calcInp(1)}>1</td>
                                        <td onClick={() => this.calcInp(2)}>2</td>
                                        <td onClick={() => this.calcInp(3)}>3</td>
                                    </tr>
                                    <tr className="calculatorSetHeight">
                                        <td onClick={() => this.calcInp(4)}>4</td>
                                        <td onClick={() => this.calcInp(5)}>5</td>
                                        <td onClick={() => this.calcInp(6)}>6</td>
                                    </tr>
                                    <tr className="calculatorSetHeight">
                                        <td onClick={() => this.calcInp(7)}>7</td>
                                        <td onClick={() => this.calcInp(8)}>8</td>
                                        <td onClick={() => this.calcInp(9)}>9</td>
                                    </tr>
                                    <tr className="calculatorSetHeight">
                                        <td onClick={() => this.calcInp(".")}>.</td>
                                        {/* <td onClick={() => this.calcInp(1)}>,</td> */}
                                        <td onClick={() => this.calcInp(0)}>0</td>
                                        <td onClick={() => { this.hideTab(!this.state.status); this.removeSplipaymentDiv() }}>{LocalizedLanguage.close}</td>
                                    </tr>
                                    <tr className="calculatorSetHeight" style={{ height: 70 }}>
                                            <td colSpan="3" className="p-0 border-0 offcanvasOverlay">
                                                <button onClick={() => { this.hideTab2(!this.state.status); this.removeSplipaymentDiv() }} className="btn btn-primary border-0 rounded-0 btn-block offcanvasOverlaySPLIT p-0">
                                                    Enter
                                          </button>
                                            </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="appOffCanvasFooterOverlay" data-target="splitpayment"></div>
                    <div className={isDemoUser == true || isDemoUser == 'true' ? 'appcheckBoardingFooter' : ''}>
                        <div className="appBottomAbove">
                            {paidAmountStatus == true ?
                                <button className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase" data-target="splitpayment">{LocalizedLanguage.splitPaymentButton}- ({this.state.temporary_vaule !== '' ? this.state.temporary_vaule : this.state.paidAmount})</button>
                                :
                                <button onClick={() => this.setSplipaymentDiv()} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase" data-target="splitpayment">{LocalizedLanguage.splitPaymentButton}</button>
                            }

                        </div>
                    </div>
                </div>
                :
                this.state.status !== true ?
                    <div style={{ display: styles }} className="gray-background mb-2 round-8 d-none overflowHidden  overflow-0">
                        <div className="" data-isopen="">
                            <div className="pointer">
                                {parkOrder == 'refund' ?
                                    <div className="box-flex center-center box-flex-responsive">
                                        <div className="col-sm-9" style={{ marginLeft: '16%' }}>
                                            <div className="block__box_text_price">
                                                {paidAmountStatus == true ?
                                                    <input placeholder="0.00" id="my-input" value={this.state.temporary_vaule !== '' ? this.state.temporary_vaule : this.state.paidAmount} onChange={this.handleChange} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline" autoComplete='off' autoFocus />
                                                    :
                                                    <input placeholder="0.00" id="my-input" value={placeholder} onChange={this.handleChange} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline" autoFocus />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="block__box_action_description park_avoid" >
                                                <button type="button" onClick={() => this.hideTab(!this.state.status)} className="transparent no-outline uppercase btnpark btnpark-reverse ">{LocalizedLanguage.splitPayment}</button>
                                                {/* <img onClick={() => this.hideTab(!this.state.status)} src="../assets/img/calculator_minimiser.svg" className="" /> */}
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="box-flex center-center box-flex-responsive">
                                        <div className="col-sm-3">
                                            {/* <div className="block__box_text_hint">
                                                <button type="button" onClick={() => this.parkOrder()} className="transparent b-0 r-0 no-outline uppercase">{LocalizedLanguage.park}</button>
                                            </div> */}
                                            <button onClick={() => this.parkOrder()} type="button" className="transparent no-outline uppercase btnpark">{LocalizedLanguage.park}</button>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="block__box_text_price">
                                                {paidAmountStatus == true ?
                                                    <input placeholder="0.00" id="my-input" value={this.state.temporary_vaule !== '' ? this.state.temporary_vaule : this.state.paidAmount} onChange={this.handleChange} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount" autoComplete='off' autoFocus />
                                                    :
                                                    <input placeholder="0.00" id="my-input" value={placeholder} onChange={this.handleChange} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline" autoFocus />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="block__box_action_description park_avoid" >
                                                {/* <img onClick={() => this.hideTab(!this.state.status)} src="../assets/img/calculator_minimiser.svg" className="" /> */}
                                                <button onClick={() => this.hideTab(!this.state.status)} type="button" className="transparent no-outline uppercase btnpark">{LocalizedLanguage.splitPayment}</button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="gray-background mb-2 round-8 d-none overflowHidden overflow-0">
                        <div className="section">
                            <div className="pointer">

                                <div className="box-flex center-center park_table_row">
                                    <div className="col-sm-3">
                                        <div className="block__box_text_hint">
                                            <img src="../assets/img/back_payment.svg" onClick={() => this.rmvInp()} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="block__box_text_price">
                                            {paidAmountStatus == true ?
                                                <input placeholder="0.00" id="calc_output" value={this.state.temporary_vaule !== '' ? this.state.temporary_vaule : this.state.paidAmount} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount" autoComplete='off' />
                                                :
                                                <input placeholder="0.00" id="calc_output" value={placeholder} onChange={this.handleChange} onKeyDown={this.handleBack} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount" autoComplete='off' onFocus={handleFocus} />
                                            }
                                        </div>
                                    </div>
                                    <div className="col-sm-3" >
                                        <div className="block__box_action_description" href="#paymentReset" data-toggle="collapse" >
                                            <button onClick={() => this.hideTab(!this.state.status)} type="button" className="transparent no-outline uppercase btnpark btnpark-reverse">{LocalizedLanguage.splitPayment}</button>
                                            {/* <img onClick={() => this.hideTab(!this.state.status)} src="../assets/img/calculator_minimiser_colored.svg" className="gray-minisizer-icon" /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="panel-body p-0">
                                    <div className="box__block_calculator">
                                        <table className="table table-responsive mb-0">
                                            <tbody>
                                                <tr className="park_table_row">
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline" onClick={() => this.calcInp(1)} value="1" placeholder="1" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(2)} value="2" placeholder="2" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(3)} value="3" placeholder="3" />
                                                    </td>
                                                </tr>
                                                <tr className="park_table_row">
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(4)} value="4" placeholder="4" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(5)} value="5" placeholder="5" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(6)} value="6" placeholder="6" />
                                                    </td>
                                                </tr>
                                                <tr className="park_table_row">
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(7)} value="7" placeholder="7" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(8)} value="8" placeholder="8" />
                                                    </td>
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(9)} value="9" placeholder="9" />
                                                    </td>
                                                </tr>
                                                <tr className="park_table_row">
                                                    <td>
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp('.')} value="." placeholder="," />
                                                    </td>
                                                    <td colSpan="2" className="border-left-0">
                                                        <input type="button" className="transparent border-0 color-4b no-outline " onClick={() => this.calcInp(0)} value="0" placeholder="0" />
                                                    </td>
                                                </tr>
                                                <tr className="park_table_row" onClick={() => this.hideTab2(!this.state.status)} >
                                                    <td colSpan="3" >
                                                        <input type="button" className="secondry-theme-background border-0 color-4b no-outline btn-enter " value="Enter" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
const connectedCardPayment = connect(mapStateToProps)(NormalKeypad);
export { connectedCardPayment as NormalKeypad };