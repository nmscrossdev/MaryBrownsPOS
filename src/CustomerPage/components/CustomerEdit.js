import React from 'react';
import Language from '../../_components/Language';
import LocalizedLanguage from '../../settings/LocalizedLanguage';

export const CustomerViewEdit = (props) => {
    const { createCustomer } = props;
    return (
        
        // <div className="modal fade popUpMid" id="createcustomer" role="dialog">
        <div className="modal-dialog modal-sm modal-center-block">
            <div className="modal-content">
                <div className="modal-header header-modal">
                    {/* <h1>{LocalizedLanguage.createcustomer}</h1> */}
                    <h1 className="modal-title text-center">{props && props.Cust_ID==""?LocalizedLanguage.createcustomer:LocalizedLanguage.editInfo} </h1>
                    <div className="data-dismiss" data-dismiss="modal">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={props.onClick1}  >
                            <img src="assets/img/Close.svg" />
                        </button>
                    </div>
                </div>
                <div className="modal-body popScroll" id="scroll_mdl_body">
                    <div className="overflowscroll">
                        <form className="form-addon" autoComplete="off">
                            <div className={'form-group' + (props.submitted && !props.FirstName ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.firstName}</div>
                                    <input pattern="[A-Za-z]{15}"  autoComplete='off' className="form-control" value={props.FirstName} id="FirstName" name="FirstName" type="text" placeholder={LocalizedLanguage.firstName} onChange={props.onChange} />
                                </div>
                                {  props.nameValid !== ""  && //props.nameValid == 'name is Invalid' &&
                                    <div className="help-block" style={{ color: '#a94442' }}>{props.nameValid}</div>
                                   }
                            </div>
                            <div className={'form-group' + (props.submitted && !props.lastName ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.lastName}</div>
                                    <input pattern="[A-Za-z]{15}" autoComplete='off'  className="form-control" value={props.LastName} id="LastName" name="LastName" type="text" placeholder={LocalizedLanguage.lastName} onChange={props.onChange} />
                                </div>
                                {  props.lastValid !== ""  && //props.lastValid == 'last name is Invalid' &&
                                    <div className="help-block" style={{ color: '#a94442' }}>{props.lastValid}</div>
                                   }
                            </div>
                            <div className={'form-group' + (props.submitted && !props.Email ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.email}</div>
                                    <input  autoComplete='off' className="form-control" value={props.Email} id="Email" placeholder= {LocalizedLanguage.email}  name="Email" type="text"   onChange={props.onChange}/>

                                </div>                                
                                {  props.emailValid !== ""  && //props.emailValid == 'email is Invalid' &&
                                    <div className="help-block" style={{ color: '#a94442' }}>{props.emailValid}</div>
                                   }
                            </div>
                            <div className={'form-group' + (props.submitted && !props.PhoneNumber ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.phoneNumber}</div>
                                    <input autoComplete='off' maxLength={13} className="form-control" value={props.PhoneNumber} id="PhoneNumber" placeholder={LocalizedLanguage.phoneNumber} name="PhoneNumber" type="text" onChange={props.onChange} />
                                </div>
                                {/* {  props.isContactValid !== true  &&
                                    <div className="help-block" style={{ color: '#a94442' }}>{'Invalid mobile number'}</div>
                                   } */}
                            </div>
                            <div className={'form-group' + (props.submitted && !props.Street_Address ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.addressLineOne}&nbsp;</div>
                                    <input  autoComplete='off' className="form-control" value={props.Street_Address} id="Street_Address" name="Street_Address" placeholder={LocalizedLanguage.addressLineOne} type="text" onChange={props.onChange} />
                                </div>
                            </div>
                            <div className={'form-group' + (props.submitted && !props.Street_Address2 ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.addressLineTwo}&nbsp;</div>
                                    <input autoComplete='off' className="form-control" name="Street_Address2" value={props.Street_Address2} placeholder={LocalizedLanguage.addressLineTwo} type="text" onChange={props.onChange} />
                                </div>
                            </div>
                            <div className={'form-group' + (props.submitted && !props.country_name ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.country}&nbsp;</div>
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
                                              )})} 
                                             {/* <option value="Stading" >Stading</option>
                                             <option value="Shitting">Shitting</option>
                                            <option value="1 Year or 6 Month below">1 Year or 6 Month below</option> */}
                                        </select>  
                                </div>
                            </div>
                            <div className={'form-group' + (props.submitted && !props.cust_street_address ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.state}&nbsp;</div>
                                      <select className="form-control select-dropdown-icon" name="state" value={props.state_name ? props.state_name:''}
                                          onChange={props.onChangeStateList}> 
                                           <option value="">{LocalizedLanguage.select}</option>         
                                             {props.getState && props.getState.map((item, index) =>
                                             {
                                                return ( 
                                                <option key={index} value={item.Code} >
                                               {props.country_name !== ''?item.Name.replace(/[^a-zA-Z]/g, ' '):''}
                                                 </option>
                                               )})} 
                                           </select>   
                                </div>
                            </div>
                            <div className={'form-group' + (props.submitted && !props.city ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.city}&nbsp;&nbsp;</div>
                                    <input autoComplete='off' className="form-control" value={props.city} id="city" placeholder={LocalizedLanguage.city} name="city" type="text" onChange={props.onChange} />
                                </div>
                            </div>
                            <div className={'form-group' + (props.submitted && !props.Pincode ? ' has-error' : '')}>
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.zipcode}</div>
                                    <input autoComplete='off' className="form-control" value={props.Pincode} id="Pincode" name="Pincode" placeholder={LocalizedLanguage.zipcode} type="text" onChange={props.onChange} />
                                </div>
                                {/* {props.custmerPin == 'not accept' &&
                                    <div className="help-block" style={{ color:'#a94442' }}>{LocalizedLanguage.notAcceptZero}</div>
                                } */}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-addon">{LocalizedLanguage.note}</div>
                                    <textarea autoComplete='off' className="form-control" name="Notes" type="text" value={props.Notes} placeholder={LocalizedLanguage.note} onChange={props.onChange}>{props.Notes}</textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="modal-footer no-padding bt-0">
                    <button type="button" onClick={props.onClick} className="btn btn-primary btn-block h-70 btn-text-unset">
                        {  props.Email && props.Cust_ID ? LocalizedLanguage.SaveUpdate :LocalizedLanguage.createcustomer} 
                    </button>
                </div>
            </div>
        </div>
        // </div>
    )
}