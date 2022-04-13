import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../settings/LocalizedLanguage';

class PlanUpgradePopup extends React.Component {
    constructor(props) {
        super(props);
        this.closePlanUpgradePopup = this.closePlanUpgradePopup.bind(this);
    }
    /** 
     * Created By: Aman
     * Created Date:20/07/2020
     * Description: for closing the popup
     */
    closePlanUpgradePopup() {
        hideModal('cashmanagementrestrication');
    }

    render() {
        var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem("selectedRegister")): '';
        var client= localStorage.getItem("clientDetail")? JSON.parse(localStorage.getItem("clientDetail")):'';  
        return (
            <div className="modal fade popUpMid" id="cashmanagementrestrication" role="dialog">
                <div className="modal-dialog modal-sm modal-md2 modal-center-block">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="plan-info">
                                <i className="icons8-warning-shield text-primary"></i>
                                    { client  && client.subscription_permission && client.subscription_permission.AllowCashManagement != true ?
                                        <h4>{LocalizedLanguage.notInCurrentPlan}</h4>
                                        :
                                        selectedRegister && selectedRegister.EnableCashManagement == false ?
                                            <h4>This feature is disabled from Admin side</h4>
                                        : ''
                                    }
                                    { client  && client.subscription_permission && client.subscription_permission.AllowCashManagement!= true ?
                                        <p className="mb-3">{LocalizedLanguage.toUpdateCurrentPlan}</p>
                                        :
                                        selectedRegister && selectedRegister.EnableCashManagement == false ?
                                            <p className="mb-3">To enable your plan, go to Oliver Hub</p>
                                        : ''
                                    }
                                <button type="button" className="btn btn-primary btn-lg mb-3" data-toggle="modal" onClick={() => this.closePlanUpgradePopup()}
                                    data-target="#myModal">Continue</button>
                            </div>
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
const connectedPlanUpgradePopup = connect(mapStateToProps)(PlanUpgradePopup);
export { connectedPlanUpgradePopup as PlanUpgradePopup };
