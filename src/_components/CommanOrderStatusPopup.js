import React from 'react';
import KeysOrderStaus from '../settings/KeysOrderStaus';
import { checkoutActions } from "../CheckoutPage/actions/checkout.action";
import { get_UDid } from '../ALL_localstorage';
import { connect } from 'react-redux';
import { LoadingModal} from '../_components';
import { history } from '../_helpers';
import LocalizedLanguage from '../settings/LocalizedLanguage';

// export const CommonOrderStatusPopup = (props) => {  
    var _isloading=false;
class CommonOrderStatusPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Orderstatus: '',
            IsUpdateSuccess: false,
            isloading:false,
        }
        this.updateOrder = this.updateOrder.bind(this);
    }
    /// Call API to update the order status.
    updateOrder(_orderId) {
        
        var udid = get_UDid('UDID');
        var _orderStatus = this.state.Orderstatus;
        this.state.isloading =true;
        this.setState({isloading:true});    
        _isloading=true;
       var dispatch= this.props.dispatch;
            setTimeout(() => {
                if (_orderId && _orderId !== '' && _orderId > 0) { 
                    var option = { "udid": udid, "orderId": _orderId, "status": _orderStatus }
                    dispatch(checkoutActions.updateOrderStatus(option));    
            }
            }, 500);
     
    }
    updateOrderStatus = (_orderstatus) => {
        this.setState({ Orderstatus: _orderstatus })
    }
    componentWillReceiveProps(nextProp) {        
        if(nextProp && nextProp.shop_orderstatus_update && nextProp.shop_orderstatus_update.order_status_update ){
            if(nextProp.shop_orderstatus_update.order_status_update.is_success== true){
                $('#updateStatus').modal("hide");  
                this.setState({isloading:false})   
                _isloading=false;
               if (window.location.pathname == '/activity') {
                localStorage.removeItem("CUSTOMER_TO_ACTVITY")
                localStorage.setItem("selected_row", 'customerview');
                localStorage.setItem('CUSTOMER_TO_OrderId', this.props.orderId);
                window.location.reload(false);   
               }      
            }
        }
    }

    
    render() {
        var _orderkyes = KeysOrderStaus.key;
        const { orderId , currentOrderStaus, Cust_ID} = this.props;
        var _currentOrderStaus=this.state.Orderstatus;
        return (
            <div className="modal fade popUpMid" id="updateStatus" role="dialog">
                {(this.state.isloading==true || _isloading==true) && <LoadingModal />}
                <div className="modal-dialog modal-sm modal-center-block">
                    <div className="modal-content">
                        <div className="modal-header header-modal">
                            <h1>Update Status</h1>
                            <div className="data-dismiss" data-dismiss="modal">
                                <img src="../assets/img/closenew.svg" alt="" />
                            </div>
                        </div>
                        <div className="modal-body">
                            {
                                Object.keys(_orderkyes).filter(item => item.toLowerCase()!=="refunded").map((item, index) => {
                                    var _disabled = (item == 'void_sale' || item == 'refunded') ? 'disabled' : '';
                                    return (
                                        // <div key={"status"+index}>
                                        //     <div className="clearfix"></div>
                                        //         <div className="radio radio-default" onClick={()=>{this.updateOrderStatus(item)}}>
                                        //             {/* e=>{updateOrder(item)} */}
                                        //             <input type="radio" id={`radio-${index}`}  name="radio-group" 

                                        //         />
                                        //             <label htmlFor={`radio-${index}`}>{_orderkyes[item]}</label>
                                        //         </div>
                                        // </div>

                                        <div className="radio--custom radio-default" key={"status" + index} onClick={()=>{this.updateOrderStatus(item)}}>
                                            <input type="radio" id={`radio-${index}`} name="radio-group" 
                                            //  checked={_currentOrderStaus && _currentOrderStaus.toLowerCase()== item.toLowerCase()?true:false} 
                                             disabled= {((Cust_ID == '' || Cust_ID == undefined ) &&  item == "lay_away") || 
                                             (currentOrderStaus && currentOrderStaus.toLowerCase()== item.toLowerCase())
                                             ? true :  false }
                                             />
                                            {/* disabled= { currentOrderStaus && currentOrderStaus.toLowerCase()== item.toLowerCase()?true:false} */}
                                            {/* checked={ currentOrderStaus && currentOrderStaus.toLowerCase()== _orderkyes[item].toLowerCase()?true:false}   */}
                                            <label htmlFor={`radio-${index}`}>{_orderkyes[item]}</label>
                                            <div className="clearfix"></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="modal-footer no-padding bt-0">
                            <button className="btn btn-primary btn-block h-70 btn-text-unset" onClick={() => this.updateOrder(orderId)}>
                                {LocalizedLanguage.SaveUpdate}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}
function mapStateToProps(state) {
    const { shop_orderstatus_update } = state;
    return {
        shop_orderstatus_update: shop_orderstatus_update       
    };
}
const connectedCommonOrderStatusPopup = connect(mapStateToProps)(CommonOrderStatusPopup);
export { connectedCommonOrderStatusPopup as CommonOrderStatusPopup };
// export default connect()(CommonOrderStatusPopup);
