import React, { Component } from 'react'
import {_key,getRecommendedProducts,markup} from '../../settings/SelfCheckoutSettings';
import { FetchIndexDB } from '../../settings/FetchIndexDB';
import { getTaxAllProduct } from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
export default class RecommendedProduct extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            productList:[],
            AllProductList:[]
        }
    }
    getProducts(nextPros)
    {
        var ids="";
        if(nextPros && nextPros.item && nextPros.page)
        {
            ids=nextPros.item.ReletedIds;
            if(ids!="")
            {
                var tempArr = ids.split(',');
                if(tempArr && tempArr.length>4)
                {
                    tempArr=tempArr.slice(0,4);
                    ids=tempArr;
                }
            }
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
                    this.setState({productList:filter_products,AllProductList:productlist});
                }
            });
        }
    }
    componentWillReceiveProps(nextPros) {
        this.getProducts(nextPros);
    }
    callMethods(item)
    {
       if(item && item.Type=="variable" || item.Type=="variation" )
       {
        var productlist = this.state.AllProductList;
            if (productlist && productlist.length > 0) {
                if (item) {
                    var variationProdect = productlist.filter(filterItem => {
                        return (filterItem.ParentId === item.WPID)
                    })
                    item['Variations'] = variationProdect
                    this.props.handleSimpleProduct(item)
                }
            }
       }
       else
       {
        this.props.handleSimpleProduct(item)
       }
    }
   render() {
       const {productList} = this.state;
    return (
        <div className="recommendations">
        <p>Recommendations</p>
        {    
            (productList && productList.length !=0)?
            <div className="row">
                {productList && productList.map((item, index) => {
                    var display_expireTicketTime;
                    //var isVariableProduct = (item.Type !== "simple" && item.StockStatus !== "outofstock") ? true : false;
                    if (item.IsTicket && item.IsTicket == true) {
                        var ticketInfo = JSON.parse(item.TicketInfo);
                        if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                            var dt = new Date(ticketInfo._ticket_availability_to_date);
                            display_expireTicketTime = moment(dt).format('LT');
                        }
                    }
                    return (  
                        <button type="button" className="prod" key={"product_"+index} onClick={()=>this.callMethods(item)}>
                            <img src={item.ProductImage ? item.ProductImage : 'placeholder.png'} alt="new" onError={(e) => imgError(e.target)}/>
                            <p className="name">{item.Title ? item.Title : item.Sku ? item.Sku : 'N/A'}</p>
                            <p className="price">starting at {parseFloat(item.Price).toFixed(2)}</p>
                            <div className="button">
                            {this.props.page && this.props.page =='cart'?
							<svg
								width="28"
								height="27"
								viewBox="0 0 28 27"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M13.9085 3.375C19.5358 3.375 24.1399 7.93125 24.1399 13.5C24.1399 19.0688 19.5358 23.625 13.9085 23.625C8.28126 23.625 3.67715 19.0688 3.67715 13.5C3.67715 7.93125 8.28126 3.375 13.9085 3.375ZM13.9085 1.6875C7.34339 1.6875 1.97192 7.00313 1.97192 13.5C1.97192 19.9969 7.34339 25.3125 13.9085 25.3125C20.4736 25.3125 25.8451 19.9969 25.8451 13.5C25.8451 7.00313 20.4736 1.6875 13.9085 1.6875Z"
									fill="white"
								/>
								<path
									d="M20.7292 12.6562H14.7609V6.75H13.0557V12.6562H7.0874V14.3438H13.0557V20.25H14.7609V14.3438H20.7292V12.6562Z"
									fill="white"
								/>
							</svg>:null}
                            <p key={index}>{this.props.page && this.props.page =='cart'?"Add Item":"View Item"}</p>
						</div>
                        </button>
                    )
                })}
                </div>
            :
                <div className="w-100">                                    
                    <p className="text-center payment-description">
                    {LocalizedLanguage.noMatchingProductFound}
                    </p>
                </div>
            }    
    <div style={{display:"none"}}>
        {setTimeout(() => {
        markup(".recommendations>.row>.prod>p.name") 
        }, 10)}
    </div>
    </div>
    )
  }
}
