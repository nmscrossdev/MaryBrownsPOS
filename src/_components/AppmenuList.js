import React from 'react';
import KeyAppsDisplay from '../settings/KeyAppsDisplay';
import LocalizedLanguage from '../settings/LocalizedLanguage';
// import  {CommonOrderStatusPopup}  from './CommanOrderStatusPopup'
export const AppMenuList = (props) => {
    var _displayApp = KeyAppsDisplay.appskey;
    const { updateOrderStatus, showProductDetail, cssclassname, isdisabled, adjuctcreditpopup, addcustomernotes } = props;
    var disabled = [1, 2, 3];
    return (
        //    <div>
        (Object.keys(_displayApp).filter(item => _displayApp[item].disabled == false)).length > 0 ?
            // <div className={cssclassname && cssclassname != "" ? cssclassname : "product-list pl-move"} >
            <React.Fragment>
                {
                    Object.keys(_displayApp).map((item, index) => {
                        var appMenu = _displayApp[item];
                        return (
                            appMenu.disabled == false &&
                            <div key={item+'-'+index} className="product-tile pointer"
                                onClick={item == "update_status" ? updateOrderStatus :
                                    item == "print_label" ? showProductDetail :
                                        item == "adjust_credit" ? adjuctcreditpopup :
                                            item == "customer_addnotes" ? addcustomernotes : null} >
                                <input type="radio" className="card-checked" name="ActivityApps" disabled={isdisabled} />
                                <div className="card">
                                    <div className="card-body padding-6">
                                        <div className="card-image">
                                            {<img src={"../assets/img/product-menu/" + appMenu.img} alt="" />}
                                        </div>
                                    </div>
                                    <div className="card-footer padding-6">
                                        <div className="card-text text-truncate text-center">
                                        {appMenu.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                }
                {
                    cssclassname && cssclassname != "" && disabled.map((item, index) => {
                        return (
                            <div key={disabled.length + index} className="product-tile pointer" onClick={onclick}>
                                <input type="radio" className="card-checked" name="ActivityApps" disabled />
                                <div className="card">
                                    <div className="card-body padding-6">
                                        <div className="card-image">
                                            <img src="../assets/img/product-menu/whiteImg.PNG" alt="" />
                                        </div>
                                    </div>
                                    <div className="card-footer padding-6" style={{ 'borderColor': 'transparent' }}>
                                        <div className="card-text text-truncate text-center" style={{ color: 'transparent' }}>
                                            Update Status
                           </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
           </React.Fragment>
            :
            <div className="no-product-find AppModal">
                <i className="icons8-cloud-link"></i>
                <p>No Apps Found</p>
            </div>
        // <CommonOrderStatusPopup
        //   orderId={orderId}                                            
        //   /> 
        // </div>

    )
}