import React from 'react';
import { connect } from 'react-redux';
import { default as NumberFormat } from 'react-number-format';
import { history } from '../../_helpers';
import { Markup } from 'interweave';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import CheckoutCartList from '../../_components/views/m.CheckoutCartList';
import { RoundAmount } from "../../_components/TaxSetting";
import MobileOption from '../../_components/views/m.Option';
import Footer from '../../_components/views/m.Footer';
import { CommonModuleJS } from '../../_components';
import CheckoutCart from '../../SelfCheckout/components/CheckoutPage/CheckoutCart';
import ActiveUser from '../../settings/ActiveUser';
import CommonJs from '../../_components/CommonJS';
import { checkoutActions } from "../../CheckoutPage/actions/checkout.action";
var checkList = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
class CheckoutViewFirst extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalPrice: 0,
            payments: [],
            count: 0,
            paid_amount: 0,
            cartDiscountAmount: 0,
            groupuser_refresh:true
        }

        this.getPaymentDetails = this.getPaymentDetails.bind(this);
        this.extensionArray = this.extensionArray.bind(this);
        this.RemoveCustomer = this.RemoveCustomer.bind(this);
        this.AddCustomer = this.AddCustomer.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getPaymentDetails();
        var list = this.props.checkList && this.props.checkList;
        list && this.UpdateCartDiscount(list.ListItem);
    }

    /**
     * Created By : Shakuntala Jatav
     * Created Date : 01-04-2020
     * Description : update State discount only for cart  */
    UpdateCartDiscount(list) {
        var _cartDiscountAmount = 0.00;
        list && list.map(item => {
            if (item.Price) {
                _cartDiscountAmount += parseFloat(item.cart_discount_amount);
            }
        })
        this.setState({ cartDiscountAmount: _cartDiscountAmount })
    }

    deleteProduct(item) {
        // var product = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
        // var productx = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : [];//
        // var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        // if (tikeraSelectedSeats.length > 0) {
        //     tikeraSelectedSeats.map((items, index) => {
        //         if (parseInt(items.chart_id) == parseInt(item.product_id)) {
        //             tikeraSelectedSeats.splice(index, 1);
        //         }
        //     })
        //     localStorage.setItem('TIKERA_SELECTED_SEATS', JSON.stringify(tikeraSelectedSeats))
        // }
        // var i = 0;
        // var index;
        // for (i = 0; i < product.length; i++) {
        //     if ((typeof item.product_id !== 'undefined') && item.product_id !== null) {
        //         if (item.variation_id !== 0) {
        //             if (product[i].variation_id == item.variation_id)
        //                 index = i;
        //         }
        //         else {
        //             if (product[i].product_id == item.product_id && product[i].strProductX == item.strProductX)
        //                 index = i;
        //         }

        //     } else {
        //         if (product[i].Title == item.Title) {
        //             index = i;
        //         }
        //     }
        // }
        // product.splice(index, 1);
        // //delete productx
        // var j = 0;
        // var xindex;
        // for (j = 0; j < productx.length; j++) {
        //     if ((typeof item.product_id !== 'undefined') && item.product_id !== null) { 
        //         // we hvae added item.strProductX == undefined condistion for park sale edit case becs we dont have strProductX in cardProductList localstorage 
        //         if (productx[j].product_id == item.product_id && (productx[j].strProductX == item.strProductX|| (item.strProductX == undefined && productx[j].strProductX == ""))) {
        //             xindex = j;
        //         }
        //     }
        // }
        // xindex !== undefined && productx.splice(xindex, 1);

        // if (product.length == 0) {
        //     var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
        //     if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
        //         var udid = get_UDid('UDID');
        //         this.setState({ isLoading: true })
        //          localStorage.removeItem('PENDING_PAYMENTS');
        //         this.props.dispatch(checkoutActions.orderToCancelledSale(checklist.order_id, udid));
        //     }
        //     localStorage.removeItem('CHECKLIST');
        //     localStorage.removeItem("CART");
        //     localStorage.removeItem("PRODUCT");
        //     localStorage.removeItem("SINGLE_PRODUCT");
        //     localStorage.removeItem("CARD_PRODUCT_LIST");
        //     localStorage.removeItem('TIKERA_SELECTED_SEATS');
        //     localStorage.removeItem("PRODUCTX_DATA");
        //     const { dispatch } = this.props;
        //     if(dispatch){
        //     dispatch(cartProductActions.addtoCartProduct(null));
        //     dispatch(cartProductActions.singleProductDiscount())
        //     dispatch(cartProductActions.showSelectedProduct(null));
        //     dispatch(cartProductActions.addInventoryQuantity(null,null));
        //     }
        // } else {
        //     const { dispatch } = this.props;
        //     localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productx));
        //     if(dispatch){
        //     dispatch(cartProductActions.addtoCartProduct(product));
        //     dispatch(cartProductActions.showSelectedProduct(null));
        //     dispatch(cartProductActions.addInventoryQuantity(null));
        //     }
        // }
       // this.props.simpleProductData();

        //Android Call----------------------------
        //androidDisplayScreen(item.Title, 0, 0, "deleteproduct");
        //-----------------------------------------
    }

    componentWillReceiveProps(props) {
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};

        }, 1000);
        if (props.checkoutlist) {
            var paid_amount = 0;
            if (localStorage.getItem("oliver_order_payments")) {
                var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : new Array();
                getPayments.forEach(paid_payments => {
                    paid_amount += parseFloat(paid_payments.payment_amount);
                })
            }
            this.setState({
                totalPrice: parseFloat(props.checkoutlist.totalPrice) - parseFloat(paid_amount)
            })
            this.UpdateCartDiscount(props.checkoutlist.ListItem);
        }
        var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
        if (ActiveUser.key.isSelfcheckout == true && list && list.ListItem.length > 6) {
            setTimeout(function () {
                $("#mCSB_1").animate({
                    scrollTop: $(
                        '#mCSB_1').get(0).scrollHeight
                }, 2000);
                // $("#mCSB_1").css("overflow", "auto")
            }, 500)
        }
    }

    componentWillUnmount() {
        this.props.onRef(null)
    }

    getPaymentDetails() {
        var checkList = this.props.checkList;
        var paid_amount = 0.0;
        var payments = new Array();
        if( checkList && checkList !== null && checkList.totalPrice !== null){
            this.setState({
                totalPrice: checkList.totalPrice
            })
        }
        if (localStorage.getItem("oliver_order_payments") && checkList && checkList.totalPrice !== null && checkList.totalPrice) {
            var getPayments = (typeof JSON.parse(localStorage.getItem("oliver_order_payments")) !== "undefined") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : new Array();
            getPayments.forEach(paid_payments => {
                paid_amount += parseFloat(paid_payments.payment_amount);
                payments.push({
                    "payment_type": paid_payments.payment_type,
                    "payment_amount": paid_payments.payment_amount,
                });
            });
            this.setState({
                totalPrice: checkList.totalPrice - paid_amount,
                payments: payments,
                count: payments.length,
                paid_amount: paid_amount
            })
            if (checkList.totalPrice >= paid_amount) {
                this.props.setCalculatorRemainingprice(this.state.paid_amount);
            } else {
                this.props.setCalculatorRemainingprice(0);
            }
        }
    }

    AddCustomer() {
        sessionStorage.removeItem("CUSTOMER_ID");
        var param = 'checkout';
        var url = '/customerview';
        if(isMobileOnly==true)
            history.push(url, param)
        else
          {
              var url = '/checkout';
              sessionStorage.setItem("backurl", url);
               window.location = '/customerview'
        }         
    }

    RemoveCustomer() {
        localStorage.removeItem('AdCusDetail');
        sessionStorage.removeItem("CUSTOMER_ID");
        location.reload();
        var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
        if (list != null) {
            var _wc_amount_redeemed = list._wc_amount_redeemed ? parseFloat(list._wc_amount_redeemed) : 0
            const CheckoutList = {
                ListItem: list.ListItem,
                customerDetail: null,
                totalPrice: parseFloat(list.totalPrice) + _wc_amount_redeemed,
                discountCalculated: parseFloat(list.discountCalculated) - _wc_amount_redeemed,
                tax: list.tax,
                subTotal: list.subTotal,
                TaxId: list.TaxId,
                showTaxStaus: list.showTaxStaus,
                TaxRate: list.TaxRate,
                order_id: list.order_id,
                oliver_pos_receipt_id: list.oliver_pos_receipt_id,
                order_date: list.order_date,
                order_id: list.order_id,
                status: list.status,                
                _wc_points_redeemed: 0,
                _wc_amount_redeemed: 0,
                _wc_points_logged_redemption: 0
            }
            localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
        }
    }

    extensionArray(customTags) {
        var newCustomTagsField = new Array()
        if (customTags) {
            Object.keys(customTags).forEach(function (key) {
                Object.keys(customTags[key]).forEach(function (_key) {
                    newCustomTagsField.push(_key + ' (' + customTags[key][_key] + ')');
                })
            });
        }
        return newCustomTagsField && newCustomTagsField.map((item, index) => {
            return (<span key={index} className="comman_subtitle"> - {item}</span>)
        });
    }

    AddGroupSale(){
        showModal('groupsalemodal');        
       this.setState({groupuser_refresh: !this.state.groupuser_refresh})
    }
    DeleteGroupSale(){
        console.log("delete button work ")
        localStorage.removeItem("selectedGroupSale");
       // this.props.dispatch(checkoutActions.getAll(checkList));  
        this.setState({groupuser_refresh: !this.state.groupuser_refresh})    
    }

    render() {
        var { checkList, cash_round, AllProductList } = this.props;
        const { payments, count, paid_amount, cartDiscountAmount } = this.state;
        var productxList = localStorage.getItem('PRODUCTX_DATA') ? JSON.parse(localStorage.getItem('PRODUCTX_DATA')) : "";
        var openSale = localStorage.getItem('BACK_CHECKOUT') ? localStorage.getItem('BACK_CHECKOUT') : "";
        var productDiscountAmount = 0;
        if(! checkList){
            checkList=localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')):null;
        }
        var selectedGroupSale=localStorage.getItem('selectedGroupSale') ? JSON.parse(localStorage.getItem('selectedGroupSale')).Label : ""; 
        var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
        
        return (
            // (ActiveUser.key.isSelfcheckout == true) ?
                <CheckoutCart  
                    {...this.props}
                    {...this.state}
                    deleteProduct={this.deleteProduct}
                    RoundAmount={RoundAmount}
                    NumberFormat={NumberFormat}
                    Markup={Markup}
                    SelfCheckoutStatus={this.props.SelfCheckoutStatus}
                    selfcheckoutstatusmanagingevnt={this.props.selfcheckoutstatusmanagingevnt}
                    continuetoPayment={this.continuetoPayment}/>                    
            // :
            // isMobileOnly == true ?
            //     this.props.activeComponent == "notes" ?
            //         <MobileOption
            //             {...this.props}
            //             {...this.state}
            //             addCustomer={this.AddCustomer}
            //             deleteAddCust={this.RemoveCustomer}
            //             //Addcust={Addcust}
            //             Footer={Footer}
            //             type="checkout"
            //             Addcust={checkList && checkList.customerDetail}
            //         />
            //         :
            //         <CheckoutCartList
            //             {...this.props}
            //             {...this.state}
            //             RoundAmount={RoundAmount}
            //             NumberFormat={NumberFormat}
            //             Markup={Markup}
            //         // AddCustomer={this.AddCustomer}
            //         // RemoveCustomer={this.RemoveCustomer}
            //         />
            //         :
            //         <div className="col-lg-3 col-sm-4 col-xs-4 pl-0">
            //         <div className="panel panel-default panel-right-side r0 br-1 bb-0">
            //             {checkList && checkList.customerDetail && checkList.customerDetail.content ?
            //                 <div className="panel-heading pr-0 nav-section-heading">
            //                    <div className="div-length-heading"> {checkList.customerDetail.content.FirstName ? checkList.customerDetail.content.FirstName : checkList.customerDetail.content.Email}{" "}{checkList.customerDetail.content.LastName ? checkList.customerDetail.content.LastName : null}</div>
            //                     {/* <span className="pull-right pointer pl-15 pr-15 fs29" onClick={() => this.RemoveCustomer()}> */}
            //                     {/* <i className="icon icon-fill-close icon-css-override text-danger pointer push-top-3"></i> */}
            //                     <img src="assets/img/Close.svg" className="pointer mr-15" onClick={() => this.RemoveCustomer()} />
            //                     {/* </span> */}
            //                 </div>
            //                 :
            //                 <div className="panel-heading pr-0 nav-section-heading">
            //                     {LocalizedLanguage.addCustomerTitle}
            //                     {/* <span className="pull-right pointer pl-15 pr-15 fs29" > */}
            //                     {/* <img src="assets/img/AddNew.svg" /> */}
            //                     <img src="assets/images/add.svg" width="35" className="pointer mr-15" onClick={() => this.AddCustomer()} />
            //                     {/* <i className="icon icon-fill-plus icon-css-override text-success pointer push-top-5"></i> */}
            //                     {/* </span> */}
            //                 </div>
            //             }
            //                 {/* group_sales div */}
                           
            //             {selectedGroupSale && selectedGroupSale !==""?
            //             <div className="panel-heading bg-white nav-section-heading optiontablebtn" id="optiontablebtn">
            //             <div className="div-length-heading"> {selectedGroupSale }</div>
            //                         <img src="assets/img/Close.svg" className="pull-right fs29" onClick={() => this.DeleteGroupSale()}/>
            //                  </div>
            //                  :
            //             user.group_sales && user.group_sales !== null && user.group_sales !== "" && user.group_sales !== "undefined" ?
            //                 <div className="panel-heading bg-white nav-section-heading optiontablebtn"id="optiontablebtn">
            //                          { "Add "+user.group_sales_by}
            //                                     <img className="pull-right fs29" onClick={(e) => this.AddGroupSale()} 
            //                                     src="assets/images/add.svg" width="35" />
            //                           </div> : null}



            //             <div className="panel-body p-0 overflowscroll" id="cart_product_list">
            //                 <div className="table-responsive">
            //                     <table className="table ListViewCartProductTable">
            //                         <colgroup>
            //                             <col width="10" />
            //                             <col width="*" />
            //                             <col width="*" />
            //                         </colgroup>
            //                         <tbody>
            //                             {checkList && checkList.ListItem &&
            //                                 checkList.ListItem.map((product, index) => {
            //                                     var isProdAddonsType = CommonJs.checkForProductXAddons(product.product_id);// check for productX is Addons type products
            //                                     if (product.Price && product.product_discount_amount) {
            //                                         // productDiscountAmount += product.discount_type == "Number"?product.product_discount_amount:product.product_discount_amount;// quantity comment for addons
            //                                         productDiscountAmount += product.discount_type == "Number"?product.product_discount_amount:product.product_discount_amount * (isProdAddonsType && isProdAddonsType == true ? 1 : product.quantity);
            //                                     }
            //                                     var _order_Meta= product.addons_meta_data && product.addons_meta_data.length>0 ? CommonJs.showAddons("",product.addons_meta_data):""
            //                                     return (
            //                                         <tr key={index}>
            //                                             <td>{product.quantity ? product.quantity : (product.customTags && (typeof product.customTags !== 'undefined')) ? "" : 1 || (product.customExtFee && (typeof product.customExtFee !== 'undefined')) ? "" : 1}</td>
            //                                             <td> {product.Title && product.Title !== "" ? <Markup content={(product.Title).replace(" - ", "-")} /> : (product.Sku && product.Sku !== "" && product.Sku !== "False") ? product.Sku : 'N/A' }
            //                                                 {/* <Markup content={product.Title} /> {product.Title } */}
            //                                                 {(productxList && productxList.length > 0) && CommonModuleJS.productxArray(product.product_id, AllProductList,"",product.strProductX)}
            //                                                 {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
            //                                                 {(product.customTags && (typeof product.customTags !== 'undefined')) ?
            //                                                     this.extensionArray(product.customTags)
            //                                                     :
            //                                                     (product.customExtFee && (typeof product.customExtFee !== 'undefined') && product.Price !== 0) ?
            //                                                         <span className="comman_subtitle">{product.customExtFee}</span>
            //                                                         :
            //                                                         <span className="comman_subtitle">{product.color}  {product.size ? ',' + product.size : null}</span>
            //                                                 }
            //                                                    {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
            //                                                    {product.psummary && typeof product.psummary!="undefined" && product.psummary!=""?<div  style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{product.psummary}</div>:null}
            //                                             </td>
            //                                             {(typeof product.product_id !== 'undefined') ?
            //                                                 <td align="right">
            //                                                     {/* {product.discount_amount !== 0 ?
            //                                                     <NumberFormat value={product.after_discount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                                     : ''}
            //                                                 <span className={product.discount_amount !== 0 ? "comman_delete" : ''}><NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></span> */}
            //                                                 {/* quantity comment for addons */}
            //                                                     {/* <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - ( product.discount_type !=="Number" ?  product.product_discount_amount:product.product_discount_amount )} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}</span> */}
            //                                                     <span>{parseFloat(product.product_discount_amount) !== 0.00 ? <NumberFormat value={product.Price - ( product.discount_type !=="Number" ?  (product.product_discount_amount* (isProdAddonsType && isProdAddonsType == true ? 1 : product.quantity)):product.product_discount_amount )} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}</span>

            //                                                     <NumberFormat className={(!product.product_discount_amount) || parseFloat(product.product_discount_amount) == 0.00 ? '' : 'comman_delete'} value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                                 </td>
            //                                                 :
            //                                                 <td align="right">
            //                                                     <NumberFormat value={product.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                                 </td>
            //                                             }
            //                                         </tr>
            //                                     )
            //                                 })
            //                             }
            //                             {checkList && checkList._wc_points_redeemed && checkList._wc_points_redeemed > 0 ?
            //                                 <tr>
            //                                     <td />
            //                                     <td>Redeemed Point - {checkList._wc_points_redeemed}</td>
            //                                     <td />
            //                                 </tr>
            //                                 : null}
            //                         </tbody>
            //                     </table>
            //                 </div>
            //             </div>
            //             <div className="panel-footer p-0 bg-white">
            //                 <div className="table-calculate-price">
            //                     <table className="table ShopViewCalculator">
            //                         <tbody>
            //                             <tr>
            //                                 <th className="bt-0">{LocalizedLanguage.subTotal}</th>
            //                                 <td align="right" className="bt-0">
            //                                     <span >
            //                                         <NumberFormat value={checkList && checkList.subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                     </span>
            //                                 </td>
            //                             </tr>
            //                             <tr>
            //                                 <th>
            //                                     {checkList && checkList.showTaxStaus}:
            //                                <span className="pull-right">
            //                                         <NumberFormat value={checkList && checkList.tax} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                     </span>
            //                                 </th>
            //                                 <th className="bl-1 w-50" align="right">
            //                                     {LocalizedLanguage.discount}:
            //                                {/* <span className="value pull-right pointer" style={{ color: '#46A9D4' }}> */}
            //                                <span className="pull-right" >
            //                                         <NumberFormat value={checkList && RoundAmount(checkList.discountCalculated - productDiscountAmount)} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                     </span>
            //                                 </th>
            //                             </tr>
            //                             {/*  add payment */}
            //                             {
            //                                 (this.state.count > 0) ? (
            //                                     <tr id="paymentTr">
            //                                         <th>
            //                                             <div className="relDiv show_payment_box">
            //                                                 <span className="value pointer" style={{ color: '#46A9D4' }} id="totalPayment">
            //                                                     {count} {LocalizedLanguage.payments}</span>
            //                                                 <div className="absDiv">
            //                                                     <div className="payment_box">
            //                                                         <h1 className="m-0">{LocalizedLanguage.payments}</h1>
            //                                                         <div className="row" id="totalPaymentSrc">
            //                                                             {payments.map((item, index) => {
            //                                                                // console.log("testing",item);
            //                                                                 return (
            //                                                                     (item.type !== null && item.payment_amount !== 0.00)?
            //                                                                         <div key={index} className="col-sm-12 p-0">
            //                                                                             <label className="col-sm-6">{item.payment_type}</label>
            //                                                                             <div className="col-sm-6 text-right"><NumberFormat value={item.payment_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
            //                                                                         </div>
            //                                                                     :
            //                                                                     null
            //                                                                 )
            //                                                             })}
            //                                                         </div>
            //                                                     </div>
            //                                                 </div>
            //                                             </div>
            //                                         </th>
            //                                         <td align="right" id="paymentLeft">
            //                                             <NumberFormat value={this.state.paid_amount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                         </td>
            //                                     </tr>
            //                                 ) : null
            //                             }
            //                             <tr>
            //                                 <th colSpan="2" className="p-0">
            //                                     <button className="btn btn-block btn-primary total_checkout">
            //                                         <span className="pull-left">
            //                                             {/* Total Left */}
            //                                             {LocalizedLanguage.balanceDue}
            //                                         </span>
            //                                         <span className="pull-right">
            //                                             <NumberFormat value={checkList && checkList.totalPrice >= 0 ? (cash_round + parseFloat(RoundAmount(checkList.totalPrice - paid_amount))) : '0.00'} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
            //                                         </span>
            //                                     </button>
            //                                 </th>
            //                             </tr>
            //                         </tbody>
            //                     </table>
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
        )
    }
}

function mapStateToProps(state) {
    const { checkoutlist } = state;
    return {
        checkoutlist: checkoutlist.items,
    };
}
const connectedCheckoutViewFirst = connect(mapStateToProps)(CheckoutViewFirst);
export { connectedCheckoutViewFirst as CheckoutViewFirst };