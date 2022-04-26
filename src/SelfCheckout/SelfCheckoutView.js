import React from 'react';
import { connect } from 'react-redux';
import { TileModel, NavbarPage, CommonProductPopupModal, CommonHeaderTwo, getTaxAllProduct, AllProduct, PopupShopStatus, CommonMsgModal, UpdateProductInventoryModal } from '../_components';
import { cartProductActions, cloudPrinterActions } from '../_actions'
import {  favouriteListActions } from '../ShopView/index';
import {FavouriteList} from '../SelfCheckout/components/FavouriteList';
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
import Carasoul from '../SelfCheckout/components/Carasoul'
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
            openModalActive: false,
            favList: "",
            main_banner_image: '',
            pageWidth: null,
            pageHeight: window.innerHeight,
            datetime:Date.now(),//to open product into iframe,
            favFilterSelect:'',
            favFilterPSelect:'',
            showBackProduct:false
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
        this.openModal = this.openModal.bind(this);
        this.clearData = this.clearData.bind(this);
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
        var register_content = Register_Permissions ? Register_Permissions.content : '';
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

        console.log("---handleProductData---"+JSON.stringify(productData))
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
                var titleName = 
                 data.attribute_slug ? data.attribute_slug 
                :data.parent_attribute ? data.attribute_slug + "/" + data.parent_attribute?data.parent_attribute.replace("pa_", "")
                :'' 
                : data.category_slug ? data.name 
                : data.Type ? data.Title 
                : ''
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
    userProfilePopup(){
        if (isMobileOnly == true) {
             $('#mobileSignIn').addClass('show') 
             showModal('mobileSignIn');
            //  $('#signInPopup').modal('show'); 
        }
        else{
            showModal('mobileSignIn');        
        }
    }

    createProfilePopup(){
        if (isMobileOnly == true) { $('#createProfle').addClass('show') }
        showModal('createProfle');
    }
    handleCloseCommonPopup = ()=>{
        hideModal('commonInfoPopup');
    }
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
        var height = this.state.pageHeight;
        const { getVariationProductData, getSimpleProductData, hasVariationProductData, hasSimpleProductData, openModalActive, AllProductList } = this.state;
        //    console.log("openModalActive",openModalActive)
        var isFavList = localStorage.getItem("favlist");
        var style = width > height ? "landscape" : "portrait";
        const registerPermisions = localStorage.getItem('RegisterPermissions') ? JSON.parse(localStorage.getItem('RegisterPermissions')) : '';
        const registerPermsContent = registerPermisions && registerPermisions.content;
        const showSearchBar = registerPermsContent && registerPermsContent.find(item => item.slug == "Show-Search-Bar");
        const showFavouriteTile = registerPermsContent && registerPermsContent.find(item => item.slug == "Show-Tile");
        return (
            // <div>{
            //     (openModalActive == "tile_modal" && isMobileOnly == true)?
            //     <TileModel
            //         {...this.props}
            //         {...this.state}
            //         openModal={this.openModal}
            //         status={this.tileModalAddStatus}
            //         msg={this.CommonMsg}
            //         positionNum={this.state.posIndex}
            //     />
            //     :
            //    (this.state.cartViewForMobile == true)?
            //     <CartListView islandscape="false" simpleProductData={this.handleSimpleProduct}
            //         showPopuponcartlistView={this.showPopuponcartlistView}
            //         discountType={this.state.discountType}
            //         ticketDetail={this.handleTicketDetail}
            //         msg={this.CommonMsg}
            //         openModal={this.openModal}
            //         onCancelOrderHandler ={this.onCancelOrderHandler}
            //         AllProductList={AllProductList}/>
            //     :
            //     (isMobileOnly == true) ?
            //         <div>
            //             <MobileShopView
            //                 {...this.props}
            //                 {...this.state}
            //                 NavbarPage={NavbarPage}
            //                 FavouriteList={FavouriteList}
            //                 handleProductData={this.handleProductData}
            //                 handletileFilterData={this.handletileFilterData}
            //                 tileModalAddStatus={this.tileModalAddStatus}
            //                 CommonMsg={this.CommonMsg}
            //                 tilePosition={this.tilePosition}
            //                 status={this.state.addFavouriteStatus}
            //                 tileFilterData={this.handletileFilterData}
            //                 addStatus={this.tileModalAddStatus}
            //                 msg={this.CommonMsg}
            //                 productData={this.handleProductData}
            //                 onRef={ref => (this.tileProductFilter = ref)}
            //                 simpleProductData={this.handleSimpleProduct}
            //                 showPopuponcartlistView={this.showPopuponcartlistView}
            //                 discountType={this.state.discountType}
            //                 ticketDetail={this.handleTicketDetail}
            //                 NotificationFilters={this.handleNotification}
            //                 searchProductFilter={this.handletileFilterData}
            //                 list={this.state.notifyList}
            //                 AllProduct={AllProduct}
            //                 openModal={this.openModal}
            //                 CommonHeaderTwo={CommonHeaderTwo}
            //                 viewOrderEvent={this.viewOrderEvent}
            //                 onEventHandling={this.onHandleEventofCancelOrderPopup}
            //                 onCancelOrderHandler={this.onCancelOrderHandler}
            //                 onSinginselfcheckout={this.onSinginselfcheckout}/>
            //             <MCancalOrderPopup onCancelEvent={this.onHandleEventofCancelOrderPopup}/>
            //             <WarningMessage msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal}/>
            //             <MCommonPopup userProfilePopup={this.userProfilePopup}
            //                         createProfilePopup={this.createProfilePopup}/>
            //             <CommonSelfcheckoutProductPopupModal isLoadingMore={false} getQuantity={localStorage.getItem("CART_QTY")} isInventoryUpdate={this.state.isInventoryUpdate}
            //                 inventoryData={this.checkInventoryData} getVariationProductData={getVariationProductData ? getVariationProductData :
            //                 getSimpleProductData} hasVariationProductData={hasVariationProductData ? hasVariationProductData : hasSimpleProductData}
            //                 msg={this.CommonMsg} handleSimpleProduct={this.handleSimpleProduct} productData={this.handleProductData} />
            //             <Singinselfcheckout/>                        
            //             <CreateProfile />
            //             <MobileSignInPopup />
            //             <MCancalOrderPopup onCancelEvent={this.onHandleEventofCancelOrderPopup}/>
            //             <MobilePopupDisplayMessage/>
            //         </div>
            //     :                    
            //         <div>                
            //         {(isFavList !== null && isFavList === 'true') ?
            //             <div>    
            //                 <div className="inner_content bg-light-white clearfix">
            //                     <div className="content_wrapper">                                    
            //                         <FavouriteList {...this.props} clearall={this.clearData} productData={this.handleProductData} tileFilterData={this.handletileFilterData}
            //                             status={this.state.addFavouriteStatus} addStatus={this.tileModalAddStatus} msg={this.CommonMsg}
            //                             tilePosition={this.tilePosition} isShopView={false}/>
            //                     </div>
            //                 </div>
            //             </div>
            //             :
            //             <div>
            //             {style && style=="portrait" &&
            //                 <div className="portrait">
            //                     <div className="self-checkout-home">
            //                         {this.state.main_banner_image && this.state.main_banner_image !== '' ?
            //                             <div className="self-checkout-header background-cover background-no-repeat">
            //                                 <img src={this.state.main_banner_image} className="img-reponsive object-fit h-100" alt="" />
            //                             </div>
            //                             :
            //                             ''}
            //                         <div className="self-checkout-content scroll-hidden">
            //                             <div className="self-checkout-grid pl-0">
            //                                     {showFavouriteTile && showFavouriteTile.value == 'true' &&
            //                                         <div className="self-checkout-scroll-1 overflowscroll">
            //                                             <FavouriteList clearall={this.clearData} productData={this.handleProductData} tileFilterData={this.handletileFilterData}
            //                                                 status={this.state.addFavouriteStatus} addStatus={this.tileModalAddStatus} msg={this.CommonMsg}
            //                                                 tilePosition={this.tilePosition} isShopView={true}/>
            //                                         </div>
            //                                     }
            //                                      <div className={showFavouriteTile && showFavouriteTile.value == 'true' ? "filter-pruduct h-100" : "filter-pruduct h-100 w-100"}>
            //                                         {showSearchBar && showSearchBar.value == 'true' &&
            //                                             <div className="widget-search"> 
            //                                                 <input type="search" id="product_search_field_pro" className="form-control" name="search" onChange={() => this.filterProduct(style)}
            //                                                     autoComplete="off" onClick={() => this.searchOpen()} placeholder={LocalizedLanguage.search} />
            //                                             </div>
            //                                         }
            //                                         <div className="self-checkout-scroll-2 overflowscroll">                                      
            //                                             <AllProduct productData={this.handleProductData} onRef={ref => (this.tileProductFilter = ref)} simpleProductData={this.handleSimpleProduct} msg={this.CommonMsg} 
            //                                             showPopuponcartlistView={this.showPopuponcartlistView} style={style}/>
            //                                         </div>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                         <div className="self-checkout-footer border-top border-width-1">
            //                             <CartListView islandscape="false" simpleProductData={this.handleSimpleProduct}
            //                                 showPopuponcartlistView={this.showPopuponcartlistView}
            //                                 discountType={this.state.discountType}
            //                                 ticketDetail={this.handleTicketDetail}
            //                                 msg={this.CommonMsg}
            //                                 AllProductList={AllProductList} 
            //                                 style="portrait"/>
            //                         </div>
            //                     </div>
            //                 </div>
            //             }   
            //             {style && style=="landscape" &&
            //                 <div className="landscape">
            //                     <div className="self-checkout-home">
            //                         <div className="self-checkout-content scroll-hidden">
            //                             <div className="self-checkout-grid pl-0">
            //                                     {showFavouriteTile && showFavouriteTile.value == 'true' &&
            //                                         <div className="self-checkout-scroll-1 overflowscroll">
            //                                             <div>
            //                                                 <FavouriteList clearall={this.clearData} productData={this.handleProductData} tileFilterData={this.handletileFilterData}
            //                                                     status={this.state.addFavouriteStatus} addStatus={this.tileModalAddStatus} msg={this.CommonMsg}
            //                                                     tilePosition={this.tilePosition} isShopView={true}/>
            //                                             </div>
            //                                         </div>
            //                                     }
            //                                          <div className={showFavouriteTile && showFavouriteTile.value == 'true' ? "filter-pruduct h-100" : "filter-pruduct h-100 w-100"}>
            //                                         {showSearchBar && showSearchBar.value == 'true' &&
            //                                             <div className="widget-search">                                     
            //                                             <input type="search" id="product_search_field" className="form-control" name="search" onChange={() => this.filterProduct(style)}
            //                                                 onClick={() => this.searchOpen()} placeholder={LocalizedLanguage.search} />
            //                                             </div>
            //                                         }
            //                                         <div className="self-checkout-scroll-22 overflowscroll scroll-auto">  
            //                                             <AllProduct productData={this.handleProductData} onRef={ref => (this.tileProductFilter = ref)} simpleProductData={this.handleSimpleProduct} msg={this.CommonMsg} 
            //                                             showPopuponcartlistView={this.showPopuponcartlistView} style={style}/>
            //                                         </div>
            //                                 </div>
            //                             </div>
            //                         </div>
                                    // <CartListView islandscape="false" simpleProductData={this.handleSimpleProduct}
                                    //     showPopuponcartlistView={this.showPopuponcartlistView}
                                    //     discountType={this.state.discountType}
                                    //     ticketDetail={this.handleTicketDetail}
                                    //     msg={this.CommonMsg}
                                    //     AllProductList={AllProductList} 
                                    //     style="landscape"/>
            //                     </div>
            //                 </div>               
            //             }
            //             </div>    
            //         }
            //         <TileModel status={this.tileModalAddStatus} msg={this.CommonMsg} positionNum={this.state.posIndex} />      
            //         <CommonProductPopupModal getQuantity={localStorage.getItem("CART_QTY")} isInventoryUpdate={this.state.isInventoryUpdate}
            //         inventoryData={this.checkInventoryData} getVariationProductData={getVariationProductData ? getVariationProductData :
            //         getSimpleProductData} hasVariationProductData={hasVariationProductData ? hasVariationProductData : hasSimpleProductData}
            //         msg={this.CommonMsg} handleSimpleProduct={this.handleSimpleProduct} productData={this.handleProductData} 
            //         datetime={this.state.datetime}/>
            //         <UpdateProductInventoryModal />
            //         <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
            //         <CommonInfoPopup
            //             title = {LocalizedLanguage.noMatchingProductFound}
            //             subTitle = {this.state.common_Msg}
            //             buttonText = {LocalizedLanguage.continue}
            //             closeCommonPopup = {()=>this.handleCloseCommonPopup()}
            //             id = {'commonInfoPopup'}
            //             />
            //         <PopupShopStatus/> 
            //         <CreateProfile/> 
            //         <Singinselfcheckout/> 
            //         <OnboardingShopViewPopup
            //             title={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_TITLE}
            //             subTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE}
            //             subTitle2={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE_TWO}
            //             onClickContinue={onBackTOLoginBtnClick}
            //             imageSrc={''}
            //             btnTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_BUTTON_TITLE}
            //             id={'firebaseRegisterAlreadyusedPopup'} />
            //         <PopupDisplayMessage />
            //     </div>
            //     }
            //     <MCancalOrderPopup onCancelEvent={this.onHandleEventofCancelOrderPopup}/>

            //     <BarcodeReader
            //             onError={this.handleScan}
            //             onScan={this.handleScan}
            //         />
            // { ActiveUser.key.isSelfcheckout !== true && isMobileOnly !== true && <TickitDetailsPopupModal Ticket_Detail={this.state.Ticket_Detail} openModal={this.openModal} />}
            // </div>
            <div style={{padding: "35px 40px 0 40px",backgroundColor:'#f1f1f1'}}>
            <Navbar itemCount={this.props.cartproductlist?this.props.cartproductlist.length:''} catName={this.state.favFilterSelect} catPName={this.state.favFilterPSelect} GoBackhandleClick={this.GoBackhandleClick}></Navbar>
            {/* {this.state.main_banner_image && this.state.main_banner_image !== '' ? */}
            {this.state.favFilterSelect=='' && this.state.favFilterPSelect==''?
            <Carasoul></Carasoul>
            :null}
            {/* :''} */}
            <p className="title margin-bottom-20">Menu Categories</p>
            <FavouriteList clearall={this.clearData} productData={this.handleProductData} tileFilterData={this.handletileFilterData}
            status={this.state.addFavouriteStatus} addStatus={this.tileModalAddStatus} msg={this.CommonMsg}
            tilePosition={this.tilePosition} isShopView={true}/>
            <p className="title margin-bottom-20">Menu Items</p>  
            <AllProduct showPopuponcartlistView={this.showPopuponcartlistView} showBackProduct={this.state.showBackProduct} productData={this.handleProductData} onRef={ref => (this.tileProductFilter = ref)} simpleProductData={this.handleSimpleProduct} msg={this.CommonMsg} ></AllProduct>
            
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
            
            {/* <CommonInfoPopup
                title = {LocalizedLanguage.noMatchingProductFound}
                subTitle = {this.state.common_Msg}
                buttonText = {LocalizedLanguage.continue}
                closeCommonPopup = {()=>this.handleCloseCommonPopup()}
                id = {'commonInfoPopup'}
                /> */}
                <div className="cover hide"></div>
    <div className="app nutrition-info hide">
        <div onClick={this.toggleApp('nutrition-info')} className="close">
            <svg width="23" height="23" viewBox="0 0 23 23">
                <path
                    d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z"
                    fill="#050505"
                />
            </svg>
        </div>
        <div className="row">
            <div className="icon">
                <svg width="39" height="44" viewBox="0 0 39 44">
                    <path
                        d="M11.8659 17.9405C11.9808 18.2862 11.9539 18.6634 11.7909 18.9893C11.628 19.3151 11.3424 19.563 10.9969 19.6785C10.5747 19.812 10.1831 20.0277 9.84466 20.3133C9.50625 20.5988 9.22771 20.9485 9.0251 21.3422C8.51635 22.302 8.1671 23.8805 8.48885 26.4572C8.52279 26.8135 8.41645 27.169 8.19245 27.4482C7.96845 27.7273 7.64443 27.9081 7.28924 27.9521C6.93405 27.9962 6.57569 27.9 6.29029 27.684C6.0049 27.468 5.81497 27.1493 5.76085 26.7955C5.3951 23.8722 5.73335 21.6695 6.5996 20.0497C7.4796 18.3997 8.81885 17.506 10.1279 17.0715C10.4736 16.9565 10.8508 16.9835 11.1766 17.1464C11.5025 17.3093 11.7504 17.5949 11.8659 17.9405ZM25.4344 3.17848C25.7672 3.0533 26.0387 2.804 26.1916 2.48295C26.3446 2.1619 26.3673 1.79406 26.2548 1.45667C26.1423 1.11928 25.9035 0.838589 25.5885 0.673535C25.2735 0.508481 24.9068 0.471903 24.5654 0.571482C21.9859 1.42948 20.3771 3.54698 19.4339 5.81573C19.3059 6.12237 19.1885 6.4333 19.0819 6.74798C18.5675 5.77229 17.9093 4.87955 17.1294 4.09973C16.0723 3.04045 14.8098 2.20857 13.4194 1.65525C12.029 1.10194 10.5402 0.83887 9.04435 0.882231C8.27828 0.903022 7.54927 1.21644 7.00712 1.75808C6.46497 2.29971 6.15087 3.02843 6.12935 3.79448C6.08599 5.31039 6.35734 6.81883 6.92627 8.2246C7.49521 9.63036 8.34937 10.9029 9.43485 11.962C7.12484 12.4624 5.0373 13.6931 3.48115 15.4722C1.925 17.2512 0.982926 19.4839 0.794354 21.84L0.777854 22.0435C0.414803 26.5733 1.38 31.1107 3.55535 35.1005L4.5426 36.91C4.5701 36.9567 4.5976 37.0035 4.6306 37.0475L7.3806 40.903C8.00388 41.7758 8.80983 42.5025 9.7424 43.0323C10.675 43.5621 11.7118 43.8823 12.7807 43.9708C13.8496 44.0593 14.9249 43.9138 15.9319 43.5445C16.9389 43.1752 17.8533 42.591 18.6116 41.8325C18.7281 41.716 18.8663 41.6236 19.0185 41.5605C19.1707 41.4975 19.3338 41.465 19.4985 41.465C19.6632 41.465 19.8263 41.4975 19.9785 41.5605C20.1306 41.6236 20.2689 41.716 20.3854 41.8325C21.1436 42.591 22.0581 43.1752 23.0651 43.5445C24.072 43.9138 25.1474 44.0593 26.2163 43.9708C27.2852 43.8823 28.322 43.5621 29.2546 43.0323C30.1871 42.5025 30.9931 41.7758 31.6164 40.903L34.3664 37.0502C34.3994 37.0053 34.4297 36.9585 34.4571 36.91L35.4416 35.1005C37.6179 31.1109 38.5841 26.5735 38.2219 22.0435L38.2054 21.84C38.0836 20.3217 37.6479 18.8452 36.9257 17.504C36.2036 16.1629 35.2107 14.9864 34.0102 14.049C32.8096 13.1116 31.4274 12.4337 29.9512 12.0584C28.475 11.683 26.9369 11.6184 25.4344 11.8685L20.8749 12.6275C20.9024 10.7547 21.2324 8.64823 21.9694 6.87173C22.7421 5.01548 23.8861 3.69548 25.4344 3.17848ZM15.9744 12.27L15.5509 12.1985C13.937 11.8864 12.454 11.097 11.2939 9.93248C10.4988 9.14008 9.87443 8.19329 9.45918 7.15043C9.04393 6.10758 8.8466 4.99074 8.87935 3.86873C8.88008 3.80503 8.90589 3.74418 8.9512 3.69939C8.9965 3.6546 9.05764 3.62948 9.12135 3.62948C10.2429 3.59711 11.3592 3.79462 12.4016 4.20986C13.4439 4.6251 14.3903 5.24928 15.1824 6.04398C16.8516 7.71323 17.6574 9.91598 17.5969 12.1077C17.5961 12.171 17.5707 12.2314 17.526 12.2761C17.4813 12.3208 17.4208 12.3463 17.3576 12.347C16.8952 12.3599 16.4325 12.3341 15.9744 12.27ZM15.0724 14.9072L15.5509 14.987L17.6904 15.3445C18.8884 15.5443 20.1113 15.5443 21.3094 15.3445L25.8854 14.58C27.0126 14.392 28.1665 14.4402 29.2741 14.7216C30.3817 15.003 31.4187 15.5114 32.3195 16.2147C33.2203 16.9179 33.9651 17.8006 34.5068 18.8068C35.0485 19.8131 35.3753 20.9208 35.4664 22.06L35.4801 22.2635C35.8001 26.2611 34.9476 30.2653 33.0271 33.786L32.0811 35.5185L29.3779 39.3025C28.9869 39.8504 28.4813 40.3067 27.8961 40.6394C27.3109 40.9721 26.6603 41.1733 25.9895 41.2291C25.3187 41.2848 24.6438 41.1937 24.0117 40.9622C23.3797 40.7306 22.8056 40.3641 22.3296 39.8882C21.5787 39.1374 20.5603 38.7156 19.4985 38.7156C18.4366 38.7156 17.4182 39.1374 16.6674 39.8882C16.1913 40.3641 15.6173 40.7306 14.9852 40.9622C14.3532 41.1937 13.6783 41.2848 13.0075 41.2291C12.3366 41.1733 11.686 40.9721 11.1009 40.6394C10.5157 40.3067 10.0101 39.8504 9.6191 39.3025L6.91585 35.5185L5.96985 33.786C4.04933 30.2653 3.19689 26.2611 3.51685 22.2635L3.53335 22.06C3.62444 20.9208 3.95119 19.8131 4.4929 18.8068C5.03461 17.8006 5.77945 16.9179 6.68021 16.2147C7.58098 15.5114 8.61802 15.003 9.72561 14.7216C10.8332 14.4402 11.9872 14.392 13.1144 14.58L15.0724 14.9072Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div className="col">
                <p>Nutritional Information</p>
                <div className="divider"></div>
            </div>
        </div>
        <img src="assets/image/Mary-Browns-Nutritional-Chart.png" alt="" />
    </div>
    <div className="app offers hide">
        <div onClick={this.toggleApp('offers')} className="close">
            <svg width="23" height="23" viewBox="0 0 23 23">
                <path
                    d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z"
                    fill="#050505"
                />
            </svg>
        </div>
        <div className="row">
            <div className="icon">
                <svg width="39" height="39" viewBox="0 0 39 39">
                    <path
                        d="M39 23.2841V36.6569C39 37.1636 38.7717 37.6495 38.3654 38.0078C37.9591 38.366 37.408 38.5673 36.8333 38.5673H2.16667C1.59203 38.5673 1.04093 38.366 0.634602 38.0078C0.228273 37.6495 0 37.1636 0 36.6569V23.2841C1.14927 23.2841 2.25147 22.8816 3.06413 22.1651C3.87679 21.4485 4.33333 20.4767 4.33333 19.4633C4.33333 18.45 3.87679 17.4782 3.06413 16.7616C2.25147 16.0451 1.14927 15.6426 0 15.6426V2.26977C0 1.7631 0.228273 1.27719 0.634602 0.918917C1.04093 0.560648 1.59203 0.359375 2.16667 0.359375H36.8333C37.408 0.359375 37.9591 0.560648 38.3654 0.918917C38.7717 1.27719 39 1.7631 39 2.26977V15.6426C37.8507 15.6426 36.7485 16.0451 35.9359 16.7616C35.1232 17.4782 34.6667 18.45 34.6667 19.4633C34.6667 20.4767 35.1232 21.4485 35.9359 22.1651C36.7485 22.8816 37.8507 23.2841 39 23.2841ZM34.6667 26.0829C33.3486 25.4123 32.2541 24.4475 31.4934 23.2854C30.7327 22.1233 30.3326 20.8051 30.3333 19.4633C30.3333 16.636 32.0753 14.1658 34.6667 12.8438V4.18017H4.33333V12.8438C6.92467 14.1658 8.66667 16.636 8.66667 19.4633C8.66667 22.2907 6.92467 24.7609 4.33333 26.0829V34.7465H34.6667V26.0829ZM13 8.00096H26V11.8218H13V8.00096ZM13 27.1049H26V30.9257H13V27.1049Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div className="col">
                <p>Offers</p>
                <div className="divider"></div>
            </div>
        </div>
        <div className="offers-bank">
            <img src="assets/image/offer1.png" alt="" />
            <img src="assets/image/offer1.png" alt="" />
            <img src="assets/image/offer1.png" alt="" />
            <img src="assets/image/offer1.png" alt="" />
            <img src="assets/image/offer1.png" alt="" />
            <img src="assets/image/offer1.png" alt="" />
        </div>
    </div>
    <div className="app loyalty hide">
        <div onClick={this.toggleApp('loyalty')} className="close">
            <svg width="23" height="23" viewBox="0 0 23 23">
                <path
                    d="M20.3714 23L11.5 14.1286L2.62857 23L0 20.3714L8.87143 11.5L0 2.62857L2.62857 0L11.5 8.87143L20.3714 0L23 2.62857L14.1286 11.5L23 20.3714L20.3714 23Z"
                    fill="#050505"
                />
            </svg>
        </div>
        <div className="row">
            <div className="icon">
                <svg width="53" height="51" viewBox="0 0 53 51">
                    <path
                        d="M52.7776 19.1512C52.5242 18.3627 52.0582 17.6598 51.4312 17.1204C50.8042 16.5811 50.0406 16.2263 49.225 16.0953L36.4267 14.0091L30.4938 2.44499C30.1159 1.7088 29.5431 1.09125 28.8383 0.660094C28.1335 0.228943 27.3239 0.000854492 26.4984 0.000854492C25.6729 0.000854492 24.8633 0.228943 24.1585 0.660094C23.4537 1.09125 22.8809 1.7088 22.503 2.44499L16.5701 14.0091L3.77201 16.0953C2.95722 16.2284 2.19469 16.5839 1.5681 17.123C0.94151 17.6621 0.475072 18.3639 0.219964 19.1514C-0.0351441 19.9389 -0.0690643 20.7817 0.121925 21.5873C0.312914 22.3928 0.721433 23.1301 1.30266 23.7181L10.4341 32.9513L8.45765 45.8047C8.33083 46.6234 8.43156 47.4612 8.74876 48.2262C9.06597 48.9912 9.58736 49.6536 10.2556 50.1406C10.9238 50.6275 11.713 50.9202 12.5363 50.9864C13.3597 51.0527 14.1853 50.8898 14.9223 50.5159L26.4984 44.6582L38.0748 50.5159C38.8119 50.8891 39.6373 51.0513 40.4603 50.9847C41.2834 50.9182 42.0722 50.6254 42.7402 50.1386C43.4082 49.6518 43.9295 48.9898 44.2469 48.2252C44.5643 47.4607 44.6656 46.6232 44.5395 45.8047L42.563 32.9513L51.6945 23.7181C52.2775 23.1312 52.6873 22.394 52.8785 21.588C53.0696 20.7819 53.0347 19.9386 52.7776 19.1512V19.1512ZM49.1857 21.2223L38.7988 31.7248L41.0473 46.3453C41.0752 46.5204 41.0542 46.6998 40.9867 46.8636C40.9191 47.0275 40.8077 47.1694 40.6646 47.2736C40.5216 47.3778 40.3526 47.4403 40.1764 47.4541C40.0002 47.4679 39.8235 47.4325 39.6661 47.3518L26.4984 40.6887L13.3306 47.352C13.1732 47.4327 12.9965 47.4681 12.8203 47.4543C12.6441 47.4405 12.4751 47.3781 12.3321 47.2738C12.189 47.1696 12.0776 47.0277 12.01 46.8639C11.9425 46.7 11.9215 46.5206 11.9494 46.3455L14.198 31.7248L3.81121 21.2222C3.68717 21.0965 3.60002 20.939 3.5593 20.7669C3.51857 20.5948 3.52585 20.4148 3.58033 20.2466C3.63482 20.0784 3.7344 19.9285 3.86818 19.8133C4.00196 19.6981 4.16478 19.622 4.33878 19.5935L18.8962 17.2205L25.6448 4.06673C25.7255 3.90939 25.8478 3.7774 25.9984 3.68524C26.149 3.59308 26.322 3.54433 26.4984 3.54433C26.6748 3.54433 26.8478 3.59308 26.9984 3.68524C27.149 3.7774 27.2713 3.90939 27.352 4.06673L34.1006 17.2205L48.658 19.5935C48.832 19.622 48.9948 19.6981 49.1286 19.8133C49.2624 19.9285 49.362 20.0784 49.4165 20.2466C49.471 20.4148 49.4782 20.5948 49.4375 20.7669C49.3968 20.939 49.3096 21.0965 49.1856 21.2222L49.1857 21.2223Z"
                        fill="white"
                    />
                </svg>
            </div>
            <div className="col">
                <p>Nutritional Information</p>
                <div className="divider"></div>
            </div>
        </div>
        <div className="col">
            <p>Scan your QR code below</p>
            <svg className="barcode" width="214" height="214" viewBox="0 0 214 214">
                <path
                    d="M80.25 48.15V80.25H48.15V48.15H80.25ZM96.3 32.1H32.1V96.3H96.3V32.1ZM80.25 133.75V165.85H48.15V133.75H80.25ZM96.3 117.7H32.1V181.9H96.3V117.7ZM165.85 48.15V80.25H133.75V48.15H165.85ZM181.9 32.1H117.7V96.3H181.9V32.1ZM117.7 117.7H133.75V133.75H117.7V117.7ZM133.75 133.75H149.8V149.8H133.75V133.75ZM149.8 117.7H165.85V133.75H149.8V117.7ZM117.7 149.8H133.75V165.85H117.7V149.8ZM133.75 165.85H149.8V181.9H133.75V165.85ZM149.8 149.8H165.85V165.85H149.8V149.8ZM165.85 133.75H181.9V149.8H165.85V133.75ZM165.85 165.85H181.9V181.9H165.85V165.85ZM203.3 53.5C197.415 53.5 192.6 48.685 192.6 42.8V21.4H171.2C165.315 21.4 160.5 16.585 160.5 10.7C160.5 4.815 165.315 0 171.2 0H203.3C209.185 0 214 4.815 214 10.7V42.8C214 48.685 209.185 53.5 203.3 53.5ZM214 203.3V171.2C214 165.315 209.185 160.5 203.3 160.5C197.415 160.5 192.6 165.315 192.6 171.2V192.6H171.2C165.315 192.6 160.5 197.415 160.5 203.3C160.5 209.185 165.315 214 171.2 214H203.3C209.185 214 214 209.185 214 203.3ZM10.7 214H42.8C48.685 214 53.5 209.185 53.5 203.3C53.5 197.415 48.685 192.6 42.8 192.6H21.4V171.2C21.4 165.315 16.585 160.5 10.7 160.5C4.815 160.5 0 165.315 0 171.2V203.3C0 209.185 4.815 214 10.7 214ZM0 10.7V42.8C0 48.685 4.815 53.5 10.7 53.5C16.585 53.5 21.4 48.685 21.4 42.8V21.4H42.8C48.685 21.4 53.5 16.585 53.5 10.7C53.5 4.815 48.685 0 42.8 0H10.7C4.815 0 0 4.815 0 10.7Z"
                    fill="#E6702A"
                />
            </svg>
            <img src="assets/image/arrow.gif" alt="" />
        </div>
    </div>
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