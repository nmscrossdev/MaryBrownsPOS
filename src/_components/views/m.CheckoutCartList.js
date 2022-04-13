import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

const CheckoutCartList = (props) => {
    const { checkList, cash_round, payments, count, paid_amount, Markup, NumberFormat, RoundAmount, RemoveCustomer, cartDiscountAmount } = props;
    //console.log("%cCART LIST VIEW", 'color:blue', props)
    return (
        <div>
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-2">
                            <a className="appHeaderBack" href="javascript:void(0);" onClick={() => props.changeComponent("checkout_third")}>
                                <img src="mobileAssets/img/back.svg" className="w-30" alt="" />
                            </a>
                        </div>
                        <div className="col-8">
                            <div className="appTitle">
                                {checkList && checkList.customerDetail && checkList.customerDetail.content ?
                                    <h6 className="text-truncate"> {checkList.customerDetail.content.FirstName ? checkList.customerDetail.content.FirstName : checkList.customerDetail.content.Email}{" "}{checkList.customerDetail.content.LastName ? checkList.customerDetail.content.LastName : null}</h6>
                                    :
                                    <h6 className="text-truncate">{LocalizedLanguage.addCustomerTitle}</h6>
                                }
                            </div>
                        </div>
                        {/* <div className="col-3 text-right">
                            {checkList && checkList.customerDetail && checkList.customerDetail.content ?
                                <p className="appHeaderPgbutton text-dark" onClick={() => RemoveCustomer()}>
                                    {checkList.customerDetail.content.FirstName ? checkList.customerDetail.content.FirstName : checkList.customerDetail.content.Email}{" "}{checkList.customerDetail.content.LastName ? checkList.customerDetail.content.LastName : null}
                                </p>
                                :
                                <p className="appHeaderPgbutton text-dark" onClick={() => AddCustomer()}>
                                    {LocalizedLanguage.addCustomerTitle}
                                </p>
                            }
                        </div> */}
                        <div className="col-2 text-right">
                            {/* {checkList && checkList.customerDetail && checkList.customerDetail.content ?
                                <a className="appHeaderRight" href="javascript:void(0);">
                                    <img onClick={() => RemoveCustomer()} src="mobileAssets/img/less.svg" className="w-40" alt="" />
                                </a>
                                : <a className="appHeaderRight" href="javascript:void(0);">
                                    <img onClick={() => AddCustomer()} src="mobileAssets/img/plus.svg" className="w-30" alt="" />
                                </a>} */}
                                <a className="appHeaderRight" href="javascript:void(0);">
                                    <img onClick={() => props.changeComponent("notes")} src="mobileAssets/img/plus.svg" className="w-30" alt="" />
                                </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="appCapsule h-100  overflow-auto" style={{ paddingBottom: 180 }}>
                <div className="cartContent">
                    <table className="table table-striped mb-0 table-borderless">
                        <tbody>
                            {checkList && checkList.ListItem &&
                                checkList.ListItem.map((product, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row" className="w-30">{product.quantity ? product.quantity : (product.customTags && (typeof product.customTags !== 'undefined')) ? "" : 1 || (product.customExtFee && (typeof product.customExtFee !== 'undefined')) ? "" : 1}</th>
                                            <td><Markup content={product.Title} />
                                                {(product.customTags && (typeof product.customTags !== 'undefined')) ?
                                                    this.extensionArray(product.customTags)
                                                    :
                                                    (product.customExtFee && (typeof product.customExtFee !== 'undefined') && product.Price !== 0) ?
                                                        <div className="font-italic">{product.customExtFee}</div>
                                                        :
                                                        <div className="font-italic">{product.color}  {product.size ? ',' + product.size : null}</div>
                                                }
                                            {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                            {product.psummary && typeof product.psummary!="undefined" && product.psummary!=""?<div style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{product.psummary}</div>:null}
                                            </td>
                                            {(typeof product.product_id !== 'undefined') ?
                                                <td align="right">
                                                    {/* {product.discount_amount !== 0 ?
                                                                <NumberFormat value={product.after_discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                : ''}
                                                            <span className={product.discount_amount !== 0 ? "comman_delete" : ''}><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></span> */}
                                                    <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - product.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</span>
                                                    {parseFloat(product.product_discount_amount) !== 0.00 ?
                                                        <del>
                                                            <NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                        </del>
                                                        :
                                                        <NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}
                                                </td>
                                                :
                                                <td align="right">
                                                    <NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                </td>
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="cartFooter">
                    <table className="table mb-0 table-verticle-middle cartCalculatetbl">
                        <thead>
                            <tr>
                                <th colSpan="2" className="border-bottom-0">{LocalizedLanguage.subTotal}</th>
                                <td colSpan="2" align="right"> <NumberFormat value={checkList && checkList.subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th> {checkList && checkList.showTaxStaus}:</th>
                                <td className="border-right" align="right">
                                    <button className="btn btn-link appHeaderPgbutton" data-toggle="modal">
                                        <NumberFormat value={checkList && checkList.tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </button>

                                </td>
                                <th>{LocalizedLanguage.discount}:</th>
                                <td align="right">
                                    <NumberFormat value={checkList && RoundAmount(cartDiscountAmount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                </td>
                            </tr>
                            <tr className="bg-primary text-white">
                                <td colSpan="2">
                                    {LocalizedLanguage.balanceDue}
                                </td>
                                <td colSpan="2" align="right">
                                    <NumberFormat value={checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CheckoutCartList;
