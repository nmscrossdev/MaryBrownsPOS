let images = document.querySelectorAll("img");
for (let i = 0; i < images.length; i++) {
	if (images[i].classList.contains("scale")) {
		let styles = window.getComputedStyle(images[i]);
		let maxWidth = parseInt(styles.getPropertyValue("max-width").match(/\d+/)[0]);
		let maxHeight = parseInt(styles.getPropertyValue("max-height").match(/\d+/)[0]);
		let realWidth = images[i].naturalWidth;
		let realHeight = images[i].naturalHeight;
		if (realWidth > maxWidth || realHeight > maxHeight) {
			break;
		} else if (maxWidth - realWidth > maxHeight - realHeight) {
			images[i].style.height = `${maxHeight}px`;
			images[i].style.width = `${realWidth + (maxHeight - realHeight)}px`;
		} else {
			images[i].style.width = `${maxWidth}px`;
			images[i].style.height = `${realHeight + maxWidth - realWidth}px`;
		}
	}
}
