import React from 'react';
import Language from '../../_components/Language';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { LoadingModal } from '../../_components/LoadingModal'

export const CheckoutCustomer = (props) => {
    const { submitted, loading } = props;
    const isDemoUser = localStorage.getItem('demoUser')
    // console.log("submitted", submitted, "loading", loading)
    return (
        // <div className="modal-dialog">
        // <div className="personal_info">
        //     <div className="overflowscroll" id="scroll_mdl_body">
        // card-activity-timeline
        <div className={window.location.pathname == "/checkout" ? "panel panel-default panel-flex panel-flex-for-customer forCheckout" : "forCustomer panel panel-default panel-flex no-border card-customer-checkout-form"}>
            {props.submitted == true || props.loading == false ? <LoadingModal /> : null}
            {/* <div className= {window.location.pathname == "/checkout" ? "panel-body center-center overflowscroll" : style={{height: 350}} "panel-body center-center overflow-unset card-customer-checkout-form"} > */}
            <div className={window.location.pathname == "/checkout" ? 'panel-body overflowscroll card-activity-form' : 'panel-body overflow-auto '} >
                {/* <div className="panel-body center-center overflowscroll card-activity-form"> */}
                <form className="form-addon mx-auto" style={{ maxWidth: "400px" }}>
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.FirstName ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.firstName}
                            </div>
                            <input autoComplete='off' pattern="[A-Za-z]{15}" className="form-control" value={props.FirstName} id="FirstName" name="FirstName" type="text" placeholder={LocalizedLanguage.firstName} onChange={props.onChange} />
                        </div>
                        {props.nameValid !==''  &&    //'name is Invalid'
                            <div className="help-block" style={{ color: '#a94442' }}>{props.nameValid}</div>
                        }
                        {/* {props.submitted && !props.FirstName &&
                                <div className="help-block">First Name is required</div>
                            } */}
                        {/* </div> */}
                    </div>
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.LastName ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.lastName}
                            </div>
                            <input autoComplete='off' className="form-control" value={props.LastName} pattern="[A-Za-z]{15}" id="LastName" name="LastName" type="text" placeholder={LocalizedLanguage.lastName} onChange={props.onChange} />
                        </div>
                        {props.lastValid !==''  &&    //'lastname is Invalid'
                            <div className="help-block" style={{ color: '#a94442' }}>{props.lastValid}</div>
                        }
                        {/* {props.submitted && !props.LastName &&
                                <div className="help-block">Last Name is required</div>
                            } */}
                        {/* </div> */}
                    </div>
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.Email ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.email}
                            </div>
                            <input autoComplete='off' className="form-control" value={props.Email} id="Email" placeholder={LocalizedLanguage.email} name="Email" type="text"  onChange={props.onChange} />
                            {/* disabled={!props.Cust_ID || props.Cust_ID == '' ? false : true} */}
                        </div>
                        {/* {props.submitted && !props.Email &&
                            <div className="help-block">{LocalizedLanguage.emailRequire}</div>
                        } */}
                        {props.emailValid !==''  &&    //'email is Invalid'
                            <div className="help-block" style={{ color: '#a94442' }}>{props.emailValid}</div>
                        }
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.PhoneNumber ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.phoneNumber}
                            </div>
                            <input autoComplete='off' maxLength={13} className="form-control" value={props.PhoneNumber} id="PhoneNumber" placeholder={LocalizedLanguage.phoneNumber} name="PhoneNumber" type="text" onChange={props.onChange} />
                        </div>
                        {/* {props.submitted && !props.PhoneNumber &&
                                <div className="help-block">Contact Number is required</div>
                            } */}
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.Street_Address ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.addressLineOne}&nbsp;
                                                </div>
                            <input autoComplete='off' className="form-control" value={props.Street_Address} id="Street_Address" name="Street_Address" placeholder={LocalizedLanguage.addressLineOne} type="text" onChange={props.onChange} />
                        </div>
                        {/* {props.submitted && !props.user_address &&
                                <div className="help-block">Address is required</div>
                            } */}
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.Street_Address2 ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.addressLineTwo}&nbsp;
                                  </div>
                            <input autoComplete='off' className="form-control" name="Street_Address2" value={props.Street_Address2} placeholder={LocalizedLanguage.addressLineTwo} type="text" onChange={props.onChange} />
                        </div>
                        {/* {props.submitted && !props.cust_street_address &&
                                <div className="help-block">Address is required</div>
                            } */}
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.country_name ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.country}&nbsp;
                                  </div>
                            <select className="form-control select-dropdown-icon" name="country"
                                // placeholder="Select"
                                //  id={this.props.id}
                                value={props.country_name ? props.country_name.replace(/[^a-zA-Z]/g, ' ') : ''}
                                onChange={props.onChangeList}
                            >
                                <option value=''>{LocalizedLanguage.select}</option>
                                {props.getCountryList && props.getCountryList.map((item, index) => {
                                    //  console.log("item",props.country_name);
                                    return (
                                        <option key={index} value={item.Code}>
                                            {item.Name.replace(/[^a-zA-Z]/g, ' ')}
                                        </option>
                                    )
                                })}
                                {/* <option value="Stading" >Stading</option>
                                         <option value="Shitting">Shitting</option>
                                        <option value="1 Year or 6 Month below">1 Year or 6 Month below</option> */}
                            </select>
                        </div>
                        {/* {props.submitted && !props.cust_street_address &&
                                <div className="help-block">Address is required</div>
                            } */}
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.cust_street_address ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.state}&nbsp;
                                  </div>
                            <select className="form-control select-dropdown-icon" name="state" value={props.state_name ? props.state_name : ''}
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
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.city ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.city}&nbsp;&nbsp;
                                                 </div>
                            <input autoComplete='off' className="form-control" value={props.city} id="city" placeholder={LocalizedLanguage.city} name="city" type="text" onChange={props.onChange} />
                        </div>
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    <div className={'form-group' + (props.submitted && !props.Pincode ? ' has-error' : '')}>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.zipcode}
                            </div>
                            <input autoComplete='off' className="form-control" value={props.Pincode} id="Pincode" name="Pincode" placeholder={LocalizedLanguage.zipcode} type="text" onChange={props.onChange} />
                        </div>
                        {/* {props.custmerPin == 'not accept' &&
                            <div className="help-block" style={{ color: '#a94442' }}>{LocalizedLanguage.notAcceptZero}</div>
                        } */}
                    </div>
                    {/* </div> */}
                    {/* <div className="col-sm-12"> */}
                    {/* <div className={'form-group' + (submitted && !Notes ? ' has-error' : '')}> */}
                    <div className='form-group'>
                        <div className="input-group">
                            <div className="input-group-addon">
                                {LocalizedLanguage.note}
                            </div>
                            <textarea autoComplete='off' className="form-control" name="Notes" type="text" value={props.Notes} placeholder={LocalizedLanguage.note} onChange={props.onChange}>{props.Notes}</textarea>
                        </div>
                        {/* {submitted && !Notes &&
                                                <div className="help-block">Notes is required</div>
                                            } */}
                    </div>
                    {/* </div> */}
                </form>
            </div>
            {/* {window.location.pathname == '/checkout' ? */}
            <div className="panel-footer bg-white p-0 ">
                <button className="btn btn-block btn-primary total_checkout text-center" onClick={props.onClick}>
                    {props.Email && props.Cust_ID ? window.location.pathname == '/checkout' ? LocalizedLanguage.SaveUpdate : LocalizedLanguage.updateCustomer : LocalizedLanguage.createcustomer}
                </button>
            </div>
            {/* <div class="card-footer no-padding no-border" >
                    <button class="btn btn-primary btn-block h-70 round-top-corner" onClick={props.onClick}>
                        {props.Email && props.Cust_ID ? LocalizedLanguage.updateCustomer : LocalizedLanguage.createcustomer}
                    </button>
                </div> */}
        </div>
    )
}