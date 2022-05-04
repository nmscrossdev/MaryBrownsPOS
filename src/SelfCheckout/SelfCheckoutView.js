import React from 'react';
import { connect } from 'react-redux';
import { TileModel, NavbarPage, CommonProductPopupModal, CommonHeaderTwo, getTaxAllProduct, AllProduct, PopupShopStatus, CommonMsgModal, UpdateProductInventoryModal } from '../_components';
import { cartProductActions, cloudPrinterActions } from '../_actions'
import {  favouriteListActions } from '../ShopView/index';
import {FavouriteList} from '../SelfCheckout/components/FavouriteList';
import {CategoriesList} from '../SelfCheckout/components/CategoriesList';
import { history } from '../_helpers';
import { typeOfTax } from '../_components/TaxSetting';
import { taxRateAction } from '../_actions';
import { checkoutActions } from '../CheckoutPage';
import { get_UDid } from '../ALL_localstorage';
import { idbProductActions } from '../_actions/idbProduct.action';
import { customerActions } from '../CustomerPage';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import { isMobileOnly, isIOS } from "react-device-detect";
import { androidGetUser, androidDisplayScreen } from '../settings/AndroidIOSConnect'
import Config from '../Config';
import WarningMessage from '../_components/views/m.WarningMessage';
import { CartListView } from '../_components/CartListView';
import { CreateProfile } from '../SelfCheckout/components/CustomerProfile/CreatProfile';
import { withResizeDetector } from 'react-resize-detector';
import { Singinselfcheckout } from '../SelfCheckout/components/CustomerProfile/SingInSelfCheckout';
import MobileShopView from '../ShopView/views/mShopView';
import { CommonSelfcheckoutProductPopupModal } from '../SelfCheckout/components/SelfMobileView/CommanSelfcheckoutProductPopup';
import MCommonPopup from './components/SelfMobileView/mCommonPopup';
import MCancalOrderPopup from './components/SelfMobileView/mCancalOrderPopup';
import $ from 'jquery';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import MobileSignInPopup from './components/SelfMobileView/mSignInPopup';
import CartList from '../_components/views/m.CartList';
import { MobilePopupDisplayMessage } from './components/SelfMobileView/mPopupDisplayMessage';
import { PopupDisplayMessage } from '../_components/views/PopupDisplayMessage';
import { redirectToURL,getSearchInputLength, onBackTOLoginBtnClick } from '../_components/CommonJS';
import { OnboardingShopViewPopup } from '../onboarding/components/OnboardingShopViewPopup';
import ActiveUser from '../settings/ActiveUser';
import { callProductXWindow, sendMessageToComposite, getCompositeAddedToCart, getCompositeSetProductxData } from '../_components/CommonFunctionProductX';
import BarcodeReader from 'react-barcode-reader'
import moment from 'moment';
import { CommonInfoPopup } from '../_components/CommonInfoPopup';
import { TickitDetailsPopupModal } from '../_components/TickitDetailsPopupModal/TickitDetailsPopupModal';
import Categories from '../SelfCheckout/components/Categories';
import Navbar from '../SelfCheckout/components/Navbar';
import Carasoul from '../SelfCheckout/components/Carasoul';
import ScreenSaver from '../SelfCheckout/components/ScreenSaver';
import {_key,getTitle,getBanners,getCategories} from '../settings/SelfCheckoutSettings';

