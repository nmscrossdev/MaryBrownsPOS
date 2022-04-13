function myFunction(evt) {
  var deafult_color = localStorage.getItem("DEFAULT_SEAT_COLOR") ? localStorage.getItem("DEFAULT_SEAT_COLOR") : '';
  var seat_id = evt.id;
  var qty = $(evt).attr(`data-quantity`);
  var product_id = $(evt).attr(`data-product-id`);
  var event_id = $(evt).attr(`data-event-id`);
  var chart_id = $(evt).attr(`data-chart-id`);
  var chart_color = $(`#${seat_id}`).css('background-color');
  var seat_label = evt.getElementsByTagName('p')[0].innerHTML;
  var seat_color = "";
  var seat_check = $(`#${seat_id}`).attr("data-checked");
  var seat_isCheck = "";
  if (chart_color == 'rgb(65, 135, 201)') {
    $(`#${seat_id}`).css("background-color", `${deafult_color}`);
    seat_color = `${deafult_color}`;
  } else if (chart_color == 'rgb(220, 203, 203)') {
    //nothing
  } else {
    $(`#${seat_id}`).css("background-color", "rgb(65, 135, 201)");
    seat_color = 'rgb(65, 135, 201)';
  }

  if (seat_check == "true") {
    $(`#${seat_id}`).attr("data-checked", "false");
    seat_isCheck = 'false';
  } else {
    $(`#${seat_id}`).attr("data-checked", "true");
    seat_isCheck = 'true';
  }

  var checkTickets = localStorage.getItem("TIKERA_SEAT_CHART") ? JSON.parse(localStorage.getItem("TIKERA_SEAT_CHART")) : new Array();
  var count = 1;
  if (checkTickets.length > 0) {
    checkTickets.map((countCheck, index) => {
      if (countCheck.seat_check == "true") {
        count += 1
      } else if (countCheck.seat_check == "false") {
        checkTickets.splice(index, 1)
      }
    })
  }

  if (chart_color !== 'rgb(220, 203, 203)') {
    if (checkTickets.length == 0) {
      checkTickets.push({
        "seat_label": seat_label,
        "chart_id": chart_id,
        "seat_id": seat_id,
        "seat_color": seat_color,
        "seat_check": seat_isCheck,
        "event_id": event_id,
        "product_id": product_id
      })
    } else {
      if (checkTickets.length > 0) {
        var find = checkTickets.find(item => item.seat_id == seat_id && item.chart_id == chart_id);
        if (find) {
          checkTickets.map(Item => {
            if (Item.seat_id == find.seat_id) {
              Item['seat_color'] = seat_color;
              Item['seat_check'] = seat_isCheck;
            }
          })
        } else {
          if (count <= qty) {
            checkTickets.push({
              "seat_label": seat_label,
              "chart_id": chart_id,
              "seat_id": seat_id,
              "seat_color": seat_color,
              "seat_check": seat_isCheck,
              "event_id": event_id,
              "product_id": product_id
            })
          } else {
            alert(`Only select ${qty} quantity.`)
            $(`#${seat_id}`).css("background-color", `${deafult_color}`);
            $(`#${seat_id}`).attr("data-checked", "false");
          }
        }
      }
    }

    localStorage.setItem("TIKERA_SEAT_CHART", JSON.stringify(checkTickets));
    var current_selected_seat = 0;
    if (checkTickets.length > 0) {
      checkTickets.map(item => {
        if (parseInt(item.product_id) == parseInt(product_id) && item.seat_check == "true") {
          current_selected_seat += 1;
        }
      })
    }
    $('#counter').text(current_selected_seat);
  }
}

/**
 * Created By : Shakuntala Jatav
 * Created Date : 28-feb-2020
 * @param {*} oliver_order_payments
 * Description : When a user makes a payment we want to tell GTM. As this happens after the page loads we can use the dataLayer.push  
 */

function GTM_oliver_payments(oliver_order_payments) {
  //var oliver_order_payments = localStorage.getItem("oliver_order_payments") ? JSON.parse(localStorage.getItem("oliver_order_payments")) : '';
  var checkout_list = localStorage.getItem('CHECKLIST') ? JSON.parse(localStorage.getItem('CHECKLIST')) : "";
  if (oliver_order_payments && oliver_order_payments.length > 0) {
    console.log("GTM oliver_order_payments");
    var unpaid_amount = parseFloat(checkout_list.totalPrice);
    var paid_amount = 0;
    oliver_order_payments.map(items => {
      paid_amount += parseFloat(items.payment_amount);
      //console.log("some paid amount", paid_amount);
      dataLayer.push({
        'event': 'payment',
        'paymentType': items.payment_type,
        'paymentAmount': parseFloat(items.payment_amount),
        'remainingBalance': parseFloat(unpaid_amount) - paid_amount
      });
    })
  }

  if (oliver_order_payments == 0) {
    dataLayer.push({
      'event': 'payment',
      'paymentType': '',
      'paymentAmount': 0,
      'remainingBalance': parseFloat(checkout_list.totalPrice)
    });
  }
}

export { myFunction, GTM_oliver_payments}
