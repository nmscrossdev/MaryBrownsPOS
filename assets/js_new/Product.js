let menuitems = document.getElementById("menuitems");
if (menuitems) {
	let rect = menuitems.getBoundingClientRect();
	let height = 1920 - rect.top - 85;
	menuitems.style.maxHeight = height + "px";
}

function changeURL(url) {
	window.location.href = url;
}

function close() {
	console("works");
	parent.closeIframe();
}

function setModifyPosition(modify) {
	modify.style.top = `calc(50% - ${modify.offsetHeight / 2}px)`;
}

function toggleModify() {
	let modify = document.querySelector(".modify");
	let cover = document.querySelector(".cover");
	modify.classList.toggle("hide");
	cover.classList.toggle("hide");
	setModifyPosition(modify);
}

function increment(selected) {
	let input = selected.previousElementSibling;
	if (!input.value) {
		input.value = 1;
		return;
	}
	input.value = parseInt(input.value) + 1;
}

function decrement(selected) {
	let input = selected.nextElementSibling;
	// if (!input.value) {
	// 	input.value = 0;
	// 	return;
	// }
	if (input.value == "1") {
		//remove from cart
		return;
	}
	input.value = parseInt(input.value) - 1;
}

function checkSelection(parent) {
	let count = parent.querySelectorAll(".row").length;
	let inputs = parent.querySelectorAll("input[type='radio']");
	let counter = 0;
	for (let i = 0; i < inputs.length; i++) {
		if (inputs[i].checked) {
			counter++;
		}
	}
	if (counter == count) {
		document.querySelector(".view-cart").disabled = false;
	} else {
		document.querySelector(".view-cart").disabled = true;
	}
}
