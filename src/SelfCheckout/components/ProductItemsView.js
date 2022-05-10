import React from 'react';
import { connect } from 'react-redux';

// filterProduct(style) {
//     var input = '';
//     if (style == "landscape")
//         input = $("#product_search_field").val();
//     if (style == "portrait")
//         input = $("#product_search_field_pro").val();
//         var value = getSearchInputLength(input.length)

//     if (value == true || input.length == 0) {
//         this.handletileFilterData(input, "product-search");
//     }
// }
const ProductItemsView = (props) => {
    const { pStylenotFound, LocalizedLanguage, product_List, Markup, NumberFormat, handleIsVariationProduct, openModal, handleSimplePop, loadingFilterData, loadingData, search, totalRecords, chunk_size, pageNumber, productOutOfStock, imgError } = props;
    const registerPermisions = localStorage.getItem('RegisterPermissions') ? JSON.parse(localStorage.getItem('RegisterPermissions')) : '';
    const registerPermsContent = registerPermisions && registerPermisions.content;
    const showSearchBar = registerPermsContent && registerPermsContent.find(item => item.slug == "Show-Search-Bar");
    var i=0;
    return (      
  
        <div className="card-tile-container">
            {/* {showSearchBar && showSearchBar.value == 'true' && */}
                {/* <div className="widget-search"> 
                    <input type="search" id="product_search_field_pro" className="form-control" name="search" onChange={() => props.filterProduct()}
                        autoComplete="off"  placeholder={LocalizedLanguage.search} />
                </div> */}
            {/* } */}
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
                        i++
                        var display_expireTicketTime;
                        var isVariableProduct = (item.Type !== "simple" && item.StockStatus !== "outofstock") ? true : false;
                        //var img = item.Image ? item.Image.split('/') : '';
                        if (item.IsTicket && item.IsTicket == true) {
                            var ticketInfo = JSON.parse(item.TicketInfo);
                            if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                                var dt = new Date(ticketInfo._ticket_availability_to_date);
                                display_expireTicketTime = moment(dt).format('LT');
                            }
                        }
                        return (  
                            //style={{ marginRight:((index+1)%4==0)? "":"20px",marginBottom:"20px"}} 
                            <button className="product-card" key={"product_"+index} >
                                <div className="img-container">
                                <img src={item.ProductImage ? item.ProductImage : 'placeholder.png'} alt="new" onError={(e) => imgError(e.target)} />
                                </div>
                                <p className="name">{item.Title ? item.Title : item.Sku ? item.Sku : 'N/A'}</p>
                                <p className="price">starting at $ {parseFloat(item.Price).toFixed(2)}</p>
                                <div className="button" key={index}
                            data-toggle={isVariableProduct ? "modal" : ""} href="javascript:void(0)"
                            onClick={item.StockStatus == "outofstock" ? productOutOfStock.bind(item.Title) : props.handleIsVariationProduct.bind(props, item.Type, item)}>View Item</div>
                            </button>
                        )
                        
                    })
                :
                    <div className="w-100">                                    
                        <p className="text-center payment-description">
                        {LocalizedLanguage.noMatchingProductFound}
                        </p>
                    </div>
                } 
                    {/* {product_List.length==i? setTimeout(() => {
                        marginCalculator(document.querySelector(".category-tile-container"), 20);
                        setFillContainer(document.querySelector(".card-tile-container"));
                        marginCalculator(document.querySelector(".card-tile-container"), 20);
                    }, 100):null }              */}
            </div> 
    )
}
export default ProductItemsView;