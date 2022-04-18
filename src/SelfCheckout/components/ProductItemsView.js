import React from 'react';
import { connect } from 'react-redux';

const ProductItemsView = (props) => {
    const { pStylenotFound, LocalizedLanguage, product_List, Markup, NumberFormat, handleIsVariationProduct, openModal, handleSimplePop, loadingFilterData, loadingData, search, totalRecords, chunk_size, pageNumber, productOutOfStock, imgError } = props;
   
    return (      
  
        <div className="item-card-group scroll" style={{maxHeight:"700px"}}>
                {    
                (product_List && product_List.length !=0)?
                    product_List && product_List.map((item, index) => {
                        var display_expireTicketTime;
                        var isVariableProduct = (item.Type !== "simple" && item.StockStatus !== "outofstock") ? true : false;
                        var img = item.Image ? item.Image.split('/') : '';
                        if (item.IsTicket && item.IsTicket == true) {
                            var ticketInfo = JSON.parse(item.TicketInfo);
                            if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                                var dt = new Date(ticketInfo._ticket_availability_to_date);
                                display_expireTicketTime = moment(dt).format('LT');
                            }
                        }
                        return (  
                            <div className="item-card grouped" key={"product_"+index}>
                                <img src={item.ProductImage ? item.ProductImage : 'placeholder.png'} alt="new" onError={(e) => imgError(e.target)}   className="scale"/>
                                <p className="prod-name">{item.Title ? <Markup content={item.Title} /> : item.Sku ? item.Sku : 'N/A'}</p>
                                <p className="price">{item.Price}</p>
                                <button key={index}
                            data-toggle={isVariableProduct ? "modal" : ""} href="javascript:void(0)"
                            onClick={isVariableProduct == true ? item.StockStatus == "outofstock" ? productOutOfStock.bind(item.Title) : props.handleIsVariationProduct.bind(props, item.Type, item) : null}>View Item</button>
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
    )
}
export default ProductItemsView;