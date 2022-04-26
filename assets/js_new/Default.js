scrollableHeight();
window.addEventListener("resize", scrollableHeight);

function scrollableHeight() {
	let scrolls = document.querySelectorAll(".scroll");
	for (let i = 0; i < scrolls.length; i++) {
		if(scrolls[i].nextElementSibling)
		{
			scrolls[i].style.maxHeight = `${
				scrolls[i].nextElementSibling.getBoundingClientRect().top -
				scrolls[i].getBoundingClientRect().top -
				35
			}px`;
		}
	}
}

function changeURL(url) {
	window.location.href = url;
}

function toggleApp(appName = null) {
	let elems = document.querySelectorAll(".app");
	if (!appName) {
		for (let i = 0; i < elems.length; i++) {
			if (!elems[i].classList.contains("hide")) {
				elems[i].classList.add("hide");
			}
		}
		document.querySelector(".cover").classList.add("hide");
		return;
	} else {
		document.querySelector(".cover").classList.remove("hide");
		document.querySelector(`.${appName}`).classList.remove("hide");
	}
}

function positionAppNames() {
	let appNames = document.querySelectorAll(".topnav > .topnav-row > .topnav-col > .icon > p");
	for (let i = 0; i < appNames.length; i++) {
		let styles = window.getComputedStyle(appNames[i]);
		appNames[i].style.bottom = `-${
			Math.floor(
				appNames[i].offsetHeight /
					parseInt(styles.getPropertyValue("line-height").split("px")[0])
			) * 19
		}px`;
	}
}

positionAppNames();
