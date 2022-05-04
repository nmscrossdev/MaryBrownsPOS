import React from 'react';
import Config from '../../Config';
 import {initScreenSaver} from '../../settings/SelfCheckoutSettings'
const ScreenSaver=(props)=> {
    return (
			<div id="screensaver" className="screensaver">
				{
				props.banners.map((element, index) => {
					return(
					<img className={index==0?"front":""} key={'ssaver_'+index} src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Path} alt="" />
					)
				 })
				}
	            {
			setTimeout(() => {
				initScreenSaver()
			}, 5000) }
			</div>
		
		)
        
    	// return (
        //     <div id="screensaver" class="screensaver">
		// 	<img class="front" src="../assets/screensaver.png" alt="" />
		// 	<img src="../assets/screensaver2.png" alt="" />
		// 	<img src="../assets/screensaver3.png" alt="" />
		// 	<img src="../assets/screensaver4.png" alt="" />
        //     {
		// 	setTimeout(() => {
		// 		initSlider(5000)
		// 	}, 5000) }
		// </div>
        // )
}
export default ScreenSaver;
        