import React from 'react';
import { connect } from 'react-redux';
import {customerActions} from '../../CustomerPage/actions/customer.action'
import $ from 'jquery'; 
import { LoadingModal} from '../../_components';
import { history } from '../../_helpers';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
class AdjustCreditpopup extends React.Component {
    constructor(props) {
        super(props);
        this.validateAddNumber = this.validateAddNumber.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
        this.state={
            addCreditAmt:0.00,
            deductCreditAmt:0.00,
            isloading:false 
        }
        this.baseState = this.state 
    } 
    validateAddNumber(e,type) {
        const { value } = e.target;       
        const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')        
        if (value === '' || re.test(value)) {  
            if(type=='add'){ 
                var addCreAmount = $('#txtAddCredit').text() == "0" || $('#txtAddCredit').text() == "0.00" ? value : $('#txtAddCredit').val();
                this.setState({
                    addCreditAmt : addCreAmount
                })      
                $('#txtAddCredit').val(this.state.addCreditAmt);
            }
            else{
                var deductCredAMount = $('#txtDeductCredit').text() == "0" || $('#txtDeductCredit').text() == "0.00" ? value : $('#txtDeductCredit').val();
                this.setState({
                    deductCreditAmt : deductCredAMount
                })
                $('#txtDeductCredit').val(this.state.deductCreditAmt);  
            }
        } else{
            if(type=='add'){ 
                this.setState(prevCredit => ({
                    addCreditAmt:prevCredit.addCreditAmt
                  }));
            }else{
                this.setState(prevDeCredit => ({
                    deductCreditAmt:prevDeCredit.deductCreditAmt
                  }));
            }
        }  
    }   

    handleSubmit(customer_Id, udid){  
        if((this.state.addCreditAmt !=0 && this.state.addCreditAmt !='') || (this.state.deductCreditAmt !=0 && this.state.deductCreditAmt !='')){
            var notes= $('#storeCreditNotes').val();
            this.setState({isloading:true})              
            this.props.dispatch(customerActions.updateCreditScore(customer_Id, this.state.addCreditAmt,this.state.deductCreditAmt,notes,udid));
            this.setState({ addCreditAmt:0.00, deductCreditAmt:0.00}); 
             $("#storecredit").addClass('text-primary'); 
            setTimeout(() => {
                this.props.UpdateCustomerDetail(this.props,customer_Id, udid);
             }, 1000); 
            $(".form-control").val('');          
        }
    }
    componentWillReceiveProps(nextProp) {        
        if(nextProp && nextProp.update_store_credit && nextProp.update_store_credit.data ){
            if(nextProp.update_store_credit.data && nextProp.update_store_credit.data.is_success){               
                this.setState({isloading:false}) 
                // console.log("cust_id",this.props.customer_Id)            
                this.props.closeCreditScorepopup();           
            }else{
                this.setState({isloading:false}) 
            }
        }
    }   
    render() {
        const{customer_Id, udid } =this.props;
        return (
            <div className="modal fade popUpMid" id="AdjustCredit" role="dialog">
                  {(this.state.isloading==true ) && <LoadingModal />}
            <div className="modal-dialog modal-sm modal-center-block">
                <div className="modal-content">
                    <div className="modal-header header-modal">
                        <h1>{LocalizedLanguage.AdjustCredit}</h1>
                        <div className="data-dismiss" onClick={this.props.closeCreditScorepopup}>
                            <img src="../assets/img/closenew.svg"  alt=""/>
                        </div>
                    </div>
                    <div className="modal-body pt-0">
                        <div className="overflowscroll">
                                {/* <!-- <div class="w-100 label-normal mb-3 mt-2">
                                        Current Store Credit: 56.00
                                    </div> --> */}
                            <form className="form-addon">
                                <div className="form-group mb-0">
                                    <div className="input-group input-group-no-border">
                                        <div className="input-group-addon border-0">{LocalizedLanguage.CurrentCredit}</div>
                                        {/* <!-- <input type="text" class="form-control border-0" value="56.00" readonly> --> */}
                                        <div className="form-control border-0">{this.props.storecredit? this.props.storecredit:'0.0'}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">{LocalizedLanguage.addCredit}</div>
                                        <input type="input" className="form-control" id="txtAddCredit" 
                                        placeholder={LocalizedLanguage.EnterAmount} value = {this.state.addCreditAmt} onChange={(e)=>this.validateAddNumber(e,"add")}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-addon">{LocalizedLanguage.deductCredit}</div>
                                        <input type="input" value = {this.state.deductCreditAmt} className="form-control" id="txtDeductCredit"
                                        placeholder={LocalizedLanguage.EnterAmount} 
                                        onChange={(e)=>this.validateAddNumber(e,"deduct")}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="input-group-reverse">
                                <div className="input-group-addon">{LocalizedLanguage.addNote}</div>
                                        <textarea type="tel" className="form-control shorthight" id="storeCreditNotes" placeholder={LocalizedLanguage.Pleaseaddnotehere}></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="modal-footer no-padding bt-0">
                        <button className="btn btn-primary btn-block h-70 btn-capitalize"  onClick={() => this.handleSubmit(customer_Id, udid)}>
                               {LocalizedLanguage.AdjustCredit}
                        </button>
                    </div>
                </div>
            </div>
        </div>
           )
    };
}
function mapStateToProps(state) {    
    const { update_store_credit } = state;
    return {
        update_store_credit: update_store_credit       
    };
}
const connectedAdjustCreditPopup = connect(mapStateToProps)(AdjustCreditpopup);
export { connectedAdjustCreditPopup as AdjustCreditpopup };