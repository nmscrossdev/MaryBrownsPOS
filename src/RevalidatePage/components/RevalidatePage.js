import React from 'react';
import { connect } from 'react-redux';
import { history } from "../../_helpers";
import RevalidateView from '../../_components/views/m.RevalidateView';
import { isMobileOnly } from "react-device-detect";

class RevalidatePage extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.log_out = this.log_out.bind(this);
    }

    log_out() {
        localStorage.clear();
        history.push('/login');
    }

    handleSubmit() {
        if (localStorage.getItem("userstatus")) {
            var userstatus = JSON.parse(localStorage.getItem("userstatus"));
            window.location.href = userstatus.Content.link;
            //'https://testshop.creativemaple.ca/shop/';
            //https://oliverpos.com/
        } else {
            history.push('/login');
        }
    }

    render() {
        var errorMsg = "";
        if (localStorage.getItem("userstatus")) {
            var userstatus = JSON.parse(localStorage.getItem("userstatus"));
            errorMsg = userstatus.Exceptions;
        }

        return (
            (isMobileOnly == true) ?
                <RevalidateView 
                   handleSubmit={this.handleSubmit}
                   log_out={this.log_out}
                />
                :
                <div className="bgimg-1">
                    <div className="content_main_wapper">
                        <div className="onboarding-loginBox">
                            <div className="login-form">
                                <div className="onboarding-pg-heading">
                                    <h1>Subscription Message</h1>
                                    <p>{errorMsg}</p>
                                </div>
                                <form name="form" className="onboarding-login-field"  > {/* onSubmit={()=>this.handleSubmit} */}
                                    <button type="button" className="btn btn-login bgcolor2 mt-0" onClick={() => this.handleSubmit()}>Revalidate</button>
                                </form>
                            </div>
                        </div>
                        <div className="copy_right">
                            <a onClick={() => this.log_out()}><img src="../assets/img/logout-btn_wht.png" /></a>
                        </div>
                        <div className="powered-by-oliver">
                            <a href="javascript:void(0)">Powered by Oliver POS</a>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

const connectedRevalidatePage = connect(mapStateToProps)(RevalidatePage);
export { connectedRevalidatePage as RevalidatePage };