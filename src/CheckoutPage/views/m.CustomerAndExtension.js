import React from 'react';

const CustomerAndExtension = (props) => {
    const { AndroidAndIOSLoader, CommonHeader, NavbarPage, activeTrueDiamond, activeExtentionFieldName, true_dimaond_field, active_true_diamond, LocalizedLanguage, customerData, checkoutList, customerAddress, HostUrl, Footer, Edit_Modal, paymentType, addPayment, layAwayOrder, iFrameLoader, ref } = props;
    var showExtention = localStorage.getItem("showExtention");
    console.log("showExtention", showExtention, typeof showExtention)
    return (

        <div>
            {iFrameLoader == true ? <AndroidAndIOSLoader /> : null}
            <CommonHeader {...props} />
            <NavbarPage  {...props} />
            <div className="appCapsule h-100 overflow-auto vh-100" style={{ paddingBottom: 143 }}>
                <div className="container-fluid pt-3">
                    {showExtention && showExtention == "true" ?
                        <select title={activeExtentionFieldName} id="drp-content-customer" onChange={activeTrueDiamond} className="b-0 w-100 no-outline selectpicker">
                            <option defaultValue="" className="selected" disabled={true}>{LocalizedLanguage.customerInfo}</option>
                            {true_dimaond_field && true_dimaond_field.length > 0 && true_dimaond_field.map((Items, index) => {
                                return (<option key={index} className={active_true_diamond == `true_${Items.Id}` ? 'selected' : ""} data-target={Items.Name == 'Contact Details' ? '#contact_details' : `#true_diamond`} value={Items.Name == 'Contact Details' ? "false" : `true_${Items.Id}`}>{Items.Name}</option>)
                            })}
                        </select>
                        :
                        <div>{LocalizedLanguage.customerInfo} </div>}
                    {active_true_diamond == 'false' ?
                        <div style={{ marginTop: 10 }}>
                            <h6 style={{ fontSize: 16, fontWeight: 'bold' }}>
                                {customerData ? customerData.FirstName : checkoutList ? checkoutList.FirstName : ''}{" "}{customerData ? customerData.LastName : checkoutList ? checkoutList.LastName : LocalizedLanguage.shortCustomerInfo}
                                {customerData || checkoutList ? <a className="edit-info" onClick={() => Edit_Modal(customerData ? customerData.UID : checkoutList.UID ? checkoutList.UID : checkoutList.WPId ? checkoutList.WPId : checkoutList.Id)}> <img src="mobileAssets/img/edit.png" style={{ width: 35, height: 35, padding: 10 }} /></a> : ""}
                            </h6>
                            <strong>{LocalizedLanguage.personalInfo}</strong>
                            <table style={{ fontSize: 16 }}>
                                <tbody>
                                    <tr>
                                        <th>{LocalizedLanguage.email}</th>
                                        <th style={{ width: 10 }}>:</th>
                                        <td>{customerData ? customerData.Email : checkoutList ? checkoutList.Email : ''}</td>
                                    </tr>
                                    <tr>
                                        <th>{LocalizedLanguage.addressOne}</th>
                                        <th style={{ width: 10 }}>:</th>
                                        <td>{customerAddress ? customerAddress.Address1 : checkoutList && checkoutList.StreetAddress ? checkoutList.StreetAddress : ''}</td>
                                    </tr>
                                    <tr>
                                        <th>{LocalizedLanguage.addressTwo}</th>
                                        <th style={{ width: 10 }}>:</th>
                                        <td>{customerAddress ? customerAddress.Address2 : checkoutList && checkoutList.StreetAddress2 ? checkoutList.StreetAddress2 : ''}</td>
                                    </tr>
                                    <tr>
                                        <th>{LocalizedLanguage.phone}</th>
                                        <th style={{ width: 10 }}>:</th>
                                        <td>{customerData ? customerData.PhoneNumber : checkoutList ? checkoutList.PhoneNumber ? checkoutList.PhoneNumber : checkoutList.Contact ? checkoutList.Contact : checkoutList.Phone : ''}</td>
                                    </tr>
                                    <tr>
                                        <th>{LocalizedLanguage.notes}</th>
                                        <th style={{ width: 10 }}>:</th>
                                        <td>{customerData ? customerData.Notes : checkoutList ? checkoutList.Notes ? checkoutList.Notes : checkoutList.notes : ''}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ marginTop: 10 }} >
                                <strong>{LocalizedLanguage.accountInfo}</strong>
                                <p style={{ fontSize: 16 }}>
                                    <span>{LocalizedLanguage.stroeCredit}</span>
                                    <span>{customerData ? customerData.StoreCredit : checkoutList ? checkoutList.StoreCredit ? checkoutList.StoreCredit : checkoutList.store_credit : '0'}</span>
                                </p>
                            </div>
                            <div className="row" style={{ marginTop: 10 }}>
                                {checkoutList ?
                                    <div className="col-sm-12">
                                        <button type="submit" className="btn btn-default btn-lg btn-block btn-style-02 bleftcolor-01" id="test3" name="payments-type-2" onClick={() => { layAwayOrder("lay_away"); paymentType('lay_away'); }}>{LocalizedLanguage.layAway}</button>
                                        {(checkoutList && checkoutList.StoreCredit !== '' && checkoutList.StoreCredit !== 0) ?
                                            <button type="submit" id="test4" value='store-credit' name="payments-type-2" onClick={() => { addPayment("store-credit", checkoutList ? checkoutList.StoreCredit : ''); paymentType('store-credit'); }} className="btn btn-default btn-lg btn-block btn-style-02 bleftcolor-01" >{LocalizedLanguage.storeCreditTitle}</button>
                                            : <button disabled style={{ borderLeftColor: '#bfbfbf' }} type="submit" className="btn btn-default btn-lg btn-block btn-style-02 bleftcolor-01">{LocalizedLanguage.storeCreditTitle}</button>
                                        }
                                    </div>
                                    :
                                    <div className="col-sm-12">
                                        <button style={{ borderLeftColor: '#bfbfbf' }} disabled type="submit" className="btn btn-default btn-lg btn-block btn-style-02 bleftcolor-01">{LocalizedLanguage.layAway}</button>
                                        <button disabled style={{ borderLeftColor: '#bfbfbf' }} type="submit" className="btn btn-default btn-lg btn-block btn-style-02 bleftcolor-01">{LocalizedLanguage.storeCreditTitle}</button>
                                    </div>}
                            </div>
                        </div>
                        :
                        <div className="row" id="true_diamond" style={{ marginTop: 10 }}>
                            <div className="col-sm-12">
                                {HostUrl !== '' ?
                                    <iframe
                                        width="100%"
                                        height="450px"
                                        sandbox="allow-scripts allow-same-origin allow-forms"
                                        className="embed-responsive-item diamondSectionHeight"
                                        ref={ref}
                                        src={HostUrl}
                                    /> : null}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Footer active="extansion" />
        </div>
    )
}

export default CustomerAndExtension;
