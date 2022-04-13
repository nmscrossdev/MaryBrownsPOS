import React from 'react';
const SelfCheckoutTileViewModal = (props) => {
    const { pStylenotFound, LocalizedLanguage, product_List, Markup, NumberFormat, handleIsVariationProduct, openModal, handleSimplePop, loadingFilterData, loadingData, search, totalRecords, chunk_size, pageNumber, productOutOfStock } = props;
    var productlist = product_List;    
    return (
        <div>
            <div className="appCapsule vh-100 pb-0 overflow-auto">
                <ul className="list-group list-group-flush appRadioCheckbox">
                    {productlist && productlist.map((item, index) => {
                        return (
                            <li className="list-group-item" key={index} >
                                <div className="custom-control custom-radio">
                                    <input type="radio" className="custom-control-input" id={`id_${item.WPID}`} value={item.WPID} data-type="product" data-slug={item.Type} data-id={`id_${item.WPID}`} name="setFavorite" />
                                    <label className="custom-control-label" htmlFor={`id_${item.WPID}`} > {item.Title ? <Markup content={item.Title}></Markup> : 'N/A'} </label>
                                </div>
                            </li>
                        )
                    })
                    }
                </ul>
            </div>            
        </div>
    )
}
export default SelfCheckoutTileViewModal;