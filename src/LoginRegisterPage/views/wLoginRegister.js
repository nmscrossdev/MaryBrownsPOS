import React from 'react';
import LocalizedLanguage from '../../settings/LocalizedLanguage';
import { LoadingModal } from '../../_components/LoadingModal';
import { isMobileOnly, isIOS, isAndroid } from "react-device-detect";
import { AndroidAndIOSLoader,Footer } from '../../_components';

const WebLoginRegisterView = (props) => {   
    const { fireBaseUsedRegister, autoFocusIs, checkStatus, handleBack, handleSubmit, registers, removeLocation, LocationName, check, loading } = props;
    var loginDetails = localStorage.getItem('clientDetail') ? JSON.parse(localStorage.getItem('clientDetail')) : null;
    return (
<div>
{loading == true ? isMobileOnly == true ? <AndroidAndIOSLoader /> : <LoadingModal /> : ''}
        <div className="login-header small-margin" onClick={() => window.location = "/login_location"}>
			<div className="login-go-back"  onClick={() => removeLocation()}>
				<img src="../Assets/Images/SVG/LesserThan.svg" alt="" />
				<p> {LocalizedLanguage.goBack}</p>
			</div>
			<p> {LocationName}</p>
		</div>
		<div className="login-register-wrapper">
			<p> {LocalizedLanguage.chooseRegister}</p>
			<div className="divider"></div>
			<p className="category-label">Registers</p>
			<div className="category-divider"></div>
			<div className="login-card-container">
            {registers && registers.length > 0 ?
                     registers && registers.map((item, index) => {
                         var inr = true
                         return (                          
                            <button className="login-card" key={item.id} id={`loginRegisterTab${index}`} onClick={() => handleSubmit(item)} onKeyDown={handleBack}>
                                <div className="icon-container"  id={`div${item.id}`}>
                                    <img src="../Assets/Images/SVG/Cash-Register.svg" alt="" className="fix-2" />
                                </div>
                                <div className="text-group">
                                    <p>{item.name}</p>
                                </div>
                                <div className="button">Select</div>
                            </button>
                         )
                    })
                    :
                    registers && registers.length == 0 ?
                        <button className="login-card coral">
                        <div className="icon-container" >
                            <img src="../Assets/Images/SVG/Cash-Register.svg" alt="" className="fix-2" />
                        </div>
                        <div className="text-group">
                            <p>{LocalizedLanguage.notFoundRegister}</p>
                        </div>
                       
                    </button>
                       : ''
                }
			</div>
			<p className="category-label">Kiosks</p>
			<div className="category-divider"></div>
			<div className="login-card-container">
                {
                     registers && registers.length > 0 ?
                     registers && registers.map((item, index) => {
                         var inr = true
                         return (                          
                            <button className="login-card coral" key={item.id} id={`loginRegisterTab${index}`} onClick={() => handleSubmit(item)} onKeyDown={handleBack}>
                                <div className="icon-container"  id={`div${item.id}`}>
                                    <img src="../Assets/Images/SVG/Touchscreen.svg" alt="" className="fix-2" />
                                </div>
                                <div className="text-group">
                                    <p>{item.name}</p>
                                </div>
                                <div className="button">Select</div>
                            </button>
                         )
                    })
                    :
                    registers && registers.length == 0 ?
                        <button className="login-card coral">
                        <div className="icon-container" >
                            <img src="../Assets/Images/SVG/Touchscreen.svg" alt="" className="fix-2" />
                        </div>
                        <div className="text-group">
                            <p>{LocalizedLanguage.notFoundRegister}</p>
                        </div>
                       
                    </button>
                       : ''
                }
				
				
			</div>
			<p className="category-label">Customer Displays</p>
			<div className="category-divider"></div>
			<div className="login-card-container">
				<button className="login-card teal taken">
					<div className="icon-container">
						<img src="../Assets/Images/SVG/TV.svg" alt="" className="fix-1" />
					</div>
					<div className="text-group">
						<p>Customer Display n</p>
					</div>
					<div className="button">Take Back</div>
				</button>
				
			</div>
			<p className="category-label">Kitchen Displays</p>
			<div className="category-divider"></div>
			<div className="login-card-container">
				<button className="login-card red taken">
					<div className="icon-container">
						<img src="../Assets/Images/SVG/kitchen.svg" alt="" className="fix-1" />
					</div>
					<div className="text-group">
						<p>Kitchen Display n</p>
					</div>
					<div className="button">Take Back</div>
				</button>
			</div>
		</div>
</div>

      
    )
}
export default WebLoginRegisterView;