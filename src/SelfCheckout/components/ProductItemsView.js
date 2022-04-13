import React from 'react';
import { connect } from 'react-redux';

const ProductItemsView = (props) => {
    const { pStylenotFound, LocalizedLanguage, product_List, Markup, NumberFormat, handleIsVariationProduct, openModal, handleSimplePop, loadingFilterData, loadingData, search, totalRecords, chunk_size, pageNumber, productOutOfStock, imgError } = props;
   
    return (        
             <div className="row app-inrow">
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
                            <div className="col-sm-4 col-xs-6"  key={index}
                            data-toggle={isVariableProduct ? "modal" : ""} href="javascript:void(0)"
                            onClick={isVariableProduct == true ? item.StockStatus == "outofstock" ? productOutOfStock.bind(item.Title) : props.handleIsVariationProduct.bind(props, item.Type, item) : null} >
                                <div className="app app-default app-max-size" onClick={item.StockStatus == "outofstock" ? productOutOfStock.bind(item.Title) : props.handleSimplePop.bind(props, item.Type, item)}>
                                    <div className="app-body">
                                        <div className="app-image">
                                            <img src={item.ProductImage ? item.ProductImage : 'placeholder.png'} alt="new" onError={(e) => imgError(e.target)} />
                                            {/* <img src={item.Image ? img[8] == 'placeholder.png' ? '' : item.Image : ''} alt="new" onError={(e) => imgError(e.target)} /> */}
                                        </div>
                                    </div>
                                    <div className="app-footer">
                                        <h1 className="app-title text-truncate text-center">
                                        {item.Title ? <Markup content={item.Title} /> : item.Sku ? item.Sku : 'N/A'}
                                        </h1>
                                    </div>
                                </div>                              
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


// <div key={"product" + item.Id} className="tile-view-columns" data-product-id={item.Product_Id} data-id={`attr_${item.id}`} data-stock={item.stock} data-price={item.Price}>
//                     <div className="relativeDiv">
//                         <div className="category_list labelAdd category_list_unflex" onClick={() => this.ActiveList(item, 5, "product")}>
//                             <div className="pc-imgbox">
//                                 <img src={item.Image ? img[8] == 'placeholder.png' ? '' : item.Image : ''} alt="new" onError={(e) => this.imgError(e.target)} />
//                             </div>
//                             <label className="labelTag">{item.Title}</label>
//                         </div>
//                         <a className="delete" href="javascript:void(0)">
//                             <span aria-hidden="true" onClick={() => this.RemoveFavProduct(item)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
//                             <span className="sr-only">{LocalizedLanguage.close}</span>
//                         </a>
//                     </div>
//                 </div>   