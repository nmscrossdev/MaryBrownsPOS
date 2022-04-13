import React from 'react';

const CustomerEdit = (props) => {
    const { Header, LocalizedLanguage } = props;
    console.log('--m.customeEdit (props) : ',props )

    return (
        <div>
            <Header {...props} />
            <div className="appCapsule vh-100 overflow-auto" style={{ paddingBottom: 80 }}>
                <div className="container-fluid pt-3">
                    <div className="row">
                        <div className="col-sm-12">
                        <form className="form-addon-medium" autoComplete="on">
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0">{LocalizedLanguage.firstName}</span>
                                    </div>
                                    <input value={props.FirstName} id="FirstName" name="FirstName" type="text" placeholder={LocalizedLanguage.firstName} onChange={props.onChange} className="form-control border-radius-lg shadow-none" aria-label="Username" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0">{LocalizedLanguage.lastName}</span>
                                    </div>
                                    <input value={props.LastName} id="LastName" name="LastName" type="text" placeholder={LocalizedLanguage.lastName} onChange={props.onChange} className="form-control border-radius-lg shadow-none" aria-label="Username" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0">{LocalizedLanguage.email}</span>
                                    </div>
                                    <input value={props.Email} id="Email" placeholder={LocalizedLanguage.email} name="Email" type="text"  onChange={props.onChange} className="form-control border-radius-lg shadow-none" aria-label="Email" aria-describedby="addon-wrapping" />
                                    {/* disabled={!props.Cust_ID || props.Cust_ID == '' ? false : true} */}

                                </div>
                                {props.submitted && !props.Email &&
                                    <div className="help-block">{LocalizedLanguage.emailRequire}</div>
                                }
                                {/* {props.emailValid == 'email is Invalid' &&
                                    <div className="help-block" style={{ color: '#a94442' }}>{props.emailValid}</div>
                                } */}
                                 {  props.emailValid !== ""  && 
                                    <div className="help-block" style={{ color: '#a94442' }}>{props.emailValid}</div>
                                   }

                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                    {/* {LocalizedLanguage.phoneNumber} */}
                                        <span className="input-group-text border-right-0">Phone <br/> Number </span>
                                    </div>
                                    <input mmaxLength={13} value={props.PhoneNumber} id="PhoneNumber" placeholder={LocalizedLanguage.phoneNumber} name="PhoneNumber" type="text" onChange={props.onChange} className="form-control border-radius-lg shadow-none" aria-label="Phone Number" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                    {/* {LocalizedLanguage.addressLineOne} */}
                                        <span className="input-group-text border-right-0 text-left">Address<br/>Line 1</span>
                                    </div>
                                    <input value={props.Street_Address} id="Street_Address" name="Street_Address" placeholder={LocalizedLanguage.addressLineOne} type="text" onChange={props.onChange} className="form-control border-radius-lg shadow-none h-70-pxi" aria-label="address" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                    {/* {LocalizedLanguage.addressLineTwo} */}
                                        <span className="input-group-text border-right-0 text-left">Address<br/> Line 2</span>
                                    </div>
                                    <input name="Street_Address2" id="Street_Address2" value={props.Street_Address2} placeholder={LocalizedLanguage.addressLineTwo} type="text" onChange={props.onChange} className="form-control border-radius-lg shadow-none h-70-pxi" aria-label="address" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0">{LocalizedLanguage.country}</span>
                                    </div>
                                    <select aria-label="country" aria-describedby="addon-wrapping" className="form-control border-radius-lg shadow-none" name="country"
                                        value={props.country_name ? props.country_name.replace(/[^a-zA-Z]/g, ' ') : ''}
                                        onChange={props.onChangeList}
                                    >
                                        <option value=''>{LocalizedLanguage.select}</option>
                                        {props.getCountryList && props.getCountryList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.Code}>
                                                    {item.Name.replace(/[^a-zA-Z]/g, ' ')}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0">{LocalizedLanguage.state}</span>
                                    </div>
                                    <select className="form-control border-radius-lg shadow-none" aria-label="state" aria-describedby="addon-wrapping" name="state" value={props.state_name ? props.state_name.replace(/[^a-zA-Z]/g, ' ') : ''}
                                        onChange={props.onChangeStateList}>
                                        <option value="">{LocalizedLanguage.select}</option>
                                        {props.getState && props.getState.map((item, index) => {
                                            return (
                                                <option key={index} value={item.Code} >
                                                    {props.country_name !== '' ? item.Name.replace(/[^a-zA-Z]/g, ' ') : ''}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0"> {LocalizedLanguage.city}</span>
                                    </div>
                                    <input value={props.city} id="city" placeholder={LocalizedLanguage.city} name="city" type="text" onChange={props.onChange} className="form-control border-radius-lg shadow-none" aria-label="city" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap  mb-3">
                                    <div className="input-group-prepend">
                                    {/* {LocalizedLanguage.zipcode} */}
                                        <span className="input-group-text border-right-0">ZIP/Postal <br/>Code</span>
                                    </div>
                                    <input value={props.Pincode} id="Pincode" name="Pincode" placeholder={LocalizedLanguage.zipcode} type="text" onChange={props.onChange} className="form-control border-radius-lg shadow-none" aria-label="zip" aria-describedby="addon-wrapping" />
                                </div>
                                <div className="input-group flex-nowrap mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text border-right-0">{LocalizedLanguage.note}</span>
                                    </div>
                                    <textarea name="Notes" type="text" value={props.Notes} placeholder={LocalizedLanguage.note} onChange={props.onChange} className="form-control border-radius-lg shadow-none h-101-pxi" aria-label="note" aria-describedby="addon-wrapping">{props.Notes}</textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
            <div className="appBottomMenu appBottomCustomerButton">
                <button onClick={props.onClick} className="btn shadow-none btn-block btn-primary h-100 rounded-0 text-uppercase">{LocalizedLanguage.saveAndClose}</button>
            </div>
        </div>
    )
}

export default CustomerEdit;