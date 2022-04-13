import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import Language from '../_components/Language';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';
import { androidDisplayScreen } from '../settings/AndroidIOSConnect';
import CartDiscountModal from './views/m.CartDiscountModal';
import { isMobileOnly, isIOS } from "react-device-detect";
import Keys from '../settings/Keys';
class DiscountPopup extends React.Component {
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
        this.handle = this.handle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.applyfixDiscount= this.applyfixDiscount.bind(this);
        this.handleDiscountCancle = this.handleDiscountCancle.bind(this);
        this.minplus= this.minplus.bind(this);
        this.calcInp = this.calcInp.bind(this);
    }

    handle(e) {
        this.setState({
            is_checked_clr: false,
            is_checked: false
        })
        const { value } = e.target;
        $('#txtdis').focus();
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
        if (value === '' || re.test(value)) {
            this.state.discountAmount = $('#txtdis').text() == "0" || $('#txtdis').text() == "0.00" ? value : $('#txtdis').val();
        }
        $('#txtdis').val(this.state.discountAmount);
    }

    calcInp(e) {
         this.setState({
            is_checked_clr: false,
            is_checked: false
        })
        if (e == "c") {
            if (this.state.discountAmount.toString().length == 1) {
                this.state.discountAmount = "0"
            } else {
                const txtValue = this.state.discountAmount && this.state.discountAmount !== "" && this.state.discountAmount !== undefined ? this.state.discountAmount.toString().substring(-1, this.state.discountAmount.length - 1):0;
                this.state.discountAmount = txtValue == "" ? "0" : txtValue;
            }
        } else {
            if(this.state.discountAmount=="." || this.state.discountAmount=="0."){
                this.state.discountAmount="0.0"
            }
            if (e == "." && this.state.discountAmount.toString().indexOf(".") >= 0) {
                //do nothing
            } else {
                this.state.discountAmount = $('#txtdis').val() == "0" || $('#txtdis').val() == "0.00" ? e : $('#txtdis').val() + e.toString();
            }
        }
        $('#txtdis').val(this.state.discountAmount);
    }

    handleDiscount() {
        const { discountAmount } = this.state;
        if(discountAmount==".")
        {
            return;
        }
        const ListItem = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];
        var discountType = $('#spnCalcType').text();
        var discount_amount = discountAmount ? discountAmount : 0;
         var cart = {
            type: 'card',
            discountType: (discountType == '%') ? "Percentage" : "Number",
            discount_amount,
            Tax_rate: 0
        }
        // if(ListItem && ListItem.length>0){
        //     ListItem.map(litem=>{
        //         litem['discount_type']=(discountType == '%') ? "Percentage" : "Number";
        //     })
        
        // }
        this.setState({
            discountAmount: 0,
            is_checked_clr:false,
            is_checked:false
         })
        this.buttonDisable(false);
        localStorage.setItem("CART", JSON.stringify(cart))
        this.props.dispatch(cartProductActions.addtoCartProduct(ListItem));
        //Android Call----------------------------
        androidDisplayScreen("update", 0, 0, "update");
        //-----------------------------------------
    }

    handleDiscountCancle(check) {
        this.buttonDisable(false);
        if (check == true) {
            localStorage.removeItem("CART");
            this.setState({
                discountAmount: "0",
                discountType: 'Number',
                is_checked_clr: true,
                is_checked: false
            })
            jQuery('#txtdis').val(0);
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
        $('#calculate00').attr('disabled', st);
        $('#calculate01').attr('disabled', st);
        $('#calculate02').attr('disabled', st);
        $('#calculate03').attr('disabled', st);
        $('#calculate04').attr('disabled', st);
        $('#calculate05').attr('disabled', st);
        $('#calculate06').attr('disabled', st);
        $('#calculate07').attr('disabled', st);
        $('#calculate08').attr('disabled', st);
        $('#calculate09').attr('disabled', st);
        $('#calculate010').attr('disabled', st);
        $('#calculate011').attr('disabled', st);
        $('#calculate012').attr('disabled', st);
        $('#spnCalcType').attr('disabled', st);
        $('#txtdis').attr("disabled", st);
        return true;
    }

    applyfixDiscount(item) {
        event.preventDefault()
        this.buttonDisable(true);
        this.setState((state)=>{ 
            return {
                discountType: state.discountType !== item.Type ? item.Type : state.discountType,
                discountAmount: state.discountAmount !== item.Amount ? item.Amount : state.discountAmount,
                is_checked_clr: state.is_checked_clr !== false ? false : state.is_checked_clr,
                is_checked: state.is_checked !== item.Id ? item.Id :state.is_checked
            };
          });
        $('#panelCalculatorpopUp :input').attr('disabled', true);
        jQuery('#panelCalculatorpopUp').val("0");
        jQuery('#txtdis').val(item.Amount);
        if (item) {
            if (item.Type == 'Percentage') {
                jQuery('#spnCalcType').text("%");
                jQuery('#lblPercent').text(Keys.key.DuscountAmountType==""?"$":Keys.key.DuscountAmountType);
            } else {
                jQuery('#spnCalcType').text(Keys.key.DuscountAmountType);
                jQuery('#lblPercent').text("%");
            }
       }
    }

    minplus() {
       if (jQuery('#spnCalcType').text() == "%") {
            jQuery('#spnCalcType').text(Keys.key.DuscountAmountType);
            jQuery('#lblPercent').text("%");
            this.setState({discountType:'Number'})
        } else {
            jQuery('#lblPercent').text(Keys.key.DuscountAmountType==""?"$":Keys.key.DuscountAmountType);
            jQuery('#spnCalcType').text("%");
            this.setState({discountType:'Percentage'})
         }
    }

    componentDidMount() {
        setTimeout(function () {
            $('#popup_discount').on('shown.bs.modal', function () {
                $('#txtdis').focus();

            });
        }.bind(this), 3000)
    }

    handleChange() {
        // nothing change
    }

    handleClose() {
        this.setState({
            is_checked_clr:false,
            is_checked:false,
            discountAmount:0
        })
        this.buttonDisable(false);
        jQuery('#textDis').val("0");
     
    }

    render() {
        const { selecteditem } = this.props;
        const { is_checked_clr, is_checked, discountlst } = this.state;
        return (
            (isMobileOnly == true)?
              <CartDiscountModal 
              {...this.props}
              {...this.state}
              handleClose={this.handleClose}
              LocalizedLanguage={LocalizedLanguage}
              applyfixDiscount={this.applyfixDiscount}
              handleDiscountCancle={this.handleDiscountCancle}
              handleDiscount={this.handleDiscount}
              handle={this.handle}
              calcInp={this.calcInp}
              minplus={this.minplus}
              />
            :
            <div id="popup_discount" tabIndex="-1" className="modal modal-wide modal-wide1 fade">
                <div className="modal-dialog" id="dialog-midle-align">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.handleClose}  >
                                <img src="assets/img/Close.svg" />
                            </button>
                            <h4 className="modal-title">{LocalizedLanguage.addDiscount}{selecteditem ? selecteditem.card ? "" : selecteditem.item.Title ? "(" + selecteditem.item.Title + ")" : "" : ""}</h4>
                        </div>
                        <div className="modal-body p-0">
                            <form className="clearfix">
                                <div className="col-xs-5 col-sm-5">
                                    <div className="fixedinCalHeight overflowscroll">
                                        <div className="pt-3">
                                            {
                                               discountlst ?
                                                    discountlst.map((item, index) => {
                                                        return (
                                                            <div key={index} className="button_with_checkbox">
                                                                <a type="button" onClick={() => this.applyfixDiscount(item)} id="oliver_discount" name="radio-group">
                                                                    <input type="radio" id={"oliver_discount" + index} name="radio-group" checked={is_checked == item.Id ? "checked" : ""} onChange={() => this.handleChange()} />
                                                                    <label htmlFor={"oliver_discount" + index} className="label_select_button">{(item.Name.length > 15 ? item.Name.substring(0, 15) + '...' : item.Name) + (item.Type == "Percentage" ? " (" + item.Amount + "%)" : item.Type == "Number" ? " ($" + item.Amount + ")" : "")}</label>
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
                                <div className="col-xs-7 col-sm-7 p-0">
                                    <div className="panel-product-list" id="panelCalculatorpopUp">
                                        <div className="panel panelCalculator">
                                            <div className="panel-body p-0">
                                                <table className="table table-bordered shopViewPopUpCalculator">
                                                    <tbody>
                                                        <tr>
                                                            <td colSpan="2" className="text-right br-1 bl-1 bt-0">
                                                                <div className="input-group discount-input-group">
                                                                    <input type="text" id="txtdis" className="form-control text-right" placeholder="0.00" aria-describedby="basic-addon1" onChange={this.handle} />
                                        <span className="input-group-addon AmoutType" id="spnCalcType" name="spnCalcType">{Keys.key.DuscountAmountType}</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-center pointer bt-0" onClick={() => this.calcInp('c')}>
                                                                <button type="button" id='calculate012' className="btn btn-default calculate">
                                                                    {/* <img width="36" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjA1OSAzMS4wNTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjA1OSAzMS4wNTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMC4xNzEsMTYuNDE2SDAuODg4QzAuMzk4LDE2LjQxNiwwLDE2LjAyLDAsMTUuNTI5YzAtMC40OSwwLjM5OC0wLjg4OCwwLjg4OC0wLjg4OGgyOS4yODMgICAgYzAuNDksMCwwLjg4OCwwLjM5OCwwLjg4OCwwLjg4OEMzMS4wNTksMTYuMDIsMzAuNjYxLDE2LjQxNiwzMC4xNzEsMTYuNDE2eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgoJPGc+CgkJPHBhdGggZD0iTTE2LjAxNywzMS4wNTljLTAuMjIyLDAtMC40NDUtMC4wODMtMC42MTctMC4yNUwwLjI3MSwxNi4xNjZDMC4wOTgsMTUuOTk5LDAsMTUuNzcsMCwxNS41MjkgICAgYzAtMC4yNCwwLjA5OC0wLjQ3MSwwLjI3MS0wLjYzOEwxNS40LDAuMjVjMC4zNTItMC4zNDEsMC45MTQtMC4zMzIsMS4yNTUsMC4wMmMwLjM0LDAuMzUzLDAuMzMxLDAuOTE1LTAuMDIxLDEuMjU1TDIuMTYzLDE1LjUyOSAgICBsMTQuNDcxLDE0LjAwNGMwLjM1MiwwLjM0MSwwLjM2MSwwLjkwMiwwLjAyMSwxLjI1NUMxNi40OCwzMC45NjgsMTYuMjQ5LDMxLjA1OSwxNi4wMTcsMzEuMDU5eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="></img> */}
                                                                    <i className="icons8-back-arrow fs40"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1">
                                                                <button type="button" id='calculate01' onClick={() => this.calcInp(1)} className="btn btn-default calculate">1</button>
                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate02' onClick={() => this.calcInp(2)} className="btn btn-default calculate">2</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate03' onClick={() => this.calcInp(3)} className="btn btn-default calculate">3</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1">
                                                                <button type="button" id='calculate04' onClick={() => this.calcInp(4)} className="btn btn-default calculate">4</button>
                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate05' onClick={() => this.calcInp(5)} className="btn btn-default calculate">5</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate06' onClick={() => this.calcInp(6)} className="btn btn-default calculate">6</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1">
                                                                <button type="button" id='calculate07' onClick={() => this.calcInp(7)} className="btn btn-default calculate">7</button>
                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate08' onClick={() => this.calcInp(8)} className="btn btn-default calculate">8</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate09' onClick={() => this.calcInp(9)} className="btn btn-default calculate">9</button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="td-calc-padding br-1 bl-1" >
                                                                <button type="button" id='calculate010' onClick={() => this.minplus()} className="btn btn-default calculate"> <label id="lblPercent">%</label></button>

                                                            </td>
                                                            <td className="td-calc-padding br-1">
                                                                <button type="button" id='calculate011' onClick={() => this.calcInp('.')} className="btn btn-default calculate">.</button>
                                                            </td>
                                                            <td className="td-calc-padding">
                                                                <button type="button" id='calculate00' onClick={() => this.calcInp(0)} className="btn btn-default calculate">0</button>
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
                            <button type="button" className="btn btn-primary btn-block h66" data-dismiss="modal" onClick={() => this.handleDiscount()} >{LocalizedLanguage.addDiscount}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { discountlist, selecteditem } = state;
    return {
        discountlist: discountlist.discountlist,
        selecteditem: selecteditem.selecteditem,
    };
}
const connectedDiscountPopup = connect(mapStateToProps)(DiscountPopup);
export { connectedDiscountPopup as DiscountPopup };