class SelfCheckoutView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            cartViewForMobile: false,
            getVariationProductData: null,
            hasVariationProductData: false,
            variationoptionArray: {},
            discountType: "",
            variationCombination: [],
            getSimpleProductData: null,
            hasSimpleProductData: false,
            loading: false,
            AllProductList: [],
            inventoryCheck: null,
            isInventoryUpdate: false,
            common_Msg: '',
            notifyList: [],
            addStatus: '',
            posIndex: '',
            addFavouriteStatus: false,
            favList: "",
            main_banner_image: '',
            pageWidth: null,
            pageHeight: window.innerHeight,
            datetime:Date.now(),//to open product into iframe,
            favFilterSelect:'',
            favFilterPSelect:'',
            showBackProduct:false,
            banners:[],
            categories:[]
        }
        this.onHandleEventofCancelOrderPopup = this.onHandleEventofCancelOrderPopup.bind(this);
        this.onCancelOrderHandler = this.onCancelOrderHandler.bind(this);
        this.onSinginselfcheckout = this.onSinginselfcheckout.bind(this);
        this.CreateUserProfile = this.CreateUserProfile.bind(this);   
        this.handleSimpleProduct = this.handleSimpleProduct.bind(this);
        this.handleProductData = this.handleProductData.bind(this);
        this.handleTicketDetail = this.handleTicketDetail.bind(this);
        this.checkInventoryData = this.checkInventoryData.bind(this);
        this.showPopuponcartlistView = this.showPopuponcartlistView.bind(this)
        this.invetoryUpdate = this.invetoryUpdate.bind(this)
        this.CommonMsg = this.CommonMsg.bind(this)
        this.tileModalAddStatus = this.tileModalAddStatus.bind(this)
        this.closeMsgModal = this.closeMsgModal.bind(this)
        this.handleNotification = this.handleNotification.bind(this);
        this.tilePosition = this.tilePosition.bind(this);
        this.clearData = this.clearData.bind(this);
        this.onCancelOrderHandler = this.onCancelOrderHandler.bind(this);
        this.viewOrderEvent = this.viewOrderEvent.bind(this);
        this.handleScan = this.handleScan.bind(this);
        if (!localStorage.getItem('UDID')) {
            // history.push('/oliverlogin');
            redirectToURL()
        }

        if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
            // history.push('/loginpin');
            redirectToURL()
        }

        this.handletileFilterData = this.handletileFilterData.bind(this);
        var udid = get_UDid('UDID');
        const { dispatch } = this.props;
        //----- update product qty-------------------------------------------------
        dispatch(idbProductActions.updateProductDB());
        dispatch(taxRateAction.getGetRates());
        //dispatch(taxRateAction.getIsMultipleTaxSupport());
        dispatch(checkoutActions.getPaymentTypeName(udid, localStorage.getItem('register')));
        dispatch(checkoutActions.GetExtensions())
        // fetch cloud printer as per the location
        var locationId = localStorage.getItem('Location')
        dispatch(cloudPrinterActions.getCloudPrinters(locationId))
        //----------Fetch All product from indexDB--------------
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                this.setState({ AllProductList: [] });
            } else {
                var _productwithTax = getTaxAllProduct(val)
                this.setState({ AllProductList: _productwithTax });
            }
        });
         dispatch(customerActions.getCountry())
         dispatch(customerActions.getState())
         console.log("------THEME_SECONDARY_COLOR----"+  getTitle(_key.TITLE_FOR_CATEGORY_SECTION));
        
        /* Created By:priyanka,Created Date:13/06/2019,Description:using tickera for check default field*/
    }
  // Created By: 
    // created Date: 
    // Modified By : Nagendra
    // Modified Date: 04/07/2019
    // Decription: change function to scan SKU and barcode, if child have same barcode as parent then variation product popup will display
    /**
     * Modified By :Shakuntala Jatav
     * Modified date : 04-09-2019
     * Description : add data for ticket and tax .
     */

     handleScan(data, ticketFields = null) {
         if(data && data.length<3){
             return;
         }
        if (data && data.IsTicket == true && ticketFields == null) {
            var tick_type = 'simpleadd';
            this.getTicketFields(data, tick_type)
        }
        this.setState({
            result: data,
        })
        var scanBarcode = data
        var productlist = [];
       // var idbKeyval = FetchIndexDB.fetchIndexDb();
       // this.state.AllProductList.then(val => {
           // var _productwithTax = getTaxAllProduct(val)
            productlist = this.state.AllProductList;
            //this.setState({ productlist: _productwithTax });
            if (productlist && productlist.length > 0) {
                var parentProduct = productlist.filter(item => {
                    return ((item.Type == "variable" || item.Type == "variation") && item.ParentId == 0
                        && (scanBarcode === item.Barcode || scanBarcode === item.Sku))
                })

                if (parentProduct && parentProduct.length == 1) {
                    var variationProdect = productlist.filter(filterItem => {
                        return (filterItem.ParentId === parentProduct[0].WPID)
                    })

                    parentProduct[0]['Variations'] = variationProdect
                    this.handleProductData(parentProduct[0]);
                    //$('#VariationPopUp').modal('show');
                    if(isMobileOnly)
                        showModal('variableproduct');
                    else
                        showModal('VariationPopUp');
                }
                else {
                    //Checking if barcode belong to the number of product--------------------
                    var checkMultipleProductfound = false;
                    var allProdctWithbarcode = productlist.filter(item => {
                        return ((scanBarcode === item.Barcode || scanBarcode === item.Sku))
                    })
                    if (allProdctWithbarcode && allProdctWithbarcode.length > 1) {
                        checkMultipleProductfound = true;
                        $("#product_search_field").val(scanBarcode);
                        $(".expand_search").toggleClass("expand_search_open");
                        $("#product_search_field").focus();
                        this.filterProduct();
                    }
                    //--------------------------------------------------------------------------

                    if (checkMultipleProductfound == false) {
                        // Check child variation Product-------------------------------------
                        var childVariationProduct = productlist.find(item => {
                            return ((item.Type == "variable" || item.Type == "variation") && item.ParentId !== 0
                                && (scanBarcode === item.Barcode || scanBarcode === item.Sku))
                        })
                        if (childVariationProduct) {
                            var data = {
                                line_item_id: 0,
                                quantity: 1,
                                Title: childVariationProduct.Title,
                                Price: parseFloat(childVariationProduct.Price),
                                product_id: childVariationProduct.ParentId,
                                variation_id: childVariationProduct.WPID,
                                isTaxable: childVariationProduct.Taxable,
                                old_price: childVariationProduct.old_price,
                                TaxStatus: childVariationProduct.TaxStatus,
                                TaxClass: childVariationProduct.TaxClass,
                            }

                            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
                            var qty = 0;
                            cartlist.map(items => {
                                if (childVariationProduct.WPID == items.variation_id) {
                                    qty = items.quantity;
                                }
                            })
                            if ((childVariationProduct.StockStatus == null || childVariationProduct.StockStatus == 'instock') &&
                                (childVariationProduct.ManagingStock == false || (childVariationProduct.ManagingStock == true && qty < childVariationProduct.StockQuantity))) {
                                cartlist.push(data);
                               
                                this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));   // this.state.cartproductlist
                                
                                 //Android Call----------------------------
                                 var totalPrice = 0.0;
                                 cartlist && cartlist.map(item => {
                                     totalPrice += item.Price;
                                 })
                                 androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
                             //-----------------------------------------
                               
                                $("#product_search_field").val(scanBarcode);
                                $(".expand_search").toggleClass("expand_search_open");
                                this.filterProduct();
                            } else {
                                //this.props.msg('Product is out of stock.');
                                this.setState({common_Msg:'Product is out of stock.'});
                                showModal('common_msg_popup');
                                //$('#common_msg_popup').modal('show');
                            }

                        }
                        else {  //simple Product
                            // Check Other then variation simple Product-------------------------------------
                            var simpleProduct = productlist.find(item => {
                                return ((item.Type !== "variable" && item.Type !== "variation")
                                    && (scanBarcode === item.Barcode || scanBarcode === item.Sku))
                            })
                            var tick_data = simpleProduct && simpleProduct.IsTicket == true && simpleProduct.TicketInfo != '' ? JSON.parse(simpleProduct.TicketInfo) : '';
                            var availability_to_date = tick_data && tick_data !== 'null' ? moment(tick_data._ticket_availability_to_date).format('YYYY-MM-DD') : ''
                            var today_date = moment().format('YYYY-MM-DD')
                            if (simpleProduct) {
                                if (simpleProduct && simpleProduct.IsTicket == false) {
                                    var data = {
                                        line_item_id: 0,
                                        quantity: 1,
                                        Title: simpleProduct.Title,
                                        Price: parseFloat(simpleProduct.Price),
                                        product_id: simpleProduct.WPID,
                                        variation_id: 0,
                                        isTaxable: simpleProduct.Taxable,
                                        old_price: simpleProduct.old_price,
                                        TaxStatus: simpleProduct.TaxStatus,
                                        TaxClass: simpleProduct.TaxClass,
                                        ticket_status: simpleProduct.IsTicket,
                                        product_ticket: ticketFields
                                    }
                                } else if (simpleProduct && simpleProduct.IsTicket == true && ticketFields != null) {
                                    var TicketInfoForSeat = simpleProduct && simpleProduct.TicketInfo && JSON.parse(simpleProduct.TicketInfo);
                                    var tcForSeating = TicketInfoForSeat ? TicketInfoForSeat : "";
                                    this.setState({ ticket_Product_status: false })
                                    var data = {
                                        line_item_id: 0,
                                        quantity: 1,
                                        Title: simpleProduct.Title,
                                        Price: parseFloat(simpleProduct.Price),
                                        product_id: simpleProduct.WPID,
                                        variation_id: 0,
                                        isTaxable: simpleProduct.Taxable,
                                        old_price: simpleProduct.old_price,
                                        TaxStatus: simpleProduct.TaxStatus,
                                        TaxClass: simpleProduct.TaxClass,
                                        tcForSeating: tcForSeating,
                                        tick_event_id: tick_data._event_name,
                                        ticket_status: simpleProduct.IsTicket,
                                        product_ticket: ticketFields
                                    }
                                }
                                var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
                                var qty = 0;
                                cartlist.map(items => {
                                    if (simpleProduct.WPID == items.product_id) {
                                        qty = items.quantity;
                                    }
                                })
                                if ((simpleProduct.StockStatus == null || simpleProduct.StockStatus == 'instock') &&
                                    (simpleProduct.ManagingStock == false || (simpleProduct.ManagingStock == true && qty < simpleProduct.StockQuantity))) {
                                    cartlist.push(data);
                                    
                                    this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));   // this.state.cartproductlist
                                 //Android Call----------------------------
                                 var totalPrice = 0.0;
                                 cartlist && cartlist.map(item => {
                                     totalPrice += item.Price;
                                 })
                                 androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
                             //-----------------------------------------
                                
                                } else {
                                    this.setState({common_Msg:'Product is out of stock.'});
                                    //this.props.msg('Product is out of stock.');
                                    //$('#common_msg_popup').modal('show');
                                     showModal('common_msg_popup');
                                }
                            }
                            else {
                               // this.props.msg('Product Not Found.');
                                //showModal('common_msg_popup');
                                // $('#common_msg_popup').modal('show');//Product Not found
                                if(scanBarcode){
                                    this.setState({common_Msg:LocalizedLanguage.barcodenotfound});
                                    showModal('commonInfoPopup');                                   
                                }
                            }
                        }
                    }

                }
            }
        //});
    }

    handleError(err) {
        console.error(err)
    }
    componentWillReceiveProps(recieveProps) {
        const { get_tax_rates, multiple_tax_support } = recieveProps;
        if (multiple_tax_support && multiple_tax_support == true) {
            var taxList = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [];
            if ((typeof taxList !== 'undefined') && taxList !== null && taxList && taxList.length > 0) {
                var taxData = [];
                taxList && taxList.length > 0 && taxList.map(rate => {
                    taxData.push({
                        check_is: rate.check_is,
                        TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                        TaxName: rate.TaxName ? rate.TaxName : '',
                        TaxId: rate.TaxId ? rate.TaxId : '',
                        Country: rate.Country ? rate.Country : '',
                        State: rate.State ? rate.State : '',
                        TaxClass: rate.TaxClass ? rate.TaxClass : ''
                    })
                })
                localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(taxData))
            } else {
                localStorage.setItem('DEFAULT_TAX_STATUS', 'true')
                var taxData = [];
                var inactiveTaxData = [];
                if (get_tax_rates && get_tax_rates.length > 0) {
                    get_tax_rates && get_tax_rates.length > 0 && get_tax_rates.map(rate => {
                        taxData.push({
                            check_is: true,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : ''
                        })
                        inactiveTaxData.push({
                            check_is: false,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : ''
                        })
                    })
                    // localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(inactiveTaxData))
                    // localStorage.setItem('APPLY_DEFAULT_TAX', JSON.stringify(taxData))
                    // if (!localStorage.getItem("SELECTED_TAX")) {
                    //     localStorage.setItem("SELECTED_TAX", JSON.stringify(inactiveTaxData));
                    // }
                    localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(inactiveTaxData))
                    if (!localStorage.getItem("SELECTED_TAX")) {
                        localStorage.setItem("SELECTED_TAX", JSON.stringify(inactiveTaxData));
                    }
                    //Update by Nagendra: Remove the tax which has same priority and lower rate, only for default tax..................................
                    taxData && taxData.length > 0 && taxData.map(rate => {
                        var duplicateArr = taxData.filter((ele, index) =>  ele.TaxClass == rate.TaxClass && ele.Priority == rate.Priority && ele.TaxClass == "");
                        if (duplicateArr && duplicateArr.length > 0) {                            
                            duplicateArr.map(dup => {
                                if (rate.TaxId < dup.TaxId) {
                                    taxData.splice(taxData.indexOf(dup), 1);
                                }
                            });
                        
                             if (taxData && taxData.length > 0) {                               
                                var taxfilterData = taxData.filter((ele, index) =>  ele.TaxClass == "");
                                if (taxfilterData) {
                                    taxData = taxfilterData;
                                }
                            }
                     
                            //..............................................................................
                        }
                    })
                    // taxData && taxData.length > 0 && taxData.map(rate => {
                    //     var duplicateArr = taxData.filter((ele, index) => ele.TaxId !== rate.TaxId && ele.Priority == rate.Priority && ele.TaxClass == "");
                    //     if (duplicateArr && duplicateArr.length > 0) {
                    //         duplicateArr && duplicateArr.length > 0 && duplicateArr.map(dup => {
                    //             if (parseFloat(rate.TaxRate.replace("%", '')) > parseFloat(dup.TaxRate.replace("%", ''))) {
                    //                 taxData.splice(taxData.indexOf(dup), 1);
                    //             }
                    //         });
                    //         //Apply only single default tax rate which have Priority One.
                    //         if (duplicateArr && duplicateArr.length == 1) {
                    //             taxData = duplicateArr;
                    //         }
                    //         else if (taxData && taxData.length > 1) {
                    //             var taxfilterData = taxData.filter((ele, index) => ele.Priority == 1 && ele.TaxClass == "");
                    //             if (taxfilterData) {
                    //                 taxData = taxfilterData;
                    //             }
                    //         }
                    //     }
                    // })
                    localStorage.setItem('APPLY_DEFAULT_TAX', JSON.stringify(taxData));
                }
            }
        } else if (multiple_tax_support == false) {
            var taxList = localStorage.getItem('TAXT_RATE_LIST') ? JSON.parse(localStorage.getItem('TAXT_RATE_LIST')) : [];
            if (taxList && taxList.length == 0) {
                localStorage.setItem('DEFAULT_TAX_STATUS', 'true');
                var taxData = [];
                if (get_tax_rates && get_tax_rates.length > 0) {
                    get_tax_rates && get_tax_rates.length > 0 && get_tax_rates.map(rate => {
                        taxData.push({
                            check_is: true,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : '',
                            Priority: rate.Priority ? rate.Priority : ''
                        })
                    })
                    var taxRateListIs = []
                    taxRateListIs.push(taxData[0]);
                    localStorage.setItem('APPLY_DEFAULT_TAX', JSON.stringify(taxData))
                    localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(taxRateListIs))
                }
            }
        }
        if (recieveProps.get_single_inventory_quantity) {
            this.invetoryUpdate(false)
        }
        if (recieveProps.cartproductlist && recieveProps.cartproductlist.length > 3) {
            //this applying on many places thats way I commit because it conflict on many place...
            //  do not take any id of  mCSB  "Plugin of overflow". 
            // setTimeout(function () {
            //     $("#mCSB_4").animate({
            //         scrollTop: $('#mCSB_4').get(0).scrollHeight
            //     }, 2000);
            // }, 300)
        }
        // add productX discount in cart
        if (recieveProps.single_product) {
            if (recieveProps.single_product && recieveProps.single_product.WPID && this.state.isProductxDiscount == true) {
                this.addProductXtoCart(this.state.productXQantity, recieveProps.single_product)
            }
        }
    }

    componentWillMount() {
        localStorage.removeItem("CHECKLIST");
        localStorage.removeItem("VOID_SALE");
        if (!localStorage.getItem('user'))// || !sessionStorage.getItem("issuccess")) 
        {
            // history.push('/loginpin');
            redirectToURL()
        }
        setTimeout(() => {
            this.setState({
                loading: true
            })
        }, 500);
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 500);

        var Register_Permissions = localStorage.getItem("RegisterPermissions") ? JSON.parse(localStorage.getItem("RegisterPermissions")) : [];
        //var register_content = Register_Permissions ? Register_Permissions.content : '';
        // console.log("register_content", register_content);
        var banner_image = '';
        if (Register_Permissions) {
            Register_Permissions.content && Register_Permissions.content.map(permission => {
                if (permission && permission.slug == "main-banner") {
                    banner_image = permission.value;
                }
            })
        }

        //Check for if image url exist and image exist on that URL------------ 
        if (banner_image != '') {
            const handelImage = (val) => {
                this.setState({ main_banner_image: val });
            }
            var image = new Image();
            image.onload = function () {
                // console.log("success")
                handelImage(banner_image);
            }
            image.onerror = function () {
                // console.log("Error")
                handelImage('');
            }
            if (banner_image && banner_image != '')
                image.src = banner_image;
        }
        //-----------------------------------------------------------------------
        var banners= getBanners(_key.DISPLAY_CUSTOM_HOMEPAGE_BANNER);	
        if(banners!=null && banners.Banners)
        {
            this.setState({banners:banners.Banners});
        }
        var catData = getCategories(_key.DISPLAY_CATEGORY_TILES);
        if(catData!=null && catData)
        {
            this.setState({categories:catData});
        }

    }

    onSinginselfcheckout()
    {
        if (isMobileOnly == true) { 
            $('#SignInMenu').addClass('show') 
        }
        else{
            $('#SignInMenu').modal('show');
        }
    }

    GetSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    handleClose() {
        $(".button_with_checkbox input").prop("checked", false);
        this.handleProductData(false);
        //this.props.handleSimpleProduct(false);
        if (this.state.getVariationProductData) {
            this.setState({
                showSelectStatus: false,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.state.getVariationProductData ? this.state.getVariationProductData.Title : '',
                variationId: 0,
                variationPrice: this.state.getVariationProductData ? this.state.getVariationProductData.Price : 0,
                //variationStockQunatity: this.props.getVariationProductData ?
                // (this.props.getVariationProductData.StockStatus == null || this.props.getVariationProductData.StockStatus == 'instock') && this.props.getVariationProductData.ManagingStock == false ? "Unlimited" : (typeof this.props.getVariationProductData.StockQuantity != 'undefined') && this.props.getVariationProductData.StockQuantity != '' ? this.props.getVariationProductData.StockQuantity : '0' : '0',
                variationImage: this.state.getVariationProductData ? this.state.getVariationProductData.ProductImage ? this.props.getVariationProductData.ProductImage : '' : '',
                // variationDefaultQunatity: 1 ? 1 : this.props.getVariationProductData ? this.props.getVariationProductData.DefaultQunatity : '',
                variationDefaultQunatity: 1,
                ManagingStock: this.state.getVariationProductData ? this.state.getVariationProductData.ManagingStock : null,
                filteredAttribute: [],
                filterTerms: [],
                old_price: this.state.getVariationProductData ? this.state.getVariationProductData.old_price : 0,
                incl_tax: this.state.getVariationProductData ? this.state.getVariationProductData.incl_tax : 0,
                excl_tax: this.state.getVariationProductData ? this.state.getVariationProductData.excl_tax : 0,
                showQantity: false,
                variationfound: null,
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
    handleProductData(productData) {
        // console.log("---handleProductData---"+JSON.stringify(productData))
        var filterdata = [];
        if (productData.item) {
            var variationProdect = this.state.AllProductList && this.state.AllProductList.filter(vitem => {
                return (vitem.ParentId === productData.item.Product_Id && (vitem.ManagingStock == false || (vitem.ManagingStock == true && vitem.StockQuantity > -1)))
            })
            productData.item['Variations'] = variationProdect;
            var filtered_data = this.state.AllProductList.sort(this.GetSortOrder("Title"));
            this.state.AllProductList && this.state.AllProductList.map(item => {
                if (item.ParentId == 0) {
                    if (productData.item.Product_Id == item.WPID) {
                        item['Variations'] = variationProdect;
                        filterdata.push(item)
                    }
                }
            })
        }
        var product = ''
        if (!productData.item) {
            product = productData;
        }
        this.setState({
            getVariationProductData: product ? product : filterdata[0],
            hasVariationProductData: true,
            getSimpleProductData: null,
            hasSimpleProductData: false,
        });
        this.state.getVariationProductData = product ? product : filterdata[0];
        this.state.hasVariationProductData = true;
        this.state.getSimpleProductData = null;
        this.state.hasSimpleProductData = false;
    }

    handletileFilterData(data, type, parent) {
        console.log("---handletileFilterData---"+JSON.stringify(data)+"--parent---"+JSON.stringify(parent))
        if(type!="product")
        {
            if(typeof data === 'object' && data !== null)
            {
                var titleName = data.Value;
                this.setState({favFilterPSelect:titleName});
            }
            else
            {
                if(this.state.favFilterPSelect!='')
                {
                    this.setState({showBackProduct:true});
                }
                this.setState({favFilterSelect:data});

            }
        }
        else if(data==null)
        {
            this.setState({favFilterSelect:'',favFilterPSelect:'',showBackProduct:false});

        }
        
        // console.log("loog", data);
       // this.tileProductFilter && this.tileProductFilter !== undefined && this.tileProductFilter.filterProductByTile(type, data, parent);
       if (this.tileProductFilter !== null && this.tileProductFilter !== undefined) {
            this.tileProductFilter.filterProductByTile(type, data, parent);
        }
    }

    handleNotification(data) {
        var notif_data = data
        this.setState({ notifyList: notif_data });
    }

    handleSimpleProduct(simpleProductData) {
        this.setState({
            getSimpleProductData: simpleProductData,
            hasSimpleProductData: true,
            getVariationProductData: null,
            hasVariationProductData: false
        })
    }

    handleTicketDetail(status, item) {
        if (status == 'create') {
            this.setState({ Ticket_Detail: item })
        } else if (status == 'edit') {
            this.setState({ Ticket_Detail: item })
        } else if (status == 'null') {
            this.setState({ Ticket_Detail: item })
        }
    }

    componentDidMount() {
        //call android function to get user--------
        androidGetUser();
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    checkInventoryData(productData) {
        this.setState({ inventoryCheck: productData })
        this.state.inventoryCheck = productData;
    }

    invetoryUpdate(st) { 
        this.setState({ isInventoryUpdate: st })
    }

    // showPopuponcartlistView(product, item) {
    //     this.handleSimpleProduct(product);
    //     if (isMobileOnly == true) {
    //         this.openModal("product_modal");
    //     }
    //     //$('#VariationPopUp').modal('show');
    //     showModal('VariationPopUp');
    // }
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
            localStorage.setItem("CART", JSON.stringify(data))
            localStorage.setItem("PRODUCT", JSON.stringify(product))
            localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(selectedProductData))
            this.props.dispatch(cartProductActions.singleProductDiscount(true));
        }
    }
    addProductXtoCart(productx_qty, single_product) {
        const { dispatch, showSelectedProduct } = this.props;
        //dispatch(cartProductActions.showSelectedProduct(this.state.cartlistSelected));
        var getVariationProductData = this.state.cartlistSelected;
        var taxType = typeOfTax();
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
        var productXItemTax = productXSingleData && productXSingleData.line_tax
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
            //Price: productXItemPrice ? productXItemPrice : 0, // add productX price directly from productX data
            Price: productXItemPrice ? taxType == 'incl' ? productXItemPrice + productXItemTax : productXItemPrice : 0, // add productX price directly from productX data
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
        if (parseInt(txtPrdQuantity) <= 0 && product.InStock == false ) {
            /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
            this.CommonMsg(LocalizedLanguage.productQty)
            showModal('common_msg_popup');
            return;
        }
        if ((product.StockQuantity == 'Unlimited' || product.InStock == true || qty <= product.StockQuantity)) {
            if (this.state.cartlistSelected && cartlist.length > 0) {
                var isItemFoundToUpdate = false;
                cartlist.map((item, index) => {
                    if (typeof this.state.cartlistSelected !== 'undefined' && this.state.cartlistSelected !== null) {
                        if(item.product_id == this.state.cartlistSelected.WPID)
                        {
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
    getCompositeExtensionFinished = (_jsonMsg) => {
        // $('#VariationPopUp').modal('hide');
        //  console.log("ExtensionFinished");
        hideModal('VariationPopUp');
        this.windowCloseEv.close();
        this.handleProductData(false);
        this.handleClose();
        localStorage.removeItem("oliver_pos_productx_cart_session_data");
        localStorage.removeItem("oliver_pos_productx_id");
    }
    compositeSwitchCases = (jsonMsg) => {
       var compositeEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (compositeEvent && compositeEvent !== '') {
            //console.log("compositeEvent", compositeEvent)
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
                    break;
                default:
                    break;
            }
        }
    }
    handleProductX(product, defaultqty)
    { 
        this.setState({ cartlistSelected : product, Prodefaultqty: defaultqty});
        this.props.dispatch(cartProductActions.showSelectedProduct(null));
        const { compositeSwitchCases } = this;
        this.windowCloseEv = callProductXWindow(product ? product : this.state.getVariationProductData);
        window.addEventListener('message', function (e) {
            var data = e && e.data;
            if (typeof data == 'string' && data !== "") {
                compositeSwitchCases(JSON.parse(data))
            }
        })
    }
    showPopuponcartlistView(product, item) {    
        var taglist = product.Tags ? product.Tags !== "" ? product.Tags.split(",") : null : null;
        if(product && product != undefined && product !== null && product.ParamLink !== null && (taglist !== null && taglist.includes('oliver_produt_x') == true) || (product.Type !== "simple" && product.Type !== "variable")) 
        { this.state.datetime=Date.now()
            // if((taglist && taglist !== null && taglist.includes('oliver_produt_x') == true)){ 
            //     localStorage.setItem("productSelected", JSON.stringify(product));
            //     this.state.datetime=Date.now()
            //      setTimeout(() => {
            //         showModal('VariationPopUp')
            //     }, 200);
            // }else{
                this.handleProductX(product);
            //}
            //  if ((taglist !== null && taglist.includes('oliver_produt_x') == true) || (product.Type !== "simple" && product.Type !== "variable")){
            //     this.handleProductX(product);
            // }
        }
        else {
          
            this.handleSimpleProduct(product);
            if (isMobileOnly == true) {
                this.openModal("product_modal");
            }
            showModal('VariationPopUp')
        }
    }

    CommonMsg(text) {
        this.setState({ common_Msg: text })
    }

    tileModalAddStatus(text, type, id, slug, positionIndex) {
        this.setState({ addFavouriteStatus: text })
        if (typeof type !== 'undefined' && typeof id !== 'undefined' && typeof slug !== 'undefined' && typeof positionIndex !== 'undefined') {
            this.props.dispatch(favouriteListActions.addToFavourite(type, id, slug, positionIndex));
        }
    }

    tilePosition(posIndex, favList) {
        if (isMobileOnly == true) {
            this.setState({ favList: favList })
        }
        this.setState({ posIndex: posIndex })
    }

    closeMsgModal() {
        if (isMobileOnly == true) {
            $('#common_msg_popup').removeClass('show');
        }
        this.setState({ common_Msg: '' })
    }

    openModal(st) {
        if(st == "")
        {
            this.setState({ cartViewForMobile: false })            
        }
        this.setState({ openModalActive: st })
    }
    
    searchOpen() {
        //androidSearchClick()
    }

    clearData() {
        $("#product_search_field").val('')
        $("#product_search_field_pro").val('')
        this.filterProduct()
    }

    filterProduct(style) {
        var input = '';
        if (style == "landscape")
            input = $("#product_search_field").val();
        if (style == "portrait")
            input = $("#product_search_field_pro").val();
            var value = getSearchInputLength(input.length)

        if (value == true || input.length == 0) {
            this.handletileFilterData(input, "product-search");
        }
    }

    CreateUserProfile() {
        showModal('createProfle');
    }

    componentDidUpdate(prevProps) {
        const { width, height } = this.props;
        if (width !== prevProps.width) {
            this.setState({
                pageWidth: width
            });
        }
        if (height !== prevProps.height) {
            this.setState({
                pageHeight: window.innerHeight
            });
       }
    }

    //Handling cancelEvent form Mobile click
    onCancelOrderHandler(item)
    {
        var Cartlist=localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        if(Cartlist !== null && Cartlist.length > 0){
            showModal('cancle');
        }
        else{
            this.onHandleEventofCancelOrderPopup(item);
        }
    }

    onHandleEventofCancelOrderPopup(item)
    {              
        if(item !== null && item == true)
        {
            const { dispatch } = this.props;
            localStorage.removeItem('CHECKLIST');
            localStorage.removeItem('oliver_order_payments');
            localStorage.removeItem('AdCusDetail');
            localStorage.removeItem('TIKERA_SELECTED_SEATS');
            localStorage.removeItem("CART");
            localStorage.removeItem('CARD_PRODUCT_LIST');
            localStorage.removeItem("PRODUCT");
            localStorage.removeItem("SINGLE_PRODUCT");
            localStorage.removeItem("PRODUCTX_DATA");
            dispatch(cartProductActions.addtoCartProduct(null));
        }
        if(isMobileOnly == true){
            history.push('../SelfCheckout');
        }
        else{
            window.location='../SelfCheckout';
        } 
    }
    
    viewOrderEvent()
    {
        this.setState({ cartViewForMobile: true });
    }
    gotoCheckout()
    {
        history.push("/SelfCheckout")
    }

    // handleCloseCommonPopup = ()=>{
    //     hideModal('commonInfoPopup');
    // }
    toggleApp =(a)=>
    {}

    GoBackhandleClick=()=> {
        // this.handletileFilterData(null, 'product', null)
        this.setState({favFilterSelect:'',favFilterPSelect:''});
      }
    /** 
     * Created By   : Aatifa
     * Created Date : 01-06-2020
     * Description  : show popup for choose seats.
     * Updated By   :
     * Updated Date :
     * Description  :
     **/
    render() {
        const { width } = this.props;
        const { getVariationProductData, getSimpleProductData, hasVariationProductData, hasSimpleProductData, openModalActive, AllProductList } = this.state;
    

        return (
            <div /*style={{padding: "35px 40px 0 40px",backgroundColor:'#f1f1f1'}}*/>
            <Navbar itemCount={this.props.cartproductlist?this.props.cartproductlist.length:''} catName={this.state.favFilterSelect} catPName={this.state.favFilterPSelect} GoBackhandleClick={this.GoBackhandleClick}></Navbar>
            {/* {this.state.main_banner_image && this.state.main_banner_image !== '' ? */}
            {this.state.favFilterSelect=='' && this.state.favFilterPSelect==''?
            <Carasoul banners={this.state.banners}></Carasoul>
            :null}
            {/* :''} */}
            <p className="section">{getTitle(_key.TITLE_FOR_CATEGORY_SECTION)}</p>
            <CategoriesList categories={this.state.categories} clearall={this.clearData} productData={this.handleProductData} tileFilterData={this.handletileFilterData}
            status={this.state.addFavouriteStatus} addStatus={this.tileModalAddStatus} msg={this.CommonMsg}
            tilePosition={this.tilePosition} isShopView={true}/>
            <p className="section">{getTitle(_key.TITLE_FOR_PRODUCT_SECTION)}</p>  
            <AllProduct categories={this.state.categories} showPopuponcartlistView={this.showPopuponcartlistView} showBackProduct={this.state.showBackProduct} productData={this.handleProductData} onRef={ref => (this.tileProductFilter = ref)} simpleProductData={this.handleSimpleProduct} msg={this.CommonMsg} ></AllProduct>
            <CartListView islandscape="false" simpleProductData={this.handleSimpleProduct}
                                        showPopuponcartlistView={this.showPopuponcartlistView}
                                        discountType={this.state.discountType}
                                        ticketDetail={this.handleTicketDetail}
                                        msg={this.CommonMsg}
                                        AllProductList={AllProductList} 
                                        style="landscape"/>
            {/* <TileModel status={this.tileModalAddStatus} msg={this.CommonMsg} positionNum={this.state.posIndex} />       */}
            <CommonProductPopupModal getQuantity={localStorage.getItem("CART_QTY")} isInventoryUpdate={this.state.isInventoryUpdate}
            inventoryData={this.checkInventoryData} getVariationProductData={getVariationProductData ? getVariationProductData :
            getSimpleProductData} hasVariationProductData={hasVariationProductData ? hasVariationProductData : hasSimpleProductData}
            msg={this.CommonMsg} handleSimpleProduct={this.handleSimpleProduct} productData={this.handleProductData} 
            datetime={this.state.datetime}/>
            <UpdateProductInventoryModal />
            <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
            <PopupDisplayMessage />
            
            {/* <CommonInfoPopup
                title = {LocalizedLanguage.noMatchingProductFound}
                subTitle = {this.state.common_Msg}
                buttonText = {LocalizedLanguage.continue}
                closeCommonPopup = {()=>this.handleCloseCommonPopup()}
                id = {'commonInfoPopup'}
                /> */}
                <ScreenSaver banners={this.state.banners}></ScreenSaver>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { authentication, favourites, get_single_inventory_quantity, get_tax_rates, single_product, multiple_tax_support } = state;
    return {
        authentication,
        favourites: favourites.items,
        get_single_inventory_quantity: get_single_inventory_quantity.items,
        get_tax_rates: get_tax_rates.items,
        multiple_tax_support: multiple_tax_support.items,
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
        single_product: single_product.items
    };
}
var connectedSelfCheckoutView = connect(mapStateToProps)(SelfCheckoutView);
connectedSelfCheckoutView = withResizeDetector(connectedSelfCheckoutView);
export { connectedSelfCheckoutView as SelfCheckoutView };