function marginCalculator(container, marginSize) {
	if (!container) {
		return;
	}
	let children = container.children;
	if (children.length) {
		let childPerRow = Math.floor(
			container.offsetWidth / (children[0].offsetWidth + marginSize)
		);
		if (
			(childPerRow + 1) * children[0].offsetWidth + childPerRow * marginSize <=
			container.offsetWidth
		) {
			childPerRow += 1;
		}
		if (children.length < childPerRow) {
			for (let i = 1; i <= children.length; i++) {
				if (i < children.length) {
					children[i - 1].style.marginRight = `${marginSize}px`;
				}
			}
			let containerWidth =
				children.length * (children[0].offsetWidth + marginSize) - marginSize;
			container.style.width = `${containerWidth}px`;
		} else {
			let rows = Math.ceil(children.length / childPerRow);
			for (let i = 1; i <= children.length; i++) {
				if (i % childPerRow != 0) {
					children[i - 1].style.marginRight = `${marginSize}px`;
				}
				if (Math.ceil(i / childPerRow) != rows) {
					children[i - 1].style.marginBottom = `${marginSize}px`;
				}
			}
			let containerWidth = childPerRow * (children[0].offsetWidth + marginSize) - marginSize;
			container.style.width = `${containerWidth}px`;
		}
		container.style.alignSelf = "center";
	}
}

function setFillContainer(container) {
	if (document.body.scrollHeight == window.innerHeight && container) {
		let rect = container.getBoundingClientRect();
		container.style.height = `${window.innerHeight - rect.top - 115}px`;
	}
}

//Popups

function showModal(popupName) {
	let popup = document.querySelector(`#${popupName}`);
	let cover = document.querySelector(".cover");
	if (cover && cover.classList.contains("hide")) {
		cover.classList.remove("hide");
	}
	if (popup && popup.classList.contains("hide")) {
		let maxWidth = window.innerWidth - 80;
		let maxHeight = window.innerHeight - 80;
		let setWidth, setHeight;
		popup.classList.remove("hide");
		if (popup.offsetWidth > maxWidth) {
			setWidth = maxWidth;
			popup.style.width = `${setWidth}px`;
		} else {
			setWidth = popup.offsetWidth;
		}
		if (popup.offsetHeight > maxHeight) {
			let setHeight = maxHeight;
			popup.style.height = `${setHeight}px`;
		} else {
			setHeight = popup.offsetHeight;
		}
		popup.style.left = `${(window.innerWidth - setWidth) / 2}px`;
		popup.style.top = `${(window.innerHeight - setHeight) / 2}px`;
	}
	toggleScroll();
}

function hideModal(e) {
	let parent = document.getElementById(e);
	parent && parent.classList && parent.classList.add("hide");
	document.querySelector(".cover") && document.querySelector(".cover").classList.add("hide");
	toggleScroll();
}

function toggleScroll(toggle = true) {
	if (toggle) {
		if (document.querySelector(".category-tile-container")) {
			document.querySelector(".category-tile-container").classList.toggle("no-scroll");
		}
		if (document.querySelector(".card-tile-container")) {
			document.querySelector(".card-tile-container").classList.toggle("no-scroll");
		}
		document.body.classList.toggle("no-scroll");
	} else {
		if (document.querySelector(".category-tile-container")) {
			document.querySelector(".category-tile-container").classList.remove("no-scroll");
		}
		if (document.querySelector(".card-tile-container")) {
			document.querySelector(".card-tile-container").classList.remove("no-scroll");
		}
		document.body.classList.remove("no-scroll");
	}
}

// Number Input Increment

function increaseIncrementInput(e) {
	let input = e.target;
	while (!input.classList.contains("increment")) {
		input = input.parentNode;
	}
	input = input.previousElementSibling;
	input.value = parseInt(input.value) + 1;
}

function decreaseIncrementInput(e) {
	let input = e.target;
	while (!input.classList.contains("decrement")) {
		input = input.parentNode;
	}
	input = input.nextElementSibling;
	if (parseInt(input.value) - 1 > 0) {
		input.value = parseInt(input.value) - 1;
	} else {
		input.value = 1;
	}
}

