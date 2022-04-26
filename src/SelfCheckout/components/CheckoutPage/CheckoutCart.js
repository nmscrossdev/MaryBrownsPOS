import React from 'react';
import { history } from '../../../_helpers';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import ActiveUser from '../../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import CommonJs, { onBackTOLoginBtnClick } from '../../../_components/CommonJS';
import RecommendedProduct from '../../../SelfCheckout/components/RecommendedProduct'
import Navbar from '../../../SelfCheckout/components/Navbar'
import { FetchIndexDB } from '../../../settings/FetchIndexDB'
import  { getTaxAllProduct } from '../../../_components';
import { cartProductActions } from '../../../_actions';

class CheckoutCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productlist: [],
    }

    this.GoBackhandleClick = this.GoBackhandleClick.bind(this);
    this.incrementDefaultQuantity = this.incrementDefaultQuantity.bind(this);
    this.setDefaultQuantity = this.setDefaultQuantity.bind(this);
    this.decrementDefaultQuantity = this.decrementDefaultQuantity.bind(this);
    this.CartCalulation = this.CartCalulation.bind(this);
  }


  getProductFromIndexDB() {
    var idbKeyval = FetchIndexDB.fetchIndexDb();
    idbKeyval.get('ProductList').then(val => {
      if (!val || val.length == 0 || val == null || val == "") {
        this.setState({ productlist: [] });
      } else {
        this.setState({ productlist: getTaxAllProduct(val) });
      }
    });
  }


  incrementDefaultQuantity = (item, index,action) => {
    this.getProductFromIndexDB();
    setTimeout(() => {
      var product = null;
      product = this.state.productlist.find(prd => prd.WPID == item.product_id);
      if (product && product !== null && product !== undefined) {
        if (item.variation_id !== 0) {
          var variationProdect = this.state.productlist.filter(item => {
            if (product.WPID !== null && product.WPID !== undefined) {
              return (item.ParentId === product.WPID)
            }
          })
          if (product) {
            product['Variations'] = variationProdect;
          }
        }
        if (product && product.Type !== 'variable') {
          product['after_discount'] = item.after_discount;
          product['cart_after_discount'] = item.cart_after_discount;
          product['cart_discount_amount'] = item.cart_discount_amount;
          product['discount_amount'] = item.discount_amount;
          product['discount_type'] = item.discount_type;
          // product['excl_tax'] = item.excl_tax;
          // product['incl_tax'] = item.incl_tax;
          product['new_product_discount_amount'] = item.new_product_discount_amount;
          product['old_price'] = item.old_price;
          product['product_after_discount'] = item.product_after_discount;
          product['product_discount_amount'] = item.product_discount_amount;
          product['selectedIndex'] = index;
          product['addons_meta_data'] = item.addons_meta_data;

          item['ProductAttributes'] = product.ProductAttributes;
          item['combination'] = product.combination;
          item['StockQuantity'] = product.StockQuantity;
          item['StockStatus'] = product.StockStatus;
          item['InStock'] = product.InStock;
          item['IsTicket'] = product.IsTicket;
          item['ManagingStock'] = product.ManagingStock;
          item['ParentId'] = product.ParentId;
          item['WPID'] = product.WPID;
          item['selectedIndex'] = index;
          product['ticket_info'] = item.ticket_info;

          var new_excl_tax=item.excl_tax;
          var new_incl_tax=item.incl_tax;
          if(item.quantity > 1)
          {
            new_excl_tax=item.excl_tax/item.quantity;
            new_incl_tax=item.incl_tax/item.quantity;
          }
          if(action==1)
          {
            item['quantity'] = item.quantity + 1;
          }
          else
          {
            item['quantity'] = item.quantity - 1;
          }
                
          item['Price'] = (item.quantity) * item.old_price
          item['excl_tax'] = parseFloat(item.quantity * new_excl_tax)
          item['incl_tax'] = parseFloat(item.quantity * new_incl_tax);
        } else {
          product !== null && product !== undefined && product.Variations && product.Variations.map(vartion => {
            if (vartion.WPID == item.variation_id) {
              vartion['after_discount'] = item.after_discount;
              vartion['cart_after_discount'] = item.cart_after_discount;
              vartion['cart_discount_amount'] = item.cart_discount_amount;
              vartion['discount_amount'] = item.discount_amount;
              vartion['discount_type'] = item.discount_type;
              vartion['excl_tax'] = item.excl_tax;
              vartion['incl_tax'] = item.incl_tax;
              vartion['new_product_discount_amount'] = item.new_product_discount_amount;
              vartion['old_price'] = item.old_price;
              vartion['product_after_discount'] = item.product_after_discount;
              vartion['product_discount_amount'] = item.product_discount_amount;
              vartion['selectedIndex'] = index;

              item['ProductAttributes'] = vartion.ProductAttributes;
              item['combination'] = vartion.combination;
              item['StockQuantity'] = vartion.StockQuantity;
              item['StockStatus'] = vartion.StockStatus;
              item['InStock'] = vartion.InStock;
              item['IsTicket'] = vartion.IsTicket;
              item['ManagingStock'] = vartion.ManagingStock;
              item['ParentId'] = vartion.ParentId;
              item['WPID'] = vartion.WPID;
              item['selectedIndex'] = index;
              vartion['ticket_info'] = vartion.ticket_info;
              
              var new_excl_tax=item.excl_tax;
              var new_incl_tax=item.incl_tax;
              if(item.quantity > 1)
              {
                new_excl_tax=item.excl_tax/item.quantity;
                new_incl_tax=item.incl_tax/item.quantity;
              }
              if(action==1)
              {
                item['quantity'] = item.quantity + 1;
              }
              else
              {
                item['quantity'] = item.quantity - 1;
              }

              item['Price'] = (item.quantity) * item.old_price
              item['excl_tax'] = parseFloat(item.quantity * new_excl_tax)
              item['incl_tax'] = parseFloat(item.quantity * new_incl_tax);
            }
          })
        }
      }
      var cartItemList = []
      cartItemList.push(item);

      const { dispatch } = this.props;
     this.CartCalulation(cartItemList);
      // dispatch(cartProductActions.showSelectedProduct(item));
      // this.props.showPopuponcartlistView(product, item)
     dispatch(cartProductActions.addtoCartProduct(cartItemList));
    }, 500);

  }



  CartCalulation = (cartproductlist)=> {
    var _subtotal = 0.0;
    var _total = 0.0;
    var _taxAmount = 0.0;
    var _totalDiscountedAmount = 0.0;
    var _exclTax = 0;
    var _inclTax = 0;
    var _subtotalPrice = 0;
    var _subtotalDiscount = 0;
    //var cartproductlist = prevProps.cartproductlist
    // this.setState({ extenstionDiscountStatus: false,UpdateCartByApp:false })
    var CHECKLIST = (typeof localStorage.getItem("CHECKLIST") !== 'undefined') ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
    cartproductlist && cartproductlist.map((item, index) => {
        if (item.Price) {
            _subtotalPrice += item.Price
            _subtotalDiscount += parseFloat(item.discount_amount)
            if (item.product_id) {//donothing
                _exclTax += item.excl_tax ? item.excl_tax : 0,
                    _inclTax += item.incl_tax ? item.incl_tax : 0
            }
        }
    })
    _subtotalDiscount = this.props.RoundAmount(_subtotalDiscount);
    _exclTax =  this.props.RoundAmount(_exclTax);
    _inclTax =  this.props.RoundAmount(_inclTax);
    _subtotal = _subtotalPrice - _subtotalDiscount;
    _totalDiscountedAmount = _subtotalDiscount;
    _taxAmount = parseFloat(_exclTax) + parseFloat(_inclTax);
    _total = parseFloat(_subtotal) + parseFloat(_exclTax);
   // const { dispatch } = this.props;
    const CheckoutList = {
        ListItem: cartproductlist,
        customerDetail: CHECKLIST ? CHECKLIST.customerDetail : '',
        totalPrice: _total,
        discountCalculated: _totalDiscountedAmount,
        tax: _taxAmount,
        subTotal: _subtotal,
        TaxId: CHECKLIST ? CHECKLIST.TaxId : 0,
        TaxRate: CHECKLIST ? CHECKLIST.TaxRate : 0,
        order_id: CHECKLIST && CHECKLIST !== null ? CHECKLIST.order_id : 0,
        oliver_pos_receipt_id: CHECKLIST && CHECKLIST !== null && CHECKLIST.oliver_pos_receipt_id ? CHECKLIST.oliver_pos_receipt_id : 0,
        showTaxStaus: CHECKLIST ? CHECKLIST.showTaxStaus : 'tax',
        _wc_points_redeemed: CHECKLIST._wc_points_redeemed,
        _wc_amount_redeemed: CHECKLIST._wc_amount_redeemed,
        _wc_points_logged_redemption: CHECKLIST._wc_points_logged_redemption
    }
    console.log("CheckoutList-------->",CheckoutList)
    //setTimeout(function () {
      localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
  //}, 1000)
  }





  decrementDefaultQuantity(item, index) {
    console.log("item ----->", item)
    console.log("index----->", index)
    var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
    console.log("cartItemList----->", cartItemList)

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

  
//   handleNote() {
    
//     var txtNote = jQuery("#orderInstrucions").val();
//     if (txtNote != "") {
//         var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
//         cartlist = cartlist == null ? [] : cartlist;
//         cartlist.push({ "Title": txtNote })
//         this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
//         var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
//         if (list != null) {
//             const CheckoutList = {
//                 ListItem: cartlist,
//                 customerDetail: list.customerDetail,
//                 totalPrice: list.totalPrice,
//                 discountCalculated: list.discountCalculated,
//                 tax: list.tax,
//                 subTotal: list.subTotal,
//                 TaxId: list.TaxId,
//                 order_id: list.order_id !== 0 ? list.order_id : 0,
//                 showTaxStaus: list.showTaxStaus,
//                 _wc_points_redeemed: list._wc_points_redeemed,
//                 _wc_amount_redeemed: list._wc_amount_redeemed,
//                 _wc_points_logged_redemption: list._wc_points_logged_redemption
//             }
//             localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
//         }
//         jQuery("#orderInstrucions").val('');
//     }
// }


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
    var checkList1 = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : [];
    console.log("this.props---------->",checkList)
    return (
      <div className="portrait ">
        <div className='ordersummary-parret' style={{ padding: "35px 40px 0 40px", backgroundColor: '#f1f1f1' }}>

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
          <Navbar margin={"topnav margin-bottom-59"} itemCount={checkList1 && checkList1.ListItem ? checkList1.ListItem.length : ''} />
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
              <p className="highlight">({checkList1 && checkList1.ListItem ? checkList1.ListItem.length : 'X'} items)</p>
            </div>
            <div className="cart-items">
              <div className="items-group scroll">


                {checkList1 && checkList1.ListItem && checkList1.ListItem.map((product, index) => {
                  //var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (
                  product.Price!=null?
                    <div className="item" key={index}>
                      <div className="col">
                        <p className="prod-name"><Markup content={product.Title} /></p>
                      </div>
                      <div className="row">
                        <label className="number-input-container">
                          <div onClick={() => this.incrementDefaultQuantity(product, index,0)} class="svg-container left">
                            <svg width="16" height="2" viewBox="0 0 16 2" style={{ width: "30px", paddingLeft: "10px" }}>
                              <rect width="16" height="2" fill="#758696" />
                            </svg>
                          </div>
                          <input type="number" value={product.quantity}/>
                          <div onClick={() => this.incrementDefaultQuantity(product, index,1)} className="svg-container right">
                            <svg width={16} height={16} viewBox="0 0 16 16" style={{ width: "30px", paddingRight: "10px" }}>
                              <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                            </svg>
                          </div>
                        </label>
                        <div className="inner-row">
                          <p className="price" style={{ width: '50px' }}> {product.Price}</p>
                          <svg width={15} height={15} viewBox="0 0 15 15" onClick={this.props.deleteProduct(product)}>
                            <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    :
                   null
                  )
                })
                }
              {checkList1 && checkList1.ListItem && checkList1.ListItem.map((product, index) => {
                  //var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (
                  product.Price==null?
                  <div className="item note">
                  <div className="col">
                    <p className="prod-name">Note</p>
                    <p className="description"><Markup content={product.Title} /></p>
                  </div>
                  <div className="row" style={{ justifyContent: "center", paddingLeft: "26px" }}>
                    <div></div>
                    <svg width={15} height={15} viewBox="0 0 15 15">
                      <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                    </svg>
                  </div>
                </div>
                    :
                   null
                  )
                })
                }
              
              </div>
              {/* <div className="empty hide">
                <p>Cart is Empty</p>
              </div> */}
              <div className="cart-total">
                <div className="subtotal">
                  <div className="col">
                    <p>{LocalizedLanguage.subTotal}</p>
                    <p>{LocalizedLanguage.discount}</p>
                    <p>{LocalizedLanguage.tax}</p>
                  </div>
                  <div className="col">
                    <p className="subtotal-amount right"> {checkList1 && checkList1.subTotal}</p>
                    {/* <p className="discount-amount right">$2.99</p> */}
                    <p className="tax-amount right">{checkList1 && checkList1.tax} </p>
                  </div>
                </div>
                <div className="total">
                  <p>{LocalizedLanguage.total}</p>
                  <p className="cart-amount"> {checkList1 && checkList1.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList1.totalPrice - paid_amount))) : '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="instructions">Order instructions</p>
          <textarea name="orderInstrucions" id="orderInstrucions" className="order-instructions" placeholder="Enter your instructions" defaultValue={""}  />

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
                          <div className="svg-container left">
                            {/* <img src="assets/image/minus-sign.png" style={{width:"16px" , height:"40px"}} /> */}
                            <svg width={16} height={2} viewBox="0 0 16 2">
                              <rect width={16} height={2} fill="#758696" />
                            </svg>
                          </div>
                          <input type="number" defaultValue={1} />
                          <div className="svg-container right">
                            <svg width={16} height={16} viewBox="0 0 16 16">
                              <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                            </svg>
                          </div>
                        </label>
                        <div className="inner-row">
                          <p className="price"> {product.Price}</p>
                          <svg width={15} height={15} viewBox="0 0 15 15">
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
                    <svg width={15} height={15} viewBox="0 0 15 15">
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
          </div>
        </div>
      </div>)
  }
}
export default CheckoutCart;