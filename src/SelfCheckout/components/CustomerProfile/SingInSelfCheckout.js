import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { history } from '../../../_helpers';
import { get_UDid } from '../../../ALL_localstorage'
import { customerActions } from '../../../CustomerPage/actions/customer.action';
import { LoadingModal, CommonMsgModal } from '../../../_components';
import MobileSignInPopup from '../SelfMobileView/mSignInPopup';
import { isMobileOnly, isIOS } from "react-device-detect";
import ActiveUser from '../../../settings/ActiveUser';

class Singinselfcheckout extends React.Component {
    constructor(props) {
        super(props);  
        this.state = {
            SingInEmail: '',
            SingInPWD: ''
        }; 
        this.handleChange = this.handleChange.bind(this);        
    }

    componentWillMount() {
        this.setState({SingInEmail : '', SingInPWD : ''});

    }

    handleChange(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    
    render() {  
        return ( 
            (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true) ?
            <MobileSignInPopup {...this.state}/>
            : 
            <div className="modal fade popUpMid" id="signInPopup" role="dialog">
                <div className="modal-dialog modal-center-block">
                    <div className="modal-content">
                        <div className="modal-header header-modal justify-start">
                            <h1 className="h3-title">
                                {LocalizedLanguage.signin}
                            </h1>
                            <div className="data-dismiss" data-dismiss="modal">
                                <img src="../../assets/img/closenew.svg" alt=""/>
                            </div>
                        </div>
                        <div className="modal-body">
                            <form className="form-addon-medium" autoComplete="false">                                
                                <div className="container">
                                    <div className="form-addon pl-3 pr-3">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.email}</div>
                                                <input type="email" autoComplete='off' className="form-control"
                                                 id="SingInEmail" name="SingInEmail" value={this.state.SingInEmail}
                                                 placeholder="asdjlas@me.com" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.password}</div>
                                                <input type="password" className="form-control" autoComplete='off' 
                                                 id="SingInPWD" name="SingInPWD" value={this.state.SingInPWD} 
                                                 placeholder="hidden" onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>                           
                            </form>
                        </div>
                        <div className="modal-footer no-padding bt-0">
                            <button className="btn btn-primary btn-block h-70">
                                {LocalizedLanguage.signin}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {    
    return {        
    };
}
const connectedSinginselfcheckout = connect(mapStateToProps)(Singinselfcheckout);
export { connectedSinginselfcheckout as Singinselfcheckout };