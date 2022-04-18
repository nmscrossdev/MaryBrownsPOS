import React from 'react';
import { connect } from 'react-redux';
import { favouriteListActions, FavouriteItemView } from '../';
import { cartProductActions, allProductActions } from '../../_actions';
import { get_UDid } from '../../ALL_localstorage';
import { getTaxAllProduct, LoadingModal, CommonModuleJS } from '../../_components';
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import { plusIconSize } from '../../ALL_localstorage'
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
// import MobileFavouriteList from '../views/m.FavouriteList';
import $ from 'jquery';
const udid = get_UDid('UDID');

class FavouriteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            item: null,
            num: '',
            UDID: '',
            activeClass: null,
            productlist: [],
            favouritesItemsProduct: [],
            ticket_Product_status: false,
            TaxStatus: '', // updateby shakuntala jatav, date:03-06-2019 , description: tax is applicable for per items is yes or not.
            favDelete_status: false,
            size: plusIconSize(20),
            favovrArrayList: [],
            mfavovrArrayList: localStorage.getItem("FAV_LIST_ARRAY") ? JSON.parse(localStorage.getItem("FAV_LIST_ARRAY")) : []
        }
        this.ActiveList = this.ActiveList.bind(this);
        this.updateActiveStateOnRef = this.updateActiveStateOnRef.bind(this);
        this.tileProductListFilter = this.tileProductListFilter.bind(this);
        this.setSubCategoryList = this.setSubCategoryList.bind(this);
        this.checkStatus = this.checkStatus.bind(this);
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") {
                this.setState({ productlist: [] });
            } else {
                var _productwithTax = getTaxAllProduct(val)
                this.state.productlist = _productwithTax;
                this.setState({ productlist: _productwithTax });
            }
        });
        this.DisplayPopUp = this.DisplayPopUp.bind(this);
        this.RemoveFavProduct = this.RemoveFavProduct.bind(this);
    }

    checkStatus() {
        if (localStorage.getItem("shopstatus") && localStorage.getItem("shopstatus") !== null) {
            var sopstatus = JSON.parse(localStorage.getItem("shopstatus") ? localStorage.getItem("shopstatus") : "");
            if (sopstatus !== "" && sopstatus.is_success == false) {
                try {
                    // $('#PopupShopStatus').modal('show');
                    showModal("PopupShopStatus");
                } catch (error) {
                    console.log("Error", error);
                }

            }
        }
    }
    componentWillUnmount = ()=> {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
        const UID = get_UDid('UDID');
        const register_Id = localStorage.getItem('register');
        //dispatch(favouriteListActions.getAll(UID, register_Id));
        if (localStorage.FAVROUTE_LIST_ARRAY) {
            this.preparefavList(JSON.parse(localStorage.getItem("FAVROUTE_LIST_ARRAY")))
        }
    }

    tileProductListFilter(data, type, parent) {
        //console.log("%ctileProductListFilter",'color:pink', data, type, parent)
        this.props.tileFilterData(data, type, parent)
    }

    getTicketFields(product, tick_type = null) {
        var tick_data = JSON.parse(product[0].TicketInfo)
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
    /**
     * Updated By : Shakuntala Jatav
     * Updated Date : 05-09-2019
     * Description : Add simple product without ticket update item fields 
     * @param {*} item // product details
     * @param {*} index //Number
     * @param {*} type // define type is simple and variable
     * @param {*} ticketFields //when add ticket product 
     */
    ActiveList(item, index, type, ticketFields = null) {
        //console.log("%cActiveList", 'color:orange', item, index, type)
        if( !item)
        {
            return;
        }
        this.tileProductListFilter(item, type);
        const UID = get_UDid('UDID');
        this.setState({ UDID: UID })
        if (item.attribute_slug) {
            this.setState({
                active: true,
                item: item,
                num: index
            })
            this.props.dispatch(favouriteListActions.getSubAttributes(UID, item.attribute_code));
        }
        if (item.category_id) {
            this.setState({
                active: true,
                item: item,
                num: index
                // , ListItem2:list.product_list
            })
           this.props.dispatch(favouriteListActions.getChildCategories(UID, item.category_id));

        }
        if (item.category_slug) {
            this.setState({
                active: true,
                item: item,
                num: index
                // , ListItem2:list.product_list
            })
        }
        if (item.parent_attribute) {
            this.setState({
                active: true,
                item: item,
                num: index
                // , ListItem2:list.product_list
            })

        }
        if (item.Product_Id ? item.Product_Id : item.WPID) {
            if (item.Type !== "simple") {
                var data = {
                    item: item,
                    DefaultQunatity: 1
                }
                var getfilterProduct = this.state.productlist !== null && this.state.productlist !== undefined && this.state.productlist.filter(prodlist => {
                    return prodlist.WPID == item.Product_Id
                });

                if (getfilterProduct[0] && getfilterProduct[0].IsTicket == true) {
                    this.getTicketFields(getfilterProduct);
                }
                this.props.productData(data);
                if (item.Type !== 'variable' && CommonModuleJS.showProductxModal() !== true) {
                    this.props.msg(LocalizedLanguage.productxOutOfStock);
                    if (isMobileOnly == true) {
                        if (isMobileOnly == true) { $('#common_msg_popup').addClass('show'); }
                    }
                    showModal('common_msg_popup');
                } else {
                    if (isMobileOnly == true) {
                        this.props.openModal("product_modal");
                    } else {
                        //$('#VariationPopUp').modal('show');
                        showModal('VariationPopUp');
                    }
                }
                localStorage.setItem('Favproduct', JSON.stringify(data))
            }
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
            var qty = 0;
            cartlist.map(items => {
                if (item.Product_Id == items.product_id) {
                    qty = items.quantity;
                }
            })
            if (item.Type == "simple") {
                //console.log("when add simple product", item, this.state.productlist);
                var getfilterProduct = ticketFields == null && this.state.productlist && this.state.productlist.filter(prodlist => {
                    return prodlist.WPID == item.Product_Id
                });
                if (ticketFields == null && getfilterProduct[0] && getfilterProduct[0].IsTicket == true) {
                    var tick_typ = 'simpleadd'
                    this.getTicketFields(getfilterProduct, tick_typ)
                }
                //console.log("when filter product ", getfilterProduct);
                if (getfilterProduct[0] && getfilterProduct[0].StockStatus == "outofstock") {
                    this.props.msg(LocalizedLanguage.productOutOfStock);
                    if (isMobileOnly == true) {
                        if (isMobileOnly == true) { $('#common_msg_popup').addClass('show'); }
                    }
                    showModal('common_msg_popup');
                    // $('#common_msg_popup').modal('show');
                }
                else {
                    if (getfilterProduct[0] && getfilterProduct[0].IsTicket == false) {
                        if ((item.StockStatus == null || item.StockStatus == 'instock')
                            && (item.ManagingStock == true && (parseFloat(item.Stock) <= 0 || qty >= parseFloat(item.Stock)))) {
                            this.props.msg(LocalizedLanguage.productOutOfStock);
                            if (isMobileOnly == true) {
                                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                            }
                            showModal('common_msg_popup');

                        } else {
                            var product = this.state.productlist.find(items => items.WPID == item.Product_Id);
                            if (product) {
                                var data = {
                                    line_item_id: 0,
                                    quantity: 1,
                                    Title: product.Title,
                                    Price: parseFloat(product.Price),
                                    product_id: product.WPID,
                                    variation_id: 0,
                                    isTaxable: product.Taxable,
                                    old_price: product.old_price,
                                    incl_tax: product.incl_tax,
                                    excl_tax: product.excl_tax,
                                    after_discount: product.after_discount ? product.after_discount : 0,
                                    discount_amount: product.discount_amount ? product.discount_amount : 0,
                                    cart_after_discount: product.cart_after_discount ? product.cart_after_discount : 0,
                                    cart_discount_amount: product.cart_discount_amount ? product.cart_discount_amount : 0,
                                    product_after_discount: product.product_after_discount ? product.product_after_discount : 0,
                                    product_discount_amount: product.product_discount_amount ? product.product_discount_amount : 0,
                                    ticket_status: getfilterProduct[0].IsTicket,
                                    TaxStatus: product.TaxStatus ? product.TaxStatus : '',
                                    discount_type: product.discount_type ? product.discount_type : "",
                                    new_product_discount_amount: product ? product.new_product_discount_amount : 0,
                                    TaxClass: product ? product.TaxClass : '',
                                    tcForSeating: tick_data,
                                    tick_event_id: tick_data ? tick_data._event_name : '',
                                    product_ticket: ticketFields,

                                }
                            }

                            localStorage.setItem('Favproduct', null)
                            cartlist.push(data)
                            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
                        }

                    } else if (getfilterProduct == false && item && item.IsTicket == true && ticketFields != null) {

                        this.setState({ ticket_Product_status: false })
                        var tick_data = item && item.TicketInfo != '' ? JSON.parse(item.TicketInfo) : '';

                        if ((item.StockStatus == null || item.StockStatus == 'instock') && (item.ManagingStock == true && (parseFloat(item.Stock) <= 0 || qty >= parseFloat(item.Stock)))) {
                            this.props.msg(LocalizedLanguage.productOutOfStock);
                            if (isMobileOnly == true) {
                                if (isMobileOnly == true) { $('#common_msg_popup').addClass('show') }
                            }
                            //$('#common_msg_popup').modal('show');
                            showModal('common_msg_popup');

                        }
                        var data = {
                            line_item_id: 0,
                            quantity: 1,
                            Title: item.Title,
                            Price: parseFloat(item.Price),
                            product_id: item.WPID,
                            variation_id: 0,
                            isTaxable: item.Taxable,
                            old_price: item.old_price,
                            incl_tax: item.incl_tax,
                            excl_tax: item.excl_tax,
                            after_discount: item.after_discount ? item.after_discount : 0,
                            discount_amount: item.discount_amount ? item.discount_amount : 0,
                            cart_after_discount: item.cart_after_discount ? item.cart_after_discount : 0,
                            cart_discount_amount: item.cart_discount_amount ? item.cart_discount_amount : 0,
                            product_after_discount: item.product_after_discount ? item.product_after_discount : 0,
                            product_discount_amount: item.product_discount_amount ? item.product_discount_amount : 0,
                            tick_event_id: tick_data._event_name,
                            ticket_status: item.IsTicket,
                            product_ticket: ticketFields,
                            TaxStatus: item.TaxStatus ? item.TaxStatus : '',
                            discount_type: item.discount_type ? item.discount_type : "",
                            new_product_discount_amount: item ? item.new_product_discount_amount : 0,
                            TaxClass: item ? item.TaxClass : '',
                            tcForSeating: tick_data

                        }
                        localStorage.setItem('Favproduct', null)
                        cartlist.push(data)
                        this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
                    }
                }
            }
        }
    }

    imgError(image) {
        image.onerror = null;
        image.className = 'errorImage'
        image.src = "assets/img/placeholder.png";
        return true;
    }

    RemoveFavProduct(data) {
        this.setState({
            favDelete_status: true
        })
        if (data.category_slug) {
            const UID = get_UDid('UDID');
            const favid = data.id
            this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        }
        if (data.attribute_slug) {
            const UID = get_UDid('UDID');
            const favid = data.id
            this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        }
        if (data.Product_Id) {
            const UID = get_UDid('UDID');
            const favid = data.Id
            this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        }
        if (data.parent_attribute) {
            const UID = get_UDid('UDID');
            const favid = data.id
            this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        }
    }

    freezScreen() {
        $('.disabled_popup_tile_close').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

    DisplayPopUp(tilePosition) {
        this.props.tilePosition(tilePosition, this.props.favourites)
        if (isMobileOnly == true) {
            this.props.openModal("tile_modal")
        }
        try {
            //$('#popup_cash_rounding').modal('show');
            showModal('tallModal');
        } catch (error) {
            console.log("Error", error);
        }

        //this.freezScreen();
    }

    getFavListApi() {
        const register_Id = localStorage.getItem('register');
        this.props.dispatch(favouriteListActions.getAll(udid, register_Id));
    }

    componentWillReceiveProps(props) {
        const { favProductDelete, favouritesProductAdd, status } = props;
        if (favProductDelete && favProductDelete && favProductDelete.is_success == true && this.state.favDelete_status == true) {
            const register_Id = localStorage.getItem('register');
            this.state.favovrArrayList = [];
            this.setState({ favDelete_status: false, favovrArrayList: [] })
            this.getFavListApi()
        }
        if (favouritesProductAdd && favouritesProductAdd && favouritesProductAdd.is_success == true && status == true) {
            const { addStatus } = this.props;
            this.state.favovrArrayList = [];
            const register_Id = localStorage.getItem('register');
            /// dispatch(favouriteListActions.getAll(udid, register_Id));
            addStatus(false);
            this.setState({ favovrArrayList: [] })
            this.getFavListApi()
        }
        //if ($('#PopupShopStatus')) {
        this.checkStatus();
        // }
        var ticket_Data = localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : ''
        var tick_data = this.state.ticket_Product_status == true ? JSON.parse(this.state.ticket_Product[0].TicketInfo) : ''
        var form_id = tick_data._owner_form_template

        if (localStorage.getItem('ticket_list') && localStorage.getItem('ticket_list') !== 'null' && localStorage.getItem('ticket_list') !== '' && this.state.ticket_Product_status == true && this.state.tick_type == 'simpleadd' || form_id == -1 || form_id == '' && this.state.ticket_Product_status == true && this.state.tick_type == 'simpleadd') {
            this.setState({ ticket_Product_status: false })
            var index = null;
            var type = null;
            this.ActiveList(this.state.ticket_Product[0], index = null, type = null, localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '')
        }
        if (props.favourites) {
            const favouritesItemsProduct = props.favourites && props.favourites.FavProduct ? getTaxAllProduct(props.favourites.FavProduct) : null;

            this.state.favouritesItemsProduct = favouritesItemsProduct
            this.setState({ favouritesItemsProduct: favouritesItemsProduct })
        }
        var prdList = [];
        this.state.favouritesItemsProduct && this.state.favouritesItemsProduct.map((item, index) => {
            var getfilterTicketProduct = []
            if (this.state.productlist && this.state.productlist.length > 0) {
                this.state.productlist.filter(prodlist => prodlist.WPID == item.Product_Id);
            }
            if (getfilterTicketProduct) {
                getfilterTicketProduct && getfilterTicketProduct.map((prod, index) => {
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
                    if (isExpired == false) {
                        var data = {
                            Id: item.Id,
                            Image: prod.ProductImage,
                            InStock: prod.InStock,
                            ManagingStock: prod.ManagingStock,
                            Price: prod.Price,
                            Product_Id: prod.WPID,
                            Stock: prod.StockQuantity,
                            Title: prod.Title,
                            Type: prod.Type,
                            old_price: prod.old_price,
                            TaxStatus: prod.TaxStatus,
                            incl_tax: prod.incl_tax,
                            excl_tax: prod.excl_tax,
                            discount_type: prod.discount_type ? prod.discount_type : "",
                            new_product_discount_amount: prod ? prod.new_product_discount_amount : 0,
                            TaxClass: prod ? prod.TaxClass : '',
                            isTaxable: prod.Taxable
                        }
                        prdList.push(data)
                    }
                })
            }
        })
        var _favrList = props.favourites;
        if (prdList.length > 0) {
            _favrList.FavProduct = prdList;
            //this.state.favouritesItemsProduct = prdList;
            //this.setState({ favouritesItemsProduct: prdList })
        }

        if (props.favourites !== this.props.favourites) {
            this.preparefavList(_favrList);
            // this.preparefavList(props.favourites)
        }

    }

    preparefavList(favourites) {
        var sizeArray = this.state.size
        var favArrayList = [];
        var FavSubCategory = []
        const favouritesItemsAttribute = favourites && favourites.FavAttribute ? favourites.FavAttribute : [];
        const favouritesItemsCategory = favourites && favourites.FavCategory ? favourites.FavCategory : [];
        const favouritesItemsSubCategory = favourites && favourites.FavSubCategory ? favourites.FavSubCategory : [];
        const favouritesItemsSubAttribute = favourites && favourites.FavSubAttribute ? favourites.FavSubAttribute : [];
        const favouritesItemProduct = favourites && favourites.FavProduct ? favourites.FavProduct : []
        favouritesItemsSubCategory && favouritesItemsSubCategory.length > 0 && favouritesItemsSubCategory.map(item => {
            item['sub_category_type'] = "sub-category"
            FavSubCategory.push(item)
        })
        favArrayList = [...favouritesItemsAttribute, ...favouritesItemsCategory, ...FavSubCategory, ...favouritesItemsSubAttribute, ...favouritesItemProduct] //arr3 ==> [1,2,3,4,5,6]
        const arrayUniqueByKey = [...new Map(favArrayList.map(item =>
            [item['Order'], item])).values()];
        this.setState({ favovrArrayList: arrayUniqueByKey })


        //    prepare list for android and ios fav list-------------------
        var arrayUniqueByKeyIn24 = [];
        var arrayNumList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        var removeNumList = [];
        if (arrayUniqueByKey && arrayUniqueByKey.length > 0) {
            arrayNumList.map(order_Number => {
                var findSameOrderNum = arrayUniqueByKey.find(itm => itm.Order === order_Number);
                if (findSameOrderNum) {
                    arrayUniqueByKeyIn24.push(findSameOrderNum);
                }
            })
        }
        if (arrayUniqueByKeyIn24 && arrayUniqueByKeyIn24.length > 0) {
            arrayUniqueByKeyIn24.map(items => {
                for (var i = arrayNumList.length - 1; i--;) {
                    if (arrayNumList[i] === items.Order) arrayNumList.splice(i, 1);
                }
            })
        } else if (arrayUniqueByKeyIn24 && arrayUniqueByKeyIn24.length == 0) {
            arrayUniqueByKeyIn24.push(1)
        }
        arrayUniqueByKeyIn24.push(arrayNumList[0])
        // --------------------------------------------------------------
        this.setState({
            favovrArrayList: arrayUniqueByKey,
            mfavovrArrayList: arrayUniqueByKeyIn24
        })

        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 500);

    }

    favProductDiv(item) {
        var titleName = item.attribute_slug ? item.attribute_slug : item.parent_attribute ? item.attribute_slug + "/" + item.parent_attribute.replace("pa_", "") : item.category_slug ? item.name : item.Type ? item.Title : ''
        var img = item.Image ? item.Image.split('/') : '';
        console.log("titleName",titleName);
        console.log("img",img);
        return (
            item.attribute_slug && !item.parent_attribute ?

            <div className="category-tile grouped" key={"attribute" + item.id} data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} onClick={() => this.ActiveList(item, 1, "attribute")}>
            <p>{titleName}</p>
              </div>

        //     <div  key={"attribute" + item.id} className="app app-primary" data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`}>
        //     <button className="app-delete">
        //         <img src="/assets/img/closenew.svg" alt=""/>
        //     </button>
        //     <div className="app-body app-body-content"  onClick={() => this.ActiveList(item, 1, "attribute")}>
        //         <h1 className="app-title text-truncate text-center">
        //         {titleName}
        //         </h1>
        //     </div>
        // </div>

                // <div key={"attribute" + item.id} className="tile-view-columns" data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} >
                //     <div className="relativeDiv">
                //         <div className="category_list" onClick={() => this.ActiveList(item, 1, "attribute")}>
                //             <a href="javascript:void(0)" >
                //                 {titleName}
                //             </a>
                //         </div>
                //         <a className="delete" href="javascript:void(0)">
                //             <span aria-hidden="true" onClick={() => this.RemoveFavProduct(item)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                //             <span className="sr-only">{LocalizedLanguage.close}</span>
                //         </a>
                //     </div></div>
                : item.attribute_slug && item.parent_attribute ?

                <div className="category-tile grouped" key={"parent_attribute" + item.id}  data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} data-parent-attribute={item.parent_attribute} onClick={() => this.ActiveList(item, 3, "sub-attribute")}>
                 <p>{titleName}</p>
                  </div>

                    // <div   key={"parent_attribute" + item.id} className="app app-primary"   data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} data-parent-attribute={item.parent_attribute}>
                    //     <button className="app-delete">
                    //         <img src="/assets/img/closenew.svg" alt=""/>
                    //     </button>
                    //     <div className="app-body app-body-content" onClick={() => this.ActiveList(item, 3, "sub-attribute")}>
                    //         <h1 className="app-title text-truncate text-center">
                    //         {titleName}
                    //         </h1>
                    //     </div>
                    // </div>
    
                    // <div key={"parent_attribute" + item.id} className="tile-view-columns" data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} data-parent-attribute={item.parent_attribute}>
                    //     <div className="relativeDiv">
                    //         <div className="category_list" onClick={() => this.ActiveList(item, 3, "sub-attribute")}>
                    //             <a href="javascript:void(0)" >
                    //                 {titleName}
                    //             </a>
                    //         </div>
                    //         <a className="delete" href="javascript:void(0)">
                    //             <span aria-hidden="true" onClick={() => this.RemoveFavProduct(item)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                    //             <span className="sr-only">{LocalizedLanguage.close}</span>
                    //         </a>
                    //     </div></div>
                    : item.category_slug && !item.sub_category_type ?
                        // <div  key={"category" + item.id} className="app app-primary"  data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}>
                        //     <button className="app-delete">
                        //         <img src="/assets/img/closenew.svg" alt=""/>
                        //     </button>
                        //     <div className="app-body app-body-content"  onClick={() => this.ActiveList(item, 2, "category")}>
                        //         <h1 className="app-title text-truncate text-center">
                        //         {titleName}
                        //         </h1>
                        //     </div>
                        // </div>

<div className="category-tile grouped" key={"category" + item.id}   data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug} onClick={() => this.ActiveList(item, 2, "category")}>
<p>{titleName}</p>
  </div>

                        // <div key={"category" + item.id} className="tile-view-columns" data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}>
                        //     <div className="relativeDiv">
                        //         <div className="category_list" onClick={() => this.ActiveList(item, 2, "category")}>
                        //             <a href="javascript:void(0)" >
                        //                 {titleName}
                        //             </a>
                        //         </div>
                        //         <a className="delete" href="javascript:void(0)">
                        //             <span aria-hidden="true" onClick={() => this.RemoveFavProduct(item)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                                  
                        //             <span className="sr-only">{LocalizedLanguage.close}</span>
                        //         </a>
                        //     </div></div>
                        : item.sub_category_type ?
                            // <div  key={"sub_category_type" + item.id}  className="app app-primary"   data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}>
                            //     <button className="app-delete">
                            //         <img src="/assets/img/closenew.svg" alt=""/>
                            //     </button>
                            //     <div className="app-body app-body-content" onClick={() => this.ActiveList(item, 4, "sub-category")}>
                            //         <h1 className="app-title text-truncate text-center">
                            //         {titleName}
                            //         </h1>
                            //     </div>
                            // </div>

