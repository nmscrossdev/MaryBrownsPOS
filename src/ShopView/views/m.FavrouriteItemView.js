import React from 'react';
const reload = () => {
    localStorage.removeItem("setSubCategory");
    window.location = "/shopview"
}

const MobileFavouriteItemView = (props) => {
    const { redirect, LocalizedLanguage, checkSubCategoryList, tileFilterData, childCategory, SubAttributeList, childSubAttributeList, subchildCategory, Markup, updateActiveStateOnRef } = props;
    var subFavList = childCategory ? childCategory : SubAttributeList ? SubAttributeList : childSubAttributeList ? childSubAttributeList : subchildCategory && !subchildCategory.Subcategories ? subchildCategory : subchildCategory && subchildCategory.Subcategories.length > 0 ? subchildCategory.Subcategories : "";
    var functionFavList = childCategory ? "childCategory" : SubAttributeList ? "SubAttributeList" : childSubAttributeList ? "childSubAttributeList" : subchildCategory && !subchildCategory.Subcategories ? "subchildCategory" : subchildCategory && subchildCategory.Subcategories.length > 0 ? "Subcategories" : null;

    return (
        <div className="bg-light position-relative appSearchProduct">
            <div className="appProductSlide">
                <div className="toggleSearchbox bg-info text-white" onClick={() => updateActiveStateOnRef(false)}>
                    <label htmlFor="searchInput" className="mb-0 icon fz-18 label-close">
                        {LocalizedLanguage.back}
                    </label>
                </div>
                <div className="appProducts">
                    <div className="pfScroll">
                        <div className="d-inline-flex float-left pfScrollProduct">
                            {subFavList && subFavList.length > 0 && subFavList.map((item, index) => {
                                return (
                                    <div key={index} className="card bg-primary border-primary card-items mr-8" style={{ width: 116, marginRight: 6 }}>
                                        <div className="item" onClick={() => { functionFavList == "childCategory" ? tileFilterData(item.Code, "inner-sub-category", index) : functionFavList == "childSubAttributeList" ? tileFilterData(childSubAttributeList.attribute_slug, "inner-sub-attribute", childSubAttributeList.attribute_slug, childSubAttributeList.parent_attribute.replace("pa_", "")) : functionFavList == "SubAttributeList" ? tileFilterData(item.Code, "inner-sub-attribute", index, item.taxonomy.replace("pa_", "")) : functionFavList == "subchildCategory" ? tileFilterData(subchildCategory.category_slug, "inner-sub-category", subchildCategory.category_slug) : functionFavList == "Subcategories" ? this.tileFilterData(item.Code, "inner-sub-category", index) : "" }}>
                                            <div className="card-body text-center" onClick={() => { functionFavList == "childCategory" ? checkSubCategoryList(item) : functionFavList == "Subcategories" ? checkSubCategoryList(item) : "" }}>
                                                <h6 className="card-title text-truncate">
                                                    {(functionFavList == "childCategory" || functionFavList == "SubAttributeList" || functionFavList == "Subcategories") ?
                                                        item.Value
                                                        :
                                                        functionFavList == "childSubAttributeList" ?
                                                            childSubAttributeList.attribute_slug / childSubAttributeList.parent_attribute.replace("pa_", "")
                                                            :
                                                            functionFavList == "subchildCategory" ?
                                                                ""
                                                                :
                                                                ""
                                                    }
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileFavouriteItemView;