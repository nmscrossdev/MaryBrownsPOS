import React from 'react';
import { connect } from 'react-redux';
import { favouriteListActions } from '../';
import { get_UDid } from '../../ALL_localstorage';
import { Markup } from 'interweave';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
// import MobileFavouriteItemView from '../views/m.FavrouriteItemView';
import { isMobileOnly, isIOS } from "react-device-detect";

class FavouriteItemView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.tileFilterData = this.tileFilterData.bind(this);
        this.redirect = this.redirect.bind(this);
        this.checkSubCategoryList = this.checkSubCategoryList.bind(this);
    }

    redirect() {
       // history.go('/');
        localStorage.removeItem("setSubCategory");
       this.props.updateActiveStateOnRef(false);
    }

    tileFilterData(data, type, index, parent = '') {
        //console.log("%ctileFilterData",'color:green', data, type, index, parent)
        this.props.tileFilter(data, type, parent);
        switch (type) {
            case "inner-sub-attribute":
                $('.inner-sub-attribute a').removeAttr("style");
                $(`#${index}_sub_attribute a`).css("color", "#A9D47D");
                break;
            case "inner-sub-category":
                $('.inner-sub-category a').removeAttr("style");
                $(`#${index}_sub_category a`).css("color", "#A9D47D");
                break;
        }
    }

    RemoveFavProduct(data) {
        const UID = get_UDid('UDID');
        const favid = data.id
        this.props.dispatch(favouriteListActions.favProductRemove(UID, favid));
    }

    componentDidMount() {
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    checkSubCategoryList(item){
          if(item.Subcategories && item.Subcategories.length > 0 ){
            this.props.setSubCategoryList(item, 4, "sub-category")
        }
       this.tileFilterData(item.Code, "inner-sub-category", item.Code)
    }

    render() {
        var arrCheck = this.props.childCategory ? this.props.childCategory : this.props.SubAttributeList ? this.props.SubAttributeList :
        this.props.childSubAttributeList ? this.props.childSubAttributeList : this.props.subchildCategory ? this.props.subchildCategory : [];
        //console.log("subchildCategory", this.props)
        return (
            // ( isMobileOnly == true ) ?
            //   <MobileFavouriteItemView 
            //      {...this.props}
            //      {...this.state}
            //      redirect={this.redirect}
            //      LocalizedLanguage={LocalizedLanguage}
            //      checkSubCategoryList={this.checkSubCategoryList}
            //      tileFilterData={this.tileFilterData}
            //      Markup={Markup}
            //   />
            // :
            <div className="category list-unstyled overflowscroll window-header">
                <div className="pt-3 clearfix">
                    <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 plr-8 relativeDiv pr-0" onClick={() => this.redirect()}>
                        <div className="category_list bg_green">
                            <a href="javascript:void(0)">
                                {LocalizedLanguage.back}
                            </a>
                        </div>
                    </div>
                    {
                        this.props.childCategory && this.props.childCategory.map((item, index) => {
                            return (
                                <div key={"childCategory"+index} id={`${index}_sub_category`} className="col-lg-3 col-md-4 col-sm-4 col-xs-6 plr-8 relativeDiv pr-0 inner-sub-category" data-attribute-id={item.attribute_id} data-id={`subcat_${item.id}`} onClick={() => this.tileFilterData(item.Code, "inner-sub-category", index)} >
                                    <div className="category_list">
                                        <a href="javascript:void(0)" onClick={()=>this.checkSubCategoryList(item)}>
                                            <Markup content={item.Value}></Markup>
                                        </a>
                                    </div>
                                </div>
                            )
                        })
                        // loop for display favorite product
                    }
                    {
                        this.props.SubAttributeList && this.props.SubAttributeList.map((item, index) => {
                            return (
                                <div key={"SubAttributeList"+index} id={`${index}_sub_attribute`} className="col-lg-3 col-md-4 col-sm-4 col-xs-6 plr-8 relativeDiv pr-0 inner-sub-attribute" data-attribute-id={item.attribute_id} data-id={`subattr_${item.id}`} onClick={() => this.tileFilterData(item.Code, "inner-sub-attribute", index, item.taxonomy.replace("pa_", ""))}>
                                    <div className="category_list">
                                        <a href="javascript:void(0)">
                                            <Markup content={item.Value}></Markup>
                                        </a>
                                    </div>
                                </div>
                            )
                        })
                        // loop for display favorite product
                    }
                    {this.props.childSubAttributeList && this.props.childSubAttributeList ?
                        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 plr-8 relativeDiv pr-0 inner-sub-attribute">
                            <div className="category_list" onClick={() => this.tileFilterData(this.props.childSubAttributeList.attribute_slug, "inner-sub-attribute", this.props.childSubAttributeList.attribute_slug, this.props.childSubAttributeList.parent_attribute.replace("pa_", ""))} id={`${this.props.childSubAttributeList.attribute_slug}_sub_attribute`}>
                                <a href="javascript:void(0)">
                                    {this.props.childSubAttributeList.attribute_slug} / {this.props.childSubAttributeList.parent_attribute.replace("pa_", "")}
                                </a>
                            </div>
                            {/* <a className="delete" href="javascript:void(0)" >
                                <span aria-hidden="true" onClick={() => this.RemoveFavProduct(this.props.childSubAttributeList)} ><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                                <span className="sr-only">{LocalizedLanguage.close}</span>
                            </a> */}
                        </div> : null
                        // loop for display favorite sub attributes
                    }
                    {this.props.subchildCategory && this.props.subchildCategory && !this.props.subchildCategory.Subcategories?
                        <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 plr-8 relativeDiv pr-0 inner-sub-category " >
                            <div className="category_list " onClick={() => this.tileFilterData(this.props.subchildCategory.category_slug, "inner-sub-category", this.props.subchildCategory.category_slug)} id={`${this.props.subchildCategory.category_slug}_sub_category`} >
                                <a href="javascript:void(0)" >
                                    {/* {this.props.subchildCategory.name} */}
                                    <Markup content={this.props.subchildCategory.name}></Markup>
                                </a>
                            </div>
                            {/* <a className="delete" href="javascript:void(0)">
                                <span aria-hidden="true" onClick={() => this.RemoveFavProduct(this.props.subchildCategory)}><svg aria-labelledby="svg-inline--fa-title-5qXlqoFlt1IL" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" className="absolute center-a svg-inline--fa fa-times fa-w-11"><title id="svg-inline--fa-title-5qXlqoFlt1IL" className="">{LocalizedLanguage.close}</title><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" className=""></path></svg></span>
                                <span className="sr-only">{LocalizedLanguage.close}</span>
                            </a> */}
                        </div> : 
                        this.props.subchildCategory && this.props.subchildCategory &&  this.props.subchildCategory.Subcategories.length > 0  ?
                          this.props.subchildCategory.Subcategories && this.props.subchildCategory.Subcategories.map((item, index) => {
                            return (
                                <div key={"subchildCategory"+index} id={`${index}_sub_category`} className="col-lg-3 col-md-4 col-sm-4 col-xs-6 plr-8 relativeDiv pr-0 inner-sub-category" data-attribute-id={item.attribute_id} data-id={`subcat_${item.id}`} onClick={() => this.tileFilterData(item.Code, "inner-sub-category", index)} >
                                    <div className="category_list">
                                        <a href="javascript:void(0)" onClick={()=>this.checkSubCategoryList(item)}>
                                            <Markup content={item.Value}></Markup>
                                        </a>
                                    </div>
                               </div>
                             )})
                              : null
                        // loop for display favorite sub attributes
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedFavouriteItemView = connect(mapStateToProps)(FavouriteItemView);
export { connectedFavouriteItemView as FavouriteItemView };

