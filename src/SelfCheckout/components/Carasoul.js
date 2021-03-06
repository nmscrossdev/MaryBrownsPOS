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
					//onClick={()=>}
					return(
					<img key={'slider_'+index} src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Path} alt="" onClick={()=>props.showProductPopup(element.ProductId)} />
					)
				 })
				}
			</div>
			<div className="slider-toggles">
			</div>
			{props.banners && props.banners.length >1 &&
				<div style={{display:"none"}}>{
				setTimeout(() => {
					initSlider()
				}, 1000) }
				</div>
			}
		</div>)
	}
}
export default Carasoul;
        