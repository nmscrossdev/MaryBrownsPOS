import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import Language from '../_components/Language';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { chunkArray } from '../ALL_localstorage';
import { isMobileOnly } from "react-device-detect";
import FeeAndDiscount from './views/m.FeeAndDiscount';
import $ from 'jquery';

const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <tr key={index} className={props.className1} style={props.style}>
            {num.map((nm, i) => {
                return (
                    (isMobileOnly == true) ?
                        <td onClick={() => props.onClick(nm)} key={i} colSpan={nm == 0 ? props.colSpan : ''}>
                            {nm}
                        </td>
                        :
                        <td key={i} className={props.className2} colSpan={nm == 0 ? props.colSpan : ''}>
                            <button type={props.type} value={nm} placeholder={nm} onClick={() => props.onClick(nm)} className={props.className1} >{nm}</button>
                        </td>
                )
            })

            }
        </tr>
    ))

class CustomerAddFee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            extra_product: [],
            amount: '',
            add_title: '',
            pinNumberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handle = this.handle.bind(this);
        this.calcInp = this.calcInp.bind(this);
        this.rmvInp = this.rmvInp.bind(this);
        this.AddFee = this.AddFee.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handle(e) {
        const { value } = e.target;
        $('#txtdisAmount').focus();
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (value === '' || re.test(value)) {
            this.setState({ amount: value })
        }
    }

    SetValue(eleT, val) {
        var v1 = this.state.amount + val;
        eleT.html(eleT.html().replace(' ', '') + val + ' ');
        this.setState({ amount: v1 })
    }

    calcInp(input) {
        var elemJ = jQuery('#txtdisAmount');
        if (this.state.emptyPaymentFlag || elemJ.html() == "0") {
            elemJ.html('');
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
                if (elemJ.html().includes(".")) {
                } else {
                    this.SetValue(elemJ, '.');
                }
                break;
        }
    }

    rmvInp() {
        var str = $('#txtdisAmount').html();
        str = str.substring(0, str.length - 2);
        $('#txtdisAmount').html(str + ' ');
        if (str == "" || str == " ") {
            $('#txtdisAmount').html('0');
        } else { }
        this.setState({ amount: str })
    }

    AddFee() {
        const { amount, add_title } = this.state;
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        cartlist = cartlist == null ? [] : cartlist;
        var new_title = add_title !== '' ? add_title :LocalizedLanguage.customFee;
        var title = new_title;
        var new_array = [];
        var i = 0;
        if (cartlist.length > 0) {
            cartlist.map(item => {
                if (typeof item.product_id == 'undefined') {
                    if (item.Price !== null) {
                        new_array.push(item)
                    }
                }
            })
        }

        if (amount != 0) {
            if (new_array.length > 0) {
                var withNoDigits = new_array.map(item => {
                    var remveNum = item.Title.replace(/[0-9]/g, '')
                    return remveNum;
                });
                withNoDigits.length > 0 && withNoDigits.map((item, index) => {
                    if (item == title) {
                        var incr = index + 1
                        new_title = item + incr;
                    } else {
                        new_title = new_title
                    }
                })
            }
            var data = {
                Title: new_title,
                Price: parseFloat(amount)
            }
            this.setState({ amount: '' })
            cartlist.push(data)
            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                var subTotal = parseFloat(list.subTotal + data.Price).toFixed(2);
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: parseFloat(Number(subTotal) + Number(list.tax)),
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                location.reload();
            }
            location.reload();
        }
    }

    componentDidMount() {
        setTimeout(function () {
            $('#popup_oliver_add_fee').on('shown.bs.modal', function () {
                $('#txtdisAmount').focus();
            });
        }.bind(this), 3000)
        setTimeout(() => {
            var getWindowHeight = $(window).height() - (322 + $(".appBottomOnboarding").height());
            $(".calculatorSetHeight").height(getWindowHeight / 5);
        }, 1000);
    }

    render() {
        const { amount, add_title } = this.state;
        return (
            (isMobileOnly == true) ?
                <FeeAndDiscount
                    {...this.props}
                    {...this.state}
                    calcInp={this.calcInp}
                    LocalizedLanguage={LocalizedLanguage}
                    handleChange={this.handleChange}
                    handle={this.handle}
                    rmvInp={this.rmvInp}
                    NumInput={NumInput}
                    AddFee={this.AddFee}
                    type="checkout"
                />
                :
                <div tabIndex="-1" id="popup_oliver_add_fee" className="modal modal-wide modal-wide1 fade">
                    <div className="modal-dialog" id="dialog-midle-align">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                                    <img src="assets/img/Close.svg" />
                                </button>
                                <h4 className="modal-title">{LocalizedLanguage.addFee}</h4>
                            </div>
                            <div className="modal-body p-0">
                                <form className="clearfix">
                                    <div className="col-sm-12 p-0">
                                        <div className="panel-product-list" id="panelCalculatorpopUp">
                                            <div className="panel panelCalculator">
                                                <div className="panel-body p-0">
                                                    <table className="table table-bordered shopViewPopUpCalculator">
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-right br-1 bl-1 bt-0">
                                                                    <div className="input-group discount-input-group">
                                                                        <input className="form-control" name="add_title" value={add_title} placeholder={LocalizedLanguage.customFee} type="text" onChange={this.handleChange} />
                                                                    </div>
                                                                </td>
                                                                <td className="text-right br-1 bl-1 bt-0">
                                                                    <div className="input-group discount-input-group">
                                                                        <input type="text" id="txtdisAmount" className="form-control text-right" onChange={this.handle} value={amount} text='' aria-describedby="basic-addon1" />
                                                                    </div>
                                                                </td>
                                                                <td className="text-center pointer bt-0" onClick={() => this.rmvInp()}>

                                                                    <button type="button" className="btn btn-default calculate">
                                                                        <img width="36" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjA1OSAzMS4wNTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjA1OSAzMS4wNTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMC4xNzEsMTYuNDE2SDAuODg4QzAuMzk4LDE2LjQxNiwwLDE2LjAyLDAsMTUuNTI5YzAtMC40OSwwLjM5OC0wLjg4OCwwLjg4OC0wLjg4OGgyOS4yODMgICAgYzAuNDksMCwwLjg4OCwwLjM5OCwwLjg4OCwwLjg4OEMzMS4wNTksMTYuMDIsMzAuNjYxLDE2LjQxNiwzMC4xNzEsMTYuNDE2eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgoJPGc+CgkJPHBhdGggZD0iTTE2LjAxNywzMS4wNTljLTAuMjIyLDAtMC40NDUtMC4wODMtMC42MTctMC4yNUwwLjI3MSwxNi4xNjZDMC4wOTgsMTUuOTk5LDAsMTUuNzcsMCwxNS41MjkgICAgYzAtMC4yNCwwLjA5OC0wLjQ3MSwwLjI3MS0wLjYzOEwxNS40LDAuMjVjMC4zNTItMC4zNDEsMC45MTQtMC4zMzIsMS4yNTUsMC4wMmMwLjM0LDAuMzUzLDAuMzMxLDAuOTE1LTAuMDIxLDEuMjU1TDIuMTYzLDE1LjUyOSAgICBsMTQuNDcxLDE0LjAwNGMwLjM1MiwwLjM0MSwwLjM2MSwwLjkwMiwwLjAyMSwxLjI1NUMxNi40OCwzMC45NjgsMTYuMjQ5LDMxLjA1OSwxNi4wMTcsMzEuMDU5eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="></img>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                            <NumInput colSpan="2" type="button" onClick={this.calcInp} numbers={this.state.pinNumberList} className2="td-calc-padding br-1 bl-1" className1="btn btn-default calculate" />

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer p-0">
                                <button type="button" onClick={() => this.AddFee()} className="btn btn-primary btn-block h66">{LocalizedLanguage.addFee}</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}
const connectedCustomerAddFee = connect(mapStateToProps)(CustomerAddFee);
export { connectedCustomerAddFee as CustomerAddFee };