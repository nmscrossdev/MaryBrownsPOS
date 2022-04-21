import React from 'react';
import { history } from '../../../_helpers';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import ActiveUser from '../../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import CommonJs, { onBackTOLoginBtnClick } from '../../../_components/CommonJS';
import RecommendedProduct from '../../../SelfCheckout/components/RecommendedProduct'
import Navbar from '../../../SelfCheckout/components/Navbar'

class CheckoutCart extends React.Component {
  constructor(props) {
    super(props);
   
    this.GoBackhandleClick = this.GoBackhandleClick.bind(this);
    this.incrementDefaultQuantity = this.incrementDefaultQuantity.bind(this);
    this.setDefaultQuantity = this.setDefaultQuantity.bind(this);
    this.decrementDefaultQuantity = this.decrementDefaultQuantity.bind(this);
  }

  incrementDefaultQuantity = (item,index) => {
   
    console.log("item ----->",item)
    console.log("index----->",index)
    var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
    console.log("cartItemList----->",cartItemList)
}

  decrementDefaultQuantity(item,index) {
    console.log("item ----->",item)
    console.log("index----->",index)
    var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
    console.log("cartItemList----->",cartItemList)
    
}

setDefaultQuantity(qty) {
    this.setState({
        variationDefaultQunatity: qty,
    });
}



