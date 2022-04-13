import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions/cartProduct.action'
import { Categories } from './Categories';
import { Markup } from 'interweave';
import { default as NumberFormat } from 'react-number-format'
import { getTaxAllProduct } from './'
import { allProductActions } from '../_actions/allProduct.action';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import LocalizedLanguage from '../settings/LocalizedLanguage';

class SubCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subcategorylist: this.props.subcategorylist,
            productlist: [],
            Product_category: [],
            active: false,
            parentCategories: [],
            backToCategories: false,
            ticket_Product_status: false
        }
        var prdList = [];
        this.state.subcategorylist && this.state.subcategorylist.map((prod, index) => {
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
            if (isExpired == false) {
                prdList.push(prod)
            }
        })
        if (prdList.length > 0) {
            this.state.subcategorylist = prdList;
            this.setState({ subcategorylist: prdList })
        }
        //--------------------------------------------------------------
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            this.setState({ productlist: getTaxAllProduct(val) });
        });
        //--------------------------------------------------------------
    }

    loadSubCategory(subcatlist, parentCategories) {
        this.setState({
            active: true,
            parentCategories: parentCategories
        })
        this.state.Product_category.push(subcatlist)
    }

    loadProdCategory(item, parentCategories) {
        this.setState({
            active: false,
            parentCategories: parentCategories
        })
        var Code = item.Code
        var catg_Code = Code ? Code.toString().replace(/-/g, " ") : Code;
        this.setState({
            active: true
        })
        this.state.productlist && this.state.productlist.map(prod => {
            prod.Categories.split(',').map(categ => {
                var prod_Code = categ ? categ.toString().replace(/-/g, " ") : categ;
                if (prod_Code.toUpperCase() == catg_Code.toUpperCase() || prod_Code.toLowerCase() == catg_Code.toLowerCase()) {
                    var variationProdect = this.state.productlist.filter(item => {
                        return (item.ParentId === prod.WPID && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1)))
                    })
                    prod['Variations'] = variationProdect
                    this.state.Product_category.push(prod)
                }
            })
        })
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

    ActiveList(item, parentCategories, ticketFields = null) {
        this.setState({
            parentCategories: parentCategories
        })
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        if (item.Type !== "variable") {
            //for inclusive and axclusive tax------------------
            var arr = []
            arr.push(item);
            arr = getTaxAllProduct(arr);
            item = arr[0];
            if (ticketFields == null && item && item.IsTicket == true) {
                var tick_typ = 'simpleadd'
                this.getTicketFields(item, tick_typ);
            }
            //-------------------------------------------
            if (item.InStock == true && item.IsTicket == false) {
                var data = {
                    Price: parseFloat(item.Price),
                    Title: item.Title,
                    line_item_id: 0,
                    quantity: 1,
                    product_id: item.WPID,
                    variation_id: 0,
                    isTaxable: true,
                    after_discount: item.after_discount,
                    cart_after_discount: item.cart_after_discount,
                    cart_discount_amount: item.cart_discount_amount,
                    discount_amount: item.discount_amount,
                    excl_tax: item.excl_tax,
                    incl_tax: item.incl_tax,
                    old_price: item.old_price,
                    product_after_discount: item.product_after_discount,
                    product_discount_amount: item.product_discount_amount,
                    ticket_status: item.ticket_status,
                    TaxStatus: item ? item.TaxStatus : "",
                    TaxClass: item ? item.TaxClass : '',

                }
                localStorage.setItem('Favproduct', null)
                var product = item
                var qty = 0;
                cartlist.map(item => {
                    if (product.WPID == item.product_id) {
                        qty = item.quantity;
                    }
                })

                if ((product.StockStatus == null || product.StockStatus == 'instock') && (product.ManagingStock == false || (product.ManagingStock == true && qty < product.StockQuantity))) {
                    cartlist.push(data)
                    this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
                } else {
                    this.props.msg('Product is out of stock.');
                    $('#common_msg_popup').modal('show');
                }
            } else if (item.InStock == true && item.IsTicket == true && ticketFields != null) {
                var tick_data = item && item.TicketInfo != '' ? JSON.parse(item.TicketInfo) : '';
                var data = {
                    Price: parseFloat(item.Price),
                    Title: item.Title,
                    line_item_id: 0,
                    quantity: 1,
                    product_id: item.WPID,
                    variation_id: 0,
                    isTaxable: true,
                    after_discount: item.after_discount,
                    cart_after_discount: item.cart_after_discount,
                    cart_discount_amount: item.cart_discount_amount,
                    discount_amount: item.discount_amount,
                    excl_tax: item.excl_tax,
                    incl_tax: item.incl_tax,
                    old_price: item.old_price,
                    product_after_discount: item.product_after_discount,
                    product_discount_amount: item.product_discount_amount,
                    ticket_status: item.IsTicket,
                    tick_event_id: tick_data._event_name,
                    product_ticket: ticketFields,
                    TaxStatus: item ? item.TaxStatus : "",
                    TaxClass: item ? item.TaxClass : '',
                }
                localStorage.setItem('Favproduct', null)
                var product = item
                var qty = 0;
                cartlist.map(item => {
                    if (product.WPID == item.product_id) {
                        qty = item.quantity;
                    }
                })

                if ((product.StockStatus == null || product.StockStatus == 'instock') && (product.ManagingStock == false || (product.ManagingStock == true && qty < product.StockQuantity))) {
                    cartlist.push(data)
                    this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
                } else {
                    this.props.msg('Product is out of stock.');
                    $('#common_msg_popup').modal('show');
                }
            } else if (item.InStock == false) {
                this.props.msg('Product is out of stock.');
                $('#common_msg_popup').modal('show');
            }
        }

        if (item.Type == "variable") {
            if (item && item.IsTicket == true) {
                this.getTicketFields(item);
            }
            if (item.InStock == true) {
                var product = item
                this.props.productData(product);
                $('#VariationPopUp').modal('show');
            } else {
                this.props.msg('Product is out of stock.');
                $('#common_msg_popup').modal('show');
            }
        }
    }

    Back() {
        this.setState({ Product_category: [] });
        if (!this.state.parentCategories || this.state.parentCategories == null || this.state.parentCategories.length == 0) {
            this.setState({ backToCategories: true });
        }
        else {
            this.setState({ active: false, parentCategories: null });
            this.state.Product_category.push(this.state.parentCategories)
        }
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    componentWillReceiveProps(props) {
        const { ticket_Product_status, ticket_Product, tick_type} = this.state;
        var tick_data = ticket_Product_status == true ? JSON.parse(ticket_Product.TicketInfo) : '';
        var form_id = tick_data._owner_form_template;
        if (localStorage.getItem('ticket_list') && localStorage.getItem('ticket_list') !== 'null' && localStorage.getItem('ticket_list') !== '' && ticket_Product_status == true && tick_type == 'simpleadd' || form_id == -1 || form_id == '' && ticket_Product_status == true && tick_type == 'simpleadd') {
            this.setState({ ticket_Product_status: false })
            var parentCategories = null;
            this.ActiveList(ticket_Product, parentCategories, localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '')
        }
    }

    render() {
        const { subcategorylist, backToCategories, active, Product_category } = this.state;
        return (
            <div>
                {backToCategories == false ?
                    <div className="col-lg-9 col-sm-8 col-xs-8 pr-0">
                        <div className="items pt-3">
                            <div className="item-heading text-center">{LocalizedLanguage.library}</div>
                            <div className="panel panel-default panel-product-list overflowscroll p-0" id="allProductHeight">
                                <div className="searchDiv" style={{ display: 'none' }}>
                                    <input type="search" className="form-control nameSearch" placeholder={LocalizedLanguage.placeholderSearchAndScan} />
                                </div>
                                {/* <div className="pl-4 pr-4 previews_setting">
                            <a href="/listview" className="back-button " id="mainBack">
                                <img className="pushnext ml-2 mr-3 mCS_img_loaded" src="assets/img/back_modal.png" />
                                <span>Back</span>
                            </a>
                        </div> */}
                                <div className="pl-1 pr-4 previews_setting  pointer">
                                    <a onClick={() => this.Back()} className="back-button d-flex align-items-center mt-0 mb-0 " id="mainBack">
                                        <i className="icons8-undo ml-2 mr-2 fs30 pointer"></i>
                                        <span>{LocalizedLanguage.back}</span>
                                    </a>
                                </div>
                                <table className="table ShopProductTable  table-striped table-hover table-borderless paddignI mb-0 font">
                                    <tbody>
                                        {active == false ? (
                                            (subcategorylist && subcategorylist.length > 0 ? subcategorylist.map((item, index) => {
                                                return (
                                                    item.Subcategories && item.Subcategories.length > 0 ?
                                                        <tr className="pointer" key={index} data-toggle="modal" onClick={() => this.loadSubCategory(item.Subcategories, subcategorylist)}>
                                                            <td>{item.Value ? item.Value : 'N/A'}</td>
                                                            <td className="text-right"><a className="fs24"><i className="icons8-login"></i></a></td>
                                                        </tr>
                                                        :
                                                        <tr key={index} data-toggle="modal" className="pointer" onClick={() => (item.Price || item.Price == 0) ? "" : this.loadProdCategory(item, subcategorylist)}>
                                                            <td>{item.Value ? <Markup content={item.Value} /> : item.Title ? <Markup content={item.Title} /> : 'N/A'}</td>
                                                            <td className="text-right">
                                                                <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                            </td>
                                                            {item.Price || item.Price == 0 ?
                                                                <td className="text-right" data-toggle="" href="javascript:void(0)">
                                                                    <a className="fs30">
                                                                        <img src="assets/images/add.svg" width="35" onClick={() => this.ActiveList(item)}/>
                                                                        {/* <i className="icon icon-fill-plus icon-css-override text-success pointer" onClick={() => this.ActiveList(item)} ></i> */}
                                                                    </a>
                                                                </td>
                                                                : <td className="text-right">
                                                                    <a className="fs24"><i className="icons8-login"></i></a></td>
                                                            }
                                                        </tr>
                                                )
                                            })
                                                : <tr data-toggle="modal"><td style={{ textAlign: 'center' }}>{LocalizedLanguage.noFound}</td></tr>)
                                        ) :
                                            Product_category && Product_category.length > 0 ? Product_category.map((item, index) => {
                                                return (
                                                    <tr key={index} data-toggle="modal">
                                                        <td>{item.Value ? <Markup content={item.Value} /> : item.Title ? <Markup content={item.Title} /> : 'N/A'}</td>
                                                        <td className="text-right">
                                                            <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                        </td>
                                                        <td className="text-right" data-toggle="" href="javascript:void(0)">
                                                            <a className="fs30"><i className="icon icon-fill-plus icon-css-override text-success pointer" onClick={() => this.ActiveList(item)}></i></a>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                                :
                                                <tr data-toggle="modal"><td style={{ textAlign: 'center' }}>{LocalizedLanguage.noFound}</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    : <Categories productData={this.props.productData} onRef={this.props.onRef} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedList = connect(mapStateToProps)(SubCategories);
export { connectedList as SubCategories };