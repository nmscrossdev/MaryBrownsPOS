import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import { Markup } from 'interweave';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import Keys from '../settings/Keys';
class SingleProductDiscountPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            discountAmount: "",
            discountType: "",
            is_checked_clr: false,
            is_checked: false,
            discountlst: localStorage.getItem('discountlst') && localStorage.getItem('discountlst') !== '' ? JSON.parse(localStorage.getItem('discountlst')) : ''
        }
        this.handleDiscount = this.handleDiscount.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handle = this.handle.bind(this);
    }

    handle(e) {
        this.setState({
            is_checked_clr: false,
            is_checked: false
        })
        const { value } = e.target;
        $('#textDis').focus();
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (value === '' || re.test(value)) {
            this.state.discountAmount = $('#textDis').text() == "0" || $('#textDis').text() == "0.00" ? value : $('#textDis').val();
        }
        $('#textDis').val(this.state.discountAmount);
    }

    calcInp(e) {
        this.state.is_checked = false;
        this.state.is_checked_clr = false;
        this.setState({
            is_checked_clr: false,
            is_checked: false
        })
        if (e == "c") {
            if (this.state.discountAmount.toString().length == 1) {
                this.state.discountAmount = "0"
            }
            else {
                const txtValue =  this.state.discountAmount !== null && this.state.discountAmount !== "" ? this.state.discountAmount.toString().substring(-1, this.state.discountAmount.length - 1) : "";
                this.state.discountAmount = txtValue == "" ? "0" : txtValue;
            }
        }
        else {
            if (e == "." && this.state.discountAmount.toString().indexOf(".") >= 0) {
                //do nothing
            } else {
                this.state.discountAmount = $('#textDis').val() == "0" || $('#textDis').val() == "0.00" ? e : $('#textDis').val() + e.toString();
            }
        }
        $('#textDis').val(this.state.discountAmount);
    }

    handleClose() {
        this.buttonDisable(false);
        this.state.is_checked_clr = false,
            this.state.is_checked = false
        jQuery('#CalcType').text(Keys.key.DuscountAmountType);
        jQuery('#lbPercent').text("%");
        this.state.discountAmount = 0;
        this.state.discountType = 'Number';
    }

    handleDiscount() {
        const { discountAmount } = this.state;
        if(discountAmount==".")
        {
            return;
        }
        const { selecteditem, dispatch } = this.props;
        var discount_amount = discountAmount ? discountAmount : 0;
        var product = selecteditem.product;
        var discount_type = jQuery('#CalcType').text();
        if (product == "product") {
            var product = {
                type: 'product',
                discountType: discount_type == "%" ? 'Percentage' : 'Number',
                discount_amount,
                Tax_rate: 0, //this.props.taxratelist.TaxRate,
                Id: selecteditem.id,
            }
            jQuery('#CalcType').text(Keys.key.DuscountAmountType);
            jQuery('#lbPercent').text("%");
            this.buttonDisable(false);
            this.setState({
                discountAmount: 0,
                is_checked_clr: false,
                is_checked: false
            })
            localStorage.setItem("PRODUCT", JSON.stringify(product))
            localStorage.setItem("SINGLE_PRODUCT", JSON.stringify(selecteditem.item))
            dispatch(cartProductActions.singleProductDiscount());
        }
    }

    handleDiscountCancle(check) {
        this.buttonDisable(false)
        if (check == true) {
            this.setState({
                discountAmount: 0,
                discountType: 'Number',
                is_checked_clr: true,
                is_checked: false
            })
            jQuery('#textDis').val(0);
            $('#panelCalculatorpopUp :input').removeAttr('disabled');
        } else {
            this.setState({
                discountAmount: 0,
                is_checked_clr: false,
                is_checked: false
            })
        }
    }

    buttonDisable(st) {
        $('#calculate0').attr('disabled', st);
        $('#calculate1').attr('disabled', st);
        $('#calculate2').attr('disabled', st);
        $('#calculate3').attr('disabled', st);
        $('#calculate4').attr('disabled', st);
        $('#calculate5').attr('disabled', st);
        $('#calculate6').attr('disabled', st);
        $('#calculate7').attr('disabled', st);
        $('#calculate8').attr('disabled', st);
        $('#calculate9').attr('disabled', st);
        $('#calculate0').attr('disabled', st);
        $('#calculate10').attr('disabled', st);
        $('#calculate11').attr('disabled', st);
        $('#calculate12').attr('disabled', st);
        $('#CalcType').attr('disabled', st);
        $('#textDis').attr("disabled", st);
        return true;
    }
    /**
     * Updated By   : Shakuntala Jatav
     * Updated Date : 17-06-2019
     * Description : update if else condition for update type of discount like % and $.
    */
    applyfixDiscount(item) {
        event.preventDefault();
        this.buttonDisable(true);
        this.setState({
            is_checked: item.Id,
            discountType: item.Type,
            discountAmount: item.Amount,
            is_checked_clr: false
        })
        jQuery('#panelCalculatorpopUp').val("0");
        jQuery('#textDis').val(item.Amount);
        if (item) {
            if (item.Type == 'Percentage') {
                jQuery('#CalcType').text("%");
                jQuery('#lbPercent').text(Keys.key.DuscountAmountType==""?"$":Keys.key.DuscountAmountType);
            } else {
                jQuery('#CalcType').text(Keys.key.DuscountAmountType);
                jQuery('#lbPercent').text("%");
            }
        }
    }

    minplus() {
        if (jQuery('#CalcType').text() == "%") {
            jQuery('#CalcType').text(Keys.key.DuscountAmountType);
            jQuery('#lbPercent').text("%");
            this.state.discountType = "Number";
        } else {
            jQuery('#lbPercent').text(Keys.key.DuscountAmountType==""?"$":Keys.key.DuscountAmountType);
            jQuery('#CalcType').text("%");
            this.state.discountType = "Percentage";
        }
    }

    componentDidMount() {
        setTimeout(function () {
            $('#single_popup_discount').on('shown.bs.modal', function () {
                $('#textDis').focus();
            });
        }.bind(this), 3000)
    }

    handleChange() {
        // nothing change
    }

    render() {
        const { selecteditem } = this.props;
        const { discountlst, is_checked_clr, is_checked } = this.state;
        return (
            <div id="single_popup_discount" className="modal modal-wide modal-wide1 fade">
                <div className="modal-dialog" id="dialog-midle-align">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.handleClose} >
                                <img src="assets/img/Close.svg" />
                            </button>
                            <h5 className="modal-title" style={{ fontSize: "30px" }}>{selecteditem ? selecteditem.card ? "" : selecteditem.item.Title ? <Markup content={"Add Discount (" + selecteditem.item.Title + ")"} /> : LocalizedLanguage.addDiscount : LocalizedLanguage.addDiscount}</h5>
                        </div>
                        <div className="modal-body p-0">
                            <form className="clearfix">
                                <div className="col-sm-5">
                                    <div className="fixedinCalHeight overflowscroll">
                                        <div className="pt-3">
                                            {
                                                discountlst ?
                                                    discountlst.map((item, index) => {
                                                        return (
                                                            <div key={index} className="button_with_checkbox">
                                                                <a type="button" onClick={() => this.applyfixDiscount(item)} id="oliver_discount" name="radio-group">
                                                                    <input type="radio" id={"oliver_discount" + index} name="radio-group" checked={is_checked == item.Id ? "checked" : ""} onChange={() => this.handleChange()} />
                                                                    <label htmlFor={"oliver_discount" + index} className="label_select_button">{(item.Name.length > 15 ? item.Name.substring(0, 15) + '...' : item.Name) + (item.Type == "Percentage" ? " (" + item.Amount + "%" + ")" : item.Type == "Number" ? " ($" + item.Amount + ")" : "")}</label>
                                                                </a>
                                                            </div>
                                                        )
                                                    })
                                                    : <div></div>
                                            }
                                            <div className="button_with_checkbox">
                                                <a type="button" onClick={() => this.handleDiscountCancle(!is_checked_clr)} id="oliver_discount" name="radio-group">
                                                    <input type="radio" id="oliver_discount_clear" name="radio-group" checked={is_checked_clr == true ? "checked" : ""} onChange={() => this.handleChange()} />
                                                    <label htmlFor="oliver_discount__clear" className="label_select_button">{LocalizedLanguage.discountClr}</label>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-7 p-0">
                                    <div className="panel-product-list" id="panelCalculatorpopUp">
                                        <div className="panel panelCalculator">
                                            <div className="panel-body p-0">
                                                <table className="table table-bordered shopViewPopUpCalculator">
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan="2" className="text-right br-1 bl-1 bt-0">
                                                                <div className="input-group discount-input-group" >
                                                                    <input type="text" id="textDis" className="form-control text-right" placeholder="0.00" aria-describedby="basic-addon1" onChange={this.handle} />
                                        <span className="input-group-addon AmoutType" id="CalcType" name="CalcType">{Keys.key.DuscountAmountType}</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-center pointer bt-0" onClick={() => this.calcInp('c')}>

                                                                <button type="button" id='calculate12' className="btn btn-default calculate">
                                                                    <i className="icons8-back-arrow fs40"></i>
                                                                    {/* <img width="36" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjA1OSAzMS4wNTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjA1OSAzMS4wNTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMC4xNzEsMTYuNDE2SDAuODg4QzAuMzk4LDE2LjQxNiwwLDE2LjAyLDAsMTUuNTI5YzAtMC40OSwwLjM5OC0wLjg4OCwwLjg4OC0wLjg4OGgyOS4yODMgICAgYzAuNDksMCwwLjg4OCwwLjM5OCwwLjg4OCwwLjg4OEMzMS4wNTksMTYuMDIsMzAuNjYxLDE2LjQxNiwzMC4xNzEsMTYuNDE2eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgoJPGc+CgkJPHBhdGggZD0iTTE2LjAxNywzMS4wNTljLTAuMjIyLDAtMC40NDUtMC4wODMtMC42MTctMC4yNUwwLjI3MSwxNi4xNjZDMC4wOTgsMTUuOTk5LDAsMTUuNzcsMCwxNS41MjkgICAgYzAtMC4yNCwwLjA5OC0wLjQ3MSwwLjI3MS0wLjYzOEwxNS40LDAuMjVjMC4zNTItMC4zNDEsMC45MTQtMC4zMzIsMS4yNTUsMC4wMmMwLjM0LDAuMzUzLDAuMzMxLDAuOTE1LTAuMDIxLDEuMjU1TDIuMTYzLDE1LjUyOSAgICBsMTQuNDcxLDE0LjAwNGMwLjM1MiwwLjM0MSwwLjM2MSwwLjkwMiwwLjAyMSwxLjI1NUMxNi40OCwzMC45NjgsMTYuMjQ5LDMxLjA1OSwxNi4wMTcsMzEuMDU5eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="></img> */}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1">
                                                                <button type="button" id='calculate1' onClick={() => this.calcInp(1)} className="btn btn-default calculate">1</button>
                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate2' onClick={() => this.calcInp(2)} className="btn btn-default calculate">2</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate3' onClick={() => this.calcInp(3)} className="btn btn-default calculate">3</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1">
                                                                <button type="button" id='calculate4' onClick={() => this.calcInp(4)} className="btn btn-default calculate">4</button>
                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate5' onClick={() => this.calcInp(5)} className="btn btn-default calculate">5</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate6' onClick={() => this.calcInp(6)} className="btn btn-default calculate">6</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1">
                                                                <button type="button" id='calculate7' onClick={() => this.calcInp(7)} className="btn btn-default calculate">7</button>
                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate8' onClick={() => this.calcInp(8)} className="btn btn-default calculate">8</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate9' onClick={() => this.calcInp(9)} className="btn btn-default calculate">9</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1" >
                                                                <button type="button" id='calculate10' onClick={() => this.minplus()} className="btn btn-default calculate"> <label id="lbPercent">%</label></button>

                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate11' onClick={() => this.calcInp('.')} className="btn btn-default calculate">.</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate0' onClick={() => this.calcInp(0)} className="btn btn-default calculate">0</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer p-0">
                            <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" onClick={() => this.handleDiscount()} >{LocalizedLanguage.capitalAddDiscount}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { discountlist } = state.discountlist;
    const { selecteditem } = state.selecteditem;

    return {
        discountlist,
        selecteditem,
    };
}

const connectedSingleProductDiscountPopup = connect(mapStateToProps)(SingleProductDiscountPopup);
export { connectedSingleProductDiscountPopup as SingleProductDiscountPopup };