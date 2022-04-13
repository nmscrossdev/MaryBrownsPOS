import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import {getFirebaseNotification} from '../../firebase/Notifications'
class OnboardingShopViewPopup extends React.Component {
    constructor(props) {
        super(props);
        this.closePopupDisplayMessage = this.closePopupDisplayMessage.bind(this);
        this.handlecloseClick = this.handlecloseClick.bind(this);
    }
    /**
     * Created By: Aman Singhai
     * Created Date:12/08/2020
     * Description: for closing the popup
     */
    closePopupDisplayMessage() {
        
    
        this.props && this.props.onClickContinue() && this.props.onClickContinue();
        hideModal('onBoardingPopup');
    }

    handlecloseClick = () => {
        hideModal(this.props.id);
    }
    render() {
        return (
            <div className="modal fade popUpMid" id={this.props.id} role="dialog"  data-backdrop="static">
                <div className="modal-dialog modal-sm modal-md2 modal-center-block">
                    <div className="modal-content">
                        {this.props.id !== 'firebaseRegisterAlreadyusedPopup' ? <button className="btn btn-danger btn-modal-close" onClick={() => this.handlecloseClick()} style={{ backgroundColor: "white" }}>
                            <img src="../assets/img/images/closenew.svg" alt="" />
                        </button> : '' }
                        <img src={this.props.imageSrc} className='m-auto pt-5' width='70' />
                        <div className="modal-body center-center pb-5">
                            <div className="plan-info">
                                <h4 className='font-bold'>{this.props.title}  </h4>
                                <p className="mb-0 mt-3  pb-0">{this.props.subTitle}</p>
                                <p className="mb-3 mt-0">{this.props.subTitle2}</p>
                                <button type="button" className="btn btn-info btn-40 btn-14 btn-padding-25" data-toggle="modal" onClick={() => this.props.onClickContinue()}>
                                {/* <button type="button" className="btn btn-primary btn-lg mb-3" data-toggle="modal" onClick={() => this.props.onClickContinue()}> */}
                                    {this.props.btnTitle} 
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export { OnboardingShopViewPopup };