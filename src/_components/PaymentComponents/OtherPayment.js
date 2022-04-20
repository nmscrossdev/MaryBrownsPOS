import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly, isIOS } from "react-device-detect";
import ActiveUser from '../../settings/ActiveUser';

class OtherPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paidAmount: '',
            buttonClicked:false
        }

    }

    hideTab(code) {
        if(this.state.buttonClicked==false){ //check for bouble button clicked          
            this.state.buttonClicked=true;
            const { closingTab, pay_amount } = this.props;
            closingTab(true);
            setTimeout(function () {
                pay_amount(code);

            }, 500)
            setTimeout(() => { //enabled after 2 second
                this.state.buttonClicked=false
            }, 2000);
            if (this.props.type == 'refund') {
                this.props.hideCashTab(false)
            }
        }
    }

    render() {
        const { color, Name, code, styles } = this.props;
        return (
            (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true)?                        
                <button className="btn btn-light text-dark btn-block h-60 shadow-none fz-14 mb-15" onClick={() => this.hideTab(code)}>{Name}</button>
            :
            (isMobileOnly == true) ?
                <button type="submit" style={{ borderLeftColor: color, marginBottom: 15 }} className="btn btn-default btn-lg btn-block btn-style-02" onClick={() => this.hideTab(code)}>{Name}</button>
                :
                (ActiveUser.key.isSelfcheckout == true) ?
                    <div className="row">
                        <button onClick={() => this.hideTab(code)}>{Name}</button>
                    </div>

                    // <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => this.hideTab(code)}>{Name}</button>
                :
                <div style={{ display: styles }} className="white-background box-flex-shadow box-flex-border mb-2 round-8 pointer d-none overflowHidden no-outline w-100 p-0 overflow-0">
                    <div className="section">
                        <div className="accordion_header" data-isopen="false">
                            <div className="pointer">
                                <div style={{ borderColor: color }} id="others" value="other" name="payments-type" onClick={() => this.hideTab(code)} className="d-flex box-flex box-flex-border-left box-flex-background-others border-dynamic">
                                    <div className="box-flex-text-heading">
                                        <h2>{Name}</h2>
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

const connectedCardPayment = connect(mapStateToProps)(OtherPayment);
export { connectedCardPayment as OtherPayment };