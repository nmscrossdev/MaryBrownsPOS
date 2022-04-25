import React from 'react';
import { connect } from 'react-redux';

const ProductItemsView = (props) => {
    const { pStylenotFound, LocalizedLanguage, product_List, Markup, NumberFormat, handleIsVariationProduct, openModal, handleSimplePop, loadingFilterData, loadingData, search, totalRecords, chunk_size, pageNumber, productOutOfStock, imgError } = props;
   
    return (      
  
        <div className="item-card-group scroll" style={{height:"781px"}} >
            {props.showBackProduct==true?
            <div className="item-card category grouped">
				<p>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae nihil error rem
					quam maxime iusto adipisci eaque? Dolor, reiciendis. Hic deleniti quos eveniet
					nulla at quam culpa praesentium exercitationem dolorum?
				</p>
				<button >
					<svg width="22" height="20" viewBox="0 0 22 20">
						<path
							d="M9.83301 1.83325L1.66634 9.99992L9.83301 18.1666M1.66634 9.99992L20.333 9.99992L1.66634 9.99992Z"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							fill="transparent"
						/>
					</svg>
					Go Back
				</button>
			</div>:null}
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
                                <p className="prod-name">{item.Title ? item.Title : item.Sku ? item.Sku : 'N/A'}</p>
                                <p className="price">starting at $ {item.Price}</p>
                                <button key={index}
                            data-toggle={isVariableProduct ? "modal" : ""} href="javascript:void(0)"
                            onClick={item.StockStatus == "outofstock" ? productOutOfStock.bind(item.Title) : props.handleIsVariationProduct.bind(props, item.Type, item)}>View Item</button>
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