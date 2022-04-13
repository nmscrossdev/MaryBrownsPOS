import React from 'react';
import { Markup } from 'interweave';
import { default as NumberFormat } from 'react-number-format'
import $ from 'jquery';
import RefundViewThird from '../components/RefundViewThird'
import LocalizedLanguage from '../../settings/LocalizedLanguage'
var incrementClick = 0;
class MobileRefundFirstView extends React.Component { //const MobileRefundFirstView = (props) => { 
    constructor(props) {
        super(props);
        this.state = {
            allowPayment: false,
            getorder: (typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null
        };

    }

    toggleRefundPanel = (item_id) => {
        incrementClick = 1;
        $(`#refundpanel_${item_id}`).toggle();
        $(`#refunditem_${item_id}`).toggleClass('refunndingItem');
        this.props.handleRefundingItems();
    }

    setPaymentOption() {
        var refund_subtotal = 0;
        var refund_tax = 0;
        var refund_total = 0;
        var items = new Array();
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
            refund_subtotal += (parseFloat(price) * parseFloat(quantity));
            refund_tax += (parseFloat(tax) * parseFloat(quantity));
            // refund_total += ( refund_subtotal + refund_tax );
            //calculation part    
        });
        refund_total = (parseFloat(refund_subtotal) + parseFloat(refund_tax));
        this.props.openMobilePaymentOption("refundpayment", items)
    }

    componentDidMount() {
        if ((typeof localStorage.getItem("getorder") !== 'undefined') && JSON.parse(localStorage.getItem("getorder"))) {
            var customFee = JSON.parse(localStorage.getItem("getorder"));
            if (customFee.order_custom_fee && customFee.order_custom_fee.length > 0) {
                this.prepairListItems(customFee);
            }
        }
    }

    prepairListItems(customFee) {
        customFee.order_custom_fee.map(items => {
            customFee.line_items.push(items);
        })
        this.setState({ getorder: customFee })
    }

    render() {
        const { refund_total, payments, refund_subtotal, refund_tax, handleRefundingItems, increaseitemRefundQty, decreaseitemRefundQty } = this.props;

        const { allowPayment, getorder } = this.state;
        //var getorder = sessionStorage.getItem("OrderDetail") ? JSON.parse(sessionStorage.getItem("OrderDetail")) : null;

        var customerName = getorder && getorder.orderCustomerInfo ? getorder.orderCustomerInfo.customer_name : "";
        return (
            <div>
                {/* <!-- App Header --> */}
                <div className="appHeader">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-4">
                                <a className="appHeaderBack" href="/activity">
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.calcel}
                                </a>
                            </div>
                            <div className="col-8 text-right">
                                <p className="appHeaderPgbutton text-dark disabled">
                                    {customerName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="appCapsule vh-100  overflow-auto" style={{ paddingBottom: "180px" }}>
                    <div className="cartContent w-100">
                        <table className="table mb-0">

                            {
                                (typeof getorder.line_items !== 'undefined') && getorder.line_items !== null ?
                                    getorder.line_items && getorder.line_items.map((item, index) => {
                                        return (
                                            <tbody key={index}>
                                                <tr key={item.line_item_id} id={`refunditem_${item.line_item_id}`} title={item.name} data-id={item.line_item_id} className="prdtr" price={item.total} data-amount={item.total / item.quantity} data-productid={item.product_id} data-varproductid={item.variation_id} data-orderid="6747" data-quantity={item.quantity} data-taxrate={item.total_tax} data-perprdtax={item.total_tax / item.quantity} data-permulttax={item.Taxes}>
                                                    <td className="font-weight-normal w-30"> {index + 1} </td>
                                                    <td ><Markup content={item.name} />
                                                        <div className="font-italic"> </div>
                                                      {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                      {item.ProductSummery ?<div style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{ item.ProductSummery.toString()}</div>:null}
                                                    </td>
                                                    <td align="right">
                                                        <NumberFormat value={item.total - item.amount_refunded} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                    </td>
                                                    <td align="right">
                                                        <div className="appCustomizeRadioCheckbox appCustomizeRefund">
                                                            {item.quantity - item.quantity_refunded > 0 && item.total - item.amount_refunded > 0 ?
                                                                <div className="custom-control custom-checkbox custom-control-inline mr-0">
                                                                    <input type="checkbox" className="custom-control-input" id={"refund" + index} name="refund" onChange={() => this.toggleRefundPanel(item.line_item_id)} />
                                                                    {/**/}
                                                                    <label className="custom-control-label label-40" htmlFor={"refund" + index}></label>

                                                                </div>
                                                                : null}
                                                        </div>
                                                    </td>
                                                    {/* <td align="right">
                                                        {item.quantity - item.quantity_refunded > 0 && item.total - item.amount_refunded > 0 ?
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
                                                    </td> */}
                                                </tr>
                                                <tr key={index} className="refunddecinc d-none">
                                                    <td colSpan="4">
                                                        <div className="btn-group w-100 h-50-pxi" role="group" aria-label="Basic example">
                                                            <button type="button" className="btn dec btnincdec border-dark shadow-none" onClick={() => decreaseitemRefundQty(item.line_item_id)} >
                                                                {/*  */}
                                                                <img src="../mobileAssets/img/minus-dark.svg" alt="" className="w-30" />
                                                            </button>
                                                            <button type="button" className="btn border-dark border-left-0 border-right-0 shadow-none">
                                                                <input type="text" hidden value="5" />
                                                                <span className="refundValue" id={`counter_show_${item.line_item_id}`}>1</span>
                                                                /<span className="totalvalue" id={`check_counter_${item.line_item_id}`}>{item.quantity + item.quantity_refunded}</span>
                                                            </button>
                                                            <button type="button" className="btn inc btnincdec border-dark shadow-none" onClick={() => increaseitemRefundQty(item.line_item_id)} >
                                                                {/**/}
                                                                <img src="../mobileAssets/img/plus-dark.svg" alt="" className="w-30 mr-auto" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                    : null
                            }

                        </table>
                    </div>

                    <div className="cartFooter">
                        <table className="table mb-0 table-verticle-middle cartCalculatetbl">
                            <thead>
                                <tr>
                                    <th colSpan="2" className="border-bottom-0">{LocalizedLanguage.subTotal}:</th>
                                    <td colSpan="2" align="right">
                                        <NumberFormat value={refund_subtotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th> {LocalizedLanguage.tax}:</th>
                                    <td className="border-right" align="right">
                                        <NumberFormat value={parseFloat(refund_tax).toFixed(2)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                    <th>{LocalizedLanguage.discount}:</th>
                                    <td align="right">
                                        N/A
                                </td>
                                </tr>
                                <tr className="text-white bg-danger" onClick={() => refund_total > 0 && this.setPaymentOption()}>

                                    <td colSpan="2" className="border-danger">
                                        {LocalizedLanguage.issueRefund}
                                    </td>
                                    <td colSpan="2" align="right" className="border-danger">

                                        <NumberFormat value={parseFloat(refund_total).toFixed(2)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
export default MobileRefundFirstView;