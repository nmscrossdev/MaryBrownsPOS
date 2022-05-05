import React from 'react';
import Config from '../../Config';
 import {initScreenSaver} from '../../settings/SelfCheckoutSettings'
const ScreenSaver=(props)=> {
    return (<div>
			<div id="screensaver" className="screensaver">
				{
					<img className="front" key={'ssaver_'+0} src="http://dev1.sell.olivertest.com/assets/images/screensaver4.png" alt="" />
					///http://dev1.sell.olivertest.com/assets/images/screensaver4.png
				// props.banners.map((element, index) => {
				// 	return(
				// 	<img className={index==0?"front":""} key={'ssaver_'+index} src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Path} alt="" />
				// 	)
				//  })
				}
	            {/* {
			setTimeout(() => {
				initScreenSaver()
			}, 5000) } */}
			</div>

			
	{/* <div className="block_startscreen">
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
		 	}, 5000) } */}
			</div>
		
		)
}
export default ScreenSaver;
        