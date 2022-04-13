import React from 'react';
import { connect } from 'react-redux';
import { ProductAtrribute, CommonModuleJS, getVariatioModalProduct, cartPriceWithTax, getSettingCase, typeOfTax } from '../../_components/index';
import { cartProductActions } from '../../_actions';
import { Markup } from 'interweave';
import { default as NumberFormat } from 'react-number-format';
import { LoadingModal } from '../../../src/_components/index'
import Permissions from '../../settings/Permissions';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { androidDisplayScreen } from '../../settings/AndroidIOSConnect';
import { isMobileOnly } from 'react-device-detect';
import { RoundAmount } from '../../_components/TaxSetting';
import { AppMenuList } from "../../_components/AppmenuList";
import KeyAppsDisplay from '../../settings/KeyAppsDisplay';
import ActiveUser from '../../settings/ActiveUser';

class SelfCheckoutVariatonPopup extends React.Component { 
    constructor(props) {
        super(props);
    }  

    render() {
        const { showSelectedProduct, decrementDefaultQuantity, incrementDefaultQuantity, handleChange, quantity } = this.props;       
        return(
            <div className="modal-dialog modal-center-block">
                <div className="modal-content">
                    <div className="modal-header header-modal justify-start">
                        <h1 className="h3-title" title={this.props.proTitle}>
                            {this.props.prosubTitle}
                        </h1>
                        <div className="data-dismiss" data-dismiss="modal">
                            <img src="assets/img/closenew.svg" alt=""/>
                        </div>
                    </div>
                    <div className="modal-body no-padding">
                        <div className="self-checkout-variation">
                            <div className="widget-3 spacer-xy-25">
                                <div className="widget-icon">
                                    <img src={this.props.proImg} onError={(e) => { e.target.onerror = null; e.target.src = "assets/img/placeholder.png" }} id="prdImg"/>
                                </div>
                                <div className="widget-decription">
                                    <h4>Short Description</h4>
                                    <p>PFor over 35 years, Janes & Noseworthy has been helping the people of Newfoundland and Labrador get out of debt!</p>
                                </div>
                            </div>
                            <div className="spacer-xy-25">
                                <div className="spacer-t-20 spacer-b-30">
                                    {/* <div className="variation-wrapper"> */}
                                        {/* simlple start */}
                                        {this.props.getVariationProductData ?
                                            this.props.getVariationProductData.Type !== 'variable' ?
                                                <p className="text-alert-record"> {LocalizedLanguage.noAvailable} </p>
                                                :
                                                
                                                <ProductAtrribute showSelectedProduct={this.props.showSelectedProduct}
                                                    attribute={this.props.attribute}
                                                    optionClick={this.props.optionClick}
                                                    filteredAttribute={this.props.filteredAttribute}
                                                    selectedAttribute={this.props.selectedAttribute}
                                                     productVariations={this.props.productVariations}
                                                    selectedOptionCode={this.props.selectedOptionCode}
                                                    selectedOptions={this.props.selectedOptions} />
                                            : null}
                                    {/* </div>                                          */}
                                </div>                        
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer no-padding border-top border-width-1">
                        <div className="widget_quantity">
                            <button className="btn btn-default" onClick={decrementDefaultQuantity}>
                                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIzIiB2aWV3Qm94PSIwIDAgMzQgMyI+PGc+PGc+PHBhdGggZmlsbD0iIzRiNGI0YiIgZD0iTTE3LjQwMyAxLjA3M0gxLjQyOGEuNDI4LjQyOCAwIDAgMCAwIC44NTRoMzEuMDk3YS40MjguNDI4IDAgMCAwIDAtLjg1NHoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiM0YjRiNGIiIHN0cm9rZS1taXRlcmxpbWl0PSI1MCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTcuNDAzIDEuMDczdjBoLS44NTV2MEgxLjQyOGEuNDI4LjQyOCAwIDAgMCAwIC44NTRoMTUuMTJ2MGguODU1djBoMTUuMTIyYS40MjguNDI4IDAgMCAwIDAtLjg1NHoiLz48L2c+PC9nPjwvc3ZnPg=="/>
                            </button>
                            <div className="widget_quantiy_show">
                                <div className="widget_quantity_addon">
                                    <div className="widget_quantity_text">
                                        Qty.
                                    </div>
                                    <input type="text" className="widget_quantity_text"  name="qualityUpdater" value={quantity}
                                    onChange={handleChange}/>
                                </div>
                            </div>
                            <button className="btn btn-default" onClick={incrementDefaultQuantity}>
                                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCIgdmlld0JveD0iMCAwIDM0IDM0Ij48Zz48Zz48cGF0aCBmaWxsPSIjNGI0YjRiIiBkPSJNMTcuNDAzIDE2LjU0OFYxLjQyOGEuNDI4LjQyOCAwIDAgMC0uODU1IDB2MTUuMTJIMS40MjhhLjQyOC40MjggMCAwIDAgMCAuODU1aDE1LjEydjE1LjEyMmEuNDI4LjQyOCAwIDAgMCAuODU1IDBWMTcuNDAzaDE1LjEyMmEuNDI4LjQyOCAwIDAgMCAwLS44NTV6Ii8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNGI0YjRiIiBzdHJva2UtbWl0ZXJsaW1pdD0iNTAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE3LjQwMyAxNi41NDh2MC0xNS4xMmEuNDI4LjQyOCAwIDAgMC0uODU1IDB2MTUuMTJIMS40MjhhLjQyOC40MjggMCAwIDAgMCAuODU1aDE1LjEydjE1LjEyMmEuNDI4LjQyOCAwIDAgMCAuODU1IDBWMTcuNDAzdjBoMTUuMTIyYS40MjguNDI4IDAgMCAwIDAtLjg1NXoiLz48L2c+PC9nPjwvc3ZnPg=="/>
                            </button>
                            <div className="self-checkout-variation">
                                <button className="btn btn-primary h-60" onClick={this.props.getVariationProductData ? this.props.getVariationProductData.Type 
                                    !== 'variable' ? this.props.addSimpleProducttoCart : this.props.addVariationProductToCart : null}>                                                                  
                                    {LocalizedLanguage.addToCart} {this.props.price}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )                                
    }
}
export default SelfCheckoutVariatonPopup;