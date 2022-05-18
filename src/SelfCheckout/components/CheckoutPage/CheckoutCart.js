import React from 'react';
import { connect } from 'react-redux';
import { history } from '../../../_helpers';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import ActiveUser from '../../../settings/ActiveUser';
import { OnboardingShopViewPopup } from '../../../onboarding/components/OnboardingShopViewPopup';
import {getHostURLsBySelectedExt}  from '../../../_components/CommonJS';
import RecommendedProduct from '../../../SelfCheckout/components/RecommendedProduct'
import Navbar from '../../../SelfCheckout/components/Navbar'
import { FetchIndexDB } from '../../../settings/FetchIndexDB'
import { getTaxAllProduct } from '../../../_components';
import { cartProductActions } from '../../../_actions';
import { _key, isDisplay } from '../../../settings/SelfCheckoutSettings';
import { CommonExtensionPopup } from '../../../_components/CommonExtensionPopup';
class CheckoutCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productlist: [],
      checkList: localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : [],
      variationDefaultQunatity: 1,
      extHostUrl: '',
      extPageUrl: '',
      extName:'',
      extLogo:'',
      extensionIframe: false,
    }

    this.GoBackhandleClick = this.GoBackhandleClick.bind(this);
    this.incrementDefaultQuantity = this.incrementDefaultQuantity.bind(this);
    this.setDefaultQuantity = this.setDefaultQuantity.bind(this);
    // this.decrementDefaultQuantity = this.decrementDefaultQuantity.bind(this);
    this.CartCalulation = this.CartCalulation.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
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


  incrementDefaultQuantity = (item, index, action) => {
    if (action == 0 && item.quantity <= 1) {
      return;
    }
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
          //item['quantity']=1;
          // var new_excl_tax=item.excl_tax;
          // var new_incl_tax=item.incl_tax;
          // if(item.quantity > 1)
          // {
          //   new_excl_tax=item.excl_tax/item.quantity;
          //   new_incl_tax=item.incl_tax/item.quantity;
          // }
          if (action == 1) {
            item['quantity'] = 1;
            item['Price'] = item.old_price

          }
          else {
            item['quantity'] = item['quantity'] - 1;
            item['Price'] = item['Price'] - item.old_price
          }


          // item['excl_tax'] = parseFloat(item.quantity * new_excl_tax)
          // item['incl_tax'] = parseFloat(item.quantity * new_incl_tax);
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

              // var new_excl_tax=item.excl_tax;
              // var new_incl_tax=item.incl_tax;
              // if(item.quantity > 1)
              // {
              //   new_excl_tax=item.excl_tax/item.quantity;
              //   new_incl_tax=item.incl_tax/item.quantity;
              // }
              if (action == 1) {
                item['quantity'] = 1;
                item['Price'] = item.old_price

              }
              else {
                item['quantity'] = item['quantity'] - 1;
                item['Price'] = item['Price'] - item.old_price
              }

              // item['excl_tax'] = parseFloat(item.quantity * new_excl_tax)
              // item['incl_tax'] = parseFloat(item.quantity * new_incl_tax);
            }
          })
        }
      }
      var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []

      if (item && cartlist.length > 0) {
        var isItemFoundToUpdate = false;
        //var _index=0;
        if (action == 0) {
          cartlist.map((_item, _index) => {
            //if (typeof showSelectedProduct !== 'undefined' && showSelectedProduct !== null) {
            //var _index = -1;
            // if (item['selectedIndex'] >= 0) 
            // { 
            //   _index = parseInt(_item.selectedIndex) 
            // }
            if (item.selectedIndex == _index) {
              isItemFoundToUpdate = true;
              cartlist[index] = item;
            }
            //}
          })
        }

        if (isItemFoundToUpdate == false) {
          cartlist.push(item);
        }
      }


      // var checkList = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : [];
      // var cartItemList =localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
      // //var cartItemList = []
      // cartItemList.push(item);

      const { dispatch } = this.props;
      //this.CartCalulation(cartlist);
      // dispatch(cartProductActions.showSelectedProduct(item));
      // this.props.showPopuponcartlistView(product, item)
      dispatch(cartProductActions.addtoCartProduct(cartlist));
    }, 500);

  }



  CartCalulation = (cartproductlist) => {
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
    _exclTax = this.props.RoundAmount(_exclTax);
    _inclTax = this.props.RoundAmount(_inclTax);
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
      // _wc_points_redeemed: CHECKLIST._wc_points_redeemed,
      // _wc_amount_redeemed: CHECKLIST._wc_amount_redeemed,
      // _wc_points_logged_redemption: CHECKLIST._wc_points_logged_redemption
    }
    console.log("CheckoutList-------->", CheckoutList)
    //setTimeout(function () {
    localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList));
    this.setState({ checkList: CheckoutList });
    //}, 1000)
  }





  // decrementDefaultQuantity(item, index) {
  //   console.log("item ----->", item)
  //   console.log("index----->", index)
  //   var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
  //   console.log("cartItemList----->", cartItemList)

  // }



  setDefaultQuantity(qty) {
    this.setState({
      variationDefaultQunatity: qty,
    });
  }
  // Update the actual qty of variations --------------------------
  updateActualStockQty(prd) {
    var idbKeyval = FetchIndexDB.fetchIndexDb();
    idbKeyval.get('ProductList').then(val => {
      if (val && val != "" && val.length >= 0) {
        var found = val.find(function (indx) {
          return indx.WPID == prd.WPID;
        });
        if (found) {
          prd["StockQuantity"] = found.StockQuantity;
        }
      }
    });
    return prd;
  }


  componentDidMount() {
    setTimeout(function () {
      if (typeof EnableContentScroll != "undefined") { EnableContentScroll(); }
    }, 2000)

  }

  GoBackhandleClick() {
    history.push('/SelfCheckoutView');
    //setTimeout(function () { selfCheckoutJs(); }, 100)
  }

  componentWillReceiveProps(nextProps) {

    var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
    this.CartCalulation(cartlist)
    // if (nextProps.checkList && nextProps.checkList.ListItem)
    // {

    // }
  }
  deleteProduct = (item) => {
    console.log("deleteProduct calling-->")

    var product = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
    var productx = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : [];//
    // var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
    // if (tikeraSelectedSeats.length > 0) {
    //     tikeraSelectedSeats.map((items, index) => {
    //         if (parseInt(items.chart_id) == parseInt(item.product_id)) {
    //             tikeraSelectedSeats.splice(index, 1);
    //         }
    //     })
    //     localStorage.setItem('TIKERA_SELECTED_SEATS', JSON.stringify(tikeraSelectedSeats))
    // }
    var i = 0;
    var index;
    for (i = 0; i < product.length; i++) {
      if ((typeof item.product_id !== 'undefined') && item.product_id !== null) {
        if (item.variation_id !== 0) {
          if (product[i].variation_id == item.variation_id)
            index = i;
        }
        else {
          if (product[i].product_id == item.product_id && product[i].strProductX == item.strProductX)
            index = i;
        }

      } else {
        if (product[i].Title == item.Title) {
          index = i;
        }
      }
    }
    product.splice(index, 1);
    //delete productx
    var j = 0;
    var xindex;
    for (j = 0; j < productx.length; j++) {
      if ((typeof item.product_id !== 'undefined') && item.product_id !== null) {
        // we hvae added item.strProductX == undefined condistion for park sale edit case becs we dont have strProductX in cardProductList localstorage 
        if (productx[j].product_id == item.product_id && (productx[j].strProductX == item.strProductX || (item.strProductX == undefined && productx[j].strProductX == ""))) {
          xindex = j;
        }
      }
    }
    xindex !== undefined && productx.splice(xindex, 1);
    if (product.length == 0) {
      //var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
      // if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
      //     var udid = get_UDid('UDID');
      //     this.setState({ isLoading: true })
      //      localStorage.removeItem('PENDING_PAYMENTS');
      //     this.props.dispatch(checkoutActions.orderToCancelledSale(checklist.order_id, udid));
      // }
      localStorage.removeItem('CHECKLIST');
      localStorage.removeItem("CART");
      localStorage.removeItem("PRODUCT");
      localStorage.removeItem("SINGLE_PRODUCT");
      localStorage.removeItem("CARD_PRODUCT_LIST");
      localStorage.removeItem('TIKERA_SELECTED_SEATS');
      localStorage.removeItem("PRODUCTX_DATA");
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch(cartProductActions.addtoCartProduct(null));
        dispatch(cartProductActions.singleProductDiscount())
        dispatch(cartProductActions.showSelectedProduct(null));
      }
    } else {
      const { dispatch } = this.props;
      localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productx));
      if (dispatch) {
        dispatch(cartProductActions.addtoCartProduct(product));
        dispatch(cartProductActions.showSelectedProduct(null));
        //dispatch(cartProductActions.addInventoryQuantity(null));
      }
    }
    // this.props.simpleProductData();

    //Android Call----------------------------
    //androidDisplayScreen(item.Title, 0, 0, "deleteproduct");
    //-----------------------------------------
  }
  // get extension pageUrl and hostUrl of current clicked extension
  showExtensionIframe = (ext_id) => { 
    // get host and page url from common fucnction   
    var data = getHostURLsBySelectedExt(ext_id)
    this.setState({
        extHostUrl: data ? data.ext_host_url : '',
       extPageUrl: data ? data.ext_page_url : '',
       extName: data ? data.ext_name : '',
       extLogo: data ? data.ext_logo : ''
      })
    this.setState({ extensionIframe: true })
    setTimeout(() => {
        showModal('common_ext_popup')
    }, 500);
}
close_ext_modal = () => {
    this.setState({ extensionIframe: false });
    hideModal('common_ext_popup');
}
  render() {
    const { checkList, cash_round, payments, count, paid_amount, Markup, NumberFormat, RoundAmount, RemoveCustomer, cartDiscountAmount, selfcheckoutstatusmanagingevnt, SelfCheckoutStatus } = this.props;

    var display_rec_products = isDisplay(_key.DISPLAY_PRODUCT_RECOMMENDATIONS_ON_CART_PAGE)
    //var landingScreen = '';
    // var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
    //var register_content = Register_Permissions ? Register_Permissions.content : '';
    //var landingScreen = ActiveUser && ActiveUser.key.companyLogo ? ActiveUser.key.companyLogo : '';
    // if (Register_Permissions) {
    //     Register_Permissions.content && Register_Permissions.content.filter(item => item.slug == "landing-screen").map(permission => {
    //         landingScreen = permission.value;
    //     })
    // }
    var checkList1 = this.state.checkList;//localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : [];
    console.log("this.props---------->", checkList1)
    return (
      <div>
        <Navbar showExtensionIframe={this.showExtensionIframe} page={_key.CHECKOUT_PAGE} itemCount={checkList1 && checkList1.ListItem ? checkList1.ListItem.length : ''} />
        <div className="category-header m-b-35">
          <div className="col">
            <p className="current">Order Summary</p>
            <div className="divider" />
          </div>
          <button onClick={() => this.GoBackhandleClick()} id="mainMenuButton">
            <svg width={22} height={20} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.7737 1.8335L1.3695 10.0002L9.7737 18.1668M1.3695 10.0002L20.5791 10.0002L1.3695 10.0002Z" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Go back to main menu
          </button>
        </div>
        <div className="text-row">
          <p >Review your order</p>
          <p className="order-quantity">({checkList1 && checkList1.ListItem ? checkList1.ListItem.length : 'X'} items)</p>
        </div>
        <div className="order-summary">
          <div className="order-products-wrapper">
              {checkList1 && checkList1.ListItem && checkList1.ListItem.map((product, index) => {
                //var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                return (
                  product.Price != null ?
                    <div className="order-product" key={index}>
                      <div className="row">
                          <p className="prod-name">{product.Title}</p>
                          <div className="inner-row">
                            <div className="increment-input">
                              <div onClick={() => this.incrementDefaultQuantity(product, index, 0)} className="decrement">
                                <svg width="16" height="2" viewBox="0 0 16 2" style={{ width: "30px", paddingLeft: "10px" }}>
                                  <rect width="16" height="2" fill="#758696" />
                                </svg>
                              </div>
                              <input type="number" value={product.quantity} />
                              <div onClick={() => this.incrementDefaultQuantity(product, index, 1)} className="increment">
                                <svg width={16} height={16} viewBox="0 0 16 16" style={{ width: "30px", paddingRight: "10px" }}>
                                  <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                                </svg>
                              </div>
                            </div>
                            <p> {parseFloat(product.Price).toFixed(2)}</p>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => this.deleteProduct(product)}
                              >
                                <path
                                  d="M8.95014 7.49448L14.8188 1.64148C14.9348 1.50641 14.9954 1.33268 14.9885 1.15498C14.9817 0.977293 14.9078 0.808735 14.7817 0.682995C14.6556 0.557255 14.4866 0.483592 14.3085 0.476729C14.1303 0.469865 13.9561 0.530306 13.8207 0.645973L7.95197 6.49898L2.08327 0.638912C1.94997 0.505964 1.76917 0.431274 1.58064 0.431274C1.39212 0.431274 1.21132 0.505964 1.07802 0.638912C0.944712 0.771861 0.869822 0.952178 0.869822 1.1402C0.869822 1.32821 0.944712 1.50853 1.07802 1.64148L6.9538 7.49448L1.07802 13.3475C1.00391 13.4108 0.943722 13.4887 0.90123 13.5763C0.858738 13.6639 0.83486 13.7593 0.831094 13.8565C0.827328 13.9537 0.843756 14.0507 0.879347 14.1413C0.914937 14.2319 0.968922 14.3142 1.03791 14.383C1.1069 14.4518 1.18941 14.5056 1.28025 14.5411C1.3711 14.5766 1.46832 14.593 1.56582 14.5893C1.66331 14.5855 1.75897 14.5617 1.8468 14.5193C1.93463 14.4769 2.01273 14.4169 2.07619 14.343L7.95197 8.48999L13.8207 14.343C13.9561 14.4587 14.1303 14.5191 14.3085 14.5122C14.4866 14.5054 14.6556 14.4317 14.7817 14.306C14.9078 14.1802 14.9817 14.0117 14.9885 13.834C14.9954 13.6563 14.9348 13.4825 14.8188 13.3475L8.95014 7.49448Z"
                                  fill="#D51A52"
                                />
                              </svg>
                          </div>
                      </div>
                    </div> : null
                )
              })
              }
              {checkList1 && checkList1.ListItem && checkList1.ListItem.map((product, index) => {
                  //var _order_Meta = product.addons_meta_data && product.addons_meta_data.length > 0 ? CommonJs.showAddons("", product.addons_meta_data) : ""
                  return (
                    product.Price == null ?
                      <div className="order-note">
                        <div className="row">
                          <p>Note</p>
                          <svg width={15} height={15} viewBox="0 0 15 15"  onClick={() => this.deleteProduct(product)}>
                            <path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52" />
                          </svg>
                        </div>
                        <div className="col">
                        <p>{product.Title}</p>

                        </div>
                      </div> : null)
              })
            }
          </div>
          <div className="cart-total">
            <div className="row">
              <div className="text-container">
                <p className="left">{LocalizedLanguage.subTotal}</p>
              </div>
              <div className="text-container">
                <p className="right">{parseFloat(checkList1 && checkList1.subTotal).toFixed(2)}</p>
              </div>
            </div>
            {/* <div className="row">
              <div className="text-container">
                <p className="left">Discount</p>
              </div>
              <div className="text-container">
                <p className="right">$2.99</p>
              </div>
            </div> */}
            <div className="row">
              <div className="text-container">
                <p className="left">{LocalizedLanguage.tax}</p>
              </div>
              <div className="text-container">
                <p className="right">{parseFloat(checkList1 && checkList1.tax).toFixed(2)}</p>
              </div>
            </div>
            <div className="divider" />
            <div className="row">
              <div className="text-container">
                <p className="left strong">{LocalizedLanguage.total}</p>
              </div>
              <div className="text-container">
                <p className="right strong">{parseFloat(checkList1 && checkList1.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList1.totalPrice - paid_amount))) : '0.00').toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-instructions">
          <p>Order Instructions</p>
          <textarea name="orderInstrucions" id="orderInstrucions"  cols={30} rows={10} placeholder="Enter your instructions" defaultValue={""} />
        </div>
        {display_rec_products == "true" ?
          <RecommendedProduct page={"cart"} />
          : <div></div>}
        <button id="toPaymentButton" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart">{LocalizedLanguage.continueToPayment}</button>
        <div className="cover hide"></div>
          {checkList1 && checkList1.ListItem.length  <= 0 ? <button  className="view-cart productv2-parrent">{LocalizedLanguage.continueToPayment}</button> :<button id="toPaymentButton" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart">{LocalizedLanguage.continueToPayment}</button>  }
        {/* <button id="toPaymentButton" onClick={() => selfcheckoutstatusmanagingevnt("sfcheckoutpayment")} className="view-cart">{LocalizedLanguage.continueToPayment}</button> */}
        <CommonExtensionPopup
          showExtIframe={this.state.extensionIframe}
          close_ext_modal={this.close_ext_modal}
          extHostUrl={this.state.extHostUrl}
          extPageUrl={this.state.extPageUrl}
          extName={this.state.extName}
          extLogo={this.state.extLogo} />
      </div>)
  }
}
export default CheckoutCart;
function mapStateToProps(state) {
  const { cartproductlist } = state;
  return {
    cartproductlist: cartproductlist.cartproductlist,
  };
}
const connectedCreateProfile = connect(mapStateToProps)(CheckoutCart);
export { connectedCreateProfile as CheckoutCart };