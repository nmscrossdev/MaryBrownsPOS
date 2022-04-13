import React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery'; 
import {customerActions} from '../../CustomerPage/actions/customer.action'
import { LoadingModal} from '../../_components';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

class AddCustomersNotepoup extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            isloading:false 
        }
    }
    
    componentWillReceiveProps(nextProp) {       
        if(nextProp && nextProp.update_customer_notes && nextProp.update_customer_notes.data ){
            if(nextProp.update_customer_notes.data && nextProp.update_customer_notes.data.is_success){               
                this.setState({isloading:false}) 
                this.props.closeNotespopup();        
            }
        }
    }

    handleSubmit(customer_Id, udid){          
        var notes= $.trim($("#txtcustNotes").val());
        if(notes!==""){
            console.log("check===>", notes);
            var userLocal = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : '';            
            this.setState({isloading:true}) //   $('#txtcustNotes').text();          
            this.props.dispatch(customerActions.updateCustomerNote(customer_Id, notes, udid, userLocal));            
            setTimeout(() => {
                this.props.UpdateCustomerDetail(this.props,customer_Id, udid);                
                this.setState({isloading:false}) 
                this.props.closeNotespopup();  
            }, 1000);                   
            $(".form-control").val('');    
        }
    }

    render() {
        const{customer_Id, udid } =this.props;
        return (
            <div className="modal fade popUpMid" id="AddCustomerNote" role="dialog">
                {(this.state.isloading==true ) && <LoadingModal />}
            <div className="modal-dialog modal-sm modal-center-block">
                <div className="modal-content">
                    <div className="modal-header header-modal">
                        <h1>{LocalizedLanguage.AddCustomerNote}</h1>
                        <div className="data-dismiss" data-dismiss="modal">
                            <img src="../assets/img/closenew.svg"  alt=""/>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="overflowscroll">
                            <form className="form-addon">
                                <div className="form-group">
                                    <div className="input-group-reverse">
                                        <div className="input-group-addon">{LocalizedLanguage.addNote}</div>
                                        <textarea type="text" id="txtcustNotes" className="form-control fullheight" placeholder={LocalizedLanguage.Pleaseaddnotehere}>      
                                        </textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer no-padding bt-0">
                        <button className="btn btn-primary btn-block h-70 btn-capitalize" onClick={() => this.handleSubmit(customer_Id, udid)}>
                            {LocalizedLanguage.SaveNote}
                        </button>
                    </div>
                </div>
            </div>
        </div>    
        )
    };
}
function mapStateToProps(state) {
    const { update_customer_notes } = state;
    return {
        update_customer_notes: update_customer_notes       
    };
}
const connectedAdjustCreditPopup = connect(mapStateToProps)(AddCustomersNotepoup);
export { connectedAdjustCreditPopup as AddCustomersNotepoup };