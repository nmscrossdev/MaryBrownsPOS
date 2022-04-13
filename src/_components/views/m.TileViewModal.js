import React from 'react';
import ActiveUser from '../../settings/ActiveUser';
import { AndroidAndIOSLoader } from '../AndroidAndIOSLoader';

const TileViewModal = (props) => {
    const { LocalizedLanguage, prodTilefilter, closeTile, ActiveList, loadingData, loadSubAttribute, loadParentCategory, loadSubCategory, filterProductByTile, clearInput, handleAddFilterProduct, activeTile, filterActive, item, filteredProduct, Markup, NumberFormat, productList, attributelist, subattributelist, addToFavourite, active, isLoading, loadParentAttribute, categorylist, subcategorylist, closeModel, FilterProductList } = props;
    var productlist = productList;
    // if (filteredProduct && filteredProduct.length > 0) {
    //     productlist = filteredProduct;
    // }
    if (FilterProductList && FilterProductList.length>0) {
        productlist = FilterProductList;
      }
    return (
        <div>
            {filterActive == false ?
                activeTile == true ?
                    <div>
                        {/* <!-- App Header --> */}
                        <div className="appHeader">
                            <div className="container-fluid">
                                <div className="row align-items-center">
                                    <div className="col-5">
                                        <a className="appHeaderBack" href="javascript:void(0);" onClick={() => closeModel()}>
                                            <img src="../mobileAssets/img/back.svg" className="w-30" alt="" />{LocalizedLanguage.close}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="appCapsule h-100 pb-0 overflow-auto">
                            <div className="bg-light py-2">
                                <div className="toggleSearchboxFull fadeIn my-0">
                                    <div className="searchbar-input-container searchbar-input-container">
                                        <input id="input_search" className="searchbar-input searchbar-input" placeholder={LocalizedLanguage.placeholderSearchProduct} type="search" onKeyUp={() => prodTilefilter('true')} autoComplete="off" autoCorrect="off" spellCheck="false" />
                                        <button onClick={() => closeTile()} className="searchbar-search-icon">
                                            {/* <!-- <img src="../mobileAssets/img/search.svg" className="w-20" alt="" /> --> */}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-group list-group-flush homeProductList">
                                {(ActiveUser.key.isSelfcheckout == true) ?
                                    null:
                                    <li onClick={() => ActiveList(1)}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="p-3">
                                                {LocalizedLanguage.allItems}
                                            </div>
                                            <div className="p-3">
                                                <img src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                            </div>
                                        </div>
                                    </li>}
                                <li onClick={() => ActiveList(2)}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="p-3">
                                            {LocalizedLanguage.attribute}
                                        </div>
                                        <div className="p-3">
                                            <img src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                        </div>
                                    </div>
                                </li>
                                <li onClick={() => ActiveList(3)}>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="p-3">
                                            {LocalizedLanguage.categories}
                                        </div>
                                        <div className="p-3">
                                            <img onClick={() => handleAddFilterProduct('product', item.WPID, item.Type)} src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    :
                    (
                        item == 1 ?  //Product
                            <div>
                                <div className="appHeader">
                                    <div className="container-fluid">
                                        <div className="row align-items-center">
                                            <div className="col-5">
                                                <a id="tileback" onClick={() => closeTile()} className="appHeaderBack" href="javascript:void(0);">
                                                    <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.goBack}
                                        </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                            : item == 2 ?  //Attribute
                                <div>
                                    <div className="appHeader">
                                        <div className="container-fluid">
                                            <div className="row align-items-center">
                                                <div className="col-5">
                                                    <a id="tileback" onClick={() => loadParentAttribute()} className="appHeaderBack" href="javascript:void(0);">
                                                        <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.goBack}
                                        </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {active != true ?
                                        <div className="appCapsule h-100 vh-100 pb-0 overflow-auto">
                                            {!attributelist ? <AndroidAndIOSLoader /> : ''}
                                            <ul className="list-group list-group-flush appCustomizeRadioCheckbox">
                                                {(isLoading && !attributelist) ?
                                                    <li className="list-group-item" >
                                                        <div className="custom-control custom-radio">{LocalizedLanguage.loading}</div>
                                                    </li>
                                                    :
                                                    attributelist && attributelist.length > 0 ?
                                                        attributelist.map((item, index) => {
                                                            return (
                                                                <li className="list-group-item" key={index}>
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div className="custom-control custom-radio custom-control-inline">
                                                                            <input type="radio" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-slug={item.Value} data-type="attribute" data-id={`id_${item.Id}`} className="custom-control-input" />
                                                                            <label className="custom-control-label label-40" htmlFor={`id_${item.Id}`}> <Markup content={item.Value}></Markup></label>
                                                                        </div>
                                                                        <div className="p-3" onClick={() => loadSubAttribute(item.SubAttributes, attributelist)}>
                                                                            <img src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                        :
                                                        <li className="list-group-item">
                                                            <div className="custom-control custom-radio">
                                                                {LocalizedLanguage.noFound}
                                                            </div>
                                                        </li>
                                                }
                                            </ul>
                                        </div>
                                        :
                                        <div className="appCapsule h-100 vh-100 pb-0 overflow-auto">
                                            <ul className="list-group list-group-flush appCustomizeRadioCheckbox">
                                                {
                                                    (subattributelist && subattributelist.length > 0 ? subattributelist.map((item, index) => {
                                                        return (
                                                            <li className="list-group-item" key={index}>
                                                                {/* <div className="custom-control custom-radio" onClick={() => { item.SubAttributes ? loadSubAttribute(item.SubAttributes, subattributelist) : '' }}>
                                                                    <input type="radio" className="custom-control-input" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-slug={item.Value} data-type="SubAttribute" data-id={`id_${item.Id}`} />
                                                                    <label className="custom-control-label" htmlFor={`id_${item.Id}`}> <Markup content={item.Value}></Markup></label>
                                                                </div> */}

                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" name="setFavorite" id={`id_${item.Id}`} value={item.Id} data-slug={item.Value} data-type="SubAttribute" data-id={`id_${item.Id}`} className="custom-control-input" />
                                                                        <label className="custom-control-label label-40" htmlFor={`id_${item.Id}`}> <Markup content={item.Value}></Markup></label>
                                                                    </div>
                                                                    {item.SubAttributes ?
                                                                        <div className="p-3" onClick={() => { item.SubAttributes ? loadSubAttribute(item.SubAttributes, subattributelist) : '' }}>
                                                                            <img src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                                                        </div>
                                                                        :
                                                                        <div className="p-3"></div>}
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                        :
                                                        <li className="list-group-item">
                                                            <div className="custom-control custom-radio">
                                                                {LocalizedLanguage.noFound}
                                                            </div>
                                                        </li>

                                                    )}
                                            </ul>
                                        </div>
                                    }
                                </div>
                                : item == 3 ? //Categories
                                    <div>
                                        <div className="appHeader">
                                            <div className="container-fluid">
                                                <div className="row align-items-center">
                                                    <div className="col-5">
                                                        <a id="tileback" onClick={() => loadParentCategory()} className="appHeaderBack" href="javascript:void(0);">
                                                            <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.goBack}
                                                          </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {active != true ?
                                            <div className="appCapsule h-100 vh-100 pb-0 overflow-auto">
                                                <ul className="list-group list-group-flush appCustomizeRadioCheckbox">
                                                    {
                                                        (categorylist && categorylist.map((item, index) => {
                                                            return (
                                                                <li key={index} className="list-group-item">
                                                                    {/* <div className="custom-control custom-radio" onClick={() => { item.Subcategories && item.Subcategories.length > 0 ? loadSubCategory(item.Subcategories, categorylist) : '' }}>
                                                                        <input type="radio" className="custom-control-input" name="setFavorite" id={`id_${item.id}`} value={item.id} data-slug={item.Value ? item.Value : 'N/A'} data-type="category" data-id={`id_${item.id}`} />
                                                                        <label className="custom-control-label" htmlFor={`id_${item.id}`} ><Markup content={item.Value}></Markup> </label>
                                                                    </div> */}
                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div className="custom-control custom-radio custom-control-inline">
                                                                            <input type="radio" name="setFavorite" id={`id_${item.id}`} value={item.id} data-slug={item.Value ? item.Value : 'N/A'} data-type="category" data-id={`id_${item.id}`} className="custom-control-input" />
                                                                            <label className="custom-control-label label-40" htmlFor={`id_${item.id}`}> <Markup content={item.Value}></Markup></label>
                                                                        </div>
                                                                        <div className="p-3" onClick={() => { item.Subcategories && item.Subcategories.length > 0 ? loadSubCategory(item.Subcategories, categorylist) : '' }}>
                                                                            <img src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        }))}
                                                </ul>
                                            </div>
                                            :
                                            <div className="appCapsule h-100 vh-100 pb-0 overflow-auto">
                                                <ul className="list-group list-group-flush appCustomizeRadioCheckbox">
                                                    {(subcategorylist && subcategorylist.length > 0 ? subcategorylist.map((item, index) => {
                                                        return (
                                                            <li key={index} className="list-group-item">
                                                                {/* <div className="custom-control custom-radio" onClick={() => { item.Subcategories && item.Subcategories.length > 0 ? loadSubCategory(item.Subcategories, subcategorylist) : '' }}>
                                                                    <input type="radio" className="custom-control-input" name="setFavorite" d={`id_${item.id}`} value={item.id} data-slug={item.Value} data-type="SubCategory" data-id={`id_${item.id}`} />
                                                                    <label className="custom-control-label" htmlFor={`id_${item.id}`} ><Markup content={item.Value}></Markup> </label>
                                                                </div> */}
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="custom-control custom-radio custom-control-inline">
                                                                        <input type="radio" name="setFavorite" id={`id_${item.id}`} value={item.id} data-slug={item.Value ? item.Value : 'N/A'} data-type="SubCategory" data-id={`id_${item.id}`} className="custom-control-input" />
                                                                        <label className="custom-control-label label-40" htmlFor={`id_${item.id}`}> <Markup content={item.Value}></Markup></label>
                                                                    </div>
                                                                    {item.Subcategories && item.Subcategories.length > 0 ?
                                                                        <div className="p-3" onClick={() => { item.Subcategories && item.Subcategories.length > 0 ? loadSubCategory(item.Subcategories, subcategorylist) : '' }}>
                                                                            <img src="../mobileAssets/img/next.svg" alt="" className="w-30" />
                                                                        </div>
                                                                        :
                                                                        <div className="p-3"></div>}
                                                                </div>
                                                            </li>
                                                        )
                                                    })
                                                        :
                                                        <li className="list-group-item">
                                                            <div className="custom-control custom-radio">
                                                                {LocalizedLanguage.noFound}
                                                            </div>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>}
                                    </div>
                                    : null)
                :
                <div>
                    <div className="appHeader">
                        <div className="container-fluid">
                            <div className="row align-items-center">
                                <div className="col-5">
                                    <a className="appHeaderBack" href="/shopview">
                                        <img src="../mobileAssets/img/back.svg" className="w-30" alt="" /> {LocalizedLanguage.goBack}
                                        </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="appCapsule h-100 pb-0">
                        <div className="bg-light py-2">
                            <div className="toggleSearchboxFull fadeIn my-0">
                                <div className="searchbar-input-container searchbar-input-container">
                                    <input className="searchbar-input searchbar-input" type="text" id="search_field" name="search" autoComplete="off" autoCorrect="off" spellCheck="false" onChange={() => filterProductByTile()} placeholder={LocalizedLanguage.placeholderSearchProduct} />
                                    <button onClick={() => clearInput()} className="searchbar-clear-icon searchbar-clear-icon">
                                        <img src="../mobileAssets/img/close.svg" className="w-20" alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="homeProductList">
                            <div className="scroll_head-foot_search scrollbar" style={{ height: 'calc(100vh - 210)' }}>
                                <table className="table table-striped mb-0 table-borderless table-layout-fixed" id="list">
                                    <tbody>
                                        {productlist && productlist.map((item, index) => {
                                            return (
                                                <tr key={index} className="">
                                                    <td className="text-truncate">
                                                        {item.Title ? item.Title : 'N/A'}
                                                    </td>
                                                    <td className="w-101">
                                                        <NumberFormat value={item.Price} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                                    </td>
                                                    <td className="w-60" onClick={() => handleAddFilterProduct('product', item.WPID, item.Type)}>
                                                        <img src="../mobileAssets/img/plus-green.svg" alt="" className="w-30" />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div onClick={() => addToFavourite()} className="appBottomMenu appBottomCustomerButton">
                <button className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.capitalSaveUpdate}</button>
            </div>
        </div>
    )
}

export default TileViewModal;