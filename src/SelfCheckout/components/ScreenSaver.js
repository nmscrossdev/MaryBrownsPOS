import React from 'react';
import Config from '../../Config';
 import {initScreenSaver,getScreenSaverImages,getTitle,getScreenSaverBtnImage,_key} from '../../settings/SelfCheckoutSettings'
const ScreenSaver=()=> {
	let btnTitle = getTitle(_key.LABEL_FOR_BOTTOM_AREA_ON_SCREEN_SAVER);
	let btnTitleColor = getTitle(_key.BUTTON_LABEL_FONT_COLOR);
	let btnBackColor = getTitle(_key.BOTTOM_BUTTON_COLOR);
	let bottomImage = getScreenSaverBtnImage();
	let screenSaverImages = getScreenSaverImages();
    return (
		<div id="screensaver" className="screensaver">
			{
			//  screenSaverImages && screenSaverImages.map((element, index) => {
			// 		return(
			// 		<img className={index==0?"front":""} key={'ssaver_'+index} src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Value} alt="" />
			// 		)
			// 	 })

				 //screenSaverImages && screenSaverImages.map((element, index) => {
					//return(
						screenSaverImages?
					<img className={"front"} key={'ssaver_'+0} src={Config.key.RECIEPT_IMAGE_DOMAIN +screenSaverImages.Value} alt="" />
					:null
					//)
				// })
				 
			}
			{/* <img key={'ssaver_'+2} src="http://dev1.sell.olivertest.com/assets/images/screensaver4.png" alt="" /> */}
			{/* <img className="front" src="../Assets/Images/Temp/screensaver1.png" alt="" /> */}
			{/* <img src="../Assets/Images/Temp/screensaver2.png" alt="" /> */}
			<div className="footer" style={{backgroundColor:btnBackColor}}>
			<img src={bottomImage?(Config.key.RECIEPT_IMAGE_DOMAIN +bottomImage.Value):""} alt="" />
			<p style={{color:btnTitleColor}}>{btnTitle?btnTitle:"Tap to Begin"}</p>
			</div>
			<div style={{display:"none"}}>{
			setTimeout(() => {
				initScreenSaver()
			}, 1000) }</div>
		</div>


			/* <div id="screensaver" className="screensaver">
				{
					<img className="front" key={'ssaver_'+0} src="http://dev1.sell.olivertest.com/assets/images/screensaver4.png" alt="" />
					///http://dev1.sell.olivertest.com/assets/images/screensaver4.png
				// props.banners.map((element, index) => {
				// 	return(
				// 	<img className={index==0?"front":""} key={'ssaver_'+index} src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Path} alt="" />
				// 	)
				//  })
				}
	            {
			setTimeout(() => {
				initScreenSaver()
			}, 1000) }
			</div> */

			
	/* <div className="block_startscreen">
		<div className="block_startscreen_background background-cover background-no-repeat background-center" style="background-image: url(&quot;https://app.oliverpos.com/Content/Customization/landing-screen/r135407828838/resize-1638339648842587454images3.jpg&quot;);">
		</div>
		<button className="btn btn-light btn-block btn-self-checkout">
			<img className="btn-icon" src="https://app.oliverpos.com/Content/CompanyLogo\ShopLogo\15407828838/223-2.png" alt="">
			Touch To Start</img>
		</button>
	</div>
	     {
		 	setTimeout(() => {
				initScreenSaver(5000)
		 	}, 5000) } */
		
		
		)
}
export default ScreenSaver;
        