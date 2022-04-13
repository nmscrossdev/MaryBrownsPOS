import React from 'react';
import { connect } from 'react-redux';
import { categoriesActions } from '../_actions/categories.action'
import { attributesActions } from '../_actions/allAttributes.action'
import { favouriteListActions } from '../ShopView/action/favouritelist.actions'
import { default as NumberFormat } from 'react-number-format'
import { Markup } from 'interweave';
import Config from '../Config'
import ActiveUser from '../settings/ActiveUser';
import { LoadingModal } from './';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly, isIOS } from "react-device-detect";
import TileViewModal from '../_components/views/m.TileViewModal';
import { history } from '../_helpers'
import { trackPage } from '../_components/SegmentAnalytic'
class TileModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTile: true,
            active: false,
            subattributelist: [],
            subcategorylist: [],
            item: 0,
            filterActive: false,
            parentCategorys: [],
            parentAttributes: [],
            productList: [],
            AllProductList: [],
            AllProductListForSearch: [],
            FilterProductList: null,
            chunk_size: Config.key.PPRODUCT_PAGE_SIZE,
            pageNumber: 0,
            totalRecords: 0
        }

        this.props.dispatch(attributesActions.getAll());
        this.getProduct();
        this.prodTilefilter = this.prodTilefilter.bind(this);
        this.closeTile = this.closeTile.bind(this);
        this.ActiveList = this.ActiveList.bind(this);
        this.loadingData = this.loadingData.bind(this);
        this.loadSubAttribute = this.loadSubAttribute.bind(this);
        this.loadParentCategory = this.loadParentCategory.bind(this);
        this.loadSubCategory = this.loadSubCategory.bind(this);
        this.filterProductByTile = this.filterProductByTile.bind(this);
        this.clearInput = this.clearInput.bind(this);
        this.handleAddFilterProduct = this.handleAddFilterProduct.bind(this);
        this.addToFavourite = this.addToFavourite.bind(this);
        this.loadParentAttribute = this.loadParentAttribute.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }
    componentDidMount() {
        trackPage(history.location.pathname, "Tile View", "ShopView", "TileModel");
    }
    addToFavourite() {
        const { favourites, dispatch } = this.props;
        var favList = (isMobileOnly == true) ? localStorage.getItem('FAVROUTE_LIST_ARRAY') ? JSON.parse(localStorage.getItem("FAVROUTE_LIST_ARRAY")) : favourites.items : favourites.items;
        var type = $('input[name=setFavorite]:checked').data('type');
        var ids = $('input[name=setFavorite]:checked').data('id');
        var id = '';
        if (ids !== null) {
            id = parseInt(ids.replace('id_', ''))
        }
        var slug = $('input[name=setFavorite]:checked').data('slug');
        var isExist = false;
        var positionIndex = this.props.positionNum;
        if (type == "product") {
            favList && favList.FavProduct && favList.FavProduct.map(prod => {
                if (prod.Product_Id == id) {
                    isExist = true;
                }
            })
        } else if (type == "attribute" || type == "SubAttribute") {
            favList && favList.FavAttribute && favList.FavAttribute.map(attr => {
                if (attr.attribute_id == id) {
                    isExist = true;
                }
            })
        } else if (type == "category" || type == "SubCategory") {
            favList && favList.FavCategory && favList.FavCategory.map(cat => {
                if (cat.category_id == id) {
                    isExist = true;
                }
            })
        } else if (type == "SubAttribute") {
            favList && favList.FavSubAttribute && favList.FavSubAttribute.map(suatt => {
                if (suatt.attribute_id == id) {
                    isExist = true;
                }
            })
        } else if (type == "SubCategory") {
            favList && favList.FavSubCategory && favList.FavSubCategory.map(subcat => {
                if (subcat.category_id == id) {
                    isExist = true;
                }
            })
        }

        if (id && type && isExist == false) {
            this.closeModel();
            this.props.status(true, type, id, slug, positionIndex)
            // dispatch(favouriteListActions.addToFavourite(type, id, slug,positionIndex));
            $('.close').trigger('click');
            if (isMobileOnly == true) {
                this.props.openModal("")
            }
            //history.push('/shopView')
        } else {
            $("#tileback").val(null)
            $("#input_search").val(null);
            this.state.activeTile = true,
                this.state.active = false,
                this.state.subattributelist = [],
                this.state.item = 0,
                this.state.filterActive = false,
                this.state.FilterProductList = null
            this.setState({
                activeTile: true,
                active: false,
                subcategorylist: [],
                item: 0,
                filterActive: false,
                FilterProductList: null
            })
            if (id && type) { //apply check to protect msg display if no item selected and click on save button
                this.props.msg(LocalizedLanguage.alreadyExsist);
                if (isMobileOnly == true) {
                    $('#common_msg_popup').modal('show');
                }
                $('#common_msg_popup').modal('show');
            }
        }

    }

    handleAddFilterProduct(type, id, slug) {
        var positionIndex = this.props.positionNum;
        this.props.status(true)
        if (id && type) {
            this.props.dispatch(favouriteListActions.addToFavourite(type, id, slug, positionIndex));
            $('.close').trigger('click');
            if (isMobileOnly == true) {
                this.props.openModal("")
            }
        }
    }

    filterProductByTile() {

        var filter = $("#search_field").val();
        var filtered = [];
        var AllProduct = this.state.AllProductListForSearch;
        var serchFromAll = AllProduct && AllProduct.filter((item) => (item.Title.toLowerCase().includes(filter.toLowerCase()) || item.Barcode.toString().toLowerCase().includes(filter.toLowerCase()) || item.Sku.toString().toLowerCase().includes(filter.toLowerCase())))
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

        this.setState({ FilterProductList: filtered });

    }

    clearInput() {
        $("#search_field").val(null)
        this.setState({ filterActive: false, FilterProductList: null })

    }

    componentWillMount() {
        this.props.dispatch(categoriesActions.getAll());
    }

    handleIsVariationProduct(type, product) {
        if (type == "simple") {
            this.addSimpleProducttoCart(product);
        } else {
            this.addvariableProducttoCart(product);
        }
    }

    addSimpleProducttoCart(product) {
        const { dispatch, cartproductlist } = this.props;
        var cartlist = cartproductlist ? cartproductlist : [];
        dispatch(cartProductActions.addtoCartProduct(cartlist));
    }

    ActiveList(item) {
        this.setState({
            activeTile: false,
            item: item,
            active: false,
        })
    }

    loadSubAttribute(subattributelist, parentAttributes) {
        console.log("subattributelist", subattributelist)
        console.log("parentAttributes", parentAttributes)
        this.state.activeTile = false;
        this.state.active = true;
        this.state.subattributelist = subattributelist;
        this.state.parentAttributes = parentAttributes;
        this.setState({
            activeTile: false,
            active: true,
            subattributelist: subattributelist,
            parentAttributes: parentAttributes
        })
        $(".custom_radio input").prop("checked", false);
    }

    loadSubCategory(subcategorylist, parentCategorys) {
        this.state.activeTile = false;
        this.state.active = true;
        this.state.subcategorylist = subcategorylist;
        this.state.parentCategorys = parentCategorys;
        this.setState({
            activeTile: false,
            active: true,
            subcategorylist: subcategorylist,
            parentCategorys: parentCategorys
        })
        $(".custom_radio input").prop("checked", false);
    }

    loadParentCategory() {
        $(".custom_radio input").prop("checked", false);
        if (!this.state.parentCategorys || this.state.parentCategorys == null || this.state.parentCategorys.length == 0) {
            this.closeTile();
        } else {
            this.loadSubCategory(this.state.parentCategorys);
        }
    }

    loadParentAttribute() {
        $(".custom_radio input").prop("checked", false);
        if (!this.state.parentAttributes || this.state.parentAttributes == null || this.state.parentAttributes.length == 0) {
            this.closeTile();
        } else {
            this.loadSubAttribute(this.state.parentAttributes);
        }
    }

    closeTile() {
        $(".custom_radio input").prop("checked", false);
        $("#tileback").val(null)
        this.state.activeTile = true,
            this.state.active = false,
            this.state.subattributelist = [],
            this.state.item = 0,
            this.state.filterActive = false,
            this.state.parentAttributes = [],
            this.state.parentCategorys = []
        this.FilterProductList = null
        this.setState({
            activeTile: true,
            active: false,
            subcategorylist: [],
            item: 0,
            filterActive: false,
            parentCategorys: [],
            parentAttributes: [],
            FilterProductList: null
        })
    }

    closeModel() {
        $(".custom_radio input").prop("checked", false);
        $("#tileback").val(null)
        $(".search_customer_input").val("");
        $(".search_customer_input").val(null);
        $("#input_search").val(null);
        this.state.activeTile = true,
            this.state.active = false,
            this.state.subattributelist = [],
            this.state.item = 0,
            this.state.filterActive = false,
            this.state.FilterProductList = null
        this.setState({
            activeTile: true,
            active: false,
            subcategorylist: [],
            FilterProductList: null,
            item: 0,
            filterActive: false
        })
        $('.close').trigger('click');
        if (isMobileOnly == true) {
            this.props.openModal("")
        }
    }

    prodTilefilter(e) {
        this.setState({ filterActive: true })
    }

    getProduct() {
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        var _ProductList = [];
        var _AllProductForSearch = [];
        idbKeyval.get('ProductList').then(val => {
            if (!val || val.length == 0 || val == null || val == "") { //do nothing
            } else {
                val.map(item => {
                    _AllProductForSearch.push(item);
                    if (item.ParentId == 0) {
                        _ProductList.push(item);
                    }
                })
                this.setState({ AllProductListForSearch: _AllProductForSearch });
                this.setState({ AllProductList: _ProductList });
                this.state.totalRecords = _ProductList.length;
                this.loadingData()
                //console.log("AllProductListForSearch", this.state.AllProductListForSearch);
            }
        }
        );
    }

    loadingData() {
        var prdList = [];
        var tilDisplayIndex = this.state.pageNumber * this.state.chunk_size + this.state.chunk_size;
        var AllProductList = this.state.AllProductList.sort(function (a, b) {
            var nameA = a.Title.toUpperCase(); // ignore upper and lowercase
            var nameB = b.Title.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });

        AllProductList.map((prod, index) => {
            if (index >= 0 && index < tilDisplayIndex) {
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
                if (isExpired == false)
                    prdList.push(prod)
            }
        });
        this.state.productList = prdList;
        this.setState({ productList: prdList })
        this.state.pageNumber = this.state.pageNumber + 1;
    }

    render() {
        const { active, activeTile, item, productList, subattributelist, isLoading, subcategorylist, filterActive, FilterProductList } = this.state;
        const { categorylist, attributelist, filteredProduct } = this.props;
        var productlist = productList;
        // if (filteredProduct && filteredProduct.length) {
        //     productlist = filteredProduct;
        //   }
        if (FilterProductList !=null) {
            productlist = FilterProductList;
        }

        return (
            (isMobileOnly == true) ?
                <TileViewModal
                    {...this.props}
                    {...this.state}
                    LocalizedLanguage={LocalizedLanguage}
                    prodTilefilter={this.prodTilefilter}
                    closeTile={this.closeTile}
                    ActiveList={this.ActiveList}
                    loadingData={this.loadingData}
                    loadSubAttribute={this.loadSubAttribute}
                    loadParentCategory={this.loadParentCategory}
                    loadSubCategory={this.loadSubCategory}
                    filterProductByTile={this.filterProductByTile}
                    clearInput={this.clearInput}
                    handleAddFilterProduct={this.handleAddFilterProduct}
                    loadParentAttribute={this.loadParentAttribute}
                    Markup={Markup}
                    NumberFormat={NumberFormat}
                    addToFavourite={this.addToFavourite}
                    closeModel={this.closeModel}
                />
                :
                <div id="tallModal" tabIndex="-1" className="modal modal-wide fade full_height_one disabled_popup_tile_close modal-wide-responsive">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close fs36 mt-0" aria-hidden="true" data-dismiss="modal" onClick={() => this.closeModel()} >
                                    <img src="assets/img/Close.svg" />
                                    {/* <i className="icon icon-fill-close icon-css-override text-danger pointer push-top-3"></i> */}
                                </button>
                                <h4 className="modal-title">{LocalizedLanguage.addToTile}</h4>
                            </div>
                            <div className="modal-body pl-0 pr-0 pt-0" id="scroll_mdl_body">
                                <div className="all_product">
                                    <div className="overflowscroll" id="scroll_mdl_body">
                                        {filterActive == false ?
                                            activeTile == true ?
                                                <div id="viewTile">
                                                    {/* <div className="clearfix">
                                                        <div className="searchDiv relDiv">
                                                            <input id="input_search" className="card-input" placeholder={LocalizedLanguage.placeholderSearchProduct} type="search" onChange={() => this.prodTilefilter()} />
                                                            <svg onClick={() => this.closeTile()} className="search_customer_input2" style={{ right: 22 }} width="23" version="1.1" xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/1999/xlink" enableBackground="new 0 0 64 64">
                                                                <g>
                                                                    <path fill="#C5BFBF" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"></path>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                    </div> */}
                                                    {ActiveUser.key.isSelfcheckout !==true ? <div className="card-search-box ">
                                                        <div className="card-search">
                                                            <i className="icons8-search-more"></i>
                                                        </div>
                                                        <input id="input_search" className="card-input" onChange={() => this.prodTilefilter()} placeholder={LocalizedLanguage.placeholderSearchProduct} ></input>
                                                        <div className="card-close" onClick={() => this.closeTile()}>
                                                            <i className="icons8-cancel"></i>
                                                        </div>
                                                    </div>
                                                     : null}
                                                    <table className="table ShopProductTable">
                                                        <colgroup>
                                                            <col style={{ width: '*' }} />
                                                            <col style={{ width: 60 }} />
                                                        </colgroup>
                                                        <tbody>
                                                            {(ActiveUser.key.isSelfcheckout == false) ?
                                                                <tr className="pointer" key='1' onClick={() => this.ActiveList(1)}>
                                                                    <td>{LocalizedLanguage.allItems}</td>
                                                                    <td className="text-center"><a className="fs24"><i className="icons8-login"></i></a></td>
                                                                </tr>
                                                                :
                                                                null
                                                            }
                                                            <tr className="pointer" key='2' onClick={() => this.ActiveList(2)}>
                                                                <td>{LocalizedLanguage.attribute}</td>
                                                                <td className="text-center"><a className="fs24"><i className="icons8-login"></i></a></td>
                                                            </tr>
                                                            <tr className="pointer" key='3' onClick={() => this.ActiveList(3)}>
                                                                <td>{LocalizedLanguage.categories}</td>
                                                                <td className="text-center"><a className="fs24"><i className="icons8-login"></i></a></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                :
                                                (
                                                    item == 1 ?  //Product
                                                        <div>
                                                            <div className="clearfix">
                                                                <div className="searchDiv relDiv">
                                                                    <input className="form-control nameSearch bb-0 backbutton" id="tileback" value={LocalizedLanguage.back} readOnly={true} data-toggle="modal" onClick={() => this.closeTile()} />
                                                                </div>
                                                            </div>
                                                            <table className="table ShopProductTable">
                                                                <tbody>
                                                                    {(isLoading && !productlist) ?
                                                                        <tr>
                                                                            <td>  <i className="fa fa-spinner fa-spin">{LocalizedLanguage.loading}</i></td>
                                                                        </tr>
                                                                       
                                                                       : productlist && productlist.map((item, index) => {
                                                                            var isSimpleProduct = (item.Type != "simple") ? true : false;
                                                                            return (
                                                                                <tr key={index} >
                                                                                    <td style={divStyle} className="pointer">
                                                                                        <div className="custom_radio custom_radio_set">
                                                                                            <input type="radio" name="setFavorite" id={`id_${item.WPID}`} value={item.WPID} data-type="product" data-slug={item.Type} data-id={`id_${item.WPID}`} />
                                                                                            <label htmlFor={`id_${item.WPID}`} className="pl-3">&nbsp;</label>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td align="left" className="pl-2">
                                                                                        {item.Title && item.Title !== "" ? <Markup content={(item.Title).replace(" - ", "-")} /> : (item.Sku && item.Sku !== "" && item.Sku !== "False") ? item.Sku : 'N/A'}
                                                                                    </td>
                                                                                    <td className="text-right" ></td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            {((!this.state.search) && this.state.totalRecords > this.state.chunk_size * this.state.pageNumber) ?
                                                                <div className="createnewcustomer">
                                                                    <button type="button" className="btn btn-block btn-primary total_checkout" id='hideButton' onClick={() => this.loadingData()}>{LocalizedLanguage.loadMore}</button>
                                                                </div>
                                                                :
                                                                <div></div>
                                                            }
                                                        </div>
                                                        : item == 2 ?  //Attribute
                                                            <div>
                                                                <div className="clearfix">
                                                                    <div className="searchDiv relDiv">
                                                                        <input className="form-control nameSearch bb-0 backbutton" id="tileback"value={LocalizedLanguage.back} readOnly={true} data-toggle="modal" onClick={() => this.loadParentAttribute()} />  {/* href="#viewTile" */}
                                                                    </div>
                                                                </div>
                                                                {
                                                                    this.state.active != true ?
                                                                        <div >
                                                                            {!attributelist ? <LoadingModal /> : ''}
                                                                            {/* {!attributelist || attributelist.length == 0 ? <LoadingModal /> : ''} */}
                                                                            <div>
                                                                                <table className="table ShopProductTable">
                                                                                    <tbody>
                                                                                        {(isLoading && !attributelist) ?
                                                                                            <tr  >
                                                                                                <td>  <i className="fa fa-spinner fa-spin">{LocalizedLanguage.loading}</i></td>
                                                                                            </tr>
                                                                                            :
                                                                                            attributelist && attributelist.length > 0 ? attributelist.map((item, index) => {
                                                                                                return (
                                                                                                    <tr key={index} className="pointer">
                                                                                                        <td style={divStyle}>
                                                                                                            <div className="custom_radio custom_radio_set">
                                                                                                                <input type="radio" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-slug={item.Value} data-type="attribute" data-id={`id_${item.Id}`} />
                                                                                                                <label htmlFor={`id_${item.Id}`} className="pl-3">&nbsp;</label>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                        <td align="left" className="pl-2" onClick={() => this.loadSubAttribute(item.SubAttributes, attributelist)}>
                                                                                                            <Markup content={item.Value}></Markup>    </td>
                                                                                                        <td style={divStyle2} > </td>
                                                                                                        <td className="text-right" onClick={() => this.loadSubAttribute(item.SubAttributes, attributelist)}><a className="fs24"><i className="icons8-login"></i></a></td>
                                                                                                    </tr>
                                                                                                )
                                                                                            })
                                                                                                :
                                                                                                <tr data-toggle="modal" ><td style={{ textAlign: "center" }}>{LocalizedLanguage.noFound}</td></tr>

                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div>
                                                                            <table className="table ShopProductTable">
                                                                                <tbody>
                                                                                    {
                                                                                        (subattributelist && subattributelist.length > 0 ? subattributelist.map((item, index) => {
                                                                                            return (
                                                                                                <tr key={index} className="pointer">
                                                                                                    <td style={divStyle}>
                                                                                                        <div className="custom_radio custom_radio_set">
                                                                                                            <input type="radio" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-slug={item.Value} data-type="SubAttribute" data-id={`id_${item.Id}`} />
                                                                                                            <label htmlFor={`id_${item.Id}`} className="pl-3">&nbsp;</label>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    {item.SubAttributes ?
                                                                                                        <td align="left" className="pl-2" onClick={() => this.loadSubAttribute(item.SubAttributes, subattributelist)}> <Markup content={item.Value}></Markup>     </td> :
                                                                                                        <td align="left" className="pl-2"> <Markup content={item.Value}></Markup> </td>
                                                                                                    }
                                                                                                    {item.SubAttributes ?
                                                                                                        <td style={divStyle2} onClick={() => this.loadSubAttribute(item.SubAttributes, subattributelist)} ><a className="fs24"><i className="icons8-login"></i></a> </td>
                                                                                                        : <td className="text-right">
                                                                                                            <div className="custom_radio">
                                                                                                                <input type="radio" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-slug={item.Value} data-type="SubAttribute" data-id={`id_${item.Id}`} />
                                                                                                                <label htmlFor={`id_${item.Id}`} className="pl-3">&nbsp;</label>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    }
                                                                                                </tr>
                                                                                            )
                                                                                        })
                                                                                            :
                                                                                            <tr data-toggle="modal"><td>{LocalizedLanguage.noFound}</td></tr>)
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                }
                                                            </div>
                                                            : item == 3 ?
                                                                // <Categories />
                                                                <div>
                                                                    <div className="clearfix">
                                                                        <div className="searchDiv relDiv">
                                                                            <input className="form-control nameSearch bb-0 backbutton" id="tileback" value={LocalizedLanguage.back}type="search" readOnly={true} data-toggle="modal" onClick={() => this.loadParentCategory()} />  {/* href="#viewTile" */}
                                                                        </div>
                                                                    </div>
                                                                    {active != true ?
                                                                        <table className="table ShopProductTable ">
                                                                            <tbody>
                                                                                {categorylist && categorylist.map((item, index) => {
                                                                                    return (
                                                                                        <tr key={index} >
                                                                                            <td align="left" className="p-0" style={divStyle}>
                                                                                                <div className="custom_radio custom_radio_set">
                                                                                                    <input type="radio" name="setFavorite" id={`id_${item.id}`} value={item.id} data-slug={item.Value ? item.Value : 'N/A'} data-type="category" data-id={`id_${item.id}`} />
                                                                                                    <label htmlFor={`id_${item.id}`} className="pl-3">&nbsp;</label>
                                                                                                </div>
                                                                                            </td>
                                                                                            {item.Subcategories && item.Subcategories.length > 0 ?
                                                                                                <td align="left" className="pl-2 pointer" onClick={() => this.loadSubCategory(item.Subcategories, categorylist)}> <Markup content={item.Value}></Markup>   </td>
                                                                                                :
                                                                                                <td align="left" className="pl-2"> <Markup content={item.Value}></Markup></td>
                                                                                            }
                                                                                            {item.Subcategories && item.Subcategories.length > 0 ?
                                                                                                <td className="p-0 pointer text-center" onClick={() => this.loadSubCategory(item.Subcategories, categorylist)} ><a className="fs24"><i className="icons8-login"></i></a> </td>
                                                                                                : <td className="text-right"></td>
                                                                                            }
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                        :
                                                                        <div>
                                                                            <table className="table ShopProductTable">
                                                                                <tbody>
                                                                                    {
                                                                                        (subcategorylist && subcategorylist.length > 0 ? subcategorylist.map((item, index) => {
                                                                                            return (
                                                                                                <tr key={index} >
                                                                                                    <td align="left" className="p-0" style={divStyle}>
                                                                                                        <div className="custom_radio custom_radio_set">
                                                                                                            <input type="radio" name="setFavorite" id={`id_${item.id}`} value={item.id} data-slug={item.Value} data-type="SubCategory" data-id={`id_${item.id}`} />
                                                                                                            <label htmlFor={`id_${item.id}`} className="pl-3">&nbsp;</label>
                                                                                                        </div>

                                                                                                    </td>
                                                                                                    {item.Subcategories && item.Subcategories.length > 0 ?
                                                                                                        <td align="left" className="pl-2 pointer" onClick={() => this.loadSubCategory(item.Subcategories, subcategorylist)}>  {item.Value}      </td> :
                                                                                                        <td align="left" className="pl-2"> {item.Value} </td>
                                                                                                    }
                                                                                                    {item.Subcategories && item.Subcategories.length > 0 ?
                                                                                                        <td className="p-0 pointer text-center" onClick={() => this.loadSubCategory(item.Subcategories, subcategorylist)} ><a className="fs24"><i className="icons8-login"></i></a></td>
                                                                                                        : <td className="text-right">
                                                                                                            <div className="custom_radio">
                                                                                                                <input type="radio" name="setFavorite" id={`id_${item.id}`} value={item.id} data-slug={item.Value} data-type="SubCategory" data-id={`id_${item.id}`} />
                                                                                                                <label htmlFor={`id_${item.id}`} className="pl-3">&nbsp;</label>
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    }
                                                                                                </tr>
                                                                                            )
                                                                                        })
                                                                                            :
                                                                                            <tr data-toggle="modal"><td>{LocalizedLanguage.noFound}</td></tr>)
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    }
                                                                </div>
                                                                : null
                                                )
                                            : <div id="viewTile">
                                                {/* <div className="clearfix" >
                                                    <div className="searchDiv relDiv" >
                                                        <input type="text" id="search_field" name="search" className="form-control nameSearch search_customer_input backbutton bb-0 noshadow pl-5" onChange={() => this.filterProductByTile()} placeholder={LocalizedLanguage.placeholderSearchProduct} />
                                                        <svg onClick={() => this.clearInput()} className="search_customer_input2" style={{ right: 24 }} width="23" version="1.1" xmlns="http://www.w3.org/2000/svg" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/1999/xlink" enableBackground="new 0 0 64 64">
                                                            <g>
                                                                <path fill="#C5BFBF" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"></path>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </div> */}
                                                <div className="card-search-box ">
                                                    <div className="card-search">
                                                        <i className="icons8-search-more"></i>
                                                    </div>
                                                    <input id="search_field" className="card-input" onChange={() => this.filterProductByTile()} placeholder={LocalizedLanguage.placeholderSearchProduct} ></input>
                                                    <div className="card-close" onClick={() => this.clearInput()}>
                                                        <i className="icons8-cancel"></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <table className="table ShopProductTable" id="list">
                                                        <colgroup>
                                                            <col style={{ width: '*' }} />
                                                            <col style={{ width: 40 }} />
                                                        </colgroup>
                                                        <tbody>
                                                            {(isLoading && !productlist) ?
                                                                <tr>
                                                                    <td>  <i className="fa fa-spinner fa-spin">{LocalizedLanguage.loading}</i></td>
                                                                </tr>
                                                                 :
                                                                 productlist && productlist.length==0?
                                                                 <tr key="norecord" >
                                                                 <td align="left" className="pl-2">{LocalizedLanguage.noMatchingProductFound}</td><td ></td><td className="text-right" ></td>
                                                                 </tr>
                                                                :
                                                                productlist && productlist.map((item, index) => {
                                                                    var isSimpleProduct = (item.Type == "variable") ? true : false;
                                                                    return (
                                                                        <tr key={index} >
                                                                            <td align="left" className="pl-3" >{item.Title ? <Markup content={item.Title}></Markup> : 'N/A'}
                                                                            </td>
                                                                            <td className="text-right"><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                                            </td>

                                                                            <td className="text-right pointer" style={{ padding: 20 }} onClick={() => this.handleAddFilterProduct('product', item.WPID, item.Type)} >
                                                                                <a>
                                                                                    <img src="assets/img/add_29.png" />
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer p-0">
                                <button type="button" className="btn btn-primary btn-block h66" onClick={() => this.addToFavourite()}>{LocalizedLanguage.capitalSaveUpdate}</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

const divStyle = {
    width: "56px"
};

const divStyle2 = {
    width: "14px"
};

function mapStateToProps(state) {
    const { categorylist, productlist, attributelist, favourites } = state;
    return {
        categorylist: categorylist.categorylist,
        productlist: productlist,
        attributelist: attributelist.attributelist,
        favourites: favourites
    };
}

const connectedList = connect(mapStateToProps)(TileModel);
export { connectedList as TileModel };