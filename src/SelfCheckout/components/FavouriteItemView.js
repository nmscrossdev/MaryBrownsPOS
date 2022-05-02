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
        return (
            <div className="category-tile-group">
                <div className="category-tile grouped" style={{backgroundColor:"#a9d47d"}} onClick={() => this.redirect()}>
                    <p>{LocalizedLanguage.back}</p>
                </div>
                    {
                        this.props.childCategory && this.props.childCategory.map((item, index) => {
                            return (
                                <div className="category-tile grouped" key={"childCategory"+index} id={`${index}_sub_category`} data-attribute-id={item.attribute_id} data-id={`subcat_${item.id}`}  onClick={()=>this.checkSubCategoryList(item)}>
                                <p>{item.Value}</p>
                                </div>
                            )
                        })
                    }
                    {this.props.subchildCategory && this.props.subchildCategory && !this.props.subchildCategory.Subcategories?
                         <div className="category-tile grouped" onClick={() => this.tileFilterData(this.props.subchildCategory.category_slug, "inner-sub-category", this.props.subchildCategory.category_slug)} id={`${this.props.subchildCategory.category_slug}_sub_category`}>
                         <p>{this.props.subchildCategory.name}</p>
                         </div>
                        : 
                        this.props.subchildCategory && this.props.subchildCategory &&  this.props.subchildCategory.Subcategories.length > 0  ?
                          this.props.subchildCategory.Subcategories && this.props.subchildCategory.Subcategories.map((item, index) => {
                            return (
                            <div key={"subchildCategory"+index} id={`${index}_sub_category`} data-attribute-id={item.attribute_id} data-id={`subcat_${item.id}`} onClick={() => this.tileFilterData(item.Code, "inner-sub-category", index)} >
                            <p>{this.props.subchildCategory.name}</p>
                            </div>

                             )})
                              : null
                    }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}
const connectedFavouriteItemView = connect(mapStateToProps)(FavouriteItemView);
export { connectedFavouriteItemView as FavouriteItemView };

