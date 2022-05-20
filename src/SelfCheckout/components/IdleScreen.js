import React from 'react';
const IdleScreen=()=> {
    return (<div className="idle-screen hide">
			<div className="body">
				<p className="bold">Are you still there?</p>
				<div className="icon-container">
					<img src="../assets/img/hand.gif" alt="" />
				</div>
				<p>We noticed you haven’t been active. If you’re just taking your time, please click the button below.</p>
				<div className="text-row">
					<p>Otherwise, this cart will be cleard in</p>
					<p id="timeoutNumber">30</p>
					<p>seconds.</p>
				</div>
				<button>Continue Shopping</button>
			</div>
		</div>)
}
export default IdleScreen;