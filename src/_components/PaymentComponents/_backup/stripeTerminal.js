import React from 'react';
import { connect } from 'react-redux';
import {  isMobileOnly, isIOS } from "react-device-detect";

class StripePayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            card_number: '',
            expairy_date: '',
            cvv_number: '',
        }
        this.handleCardChange = this.handleCardChange.bind(this)
    }

    stripPayment() {
     }

    hideTab(st) {
        setTimeout(function () {
            boxHeight();
        }, 50);
        if (st == true) {
            this.props.activeDisplay(`${this.props.code}_true`)
        } else {
            this.props.activeDisplay(false)
        }
        this.setState({
            status: st,
        })
        if(this.props.type == 'refund'){
            this.props.hideCashTab(false) 
         } 
    }

    hideTab2(st) {
        this.setState({ status: st })
        this.props.activeDisplay(false)
        if(this.props.type == 'refund'){
            this.props.hideCashTab(false) 
         } 
    }

    handleCardChange(e) {
    }

    render() {
        const { status } = this.state;
        const { color, Name, code, pay_amount, styles } = this.props;
        return (
            (isMobileOnly == true) ?
            <button type="submit" style={{ borderLeftColor: color , marginBottom: 15 }} className="btn btn-default btn-lg btn-block btn-style-02" onClick="">{Name}</button>
           :
            status !== true ?
                <div style={{ display: styles }} onClick={() => this.hideTab(!status)} className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0">
                    <div className="section">
                        <div className="" data-isopen="">
                            <div className="pointer">
                                <div style={{ borderColor: color }} className="d-flex box-flex box-flex-border-left box-flex-background-stripe border-dynamic">
                                    <div className="box-flex-text-heading">
                                        <h2>{Name}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="white-background box-flex-shadow box-flex-border mb-2 round-8 d-none overflowHidden overflow-0">
                    <div className="section">
                        <div className="">
                            <div  style={{ backgroundColor:color }} className="box__block_caption stripe-background b-0 round-top-corner" data-title="Stripe">
                                <img onClick={() => this.hideTab(!status)} src="../assets/img/cross_white.svg" className="accordion_close" />
                            </div>
                            <div className="overflowscroll stripe_body" id="">
                                <div className="p-3 clearfix">
                                    <div className="gray-background round-8 mb-3 overflowHidden">
                                        <div className="d-flex d-column box-flex line-height-30">
                                            <div className="col-sm-12">
                                                <div className="block__box_text_hint capital">
                                                    Card Number
                                                                                        </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <input maxLength={19} placeholder="0000-0000-0000-0000" name="card_number" autoFocus="autoFocus" value={this.state.card_number} onChange={this.handleCardChange} type="text" className="gray-background border-0 color-4b text-center w-100 p-0 no-outline enter-order-amount" autoComplete='off' />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="gray-background round-8 mb-3 overflowHidden">
                                        <div className="d-flex d-column box-flex line-height-30">
                                            <div className="col-sm-12">
                                                <div className="block__box_text_hint capital">
                                                    Date
                                                                                       </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="block__box_text_price">09-20</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="gray-background round-8 mb-3 overflowHidden">
                                        <div className="d-flex d-column box-flex line-height-30">
                                            <div className="col-sm-12">
                                                <div className="block__box_text_hint capital">
                                                    CVV
                                                                                        </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="block__box_text_price">781</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="box__block_button stripe-background b-0 round-bottom-corner">
                                <button  style={{ backgroundColor:color }} onClick={() => this.hideTab2(!status)} type="button" className="btn transparent color-white fs24 w-100 no-outline pt-4 pb-4">Add Payment</button>
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
const connectedCardPayment = connect(mapStateToProps)(StripePayment);
export { connectedCardPayment as StripePayment };