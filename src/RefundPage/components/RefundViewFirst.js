import React from 'react';
import { connect } from 'react-redux';
import { refundActions } from '../';
import { default as NumberFormat } from 'react-number-format'
import { Markup } from 'interweave';
import { get_UDid } from '../../ALL_localstorage';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import MobileRefundFirstView from '../views/m.RefundFirstView';
import $ from 'jquery';
import { RefundViewThird } from './RefundViewThird';
import { isMobileOnly, isIOS } from "react-device-detect";
import WarningMessage from '../../_components/views/m.WarningMessage';
import {getInclusiveTaxType} from '../../_components/CommonModuleJS'

class RefundViewFirst extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refund_subtotal: 0,
            refund_tax: 0,
            refund_total: 0,
            incrementClick: 0,
            single_Order_list: (typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null,
            refundPayment: localStorage.getItem("oliver_refund_order_payments") ? JSON.parse(localStorage.getItem("oliver_refund_order_payments")) : null,
            extensionOrderNote : []

        }
        this.handleRefundingItems = this.handleRefundingItems.bind(this);
        this.decreaseitemRefundQty = this.decreaseitemRefundQty.bind(this);
        this.increaseitemRefundQty = this.increaseitemRefundQty.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
        if ((typeof localStorage.getItem("getorder") !== 'undefined') && JSON.parse(localStorage.getItem("getorder"))) {
            var customFee = JSON.parse(localStorage.getItem("getorder"));
            if (customFee.order_custom_fee && customFee.order_custom_fee.length > 0) {
                this.prepairListItems(customFee);
            }
        }
    }

    componentWillUnmount() {
        this.props.onRef(null)
    }

    handleRefundingItems() {
       
        const { single_Order_list } = this.state;
        var refund_subtotal = 0;
        var refund_tax = 0;
        var refund_total = 0;
        var cash_round = single_Order_list && single_Order_list.cash_rounding_amount ? single_Order_list.cash_rounding_amount : 0;
        var total_refund_amount = single_Order_list && single_Order_list.total_amount;
        var cash_rounding_amount = single_Order_list && single_Order_list.cash_rounding_amount;
        var set_total_quantity_for_refund = 0;
        var get_total_quantity_for_refund = 0;
        var qty2 = 0;
        single_Order_list && single_Order_list.line_items.map(qty_is => {
            get_total_quantity_for_refund += qty_is.quantity
        })
        get_total_quantity_for_refund = get_total_quantity_for_refund + single_Order_list.quantity_refunded;
        var taxInclusiveName= getInclusiveTaxType(single_Order_list.meta_datas);
        $(".refunndingItem").each(function () {
            var item_id = $(this).attr('data-id');
            var quantity = parseInt($(`#counter_show_${item_id}`).text());
            var price = parseFloat($(`#refunditem_${item_id}`).attr('data-amount'));
            var tax = parseFloat($(`#refunditem_${item_id}`).attr('data-perprdtax'));
            var qty = $(this).attr('data-quantity');
            qty2 += qty
            set_total_quantity_for_refund += quantity;

            //calculation part
            refund_tax += (parseFloat(tax) * quantity);
            refund_subtotal += (parseFloat(price) * quantity);   
            if(taxInclusiveName && taxInclusiveName !==""){ //in inclusive tax need to add tax intosub total
                refund_subtotal +=refund_tax;
            }      

            //calculation part     
        });
        refund_total = (parseFloat(refund_subtotal) + parseFloat(taxInclusiveName ==""? refund_tax:0) ); //added tax for exclusive tax
        if (set_total_quantity_for_refund == get_total_quantity_for_refund) {
            refund_total = parseFloat(single_Order_list.total_amount - single_Order_list.refunded_amount).toFixed(2);
        } else if (refund_total + (cash_rounding_amount) == total_refund_amount) {
            refund_total = refund_total + (cash_rounding_amount)
        }
        this.props.refundingAmount(refund_total);
        this.setState({
            refund_subtotal: refund_subtotal,
            refund_tax: refund_tax,
            refund_total: refund_total,
        });
    }

    toggleRefundPanel(item_id) {
        this.setState({ incrementClick: 1 });
        $(`#refundpanel_${item_id}`).toggle();
        $(`#refunditem_${item_id}`).toggleClass('refunndingItem');
        this.handleRefundingItems();
    }

    increaseitemRefundQty(item_id) {
        var _inc = this.state.incrementClick;
        var count = parseFloat($(`#counter_show_${item_id}`).text());
        var maxQty = parseFloat($(`#check_counter_${item_id}`).text());
        //console.log("increaseitemRefundQty", '_inc=>',_inc, "count=>", count, "maxQty=>", maxQty);
       // if (_inc && _inc < maxQty) {
            _inc = _inc + 1
            this.setState({ incrementClick: _inc })
       // }
        if (count < maxQty) {
            count++;
            //console.log("count=>", count);
            $(`#counter_show_${item_id}`).text(count);
            this.handleRefundingItems();
        }
        if (_inc > maxQty) {
            //console.log("_inc=>", _inc, maxQty, this.state.incrementClick);
            this.setState({ incrementClick: maxQty})
            this.props.min_max_add(LocalizedLanguage.refundPopupMsg);
        }
        
    }

    decreaseitemRefundQty(item_id) {
        var count = parseFloat($(`#counter_show_${item_id}`).text());
        this.setState({ incrementClick: this.state.incrementClick - 1 })
        //console.log("decreaseitemRefundQty", "count=>", count)
        if (count > 1) {
            count--;
            //console.log("count=>", count);
            $(`#counter_show_${item_id}`).text(count);
            this.handleRefundingItems();
        }
        if (this.state.incrementClick == 1 || this.state.incrementClick <= 0) {
            //console.log("this.state.incrementClick=>", this.state.incrementClick);
            this.setState({ incrementClick: 1})
            this.props.min_max_add(LocalizedLanguage.refundZeroPaymentMsg)
        }
    }
    
     // add extensio notes to order notes 
     addNotesToRefundOrderNotes = (data)=>{
        if(data && data.note){
            this.state.extensionOrderNote.push(data.note)
        }
    }

    refund(order_id, CashRound, refundItems) {
        const { single_Order_list } = this.state;
        var getorder = (isMobileOnly == true) ? sessionStorage.getItem("OrderDetail") ? JSON.parse(sessionStorage.getItem("OrderDetail")) : single_Order_list : single_Order_list;
        //console.log("getorder", getorder)
        var managerData = JSON.parse(localStorage.getItem('user'));
        var refund_subtotal = 0;
        var refund_tax = 0;
        var refund_total = 0;
        var items = (isMobileOnly == true) ? refundItems : new Array();
        var payments = new Array();
        var total_amount = parseFloat(getorder.total_amount - getorder.refunded_amount).toFixed(2);
        var new_last_amount_is = 0 
        var order_notes = []

        $(".refunndingItem").each(function () {
            var item_id = $(this).attr('data-id');
            var quantity = parseInt($(`#counter_show_${item_id}`).text());
            var price = parseFloat($(`#refunditem_${item_id}`).attr('data-amount'));
            var tax = parseFloat($(`#refunditem_${item_id}`).attr('data-perprdtax'));
            var multiTax = $(`#refunditem_${item_id}`).attr('data-permulttax');
            var totalQty = parseInt($(`#refunditem_${item_id}`).attr('data-quantity'));

            var updateMultiTax = [];
            if (multiTax) {
                //console.log("multiTax", JSON.parse(multiTax))
                //console.log("totalQty", totalQty)
                var taxArray = multiTax && JSON.parse(multiTax) && JSON.parse(multiTax).total;
                if (taxArray) {
                    Object.keys(taxArray).forEach(function (key) {
                        //console.log("taxArray[key]", taxArray[key], typeof taxArray[key])
                        //console.log("quantity", quantity)
                        var cal = parseFloat(taxArray[key]) / totalQty;
                        //console.log("cal", cal, cal*quantity )
                        updateMultiTax.push({ [key]: cal * quantity });
                    })
                }
            }
            //console.log("updateMultiTax", updateMultiTax)

            //create the refund items array
            items.push({
                'Quantity': quantity,
                'amount': price * quantity,
                'tax': tax * quantity,
                'item_id': item_id,
                'taxes': updateMultiTax && updateMultiTax.length > 0 ? updateMultiTax : tax * quantity,
            });
            //calculation part
            refund_subtotal += (parseFloat(price) * quantity);
            refund_tax += (parseFloat(tax) * quantity);
            // refund_total += ( refund_subtotal + refund_tax );
            //calculation part    
        });
        refund_total = (parseFloat(refund_subtotal) + parseFloat(refund_tax));
        // refund_total = total_amount;
        var _paymentNotes = [];
        if (localStorage.oliver_refund_order_payments) {
            var date = new Date();
            var pay = JSON.parse(localStorage.getItem("oliver_refund_order_payments"));
            JSON.parse(localStorage.getItem("oliver_refund_order_payments")).forEach(paid_payments => {
                if (order_id == paid_payments.order_id) {
                    payments.push({
                        'amount': paid_payments.payment_amount,
                        'payment_type': paid_payments.payment_type,
                        'type': paid_payments.payment_type,
                        'payment_date': `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
                        'description': paid_payments.description
                    });

                    //  add order notes for payments type and transaction id 
                    var transactionStr = paid_payments.transection_id && paid_payments.transection_id !== 0 ? `(${(paid_payments.transection_id).toString()})` : ""
                    _paymentNotes.push(`${paid_payments.payment_type}${transactionStr}`)

                }
            });

            if (_paymentNotes.length > 0) {
                order_notes.push({
                    note_id: '',
                    note: `Refund payment done with: ${_paymentNotes.join(", ")}`,
                    is_customer_note: 0,
                    is_extension_note: true
                })
            }


        }

         // add extension's notes for order to order_notes field
        if (this.state.extensionOrderNote && this.state.extensionOrderNote.length) {
            this.state.extensionOrderNote.map((itm, ind) => {
                order_notes.push({
                    note_id: '',
                    note: itm,
                    is_customer_note: true,
                })
            })

        }

        var last_length_of_payments = payments.length - 1;
        var new_amount = 0;
        payments.map(itemP => {
            new_amount += parseFloat(itemP.amount)
        })
        if (CashRound == 0) {
            if (new_amount > total_amount) {
                var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                new_last_amount_is = new_amount - total_amount;
                payments[last_length_of_payments].amount = parseFloat(last_amount_is - new_last_amount_is).toFixed(2);
                refund_total = total_amount;
            } else if (new_amount == total_amount) {
                var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                payments[last_length_of_payments].amount = parseFloat(last_amount_is).toFixed(2);
                refund_total = total_amount;
            } else {
                var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                payments[last_length_of_payments].amount = parseFloat(last_amount_is).toFixed(2);
                refund_total = new_amount;
            }

        } else {
            if (new_amount > total_amount) {
                var last_amount_is = parseFloat(payments[last_length_of_payments].amount)
                new_last_amount_is = (new_amount - total_amount);
                payments[last_length_of_payments].amount = parseFloat(last_amount_is - new_last_amount_is).toFixed(2);
                refund_total = total_amount;
            } else if (new_amount == total_amount) {
                refund_total = total_amount;
            } else {
                if (new_amount + CashRound == total_amount) {
                    payments[last_length_of_payments].amount = new_amount + CashRound;
                    refund_total = total_amount;
                } else if (new_amount - CashRound == total_amount) {
                    payments[last_length_of_payments].amount = new_amount - CashRound;
                    refund_total = total_amount;
                } else {
                    refund_total = new_amount;
                }
            }
        }
        var order_meta=[];
        var location_id = localStorage.getItem('Location');
       
        var manager_name = '';
        if (managerData && managerData.display_name !== " " && managerData.display_name !== 'undefined') {
            manager_name = managerData.display_name;
        } else {
            manager_name = managerData !== null ? managerData.user_email : ''
        }

        order_meta.push({
            "manager_id": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserID') : localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined ? JSON.parse(localStorage.getItem('user')).user_id : "",
            "manager_name": localStorage.getItem('demoUser') && localStorage.getItem('demoUser') == "true" ? localStorage.getItem('VisiterUserEmail') : manager_name,
            "location_id": location_id,
            "register_id": localStorage.getItem('register'),
            "warehouse_id": localStorage.getItem('WarehouseId') ? localStorage.getItem('WarehouseId') : 0,
        })
        var UID = get_UDid('UDID');
        var requestData = {
            'order_id': order_id,
            'refund_tax': refund_tax,
            'refund_amount': parseFloat(refund_total).toFixed(2),
            'RefundItems': items,
            'order_refund_payments': payments,
            'udid': UID,
            'customer_email': $("#hidden_customer_email_id").text(),
            'manager_id': managerData.user_id,
            'manager_email': managerData.user_email,
            'refund_cash_rounding': CashRound,
            'register_id' : localStorage.getItem('register'),
            "order_notes" : order_notes,
            "order_meta": order_meta
        }
        //console.log("requestData", requestData)
        //console.log("requestData", JSON.stringify(requestData))
        //call the action function   
        this.props.dispatch(refundActions.refundOrder(requestData));
    }

    prepairListItems(customFee) {
        customFee.order_custom_fee.map(items => {
            customFee.line_items.push(items);
        })
        this.setState({ single_Order_list: customFee })
    }

    render() {
        const { single_Order_list } = this.state;
        var getorder = single_Order_list;
        var total_amount = 0;
         var taxInclusiveName= getInclusiveTaxType(getorder.meta_datas);
        
         if (this.props.payments.length > 0) {
            this.props.payments.map(amount => {
                total_amount += parseFloat(amount.payment_amount);
            })
        }
        if (isMobileOnly == true && this.props.refundOrderId && this.props.refundItems) {
            this.refund(this.props.refundOrderId, this.props.refundCashRound, this.props.refundItems)
        }
        return (
            (isMobileOnly == true) ? //||  {...this.props}
                <div>
                    {this.props.mobileRefundActivePage === 'refundpayment' ?
                        <RefundViewThird
                            {...this.props}
                            {...this.state}
                            min_max_add={this.props.min_max_add}
                            addPayment={this.props.addPayment}
                            env_Type={localStorage.getItem('env_type')}
                            close_Msg_Modal={this.props.close_Msg_Modal}
                        />
                        :
                        <MobileRefundFirstView
                            {...this.props}
                            {...this.state}
                            payments={this.props.payments.length}
                            //single_Order_list={(typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null}
                            increaseitemRefundQty={this.increaseitemRefundQty}
                            decreaseitemRefundQty={this.decreaseitemRefundQty}
                            handleRefundingItems={this.handleRefundingItems}
                            toggleRefundPanel={this.toggleRefundPanel}
                        />}
                </div>

                :
                <div className="col-lg-3 col-sm-4 col-xs-4 pl-0">
                    <div className="panel panel-default panel-right-side r0 br-1 bb-0">
                        <div className="panel-heading bg-white">
                            {(typeof getorder.orderCustomerInfo !== 'undefined') && getorder.orderCustomerInfo != null ? getorder.orderCustomerInfo.customer_name !== " " ? getorder.orderCustomerInfo.customer_name : getorder.orderCustomerInfo.customer_email : "---"}
                            <p style={{ display: "none" }} id="hidden_customer_email_id">{(typeof getorder.orderCustomerInfo !== 'undefined') && getorder.orderCustomerInfo != null ? getorder.orderCustomerInfo.customer_email : ""}</p>
                        </div>
                        <div className="panel-body p-0 overflowscroll bg-white" id="cart_product_list">
                            <div className="table-responsive">
                                <table className="table ListViewCartProductTable">
                                    <colgroup>
                                        <col width="*" />
                                        <col width="70" />
                                        <col width="50" />
                                    </colgroup>
                                    {/* display all order items here */}
                                    {(typeof getorder.line_items !== 'undefined') && getorder.line_items !== null ?
                                        getorder.line_items && getorder.line_items.map((item, index) => {
                                            return (
                                                <tbody key={index}>
                                                    {/* <td><table className="table mb-0"><tbody> */}
                                                    <tr key={item.line_item_id} id={`refunditem_${item.line_item_id}`} title={item.name} data-id={item.line_item_id} className="prdtr" price={item.total} data-amount={item.total / item.quantity} data-productid={item.product_id} data-varproductid={item.variation_id} data-orderid="6747" data-quantity={item.quantity} data-taxrate={item.total_tax} data-perprdtax={item.total_tax / item.quantity} data-permulttax={item.Taxes}>
                                                        {/* <td> {item.quantity + item.quantity_refunded} </td> */}
                                                        <td align="left">
                                                            <Markup content={item.name} />
                                                            {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                            {item.ProductSummery ?<div style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{ item.ProductSummery.toString()}</div>:null}
                                                            <span className="comman_subtitle"></span>
                                                        </td>
                                                        <td align="right">
                                                            <NumberFormat value={item.total - item.amount_refunded +(taxInclusiveName !==""?item.subtotal_tax :0)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                        </td>
                                                        <td>
                                                            {/* item.total - item.amount_refunded > 0 */}
                                                            {item.quantity - Math.abs(item.quantity_refunded) > 0 ?
                                                                <div className="refund_radio_button" data-id={item.line_item_id}>
                                                                    <label className="customcheckbox">
                                                                        <input type="checkbox" onChange={() => this.toggleRefundPanel(item.line_item_id)} />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </div>
                                                                : <div> <label className="customcheckbox">
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                                </div>
                                                            }
                                                        </td>
                                                    </tr>
                                                    {/* display refund panel */}
                                                    <tr key={`panel_${item.line_item_id}`} id={`refundpanel_${item.line_item_id}`} style={{ display: "none" }}>
                                                        <th colSpan="4" className="bt-0">
                                                            <div className="btn-group btn-group-justified refund-range" role="group" aria-label="">
                                                                <div className="btn-group" role="group">
                                                                    <button type="button" className="btn btn-default fs29" onClick={() => this.decreaseitemRefundQty(item.line_item_id)}>
                                                                        <i className="icon icon-minus icon-css-override pointer push-top-5"></i></button>
                                                                </div>
                                                                <div className="btn-group" role="group">
                                                                    <button type="button" className="btn btn-default" id="countable">
                                                                        <input className="blank_input" type="hidden" size="25" value="0" id="count" />
                                                                        <span id={`counter_show_${item.line_item_id}`}>1</span>
                                                                        /
<span id={`check_counter_${item.line_item_id}`}>{item.quantity + item.quantity_refunded}</span>
                                                                    </button>
                                                                </div>
                                                                <div className="btn-group" role="group">
                                                                    <button type="button" className="btn btn-default fs29" onClick={() => this.increaseitemRefundQty(item.line_item_id)}> <i className="icon icon-plus icon-css-override pointer push-top-5"></i></button>
                                                                </div>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    {/* display refund panel */}
                                                    {/* </tbody>
</table>
</td> */}
                                                </tbody>
                                            )
                                        })
                                        : null
                                    }
                                    {/* display all order items here */}
                                    {/* </tbody> */}
                                </table>
                            </div>
                        </div>
                        <div className="panel-footer p-0 bg-white">
                            <div className="table-calculate-price">
                                <table className="table table ShopViewCalculator mb-0">
                                    <tbody>
                                        <tr>
                                            <th className="bt-0">{LocalizedLanguage.subTotal}</th>
                                            <td align="right">
                                                <NumberFormat value={this.state.refund_subtotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                {/* <span className="value">{parseFloat(this.state.refund_subtotal).toFixed(2)}</span> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th> {LocalizedLanguage.tax +taxInclusiveName}
                                                <span className="value pull-right"> {parseFloat(this.state.refund_tax).toFixed(2)} </span>
                                            </th>
                                            <th className="bl-1" align="right"> {LocalizedLanguage.discount}:
<span className="value pull-right" style={{ color: '#46A9D4' }}> N/A </span>
                                            </th>
                                        </tr>
                                        {this.props.payments.length > 0 ?
                                            <tr id="paymentTr">
                                                <th>
                                                    <div className="relDiv show_payment_box">
                                                        <span className="value pointer" style={{ color: '#46A9D4' }} id="totalPayment"> {LocalizedLanguage.payments}</span>
                                                        <div className="absDiv">
                                                            <div className="payment_box">
                                                                <h1 className="m-0">{LocalizedLanguage.refundPayment}</h1>
                                                                {this.props.payments.map((payment, index) => {
                                                                   // console.log("testing",payment);
                                                                    return (
                                                                        (payment.payment_type !== null && payment.payment_amount !== 0.00)?
                                                                        <div key={index} className="row">
                                                                            <div className="col-sm-12">
                                                                                <label className="col-sm-6">{payment.payment_type}</label>
                                                                                <div className="col-sm-6">{payment.payment_amount}</div>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                    )
                                                                })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th className="text-right" id="paymentLeft">
                                                    {parseFloat(total_amount).toFixed(2)}
                                                </th>
                                            </tr>
                                            :
                                            <tr id="paymentTr">
                                                <th>
                                                    <div className="relDiv show_payment_box">
                                                        <span className="value pointer" style={{ color: '#46A9D4' }} id="totalPayment"> {LocalizedLanguage.payments}</span>
                                                        <div className="absDiv">
                                                            <div className="payment_box">
                                                                <h1 className="m-0">{LocalizedLanguage.payments}</h1>
                                                                {
                                                                    getorder.order_payments.map(function (payment, index) {
                                                                        return (
                                                                            <div key={index} className="row">
                                                                                <div className="col-sm-12">
                                                                                    <label className="col-sm-6">{payment.type}</label>
                                                                                    <div className="col-sm-6 text-right">{payment.amount}</div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th className="text-right" id="paymentLeft">
                                                    {parseFloat(getorder.total_amount).toFixed(2)}
                                                </th>
                                            </tr>}
                                        <tr>
                                            <th colSpan="2" className="p-0">
                                                <button className="btn btn-block btn-primary total_checkout">
                                                    <span className="pull-left">{LocalizedLanguage.totalRefund}</span>
                                                    <span className="pull-right">{parseFloat(this.state.refund_total).toFixed(2)}</span>
                                                </button>
                                            </th>
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
const connectedRefundViewFirst = connect(mapStateToProps)(RefundViewFirst);
export { connectedRefundViewFirst as RefundViewFirst };