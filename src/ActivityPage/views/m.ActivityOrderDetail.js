import React from 'react';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
import { default as NumberFormat } from 'react-number-format';
import { showSubTitle, showTitle } from '../../_components/CommonModuleJS';

const RedirectComponent = (url) => {
    history.push(url);
}
const MobileActivityOrderDetail = (props) => {
    const { windowLocation1, LocalizedLanguage } = props;
    /**  var orderCompleteDetail=sessionStorage.getItem("OrderDetail") && JSON.parse( sessionStorage.getItem("OrderDetail"));
    console.log("orderCompleteDetail",orderCompleteDetail)*/
    var orderDetail = props.single_Order_list ? props.single_Order_list.content : "";
    var subTotal = 0.00;
    /**console.log("orderDetail", orderDetail) */
    subTotal = orderDetail !== "" && orderDetail.total_amount
    /** 
       orderDetail !=="" && orderDetail.line_items && orderDetail.line_items.map((payitem,index)=>{
         subTotal += payitem.subtotal;   
        })
    console.log("subTotal", subTotal)
    console.log("refunded_amount", orderDetail.refunded_amount)*/
    if (orderDetail.refunded_amount) {
        subTotal = subTotal - orderDetail.refunded_amount;
        /**console.log("subTotal===", subTotal) */
    }

    var sub_total = parseFloat(parseFloat((orderDetail.total_amount - orderDetail.refunded_amount)) - parseFloat(orderDetail.total_tax - orderDetail.tax_refunded)).toFixed(2);

    var balance = 0;
    if (orderDetail.order_payments && orderDetail.order_payments.length > 0) {
        orderDetail.order_payments.map(item => {
            balance += parseFloat(item.amount)
        })
    }
    var remaining_balance = (parseFloat(sub_total) + parseFloat(orderDetail.total_tax)) - parseFloat(balance);


    if (orderDetail != "") {
        var single_Order_list = orderDetail;
        single_Order_list.order_custom_fee && single_Order_list.order_custom_fee.length > 0 &&
            single_Order_list.order_custom_fee.map(item => {
                item['line_item_id'] = item.fee_id;
                item['quantity'] = 1;
                item['total'] = item.amount;
                item['subtotal'] = item.amount;
                item['subtotal_tax'] = 0;
                item['total_tax'] = item.total_tax;
                item['name'] = item.note;
                item['is_ticket'] = false;
                item['product_id'] = 0;
                item['parent_id'] = 0;
                item['Taxes'] = 0;
                item['variation_id'] = 0;
                item['amount_refunded'] = item.amount_refunded;
                item['quantity_refunded'] = item.amount_refunded > 0 ? -1 : 0;
            })
        sessionStorage.setItem("OrderDetail", JSON.stringify(single_Order_list));
        localStorage.setItem("getorder", JSON.stringify(single_Order_list))
    }
    var itemCount = orderDetail.line_items.length;
    return (
        <div className="appCapsule vh-100  overflow-auto" style={{ paddingBottom: "180px" }}>
            <div className="cartContent">
                <h2 className="caption-title">Item List</h2>
                <table className="table table-striped mb-0 table-borderless table-71">
                    <tbody>
                        {orderDetail !== "" && orderDetail.line_items && orderDetail.line_items.map((item, index) => {
                            var varDetail = item.ProductSummery.toString();
                            return (<tr key={index}>
                                <th scope="row" className="w-30">{(item.quantity_refunded < 0) ? <div>{item.quantity + item.quantity_refunded}<del style={{ marginLeft: 5 }}>{showSubTitle(item) !== "" ? "" : item.quantity}</del></div> : showSubTitle(item) !== "" ? "" : item.quantity}</th>
                                <td>{showTitle(item) !== "" ? item.name : ""}
                                    {showSubTitle(item) !== "" ? <div className="font-italic">{item.name}</div> : ""}
                                    {varDetail ? <p className="font-italic">{varDetail} </p> : ""}
                                </td>
                                <td align="right">
                                    {
                                        (item.amount_refunded > 0) ?
                                            (item.quantity_refunded < 0) ?
                                                <div><del style={{ marginRight: 10 }}>
                                                    <NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del>{" "}<NumberFormat value={(item.total - item.amount_refunded).toFixed(2)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </div>
                                                :
                                                <NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                            :
                                            (item.subtotal - item.total) != 0 ?
                                                <div><del style={{ marginRight: 10 }}>{item.subtotal.toFixed(2)}</del>{" "}<NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                </div>
                                                :
                                                <NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    }
                                    {/* <NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    {item.total !== item.subtotal ?
                                        <div><del> <NumberFormat value={item.subtotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del></div>
                                        : ""} */}
                                </td>
                            </tr>)
                        })}
                        {/* display custome Fee */}
                        {orderDetail !== "" && orderDetail.order_custom_fee && orderDetail.order_custom_fee.map((item, index) => {
                            itemCount = (itemCount + index + 1);
                            return (
                                <tr key={itemCount}>
                                    <th scope="row" className="w-30"></th>
                                    <td>{item.note}
                                    </td>
                                    <td align="right">
                                        {item.amount_refunded > 0 ? <div><del style={{ marginRight: 10 }}><NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del><NumberFormat value={item.amount - item.amount_refunded} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div> : <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}
                                    </td>
                                </tr>)
                        })
                        }
                        {/* Display Notes  */}
                        {orderDetail !== "" && orderDetail.order_notes && orderDetail.order_notes.map((item, index) => {
                            itemCount = (itemCount + index + 2);
                            return (
                                <tr key={itemCount}>
                                    <th scope="row" className="w-30"></th>
                                    <td>{item.note}</td>
                                    <td align="right">
                                        <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <h2 className="caption-title">{LocalizedLanguage.paymentType}</h2>
                <table className="table table-striped mb-0 table-borderless table-verticle-middle  table-71">
                    <tbody>
                        {orderDetail.order_payments && orderDetail.order_payments.map((payitem, index) => {
                            var gmtDateTime;
                            if (payitem && payitem.payment_date) {
                                gmtDateTime = FormateDateAndTime.formatDateAndTime(payitem.payment_date, orderDetail.time_zone)
                            }
                            return (
                                <tr key={index}>
                                    <td>{payitem.type} ({gmtDateTime})</td>
                                    <td align="right">
                                        <NumberFormat value={payitem.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                </tr>)
                        })
                        }
                        {/* Display Total Discount */}
                        {orderDetail.discount && orderDetail.discount !== 0 ?
                            <tr key="_discount">
                                <td> {LocalizedLanguage.totalDiscount}</td>
                                <td align="right">
                                    <NumberFormat value={orderDetail.discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                </td>
                            </tr> : ""
                        }
                    </tbody>
                </table>

                {orderDetail.order_Refund_payments && orderDetail.order_Refund_payments.length > 0
                    && <h2 className="caption-title">{LocalizedLanguage.refundPayments}</h2>}
                {orderDetail.order_Refund_payments
                    && <table className="table table-striped mb-0 table-borderless table-verticle-middle  table-71">
                        <tbody>
                            {orderDetail.order_Refund_payments && orderDetail.order_Refund_payments.map((payitem, index) => {
                                var gmtDateTime;
                                if (payitem && payitem.payment_date && orderDetail.time_zone) {
                                    gmtDateTime = FormateDateAndTime.formatDateAndTime(payitem.payment_date, orderDetail.time_zone)
                                }
                                return (
                                    <tr key={index}>
                                        <td>{payitem.type} ({gmtDateTime})</td>
                                        <td align="right">
                                            <NumberFormat value={payitem.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />

                                        </td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>
                }
            </div>
            <div className="cartFooter">
                <table className="table mb-0 table-verticle-middle cartCalculatetbl">
                    <thead>
                        <tr>
                            <th colSpan="2" className="border-bottom-0">{LocalizedLanguage.subTotal}</th>
                            <td colSpan="2" align="right">
                                <NumberFormat value={subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>{LocalizedLanguage.tax}</th>
                            <td className="border-right" align="right">
                                <NumberFormat value={orderDetail && orderDetail.total_tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                            </td>
                            <th>{LocalizedLanguage.total}:</th>
                            <td align="right">
                                <NumberFormat value={orderDetail && (orderDetail.total_amount - orderDetail.refunded_amount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                            </td>
                        </tr>
                        <tr className="bg-primary text-white">
                            <td colSpan="2">
                                {LocalizedLanguage.balance}
                            </td>
                            <td colSpan="2" align="right">
                            <NumberFormat value={remaining_balance >= 0 ? parseFloat(remaining_balance).toFixed(2) : 0} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                {/* <NumberFormat value={orderDetail && orderDetail.account_balance ? orderDetail.account_balance : "0.00"} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> */}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MobileActivityOrderDetail;