  componentDidMount() {
    setTimeout(function () {
      if (typeof EnableContentScroll != "undefined") { EnableContentScroll(); }
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
    var landingScreen = ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo : '';
    // if (Register_Permissions) {
    //     Register_Permissions.content && Register_Permissions.content.filter(item => item.slug == "landing-screen").map(permission => {
    //         landingScreen = permission.value;
    //     })
    // }
    console.log("checkList---------->", checkList)
    console.log("cartDiscountAmount------->", cartDiscountAmount)
    console.log("cash_round------>",cash_round)
    console.log("RoundAmount-------->",RoundAmount)
    return (
        <div className="portrait ">
        <div className='ordersummary-parret' style={{padding: "35px 40px 0 40px",backgroundColor:'#f1f1f1'}}>

          {/* <div className="page-payment scroll-hidden">
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
                            <img src="../../assets/img/images/logo-light.svg" alt=""/>
                        </div>
                    </div> */}



          {/* <div className="topnav margin-bottom-59"> */}
          <Navbar margin={"topnav margin-bottom-59"} itemCount={checkList && checkList.ListItem ?checkList.ListItem.length:''}/>
          {/* </div> */}
          <div className="category-header-row">
            <div className="category-header-col">
              <p className="title">Order Summary</p>
            </div>
            <button onClick={() => this.GoBackhandleClick()}>
              <svg width={22} height={20} viewBox="0 0 22 20">
                <path d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
              </svg>
              Go back to main menu
            </button>
          </div>
          <div className="category-header-divider margin-bottom-59" />
          <div className="cart margin-bottom-43">
            <div className="text-row">
              <p className="bold">Review your order</p>
              <p className="highlight">({checkList && checkList.ListItem ?checkList.ListItem.length:'X'} items)</p>
            </div>
            <div className="cart-items">
              <div className="items-group scroll">


                {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                  var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (

                    <div className="item"  key={index}>
                      <div className="col">
                        <p className="prod-name"><Markup content={product.Title} /></p>
                      </div>
                      <div className="row">
                        <label className="number-input-container">
                        <div  class="svg-container left">
                          <svg width="16" height="2" viewBox="0 0 16 2">
                            <rect width="16" height="2" fill="#758696" />
                          </svg>
                        </div>
                          <input type="number" defaultValue={1} />
                          <div  className="svg-container right">
                            <svg width={16} height={16} viewBox="0 0 16 16">
                              <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                            </svg>
                          </div>
                        </label>
                        <div className="inner-row">
                          <p className="price"> {product.Price}</p>
                          <svg  width={15} height={15} viewBox="0 0 15 15" onClick={this.props.deleteProduct(product)}>
                            <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
                 
                 
                  


                <div className="item note">
                  <div className="col">
                    <p className="prod-name">Note</p>
                    <p className="description">Please have ready for pickup at 1:30</p>
                  </div>
                  <div className="row" style={{justifyContent:"center",paddingLeft:"8px"}}>
                    <div></div>
                    <svg  width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="empty hide">
                <p>Cart is Empty</p>
              </div>
              <div className="cart-total">
                <div className="subtotal">
                  <div className="col">
                    <p>{LocalizedLanguage.subTotal}</p>
                    <p>{LocalizedLanguage.discount}</p>
                    <p>{LocalizedLanguage.tax}</p>
                  </div>
                  <div className="col">
                    <p className="subtotal-amount right"> {checkList && checkList.subTotal}</p>
                    {/* <p className="discount-amount right">$2.99</p> */}
                    <p className="tax-amount right">{checkList && checkList.tax} </p>
                  </div>
                </div>
                <div className="total">
                  <p>{LocalizedLanguage.total}</p>
                  <p className="cart-amount"> {checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="instructions">Order instructions</p>
          <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""} />

          <RecommendedProduct />

          <button onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart scroll-end">
            {LocalizedLanguage.continueToPayment}
          </button>

         



        </div>
        <div className="landscape">
          {/* <div className="page-payment scroll-hidden">
                        <div className="payment-nav">
                            <button className="btn btn-success text-uppercase btn-14" onClick={() => this.GoBackhandleClick()}>{LocalizedLanguage.goBack}</button>
                        </div>
                        <div className="payment-content flex-columns pt-3">
                            <div className="w-100 row d-flex">
                                <div className="col-sm-5">
                                    <div className="payment-page-title">
                                        <img src={landingScreen} className="mx-auto" alt="" />
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
                    </div> */}


          <div className="topnav margin-bottom-59">
              <Navbar />
          </div>
          <div className="category-header-row">
            <div className="category-header-col">
              <p className="title">Order Summary</p>
            </div>
            <button onClick={() => this.GoBackhandleClick()}>
              <svg width={22} height={20} viewBox="0 0 22 20">
                <path d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
              </svg>
              Go back to main menu
            </button>
          </div>
          <div className="category-header-divider margin-bottom-59" />
          <div className="cart margin-bottom-43">
            <div className="text-row">
              <p className="bold">Review your order</p>
              <p className="highlight">(X items)</p>
            </div>
            <div className="cart-items">
              <div className="items-group scroll">


                {checkList && checkList.ListItem && checkList.ListItem.map((product, index) => {
                  //var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (

                    <div className="item">
                      <div className="col">
                        <p className="prod-name"><Markup content={product.Title} /></p>

                        {/* <p className="description">Big Mary Sandwich</p>
                        <p className="description">Diet 7up</p>
                        <p className="description">Taters</p>
                        <p className="description">Small Coleslaw Salad</p>
                        <p className="note">Note: No Mayo</p>
                        <p className="note">Discount: $2.99</p> */}

                      </div>
                      <div className="row">
                        <label className="number-input-container">
                          <div  className="svg-container left">
                            {/* <img src="assets/image/minus-sign.png" style={{width:"16px" , height:"40px"}} /> */}
                             <svg width={16} height={2} viewBox="0 0 16 2">
                              <rect width={16} height={2} fill="#758696" />
                           </svg>
                          </div>
                          <input type="number" defaultValue={1} />
                          <div  className="svg-container right">
                            <svg width={16} height={16} viewBox="0 0 16 16">
                              <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                            </svg>
                          </div>
                        </label>
                        <div className="inner-row">
                          <p className="price"> {product.Price}</p>
                          <svg  width={15} height={15} viewBox="0 0 15 15">
                            <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )
                })
                }


                <div className="item note">
                  <div className="col">
                    <p className="prod-name">Note</p>
                    <p className="description">Please have ready for pickup at 1:30</p>
                  </div>
                  <div className="row">
                    <div />
                    <svg  width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
                <div className="empty hide">
                  <p>Cart is Empty</p>
                </div>
                <div className="cart-total">
                  <div className="subtotal">
                    <div className="col">
                    <p>{LocalizedLanguage.subTotal}</p>
                    <p>{LocalizedLanguage.discount}</p>
                    <p>{LocalizedLanguage.tax}</p>
                    </div>
                    <div className="col">
                    <p className="subtotal-amount right"> {checkList && checkList.subTotal}</p>
                    <p className="discount-amount right">$2.99</p>
                    <p className="tax-amount right">{checkList && checkList.tax} </p>
                    </div>
                  </div>
                  <div className="total">
                  <p>{LocalizedLanguage.total}</p>
                  <p className="cart-amount"> {checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'}</p>
                </div>
                </div>
              </div>
            </div>
            <p className="instructions">Order instructions</p>
            <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""} />
            <RecommendedProduct />
            <button onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart scroll-end">
            {LocalizedLanguage.continueToPayment}
            </button>
            <div className="cover hide" />
            <div className="app nutrition-info hide">
              <div onclick="toggleApp()" className="close">
                <svg width={23} height={23} viewBox="0 0 23 23">
                  <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
                </svg>
              </div>
              <div className="row">
                <div className="icon">
                  <svg width={39} height={44} viewBox="0 0 39 44">
                    <path d="M11.8659 17.9405C11.9808 18.2862 11.9539 18.6634 11.7909 18.9893C11.628 19.3151 11.3424 19.563 10.9969 19.6785C10.5747 19.812 10.1831 20.0277 9.84466 20.3133C9.50625 20.5988 9.22771 20.9485 9.0251 21.3422C8.51635 22.302 8.1671 23.8805 8.48885 26.4572C8.52279 26.8135 8.41645 27.169 8.19245 27.4482C7.96845 27.7273 7.64443 27.9081 7.28924 27.9521C6.93405 27.9962 6.57569 27.9 6.29029 27.684C6.0049 27.468 5.81497 27.1493 5.76085 26.7955C5.3951 23.8722 5.73335 21.6695 6.5996 20.0497C7.4796 18.3997 8.81885 17.506 10.1279 17.0715C10.4736 16.9565 10.8508 16.9835 11.1766 17.1464C11.5025 17.3093 11.7504 17.5949 11.8659 17.9405ZM25.4344 3.17848C25.7672 3.0533 26.0387 2.804 26.1916 2.48295C26.3446 2.1619 26.3673 1.79406 26.2548 1.45667C26.1423 1.11928 25.9035 0.838589 25.5885 0.673535C25.2735 0.508481 24.9068 0.471903 24.5654 0.571482C21.9859 1.42948 20.3771 3.54698 19.4339 5.81573C19.3059 6.12237 19.1885 6.4333 19.0819 6.74798C18.5675 5.77229 17.9093 4.87955 17.1294 4.09973C16.0723 3.04045 14.8098 2.20857 13.4194 1.65525C12.029 1.10194 10.5402 0.83887 9.04435 0.882231C8.27828 0.903022 7.54927 1.21644 7.00712 1.75808C6.46497 2.29971 6.15087 3.02843 6.12935 3.79448C6.08599 5.31039 6.35734 6.81883 6.92627 8.2246C7.49521 9.63036 8.34937 10.9029 9.43485 11.962C7.12484 12.4624 5.0373 13.6931 3.48115 15.4722C1.925 17.2512 0.982926 19.4839 0.794354 21.84L0.777854 22.0435C0.414803 26.5733 1.38 31.1107 3.55535 35.1005L4.5426 36.91C4.5701 36.9567 4.5976 37.0035 4.6306 37.0475L7.3806 40.903C8.00388 41.7758 8.80983 42.5025 9.7424 43.0323C10.675 43.5621 11.7118 43.8823 12.7807 43.9708C13.8496 44.0593 14.9249 43.9138 15.9319 43.5445C16.9389 43.1752 17.8533 42.591 18.6116 41.8325C18.7281 41.716 18.8663 41.6236 19.0185 41.5605C19.1707 41.4975 19.3338 41.465 19.4985 41.465C19.6632 41.465 19.8263 41.4975 19.9785 41.5605C20.1306 41.6236 20.2689 41.716 20.3854 41.8325C21.1436 42.591 22.0581 43.1752 23.0651 43.5445C24.072 43.9138 25.1474 44.0593 26.2163 43.9708C27.2852 43.8823 28.322 43.5621 29.2546 43.0323C30.1871 42.5025 30.9931 41.7758 31.6164 40.903L34.3664 37.0502C34.3994 37.0053 34.4297 36.9585 34.4571 36.91L35.4416 35.1005C37.6179 31.1109 38.5841 26.5735 38.2219 22.0435L38.2054 21.84C38.0836 20.3217 37.6479 18.8452 36.9257 17.504C36.2036 16.1629 35.2107 14.9864 34.0102 14.049C32.8096 13.1116 31.4274 12.4337 29.9512 12.0584C28.475 11.683 26.9369 11.6184 25.4344 11.8685L20.8749 12.6275C20.9024 10.7547 21.2324 8.64823 21.9694 6.87173C22.7421 5.01548 23.8861 3.69548 25.4344 3.17848ZM15.9744 12.27L15.5509 12.1985C13.937 11.8864 12.454 11.097 11.2939 9.93248C10.4988 9.14008 9.87443 8.19329 9.45918 7.15043C9.04393 6.10758 8.8466 4.99074 8.87935 3.86873C8.88008 3.80503 8.90589 3.74418 8.9512 3.69939C8.9965 3.6546 9.05764 3.62948 9.12135 3.62948C10.2429 3.59711 11.3592 3.79462 12.4016 4.20986C13.4439 4.6251 14.3903 5.24928 15.1824 6.04398C16.8516 7.71323 17.6574 9.91598 17.5969 12.1077C17.5961 12.171 17.5707 12.2314 17.526 12.2761C17.4813 12.3208 17.4208 12.3463 17.3576 12.347C16.8952 12.3599 16.4325 12.3341 15.9744 12.27ZM15.0724 14.9072L15.5509 14.987L17.6904 15.3445C18.8884 15.5443 20.1113 15.5443 21.3094 15.3445L25.8854 14.58C27.0126 14.392 28.1665 14.4402 29.2741 14.7216C30.3817 15.003 31.4187 15.5114 32.3195 16.2147C33.2203 16.9179 33.9651 17.8006 34.5068 18.8068C35.0485 19.8131 35.3753 20.9208 35.4664 22.06L35.4801 22.2635C35.8001 26.2611 34.9476 30.2653 33.0271 33.786L32.0811 35.5185L29.3779 39.3025C28.9869 39.8504 28.4813 40.3067 27.8961 40.6394C27.3109 40.9721 26.6603 41.1733 25.9895 41.2291C25.3187 41.2848 24.6438 41.1937 24.0117 40.9622C23.3797 40.7306 22.8056 40.3641 22.3296 39.8882C21.5787 39.1374 20.5603 38.7156 19.4985 38.7156C18.4366 38.7156 17.4182 39.1374 16.6674 39.8882C16.1913 40.3641 15.6173 40.7306 14.9852 40.9622C14.3532 41.1937 13.6783 41.2848 13.0075 41.2291C12.3366 41.1733 11.686 40.9721 11.1009 40.6394C10.5157 40.3067 10.0101 39.8504 9.6191 39.3025L6.91585 35.5185L5.96985 33.786C4.04933 30.2653 3.19689 26.2611 3.51685 22.2635L3.53335 22.06C3.62444 20.9208 3.95119 19.8131 4.4929 18.8068C5.03461 17.8006 5.77945 16.9179 6.68021 16.2147C7.58098 15.5114 8.61802 15.003 9.72561 14.7216C10.8332 14.4402 11.9872 14.392 13.1144 14.58L15.0724 14.9072Z" fill="white" />
                  </svg>
                </div>
                <div className="col">
                  <p>Nutritional Information</p>
                  <div className="divider" />
                </div>
              </div>
              <img src="../assets/Mary-Browns-Nutritional-Chart.png" alt="" />
            </div>
            <div className="app offers hide">
              <div onclick="toggleApp()" className="close">
                <svg width={23} height={23} viewBox="0 0 23 23">
                  <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
                </svg>
              </div>
              <div className="row">
                <div className="icon">
                  <svg width={39} height={39} viewBox="0 0 39 39">
                    <path d="M39 23.2841V36.6569C39 37.1636 38.7717 37.6495 38.3654 38.0078C37.9591 38.366 37.408 38.5673 36.8333 38.5673H2.16667C1.59203 38.5673 1.04093 38.366 0.634602 38.0078C0.228273 37.6495 0 37.1636 0 36.6569V23.2841C1.14927 23.2841 2.25147 22.8816 3.06413 22.1651C3.87679 21.4485 4.33333 20.4767 4.33333 19.4633C4.33333 18.45 3.87679 17.4782 3.06413 16.7616C2.25147 16.0451 1.14927 15.6426 0 15.6426V2.26977C0 1.7631 0.228273 1.27719 0.634602 0.918917C1.04093 0.560648 1.59203 0.359375 2.16667 0.359375H36.8333C37.408 0.359375 37.9591 0.560648 38.3654 0.918917C38.7717 1.27719 39 1.7631 39 2.26977V15.6426C37.8507 15.6426 36.7485 16.0451 35.9359 16.7616C35.1232 17.4782 34.6667 18.45 34.6667 19.4633C34.6667 20.4767 35.1232 21.4485 35.9359 22.1651C36.7485 22.8816 37.8507 23.2841 39 23.2841ZM34.6667 26.0829C33.3486 25.4123 32.2541 24.4475 31.4934 23.2854C30.7327 22.1233 30.3326 20.8051 30.3333 19.4633C30.3333 16.636 32.0753 14.1658 34.6667 12.8438V4.18017H4.33333V12.8438C6.92467 14.1658 8.66667 16.636 8.66667 19.4633C8.66667 22.2907 6.92467 24.7609 4.33333 26.0829V34.7465H34.6667V26.0829ZM13 8.00096H26V11.8218H13V8.00096ZM13 27.1049H26V30.9257H13V27.1049Z" fill="white" />
                  </svg>
                </div>
                <div className="col">
                  <p>Offers</p>
                  <div className="divider" />
                </div>
              </div>
              <div className="offers-bank">
                <img src="../assets/offer1.png" alt="" />
                <img src="../assets/offer1.png" alt="" />
                <img src="../assets/offer1.png" alt="" />
                <img src="../assets/offer1.png" alt="" />
                <img src="../assets/offer1.png" alt="" />
                <img src="../assets/offer1.png" alt="" />
              </div>
            </div>
            <div className="app loyalty hide">
              <div onclick="toggleApp()" className="close">
                <svg width={23} height={23} viewBox="0 0 23 23">
                  <path d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z" fill="#050505" />
                </svg>
              </div>
              <div className="row">
                <div className="icon">
                  <svg width={53} height={51} viewBox="0 0 53 51">
                    <path d="M52.7776 19.1512C52.5242 18.3627 52.0582 17.6598 51.4312 17.1204C50.8042 16.5811 50.0406 16.2263 49.225 16.0953L36.4267 14.0091L30.4938 2.44499C30.1159 1.7088 29.5431 1.09125 28.8383 0.660094C28.1335 0.228943 27.3239 0.000854492 26.4984 0.000854492C25.6729 0.000854492 24.8633 0.228943 24.1585 0.660094C23.4537 1.09125 22.8809 1.7088 22.503 2.44499L16.5701 14.0091L3.77201 16.0953C2.95722 16.2284 2.19469 16.5839 1.5681 17.123C0.94151 17.6621 0.475072 18.3639 0.219964 19.1514C-0.0351441 19.9389 -0.0690643 20.7817 0.121925 21.5873C0.312914 22.3928 0.721433 23.1301 1.30266 23.7181L10.4341 32.9513L8.45765 45.8047C8.33083 46.6234 8.43156 47.4612 8.74876 48.2262C9.06597 48.9912 9.58736 49.6536 10.2556 50.1406C10.9238 50.6275 11.713 50.9202 12.5363 50.9864C13.3597 51.0527 14.1853 50.8898 14.9223 50.5159L26.4984 44.6582L38.0748 50.5159C38.8119 50.8891 39.6373 51.0513 40.4603 50.9847C41.2834 50.9182 42.0722 50.6254 42.7402 50.1386C43.4082 49.6518 43.9295 48.9898 44.2469 48.2252C44.5643 47.4607 44.6656 46.6232 44.5395 45.8047L42.563 32.9513L51.6945 23.7181C52.2775 23.1312 52.6873 22.394 52.8785 21.588C53.0696 20.7819 53.0347 19.9386 52.7776 19.1512V19.1512ZM49.1857 21.2223L38.7988 31.7248L41.0473 46.3453C41.0752 46.5204 41.0542 46.6998 40.9867 46.8636C40.9191 47.0275 40.8077 47.1694 40.6646 47.2736C40.5216 47.3778 40.3526 47.4403 40.1764 47.4541C40.0002 47.4679 39.8235 47.4325 39.6661 47.3518L26.4984 40.6887L13.3306 47.352C13.1732 47.4327 12.9965 47.4681 12.8203 47.4543C12.6441 47.4405 12.4751 47.3781 12.3321 47.2738C12.189 47.1696 12.0776 47.0277 12.01 46.8639C11.9425 46.7 11.9215 46.5206 11.9494 46.3455L14.198 31.7248L3.81121 21.2222C3.68717 21.0965 3.60002 20.939 3.5593 20.7669C3.51857 20.5948 3.52585 20.4148 3.58033 20.2466C3.63482 20.0784 3.7344 19.9285 3.86818 19.8133C4.00196 19.6981 4.16478 19.622 4.33878 19.5935L18.8962 17.2205L25.6448 4.06673C25.7255 3.90939 25.8478 3.7774 25.9984 3.68524C26.149 3.59308 26.322 3.54433 26.4984 3.54433C26.6748 3.54433 26.8478 3.59308 26.9984 3.68524C27.149 3.7774 27.2713 3.90939 27.352 4.06673L34.1006 17.2205L48.658 19.5935C48.832 19.622 48.9948 19.6981 49.1286 19.8133C49.2624 19.9285 49.362 20.0784 49.4165 20.2466C49.471 20.4148 49.4782 20.5948 49.4375 20.7669C49.3968 20.939 49.3096 21.0965 49.1856 21.2222L49.1857 21.2223Z" fill="white" />
                  </svg>
                </div>
                <div className="col">
                  <p>Nutritional Information</p>
                  <div className="divider" />
                </div>
              </div>
              <div className="col">
                <p>Scan your QR code below</p>
                <svg className="barcode" width={214} height={214} viewBox="0 0 214 214">
                  <path d="M80.25 48.15V80.25H48.15V48.15H80.25ZM96.3 32.1H32.1V96.3H96.3V32.1ZM80.25 133.75V165.85H48.15V133.75H80.25ZM96.3 117.7H32.1V181.9H96.3V117.7ZM165.85 48.15V80.25H133.75V48.15H165.85ZM181.9 32.1H117.7V96.3H181.9V32.1ZM117.7 117.7H133.75V133.75H117.7V117.7ZM133.75 133.75H149.8V149.8H133.75V133.75ZM149.8 117.7H165.85V133.75H149.8V117.7ZM117.7 149.8H133.75V165.85H117.7V149.8ZM133.75 165.85H149.8V181.9H133.75V165.85ZM149.8 149.8H165.85V165.85H149.8V149.8ZM165.85 133.75H181.9V149.8H165.85V133.75ZM165.85 165.85H181.9V181.9H165.85V165.85ZM203.3 53.5C197.415 53.5 192.6 48.685 192.6 42.8V21.4H171.2C165.315 21.4 160.5 16.585 160.5 10.7C160.5 4.815 165.315 0 171.2 0H203.3C209.185 0 214 4.815 214 10.7V42.8C214 48.685 209.185 53.5 203.3 53.5ZM214 203.3V171.2C214 165.315 209.185 160.5 203.3 160.5C197.415 160.5 192.6 165.315 192.6 171.2V192.6H171.2C165.315 192.6 160.5 197.415 160.5 203.3C160.5 209.185 165.315 214 171.2 214H203.3C209.185 214 214 209.185 214 203.3ZM10.7 214H42.8C48.685 214 53.5 209.185 53.5 203.3C53.5 197.415 48.685 192.6 42.8 192.6H21.4V171.2C21.4 165.315 16.585 160.5 10.7 160.5C4.815 160.5 0 165.315 0 171.2V203.3C0 209.185 4.815 214 10.7 214ZM0 10.7V42.8C0 48.685 4.815 53.5 10.7 53.5C16.585 53.5 21.4 48.685 21.4 42.8V21.4H42.8C48.685 21.4 53.5 16.585 53.5 10.7C53.5 4.815 48.685 0 42.8 0H10.7C4.815 0 0 4.815 0 10.7Z" fill="#E6702A" />
                </svg>
                <img src="../assets/arrow.gif" alt="" />&gt;
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
}
export default CheckoutCart;