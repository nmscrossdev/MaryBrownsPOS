import React from 'react';
import { CommonModuleJS } from '../CommonModuleJS';
import ActiveUser from '../../settings/ActiveUser';
import { AndroidAndIOSLoader } from '../AndroidAndIOSLoader';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
const noChange = () => {
    ///no action 
}

const CartList = (props) => {
    var totalPrice = 0;
    const { checkSubscriptionType, ListItem, Addcust, selected_tax_list, UpdateTaxRateList, type_of_tax, multipleTaxSupport, defutTaxStatus, NumberFormat, Markup, LocalizedLanguage, subTotal, showTaxStaus, taxAmount, discountCalculated, totalAmount, defaultTaxApply, defaultTaxStatus, cardProductDiscount, extensionArray, handleChange, isLoading, deleteProduct, openTaxlist, tickit_Details, productxList, AllProductList, trialSubscriptionFree, subscriptionClientDetail, cartDiscountAmount, ClearCartList, openModal} = props;
    //console.log("%cCART LIST VIEW", 'color:blue', defutTaxStatus, typeof defutTaxStatus, defutTaxStatus, typeof defutTaxStatus)
    return (
        <div>
            {(ActiveUser.key.isSelfcheckout == true)?
            <div>
                <div className="appHeader">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-12">
                                <a className="appHeaderBack" onClick={() => openModal('')}>
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt=""/> {LocalizedLanguage.goBack}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="appCapsule h-100" style={{"paddingBottom": 180}}>
                        <div className="sc-cartContent p-15 overflow-auto scrollbar">
                            <div className="sc-cart-list">
                                <table className="table table-91 table-verticle-middle table-borderd fw700"> 
                                    <tbody>
                                        {ListItem && ListItem.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td colSpan="4" className="p-0">
                                                        <table className="table table-borderless table-nostriped-child mb-0 table-layout-fixed">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="w-30">{item.quantity ? item.quantity : (item.customTags && (typeof item.customTags !== 'undefined')) ? "" : 1 || (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ? "" : 1}</td>
                                                                    <td>{item.Title && item.Title !== "" ? <Markup content={(item.Title).replace(" - ", "-")} /> : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A' }
                                                                    {(productxList && productxList.length > 0) && CommonModuleJS.productxArray
                                                                    (item.product_id, AllProductList)}{(item.customTags && 
                                                                    (typeof item.customTags !== 'undefined')) ?
                                                                     extensionArray(item.customTags) : 
                                                                     (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ? 
                                                                     <div className="font-italic">{item.customExtFee}</div> : null}
                                                                     {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                                     {item.psummary && typeof item.psummary!="undefined" && item.psummary!=""?<div style={{textTransform: 'capitalize',textAlign:'left',fontSize:10,color:'grey'}}>{item.psummary}</div>:null}
                                                                    </td>
                                                                    {(typeof item.product_id !== 'undefined') ?
                                                                        <td className="w-101">
                                                                            <div>{parseFloat(item.product_discount_amount) !== 0.00 ? <NumberFormat value={item.Price - item.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</div>
                                                                            {parseFloat(item.product_discount_amount) == 0.00 ?
                                                                                <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                                :
                                                                                <del><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del>
                                                                            }
                                                                        </td>
                                                                        :
                                                                        <td className="w-101">
                                                                            <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                        </td>
                                                                    }
                                                                    <td className="w-30 p-0" onClick={() => deleteProduct(item)}>
                                                                        <img src="../mobileAssets/img/trash.svg" className="pointer w-30" alt=""/>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            )
                                        })}                              
                                    </tbody>
                                </table> 
                                {(ListItem && ListItem.length > 0)?
                                    <div>
                                        <div className="sc-calculation p-15">
                                        <div className="row">
                                            {
                                                ListItem && ListItem.length > 0 && ListItem.map((item, index) => {
                                                    totalPrice += item.Price
                                                })
                                            }
                                            <div className="col-6">
                                                {LocalizedLanguage.tax}: <strong className="ml-5-px fw700"><NumberFormat value={taxAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true}/></strong>
                                            </div>
                                            <div className="col-6 text-right">
                                                {LocalizedLanguage.total}: <strong className="ml-5-px fw700"> <NumberFormat value={subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> </strong>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-light btn-block fz-14 text-dark h-101" onClick={() => openModal('')}>
                                        {LocalizedLanguage.addmoreProducts}
                                    </button>
                                    <div className="spacer-20"></div>  
                                    </div>  
                                :
                                    null
                                }                                                       
                            </div> 
                        </div>
                        <div className="sc-cartFooter">
                            <div className="divider"></div>
                            <div className="p-15">
                                {/*  data-target="#cancle" */}
                                <button className="btn btn-danger btn-block shadow-none p-10" data-toggle="modal" onClick={() => ClearCartList(true)}>{LocalizedLanguage.cancelOrder}</button>
                                <button className="btn btn-primary btn-block shadow-none p-10" onClick={() => checkSubscriptionType(ListItem)}>{LocalizedLanguage.checkout} <NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></button>
                            </div>
                        </div>
                </div>
            </div>
            :
            <div>
                {isLoading == true ? <AndroidAndIOSLoader /> : ""}
                <div className="appHeader">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-3">
                                <a className="appHeaderBack" onClick={() => openModal('')}>
                                    {/* href="/shopview" */}
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> Go Back
                                </a>
                            </div>
                            {Addcust && Addcust.content != null ?
                                <div className="col-6">
                                    <div className="appTitle text-truncate">
                                        <h3> {Addcust.content.FirstName ? Addcust.content.FirstName : Addcust.content.Email.substring(0, 30) + "..."}{" "} {Addcust.content.LastName ? Addcust.content.LastName : null}</h3>
                                    </div>
                                </div>
                                :
                                <div className="col-6"></div>
                            }
                            <div className="col-3 text-right">
                                <a className="appHeaderRight" href="javascript:void(0);" onClick={() => openModal("notes")}>
                                    <img src="../mobileAssets/img/more.svg" className="w-30" alt="" />
                                </a>
                            </div>

                            {/* {Addcust && Addcust.content != null ?
                                <div className="col-3 text-right text-truncate" onClick={() => deleteAddCust()}>
                                    <button className="btn btn-link appHeaderPgbutton" id="addtile">
                                        {Addcust.content.FirstName ? Addcust.content.FirstName : Addcust.content.Email.substring(0, 30) + "..."}{" "} {Addcust.content.LastName ? Addcust.content.LastName : null}
                                    </button>
                                </div>
                                :
                                <div className="col-7 text-right" onClick={() => addCustomer()}>
                                    <button className="btn btn-link appHeaderPgbutton" id="addtile">
                                        Add customer
                                </button>
                                </div>
                            } */}
                        </div>
                    </div>
                </div>
                <div className="appCapsule h-100  overflow-auto vh-100" style={{ paddingBottom: 170 }}>
                    <div className="cartContent">
                        <table className="table table-striped mb-0 table-borderless">
                            <tbody>
                                {ListItem && ListItem.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td colSpan="4" className="p-0">
                                                <table className="table table-borderless table-nostriped-child mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row" className="w-30">{item.quantity ? item.quantity : (item.customTags && (typeof item.customTags !== 'undefined')) ? "" : 1 || (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ? "" : 1}</th>
                                                            <td width="50%">
                                                                {item.Title && item.Title !== "" ? <Markup content={(item.Title).replace(" - ", "-")} /> : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A' }
                                                                {(productxList && productxList.length > 0) && CommonModuleJS.productxArray(item.product_id, AllProductList)}{(item.customTags && (typeof item.customTags !== 'undefined')) ? extensionArray(item.customTags) : (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ? <div className="font-italic">{item.customExtFee}</div> : null}
                                                            {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                            {item.psummary && typeof item.psummary!="undefined" && item.psummary!=""?<div style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{item.psummary}</div>:null}
                                                            </td>
                                                            {(typeof item.product_id !== 'undefined') ?
                                                                // onClick={() =>singlProductDiscount(item, index)}
                                                                <td align="right" >
                                                                    <div>{parseFloat(item.product_discount_amount) !== 0.00 ? <NumberFormat value={item.Price - item.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</div>
                                                                    {parseFloat(item.product_discount_amount) == 0.00 ?
                                                                        <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                        :
                                                                        <del><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del>
                                                                    }
                                                                </td>
                                                                :
                                                                <td align="right">
                                                                    <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                </td>
                                                            }
                                                            <td className="pr-0">
                                                                <button onClick={() => deleteProduct(item)} type="button" className="btn btn-danger shadow-none item-delete float-right">
                                                                    <img src="../mobileassets/img/web/delete.svg" alt="" srcSet="" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {item.ticket_status == true &&
                                                            <tr>
                                                                {item.ticket_status == true && (item.ticket_info === '' || item.ticket_info.length === 0) ?
                                                                    <td colSpan="4" >
                                                                        <div className="button-single-state">
                                                                            <div className="btn-group-toggle" data-toggle="buttons">
                                                                                <label className="btn btn-default btn-block" onClick={() => tickit_Details('create', item)}>
                                                                                    <input type="radio" id={`add-details${index}`} name="options" /> {LocalizedLanguage.add}{" "} {LocalizedLanguage.details}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    :
                                                                    <td colSpan="4">
                                                                        <div className="button-single-state">
                                                                            <div className="btn-group-toggle" data-toggle="buttons">
                                                                                <label className="btn btn-default btn-block" onClick={() => tickit_Details('edit', item)}>
                                                                                    <input type="radio" id={`add-details${index}`} name="options" id="black" /> {LocalizedLanguage.change}{" "} {LocalizedLanguage.details}
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </td>}
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="cartFooter">
                        <table className="table mb-0 table-verticle-middle cartCalculatetbl">
                            <thead>
                                <tr>
                                    <th colSpan="2" className="border-bottom-0">{LocalizedLanguage.subTotal}</th>
                                    {
                                        ListItem && ListItem.length > 0 && ListItem.map((item, index) => {
                                            totalPrice += item.Price
                                        })
                                    }
                                    <td colSpan="2" align="right"> <NumberFormat value={subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th> {showTaxStaus}:</th>
                                    <td className="border-right" align="right">
                                        <button onClick={() => trialSubscriptionFree()} className="btn btn-link appHeaderPgbutton" data-toggle="modal" data-target={`${subscriptionClientDetail && subscriptionClientDetail.subscription_detail && subscriptionClientDetail.subscription_detail.subscription_type == "oliverpos-free" ? "" : type_of_tax !== 'incl' && multipleTaxSupport == true ? "#applyTax" : ""}`}>
                                            <NumberFormat value={taxAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        </button>
                                    </td>
                                    <th>{LocalizedLanguage.discount}:</th>
                                    {/* style={{ color: '#46A9D4' }} */}
                                    <td align="right" className="text-info"  onClick={() => { cardProductDiscount(); }}>
                                        {
                                            (cartDiscountAmount > 0) ? (
                                                <NumberFormat value={cartDiscountAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />) : LocalizedLanguage.discountAdd
                                        }
                                    </td>
                                </tr>
                                <tr onClick={() => checkSubscriptionType(ListItem)} className="bg-primary text-white">
                                    <td colSpan="2">
                                        {LocalizedLanguage.checkout}
                                    </td>
                                    <td colSpan="2" align="right">
                                        <NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ backgroundColor: '#808080b0' }} className={`${type_of_tax !== 'incl' && multipleTaxSupport == true ? "modal fade show" : "modal fade"}`} id="applyTax" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">{LocalizedLanguage.selectTax}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body p-0">
                                <div className={`appRadioCheckbox bg-white ${((defaultTaxStatus == true || defaultTaxStatus == "true") && defutTaxStatus == "true") ? "disabled" : ""}`}>
                                    {selected_tax_list && selected_tax_list.map((item, index) => {
                                        var checkStatus = false;
                                        if (UpdateTaxRateList && UpdateTaxRateList.length > 0) {
                                            var updatedTax = UpdateTaxRateList.find(items => parseInt(items.TaxId) == parseInt(item.TaxId));
                                            if (updatedTax && updatedTax.check_is == true) {
                                                checkStatus = true;
                                            }
                                        }
                                        return (
                                            <div key={index} className="custom-control custom-checkbox">
                                                <input type="checkbox" id={item.TaxId} data-tax-class={item.TaxClass} data-id={item.TaxId} data-country={item.Country} data-state={item.State} name={`tax_${item.TaxId}`} data-name={item.TaxName} value={item.TaxRate} defaultChecked={checkStatus == true ? 'checked' : ''} onChange={((defaultTaxStatus == true || defaultTaxStatus == "true") && defutTaxStatus == "true") ? noChange() : handleChange} className="custom-control-input" />
                                                <label className="custom-control-label" htmlFor={item.TaxId}>{item.TaxName == "N/A" ? LocalizedLanguage.locationTax : item.TaxName}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="modal-footer">
                                {/* <div className="custom-control custom-switch"> */}
                                <button onClick={() => defaultTaxApply()} type="button" className="btn btn-primary">{((defaultTaxStatus == true || defaultTaxStatus == "true") && defutTaxStatus == "true") ? 'Default-Tax' : 'Select-Tax'}</button>
                                {(defaultTaxStatus == true || defutTaxStatus == "true") ?
                                    <button type="button" className="btn btn-primary" disabled>{LocalizedLanguage.editQuickTax}</button>
                                    :
                                    <button type="button" onClick={() => openTaxlist()} className="btn btn-primary">{LocalizedLanguage.editQuickTax}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default CartList;
