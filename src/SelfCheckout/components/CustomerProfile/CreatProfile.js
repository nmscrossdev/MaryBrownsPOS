import React from 'react';
import { connect } from 'react-redux';
import LocalizedLanguage from '../../../settings/LocalizedLanguage';
import { history } from '../../../_helpers';
import { get_UDid } from '../../../ALL_localstorage'
import { customerActions } from '../../../CustomerPage/actions/customer.action';
import { LoadingModal, CommonMsgModal, DiscountMsgPopup } from '../../../_components';
import ActiveUser from '../../../settings/ActiveUser';
import { MobileCreateProfile } from '../SelfMobileView/mCreateProfile'
import { isMobileOnly, isIOS } from "react-device-detect";
import { LanguageVariant } from 'typescript';

class CreateProfile extends React.Component {
    constructor(props) {
        var UID = get_UDid('UDID');
        super(props);           
        this.state = {
            isDisable : false,
            CustInfor : 'PrsnlInfo',
            viewStateList : '',
            hasNexted : false,
            submitted : false,
            active : history.location.state ? 0 : '',
            activeFilter : false,
            set_active_index : history.location.state ? 0 : '',
            UDID : UID,
            Cust_ID : '',
            user_store_credit : '',
            pageOfItems : [],
            search : '',
            backUrl : history.location.state,
            emailValid : false,
            firstNameValid:true,
            loading : false,
            isContactValid : true,
            Pincode: '',
            ID : '',
            FirstName : '',
            LastName : '',
            Email : '',
            PhoneNumber : '',
            Notes : '',
            StoreCredit : '',
            AccountBalance : '',
            Details : '',
            onClick : '',
            singleStatus : true,
            custmerPin : '',
            getCountryList: localStorage.getItem('countrylist') !== null ? typeof (localStorage.getItem('countrylist')) !== undefined ? localStorage.getItem('countrylist') !== 'undefined' ?
            Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('countrylist')) : '' : '' : '' : '',
            getStateList: localStorage.getItem('statelist') !== null ? typeof (localStorage.getItem('statelist')) !== undefined ? localStorage.getItem('statelist') !== 'undefined' ?
            Array.isArray(JSON.parse(localStorage.getItem('statelist'))) === true ? JSON.parse(localStorage.getItem('statelist')) : '' : '' : '' : '',
            state_name : '',
            country_name: '',
            Street_Address: '',
            Street_Address2: '',
            popup_status: false,
            display_status: false,
            updateCustomer: false,
            create: '',
            filter_dataStatus: false,
            common_Msg: '',
            stateName: '',
            activeCreateEditDiv: false,
            ActiveAddToSale: false,
            ActiveAddToSaleEmail: "",
            city: "",
            customerDeleteActive: false,
            isEmailExist: false
        };  
        this.NextEventHandler = this.NextEventHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.OnCancel = this.OnCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeList = this.handleChangeList.bind(this);
        this.onChangeStateList = this.onChangeStateList.bind(this); 
    }
  
    handleSubmit()
    {        
        if(this.state.CustInfor === 'ConfirmInfo' ){
            this.setState({submitted : true, loading: true});
            const { UDID,
                Street_Address, city, PhoneNumber, FirstName, emailValid,firstNameValid,isContactValid,
                LastName, Pincode, Notes, Email, Street_Address2, country_name, state_name,
            } = this.state;
            if (Email && Email !== "" && emailValid == '' && firstNameValid==true && isContactValid==true) {
                const save = {
                    WPId: "",
                    FirstName: FirstName,
                    LastName: '',
                    Contact: PhoneNumber,
                    startAmount: 0,
                    Email: Email,
                    udid: UDID,
                    notes: '',
                    StreetAddress: Street_Address,
                    Pincode: Pincode,
                    City: city,
                    Country: country_name,
                    State: state_name,
                    StreetAddress2: '',
                }
                this.props.dispatch(customerActions.save(save, 'create', this.state.backUrl));
            }     
        }
        else{
            this.setState({CustInfor : 'PrsnlInfo'});
        }       
    }

    handleChange(e) {        
         var emailValid = this.state.emailValid;
         var custmerPin = this.state.custmerPin;
         var isContactValid = this.state.isContactValid;
         var firstNameValid=this.state.firstNameValid;
         const { name, value } = e.target;
         var pin;
         switch (name) {
            case 'FirstName':
                var regExp = /^[A-zÀ-ž\s]*$/
                firstNameValid = regExp.test(value);
                firstNameValid==true ? this.setState({ firstNameValid: true,FirstName:value }) : this.setState({ firstNameValid: false });
                break;
            case 'Email':
                 emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                 emailValid ? this.setState({ emailValid: '' }) : this.setState({ emailValid: LocalizedLanguage.emailErr });
                 break;
            case 'Pincode':
                 custmerPin = value[0];
                 pin = value.match(/^([1-9]|10)$/)
                 break;
             case 'PhoneNumber':  
             var regExp =/^[0-9\b]+$/    
                var isvalidcontact = value==""?true:regExp.test(value);             
                isvalidcontact  && isvalidcontact !=null? this.setState({ isContactValid: true,PhoneNumber:value }) :  this.setState({ isContactValid:false});              
                 break;
             default:
                 break;
         }
        //  if (custmerPin && custmerPin < 1) {
        //      this.setState({ custmerPin: 'not accept' })
        //  } else 
         if (pin || pin == '') {
             this.setState({ custmerPin: '' })
         } else if (custmerPin == null || custmerPin == ' ') {
             this.setState({ custmerPin: '' })
         }
         this.setState({ [name]: value });
    }

    componentWillReceiveProps(nextProp) {
        var CUSTOMER_ID = sessionStorage.getItem("CUSTOMER_ID");
        // console.log("customer_id", CUSTOMER_ID)
        // console.log("componentWillReceiveProps", nextProp,this.props)
        // ------Response when save customer and customer already exist----------------------------
        if (nextProp.customer_save_data && (nextProp.customer_save_data.is_success == true)) { 
            if (nextProp.customer_save_data !== '' && nextProp.customer_save_data) {
                var data = nextProp.customer_save_data !== '' && nextProp.customer_save_data
                this.setState({ create: '' , loading : false})
                this.goBack(data)
            }
        }    
        else if( nextProp.customer_save_data && nextProp.customer_save_data.is_success == false)
        {
            this.setState({ common_Msg : LocalizedLanguage.alreadyExistEmailMsg, loading: false, submitted: false, isEmailExist: true});
            // $('#no_discount').modal('show')
        }
    }

    goBack(cutomer_data) {
        var single_cutomer_list = this.props.customer_save_data && this.props.customer_save_data !== 'undefined' && this.props.customer_save_data.content && this.props.customer_save_data.content.Email ?
            this.props.customer_save_data.content : cutomer_data.content && cutomer_data.content.Email ? cutomer_data.content : cutomer_data.content.customerDetails
        var content = single_cutomer_list
        var data = {
            content
        }               
        if (this.props.customer_save_data !== null && this.props.customer_save_data !== 'undefined' && this.props.customer_save_data) {
            if (parseInt(this.props.customer_save_data.content.WPId) == parseInt(single_cutomer_list.UID)) {
                var content = this.props.customer_save_data.content
                var data = {
                    content
                }
                localStorage.setItem('AdCusDetail', JSON.stringify(data))
            } else if (parseInt(this.props.customer_save_data.content.WPId) !== parseInt(single_cutomer_list.UID)) {
                localStorage.setItem('AdCusDetail', JSON.stringify(data))
            }
        } else {
            localStorage.setItem('AdCusDetail', JSON.stringify(data))
        }
        setTimeout(() => {
            this.OnCancel('Cancel')
        }, 500);
        
    }

    OnCancel(type)
    {
         if(type === 'Cancel'){
            $('#createProfle').modal("hide");
            $('createProfle').removeClass('show');
            this.setState({ hasNexted: false, CustInfor : 'PrsnlInfo' , FirstName:'', Email:'', PhoneNumber:'', isEmailExist: false, 
            Pincode:'', Street_Address: '', country_name: '', state_name: ''});          
         }
         else{
            this.setState({ CustInfor : type, isEmailExist: false });
         }
     }
  
    NextEventHandler(Item)
    {       
        this.setState({ hasNexted : true}); 
        if (this.state.Email && this.state.emailValid == ''  && this.state.firstNameValid==true && this.state.isContactValid==true) {
            this.setState({ CustInfor : Item});
        }
    }

    getCountryAndStateName(stateCode, countryCode) {
        var stat_name = ''
        var count_name = ''
        var count_code = ''
        var finalStatelist = []
        this.state.getCountryList && this.state.getCountryList.find(function (element) {
            if (element.Code == countryCode || element.Name.replace(/[^a-zA-Z]/g, ' ') == countryCode) {
                count_name = element
                count_code = element.Code
            }
        })
        this.state.selectedCountryName = count_name ? count_name.Name : countryCode;
        this.state.country_name = count_code
        this.setState({
            selectedCountryName: count_name ? count_name.Name : countryCode,
            country_name: count_code
        })
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Code === stateCode && count_code === element.Country) {
                stat_name = element
            } else if (element.Code === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && countryCode === element.Country) {
                stat_name = element
            } else if (element.Name === stateCode && count_code === element.Country) {
                stat_name = element
            }
        })
        this.state.state_name = stateCode;
        this.setState({
            state_name: stateCode,
            stateName: stat_name.Name ? stat_name.Name : ''
        })
    }

    EditCountryToStateList(country_name, state_name) {
        var count_code = '';
        var finalStatelist = [];
        this.state.getCountryList && this.state.getCountryList.find(function (element) {
            if (element.Code == country_name || element.Name.replace(/[^a-zA-Z]/g, ' ') == country_name) {
                count_code = element.Code
            }
        })
        this.state.getStateList && this.state.getStateList.find(function (element) {
            if (element.Country == count_code) {
                finalStatelist.push(element)
            } else if (element.Country == country_name) {
                finalStatelist.push(element)
            }
        })
        if (finalStatelist.length > 0) {
            this.setState({
                viewStateList: finalStatelist,
            })
        }
    }

    handleChangeList(e) {
        var finalStatelist = [];
        // console.log("Event",e.target.value)
        var statelist= localStorage.getItem('statelist') && typeof(localStorage.getItem('statelist')) !== undefined ? JSON.parse(localStorage.getItem('statelist')) : null
       
        statelist && statelist.find(function (element) {
            if (element.Country == e.target.value) {
                finalStatelist.push(element)
            }
        })
        this.setState({
            viewStateList: finalStatelist,
            country_name: e.target.value,
            state_name: '',
            stateName: ''
        })
    }

    onChangeStateList(e) {
        this.setState({
            state_name: e.target.value,
        })
    }
    
    render() {  
        return (  
            (ActiveUser.key.isSelfcheckout == true && isMobileOnly == true) ?
            <MobileCreateProfile {...this.props}
                {...this.state}
                LocalizedLanguage={LocalizedLanguage}
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                goBack={this.goBack}
                onCancel={this.OnCancel}
                nextEventHandler={this.NextEventHandler}
                getCountryAndStateName={this.getCountryAndStateName}
                editCountryToStateList={this.EditCountryToStateList}
                handleChangeList={this.handleChangeList}
                onChangeStateList={this.onChangeStateList}
            />
            :              
            <div>
                <div className="modal fade popUpMid" id="createProfle" role="dialog">
                    <div className="modal-dialog modal-center-block">
                    {this.state.loading == true && this.state.submitted == true ? <LoadingModal /> : ''}
                        <div className="modal-content">
                            <div className="modal-header header-modal justify-start">
                                <h1 className="h3-title">{LocalizedLanguage.createProfile}</h1>
                                <div className="data-dismiss" data-dismiss="modal" onClick={() => this.OnCancel('Cancel')}>
                                    <img src="../../assets/img/closenew.svg" alt=""/>
                                </div>
                            </div>
                            <div className="modal-body overflowscroll" style={{ height : 450}}>
                                <section className="wizard-section">
                                    <div className="form-wizard">
                                    {( this.state.CustInfor === "PrsnlInfo" ) ?
                                        <div className="wizard-fieldset show">
                                            <div className="wizard-fieldset-header">
                                                <img src="assets/img/self-checkout/circle-user.svg" alt=""/>
                                                <h5>{LocalizedLanguage.personalInformation}</h5>
                                            </div>
                                            <div className="form-addon">                                       
                                                <div className="form-group">
                                                        <div className="input-group">
                                                            <div className="input-group-addon">{LocalizedLanguage.name}</div>
                                                            <input type="text" className="form-control" id="FirstName" value={this.state.FirstName} name="FirstName" onChange={this.handleChange} placeholder="Enter Name" />
                                                           
                                                        </div>
                                                        {(this.state.firstNameValid ==false) ?
                                                            <div className="help-block" style={{ color: '#a94442' }}>{LocalizedLanguage.nameErr}</div>
                                                            :
                                                            null}
                                                    </div>
                                                <div className='form-group'>
                                                    <div className="input-group">
                                                        <div className="input-group-addon">{LocalizedLanguage.email}</div>
                                                        <input type="email" className="form-control empty-input" id="Email" name="Email" placeholder="name@email.com" 
                                                        value={this.state.Email} onChange={this.handleChange}/>
                                                    </div>                                            
                                                    {                                            
                                                        (this.state.hasNexted && !this.state.Email) ?
                                                            <div className="help-block" style={{ color: '#a94442' }}>{LocalizedLanguage.emailRequire}</div>
                                                        :(this.state.emailValid == 'email is Invalid') ?
                                                            <div className="help-block" style={{ color: '#a94442' }}>{this.state.emailValid}</div>
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                    <div className="input-group-addon">{LocalizedLanguage.PhoneNo}</div>
                                                        <input type="tel" className="form-control empty-input" maxLength={13} id="PhoneNumber" 
                                                        placeholder="123-456-789" name="PhoneNumber" value={this.state.PhoneNumber} onChange={this.handleChange}/>
                                                    </div>
                                                    {(this.state.isContactValid ==false) ?
                                                            <div className="help-block" style={{ color: '#a94442' }}>{LocalizedLanguage.PhoneErr}</div>
                                                            :
                                                            null}
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-4 col-xs-6">
                                                            <button className="btn btn-outline-secondary btn-block btn-capitalize font-sm border-default form-addon-button"
                                                                data-dismiss="modal"
                                                                onClick={() => this.OnCancel('Cancel')}>
                                                                {LocalizedLanguage.cancel}
                                                            </button>
                                                        </div>
                                                        <div className="col-sm-8 col-xs-6">
                                                            <button className="btn btn-success btn-block btn-capitalize font-sm form-wizard-next-btn form-addon-button" 
                                                            onClick={() => this.NextEventHandler('ShippingInfo') }>
                                                                {LocalizedLanguage.nextStep}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        ( this.state.CustInfor === 'ShippingInfo' ) ?
                                        <div className="wizard-fieldset show">
                                            <div className="wizard-fieldset-header">
                                                <img src="../../assets/img/self-checkout/place-maker.svg" alt=""/>
                                                <h5>{LocalizedLanguage.shippinginformation}</h5>
                                            </div>
                                            <div className="form-addon">
                                                <div className="form-group">
                                                    <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.addressOne}</div>
                                                        <input type="text" className="form-control empty-input" placeholder="10 main st." id="Street_Address"
                                                        name="Street_Address" value={this.state.Street_Address} onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                <div className="input-group-addon">{LocalizedLanguage.zippostalcode}</div>
                                                        <input type="text" className="form-control empty-input" id="Pincode" name="Pincode" 
                                                        onChange={this.handleChange} placeholder="010101" value={this.state.Pincode}/>
                                                    </div>
                                                    {/* {this.state.custmerPin == 'not accept' &&
                                                        <div className="help-block" style={{ color:'#a94442' }}>{LocalizedLanguage.notAcceptZero}</div>
                                                    } */}
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-6 col-xs-6">
                                                            <div className="input-group">
                                                                <div className="input-group-addon">{LocalizedLanguage.country}</div>
                                                                <select className="form-control empty-input" name="country"
                                                                    value={this.state.country_name ? this.state.country_name.replace(/[^a-zA-Z]/g, ' ') : ''} onChange={this.handleChangeList}>        
                                                                        <option value=''>{LocalizedLanguage.select}</option>
                                                                        {this.state.getCountryList && this.state.getCountryList.map((item, index) => {
                                                                            return ( 
                                                                            <option key={index} value={item.Code}>
                                                                                {item.Name.replace(/[^a-zA-Z]/g, ' ')}
                                                                            </option>                                          
                                                                        )})} 
                                                                </select>                                                                                          
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 col-xs-6">
                                                            <div className="input-group">
                                                                <div className="input-group-addon">{LocalizedLanguage.provState}</div>
                                                                <select className="form-control empty-input" name="state" value={this.state.state_name ? this.state.state_name.replace(/[^a-zA-Z]/g, ' '):''}
                                                                    onChange={this.onChangeStateList}> 
                                                                    <option value="">{LocalizedLanguage.select}</option>         
                                                                        {this.state.viewStateList && this.state.viewStateList.map((item, index) =>
                                                                        {
                                                                            return ( 
                                                                            <option key={index} value={item.Code} >
                                                                                {this.state.country_name !== ''? item.Name.replace(/[^a-zA-Z]/g, ' ') :''}
                                                                            </option>
                                                                        )})} 
                                                                </select>   
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-4 col-xs-6">
                                                            <button
                                                                className="btn btn-outline-secondary btn-block btn-capitalize font-sm border-default form-wizard-previous-btn form-addon-button"
                                                                onClick={() => this.OnCancel('PrsnlInfo')}>
                                                                {LocalizedLanguage.cancel}
                                                            </button>
                                                        </div>
                                                        <div className="col-sm-8 col-xs-6">
                                                            <button className="btn btn-success btn-block btn-capitalize font-sm form-wizard-next-btn form-addon-button" 
                                                            onClick={() => this.NextEventHandler('ConfirmInfo')}>
                                                                {LocalizedLanguage.nextStep}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>  
                                        :
                                        <div>
                                            <div className="wizard-fieldset show">
                                            <div className="wizard-fieldset-header">
                                                <img src="../../assets/img/Checked.svg" alt=""/>
                                                    <h5>{LocalizedLanguage.confirmyourProfile}</h5>
                                            </div>
                                            <div className="form-addon">
                                                <div className="form-group" >
                                                    <div className="input-group">
                                                        <div className="input-group-addon">{LocalizedLanguage.name}</div>
                                                        <input type="text" className="form-control" id="FirstName" name="FirstName" disabled={true}
                                                        placeholder="Enter Name" value={this.state.FirstName}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <div className="input-group-addon">{LocalizedLanguage.email}</div>
                                                        <input type="email" className="form-control" id="Email" placeholder="name@email.com"
                                                        disabled={true} value={this.state.isEmailExist && this.state.isEmailExist == true ?  '': this.state.Email}/>
                                                    </div>
                                                    <div>{this.state.isEmailExist && this.state.isEmailExist == true ?
                                                    <small id="emailHelp" className="form-text text-danger">{LocalizedLanguage.givenemailalreadyexists}</small>
                                                    :""}</div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <div className="input-group-addon">{LocalizedLanguage.PhoneNo}</div>
                                                        <input type="text" className="form-control empty-input" id="PhoneNumber" disabled="true"
                                                        placeholder="123-456-789" value={this.state.PhoneNumber}/>
                                                    </div>
                                                   
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <div className="input-group-addon">{LocalizedLanguage.addressOne}</div>
                                                        <input type="text" className="form-control empty-input" id="Street_Address" placeholder="10 main st."
                                                        disabled={true} value={this.state.Street_Address} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="input-group">
                                                        <div className="input-group-addon">{LocalizedLanguage.zippostalcode}</div>
                                                        <input type="text" className="form-control empty-input" id="PinCode" name="PinCode"
                                                        disabled={true} placeholder="010101" value={this.state.Pincode}/>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <div className="row">
                                                        <div className="col-sm-6 col-xs-6">
                                                            <div className="input-group">
                                                                <div className="input-group-addon">{LocalizedLanguage.country}</div>
                                                                <input type="text" className="form-control" placeholder="NA" name="country_name" id="country_name"
                                                                value={this.state.country_name ? this.state.country_name.replace(/[^a-zA-Z]/g, ' ') : ''}  disabled={true}/>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 col-xs-6">
                                                            <div className="input-group">
                                                                <div className="input-group-addon">{LocalizedLanguage.provState}</div>
                                                                <input type="text" className="form-control" placeholder="NA"  disabled={true} 
                                                                name="state_name" id="state_name" value={this.state.state_name ? this.state.state_name.replace(/[^a-zA-Z]/g, ' '):''}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <button className="btn btn-outline-secondary btn-block btn-capitalize font-sm border-default form-addon-button"
                                                            onClick={() => { this.OnCancel('PrsnlInfo')}}>
                                                                {LocalizedLanguage.cancel}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>                                       
                                            </div>
                                        </div>
                                    </div>                      
                                    }           
                                    </div>
                                </section>
                            </div>   
                            <div className="modal-footer no-padding bt-0">
                                <button className="btn btn-primary btn-block h-70" onClick={() => this.handleSubmit('ConfirmInfo')}>
                                        {LocalizedLanguage.saveandupdate}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>  
                <DiscountMsgPopup msg_text={this.state.common_Msg} />                 
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { customer_save_data } = state;
    return {
        customer_save_data: customer_save_data.items,
    };
}
const connectedCreateProfile = connect(mapStateToProps)(CreateProfile);
export { connectedCreateProfile as CreateProfile };