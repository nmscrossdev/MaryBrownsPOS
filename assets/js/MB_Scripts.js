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
	// const covers = document.querySelectorAll('.cover');
	// if(covers)
	// { 
	// 	for (const c of covers) {
	//  		c.classList.remove('hide');
	// 	}
	// }

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
	toggleScroll(false);
	if(popupName=="add-note")
	{
		showOverlay();
	}
}

function hideModal(e) {
	let parent = document.getElementById(e);
	parent && parent.classList && parent.classList.add("hide");
	document.querySelector(".cover") && document.querySelector(".cover").classList.add("hide");
	toggleScroll(false);

	// const covers = document.querySelectorAll('.cover');
	// if(covers)
	// { 
	// 	for (const c of covers) {
	//  		c.classList.add('hide');
	// 	}
	// }
	//if(parent && parent.id=="add-note")
	{
		hideOverlay();
	}

}
function showOverlay()
{
	document.querySelector(".overlay-cover") && document.querySelector(".overlay-cover").classList.remove("hide");
}
function hideOverlay()
{
	document.querySelector(".overlay-cover") && document.querySelector(".overlay-cover").classList.add("hide");
	document.querySelector(".cover") && document.querySelector(".cover").classList.add("hide");
}
function disableIncrementButton(id)
{
	if(document.getElementById("btn_dv_plus_"+id))
	{
		document.getElementById("btn_dv_plus_"+id).style.pointerEvents = 'none';
	}
	if(document.getElementById("btn_svg_plus_"+id))
	{
		document.getElementById("btn_svg_plus_"+id).style.opacity = "0.5";
	}
}
function enableIncrementButton(id)
{
	if(document.getElementById("btn_dv_plus_"+id))
	{
		document.getElementById("btn_dv_plus_"+id).style.pointerEvents = 'auto';
	}
	if(document.getElementById("btn_svg_plus_"+id))
	{
		document.getElementById("btn_svg_plus_"+id).style.opacity = "1";
	}
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
// Resize Timer
var resizeTimer;
function resize() {
	window.addEventListener("resize", function () {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			// setItemsHeight();
			scaleSVG();
			scaleImages();
		}, 100);
	});
}
// Scale SVGs
function scaleSVG() {
	document.querySelectorAll("svg").forEach((svg) => {
		svg.style.transform = `scale(${window.innerWidth / 1080})`;
	});
}

function scaleImages() {
	let images = document.querySelectorAll("img.scale");
	let imageStyles, maxWidth, maxHeight;
	images.forEach((image) => {
		let trueImage = new Image();
		trueImage.src = image.src;
		let ratio = trueImage.width / trueImage.height;
		imageStyles = window.getComputedStyle(image);
		maxWidth = imageStyles.getPropertyValue("max-width");
		maxHeight = imageStyles.getPropertyValue("max-height");
		if (maxWidth == "100%" && maxHeight == "100%") {
			imageStyles = window.getComputedStyle(image.parentNode);
			maxWidth = parseFloat(imageStyles.getPropertyValue("width").replace("px", ""));
			maxHeight = parseFloat(imageStyles.getPropertyValue("height").replace("px", ""));
		} else {
			maxWidth = parseFloat(maxWidth.replace("px", ""));
			maxHeight = parseFloat(maxHeight.replace("px", ""));
		}
		if (maxWidth - trueImage.width < maxHeight - trueImage.height) {
			image.style.height = `${maxWidth / ratio}px`;
			image.style.width = `${maxWidth}px`;
		} else {
			image.style.width = `${maxHeight * ratio}px`;
			image.style.height = `${maxHeight}px`;
		}
	});
}
