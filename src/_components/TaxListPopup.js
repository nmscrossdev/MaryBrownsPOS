/**
 * Created By   : Shakuntala Jatav
 * Created Date : 05-06-2019
 * Description  : for apply local tax  rate on the cart.
 * 
 * Updated By   : Shakuntala Jatav
 * Updated Date : 17-06-2019
 * Description : apply multiple tax.   
*/
import React from 'react';
import { connect } from 'react-redux';
import { taxRateAction } from '../_actions/taxRate.action';
import { cartProductActions } from '../_actions/cartProduct.action';
import { LoadingModal, AndroidAndIOSLoader } from '../_components';
import { changeTaxRate } from '../_components';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { isMobileOnly } from "react-device-detect";
import TaxRateListView from './views/m.TaxRateList';

class TaxListPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tax_items: localStorage.getItem("SELECTED_TAX") ? JSON.parse(localStorage.getItem("SELECTED_TAX")) : [],
            isloading: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.closePopup = this.closePopup.bind(this);
    }

    handleChange(e) {
        var tax_items = this.state.tax_items;
        const { name, value } = e.target;
        var check = $(`input[name=${name}]`).is(':checked');
        var Id = $(`input[name=${name}]`).attr('data-id');
        var country = $(`input[name=${name}]`).attr('data-country');
        var state = $(`input[name=${name}]`).attr('data-state');
        var tax_name = $(`input[name=${name}]`).attr('data-name');
        var taxclass = $(`input[name=${name}]`).attr('data-tax-class');
        var defaultTax = JSON.parse(localStorage.getItem('DEFAULT_TAX'));
        var defaultTaxId = [];
        if (defaultTax) {
            defaultTax.map(fixId => {
                defaultTaxId.push(fixId.TaxId);
            })
        }

        if (tax_items.length == 0) {
            tax_items.push({
                check_is: check,
                TaxRate: value,
                TaxName: tax_name,
                TaxId: parseInt(Id),
                Country: country,
                State: state,
                TaxClass: taxclass
            })
        } else {
            var FindId = tax_items.find(isName => parseInt(isName.TaxId) === parseInt(Id) || isName.TaxName == name);
            if (FindId) {
                var isExist = false;
                isExist = defaultTaxId.find(fixId => fixId == FindId.TaxId);
                tax_items.map(item => {
                    if (item.TaxId == FindId.TaxId && isExist != item.TaxId) {
                        item['check_is'] = FindId.check_is == true ? false : true
                    }
                })
            } else {
                tax_items.push({
                    check_is: check,
                    TaxRate: value,
                    TaxName: tax_name,
                    TaxId: parseInt(Id),
                    Country: country,
                    State: state,
                    TaxClass: taxclass
                })
            }
        }
        this.setState({
            tax_items: tax_items
        })
    }
    /**  
     * Updated By   : Shakuntala Jatav
     * Updated Date : 07-06-2019
     * Description : when apply tax remove from exsist list then set default tax .
    */
    onSubmit() {
        const { tax_items } = this.state;
        const { dispatch } = this.props;
        var taxData = []
        tax_items.map(item => {
            if (item.check_is == true)
                taxData.push(item)
        })
        if (taxData.length > 0) {
            localStorage.setItem("SELECTED_TAX", JSON.stringify(taxData));
            if (localStorage.getItem('TAXT_RATE_LIST')) {
                var apply_tax_is = JSON.parse(localStorage.getItem('TAXT_RATE_LIST'));
                var isExsitId = [];
                var noExsitId = [];
                if (apply_tax_is.length > 0) {
                    var result1 = apply_tax_is;
                    var result2 = taxData;
                    var props = ['TaxId', 'TaxName'];
                    var result = result1.filter(function (o1) {
                        // filter out (!) items in result2
                        return !result2.some(function (o2) {
                            return parseInt(o1.TaxId) === parseInt(o2.TaxId); // assumes unique id
                        });
                    }).map(function (o) {
                        // use reduce to make objects with only the required properties
                        // and map to apply this to the filtered array as a whole
                        return props.reduce(function (newo, TaxName) {
                            newo[TaxName] = o[TaxName];
                            return newo;
                        }, {});
                    });
                    taxData.map(checkTax => {
                        apply_tax_is.map(items => {
                            if (items.TaxId == checkTax.TaxId) {
                                if (items) {
                                    items['check_is'] = items.check_is;
                                }
                            }
                        })
                    })

                    if (result && result.length > 0) {
                        result.map(checkTax => {
                            apply_tax_is.map(items => {
                                if (parseInt(items.TaxId) == parseInt(checkTax.TaxId)) {
                                    if (items) {
                                        items['check_is'] = false;
                                    }
                                }
                            })
                        })
                    }

                    var updateTaxCarproduct = changeTaxRate(apply_tax_is, 2);
                    dispatch(cartProductActions.updateTaxRateList(apply_tax_is));
                    var cartItems = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
                    dispatch(cartProductActions.addtoCartProduct(cartItems))
                    if(isMobileOnly == true){
                        this.props.openModal("view_cart");
                    }
                }
            }
        } else {
            var defaultTax = localStorage.getItem('DEFAULT_TAX') && JSON.parse(localStorage.getItem('DEFAULT_TAX'));
            if (defaultTax && defaultTax.length > 0) {
                var updateTaxCarproduct = changeTaxRate(defaultTax, 2);
                localStorage.setItem("SELECTED_TAX", JSON.stringify(defaultTax));
                dispatch(cartProductActions.updateTaxRateList(defaultTax));
                dispatch(cartProductActions.updateTaxOfCart(updateTaxCarproduct))
            } else {
                localStorage.removeItem("SELECTED_TAX");
                localStorage.removeItem('TAXT_RATE_LIST');
                var updateTaxCarproduct = changeTaxRate(null, 2);
                dispatch(cartProductActions.updateTaxRateList(null));
                dispatch(cartProductActions.updateTaxOfCart(updateTaxCarproduct))
            }
        }

        this.props.dispatch(taxRateAction.selectedTaxList(taxData))
        $('#firstTaxPopup').modal('hide');
        this.setState({ tax_items: [] })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.taxlist) {
            this.setState({
                isloading: false
            })
        }
        var selected_tax_list = nextProps.selectedTaxList ? nextProps.selectedTaxList : localStorage.getItem("SELECTED_TAX") ? JSON.parse(localStorage.getItem("SELECTED_TAX")) : [];
        if (selected_tax_list.length > 0) {
            this.setState({
                tax_items: selected_tax_list
            })
        }
    }

    closePopup() {
        if(isMobileOnly == true){
            this.props.openModal("view_cart");
        }
        this.setState({ tax_items: [] })
    }

    render() {
        const { taxlist } = this.props;
        const { tax_items, isloading } = this.state;
        return (
            (isMobileOnly == true) ?
                <TaxRateListView
                    {...this.props}
                    {...this.state}
                    closePopup={this.closePopup}
                    LocalizedLanguage={LocalizedLanguage}
                    AndroidAndIOSLoader={AndroidAndIOSLoader}
                    handleChange={this.handleChange}
                    onSubmit={this.onSubmit}
                />
                :
                <div id="firstTaxPopup" className="modal modal-wide fade full_height_modal">
                    {isloading == true ? <LoadingModal /> : ""}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={() => this.closePopup()}>
                                    <img src="assets/img/Close.svg" />
                                </button>
                                <h4 className="modal-title">{LocalizedLanguage.selectTax}</h4>
                            </div>
                            <div className="modal-body pl-0 pr-0 pt-0">
                                <div className="all_product">
                                    <table className="table table-striped table-tax-header">
                                        <colgroup>
                                            <col width="200" />
                                            <col width="130" />
                                            <col width="130" />
                                            <col width="130" />
                                            <col width="130" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>
                                                    {LocalizedLanguage.taxName}
                                                </th>
                                                <th>
                                                    {LocalizedLanguage.taxRate}
                                                </th>
                                                <th>
                                                    {LocalizedLanguage.country}
                                                </th>
                                                <th>
                                                    {LocalizedLanguage.province}
                                                </th>
                                                <th>

                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div className="overflowscroll" id="scroll_mdl_body">
                                        <table className="table table-striped table-tax-body">
                                            <colgroup>
                                                <col width="200" />
                                                <col width="130" />
                                                <col width="130" />
                                                <col width="130" />
                                                <col width="130" />
                                            </colgroup>
                                            <tbody>
                                                {taxlist && taxlist.map((item, index) => {
                                                    return (

                                                        <tr key={index}>
                                                            <td>
                                                                {item.TaxName}
                                                            </td>
                                                            <td>
                                                                {item.TaxRate}
                                                            </td>
                                                            <td>
                                                                {item.Country}
                                                            </td>
                                                            <td>
                                                                {item.State}
                                                            </td>
                                                            <td align="right" className="clearfix">
                                                                <div className="refund_radio_button right-button tax-checkbox">
                                                                    <label className="customcheckbox">
                                                                        <input type="checkbox" data-id={item.TaxId} data-state={item.State} data-country={item.Country} data-name={item.TaxName} data-tax-class={item.TaxClass} name={`tax_${item.TaxId}`} value={item.TaxRate} onChange={this.handleChange} checked={tax_items.length > 0 && tax_items.find(items => items.TaxId == item.TaxId ? items.check_is == true ? 'checked' : '' : '')} />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer p-0" onClick={this.onSubmit}>
                                <button type="button" className="btn btn-primary btn-block h66">{LocalizedLanguage.capitalSaveUpdate}</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    const { taxlist, selectedTaxList } = state;
    return {
        taxlist: taxlist.items,
        selectedTaxList: selectedTaxList.items
    };
}
const connectedTaxListPopup = connect(mapStateToProps)(TaxListPopup);
export { connectedTaxListPopup as TaxListPopup };