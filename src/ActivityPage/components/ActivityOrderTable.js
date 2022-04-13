import React from 'react';
import { default as NumberFormat } from 'react-number-format';
import { FormateDateAndTime } from '../../settings/FormateDateAndTime';
// import moment from 'moment';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { getInclusiveTaxType } from "../../_components/CommonModuleJS";

function Capitalize(str) {
    var value = str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    return value;
}

export const ActivityViewTable = (props) => {
    var balance = 0;
    if (props.OrderPayment && props.OrderPayment.length > 0) {
        props.OrderPayment.map(item => {
            balance += parseFloat(item.amount)
        })
    }
    var remaining_balance = (parseFloat(props.Subtotal) + parseFloat(props.TotalTax)) - parseFloat(balance);
    var redeemPointsForActivity  = props.redeemPointsToPrint ? +props.redeemPointsToPrint.match(/\d+/) : 0
    var cashOrderData = ''
    var cashChange = ''
    var cashPayment = ''
    var taxInclusiveName=getInclusiveTaxType(props.orderMetaData);
    props.orderMetaData && props.orderMetaData.map((meta)=>{
        // metaData && metaData.map((metaData, index) => {
            if(meta.ItemName == '_order_oliverpos_cash_change'){
              cashOrderData = meta.ItemValue && meta.ItemValue !=='' ? meta.ItemValue : ''
            }
    })

    if(cashOrderData && cashOrderData !==''){
        cashOrderData = JSON.parse(cashOrderData)
        cashChange  = cashOrderData.change
        cashPayment = cashOrderData.cashPayment
    }
    var TaxSetting = localStorage.getItem("TAX_SETTING") ? JSON.parse(localStorage.getItem("TAX_SETTING")) : null;
     var _displayInclusive=TaxSetting && TaxSetting.pos_prices_include_tax == 'yes'?true:false;
     var totalDiscount =  props.Discount.toFixed(2)-props.TotalIndividualProductDiscount.toFixed(2);
             
     var isTotalRefund=false;
     if ((props.Totalamount - props.refunded_amount).toFixed(2) == '0.00') {
        isTotalRefund = true
    }

    return (
        props != null ? (
            <div className="container-fuild ">
                <div className="row no-margin">
                    <div className="col-sm-7 col-xl-7"></div>
                    <div className="col-sm-5 col-xl-5 no-padding">
                        <table className="table table-no-margin table-borderless">
                            <tbody>
                                <tr key={'subtotal' + props.key}>
                                    <td>{LocalizedLanguage.subTotal }</td>
                                    <td align="right">
                                        <NumberFormat value={props.Subtotal != 'NaN' ? (props.TotalAmount - props.refunded_amount) == 0 ? 0.00 
                                                                                        : taxInclusiveName !== "" ?
                                                                                                (parseFloat(props.Subtotal )+parseFloat(props.TotalTax) +totalDiscount-props.tax_refunded) //- props.cash_round
                                                                                                :(parseFloat(props.Subtotal)+totalDiscount ) //- props.cash_round
                                                                                        : 0} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                </tr>

                                {totalDiscount !==0?
                                //props.Discount !== 0 &&  props.Discount-props.TotalIndividualProductDiscount !==0 ?
                                    <tr key={'discount' + props.key}>
                                        <td>{LocalizedLanguage.totalDiscount}</td>
                                        <td align="right">
                                            <NumberFormat value={totalDiscount == 0 ? 0.00 : (totalDiscount)}
                                                displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        </td>
                                    </tr> : null
                                }

                                {redeemPointsForActivity && redeemPointsForActivity !== 0.00 && redeemPointsForActivity !== 0 ?
                                    <tr key={'redeemed' + props.key}>
                                        <td>redeemed Points</td>
                                        <td align="right">
                                            <NumberFormat value={(redeemPointsForActivity)}
                                                displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        </td>
                                    </tr>
                                :null}
                                <tr key={'totalTax' + props.key}>
                                    <td>{LocalizedLanguage.totalTax+taxInclusiveName}</td>
                                    <td align="right">{
                                        (props.tax_refunded > 0) ?
                                            <div><NumberFormat value={(props.TotalAmount - props.refunded_amount) == 0 ? 0.00 : (props.TotalTax - props.tax_refunded)}
                                                displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> <del style={{ marginLeft: 5 }}> <NumberFormat value={props.TotalTax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del> </div> : <NumberFormat value={(props.TotalAmount - props.refunded_amount) == 0 ? 0.00 : props.TotalTax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    }</td>
                                </tr>
                                {props.tipInfo ?
                                    <tr key={'tipinfo' + props.key}>
                                    <td> {props.tipInfo.note}</td>
                                    <td className="text-right">{
                                        <NumberFormat value={(props.tipInfo.amount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    }</td>
                                    </tr> : null
                                }   
                                {props.cash_round !== 0 ?
                                    <tr key={'cashRound' + props.key}>
                                        <td> {LocalizedLanguage.cashRounding}</td>
                                        <td className="text-right">{
                                            <NumberFormat value={(props.TotalAmount - props.refunded_amount) == 0 ? 0.00 : props.cash_round} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        }</td>
                                    </tr> : null
                                }
                            </tbody>
                            <tfoot className="tfoot-bordered">
                                <tr className="totalAmount" key={'total' + props.key}>
                                    <td className=""><b>{LocalizedLanguage.total}</b></td>
                                    <td className="text-right"><b>{
                                        (props.refunded_amount > 0) ? <div><NumberFormat value={(props.TotalAmount - props.refunded_amount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> <del style={{ marginLeft: 5 }}><NumberFormat value={props.TotalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del> </div> : <NumberFormat value={props.TotalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    }</b></td>
                                </tr>
                                {props.OrderPayment ? props.OrderPayment.map((item, index) => {
                                    //var gmtDateTime = moment.utc(item.payment_date)
                                    //var localDate = gmtDateTime.local().format(Config.key.DATE_FORMAT);
                                    if (item.type !== null) {
                                        return (
                                            <tr key={`payment${index}`} className={index == 0 ? "tfoot-bordered" : ''}>
                                                <td>{`${Capitalize(item.type)} (${FormateDateAndTime.formatDateAndTime(item.payment_date, props.TimeZone)}) `}<div>{ props.requestParameter && props.requestParameter=="true"? item.transection_id :""}</div></td>
                                                {/* item.payment_date */}
                                                <td className="text-right"> <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                </td>
                                            </tr>   
                                        )
                                    }
                                }) : null}

                                {cashChange !=='' && cashChange ? (
                                        <tr key={`cashChange`} className={0 ? "tfoot-bordered" : ''}>
                                            <td>{`${Capitalize('change')}`}</td>
                                                <td className="text-right"> <NumberFormat value={cashChange} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                            </td>
                                        </tr>
                                ) : null}
                                {cashPayment !==''  && cashPayment? (
                                    <tr key={`cashPayment`} className={0 ? "tfoot-bordered" : ''}>
                                        <td>{`${Capitalize('cash payment')}`}</td>
                                            <td className="text-right"> <NumberFormat value={cashPayment} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        </td>
                                    </tr>
                                ) : null}


                                <tr style={(props.refunded_amount > 0) ? { display: "" } : { display: "none" }} key={'refundftax' + props.key}>
                                    <td>{LocalizedLanguage.refundTax}</td>
                                    <td className="text-right"><NumberFormat value={props.tax_refunded} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </td>
                                </tr>
                                {props.refundCashRounding !== 0 &&
                                    <tr>
                                        <td>{LocalizedLanguage.refundCashRound}</td>
                                        <td className="text-right">{
                                            <NumberFormat value={(props.refunded_amount - props.refundCashRounding) == 0 ? 0.00 : props.refundCashRounding} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        }</td>
                                    </tr>
                                }
                                <tr className="totalAmount" style={(props.refunded_amount > 0) ? { display: "" } : { display: "none" }} key={'refundAmount' + props.key}>
                                    <td className=""><b>{LocalizedLanguage.refundedAmount}</b></td>
                                    <td className="text-right"><b><NumberFormat value={props.refunded_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></b></td>
                                </tr>
                                <tr className="totalAmount" style={(props.refunded_amount > 0) ? { display: "" } : { display: "none" }} key={'redunfToatal' + props.key}>
                                    <td className=""><b>{LocalizedLanguage.refundPayments}</b></td>
                                    <td className="text-right"><b></b></td>
                                </tr>
                                {
                                    (props.refunded_amount > 0) && (
                                        (typeof props.refundPayments !== "undefined" && props.refundPayments.length > 0) && (
                                            props.refundPayments && props.refundPayments.map((item, index) => {
                                                // var gmtDateTime = moment.utc(item.payment_date)
                                                // var localDate = gmtDateTime.local().format(Config.key.DATE_FORMAT);
                                                return (
                                                    <tr key={`refund${index}`} className={index == 0 ? "tfoot-bordered" : ''}>
                                                        <td>{`${Capitalize(item.type)} (${FormateDateAndTime.formatDateAndTime(item.payment_date, props.TimeZone)})`}</td>
                                                        <td className="text-right"><NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) //: <tr><td></td></tr>
                                    ) //: <tr><td></td></tr>
                                }
                                <tr className="totalAmount tfoot-bordered" key={'balance' + props.key}>
                                    <td className=""><b>{LocalizedLanguage.balance}</b></td>
                                    <td className="text-right"><b>

                                        <NumberFormat value={remaining_balance >= 0 ? parseFloat(remaining_balance).toFixed(2) : props.balence.toFixed(2)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </b></td>
                                </tr>

                            </tfoot>

                        </table>
                    </div>
                </div>
            </div>
        ) : null
    )
}
