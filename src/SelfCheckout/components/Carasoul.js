import React from 'react';
import Config from '../../Config';
import {initSlider} from '../../settings/SelfCheckoutSettings'
const Carasoul=(props)=> {
	if(props.banners!=null)
	{
    	return (
		<div className="slider-container m-b-35">
			<div className="slider">
				{
				props.banners.map((element, index) => {
					return(
					<img key={'slider_'+index} src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Path} alt="" />
					)
				 })
				}
			</div>
			<div className="slider-toggles">
			</div>
			{
			setTimeout(() => {
				initSlider()
			}, 5000) }
		</div>)
	}
}
export default Carasoul;
        