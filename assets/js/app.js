const $ = document;
getData("./data.json", updateCardsCon);

function getData(url, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
      callback([]);
    });
}
function updateImageSources() {

  $.querySelectorAll('.card-img-top').forEach(img => {

    if (window.matchMedia("(max-width: 576px)").matches) {
      img.src = img.dataset.srcMobile;
    } else if (window.matchMedia("(max-width: 768px)").matches) {
      img.src = img.dataset.srcTablet;
    } else {
      img.src = img.dataset.srcDesktop;
    }

  });

}

function updateCardsCon(res) {

  let cards = res.map(card => {
    return `<div  class="col-md-4 col-12 mb-2 pe-md-4 pe-0" id='${card.name}'>
            <div class="p-0">
              <img src="${card.image.desktop}" 
                class="card-img-top p-0 rounded-1 w-100" alt="..."
                data-src-mobile="${card.image.mobile}"
                data-src-desktop="${card.image.desktop}"
                data-src-tablet="${card.image.tablet}"
                data-src-thumbnail="${card.image.thumbnail}"/>
              <div class="justify-content-center row card-btn p-0 m-0">
                <div class="col-8 rounded-5 btn-custom p-1 align-content-center">
                  <div class="beforclick d-flex justify-content-center p-0">
                    <a class="add-to-cart" onclick="addPropductToCart('${card.name}')">
                      <img src="assets/images/icon-add-to-cart.svg" alt="Description of SVG">
                      <span>add to cart</span>
                    </a>
                  </div>
                  <div class="afterclick d-flex p-1 justify-content-between text-center d-none">
                    <div class="d-flex">
                      <button class="btn border-0 p-0" onclick="increase('${card.name}')"> 
                        <span class="border rounded-circle span-svg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path class="svg-path" fill="#fff"
                              d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                          </svg>
                        </span>
                      </button>
                    </div>
                    <span class="col-2 p-0 number-of-product">1</span>
                    <div class="d-flex">
                      <button class="btn border-0 p-0" onclick="decrease('${card.name}')">
                        <span class="border rounded-circle span-svg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2">
                            <path class="svg-path" fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body row mt-1">
              <span class="text-muted  category-of-product" >${card.category}</span>
              <span class="name-of-product">${card.name}</span>
              <span class="text-danger">$<span class="price-of-product">${card.price}</span></span>
            </div>
          </div>`;
  }).join('');
  document.querySelector('.cards').innerHTML += cards;
  updateImageSources();
  window.addEventListener('resize', updateImageSources);
}

function addPropductToCart(productName) {

  changeBtnAddToCart(productName);
  let price = $.getElementById(productName).getElementsByClassName("price-of-product")[0].innerHTML;

  //If the cart is still empty, the status needs to be changed
  ($.querySelectorAll(".cart-item").length == 0) && changeStatusCart();

  $.querySelector("#cart-not-empty").insertAdjacentHTML('afterbegin', `<div class="cart-item border-bottom row mb-3 pb-2 w-100 m-auto">
    <div class="col-md-9 text-start mb-2">
      <span class="d-block cart-item-name">${productName}</span>
      <span class="text-red me-1"><span class="cart-item-number">1</span>x</span>
      <span class="me-1 text-light-muted">@$<span class="cart-item-price">${price}</span></span>
      <span class="me-1 text-dark-muted">$<span class="cart-item-total-price">${price}</sapn></span>
    </div>
    <div class="col-md-3 text-end align-content-center">
      <button class="btn border-0 p-0" onclick="removeFromCart(this)">
        <span class="rounded-circle span-svg remove">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
            <path fill="#CAAFA7" class="svg-path"
              d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
          </svg>
        </span>
      </button>
    </div>
    </div>`);
  updateCartOrderPrice();
  updateCartCounter();

}

function increase(productName) {


  let number = $.getElementById(productName).getElementsByClassName('number-of-product')[0].innerHTML;
  let price = $.getElementById(productName).getElementsByClassName("price-of-product")[0].innerHTML;

  number = parseInt(number, 10) + 1;
  $.getElementById(productName).getElementsByClassName('number-of-product')[0].innerHTML = number;
  updateCartItemInfo(productName, price, number);
  updateCartOrderPrice();
  updateCartCounter();

}

function decrease(productName) {


  let number = $.getElementById(productName).getElementsByClassName('number-of-product')[0].innerHTML;
  let price = $.getElementById(productName).getElementsByClassName("price-of-product")[0].innerHTML;

  number = parseInt(number, 10);

  if (number == 1) {

    $.querySelectorAll('.cart-item').forEach(item => {
      (item.getElementsByClassName("cart-item-name")[0].innerHTML == productName) && item.remove();
    });

    //If the cart is empty, the status needs to be changed
    ($.querySelectorAll(".cart-item").length == 0) && changeStatusCart();

    changeBtnAddToCart(productName);

  } else {

    number = --number;
    $.getElementById(productName).getElementsByClassName('number-of-product')[0].innerHTML = number;
    updateCartItemInfo(productName, price, number);

  }

  updateCartOrderPrice();
  updateCartCounter();


}

