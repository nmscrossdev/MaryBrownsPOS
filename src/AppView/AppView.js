import React from 'react';
import { connect } from 'react-redux';
import { CommonHeaderTwo, NavbarPage, CustomerNote, CartListView, CustomerAddFee, CommonProductPopupModal, getTaxAllProduct, SingleProductDiscountPopup, InventoryPopup, UpdateProductInventoryModal, DiscountPopup, UserListComponents, NotificationComponents, NotesListComponents, CommonMsgModal, TaxListPopup } from '../_components';
import { App } from './';
import { DiscountMsgPopup } from '../_components/DiscountMsgPopup';
import { TickitDetailsPopupModal } from '../_components/TickitDetailsPopupModal/TickitDetailsPopupModal';
import { TickitToRideModal } from '../_components/TickitDetailsPopupModal/TickitToRideModal';
import { BookedSeatPopup } from '../_components/TickitDetailsPopupModal/BookedSeatPopup';
import { FetchIndexDB } from '../settings/FetchIndexDB';

class AppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //     hasVariationProductData: false,
            //     getVariationProductData: null,
            //     tileFilterProductData: null,
            //     tileFilterProducttype: null,
            discountAmount: 0,
            discountType: "",
            //     getSimpleProductData: [],
            //     hasSimpleProductData: false,
            //     AllProductList: [],
            //     inventoryCheck: null,
            //     isInventoryUpdate: false,
            notifyList: [],
            common_Msg: ''
        }
        this.handleProductData = this.handleProductData.bind(this);
        this.handletileFilterData = this.handletileFilterData.bind(this);
        this.handleDiscount = this.handleDiscount.bind(this);
        this.handleSimpleProduct = this.handleSimpleProduct.bind(this);
        this.showPopuponcartlistView = this.showPopuponcartlistView.bind(this);
        // this.checkInventoryData = this.checkInventoryData.bind(this);
        // this.invetoryUpdate = this.invetoryUpdate.bind(this)
        this.handleNotification = this.handleNotification.bind(this);
        this.handleTicketDetail = this.handleTicketDetail.bind(this);
        this.CommonMsg = this.CommonMsg.bind(this);
        // this.closeMsgModal = this.closeMsgModal.bind(this)

        // var idbKeyval = FetchIndexDB.fetchIndexDb();
        // idbKeyval.get('ProductList').then(val => {
        //     if (!val || val.length == 0 || val == null || val == "") {
        //         this.setState({ AllProductList: [] });
        //     } else {
        //         var TaxSetting = getTaxAllProduct(val)
        //         this.setState({ AllProductList: TaxSetting });
        //     }
        // }
        // );
    }

    CommonMsg(text) {
        this.setState({ common_Msg: text })
    }

    // componentDidMount() {
    //     localStorage.removeItem("VOID_SALE")

    //     setTimeout(function () {
    //         setHeightDesktop();
    //     }, 1000);
    // }

    handletileFilterData(data, type) {
        this.setState({
            tileFilterProductData: data,
            tileFilterProducttype: type,
        });
        if (this.tileProductFilter && this.tileProductFilter !== undefined) {
            this.tileProductFilter.filterProductByTile(type, data);
        }
    }

    handleProductData(productData) {
        var filterdata = [];
        var allProductList = [];
        allProductList.push(this.props.productlist);
        if (productData.item) {
            allProductList[0].productlist.map(item => {
                if (productData.item && productData.item.Product_Id == item.WPID) {
                    filterdata.push(item)
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
            handleSimpleProduct: false
        });
    }

    handleDiscount(amt, type) {
        if (amt) {
            this.setState({ discountAmount: parseFloat(amt), discountType: type });
        }
    }

    handleSimpleProduct(simpleProductData) {
        this.setState({
            getSimpleProductData: simpleProductData,
            hasSimpleProductData: true,
            getVariationProductData: null,
            hasVariationProductData: false
        })
    }

    // checkInventoryData(productData) {
    //     this.setState({ inventoryCheck: productData })
    //     this.state.inventoryCheck = productData;
    // }

    showPopuponcartlistView(product, item) {
       // $('#VariationPopUp').modal('show');
        showModal('VariationPopUp');
        this.handleSimpleProduct(product);
    }

    // invetoryUpdate(st) {
    //     this.setState({ isInventoryUpdate: st })
    // }

    // componentWillReceiveProps(recieveProps) {
    //     if (recieveProps.get_single_inventory_quantity) {
    //         this.invetoryUpdate(false)
    //     }
    //     if(recieveProps.cartproductlist && recieveProps.cartproductlist.length > 6){
    //         setTimeout(function(){
    //               $("#mCSB_3").animate({ 
    //                 scrollTop: $( 
    //                   '#mCSB_3').get(0).scrollHeight 
    //             }, 2000);  
    //             // $("#mCSB_3").css("overflow", "auto")
    //             // $("#mCSB_3").css("margin-right", "8px")
    //         },300)
    //     }
    // }

    handleNotification(data) {
        var notif_data = data
        this.setState({ notifyList: notif_data });
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

    closeMsgModal() {
        this.setState({ common_Msg: '' })
    }

    render() {
        // const { hasSimpleProductData, getSimpleProductData, getVariationProductData, hasVariationProductData, common_Msg } = this.state;
        return (
            <div>
                <div className="wrapper">
                    <div className="overlay"></div>
                    <NavbarPage {...this.props} />
                    <div id="content">
                        <CommonHeaderTwo {...this.props} searchProductFilter={this.handletileFilterData} productData={this.handleProductData} simpleProductData={this.handleSimpleProduct} NotificationFilters={this.handleNotification} ticketDetail={this.handleTicketDetail} msg={this.CommonMsg} />
                        <div className="inner_content bg-light-white clearfix">
                            <div className="content_wrapper">
                                <App msg={this.CommonMsg} />
                                <CartListView showPopuponcartlistView={this.showPopuponcartlistView} onDiscountAmountChange={this.handleDiscount} onChange={this.addFee} discountAmount={this.state.discountAmount} discountType={this.state.discountType} simpleProductData={this.handleSimpleProduct} ticketDetail={this.handleTicketDetail} msg={this.CommonMsg} />
                            </div>
                            <div className="tab-content quick_menus">
                                <UserListComponents />
                                <NotificationComponents list={this.state.notifyList} />
                                <NotesListComponents />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <CommonMsgModal msg_text={common_Msg} close_Msg_Modal={this.closeMsgModal} /> */}
                <DiscountPopup onDiscountAmountChange={this.handleDiscount} msg={this.CommonMsg}/>
                <SingleProductDiscountPopup onDiscountAmountChange={this.handleDiscount} />
                <DiscountMsgPopup />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { productlist, get_single_inventory_quantity, checkout_list } = state;
    return {
        productlist,
        checkout_list: checkout_list.items,
        get_single_inventory_quantity: get_single_inventory_quantity.items,
        cartproductlist: localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
    };
}
const connectedAppView = connect(mapStateToProps)(AppView);
export { connectedAppView as AppView };