
// its return float value upto 2 decimal
export const getAmount = (amountVal) => {
    var precision = 2;
    if (String(amountVal).indexOf(',') == -1) {
        var factor = Math.pow(10, precision);
        return Math.round(parseFloat(amountVal) * factor) / factor;
    } else {
        var factor = Math.pow(10, precision);
        return Math.round(parseFloat(String(amountVal).replace(',', '')) * factor) / factor;
    }
}
// its return total amount rounded
export const GetRoundCash = (roundType, paying_amount) => {
    var round_amount = 0.00;
    var number = 0;
    switch (roundType) {
        case '0.01':
            round_amount = 0;
            break;
        case '0.05':
            var cashRoundArray = { '0': 0, '1': -0.01, '2': -0.02, '3': 0.02, '4': 0.01, '5': 0.00, '6': -0.01, '7': -0.02, '8': 0.02, '9': 0.01 };
            number = (getAmount(Math.round(paying_amount * 100) / 100).toFixed(2)).slice(-1);
            round_amount = cashRoundArray[number];
            break;
        case '0.10':
            number = (getAmount(Math.round(paying_amount * 100) / 100).toFixed(2)).slice(-1);
            if (number < 5) {
                round_amount = '-0.0' + number.toString()
            }
            else if (number >= 5) {
                round_amount = '0.0' + (10 - number).toString()
            }
            break;
        case '0.25':
            number = (getAmount(Math.round(paying_amount * 100) / 100).toFixed(2)).slice(-2);
            var new_number = number;
            if (number > 25) {
                new_number = (number % 25);
            }
            if (new_number < 12) {
                round_amount = new_number.toString().length == 2 ? '-0.' + new_number.toString() : '-0.0' + new_number.toString()
            }
            else if (new_number >= 12) {
                round_amount = (25 - new_number).toString().length == 2 ? '0.' + (25 - new_number).toString() : '0.0' + (25 - new_number).toString()
            }
            break;
        case '0.50':
            number = (getAmount(Math.round(paying_amount * 100) / 100).toFixed(2)).slice(-2);
            var new_number = number;
            if (number > 50) {
                new_number = (number % 50);
            }
            if (new_number < 25) {
                round_amount = new_number.toString().length == 2 ? '-0.' + new_number.toString() : '-0.0' + new_number.toString()
            }
            else if (new_number >= 25) {
                round_amount = (50 - new_number).toString().length == 2 ? '0.' + (50 - new_number).toString() : '0.0' + (50 - new_number).toString()
            }
            break;
        case '1.00':
            number = (getAmount(Math.round(paying_amount * 100) / 100).toFixed(2)).slice(-2);
            var new_number = number;
            if (new_number < 50) {
                round_amount = new_number.toString().length == 2 ? '-0.' + new_number.toString() : '-0.0' + new_number.toString()
            }
            else if (new_number >= 50) {
                round_amount = (100 - new_number).toString().length == 2 ? '0.' + (100 - new_number).toString() : '0.0' + (100 - new_number).toString()
            }
            break;
        default:
            round_amount = 0;
            // round_amount = getAmount(paying_amount).toFixed(2);
            break;
    }
    return round_amount;
}

// its check if payment amount is valid
export const isValidPayingAmount = (amount_val, roundType) => {
    if (amount_val <= 0) {
        alert('Payment should be greater than $0.00.');
        return false;
    }
    else if (GetRoundCash(roundType, amount_val) != 0) {
        alert('Payable amount is not valid for cash payment, Please change the amount.');
        return false;
    }
    return true;
}

export const setOrderPayments = (order_id, payment_type, paying_amount, total_amount) => {
    if (typeof (Storage) !== "undefined") {

        if (localStorage.oliver_order_payments) {
            var payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
            payments.push({
                "payment_type": payment_type,
                "payment_amount": paying_amount ? paying_amount.replace(/\s+/g, '') : 0,
                "order_id": order_id,
            });
            localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
        } else {
            var payments = new Array();
            payments.push({
                "payment_type": payment_type,
                "payment_amount": paying_amount ? paying_amount.replace(/\s+/g, '') : 0,
                "order_id": order_id,
            });
            localStorage.setItem("oliver_order_payments", JSON.stringify(payments));
        }
    } else {
        // alert( "Your browser not support local storage" );
    }
}

export const getOrderPayments = (order_id, total_amount) => {
    var payment_list = JSON.parse(localStorage.getItem("oliver_order_payments"));
    if (localStorage.oliver_order_payments) {
        var get_payments = new Array();
        var paid_amount = 0;
        var payments = new Array();
        JSON.parse(localStorage.getItem("oliver_order_payments")).forEach(paid_payments => {
            // if (parseFloat(order_id) == paid_payments.order_id) {
            paid_amount += parseFloat(paid_payments.amount);
            get_payments.push({
                "payment_type": paid_payments.type,
                "payment_amount": paid_payments.amount,
            });
            //}                
        });
        payments.push({
            "number_of_payments": get_payments.length,
            "payments": get_payments,
            "total_amount": total_amount,
            "paid_amount": paid_amount,
            "remainning_amount": parseFloat(parseFloat(total_amount) - parseFloat(paid_amount)).toFixed(2),
        });
        return payments[0];

    } else {
        //alert( "Your browser not support local storage" );
    }
}

export const removeOrderPayments = (order_id) => {
    if (localStorage.oliver_order_payments) {
        var index = 0;
        var payments = JSON.parse(localStorage.getItem("oliver_order_payments"));
        payments.forEach(payment => {
            if (order_id == payment.order_id) {
                payments.splice(index, 1);
            }
            index++;
        });
    } else {
        // alert( "Your browser not support local storage" );
    }
}

export const checkoutFunctuions = {
    isValidPayingAmount, GetRoundCash, getAmount, setOrderPayments, getOrderPayments, removeOrderPayments
}
export default checkoutFunctuions;