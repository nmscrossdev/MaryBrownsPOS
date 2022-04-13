import React from 'react';

const TaxRateListView = (props) => {
    const { closePopup, LocalizedLanguage, AndroidAndIOSLoader, handleChange, onSubmit, taxlist, tax_items, isloading } = props;
    return (
        <div>
            {isloading == true ? <AndroidAndIOSLoader /> : ""}
            <div className="appHeader">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-4">
                            <div className="appHeaderBack">
                                <img onClick={() => closePopup()} src="mobileAssets/img/back.svg" className="w-30" alt="" />
                            </div>
                        </div>
                        <div className="col-6">
                            {LocalizedLanguage.selectTax}
                        </div>
                    </div>
                </div>
            </div>
            {/* table table-striped mb-0 table-verticle-middle table-customer */}
            <div className="appCapsule h-100 overflow-auto vh-100" style={{ paddingBottom: 80 }}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <table className="table table-striped mb-0 table-verticle-middle table-customer" style={{ fontSize: 14 }}>
                                <thead>
                                    <tr>
                                        <th>{LocalizedLanguage.taxName}</th>
                                        <th>{LocalizedLanguage.taxRate}</th>
                                        <th>{LocalizedLanguage.country}</th>
                                        <th>{LocalizedLanguage.province}</th>
                                        <th>Check</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taxlist && taxlist.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.TaxName}</td>
                                                <td>{item.TaxRate}</td>
                                                <td>{item.Country}</td>
                                                <td>{item.State}</td>
                                                <td>
                                                    <div className="appRadioCheckbox">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" id={item.TaxId} data-id={item.TaxId} data-state={item.State} data-country={item.Country} data-name={item.TaxName} data-tax-class={item.TaxClass} name={`tax_${item.TaxId}`} value={item.TaxRate} onChange={handleChange} checked={tax_items.length > 0 && tax_items.find(items => items.TaxId == item.TaxId ? items.check_is == true ? 'checked' : '' : '')} className="custom-control-input" />
                                                            <label style={{ position: 'unset' }} className="custom-control-label" htmlFor={item.TaxId}></label>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="appBottomMenu appBottomCustomerButton" onClick={onSubmit}>
                <button className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.capitalSaveUpdate}</button>
            </div>
        </div>
    )
}
export default TaxRateListView;