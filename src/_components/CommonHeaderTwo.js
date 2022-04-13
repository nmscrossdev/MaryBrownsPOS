import React from 'react';
import { connect } from 'react-redux';
import { allProductActions } from '../_actions'
import { cartProductActions } from '../_actions/cartProduct.action';
import BarcodeReader from 'react-barcode-reader'
import { get_UDid } from '../ALL_localstorage';
import { getTaxAllProduct } from './'
import { checkoutActions } from '../CheckoutPage/actions/checkout.action';
import { saveCustomerInOrderAction } from '../_actions'
import Config from '../Config';
import ActiveUser from '../settings/ActiveUser';
import { androidSearchClick } from '../settings/AndroidIOSConnect';
import moment from 'moment';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import Language from '../_components/Language';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { history } from '../_helpers';
import { refreshwebManu } from "./CommonFunction";
import { isMobileOnly,isSafari,isMobileSafari } from 'react-device-detect'
import $ from 'jquery';
import MobileSimpleHeader from './views/m.SimpleHeader';
import { androidDisplayScreen } from '../settings/AndroidIOSConnect';
import { redirectToURL, getSearchInputLength, checkForEnvirnmentAndDemoUser, checkOrderStatus} from './CommonJS';
import { LoadingModal } from './LoadingModal';

const { Email } = ActiveUser.key;


class CommonHeaderTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ItemCount: 0,
            input: '',
            activeFilter: true,
            result: 'No result',
            updateProductIs: false,
            CurrentUserActive: localStorage.getItem('user') ? (JSON.parse(localStorage.getItem('user'))) : '',
            noti_count: 0,
            notificat_status: false,
            ticket_Product_status: false,
            isSyncStart: false,
            isLoading : false,
            userList: localStorage.getItem('user_List') && typeof(localStorage.getItem('user_List')) !==undefined && localStorage.getItem('user_List')!=='undefined' && localStorage.getItem('user_List')!=='null' ?  localStorage.getItem('user_List') !==null && (JSON.parse(localStorage.getItem('user_List')).length > 1) ? true : false : false,
            checkOrderStatusIncr : 0,
            isTextPaste : false
        }
        this.filterProduct = this.filterProduct.bind(this)
        this.handleScan = this.handleScan.bind(this)
        this.clearSearchInput = this.clearSearchInput.bind(this)

    }
    // Created By   : Nagendra
    // created Date : 27/06/2019
    // Decription   : function used to call Api to and check the temp order status of given order
    // Modified By  : 
    // Modified Date: 
    // Decription   :   isTextPaste variable is handle the paste event into search box
    filterProduct(isTextPaste = false) {

        var input = $("#product_search_field").val();
        // if (/[^A-Za-z\d]/.test(input)) {
        //     this.props.msg('Please enter only letter and numeric characters');
        //     $("#product_search_field").val('');
        //     showModal('common_msg_popup');,
        // } else {
            // if (input.length >= Config.key.PRODUCT_SEARCH_LENGHT || input.length == 0) {
               
                if(isTextPaste == true){
                    this.setState({isTextPaste : true})
                }
               var value =  getSearchInputLength(input !== null ? input.length : false)
               value = this.state.isTextPaste == true ? true : value
            if (value == true|| input.length == 0) {
                this.props.searchProductFilter(input, "product-search");
                setTimeout(() => {
                    this.setState({isTextPaste : false})
                }, 500);
            }
            
        //}
    }

    componentWillUnmount = ()=> {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    removeCheckOutList() {
        const { dispatch } = this.props;

        var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
        if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
            this.setState({isLoading : true})
            var udid = get_UDid('UDID');
            this.props.dispatch(checkoutActions.orderToCancelledSale(checklist.order_id, udid));
            localStorage.removeItem('PENDING_PAYMENTS');
        }
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
    }

    componentDidMount() {
        var temp_Order = 'TempOrders_' + (Email);
        var TempOrders = localStorage.getItem(temp_Order) ? JSON.parse(localStorage.getItem(temp_Order)) : [];
        var count = 0
        TempOrders && TempOrders.map(list => {
            if (list.Status == "false") {
                count = count + 1;
            }

        })
        this.setState({ noti_count: count })
        // no need to repeat api call 
        //this.timer = setInterval(() => this.checkTempOrderSyncStatus(), 20000)
        //this.timer = setInterval(() => this.checkTempOrderSyncStatus(), 20000)
        //call API onec only 
        // setTimeout(function () {
        //     this.checkTempOrderSyncStatus();
        // }, 10000);
        var isValidENV = checkForEnvirnmentAndDemoUser()
        this.timer = setInterval(() => this.prepareNotificationList(), 2000)
        if(isValidENV == false){
            this.checkTempOrderSyncStatus();
            this.timer = checkOrderStatus() // no need to call interval.. calling this from willrecieveProps
            // this.timer = setInterval(() => checkOrderStatus(), 5000)
            // // this.timer = setInterval(() => this.reSyncOrder(), 1500)
            // // this.reSyncOrder();
        }else{
            var firebaseNotificationResCheck  = setInterval(() => {
                var TempOrders = localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${ActiveUser.key.Email}`)) : [];
                var tempOrderId = localStorage.getItem('tempOrder_Id') ? JSON.parse(localStorage.getItem('tempOrder_Id')) : ''
                TempOrders && TempOrders.map(ele => {
                // if (ele.TempOrderID == tempOrderId) {
                    if(ele.Status != "true"){
                        this.setState({checkOrderStatusIncr : this.state.checkOrderStatusIncr + 1})
                        if(this.state.checkOrderStatusIncr > Config.key.FIREBASE_NOTIFICATION_COUNT){
                            this.checkTempOrderSyncStatus();                 
                            checkOrderStatus()
                            clearInterval(firebaseNotificationResCheck)
                            // setInterval(() => checkOrderStatus(), 5000)
                        }
                    }

                // }
            });

            }, 1000);
            
        }

    }
    /**
     * Updated By :Shakuntala Jatav
     * Created date : 01-08-2019
     * Description : update temp order regard to email send when order suceessfully complete.
     */
    async prepareNotificationList() {
        const { NotificationFilters } = this.props;
        var temp_Order = 'TempOrders_' + (ActiveUser.key.Email);
        var TempOrders = localStorage.getItem(temp_Order) ? JSON.parse(localStorage.getItem(temp_Order)) : [];  //JSON.stringify
        var notificationlist = [];

        TempOrders && TempOrders.map(list => {
            if(list.new_customer_email !==""){
                var tempVar= TempOrders.find(l=> l.TempOrderID==list.TempOrderID && l.new_customer_email == "")
                if(tempVar){
                    list.order_status =tempVar.order_status
                    list.OrderID =tempVar.OrderID
                }
            }           
        })
        TempOrders && TempOrders.map(list => {
            var TempOrderID = list.TempOrderID
            var time = list.Status == "true" ? list.date : list.date;
            var title = // TO SEND EMAIL TO NEW ADDED CUSTOMER 
                list.Sync_Count > 1 && list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "EMAIL SENDING FAILED TO CUSTOMER"
                    : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "EMAIL SENDING TO CUSTOMER"
                        : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == true ? "EMAIL SENT TO CUSTOMER"
                            //title for  new order sync failed
                            : list.Status == "failed" && list.order_status == "completed" ? "NEW ORDER (#" + TempOrderID + ") SYNC ISSUE"
                                //NEW ORDER CREATED
                                : list.Status == "true" && list.order_status == "completed" ? "NEW ORDER CREATED IN WP"
                                    //REFUND
                                    : list.Status == "true" && list.order_status == "refunded" ? "ORDER REFUNDED  IN WP"
                                        : "CREATING ORDER IN WP"

            var description =  //dec for email send
                list.Sync_Count > 1 && list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "There was an issue to send email to customer for order#" + list.TempOrderID + ""
                    : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == false ? "Sending email to customer for order#" + list.TempOrderID + ""
                        : list.order_status == "completed" && list.new_customer_email !== "" && list.isCustomerEmail_send == true ? "Email sent succeessfully to customer for order#" + list.TempOrderID + ""
                            //dec for order syc failed
                            : list.Status == "failed" && list.order_status == "completed" ? "There was an issue syncing over please check your connection an try again later"
                                // desc for order sync completed 
                                : list.Status == "true" && list.order_status == "completed" ? "We Are Happy To Inform You That Oliver POS Has Just Created Order #" + list.TempOrderID + " For You."
                                    // desc for refund
                                    : list.Status == "true" && list.order_status == "refunded" ? "order  Refunded  successfully." : "Hang on tight for just a bit longer we are pushing the order to your webshop."
            var status = list.Status
            var Index = list.Index
            var OrderID = list.OrderID
            if(status == 'true' && OrderID){
                this.setState({isSyncStart:true})
            }

            var _order = {
                "time": time,
                "title": title,
                "description": description,
                "status": status,
                "Index": Index,
                "OrderID": OrderID,
                "TempOrderID": TempOrderID,
                "new_customer_email": list.new_customer_email,
                "isCustomerEmail_send": list.isCustomerEmail_send,
                "Sync_Count": list.Sync_Count
            }
            notificationlist.push(_order);
        })
        // console.log("notifyList", notificationlist);
        localStorage.setItem('notifyList', JSON.stringify(notificationlist))
        this.setState({ notifyList: localStorage.getItem('notifyList') ? JSON.parse(localStorage.getItem('notifyList')) : [] })
        NotificationFilters && NotificationFilters(this.state.notifyList)
    }
    checkTempOrderSyncStatus() {
        const { dispatch } = this.props;
        var udid = get_UDid('UDID');
        setTimeout(function () {
            var TempOrdersForSync = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : [];
            if (TempOrdersForSync && TempOrdersForSync.length > 0) {
                var TempOrders = TempOrdersForSync.filter(item => item.Status.toString() == "false" && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
                if (TempOrders && TempOrders.length > 0) {
                    var sortArr = TempOrders.sort(function (obj1, obj2) {
                        return obj1.Index - obj2.Index;
                    })
                    var syncOrderID = sortArr[0].TempOrderID;

                    if (syncOrderID && syncOrderID !== '') {
                        // console.log("checkTempOrderSync", syncOrderID)

                        dispatch(checkoutActions.checkTempOrderSync(udid, syncOrderID));
                    }
                }

                /// Sync for add new customer to order and send email to customer
                TempOrders = TempOrdersForSync.filter(item => item.new_customer_email !== "" && item.isCustomerEmail_send == false && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
                if (TempOrders && TempOrders.length > 0) {
                    var sortArr = TempOrders.sort(function (obj1, obj2) {
                        return obj1.Index - obj2.Index;
                    })
                    var syncOrderID = sortArr[0].TempOrderID;

                    //Sync_Count<=1 FOR ONLY ONE TIME EXCECUTION
                    // console.log("TempOrders[0].Sync_Count", TempOrders[0].Sync_Count)
                    if (syncOrderID && TempOrders[0].Sync_Count <= 1 && TempOrders[0].new_customer_email !== "" && TempOrders[0].isCustomerEmail_send == false) {
                        // console.log("Call email customer", TempOrders[0].Sync_Count)
                        dispatch(saveCustomerInOrderAction.saveCustomerToTempOrder(udid, syncOrderID, TempOrders[0].new_customer_email))
                    }

                }
            }
        }, 10000);
    }

    // async checkOrderStatus() {

    //     var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : [];
    //     if (TempOrders && TempOrders.length > 0) {
    //         TempOrders = TempOrders.filter(item => item.new_customer_email === "" && (item.OrderID == 0 || item.Status.toString() == "false" || item.Status.toString() == "failed") && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
    //         if (TempOrders && TempOrders.length > 0) {
    //             var sortArr = TempOrders.sort(function (obj1, obj2) {
    //                 return obj1.Index - obj2.Index;
    //             })
    //             var _OrderID = sortArr[0].OrderID;
    //             var syncTempOrderID = sortArr[0].TempOrderID;
    //             var udid = get_UDid('UDID');

    //             if (_OrderID == 0 && syncTempOrderID && syncTempOrderID !== '' && syncTempOrderID !== '0') {
    //                 // console.log("checkOrderStatus", syncTempOrderID)
    //                 // this.setState({ isSyncStart: true })
    //                 this.props.dispatch(checkoutActions.checkTempOrderStatus(udid, syncTempOrderID))

    //             }
    //         }
    //     }
    // }

    async reSyncOrder() {
        var TempOrders = localStorage.getItem(`TempOrders_${Email}`) ? JSON.parse(localStorage.getItem(`TempOrders_${Email}`)) : []; if (TempOrders && TempOrders.length > 0) {
            TempOrders = TempOrders.filter(item => item.new_customer_email === "" && item.Status.toString() == "false" && item.Sync_Count >= 15 && item.Sync_Count < Config.key.SYNC_COUNT_LIMIT);
            if (TempOrders && TempOrders.length > 0) {
                var sortArr = TempOrders.sort(function (obj1, obj2) {
                    return obj2.Sync_Count - obj1.Sync_Count;
                })
                var syncOrderID = sortArr[0].TempOrderID;
                var udid = get_UDid('UDID');
                if (syncOrderID && syncOrderID !== '')
                    this.props.dispatch(checkoutActions.recheckTempOrderSync(udid, syncOrderID));
            }
        }
    }

    handleItemCount() {
        this.setState({ discountAmount: amt, discountType: type });
        var CartItem = JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST"));
        if (CartItem!==null) {
            this.setState({ ItemCount: CartItem.length });
        }
    }

    clearInput() {
        this.filterProduct();
    }
    /**
     * Updated By :Shakuntala Jatav
     * Created date : 04-09-2019
     * Description : Add ticket input field by api .
     */
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
        if(data.length<3)
        return;
        if (data && data.IsTicket == true && ticketFields == null) {
            var tick_type = 'simpleadd';
            this.getTicketFields(data, tick_type)
        }
        this.setState({
            result: data,
        })
        var scanBarcode = data
        var productlist = [];
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            var _productwithTax = getTaxAllProduct(val)
            productlist = _productwithTax;
            this.setState({ productlist: _productwithTax });
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
                    this.props.productData(parentProduct[0]);
                    //$('#VariationPopUp').modal('show');
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
                                this.props.msg('Product is out of stock.');
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
                                    this.props.msg('Product is out of stock.');
                                    //$('#common_msg_popup').modal('show');
                                     showModal('common_msg_popup');
                                }
                            }
                            else {
                                if(scanBarcode){
                                    this.props.msg(LocalizedLanguage.barcodenotfound);
                                    this.props.titleMsg(LocalizedLanguage.noMatchingProductFound)
                                    showModal('commonInfoPopup');
                                    //$('#common_msg_popup').modal('show');//Product Not found
                                }
                            }
                        }
                    }

                }
            }
        });
    }

    handleError(err) {
        console.error(err)
    }

    componentWillReceiveProps(nextProps) {
        const { tick_type, ticket_Product_status, ticket_Product } = this.state;
        var ticket_Data = localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : ''
        var tick_data = ticket_Product_status == true ? JSON.parse(ticket_Product.TicketInfo) : ''
        var form_id = tick_data._owner_form_template
        if ((localStorage.getItem('ticket_list') && localStorage.getItem('ticket_list') !== 'null' && localStorage.getItem('ticket_list') !== '' && (typeof tick_type !== 'object') && ticket_Product_status == true && tick_type == 'simpleadd' && tick_type !== 'null') || (form_id == -1 || form_id == '' && ticket_Product_status == true && tick_type == 'simpleadd' && tick_type !== 'null' && (typeof tick_type !== 'object'))) {
            this.setState({ ticket_Product_status: false })
            if (typeof tick_type !== 'object') {
                this.handleScan(ticket_Product, localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '')
            }
        }

        // syncTemporderStatus : syncTemporder.items //.Content//OrderNumber   //items.IsSuccess
        if(nextProps && nextProps.syncTemporderStatus){
            if(nextProps.syncTemporderStatus.items && nextProps.syncTemporderStatus.items.content && nextProps.syncTemporderStatus.items.content.OrderNumber == 0){
               setTimeout(() => {
                this.setState({ isSyncStart: true })
                checkOrderStatus()
               }, 5000);
            }
        }
// 
    }

    updateProducts() {
        // window.location = '/loginpin'
        redirectToURL()
        // history.push('/loginpin');
    }

    updateCancelProducts() {
        // this.setState({updateProductIs:false})
        // this.state.updateProductIs = false
        // localStorage.removeItem('UPDATE_PRODUCT_LIST')
    }

    updateClassDeclaration() {
        $("#update_aria").attr("aria-expanded", "false");
    }
    /*Created By:Priyanka,Created Date : 26-06-2019,Description :listOption function  is used to open user list ,notificationlist and notes .
    */
    /*Modified By:Aman Singhai,
    Modified Date : 10-07-2020,
    Description :It was causing issue, not using this anymore, so commented this
    */
    listOption(type) {
        // if (type == 'notification') {
        //     $('#id_notifications').tab('show')
        // } else if (type == 'notes') {
        //     $('#id_add_notes').tab('show')
        // }
    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {

    //     if (this.state.updateProductIs === nextState.updateProductIs || this.state.noti_sync === nextState.noti_sync) {

    //         return false
    //     }

    //     return true

    // }

    searchOpen() {
        //androidSearchClick()
    }

    redirectPage(url) {
        // refreshwebManu();

        history.push(url)
    }

    /** 
     * Created By: Aman Singhai
     *  created Date: 11/08/2020
     *  Decription: For clearing search input
    */
    clearSearchInput(){
        $('.nav-search-no-expand').val('');
        this.filterProduct();
    }
   

    render() {
        const { CurrentUserActive, notifyList, updateProductIs, isSyncStart, userList } = this.state;
        const { match, productlist, attributelist, categorylist, cartproductlist, onSinginselfcheckout } = this.props;
        var name = CurrentUserActive && CurrentUserActive.display_name ? CurrentUserActive.display_name.trim().split(' ') : ''
        var temp_Order = 'TempOrders_' + (Email);
        var isDemoUser = localStorage.getItem('demoUser');
        var demoUserName= Config.key.DEMO_USER_NAME;
        var TempOrders = localStorage.getItem(temp_Order) ? JSON.parse(localStorage.getItem(temp_Order)) : [];
        var notificationlist = [];
        var isUnProcessedExist = false;
        var count = 0;
        var failedCount = 0;
        var isSynComplete = false;
        var isUnProcessStatus = false;
        notifyList && notifyList.map(list => {
            if (list.status == "false" || list.OrderID == 0) {
                isUnProcessedExist = true;
                count = count + 1;
            }

            if (list.status == "failed") {
                isUnProcessStatus = true;
                failedCount = failedCount + 1;
            }
        })

        if (isUnProcessedExist == false && notifyList && isSyncStart == true) {
            localStorage.removeItem('placedOrderList')
            isSynComplete = true;
        }
        if (notifyList) {
            this.updateClassDeclaration()
        }

        var intials = !CurrentUserActive.image || CurrentUserActive.image && CurrentUserActive.image == '' ? name!==null && name[0] ? name.length >= 2 ? name[0].charAt(0) + name[name.length - 1].charAt(0) : name[0].charAt(0) + name[0].charAt(1) : '' : '';
        var _title=match ? match.path == '/shopview' ? "Register" :"":"";
        if(_title !==""){
            document.title="Oliver POS"+" | "+ _title;
        }
        return (
            (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true)?
                <MobileSimpleHeader
                    {...this.props}
                    LocalizedLanguage={LocalizedLanguage}
                    windowLocation1={this.props.windowLocation1}
                    onSinginselfcheckout={onSinginselfcheckout}/>
            :
            (isMobileOnly == true) ?
                this.props.openModalActive == "notification_view" ?
                    <div className="appHeader position-relative">
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-center position-relative">
                                {LocalizedLanguage.notification}
                                <a className="position-absolute left-0" href="javascript:void(0)" onClick={() => this.props.openModal(false)}>
                                    <img src="mobileAssets/img/back.svg" className="w-30" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                    :
                    <MobileSimpleHeader
                        {...this.props}
                        LocalizedLanguage={LocalizedLanguage}
                        windowLocation1={this.props.windowLocation1}/>
                :
                <nav className="navbar navbar-default" id="colorFullHeader">
                    {this.state.isLoading == true ? <LoadingModal /> : ""}
                    
                    <BarcodeReader
                        onError={this.handleScan}
                        onScan={this.handleScan}
                    />
                    <div className="col-lg-9 col-sm-8 col-xs-8 p-0">
                        <div className="container-fluid p-0">
                            <div className="navbar-header">
                                <button type="button" id="sidebarCollapse" className="navbar-btn active p-0 text-left">
                                    <img alt="Logo" src="../assets/images/menu.svg" />
                                </button>
                            </div>
                            <div className="mobile_menu clearfix">
                                {/* <ul>
                                    <li className={match.path == '/shopview' ? "active" : null}>
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/shopview')}>{LocalizedLanguage.tileView}</a>
                                    </li>
                                    <li className={match.path == '/listview' ? "active" : null}>
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/listview')}>{LocalizedLanguage.listView}</a>
                                    </li>
                                    <li className={match.path == '/customerview' ? "active" : null}>
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/customerview')}>{LocalizedLanguage.customerView}</a>
                                    </li>
                                    <li className={match.path == '/appview' ? "active" : null}>
                                        <a href="javascript:void(0);" onClick={() => this.redirectPage('/appview')}>{LocalizedLanguage.appView}</a>
                                    </li>
                                </ul> */}
                            </div>
                            <div className="collapse navbar-collapse p-0" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav navbar-left">
                                {/* onClick={() => this.redirectPage('/shopview')} */}
                                    {/* <li className={match.path == '/shopview' ? "active" : null}><a href="javascript:void(0);">{LocalizedLanguage.tileView}</a></li> */}
                                    {/*<li className={match.path == '/listview' ? "active" : null}><a href="javascript:void(0);" onClick={() => this.redirectPage('/listview')}>{LocalizedLanguage.listView}</a></li>
                                     <li className={match.path == '/customerview' ? "active" : null}><a href="/customerview">Customer View</a></li> 
                                    <li className={match.path == '/appview' ? "active" : null}><a href="javascript:void(0);" onClick={() => this.redirectPage('/appview')}>{LocalizedLanguage.appView}</a></li>*/}
                                </ul>
                                {match.path != '/appview' ?
                                    // <div className="col-lg-4 col-md-5 col-sm-5 pull-right p-0">
                                    //     <input type="text" id="product_search_field" className="nav-search-no-expand" name="search" onChange={() => this.filterProduct()} onClick={() => this.searchOpen()} placeholder={LocalizedLanguage.search}/>
                                    // </div>
                                    <div className="col-lg-4 col-md-5 col-sm-5 pull-right p-0">
                                        <div className="nav-search-focus-close">
                                            <input type="text" id="product_search_field" className ="nav-search-no-expand" name="search" placeholder={LocalizedLanguage.search} onChange={() => this.filterProduct()} onClick={() => this.searchOpen()} onPaste={() => this.filterProduct(true)}/>
                                                <div className="nav-search-focus-close-icon" onClick={()=> this.clearSearchInput()}>
                                                <i className="icons8-cancel fs36 text-primary"></i>
                                            </div>
                                        </div>
                                    </div>
                                    // <ul className="nav navbar-nav navbar-right">
                                    //     <li className="nav-notify p-0">
                                    //         <div className="form-search-nav_block" type="search" id="product_search_field" name="search" onChange={() => this.filterProduct()} placeholder={LocalizedLanguage.search}>
                                    //             <input type="text" id="product_search_field" name="search" className="" onChange={() => this.filterProduct()} placeholder={LocalizedLanguage.search} />
                                    //             <button type="button" className="expand_magnify_search magnify-white" onClick={() => this.searchOpen()}></button>
                                    //             <button type="reset" className="expand_search_close" onClick={() => this.clearInput()}></button>
                                    //         </div>
                                    //     </li>
                                    //     <li className="nav-notify" style={{ display: updateProductIs == true ? '' : 'none' }}>
                                    //         <div className="dropdown">
                                    //             <a className="dropdown-toggle no-backgrond" type="button" id="menu1" data-toggle="dropdown">
                                    //                 <div className="divParent">
                                    //                     <img width="29" src="assets/img/wht-notification.png" />
                                    //                     <div className="divChild notification-counter text-center"></div>
                                    //                 </div>
                                    //             </a>
                                    //             <ul className="dropdown-menu custom-drpbox dropdown-menu-right dropbox" role="menu" aria-labelledby="menu1">
                                    //                 <li rol="presentation">
                                    //                     <a href="javascript:void(0)">{LocalizedLanguage.refreshMsg}</a>
                                    //                 </li>
                                    //                 <li rol="presentation" className="text-center pt-2 pb-2">
                                    //                     <button type="button" onClick={() => this.updateProducts()} className="btn btn-primary">
                                    //                         {LocalizedLanguage.yes}
                                    //                     </button>
                                    //                     <button type="button" onClick={() => this.updateCancelProducts()} className="btn btn-danger ml-2">
                                    //                         {LocalizedLanguage.no}
                                    //                     </button>
                                    //                 </li>
                                    //             </ul>
                                    //         </div>
                                    //     </li>
                                    // </ul>
                                    : null}
                            </div>
                        </div>
                    </div>
                    {match.path != '/customerview' ?
                        <div className="col-lg-3 col-sm-4 col-xs-4 pr-0 pl-heading cart_header_overlap">
                            {/* Updated By:Priyanka,Updated Date : 26-06-2019,Description :add notification option ,notes option custom fee option and user profile option . */}
                            <div className="navbar-right-menu">
                                <ul className="list-inline text-white nav nav-tabs home-tab-menus">
                                    <li id="notefeeActive">
                                        <div className="container-flip">
                                            <div className="nav-flip-switch">
                                                <div className="front pointer">
                                                    <a data-toggle="tab" href="#id_add_notes" aria-expanded="false">
                                                        <div className="icons8-menu-vertical fs40" onClick={() => this.listOption('notes')}>
                                                            {/* <span className="icon-circle"></span>
                                                            <span className="icon-circle"></span>
                                                            <span className="icon-circle"></span> */}
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="back closeTabPane pointer fs40">
                                                    <div className="icons8-menu-vertical text-info"></div>
                                                </div>
                                                {/* <span className="icon-circle"></span><span className="icon-circle"></span><span className="icon-circle"></span> */}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="container-flip">
                                            <div className="nav-flip-switch">
                                                <div className="front pointer">
                                                    <a data-toggle="tab" id="update_aria" href="#id_notifications" aria-expanded="false">
                                                        <div className="account-notification" onClick={() => this.listOption('notification')}>
                                                            <div className="quice_notification_open">
                                                                <i className="icons8-bell fs40"></i>
                                                                <span className="account-notification-alert">
                                                                    {
                                                                        // count && count !== 0 ?
                                                                        // <span className="notification-alter highlightNotification" >
                                                                        //     {count ? count : ''}
                                                                        // </span>
                                                                        //     :
                                                                        notifyList && notifyList.length > 0 && isUnProcessedExist == true ?
                                                                            <span className="notification-alter refreshNotification">
                                                                                <i className="icon icon-refresh icon-spin"></i>
                                                                            </span>
                                                                            :
                                                                            isSynComplete == true && isUnProcessStatus == false ?
                                                                                <span className="notification-alter readNotification">
                                                                                    {/* <img src="assets/img/rightinbtn.png" className="icon"  /> */}
                                                                                </span>
                                                                                :
                                                                                //     notifyList && notifyList.length > 0 && isUnProcessedExist == false && isUnProcessStatus == false ?
                                                                                //     <span className="notification-alter readNotification">                     </span>
                                                                                // :
                                                                                notifyList && notifyList.length > 0 && isUnProcessedExist == false && isUnProcessStatus == true ?
                                                                                    <span className="notification-alter highlightNotification">
                                                                                        {failedCount > 0 ? failedCount : ''}                   </span>
                                                                                    :
                                                                                    <span className="notification-alter">
                                                                                        {/* <img src="assets/img/refresh.svg" className="icon-spin"  /> */}
                                                                                    </span>
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div className="back closeTabPane pointer">
                                                    {/* <i className="flaticon-notification-1"></i> */}
                                                    <i className="icons8-bell fs40 text-info"></i>
                                                    <span className="account-notification-alert">
                                                        {isUnProcessedExist == true ?
                                                            <span className="notification-alter refreshNotification">
                                                                <i className="icon icon-refresh icon-spin"></i>
                                                            </span> :
                                                            notifyList && notifyList.length > 0 && isUnProcessedExist == false && isUnProcessStatus == true ?
                                                                <span className="notification-alter highlightNotification">
                                                                    {failedCount > 0 ? failedCount : ''}                   </span>
                                                                :
                                                                isSynComplete == true && isUnProcessStatus == false ?
                                                                    <span className="notification-alter readNotification">
                                                                        {/* <img src="assets/img/rightinbtn.png" className="icon"  /> */}
                                                                    </span> : ''
                                                        }
                                                    </span>
                                                </div>                                        </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="container-flip" onClick={() => this.removeCheckOutList()}> 
                                            <div className="nav-flip-switch">
                                                <div className="front pointer">
                                                    <a data-toggle="tab" href="#id_delete_records" aria-expanded="false">
                                                        <div ><i className="icons8-remove fs36"></i></div>
                                                    </a>
                                                </div>
                                                <div className="back closeTabPane pointer">
                                                    <i className="icons8-remove fs36 text-info"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="pull-right">

                                        <div className="container-flip">
                                            <div className={userList == true ? "nav-flip-switch" : ""}>
                                                {/* className="nav-flip-switch" */}
                                                <div className="front">
                                                    <a data-toggle="tab" href={userList == true ? "#id_user" : "javascript:void(0);"} aria-expanded="false">
                                                        <div className="account-user center-center" >
                                                           
                                                            <span className="account-user-name capital" title=  {isDemoUser ? demoUserName : this.state.CurrentUserActive.display_name}>
                                                                {/* {this.state.CurrentUserActive.display_name} */}

                                                                { isDemoUser  ? demoUserName : this.state.CurrentUserActive.display_name && this.state.CurrentUserActive.display_name.length > 6 ?
                                                                    this.state.CurrentUserActive.display_name.substring(0, 5) : this.state.CurrentUserActive.display_name}
                                                            </span>
                                                            &nbsp;      
                                                            {/* <span className="account-user-image account-no-image" title={this.state.CurrentUserActive.display_name} >
                                                                {intials.toUpperCase()} */}
                                                                {/* <img src="assets/img/avatar@2x.png"/> */}
                                                            {/* </span> */}
                                                           
                                                            {userList == true ?
                                                                <i className="icons8-down-button fs36 push-top-7"></i>
                                                                : ""}
                                                        </div>
                                                    </a>
                                                </div>
                                                {userList == true ?
                                                    <div className="back closeTabPane pointer">
                                                        <a >
                                                            <div className="account-user" >
                                                                <span className="account-user-name capital text-info" title={this.state.CurrentUserActive.display_name}>
                                                                    {/* {this.state.CurrentUserActive.display_name} */}
                                                                    {this.state.CurrentUserActive && this.state.CurrentUserActive.display_name && this.state.CurrentUserActive.display_name.length > 6 ?
                                                                     this.state.CurrentUserActive && this.state.CurrentUserActive.display_name && this.state.CurrentUserActive.display_name.substring(0, 5) : this.state.CurrentUserActive.display_name}
                                                                </span>
                                                                &nbsp;
                                                                {/* <span className="account-user-image account-no-image" title={this.state.CurrentUserActive.display_name} >
                                                                    {intials.toUpperCase()}
                                                                </span> */}
                                                                <i className="icons8-cancel fs36 push-top-7 text-info"></i>

                                                            </div>
                                                        </a>
                                                    </div>
                                                    : ""}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        : null}
                        
                </nav>
        )
    }
}

function mapStateToProps(state) {
    const { productlist, attributelist, categorylist, cartproductlist,syncTemporder } = state;
    return {
        productlist: productlist.productlist,
        attributelist: attributelist.attributelist,
        categorylist: categorylist.categorylist,
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [],
        syncTemporderStatus : syncTemporder
    };
}
const connectedCommonHeaderTwo = connect(mapStateToProps)(CommonHeaderTwo);
export { connectedCommonHeaderTwo as CommonHeaderTwo };