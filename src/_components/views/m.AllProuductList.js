import React from 'react';
import ActiveUser from '../../settings/ActiveUser';

const MobileAllProductList = (props) => {
    //console.log("%cmobile common header view", "color:green", props);
    const { pStylenotFound, LocalizedLanguage, product_List, Markup, NumberFormat, handleIsVariationProduct, openModal, handleSimplePop, loadingFilterData, loadingData, search, totalRecords, chunk_size, pageNumber,
         productOutOfStock, mobilePopupCalling } = props;
    return (
        (ActiveUser.key.isSelfcheckout == true)?
        <div className="homeProductList">
            <div className="appSection appGird appSrcollY scrollbar bg-light appGirdSelfCheckout scroll-auto vh-100">
                <div className="container-fluid">
                    <div className="row">
                        {(!product_List || product_List == '') ?
                            <div className="col-6 appGirdCol">
                                <div style={pStylenotFound}>{LocalizedLanguage.noFound}</div>
                            </div>
                          :
                          product_List && product_List.map((item, index) => {                           
                            var display_expireTicketTime;
                            var img = item.ProductImage;
                            var isVariableProduct = (item.Type !== "simple" && item.StockStatus !== "outofstock") ? true : false;
                            if (item.IsTicket && item.IsTicket == true) {
                                var ticketInfo = JSON.parse(item.TicketInfo);
                                if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                                    var dt = new Date(ticketInfo._ticket_availability_to_date);
                                    display_expireTicketTime = moment(dt).format('LT');
                                }
                            }
{/*
    isVariableProduct == true ? () => 
                                    item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item) : null}
*/}
                            return (
                                <div className="col-6 appGirdCol" key={index}>
                                    <div className="app app-default" onClick={() => item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item)}>
                                        {/* If need selected border so need this  <input type="radio" className="app-input" style={{display: "none"}}/> */}
                                        <div className="app-radio" >
                                            <div className="app-body" >
                                                <div className="app-image" >
                                                    {/* {item} */}
                                                    <img src={item ? item.ProductImage ?
                                                        img == 'placeholder.png' ? '' : item.ProductImage : '' : ''} 
                                                        onError={(e) => { e.target.onerror = null; 
                                                        e.target.src = "assets/img/placeholder.png" }} alt=""/>
                                                </div>
                                            </div>
                                            <div className="app-footer" onClick={() => { item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item) }}> 
                                                <h1 className="app-title text-center text-truncate">
                                                  {item.Title ? <Markup content={item.Title} /> : item.Sku ? item.Sku : 'N/A'}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}                       
                    </div>
                
                    {((!search) && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                <div style={{ marginBottom: 120 }} className="appBottomMenu appBottomCustomerButton">
                    <button id='hideButton' onClick={() => loadingData()} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                </div>
                :
                (search && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                    <div style={{ marginBottom: 120 }} className="appBottomMenu appBottomCustomerButton">
                        <button id='hideButton' onClick={() => loadingFilterData()} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                    </div>
                    :
                    <div />}
                    
                </div>
            </div>
        </div>
        :
        <div className="homeProductList">
            <ul className="scroll_head-foot_search scrollbar">
                {(!product_List || product_List == '') ?
                    <li>
                        <div style={pStylenotFound}>{LocalizedLanguage.noFound}</div>
                    </li>
                    :
                    product_List && product_List.map((item, index) => {
                        var display_expireTicketTime;
                        var isVariableProduct = (item.Type !== "simple" && item.StockStatus !== "outofstock") ? true : false;
                        if (item.IsTicket && item.IsTicket == true) {
                            var ticketInfo = JSON.parse(item.TicketInfo);
                            if (ticketInfo._ticket_availability.toLowerCase() == 'range' && (ticketInfo._ticket_availability_to_date)) {
                                var dt = new Date(ticketInfo._ticket_availability_to_date);
                                display_expireTicketTime = moment(dt).format('LT');
                            }
                        }
                        //handleSimplePop(item.Type, item);
                        return (
                            <li key={index} onClick={isVariableProduct == true ? () => 
                            item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item) : null}>
                                <div className="d-flex align-items-center">
                                    <div className="p-2">
                                        <img onClick={() => item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item)} src="../mobileAssets/img/plus-green.svg" alt="" className="w-40" />
                                    </div>
                                    <div onClick={() => { item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item) }} className="p-2 text-truncate">{item.Title ? <Markup content={item.Title} /> : item.Sku ? item.Sku : 'N/A'}</div>
                                    <div onClick={() => { item.StockStatus == "outofstock" ? productOutOfStock() : handleIsVariationProduct(item.Type, item) }} className="p-2 ml-auto"><NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} /></div>
                                </div>
                            </li>
                        )
                    })}
            </ul>
            {((!search) && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                <div style={{ marginBottom: 50 }} className="appBottomMenu appBottomCustomerButton">
                    <button id='hideButton' onClick={() => loadingData()} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                </div>
                :
                (search && totalRecords > chunk_size * pageNumber && totalRecords > chunk_size) ?
                    <div style={{ marginBottom: 50 }} className="appBottomMenu appBottomCustomerButton">
                        <button id='hideButton' onClick={() => loadingFilterData()} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.loadMore}</button>
                    </div>
                    :
                    <div />}
        </div>
    )
}

export default MobileAllProductList;