<div className="category-tile grouped"  key={"sub_category_type" + item.id}     data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug} onClick={() => this.ActiveList(item, 4, "sub-category")}>
<p>{titleName}</p>
  </div>

                            // <div key={"sub_category_type" + item.id} className="tile-view-columns" data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}>
                            //     <div className="relativeDiv">
                            //         <div className="category_list" onClick={() => this.ActiveList(item, 4, "sub-category")}>
                            //             <a href="javascript:void(0)" >
                            //                 {titleName}
                            //             </a>
                            //         </div>
                            //         <a className="delete" href="javascript:void(0)">
                            //             <span aria-hidden="true" onClick={() => this.RemoveFavProduct(item)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                            //             <span className="sr-only">{LocalizedLanguage.close}</span>
                            //         </a>
                            //     </div></div>
                            : item.Type ?
                                <div key={"product" + item.Id} className="tile-view-columns" data-product-id={item.Product_Id} data-id={`attr_${item.id}`} data-stock={item.stock} data-price={item.Price}>
                                    <div className="relativeDiv">
                                        <div className="category_list labelAdd category_list_unflex" onClick={() => this.ActiveList(item, 5, "product")}>
                                            {/*  style={{ backgroundImage: `url(${item.Image})` }} */}
                                            <div className="pc-imgbox">
                                            <img src={item.Image ? img[8] == 'placeholder.png' ? '' : item.Image : ''} alt="new" onError={(e) => this.imgError(e.target)} />
                                                {/* <img src={item.Image ? img[8] == 'placeholder.png' ? '' : item.Image : ''} alt="new" onError={(e) => this.imgError(e.target)} />
                                     */}   </div>
                                            <label className="labelTag">{item.Title}</label>

                                        </div>
                                        <a className="delete" href="javascript:void(0)">
                                            <span aria-hidden="true" onClick={() => this.RemoveFavProduct(item)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                                            <span className="sr-only">{LocalizedLanguage.close}</span>
                                        </a>
                                    </div></div> : ''
        )
    }

    favProductStaticDiv(num) {
        const { mfavovrArrayList } = this.state;
        var mfavovrArrayListLength = mfavovrArrayList.length > 0 ? mfavovrArrayList.length - 1 : "";
        var starting_number = mfavovrArrayList ? mfavovrArrayList[mfavovrArrayListLength] ? !mfavovrArrayList[mfavovrArrayListLength].id && !mfavovrArrayList[mfavovrArrayListLength].Id ? mfavovrArrayList[mfavovrArrayListLength] : "" : "" : "";
        return (
            <div className="tile-view-columns" key={num} data-array={num}>
                <div className="category_list labelRemove tile-text" onClick={() => this.DisplayPopUp(num)} data-toggle="modal">
                {
                // (starting_number == num) ?
                //         <a className="">{ LocalizedLanguage.addTitle }
                //     </a>
                //     :
                    <div className= "text2">                     
                        { LocalizedLanguage.addTitle }                      
                    </div>
                    }
                    <a className="delete" href="#">
                        <span aria-hidden="true"  ><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                        <span className="sr-only">{LocalizedLanguage.close}</span>
                    </a>
                </div>
            </div>
        )
    }

    updateActiveStateOnRef(st) {
        this.state.active = st
        this.setState({ active: st })
        setTimeout(function () {
            //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 500);
        this.props.tileFilterData(null, "product", null)
    }

    setSubCategoryList(item, index, type) {
        //console.log("setSubCategoryList", item, index, type)
        // this.tileProductListFilter(item, type);
        this.setState({
            active: true,
            item: item,
            num: index
            // , ListItem2:list.product_list
        })
    }


    render() {
        const { clearall, favourites, favouritesChildCategoryList, favouritesSubAttributeList, status, isShopView} = this.props;
        //console.log("favouritesChildCategoryList", favouritesChildCategoryList)
        const { active, item, num, childCategoryList, favovrArrayList, favDelete_status, mfavovrArrayList } = this.state;
        var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        var ArrNotIn24 = [];
        ArrNotIn24 = favovrArrayList && favovrArrayList.length > 0 ? favovrArrayList.filter(function (item) {
            return item.Order > 20
        }) : [];
        //const { favovrArrayList } = this.state;
        return (
            <div className="category-tile-group">
                {(isShopView === true)? 
                   
                    status == true ? <LoadingModal /> : ""+
                    active != true ?
                      status == false && favDelete_status == false && arr.map((item, index) => {
                                        var _itemOrdrIn24 = favovrArrayList.find(itm => itm.Order == item)
                                        var _itemOrdrNotIn24 = null;
                                        _itemOrdrNotIn24 = (!_itemOrdrIn24) && ArrNotIn24 && ArrNotIn24.length > 0 ? ArrNotIn24[0] : null;
                                        (!_itemOrdrIn24) && ArrNotIn24 && ArrNotIn24.length > 0 ? ArrNotIn24.splice(ArrNotIn24, 1) : null;

                                        return (
                                            _itemOrdrIn24 ?
                                                this.favProductDiv(_itemOrdrIn24)
                                                : _itemOrdrNotIn24 && _itemOrdrNotIn24 != null ?
                                                    this.favProductDiv(_itemOrdrNotIn24)
                                                    : null//this.favProductStaticDiv(item)
                                        )
                                    })
                                
                            // </div>
                        // </div>
                        :
                        (
                            num == 1 ?
                                <FavouriteItemView
                                    SubAttributeList={favouritesSubAttributeList ? favouritesSubAttributeList : null}
                                    tileFilter={this.tileProductListFilter} updateActiveStateOnRef={this.updateActiveStateOnRef}
                                />
                                : num == 2 ?
                                    <FavouriteItemView
                                        childCategory={favouritesChildCategoryList ? favouritesChildCategoryList : null}
                                        setSubCategoryList={this.setSubCategoryList} tileFilter={this.tileProductListFilter} updateActiveStateOnRef={this.updateActiveStateOnRef}
                                    /> :
                                    num == 3 ?
                                        <FavouriteItemView
                                            childSubAttributeList={this.state.item ? item : null}
                                            tileFilter={this.tileProductListFilter} updateActiveStateOnRef={this.updateActiveStateOnRef}

                                        /> :
                                        num == 4 ?
                                            <FavouriteItemView
                                                subchildCategory={this.state.item ? item : null}
                                                setSubCategoryList={this.setSubCategoryList} tileFilter={this.tileProductListFilter} updateActiveStateOnRef={this.updateActiveStateOnRef}
                                            /> :
                                            null
                        )
                    :
                        <div className="app-list-view app-list-responsive">
                        {/* <div  key={"attribute" + "All"} className="app app-primary" data-attribute-id="All">                                
                        <div className="app-body app-body-content"  onClick={clearall}>
                            <h1 className="app-title text-truncate text-center">
                            {LocalizedLanguage.showall}
                            </h1>
                        </div>
                        </div> */}
                        <div className="category-tile grouped" key={"attribute" + "All"} data-attribute-id="All">
                        <p>{LocalizedLanguage.showall}</p>
                        </div>
                        {
                        favovrArrayList.map((item, index) => {                 
                            var titleName = item.attribute_slug ? item.attribute_slug : item.parent_attribute ? item.attribute_slug + "/" + item.parent_attribute.replace("pa_", "") : item.category_slug ? item.name : item.Type ? item.Title : ''
                            var img = item.Image ? item.Image.split('/') : '';
                            return (
                                item.attribute_slug && !item.parent_attribute ?

                            <div className="category-tile grouped" key={"attribute" + item.id} data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} onClick={() => this.ActiveList(item, 1, "attribute")}>
                           <p>{titleName}</p>
                            </div>

                            // <div  key={"attribute" + item.id} className="app app-primary" data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`}>
                            //     <div className="app-body app-body-content"  onClick={() => this.ActiveList(item, 1, "attribute")}>
                            //         <h1 className="app-title text-truncate text-center">
                            //         {titleName}
                            //         </h1>
                            //     </div>
                            // </div>
                        : item.attribute_slug && item.parent_attribute ?
                            // <div   key={"parent_attribute" + item.id} className="app app-primary"   data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} data-parent-attribute={item.parent_attribute}>
                            //     <div className="app-body app-body-content" onClick={() => this.ActiveList(item, 3, "sub-attribute")}>
                            //         <h1 className="app-title text-truncate text-center">
                            //         {titleName}
                            //         </h1>
                            //     </div>
                            // </div>
            
                            <div className="category-tile grouped" key={"parent_attribute" + item.id}  data-attribute-id={item.attribute_id} data-id={`attr_${item.id}`} data-parent-attribute={item.parent_attribute} onClick={() => this.ActiveList(item, 3, "sub-attribute")}>
                            <p>{titleName}</p>
                            </div>

                            : item.category_slug && !item.sub_category_type ?
                                // <div  key={"category" + item.id} className="app app-primary"  data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}>
                                //     <div className="app-body app-body-content"  onClick={() => this.ActiveList(item, 2, "category")}>
                                //         <h1 className="app-title text-truncate text-center">
                                //         {titleName}
                                //         </h1>
                                //     </div>
                                // </div>

                            <div className="category-tile grouped"  key={"category" + item.id} data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}  onClick={() => this.ActiveList(item, 2, "category")}>
                            <p>{titleName}</p>
                            </div>
                                : item.sub_category_type ?
                                    // <div  key={"sub_category_type" + item.id}  className="app app-primary"   data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug}>
                                    //     {/* <button className="app-delete" onClick={() => this.RemoveFavProduct(item)}>
                                    //         <img src="/assets/img/closenew.svg" alt=""/>
                                    //     </button> */}
                                    //     <div className="app-body app-body-content" onClick={() => this.ActiveList(item, 4, "sub-category")}>
                                    //         <h1 className="app-title text-truncate text-center">
                                    //         {titleName}
                                    //         </h1>
                                    //     </div>
                                    // </div>
                            <div className="category-tile grouped" key={"sub_category_type" + item.id} data-category-id={item.category_id} data-id={`attr_${item.id}`} data-category-slug={item.category_slug} onClick={() => this.ActiveList(item, 4, "sub-category")}>
                          <p>{titleName}</p>
                            </div>
                                            : ''
                            )
                        })
                        }
                        </div>
                }
            </div>
      )
    }
}

function mapStateToProps(state) {
    const { favouritesProductAdd, favourites, favouritesChildCategoryList, favouritesSubAttributeList, favProductDelete } = state;
    return {
        favourites: favourites.items,
        favouritesChildCategoryList: favouritesChildCategoryList.items,
        favouritesSubAttributeList: favouritesSubAttributeList.items,
        favProductDelete: favProductDelete.items,
        favouritesProductAdd: favouritesProductAdd.items
    };
}
const connectedFavouriteList = connect(mapStateToProps)(FavouriteList);
export { connectedFavouriteList as FavouriteList };