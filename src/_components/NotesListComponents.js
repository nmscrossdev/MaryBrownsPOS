/** 
 * Created By   : Priyanka
 * Created Date : 26-06-2019
 * Description : show notes and custom fee option. 
*/
import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import { ProductAddFee } from '../_components/ProductAddFee.js';
import LocalizedLanguage from '../settings/LocalizedLanguage';
import MobileAddNotes from './views/m.AddNotes';
import { isMobileOnly } from "react-device-detect";
import $ from 'jquery';

class NotesListComponents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.handleNote = this.handleNote.bind(this);
    }

    componentDidMount(){
        $(".closeTabPane").click(function () {
            setTimeout(function () {
                $(".nav-flip-switch").removeClass('flipped');
            }, 100);
            $(".tab-pane.fade").removeClass("active in");
            $(".home-tab-menus li").removeClass("active");
            
            setTimeout(function () {
                if($(".quickview-notes").hasClass('push')) {
                    $(".view-port").removeClass('push');
                };
            }, 200);

            
            $("#quick-note").removeClass("transform-100");
            $("#quick-fee").removeClass("transform-200");
            $("#quick-note").show();
            $("#quick-fee").show();
        
        })
    }

    handleNote(type) {
        var txtNote = jQuery("#txtNote").val();
        if (txtNote != "") {
            var cartlist = localStorage.getItem("CARD_PRODUCT_LIST") ? JSON.parse(localStorage.getItem("CARD_PRODUCT_LIST")) : [];//this.state.cartproductlist;
            cartlist = cartlist == null ? [] : cartlist;
            cartlist.push({ "Title": txtNote })
            this.props.dispatch(cartProductActions.addtoCartProduct(cartlist));
            var list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : null;
            if (list != null) {
                const CheckoutList = {
                    ListItem: cartlist,
                    customerDetail: list.customerDetail,
                    totalPrice: list.totalPrice,
                    discountCalculated: list.discountCalculated,
                    tax: list.tax,
                    subTotal: list.subTotal,
                    TaxId: list.TaxId,
                    order_id: list.order_id !== 0 ? list.order_id : 0,
                    showTaxStaus: list.showTaxStaus,
                    _wc_points_redeemed: list._wc_points_redeemed,
                    _wc_amount_redeemed: list._wc_amount_redeemed,
                    _wc_points_logged_redemption: list._wc_points_logged_redemption
                }
                localStorage.setItem('CHECKLIST', JSON.stringify(CheckoutList))
                //location.reload();

            }
            jQuery("#txtNote").val("");

            $('#id_add_notes').removeClass('active in')
            $('#notefeeActive').removeClass('active')
            $('.nav-flip-switch').removeClass('flipped')
            
            // setTimeout(function () {
            //     if($(".quickview-notes").hasClass('push')) {
            //         $(".view-port").removeClass('push');
            //     };
            // }, 200);            
            // $("#quick-note").removeClass("transform-100");
            // $("#quick-fee").removeClass("transform-200");
            // $("#quick-note").show();
            // $("#quick-fee").show();
            if (type == "addbymobile") {
                this.props.openModal("view_cart")
            }
        }
    }

    show(status) {
        this.setState({ display_status: status })
    }

    render() {
        return (
            (isMobileOnly == true) ?
                <MobileAddNotes
                    {...this.props}
                    handleNote={this.handleNote}
                    LocalizedLanguage={LocalizedLanguage} />
                :
                <div id="id_add_notes" className="tab-pane fade">
                    <div className="col-lg-9 col-sm-8 col-xs-8 p-0">
                        <div className="quick_menu_body closeTabPane"></div>
                    </div>
                    <div className="col-lg-3 col-sm-4 col-xs-4 pr-0  plr-8">
                        <div className="quick_menu_panel quick-notes-design">
                            <div className="quick_menu_header">
                            </div>
                            <div className="quick_menu_body">
                                <div className="view-port clearfix quickview-notes" id="note-views">
                                    <div className="view list" id="quick-note-list">
                                        <ul>
                                            <li className="add_note pointer">
                                                <div className="employee-details space-between pl-3 pr-3">
                                                    {/* <div className="employee-short-image">
                                                        
                                                    </div> */}
                                                    <div className="employee-short-descrition">
                                                        <i className="icons8-task icon-right icon-css-override fs30 mr-3"></i>
                                                        <div>
                                                            {LocalizedLanguage.addNote}
                                                        </div>
                                                    </div>
                                                    {/* <div className="employee-short-image">
                                                        <i className="icons8-task icon-right icon-css-override fs36"></i>
                                                    </div> */}
                                                </div>
                                            </li>
                                            <li className="add_fee pointer">
                                                <div className="employee-details space-between pl-3 pr-3">
                                                    {/* <div className="employee-short-image">
                                                        
                                                    </div> */}
                                                    <div className="employee-short-descrition">
                                                        <i className="icons8-discount icon-right icon-css-override fs30 mr-3"></i>
                                                        <div>
                                                            {LocalizedLanguage.addFee}
                                                        </div>
                                                    </div>
                                                    {/* <div className="employee-short-image">
                                                        <i className="icons8-discount icon-right icon-css-override fs36"></i>
                                                    </div> */}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="view notes" id="quick-note">
                                        <div>
                                            {/* <div className="employee-details space-between pl-2 pr-2">
                                                <div className="employee-short-image close-note-link">
                                                    <i className="icon icon-css-override icons8-undo push-top-3 fs30 mr-3"></i> {LocalizedLanguage.addNote}
                                                </div>
                                            </div> */}
                                            <div className="form">
                                                <div className="add_note_form">
                                                    <form className="form-addon p-3">
                                                        <div className="form-group">
                                                            <div className="input-group-reverse">
                                                                <div className="input-group-addon"> {LocalizedLanguage.addNote}</div>
                                                                <textarea type="tel" className="form-control quick-note-textarea-field" id="txtNote" placeholder={LocalizedLanguage.placeholderForNote}></textarea>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    {/* <textarea id="txtNote" className="form-control modal-txtArea" placeholder={LocalizedLanguage.placeholderNote} ></textarea> */}
                                                </div>
                                            </div>
                                            <div className="box-logout clearfix">
                                                <button className="btn btn-block btn-primary checkout-items text-center close-note-link" onClick={this.handleNote}>
                                                    {LocalizedLanguage.addNote}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <ProductAddFee />
                                </div>
                            </div>
                            <div className="quick_menu_footer">
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

const connectedNotesListComponents = connect(mapStateToProps)(NotesListComponents);
export { connectedNotesListComponents as NotesListComponents };