import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions/cartProduct.action'
import { Attributes } from './Attributes';
import { Markup } from 'interweave';
import { default as NumberFormat } from 'react-number-format'
import { getTaxAllProduct } from './';
import { allProductActions } from '../_actions/allProduct.action';
import { FetchIndexDB } from '../settings/FetchIndexDB';
import LocalizedLanguage from '../settings/LocalizedLanguage';

class SubAttributes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subattributelist: this.props.subattributelist,
            productlist: [],
            code: this.props.subattributelist.Code,
            subProduct: [],
            sub_active: false,
            parentAttributes: [],
            backToAttribute: false,
            ticket_Product_status: false
        }
        // -----------------------------------------------------
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            this.setState({ productlist: getTaxAllProduct(val) });
        }
        );
        //  -----------------------------------------------------
    }

    loadSubAttr(subAttrlist, parentAttributes) {
        this.setState({
            subattributelist: subAttrlist,
            parentAttributes: parentAttributes
        })
    }

    Back() {
        const { parentAttributes } = this.state;
        this.setState({ subProduct: [] });
        if (!parentAttributes || parentAttributes == null || parentAttributes.length == 0) {
            this.setState({ backToAttribute: true });
        }
        else {
            this.setState({ sub_active: false });
            this.loadSubAttr(parentAttributes);
        }
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    loadSubAttribute(item, code, parentAttributes) {
        const { productlist } = this.state;
        this.setState({
            parentAttributes: parentAttributes
        })
        var code = code
        var subattricode = item.Code
        var prdList = [];
        productlist && productlist.map(prod => {
            var isExpired = false;
            prod.ProductAttributes.map(att => {
                this.setState({ sub_active: true })
                if (att.Name.toUpperCase() === code.toUpperCase() || att.Slug.toUpperCase() === code.toUpperCase()) {
                    att.Option.split(',').map(hasub => {
                        if (hasub.toUpperCase() === subattricode.toUpperCase()) {
                            var variationProdect = this.state.productlist.filter(item => {
                                return (item.ParentId === prod.WPID && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1)))
                            })
                            prod['Variations'] = variationProdect
                            this.state.subProduct.push(prod)
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
                        }
                    })
                }
            })
            if (isExpired == false) {
                prdList.push(prod)
            }
        })

        if (prdList.length > 0) {
            this.state.productlist = prdList;
            this.setState({ productlist: prdList })
        }
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
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

    ActiveList(item, ticketFields = null) {
        var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : []
        if (item.Type !== "variable") {
            //for inclusive and axclusive tax------------------
            var arr = []
            arr.push(item);
            arr = getTaxAllProduct(arr);
            item = arr[0];
            //-------------------------------------------
            if (ticketFields == null && item && item.IsTicket == true) {
                var tick_typ = 'simpleadd'
                this.getTicketFields(item, tick_typ);
            }

            if (item.InStock == true && item.IsTicket == false) {
                var data = {
                    line_item_id: 0,
                    quantity: 1,
                    Title: item.Title,
                    Price: parseFloat(item.Price),
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
            }
            else if (item.InStock == true && item.IsTicket == true && ticketFields != null) {
                this.setState({ ticket_Product_status: false })
                var tick_data = item && item.TicketInfo != '' ? JSON.parse(item.TicketInfo) : '';
                var data = {
                    line_item_id: 0,
                    quantity: 1,
                    Title: item.Title,
                    Price: parseFloat(item.Price),
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

            } else {
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

    componentWillReceiveProps(props) {
        const { ticket_Product_status, tick_type, ticket_Product } = this.state;
        var ticket_Data = localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : ''
        var tick_data = ticket_Product_status == true ? JSON.parse(ticket_Product.TicketInfo) : ''
        var form_id = tick_data._owner_form_template
        if (localStorage.getItem('ticket_list') && localStorage.getItem('ticket_list') !== 'null' && localStorage.getItem('ticket_list') !== '' && ticket_Product_status == true && tick_type == 'simpleadd' || form_id == -1 || form_id == '' && ticket_Product_status == true && tick_type == 'simpleadd') {
            this.setState({ ticket_Product_status: false })
            var index = null;
            var type = null;
            this.ActiveList(ticket_Product, localStorage.getItem('ticket_list') ? JSON.parse(localStorage.getItem('ticket_list')) : '')
        }
    }

    render() {
        const { subattributelist, sub_active, subProduct, code } = this.state;
        return (
            <div>
                {this.state.backToAttribute == false ?
                    <div className="col-lg-9 col-sm-8 col-xs-8 pr-0">
                        <div className="items pt-3">
                            <div className="item-heading text-center">{LocalizedLanguage.library}</div>
                            <div className="panel panel-default panel-product-list overflowscroll p-0" id="allProductHeight">
                                <div className="searchDiv" style={{ display: 'none' }}>
                                    <input type="search" className="form-control nameSearch" placeholder={LocalizedLanguage.placeholderSearchAndScan} />
                                </div>
                                <div className="pl-1 pr-4 previews_setting  pointer">
                                    <a onClick={() => this.Back()} className="back-button d-flex align-items-center mt-0 mb-0" id="mainBack">
                                        <i className="icons8-undo ml-2 mr-2 fs30 pointer"></i>
                                        <span>{LocalizedLanguage.back}</span>
                                    </a>
                                </div>
                                <table className="table ShopProductTable  table-striped table-hover table-borderless paddignI mb-0 font">
                                    <colgroup>
                                        <col style={{ width: '*' }} />
                                        <col style={{ width: 40 }} />
                                    </colgroup>
                                    <tbody>
                                        {sub_active == false ? (
                                            (subattributelist.SubAttributes && subattributelist.SubAttributes.length > 0 ? subattributelist.SubAttributes.map((item, index) => {
                                                return (
                                                    item.SubAttributes && item.SubAttributes.length > 0 ?
                                                        <tr className="pointer" key={index} data-toggle="modal" onClick={() => this.loadSubAttr(item.SubAttributes, subattributelist)}>

                                                            <td>{item.Value ? item.Value : 'N/A'}</td>
                                                            <td className="text-right"><a className="fs24 pointer"><i className="icons8-login"></i></a></td>
                                                        </tr>
                                                        :
                                                        <tr key={index} data-toggle="modal" onClick={() => this.loadSubAttribute(item, code, subattributelist)}>
                                                            <td>{item.Value ? item.Value : 'N/A'}</td>
                                                            <td className="text-right"></td>
                                                            <td className="text-right"><a className="fs24 pointer"><i className="icons8-login"></i></a></td>
                                                        </tr>
                                                )
                                            })
                                                :
                                                <tr data-toggle="modal"><td>{LocalizedLanguage.noFound}</td></tr>)
                                        ) :
                                            subProduct && subProduct.length > 0 ? subProduct.map((item, index) => {
                                                return (

                                                    <tr key={index} data-toggle="modal">

                                                        <td>{item.Title ? <Markup content={item.Title} /> : 'N/A'}</td>
                                                        <td className="text-right"><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></td>
                                                        <td className="text-right" data-toggle="" href="javascript:void(0)">
                                                            <a className="fs30">
                                                                <img src="assets/img/AddNew.svg" width="35" onClick={() => this.ActiveList(item)}/>
                                                                {/* <i className="icon icon-fill-plus icon-css-override text-success pointer" onClick={() => this.ActiveList(item)}></i> */}
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )

                                            })
                                                :
                                                <tr data-toggle="modal"><td style={{ textAlign: 'center' }}>{LocalizedLanguage.noFound}</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    : <Attributes productData={this.props.productData} onRef={this.props.onRef} loadAttributes={this.ActiveList} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { ticketfield, attributelist } = state;
    return {
        attributelist: attributelist.attributelist,
        ticketfield: ticketfield.ticketfield
    };
}
const connectedList = connect(mapStateToProps)(SubAttributes);
export { connectedList as SubAttributes };