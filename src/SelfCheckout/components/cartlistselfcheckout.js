import React from 'react';
import $ from 'jquery'
import { connect } from 'react-redux';
import { default as NumberFormat } from 'react-number-format'
import { cartProductActions, taxRateAction } from '../../_actions'
import { history } from '../../_helpers';
import { checkoutActions } from '../../CheckoutPage/actions/checkout.action';
import { Markup } from 'interweave';
import { changeTaxRate, typeOfTax, CommonModuleJS } from '../../_components'
import { getTaxAllProduct } from '../../_components/index';
import { LoadingModal } from '../../_components/LoadingModal';
import Permissions from '../../settings/Permissions';
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { androidDisplayScreen } from '../../settings/AndroidIOSConnect';
import { RoundAmount } from "../../_components/TaxSetting";
import { isMobileOnly } from "react-device-detect";
import { CreateProfile } from './CustomerProfile/CreatProfile';
import { Singinselfcheckout } from './CustomerProfile/CreatProfile';
import CommonJs from '../../_components/CommonJS';

class CartListSelfCheckout extends React.Component {
    constructor(props) {
        super(props);
        this.CreateUserProfile = this.CreateUserProfile.bind(this);
        this.CallsingInPopup = this.CallsingInPopup.bind(this);
    }   
    
    CreateUserProfile()
    {        
        showModal('createProfle');
    }

    CallsingInPopup()
    {        
        showModal('signInPopup');
    }

