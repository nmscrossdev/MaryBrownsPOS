import React from 'react';
import { connect } from 'react-redux';
import { allProductActions, idbProductActions } from '../_actions'
import { cartProductActions } from '../_actions/cartProduct.action'
import { default as NumberFormat } from 'react-number-format'
import { history } from '../_helpers';
import { Markup } from 'interweave';
import Config from '../Config'
import { getTaxAllProduct, CommonModuleJS } from './'
import moment from 'moment';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { androidDisplayScreen, AndroidExtentionFinished } from '../settings/AndroidIOSConnect';
import { isMobileOnly } from "react-device-detect";
import MobileAllProductList from './views/m.AllProuductList';
import ProductItemsView from '../SelfCheckout/components/ProductItemsView';
import SelfCheckoutTileViewModal from '../_components/views/m.selfcheckoutProductList';
import CommonProductPopupModal from '../_components';
import ActiveUser from '../settings/ActiveUser';
import { LoadingSmallModal } from './LoadingSmallModal'
import {typeOfTax} from '../_components/TaxSetting'
import { callProductXWindow, sendMessageToComposite, getCompositeAddedToCart, getCompositeSetProductxData } from '../_components/CommonFunctionProductX';
import {softkeyboardhandlingEvent} from '../WrapperSettings/CommonWork';
import { getSearchInputLength } from '../_components/CommonJS';
import $ from 'jquery';
class AllProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            isLoading: true,
            showVariationPopup: false,
            variationPopupQuantity: 1,
            cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
            product_List: [],
            ParentProductList: [],
            AllProduct: [],
            chunk_size: Config.key.PPRODUCT_PAGE_SIZE,
            pageNumber: 0,
            product_Array: [],
            productDisplayStatus: true,
            hideButton: false,
            search: '',
            totalRecords: 0,
            filteredProuctList: [],
            ticket_Product_status: false,
            variationTaxStatus: '', // updateby shakuntala jatav, date:03-06-2019 , description: tax is applicable for per items is yes or not.
            update_product_DB: false,
            incr: 1,
            productXQantity: 0,
            isProductxDiscount: false,
            showExtension : true // state to show  ext. iframe   (default to true for now)
        }
        const { dispatch } = this.props;
        dispatch(allProductActions.refresh());
        // This binding is necessary to make `this` work in the callback 
        this.handleIsVariationProduct = this.handleIsVariationProduct.bind(this);
        this.addSimpleProducttoCart = this.addSimpleProducttoCart.bind(this);
        this.addvariableProducttoCart = this.addvariableProducttoCart.bind(this);
        this.productOutOfStock = this.productOutOfStock.bind(this);
        this.imgerrorHandling = this.imgerrorHandling.bind(this);
        this.handleSimplePop = this.handleSimplePop.bind(this);
        this.loadingData = this.loadingData.bind(this);
        this.loadingFilterData = this.loadingFilterData.bind(this);
        var allData = [];
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                this.setState({ AllProductList: [] });
            }
            else {
                this.state.AllProduct = getTaxAllProduct(val);
                val.map(item => {
                    if (item.ParentId == 0 && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1))) {
                        allData.push(item);
                    }
                })

                if (allData.length == 0) {
                }
                this.setState({ ParentProductList: allData, totalRecords: allData ? allData.length : 0 });
                this.state.totalRecords = this.state.ParentProductList ? this.state.ParentProductList.length : 0;
                this.loadingData();
                this.setState({ isLoading: false });
            }
        });
        if (this.state.search) {
            this.loadingFilterData()
        }
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 1000);
        this.props.onRef(this)

    }

    handleClose() {
        $(".button_with_checkbox input").prop("checked", false);
        this.props.productData(false);
         if (this.props.getVariationProductData) {
            this.setState({
                showSelectStatus: false,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.props.getVariationProductData ? this.props.getVariationProductData.Title : '',
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

    addProductXDiscount() {
        var selectedProductData = this.state.cartlistSelected
        var productX_data = localStorage.getItem('PRODUCTX_DATA') && JSON.parse(localStorage.getItem('PRODUCTX_DATA'))
        if (productX_data && selectedProductData) {
            var data = productX_data && productX_data.find(item => item.product_id == selectedProductData.WPID)
               var product = {
                type: 'product',
                discountType: data ? data.discount_type == "Percentage" ? 'Percentage' : 'Number' : '',
                discount_amount: data ? data.discount_amount : 0,
                Tax_rate: 0,
                Id: selectedProductData.WPID
            }
            localStorage.setItem("PRODUCT", JSON.stringify(product))
            localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(selectedProductData))
            this.props.dispatch(cartProductActions.singleProductDiscount(true));
        }
    }
    addProductXtoCart(productx_qty, single_product) {
        const { dispatch, showSelectedProduct } = this.props;
        var getVariationProductData = this.state.cartlistSelected;
        var ticket_Data = this.state.ticket_status == true ? localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '' : ''
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        var tick_data = getVariationProductData ? JSON.parse(getVariationProductData.TicketInfo) : '';
        this.setState({ isProductxDiscount: false })
        var data = null;
        var SingleProduct = null;
        if (single_product && single_product.WPID) {
            if (single_product.WPID == getVariationProductData.WPID) {
                SingleProduct = single_product
            } else {
                SingleProduct = getVariationProductData
            }
        } else {
            if (cartlist.length > 0) {
                cartlist.map(prdId => {
                    if (prdId.product_id === getVariationProductData.WPID) {
                        SingleProduct = getVariationProductData
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
        var pro_id = getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0;
        var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0
        var productXSingleData = prodXData ? prodXData.find(prodX => prodX.product_id == pro_id) : 0
        var productXItemPrice = productXSingleData && productXSingleData.line_subtotal
        data = {
            line_item_id: SingleProduct ? SingleProduct.line_item_id : 0,
            cart_after_discount: SingleProduct ? SingleProduct.cart_after_discount : 0,
            cart_discount_amount: SingleProduct ? SingleProduct.cart_discount_amount : 0,
            after_discount: SingleProduct ? SingleProduct.after_discount : 0,
            discount_amount: SingleProduct ? SingleProduct.discount_amount : 0,
            product_after_discount: SingleProduct ? SingleProduct.product_after_discount : 0,
            product_discount_amount: SingleProduct ? SingleProduct.product_discount_amount : 0,
            quantity: productx_qty > 0 ? productx_qty : getVariationProductData.StockQuantity,
            Title: getVariationProductData ? getVariationProductData.Title : "",
            Price: productXItemPrice ? productXItemPrice : 0, // add productX price directly from productX data
            product_id: getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0,
            variation_id: 0,
            isTaxable: getVariationProductData.Taxable,
            old_price: getVariationProductData.old_price,
            incl_tax: getVariationProductData.incl_tax,
            excl_tax: getVariationProductData.excl_tax,
            ticket_status: getVariationProductData.IsTicket,
            product_ticket: this.state.ticket_status == true ? getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo : '' : '',
            tick_event_id: getVariationProductData.IsTicket == true ? tick_data._event_name : null,
            discount_type: SingleProduct ? SingleProduct.discount_type : "",
            new_product_discount_amount: SingleProduct ? SingleProduct.new_product_discount_amount : 0,
            TaxStatus: getVariationProductData.TaxStatus,
            tcForSeating: getVariationProductData.tcForSeating,
            TaxClass: getVariationProductData.TaxClass,
            ticket_info: getVariationProductData && getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo : [],
            Type: getVariationProductData && getVariationProductData.Type
        }
        var product = getVariationProductData
        var qty = 0;
        cartlist.map(item => {
            if (product.WPID === item.product_id) {
                qty = item.quantity;
            }
        })
        var qytt = this.state.Prodefaultqty !== null && typeof this.state.Prodefaultqty !== 'undefined' ? this.state.Prodefaultqty : this.state.variationDefaultQunatity;
        var txtPrdQuantity = (productx_qty > 0) ? productx_qty : qytt
        if (parseInt(txtPrdQuantity) <= 0) {
            /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
            this.CommonMsg(LocalizedLanguage.productQty)
            showModal('common_msg_popup');
            return;
        }
       if ((product.StockQuantity == 'Unlimited' || qty <= product.StockQuantity)) {
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
        } else {
            this.CommonMsg('Product is out of stock.');
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
    stockUpdateQuantity(cardData, data, product) {
        var qty = 0
        cardData.map(item => {
            if (data.product_id === item.product_id) {
                qty += item.quantity;
            }
        })
        if (product) {
            var quantity = (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? product.StockQuantity - qty : '0';
            localStorage.setItem("CART_QTY", quantity);
        }
    }   
    getCompositeExtensionFinished = (_jsonMsg) => {
        hideModal('VariationPopUp');
        this.windowCloseEv.close();
        this.props.productData(false);
        this.handleClose();
        localStorage.removeItem("oliver_pos_productx_cart_session_data");
        localStorage.removeItem("oliver_pos_productx_id");
    }
    compositeSwitchCases = (jsonMsg) => {
        var compositeEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (compositeEvent && compositeEvent !== '') {
            switch (compositeEvent) {
                case "extensionReady":
                    this.setState({ incr: 1 })
                    sendMessageToComposite(jsonMsg);
                    break;
                //oliverAddedToCart
                case "oliverAddedToCart":
                    getCompositeAddedToCart(jsonMsg)
                    break;
                //oliverSetProductxData
                case "oliverSetProductxData":
                    var data = getCompositeSetProductxData(jsonMsg)
                    if (data && data.quantity && this.state.incr == 1) // added to check data run only once
                    {
                         this.setState({ incr: 2, productXQantity: data.quantity })
                         
                        if (data.discount_type !== '' && data.discount_amount && data.discount_amount !== '0' && data.discount_amount !== 0) {
                            this.setState({ isProductxDiscount: true })
                            this.addProductXDiscount()
                        }
                        else {
                            this.addProductXtoCart(data.quantity);
                        }
                    }
                    break;
                // extensionFinished
                case "extensionFinished":
                   this.getCompositeExtensionFinished(jsonMsg)
                    //call android function to close the extention window:
                    AndroidExtentionFinished();
                    break;
                default:
                    break;
            }
        }
    }

    componentDidUpdate(prop, nextState) {
        if (nextState.totalRecords < nextState.pageNumber) {
            if (nextState.search) {
                this.loadingFilterData()
            }
        }
    }
    imgerrorHandling(image) {
        image.onerror = null;
        image.src = "assets/img/placeholder.png";
        return true;
    }

    loadingData() {
        const { pageNumber, chunk_size, ParentProductList } = this.state;
        var prdList = [];
       // var tilDisplayIndex = pageNumber * chunk_size + chunk_size;
        ParentProductList.sort(function (a, b) {
            var nameA = a.Title.toUpperCase(); // ignore upper and lowercase
            var nameB = b.Title.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });

        ParentProductList && ParentProductList.map((prod, index) => {
            //if (index >= 0 && index < tilDisplayIndex) {
                // check tickera product is expired?--------------------------
                var isExpired = false;
                if (prod.IsTicket && prod.IsTicket == true) {
                    var ticketInfo = JSON.parse(prod.TicketInfo);
                    if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                        var dt = new Date(ticketInfo._ticket_availability_to_date);
                        var expirationDate = dt.setDate(dt.getDate() + 1);
                        var currentDate = new Date();// moment.utc(new Date)
                        if (currentDate > expirationDate) {
                            isExpired = true;
                        }
                    }
                }
                //------------------------------------------------------------
                if (isExpired == false)
                    prdList.push(prod)
           // }
        });
        if (prdList.length > 0) {
            this.state.product_List = prdList;
            this.setState({ 
                product_List: prdList,
                totalRecords : ParentProductList.length
            })
            if(ActiveUser.key.isSelfcheckout == true){
                this.setState({ 
                    totalRecords : ParentProductList.length
                })

            }
        }
        this.state.pageNumber = pageNumber + 1;
        if (ParentProductList.length == 0) {
        }
    }

    loadingFilterData() {
        const { pageNumber, chunk_size, filteredProuctList } = this.state;
        var prdList = [];
        var tilDisplayIndex = pageNumber * chunk_size + chunk_size;
        filteredProuctList && filteredProuctList.map((prod, index) => {
           // if (index >= 0 && index < tilDisplayIndex)
                prdList.push(prod)
        });
        if (prdList.length > 0) {
            this.state.product_List = prdList;
            this.setState({ product_List: prdList })
        }
        this.state.pageNumber = pageNumber + 1;
    }

    //this.props.onRef(null)
    componentWillUnmount = () => {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }
    filterProduct() {
        var input = $("#product_search_field_pro").val();
        var value = getSearchInputLength(input.length)

        if (value == true || input.length == 0) {
            this.filterProductByTile("product-search",input);
        }
    }
    filterProductByTile(type, item) {
        this.setState({ pageNumber: 0 })
        switch (type) {
            case "attribute":
                this.filterProductForAttribute(item);
                break;
            case "sub-attribute":
                this.filterProductForSubAttribute(item);
                break;
            case "category":
                this.filterProductForCateGory(item);
                break;
            case "sub-category":
                this.filterProductForSubCateGory(item);
                break;
            // case "inner-sub-attribute":
            //     this.productDataSearch(item, 4, parent)
            //     break;
            // case "inner-sub-category":
            //     this.productDataSearch(item, 2)
            //     break;
            case "product-search":
                this.productDataSearch(item, 0,null)
                break;
            case "product":
                this.loadingData()
                break;

        }
    }

    // filterProductForAttribute(item) {
    //     this.productDataSearch(item.attribute_slug, 1)
    // }

    // filterProductForSubAttribute(item) {
    //     this.productDataSearch(item.attribute_slug, 3, item.parent_attribute.replace("pa_", ""));
    // }
    filterProductForAttribute(item) {
        this.productDataSearch(item.Code, 1)
    }

    filterProductForSubAttribute(item) {
        this.productDataSearch(item.Code, 3, item.taxonomy.replace("pa_", ""));
    }


    filterProductForCateGory(item) {
        this.productDataSearch(item.Code, 2,item)
    }

    filterProductForSubCateGory(item) {
        this.productDataSearch(item.Code, 2,item)
    }

    retrunItrateLoop(found, filterCategoryCode) {
        //var setSubCategory = localStorage.getItem("setSubCategory") ? JSON.parse(localStorage.getItem("setSubCategory")) : [];
        //filterCategoryCode.push(found.Code)
        if (found && found.Subcategories && found.Subcategories.length > 0) {
            found.Subcategories.map(element => {
                //setSubCategory.push(element)
                filterCategoryCode.push(element.Code)
                if (element && element.Subcategories && element.Subcategories.length > 0) {
                    this.retrunItrateLoop(element, filterCategoryCode)
                }
            })
            // const arrayUniqueByKey = [...new Map(setSubCategory.map(item =>
            //     [item['Code'], item])).values()];
            const arrayUniqueByKeyArray = [...new Map(filterCategoryCode.map(item =>
                [item, item])).values()];
            //localStorage.setItem("setSubCategory", JSON.stringify(arrayUniqueByKey))
            return arrayUniqueByKeyArray
        }
        return filterCategoryCode
    }

    //Todo:  Need to update android calling function till 5/12/2019
    productDataSearch(item1, index, parent) {
        const { AllProduct, ParentProductList } = this.state;
        this.setState({ isLoading: true });
        var filtered = []
        var value = item1;
        var parentAttribute = parent;
        this.state.product_List = [];
        this.setState({
            search: value,
            pageNumber: 0
        })
        // call loadingData when searchInput length 0
        if (value == '' || value == null) {
            index = null
            this.loadingData()
        }
        if (index == 0) {//product
            var serchFromAll = AllProduct.filter((item) => (item.Title.toLowerCase().includes(value.toLowerCase()) || item.Barcode.toString().toLowerCase().includes(value.toLowerCase()) || item.Sku.toString().toLowerCase().includes(value.toLowerCase())))
            //-------//Filter child and parent-------------
            var parentArr = [];
            serchFromAll && serchFromAll.map(item => {
                if (item.ParentId != 0) {
                    var parrentofChild = AllProduct.find(function (element) {
                        return (element.WPID == item.ParentId)
                    });
                    if (parrentofChild)
                        parentArr.push(parrentofChild);
                }
            })
            serchFromAll = [...new Set([...serchFromAll, ...parentArr])];
            if (!serchFromAll || serchFromAll.length > 0) {
                var parentProduct = serchFromAll.filter(item => {
                    return (item.ParentId == 0)
                })
                parentProduct = parentProduct ? parentProduct : []
                filtered = [...new Set([...filtered, ...parentProduct])];
            }
            this.setState({
                filteredProuctList: filtered,
                totalRecords: filtered.length,
                product_List: filtered,

            })
            this.state.filteredProuctList = filtered;
            this.state.totalRecords = filtered.length;
            this.loadingFilterData()
        }
        if (index == 1) { //attribute
            ParentProductList && ParentProductList.map((item) => {
                item.ProductAttributes && item.ProductAttributes.map(attri => {
                    if (String(attri.Slug).toLowerCase().toString().indexOf(String(value).toLowerCase()) != -1 ||
                        String(attri.Name).toLowerCase().toString().indexOf(String(value).toLowerCase()) != -1) {
                        filtered.push(item)
                    }
                })
            })
            this.setState({
                filteredProuctList: filtered,
                totalRecords: filtered.length
            })
            this.state.filteredProuctList = filtered;
            this.state.totalRecords = filtered.length;
            this.state.product_List = filtered;
            this.loadingFilterData()
        }
        else 
        if (index == 2) {
            // category
            ///------Get Subcategory Code------------------------------------------------ 
            var filterCategoryCode = []
            filterCategoryCode.push(value)
            var categoryList = [];
            if (localStorage.getItem("categorieslist"))
                categoryList = JSON.parse(localStorage.getItem("categorieslist"))
            if (categoryList) {
                var category_list = categoryList;
                var found;
                //var setSubCategory = localStorage.getItem("setSubCategory") ? JSON.parse(localStorage.getItem("setSubCategory")) : [];
               if (category_list && category_list !== undefined && category_list.length > 0) {
                    found = category_list.find(item => item.Code.replace(/-/g, "").toLowerCase() == value.replace(/-/g, "").toLowerCase());
                    // if (!found && setSubCategory) {
                    //     found = setSubCategory && setSubCategory.find(item => item.Code.replace(/-/g, "").toLowerCase() == value.replace(/-/g, "").toLowerCase());
                    // }
                    if (found) {
                        filterCategoryCode = this.retrunItrateLoop(found, filterCategoryCode)
                    }
                }
            }         
            ParentProductList && ParentProductList.map((item) => {
                item.Categories && item.Categories !== undefined && item.Categories.split(",").map(category => {
                    filterCategoryCode && filterCategoryCode !== undefined && filterCategoryCode.map(filterCode => {
                        var prod_Code = filterCode.replace(/-/g, "");  
                        category = category.replace(/-/g, "");
                        if (category.toUpperCase().toString() === prod_Code.toUpperCase()) {
                            if (filtered.indexOf(item) === -1) {
                                filtered.push(item)
                            }
                        }
                    })
                })
            })
            this.setState({
                filteredProuctList: filtered,
                totalRecords: filtered.length
            })
            this.state.filteredProuctList = filtered;
            this.state.totalRecords = filtered.length;
            this.state.product_List = filtered
            this.loadingFilterData();
        }
         else if (index == 3) {
            ///------Get attribute Code------------------------------------------------ 
            var filterAttribyteCode = []
            filterAttribyteCode.push(value);
            var attributelist = [];
            if (localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true)
                attributelist = JSON.parse(localStorage.getItem("attributelist"))
            if (attributelist && attributelist !== undefined && attributelist.length > 0 ) {
                var found = attributelist.find(function (element) {
                    return (element.Code.replace(/-/g, "").toLowerCase() == value.replace(/-/g, "").toLowerCase())
                });
                if (found) {
                    found.SubAttributes.map(item => {
                        filterAttribyteCode.push(item.Code);
                    })
                }
            }
            ParentProductList && ParentProductList.map((item) => {
                item.ProductAttributes && item.ProductAttributes.map(proAtt => {
                    var dataSplitArycomma = proAtt.Option.split(',');
                    dataSplitArycomma && dataSplitArycomma !== undefined && dataSplitArycomma.map(opt => {
                        filterAttribyteCode !== undefined && filterAttribyteCode.map(filterAttribute => {
                            opt = opt.replace(/-/g, "");
                            value = filterAttribute.replace(/-/g, ""); // value.replace(/-/g, ""); 
                            if (opt.toString().toUpperCase() === String(value).toUpperCase() && String(proAtt.Slug).toUpperCase() === String(parentAttribute).toUpperCase()) {
                                if (filtered.indexOf(item) === -1) {
                                    filtered.push(item)
                                }
                            }
                        })
                    })
                })
            })
            this.setState({
                filteredProuctList: filtered,
                totalRecords: filtered.length
            })
            this.state.product_List = filtered
            this.state.filteredProuctList = filtered;
            this.state.totalRecords = filtered.length;
            this.loadingFilterData();
        } 
        else if (index == 4) {
            ParentProductList && ParentProductList !== undefined && ParentProductList.map((item) => {
                var dataSplitAry = item.ProductAttributes && item.ProductAttributes !== undefined && item.ProductAttributes.map(Opt => {
                    var dataSplitArycomma = Opt.Option.split(',');
                    dataSplitArycomma && dataSplitArycomma !== undefined && dataSplitArycomma.map(optValve => {
                        var itemCode = this.getAttributeCode(optValve, parent);
                        if (itemCode !== null && itemCode !== undefined && itemCode.toString().toUpperCase() === String(value).toUpperCase()) {
                            filtered.push(item)
                        }
                    })
                })
            })
            this.setState({
                filteredProuctList: filtered,
                totalRecords: filtered.length
            })
            this.state.product_List = filtered
            this.state.filteredProuctList = filtered;
            this.state.totalRecords = filtered.length;
            this.loadingFilterData()
        }
        this.setState({ isLoading: false });
    }

    getAttributeCode(optionvalue, parent) {
        ///------Get attribute Code------------------------------------------------   
        var itemCode = null;
        var found = null;
        var attributelist = [];
        if (localStorage.getItem("attributelist") && Array.isArray(JSON.parse(localStorage.getItem("attributelist"))) === true)
            attributelist = JSON.parse(localStorage.getItem("attributelist"))
        if (attributelist && attributelist !== undefined && attributelist.length > 0 && parent && parent !== null)  {
            var found = attributelist.find(function (element) {
                return (element.Code.replace(/-/g, "").toLowerCase() == parent.replace(/-/g, "").toLowerCase())
            });
            if (found) {
                var subAttributes = found.SubAttributes.find(function (element) {
                    return (element.Value.replace(/-/g, "").toLowerCase() == optionvalue.replace(/-/g, "").toLowerCase())
                });
                itemCode = subAttributes ? subAttributes.Code : "";
            }
        }
        return itemCode;
    }

    // Update the actual qty of variations --------------------------
    updateActualStockQty(prd){  
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (val && val != "" && val.length >= 0  ) {                
                    var found = val.find(function (indx) {
                        return indx.WPID==  prd.WPID;
                    });
                    if(found){
                        prd["StockQuantity"]=found.StockQuantity;
                    }
            }
        });
        return prd;
    }
    //------------------------------------------------
    handleIsVariationProduct(type, product) {
        // // ***  product extension code START ***//
        // this.showProductExtension(product);
        // // ***  product extension code END  ***//
       
               
        product= this.updateActualStockQty(product);
        localStorage.removeItem("PRODUCT");
        localStorage.removeItem("SINGLE_PRODUCT");
        const { dispatch } = this.props;
        if(product.ManagingStock==true){
            dispatch(allProductActions.productWarehouseQuantity(product.WPID));
        }         
        dispatch(cartProductActions.singleProductDiscount())
        var taglist = product.Tags ? product.Tags !== "" ? product.Tags.split(",") : null : null;
        if (taglist && (taglist !== null && taglist.includes('oliver_produt_x') == true) &&
            (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal()
                == true) && product !== null && product.ParamLink !== "" && product.ParamLink
            !== "False" && product.ParamLink !== null) {
                this.props.showPopuponcartlistView(product, document.getElementById("qualityUpdater") ? document.getElementById("qualityUpdater").value : this.props.variationDefaultQunatity);
       }
        // else if (isMobileOnly !== true && type == "simple") {
        //     this.addSimpleProducttoCart(product);
        // }
         else {
            if ((type !== "simple" && type !== "variable") && (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal() == false)) {
                this.props.msg(LocalizedLanguage.productxOutOfStock);
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                showModal('common_msg_popup');
            }
            else {
                if ((type !== "simple" && type !== "variable") && product !== null && product.ParamLink !== "" && product.ParamLink !== "False" && product.ParamLink !== null) {
                    this.props.showPopuponcartlistView(product, document.getElementById("qualityUpdater") ? document.getElementById("qualityUpdater").value : this.props.variationDefaultQunatity);
                }
                else {
                    jQuery("#prodNote").val('');
                    showModal('VariationPopUp');
                    if (isMobileOnly == true && (ActiveUser.key.isSelfcheckout !== null && ActiveUser.key.isSelfcheckout == true)) {
                        if (isMobileOnly == true) { $('#variableproduct').addClass('show') }
                        showModal('variableproduct');
                    }
                    else if (isMobileOnly == true && (ActiveUser.key.isSelfcheckout == null || ActiveUser.key.isSelfcheckout == false)) {
                        this.props.openModal("product_modal");
                    }
                }
            }
            this.addvariableProducttoCart(product);
        }
    }

    productOutOfStock(title) {
        this.props.msg(LocalizedLanguage.productOutOfStock);
        if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
        showModal('common_msg_popup');
    }

    getTicketFields(product, tick_type = null) {
        var tick_data = JSON.parse(product.TicketInfo)
        var form_id = tick_data._owner_form_template
        this.props.dispatch(allProductActions.ticketFormList(form_id));
        this.state.ticket_Product_status = true
        this.state.tick_type = tick_type
        this.state.ticket_Product = product
        this.setState({
            ticket_Product: product,
            ticket_Product_status: true,
        })
    }
    /*
    Created By   : Shakuntala Jatav
    Created Date : 20-06-2019
    Description  : set state for show seating seats.    
    Updated By   :
    Updated Date :
    Description :    
*/
    addSimpleProducttoCart(product, ticketFields = null) {      
        const { dispatch, checkout_list, cartproductlist } = this.props;
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        if (cartlist.length > 0) {
            cartlist.map(findId => {
                if (findId.product_id === product.WPID) {
                    product['after_discount'] = findId ? findId.after_discount : 0,
                        product['discount_amount'] = findId ? findId.discount_amount : 0,
                        product['product_after_discount'] = findId ? findId.product_after_discount : 0,
                        product['product_discount_amount'] = findId ? findId.product_discount_amount : 0,
                        product['discount_type'] = findId ? findId.discount_type : "",
                        product['new_product_discount_amount'] = findId ? findId.new_product_discount_amount : 0
                }
            });

        }
        var setQunatity = 1;
        var tick_data = product && product.IsTicket == true && product.TicketInfo != '' ? JSON.parse(product.TicketInfo) : '';
        var availability_to_date = tick_data && tick_data !== 'null' ? moment(tick_data._ticket_availability_to_date).format('YYYY-MM-DD') : ''
        var today_date = moment().format('YYYY-MM-DD')

        if (product && product.IsTicket == true && ticketFields == null) {
            var tick_type = 'simpleadd';
            this.getTicketFields(product, tick_type)
        }
        if (product !== null && product !== undefined && product.IsTicket == false) {
            var data = {
                line_item_id: 0,
                cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
                cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
                after_discount: product.after_discount ? product.after_discount : 0,
                discount_amount: product.discount_amount ? product.discount_amount : 0,
                product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
                product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
                quantity: setQunatity,
                Title: product.Title,
                Sku: product.Sku,
                Price: setQunatity * parseFloat(product.Price),
                product_id: product.WPID,
                variation_id: 0,
                isTaxable: product.Taxable,
                old_price: product.old_price,
                incl_tax: product.incl_tax,
                excl_tax: product.excl_tax,
                ticket_status: product.IsTicket,
                discount_type: product.discount_type ? product.discount_type : "",
                new_product_discount_amount: product ? product.new_product_discount_amount : 0,
                TaxStatus: product ? product.TaxStatus : "",
                TaxClass: product ? product.TaxClass : '',
            }
            var qty = 0;
            cartproductlist.map(item => {
                if (product.WPID == item.product_id) {
                    qty = item.quantity;
                }
            })
            //  add simple product with below condotions
            var product_is_exist = (product.ManagingStock == false && product.StockStatus == "outofstock") ? "outofstock" :
                (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? qty < product.StockQuantity : '0'
            if (product_is_exist == '0') {
                /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
                this.props.msg(LocalizedLanguage.productQty)
                //$('#common_msg_popup').modal('show');
                showModal('common_msg_popup');
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                return;
            }
            if (product_is_exist !== 'outofstock' && product_is_exist !== '0' && product_is_exist == true || product_is_exist == 'Unlimited') {
                cartlist.push(data);
                //Android Call----------------------------
                var totalPrice = 0.0;
                cartlist && cartlist.map(item => {
                    totalPrice += item.Price;
                })
                androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
                //-----------------------------------------
                this.stockUpdateQuantity(cartlist, data, product)
                if((!localStorage.getItem("APPLY_DEFAULT_TAX")) || localStorage.getItem("APPLY_DEFAULT_TAX")==null){
                    setTimeout(() => {   
                        dispatch(cartProductActions.addtoCartProduct(cartlist));                     
                    }, 400);
                }else{
                    dispatch(cartProductActions.addtoCartProduct(cartlist));
                }               
            } else {
                this.props.msg(LocalizedLanguage.productOutOfStock);
                showModal('common_msg_popup');
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
            }
        }
        else if (product !== null && product !== undefined && product.IsTicket == true && ticketFields != null) {
            var TicketInfoForSeat = product && product.TicketInfo && JSON.parse(product.TicketInfo);
            var tcForSeating = TicketInfoForSeat ? TicketInfoForSeat : "";
            this.setState({ ticket_Product_status: false })
            var data = {
                line_item_id: 0,
                cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
                cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
                after_discount: product.after_discount ? product.after_discount : 0,
                discount_amount: product.discount_amount ? product.discount_amount : 0,
                product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
                product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
                quantity: setQunatity,
                Title: product.Title,
                Sku: product.Sku,
                Price: setQunatity * parseFloat(product.Price),
                product_id: product.WPID,
                variation_id: 0,
                isTaxable: product.Taxable,
                tick_event_id: tick_data._event_name,
                ticket_status: product.IsTicket,
                product_ticket: ticketFields,
                old_price: product.old_price,
                incl_tax: product.incl_tax,
                excl_tax: product.excl_tax,
                discount_type: product.discount_type ? product.discount_type : "",
                new_product_discount_amount: product ? product.new_product_discount_amount : 0,
                TaxStatus: product ? product.TaxStatus : "",
                tcForSeating: tcForSeating,
                TaxClass: product ? product.TaxClass : '',
            }
            var qty = 0;
            cartproductlist.map(item => {
                if (product.WPID == item.product_id) {
                    qty = item.quantity;
                }
            })
            //  add simple product with below condotions
            var product_is_exist = (product.ManagingStock == false && product.StockStatus == "outofstock") ? "outofstock" :
                (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? qty < product.StockQuantity : '0'
            if (product_is_exist == '0') {
                /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
                this.props.msg(LocalizedLanguage.productQty)
                showModal('common_msg_popup');
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                return;
            }
            if (product_is_exist !== 'outofstock' && product_is_exist !== '0' && product_is_exist == true || product_is_exist == 'Unlimited') {
                cartlist.push(data);
                //Android Call----------------------------
                var totalPrice = 0.0;
                cartlist && cartlist.map(item => {
                    totalPrice += item.Price;
                })
                androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
                //-----------------------------------------
                this.stockUpdateQuantity(cartlist, data, product)
                dispatch(cartProductActions.addtoCartProduct(cartlist));  // this.state.cartproductlist
            } else {
                this.props.msg(LocalizedLanguage.productOutOfStock);
                showModal('common_msg_popup');
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
            }
        }
    }    
    /*
    Created By   : Shakuntala Jatav
    Created Date : 23-07-2019
    Description  : call function for update inventory for after checkout.
    Updated By   :
    Updated Date :
    Description :    
    */
    updateProductDB() {
        const { ParentProductList } = this.state;
        var allData = [];
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                this.setState({ AllProductList: [] });
            }
            else {
                this.state.AllProduct = getTaxAllProduct(val);
                val.map(item => {
                    if (item.ParentId == 0 && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1))) {
                        allData.push(item);
                    }
                })

                if (allData.length == 0) {
                }

                this.setState({ ParentProductList: allData, totalRecords: allData ? allData.length : 0 });
                this.state.totalRecords = ParentProductList ? ParentProductList.length : 0;
                this.loadingData();
            }
        }
        );
        this.state.update_product_DB = false;
        this.setState({ update_product_DB: false })
        this.props.dispatch(idbProductActions.updateConfirmProductDB(false));
    }

    componentWillReceiveProps(nextProps) {

        // add productX discount in cart
        if (nextProps.single_product) {
            if (nextProps.single_product && nextProps.single_product.WPID && this.state.isProductxDiscount == true) {
                this.addProductXtoCart(this.state.productXQantity, nextProps.single_product)
            }

        }
        if (nextProps.update_product_DB && nextProps.update_product_DB == true && this.state.update_product_DB == false) {
            this.state.update_product_DB = true;
            this.setState({ update_product_DB: true })
            this.updateProductDB();
        }
        var ticket_Data = localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : ''
        var tick_data = this.state.ticket_Product_status == true ? JSON.parse(this.state.ticket_Product.TicketInfo) : ''
        var form_id = tick_data._owner_form_template
        if ((localStorage.getItem('ticket_list') && localStorage.getItem('ticket_list') !== 'null' && localStorage.getItem('ticket_list') !== '' && (typeof this.state.tick_type !== 'object') && this.state.ticket_Product_status == true && this.state.tick_type == 'simpleadd' && this.state.tick_type !== 'null') || (form_id == -1 || form_id == '' && this.state.ticket_Product_status == true && this.state.tick_type == 'simpleadd' && this.state.tick_type !== 'null' && (typeof this.state.tick_type !== 'object'))) {
            this.setState({ ticket_Product_status: false })
            if (typeof this.state.tick_type !== 'object') {
                this.addSimpleProducttoCart(this.state.ticket_Product, localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '')
            }
        }
    }

    addvariableProducttoCart(product) {
        const { AllProduct } = this.state;
        var variationProdect = AllProduct.filter(item => {
            return (item.ParentId === product.WPID && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1)))
        })
        // Update the actual qty of variations --------------------------       
               if(variationProdect && variationProdect.length>0){
                variationProdect.map(item=>{
                    item= this.updateActualStockQty(item);                    
                })              
            }   
        //------------------------------------------------
        product['Variations'] = variationProdect
        if (product.IsTicket == true) {
            var tick_data = JSON.parse(product.TicketInfo)
            if (tick_data._ticket_availability == "open_ended") {
                this.getTicketFields(product);
            } else if (tick_data._ticket_availability == "range") {
                var availability_to_date = moment(tick_data._ticket_availability_to_date).format('YYYY-MM-DD')
                var today_date = moment().format('YYYY-MM-DD')
                if (availability_to_date > today_date) {
                    this.getTicketFields(product);
                }
            }
        }
        this.props.productData(product);
        // $('#VariationPopUp').modal('show');
    }

    goBack() {
        history.push('/listview');
    }
    handleSimpleProduct(simpleProductData) {
        this.setState({
            getSimpleProductData: simpleProductData,
            hasSimpleProductData: true,
            getVariationProductData: null,
            hasVariationProductData: false
        })
    }

    handleSimplePop(type, product) {
       
        product=this.updateActualStockQty(product)
        const { dispatch } = this.props;
        if(product.ManagingStock==true){
            dispatch(allProductActions.productWarehouseQuantity(product.WPID));   
        }
        var taglist = product.Tags ? product.Tags !== "" ? product.Tags.split(",") : null : null;
        if ((taglist !== null && taglist.includes('oliver_produt_x') == true) &&
            (CommonModuleJS.showProductxModal() !== null && CommonModuleJS.showProductxModal()
                == true) && product !== null && product.ParamLink !== "" && product.ParamLink
            !== "False" && product.ParamLink !== null) {
            this.props.simpleProductData(product)
            this.props.showPopuponcartlistView(product, document.getElementById("qualityUpdater") ? document.getElementById("qualityUpdater").value : this.props.variationDefaultQunatity);
            // this.props.dispatch(cartProductActions.showSelectedProduct(null));
            // const { compositeSwitchCases } = this;
            // this.windowCloseEv = callProductXWindow(product);
            // window.addEventListener('message', function (e) {
            //     var data = e && e.data;
            //     if (typeof data == 'string' && data !== "") {
            //         compositeSwitchCases(JSON.parse(data))
            //     }
            // })
        }
        else if (type == "simple") {
            if (product.IsTicket == true) {
                var tick_data = JSON.parse(product.TicketInfo)
                this.getTicketFields(product)

                if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                    this.props.openModal("product_modal");
                }
                // $('#VariationPopUp').modal('show');
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                   showModal('VariationPopUp');
                this.props.simpleProductData(product);
            } else {
                this.props.simpleProductData(product);
                if (isMobileOnly == true && ActiveUser.key.isSelfcheckout == false) {
                    this.props.openModal("product_modal");
                }
                //$('#VariationPopUp').modal('show');
                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                 showModal('VariationPopUp');
            }
        }
    }
    handleInputFocus = () => {
        // e.blur(); // very important call
        // e.focus();// very important call x2
        softkeyboardhandlingEvent();
      };
    render() {
        const { search, product_List, totalRecords, pageNumber, chunk_size } = this.state;
        const tdNotFound = {
            textAlign: "unset"
        };
        const pStylenotFound = {
            textAlign: 'center'
        };

        return (
            // <div>
            // (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true) ?
            //     <MobileAllProductList
            //         {...this.props}
            //         {...this.state}
            //         LocalizedLanguage={LocalizedLanguage}
            //         productOutOfStock={this.productOutOfStock}
            //         handleIsVariationProduct={this.handleIsVariationProduct}
            //         handleSimplePop={this.handleSimplePop}
            //         NumberFormat={NumberFormat}
            //         Markup={Markup}
            //         loadingData={this.loadingData}
            //         loadingFilterData={this.loadingFilterData}
            //         pStylenotFound={pStylenotFound} />
            //     :
            //     (ActiveUser.key.isSelfcheckout == true) ?
                 <React.Fragment>
                    <ProductItemsView
                        {...this.props}
                        {...this.state}

                        filterProduct={this.filterProduct}
                        LocalizedLanguage={LocalizedLanguage}
                        productOutOfStock={this.productOutOfStock}
                        handleIsVariationProduct={this.handleIsVariationProduct}
                        handleSimplePop={this.handleSimplePop}
                        NumberFormat={NumberFormat}
                        Markup={Markup}
                        loadingData={this.loadingData}
                        loadingFilterData={this.loadingFilterData}
                        pStylenotFound={pStylenotFound}
                        imgError={this.imgerrorHandling}>
                    </ProductItemsView>
                         {/* {((!search) && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                            <div className="createnewcustomer">
                                <button type="button" className="btn btn-block btn-primary total_checkout" id='hideButton' onClick={() => this.loadingData()}>{LocalizedLanguage.loadMore}</button>
                            </div>
                            :
                            (search && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                                <div className="createnewcustomer">
                                    <button type="button" className="btn btn-block btn-primary total_checkout" id='hideButton' onClick={() => this.loadingFilterData()}>{LocalizedLanguage.loadMore}</button>
                                </div>
                                :
                                <div />}  */}
                   </React.Fragment> 
                    // : (isMobileOnly == true) ?
                    //     <MobileAllProductList
                    //         {...this.props}
                    //         {...this.state}
                    //         LocalizedLanguage={LocalizedLanguage}
                    //         productOutOfStock={this.productOutOfStock}
                    //         handleIsVariationProduct={this.handleIsVariationProduct}
                    //         handleSimplePop={this.handleSimplePop}
                    //         NumberFormat={NumberFormat}
                    //         Markup={Markup}
                    //         loadingData={this.loadingData}
                    //         loadingFilterData={this.loadingFilterData}
                    //         pStylenotFound={pStylenotFound}
                    //     />
                    //     :
                    //     <div className="items items-padding">
                    //         <div className="panel panel-default round-8 p-0 overflow-hidden">
                    //             <div className="overflowscroll" id="allProductHeight">
                    //                 <div className="searchDiv" style={{ display: 'none' }}>
                    //                     <input type="search" className="form-control nameSearch" id="product_search_field" placeholder={LocalizedLanguage.placeholderSearchAndScan}  onFocus={this.handleInputFocus()}/>
                    //                 </div>

                    //                 {this.props.parantPage && this.props.parantPage == 'list' ? <div className="pl-1 pr-4 previews_setting">
                    //                     <a href="/listview" className="back-button d-flex align-items-center mt-0 mb-0" id="mainBack" onClick={() => this.goBack()}>
                    //                         <i className="icons8-undo ml-2 mr-2 fs30 pointer"></i>
                    //                         <span>{LocalizedLanguage.back}</span>
                    //                     </a>
                    //                 </div> : ""}

                    //                 <table className="table ShopProductTable tile-view-product" id="all-product-list">
                    //                     <colgroup>
                    //                         <col style={{ width: '*' }} />
                    //                     </colgroup>
                    //                     <tbody>
                    //                         {(this.state.isLoading == true && (!product_List || product_List == '')) ?
                    //                             <tr>
                    //                                 <td >
                    //                                     <div className="no-product-find AppModal w-100" style={{ height: "70vh" }}>
                    //                                         <LoadingSmallModal />
                    //                                     </div>
                    //                                 </td>
                    //                             </tr>
                                               
                    //                             : (!product_List || product_List == '') ?
                    //                                 <tr>
                    //                                     {/* {showModal('commonInfoPopup')} */}
                    //                                     <td style={tdNotFound}><p style={pStylenotFound}>{LocalizedLanguage.noMatchingProductFound}</p></td>
                    //                                 </tr>
                    //                                 :
                    //                                 product_List && product_List.map((item, index) => {
                    //                                     var display_expireTicketTime;

                    //                                     var taglist = item && item !== undefined ? item.Tags !== null && item.Tags !== undefined ? item.Tags !== "" ? item.Tags.split(",") : null : null : null;
                    //                                     var isVariableProduct = (item.Type !== "simple") ? true : false;
                    //                                     if (item.IsTicket && item.IsTicket == true) {
                    //                                         var ticketInfo = JSON.parse(item.TicketInfo);
                    //                                         if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                    //                                             var dt = new Date(ticketInfo._ticket_availability_to_date);
                    //                                             display_expireTicketTime = moment(dt).format('LT');
                    //                                         }
                    //                                     }
                    //                                     return (
                    //                                         <tr className="pointer" key={index}
                    //                                             data-toggle={isVariableProduct == true ? "modal" : ""} href="javascript:void(0)"
                    //                                             // onClick={isVariableProduct == true ? item.StockStatus == "outofstock" ? this.productOutOfStock.bind(item.Title) : this.handleIsVariationProduct.bind(this, item.Type, item) : null} >
                    //                                             onClick={isVariableProduct == true ? this.handleIsVariationProduct.bind(this, item.Type, item) : null}
                    //                                         >
                    //                                             <td className="pointer" onClick={this.handleSimplePop.bind(this, item.Type, item)}>{item.Title && item.Title !== "" ? <Markup content={item.Title} /> : item && (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A'}
                    //                                                 {display_expireTicketTime && display_expireTicketTime != '' &&
                    //                                                     <label className='text-danger heading'>{LocalizedLanguage.validTill} {display_expireTicketTime} </label>
                    //                                                 }
                    //                                             </td>
                    //                                             <td className="text-right pointer" onClick={isVariableProduct == true?this.handleIsVariationProduct.bind(this, item.Type, item) : this.handleSimplePop.bind(this, item.Type, item)}><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                    //                                             </td>
                    //                                             {
                    //                                                 // ((item.InStock == true || item.ManagingStock == false)) ? (
                    //                                                 <td className="text-right pointer" >
                    //                                                     <a className="fs30">
                    //                                                         <img src="assets/images/add.svg" width="35" onClick={
                    //                                                             (isVariableProduct == false && taglist && taglist !== null && taglist.includes('oliver_produt_x') == true)?this.handleSimplePop.bind(this, item.Type, item)
                    //                                                             :this.handleIsVariationProduct.bind(this, item.Type, item)} style={{}}/>
                    //                                                     </a>
                    //                                                 </td>
                    //                                             }
                    //                                         </tr>
                    //                                     )
                    //                                 })}
                    //                     </tbody>
                    //                 </table>
                    //                 {((!search) && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                    //                     <div className="createnewcustomer">
                    //                         <button type="button" className="btn btn-block btn-primary total_checkout" id='hideButton' onClick={() => this.loadingData()}>{LocalizedLanguage.loadMore}</button>
                    //                     </div>
                    //                     :
                    //                     (search && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                    //                         <div className="createnewcustomer">
                    //                             <button type="button" className="btn btn-block btn-primary total_checkout" id='hideButton' onClick={() => this.loadingFilterData()}>{LocalizedLanguage.loadMore}</button>
                    //                         </div>
                    //                         :
                    //                         <div />}
                    //             </div>
                    //         </div>
                    //     </div>
        )
    }
}

function mapStateToProps(state) {
    const { productlist, cartproductlist, filteredProduct, checkout_list, update_product_DB, single_product } = state;
    return {
        productlist: productlist.productlist,
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [], filteredProduct: filteredProduct.items,
        checkout_list: checkout_list.items,
        update_product_DB: update_product_DB.items,
        single_product: single_product.items
    };
}
const connectedList = connect(mapStateToProps)(AllProduct);
export { connectedList as AllProduct };