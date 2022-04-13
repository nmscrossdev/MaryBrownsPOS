import React from 'react';
import LocalizedLanguage from '../../../settings/LocalizedLanguage'
import { Footer } from '../../../_components';

class OnboardingFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var counter = true
        var firebaseStaffName = localStorage.getItem('firebaseStaffName') ? localStorage.getItem('firebaseStaffName') : ''
        var firebaseSelectedRegisters = localStorage.getItem('firebaseSelectedRegisters') ? JSON.parse(localStorage.getItem('firebaseSelectedRegisters')) : ''
        var selectedRegister = localStorage.getItem('selectedRegister') ? JSON.parse(localStorage.getItem('selectedRegister')) : ''
        var _allowRegisters = localStorage.getItem('clientDetail') && localStorage.getItem('clientDetail') !== undefined ?
          JSON.parse(localStorage.getItem('clientDetail')).subscription_permission !== null && JSON.parse(localStorage.getItem('clientDetail')).subscription_permission !== undefined && JSON.parse(localStorage.getItem('clientDetail')).subscription_permission.AllowRegisters !== null && JSON.parse(localStorage.getItem('clientDetail')).subscription_permission.AllowRegisters !== undefined ? JSON.parse(localStorage.getItem('clientDetail')).subscription_permission.AllowRegisters : '' : '';
        var printstaffname = ''
        var firebaseStaff = counter == true && firebaseSelectedRegisters && selectedRegister && firebaseSelectedRegisters.map(fItem => {
            if (counter == true) {
                if (fItem.RegisterId && fItem.RegisterId == selectedRegister.id && fItem.Status !=="available" && counter == true) {
                    counter = false
                    printstaffname = fItem.StaffName ? fItem.StaffName : ''
                    if(printstaffname  == ''){
                        counter = true
                    }
                    return fItem.StaffName
                } else if (fItem.registerId && fItem.registerId == selectedRegister.id && counter == true) {
                    counter = false
                    printstaffname = fItem.staff_name ? fItem.staff_name : ''
                    if(printstaffname  == ''){
                        counter = true
                    }
                    return fItem.staff_name
                }
            }else{
                return false;
            }
        })
        // var printstaffname = firebaseStaff && firebaseStaff[0] ? firebaseStaff[0] : ''
        // console.log('--------firebaseStaff---', printstaffname);
        return (
            <div className="user__login_footer">
                {/* added for oin view */}
                {this.props && this.props.pinView && this.props.pinView == true && printstaffname && printstaffname !== '' ?
                    <div className="user__login_footer2">
                        <div className="user_login_container">
                            <div className="user_login_container_22">
                                <div className="already-activate-title">
                                    <img src="../assets/img/onboarding/union.svg" alt="" />
                                        {LocalizedLanguage.RegisterAlreadyInUse}
                                </div>
                                <p className = {'mb-0'}>{LocalizedLanguage.Byproceedingyouwilllog} <strong>{printstaffname}</strong> {LocalizedLanguage.outofthisregister}</p>
                                <p>{LocalizedLanguage.Yourpricingplancurrentlyincludes}<strong> {_allowRegisters} {LocalizedLanguage.registeronbord}</strong>. </p>
                                <button className="btn btn-outline" onClick={()=>{window.open("https://oliverpos.com/pricing/","")}}>{LocalizedLanguage.LearnmoreaboutOliverPOSplans}</button>
                            </div>
                        </div>
                    </div> : ''}
                {/* end */}
                <Footer />
            </div>
        )
    }
}
export { OnboardingFooter };