import React, { Component } from 'react'
import {_key,getRecommendedProducts} from '../../settings/SelfCheckoutSettings';
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import { getTaxAllProduct } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
export default class RecommendedProduct extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            productList:[]
        }
    }
    addItem=()=>
    {

    }
    
    componentWillMount() {
    //  var ids="";//"873,1870,1702,1893,1895";
    //  if(nextPros.item && nextPros.page)
    //  {
    //      ids=nextPros.item.ReletedIds;
    //  }
    //  else
    //  {
    //     ids = getRecommendedProducts(_key.PRODUCT_RECOMMENDATIONS,"cart");
    //  }
    // if(ids!="")
    // {
    //  var idbKeyval = FetchIndexDB.fetchIndexDb();
    //     idbKeyval.get('ProductList').then(val => {
    //         if (!val || val.length == 0 || val == null || val == "") {
    //         } 
    //         else
    //         {
    //             var _productwithTax = getTaxAllProduct(val)
    //             var productlist = _productwithTax;
    //             const filter_products = productlist && productlist.filter(item =>{
    //             return ids.includes(`${item.WPID}`)
    //             });
    //             // console.log("---getRecommendedProducts-"+JSON.stringify(filter_products));
    //             this.setState({productList:filter_products});
    //         }
    //     });
    // }
    //  console.log("---_productData-"+JSON.stringify(_productData))
    //  this.setState({productList:_productData});
    }
    getProducts(nextPros)
    {
        var ids="";
        if(nextPros.item && nextPros.page)
        {
            ids=nextPros.item.ReletedIds;
        }
        else
        {
            ids = getRecommendedProducts(_key.PRODUCT_RECOMMENDATIONS,"cart");
        }
        if(ids!="")
        {
        var idbKeyval = FetchIndexDB.fetchIndexDb();
            idbKeyval.get('ProductList').then(val => {
                if (!val || val.length == 0 || val == null || val == "") {
                } 
                else
                {
                    var _productwithTax = getTaxAllProduct(val)
                    var productlist = _productwithTax;
                    const filter_products = productlist && productlist.filter(item =>{
                    return ids.includes(`${item.WPID}`)
                    });
                    this.setState({productList:filter_products});
                }
            });
        }
    }
    componentWillReceiveProps(nextPros) {
        this.getProducts(nextPros);
    }
   render() {
       const {productList} = this.state;
    return (
        <div className="recommendations recommendationsFotter">
        <p>Recommendations</p>
        <div className="row">
        {    
            (productList && productList.length !=0)?
                productList && productList.map((item, index) => {
                    var display_expireTicketTime;
                    var isVariableProduct = (item.Type !== "simple" && item.StockStatus !== "outofstock") ? true : false;
                    if (item.IsTicket && item.IsTicket == true) {
                        var ticketInfo = JSON.parse(item.TicketInfo);
                        if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                            var dt = new Date(ticketInfo._ticket_availability_to_date);
                            display_expireTicketTime = moment(dt).format('LT');
                        }
                    }
                    return (  
                        <div className="item" key={"product_"+index}>
                            <img src={item.ProductImage ? item.ProductImage : 'placeholder.png'} alt="new" onError={(e) => imgError(e.target)}   className="scale"/>
                            <p className="prod-name">{item.Title ? item.Title : item.Sku ? item.Sku : 'N/A'}</p>
                            <p className="price">starting at $ {item.Price}</p>
                            <button key={index}
                        data-toggle={isVariableProduct ? "modal" : ""} href="javascript:void(0)" onClick={()=>this.props.handleSimpleProduct?this.props.handleSimpleProduct(item):this.props.handleProductData(item)}> View Item</button>
                        </div>
                    )
                })
            :
                <div className="w-100">                                    
                    <p className="text-center payment-description">
                    {LocalizedLanguage.noMatchingProductFound}
                    </p>
                </div>
            }    
        </div>
    </div>
    )
  }
}
