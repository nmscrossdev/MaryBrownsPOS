import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DiscountMsgPopup } from '../../../_components/DiscountMsgPopup';
import { AndroidAndIOSLoader } from '../../../_components/AndroidAndIOSLoader';
class MobileCreateProfile extends Component {
    render() {
        const { LocalizedLanguage, handleSubmit, handleChange, goBack, onCancel, nextEventHandler, getCountryAndStateName, editCountryToStateList, handleChangeList, onChangeStateList,
            loading, submitted, CustInfor, FirstName, Email, hasNexted, emailValid, PhoneNumber, Street_Address, Pincode, custmerPin, country_name, getCountryList, state_name,
            viewStateList, common_Msg, isEmailExist } = this.props;
        return (
            <div className="modal" id="createProfle" tabIndex="-1" role="dialog" aria-labelledby="profileWizard"
                aria-hidden="true">
                {loading == true && submitted == true ? <AndroidAndIOSLoader /> : ''}
                <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h5 className="modal-title fz-14" id="success">{LocalizedLanguage.createProfile}</h5>
                            <button type="button" className="close py-0 shadow-none outline-none" data-dismiss="modal" aria-label="Close" onClick={() => onCancel('Cancel')}>
                                <img src="../../assets/img/closenew.svg" width="23" alt="" />
                            </button>
                        </div>
                        <div className="modal-body pl-30 pr-30">
                            <form className="app-form">
                                {(CustInfor === "PrsnlInfo") ?
                                    <div>
                                        <div className="text-primary text-center mb-20 fz-12">
                                            <img className="img-fluid d-block mx-auto mb-1" src="assets/img/self-checkout/circle-user.svg" width="30" />
                                            {LocalizedLanguage.createProfile}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.name}</label>
                                            <input type="text" id="FirstName" value={FirstName} name="FirstName" className="form-control shadow-none" onChange={handleChange} placeholder="Enter Name" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.email}</label>
                                            <input type="Email" className="form-control shadow-none" id="Email" name="Email" placeholder="name@email.com" value={Email} onChange={handleChange} />
                                        {
                                            (hasNexted && !Email) ?
                                                // <div className="help-block" style={{ color: '#a94442' }}>{LocalizedLanguage.emailRequire}</div>
                                        <small className="form-text text-danger">{LocalizedLanguage.emailRequire}</small>
                                                : (emailValid == 'email is Invalid') ?
                                                    // <div className="help-block" style={{ color: '#a94442' }}>{emailValid}</div>
                                                    <small className="form-text text-primary">{emailValid}</small>
                                                    :
                                                    null
                                        }
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.PhoneNo}</label>
                                            <input type="tel" className="form-control shadow-none" placeholder="123-456-789" maxLength={13} id="PhoneNumber" name="PhoneNumber" value={PhoneNumber} onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <div className="profile-action">
                                                <button type="button" className="btn btn-light shadow-none text-dark" onClick={() => onCancel('Cancel')}>{LocalizedLanguage.cancel}</button>
                                                <button type="button" className="btn btn-success shadow-none ml-10" onClick={() => nextEventHandler('ShippingInfo')}>{LocalizedLanguage.nextStep}</button>
                                            </div>
                                        </div>
                                    </div>
                                    : (CustInfor === 'ShippingInfo') ?
                                        <div>
                                            <div className="text-primary text-center mb-20 fz-12">
                                                <img className="img-fluid d-block mx-auto mb-1" src="../../assets/img/self-checkout/place-maker.svg" width="30" />
                                    {LocalizedLanguage.shippinginformation}  
                                        </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.address}</label>
                                                <input type="text" className="form-control shadow-none" placeholder="10 Main St." id="Street_Address"
                                                    name="Street_Address" value={Street_Address} onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.zippostalcode}</label>
                                                <input type="text" className="form-control shadow-none" id="Pincode" name="Pincode"
                                                    onChange={handleChange} placeholder="010101" value={Pincode} />
                                                {/* {custmerPin == 'not accept' &&
                                                    <div className="help-block" style={{ color: '#a94442' }}>{LocalizedLanguage.notAcceptZero}</div>
                                                } */}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.country}</label>
                                                <select className="custom-select form-control shadow-none" name="country"
                                                    value={country_name ? country_name.replace(/[^a-zA-Z]/g, ' ') : ''} onChange={handleChangeList}>
                                                    <option value=''>{LocalizedLanguage.select}</option>
                                                    {getCountryList && getCountryList.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.Code}>
                                                                {item.Name.replace(/[^a-zA-Z]/g, ' ')}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="" className="fz-12 pl-2">{LocalizedLanguage.provinceState} </label>
                                                <select className="custom-select form-control shadow-none" name="state" value={state_name ? state_name.replace(/[^a-zA-Z]/g, ' ') : ''}
                                                    onChange={onChangeStateList}>
                                                    <option value="">{LocalizedLanguage.select}</option>
                                                    {viewStateList && viewStateList.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.Code} >
                                                                {country_name !== '' ? item.Name.replace(/[^a-zA-Z]/g, ' ') : ''}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <div className="profile-action">
                                                    <button type="button" className="btn btn-light shadow-none text-dark" onClick={() => onCancel('PrsnlInfo')}>{LocalizedLanguage.cancel}</button>
                                                    <button type="button" className="btn btn-success shadow-none ml-10" onClick={() => nextEventHandler('ConfirmInfo')}>{LocalizedLanguage.nextStep}</button>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="text-primary text-center mb-20 fz-12">
                                                <img className="img-fluid d-block mx-auto mb-1" src="assets/img/self-checkout/circle-user.svg" width="30" />
                                                Confirm Information
                                            </div>
                                            <div className="form-group-view form-group-view-center">
                                                <label htmlFor="">{LocalizedLanguage.name}</label>
                                                <p>{FirstName}</p>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="space-20"></div>
                                            <div>
                                                <div className="form-group-view form-group-view-halfwidth">
                                                    <label htmlFor="">{LocalizedLanguage.email}</label>
                                                    <p className="text-truncate">{Email}</p>
                                                    {isEmailExist && isEmailExist == true ?
                                                    <small id="emailHelp" className="form-text text-danger">{LocalizedLanguage.givenemailalreadyexists}</small>
                                                    :""}
                                                </div>
                                                <div className="form-group-view form-group-view-halfwidth">
                                                    <label htmlFor="">{LocalizedLanguage.PhoneNo}</label>
                                                    <p>{PhoneNumber}</p>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>

                                            <div className="space-20"></div>
                                            <div>
                                                <div className="form-group-view form-group-view-halfwidth">
                                                    <label htmlFor="">{LocalizedLanguage.address}</label>
                                                    <p>{Street_Address}</p>
                                                </div>
                                                <div className="form-group-view form-group-view-halfwidth">
                                                    <label htmlFor="">{LocalizedLanguage.zippostalcode}</label>
                                                    <p>{Pincode}</p>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="space-20"></div>
                                            <div>
                                                <div className="form-group-view form-group-view-halfwidth">
                                                    <label htmlFor="">{LocalizedLanguage.country}</label>
                                                    <p className="text-truncate">{country_name ? country_name.replace(/[^a-zA-Z]/g, ' ') : ''}</p>
                                                </div>
                                                <div className="form-group-view form-group-view-halfwidth">
                                                    <label htmlFor="">{LocalizedLanguage.provinceState}</label>
                                                    <p>{state_name ? state_name.replace(/[^a-zA-Z]/g, ' ') : ''}</p>
                                                </div>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="space-20"></div>
                                            <div className="form-group">
                                                <div className="profile-action">
                                                    <button type="button" className="btn btn-light shadow-none text-dark btn-first-child" onClick={() => onCancel('PrsnlInfo')}>{LocalizedLanguage.cancel}</button>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </form>
                        </div>
                        <div className="modal-footer no-padding overflow-hidden">
                            <button className="btn btn-primary shadow-none fz-12 btn-block rounded-0 h-40 h-50-pxi" onClick={() => handleSubmit('ConfirmInfo')}>{LocalizedLanguage.saveprofile}</button>
                        </div>
                    </div>
                </div>
                <DiscountMsgPopup msg_text={common_Msg} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    // const { customer_save_data } = state;
    return {
        // customer_save_data: customer_save_data.items,
    };
}
const connectedMobileCreateProfile = connect(mapStateToProps)(MobileCreateProfile);
export { connectedMobileCreateProfile as MobileCreateProfile };