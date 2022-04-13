import React from 'react';
import { connect } from 'react-redux';
import { NavbarPage, CommonHeaderTwo, CustomerAddFee, CustomerNote, CommonProductPopupModal, getTaxAllProduct, SingleProductDiscountPopup, InventoryPopup, UpdateProductInventoryModal, TaxListPopup, CartListView, AllProduct, DiscountPopup, TileModel, LoadingModal, PopupShopStatus, CommonMsgModal, UserListComponents, NotificationComponents, NotesListComponents, DiscountMsgPopup, ProductAddFee, MultiTaxPopup } from '../_components';
import { FavouriteList, favouriteListActions } from './';
import { history } from '../_helpers';
import moment from 'moment';
import { cloudPrinterActions, taxRateAction,groupSaleAction } from '../_actions';
import {typeOfTax} from '../_components/TaxSetting'        
import { checkoutActions } from '../CheckoutPage';
import { get_UDid } from '../ALL_localstorage';
import { TickitDetailsPopupModal } from '../_components/TickitDetailsPopupModal/TickitDetailsPopupModal';
import { idbProductActions } from '../_actions/idbProduct.action';
import { customerActions } from '../CustomerPage';
import { TickitToRideModal } from '../_components/TickitDetailsPopupModal/TickitToRideModal';
import { BookedSeatPopup } from '../_components/TickitDetailsPopupModal/BookedSeatPopup';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import { isMobileOnly, isIOS } from "react-device-detect";
import MobileShopView from './views/mShopView';
import { MobilePopupDisplayMessage } from '../../src/SelfCheckout/components/SelfMobileView/mPopupDisplayMessage';
import WarningMessage from '../_components/views/m.WarningMessage';
import { ProductDetailModal } from '../_components/views/m.ProductDetailModal';
import { androidGetUser, androidDisplayScreen } from '../settings/AndroidIOSConnect'
import { DisplayProductDescModal } from "../_components/DisplayProductDescModal";
import { GTM_ClientDetail } from '../_components/CommonfunctionGTM';
import ActiveUser from '../settings/ActiveUser';
import $ from 'jquery';
import { OpeningFloatPopup } from '../CashManagementPage/components/OpeningFloatPopup';
import { CloseRegisterPopupTwo } from '../CashManagementPage/components/CloseRegisterPopupTwo'
import { refreshToggle } from '../_components/CommonFunction'
import { cashManagementAction } from '../CashManagementPage/actions/cashManagement.action';
import { PlanUpgradePopup } from '../_components/PlanUpgradePopup'
import { PopupDisplayMessage } from "../_components/views/PopupDisplayMessage";
import { OnBoardingAllModal } from '../onboarding'
import { cartProductActions } from '../_actions/cartProduct.action'
import { CommonDemoShopButton } from '../_components/CommonDemoShopButton';
import { OnboardingShopViewPopup } from '../onboarding/components/OnboardingShopViewPopup';
import CommonJs, { getHostURLsBySelectedExt, onBackTOLoginBtnClick, redirectToURL } from '../_components/CommonJS';
import { CommonConfirmationPopup } from '../_components/CommonConfirmationPopup';
import { callProductXWindow, sendMessageToComposite, getCompositeAddedToCart, getCompositeSetProductxData } from '../_components/CommonFunctionProductX';
import { trackPage } from '../_components/SegmentAnalytic'
import { CommonInfoPopup } from '../_components/CommonInfoPopup';
import Config from '../Config'
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { CommonExtensionPopup } from '../_components/CommonExtensionPopup';
import { handleAppEvent } from '../ExtensionHandeler/commonAppHandler';
import * as PageFunctions from "../appManager/PageFunctions"
import { TriggerCallBack } from '../appManager/FramManager';
import { GroupSaleModal } from '../_components/GroupSaleModal';
class ShopView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            incr: 1,
            productXQantity: 0,
            cartlistSelected : [],
            Prodefaultqty: 0,
            isProductxDiscount: false,
            drawerOpen: false,
            strProductX:"",
            commonInfoPopupTitle : '',
            extensionIframe: false, // extension state
            datetime:Date.now()//to open product into iframe
        }
        var windowCloseEv = null
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
        this.showOnboardingPopup = this.showOnboardingPopup.bind(this);
        this.hideOnboardingPopup = this.hideOnboardingPopup.bind(this);
        this.handleProductX = this.handleProductX.bind(this);
        this.handleProduxtWindow = this.handleProduxtWindow.bind(this);
        
        if (ActiveUser.key.isSelfcheckout == true) {
            history.push('/selfcheckout');
        }
        if (!localStorage.getItem('UDID')) {
            history.push('/login');
        }
        if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
           redirectToURL()
        }
        this.handletileFilterData = this.handletileFilterData.bind(this);
        var udid = get_UDid('UDID');
        const { dispatch } = this.props;
        const register_Id = localStorage.getItem('register');
        var demoUser = localStorage.getItem("demoUser") ? localStorage.getItem("demoUser") : false;
        var isFavListExist = localStorage.getItem("FAV_LIST_ARRAY") ? localStorage.getItem("FAVROUTE_LIST_ARRAY") ? true : false : false;
        if (isFavListExist == false && demoUser) {
            if (udid && register_Id) {
                this.props.dispatch(favouriteListActions.getAll(udid, register_Id));
            }
        }
        //----- update product qty-------------------------------------------------
        dispatch(idbProductActions.updateProductDB());
        dispatch(taxRateAction.getGetRates());
        dispatch(taxRateAction.getIsMultipleTaxSupport());
        dispatch(checkoutActions.getPaymentTypeName(udid, localStorage.getItem('register')));
        dispatch(checkoutActions.GetExtensions())
        var locationId = localStorage.getItem('Location')
        dispatch(cloudPrinterActions.getCloudPrinters(locationId))

        var user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        if(user && user.group_sales && user.group_sales !== null && user.group_sales !== "" && user.group_sales !== "undefined" ){
            dispatch(groupSaleAction.getTableRecord(locationId,user.group_sales_by));
        }

        
        
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
    }

    componentWillReceiveProps(recieveProps) {
        const { get_tax_rates, multiple_tax_support , single_product} = recieveProps;
        // add productX discount in cart
        if (single_product) {
            if (single_product && single_product.WPID && this.state.isProductxDiscount == true) {
                this.addProductXtoCart(this.state.productXQantity, single_product,JSON.stringify(this.state.strProductX))
            }
        }
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
                        TaxClass: rate.TaxClass ? rate.TaxClass : '',
                        Priority: rate.Priority ? rate.Priority : ''
                    })
                })
                localStorage.setItem('TAXT_RATE_LIST', JSON.stringify(taxData))
                setTimeout(function () {
                    //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
                    if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
                }, 500);
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
                            TaxClass: rate.TaxClass ? rate.TaxClass : '',
                            Priority: rate.Priority ? rate.Priority : ''
                        })
                        inactiveTaxData.push({
                            check_is: false,
                            TaxRate: rate.TaxRate ? rate.TaxRate : '0%',
                            TaxName: rate.TaxName ? rate.TaxName : '',
                            TaxId: rate.TaxId ? rate.TaxId : '',
                            Country: rate.Country ? rate.Country : '',
                            State: rate.State ? rate.State : '',
                            TaxClass: rate.TaxClass ? rate.TaxClass : '',
                            Priority: rate.Priority ? rate.Priority : ''
                        })
                    })
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
                    //         //..............................................................................
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
        if (recieveProps.cartproductlist && recieveProps.cartproductlist.length > 6) {
            if (ActiveUser.key.isSelfcheckout == true) {
                setTimeout(function () {
                    $("#mCSB_4").animate({
                        scrollTop: $(
                            '#mCSB_4').get(0).scrollHeight
                    }, 2000);
                }, 300)
            }
        }
        //  if (recieveProps.single_product) {
        //     if (recieveProps.single_product && recieveProps.single_product.WPID && this.state.isProductxDiscount == true) {
        //         this.addProductXtoCart(this.state.productXQantity, recieveProps.single_product,JSON.stringify(this.state.strProductX))
        //     }
        // }
    }
    componentWillUnmount = ()=> {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    componentWillMount() {
        var _checkList = (typeof localStorage.getItem("CHECKLIST") !== 'undefined') ? JSON.parse(localStorage.getItem("CHECKLIST")) : null;
        if ((!_checkList) || (_checkList && _checkList.order_id && _checkList.order_id == 0)) {
            localStorage.removeItem("CHECKLIST");
        }
        localStorage.removeItem("VOID_SALE");
        if (!localStorage.getItem('user') || !sessionStorage.getItem("issuccess")) {
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
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
            var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen");
            var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
            if (isDrawerOpen == "false" && client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true) {
                // showModal('OpeningFloat');
            }
        }, 600);
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
   // Update the actual qty of variations --------------------------
   updateActualStockQty(prd){  
      // console.log(prd)
       if(prd){
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
        }
    return prd;
}
//------------------------------------------------
    handleProductData(productData) {
        var filterdata = [];
        if (productData.item) {
            var variationProdect = this.state.AllProductList.filter(vitem => {
                return (vitem.ParentId === productData.item.Product_Id && (vitem.ManagingStock == false || (vitem.ManagingStock == true && vitem.StockQuantity > -1)))
            })
            if(variationProdect && variationProdect.length>0){
                variationProdect.map(item=>{
                    item=this.updateActualStockQty(item);
                })               
            }
           
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

        var _prd=product ? product : filterdata[0];
        _prd=this.updateActualStockQty(_prd);
        this.setState({
            getVariationProductData: _prd,
            hasVariationProductData: true,
            getSimpleProductData: null,
            hasSimpleProductData: false,
        });
        this.state.getVariationProductData = _prd;
        this.state.hasVariationProductData = true;
        this.state.getSimpleProductData = null;
        this.state.hasSimpleProductData = false;
    }
    handleProduxtWindow(){
      
       // this.windowCloseEv.removeclass("hidden")
        var product= JSON.parse(localStorage.getItem("productSelected"));
        
         this.windowCloseEv = callProductXWindow(product ? product : this.state.getVariationProductData);
       
         // window.addEventListener('message', function (e) {
        //     var data = e && e.data;
        //     if (typeof data == 'string' && data !== "") {
        //         compositeSwitchCases(JSON.parse(data))
        //     }
        // })
        hideModal('common_ext_popup');
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
        TriggerCallBack("product-detail",product)
       // addEventListener();
    //     //Display App to get productDetail--------------------------------------- 
    //     localStorage.setItem("productSelected", JSON.stringify(product));
    //     setTimeout(() => {
    //     var ext_Payment_Fields = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
    //     var extension_views_field = ext_Payment_Fields && ext_Payment_Fields.length > 0 && ext_Payment_Fields.filter(item => item.Name == 'getProductDetail')
    //     if(extension_views_field && extension_views_field.length>0){
    //         this.showExtensionIframe(extension_views_field[0].Id)
    //     } else{
    //         this.windowCloseEv = callProductXWindow(product ? product : this.state.getVariationProductData);
    //     }
    //     }, 100);
    //   //--------------------------------------------------------------------
    }

    handletileFilterData(data, type, parent) {
        if (this.tileProductFilter !== null && this.tileProductFilter !== undefined) {
            this.tileProductFilter.filterProductByTile(type, data, parent);
        }
    }

    handleNotification(data) {
        var notif_data = data
        this.setState({ notifyList: notif_data });
    }

    handleSimpleProduct(simpleProductData) {
        simpleProductData=this.updateActualStockQty(simpleProductData);
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

    // Show onboarding popup for demouser
    showOnboardingPopup=()=>{
        showModal('onBoardingPopupMain');
        localStorage.removeItem('showOnboardingPopup')
    }
    hideOnboardingPopup = () => {
        hideModal('onBoardingPopupMain');
    }

    componentDidMount() {
        androidDisplayScreen('', 0, 0, "cart");
        trackPage(history.location.pathname, "Shop View", "ShopView", "ShopView");
        if (localStorage.getItem('demoUser') == 'true' && localStorage.getItem('showOnboardingPopup') == 'true') {
            setTimeout(() => {
                // this.showOnboardingPopup()
            }, 500);
        }
        var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen");
        this.setState({ drawerOpen: isDrawerOpen })
        androidGetUser();
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined") { setHeightDesktop() };
        }, 1000);
        refreshToggle();
        GTM_ClientDetail();
        $('#closeRegister').on('click', function () {
            $('.flat-toggle.cm-flat-toggle').addClass("on");
            $('.cm-user-switcher .flat-toggle').find("span").addClass('open');
            $('.cm-user-switcher .flat-toggle').find("span").removeClass('close');
        });
        document.addEventListener("keydown", this._handleKeyDown)
        setTimeout(() => {
            this.props.dispatch(idbProductActions.updateProductDB());
        }, 200);       
                
        
    // For App extension-------------------------------
        // var _user = JSON.parse(localStorage.getItem("user"));
        // window.addEventListener('message', (e) => {
        //     if (e.origin && _user && _user.instance) {
        //         try {
        //              var extensionData = typeof e.data == 'string' ? JSON.parse(e.data) : e.data;
        //             // if (extensionData && extensionData !== "" && extensionData.oliverpos) {
        //             //     this.showExtention(extensionData);
        //             // }

        //             // display app v1.0-------------------------------------
        //             if (extensionData && extensionData !== "" ) {                
        //               var appresponse=  handleAppEvent(extensionData,"ShopView");
        //               console.log("appResponse1",appresponse)
        //               if(appresponse){
        //                   if(this.setState.appreposnse !==appresponse){
        //                        this.setState({"appreposnse": appresponse});
        //                   }
                      
        //               }
        //             }
        //             //----------------------------------------
        //         }
        //         catch (err) {
        //             console.error('App Error : ', err)
        //         }
        //     }
        // }, false);

         // ------------------------------
//          //Load backgroud apps into ifame------------------
//          var appFields=localStorage.getItem("GET_EXTENTION_FIELD");
//          appFields=appFields? JSON.parse(appFields):null;
//          if(appFields && appFields.length>0)
//          appFields.map(app=>{
//               if(PageFunctions.LoadIframs){
//                   if(app.PageUrl !=='ContactDetails'){
//                        PageFunctions.LoadIframs('./externalApp/bg_productApp.html');//app.PageUrl
//                   }
                
//              }
//          })
// //-------------------------------------------------
        window.addEventListener('message', (e) => {
            if (e.origin) {
                try {
                    if(e.data && window.location.pathname == '/shopview'){
                    var extensionData = typeof e.data == 'string' ? JSON.parse(e.data) : e.data;
                   if (extensionData && extensionData !== "" && extensionData.command !=="productDetail") {    //app version 1.0  // command =productDetail is used in productPopup               
                        handleAppEvent(extensionData,"Shop View", true);
                    }
                }
                }
                catch (err) {
                    console.error(err);
                }
            }
        }, false);
       
        
    }

    checkInventoryData(productData) {
        this.setState({ inventoryCheck: productData })
        this.state.inventoryCheck = productData;
    }

    invetoryUpdate(st) {
        this.setState({ isInventoryUpdate: st })
    }

    handleClose() {
        $(".button_with_checkbox input").prop("checked", false);
        this.handleProductData(false);
        if (this.state.getVariationProductData) {
            this.setState({
                showSelectStatus: false,
                hasVariationProductData: true,
                loadProductAttributeComponent: true,
                variationOptionclick: 0,
                variationTitle: this.state.getVariationProductData ? this.state.getVariationProductData.Title : '',
                variationId: 0,
                variationPrice: this.state.getVariationProductData ? this.state.getVariationProductData.Price : 0,
                variationImage: this.state.getVariationProductData ? this.state.getVariationProductData.ProductImage ? this.props.getVariationProductData.ProductImage : '' : '',
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

    addProductXDiscount() {
        var selectedProductData = this.state.cartlistSelected
        var productX_data = localStorage.getItem('PRODUCTX_DATA') && JSON.parse(localStorage.getItem('PRODUCTX_DATA'));       
        if (productX_data && selectedProductData) {
            var data = productX_data && productX_data.find(item => item.product_id == selectedProductData.WPID && item.strProductX == JSON.stringify(this.state.strProductX))
               var product = {
                type: 'product',
                discountType: data ? data.discount_type == "Percentage" ? 'Percentage' : 'Number' : '',
                discount_amount: data ? data.discount_amount : 0,
                Tax_rate: 0,
                Id: selectedProductData.WPID
            }
            // added price and old  price here for addons type productx 
            var selectedProductX = {...selectedProductData}
            var isProdAddonsType = CommonJs.checkForProductXAddons(selectedProductX.WPID);
            //if(isProdAddonsType && isProdAddonsType == true){  //update product old price and price with productx line_subtotal
                var taxType = typeOfTax();

            selectedProductX.Price = taxType == 'incl' ? (data.line_subtotal + data.line_tax)/ data.quantity : data.line_subtotal/ data.quantity
            selectedProductX.old_price = taxType == 'incl' ? (data.line_subtotal + data.line_tax) / data.quantity : data.line_subtotal / data.quantity

            localStorage.setItem("PRODUCT", JSON.stringify(product))
            localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(selectedProductX))
            this.props.dispatch(cartProductActions.singleProductDiscount(true,data.quantity));
        }
    }
    addProductXtoCart(productx_qty, single_product,_strProductX) {
        const { dispatch, showSelectedProduct } = this.props;
        var getVariationProductData = this.state.cartlistSelected;
        var taxType = typeOfTax();
        var ticket_Data = this.state.ticket_status == true ? localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '' : ''
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        var tick_data = getVariationProductData && getVariationProductData.TicketInfo ? JSON.parse(getVariationProductData.TicketInfo) : '';
        this.setState({ isProductxDiscount: false })
        var data = null;
        // test added


        
        var pro_id = getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0;
        var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0
        //
        // var isProductXupdate = false
       
        var SingleProduct = null;
        if (single_product && single_product.WPID) {
            if (single_product.WPID == getVariationProductData.WPID) {
                SingleProduct = single_product
            } else {
                SingleProduct = getVariationProductData
            }
        } else {
            if (cartlist.length > 0) {
                cartlist.map((prdId,index) => { 
                    if (prdId.product_id === getVariationProductData.WPID && getVariationProductData.selectedIndex ==index) {                       
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
                       
                        // test added 
                        // prodXData && prodXData.map((prodX)=>{
                        //     if(prodX && prodX.product_id == prdId.product_id){
                        //         // SingleProduct['quantity'] = productx_qty + prdId.quantity;
                        //         // isProductXupdate = true
                        //         productx_qty = productx_qty + prdId.quantity
                        //         prodX.quantity =  productx_qty
                        //     }
                        // }) 
                        // localStorage.setItem("PRODUCTX_DATA", JSON.stringify(prodXData))
                        //
                    }
                })
            }
        }
        // var pro_id = getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0;
        // var prodXData = localStorage.getItem("PRODUCTX_DATA") ? JSON.parse(localStorage.getItem("PRODUCTX_DATA")) : 0

        var productXSingleData = prodXData ? prodXData.find(prodX => prodX.product_id == pro_id &&  (_strProductX=="" || prodX.strProductX == _strProductX  )) : 0
        var productXItemPrice = productXSingleData && productXSingleData.line_subtotal
        var productXItemTax = productXSingleData && productXSingleData.line_tax
        data = {
            line_item_id: SingleProduct ? SingleProduct.line_item_id : 0,
            cart_after_discount: SingleProduct ? SingleProduct.cart_after_discount : 0,
            cart_discount_amount: SingleProduct ? SingleProduct.cart_discount_amount : 0,
            after_discount: SingleProduct ? SingleProduct.after_discount : 0,
            // after_discount: SingleProduct ? SingleProduct.after_discount : 0,
            discount_amount: SingleProduct ? SingleProduct.discount_amount : 0,
            product_after_discount: SingleProduct ? SingleProduct.product_after_discount : 0,
            product_discount_amount: SingleProduct ? SingleProduct.product_discount_amount : 0,
            quantity: productx_qty > 0 ? productx_qty : getVariationProductData.StockQuantity,
            Title: getVariationProductData && getVariationProductData !== undefined ? getVariationProductData.Title : "",
            Sku: getVariationProductData && getVariationProductData !== undefined ? getVariationProductData.Sku : "",
            //Price: productXItemPrice ? productXItemPrice : 0, // add productX price directly from productX data
            Price: productXItemPrice ? taxType == 'incl' ? productXItemPrice + productXItemTax : productXItemPrice : 0, // add productX price directly from productX data
            product_id: getVariationProductData && getVariationProductData.WPID ? getVariationProductData.WPID : getVariationProductData && getVariationProductData.product_id ? getVariationProductData.product_id : 0,
            variation_id: 0,
            isTaxable: getVariationProductData.Taxable,
            old_price: getVariationProductData.old_price,
            incl_tax: getVariationProductData.incl_tax,
            excl_tax: getVariationProductData.excl_tax,
            ticket_status: getVariationProductData.IsTicket,
            product_ticket: this.state.ticket_status == true && getVariationProductData.TicketInfo  ? getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo : '' : '',
            tick_event_id: getVariationProductData.IsTicket == true ? tick_data._event_name : null,
            discount_type: SingleProduct ? SingleProduct.discount_type : "",
            new_product_discount_amount: SingleProduct ? SingleProduct.new_product_discount_amount : 0,
            TaxStatus: getVariationProductData.TaxStatus,
            tcForSeating: getVariationProductData.tcForSeating,
            TaxClass: getVariationProductData.TaxClass,
            ticket_info: getVariationProductData && getVariationProductData.TicketInfo ? getVariationProductData.TicketInfo : [],
            Type: getVariationProductData && getVariationProductData.Type,
            strProductX: productXSingleData && productXSingleData.strProductX? productXSingleData.strProductX:""
        }
        var product = getVariationProductData
        var qty = 0;
        cartlist.map((item,index) => {
            if (product.WPID === item.product_id && index==product.selectedIndex) {
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
                        if(item.product_id == this.state.cartlistSelected.WPID && index==this.state.cartlistSelected.selectedIndex)
                        {
                            isItemFoundToUpdate = true;
                            cartlist[index] = data
                        }
                        // var _index = -1;
                        // if (this.state.cartlistSelected['selectedIndex'] >= 0) { _index = parseInt(this.state.cartlistSelected.selectedIndex) }
                        // if (_index > -1 && this.state.cartlistSelected.selectedIndex == index) {
                        //     isItemFoundToUpdate = true;
                        //     cartlist[index] = data
                        // }
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
    handleCloseCommonPopup = ()=>{
        hideModal('commonInfoPopup');
    }
    // addSimpleProducttoCart(product, ticketFields = null) {
    //     const { dispatch, checkout_list, cartproductlist } = this.props;
    //     var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
    //     if (cartlist && cartlist !== null && cartlist.length > 0) {
    //         cartlist.map(findId => {
    //             if (findId.product_id === product.WPID) {
    //                 product['after_discount'] = findId ? findId.after_discount : 0,
    //                     product['discount_amount'] = findId ? findId.discount_amount : 0,
    //                     product['product_after_discount'] = findId ? findId.product_after_discount : 0,
    //                     product['product_discount_amount'] = findId ? findId.product_discount_amount : 0,
    //                     product['discount_type'] = findId ? findId.discount_type : "",
    //                     product['new_product_discount_amount'] = findId ? findId.new_product_discount_amount : 0
    //             }
    //         });

    //     }
    //     var setQunatity = 1;
    //     var tick_data = product && product.IsTicket == true && product.TicketInfo != '' ? JSON.parse(product.TicketInfo) : '';
    //     var availability_to_date = tick_data && tick_data !== 'null' ? moment(tick_data._ticket_availability_to_date).format('YYYY-MM-DD') : ''
    //     var today_date = moment().format('YYYY-MM-DD')

    //     if (product && product.IsTicket == true && ticketFields == null) {
    //         var tick_type = 'simpleadd';
    //         this.getTicketFields(product, tick_type)
    //     }
    //     if (product && product.IsTicket == false) {
    //         var data = {
    //             line_item_id: 0,
    //             cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
    //             cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
    //             after_discount: product.after_discount ? product.after_discount : 0,
    //             discount_amount: product.discount_amount ? product.discount_amount : 0,
    //             product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
    //             product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
    //             quantity: setQunatity,
    //             Title: product.Title,
    //             Sku: product.Sku,
    //             Price: setQunatity * parseFloat(product.Price),
    //             product_id: product.WPID,
    //             variation_id: 0,
    //             isTaxable: product.Taxable,
    //             old_price: product.old_price,
    //             incl_tax: product.incl_tax,
    //             excl_tax: product.excl_tax,
    //             ticket_status: product.IsTicket,
    //             discount_type: product.discount_type ? product.discount_type : "",
    //             new_product_discount_amount: product ? product.new_product_discount_amount : 0,
    //             TaxStatus: product ? product.TaxStatus : "",
    //             TaxClass: product ? product.TaxClass : '',
    //         }
    //         var qty = 0;
    //         cartproductlist.map(item => {
    //             if (product.WPID == item.product_id) {
    //                 qty = item.quantity;
    //             }
    //         })
    //         //  add simple product with below condotions
    //         var product_is_exist = (product.ManagingStock == false && product.StockStatus == "outofstock") ? "outofstock" :
    //             (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? qty < product.StockQuantity : '0'
    //         if (product_is_exist == '0') {
    //             /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
    //             this.props.msg(LocalizedLanguage.productQty)
    //             //$('#common_msg_popup').modal('show');
    //             showModal('common_msg_popup');
    //             if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }

    //             return;
    //         }

    //         if (product_is_exist !== 'outofstock' && product_is_exist !== '0' && product_is_exist == true || product_is_exist == 'Unlimited') {
    //             cartlist.push(data);
    //             //Android Call----------------------------
    //             var totalPrice = 0.0;
    //             cartlist && cartlist.map(item => {
    //                 totalPrice += item.Price;
    //             })
    //             androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
    //             //-----------------------------------------
    //             this.stockUpdateQuantity(cartlist, data, product)
    //             dispatch(cartProductActions.addtoCartProduct(cartlist));
    //         } else {
    //             this.props.msg(LocalizedLanguage.productOutOfStock);
    //             //$('#common_msg_popup').modal('show');
    //             showModal('common_msg_popup');
    //             if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
    //         }
    //     }
    //     else if (product && product.IsTicket == true && ticketFields != null) {
    //         var TicketInfoForSeat = product && product.TicketInfo && JSON.parse(product.TicketInfo);
    //         var tcForSeating = TicketInfoForSeat ? TicketInfoForSeat : "";
    //         this.setState({ ticket_Product_status: false })
    //         var data = {
    //             line_item_id: 0,
    //             cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
    //             cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
    //             after_discount: product.after_discount ? product.after_discount : 0,
    //             discount_amount: product.discount_amount ? product.discount_amount : 0,
    //             product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
    //             product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
    //             quantity: setQunatity,
    //             Title: product.Title,
    //             Price: setQunatity * parseFloat(product.Price),
    //             product_id: product.WPID,
    //             variation_id: 0,
    //             isTaxable: product.Taxable,
    //             tick_event_id: tick_data._event_name,
    //             ticket_status: product.IsTicket,
    //             product_ticket: ticketFields,
    //             old_price: product.old_price,
    //             incl_tax: product.incl_tax,
    //             excl_tax: product.excl_tax,
    //             discount_type: product.discount_type ? product.discount_type : "",
    //             new_product_discount_amount: product ? product.new_product_discount_amount : 0,
    //             TaxStatus: product ? product.TaxStatus : "",
    //             tcForSeating: tcForSeating,
    //             TaxClass: product ? product.TaxClass : '',
    //         }

    //         var qty = 0;
    //         cartproductlist.map(item => {
    //             if (product.WPID == item.product_id) {
    //                 qty = item.quantity;
    //             }
    //         })

    //         //  add simple product with below condotions
    //         var product_is_exist = (product.ManagingStock == false && product.StockStatus == "outofstock") ? "outofstock" :
    //             (product.StockStatus == null || product.StockStatus == 'instock') && product.ManagingStock == false ? "Unlimited" : (typeof product.StockQuantity != 'undefined') && product.StockQuantity != '' ? qty < product.StockQuantity : '0'

    //         if (product_is_exist == '0') {
    //             /* Created By:priyanka,Created Date:14/6/2019,Description:quantity msg poppup */
    //             this.props.msg(LocalizedLanguage.productQty)
    //            // $('#common_msg_popup').modal('show');
    //            showModal('common_msg_popup');
    //             if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
    //             return;
    //         }

    //         if (product_is_exist !== 'outofstock' && product_is_exist !== '0' && product_is_exist == true || product_is_exist == 'Unlimited') {
    //             cartlist.push(data);
    //             //Android Call----------------------------
    //             var totalPrice = 0.0;
    //             cartlist && cartlist.map(item => {
    //                 totalPrice += item.Price;
    //             })
    //             androidDisplayScreen(data.Title, data.Price, totalPrice, "cart");
    //             //-----------------------------------------
    //             this.stockUpdateQuantity(cartlist, data, product)
    //             dispatch(cartProductActions.addtoCartProduct(cartlist));  // this.state.cartproductlist
    //         } else {
    //             this.props.msg(LocalizedLanguage.productOutOfStock);
    //            // $('#common_msg_popup').modal('show');
    //             showModal('common_msg_popup');
    //             if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
    //         }
    //     }
    // }


    /**
    * Created By: Shakuntala Jatav
    * Created Date : 12-02-2020
    * Description : get eExtensionFinished event for close modal. 
    */
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
        console.log("compositeEvent", jsonMsg)        
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
                        this.setState({ incr: 2, productXQantity: data.quantity, strProductX:data.strProductX });                       
                        if (data.discount_type !== '' && data.discount_amount && data.discount_amount !== '0' && data.discount_amount !== 0) {
                            this.setState({ isProductxDiscount: true })
                            this.addProductXDiscount()
                        }
                        else {
                           // var _productX=jsonMsg && jsonMsg.data && jsonMsg.data.product && jsonMsg.data.product[0];
                           //var _prdXItem='';
                           // for (var k in _productX) {
                           //     _prdXItem=_productX[k];
                           // }
                            this.addProductXtoCart(data.quantity,null, JSON.stringify(data.strProductX));
                           //this.addProductXtoCart(data.quantity);
                        }    
                    } 
                    if(typeof Android !== "undefined" && Android !== null && Android.getDatafromDevice("isWrapper")==true){
                        Android.removeAddOnPopup();
                        console.log("close popup from shopview.js")  
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

    showPopuponcartlistView(product, item) {    
        var taglist = product && product !== undefined ? product.Tags !== null && 
        product.Tags !== undefined ? product.Tags !== "" ? product.Tags.split(",") : null : null : null;
        var isProdX = false;
        if(product && product != undefined && product !== null && product.ParamLink !== null)
        { 
             if ((taglist !== null && taglist.includes('oliver_produt_x') == true) || (product.Type !== "simple" && product.Type !== "variable")){
                isProdX = true;
                localStorage.setItem("productSelected", JSON.stringify(product));
                // //for addon product product need to display iframe 
                // if((taglist && taglist !== null && taglist.includes('oliver_produt_x') == true)){ 
                //     this.state.datetime=Date.now()
                //      setTimeout(() => {
                //         showModal('VariationPopUp')
                //     }, 200);
                // }else{
                    this.handleProductX(product);
               // }
               
                
            }
        }
        if(product && isProdX !== true) {
            this.handleSimpleProduct(product);
            if (isMobileOnly == true) {
                this.openModal("product_modal");
            }
            this.state.datetime=Date.now()
            showModal('VariationPopUp')
        }
    }

    CommonMsg(text) {
        this.setState({ common_Msg: text })
    }
    commonInfoPopupMsg = (text)=> {
        this.setState({ commonInfoPopupTitle: text })
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
        this.setState({ openModalActive: st })
    }
    /** 
     * Created By   : Shakuntala Jatav
     * Created Date : 20-06-2019
     *  Description  : show popup for choose seats.
     *   
     *  Updated By   :
     *  Updated Date :
     *  Description :
     **/

    _handleKeyDown(e) {
        // console.log("keyCode", e.keyCode)
        if (e.keyCode == 76 && e.ctrlKey) {
            // $('#browser_version').modal('show')
            setTimeout(() => {
                showModal('redeem_confirmation');
            }, 500);
        }
    }
    close_confirm_modal = () => {
        console.log('-----closed modal--------');
    }

    okClick = () => {
        var user = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))
        if (user && user.user_email) {
            localStorage.removeItem(`TempOrders_${user.user_email}`)
            console.log('-----user removed----  TempOrders_', user.user_email);
        }
    }

//For Extension Popup -------------------------
    close_ext_modal = () => {
        this.setState({ extensionIframe: false })
        localStorage.removeItem("productSelected")
    }
     // *** activity extension code start *** ///
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
//------------------------------------------------
    render() {
        const { getVariationProductData, getSimpleProductData, hasVariationProductData, hasSimpleProductData, openModalActive, AllProductList } = this.state;
        var client = localStorage.getItem("clientDetail") ? JSON.parse(localStorage.getItem("clientDetail")) : '';
        var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")) : '';
        var isDemoUser = localStorage.getItem('demoUser') ? localStorage.getItem('demoUser') : false;
        var CashManagementId = localStorage.getItem('Cash_Management_ID') ? localStorage.getItem('Cash_Management_ID') : '';
         //console.log("getVariationProductData",getVariationProductData);
         //console.log("getSimpleProductData",getSimpleProductData);
        return (
            (isMobileOnly == true) ?
                <div>
                    {openModalActive == "product_modal" ?
                        <ProductDetailModal
                            {...this.props}
                            {...this.state}
                            getQuantity={localStorage.getItem("CART_QTY")}
                            isInventoryUpdate={this.state.isInventoryUpdate}
                            inventoryData={this.checkInventoryData}
                            getVariationProductData={getVariationProductData ? getVariationProductData : getSimpleProductData} hasVariationProductData={hasVariationProductData ? hasVariationProductData : hasSimpleProductData}
                            msg={this.CommonMsg}
                            openModal={this.openModal}
                            productData={this.handleProductData}
                        />
                        :
                        (openModalActive == "view_cart" || openModalActive == "notes" || openModalActive == "show_notes_popup") ?
                            <CartListView
                                simpleProductData={this.handleSimpleProduct}
                                showPopuponcartlistView={this.showPopuponcartlistView}
                                discountType={this.state.discountType}
                                ticketDetail={this.handleTicketDetail}
                                msg={this.CommonMsg}
                                openModal={this.openModal}
                                openModalActive={openModalActive}
                                AllProductList={AllProductList}
                                handleClose={this.handleClose}
                            />
                            :
                            openModalActive == "cart_discount" ?
                                <DiscountPopup
                                    openModal={this.openModal}
                                />
                                :
                                openModalActive == "cart_discount_fee" ?
                                    <ProductAddFee
                                        openModal={this.openModal}
                                        cartproductlist={this.props.cartproductlist}
                                        msg={this.CommonMsg}
                                    />
                                    :
                                    openModalActive == "tile_modal" ?
                                        <TileModel
                                            {...this.props}
                                            {...this.state}
                                            openModal={this.openModal}
                                            status={this.tileModalAddStatus}
                                            msg={this.CommonMsg}
                                            positionNum={this.state.posIndex}
                                        />
                                        :
                                        openModalActive == "tax_rate_list" ?
                                            <TaxListPopup
                                                openModal={this.openModal}
                                            />
                                            :
                                            openModalActive == "notification_view" ?
                                                <NotificationComponents
                                                    openModalActive={openModalActive}
                                                    openModal={this.openModal}
                                                />
                                                :

                                                openModalActive == "show_user_list" ?
                                                    <UserListComponents
                                                        openModal={this.openModal}
                                                    />
                                                    :
                                                    openModalActive == "ticket_modal_view" ?
                                                        <TickitDetailsPopupModal
                                                            Ticket_Detail={this.state.Ticket_Detail}
                                                            openModalActive={openModalActive}
                                                            openModal={this.openModal}
                                                        />
                                                        :
                                                        openModalActive == "ticket_ride_modal" ?
                                                            <TickitToRideModal
                                                                Ticket_Detail={this.state.Ticket_Detail}
                                                                openModal={this.openModal}
                                                            />
                                                            :
                                                            <MobileShopView
                                                                {...this.props}
                                                                {...this.state}
                                                                NavbarPage={NavbarPage}
                                                                FavouriteList={FavouriteList}
                                                                handleProductData={this.handleProductData}
                                                                handletileFilterData={this.handletileFilterData}
                                                                tileModalAddStatus={this.tileModalAddStatus}
                                                                CommonMsg={this.CommonMsg}
                                                                tilePosition={this.tilePosition}
                                                                status={this.state.addFavouriteStatus}
                                                                tileFilterData={this.handletileFilterData}
                                                                addStatus={this.tileModalAddStatus}
                                                                msg={this.CommonMsg}
                                                                productData={this.handleProductData}
                                                                onRef={ref => (this.tileProductFilter = ref)}
                                                                simpleProductData={this.handleSimpleProduct}
                                                                discountType={this.state.discountType}
                                                                ticketDetail={this.handleTicketDetail}
                                                                NotificationFilters={this.handleNotification}
                                                                searchProductFilter={this.handletileFilterData}
                                                                list={this.state.notifyList}
                                                                AllProduct={AllProduct}
                                                                openModal={this.openModal}
                                                                CommonHeaderTwo={CommonHeaderTwo} 
                                                                showPopuponcartlistView={this.showPopuponcartlistView}/>
                    }
                    <WarningMessage msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
                    <MobilePopupDisplayMessage />
                    {/* multi-tax-popup */}
                    <MultiTaxPopup />
                </div>
                :
                <div className="hide-overflow">
                    {this.state.loading == false ? !this.props.authentication && !this.props.authentication.user && this.props.authentication.loggedIn !== true
                        && !this.state.AllProductList || !this.props.favourites || this.props.favourites != "undefined" ? <LoadingModal /> : '' : ''}
                    <div className="wrapper">
                        <div className={client && client.subscription_permission && client.subscription_permission.AllowCashManagement == true && this.state.drawerOpen == 'false' && selectedRegister && selectedRegister.EnableCashManagement == true && CashManagementId == '' ? "overlay2" : "overlay"}></div>
                        {/* <div className="overlay"></div> */}
                        <NavbarPage {...this.props} />
                        <div id="content">
                            <CommonHeaderTwo {...this.props} NotificationFilters={this.handleNotification} searchProductFilter={this.handletileFilterData} productData={this.handleProductData} ticketDetail={this.handleTicketDetail} msg={this.CommonMsg} titleMsg={this.commonInfoPopupMsg} />
                            <div className="inner_content bg-light-white clearfix">
                                <div className="content_wrapper">
                                    <div className="col-lg-9 col-sm-8 col-xs-8 p-0">
                                        <FavouriteList productData={this.handleProductData} tileFilterData={this.handletileFilterData}
                                            status={this.state.addFavouriteStatus} addStatus={this.tileModalAddStatus} msg={this.CommonMsg}
                                            tilePosition={this.tilePosition} handleProductX={this.handleProductX} showPopuponcartlistView={this.showPopuponcartlistView}/>
                                        <div className="col-lg-4 col-md-5 col-sm-5 p-0 plr-8">
                                            <AllProduct productData={this.handleProductData} onRef={ref => (this.tileProductFilter = ref)} 
                                            simpleProductData={this.handleSimpleProduct} msg={this.CommonMsg} selectedProductData={ getSimpleProductData?getSimpleProductData:getVariationProductData } 
                                            showPopuponcartlistView={this.showPopuponcartlistView}/>
                                        </div>
                                    </div>
                                    <CartListView {...this.props} {...this.state} simpleProductData={this.handleSimpleProduct} showPopuponcartlistView={this.showPopuponcartlistView} 
                                     discountType={this.state.discountType} ticketDetail={this.handleTicketDetail} msg={this.CommonMsg} 
                                     AllProductList={AllProductList}  selectedProductData={ getSimpleProductData?getSimpleProductData:getVariationProductData }
                                     
                                     />  {/* Created By:Priyanka, Created Date :26-06-2019,Description:add all this components call listOption funtion click .  */}
                                    {/* Created By:Priyanka, Created Date :26-06-2019,Description:add all this components call listOption funtion click .  */}
                                    <div className="tab-content quick_menus">
                                        <UserListComponents />
                                        <NotificationComponents list={this.state.notifyList} />
                                        <NotesListComponents />
                                    </div>
                                </div>
                            </div>
                            {/* add connect your shop button for guest user */}
                            {isDemoUser && (isDemoUser == 'true' || isDemoUser == true) &&
                                <CommonDemoShopButton />
                            }
                            {/* end */}
                        </div>
                    </div>
                    {/* <!-------product list popup------------> */}
                    <TileModel status={this.tileModalAddStatus} msg={this.CommonMsg} positionNum={this.state.posIndex} />
                    <TickitDetailsPopupModal Ticket_Detail={this.state.Ticket_Detail} />
                    {/* modal for simple and variation popup*/}
                    <CommonProductPopupModal getQuantity={localStorage.getItem("CART_QTY")} isInventoryUpdate={this.state.isInventoryUpdate}
                        inventoryData={this.checkInventoryData} getVariationProductData={getVariationProductData ? getVariationProductData :
                            getSimpleProductData} hasVariationProductData={hasVariationProductData ? hasVariationProductData : hasSimpleProductData}
                        msg={this.CommonMsg} handleSimpleProduct={this.handleSimpleProduct} productData={this.handleProductData} 
                        datetime={this.state.datetime}/>
                    {/* for update invetory qunatity */}
                    <InventoryPopup inventoryCheck={this.state.inventoryCheck} isInventoryUpdate={this.invetoryUpdate}  isupdate={this.state.isInventoryUpdate} />
                    {/* modal close */}
                    <DiscountPopup />
                    <SingleProductDiscountPopup />
                    <DisplayProductDescModal getVariationProductData={getVariationProductData ? getVariationProductData : getSimpleProductData} />
                    <CommonMsgModal msg_text={this.state.common_Msg} close_Msg_Modal={this.closeMsgModal} />
                    <CommonInfoPopup
                        title = {this.state.commonInfoPopupTitle}
                        subTitle = {this.state.common_Msg}
                        buttonText = {LocalizedLanguage.continue}
                        closeCommonPopup = {()=>this.handleCloseCommonPopup()}
                        id = {'commonInfoPopup'}
                        />
                    <PopupShopStatus />
                    {/* apply discount through CommonProductPopupModal */}
                    <TickitToRideModal Ticket_Detail={this.state.Ticket_Detail} />
                    {/* modal close */}
                    <CustomerNote />
                    {/* open tax list */}
                    <TaxListPopup />
                    {/* modal close */}
                    <UpdateProductInventoryModal />
                    <DiscountMsgPopup />
                    <CustomerAddFee />
                    <BookedSeatPopup />
                    {/* multi-tax-popup */}
                    <MultiTaxPopup />
                    <OpeningFloatPopup />
                    <CloseRegisterPopupTwo />
                    <PlanUpgradePopup />
                    <PopupDisplayMessage />
                    <CommonConfirmationPopup close_confirm_modal={this.close_confirm_modal} msg_text='Are you Sure! You want to clear notifications?' okClick={this.okClick} />
                    <OnboardingShopViewPopup
                        title={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_TITLE}
                        subTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE}
                        subTitle2={ActiveUser.key.firebasePopupDetails.FIREBASE_POPUP_SUBTITLE_TWO}
                        onClickContinue={onBackTOLoginBtnClick}
                        imageSrc={''}
                        btnTitle={ActiveUser.key.firebasePopupDetails.FIREBASE_BUTTON_TITLE}
                        id={'firebaseRegisterAlreadyusedPopup'}
                    />
                    <OnBoardingAllModal />
                    <CommonExtensionPopup
                        showExtIframe={this.state.extensionIframe}
                        close_ext_modal={this.close_ext_modal}
                        extHostUrl={this.state.extHostUrl}
                        extPageUrl={this.state.extPageUrl}
                        handleProduxtWindow={this.handleProduxtWindow}
                    />
                    <GroupSaleModal  GroupSaleRecord={localStorage.getItem("GroupSaleRecord")? JSON.parse(localStorage.getItem("GroupSaleRecord")):null}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { single_product, authentication, favourites, get_single_inventory_quantity, get_tax_rates, multiple_tax_support, cashSummery } = state;
    return {
        authentication,
        favourites: favourites.items,
        get_single_inventory_quantity: get_single_inventory_quantity.items,
        get_tax_rates: get_tax_rates.items,
        multiple_tax_support: multiple_tax_support.items,
        single_product: single_product.items,
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
        cashSummery: cashSummery,
        single_product: single_product.items
    };
}
const connectedShopView = connect(mapStateToProps)(ShopView);
export { connectedShopView as ShopView };
