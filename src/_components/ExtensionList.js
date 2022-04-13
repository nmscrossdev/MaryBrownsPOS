import React from 'react';

export const ExtensionList = (props) => {
    const { type, showExtensionIframe } = props
    var viewType = type ? type : ''// type has value to check for where to show extension e.g. on checkout complete, activity, customer view or payment types etc....
    var ext_logo = ''
    var ext_default_logo = '../assets/images/faded-logo.svg'
    var isUrlImg = false
    var ext_Payment_Fields = localStorage.getItem('GET_EXTENTION_FIELD') ? JSON.parse(localStorage.getItem('GET_EXTENTION_FIELD')) : [];
    var extension_views_field = []
    if (ext_Payment_Fields && ext_Payment_Fields !== []) {
        extension_views_field = ext_Payment_Fields && ext_Payment_Fields.length>0 && ext_Payment_Fields.filter(item => item.PluginId > 0)
        return extension_views_field && extension_views_field !== [] &&
            extension_views_field.map((ext, index) => {
                return ext.viewManagement && ext.viewManagement !== [] && ext.viewManagement.map((type, ind) => {
                    isUrlImg = ext.logo ? (ext.logo.match(/\.(jpeg|jpg|gif|png|svg|TIFF|PSD|AI)$/) != null) : false // check if logo url is full imge url
                    ext_logo = ext.logo && isUrlImg ? ext.logo : ext_default_logo // set default ulogo in case logo not exist
                    return type && type.ViewSlug == viewType ?
                        <div key = {ind} className="product-tile pointer" 
                        style = {viewType == 'Activity View' || viewType == 'Customer View'  ? {maxWidth: '118px'} : {}}
                         id={ext.Id} onClick={() => showExtensionIframe(ext.Id)}>
                            <input type="radio" className="card-checked" name="ActivityApps" />
                            <div className="card">
                                <div className="card-body padding-6">
                                    <div className="card-image">
                                        <img src={ext_logo} alt="Extension" />
                                    </div>
                                </div>
                                <div className="card-footer padding-6">
                                    <div className="card-text text-truncate text-center">
                                        {ext.Name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ''
                })
            })
    }
    else{
        return null
    }

}