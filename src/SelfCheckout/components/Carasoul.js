import React from 'react';
import Config from '../../Config';
const Carasoul=(props)=> {
	if(props.banners!=null)
	{
    	return (
		<div className="slider-container m-b-35">
				<div className="slider">
						{props.banners.map((element, index) => {
							<img src={Config.key.RECIEPT_IMAGE_DOMAIN +element.Path} alt="" />
							// <li key={index} style={{backgroundImage: "url("+Config.key.RECIEPT_IMAGE_DOMAIN +element.Path+")"}}>
							// <div className="center-y"></div>
							// </li>
						})}
						{/* <li>
						<div className="center-y"></div>
						</li> */}
					{/* <ul>
						<nav>
							<a href="#"></a>
							<a href="#"></a>
							<a href="#"></a>
							<a href="#"></a>
						</nav>
					</ul> */}
					<div className="slider-toggles"></div>
				</div>
		</div>)
	}
}
export default Carasoul;
        