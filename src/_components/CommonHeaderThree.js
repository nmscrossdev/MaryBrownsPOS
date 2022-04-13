import React from 'react';
import { connect } from 'react-redux';
import Language from '../_components/Language';
import  LocalizedLanguage  from '../settings/LocalizedLanguage';

class CommonHeaderThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backUrl:  history.state && history.state.state ? history.state.state:sessionStorage.getItem("backurl")?sessionStorage.getItem("backurl") : null
        }
    }

    componentDidMount() {
        // const page  = this.props;
    }
    Back(url) {
        sessionStorage.removeItem("backurl")
        window.location = url
    }
    render() {
        const { match } = this.props;
        const { backUrl } = this.state;
        return (
            <nav className="navbar navbar-default" id="colorFullHeader">
                <div className="col-lg-3 col-sm-4 col-xs-4 pl-0 cart_header_overlap cart_left">
                    {backUrl && backUrl != null ?
                        // <div className="cart_header">
                        //     <a href={backUrl} className="ch_icon">
                        //         <button className="button btn-link">
                        //             <i className="icon icons8-back-arrow fs40 text-white"></i>
                        //         </button>
                        //     </a>
                        //     <div className="ch_heading d-flex align-items-center pl-4">
                        //         &nbsp;
                        //     {LocalizedLanguage.goBack}
                            <div className="fixed-text fixed-top-left">
                                <a onClick={() => this.Back(backUrl)} className="push-top-min-2 d-flex align-items-center">
                                    <i className="icons8-back-arrow fs40 text-white"></i> &nbsp;Go Back</a>
                            </div>
                        // </div>
                        // </div>
                        : null}
                </div>
            </nav>
        )
    }
}
function mapStateToProps(state) {
    return {};
}
const connectedCommonHeaderThree = connect(mapStateToProps)(CommonHeaderThree);
export { connectedCommonHeaderThree as CommonHeaderThree };