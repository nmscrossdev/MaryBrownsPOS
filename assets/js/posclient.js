window.addEventListener("DOMContentLoaded", (event) => {
    if (!gateway || gateway === "") return showError("Gateway not setup.");
    sendMessageRegister("clientInfo");
});

let registerId, guid, tenderAmnt;
window.addEventListener("message", async (event) => {
    // if (event.origin !== "https://sell.oliverpos.com") return;
    const msg = JSON.parse(event.data);

    if (!msg.hasOwnProperty("data")) return;
    if (!msg.hasOwnProperty("oliverpos") && !msg.hasOwnProperty("command"))
        return;

    if (msg.command === "CartValue") {
        tenderAmnt = msg.data.tender_amt;
        sendMessageRegister("extensionReady");
        return;
    }

    if (msg.oliverpos?.event === "clientInfo" && guid === undefined) {
        guid = msg.data.clientGUID;
        sendMessageRegister("registerInfo");
        return;
    }

    if (msg.oliverpos?.event === "registerInfo" && registerId === undefined) {
        registerId = msg.data.id;
        getTenderAmount();
        return;
    }

    if (msg.oliverpos?.event === "shareCheckoutData") {
        if (msg.data.checkoutData.hasOwnProperty("order_payments")) {
            if (msg.data.checkoutData.total == 0) {
                return showError("Refund amount must be greater than 0.");
            }
            await process(tenderAmnt, msg.data.checkoutData, "refund");
        } else {
            await process(tenderAmnt, msg.data.checkoutData, "sale");
        }
        return;
    }
});

const process = async (tenderAmnt, data, type) => {
    let prevTxnId = undefined;
    if (type === "refund") {
        let biggestAmnt = 0;
        for (const payment of data.order_payments) {
            if (payment.type === gateway && biggestAmnt <= payment.amount) {
                prevTxnId = payment.transection_id;
                biggestAmnt = payment.amount;
            }
        }
        if (!prevTxnId) {
            return showError(
                "Cannot refund using this payment gateway because it was not used for the purchase."
            );
        }
    }

    const res = await fetch("/pos/transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            amount: tenderAmnt * 100,
            guid: guid,
            gateway: gateway,
            registerId: registerId,
            type: type,
            previousTxnId: prevTxnId,
        }),
    });

    if (res.status == 504) {
        showError("Timeout.");
    }

    const obj = await res.json();
    if (obj.success) {
        const responseData = obj.data;
        const emvReceipt = Object.keys(responseData.emv)
            .map((key) => {
                let emvReceipt =
                    '<div style="display: flex; flex-direction: row; justify-content: space-between">';
                emvReceipt +=
                    "<span>" +
                    key +
                    "</span>" +
                    (responseData.emv[key]
                        ? "<span>" + responseData.emv[key] + "</span>"
                        : "");
                emvReceipt += "</div>";
                return emvReceipt;
            })
            .join("");
        sendMessageRegister("addOrderNotes", {
            note: emvReceipt,
            orderId: responseData.gatewayTxnId,
        });

        sendMessageRegister("extensionPayment", {
            paymentDetails: {
                paymentType: gateway,
                paidAmount: responseData.amount / 100,
                paymentStatus: "success",
                transaction_id: responseData.gatewayTxnId,
            },
        });
    } else {
        showError(obj.message);
    }
};

const showError = (err) => {
    const upper = document.getElementById("upper-msg");
    upper.innerText = "Transaction failed!";
    upper.classList.add("red");

    const lower = document.getElementById("lower-msg");
    lower.innerText = err;
    lower.classList.add("red");
};