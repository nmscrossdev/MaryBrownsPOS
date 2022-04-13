import React from 'react';
import { connect } from 'react-redux';
import Language from '../_components/Language';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';

class CommonHeaderFirst extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            void_Sale: false
        }
    }

    saleToVoid() {
        this.setState({ void_Sale: true })
    }

    componentDidMount() {
        var VOID_SALE = localStorage.getItem("VOID_SALE")
        if ((typeof VOID_SALE !== 'undefined') && VOID_SALE !== null) {
             this.saleToVoid();
        }
    }

    popup_OpenClose() {
        if (this.state.void_Sale == true) {
            //$('#popup_void_sale').modal('show')
            showModal('popup_void_sale');
        } else {
            var checklist = localStorage.getItem('CHECKLIST') && JSON.parse(localStorage.getItem('CHECKLIST'))
            if(checklist && (checklist.status == "pending" || checklist.status == "park_sale" || checklist.status == "lay_away" || checklist.status == "on-hold")){
                localStorage.setItem('PENDING_PAYMENTS',JSON.stringify(checklist))
            }
                localStorage.removeItem('extensionUpdateCart');
            window.location = '/shopview'
        }
    }

    gotoResister() {
        localStorage.removeItem('AdCusDetail');
        localStorage.removeItem("CHECKLIST");
        window.location = '/shopview'
    }

    noAction(){
        // nothing
    }

    render() {
        const { match, sale_to_void_status } = this.props;
        if ((typeof sale_to_void_status !== 'undefined') && sale_to_void_status !== null) {
            if (this.state.void_Sale == false && sale_to_void_status == 'void_sale') {
                this.saleToVoid();
            }
        }
        return (
            <nav className="navbar navbar-default" id="colorFullHeader">
                <div className="col-lg-3 col-sm-4 col-xs-4 pl-0 cart_header_overlap cart_left">
                    {/* Check Out */}
                    {match.path == '/checkout' ?
                        <div className="cart_header" >
                            {/* <div className="ch_icon">
                                
                            </div> */}
                            <div className="ch_heading d-flex align-items-center pl-2" style={{lineHeight:"60px"}}>
                            <i className="icons8-back-arrow fs40 text-white pointer" onClick={() => this.popup_OpenClose()}></i>

                            &nbsp; {this.state.void_Sale == false ? LocalizedLanguage.addMoreItem : LocalizedLanguage.voidSale}
                            </div>
                            <div className="dropdown ch_icon">
                                {/* <a className="dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">
                                    <button className="button icon icons8-plus fs40 push-top-5"></button>
                                </a> */}
                                {this.state.void_Sale == false ?
                                    <ul className="dropdown-menu custom-drpbox dropdown-menu-right" role="menu" aria-labelledby="menu1">
                                        <li role="presentation"><a role="menuitem" tabIndex="-1" data-toggle="modal" data-target="#addnotehere">{LocalizedLanguage.addNote}</a></li>
                                        <li role="presentation"><a role="menuitem" tabIndex="-1" data-toggle="modal" data-target="#popup_oliver_add_fee">{LocalizedLanguage.addFee}</a></li>
                                    </ul>
                                    : null}
                            </div>
                        </div>
                        : null}
                    {match.path == '/refund' ?
                        <div className="cart_header">
                           {/* "ch_heading d-flex align-items-center pl-2 */}
                            <a href="/activity">
                                <div className="ch_heading d-flex align-items-center pl-2">
                                    <i className="icons8-back-arrow fs40 text-white"></i>&nbsp; {LocalizedLanguage.goBack}
                                </div>
                            </a>
                            {/* <div className="dropdown ch_icon">
                                 <a className="dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">
                                    <button className="button icon icon-plus-white"></button>
                                </a>
                                <ul className="dropdown-menu custom-drpbox dropdown-menu-right" role="menu" aria-labelledby="menu1">
                                    <li role="presentation"><a role="menuitem" tabIndex="-1" data-toggle="modal" data-target="#addnotehere">Add Notes</a></li>
                                    <li role="presentation"><a role="menuitem" tabIndex="-1" data-toggle="modal" data-target="#popup_oliver_add_fee">Add Fee</a></li>
                                </ul>
                            </div> */}
                        </div>
                        : null}
                </div>
                <div className="col-xs-offset-4 col-md-offset-4 col-sm-offset-4 col-lg-offset-3 col-lg-9 col-sm-8 col-xs-8 p-0">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="nav_logo">
                                    <a onClick={this.state.void_Sale == false ?this.gotoResister :this.noAction }>{LocalizedLanguage.mainRegister}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    const { sale_to_void_status } = state;
    return {
        sale_to_void_status: sale_to_void_status.items
    };
}

const connectedCommonHeaderFirst = connect(mapStateToProps)(CommonHeaderFirst);
export { connectedCommonHeaderFirst as CommonHeaderFirst };