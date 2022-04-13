import React from "react";
import { connect } from 'react-redux';
import { ProductAtrribute, CommonModuleJS } from '../';
import { cartProductActions } from '../../_actions';
import { Markup } from 'interweave';
import Permissions from '../../settings/Permissions';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import Footer from './m.Footer';
import { isMobileOnly } from "react-device-detect";
import { history } from '../../_helpers';
import { androidDisplayScreen } from '../../settings/AndroidIOSConnect';
import { getVariatioModalProduct, RoundAmount, typeOfTax } from "../TaxSetting";
import NumberFormat from "react-number-format";
import {getProductSummery} from '../../WrapperSettings/CommonWork'
Permissions.updatePermissions();
class ProductDetailModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variationStockQunatity: '',
            variationTitle: '',
            variationImage: '',
            variationoptionArray: {},
            filteredAttribute: [],
            filterTerms: [],
            selectedAttribute: "",
            ManagingStock: null,
            old_price: 0,
            incl_tax: 0,
            excl_tax: 0,
            variationStyles: { cursor: "no-drop", pointerEvents: "none" },
            variationfound: null,
            showSelectStatus: false,
            showQantity: false,
            after_discount: 0,
            discount_type: '',



            new_product_discount_amount: 0,
            product_after_discount: 0,
            product_discount_amount: 0,
            selectedOptionCode: null,
            selectedOptions: [],
            tcForSeating: "",
            TaxClass: ''
        }
        this.clicks = [];
        this.timeout;
        this.timer = 0;
        this.delay = 300;
        this.prevent = false;
        this.incrementDefaultQuantity = this.incrementDefaultQuantity.bind(this);
        this.setDefaultQuantity = this.setDefaultQuantity.bind(this);
        this.decrementDefaultQuantity = this.decrementDefaultQuantity.bind(this);
        this.addVariationProductToCart = this.addVariationProductToCart.bind(this);
        this.addSimpleProducttoCart = this.addSimpleProducttoCart.bind(this);
        this.optionClick = this.optionClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setSelectedOption = this.setSelectedOption.bind(this);
    }

    componentWillUnmount() {
        this.setState({
            variationStockQunatity: '',
            variationTitle: '',
            variationImage: '',
            variationoptionArray: {},
            filteredAttribute: []
        });
    }

    incrementDefaultQuantity() {
        const { showSelectedProduct } = this.props;
        if (showSelectedProduct) {
            var qty = parseInt(this.state.variationDefaultQunatity);
            if (this.state.variationfound ? showSelectedProduct.WPID == this.state.variationfound.WPID : showSelectedProduct.WPID == this.props.getVariationProductData.WPID) {
                var maxQty = (showSelectedProduct.ManagingStock == false && showSelectedProduct.StockStatus == "outofstock") ? "outofstock" :
                    (showSelectedProduct.StockStatus == null || showSelectedProduct.StockStatus == 'instock') && showSelectedProduct.ManagingStock == false ? "Unlimited" : (typeof showSelectedProduct.StockQuantity != 'undefined') && showSelectedProduct.StockQuantity != '' ? parseFloat(showSelectedProduct.StockQuantity) : 0;
                // var maxQty = this.state.variationStockQunatity == 'Unlimited' ? 'Unlimited' : parseFloat(this.state.variationStockQunatity) + parseFloat(showSelectedProduct.quantity);
                if (maxQty == 'Unlimited' || qty < maxQty) {
                    qty++;
                }
                this.setDefaultQuantity(qty);
            } else {
                var maxQty = $("#txtInScock").text();
                if (maxQty == 'Unlimited' || qty < maxQty) {
                    qty++;
                }
                if (qty > this.state.variationStockQunatity)
                    qty = this.state.variationStockQunatity;
                this.setDefaultQuantity(qty);
            }
        } else {
            var maxQty = $("#txtInScock").text();
            if (maxQty == 'Unlimited' || this.state.variationDefaultQunatity >= 0) {
                var product = this.state.getVariationProductData
                var qty = parseInt(this.state.variationDefaultQunatity);
                // if ((product.StockStatus == null || product.StockStatus == 'instock')
                //     && (product.ManagingStock == false || (product.ManagingStock == true && qty < this.state.variationStockQunatity))) {
                //     qty++;
                // }
                if (maxQty == 'Unlimited' || qty < maxQty) {
                    qty++;
                }
                if (this.state.variationStockQunatity == "Unlimited") {
                    console.log("this.state.variationStockQunatity", this.state.variationStockQunatity)
                    qty++;
                }
                if (qty > this.state.variationStockQunatity)
                    qty = this.state.variationStockQunatity;
                this.setDefaultQuantity(qty);
            }
        }
    }

    decrementDefaultQuantity() {
        if (this.state.variationDefaultQunatity && this.state.variationDefaultQunatity > 1) {
            var qty = parseInt(this.state.variationDefaultQunatity);
            qty--;
            this.setDefaultQuantity(qty);
        }
    }

    setDefaultQuantity(qty) {
        this.setState({
            variationDefaultQunatity: qty,
        });
    }

    addVariationProductToCart() {
        var filterLength = this.state.filterTerms && this.state.filterTerms.length;
        var productAttributsWithVariation = [];
        productAttributsWithVariation = this.props.getVariationProductData.ProductAttributes && this.props.getVariationProductData.ProductAttributes.filter(item => item.Variation == true);
        if (filterLength !== productAttributsWithVariation.length) {
            showModal('mobilePopupDisplayMessage');
        }
        else {
            var showSelectedProduct = this.props.showSelectedProduct;
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            var ticket_Data = this.state.ticket_status == true ? localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '' : ''
            var tick_data = this.state.getVariationProductData && this.state.getVariationProductData.TicketInfo ? JSON.parse(this.state.getVariationProductData.TicketInfo) : '';
            var price = parseFloat(this.state.variationPrice);
            var data = null;
            const { single_product } = this.props;
            if (cartlist.length > 0 && !single_product) {
                cartlist.map(prdId => {
                    if (this.state.variationfound && prdId.product_id === this.state.variationfound.ParentId && prdId.variation_id === this.state.variationfound.WPID) {
                        this.state.variationfound['after_discount'] = prdId.after_discount;
                        this.state.variationfound['product_discount_amount'] = prdId.product_discount_amount;
                        this.state.variationfound['product_after_discount'] = prdId.product_after_discount;
                        this.state.variationfound['new_product_discount_amount'] = prdId.new_product_discount_amount;
                        this.state.variationfound['discount_amount'] = prdId.discount_amount;
                        this.state.variationfound['discount_type'] = prdId.discount_type;
                        this.state.variationfound['cart_after_discount'] = prdId.cart_after_discount;
                        this.state.variationfound['cart_discount_amount'] = prdId.cart_discount_amount;
                    }
                })
            }

            if (cartlist.length > 0 && single_product) {
                cartlist.map(prdId => {
                    if (prdId.product_id == this.state.variationfound.ParentId && prdId.variation_id == this.state.variationfound.WPID) {
                        this.state.variationfound['after_discount'] = single_product.after_discount;
                        this.state.variationfound['product_discount_amount'] = single_product.product_discount_amount;
                        this.state.variationfound['product_after_discount'] = single_product.product_after_discount;
                        this.state.variationfound['new_product_discount_amount'] = single_product.new_product_discount_amount;
                        this.state.variationfound['discount_amount'] = single_product.discount_amount;
                        this.state.variationfound['discount_type'] = single_product.discount_type;
                        this.state.variationfound['cart_after_discount'] = single_product.cart_after_discount;
                        this.state.variationfound['cart_discount_amount'] = single_product.cart_discount_amount;
                    }
                })
            }
            //geting the variation product actiual, fix the issue when editing the cart item price was incorrect----------------
            var _variationid = this.state.variationfound && this.state.variationfound.WPID;
            var getVeriation = this.state.getVariationProductData.Variations.find(function (element) {
                return element.WPID == _variationid
            })
            if (getVeriation) {
                this.state.variationfound["Price"] = getVeriation.Price;
            }
            /* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */
            var psummary=""
            if(getVeriation && getVeriation.ProductAttributes && getVeriation.ProductAttributes!=null)
            {
                psummary=  getProductSummery(getVeriation.ProductAttributes,getVeriation);
            }
            //---------------------------------------------------------------
            var title = '';
            if (this.state.variationfound !== null && this.state.variationfound.Title !== null) {
                title = this.state.variationfound.Title && this.state.variationfound.Title != "" ?
                    this.state.variationfound.Title : this.state.variationfound.Sku;
            }
            data = {
                line_item_id: this.state.variationfound !== null && this.state.variationfound.line_item_id ? this.state.variationfound.line_item_id : 0,
                quantity: this.state.variationDefaultQunatity,
                Title: title,
                Price: this.state.variationfound !== null && this.state.variationfound !== "undefined" ? this.state.variationfound.Price ? parseInt(this.state.variationDefaultQunatity) * this.state.variationfound.Price : parseInt(this.state.variationDefaultQunatity) * price : 0.00,
                product_id: this.state.variationfound ? this.state.variationfound.ParentId : 0,
                variation_id: this.state.variationfound ? this.state.variationfound.WPID : 0,
                isTaxable: this.state.variationIsTaxable,
                old_price: this.state.variationfound ? this.state.variationfound.old_price ? this.state.variationfound.old_price : this.state.old_price : 0,
                incl_tax: this.state.variationfound ? this.state.variationfound.incl_tax ? this.state.variationfound.incl_tax : this.state.incl_tax : 0,
                excl_tax: this.state.variationfound && this.state.variationfound.excl_tax ? this.state.variationfound.excl_tax : this.state.excl_tax,
                ticket_status: this.state.ticket_status,
                product_ticket: this.state.ticket_status == true ? ticket_Data ? ticket_Data : '' : '',
                tick_event_id: this.state.ticket_status == true ? tick_data._event_name : null,
                cart_after_discount: this.state.variationfound && this.state.variationfound.cart_after_discount ? this.state.variationfound.cart_after_discount : 0,
                cart_discount_amount: this.state.variationfound && this.state.variationfound.cart_discount_amount ? this.state.variationfound.cart_discount_amount : 0,
                after_discount: this.state.variationfound && this.state.variationfound.after_discount ? this.state.variationfound.after_discount : 0,
                discount_amount: this.state.variationfound && this.state.variationfound.discount_amount ? this.state.variationfound.discount_amount : 0,
                product_after_discount: this.state.variationfound && this.state.variationfound.product_after_discount ? this.state.variationfound.product_after_discount : 0,
                product_discount_amount: this.state.variationfound && this.state.variationfound.product_discount_amount ? this.state.variationfound.product_discount_amount : 0,
                discount_type: this.state.variationfound && this.state.variationfound.discount_type ? this.state.variationfound.discount_type : "",
                new_product_discount_amount: this.state.variationfound && this.state.variationfound.new_product_discount_amount ? this.state.variationfound.new_product_discount_amount : 0,
                TaxStatus: this.state.TaxStatus,
                tcForSeating: this.state.tcForSeating,
                TaxClass: this.state.TaxClass,
                psummary:psummary
            }
            var qty = 0;
            var product = this.state.getVariationProductData
            var variationfound = this.state.variationfound;
            var variationQantity = null;
            if (variationfound && variationfound !== null) {
                variationQantity = (variationfound.StockStatus == "outofstock") ? "outofstock" :
                    variationfound && (variationfound.StockStatus == null || variationfound.StockStatus == 'instock') && variationfound.ManagingStock == false ? "Unlimited" : variationfound && (typeof variationfound.StockQuantity != 'undefined') && variationfound.StockQuantity != '' ? variationfound && variationfound.StockQuantity - qty : '0'
            }
            var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            qty = qty + this.state.variationDefaultQunatity;
            var txtPrdQuantity = document.getElementById("qualityUpdater").value;
            if (parseInt(txtPrdQuantity) <= 0) {
                /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
                this.props.msg(LocalizedLanguage.productQty)
                $('#common_msg_popup').modal('show')
                return;
            } else if (variationQantity == 'Unlimited' || qty <= variationQantity || qty <= this.state.variationStockQunatity) {
                //checking if variation reacord editing and  new variation added then remove first one from cart----------------------
                //---Remove item already exit into cart at the edit time------------------------
                // console.log("type of", typeof showSelectedProduct, showSelectedProduct)
                if (cartlist.length > 0) {
                    var isItemFoundToUpdate = false;
                    cartItemList.map((item, index) => {
                        if (typeof showSelectedProduct !== 'undefined' && showSelectedProduct !== null) {
                            var _index = -1;
                            if (showSelectedProduct['selectedIndex'] >= 0) { _index = parseInt(showSelectedProduct.selectedIndex) }
                            if (_index > -1 && showSelectedProduct.selectedIndex == index) {
                                isItemFoundToUpdate = true;
                                cartItemList[index] = data
                            }
                        }
                    })
                    if (isItemFoundToUpdate == false) {

                        cartItemList.push(data);
                    }
                } else {
                    cartItemList.push(data);
                }
                //--------------------------------------------------------------------------------------------
                localStorage.removeItem("PRODUCT");
                localStorage.removeItem("SINGLE_PRODUCT")
                this.props.dispatch(cartProductActions.addtoCartProduct(cartItemList));
                this.props.dispatch(cartProductActions.showSelectedProduct(null));
                this.props.dispatch(cartProductActions.singleProductDiscount());
                this.state.showSelectStatus = false;
                this.state.variationDefaultQunatity = 1;
                this.state.variationfound = null;
                //-----------------------------------------------------------------  
                this.setState({
                    variationTitle: this.props.getVariationProductData.Title && this.props.getVariationProductData.Title != "" ? this.props.getVariationProductData.Title : this.props.getVariationProductData.Sku,
                    variationId: this.props.getVariationProductData.WPID,
                    variationParentId: this.props.getVariationProductData.ParentId,
                    variationPrice: this.props.getVariationProductData.Price,
                    variationStockQunatity: this.props.getVariationProductData ? (this.props.getVariationProductData.StockStatus == null || this.props.getVariationProductData.StockStatus == 'instock') && this.props.getVariationProductData.ManagingStock == false ? "Unlimited" : this.props.getVariationProductData.StockQuantity : '0',
                    variationImage: this.props.getVariationProductData ? this.props.getVariationProductData.ProductImage : null,
                    variationIsTaxable: this.props.getVariationProductData ? this.props.getVariationProductData.Taxable : 0,
                    variationDefaultQunatity: 1,
                    filteredAttribute: [],
                    filterTerms: [],
                    ManagingStock: this.props.getVariationProductData ? this.props.getVariationProductData.ManagingStock : null,
                    old_price: this.props.getVariationProductData ? this.props.getVariationProductData.old_price : 0,
                    incl_tax: this.props.getVariationProductData ? this.props.getVariationProductData.incl_tax : 0,
                    excl_tax: this.props.getVariationProductData ? this.props.getVariationProductData.excl_tax : 0,
                    ticket_status: this.props.getVariationProductData.IsTicket,
                    variationfound: null,
                    selectedOptionCode: null,
                    selectedOptions: []
                });
                $(".button_with_checkbox input").prop("checked", false);
                this.state.variationStyles = { cursor: "no-drop", pointerEvents: "none" }
                $("#add_variation_product_btn").css({ "cursor": "no-drop", "pointer-events": "none" });
                //--------------------------------------------------------------------
                //   this.forceUpdate()
                // $(".close").trigger("click");
                $('#VariationPopUp').modal('hide')
                if (isMobileOnly == true) {
                    // window.location = '/shopview';
                    this.props.openModal('')
                }
            } else {
                if (isMobileOnly == true) {
                    // window.location = '/shopview';
                    this.props.openModal('')
                }
                $('#VariationPopUp').modal('hide')
                this.props.msg('Product is out of stock.');
                $('#common_msg_popup').modal('show');
            }
            this.setState({ variationDefaultQunatity: 1 })
            $('#VariationPopUp').modal('hide')
            if (isMobileOnly == true) {
                //window.location = '/shopview';
                this.props.openModal('')
            }

            //Android Call----------------------------
            var totalPrice = 0.0;
            cartlist && cartlist.map(item => {
                totalPrice += item.Price;
            })
            androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
            //-----------------------------------------
        }
    }

    addSimpleProducttoCart(productx_qty) {
        const { dispatch, single_product, showSelectedProduct } = this.props;
        var ticket_Data = this.state.ticket_status == true ? localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '' : ''
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        var tick_data = this.state.getVariationProductData && this.state.getVariationProductData.TicketInfo ? JSON.parse(this.state.getVariationProductData.TicketInfo) : '';
        var data = null;
        var SingleProduct = null;
        if (single_product) {
            if (single_product.WPID == this.state.getVariationProductData.WPID) {
                SingleProduct = single_product
            } else {
                SingleProduct = this.state.getVariationProductData
            }
        } else {
            if (cartlist.length > 0) {
                cartlist.map(prdId => {
                    if (prdId.product_id === this.state.getVariationProductData.WPID) {
                        SingleProduct = this.state.getVariationProductData
                        SingleProduct['after_discount'] = prdId.after_discount;
                        SingleProduct['product_discount_amount'] = prdId.product_discount_amount;
                        SingleProduct['product_after_discount'] = prdId.product_after_discount;
                        SingleProduct['new_product_discount_amount'] = prdId.new_product_discount_amount;
                        SingleProduct['discount_amount'] = prdId.discount_amount;
                        SingleProduct['discount_type'] = prdId.discount_type;
                        SingleProduct['cart_after_discount'] = prdId.cart_after_discount;
                        SingleProduct['cart_discount_amount'] = prdId.cart_discount_amount;
                        SingleProduct['line_item_id'] = prdId.line_item_id;
                    }
                })
            }
        }
        data = {
            line_item_id: SingleProduct ? SingleProduct.line_item_id : 0,
            cart_after_discount: SingleProduct ? SingleProduct.cart_after_discount : 0,
            cart_discount_amount: SingleProduct ? SingleProduct.cart_discount_amount : 0,
            after_discount: SingleProduct ? SingleProduct.after_discount : 0,
            discount_amount: SingleProduct ? SingleProduct.discount_amount : 0,
            product_after_discount: SingleProduct ? SingleProduct.product_after_discount : 0,
            product_discount_amount: SingleProduct ? SingleProduct.product_discount_amount : 0,
            quantity: (productx_qty > 0) ? productx_qty : this.state.variationDefaultQunatity,
            Title: this.state.variationTitle,
            Sku: SingleProduct ? SingleProduct.Sku : null,
            Price: productx_qty > 0 ? parseInt(productx_qty) * parseFloat(this.state.variationPrice) : parseInt(this.state.variationDefaultQunatity) * parseFloat(this.state.variationPrice),
            product_id: this.state.getVariationProductData.WPID ? this.state.getVariationProductData.WPID : this.state.getVariationProductData.product_id,
            variation_id: 0,
            isTaxable: this.state.variationIsTaxable,
            old_price: this.state.old_price,
            incl_tax: this.state.incl_tax,
            excl_tax: this.state.excl_tax,
            ticket_status: this.state.ticket_status,
            product_ticket: this.state.ticket_status == true ? ticket_Data ? ticket_Data : '' : '',
            tick_event_id: this.state.ticket_status == true ? tick_data._event_name : null,
            discount_type: SingleProduct ? SingleProduct.discount_type : "",
            new_product_discount_amount: SingleProduct ? SingleProduct.new_product_discount_amount : 0,
            TaxStatus: this.state.TaxStatus,
            tcForSeating: this.state.tcForSeating,
            TaxClass: this.state.TaxClass,
            ticket_info: this.state.getVariationProductData && this.state.getVariationProductData.ticket_info ? this.state.getVariationProductData.ticket_info : []
        }
        var product = this.state.getVariationProductData
        var qty = 0;
        cartlist.map(item => {
            if (product.WPID === item.product_id) {
                qty = item.quantity;
            }
        })
        var txtPrdQuantity = (productx_qty > 0) ? productx_qty : document.getElementById("qualityUpdater").value;
        if (parseInt(txtPrdQuantity) <= 0) {
            /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
            this.props.msg(LocalizedLanguage.productQty)
            $('#common_msg_popup').modal('show')
            return;
        }
        if (this.state.variationStockQunatity == 'Unlimited' || qty <= this.state.variationStockQunatity || qty <= product.StockQuantity) {

            if (showSelectedProduct && cartlist.length > 0) {
                var isItemFoundToUpdate = false;
                cartlist.map((item, index) => {
                    if (typeof showSelectedProduct !== 'undefined' && showSelectedProduct !== null) {
                        var _index = -1;
                        if (showSelectedProduct['selectedIndex'] >= 0) { _index = parseInt(showSelectedProduct.selectedIndex) }
                        if (_index > -1 && showSelectedProduct.selectedIndex == index) {
                            isItemFoundToUpdate = true;
                            cartlist[index] = data
                        }
                    }
                })
                if (isItemFoundToUpdate == false) {
                    cartlist.push(data);
                }
            } else {
                cartlist.push(data);
            }
            this.setState({
                showSelectStatus: false,
                variationfound: null
            })
            this.stockUpdateQuantity(cartlist, data);
            localStorage.removeItem("PRODUCT");
            localStorage.removeItem("SINGLE_PRODUCT")
            dispatch(cartProductActions.addtoCartProduct(cartlist)); // this.state.cartproductlist
            dispatch(cartProductActions.showSelectedProduct(null));
            dispatch(cartProductActions.singleProductDiscount());
            this.state.showSelectStatus = false;
            this.state.variationDefaultQunatity = 1;
            if (parseInt(productx_qty) > 0) { } else {
                $('#VariationPopUp').modal('hide');
            }
            if (isMobileOnly == true) {
                // window.location = '/shopview';
                this.props.openModal('')
            }
        } else {
            if (isMobileOnly == true) {
                // window.location = '/shopview';
                this.props.openModal('')
            }
            $('#VariationPopUp').modal('hide');
            this.props.msg('Product is out of stock.');
            $('#common_msg_popup').modal('show');

        }

        //Android Call----------------------------
        var totalPrice = 0.0;
        cartlist && cartlist.map(item => {
            totalPrice += item.Price;
        })
        androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
        //-----------------------------------------

    }

    stockUpdateQuantity(cardData, data) {
        var qty = 0
        cardData.map(item => {
            if (data.product_id === item.product_id) {
                qty += item.quantity;
            }
        })
        this.setState({
            variationStockQunatity: this.props.getVariationProductData ?
                (this.props.getVariationProductData.StockStatus == null || this.props.getVariationProductData.StockStatus == 'instock') && this.props.getVariationProductData.ManagingStock == false ? "Unlimited" : (typeof this.props.getVariationProductData.StockQuantity != 'undefined') && this.props.getVariationProductData.StockQuantity != '' ? this.props.getVariationProductData.StockQuantity - qty : '0' : '0',
            variationDefaultQunatity: 1
        })
    }

    componentWillMount = props => {
        this.clickTimeout = null
        this.setState({ filterTerms: [] })
    }

    updateStates(props) {
        var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        var qty = 0;
        if (cartItemList && cartItemList.length > 0) {
            cartItemList.map(item => {
                if (props.getVariationProductData && props.getVariationProductData.Type == "variable") {
                    if (props.getVariationProductData && props.getVariationProductData.WPID == item.product_id) {
                        qty = item.quantity;
                    }
                } else {
                    if (props.getVariationProductData && props.getVariationProductData.WPID == item.product_id) {
                        qty = item.quantity;
                        this.setState({
                            variationStockQunatity: props.getVariationProductData ?
                                (props.getVariationProductData.StockStatus == null || props.getVariationProductData.StockStatus == 'instock') && props.getVariationProductData.ManagingStock == false ? "Unlimited"
                                    : (typeof props.getVariationProductData.StockQuantity != 'undefined') && props.getVariationProductData.StockQuantity != '' ? props.getVariationProductData.StockQuantity - qty : '0' : '0'
                        })
                    }
                }
            })
        }
        //  for current show name of product 
        if (props.showSelectedProduct) {
            this.setState({
                showSelectStatus: true,
                variationStyles: { cursor: "pointer", pointerEvents: "auto" }
            })

            this.state.showSelectStatus = true;
            if (props.getVariationProductData && props.getVariationProductData.Type == "variable") {
                this.state.variationfound = props.showSelectedProduct;
                qty = props.showSelectedProduct.quantity;
                this.setState({ variationfound: props.showSelectedProduct })
            } else {
            }
            if (props.get_single_inventory_quantity) {
                if (props.getVariationProductData && props.getVariationProductData.Type == "variable") {
                    if (props.showSelectedProduct.WPID !== props.get_single_inventory_quantity.wpid) {
                        this.setState({ showSelectStatus: false })
                    } else {
                        props.showSelectedProduct['StockQuantity'] = props.get_single_inventory_quantity.quantity;
                    }
                }
            }
            if (props.single_product) {
                this.setState({ showSelectStatus: false })
            }
        }

        if (props.single_product && props.getVariationProductData) {
            if (props.getVariationProductData.Type == "simple") {
                if (props.getVariationProductData.WPID !== props.single_product.WPID) {
                    localStorage.removeItem("PRODUCT");
                    localStorage.removeItem("SINGLE_PRODUCT")
                    props.dispatch(cartProductActions.singleProductDiscount());
                } else {
                    //  alert("when simple case match id")
                }
            } else {
                //  alert("when varition case")
                this.state.variationfound = props.single_product;
                this.setState({ variationfound: props.single_product })
            }
        }
        if (props.get_single_inventory_quantity) {
            if (props.getVariationProductData.Type == "variable") {
                props.getVariationProductData.Variations.map(updateItem => {
                    if (updateItem.WPID == props.get_single_inventory_quantity.wpid) {
                        updateItem['StockQuantity'] = props.get_single_inventory_quantity.quantity;
                        this.state.variationStockQunatity = props.get_single_inventory_quantity.quantity;
                        this.state.showQantity = true
                    }
                })
                if (this.state.showQantity == true) {
                    var FindItems = props.getVariationProductData.Variations.find(item => item.WPID === props.get_single_inventory_quantity.wpid)
                    this.state.variationTitle = (FindItems && FindItems.Title && FindItems.Title != "") ? FindItems.Title : FindItems && FindItems.Sku ? FindItems.Sku : "";
                    this.state.variationImage = FindItems && FindItems.ProductImage ? FindItems.ProductImage : '';
                    this.state.variationPrice = FindItems && FindItems.Price ? FindItems.Price : '';
                    this.state.old_price = FindItems && FindItems.old_price ? FindItems.old_price : '';
                    this.state.ManagingStock = FindItems && FindItems.ManagingStock ? FindItems.ManagingStock : '';
                    this.state.variationfound = FindItems ? FindItems : '';
                    this.state.variationStockQunatity = props.get_single_inventory_quantity.quantity
                    this.setState({
                        variationTitle: FindItems && FindItems.Title && FindItems.Title != "" ? FindItems.Title : FindItems && FindItems.Sku ? FindItems.Sku : '',
                        variationImage: FindItems && FindItems.ProductImage ? FindItems.ProductImage : '',
                        variationPrice: FindItems && FindItems.Price ? FindItems.Price : '',
                        old_price: FindItems && FindItems.old_price ? FindItems.old_price : '',
                        ManagingStock: FindItems && FindItems.ManagingStock ? FindItems.ManagingStock : '',
                        variationfound: FindItems ? FindItems : '',
                        variationStockQunatity: props.get_single_inventory_quantity.quantity
                    })
                }
            } else {
                if (props.getVariationProductData.WPID == props.get_single_inventory_quantity.wpid) {
                    props.getVariationProductData['StockQuantity'] = props.get_single_inventory_quantity.quantity;
                    this.state.variationStockQunatity = props.get_single_inventory_quantity.quantity;
                    this.state.showQantity = true
                    this.setState({
                        showQantity: true,
                        variationStockQunatity: props.get_single_inventory_quantity.quantity
                    })
                } else {
                    this.state.showQantity = false
                    this.setState({ showQantity: false })
                }
            }
        }
        if (props.getVariationProductData) {
            this.setState({
                getVariationProductData: props.getVariationProductData,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.state.showQantity == true ? this.state.variationTitle : props.getVariationProductData ? props.getVariationProductData.Title && props.getVariationProductData.Title != "" ? props.getVariationProductData.Title : props.getVariationProductData.Sku : '',
                variationId: 0,
                variationPrice: this.state.showQantity == true ? this.state.variationPrice : props.getVariationProductData ? props.getVariationProductData.Price : 0,
                variationStockQunatity: this.state.showQantity == true ? this.state.variationStockQunatity :
                    (props.getVariationProductData.ManagingStock == false && props.getVariationProductData.StockStatus == "outofstock") ? "outofstock" :
                        (props.getVariationProductData.StockStatus == null || props.getVariationProductData.StockStatus == 'instock') && props.getVariationProductData.ManagingStock == false ? "Unlimited" : (typeof props.getVariationProductData.StockQuantity != 'undefined') && props.getVariationProductData.StockQuantity != '' ? props.getVariationProductData.StockQuantity - qty : '0',

                variationImage: this.state.showQantity == true ? this.state.variationImage : props.getVariationProductData ? props.getVariationProductData.ProductImage ? props.getVariationProductData.ProductImage : '' : '',
                variationDefaultQunatity: props.showSelectedProduct && qty > 0 ? qty : this.state.variationDefaultQunatity ? this.state.variationDefaultQunatity : 1,
                ManagingStock: this.state.showQantity == true ? this.state.ManagingStock : props.getVariationProductData.ManagingStock,
                old_price: this.state.showQantity == true ? this.state.old_price : props.getVariationProductData ? props.getVariationProductData.old_price : 0,
                incl_tax: props.getVariationProductData ? props.getVariationProductData.incl_tax : 0,
                excl_tax: props.getVariationProductData ? props.getVariationProductData.excl_tax : 0,
                ticket_status: props.getVariationProductData ? props.getVariationProductData.IsTicket : '',
                after_discount: props.after_discount ? props.after_discount : 0,
                TaxStatus: props.getVariationProductData ? props.getVariationProductData.TaxStatus : '',
                TaxClass: props.getVariationProductData ? props.getVariationProductData.TaxClass : '',
                tcForSeating: props.getVariationProductData.TicketInfo ? JSON.parse(props.getVariationProductData.TicketInfo) : "",
            });
            if (props.showSelectedProduct || props.single_product) {
                var prd = props.showSelectedProduct ? props.showSelectedProduct : props.single_product;
                if (props.showSelectedProduct && props.single_product) {
                    this.setState({
                        variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                            (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ? prd.StockQuantity - qty : '0',
                        variationDefaultQunatity: this.state.variationDefaultQunatity ? this.state.variationDefaultQunatity : prd.quantity ? prd.quantity : 1
                    })
                } else if (props.single_product) {
                    if (cartItemList.length > 0) {
                        var findProduct = cartItemList && cartItemList.find(function (element) {
                            return (element.variation_id !== 0 ? element.variation_id == props.single_product.WPID : element.product_id == props.single_product.WPID)
                        })
                        if (findProduct) {
                            this.setState({
                                variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                                    (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ?
                                        prd.StockQuantity - findProduct.quantity : '0',
                                variationDefaultQunatity: prd.quantity ? prd.quantity : this.state.variationDefaultQunatity

                            })
                        } else {
                            this.setState({
                                variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                                    (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ?
                                        prd.StockQuantity : '0',
                                variationDefaultQunatity: prd.quantity ? prd.quantity : this.state.variationDefaultQunatity

                            })
                        }
                    } else {
                        this.setState({
                            variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                                (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ? prd.StockQuantity : 1
                        })
                    }
                }
            }
        }
    }

    componentDidMount() {
        const { compositeSwitchCases } = this;
        window.addEventListener('message', function (e) {
            var data = e && e.data;
            var productxData = typeof data == 'string' ? JSON.parse(data) : typeof data == 'object' ? data : '';
            console.log("data", data)
            console.log("productxData", productxData)
            if (productxData && productxData !== "" && data && data !== "") {
                compositeSwitchCases(productxData)
            }
        })
        setTimeout(() => {
            $(".button_with_checkbox input").prop("checked", false);
        }, 500);

        this.updateStates(this.props);
    }

    /**
   * Created By: Shakuntala Jatav
   * Created Date : 11-02-2020
   * Description : get event for composite 
   */
    compositeSwitchCases = (jsonMsg) => {
        //console.log("compositeEvent", jsonMsg)
        var compositeEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (compositeEvent && compositeEvent !== '') {
            console.log("compositeEvent", compositeEvent)
            switch (compositeEvent) {
                case "extensionReady":
                    this.sendMessageToComposite(jsonMsg)
                    break;
                //oliverAddedToCart
                case "oliverAddedToCart":
                    this.getCompositeAddedToCart(jsonMsg)
                    break;
                //oliverSetProductxData
                case "oliverSetProductxData":
                    this.getCompositeSetProductxData(jsonMsg)
                    break;
                // extensionFinished
                case "extensionFinished":
                    this.getCompositeExtensionFinished(jsonMsg)
                    break;
                default:
                    break;
            }
        }
    }
    /**
     * Created By: Shakuntala Jatav
     * Created Date : 11-02-2020
     * Description : get extensionReady event for hide header and footer through the post message 
     */
    sendMessageToComposite = (_msg) => {
        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
        var clientJSON =
        {
            oliverpos:
            {
                event: "oliverHideContent"
            },
            data:
            {

            }
        };
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }
    /**
    * Created By: Shakuntala Jatav
    * Created Date : 12-02-2020
    * Description : get eExtensionFinished event for close modal. 
    */
    getCompositeExtensionFinished = (_jsonMsg) => {
        $('#VariationPopUp').modal('hide');
        this.props.productData(false);
        this.handleClose();
    }
    /**
    * Created By: Shakuntala Jatav
    * Created Date : 12-02-2020
    * Description : get oliverAddedToCart event for the post message from woocommerce site.
    */

    getCompositeAddedToCart = (_jsonMsg) => {
        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
        var clientJSON =
        {
            oliverpos:
            {
                event: "oliverGetProductxData"
            },
            data:
            {

            }
        };
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }
    /**
    * Created By: Shakuntala Jatav
    * Created Date : 12-02-2020
    * Description : get oliverAddedToCart event for ready product to add  on cart.
    */
    getCompositeSetProductxData = (_jsonMsg) => {
        if (_jsonMsg.data && _jsonMsg.data.status == true) {
            var productData = 0;
            var data = _jsonMsg.data.product[0]
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    if (_jsonMsg.data.productxId == data[k].product_id) {
                        productData = data[k].quantity;
                        //localStorage.setItem("PRODUCTX_DATA", JSON.stringify(data[k]))
                        // set PRODUCTX_DATA in localStorage
                        if (localStorage.getItem("PRODUCTX_DATA")) {
                            var productX = JSON.parse(localStorage.getItem("PRODUCTX_DATA"));
                            productX.push(data[k]);
                            localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
                        } else {
                            var productX = new Array();
                            productX.push(data[k]);
                            localStorage.setItem("PRODUCTX_DATA", JSON.stringify(productX))
                        }
                    }
                }
            }

            this.addSimpleProducttoCart(productData)
        } else {
            this.getCompositeAddedToCart()
        }

    }

    optionClick(option, attribute, AttrIndex) {
        var filterTerms = this.state.filterTerms;
        var optExist = false;
        filterTerms && filterTerms.map(opItem => {
            if (opItem.attribute === attribute) {
                opItem.attribute = attribute;
                opItem.option = option;
                optExist = true
            }
        })
        if (optExist == false) {
            filterTerms.push({
                attribute: attribute,
                option: option,
                index: AttrIndex
            })
            this.state.filterTerms = filterTerms
            this.setState({ filterTerms: filterTerms })
        }
        this.setState({ filterTerms: filterTerms })
        if (this.clickTimeout !== null) {
            clearTimeout(this.clickTimeout)
            this.clickTimeout = null
        } else {
            this.clickTimeout = setTimeout(() => {
                clearTimeout(this.clickTimeout)
                this.clickTimeout = null
            }, 300);
            this.setState({
                selectedAttribute: attribute
            });
            if (this.props.getVariationProductData.ProductAttributes && this.props.getVariationProductData.ProductAttributes.length > 1) {
                var filteredAttribute = this.props.getVariationProductData.Variations.filter(item => {
                    var optionRes = option.replace(/\s/g, '-').toLowerCase();
                    optionRes = optionRes.replace(/\//g, "-").toLowerCase();
                    var isExist = false;
                    item && item !== undefined && item.combination !== undefined && item.combination.split("~").map(combination => {
                        if (combination.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase() === optionRes || combination == "**")
                            isExist = true;
                    })
                    return isExist;
                })
                this.setState({ filteredAttribute: filteredAttribute })
            }
            this.setSelectedOption(option, attribute, AttrIndex);
            var attributeLenght = this.getAttributeLenght();
            this.searchvariationProduct(option);
        }
    }

    setSelectedOption(option, attribute, AttrIndex) {
        //Find Attribute Code----------------------------------------------
        var attribute_list = localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true ? JSON.parse(localStorage.getItem("attributelist")) : null;
        var sub_attribute;

        if (attribute_list !== null && attribute_list !== undefined && attribute_list.length > 0) {
            var found = attribute_list.find(function (element) {
                return element.Code.toLowerCase() == attribute.toLowerCase()
            })
            if (found) {
                sub_attribute = found.SubAttributes.find(function (element) {
                    return element.Value.toLowerCase() == option.toLowerCase()
                })
            }
        }
        var newOption = sub_attribute ? sub_attribute.Code : option;
        this.state.selectedOptionCode = newOption;
        this.setState({ selectedOptionCode: newOption })
        //---------Array of selected options-----------------------------
        var arrAttr = this.state.selectedOptions ? this.state.selectedOptions : [];
        var isAttributeExist = false;
        arrAttr && arrAttr.length > 0 && arrAttr.map(item => {
            if (item.attribute.toLowerCase() == attribute.toLowerCase()) {
                item.option = option;
                isAttributeExist = true;
            }
        })
        if (isAttributeExist == false)
            arrAttr.push({ attribute: attribute, option: this.state.selectedOptionCode, index: AttrIndex });
        //Remove Dumplecate attribute------------
        arrAttr = arrAttr.filter((val, id, array) => {
            return array.indexOf(val) == id;
        });
        this.setState({ selectedOptions: arrAttr })
        //-------------------------------------------------------
    }

    combo(c) {
        var r = [];
        var len = c.length;
        var tmp = [];
        function nodup() {
            var got = {};
            for (var l = 0; l < tmp.length; l++) {
                if (got[tmp[l]]) return false;
                got[tmp[l]] = true;
            }
            return true;
        }
        function iter(col, done) {
            var l, rr;
            if (col === len) {
                if (nodup()) {
                    rr = [];
                    for (l = 0; l < tmp.length; l++)
                        rr.push(c[tmp[l]]);
                    r.push(rr.join('~'));
                }
            } else {
                for (l = 0; l < len; l++) {
                    tmp[col] = l;
                    iter(col + 1);
                }
            }
        }
        iter(0);
        return r;
    }
    // Created By: 
    // created Date: 
    // Modified By : Nagendra
    // Modified Date: 18/06/2019
    // Decription: Update the product search on the basis of product combination. also handle the '**' search in combination  
    searchvariationProduct(options) {
        var filteredArr = []
        this.state.showQantity = false
        this.state.filterTerms.map(itm => {
            var attribute_list = localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true ? JSON.parse(localStorage.getItem("attributelist")) : null;
            var sub_attribute;
            if (attribute_list && attribute_list !== undefined && attribute_list.length > 0) {
                var found = attribute_list.find(function (element) {
                    return element.Code.toLowerCase() == itm.attribute.toLowerCase()
                })
                if (found) {
                    var SubAttributes = found.SubAttributes;
                    if (SubAttributes) {
                        sub_attribute = SubAttributes.find(function (element) {
                            return (element.Value).toLowerCase() == itm.option.toLowerCase();
                        })
                    }
                }
            }
            filteredArr.push(sub_attribute ? sub_attribute.Code : itm.option);
        })
        var cominationArr = this.combo(filteredArr);
        var variations = this.state.getVariationProductData && this.state.getVariationProductData.Variations;
        var getVariationProductData = this.state.getVariationProductData
        var _fileterTerm = this.state.filterTerms ? this.state.filterTerms : "";
        var checkFound = false;
        var found = variations.find(function (element) {
            cominationArr && cominationArr.map(comb => {
                if (element.combination.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase() === comb.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase()) {
                    checkFound = true;
                    return true;
                }
            })
            if (checkFound == true) {
                return true;
            }
            // if product not found then--------------------------------
            ///------check 'Any One' option --------------------------------        
            if (checkFound == false) {
                //=======check variation exist for option==========================   
                // ckeck when render the attribute options-------------------  
                var checkExist = [];
                if (_fileterTerm) {
                    var sortArr = _fileterTerm.sort(function (obj1, obj2) {
                        return obj1.index - obj2.index;
                    })
                    sortArr && sortArr.map(filterattr => {
                        var arrComb = element.combination.split('~');
                        if (arrComb && arrComb.length > 0) {
                            var combinationAtindex = arrComb[filterattr.index];
                            if (combinationAtindex === filterattr.option || combinationAtindex == '**')  //variation exist for option to be displayed
                            {
                                checkExist.push('match');
                            } else {
                                checkExist.push('mismatch');
                            }
                        }
                    })
                    if (checkFound == true) {
                        return true;
                    }

                    // if product not found then--------------------------------
                    ///------check 'Any One' option --------------------------------    
                    var _attribute = getVariationProductData.ProductAttributes.filter(item => item.Variation == true)
                    if (!found && checkFound == false && _fileterTerm.length == _attribute.length)  //checking all attrbite's option selceted 
                    {
                        //=======check variation exist for option==========================   
                        // ckeck when render the attribute options-------------------  
                        var checkExist = [];
                        if (_fileterTerm) {
                            var sortArr = _fileterTerm.sort(function (obj1, obj2) {
                                return obj1.index - obj2.index;
                            })

                            sortArr && sortArr.map(filterattr => {
                                var arrComb = element.combination.split('~');
                                if (arrComb && arrComb.length > 0) {
                                    var combinationAtindex = arrComb[filterattr.index];
                                    if (combinationAtindex === filterattr.option || combinationAtindex == '**')  //variation exist for option to be displayed
                                    {
                                        checkExist.push('match');
                                    } else {
                                        checkExist.push('mismatch');
                                    }
                                }
                            })
                        }
                        if (!checkExist.includes("mismatch")) {
                            return element;
                        }
                    }
                }
            }
        })

        if (this.props.single_product) {
            if (found.WPID !== this.props.single_product.WPID) {
                localStorage.removeItem("PRODUCT");
                localStorage.removeItem("SINGLE_PRODUCT")
                this.props.dispatch(cartProductActions.singleProductDiscount());
            }
        }
        this.setState({ showSelectStatus: false })
        if (typeof found !== 'undefined') {
            var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            var qty = 0;
            cartItemList.map(item => {
                if (found.WPID == item.variation_id) {

                    qty = item.quantity;

                }
            })
            this.state.variationfound = found;
            // when active selected product show change variationDefaultQunatity.
            var selectedDefaultQty = 0;
            if (this.props.showSelectedProduct && found) {
                const { showSelectedProduct } = this.props;
                if (showSelectedProduct.ParentId == found.ParentId && showSelectedProduct.WPID == found.WPID) {
                    selectedDefaultQty = showSelectedProduct.quantity
                }
            }
            this.setState({
                variationTitle: found.Title && found.Title != "" ? found.Title : found.Sku,
                variationId: found.WPID,
                variationParentId: found.ParentId,
                variationPrice: found.Price,
                variationStockQunatity: (found.ManagingStock == false && found.StockStatus == "outofstock") ? "outofstock" : (found.StockStatus == null || found.StockStatus == 'instock') && found.ManagingStock == false ? "Unlimited" : found.StockQuantity - qty,
                variationImage: (found.ProductImage == null) ? this.state.variationImage : found.ProductImage,
                variationIsTaxable: found.Taxable,
                variationDefaultQunatity: selectedDefaultQty !== 0 ? selectedDefaultQty : 1,
                ManagingStock: found.ManagingStock,
                old_price: found.old_price,
                incl_tax: this.state.incl_tax,
                excl_tax: this.state.excl_tax,
                variationfound: found
            });
            this.state.variationStyles = { cursor: "pointer", pointerEvents: "auto" }
            $("#add_variation_product_btn").css({ "cursor": "pointer", "pointer-events": "auto" });
        } else {
            this.setState({
                variationParentId: 0,
                variationPrice: 0,
                variationStockQunatity: 0,
                variationImage: "",
                ManagingStock: null,
            });
        }
    }

    getAttributeLenght() {
        return this.props.getVariationProductData.ProductAttributes.length;
    }


    componentWillReceiveProps(nextPros) {
        //console.log("nextPros", nextPros)
        localStorage.removeItem("CART_QTY")
        var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        var qty = 0;
        if (cartItemList && cartItemList.length > 0) {
            cartItemList.map(item => {
                if (nextPros.getVariationProductData && nextPros.getVariationProductData.Type == "variable") {
                    if (nextPros.getVariationProductData && nextPros.getVariationProductData.WPID == item.product_id) {
                        qty = item.quantity;
                    }
                } else {
                    if (nextPros.getVariationProductData && nextPros.getVariationProductData.WPID == item.product_id) {
                        qty = item.quantity;
                        this.setState({
                            variationStockQunatity: nextPros.getVariationProductData ?
                                (nextPros.getVariationProductData.StockStatus == null || nextPros.getVariationProductData.StockStatus == 'instock') && nextPros.getVariationProductData.ManagingStock == false ? "Unlimited"
                                    : (typeof nextPros.getVariationProductData.StockQuantity != 'undefined') && nextPros.getVariationProductData.StockQuantity != '' ? nextPros.getVariationProductData.StockQuantity - qty : '0' : '0'
                        })
                    }
                }
            })
        }
        //  for current show name of product 
        if (nextPros.showSelectedProduct) {
            this.setState({
                showSelectStatus: true,
                variationStyles: { cursor: "pointer", pointerEvents: "auto" }
            })

            this.state.showSelectStatus = true;
            if (nextPros.getVariationProductData && nextPros.getVariationProductData.Type == "variable") {
                this.state.variationfound = nextPros.showSelectedProduct;
                qty = nextPros.showSelectedProduct.quantity;
                this.setState({ variationfound: nextPros.showSelectedProduct })
            } else {
            }
            if (nextPros.get_single_inventory_quantity) {
                if (nextPros.getVariationProductData && nextPros.getVariationProductData.Type == "variable") {
                    if (nextPros.showSelectedProduct.WPID !== nextPros.get_single_inventory_quantity.wpid) {
                        this.setState({ showSelectStatus: false })
                    } else {
                        nextPros.showSelectedProduct['StockQuantity'] = nextPros.get_single_inventory_quantity.quantity;
                    }
                }
            }
            if (nextPros.single_product) {
                this.setState({ showSelectStatus: false })
            }
        }

        if (nextPros.single_product && nextPros.getVariationProductData) {
            if (nextPros.getVariationProductData.Type == "simple") {
                if (nextPros.getVariationProductData.WPID !== nextPros.single_product.WPID) {
                    localStorage.removeItem("PRODUCT");
                    localStorage.removeItem("SINGLE_PRODUCT")
                    this.props.dispatch(cartProductActions.singleProductDiscount());
                } else {
                    //  alert("when simple case match id")
                }
            } else {
                //  alert("when varition case")
                this.state.variationfound = nextPros.single_product;
                this.setState({ variationfound: nextPros.single_product })
            }
        }
        if (nextPros.get_single_inventory_quantity) {
            if (nextPros.getVariationProductData.Type == "variable") {
                nextPros.getVariationProductData.Variations.map(updateItem => {
                    if (updateItem.WPID == nextPros.get_single_inventory_quantity.wpid) {
                        updateItem['StockQuantity'] = nextPros.get_single_inventory_quantity.quantity;
                        this.state.variationStockQunatity = nextPros.get_single_inventory_quantity.quantity;
                        this.state.showQantity = true
                    }
                })
                if (this.state.showQantity == true) {
                    var FindItems = nextPros.getVariationProductData.Variations.find(item => item.WPID === nextPros.get_single_inventory_quantity.wpid)
                    this.state.variationTitle = (FindItems && FindItems.Title && FindItems.Title != "") ? FindItems.Title : FindItems && FindItems.Sku ? FindItems.Sku : "";
                    this.state.variationImage = FindItems && FindItems.ProductImage ? FindItems.ProductImage : '';
                    this.state.variationPrice = FindItems && FindItems.Price ? FindItems.Price : '';
                    this.state.old_price = FindItems && FindItems.old_price ? FindItems.old_price : '';
                    this.state.ManagingStock = FindItems && FindItems.ManagingStock ? FindItems.ManagingStock : '';
                    this.state.variationfound = FindItems ? FindItems : '';
                    this.state.variationStockQunatity = nextPros.get_single_inventory_quantity.quantity
                    this.setState({
                        variationTitle: FindItems && FindItems.Title && FindItems.Title != "" ? FindItems.Title : FindItems && FindItems.Sku ? FindItems.Sku : '',
                        variationImage: FindItems && FindItems.ProductImage ? FindItems.ProductImage : '',
                        variationPrice: FindItems && FindItems.Price ? FindItems.Price : '',
                        old_price: FindItems && FindItems.old_price ? FindItems.old_price : '',
                        ManagingStock: FindItems && FindItems.ManagingStock ? FindItems.ManagingStock : '',
                        variationfound: FindItems ? FindItems : '',
                        variationStockQunatity: nextPros.get_single_inventory_quantity.quantity
                    })
                }
            } else {
                if (nextPros.getVariationProductData.WPID == nextPros.get_single_inventory_quantity.wpid) {
                    nextPros.getVariationProductData['StockQuantity'] = nextPros.get_single_inventory_quantity.quantity;
                    this.state.variationStockQunatity = nextPros.get_single_inventory_quantity.quantity;
                    this.state.showQantity = true
                    this.setState({
                        showQantity: true,
                        variationStockQunatity: nextPros.get_single_inventory_quantity.quantity
                    })
                } else {
                    this.state.showQantity = false
                    this.setState({ showQantity: false })
                }
            }
        }

        if (nextPros.getVariationProductData) {
            this.setState({
                getVariationProductData: nextPros.getVariationProductData,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.state.showQantity == true ? this.state.variationTitle : nextPros.getVariationProductData ? nextPros.getVariationProductData.Title && nextPros.getVariationProductData.Title != "" ? nextPros.getVariationProductData.Title : nextPros.getVariationProductData.Sku : '',
                variationId: 0,
                variationPrice: this.state.showQantity == true ? this.state.variationPrice : nextPros.getVariationProductData ? nextPros.getVariationProductData.Price : 0,
                variationStockQunatity: this.state.showQantity == true ? this.state.variationStockQunatity :
                    (nextPros.getVariationProductData.ManagingStock == false && nextPros.getVariationProductData.StockStatus == "outofstock") ? "outofstock" :
                        (nextPros.getVariationProductData.StockStatus == null || nextPros.getVariationProductData.StockStatus == 'instock') && nextPros.getVariationProductData.ManagingStock == false ? "Unlimited" : (typeof nextPros.getVariationProductData.StockQuantity != 'undefined') && nextPros.getVariationProductData.StockQuantity != '' ? nextPros.getVariationProductData.StockQuantity - qty : '0',

                variationImage: this.state.showQantity == true ? this.state.variationImage : nextPros.getVariationProductData ? nextPros.getVariationProductData.ProductImage ? nextPros.getVariationProductData.ProductImage : '' : '',
                //variationDefaultQunatity: nextPros.showSelectedProduct && qty > 0 ? qty :1,
                variationDefaultQunatity: nextPros.showSelectedProduct && qty > 0 ? qty : this.state.variationDefaultQunatity ? this.state.variationDefaultQunatity : 1, //nextPros.getVariationProductData && nextPros.getVariationProductData.DefaultQunatity!=="" ? nextPros.getVariationProductData.DefaultQunatity : '1',                
                ManagingStock: this.state.showQantity == true ? this.state.ManagingStock : nextPros.getVariationProductData.ManagingStock,
                old_price: this.state.showQantity == true ? this.state.old_price : nextPros.getVariationProductData ? nextPros.getVariationProductData.old_price : 0,
                incl_tax: nextPros.getVariationProductData ? nextPros.getVariationProductData.incl_tax : 0,
                excl_tax: nextPros.getVariationProductData ? nextPros.getVariationProductData.excl_tax : 0,
                ticket_status: nextPros.getVariationProductData ? nextPros.getVariationProductData.IsTicket : '',
                after_discount: nextPros.after_discount ? nextPros.after_discount : 0,
                TaxStatus: nextPros.getVariationProductData ? nextPros.getVariationProductData.TaxStatus : '',
                TaxClass: nextPros.getVariationProductData ? nextPros.getVariationProductData.TaxClass : '',
                tcForSeating: nextPros.getVariationProductData.TicketInfo ? JSON.parse(nextPros.getVariationProductData.TicketInfo) : "",
                //product_ticket:nextPros.getVariationProductData.IsTicket==true ? ticket_Data:''
            });
            if (nextPros.showSelectedProduct || nextPros.single_product) {
                var prd = nextPros.showSelectedProduct ? nextPros.showSelectedProduct : nextPros.single_product;
                if (nextPros.showSelectedProduct && nextPros.single_product) {
                    this.setState({
                        variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                            (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ? prd.StockQuantity - qty : '0',
                        // prd.quantity ? prd.quantity : 1
                        variationDefaultQunatity: this.state.variationDefaultQunatity ? this.state.variationDefaultQunatity : prd.quantity ? prd.quantity : 1
                    })
                } else if (nextPros.single_product) {
                    if (cartItemList.length > 0) {
                        var findProduct = cartItemList && cartItemList.find(function (element) {
                            return (element.variation_id !== 0 ? element.variation_id == nextPros.single_product.WPID : element.product_id == nextPros.single_product.WPID)
                        })
                        if (findProduct) {
                            this.setState({
                                variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                                    (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ?
                                        prd.StockQuantity - findProduct.quantity : '0',
                                variationDefaultQunatity: prd.quantity ? prd.quantity : this.state.variationDefaultQunatity

                            })
                        } else {
                            this.setState({
                                variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                                    (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ?
                                        prd.StockQuantity : '0',
                                variationDefaultQunatity: prd.quantity ? prd.quantity : this.state.variationDefaultQunatity

                            })
                        }
                    } else {
                        this.setState({
                            variationStockQunatity: (prd.StockStatus == "outofstock") ? "outofstock" :
                                (prd.StockStatus == null || prd.StockStatus == 'instock') && prd.ManagingStock == false ? "Unlimited" : (typeof prd.StockQuantity != 'undefined') && prd.StockQuantity != '' ? prd.StockQuantity : 1
                        })
                    }
                }
            }
        }
    }

    handleChange(e) {
        if (e.target.value === "") {
            this.setState({ variationDefaultQunatity: 0 });
        }
        else if (e.target.value && !isNaN(e.target.value) && !e.target.value.includes(".")) {
            if (this.state.variationStockQunatity == "Unlimited" || parseInt(this.state.variationStockQunatity) >= parseInt(e.target.value)) {
                this.setState({ variationDefaultQunatity: parseInt(e.target.value) });
            }
        }
    }

    handleClose() {
        $(".button_with_checkbox input").prop("checked", false);
        if (this.props.getVariationProductData) {
            this.setState({
                showSelectStatus: false,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.props.getVariationProductData ? this.props.getVariationProductData.Title : '',
                variationId: 0,
                variationPrice: this.props.getVariationProductData ? this.props.getVariationProductData.Price : 0,
                //variationStockQunatity: this.props.getVariationProductData ?
                // (this.props.getVariationProductData.StockStatus == null || this.props.getVariationProductData.StockStatus == 'instock') && this.props.getVariationProductData.ManagingStock == false ? "Unlimited" : (typeof this.props.getVariationProductData.StockQuantity != 'undefined') && this.props.getVariationProductData.StockQuantity != '' ? this.props.getVariationProductData.StockQuantity : '0' : '0',
                variationImage: this.props.getVariationProductData ? this.props.getVariationProductData.ProductImage ? this.props.getVariationProductData.ProductImage : '' : '',
                // variationDefaultQunatity: 1 ? 1 : this.props.getVariationProductData ? this.props.getVariationProductData.DefaultQunatity : '',
                variationDefaultQunatity: 1,
                ManagingStock: this.props.getVariationProductData ? this.props.getVariationProductData.ManagingStock : null,
                filteredAttribute: [],
                filterTerms: [],
                old_price: this.props.getVariationProductData ? this.props.getVariationProductData.old_price : 0,
                incl_tax: this.props.getVariationProductData ? this.props.getVariationProductData.incl_tax : 0,
                excl_tax: this.props.getVariationProductData ? this.props.getVariationProductData.excl_tax : 0,
                showQantity: false,
                variationfound: null,
                showSelectStatus: false,
                selectedOptionCode: null,
                selectedOptions: [],
                tcForSeating: ""
            });
            this.state.variationDefaultQunatity = 1;
        }

        localStorage.removeItem("PRODUCT");
        localStorage.removeItem("SINGLE_PRODUCT")
        this.props.dispatch(cartProductActions.singleProductDiscount());
        this.props.dispatch(cartProductActions.showSelectedProduct(null));
    }
    // Apply discount for selected product
    discountModal(item) {
        //if (Permissions.key.allowDiscount == false) {
        if (CommonModuleJS.permissionsForDiscount() == false) {
            this.props.msg(LocalizedLanguage.discountPermissionerror);
            $('#common_msg_popup').modal('show');
        } else {
            jQuery('#textDis').val(0)
            localStorage.removeItem("PRODUCT")
            localStorage.removeItem("SINGLE_PRODUCT")
            var VarSingleData = null;
            if (item.Type == "variable") {
                if (this.state.variationfound) {
                    VarSingleData = item.Variations.filter(items => items.WPID == this.state.variationfound.WPID);
                }
            }
            if (item.Type == "variable") {
                $('#single_popup_discount').modal('show')
            } else {
                $('#single_popup_discount').modal('show')
            }
            var data = {
                product: 'product',
                item: VarSingleData && VarSingleData.length > 0 ? VarSingleData[0] : item,
                id: VarSingleData && VarSingleData.length > 0 ? VarSingleData[0].WPID : item.WPID ? item.WPID : item.product_id,
            }
            this.props.dispatch(cartProductActions.selectedProductDis(data))
        }
    }
    //  Update inventory for selected product
    inventoryUpdate(item) {
        $('#panelCalculatorpopUp :input').removeAttr('disabled');
        var VarSingleData = null;
        if (item.Type == "variable") {
            if (this.state.variationfound) {
                VarSingleData = this.state.variationfound
            } else if (this.state.variationfound) {
                VarSingleData = item.Variations.filter(items => items.WPID == this.state.variationfound.WPID);
            }
        } else {
            VarSingleData = item
        }
        this.props.inventoryData(VarSingleData);
        $('#InventoryPopup').modal('show')
    }
    RedirectComponent(url) {
        //history.push(url);
        console.log("redirect")
        this.props.openModal('')
    }
    render() {
        console.log("Test");
        const { getVariationProductData, hasVariationProductData, single_product, showSelectedProduct, isInventoryUpdate } = this.props;
        const { variationfound, showSelectStatus, selectedOptionCode } = this.state;
        const divType = getVariationProductData ? (getVariationProductData.Type == "variable" || getVariationProductData.Type == "simple") ? true : false : "";
        var HostUrl = (divType == false) ? getVariationProductData && getVariationProductData.ParamLink : "";
        // HostUrl = "";
        var tax_is = getVariationProductData && getVariatioModalProduct(single_product ? single_product : variationfound ? variationfound : getVariationProductData, this.state.variationDefaultQunatity);


        var img = this.state.variationImage ? this.state.variationImage.split('/') : '';
        var title = this.state.variationTitle && this.state.variationTitle.length > 34 ? this.state.variationTitle.substring(0, 31) + "..." : this.state.variationTitle;
        var is_discount, is_discount1, is_discount3 = 0;
        if (variationfound) {
            var discount = variationfound.discount_amount > 0 ? parseFloat(variationfound.discount_amount) : 0;
            var price = parseFloat(variationfound.old_price);
            var quantity = parseFloat(variationfound.quantity);
            var disPrice = (price * quantity) - discount;
            is_discount = variationfound && variationfound.cart_discount_amount <= 0 ? variationfound.discount_type == "Number" ? variationfound.old_price - variationfound.product_discount_amount : variationfound.discount_type == "Percentage" ? variationfound.old_price - variationfound.product_discount_amount : parseFloat(disPrice / variationfound.quantity) : parseFloat(disPrice / variationfound.quantity);
        } else if (showSelectedProduct) {
            var disPrice = parseFloat(showSelectedProduct.old_price * showSelectedProduct.quantity) - parseFloat(showSelectedProduct.discount_amount ? showSelectedProduct.discount_amount : 0);
            is_discount1 = showSelectedProduct && showSelectedProduct.cart_discount_amount <= 0 ? showSelectedProduct.discount_type == "Number" ? showSelectedProduct.old_price - showSelectedProduct.product_discount_amount : showSelectedProduct.discount_type == "Percentage" ? showSelectedProduct.old_price - showSelectedProduct.product_discount_amount : parseFloat(disPrice / showSelectedProduct.quantity) : parseFloat(disPrice / showSelectedProduct.quantity);
        }
        var variation_single_data = single_product;
        if (variation_single_data) {
            var quantity = showSelectedProduct ? parseFloat(showSelectedProduct.quantity) : 1;
            var discount = variation_single_data && variation_single_data.cart_discount_amount <= 0 ? variation_single_data.discount_type == "Number" ? variation_single_data.product_discount_amount : variation_single_data.discount_type == "Percentage" ? variation_single_data.product_discount_amount : variation_single_data.discount_amount / quantity : variation_single_data.discount_amount / quantity;
            is_discount3 = discount;
        }
        var SelectedTitle = (showSelectStatus == true && showSelectedProduct) ? showSelectedProduct.Title && showSelectedProduct.Title != "" ? showSelectedProduct.Title : showSelectedProduct.Sku : this.state.variationTitle;
        SelectedTitle = SelectedTitle ? SelectedTitle.replace(" - ", "-") : null;
        const outofstock = {
            fontWeight: 'bold',
            color: 'red',
            textAlign: 'center'
        };

        var cartDiscountType = localStorage.getItem('CART') ? JSON.parse(localStorage.getItem('CART')) : '';
        var statusForCartAndProductDiscount = variationfound && variationfound.cart_discount_amount > 0 && variationfound.product_discount_amount > 0 ? true : getVariationProductData && getVariationProductData.cart_discount_amount > 0 && getVariationProductData.product_discount_amount > 0 ? true : false;
        //console.log("common modal", this.props, this.state)
        var isDemoUser = localStorage.getItem('demoUser')
        return (
            HostUrl !== "" ?
                <div>
                    <div className="appHeader">
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-center position-relative text-truncate">
                                {hasVariationProductData ? <Markup content={(variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)}></Markup> : ''}
                                <a className="position-absolute left-0" href="#" onClick={() => { this.RedirectComponent('/shopview') }}>
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="appCapsule vh-100">
                        <iframe
                            width="100%"
                            height="100%"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            //className="embed-responsive-item diamondSectionHeight"
                            ref={(f) => this.ifr = f}
                            src={HostUrl}
                        />
                    </div>
                    <Footer {...this.props} active="/shopview" />
                </div>
                :
                <div>
                    <div className="appHeader">
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-center position-relative text-truncate">
                                {hasVariationProductData ? <Markup content={(variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)}></Markup> : ''}
                                <a className="position-absolute left-0" href="#" onClick={() => { this.RedirectComponent('/shopview') }}>
                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* new styles starts */}
                    <div className={isDemoUser == true || isDemoUser == 'true' ? 'appCapsule appCapsuleProduct vh-100 appCapsuleBoardingCheckout' : 'appCapsule appCapsuleProduct vh-100'} style={{ paddingBottom: 132 }}>
                        {/* <div className="product_view">  --old-- */}
                        <div>
                            <div className="product-view-unique">
                                <div className="product_view p-15 h-auto">
                                    {/* <!-- Prodcut Image --> */}
                                    <div className="card">
                                        <div className="card-body"> </div>
                                        <img src={hasVariationProductData ? this.state.variationImage ? img == 'placeholder.png' ? '' : this.state.variationImage : '' : ''} onError={(e) => { e.target.onerror = null; e.target.src = "assets/img/placeholder.png" }} style={{ height: '100%' }} className="img-fluid" alt="" />
                                    </div>
                                </div>



                                {/* form cmmented to use after variations div */}

                                {/* <form action="#" className="d-flex align-items-center justify-content-between py-3 border-bottom pl-15 pr-15">
                            <div className="w-100 text-truncate">
                                {

                                    variation_single_data == null ?
                                        // simple price start 
                                        variationfound && variationfound.discount_amount ?
                                            parseFloat(variationfound.old_price).toFixed(2)

                                            :
                                            (getVariationProductData && (typeof getVariationProductData.discount_amount !== 'undefined') && getVariationProductData.discount_amount !== 0) ?
                                                parseFloat(getVariationProductData.old_price).toFixed(2)
                                                :
                                                (showSelectStatus == true && showSelectedProduct) ? showSelectedProduct.discount_amount !== 0 ?
                                                    parseFloat(showSelectedProduct.old_price).toFixed(2)
                                                    :
                                                    parseFloat(showSelectedProduct.old_price).toFixed(2)
                                                    :
                                                    parseFloat(hasVariationProductData ? this.state.variationPrice > 0 ? this.state.variationPrice : 0 : 0).toFixed(2)

                                        :
                                        variation_single_data !== null && variation_single_data.discount_amount == 0 ?
                                            parseFloat(hasVariationProductData ? this.state.variationPrice > 0 ? this.state.variationPrice : 0 : 0).toFixed(2)
                                            :
                                            parseFloat(variation_single_data.Price).toFixed(2)

                                }

                                <div className="fz-14 border-top mr-2 pt-1 mt-1">
                                    {LocalizedLanguage.inventory}

                                    {(showSelectStatus == true && showSelectedProduct) ?
                                        <p className="m-0 fz-18" id="txtInScock"> {(showSelectedProduct.StockStatus == null || showSelectedProduct.StockStatus == 'instock') && showSelectedProduct.ManagingStock == false ? LocalizedLanguage.unlimited : showSelectedProduct.StockQuantity - showSelectedProduct.quantity}</p>
                                        :
                                        <p className="m-0 fz-18" id="txtInScock"> {this.props.getQuantity ? this.props.getQuantity : variation_single_data ? (variation_single_data.StockStatus == null || variation_single_data.StockStatus == 'instock') && variation_single_data.ManagingStock == false ? LocalizedLanguage.unlimited : hasVariationProductData ? this.state.variationStockQunatity != 'Unlimited' ? this.state.variationStockQunatity : this.state.variationStockQunatity : 1 : hasVariationProductData ? this.state.variationStockQunatity != 'Unlimited' ? this.state.variationStockQunatity : this.state.variationStockQunatity : 1}</p>

                                    }
                                </div>
                            </div>

                            <div className="numbers-row">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <button onClick={() => this.decrementDefaultQuantity()} className="btn p-0 shadow-none pointer dec btnincdec" type="button">
                                            <img src="../mobileAssets/img/minus.png" />
                                        </button>
                                    </div>
                                    <input id="qualityUpdater" type="text" className="form-control border-0 shadow-none text-center h-40" name="qualityUpdater" value={hasVariationProductData ? this.state.variationStockQunatity == 'outofstock' ? 0 : this.state.variationStockQunatity == 0 ? (showSelectStatus == true && showSelectedProduct) ? this.state.variationDefaultQunatity : 0 : this.state.variationDefaultQunatity : ''} onChange={this.handleChange.bind(this)} />
                                    <div className="input-group-prepend">
                                        <button onClick={() => this.incrementDefaultQuantity()} className="btn p-0 shadow-none pointer inc btnincdec" type="button">
                                            <img src="../mobileAssets/img/plus.png" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form> */}


                                <div className="container-fuild">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            {getVariationProductData ?
                                                getVariationProductData.Type !== 'variable' ?
                                                    <div className="variation-list p-3 fz-14" >
                                                        {LocalizedLanguage.noAvailable}
                                                    </div>
                                                    :
                                                    <ProductAtrribute showSelectedProduct={showSelectStatus == true ? showSelectedProduct : ''}
                                                        attribute={hasVariationProductData ? getVariationProductData.ProductAttributes : null}
                                                        optionClick={this.optionClick} filteredAttribute={this.state.filteredAttribute}
                                                        selectedAttribute={this.state.selectedAttribute} productVariations={this.props.getVariationProductData ? this.props.getVariationProductData.Variations : []}
                                                        selectedOptionCode={selectedOptionCode}
                                                        selectedOptions={this.state.selectedOptions} />
                                                : null}
                                        </div>
                                    </div>
                                </div> {/* container fluid end*/}
                            </div> {/* above blank div end*/}


                            <div className="cartFooter position-relative">
                                <table className="table mb-0 table-verticle-middle cartCalculatetbl">
                                    <thead>
                                        <tr>
                                            <th className="border-bottom-0 text-center" onClick={() => this.decrementDefaultQuantity()}>
                                                <img src="../mobileAssets/img/minus-dark.svg" width="20" alt="" />
                                            </th>
                                            <td colSpan="2" className="text-center">
                                                {/* <span > */}
                                                <input id="qualityUpdater" type="text" className="form-control border-0 shadow-none text-center h-40" name="qualityUpdater" value={hasVariationProductData ? this.state.variationStockQunatity == 'outofstock' ? 0 : this.state.variationStockQunatity == 0 ? (showSelectStatus == true && showSelectedProduct) ? this.state.variationDefaultQunatity : 0 : this.state.variationDefaultQunatity : ''} onChange={this.handleChange.bind(this)} />
                                                {/* </span> */}
                                            </td>
                                            <td className="text-info text-center" onClick={() => this.incrementDefaultQuantity()}>
                                                <img src="../mobileAssets/img/plus-dark.svg" alt="" width="20" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th colSpan="2" className="border-bottom-0">{LocalizedLanguage.inventory}</th>
                                            <td colSpan="2" align="right" className="text-info" >
                                                {(showSelectStatus == true && showSelectedProduct) ?
                                                    <p className="m-0 fz-18" id="txtInScock"> {(showSelectedProduct.StockStatus == null || showSelectedProduct.StockStatus == 'instock') && showSelectedProduct.ManagingStock == false ? LocalizedLanguage.unlimited : showSelectedProduct.StockQuantity - showSelectedProduct.quantity}</p>
                                                    :
                                                    <p className="m-0 fz-18" id="txtInScock"> {this.props.getQuantity ? this.props.getQuantity : variation_single_data ? (variation_single_data.StockStatus == null || variation_single_data.StockStatus == 'instock') && variation_single_data.ManagingStock == false ? LocalizedLanguage.unlimited : hasVariationProductData ? this.state.variationStockQunatity != 'Unlimited' ? this.state.variationStockQunatity : this.state.variationStockQunatity : 1 : hasVariationProductData ? this.state.variationStockQunatity != 'Unlimited' ? this.state.variationStockQunatity : this.state.variationStockQunatity : 1}</p>

                                                }

                                            </td>
                                        </tr>
                                        <tr>
                                            <th colSpan="2" className="border-bottom-0">Sub-total</th>
                                            <td colSpan="2" align="right">
                                                {

                                                    variation_single_data == null ?
                                                        // simple price start 
                                                        variationfound && variationfound.discount_amount ?
                                                            parseFloat(variationfound.old_price).toFixed(2)

                                                            :
                                                            (getVariationProductData && (typeof getVariationProductData.discount_amount !== 'undefined') && getVariationProductData.discount_amount !== 0) ?
                                                                parseFloat(getVariationProductData.old_price).toFixed(2)
                                                                :
                                                                (showSelectStatus == true && showSelectedProduct) ? showSelectedProduct.discount_amount !== 0 ?
                                                                    parseFloat(showSelectedProduct.old_price).toFixed(2)
                                                                    :
                                                                    parseFloat(showSelectedProduct.old_price).toFixed(2)
                                                                    :
                                                                    parseFloat(hasVariationProductData ? this.state.variationPrice > 0 ? this.state.variationPrice : 0 : 0).toFixed(2)

                                                        :
                                                        variation_single_data !== null && variation_single_data.discount_amount == 0 ?
                                                            parseFloat(hasVariationProductData ? this.state.variationPrice > 0 ? this.state.variationPrice : 0 : 0).toFixed(2)
                                                            :
                                                            parseFloat(variation_single_data.Price).toFixed(2)

                                                }

                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="border-bottom-0">{typeOfTax() == "incl" ? LocalizedLanguage.inclTax : LocalizedLanguage.exclTax}:</th>
                                            <td className="border-right" align="right">
                                                <button className="btn btn-link appHeaderPgbutton" data-toggle="modal"
                                                    data-target="#applyTax">
                                                     <NumberFormat value={tax_is && tax_is.excl_tax && tax_is.excl_tax !== 0 ? RoundAmount(tax_is.excl_tax) : tax_is && tax_is.incl_tax ? RoundAmount(tax_is.incl_tax) : 0.00} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                </button>

                                            </td>
                                            <th className="border-bottom-0"> {LocalizedLanguage.discount}:</th>
                                            <td align="right">0.00</td>
                                        </tr>
                                    </thead>
                                </table>
                            </div>




                        </div>
                    </div>

                    <div className={isDemoUser == true || isDemoUser == 'true' ? 'appcheckBoardingFooter' : ''}>
                        <div className="appBottomAbove">
                            <button onClick={getVariationProductData ?
                                getVariationProductData.Type !== 'variable' ? this.addSimpleProducttoCart.bind(this) : this.addVariationProductToCart.bind(this) : null} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase"> {this.props.showSelectedProduct ? LocalizedLanguage.cartUpdate : LocalizedLanguage.addToCart}</button>
                        </div>
                        <Footer {...this.props} active="/shopview" />
                    </div>
                </div>
        )
    }
}
function mapStateToProps(state) {
    const { categorylist, productlist, attributelist, single_product, get_single_inventory_quantity, showSelectedProduct } = state;
    return {
        categorylist: categorylist,
        productlist: productlist,
        attributelist: attributelist,
        single_product: single_product.items,
        get_single_inventory_quantity: get_single_inventory_quantity.items,
        showSelectedProduct: showSelectedProduct.items
    };
}
const connectedProductDetailModal = connect(mapStateToProps)(ProductDetailModal);
export { connectedProductDetailModal as ProductDetailModal };
