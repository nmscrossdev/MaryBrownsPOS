import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import { chunkArray } from '../ALL_localstorage';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import FeeAndDiscount from '../_components/views/m.FeeAndDiscount';
import { isMobileOnly, isIOS } from "react-device-detect";

const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <tr key={index} className={props.className1} style={props.style} >
            {num.map((nm, i) => {
                return (
                    (isMobileOnly == true) ?
                        <td onClick={() => props.onClick(nm)} key={i} colSpan={nm == 0 ? props.colSpan : ''}>
                            {nm}
                        </td>
                        :
                        <td key={i} className={nm == 0 ? props.className3 : nm == '.' ? 'border-top-1' : ''} colSpan={nm == 0 ? props.colSpan : ''}>
                            <input type={props.type} value={nm} placeholder={nm} onClick={() => props.onClick(nm)} className={props.className2} />
                        </td>
                )
            })

            }
        </tr>
    ))

class ProductAddFee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            extra_product: [],
            amount: '',
            add_title: '',
            pinNumberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0],
            isfeeTaxable:false
        }
        this.calcInp = this.calcInp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handle = this.handle.bind(this);
        this.rmvInp = this.rmvInp.bind(this);
        this.AddFee = this.AddFee.bind(this);
        this.setIsTaxable=this.setIsTaxable.bind(this);
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
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (v1 === '' || re.test(v1)) {
        this.setState({ amount: v1 })
        }
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
    setIsTaxable(){
        var val=$('#chkIsTaxable').prop("checked");       
        //this.setState({isfeeTaxable: this.state.isfeeTaxable==false?true:false});
        this.state.isfeeTaxable=val;
        console.log("isfeeTaxable",this.state.isfeeTaxable)
    }
    AddFee() {
        const { amount, add_title ,isfeeTaxable} = this.state;
        const { dispatch } = this.props;
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        cartlist = cartlist == null ? [] : cartlist;
        var new_title = add_title !== '' ? add_title : LocalizedLanguage.customFee;
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
                Price: parseFloat(amount),
                old_price: this.state.isfeeTaxable==true && parseFloat(amount),
                isTaxable:this.state.isfeeTaxable,
                TaxStatus: this.state.isfeeTaxable==true?"taxable":"none",               
                TaxClass:'',
                quantity:1
            }
            this.setState({ amount: '' })
            cartlist.push(data)
            dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                var subTotal = parseFloat(list.subTotal + data.Price).toFixed(2);
                var tax= parseFloat(list.tax +  data.Price).toFixed(2);
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: parseFloat((subTotal) + parseFloat(list.tax)),
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption,

                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                // location.reload();
            }
            $('.close').trigger('click')
            //   location.reload();
            this.setState({ add_title: '' })
            $('#id_add_notes').removeClass('active in')
            $('#notefeeActive').removeClass('active')
            $('.nav-flip-switch').removeClass('flipped')

        }
    }

    componentDidMount() {
        if (isMobileOnly) {    //for fee cal keypad height set 
            setTimeout(() => {
                var getWindowHeight = $(window).height() - (322 + $(".appBottomOnboarding").height());
                $(".calculatorSetHeight").height(getWindowHeight / 5);
            }, 20);
        }
        setTimeout(function () {
            $('#popup_oliver_add_fee').on('shown.bs.modal', function () {
                $('#txtdisAmount').focus();
            });
        }.bind(this), 3000)
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
                />
                :
                <div className="view notes" id="quick-fee">
                    <div className="employee-details employee-details_auto w-100">
                        {/* <div className="employee-short-image close-note-link"> */}
                        {/* <i className="icon icon-left icon-css-override push-top-3"></i> */}
                        {/* <i className="icon icon-css-override icons8-undo push-top-3 fs30 mr-3"></i>
                            {LocalizedLanguage.addFee} */}

                        <form className="form-addon px-3 w-100">
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.label}</div>
                                    <input type="text" className="form-control" name="add_title" value={add_title} placeholder={LocalizedLanguage.customFeelabel} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="input-group-checkbox">
                                    <div className="input-group-text">{LocalizedLanguage.customFeeTaxable}</div>
                                    <input type="checkbox" className="form-checkbox" id="chkIsTaxable" onClick={(e)=>this.setIsTaxable()} />
                                    <span className="checkmark"></span>
                                </div>
                            </div>
                        </form>
                        {/* </div> */}
                    </div>
                    <div className="form">
                        <div className="add_fee_form shop-view-tbl" id="calculator">
                            <div className="panel-body p-0">
                                <div className="box__block_calculator">
                                    <table className="table table-responsive table-layout-fixed">
                                        <tbody>
                                            {/* <tr className="add-fee-row">
                                    <td colSpan="3">
                                        <input className="transparent border-0 color-4b no-outline add_fee_input text-center
                                        " name="add_title" value={add_title} placeholder={LocalizedLanguage.customFee} type="text" onChange={this.handleChange} />
                                    </td>
                                </tr> */}
                                            <tr className="add-fee-row">
                                                <td colSpan="2">
                                                    <input type="text" id="txtdisAmount" className="transparent border-0 color-4b no-outline add_fee_input text-center" onChange={this.handle} value={amount} text='' />
                                                </td>

                                                {/* <button className="button icon icon-back-left-2"></button> */}
                                                <td onClick={() => this.rmvInp()}>
                                                    <i className="icon icons8-back-arrow fs36 center-center mx-auto"></i>
                                                </td>
                                            </tr>
                                            <NumInput colSpan="2" type="button" onClick={this.calcInp} numbers={this.state.pinNumberList} className2="transparent border-0 color-4b no-outline add_fee_input" className1="add-fee-row" className3="border-left-0 border-top-1" />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="box-logout clearfix">
                        <button className="btn btn-block btn-primary checkout-items text-center close-note-link" onClick={() => this.AddFee()}>
                            {LocalizedLanguage.addFee} 
                         </button>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}
const connectedProductAddFee = connect(mapStateToProps)(ProductAddFee);
export { connectedProductAddFee as ProductAddFee };