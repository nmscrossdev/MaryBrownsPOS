import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { refundActions } from '../';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
class RefundViewSecond extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCustomerSection: false,
            isExtensionSection: false,
            extensionList: [],
            extHostUrl: '',
            extPageUrl: '',
            single_Order_list: (typeof localStorage.getItem("getorder") !== 'undefined') ? JSON.parse(localStorage.getItem("getorder")) : null,
        }
    }
    handleRefundExtClick = (type = null, data = null) => {
        if (type == 'customer-section') {
            this.setState({
                isCustomerSection: true,
                isExtensionSection: false,
                extHostUrl: '',
                extPageUrl: '',
            })
        } else if (type == 'extension-section') {
            if (data && data.Id) {
                this.setState({
                    isCustomerSection: false,
                    isExtensionSection: true,
                    extHostUrl: data.HostUrl,
                    extPageUrl: data.PageUrl
                })
            }
        }
    }
    backActiveExtension = (type = null) => {
        // if (type == 'customer-section') {
        this.setState({
            isCustomerSection: false,
            isExtensionSection: false,
            extHostUrl: '',
            extPageUrl: '',
        })
        // }
    }

    render() {
        const { single_Order_list, isCustomerSection, isExtensionSection, extPageUrl, extHostUrl } = this.state;
        var getorder = localStorage.getItem("getorder") && localStorage.getItem("getorder") !== 'undefined' ? JSON.parse(localStorage.getItem("getorder")) : null;

        var extList = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];

        var extentionUrl = ""
        if (extPageUrl && validator.isURL(extPageUrl)) {   //check PageUrl is full URL
            extentionUrl = extPageUrl;
        } else {
            extentionUrl = extPageUrl && extHostUrl ? extHostUrl + '/' + extPageUrl : '';
        }


        return (
            <div className="col-lg-7 col-md-7 col-sm-6 col-xs-12 pt-4 plr-8">
                {isCustomerSection === true ?
                    <div className="items preson_info panel panel-default panel-flex">
                        <div className="panel-heading bg-white">
                            <div className="panel-flex-box">
                                <div className="panel-flex-box-buttons" onClick={() => this.backActiveExtension('customer-section')}>
                                    <i className="icons8-extensions"></i>
                                </div>
                                <h4 className="panel--title">
                                    {LocalizedLanguage.customerInfo}
                                </h4>
                                <div className="panel-flex-box-buttons" >
                                    {/* <i className="icons8-restart"></i> */}
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-default panel-product-list overflowscroll border-default" id="UserInfo_refund">
                            <div className="singleName">
                                <h4 className="mt-0 mb-2">
                                    {(getorder.orderCustomerInfo != null) ? getorder.orderCustomerInfo.customer_name : "---"}
                                    <a className="edit-info" data-toggle="modal" href="#edit-info" onClick={() => this.props.EditCustomer()}> {(getorder.orderCustomerInfo != null) ? LocalizedLanguage.editInfo : null}</a>
                                </h4>
                            </div>
                            <div className="personal_info">
                                <strong className="lead_personal">{LocalizedLanguage.personalInfo}</strong>
                                <div className="mt-3 mb-3">
                                    <p className="clearfix">
                                        <span className="text-muted">{LocalizedLanguage.email}</span>
                                        <span className="text-danger"> {(getorder.orderCustomerInfo != null) ? getorder.orderCustomerInfo.customer_email : "---"} </span>

                                    </p>
                                    <p className="clearfix">
                                        <span className="text-muted">{LocalizedLanguage.address}</span>
                                        <span className="text-danger">{(getorder.orderCustomerInfo != null) ? getorder.orderCustomerInfo.customer_address : "---"}</span>
                                    </p>
                                    <p className="clearfix">
                                        <span className="text-muted">{LocalizedLanguage.phone}</span>
                                        <span className="text-danger"> {(getorder.orderCustomerInfo != null) ? getorder.orderCustomerInfo.customer_phone : "---"} </span>
                                    </p>
                                    <p className="clearfix">
                                        <span className="text-muted">{LocalizedLanguage.notes}</span>
                                        <span className="text-danger">{(getorder.orderCustomerInfo != null) ? getorder.orderCustomerInfo.customer_note : "---"}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="personal_info">
                                <strong className="lead_personal">{LocalizedLanguage.accountInfo}</strong>
                                <div className="mt-3 mb-3">
                                    {/* <p className="w-50-block text-center clearfix">
                                    <span className="text-muted w-100">Account Balance</span>
                                    <span className="text-danger w-100"> 0 </span>
                                </p> */}
                                    <p className="w-50-block text-center clearfix">
                                        <span className="text-muted w-100">{LocalizedLanguage.storeCreditTitle}</span>
                                        <span className="text-danger w-100"> {(getorder.orderCustomerInfo != null) ? getorder.orderCustomerInfo.store_credit : "---"} </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}

                {/* show extension iframe  */}
                {isExtensionSection == true ?
                    <div className="items preson_info panel panel-default panel-flex">
                        <div className="panel-heading bg-white">
                            <div className="panel-flex-box">
                                <div className="panel-flex-box-buttons" onClick={() => this.backActiveExtension('extension-section')}>
                                    <i className="icons8-extensions"></i>
                                </div>
                                <h4 className="panel--title">
                                    {'Oliver Apps'}
                                </h4>
                                <div className="panel-flex-box-buttons" >
                                 {/* <i className="icons8-restart"></i> */}
                             </div>
                            </div>
                        </div>

                        <iframe
                            width="100%"
                            height="450px"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            className="embed-responsive-item diamondSectionHeight"
                            // ref={(f) => this.ifr = f}
                            src={extentionUrl}
                            id="iframeViewSecond"
                        />
                    </div>
                    : null}

                {/* extenssions */}
                {isCustomerSection !== true && isExtensionSection !== true ?
                    <div className="panel panel-default panel-flex ">
                        <div className="panel-heading bg-white">
                            <h4 className="panel--title">
                                {LocalizedLanguage.oliverApps}
                            </h4>
                        </div>
                        <div className="panel-body">
                            <div className="extention-menus">
                                <div className="row">
                                    {/* {true_dimaond_field && true_dimaond_field.length > 0 && true_dimaond_field.map((Items, index) => { */}
                                    {/* return ( */}
                                    {/* ((Items.PluginId==0) || (Items.viewManagement && Items.viewManagement !== [] && Items.viewManagement.find(type => type.ViewSlug == 'Checkout'))) && //check for display the Automatic Apps extension only not apps  */}
                                    <div key={'index'} className="col-md-4 col-sm-6 col-xs-6" onClick={() => this.handleRefundExtClick('customer-section')} >
                                        <div className={'extension-box'}>
                                            <div className="extension-image scroll-hidden">
                                                {<img src="assets/img/Customers.svg" />}
                                            </div>
                                            <div className={'extension-title'}>
                                                {LocalizedLanguage.customers}
                                            </div>
                                        </div>
                                    </div>
                                    {/* ) */}
                                    {/* }) */}
                                    {/* } */}
                                </div>
                            </div>
                        </div>
                        {/* {showExtention && showExtention == "true" && extcount > 0 && */}
                        <div className="panel-heading bg-white  overflow-auto ">
                            <h4 className="panel--inner-title">
                                {LocalizedLanguage.automaticExtension}
                            </h4>
                            <div className="row">
                                {extList && extList.length > 0 && extList.map((ext, index) => {
                                    // {/* var x = false */}
                                    return (
                                        // ext.PluginId == 0 && //check for display the Automatic Apps extension only not apps  */}
                                        <div key={index}>
                                            {(ext.PluginId == 0 && ext.Name !== 'Contact Details' && ext.ShowAtCheckout === true) ||
                                                (ext.viewManagement && ext.viewManagement !== [] && ext.viewManagement.find(type => type.ViewSlug == 'Checkout')) ?
                                                <div className="col-sm-4" onClick={() => this.handleRefundExtClick('extension-section', ext)}>
                                                    <div className={ext.Name !== 'Contact Details' ? 'extension-box' : ''}>
                                                        <div className='extension-image'>
                                                            {ext.Name !== 'Contact Details' ? ext.logo && ext.logo !== ""
                                                                ? <img src={ext.logo}></img>
                                                                : <img src="assets/img/Questionsmark.svg" />
                                                                : ''
                                                            }
                                                        </div>
                                                        <div className={'extension-title'}>
                                                            {ext.Name}
                                                        </div>
                                                    </div>
                                                </div>
                                                : ''
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {/* } */}
                    </div>

                    : null}


            </div>


        )
    }
}
function mapStateToProps(state) {
    return {};
}
const connectedRefundViewSecond = connect(mapStateToProps)(RefundViewSecond);
export { connectedRefundViewSecond as RefundViewSecond };