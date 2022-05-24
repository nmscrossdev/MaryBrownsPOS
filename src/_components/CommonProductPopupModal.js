import React from 'react';
import { connect } from 'react-redux';
import { ProductAtrribute, CommonModuleJS, getVariatioModalProduct, cartPriceWithTax, getSettingCase, typeOfTax } from './';
import { cartProductActions } from '../_actions';
import { Markup } from 'interweave';
import { default as NumberFormat } from 'react-number-format';
import { LoadingModal } from './'
import Permissions from '../settings/Permissions';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { androidDisplayScreen } from '../settings/AndroidIOSConnect';
import { isMobileOnly } from 'react-device-detect';
import { RoundAmount } from './TaxSetting';
import { AppMenuList } from "../_components/AppmenuList";
import KeyAppsDisplay from '../settings/KeyAppsDisplay';
import ActiveUser from '../settings/ActiveUser';
import { history } from '../_helpers';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import $ from 'jquery';
import SelfCheckoutVariatonPopup from '../SelfCheckout/components/selfcheckoutVariatonpopup';
import RecommendedProduct from '../SelfCheckout/components/RecommendedProduct'
import { getProductSummery } from '../WrapperSettings/CommonWork';
import { allProductActions } from '../_actions';
import Navbar from '../SelfCheckout/components/Navbar';
import {_key} from '../settings/SelfCheckoutSettings';
Permissions.updatePermissions();
class CommonProductPopupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            variationStockQunatity: '',
            variationTitle: '',
            Sku: '',
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
            TaxClass: '',
            isFetchWarehouseQty: true,
            isAttributeDelete: false,
            //compositeProductActive:false
            isRefereshIconInventory: false    // Syn icon inventory state
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
            Sku: '',
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
    //------------------------------------------------
    /*Updated by- Aman Singhai, Updated date- 13/08/2020. Description- Added condition, when no attributes selected*/
    addVariationProductToCart() {
        var filterLength = this.state.filterTerms && this.state.filterTerms.length;
        var productAttributsWithVariation = [];
        productAttributsWithVariation = this.props.getVariationProductData.ProductAttributes && this.props.getVariationProductData.ProductAttributes.filter(item => item.Variation == true);
        // var productAttributeLength = this.props.getVariationProductData && this.props.getVariationProductData.ProductAttributes && this.props.getVariationProductData.ProductAttributes.length;
        if ((!this.props.showSelectedProduct && filterLength !== productAttributsWithVariation.length)
            || (this.props.getVariationProductData.Type == 'variable' && productAttributsWithVariation.length == 0) || (this.state.isAttributeDelete == false)) {
            if (ActiveUser.key.isSelfcheckout == true) {
                showModal('popupDisplayMessage');
            }
            showModal('popupDisplayMessage');
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
                    if (this.state.variationfound && this.state.variationfound.ParentId !== null && prdId.product_id === this.state.variationfound.ParentId && prdId.variation_id === this.state.variationfound.WPID) {
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
                    if (this.state.variationfound && prdId.product_id == this.state.variationfound.ParentId && prdId.variation_id == this.state.variationfound.WPID) {
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
            var _variationid = null;
            if (this.state.variationfound && this.state.variationfound.WPID !== null) {
                _variationid = this.state.variationfound.WPID;
            }

            var getVeriation = this.state.getVariationProductData.Variations.find(function (element) {
                return element.WPID == _variationid
            });

            /* ADDING PRODUCT SUMMARY (ATTRIBUTES) HERE 09FEB2022 */
            var psummary = ""
            if (productAttributsWithVariation && getVeriation) {
                psummary = getProductSummery(productAttributsWithVariation, getVeriation);
            }

            if (getVeriation) {
                this.state.variationfound["Price"] = getVeriation.Price;
                this.state.variationfound["Sku"] = getVeriation.Sku;

            }
            //---------------------------------------------------------------
            data = {
                line_item_id: this.state.variationfound && this.state.variationfound.line_item_id ? this.state.variationfound.line_item_id : 0,
                quantity: this.state.variationDefaultQunatity,
                Title: this.state.variationfound && this.state.variationfound.Title && this.state.variationfound.Title != "" ? this.state.variationfound.Title : this.state.variationfound ? this.state.variationfound.Sku : '',
                Sku: this.state.variationfound && this.state.variationfound.Sku && this.state.variationfound.Sku != "" ? this.state.variationfound.Sku : '',

                Price: this.state.variationfound && this.state.variationfound.Price ? parseInt(this.state.variationDefaultQunatity) * this.state.variationfound.Price : parseInt(this.state.variationDefaultQunatity) * price,
                product_id: this.state.variationfound && this.state.variationfound.ParentId ? this.state.variationfound.ParentId : null,
                variation_id: this.state.variationfound && this.state.variationfound.WPID ? this.state.variationfound.WPID : null,
                isTaxable: this.state.variationIsTaxable,
                old_price: this.state.variationfound ? this.state.variationfound.old_price ? this.state.variationfound.old_price : this.state.old_price : 0,
                incl_tax: this.state.variationfound && this.state.variationfound.incl_tax ? this.state.variationfound.incl_tax : this.state.incl_tax,
                excl_tax: this.state.variationfound && this.state.variationfound.excl_tax ? this.state.variationfound.excl_tax : this.state.excl_tax,
                ticket_status: this.state.ticket_status,
                product_ticket: this.state.ticket_status == true ? ticket_Data ? ticket_Data : '' : '',
                tick_event_id: this.state.ticket_status == true ? tick_data._event_name : null,
                cart_after_discount: this.state.variationfound && this.state.variationfound.cart_after_discount ? this.state.variationfound.cart_after_discount : 0,
                cart_discount_amount: this.state.variationfound && this.state.variationfound.cart_discount_amount ? this.state.variationfound.cart_discount_amount : 0,
                // after_discount: this.state.variationfound &&  this.state.variationfound.after_discount ? this.state.variationfound.after_discount : 0,

                // single_product.discount_type.toLowerCase()=="number" ?
                after_discount: single_product ?
                    single_product.discount_type.toLowerCase() == "number" ?
                        (single_product.old_price * this.state.variationDefaultQunatity) - single_product.product_discount_amount - (single_product.incl_tax ? single_product.incl_tax : single_product.excl_tax ? single_product.excl_tax : 0)
                        : single_product.after_discount
                    : 0,

                discount_amount: this.state.variationfound && this.state.variationfound.discount_amount ? this.state.variationfound.discount_amount : 0,
                product_after_discount: this.state.variationfound && this.state.variationfound.product_after_discount ? this.state.variationfound.product_after_discount : 0,
                product_discount_amount: this.state.variationfound && this.state.variationfound.product_discount_amount ? this.state.variationfound.product_discount_amount : 0,
                discount_type: this.state.variationfound && this.state.variationfound.discount_type ? this.state.variationfound.discount_type : "",
                new_product_discount_amount: this.state.variationfound && this.state.variationfound.new_product_discount_amount ? this.state.variationfound.new_product_discount_amount : 0,
                TaxStatus: this.state.TaxStatus,
                tcForSeating: this.state.tcForSeating,
                TaxClass: this.state.variationfound ? this.state.variationfound.TaxClass : this.state.TaxClass,
                psummary: psummary
            }
            var qty = 0;
            var product = this.state.getVariationProductData
            var variationfound = this.state.variationfound;
            var variationQantity = null;
            if (variationfound !== null) {
                variationQantity = (variationfound.StockStatus == "outofstock") ? "outofstock" :
                    (variationfound.StockStatus == null || variationfound.StockStatus == 'instock') && variationfound.ManagingStock == false ? "Unlimited" : (typeof variationfound.StockQuantity != 'undefined') && variationfound.StockQuantity != '' ? variationfound.StockQuantity - qty : '0'
            }
            var cartItemList = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            qty = qty + this.state.variationDefaultQunatity;
            var txtPrdQuantity = document.getElementById("qualityUpdater").value;
            if (parseInt(txtPrdQuantity) <= 0) {
                /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
                this.props.msg(LocalizedLanguage.productQty)
                // $('#common_msg_popup').modal('show')
                showModal('common_msg_popup');
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
                            if (showSelectedProduct['selectedIndex'] >= 0) {
                                _index = parseInt(showSelectedProduct.selectedIndex)
                            }
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
                var _variationProductdate = this.props.getVariationProductData;
                _variationProductdate = this.updateActualStockQty(_variationProductdate);
                this.setState({
                    variationTitle: this.props.getVariationProductData.Title && this.props.getVariationProductData.Title != "" ? this.props.getVariationProductData.Title : this.props.getVariationProductData.Sku,
                    Sku: this.props.getVariationProductData.Sku ? this.props.getVariationProductData.Sku : "",
                    variationId: this.props.getVariationProductData.WPID,
                    variationParentId: this.props.getVariationProductData.ParentId,
                    variationPrice: this.props.getVariationProductData.Price,
                    variationStockQunatity: _variationProductdate ? (_variationProductdate.StockStatus == null || _variationProductdate.StockStatus == 'instock') && _variationProductdate.ManagingStock == false ? "Unlimited" : _variationProductdate.StockQuantity : '0',
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
                hideModal('VariationPopUp');
                //$('#VariationPopUp').modal('hide')
                if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                    hideModal('VariationPopUp');
                    // $('#VariationPopUp').modal('hide')
                }
                else if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                    window.location = '/shopview';
                }
            } else {
                if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                    window.location = '/shopview';
                }
                // $('#VariationPopUp').modal('hide')
                hideModal('VariationPopUp');
                this.props.msg('Product is out of stock.');
                //$('#common_msg_popup').modal('show');
                showModal('common_msg_popup');

            }
            this.setState({ variationDefaultQunatity: 1 })
            // $('#VariationPopUp').modal('hide')
            hideModal('VariationPopUp');
            if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                window.location = '/shopview';
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
            // SingleProduct.discount_type.toLowerCase()=="number" ?
            after_discount: SingleProduct ?
                SingleProduct.discount_type.toLowerCase() == "number" ?
                    (SingleProduct.old_price * this.state.variationDefaultQunatity) - SingleProduct.product_discount_amount - (SingleProduct.incl_tax ? SingleProduct.incl_tax : SingleProduct.excl_tax ? SingleProduct.excl_tax : 0)
                    : SingleProduct.after_discount
                : 0,
            discount_amount: SingleProduct ? SingleProduct.discount_amount : 0,
            product_after_discount: SingleProduct ? SingleProduct.product_after_discount : 0,
            product_discount_amount: SingleProduct ? SingleProduct.product_discount_amount : 0,
            quantity: productx_qty > 0 ? productx_qty : this.state.variationDefaultQunatity,
            Title: this.state.variationTitle,
            Price: productx_qty > 0 ? parseInt(productx_qty) * parseFloat(this.state.variationPrice) : parseInt(this.state.variationDefaultQunatity) * parseFloat(this.state.variationPrice),
            product_id: this.state.getVariationProductData && this.state.getVariationProductData.WPID ? this.state.getVariationProductData.WPID : this.state.getVariationProductData && this.state.getVariationProductData.product_id ? this.state.getVariationProductData.product_id : 0,
            variation_id: 0,
            isTaxable: this.state.variationIsTaxable ? this.state.variationIsTaxable : this.state.getVariationProductData.Taxable,
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
            ticket_info: this.state.getVariationProductData && this.state.getVariationProductData.ticket_info ? this.state.getVariationProductData.ticket_info : [],
            Sku: this.state.Sku
        }
        var product = this.state.getVariationProductData
        var qty = 0;
        cartlist.map(item => {
            if (product.WPID === item.product_id) {
                qty = item.quantity;
            }
        })
        var qytt = document.getElementById("qualityUpdater") ? document.getElementById("qualityUpdater").value : this.props.variationDefaultQunatity;
        var txtPrdQuantity = (productx_qty > 0) ? productx_qty : qytt
        if (parseInt(txtPrdQuantity) <= 0) {
            /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
            this.props.msg(LocalizedLanguage.productQty)
            //$('#common_msg_popup').modal('show')
            showModal('common_msg_popup');
            return;
        }
        // if (((product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false) || ((product.StockStatus == null || product.StockStatus == 'instock') &&
        //     product.ManagingStock == true && qty <= product.StockQuantity)) {
        //    console.log("qty",qty,"this.state.variationStockQunatity",this.state.variationStockQunatity)
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
                hideModal('VariationPopUp');
                //$('#VariationPopUp').modal('hide');
            }

            if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                // window.location = '/shopview';
                history.push('/shopview');
            }
        } else {
            if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                history.push('/shopview');
            }
            //$('#VariationPopUp').modal('hide');
            hideModal('VariationPopUp');
            this.props.msg('Product is out of stock.');
            //$('#common_msg_popup').modal('show');
            showModal('common_msg_popup');
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
        //  this.setState({variationStockQunatity:this.state.variationStockQunatity == 'Unlimited'?this.state.variationStockQunatity:this.props.getVariationProductData.StockQuantity - qty })
        var _variationData = this.props.getVariationProductData;
        _variationData = this.updateActualStockQty(_variationData)
        this.setState({
            variationStockQunatity: _variationData ?
                (_variationData.StockStatus == null || _variationData.StockStatus == 'instock') && _variationData.ManagingStock == false ? "Unlimited" : (typeof _variationData.StockQuantity != 'undefined') && _variationData.StockQuantity != '' ? _variationData.StockQuantity - qty : '0' : '0',
            variationDefaultQunatity: 1
        })
    }

    componentWillMount = props => {
        this.clickTimeout = null
        this.setState({ filterTerms: [] })
    }

    componentDidMount() {
        KeyAppsDisplay.DisplayApps(["print_label"]);
        setTimeout(() => {
            $(".button_with_checkbox input").prop("checked", false);
        }, 300);

    }
    showSelected=(item)=>
    {
        this.props.dispatch(cartProductActions.showSelectedProduct(item));
    }

    /**
     * Created By: Shakuntala Jatav
     * Created Date : 11-02-2020
     * Description : get extensionReady event for hide header and footer through the post message 
     */
    sendMessageToComposite = (_jsonMsg) => {
        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
        //this.setState({compositeProductActive:true})
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
        // $('#VariationPopUp').modal('hide');
        hideModal('VariationPopUp');
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
            //this.setState({compositeProductActive:false})
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
                    item && item.combination !== null && item.combination !== undefined && item.combination.split("~").map(combination => {
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

        var found = null;
        if (attribute_list !== null && attribute_list !== undefined) {
            found = attribute_list.find(function (element) {
                return element.Code.toLowerCase() == attribute.toLowerCase()
            })
        }
        if (found !== null && found !== undefined) {
            sub_attribute = found.SubAttributes && found.SubAttributes.find(function (element) {
                return element.Value.toLowerCase() == option.toLowerCase()
            })
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
            if (attribute_list && attribute_list != undefined && attribute_list.length > 0) {
                var found = attribute_list && attribute_list.find(function (element) {
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
                if (element && element !== undefined && element.combination && element.combination !== undefined && element.combination.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase() === comb.replace(/\s/g, '-').replace(/\//g, "-").toLowerCase()) {
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
                        var arrComb = element && element !== undefined && element.combination !== null && element.combination !== undefined && element.combination.split('~');
                        if (arrComb && arrComb.length > 0) {
                            var combinationAtindex = arrComb[filterattr.index];
                            if (combinationAtindex.toLowerCase() === filterattr.option.toLowerCase() || combinationAtindex == '**')  //variation exist for option to be displayed
                            {
                                checkExist.push('match');
                            } else {
                                checkExist.push('mismatch');
                            }
                        }
                    })
                    if (!checkExist.includes("mismatch")) {
                        return element;
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
                                    if (combinationAtindex.toLowerCase() === filterattr.option.toLowerCase() || combinationAtindex == '**')  //variation exist for option to be displayed
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
            if (found && this.props.single_product && found.WPID !== this.props.single_product.WPID) {
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
            // if(found){
            //     var _addTaxFoundData = getVariatioModalProduct(found, selectedDefaultQty !== 0 ? selectedDefaultQty : 1);
            //     console.log("_addTaxFoundData", _addTaxFoundData);
            // }
            if (found) { found = this.updateActualStockQty(found); }

            this.setState({
                variationTitle: found.Title && found.Title != "" ? found.Title : found.Sku,
                Sku: found.Sku && found.Sku != "" ? found.Sku : '',
                variationId: found && found.WPID,
                variationParentId: found && found.ParentId,
                variationPrice: found.Price,
                variationStockQunatity: (found.ManagingStock == true && found.StockStatus == "outofstock") ? "outofstock" : (found.StockStatus == null || found.StockStatus == 'instock') && found.ManagingStock == false ? "Unlimited" : found.StockQuantity - qty,
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
            var _attribute = getVariationProductData.ProductAttributes.filter(item => item.Variation == true)
            if (found && _fileterTerm.length == _attribute.length && found.ManagingStock == true) {
                this.setState({ isFetchWarehouseQty: true, isRefereshIconInventory: true })
                this.props.dispatch(allProductActions.productWarehouseQuantity(found.WPID));
            }
            if (found.ManagingStock == false) {  //check the product managing stock is false then we are not calling the productWarehouseQuantity api
                this.state.isAttributeDelete = true;
                this.setState({ isRefereshIconInventory: false })
            }
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
                        var _variatopndata = nextPros.getVariationProductData;
                        qty = item.quantity;
                        this.setState({
                            variationStockQunatity: _variatopndata ?
                                (_variatopndata.StockStatus == null || _variatopndata.StockStatus == 'instock') && _variatopndata.ManagingStock == false ? "Unlimited"
                                    : (typeof _variatopndata.StockQuantity != 'undefined') && _variatopndata.StockQuantity != '' ? _variatopndata.StockQuantity - qty : '0' : '0'
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
        if (nextPros.getVariationProductData) {
            this.setState({
                isTaxable: nextPros.getVariationProductData.Taxable,
                getVariationProductData: nextPros.getVariationProductData,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.state.showQantity == true ? this.state.variationTitle : nextPros.getVariationProductData ? nextPros.getVariationProductData.Title && nextPros.getVariationProductData.Title != "" ? nextPros.getVariationProductData.Title : nextPros.getVariationProductData.Sku : '',
                Sku: this.state.showQantity == true ? this.state.Sku : nextPros.getVariationProductData ? nextPros.getVariationProductData.Sku && nextPros.getVariationProductData.Sku != "" ? nextPros.getVariationProductData.Sku : '' : '',
                variationId: 0,
                variationPrice: this.state.showQantity == true ? this.state.variationPrice : nextPros.getVariationProductData ? nextPros.getVariationProductData.Price : 0,
                variationStockQunatity: this.state.showQantity == true ? this.state.variationStockQunatity :
                    (nextPros.getVariationProductData.ManagingStock == true && nextPros.getVariationProductData.StockStatus == "outofstock") ? "outofstock" :
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

        if (nextPros.get_single_inventory_quantity && this.state.showQantity == false) {
            if (nextPros.getVariationProductData && nextPros.getVariationProductData.Type == "variable") {
                var FindItems = nextPros.getVariationProductData.Variations.find(item => item.WPID === nextPros.get_single_inventory_quantity.wpid)
                if (!FindItems) {//if varistion not found then assign the parent product
                    FindItems = nextPros.getVariationProductData
                }
                // nextPros.getVariationProductData && nextPros.getVariationProductData.Variations && nextPros.getVariationProductData.Variations.map(updateItem => {
                if (FindItems) {
                    if (FindItems.WPID == nextPros.get_single_inventory_quantity.wpid) {
                        FindItems['StockQuantity'] = nextPros.get_single_inventory_quantity.quantity;
                        this.state.variationStockQunatity = nextPros.get_single_inventory_quantity.quantity;
                        this.state.showQantity = true
                        this.setState({ showQantity: true })
                    }
                }
                //})

                var varProductId = nextPros.getVariationProductData.WPID;
                if (varProductId == nextPros.get_single_inventory_quantity.wpid) {
                    nextPros.getVariationProductData['StockQuantity'] = nextPros.get_single_inventory_quantity.quantity;
                    this.state.variationStockQunatity = nextPros.get_single_inventory_quantity.quantity;
                    this.state.showQantity = true
                    this.setState({ showQantity: true })
                }
                if (this.state.showQantity == true) {
                    var FindItems = nextPros.getVariationProductData.Variations.find(item => item.WPID === nextPros.get_single_inventory_quantity.wpid)
                    if (!FindItems) {//if varistion not found then assign the parent product
                        FindItems = nextPros.getVariationProductData
                    }
                    this.state.variationTitle = (FindItems && FindItems.Title && FindItems.Title != "") ? FindItems.Title : FindItems && FindItems.Sku ? FindItems.Sku : "";
                    this.state.Sku = FindItems && FindItems.Sku ? FindItems.Sku : "";
                    this.state.variationImage = FindItems && FindItems.ProductImage ? FindItems.ProductImage : '';
                    this.state.variationPrice = FindItems && FindItems.Price ? FindItems.Price : '';
                    this.state.old_price = FindItems && FindItems.old_price ? FindItems.old_price : '';
                    this.state.ManagingStock = FindItems && FindItems.ManagingStock ? FindItems.ManagingStock : '';
                    if (FindItems && FindItems.ParentId !== 0) {
                        this.state.variationfound = FindItems ? FindItems : '';
                    }
                    this.state.variationStockQunatity = nextPros.get_single_inventory_quantity.quantity
                    this.setState({
                        variationTitle: FindItems && FindItems.Title && FindItems.Title != "" ? FindItems.Title : FindItems && FindItems.Sku ? FindItems.Sku : '',
                        Sku: FindItems && FindItems.Sku ? FindItems.Sku : "",
                        variationImage: FindItems && FindItems.ProductImage ? FindItems.ProductImage : '',
                        variationPrice: FindItems && FindItems.Price ? FindItems.Price : '',
                        old_price: FindItems && FindItems.old_price ? FindItems.old_price : '',
                        ManagingStock: FindItems && FindItems.ManagingStock ? FindItems.ManagingStock : '',
                        // variationfound: FindItems ? FindItems : '',
                        variationStockQunatity: nextPros.get_single_inventory_quantity.quantity
                    })
                }
            } else {
                if (nextPros.getVariationProductData && nextPros.getVariationProductData.WPID == nextPros.get_single_inventory_quantity.wpid) {
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
        // set response of the warehose inventory API
        if (this.state.isFetchWarehouseQty == true && nextPros.productWarehouseQuantity && nextPros.productWarehouseQuantity.detail && nextPros.productWarehouseQuantity.detail.is_success == true) {
            this.state.isAttributeDelete = true;
            if (nextPros.productWarehouseQuantity.detail.content.length > 0) {
                var warehouseID = localStorage.getItem("WarehouseId");
                nextPros.productWarehouseQuantity.detail.content.map(item => {
                    if (warehouseID == item.warehouseId) {
                        this.setState({ variationStockQunatity: item.Quantity, isFetchWarehouseQty: false, isRefereshIconInventory: false })
                    }
                })
                this.state.isFetchWarehouseQty = false;
            }
        } else if (this.state.isFetchWarehouseQty == true && nextPros.productWarehouseQuantity && nextPros.productWarehouseQuantity.detail && nextPros.productWarehouseQuantity.detail.is_success == false) {
            this.state.isAttributeDelete = false;
            var faildMsg = nextPros.productWarehouseQuantity && nextPros.productWarehouseQuantity.detail.message;
            this.props.msg(faildMsg);
            showModal('common_msg_popup')
            this.state.isFetchWarehouseQty = false;
            this.setState({ isRefereshIconInventory: false })
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
        this.state.isRefereshIconInventory = false;
        $(".button_with_checkbox input").prop("checked", false);
        this.props.productData(false);
        //this.props.handleSimpleProduct(false);
        if (this.props.getVariationProductData) {
            this.setState({
                showSelectStatus: false,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.props.getVariationProductData ? this.props.getVariationProductData.Title : '',
                Sku: this.props.getVariationProductData ? this.props.getVariationProductData.Sku : '',
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
        hideModal("VariationPopUp");
    }
    handleNote() {
        var txtNote = jQuery("#prodNote").val();
        if (txtNote != "") {
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
            cartlist = cartlist == null ? [] : cartlist;
            cartlist.push({ "Title": txtNote })
            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                //location.reload();

            }
         hideModal("add-note");
         hideOverlay("overlay-cover");
        }
    }
    // Apply discount for selected product
    /**
     * Updated By :Shakuntala Jatav
     * Updated Date :26-feb-2020
     * @param {*} item 
     * Description : Update permission function for discount popup 
     */
    discountModal(item) {
        // if (Permissions.key.allowDiscount == false) {
        if (CommonModuleJS.permissionsForDiscount() == false) {
            this.props.msg(LocalizedLanguage.discountPermissionerror);
            // $('#common_msg_popup').modal('show');
            showModal('common_msg_popup')
        } else {
            jQuery('#textDis').val(0)
            localStorage.removeItem("PRODUCT")
            localStorage.removeItem("SINGLE_PRODUCT")
            var VarSingleData = null;
            if (item && item.Type == "variable") {
                if (this.state.variationfound && this.state.variationfound.WPID !== null) {
                    VarSingleData = item.Variations.filter(items => items.WPID == this.state.variationfound.WPID);
                }
            }
            if (item && item.Type == "variable") {
                showModal('single_popup_discount')
                //  $('#single_popup_discount').modal('show')
            } else {
                showModal('single_popup_discount')
                //  $('#single_popup_discount').modal('show')
            }
            var data = {
                product: 'product',
                item: VarSingleData && VarSingleData.length > 0 ? VarSingleData[0] : item,
                id: VarSingleData && VarSingleData.length > 0 ? VarSingleData[0].WPID : item.WPID ? item.WPID : item.product_id,
            }
            this.props.dispatch(cartProductActions.selectedProductDis(data))
        }
    }

    showProductDetail() {
        // $('#displayproductdesciption').modal('show')
        showModal('displayproductdesciption');
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
            } else {
                VarSingleData = this.state.getVariationProductData; //For Variation product when no variation selected
            }
        } else {
            VarSingleData = item
        }
        this.props.inventoryData(VarSingleData);
        //$('#InventoryPopup').modal('show')
        showModal('InventoryPopup')
    }

    /**
     * Created By : Shakuntala jatav
     * Created date : 09-04-2020
     * Description : For clear selected attribute in variation popup
     */
    clearCheckedField() {
        $(".button_with_checkbox input").prop("checked", false);
        if (this.props.getVariationProductData) {
            this.setState({
                showSelectStatus: false,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.props.getVariationProductData ? this.props.getVariationProductData.Title : '',
                Sku: this.props.getVariationProductData ? this.props.getVariationProductData.Sku : '',
                variationId: 0,
                variationPrice: this.props.getVariationProductData ? this.props.getVariationProductData.Price : 0,
                variationImage: this.props.getVariationProductData ? this.props.getVariationProductData.ProductImage ? this.props.getVariationProductData.ProductImage : '' : '',
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

    /**
     * Created By : Aman Singhai
     * Created date : 12-08-2020
     * Description : For Opening popup
     */
    selectProductAttributePopup() {
        showModal('attributeselection')
    }

    render() {
        const { getVariationProductData, hasVariationProductData, single_product, showSelectedProduct, isInventoryUpdate } = this.props;
        //var idbKeyval = FetchIndexDB.fetchIndexDb();
        // if(getVariationProductData && getVariationProductData.Type== "simple"){
        //     idbKeyval.get('ProductList').then(val => {
        //         if (val && val != "" && val.length >= 0  ) {                
        //                 var found = val.find(function (indx) {
        //                     return indx.WPID==  getVariationProductData.WPID;
        //                 });
        //                 if(found){
        //                     if(this.state.variationStockQunatity !=="Unlimited"){
        //                     this.state.variationStockQunatity =found.StockQuantity;
        //                     }
        //                 }
        //         }
        //     });
        // }

        const { variationfound, showSelectStatus, selectedOptionCode, isFetchWarehouseQty, isAttributeDelete } = this.state;
        const isNotProductX = getVariationProductData ? (getVariationProductData.Type == "variable" || getVariationProductData.Type == "simple") ? true : false : "";
        var HostUrl = (isNotProductX == false) ? getVariationProductData && getVariationProductData.ParamLink : "";
        //HostUrl ="";
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
        var tax_is = getVariationProductData && getVariatioModalProduct(single_product ? single_product : variationfound ? variationfound : getVariationProductData, this.state.variationDefaultQunatity);
        var after_discount_total_price = tax_is && tax_is.product_discount_amount ?
            tax_is.product_discount_amount * (tax_is.discount_type != "Number" ? tax_is.quantity ? tax_is.quantity : this.state.variationDefaultQunatity : 1) : 0;
        var product_price = getSettingCase() == 2 || getSettingCase() == 4 || getSettingCase() == 7 ? tax_is && cartPriceWithTax(tax_is.old_price, getSettingCase(), tax_is.TaxClass) : getSettingCase() == 6 ? tax_is && tax_is.old_price : tax_is && tax_is.old_price;
        var _Inventory = this.props.getQuantity ? this.props.getQuantity : variation_single_data ? (variation_single_data.StockStatus == null || variation_single_data.StockStatus == 'instock') && variation_single_data.ManagingStock == false ? LocalizedLanguage.unlimited : hasVariationProductData ? this.state.variationStockQunatity != 'Unlimited' ? this.state.variationStockQunatity : this.state.variationStockQunatity : 1 : hasVariationProductData ? this.state.variationStockQunatity != 'Unlimited' ? this.state.variationStockQunatity : this.state.variationStockQunatity : 1;
        var _IsUpdateInventory = localStorage.getItem('user') ?
            (JSON.parse(localStorage.getItem('user')).CanManageInventory == false) || ((this.state.variationStockQunatity && (this.state.variationStockQunatity == 'Unlimited') || (this.state.variationStockQunatity == 'outofstock')) || (showSelectedProduct && showSelectStatus == true && showSelectedProduct.ManagingStock == false)) ? false : true
            : false;

        var filterLength = this.state.filterTerms && this.state.filterTerms.length;
        var productAttributsWithVariation = [];
        productAttributsWithVariation = this.props.getVariationProductData && this.props.getVariationProductData !== null && this.props.getVariationProductData.ProductAttributes && this.props.getVariationProductData.ProductAttributes.filter(item => item.Variation == true);


        var AddtocartDisabled = productAttributsWithVariation && productAttributsWithVariation !== null && productAttributsWithVariation.length !== 0 ? true : false;
        if (isAttributeDelete == true && productAttributsWithVariation && (filterLength !== 0 && filterLength == productAttributsWithVariation.length)) {
            AddtocartDisabled = false;
        }

        return (
            <div className= "popup hide productPopup" id="VariationPopUp">
                 {HostUrl == "" ?<Navbar msg={this.props.msg} showExtensionIframe={this.props.showExtensionIframe} itemCount={this.props.itemCount} page={_key.PRODUCT_PAGE} catName={null} catPName={null} GoBackhandleClick={null}></Navbar>:null}
                {/* <div className="modal-dialog modal-center-block"> */}
                    {HostUrl !== "" ?
                        <React.Fragment>
                            <div className="product-container">
                                {/* <h5 className="modal-title" id="modalLargeLabel" title={(variation_single_data ? variation_single_data.Title.replace(" - ", "-") : SelectedTitle)}>
                                    {hasVariationProductData ? 
                                    // <Markup content=
                                    // {
                                        (variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)
                                    // }
                                    // ></Markup>
                                    : ''}
                                </h5> */}
                                {/* <button type="button" className="popup-close" onClick={() => this.handleClose()}>
                                    <span aria-hidden="true">
                                        <img src="assets/img/ic_circle_delete.svg" />
                                    </span>
                                </button> */}
                                {/* <div id="productCloseButton" className="product-close"> */}
                            <svg className="product-close" onClick={()=>this.handleClose()} 
                                width="22"
                                height="21"
                                viewBox="0 0 22 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19.0466 21L10.7521 12.9L2.45762 21L0 18.6L8.29448 10.5L0 2.4L2.45762 0L10.7521 8.1L19.0466 0L21.5042 2.4L13.2097 10.5L21.5042 18.6L19.0466 21Z"
                                    fill="#050505"
                                />
                            </svg>
                            <div className="popup-header" style={{marginBottom:"2vw"}}>
                            <div className="col">
                                <p>{hasVariationProductData ? 
                                    (variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)
                                : ''}</p>
                                <div className="divider"></div>
                            </div>
                            </div>
                            {/* </div> */}
                            <div className="prod-wrapper">
                                <div className="row">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{height:"140vw",border:0}}
                                        sandbox="allow-scripts allow-same-origin allow-forms"
                                        //className="embed-responsive-item diamondSectionHeight"
                                        ref={(f) => this.ifr = f}
                                        src={HostUrl}
                                    />
                                </div>
                            </div> </div>
                     </React.Fragment>
                        :
                        <div className="product-container" style={{height:"93.5%"}}>

                <div id="productCloseButton" className="product-close">
				<svg onClick={()=>hideModal('VariationPopUp')} 
					width="22"
					height="21"
					viewBox="0 0 22 21"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M19.0466 21L10.7521 12.9L2.45762 21L0 18.6L8.29448 10.5L0 2.4L2.45762 0L10.7521 8.1L19.0466 0L21.5042 2.4L13.2097 10.5L21.5042 18.6L19.0466 21Z"
						fill="#050505"
					/>
				</svg>
			</div>
			<p className="prod-name" title={this.props.proTitle}>{hasVariationProductData ? <Markup content={(variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)}></Markup> : ''}</p>

                            {/* <div className="popup-header"> */}
                                {/* <div className="popup-icon">
                                    <svg width={22} height={21} viewBox="0 0 22 21" className="popup-close" onClick={()=>hideModal('VariationPopUp')}>
                                        <path d="M19.0466 21L10.7521 12.9L2.45762 21L0 18.6L8.29448 10.5L0 2.4L2.45762 0L10.7521 8.1L19.0466 0L21.5042 2.4L13.2097 10.5L21.5042 18.6L19.0466 21Z" fill="#050505" />
                                    </svg>
                                </div>
                                    <div className="prod-name" title={this.props.proTitle} >{hasVariationProductData ? <Markup content={(variation_single_data ? variation_single_data.Title ? variation_single_data.Title.replace(" - ", "-") : variation_single_data.Sku : SelectedTitle)}></Markup> : ''}</div> */}
                                    <div className="prod-wrapper">
                                    <div className="row">
                                        <div className="img-container">
                                            <img src={hasVariationProductData ? this.state.variationImage ? img == 'placeholder.png' ? '' : this.state.variationImage : '' : ''} onError={(e) => { e.target.onerror = null; e.target.src = "assets/img/placeholder.png" }} id="prdImg" className='scale'/>
                                        </div>
                                        <div className="col">
                                            <p className="prod-description">
                                                {getVariationProductData.ShortDescription}
                                            </p>
                                            <div className="inner-row">
                                                <div className="text-row">
                                                    <p className="price"><NumberFormat value={tax_is && RoundAmount(((product_price * this.state.variationDefaultQunatity) - after_discount_total_price) + (tax_is.excl_tax ? tax_is.excl_tax : 0))} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></p>
                                                    <p className="subtext">(plus tax)</p>
                                                </div>
                                                {/* <button type="button">Modify Ingredients</button> */}
                                            </div>
                                            <div className="increment-input">
                                                <div onClick={this.decrementDefaultQuantity} className="decrement">
                                                    <svg width={16} height={2} viewBox="0 0 16 2">
                                                        <rect width={16} height={2} fill="#758696" />
                                                    </svg>
                                                </div>
                                                <input id="qualityUpdater" type="number"  name="qualityUpdater" 
                                                        value={hasVariationProductData ? this.state.variationStockQunatity == 'outofstock' ? 0 : this.state.variationStockQunatity == 0 ? 
                                                        (showSelectStatus == true && showSelectedProduct) ? this.state.variationDefaultQunatity : 0 : this.state.variationDefaultQunatity 
                                                        : ''} onChange={this.handleChange.bind(this)} />

                                                <div onClick = {this.incrementDefaultQuantity} className="increment">
                                                    <svg className='checkout-increament-mr' width={16} height={16} viewBox="0 0 16 16">
                                                        <path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                    // getVariationProductData ? getVariationProductData.Type !== 'variable' ?
                                    //     <div className='attributesBottom'>
                                    //         <div>{LocalizedLanguage.noAvailable} </div>
                                    //     </div>
                                    //     :
                                        <div className="col">
                                            <ProductAtrribute showSelectedProduct={showSelectStatus == true ? showSelectedProduct : ''}
                                                attribute={hasVariationProductData ? getVariationProductData.ProductAttributes : null}
                                                optionClick={this.optionClick} filteredAttribute={this.state.filteredAttribute}
                                                selectedAttribute={this.state.selectedAttribute} productVariations=
                                                {this.props.getVariationProductData ? this.props.getVariationProductData.Variations : []}
                                                selectedOptionCode={selectedOptionCode}
                                                selectedOptions={this.state.selectedOptions} /></div>
                                        // : null
                                        }
                                <div className="col">
                                    <p className="center">Add a note to your order</p>
                                    <button type="button" id="addNote" onClick={()=>showModal("add-note")}>Add Note</button>
                                </div>
                            {/* </div> */}
                            </div>
                            <RecommendedProduct showSelected={this.showSelected} page={"product"} item={this.props.getVariationProductData} handleSimpleProduct={this.props.handleSimpleProduct} handleProductData={this.props.handleProductData}></RecommendedProduct>
                            <div className=''>
                                <button data-target="#popupDisplayMessage" data-toggle="modal"  onClick={this.props.getVariationProductData ? this.props.getVariationProductData.Type 
                                !== 'variable' ? this.addSimpleProducttoCart.bind(this) : this.addVariationProductToCart.bind(this) : null} className="view-cart" style={{width:"84.59vw"}}>{LocalizedLanguage.addToCart}</button>
                            </div>
                            <div style={{display:"none"}}>
                            { 
                                (showSelectStatus == true && showSelectedProduct) ?
                                    <span  id="txtInScock">{(showSelectedProduct.StockStatus == null || showSelectedProduct.StockStatus == 'instock') && showSelectedProduct.ManagingStock == false ? LocalizedLanguage.unlimited : showSelectedProduct.StockQuantity - showSelectedProduct.quantity}</span>
                                    :                                    
                                    <span id="txtInScock">{_Inventory}</span>   
                            }
                            </div>
                            <div className="overlay-cover hide"></div>
                                <div class="popup add-note hide" id="add-note">
                                    <svg class="popup-close" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={()=>hideModal("add-note")}>
                                    <path
                                    d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z"
                                    fill="#050505"
                                    />
                                    </svg>
                                    <div class="popup-header">
                                        <div class="col">
                                            <p>Add Product Note</p>
                                            <div class="divider"></div>
                                        </div>
                                    </div>
                                    <div class="popup-body">
                                        <p>Add a note or any comments for the product.</p>
                                        <textarea maxLength={100} name="productNote" id="prodNote" placeholder="Add your note here."></textarea>
                                        <button onClick={()=>this.handleNote()} >Add Note to item</button>
                                    </div>
                                </div>
                        </div>
                    }
                {/* </div> */}
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { categorylist, productlist, attributelist, single_product, get_single_inventory_quantity, showSelectedProduct, productWarehouseQuantity } = state;
    return {
        categorylist: categorylist,
        productlist: productlist,
        attributelist: attributelist,
        single_product: single_product.items,
        get_single_inventory_quantity: get_single_inventory_quantity.items,
        showSelectedProduct: showSelectedProduct.items,
        productWarehouseQuantity: productWarehouseQuantity
    };
}
const connectedCommonProductPopupModal = connect(mapStateToProps)(CommonProductPopupModal);
export { connectedCommonProductPopupModal as CommonProductPopupModal };
