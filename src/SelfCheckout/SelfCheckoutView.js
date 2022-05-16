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
import { redirectToURL,getSearchInputLength, onBackTOLoginBtnClick,getHostURLsBySelectedExt } from '../_components/CommonJS';
import { OnboardingShopViewPopup } from '../onboarding/components/OnboardingShopViewPopup';
import ActiveUser from '../settings/ActiveUser';
import { callProductXWindow, sendMessageToComposite, getCompositeAddedToCart, getCompositeSetProductxData } from '../_components/CommonFunctionProductX';
import BarcodeReader from 'react-barcode-reader'
import moment from 'moment';
import { CommonInfoPopup } from '../_components/CommonInfoPopup';
import { TickitDetailsPopupModal } from '../_components/TickitDetailsPopupModal/TickitDetailsPopupModal';
import Navbar from '../SelfCheckout/components/Navbar';
import Carasoul from '../SelfCheckout/components/Carasoul';
import ScreenSaver from '../SelfCheckout/components/ScreenSaver';
import {_key,getTitle,getBanners,getCategories,setThemeColor,initDropDown,getApps} from '../settings/SelfCheckoutSettings';
import { selfCheckoutActions } from '../SelfCheckout/actions/selfCheckout.action';
import { CommonExtensionPopup } from '../_components/CommonExtensionPopup';
import { handleAppEvent } from '../ExtensionHandeler/commonAppHandler';

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
            categories:[],
            extHostUrl: '',
            extPageUrl: '',
            extensionIframe: false,
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
        setThemeColor();
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

        dispatch(selfCheckoutActions.get_selfcheckout_setting());

        //----------Fetch All product from indexDB--------------
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                this.setState({ AllProductList: [] });
            } else {
                var _productwithTax = getTaxAllProduct(val)
                this.setState({ AllProductList: _productwithTax });

                let searchDataNew=_productwithTax?_productwithTax.map(item=>item.Title):[];
                // let searchData = [
                //     "Plant 1",
                //     "Plant 2",
                //     "Plant 3",
                //     "Plant 4",
                //     "Plant 5",
                //     "Plant 6",
                //     "Ice",
                //     "Fire",
                //     "Air",
                //     "Earth",
                //     "Dragon",
                //     "Simpsons",
                //     "Covid Cure",
                // ];
                initDropDown(searchDataNew);
                
            }
        });
        //  dispatch(customerActions.getCountry())
        //  dispatch(customerActions.getState())
        //console.log("------THEME_SECONDARY_COLOR----"+  getTitle(_key.TITLE_FOR_CATEGORY_SECTION));
        // getApps(_key.HOME_PAGE);
        // getApps(_key.PRODUCT_PAGE);
        // getApps(_key.RECEIPT_PAGE);
        // getApps(_key.CHECKOUT_PAGE);
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
                        $("#product_search_field_pro").val(scanBarcode);
                        //$(".expand_search").toggleClass("expand_search_open");
                        $("#product_search_field_pro").focus();
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
                               
                                $("#product_search_field_pro").val(scanBarcode);
                               //$(".expand_search").toggleClass("expand_search_open");
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

        var _user = JSON.parse(localStorage.getItem("user"));
        // ************ Update _user.instance for local testing ************* //
        // _user.instance = window.location.origin
        // localStorage.setItem("user", JSON.stringify(_user));
        // ************ End ********* //
        window.addEventListener('message', (e) => {
            if (e.origin && _user && _user.instance && e.data && e.data !=="") {
                try {
                    var extensionData = typeof e.data == 'string' ? JSON.parse(e.data) : e.data;
                    if (extensionData && extensionData !== "" && extensionData.oliverpos) {
                        this.showExtention(extensionData);
                    }

                    // display app v1.0-------------------------------------
                    if (extensionData && extensionData !== "" ) {                
                      var appresponse=  handleAppEvent(extensionData,"ActivityView");
                      //console.log("appResponse1",appresponse)
                      if(appresponse){
                          if(this.setState.appreposnse !==appresponse){
                               this.setState({"appreposnse": appresponse});
                          }
                      
                      }
                    }
                    //----------------------------------------
                }
                catch (err) {
                    console.error('App Error : ', err)
                }
            }
        }, false);
    }
    extensionReady = () => {
        var clientJSON =
        {
            oliverpos:
            {
                event: "shareCheckoutData"
            },
            data:
            {
                orderData:
                {
                    
                }
            }
        };

        var iframex = document.getElementsByTagName("iframe")[0].contentWindow;
        iframex.postMessage(JSON.stringify(clientJSON), '*');
    }
    showExtention = (value) => {
        var jsonMsg = value ? value : '';
        var clientEvent = jsonMsg && jsonMsg !== '' && jsonMsg.oliverpos && jsonMsg.oliverpos.event ? jsonMsg.oliverpos.event : '';
        if (clientEvent && clientEvent !== '') {
             console.log("clientEvent----->", jsonMsg)
            switch (clientEvent) {
                case "extensionReady":
                    this.extensionReady()
                    break;
                // case "updateOrderStatus":
                //     this.updateOrderStatusExt(jsonMsg.data)
                //     break;
                // case "registerInfo":
                //     sendRegisterDetails()
                //     break;
                // case "clientInfo":
                //     sendClientsDetails()
                //     break;
                // case "tipInfo":
                //     sendTipInfoDetails()
                //     break;
                default: // extensionFinished
                    console.error('App Error : Extension event does not match ', jsonMsg);
                    break;
            }
        }
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
        //$("#product_search_field").val('')
        $("#product_search_field_pro").val('')
        this.filterProduct()
    }

    filterProduct() {
        var input = '';
        // if (style == "landscape")
        //     input = $("#product_search_field").val();
        // if (style == "portrait")
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
   
     // get extension pageUrl and hostUrl of current clicked extension
     showExtensionIframe = (ext_id) => { 
        // get host and page url from common fucnction   
        var data = getHostURLsBySelectedExt(ext_id)
        this.setState({
            extHostUrl: data ? data.ext_host_url : '',
           extPageUrl: data ? data.ext_page_url : ''
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
            <Navbar showExtensionIframe={this.showExtensionIframe} page={_key.HOME_PAGE} itemCount={this.props.cartproductlist?this.props.cartproductlist.length:''} catName={this.state.favFilterSelect} catPName={this.state.favFilterPSelect} GoBackhandleClick={this.GoBackhandleClick}></Navbar>
            {/* {this.state.main_banner_image && this.state.main_banner_image !== '' ? */}
            {this.state.favFilterSelect=='' && this.state.favFilterPSelect==''?
            <Carasoul banners={this.state.banners}></Carasoul>
            :null}
            {/* :''} */}
            <p className="section">Search for an item</p>
            <div className="search-dropdown m-b-35 selectable">
                <input type="text" placeholder="Type item name here" id="product_search_field_pro"/>
                <svg
                    className="left"
                    width="33"
                    height="34"
                    viewBox="0 0 33 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M22.8462 14.3403C22.8462 11.8944 21.9769 9.80213 20.2383 8.06355C18.4997 6.32497 16.4075 5.45568 13.9615 5.45568C11.5156 5.45568 9.42338 6.32497 7.6848 8.06355C5.94621 9.80213 5.07692 11.8944 5.07692 14.3403C5.07692 16.7862 5.94621 18.8785 7.6848 20.617C9.42338 22.3556 11.5156 23.2249 13.9615 23.2249C16.4075 23.2249 18.4997 22.3556 20.2383 20.617C21.9769 18.8785 22.8462 16.7862 22.8462 14.3403ZM33 30.8403C33 31.5278 32.7488 32.1227 32.2464 32.6251C31.744 33.1276 31.149 33.3788 30.4615 33.3788C29.7476 33.3788 29.1526 33.1276 28.6767 32.6251L21.8744 25.8427C19.5078 27.4821 16.8702 28.3018 13.9615 28.3018C12.0709 28.3018 10.2629 27.9349 8.53756 27.2012C6.8122 26.4674 5.32482 25.4758 4.07542 24.2264C2.82602 22.977 1.83443 21.4896 1.10066 19.7643C0.366887 18.0389 0 16.2309 0 14.3403C0 12.4497 0.366887 10.6417 1.10066 8.91631C1.83443 7.19095 2.82602 5.70357 4.07542 4.45417C5.32482 3.20478 6.8122 2.21319 8.53756 1.47941C10.2629 0.745641 12.0709 0.378754 13.9615 0.378754C15.8522 0.378754 17.6602 0.745641 19.3855 1.47941C21.1109 2.21319 22.5983 3.20478 23.8477 4.45417C25.0971 5.70357 26.0886 7.19095 26.8224 8.91631C27.5562 10.6417 27.9231 12.4497 27.9231 14.3403C27.9231 17.2489 27.1034 19.8866 25.4639 22.2532L32.2662 29.0554C32.7554 29.5446 33 30.1396 33 30.8403Z"
                        fill="var(--primary)"
                    />
                </svg>
                <svg
                    className="right"
                    width="52"
                    height="27"
                    viewBox="0 0 52 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M45.1497 3.25124C46.005 3.25124 46.8253 3.55388 47.4301 4.09259C48.0349 4.63129 48.3746 5.36194 48.3746 6.12378V20.4865C48.3746 21.2484 48.0349 21.979 47.4301 22.5177C46.8253 23.0564 46.005 23.3591 45.1497 23.3591H6.44995C5.59463 23.3591 4.77435 23.0564 4.16955 22.5177C3.56475 21.979 3.22498 21.2484 3.22498 20.4865V6.12378C3.22498 5.36194 3.56475 4.63129 4.16955 4.09259C4.77435 3.55388 5.59463 3.25124 6.44995 3.25124H45.1497ZM6.44995 0.378693C4.73932 0.378693 3.09875 0.983977 1.88915 2.06139C0.679547 3.1388 0 4.60009 0 6.12378L0 20.4865C0 22.0102 0.679547 23.4715 1.88915 24.5489C3.09875 25.6263 4.73932 26.2316 6.44995 26.2316H45.1497C46.8603 26.2316 48.5009 25.6263 49.7105 24.5489C50.9201 23.4715 51.5996 22.0102 51.5996 20.4865V6.12378C51.5996 4.60009 50.9201 3.1388 49.7105 2.06139C48.5009 0.983977 46.8603 0.378693 45.1497 0.378693H6.44995Z"
                        fill="#ABA7AF"
                    />
                    <path
                        d="M41.924 18.3321C41.924 18.1417 42.0089 17.959 42.1601 17.8243C42.3113 17.6896 42.5164 17.614 42.7302 17.614H44.3427C44.5565 17.614 44.7616 17.6896 44.9128 17.8243C45.064 17.959 45.1489 18.1417 45.1489 18.3321V19.7684C45.1489 19.9589 45.064 20.1415 44.9128 20.2762C44.7616 20.4109 44.5565 20.4865 44.3427 20.4865H42.7302C42.5164 20.4865 42.3113 20.4109 42.1601 20.2762C42.0089 20.1415 41.924 19.9589 41.924 19.7684V18.3321ZM41.924 12.587C41.924 12.3965 42.0089 12.2139 42.1601 12.0792C42.3113 11.9445 42.5164 11.8689 42.7302 11.8689H44.3427C44.5565 11.8689 44.7616 11.9445 44.9128 12.0792C45.064 12.2139 45.1489 12.3965 45.1489 12.587V14.0233C45.1489 14.2137 45.064 14.3964 44.9128 14.5311C44.7616 14.6658 44.5565 14.7414 44.3427 14.7414H42.7302C42.5164 14.7414 42.3113 14.6658 42.1601 14.5311C42.0089 14.3964 41.924 14.2137 41.924 14.0233V12.587ZM25.7991 12.587C25.7991 12.3965 25.884 12.2139 26.0352 12.0792C26.1864 11.9445 26.3915 11.8689 26.6053 11.8689H28.2178C28.4316 11.8689 28.6367 11.9445 28.7879 12.0792C28.9391 12.2139 29.024 12.3965 29.024 12.587V14.0233C29.024 14.2137 28.9391 14.3964 28.7879 14.5311C28.6367 14.6658 28.4316 14.7414 28.2178 14.7414H26.6053C26.3915 14.7414 26.1864 14.6658 26.0352 14.5311C25.884 14.3964 25.7991 14.2137 25.7991 14.0233V12.587ZM32.249 12.587C32.249 12.3965 32.334 12.2139 32.4852 12.0792C32.6364 11.9445 32.8414 11.8689 33.0553 11.8689H37.8927C38.1066 11.8689 38.3116 11.9445 38.4628 12.0792C38.614 12.2139 38.699 12.3965 38.699 12.587V14.0233C38.699 14.2137 38.614 14.3964 38.4628 14.5311C38.3116 14.6658 38.1066 14.7414 37.8927 14.7414H33.0553C32.8414 14.7414 32.6364 14.6658 32.4852 14.5311C32.334 14.3964 32.249 14.2137 32.249 14.0233V12.587ZM35.474 18.3321C35.474 18.1417 35.5589 17.959 35.7101 17.8243C35.8613 17.6896 36.0664 17.614 36.2802 17.614H37.8927C38.1066 17.614 38.3116 17.6896 38.4628 17.8243C38.614 17.959 38.699 18.1417 38.699 18.3321V19.7684C38.699 19.9589 38.614 20.1415 38.4628 20.2762C38.3116 20.4109 38.1066 20.4865 37.8927 20.4865H36.2802C36.0664 20.4865 35.8613 20.4109 35.7101 20.2762C35.5589 20.1415 35.474 19.9589 35.474 19.7684V18.3321ZM19.3491 12.587C19.3491 12.3965 19.4341 12.2139 19.5853 12.0792C19.7365 11.9445 19.9415 11.8689 20.1554 11.8689H21.7679C21.9817 11.8689 22.1868 11.9445 22.338 12.0792C22.4892 12.2139 22.5741 12.3965 22.5741 12.587V14.0233C22.5741 14.2137 22.4892 14.3964 22.338 14.5311C22.1868 14.6658 21.9817 14.7414 21.7679 14.7414H20.1554C19.9415 14.7414 19.7365 14.6658 19.5853 14.5311C19.4341 14.3964 19.3491 14.2137 19.3491 14.0233V12.587ZM12.8992 12.587C12.8992 12.3965 12.9841 12.2139 13.1353 12.0792C13.2865 11.9445 13.4916 11.8689 13.7054 11.8689H15.3179C15.5317 11.8689 15.7368 11.9445 15.888 12.0792C16.0392 12.2139 16.1241 12.3965 16.1241 12.587V14.0233C16.1241 14.2137 16.0392 14.3964 15.888 14.5311C15.7368 14.6658 15.5317 14.7414 15.3179 14.7414H13.7054C13.4916 14.7414 13.2865 14.6658 13.1353 14.5311C12.9841 14.3964 12.8992 14.2137 12.8992 14.0233V12.587ZM6.44922 12.587C6.44922 12.3965 6.53416 12.2139 6.68536 12.0792C6.83656 11.9445 7.04163 11.8689 7.25546 11.8689H8.86795C9.08178 11.8689 9.28685 11.9445 9.43805 12.0792C9.58925 12.2139 9.67419 12.3965 9.67419 12.587V14.0233C9.67419 14.2137 9.58925 14.3964 9.43805 14.5311C9.28685 14.6658 9.08178 14.7414 8.86795 14.7414H7.25546C7.04163 14.7414 6.83656 14.6658 6.68536 14.5311C6.53416 14.3964 6.44922 14.2137 6.44922 14.0233V12.587ZM41.924 6.84189C41.924 6.65143 42.0089 6.46876 42.1601 6.33409C42.3113 6.19941 42.5164 6.12375 42.7302 6.12375H44.3427C44.5565 6.12375 44.7616 6.19941 44.9128 6.33409C45.064 6.46876 45.1489 6.65143 45.1489 6.84189V8.27817C45.1489 8.46863 45.064 8.65129 44.9128 8.78597C44.7616 8.92065 44.5565 8.99631 44.3427 8.99631H42.7302C42.5164 8.99631 42.3113 8.92065 42.1601 8.78597C42.0089 8.65129 41.924 8.46863 41.924 8.27817V6.84189ZM35.474 6.84189C35.474 6.65143 35.5589 6.46876 35.7101 6.33409C35.8613 6.19941 36.0664 6.12375 36.2802 6.12375H37.8927C38.1066 6.12375 38.3116 6.19941 38.4628 6.33409C38.614 6.46876 38.699 6.65143 38.699 6.84189V8.27817C38.699 8.46863 38.614 8.65129 38.4628 8.78597C38.3116 8.92065 38.1066 8.99631 37.8927 8.99631H36.2802C36.0664 8.99631 35.8613 8.92065 35.7101 8.78597C35.5589 8.65129 35.474 8.46863 35.474 8.27817V6.84189ZM29.024 6.84189C29.024 6.65143 29.109 6.46876 29.2602 6.33409C29.4114 6.19941 29.6165 6.12375 29.8303 6.12375H31.4428C31.6566 6.12375 31.8617 6.19941 32.0129 6.33409C32.1641 6.46876 32.249 6.65143 32.249 6.84189V8.27817C32.249 8.46863 32.1641 8.65129 32.0129 8.78597C31.8617 8.92065 31.6566 8.99631 31.4428 8.99631H29.8303C29.6165 8.99631 29.4114 8.92065 29.2602 8.78597C29.109 8.65129 29.024 8.46863 29.024 8.27817V6.84189ZM22.5741 6.84189C22.5741 6.65143 22.659 6.46876 22.8102 6.33409C22.9614 6.19941 23.1665 6.12375 23.3803 6.12375H24.9928C25.2067 6.12375 25.4117 6.19941 25.5629 6.33409C25.7141 6.46876 25.7991 6.65143 25.7991 6.84189V8.27817C25.7991 8.46863 25.7141 8.65129 25.5629 8.78597C25.4117 8.92065 25.2067 8.99631 24.9928 8.99631H23.3803C23.1665 8.99631 22.9614 8.92065 22.8102 8.78597C22.659 8.65129 22.5741 8.46863 22.5741 8.27817V6.84189ZM16.1241 6.84189C16.1241 6.65143 16.2091 6.46876 16.3603 6.33409C16.5115 6.19941 16.7166 6.12375 16.9304 6.12375H18.5429C18.7567 6.12375 18.9618 6.19941 19.113 6.33409C19.2642 6.46876 19.3491 6.65143 19.3491 6.84189V8.27817C19.3491 8.46863 19.2642 8.65129 19.113 8.78597C18.9618 8.92065 18.7567 8.99631 18.5429 8.99631H16.9304C16.7166 8.99631 16.5115 8.92065 16.3603 8.78597C16.2091 8.65129 16.1241 8.46863 16.1241 8.27817V6.84189ZM6.44922 6.84189C6.44922 6.65143 6.53416 6.46876 6.68536 6.33409C6.83656 6.19941 7.04163 6.12375 7.25546 6.12375H12.0929C12.3068 6.12375 12.5118 6.19941 12.663 6.33409C12.8142 6.46876 12.8992 6.65143 12.8992 6.84189V8.27817C12.8992 8.46863 12.8142 8.65129 12.663 8.78597C12.5118 8.92065 12.3068 8.99631 12.0929 8.99631H7.25546C7.04163 8.99631 6.83656 8.92065 6.68536 8.78597C6.53416 8.65129 6.44922 8.46863 6.44922 8.27817V6.84189ZM6.44922 18.3321C6.44922 18.1417 6.53416 17.959 6.68536 17.8243C6.83656 17.6896 7.04163 17.614 7.25546 17.614H8.86795C9.08178 17.614 9.28685 17.6896 9.43805 17.8243C9.58925 17.959 9.67419 18.1417 9.67419 18.3321V19.7684C9.67419 19.9589 9.58925 20.1415 9.43805 20.2762C9.28685 20.4109 9.08178 20.4865 8.86795 20.4865H7.25546C7.04163 20.4865 6.83656 20.4109 6.68536 20.2762C6.53416 20.1415 6.44922 19.9589 6.44922 19.7684V18.3321ZM12.8992 18.3321C12.8992 18.1417 12.9841 17.959 13.1353 17.8243C13.2865 17.6896 13.4916 17.614 13.7054 17.614H31.4428C31.6566 17.614 31.8617 17.6896 32.0129 17.8243C32.1641 17.959 32.249 18.1417 32.249 18.3321V19.7684C32.249 19.9589 32.1641 20.1415 32.0129 20.2762C31.8617 20.4109 31.6566 20.4865 31.4428 20.4865H13.7054C13.4916 20.4865 13.2865 20.4109 13.1353 20.2762C12.9841 20.1415 12.8992 19.9589 12.8992 19.7684V18.3321Z"
                        fill="#ABA7AF"
                    />
                </svg>
                {/* <div className="option">Option 1</div>  */}
            </div>
            
           
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
            <div className="cover hide"></div>
            
            {/* <TileModel status={this.tileModalAddStatus} msg={this.CommonMsg} positionNum={this.state.posIndex} />       */}
            <CommonProductPopupModal showExtensionIframe={this.showExtensionIframe} itemCount={this.props.cartproductlist?this.props.cartproductlist.length:''} getQuantity={localStorage.getItem("CART_QTY")} isInventoryUpdate={this.state.isInventoryUpdate}
            inventoryData={this.checkInventoryData} getVariationProductData={getVariationProductData ? getVariationProductData :
            getSimpleProductData} hasVariationProductData={hasVariationProductData ? hasVariationProductData : hasSimpleProductData}
            msg={this.CommonMsg} handleSimpleProduct={this.handleSimpleProduct} productData={this.handleProductData} 
            datetime={this.state.datetime}/>
            <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
            <PopupDisplayMessage />
            <CommonExtensionPopup
                        showExtIframe={this.state.extensionIframe}
                        close_ext_modal={this.close_ext_modal}
                        extHostUrl={this.state.extHostUrl}
                        extPageUrl={this.state.extPageUrl}
                    />
            {/* <CommonInfoPopup
                title = {LocalizedLanguage.noMatchingProductFound}
                subTitle = {this.state.common_Msg}
                buttonText = {LocalizedLanguage.continue}
                closeCommonPopup = {()=>this.handleCloseCommonPopup()}
                id = {'commonInfoPopup'}
                /> */}
                <ScreenSaver banners={this.state.banners}></ScreenSaver>
                {
                    //Page Setup
                    setTimeout(() => {
                        scrollbarFix();
                        lastElemMargin(document.querySelector(".category-tile-container"), 5);
                        lastElemMargin(document.querySelector(".card-tile-container"), 4);
                        setItemsHeight();
                        scaleSVG();
                        scaleImages();
                        resize();
                    }, 1000)


                }
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