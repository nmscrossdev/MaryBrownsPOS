import React from 'react';
import Config from '../../Config';
 import {initScreenSaver,getScreenSaverImages,getTitle,getScreenSaverBtnImage,_key} from '../../settings/SelfCheckoutSettings'
const ScreenSaver=(props)=> {
	let btnTitle = getTitle(_key.LABEL_FOR_BOTTOM_AREA_ON_SCREEN_SAVER);
	let btnTitleColor = getTitle(_key.BUTTON_LABEL_FONT_COLOR);
	let btnBackColor = getTitle(_key.BOTTOM_BUTTON_COLOR);
	let bottomImage = getScreenSaverBtnImage();
	let screenSaverImages = getScreenSaverImages();
    return (
		<React.Fragment>
		<div className= "idle-screen hide">
		<div className="cover-screen-saver"></div>
			<div className="body">
				<p className="bold">Are you still there?</p>
				<div className="icon-container">
					<img src="../assets/img/hand.gif" alt="" />
				</div>
				<p>We noticed you haven’t been active. If you’re just taking your time, please click the button below.</p>
				<div className="text-row">
					<p>Otherwise, this cart will be cleared in</p>
					<p id="timeoutNumber">30</p>
					<p>seconds.</p>
				</div>
				<button>Continue Shopping</button>
			</div>
		</div>
		<div id="screensaver" className={props && props.hide==true?"screensaver hide": "screensaver"}>
			{
				screenSaverImages && screenSaverImages.Value !="" && screenSaverImages.Value !=null ? 
				<img className={"front"} key={'ssaver_'+0} src={Config.key.RECIEPT_IMAGE_DOMAIN +screenSaverImages.Value} alt="" />
				:null
			}
			<div className="footer" style={{backgroundColor:btnBackColor}}>
			<img src={bottomImage && bottomImage.Value?(Config.key.RECIEPT_IMAGE_DOMAIN +bottomImage.Value):""} alt="" />
			<p style={{color:btnTitleColor}}>{btnTitle?btnTitle:"Tap to Begin"}</p>
			</div>
			<div style={{display:"none"}}>{
			setTimeout(() => {
				initScreenSaver()
			}, 1000) }</div>
		</div>
		</React.Fragment>
		)
}
export default ScreenSaver;
        