import React from 'react';
import { connect } from 'react-redux';
import { cartProductActions } from '../_actions';
import { get_UDid,chunkArray } from '../ALL_localstorage'
import LocalizedLanguage from '../settings/LocalizedLanguage';
import { history,store } from "../_helpers";
import $ from 'jquery';

const NumInput = props =>
    chunkArray(props.numbers, 3).map((num, index) => (
        <tr key={index}>
            {num.map((nm, i) => {
                return (
                    <td  key={i} className={props.className1} > 
                        <button type={props.type} onClick={() =>props.onClick(nm)}  className={props.className2} >{nm}</button>
                    </td>
                )
            })

            }
        </tr>
    ))

class InventoryPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            pinNumberList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            discountAmount:0
        }
        this.handleDiscount = this.handleDiscount.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.calcInp=this.calcInp.bind(this);      
        this.handle = this.handle.bind(this);

    }

    calcInp(e) {
        if (e == "c") {
             if (this.state.discountAmount.toString().length ==1) {
                this.state.discountAmount = "0"}
             else {
                const txtValue = this.state.discountAmount !== null && this.state.discountAmount !== undefined ? this.state.discountAmount.toString().substring(-1, this.state.discountAmount.length - 1) : 0;
                this.state.discountAmount = txtValue == "" ? "0" : txtValue;
            }
        }
        else {
           this.state.discountAmount = $('#txtInv').val()=="0" || $('#txtInv').val()=="0.00"? e :$('#txtInv').val()+e.toString();
        }
            $('#txtInv').val(this.state.discountAmount);
    }
    handle(e) {
        const { value } = e.target;
        $('#txtInv').focus();
        const re = new RegExp("^[0-9]+$")
        if (value === '' || re.test(value)) {
            this.setState({ discountAmount: value })
        }
    }
    handleDiscount() {
        const { inventoryCheck, isInventoryUpdate, dispatch, inventoryData } = this.props;
        var inventoryAmount = $('#txtInv').val();
        this.setState({ discountAmount: inventoryAmount })
        var data = {
            udid:get_UDid('UDID'),
            quantity:inventoryAmount==''?0:inventoryAmount,
            wpid:(inventoryCheck && inventoryCheck.length > 0) ? inventoryCheck[0].WPID : inventoryCheck? inventoryCheck.WPID:''
        }  
        var inventoryDetails = (inventoryCheck && inventoryCheck.length > 0) ? inventoryCheck :  inventoryCheck && inventoryCheck.WPID ? [inventoryCheck]:[]
        isInventoryUpdate(true)
        dispatch(cartProductActions.addInventoryQuantity(data,  inventoryDetails));
        this.setState({discountAmount:0});
        hideModal('InventoryPopup');
       
    }

    handleClose()
    {
        this.setState({discountAmount:0});
        jQuery('#txtInv').val(0)
    }

    componentDidMount(){
        console.log('inventoryCheck', this.props.inventoryCheck)
        this.setState({discountAmount:this.props.inventoryCheck ? this.props.inventoryCheck.StockQuantity:0});
        setTimeout(function(){
          $('#InventoryPopup').on('shown.bs.modal', function () {
          $('#txtInv').focus();          
  
          });
        }.bind(this),3000)
       }       
     
    render() {
      const {isupdate}=this.props; //this.state.discountAmount!=='' &&
        var inventory= this.state.discountAmount!==0?this.state.discountAmount
                    :this.props.inventoryCheck ? this.props.inventoryCheck.StockQuantity:0;
        const _state = store.getState();
        var warehouseDetail= _state.productWarehouseQuantity && _state.productWarehouseQuantity.detail
       //var currentLocationName= localStorage.getItem("LocationName");
       var CurrentWarehouseId= localStorage.getItem("WarehouseId");
       var currentWareHouseDetail="";
       if(warehouseDetail && warehouseDetail.length>0){
        currentWareHouseDetail= warehouseDetail.find(item=>item.warehouseId==CurrentWarehouseId)
       }
       
      // var wareHouse=
       return (
        <div className="modal fade modal-small" id="InventoryPopup" role="dialog">
        <div className="modal-dialog modal-sm modal-center-block">
            <div className="modal-content">
                <div className="modal-header header-modal">
                    <h1>Inventory</h1>
                    <div className="data-dismiss" data-dismiss="modal" onClick={this.handleClose}>
                        <img src="assets/img/closenew.svg"  alt=""/>
                    </div>
                </div>
                <div className="modal-body">
                    <div className="full-product">
                        <div className="full-product-description">
                            {/* <div className="full-product-sections center-center">
                                <div>
                                    <h6><b>Current Warehouse</b></h6>
                                   {
                                       currentWareHouseDetail && currentWareHouseDetail !=="" &&
                                       <p className="font-lg">{currentWareHouseDetail.warehouseName}</p>
                                   }
                                </div>
                                <div>
                                    <input type="text" id="txtInv" className="form-control ml-auto w-50 inputinventory" placeholder="99" 
                                     value={inventory} onChange={this.handle}/>
                                </div>
                            </div> */}
                            <div className="full-product-sections">
                                        <div>
                                            <h6><b>Current Warehouse</b></h6>
                                        </div>
                                        <div className="center-center mb-3">
                                       { currentWareHouseDetail && currentWareHouseDetail !=="" &&
                                       <div className="w-75">
                                       <p className="font-lg">{currentWareHouseDetail.warehouseName}</p>
                                       </div>
                                        }
                                            <div>
                                            <input type="text" id="txtInv" className="form-control ml-auto w-50 inputinventory" //placeholder="99" 
                                     value={inventory} onChange={this.handle}/>
                                            </div>
                                        </div>
                                    </div>
                            <button type="button" className="btn btn-info btn-lg btn-block" onClick={() => this.handleDiscount()}>Update Inventory</button>
                            <div className="full-product-sections pt-3">
                                <h6><b>Other Warehouses</b></h6>
                                {
                              warehouseDetail && warehouseDetail.length>0 && 
                              warehouseDetail.map(item=>{
                                    if(item.warehouseId !==parseInt(CurrentWarehouseId)){ 
                                return (
                                        <div className="center-center pb-3">
                                            <div className="w-100">
                                            <p className="font-lg">{item.warehouseName}</p>
                                            {item.locationNames && item.locationNames !=="" && <p><small>Locations: {item.locationNames}</small></p>}
                                            </div>
                                            <div className="font-lg">
                                            <p>{item.Quantity}</p>
                                            </div>
                                        </div>
                                       )
                                    }
                                      })
        
                                   }
                            </div>
                            
                           

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
            
        );
    }
}
{/* // <div id="InventoryPopup" tabIndex="-1" className="modal modal-wide modal-wide1 fade">
            //     <div className="modal-dialog modal-sm w-400" id="dialog-midle-align">
            //         <div className="modal-content">
            //             <div className="modal-header">
            //                 <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.handleClose} >
            //                     <img src="assets/img/Close.svg" />
            //                 </button>
            //                 <h4 className="modal-title">{LocalizedLanguage.adjustInven}</h4>
            //             </div>
            //             <div className="modal-body p-0">
            //                 <form className="clearfix">
            //                     <div className="p-0">
            //                         <div className="panel-product-list" id="panelCalculatorpopUp">
            //                             <div className="panel panelCalculator">
            //                                 <div className="panel-body p-0">
            //                                     <table className="table table-bordered shopViewPopUpCalculator">
            //                                         <tbody>
            //                                             <tr>
            //                                                 <td colSpan="2" className="text-right">
            //                                                     <div className="input-group discount-input-group">
            //                                                          <input type="text" id="txtInv" className="form-control text-right" placeholder="0" aria-describedby="basic-addon1"
            //                                                          value={this.state.discountAmount} onChange={this.handle}/>
            //                                                         <span className="input-group-addon AmoutType" id="" name="spnCalcType"></span>
            //                                                     </div>
            //                                                 </td>
            //                                                 <td className="text-center pointer" onClick={() => this.calcInp('c')}>
            //                                                     <button type="button" className="btn btn-default calculate">
            //                                                         <img width="36" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjA1OSAzMS4wNTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjA1OSAzMS4wNTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0zMC4xNzEsMTYuNDE2SDAuODg4QzAuMzk4LDE2LjQxNiwwLDE2LjAyLDAsMTUuNTI5YzAtMC40OSwwLjM5OC0wLjg4OCwwLjg4OC0wLjg4OGgyOS4yODMgICAgYzAuNDksMCwwLjg4OCwwLjM5OCwwLjg4OCwwLjg4OEMzMS4wNTksMTYuMDIsMzAuNjYxLDE2LjQxNiwzMC4xNzEsMTYuNDE2eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgoJPGc+CgkJPHBhdGggZD0iTTE2LjAxNywzMS4wNTljLTAuMjIyLDAtMC40NDUtMC4wODMtMC42MTctMC4yNUwwLjI3MSwxNi4xNjZDMC4wOTgsMTUuOTk5LDAsMTUuNzcsMCwxNS41MjkgICAgYzAtMC4yNCwwLjA5OC0wLjQ3MSwwLjI3MS0wLjYzOEwxNS40LDAuMjVjMC4zNTItMC4zNDEsMC45MTQtMC4zMzIsMS4yNTUsMC4wMmMwLjM0LDAuMzUzLDAuMzMxLDAuOTE1LTAuMDIxLDEuMjU1TDIuMTYzLDE1LjUyOSAgICBsMTQuNDcxLDE0LjAwNGMwLjM1MiwwLjM0MSwwLjM2MSwwLjkwMiwwLjAyMSwxLjI1NUMxNi40OCwzMC45NjgsMTYuMjQ5LDMxLjA1OSwxNi4wMTcsMzEuMDU5eiIgZmlsbD0iIzRiNGI0YiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="></img>
            //                                                     </button>
            //                                                 </td>
            //                                             </tr>
            //                                               <NumInput  type="button" onClick={this.calcInp} numbers={this.state.pinNumberList} className2="btn btn-default calculate"  className1="td-calc-padding" /> 
                                                      
            //                                             <tr>
            //                                                <td className="td-calc-padding">
            //                                                     <button type="button" onClick={() => this.calcInp(0)} className="btn btn-default calculate">0</button>
            //                                                 </td>
            //                                                 <td className="td-calc-padding" colSpan="2">
            //                                                     <button type="button" className="btn btn-primary btn-block h70" data-dismiss="modal" onClick={() => this.handleDiscount()} >{LocalizedLanguage.inventoryUpdate}</button>
            //                                                 </td>
            //                                               </tr>
            //                                         </tbody>
            //                                     </table>
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 </form>
            //             </div>
            //          </div>
            //     </div>
            // </div> */}
function mapStateToProps(state) {
    return { };
}
const connectedInventoryPopup = connect(mapStateToProps)(InventoryPopup);
export { connectedInventoryPopup as InventoryPopup };