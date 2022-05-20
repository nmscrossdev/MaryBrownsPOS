import React from 'react';
const IdleScreen=()=> {
    return (<div class="idle-screen hide">
			<div class="body">
				<p class="bold">Are you still there?</p>
				<div class="icon-container">
					<img src="../assets/img/hand.gif" alt="" />
				</div>
				<p>We noticed you haven’t been active. If you’re just taking your time, please click the button below.</p>
				<div class="text-row">
					<p>Otherwise, this cart will be cleard in</p>
					<p id="timeoutNumber">30</p>
					<p>seconds.</p>
				</div>
				<button>Continue Shopping</button>
			</div>
		</div>)
}
export default IdleScreen;