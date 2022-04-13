import React from 'react';
import { connect } from 'react-redux';
import { categoriesActions } from '../_actions/categories.action'
import { SubCategories, LoadingModal } from '.'
import { FetchIndexDB } from '../settings/FetchIndexDB';
import LocalizedLanguage from '../settings/LocalizedLanguage';

class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            isLoading: true,
            productlist: [],
            subcategory_list: [],
            loading: false
        }
        var idbKeyval = FetchIndexDB.fetchIndexDb();
        idbKeyval.get('ProductList').then(val => {
            this.setState({ productlist: val });
        });
        const { dispatch } = this.props;
        dispatch(categoriesActions.getAll());
    }

    loadSubCategory(subcategorylist) {
        if (subcategorylist.Subcategories != '') {
            this.setState({
                active: true,
            })
            this.state.subcategory_list.push(subcategorylist.Subcategories)
            this.state.subcategory_list = subcategorylist.Subcategories;
        } else {
            var Code = subcategorylist.Code
            var catg_Code = Code.replace(/-/g, " ");
            this.setState({
                active: true
            })
            this.state.productlist && this.state.productlist.map(prod => {
                prod.Categories.split(',').map(categ => {
                    var prod_Code = categ.replace(/-/g, " ");
                    if (prod_Code.toUpperCase() == catg_Code.toUpperCase() || prod_Code.toLowerCase() == catg_Code.toLowerCase()) {

                        var variationProdect = this.state.productlist.filter(item => {
                            return (item.ParentId === prod.WPID && (item.ManagingStock == false || (item.ManagingStock == true && item.StockQuantity > -1)))
                        })
                        prod['Variations'] = variationProdect
                        this.state.subcategory_list.push(prod)
                    }
                })
            })
        }
    }

    componentWillMount() {
        this.setState({
            loading: true
        })
        setTimeout(function () {
            if (typeof setHeightDesktop != "undefined"){  setHeightDesktop()};
        }, 1000);
    }

    render() {
        const { active, subcategory_list } = this.state;
        const { categorylist } = this.props;

        return (
            <div>
                {active == false ?
                    <div className="col-lg-9 col-sm-8 col-xs-8 pr-0">
                        {this.state.loading == false ? !this.props.categorylist || this.props.categorylist.length == 0 ? <LoadingModal /> : '' : ''}
                        <div className="items pt-3">
                            <div className="item-heading text-center">{LocalizedLanguage.library}</div>
                            <div className="panel panel-default panel-product-list overflowscroll p-0" id="allProductHeight">
                                <div className="searchDiv" style={{ display: 'none' }}>
                                    <input type="search" className="form-control nameSearch" placeholder={LocalizedLanguage.placeholerForCateSearchScan} />
                                </div>
                                <div className="pl-1 pr-4 previews_setting  pointer">
                                    <a href="/listview" className="back-button d-flex align-items-center mt-0 mb-0" id="mainBack">
                                        <i className="icons8-undo ml-2 mr-2 fs30 pointer"></i>
                                        <span>{LocalizedLanguage.back}</span>
                                    </a>
                                </div>
                                <table className="table ShopProductTable  table-striped table-hover table-borderless paddignI mb-0 font">
                                    <tbody>
                                        {
                                            categorylist ?
                                                (categorylist.map((item, index) => {
                                                    return (
                                                        item.Subcategories && item.Subcategories.length > 0 ?
                                                            <tr className="pointer" key={index} onClick={() => this.loadSubCategory(item)}>
                                                                <td>{item.Value ? item.Value : 'N/A'}</td>
                                                                <td className="text-right"><a className="fs24"><i className="icons8-login"></i></a></td>
                                                            </tr>
                                                            :
                                                            <tr className="pointer" key={index} onClick={() => this.loadSubCategory(item)} >
                                                                <td>{item.Value ? item.Value : 'N/A'}</td>
                                                                <td className="text-right"><a className="fs24"><i className="icons8-login"></i></a>
                                                                </td>
                                                            </tr>
                                                    )
                                                })
                                                )
                                                : <tr data-toggle="modal"><td style={{ textAlign: 'center' }}>{LocalizedLanguage.noFound}</td><td></td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    : <SubCategories subcategorylist={subcategory_list} productData={this.props.productData} msg={this.props.msg} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { categorylist } = state;
    return {
        categorylist: categorylist.categorylist
    };
}

const connectedList = connect(mapStateToProps)(Categories);
export { connectedList as Categories };