    componentWillReceiveProps() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){setHeightDesktop();}
            if (typeof EnableContentScroll != "undefined"){EnableContentScroll();}
            
            // run this when item add in cart
        }, 200);
    }
   ProductTable=(ListItem,productxList,deleteProduct)=>{
       return(<table className="table table-customise table-day-record fixed-table-cell">
            <tbody>
                {ListItem && ListItem.length > 0 ?
                ListItem.map((item, index) => {
                    var _order_Meta= item.addons_meta_data && item.addons_meta_data.length>0 ? CommonJs.showAddons("",item.addons_meta_data):""
                    return (
                    <tr key={index}>
                        <td className="p-0">
                            <table className="table CartProductTable no-border">
                                <tbody id="messagewindow">
                        <tr key={"cart"+index}>
                            <td className="action action-short action-pointer">
                                {item.quantity ? item.quantity : (item.customTags && (typeof item.customTags !== 'undefined')) ? "" : 1 || (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ? "" : 1}
                            </td>
                            <td>
                                <div className="widget_day_record_text">
                                    <h6>{item.Title && item.Title !== "" ? <Markup content={(item.Title).replace(" - ", "-")} /> : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.sku : 'N/A' }
                                     {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
                                    {(productxList && productxList.length > 0) &&
                                       CommonModuleJS.productxArray(item.product_id, this.props.AllProductList)}{(item.customTags && (typeof item.customTags !== 'undefined')) ?
                                            extensionArray(item.customTags) : (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ?
                                                <div className="font-italic">{item.customExtFee}</div> : null}</h6>
                                                {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                {item.psummary && typeof item.psummary!="undefined" && item.psummary!=""?<div  style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{item.psummary}</div>:null}

                                </div>
                            </td>
                            {(typeof item.product_id !== 'undefined') ?
                                <td >
                                    <div className="widget_day_record_text text-right">
                                        <h6>
                                            <div>{parseFloat(item.product_discount_amount) !== 0.00 ? <NumberFormat value={item.Price - item.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</div>
                                            {parseFloat(item.product_discount_amount) == 0.00 ?
                                                <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                :
                                                <del><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></del>
                                            }
                                        </h6>
                                    </div>
                                </td>
                                :
                                <td>
                                    <div className="widget_day_record_text text-right">
                                        <h6>
                                            <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                        </h6>
                                    </div>
                                </td>
                            }
                            <td className="action action-short action-pointer">
                                <i className="icons8-remove text-danger" onClick={() => deleteProduct(item)}></i>
                            </td>
                        </tr>
                        {item.ticket_status == true ?
                            <tr>
                                <td colSpan="4" className="pr-2">
                                    {item.ticket_status == true && (item.ticket_info === '' || item.ticket_info.length === 0) ?
                                        <div className="w-100-block button_with_checkbox p-0">
                                            <input type="radio" id={`add-details${index}`} name="radio-group" />
                                            <label htmlFor={`add-details${index}`} className="label_select_button"  onClick={() => this.props.tickit_Details('create', item)} >
                                                {LocalizedLanguage.add} <span className="hide_small">{LocalizedLanguage.details}</span></label>
                                        </div>
                                        :
                                        <div className="w-100-block button_with_checkbox p-0 ">
                                            <input type="radio" id={`add-details${index}`} name="radio-group" />
                                            <label htmlFor={`add-details${index}`} className="label_select_button" onClick={ () =>this.props.tickit_Details('edit', item)}>{LocalizedLanguage.change} <span className="hide_small"> {LocalizedLanguage.details}</span></label>
                                        </div>
                                    }
                                </td>
                                </tr>
                            :''
                            }
                         </tbody>
                        </table>
                    </td>
                </tr>
                    )
                })
                :<tr><td colSpan="4" className="widget_day_record_text text-center">{LocalizedLanguage.emptylist}</td></tr>
                }
            </tbody>
            </table>
       );
    }
    render() {    
        var totalPrice = 0;
        const { checkSubscriptionType, ListItem, Addcust, selected_tax_list, UpdateTaxRateList, type_of_tax, 
            multipleTaxSupport, defutTaxStatus, NumberFormat, Markup, LocalizedLanguage, subTotal, 
            showTaxStaus, taxAmount, discountCalculated, totalAmount, defaultTaxApply, defaultTaxStatus, 
            cardProductDiscount, extensionArray, handleChange, openModal, isLoading, deleteProduct, openTaxlist, 
            tickit_Details, productxList, AllProductList, trialSubscriptionFree, subscriptionClientDetail, cartDiscountAmount, ClearCartList, style } = this.props;
        if (ListItem && ListItem.length > 0){
            ListItem.reverse();   
        }
        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
        var register_content = Register_Permissions ? Register_Permissions.content : '';
        var allowtocreateProfile='';      
         if (Register_Permissions) {
             Register_Permissions.content && Register_Permissions.content.filter(item=>item. slug =="allow-customer-login").map(permission =>{
                allowtocreateProfile = permission.value;                 
             })            
         }
        return (      
            <div>
                {style=="portrait" ?
                  <div className="self-checkout-footer border-top border-width-1">                     
                        <div className="container-fuild padding-20">
                            <div className="row">                   
                                <div className={ allowtocreateProfile == "true" ? "col-xs-8" : "col-xs-12"}>                                                              
                                    <div className="row">
                                        <h3 className="text-center col-xs-4">{LocalizedLanguage.myOrder}</h3>
                                        <div className="col-xs-8 text-right">
                                            <div className="widget_day_record widget_tax_total">
                                                <div className="widget_day_record_text text-right">
                                                    <h6>{LocalizedLanguage.tax}: {<NumberFormat value={taxAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</h6>
                                                    <h6>{LocalizedLanguage.total}: {<NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="self-checkout-table widget_day_record self-checkout-table-scroll overflowscroll">
                                        {  
                                            this.ProductTable(ListItem,productxList,deleteProduct)
                                        }
                                    </div>
                                </div> 
                                {allowtocreateProfile == "true" ? 
                                    <div className="col-xs-4">
                                    <h3 className="text-center">{LocalizedLanguage.myProfile}</h3>
                                    <div className="self-checkout-form">
                                        <div className="radio--custom radio--default" onClick={() => this.CreateUserProfile()}>
                                            <input type="radio" id="radio-2" name="radio-group"/>
                                            <label htmlFor="radio-2">{LocalizedLanguage.createProfile}</label>
                                        </div>
                                        <p className="normal-text">{LocalizedLanguage.or}</p>
                                        <div className="radio--custom radio--default" onClick={() => this.CallsingInPopup()}>
                                            <input type="radio" id="radio-2" name="radio-group"/>
                                            <label htmlFor="radio-2">{LocalizedLanguage.signin}</label>
                                        </div>
                                    </div>
                                </div>
                                : null}
                            </div>
                        </div>
                        <div className="container-fuild border-top border-width-1 padding-20">
                            <div className="row">
                                <div className="col-xs-6 col-lg-6">
                                    <button className="btn btn-danger btn-block h-70" onClick={() => ClearCartList()}>
                                         {LocalizedLanguage.cancelOrder}
                                    </button>
                                </div>
                                <div className="col-xs-6 col-lg-6">
                                    <button className="btn btn-primary btn-block h-70" onClick={() => checkSubscriptionType(ListItem)}>
                                        {LocalizedLanguage.checkout} {<NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                <div className="self-checkout-footer w-100">                  
                        <div className="card card-sc-profile">
                            {allowtocreateProfile == "true" ? 
                            <div className="card-header">
                                <h3 className="text-center">{LocalizedLanguage.myProfile}</h3>
                                <div className="self-checkout-form">
                                    <div className="radio--custom radio--default" onClick={() => this.CreateUserProfile()}>
                                        <input type="radio" id="radio-2" name="radio-group" /> 
                                        <label htmlFor="radio-2">{LocalizedLanguage.createProfile}</label>
                                    </div>
                                    <p className="normal-text">{LocalizedLanguage.or}</p>
                                    <div className="radio--custom radio--default" onClick={() => this.CallsingInPopup()}>
                                        <input type="radio" id="radio-2" name="radio-group"/>
                                        <label htmlFor="radio-2">{LocalizedLanguage.signin}</label>
                                    </div>
                                </div>
                            </div>
                            : 
                            null}
                            <div className="card-body">
                                <h3 className="text-center">{LocalizedLanguage.myOrder}</h3>
                                <div className="self-checkout-table widget_day_record">
                                    <div id="mcb_myorder" className="SetHeightCart overflowscroll">
                                        {
                                            this.ProductTable(ListItem,productxList,deleteProduct)
                                        }
                                    </div>
                                </div>
                                <div className="container-fluid card-sc-total">
                                    <div className="row spacer-t-20">
                                        <div className="col-sm-6">
                                            <div className="widget_day_record">
                                                <div className="widget_day_record_text text-right">
                                                    <h6>{LocalizedLanguage.tax}<strong>{<NumberFormat value={taxAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</strong></h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="widget_day_record">
                                                <div className="widget_day_record_text text-right">
                                                    <h6>{LocalizedLanguage.total}: <strong>{<NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}</strong></h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div>
                                    <button className="btn btn-danger btn-block h-70" onClick={() => ClearCartList()}>
                                        {LocalizedLanguage.cancelOrder}
                                    </button>
                                    <button className="btn btn-primary btn-block h-70" onClick={() => checkSubscriptionType(ListItem)}>
                                        {LocalizedLanguage.checkout} {<NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
         )
    }
}
export default CartListSelfCheckout;