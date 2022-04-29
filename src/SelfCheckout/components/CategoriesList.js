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

class CategoriesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            item: null,
            num: '',
            activeClass: null,
            productlist: [],
            favouritesItemsProduct: [],
            ticket_Product_status: false,
            TaxStatus: '', // updateby shakuntala jatav, date:03-06-2019 , description: tax is applicable for per items is yes or not.
            favDelete_status: false,
            size: plusIconSize(20),
            current_categories:[]
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
        // this.DisplayPopUp = this.DisplayPopUp.bind(this);
        // this.RemoveFavProduct = this.RemoveFavProduct.bind(this);
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
        this.setState({current_categories:this.props.categories});
    }

    tileProductListFilter(data, type, parent) {
        this.props.tileFilterData(data, type, parent)
    }

    // getTicketFields(product, tick_type = null) {
    //     var tick_data = JSON.parse(product[0].TicketInfo)
    //     var form_id = tick_data._owner_form_template
    //     this.props.dispatch(allProductActions.ticketFormList(form_id));
    //     this.state.ticket_Product_status = true
    //     this.state.tick_type = tick_type
    //     this.state.ticket_Product = product
    //     this.setState({
    //         ticket_Product: product,
    //         ticket_Product_status: true,
    //     })
    // }
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
        if( !item)
        {
            return;
        }
        this.tileProductListFilter(item, type);

        if (item.id) {
            var _sub= item && item.Subcategories; //this.props.categories.filter((itm) => itm.parent==item.id);
            this.setState({active: true, item: item, num: index,current_categories:_sub});
            //this.props.dispatch(favouriteListActions.getChildCategories(UID, item.id));
        }
    }

    // imgError(image) {
    //     image.onerror = null;
    //     image.className = 'errorImage'
    //     image.src = "assets/img/placeholder.png";
    //     return true;
    // }

    RemoveFavProduct(data) {
        // this.setState({
        //     favDelete_status: true
        // })
        // if (data.category_slug) {
        //     const UID = get_UDid('UDID');
        //     const favid = data.id
        //     this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        // }
        // if (data.attribute_slug) {
        //     const UID = get_UDid('UDID');
        //     const favid = data.id
        //     this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        // }
        // if (data.Product_Id) {
        //     const UID = get_UDid('UDID');
        //     const favid = data.Id
        //     this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        // }
        // if (data.parent_attribute) {
        //     const UID = get_UDid('UDID');
        //     const favid = data.id
        //     this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
        // }
    }

    // freezScreen() {
    //     $('.disabled_popup_tile_close').modal({
    //         backdrop: 'static',
    //         keyboard: false
    //     })
    // }

    // DisplayPopUp(tilePosition) {
    //     this.props.tilePosition(tilePosition, this.props.favourites)
    //     if (isMobileOnly == true) {
    //         this.props.openModal("tile_modal")
    //     }
    //     try {
    //         //$('#popup_cash_rounding').modal('show');
    //         showModal('tallModal');
    //     } catch (error) {
    //         console.log("Error", error);
    //     }

    //     //this.freezScreen();
    // }

    // getFavListApi() {
    //     const register_Id = localStorage.getItem('register');
    //     this.props.dispatch(favouriteListActions.getAll(udid, register_Id));
    // }

    componentWillReceiveProps(props) {
        // const { favProductDelete, favouritesProductAdd, status } = props;
        // if (favProductDelete && favProductDelete && favProductDelete.is_success == true && this.state.favDelete_status == true) {
        //     const register_Id = localStorage.getItem('register');
        //     this.state.favovrArrayList = [];
        //     this.setState({ favDelete_status: false, favovrArrayList: [] })
        //     this.getFavListApi()
        // }
        // if (favouritesProductAdd && favouritesProductAdd && favouritesProductAdd.is_success == true && status == true) {
        //     const { addStatus } = this.props;
        //     this.state.favovrArrayList = [];
        //     const register_Id = localStorage.getItem('register');
        //     addStatus(false);
        //     this.setState({ favovrArrayList: [] })
        //     this.getFavListApi()
        // }
        // this.checkStatus();
        // var ticket_Data = localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : ''
        // var tick_data = this.state.ticket_Product_status == true ? JSON.parse(this.state.ticket_Product[0].TicketInfo) : ''
        // var form_id = tick_data._owner_form_template

        // if (localStorage.getItem('ticket_list') && localStorage.getItem('ticket_list') !== 'null' && localStorage.getItem('ticket_list') !== '' && this.state.ticket_Product_status == true && this.state.tick_type == 'simpleadd' || form_id == -1 || form_id == '' && this.state.ticket_Product_status == true && this.state.tick_type == 'simpleadd') {
        //     this.setState({ ticket_Product_status: false })
        //     var index = null;
        //     var type = null;
        //     this.ActiveList(this.state.ticket_Product[0], index = null, type = null, localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '')
        // }
        // if (props.favourites) {
        //     const favouritesItemsProduct = props.favourites && props.favourites.FavProduct ? getTaxAllProduct(props.favourites.FavProduct) : null;

        //     this.state.favouritesItemsProduct = favouritesItemsProduct
        //     this.setState({ favouritesItemsProduct: favouritesItemsProduct })
        // }
        // var prdList = [];
        // this.state.favouritesItemsProduct && this.state.favouritesItemsProduct.map((item, index) => {
        //     var getfilterTicketProduct = []
        //     if (this.state.productlist && this.state.productlist.length > 0) {
        //         this.state.productlist.filter(prodlist => prodlist.WPID == item.Product_Id);
        //     }
        //     if (getfilterTicketProduct) {
        //         getfilterTicketProduct && getfilterTicketProduct.map((prod, index) => {
        //             var isExpired = false;
        //             if (prod.IsTicket && prod.IsTicket == true) {
        //                 var ticketInfo = JSON.parse(prod.TicketInfo);
        //                 if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
        //                     var dt = new Date(ticketInfo._ticket_availability_to_date);
        //                     var expirationDate = dt.setDate(dt.getDate() + 1);
        //                     var currentDate = new Date();
        //                     if (currentDate > expirationDate) {
        //                         isExpired = true;
        //                     }
        //                 }
        //             }
        //             if (isExpired == false) {
        //                 var data = {
        //                     Id: item.Id,
        //                     Image: prod.ProductImage,
        //                     InStock: prod.InStock,
        //                     ManagingStock: prod.ManagingStock,
        //                     Price: prod.Price,
        //                     Product_Id: prod.WPID,
        //                     Stock: prod.StockQuantity,
        //                     Title: prod.Title,
        //                     Type: prod.Type,
        //                     old_price: prod.old_price,
        //                     TaxStatus: prod.TaxStatus,
        //                     incl_tax: prod.incl_tax,
        //                     excl_tax: prod.excl_tax,
        //                     discount_type: prod.discount_type ? prod.discount_type : "",
        //                     new_product_discount_amount: prod ? prod.new_product_discount_amount : 0,
        //                     TaxClass: prod ? prod.TaxClass : '',
        //                     isTaxable: prod.Taxable
        //                 }
        //                 prdList.push(data)
        //             }
        //         })
        //     }
        // })
        // var _favrList = props.favourites;
        // if (prdList.length > 0) {
        //     _favrList.FavProduct = prdList;
        // }

        // if (props.favourites !== this.props.favourites) {
        //     this.preparefavList(_favrList);
        // }

    }

    // preparefavList(favourites) {
    //     var sizeArray = this.state.size
    //     var favArrayList = [];
    //     var FavSubCategory = []
    //     const favouritesItemsAttribute = favourites && favourites.FavAttribute ? favourites.FavAttribute : [];
    //     const favouritesItemsCategory = favourites && favourites.FavCategory ? favourites.FavCategory : [];
    //     const favouritesItemsSubCategory = favourites && favourites.FavSubCategory ? favourites.FavSubCategory : [];
    //     const favouritesItemsSubAttribute = favourites && favourites.FavSubAttribute ? favourites.FavSubAttribute : [];
    //     const favouritesItemProduct = favourites && favourites.FavProduct ? favourites.FavProduct : []
    //     favouritesItemsSubCategory && favouritesItemsSubCategory.length > 0 && favouritesItemsSubCategory.map(item => {
    //         item['sub_category_type'] = "sub-category"
    //         FavSubCategory.push(item)
    //     })
    //     favArrayList = [...favouritesItemsAttribute, ...favouritesItemsCategory, ...FavSubCategory, ...favouritesItemsSubAttribute, ...favouritesItemProduct] //arr3 ==> [1,2,3,4,5,6]
    //     const arrayUniqueByKey = [...new Map(favArrayList.map(item =>
    //         [item['Order'], item])).values()];
    //     this.setState({ favovrArrayList: arrayUniqueByKey })


    //     //    prepare list for android and ios fav list-------------------
    //     var arrayUniqueByKeyIn24 = [];
    //     var arrayNumList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    //     var removeNumList = [];
    //     if (arrayUniqueByKey && arrayUniqueByKey.length > 0) {
    //         arrayNumList.map(order_Number => {
    //             var findSameOrderNum = arrayUniqueByKey.find(itm => itm.Order === order_Number);
    //             if (findSameOrderNum) {
    //                 arrayUniqueByKeyIn24.push(findSameOrderNum);
    //             }
    //         })
    //     }
    //     if (arrayUniqueByKeyIn24 && arrayUniqueByKeyIn24.length > 0) {
    //         arrayUniqueByKeyIn24.map(items => {
    //             for (var i = arrayNumList.length - 1; i--;) {
    //                 if (arrayNumList[i] === items.Order) arrayNumList.splice(i, 1);
    //             }
    //         })
    //     } else if (arrayUniqueByKeyIn24 && arrayUniqueByKeyIn24.length == 0) {
    //         arrayUniqueByKeyIn24.push(1)
    //     }
    //     arrayUniqueByKeyIn24.push(arrayNumList[0])
    //     // --------------------------------------------------------------
    //     this.setState({
    //         favovrArrayList: arrayUniqueByKey,
    //         mfavovrArrayList: arrayUniqueByKeyIn24
    //     })

    //     setTimeout(function () {
    //         if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
    //     }, 500);

    // }

    updateActiveStateOnRef(st) {

        var _sub=this.props.categories.filter((itm) => itm.id==this.state.item.parent);
        if(_sub && _sub.length>0 && _sub[0].parent!=0)
        {
            _sub = _sub;
        }
        else
        {
            _sub=this.props.categories.filter((itm) => itm.parent==0);
        }

        this.state.active = st
        this.setState({ active: st,current_categories:_sub })
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 500);
        this.props.tileFilterData(null, "product", null)
    }

    setSubCategoryList(item, index, type) {
        this.setState({
            active: true,
            item: item,
            num: index
        })
    }


    render() {
        const { clearall, favourites, favouritesChildCategoryList, favouritesSubAttributeList, status, isShopView} = this.props;
        //console.log("favouritesChildCategoryList", favouritesChildCategoryList)
        const { active, item, num, childCategoryList, favDelete_status,current_categories } = this.state;
        
        return (
            <div className="category-tile-group" >
                {
                    active != true 
                    ?
                    null
                        : num == 2 ?
                            <FavouriteItemView
                                childCategory={favouritesChildCategoryList ? favouritesChildCategoryList : null}
                                setSubCategoryList={this.setSubCategoryList} tileFilter={this.tileProductListFilter} updateActiveStateOnRef={this.updateActiveStateOnRef}
                            /> :
                            
                                num == 4 ?
                                    <FavouriteItemView
                                        subchildCategory={this.state.item ? item : null}
                                        setSubCategoryList={this.setSubCategoryList} tileFilter={this.tileProductListFilter} updateActiveStateOnRef={this.updateActiveStateOnRef}
                                    /> :
                                    null
                }
                {/* {active!=true?
                    <div className="category-tile grouped" key={"attribute" + "All"} data-attribute-id="All">
                     <p>{LocalizedLanguage.showall}</p>
                    </div>
                :null
                } */}
                {
                //active!=true?
                current_categories && current_categories.map((item, index) => {                 
                        var titleName = item.Value
                        return (
                            item.parent==0 ?
                            <div className="category-tile grouped"  key={"category" + item.id} data-category-id={item.id} data-id={`attr_${item.id}`} data-category-slug={item.Value}  onClick={() => this.ActiveList(item, 2, "category")}>
                            <p>{titleName}</p>
                            </div>
                        : item.parent!=0 ?
                            <div className="category-tile grouped" key={"sub_category" + item.id} data-category-id={item.id} data-id={`attr_${item.id}`} data-category-slug={item.Value} onClick={() => this.ActiveList(item, 4, "sub-category")}>
                            <p>{titleName}</p>
                            </div>
                        : ''
                        )
                    })
                // :null
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
    };
}
const connectedFavouriteList = connect(mapStateToProps)(CategoriesList);
export { connectedFavouriteList as CategoriesList };