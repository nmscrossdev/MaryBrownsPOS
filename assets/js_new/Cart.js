function setProductArray(cart) {
	let items = cart.querySelector(".cart-items").firstElementChild.querySelectorAll(".item");
	let productArray = [];
	for (let i = 0; i < items.length; i++) {
		if (!items[i].classList.contains("note")) {
			productArray.push({
				name: items[i].querySelector(".prod-name").innerHTML,
				quantity: parseInt(
					items[i].querySelector(".number-input-container").firstElementChild
						.nextElementSibling.value
				),
				amount: parseFloat(items[i].querySelector(".price").innerHTML.replace("$", "")),
			});
		}
	}
	return productArray;
}

function setCart() {
	let discount = 1.0;
	let cart = document.querySelector(".cart");
	let productArray = setProductArray(cart);
	let numItems = 0;
	// cart.firstElementChild.querySelector(".highlight").innerHTML = `(${productArray.length} items)`;
	let totalAmount = 0;
	for (let i = 0; i < productArray.length; i++) {
		totalAmount += productArray[i].amount;
		numItems += productArray[i].quantity;
	}
	cart.firstElementChild.querySelector(".highlight").innerHTML = `(${numItems} items)`;
	let cartTotals = cart.querySelector(".cart-total");
	cartTotals.querySelector(".subtotal-amount").innerHTML = `$${totalAmount.toFixed(2)}`;
	cartTotals.querySelector(".discount-amount").innerHTML = `$${discount.toFixed(2)}`;
	cartTotals.querySelector(".tax-amount").innerHTML = `$${(totalAmount * 0.15).toFixed(2)}`;
	cartTotals.querySelector(".cart-amount").innerHTML = `$${(
		totalAmount * 1.15 -
		discount
	).toFixed(2)}`;
	if (numItems == 0) {
		emptyCart(true);
	} else {
		emptyCart(false);
	}
}

function increment(selected) {
	let input = selected.previousElementSibling;
	if (!input.value) {
		input.value = 1;
		return;
	}
	input.value = parseInt(input.value) + 1;
	inputChange(input);
	// let price = selected.parentNode.nextElementSibling.firstElementChild;
	// let priceAmount = parseFloat(price.innerHTML.replace("$", ""));
	// priceAmount = (priceAmount / (parseInt(input.value) - 1)) * input.value;
	// price.innerHTML = `$${priceAmount.toFixed(2)}`;
	// setCart();
}

function decrement(selected) {
	let input = selected.nextElementSibling;
	if (input.value == "1") {
		deleteItem(selected);
		return;
	}
	input.value = parseInt(input.value) - 1;
	inputChange(input);
	// let price = selected.parentNode.nextElementSibling.firstElementChild;
	// let priceAmount = parseFloat(price.innerHTML.replace("$", ""));
	// priceAmount = (priceAmount / (parseInt(input.value) + 1)) * input.value;
	// price.innerHTML = `$${priceAmount.toFixed(2)}`;
	// setCart();
}

function deleteItem(refNode) {
	let node = refNode.parentNode;
	while (true) {
		if (node.classList.contains("item")) {
			node.remove();
			setCart();
			return;
		}
		node = node.parentNode;
	}
}

//{name: "Big Mary Combo", options: ["Big Mary Sandwich", "7up", "Taters"], notes: ["Note: No Mayo", "Discount: $2.99"], amount: 12.99}
function addItem(
	product = {
		name: "Big Mary Combo",
		options: ["Big Mary Sandwich", "7up", "Taters"],
		notes: ["Note: No Mayo", "Discount: $2.99"],
		amount: 12.99,
	}
) {
	let itemGroup = document.querySelector(".items-group");
	let item = document.createElement("div");
	item.setAttribute("class", "item");
	item.innerHTML = `<div class="col"><p class="prod-name">${product.name}</p></div><div class="row"><label class="number-input-container"><div onclick="decrement(this)" class="svg-container left"><svg width="16" height="2" viewBox="0 0 16 2"><rect width="16" height="2" fill="#758696" /></svg></div><input type="number" value="1" /><div onclick="increment(this)" class="svg-container right"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M16 7H9V0H7V7H0V9H7V16H9V9H16V7Z" fill="#758696" /></svg></div></label><div class="inner-row"><p class="price">$${product.amount}</p><svg onclick="deleteItem(this)" width="15" height="15" viewBox="0 0 15 15"><path d="M8.95004 7.8928L14.8187 2.03979C14.9347 1.90473 14.9953 1.73099 14.9884 1.5533C14.9816 1.37561 14.9077 1.20705 14.7816 1.08131C14.6555 0.95557 14.4865 0.881908 14.3084 0.875044C14.1302 0.868181 13.956 0.928622 13.8206 1.04429L7.95186 6.89729L2.08316 1.03723C1.94986 0.90428 1.76906 0.82959 1.58054 0.82959C1.39202 0.82959 1.21122 0.90428 1.07791 1.03723C0.944605 1.17018 0.869715 1.35049 0.869715 1.53851C0.869715 1.72653 0.944605 1.90684 1.07791 2.03979L6.95369 7.8928L1.07791 13.7458C1.0038 13.8091 0.943615 13.887 0.901123 13.9746C0.858631 14.0622 0.834753 14.1576 0.830987 14.2548C0.827221 14.352 0.843649 14.449 0.87924 14.5396C0.91483 14.6302 0.968815 14.7125 1.03781 14.7813C1.1068 14.8501 1.1893 14.9039 1.28015 14.9394C1.37099 14.9749 1.46821 14.9913 1.56571 14.9876C1.6632 14.9838 1.75887 14.96 1.8467 14.9176C1.93452 14.8752 2.01262 14.8152 2.07608 14.7413L7.95186 8.8883L13.8206 14.7413C13.956 14.857 14.1302 14.9174 14.3084 14.9105C14.4865 14.9037 14.6555 14.83 14.7816 14.7043C14.9077 14.5785 14.9816 14.41 14.9884 14.2323C14.9953 14.0546 14.9347 13.8809 14.8187 13.7458L8.95004 7.8928Z" fill="#D51A52"/></svg></div></div>`;
	let insertNode = item.firstElementChild;
	for (let i = 0; i < product.options.length; i++) {
		let p = document.createElement("p");
		p.setAttribute("class", "description");
		p.innerHTML = product.options[i];
		insertNode.appendChild(p);
	}
	for (let i = 0; i < product.notes.length; i++) {
		let p = document.createElement("p");
		p.setAttribute("class", "note");
		p.innerHTML = product.notes[i];
		insertNode.appendChild(p);
	}
	itemGroup.appendChild(item);
	setCart();
}

function emptyCart(empty) {
	document.querySelector(".view-cart").disabled = empty;
	if (empty) {
		document.querySelector(".cart-total").classList.add("hide");
		document.querySelector(".empty").classList.remove("hide");
	} else {
		document.querySelector(".cart-total").classList.remove("hide");
		document.querySelector(".empty").classList.add("hide");
	}
}

setCart();
