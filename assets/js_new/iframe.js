// iframe

let elBtn = document.getElementById("modal-btn");
let elModal = document.getElementById("modal");

elBtn.onclick = function() {
      console.log('click: btn: ' + this.id + ', modal: ' + elModal.id);
      elModal.classList.toggle('show-popup');
    }
    /* to dispose the popup on click */
    elModal.onclick = function() {
      this.classList.toggle('show-popup');
    }