import React from 'react';
import { connect } from 'react-redux';
import { default as NumberFormat } from 'react-number-format'
import { cartProductActions, taxRateAction } from '../_actions'
import { history } from '../_helpers';
import { checkoutActions } from '../CheckoutPage/actions/checkout.action';
import { Markup } from 'interweave';
import { changeTaxRate, typeOfTax, CommonModuleJS, AndroidAndIOSLoader } from '../_components'
import { getTaxAllProduct } from './';
import { LoadingModal } from './LoadingModal';
import Permissions from '../settings/Permissions';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { androidDisplayScreen } from '../settings/AndroidIOSConnect';
import { RoundAmount } from "../_components/TaxSetting";
import { isMobileOnly } from "react-device-detect";
import CartList from './views/m.CartList';
import CartListSelfCheckout from '../SelfCheckout/components/cartlistselfcheckout';
import Footer from './views/m.Footer';
import MobileOption from './views/m.Option';
import ActiveUser from '../settings/ActiveUser';
import { get_UDid } from '../ALL_localstorage';
import CommonJs from './CommonJS';

Permissions.updatePermissions();

class CartListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            discountCalculated: 0.0,
            discountAmount: 0,
            discountType: "",
            subTotal: 0.00,
            totalAmount: 0.00,
            isTaxPercet: false,
            taxRate: "",
            taxAmount: 0.0,
            locaUrl: history.location.pathname,
            addcust: null,
            TaxId: null,
            showTaxStaus: LocalizedLanguage.exclTax,
            productlist: [],
            updateProductStatus: false,
            taxStatus: false,
            isChecked: false,
            taxRateList: localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [],
            TaxIs: [],
            bookSeatStatus: false,
            IsSeatNotExsitStatus: false,
            isLoading: false,
            checkseatStatus: false,
            checkoutData: false,
            defaultTaxStatus: localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : true,
            cartDiscountAmount: 0,
            productDiscountAmount: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.checkSubscriptionType = this.checkSubscriptionType.bind(this);
        this.cardProductDiscount = this.cardProductDiscount.bind(this);
        this.singlProductDiscount = this.singlProductDiscount.bind(this);
        this.extensionArray = this.extensionArray.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.deleteAddCust = this.deleteAddCust.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.defaultTaxStatus = this.defaultTaxStatus.bind(this);
        this.openTaxlist = this.openTaxlist.bind(this);
        this.tickit_Details = this.tickit_Details.bind(this);
        this.trialSubscriptionFree = this.trialSubscriptionFree.bind(this);
        this.removeCheckOutList = this.removeCheckOutList.bind(this);
        const { dispatch } = this.props;
        dispatch(taxRateAction.getIsMultipleTaxSupport());
    }

    checkSubscriptionType(ListItem) {
        this.checkout(ListItem)
        // if (localStorage.getItem("AdCusDetail")) {
        //     var AdCusDetail = localStorage.getItem("AdCusDetail");
        //     var customer = AdCusDetail.content ? AdCusDetail.content : "";
        //     if (customer && customer.UID) {
        //         sessionStorage.setItem("CUSTOMER_ID", customer.UID);
        //     }
        // }
        //Android Call----------------------------
        //androidDisplayScreen("Checkout", 0, 0, "checkout");
        //-----------------------------------------
    }

    checkout(ListItem) {
        ListItem && ListItem.length>0 && ListItem.map(litem=>{
            if(this.props.AllProductList){
               var itemFound= this.props.AllProductList.find(item => item.WPID ==litem.product_id);               
               if(itemFound){
                litem["ManagingStock"]=itemFound.ManagingStock;
                }
            }
        })      
        this.setState({ isLoading: true })
        localStorage.removeItem('RESERVED_SEATS');
        localStorage.removeItem("BOOKED_SEATS");
        var setting = localStorage.getItem('TickeraSetting') && typeof(localStorage.getItem('TickeraSetting')) !=='undefined' && localStorage.getItem('TickeraSetting') !=='undefined' ? JSON.parse(localStorage.getItem('TickeraSetting')) : '';
        var selectedSeats = [];
        var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        var getDistinctTicketSeat = {};
        tikeraSelectedSeats.length > 0 && tikeraSelectedSeats.map(item => {
            if (item.seat_check == "true") {
                var dateKey = item.product_id;
                if (!getDistinctTicketSeat.hasOwnProperty(dateKey)) {
                    getDistinctTicketSeat[dateKey] = new Array(item);
                } else {
                    if (typeof getDistinctTicketSeat[dateKey] !== 'undefined' && getDistinctTicketSeat[dateKey].length > 0) {
                        getDistinctTicketSeat[dateKey].push(item)
                    }
                }
            }
        })
        var productCount=0;
        ListItem !== null && ListItem.length > 0 && ListItem.map(items => {
            if (items.product_id != null) {
                productCount += 1;
                if (getDistinctTicketSeat) {
                    var getTicketSeats = getDistinctTicketSeat[items.product_id];
                    getTicketSeats && getTicketSeats.map((Tkt, indexing) => {
                        if (Tkt.product_id == items.product_id) {
                            items.ticket_info && items.ticket_info.map((match_index, index) => {
                                if (index == indexing) {
                                    match_index['seat_label'] = Tkt.seat_label;
                                    match_index['chart_id'] = Tkt.chart_id;
                                    match_index['seat_id'] = Tkt.seat_id;
                                }
                            })
                        }
                    })
                }
            }
        })
        var discountIs = 0;
        discountIs = this.state.discountCalculated
        var order_id = (typeof localStorage.getItem("CHECKLIST") !== 'undefined') ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        var taxratelist;
        var _TaxIs = [];
        var deafult_tax = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
        var selected_tax = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem("TAXT_RATE_LIST")) : null;
        var apply_defult_tax = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS').toString() : null;
        var TaxRate = apply_defult_tax == "true" ? deafult_tax : selected_tax;
        if (TaxRate && TaxRate.length > 0) {
            TaxRate.map(addTax => {
                if (addTax.check_is == true) {
                    if (apply_defult_tax == "true") {
                        _TaxIs.push({ [addTax.TaxId]: parseFloat(addTax.TaxRate) })
                    }
                    if (apply_defult_tax == "false") {
                        _TaxIs.push({ [addTax.TaxId]: parseFloat(addTax.TaxRate) })
                    }
                }
            })
        }
        const { dispatch } = this.props;
        const { addcust, taxRate } = this.state;
        const CheckoutList = {
            ListItem: ListItem,
            customerDetail: addcust,
            totalPrice: this.state.totalAmount,
            discountCalculated: discountIs ? discountIs : 0,
            tax: this.state.taxAmount,
            subTotal: this.state.subTotal,
            TaxId: _TaxIs,
            TaxRate: taxRate,
            order_id: order_id !== null ? order_id.order_id : 0,
            oliver_pos_receipt_id: order_id && order_id !==null && order_id.oliver_pos_receipt_id !== null? order_id.oliver_pos_receipt_id : "",
            showTaxStaus: this.state.showTaxStaus,
            _wc_points_redeemed: 0,
            _wc_amount_redeemed: 0,
            _wc_points_logged_redemption: 0
        }

        if(addcust && addcust.content) {
            sessionStorage.setItem("CUSTOMER_ID", addcust.content.UID?addcust.content.UID :addcust.content.WPId ); 
        }else{
            sessionStorage.removeItem("CUSTOMER_ID"); 
        }
        if (ListItem.length == 0 || productCount==0) {
            this.setState({ isLoading: false })
            // if (isMobileOnly == true) {
                this.props.msg(LocalizedLanguage.messageCartNoProduct);
                // $('#common_msg_popup').addClass('show');
               // $('#common_msg_popup').modal('show');
                showModal('common_msg_popup');
            // } else {
            //    // $('#checkout1').modal('show');
            //     showModal('checkout1');
            // }
        } else {
            this.setState({ updateProductStatus: true });
            this.state.updateProductStatus= true ;
            var tickValiData = []
            var field = ''
            var staticField_value = ["first_name", "last_name", "owner_email"];
            var staticField = [];
            var quant = 0;
            ListItem.find(findId => {
                quant = findId.quantity;
                if (findId.ticket_status == true && (findId.ticket_info.length == 0 || quant !== findId.ticket_info.length)) {
                    staticField = staticField_value.filter(function (value, index, arr) {
                        return value == "first_name" && setting !== null && setting !== undefined && setting.show_attendee_first_and_last_name_fields == "yes" ||
                            value == "last_name" && setting !== null && setting !== undefined && setting.show_attendee_first_and_last_name_fields == "yes"
                            || value == "owner_email" && setting !== null && setting !== undefined && setting.show_owner_email_field == "yes";
                    });
                    tickValiData.push(findId.ticket_info);
                    field = findId.product_ticket ? JSON.stringify(findId.product_ticket.fields) : ''
                }

            })
            if (staticField.length == 0) {
                this.setState({ checkoutData: false })
                this.state.checkoutData = false;
            }
            if (tickValiData && tickValiData.length > 0) {
                var requiredDataIsNull = tickValiData.find(is_null => is_null.length == 0 || quant !== is_null.length);
                if (requiredDataIsNull) {
                    var requiredList = field && JSON.parse(field);
                    requiredList ? requiredList.map(itm => {
                        var is_field = itm.field_info && JSON.parse(itm.field_info);
                        if (is_field.is_required == true || staticField !== '') {
                            this.setState({ checkoutData: true })
                            this.state.checkoutData = true;
                        }
                    })
                        :
                    staticField !== ''
                    this.setState({ checkoutData: true })
                    this.state.checkoutData = true;
                }
            }
            if (this.state.checkoutData == true) {
                this.setState({ isLoading: false })
                this.props.msg("Please fill the required fields of selected ticket.");
                if (isMobileOnly == true) {
                    $('#common_msg_popup').addClass('show')
                }
               // $('#common_msg_popup').modal('show')
                showModal('common_msg_popup');
            }
            this.state.checkoutData == false && ListItem.map(findId => {
                if (findId.ticket_info && findId.ticket_info.length > 0 && findId.ticket_info !== '[]') {
                    findId.ticket_info.map(chart_Id => {
                        var chart_id = chart_Id && chart_Id.chart_id ? chart_Id.chart_id : null;
                        if (chart_id) {
                            this.setState({
                                isLoading: true,
                                checkseatStatus: true
                            })
                            this.props.dispatch(cartProductActions.getReservedTikeraChartSeat(chart_id, 1));
                        }
                    })
                }
            })
            if(addcust && addcust.customerDetail &&  addcust.customerDetail.content)
            {
                var cust= addcust.customerDetail.content;
                sessionStorage.setItem("CUSTOMER_ID",cust.UID?cust.UID :cust.WPId); 
            }
            localStorage.setItem("CHECKLIST", JSON.stringify(CheckoutList))
            var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
            if(demoUser == 'true'){
                window.location = '/checkout'
            }else{
                dispatch(checkoutActions.checkItemList(CheckoutList))
            }
        }
    }

    addCustomer() {
        var param = this.state.locaUrl;
        var url = '/customerview';
        sessionStorage.removeItem("CUSTOMER_ID");
        if(isMobileOnly==true)
            history.push(url, param)
        else
           {  sessionStorage.setItem("backurl","/shopview");  //added due to scroll issue
               window.location = '/customerview'}
    }

    deleteAddCust() {
        localStorage.removeItem('AdCusDetail')
        sessionStorage.removeItem("CUSTOMER_ID")
        this.setState({ addcust: null })
    }

    componentDidMount() {
        localStorage.removeItem('temp_paid_amount')
        var AdCusDetail = localStorage.getItem('AdCusDetail');
        if (AdCusDetail != null) {
            this.setState({ addcust: JSON.parse(AdCusDetail) })
        } else {
            this.setState({ addcust: null })
        }
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};           
        }, 1000);
    }

    deleteProduct(item) {
        var product = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
        var productx = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : [];//
        var tikeraSelectedSeats = localStorage.getItem('TIKERA_SELECTED_SEATS') ? JSON.parse(localStorage.getItem('TIKERA_SELECTED_SEATS')) : [];
        if (tikeraSelectedSeats.length > 0) {
            tikeraSelectedSeats.map((items, index) => {
                if (parseInt(items.chart_id) == parseInt(item.product_id)) {
                    tikeraSelectedSeats.splice(index, 1);
                }
            })
            localStorage.setItem('TIKERA_SELECTED_SEATS', JSON.stringify(tikeraSelectedSeats))
        }
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
                if (productx[j].product_id == item.product_id && (productx[j].strProductX == item.strProductX|| (item.strProductX == undefined && productx[j].strProductX == ""))) {
                    xindex = j;
                }
            }
        }
        xindex !== undefined && productx.splice(xindex, 1);

        if (product.length == 0) {
            var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
            if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
                var udid = get_UDid('UDID');
                this.setState({ isLoading: true })
                 localStorage.removeItem('PENDING_PAYMENTS');
                this.props.dispatch(checkoutActions.orderToCancelledSale(checklist.order_id, udid));
            }
            localStorage.removeItem('CHECKLIST');
            localStorage.removeItem("CART");
            localStorage.removeItem("PRODUCT");
            localStorage.removeItem("SINGLE_PRODUCT");
            localStorage.removeItem("CARD_PRODUCT_LIST");
            localStorage.removeItem('TIKERA_SELECTED_SEATS');
            localStorage.removeItem("PRODUCTX_DATA");
            const { dispatch } = this.props;
            if(dispatch){
            dispatch(cartProductActions.addtoCartProduct(null));
            dispatch(cartProductActions.singleProductDiscount())
            dispatch(cartProductActions.showSelectedProduct(null));
            dispatch(cartProductActions.addInventoryQuantity(null,null));
            }
        } else {
            const { dispatch } = this.props;
            localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productx));
            if(dispatch){
            dispatch(cartProductActions.addtoCartProduct(product));
            dispatch(cartProductActions.showSelectedProduct(null));
            dispatch(cartProductActions.addInventoryQuantity(null));
            }
        }
        this.props.simpleProductData();

        //Android Call----------------------------
        androidDisplayScreen(item.Title, 0, 0, "deleteproduct");
        //-----------------------------------------
    }

    // Created By   : Shakuntala Jatav
    // Created Date : 07-06-2019
    // Description  : when props and reload page then show isChecked field is selected tax.
    // Modified By : Shakuntala
    // Modified Date: 14/06/2019
    // Decription: Update condition of partentid is zero when notes add.
    componentWillReceiveProps(nextProps) {
        var CHECKLIST = localStorage.getItem("CHECKLIST") ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        var taxratelist;
        if ((typeof localStorage.getItem('TAXT_RATE_LIST') !== 'undefined') && localStorage.getItem('TAXT_RATE_LIST') !== null) {
            taxratelist = localStorage.getItem('TAXT_RATE_LIST') && JSON.parse(localStorage.getItem('TAXT_RATE_LIST'));
        } else {
            taxratelist = this.props.get_tax_rates;
        }
        this.setState({
            taxRateList: nextProps.updateTaxRateList ? nextProps.updateTaxRateList : taxratelist
        })
        var _subtotal = 0.0;
        var _total = 0.0;
        var _taxAmount = 0.0;
        var _totalDiscountedAmount = 0.0;
        var _customFee = 0.0;
        var _exclTax = 0;
        var _inclTax = 0;
        var _taxId = [];
        var _taxRate = [];
        var TaxIs = [];
        var _subtotalPrice = 0.00;
        var _subtotalDiscount = 0.00;
        var _cartDiscountAmount = 0.00;
        var _productDiscountAmount = 0.00;
        var _seprateDiscountAmount = 0.00;
        if (taxratelist && taxratelist !== null && taxratelist !== "undefined") {
            taxratelist && taxratelist.length > 0 && taxratelist.map(tax => {
                _taxId.push(tax.TaxId);
                _taxRate.push(tax.TaxRate);
                if (tax.check_is == true) {
                    TaxIs.push({ [tax.TaxId]: parseFloat(tax.TaxRate) })
                }
            })
            this.setState({
                isChecked: _taxId,
                TaxId: _taxId,
                taxRate: _taxRate,
                TaxIs: TaxIs
            })
        }
        _taxRate = this.state.taxRate;
        nextProps.cartproductlist && nextProps.cartproductlist.map((item, index) => {            
            if (item.Price) {
                _subtotalPrice += item.Price
                _subtotalDiscount += parseFloat(item.discount_amount ==null || isNaN(item.discount_amount)==true?0:item.discount_amount)
                if (item.product_id) {//donothing  
                    var isProdAddonsType = CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products                  
                    _exclTax += item.excl_tax ? item.excl_tax : 0;
                    _inclTax += item.incl_tax ? item.incl_tax : 0;
                    _cartDiscountAmount += item.cart_discount_amount;
                    // _productDiscountAmount += item.discount_type == "Number" ? item.product_discount_amount:item.product_discount_amount; // quantity commment for addons
                    _productDiscountAmount += item.discount_type == "Number" ? item.product_discount_amount:item.product_discount_amount*(isProdAddonsType && isProdAddonsType == true ? 1 : item.quantity);
                }
                else {
                    _customFee += item.Price;
                    _exclTax += item.excl_tax ? item.excl_tax : 0;
                    _inclTax += item.incl_tax ? item.incl_tax : 0;
                }
            }
        })      
        _seprateDiscountAmount = _subtotalPrice - _subtotalDiscount;
        _subtotal = _subtotalPrice - _productDiscountAmount;
        _totalDiscountedAmount = _subtotalDiscount;
        if (_taxRate) {
            _taxAmount = parseFloat(_exclTax) + parseFloat(_inclTax);            
        }
        _total = parseFloat(_seprateDiscountAmount) + parseFloat(_exclTax);
       this.setState({
            subTotal: RoundAmount(_subtotal),
            totalAmount: RoundAmount(_total),// parseFloat(_subtotal) - parseFloat(nextProps.discountAmount),           
            discountAmount: nextProps.discountAmount,
            discountType: nextProps.discountType,
            taxAmount: RoundAmount(_taxAmount), //(( parseFloat(_subtotal) - parseFloat(nextProps.discountAmount))% parseFloat(this.state.taxRate))*100.0           
            discountCalculated: _totalDiscountedAmount > 0 ? RoundAmount(_totalDiscountedAmount) : 0,
            showTaxStaus: typeOfTax() == 'incl' ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax,
            cartDiscountAmount : _cartDiscountAmount
        })   
       

        var IsExist = false;
        var IsExsitTicket = false;
        if (nextProps.checkout_list &&  nextProps.checkout_list.length > 0 && this.state.updateProductStatus == true) {
            var checkProductUpdate;
            IsExist = false
            checkProductUpdate = nextProps.checkout_list.find(item => item.success == false);
            if (checkProductUpdate && checkProductUpdate.ProductId !== 0) {
                IsExist = false;
                this.setState({ isLoading: false })
                //$('#checkout1').modal('show')
                showModal('checkout1');
            } else {
                IsExist = true;
            }
            if (nextProps.cartproductlist) {
                nextProps.cartproductlist && nextProps.cartproductlist.map(ticketInfo => {
                    if (ticketInfo.ticket_info && ticketInfo.ticket_info.length > 0 && ticketInfo.ticket_info!== "[]") {
                        CHECKLIST && CHECKLIST.ListItem.map(findId => {
                            if (findId.ticket_info && findId.ticket_info.length > 0) {
                                findId.ticket_info.map(chart_Id => {
                                    var chart_id = chart_Id && chart_Id.chart_id ? chart_Id.chart_id : null;
                                    if (chart_id) {
                                        IsExsitTicket = true;
                                    }
                                })
                            }
                        })
                    }
                })
            }

            if (IsExist === true && IsExsitTicket === false && this.state.checkseatStatus == false && this.state.checkoutData == false) {
                localStorage.removeItem("oliver_order_payments");
                localStorage.removeItem("VOID_SALE")

                //if (isMobileOnly)
                  
                    history.push('/checkout');
                // else
                //     window.location = '/checkout';
            }
            this.setState({
                updateProductStatus: false
            })
        }

        //  cheking the seat already reserved or not;
        var IsSeatExsit = false;
        const { reserved_tikera_seat, booked_seats } = nextProps;
        if (CHECKLIST && reserved_tikera_seat && this.state.bookSeatStatus == false) {
            this.setState({ isLoading: false })
            var reservedTikeraSeatUpdate = [];
            CHECKLIST.ListItem.length > 0 && CHECKLIST.ListItem.map(parentItem => {
                if (parentItem.ticket_info && parentItem.ticket_info.length > 0) {
                    parentItem.ticket_info.map(chlidItem => {
                        var find = reserved_tikera_seat.find(subChlid => subChlid.chart_id == chlidItem.chart_id);
                        if (find) {
                            IsSeatExsit = find.reserve_seat.find(childToChlid => childToChlid == chlidItem.seat_id);
                        }
                        if (IsSeatExsit && IsSeatExsit !== false) {
                            var seats = {
                                seat_id: IsSeatExsit,
                                chart_id: chlidItem.chart_id,
                                product_id: parentItem.product_id,
                                Title: parentItem.Title
                            }
                            reservedTikeraSeatUpdate.push(seats)
                            localStorage.setItem("BOOKED_SEATS", JSON.stringify(reservedTikeraSeatUpdate));
                            if (reservedTikeraSeatUpdate) {
                                this.setState({ bookSeatStatus: true })
                                this.state.bookSeatStatus = true;
                                this.bookedSeats(reservedTikeraSeatUpdate)
                            }
                        } else {
                            if (this.state.IsSeatNotExsitStatus == false) {
                                IsSeatExsit = "";
                                IsExist = true
                                this.state.IsSeatNotExsitStatus = true;
                                this.state.checkseatStatus = false;
                                this.setState({
                                    IsSeatNotExsitStatus: true,
                                    checkseatStatus: false
                                })
                            }
                        }
                    })
                }
            })
        }

        if (booked_seats && booked_seats !== "false") {
            this.state.bookSeatStatus = false;
            this.setState({ bookSeatStatus: false })
            //$('#booked_seat').modal('show');
            showModal('booked_seat');
        }

        if (IsExist === true && !IsSeatExsit && this.state.IsSeatNotExsitStatus == true) {
            localStorage.removeItem("oliver_order_payments")
            // window.location = '/checkout';
            history.push('/checkout')
        }

        // Adding productX title from card_produc_list 
        var CardListData = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//
        var productxData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : [];//
        productxData && productxData.map(item => {
            var getProductX = ''

            getProductX = CardListData && CardListData.filter(itemX => {
                if (itemX.product_id == item.product_id) {
                    return itemX;
                }
            })
            if (getProductX && getProductX.length > 0) {
                item['Title'] = getProductX[0].Title
                localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productxData))
            }
        })
    }

    bookedSeats(bookedData) {
        this.props.dispatch(cartProductActions.bookedSeats(bookedData))
    }
     
    /* Updated By   : Aman
    * Updated Date : 31/07/2020
    * Description :  Bugsnag issue 'Type' of undefined on line number  650
    */
    singlProductDiscount(item, selectedIndex) {
        this.getProductFromIndexDB();
        setTimeout(() => {
            var product = null;
            product = this.state.productlist.find(prd => prd.WPID == item.product_id);
            if(product && product !== null && product !== undefined){
                if (item.variation_id !== 0) {
                    var variationProdect = this.state.productlist.filter(item => {
                        if(product.WPID !== null && product.WPID !== undefined){
                            return (item.ParentId === product.WPID)
                        }
                    })
                    if(product){
                    product['Variations'] = variationProdect;
                    }
                }
                if (product && product.Type !== 'variable') {
                    product['after_discount'] = item.after_discount;
                    product['cart_after_discount'] = item.cart_after_discount;
                    product['cart_discount_amount'] = item.cart_discount_amount;
                    product['discount_amount'] = item.discount_amount;
                    product['discount_type'] = item.discount_type;
                    product['excl_tax'] = item.excl_tax;
                    product['incl_tax'] = item.incl_tax;
                    product['new_product_discount_amount'] = item.new_product_discount_amount;
                    product['old_price'] = item.old_price;
                    product['product_after_discount'] = item.product_after_discount;
                    product['product_discount_amount'] = item.product_discount_amount;
                    product['selectedIndex'] = selectedIndex;
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
                    item['selectedIndex'] = selectedIndex;
                    product['ticket_info'] = item.ticket_info;
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
                            vartion['selectedIndex'] = selectedIndex;
                            
                            item['ProductAttributes'] = vartion.ProductAttributes;
                            item['combination'] = vartion.combination;
                            item['StockQuantity'] = vartion.StockQuantity;
                            item['StockStatus'] = vartion.StockStatus;
                            item['InStock'] = vartion.InStock;
                            item['IsTicket'] = vartion.IsTicket;
                            item['ManagingStock'] = vartion.ManagingStock;
                            item['ParentId'] = vartion.ParentId;
                            item['WPID'] = vartion.WPID;
                            item['selectedIndex'] = selectedIndex;
                            vartion['ticket_info'] = vartion.ticket_info;
                        }
                    })
                }
            }

            const { dispatch } = this.props;
            dispatch(cartProductActions.showSelectedProduct(item));
            this.props.showPopuponcartlistView(product, item)
        }, 500);
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

    cardProductDiscount() {
        var ListItem = this.props.cartproductlist ? this.props.cartproductlist : [];
        if (ListItem.length !== 0) {
            if (CommonModuleJS.permissionsForDiscount() == false) {
                this.props.msg(LocalizedLanguage.discountPermissionerror);
                if (isMobileOnly == true) {
                    $('#common_msg_popup').addClass('show');
                }
               showModal('common_msg_popup');
            } else {
                if (isMobileOnly == true) {
                    this.props.openModal('cart_discount');
                }
                $("#popup_discount").find('#txtdis').val(0)
                showModal('popup_discount');
                var data = {
                    card: 'card',
                }
                localStorage.removeItem("PRODUCT")
                localStorage.removeItem("SINGLE_PRODUCT")
                this.props.dispatch(cartProductActions.selectedProductDis(data))
            }
        } else {
            if (isMobileOnly == true) {
                this.props.msg(LocalizedLanguage.messageCartNoProduct);
                $('#common_msg_popup').addClass('show');
                showModal('common_msg_popup');
            } else {
                showModal('checkout1');
            }
        }
    }

    tickit_Details(status, item) {
        localStorage.removeItem("CHECKLIST")
        if (status == 'create') {
            if (isMobileOnly == true) {
                this.props.openModal("ticket_modal_view")
            } else {
                showModal('tickitDetails');
            }
            this.props.ticketDetail(status, item)
        }
        else if (status == 'edit') {
            if (isMobileOnly == true) {
                this.props.openModal("ticket_modal_view")
            } else {
                showModal('tickitDetails');
            }
            this.props.ticketDetail(status, item)
        }
    }
    /*
    Updated By   : Shakuntala Jatav
    Updated Date : 18-06-2019
    Description : change function on input click  
    */
    handleChange(e) {
        $('div .dropup').addClass('open');
        var taxRateList = this.state.taxRateList && this.state.taxRateList.length > 0 ? this.state.taxRateList : [];
        const { name, value } = e.target;
        var check = $(`input[name=${name}]`).is(':checked');
        var Id = $(`input[name=${name}]`).attr('data-id');
        var country = $(`input[name=${name}]`).attr('data-country');
        var state = $(`input[name=${name}]`).attr('data-state');
        var tax_name = $(`input[name=${name}]`).attr('data-name');
        var taxclass = $(`input[name=${name}]`).attr('data-tax-class');
        if (taxRateList.length == 0) {
            taxRateList.push({
                check_is: check,
                TaxRate: value,
                TaxName: tax_name,
                TaxId: Id,
                Country: country,
                State: state,
                TaxClass: taxclass
            })
        } else {
            var FindId = taxRateList.find(isName => parseInt(isName.TaxId) === parseInt(Id));
            if (FindId) {
                taxRateList.map(item => {
                    if (item.TaxId == FindId.TaxId) {
                        item['check_is'] = FindId.check_is == true ? false : true
                    }
                })
            } else {
                taxRateList.push({
                    check_is: check,
                    TaxRate: value,
                    TaxName: tax_name,
                    TaxId: Id,
                    Country: country,
                    State: state,
                    TaxClass: taxclass
                })
            }
        }
        this.setState({
            taxRateList: taxRateList
        })
        const { dispatch } = this.props;
        var updateTaxCarproduct = changeTaxRate(taxRateList, 1);
        dispatch(cartProductActions.updateTaxRateList(taxRateList));
        dispatch(cartProductActions.addtoCartProduct(updateTaxCarproduct));
    }
    /*
    Created By   : Shakuntala Jatav
    Created Date : 05-06-2019
    Description  : for dispatch tax rate list .//openTaxlist function
    Updated By   :
    Updated Date :
    Description :    
    */
    openTaxlist() {
        if (isMobileOnly == true) {
            this.props.openModal("tax_rate_list")
            $("#applyTax").modal("hide");
        }
        this.props.dispatch(cartProductActions.getTaxRateList())
    }

    defaultTaxStatus() {
        var defaultTaxStatusIs = (this.state.defaultTaxStatus === true || this.state.defaultTaxStatus === "true") ? false : true;
        this.setState({ defaultTaxStatus: defaultTaxStatusIs })
        localStorage.setItem('DEFAULT_TAX_STATUS', `${defaultTaxStatusIs}`)
        setTimeout(function () {
            $("#notCloseTaxPopup").addClass("open");
        }, 10)
        var cartproductlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        this.props.dispatch(cartProductActions.addtoCartProduct(cartproductlist));
    }

    extensionArray(customTags) {
        var obj = '';
        var customTagsField = new Array()
        for (var key in customTags) {
            if (customTags.hasOwnProperty(key)) {
                obj = key
            }
        }
        if (customTags[obj]) {
            Object.keys(customTags[obj]).forEach(function (key) {
                customTagsField.push(key + ' (' + customTags[obj][key] + ')');
            });
        }
        return customTagsField && customTagsField.map((item, index) => {
            return (<span key={index} className="comman_subtitle"> - {item}</span>)
        });
    }

    /**
     * Created By : Shakuntala Jatav
     * Created Date : 20-03-2020
     * Description : show popup when user try free subscription of oliver-pos
     */
    trialSubscriptionFree() {
        var subscriptionClientDetail = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : '';
        if (isMobileOnly == true) { $("#multi-tax-popup").addClass("show"); }
        if (subscriptionClientDetail && subscriptionClientDetail.subscription_detail &&  subscriptionClientDetail.subscription_detail.subscription_type == "oliverpos-free")
            showModal('multi-tax-popup');
    }
    
    GoBack(){
        if(isMobileOnly == true){
            history.push('/SelfCheckoutView');
        }
        else{
           window.location='/SelfCheckoutView';
        }
    }

    removeCheckOutList() {
        const { dispatch } = this.props;
        var status = 'null'
        var item = []
        localStorage.removeItem('CHECKLIST');
        localStorage.removeItem('oliver_order_payments');
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem('TIKERA_SELECTED_SEATS');
        localStorage.removeItem("CART");
        localStorage.removeItem('CARD_PRODUCT_LIST');
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem("SINGLE_PRODUCT");
        localStorage.removeItem("PRODUCTX_DATA");
        this.props.ticketDetail(status, item)
        dispatch(cartProductActions.addtoCartProduct(null));
        if(isMobileOnly == true && ActiveUser.key.isSelfcheckout == true)
        {
            this.props.onCancelOrderHandler();
        }
        else{
            history.push("/SelfCheckout")
        }
    }
    AddGroupSale(){
        showModal('groupsalemodal');
          $(".custom_radio input").prop("checked", false);
    }
    DeleteGroupSale(){
        localStorage.removeItem("selectedGroupSale");
        
    }
    render() {
        localStorage.setItem("taxType", JSON.stringify(this.state.showTaxStaus))
        // var totalPrice = 0;
        // const { taxRateList, defaultTaxStatus } = this.state;
        var ListItem = this.props.cartproductlist ? this.props.cartproductlist : [];
        // var productxList = localStorage.getItem('PRODUCTX_DATA') ? JSON.parse(localStorage.getItem('PRODUCTX_DATA')) : "";
        // var Addcust = localStorage.getItem('AdCusDetail') ? JSON.parse(localStorage.getItem('AdCusDetail')) : [];
        // var selected_tax_list = this.props.selectedTaxList ? this.props.selectedTaxList : localStorage.getItem('SELECTED_TAX') ? JSON.parse(localStorage.getItem('SELECTED_TAX')) : null;
        // var UpdateTaxRateList = this.props.updateTaxRateList ? this.props.updateTaxRateList : taxRateList;
        // var type_of_tax = typeOfTax();
        // var multipleTaxSupport = this.props.multiple_tax_support ? this.props.multiple_tax_support : false;
        // var defutTaxStatus = localStorage.getItem('DEFAULT_TAX_STATUS') ? localStorage.getItem('DEFAULT_TAX_STATUS') : defaultTaxStatus;
        // var subscriptionClientDetail = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : '';;
        // var defaultTaxData = localStorage.getItem('APPLY_DEFAULT_TAX') ? JSON.parse(localStorage.getItem("APPLY_DEFAULT_TAX")) : null;
       
        // var selectedGroupSale=localStorage.getItem('selectedGroupSale') ? JSON.parse(localStorage.getItem('selectedGroupSale')).Label : ""; 
        // var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : "";
        return(
        <div>
        <button className="view-cart" onClick={() => this.checkSubscriptionType(ListItem)}>
        View Cart ${parseFloat(this.state.totalAmount).toFixed(2)}
        </button>
          {this.state.isLoading == true ? <LoadingModal /> : ''}

        </div>
        )
        // return (
        //     (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true)?
        //         <div>
        //             {this.state.isLoading == true ? <AndroidAndIOSLoader /> : ''}
        //             <CartList
        //                 {...this.props}
        //                 {...this.state}
        //                 ListItem={ListItem}
        //                 Addcust={Addcust}
        //                 selected_tax_list={selected_tax_list}
        //                 UpdateTaxRateList={UpdateTaxRateList}
        //                 type_of_tax={type_of_tax}
        //                 multipleTaxSupport={multipleTaxSupport}
        //                 defutTaxStatus={defutTaxStatus}
        //                 Markup={Markup}
        //                 NumberFormat={NumberFormat}
        //                 LocalizedLanguage={LocalizedLanguage}
        //                 checkSubscriptionType={this.checkSubscriptionType}
        //                 defaultTaxApply={this.defaultTaxStatus}
        //                 cardProductDiscount={this.cardProductDiscount}
        //                 extensionArray={this.extensionArray}
        //                 singleProductDiscount={this.singleProductDiscount}
        //                 handleChange={this.handleChange}
        //                 deleteProduct={this.deleteProduct}
        //                 openTaxlist={this.openTaxlist}
        //                 tickit_Details={this.tickit_Details}
        //                 productxList={productxList}
        //                 trialSubscriptionFree={this.trialSubscriptionFree}
        //                 subscriptionClientDetail={subscriptionClientDetail}
        //                 ClearCartList={this.props.onCancelOrderHandler}
        //                 openModal={this.props.openModal}/>
        //         </div>
        //     :
        //     (ActiveUser.key.isSelfcheckout == true)?
        //         <div>
        //             {this.state.isLoading == true ? <LoadingModal /> : ''}                   
        //             <CartListSelfCheckout 
        //                 {...this.props}
        //                 {...this.state}
        //                 ListItem={ListItem}
        //                 Addcust={Addcust}
        //                 selected_tax_list={selected_tax_list}
        //                 UpdateTaxRateList={UpdateTaxRateList}
        //                 type_of_tax={type_of_tax}
        //                 multipleTaxSupport={multipleTaxSupport}
        //                 defutTaxStatus={defutTaxStatus}
        //                 Markup={Markup}
        //                 NumberFormat={NumberFormat}
        //                 LocalizedLanguage={LocalizedLanguage}
        //                 checkSubscriptionType={this.checkSubscriptionType}
        //                 defaultTaxApply={this.defaultTaxStatus}
        //                 cardProductDiscount={this.cardProductDiscount}
        //                 extensionArray={this.extensionArray}
        //                 singleProductDiscount={this.singleProductDiscount}
        //                 handleChange={this.handleChange}
        //                 deleteProduct={this.deleteProduct}
        //                 openTaxlist={this.openTaxlist}
        //                 tickit_Details={this.tickit_Details}
        //                 productxList={productxList}
        //                 AllProductList={this.props.AllProductList}
        //                 trialSubscriptionFree={this.trialSubscriptionFree}
        //                 subscriptionClientDetail={subscriptionClientDetail}
        //                 ClearCartList={this.removeCheckOutList}/>   
        //         </div>
        //     :
        //     isMobileOnly == true ?
        //         this.props.openModalActive == "notes" || this.props.openModalActive == "show_notes_popup" ?
        //             <MobileOption
        //                 {...this.props}
        //                 addCustomer={this.addCustomer}
        //                 deleteAddCust={this.deleteAddCust}
        //                 Addcust={Addcust}
        //                 Footer={Footer} />
        //             :
        //             <CartList
        //                 {...this.props}
        //                 {...this.state}
        //                 ListItem={ListItem}
        //                 Addcust={Addcust}
        //                 selected_tax_list={selected_tax_list}
        //                 UpdateTaxRateList={UpdateTaxRateList}
        //                 type_of_tax={type_of_tax}
        //                 multipleTaxSupport={multipleTaxSupport}
        //                 defutTaxStatus={defutTaxStatus}
        //                 Markup={Markup}
        //                 ={NumberFormat}
        //                 LocalizedLanguage={LocalizedLanguage}
        //                 checkSubscriptionType={this.checkSubscriptionType}
        //                 defaultTaxApply={this.defaultTaxStatus}
        //                 cardProductDiscount={this.cardProductDiscount}
        //                 extensionArray={this.extensionArray}
        //                 singleProductDiscount={this.singleProductDiscount}
        //                 handleChange={this.handleChange}
        //                 deleteProduct={this.deleteProduct}
        //                 openTaxlist={this.openTaxlist}
        //                 tickit_Details={this.tickit_Details}
        //                 productxList={productxList}
        //                 trialSubscriptionFree={this.trialSubscriptionFree}
        //                 subscriptionClientDetail={subscriptionClientDetail}
        //             />
        //         :                
        //         <div className="col-lg-3 col-sm-4 col-xs-4 pr-0  plr-8">
        //             {this.state.isLoading == true ? <LoadingModal /> : ""}
        //             <div className="panel panel-default panel-right-side bb-0 r0 bg-white overflow-unset">
        //                 {Addcust.content && Addcust.content !== null && Addcust.content !== "" && Addcust.content !== "undefined"?
        //                     <div className="panel-heading bg-white nav-section-heading">
        //                      <div className="div-length-heading"> {Addcust &&
        //                       Addcust.content.FirstName !== null &&
        //                        Addcust.content.FirstName !== undefined &&
        //                         Addcust.content.FirstName !=="" ?
        //                          Addcust.content.FirstName :
        //                          Addcust && 
        //                          Addcust.content &&
        //                           Addcust.content.Email &&
        //                            Addcust.content.Email !==null &&
        //                             Addcust.content.Email !== undefined ?
        //                              Addcust.content.Email.substring(0, 30) :
        //                               '' + (Addcust && Addcust.content && Addcust.content.Email && Addcust.content.Email.length>30 && "...")}{" "} {Addcust.content.LastName && Addcust.content.LastName !=="" ? Addcust.content.LastName : ""}</div>
        //                             <img src="assets/img/Close.svg" className="pull-right fs29" onClick={() => this.deleteAddCust()}/>
        //                      </div>
        //                     : <div className="panel-heading bg-white nav-section-heading ">
        //                         {LocalizedLanguage.addCustomerTitle}
        //                         <img className="pull-right fs29" onClick={(e) => this.addCustomer()} src="assets/images/add.svg" width="35" />
        //                     </div>
        //                 }
        //                 {/* group_sales div */}
        //                 {
        //                 selectedGroupSale && selectedGroupSale !==""?
        //                 <div className="panel-heading bg-white nav-section-heading optiontablebtn" id="optiontablebtn">
        //                 <div className="div-length-heading"> {selectedGroupSale }</div>
        //                             <img src="assets/img/Close.svg" className="pull-right fs29" onClick={() => this.DeleteGroupSale()}/>
        //                      </div>
        //                      :
        //                 user.group_sales && user.group_sales !== null && user.group_sales !== "" && user.group_sales !== "undefined" ?
        //                     <div className="panel-heading bg-white nav-section-heading optiontablebtn"id="optiontablebtn">
        //                              { "Add "+user.group_sales_by}
        //                                         <img className="pull-right fs29" onClick={(e) => this.AddGroupSale()} 
        //                                         src="assets/images/add.svg" width="35" />
        //                               </div> : null}

        //                 <div className="panel-body p-0 overflowscroll bg-white" id="cart_product_list">
        //                     <div className="table-responsive">
        //                         <table className="table CartProductTable">
        //                             <tbody>
        //                                 {ListItem && ListItem.map((item, index) => {
        //                                     var isProdAddonsType = CommonJs.checkForProductXAddons(item.product_id);// check for productX is Addons type products
        //                                     var rowclass = item.ticket_status && item.ticket_status == true ? "no-border-ticket" : "";
        //                                     var _order_Meta= item.addons_meta_data && item.addons_meta_data.length>0 ? CommonJs.showAddons("",item.addons_meta_data):""
        //                                    return (
        //                                         <tr className="" key={index}>
        //                                             <td className="p-0">
        //                                                 <table className="table CartProductTable no-border">
        //                                                     <tbody id="messagewindow">
        //                                                         <tr>
        //                                                             <td align="center" onClick={() => this.singlProductDiscount(item, index)}>{item.quantity ? item.quantity : (item.customTags && (typeof item.customTags !== 'undefined')) ? "" : 1 || (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ? "" : 1}</td>
        //                                                             <td align="left" onClick={() => this.singlProductDiscount(item, index)}>
        //                                                             {item.Title && item.Title !== "" ? <Markup content={(item.Title).replace(" - ", "-")} /> : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A' }
        //                                                             {/* <Markup content={(item.Title).replace(" - ", "-")} /> */}
        //                                                                 {/* <span className="comman_subtitle">Red</span> */}
        //                                                                 {_order_Meta && _order_Meta !=="" ?<div className="comman_subtitle" ><Markup content={ _order_Meta} /></div>:""}
                                                                      
        //                                                                {(productxList && productxList.length > 0) && CommonModuleJS.productxArray(item.product_id, this.props.AllProductList,"",item.strProductX)}
        //                                                                 {(item.customTags && (typeof item.customTags !== 'undefined')) ?
        //                                                                     this.extensionArray(item.customTags)
        //                                                                     :
        //                                                                     (item.customExtFee && (typeof item.customExtFee !== 'undefined')) ?
        //                                                                         <span className="comman_subtitle">{item.customExtFee}</span>
        //                                                                         : null
        //                                                                 }
        //                                                                 {/* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */}
        //                                                                 {item.psummary && typeof item.psummary!="undefined" && item.psummary!=""?<div style={{textTransform: 'capitalize',textAlign:'left',fontSize:12,color:'grey'}}>{item.psummary}</div>:null}
        //                                                             </td>
        //                                                             {(typeof item.product_id !== 'undefined') ?
        //                                                                 <td align="right" onClick={() => this.singlProductDiscount(item, index)}>
        //                                                                     {/* quantity commented for addons */}
        //                                                                     <span>{parseFloat(item.product_discount_amount) !== 0.00 ? <NumberFormat value={item.discount_type == "Number" ? item.Price - (item.product_discount_amount):item.Price - (item.product_discount_amount *(isProdAddonsType && isProdAddonsType==true ? 1 : item.quantity))} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /> : null}</span>
        //                                                                     <NumberFormat className={parseFloat(item.product_discount_amount) == 0.00 ? '' : 'comman_delete'} value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
        //                                                                 </td>
        //                                                                 :
        //                                                                 <td align="right">
        //                                                                     <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
        //                                                                 </td>
        //                                                             }
        //                                                             <td className="pr-0" align="right">
        //                                                                <button className="btn_trash" onClick={() => this.deleteProduct(item)}>
        //                                                                <i className="icons8-remove pointer" ></i> 
        //                                                                </button>
        //                                                             </td>
        //                                                         </tr>
                                                                
        //                                                         {item.ticket_status == true ?
        //                                                             <tr>
        //                                                                 <td colSpan="4" className="pr-2">
        //                                                                     {item.ticket_status == true && (item.ticket_info === '' || item.ticket_info.length === 0) ?
        //                                                                         <div className="w-100-block button_with_checkbox p-0">
        //                                                                             <input type="radio" id={`add-details${index}`} name="radio-group" />
        //                                                                             <label htmlFor={`add-details${index}`} className="label_select_button" onClick={() => this.tickit_Details('create', item)} >
        //                                                                                 {LocalizedLanguage.add} <span className="hide_small">{LocalizedLanguage.details}</span></label>
        //                                                                         </div>
        //                                                                         :
        //                                                                         <div className="w-100-block button_with_checkbox p-0 ">
        //                                                                             <input type="radio" id={`add-details${index}`} name="radio-group" />
        //                                                                             <label htmlFor={`add-details${index}`} className="label_select_button" onClick={() => this.tickit_Details('edit', item)}>{LocalizedLanguage.change} <span className="hide_small"> {LocalizedLanguage.details}</span></label>
        //                                                                         </div>
        //                                                                     }
        //                                                                 </td>
        //                                                             </tr>
        //                                                           : <tr />
        //                                                         }
        //                                                     </tbody>
        //                                                 </table>
        //                                             </td>
        //                                         </tr>
        //                                     )
        //                                 })}
        //                             </tbody>
        //                         </table>
        //                     </div>
        //                 </div>
        //                 <div className="panel-footer p-0 bg-white">
        //                     <div className="table-calculate-price">
        //                         <table className="table ShopViewCalculator">
        //                             <tbody>
        //                                 <tr>
        //                                     <th className="">{LocalizedLanguage.subTotal}</th>
        //                                     <th align="right" className="">
        //                                         <span className="pull-right">
        //                                             {
        //                                                 ListItem && ListItem.length > 0 && ListItem.map((item, index) => {
        //                                                     totalPrice += item.Price- (item.product_discount_amount *item.quantity)
        //                                                 })
        //                                             }
        //                                             <NumberFormat value={this.state.subTotal} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
        //                                         </span>
        //                                     </th>
        //                                 </tr>
        //                                 {/* 
        //                                    ==========Start============
        //                                  Created By   : Shakuntala Jatav
        //                                  Created Date : 06-06-2019
        //                                  Description  : show selected tax when exclisive tax apply and add more tax on clck edit tax.
                                         
        //                              */}
        //                                 <tr>
        //                                     <th className='w-50 bl-1'>
        //                                         <span className="" >
        //                                             {this.state.showTaxStaus}:
        //                                      </span>
        //                                         <div id="notCloseTaxPopup" onClick={() => this.trialSubscriptionFree()} className={`${subscriptionClientDetail && subscriptionClientDetail.subscription_detail && subscriptionClientDetail.subscription_detail.subscription_type == "oliverpos-free" ? "" : type_of_tax !== 'incl' && multipleTaxSupport == true ? "dropup tax-dropdown" : ''}  value pull-right`} style={{ display: "inline-block" }}>
        //                                             <span style={{ fontWeight: 100 }} className="pointer dropdown-toggle " data-toggle="dropdown">
        //                                                 <NumberFormat value={this.state.taxAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
        //                                             </span>
        //                                           { 
                                                   
        //                                              (subscriptionClientDetail && subscriptionClientDetail.subscription_detail &&  subscriptionClientDetail.subscription_detail.subscription_type !== "oliverpos-free") &&
                                                      
        //                                             <ul className="dropdown-menu p-0 dropdown-menu-right cursor-text">
        //                                                 <li className="dropdown-header">{LocalizedLanguage.selectTax}</li>
        //                                                 <li className="plr-15 dropdown-menu-hide">
        //                                                                 {defaultTaxData ? <div className="center-center space-between">
        //                                                                     {LocalizedLanguage.defaultTax}
        //                                                                     <div className={`flat-toggle flat-toggle-tax ${((defaultTaxStatus == true || defaultTaxStatus == "true") && defutTaxStatus == "true") ?
        //                                                                         'on' : ''}`} onClick={() => this.defaultTaxStatus()}>
        //                                                                         <input type="hidden" defaultValue={defutTaxStatus == "true" ? true : false} />
        //                                                                         <span></span>
        //                                                                     </div>
        //                                                                 </div> : <div className="center-center space-between">
        //                                                                     {'No tax applied'}
        //                                                                 </div>}

        //                                                             </li>
        //                                                 {selected_tax_list && selected_tax_list.map((item, index) => {
        //                                                     var checkStatus = false;
        //                                                     if (UpdateTaxRateList && UpdateTaxRateList.length > 0) {
        //                                                         var updatedTax = UpdateTaxRateList.find(items => parseInt(items.TaxId) == parseInt(item.TaxId));
        //                                                         if (updatedTax && updatedTax.check_is == true) {

        //                                                             checkStatus = true;
        //                                                         }
        //                                                     }
        //                                                     return (
        //                                                         <li className={`stopdropdownhide ${((defaultTaxStatus == true || defaultTaxStatus == "true") && defutTaxStatus == "true") ?
        //                                                             'list-disabled' : ''}`} key={index}>
        //                                                             <div className="radio-button">
        //                                                                 <input type="checkbox" id={item.TaxId} data-tax-class={item.TaxClass} data-id={item.TaxId} data-country={item.Country} data-state={item.State} name={`tax_${item.TaxId}`} data-name={item.TaxName} value={item.TaxRate} checked={checkStatus == true ? 'checked' : ''} onChange={this.handleChange} />
        //                                                                 <label htmlFor={item.TaxId}>{item.TaxName == "N/A" ? LocalizedLanguage.locationTax : item.TaxName}</label>
        //                                                             </div>
        //                                                         </li>
        //                                                     )
        //                                                 })}
        //                                                 {selected_tax_list && selected_tax_list.length ?  <li className={`dropdown-footer  ${((defaultTaxStatus == true || defaultTaxStatus == "true") && defutTaxStatus == "true") ?
        //                                                     'list-disabled' : 'pointer'}`} onClick={() => this.openTaxlist()} data-toggle="modal" href="#firstTaxPopup">
        //                                                     {LocalizedLanguage.editQuickTax}
        //                                                 </li> : null}
        //                                             </ul>
        //                                        }
        //                                         </div>
        //                                     </th>
        //                                     <th className="bl-1" align="right">
        //                                         {LocalizedLanguage.discount}:
        //                                     <span className="value pull-right pointer text-info" data-toggle="modal" onClick={() => this.cardProductDiscount()}>
        //                                             {
        //                                                 (this.state.cartDiscountAmount > 0) ? (
        //                                                     <NumberFormat value={this.state.cartDiscountAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />) : LocalizedLanguage.discountAdd
        //                                             }
        //                                         </span>
        //                                     </th>
        //                                 </tr>
        //                                 {/*  ==========End============ */}
        //                                 <tr>
        //                                     <th colSpan="2" className="p-0">
        //                                        <button className="btn btn-block btn-primary checkout-items" onClick={() => this.checkSubscriptionType(ListItem)}>
        //                                             <span className="pull-left">
        //                                                 {LocalizedLanguage.checkout}
        //                                             </span>
        //                                             <span className="pull-right">
        //                                                 <NumberFormat value={this.state.totalAmount} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
        //                                             </span>
        //                                         </button>
        //                                     </th>
        //                                 </tr>
        //                             </tbody>
        //                         </table>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>                
        // )
    }
}
function mapStateToProps(state) {
    const { get_do_sale, checkout_list, taxratelist, selecteditem, selectedTaxList, get_tax_rates, updateTaxRateList, multiple_tax_support, reserved_tikera_seat, booked_seats } = state;
    return {
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
        checkout_list: checkout_list.items,
        taxratelist: taxratelist,
        selecteditem: selecteditem,
        selectedTaxList: selectedTaxList.items,
        get_tax_rates: get_tax_rates.items,
        updateTaxRateList: updateTaxRateList.items,
        multiple_tax_support: multiple_tax_support.items,
        reserved_tikera_seat: reserved_tikera_seat.items,
        booked_seats: booked_seats.items,
        get_do_sale: get_do_sale.items
    };
}
const connectedCartListView = connect(mapStateToProps)(CartListView);
export { connectedCartListView as CartListView };