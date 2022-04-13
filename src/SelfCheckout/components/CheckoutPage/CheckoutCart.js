import React from 'react';
import { history } from '../../../_helpers';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import ActiveUser from '../../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import CommonJs, { onBackTOLoginBtnClick } from '../../../_components/CommonJS';
class CheckoutCart extends React.Component {
    constructor(props) {
        super(props);
        this.GoBackhandleClick = this.GoBackhandleClick.bind(this);
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof EnableContentScroll != "undefined"){EnableContentScroll();}
        }, 2000)

    }

    GoBackhandleClick() {
        history.push('/SelfCheckoutView');
        setTimeout(function () { selfCheckoutJs(); }, 100)
    }


    render() {
        const { checkList, cash_round, payments, count, paid_amount, Markup, NumberFormat, RoundAmount, RemoveCustomer, cartDiscountAmount, selfcheckoutstatusmanagingevnt, SelfCheckoutStatus } = this.props;
        var landingScreen = '';
        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
        var register_content = Register_Permissions ? Register_Permissions.content : '';
        var landingScreen=ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo :''; 
        // if (Register_Permissions) {
        //     Register_Permissions.content && Register_Permissions.content.filter(item => item.slug == "landing-screen").map(permission => {
        //         landingScreen = permission.value;
        //     })
        // }
        return (
            <div>
                <div className="portrait">
                    <div className="page-payment scroll-hidden">
                        <div className="payment-nav">
                            <button className="btn btn-success text-uppercase btn-14" onClick={() => this.GoBackhandleClick()}>{LocalizedLanguage.goBack}</button>
                        </div>
                        <div className="payment-content pt-3">
                            <div className="w-100">
                                <div className="payment-page-title">
                                    <img src={landingScreen} className="mx-auto" alt="" />
                                    <div className="spacer-40"></div>
                                    <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.orderDetails}</h1>
                                    <div className="spacer-25"></div>
                                    {/* <h3 className="h7-title text-white text-center">MY ORDER</h3> */}
                                </div>
                                <div className="self-checkout-table widget_day_record">
                                    <div className="self-checkout-product-light">
                                        <div className="self-checkout-all-product overflowscroll">
                                            <table className="table table-customise table-day-record fixed-table-cell">
                                                <tbody>
                                                    {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                                                        var _order_Meta= product.addons_meta_data && product.addons_meta_data.length>0 ? CommonJs.showAddons("",product.addons_meta_data):""
                                                        return (
                                                            <tr key={"cart" + index}>
                                                                <td className="action action-short action-pointer">
                                                                    <h6>{product.quantity ? product.quantity : (product.customTags && (typeof product.customTags !== 'undefined')) ? "" : 1 || (product.customExtFee && (typeof product.customExtFee !== 'undefined')) ? "" : 1}</h6>
                                                                </td>
                                                                <td>
                                                                    <div className="widget_day_record_text">
                                                                        <h6><Markup content={product.Title} /></h6>
                                                                        {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
                                                                        {(product.customTags && (typeof product.customTags !== 'undefined')) ?
                                                                            this.extensionArray(product.customTags)
                                                                            :
                                                                            (product.customExtFee && (typeof product.customExtFee !== 'undefined') && product.Price !== 0) ?
                                                                                <div className="font-italic">{product.customExtFee}</div>
                                                                                :
                                                                                <div className="font-italic">{product.color}  {product.size ? ',' + product.size : null}</div>
                                                                        }
                                                                        {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                                        {product.psummary && typeof product.psummary!="undefined" && product.psummary!=""?<div  style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{product.psummary}</div>:null}
                                                                    </div>
                                                                </td>
                                                                {(typeof product.product_id !== 'undefined') ?
                                                                    <td>
                                                                        <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - product.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</span>
                                                                        {parseFloat(product.product_discount_amount) !== 0.00 ?
                                                                            <del>
                                                                                <div className="widget_day_record_text text-right">
                                                                                    <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                                </div>
                                                                            </del>
                                                                            :
                                                                            <div className="widget_day_record_text text-right">
                                                                                <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    :
                                                                    <td>
                                                                        <div className="widget_day_record_text text-right">
                                                                            <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                        </div>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )
                                                    })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <table id="tblminusto_list" className="table table-day-record">
                                            <tbody>
                                                <tr>
                                                    <td colSpan="2">
                                                        <div className="widget_day_record_text">
                                                            <h6>{LocalizedLanguage.tax}: <NumberFormat value={checkList && checkList.tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <div className="widget_day_record_text text-right">
                                                            <h6>{LocalizedLanguage.total}: <NumberFormat value={checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="payment-button-group pb-0">
                                        <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")}>{LocalizedLanguage.continueToPayment}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="payment-footer text-center">
                            <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                            {/* <img src="/assets/img/self-checkout/logo-2-sm.png" alt="" /> */}
                            <img src="../../assets/img/images/logo-light.svg" alt=""/>
                        </div>
                    </div>
                </div>
                <div className="landscape">
                    <div className="page-payment scroll-hidden">
                        <div className="payment-nav">
                            <button className="btn btn-success text-uppercase btn-14" onClick={() => this.GoBackhandleClick()}>{LocalizedLanguage.goBack}</button>
                        </div>
                        <div className="payment-content flex-columns pt-3">
                            <div className="w-100 row d-flex">
                                <div className="col-sm-5">
                                    <div className="payment-page-title">
                                        <img src={landingScreen} className="mx-auto" alt="" />
                                        {/* <img src="../../assets/img/self-checkout/tic-tac-logo.png" class="mx-auto" alt=""/> */}
                                        <h1 className="h2-title text-center text-white font-light m-0">{LocalizedLanguage.orderDetails}</h1>
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    <div className="self-checkout-table widget_day_record pt-3">
                                        <div className="self-checkout-product-light">
                                           <div className="self-checkout-all-product2 overflowscroll padding-10">
                                                <table className="table table-customise table-day-record fixed-table-cell">
                                                    <tbody>
                                                        {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                                                             var _order_Meta= product.addons_meta_data && product.addons_meta_data.length>0 ? CommonJs.showAddons("",product.addons_meta_data):""
                                                            return (
                                                                <tr key={"cart" + index}>
                                                                    <td className="action action-short action-pointer">
                                                                        <h6>{product.quantity ? product.quantity : (product.customTags && (typeof product.customTags !== 'undefined')) ? "" : 1 || (product.customExtFee && (typeof product.customExtFee !== 'undefined')) ? "" : 1}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <div className="widget_day_record_text">
                                                                            <h6><Markup content={product.Title} /></h6>
                                                                            {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
                                                                            {(product.customTags && (typeof product.customTags !== 'undefined')) ?
                                                                                this.extensionArray(product.customTags)
                                                                                :
                                                                                (product.customExtFee && (typeof product.customExtFee !== 'undefined') && product.Price !== 0) ?
                                                                                    <div className="font-italic">{product.customExtFee}</div>
                                                                                    :
                                                                                    <div className="font-italic">{product.color}  {product.size ? ',' + product.size : null}</div>
                                                                            }
                                                                             {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
                                                                        {product.psummary && typeof product.psummary!="undefined" && product.psummary!=""?<div  style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{product.psummary}</div>:null}
                                                                        </div>
                                                                    </td>
                                                                    {(typeof product.product_id !== 'undefined') ?
                                                                        <td>
                                                                            <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - product.product_discount_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}{"  "}</span>
                                                                            {parseFloat(product.product_discount_amount) !== 0.00 ?
                                                                                <del>
                                                                                    <div className="widget_day_record_text text-right">
                                                                                        <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                                    </div>
                                                                                </del>
                                                                                :
                                                                                <div className="widget_day_record_text text-right">
                                                                                    <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                                </div>
                                                                            }
                                                                        </td>
                                                                        :
                                                                        <td>
                                                                            <div className="widget_day_record_text text-right">
                                                                                <h6><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                                            </div>
                                                                        </td>
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>
                                            <table id="tblminusto_list" className="table table-day-record">
                                                <tbody>
                                                    <tr>
                                                        <td colspane="2">
                                                            <div className="widget_day_record_text">
                                                                <h6>{LocalizedLanguage.tax} <NumberFormat value={checkList && checkList.tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                            </div>
                                                        </td>
                                                        <td  className="w-50">
                                                            <div className="widget_day_record_text text-right">
                                                                <h6>{LocalizedLanguage.total}: <NumberFormat value={checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></h6>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="spacer-25"></div>
                            <div className="w-100 row d-flex align-items-center">
                                <div className="col-sm-5 col-xs-5">
                                    <div className="payment-footer text-center p-0">
                                        <p className="payment-copywright">{LocalizedLanguage.selfcheckoutby}</p>
                                        {/* <img src="../../assets/img/logo-2-sm.png" alt="" /> */}
                                        <img src="../../assets/img/images/logo-light.svg" alt=""/>
                                    </div>
                                </div>
                                <div className="col-sm-7 col-xs-7">
                                    <div className="payment-button-group p-0">
                                        <button className="btn btn-default btn-block btn-90 btn-uppercase" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")}>{LocalizedLanguage.continueToPayment}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <OnboardingShopViewPopup
                        title={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_TITLE}
                        subTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE}
                        subTitle2={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE_TWO}
                        onClickContinue={onBackTOLoginBtnClick}
                        imageSrc={''}
                        btnTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_BUTTON_TITLE}
                        id={'firebaseRegisterAlreadyusedPopup'}
                    />
            </div>
        )
    }
}
export default CheckoutCart;