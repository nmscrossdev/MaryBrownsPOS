import React from 'react';
import Config from '../../Config';
const Carasoul=(props)=> {
	if(props.banners!=null)
	{
    	return (
		<div className="slider-container margin-bottom-67">
			<section className="intro">
				<div className="slider">
					<ul>
						{props.banners.map((element, index) => {
							<li key={index} style={{backgroundImage: "url("+Config.key.RECIEPT_IMAGE_DOMAIN +element.Path+")"}}>
							<div className="center-y"></div>
							</li>
						})}
						<li>
						<div className="center-y"></div>
						</li>
					</ul>
					<ul>
						<nav>
							<a href="#"></a>
							<a href="#"></a>
							<a href="#"></a>
							<a href="#"></a>
						</nav>
					</ul>
				</div>
			</section>
		</div>)
	}
}
export default Carasoul;
        