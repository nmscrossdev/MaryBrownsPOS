import React from 'react';
import $ from 'jquery'; 
import { isMobileOnly } from 'react-device-detect';
import ActiveUser from '../../../settings/ActiveUser';
import { getSearchInputLength } from '../../../_components/CommonJS';

const filterProduct = (props) => {
    var input = $("#product_search_field").val();
    var value = getSearchInputLength(input.length)
    if (value == true || input.length == 0) {
        props.searchProductFilter(input, "product-search");
    }
}

const clearInput = (props) => {
    var input = $("#product_search_field").val("");
    props.searchProductFilter("", "product-search");
}


const MobileSelfCheckoutFavouriteList = (props) => {
    const { FavouriteItemView, status, favDelete_status, num, favourites, favouritesChildCategoryList, favouritesSubAttributeList, active, item, tileProductListFilter, mfavovrArrayList, DisplayPopUp, ActiveList, updateActiveStateOnRef, setSubCategoryList, LocalizedLanguage, arr, favovrArrayList, RemoveFavProduct } = props;
    const registerPermisions = localStorage.getItem('RegisterPermissions') ? JSON.parse(localStorage.getItem('RegisterPermissions')) : '';
    const registerPermsContent = registerPermisions && registerPermisions.content;
    const showSearchBar = registerPermsContent.find(item => item.slug == "Show-Search-Bar");
    const showFavouriteTile = registerPermsContent.find(item => item.slug == "Show-Tile");
    //console.log("%c mobile view of MobileFavouriteList", "color:#20c997", props)
    return (
       (isMobileOnly == true)?
        <div>
             { active !=true?
            <div className="bg-light position-relative appSearchProduct">
                <div className="appProductSlide">
                    {showSearchBar && showSearchBar.value == 'true' &&
                        <div className="toggleSearchbox bg-info text-white" data-target="search-out">
                            <label htmlFor="searchInput" className="mb-0 icon">
                                <img src="../mobileAssets/img/search.svg" className="w-30" alt=""/>
                            </label>
                        </div>
                    }
                    {showFavouriteTile && showFavouriteTile.value == 'true' &&
                    <div className="appProducts">
                        <div className="pfScroll">
                            <div className="d-inline-flex pfScrollProduct">
                            {status == false && favDelete_status == false && mfavovrArrayList && mfavovrArrayList.length > 0 &&
                                    mfavovrArrayList.map(function (favItem, index) {
                                        var titleName = favItem.attribute_slug ? favItem.attribute_slug : favItem.parent_attribute ? favItem.attribute_slug + "/" + favItem.parent_attribute.replace("pa_", "") : favItem.category_slug ? favItem.name : favItem.Type ? favItem.Title : ''
                                        var activeType = (favItem.attribute_slug && !favItem.parent_attribute) ? "attribute" : (favItem.attribute_slug && favItem.parent_attribute) ? "sub-attribute" : (favItem.category_slug && !favItem.sub_category_type) ? "category" : (favItem.sub_category_type) ? "sub-category" : (favItem.Type) ? "product" : "orderNumber";
                                        var activeNumber = (activeType == "attribute") ? 1 : (activeType == "sub-attribute") ? 3 : (activeType == "category") ? 2 : (activeType == "sub-category") ? 4 : (activeType == "product") ? 5 : "";
                                        return (
                                            activeNumber == 5 ?
                                                // <div key={index} className="card bg-primary text-white card-items mr-8 overflow-hidden carditemsimage">
                                                //     <img className="card-img" src={favItem.Image} />                                                    
                                                //     <div onClick={() => ActiveList(favItem, activeNumber, activeType)} className="card-img-overlay d-flex align-items-center p-1 justify-content-center">
                                                //         <h5  className="card-title text-truncate">{titleName}</h5>
                                                //     </div>
                                                // </div>
                                                null :
                                                activeType == "orderNumber" ?
                                                <div key={index} className="card card-items card-add-items mr-2"
                                                        onClick={() => DisplayPopUp(favItem)}>
                                                        <div className="card-body">
                                                            <img src="../mobileAssets/img/plus-open.svg" alt="" className="w-20-i" />
                                                        </div>
                                                    </div>
                                                :
                                                <div key={index} className="card bg-primary border-primary card-items mr-8">
                                                        <div className="card-body text-center">
                                                            <h6 onClick={() => ActiveList(favItem, activeNumber, activeType)} className="card-title text-truncate">
                                                                {titleName}
                                                            </h6>
                                                            {/* <img onClick={() => RemoveFavProduct(favItem)} src="../mobileAssets/img/close.svg" alt="" className="close_tile" /> */}
                                                        </div>
                                                    </div>
                                        )
                            })}
                            </div>
                        </div>
                    </div>
                }
                </div>
                <div className="toggleSearchboxFull position-absolute fadeOut" id="search-out">
                    <div className="searchbar-input-container searchbar-input-container">
                        <div
                            className="searchbar-search-icon searchbar-search-icon-md searchbar-search-icon searchbar-search-icon-md">
                        </div>
                        <input id='product_search_field' className="searchbar-input searchbar-input" placeholder={LocalizedLanguage.search} type="search"
                            autoComplete="off" autoCorrect="off" spellCheck="false" onChange={() => filterProduct(props)}/>
                        <button type="button" className="searchbar-clear-icon searchbar-clear-icon"
                            data-target="slide_out_self"  onClick={() => clearInput(props)}>
                            <img src="../mobileAssets/img/close.svg" className="w-20" alt="" />
                        </button>
                    </div>
                </div>
            </div>
            : (
                num == 1 ?
                    < FavouriteItemView
                        SubAttributeList={favouritesSubAttributeList ? favouritesSubAttributeList : null}
                        tileFilter={tileProductListFilter} updateActiveStateOnRef={updateActiveStateOnRef}
                    />
                    : num == 2 ?
                        <FavouriteItemView
                            childCategory={favouritesChildCategoryList ? favouritesChildCategoryList : null}
                            setSubCategoryList={setSubCategoryList} tileFilter={tileProductListFilter} updateActiveStateOnRef={updateActiveStateOnRef}
                        />
                        : num == 3 ?
                            <FavouriteItemView
                                childSubAttributeList={item ? item : null}
                                tileFilter={tileProductListFilter} updateActiveStateOnRef={updateActiveStateOnRef}

                            />
                            : num == 4 ?
                                <FavouriteItemView
                                    subchildCategory={item ? item : null}
                                    setSubCategoryList={setSubCategoryList} tileFilter={tileProductListFilter} updateActiveStateOnRef={updateActiveStateOnRef}
                                />
                                :
                                null)
                            }
        </div>
        : null
        )
    }
export default MobileSelfCheckoutFavouriteList;