function removeFromCart(element) {

  let DivCartitem = element.parentElement.parentElement;
  DivCartitem.remove();

  //If the cart is empty, the status needs to be changed
  ($.querySelectorAll(".cart-item").length == 0) && changeStatusCart();

  let name = DivCartitem.getElementsByClassName("cart-item-name")[0].innerHTML;
  changeBtnAddToCart(name);
  updateCartOrderPrice();
  updateCartCounter();

}

function updateCartItemInfo(name, price, number) {

  $.querySelectorAll('.cart-item').forEach(item => {

    if (item.getElementsByClassName("cart-item-name")[0].innerHTML == name) {

      item.getElementsByClassName("cart-item-total-price")[0].innerHTML = parseFloat(price) * number;

      item.getElementsByClassName("cart-item-number")[0].innerHTML = number;
    }

  });

}

function updateCartOrderPrice() {

  let orderTotalPrice = 0;
  $.querySelectorAll('.cart-item-total-price').forEach(item => orderTotalPrice += parseFloat(item.innerHTML));
  $.getElementById('order-total-price').innerHTML = orderTotalPrice;

}

function changeBtnAddToCart(productName) {

  $.getElementById(productName).classList.toggle('selected');
  $.getElementById(productName).getElementsByClassName('afterclick')[0].classList.toggle('d-none');
  $.getElementById(productName).getElementsByClassName('beforclick')[0].classList.toggle('d-none');
  $.getElementById(productName).getElementsByClassName("number-of-product")[0].innerHTML = 1;

}


function changeStatusCart() {

  $.getElementById("cart-not-empty").classList.toggle("d-none");
  $.getElementById("cart-empty").classList.toggle("d-none");

}

function updateCartCounter() {

  let number = 0;
  $.querySelectorAll('.cart-item-number').forEach(item => number += parseInt(item.innerHTML));
  $.getElementById("counter-of-cart").innerHTML = number;

}

function showConfirmedOrder() {

  let orderTotalPrice = 0;
  let html = `<div class="card col-md-4 col-12 rounded-2 opacity-100 p-2 mt-5 position-absolute">
                <div class="header ms-2 me-2 mb-4 mt-2 ">
                  <img src="assets/images/icon-order-confirmed.svg" class="mb-4" />
                  <h2>Order Confirmed</h2>
                  <span>we hope you enjoy your food!</span>
                </div>
                <div class="text-center me-1 ms-1 ">
                  <div class="rounded-2 bg-rose100 p-3 mb-4">
                    <div class="text-center">`;


  $.querySelectorAll('.cart-item').forEach((item) => {

    let name = item.getElementsByClassName('cart-item-name')[0].innerHTML;
    let price = item.getElementsByClassName('cart-item-price')[0].innerHTML;
    let totalPrice = item.getElementsByClassName('cart-item-total-price')[0].innerHTML;
    let number = item.getElementsByClassName('cart-item-number')[0].innerHTML;
    let imgSrc = $.getElementById(name).getElementsByTagName('img')[0].dataset.srcThumbnail;

    orderTotalPrice += parseFloat(totalPrice);

    html += ` <div class="cart-item border-bottom row mb-3 pb-2 w-100 m-auto justify-content-between">
                <div class="col-md-9 text-start mb-2 p-0 row">
                  <div class="col-auto pe-0">
                    <div style="background-image : url('${imgSrc}');" class="rounded-2 cart-item-thumbnail-img"></div>
                  </div>
                  <div class="d-flex flex-column justify-content-between w-auto pe-0 col">
                    <div>
                      <span class="name">${name}</span>
                    </div>
                    <div>
                      <span class="text-red me-1"><span>${number}</span>x</span>
                      <span class="me-1 text-light-muted">@$<span>${price}</span></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3 text-end align-content-center p-0">
                  <span class="me-1 text-dark-muted total-price">$<span>${totalPrice}</sapn></span>
                </div>
              </div>`;
  });

  html += `<div class="order-total row mb-3">
            <div class="col-md-4 text-start m-auto">
              <span>order total</span>
            </div>
            <div class="col-md-8 text-end m-auto">
              <h5 class="m-0">$<span id="order-total-price">${orderTotalPrice}</span></h5>
            </div>
          </div>
        </div>
      </div>
          <div class="mb-4">
            <button class="border-0 rounded-5 w-100 bg-red text-light p-2 font-weight-600" onclick="startNewOrder()">
              <h6 class="m-0">
                start new order
              </h6>
            </button>
          </div>
        </div>
      </div>`;

  $.getElementById("order-confirmed").innerHTML = html;
  $.getElementById("order-confirmed").classList.remove("d-none");

}

function startNewOrder() {

  $.querySelectorAll('.selected').forEach(item => item.classList.add("confirm"));
  $.getElementById("order-confirmed").innerHTML = "";
  $.getElementById("order-confirmed").classList.add("d-none");

}







