const toggler = document.querySelector(".slider");
const cartModal = document.querySelector(".cart-modal");
const cartIcon = document.querySelector(".cartIcon");
const cartBtn = document.querySelector(".cartBtn");
const backDrop = document.querySelector(".backdrop");
const confirmBtn = document.querySelector(".cart-item-confirm");
const productsParent = document.querySelector(".main-child");
const cartItems = document.querySelector(".counter");
const cartTotal = document.querySelector(".cart-total");

// Scroll Tracker
import "https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js";

const scrollTracker = document.querySelector(".scroll-tracker");

const scrollTrackingTimeline = new ScrollTimeline({
  source: document.scrollingElement,
  orientation: "block",
  scrollOffsets: [CSS.percent(0), CSS.percent(100)],
});

scrollTracker.animate(
  {
    transform: ["scaleX(0)", "scaleX(1)"],
  },
  {
    duration: 1,
    timeline: scrollTrackingTimeline,
  }
);

import { productsData } from "./products.js";

let cart = [];

toggler.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

cartIcon.addEventListener("click", showFunc);

cartBtn.addEventListener("click", showFunc);

function showFunc() {
  backDrop.style.display = "block";
  cartModal.style.transform = "translateY(30vh)";
  cartModal.style.opacity = "1";
}

backDrop.addEventListener("click", closeFunc);

confirmBtn.addEventListener("click", closeFunc);

function closeFunc() {
  backDrop.style.display = "none";
  cartModal.style.transform = "translateY(-100vh)";
  cartModal.style.opacity = "0";
}

class Products {
  getProducts() {
    return productsData;
  }
}

class Ui {
  displayProducts(items) {
    let result = "";
    items.forEach((item) => {
      result += `<div class="item">
                  <img src=${item.imageUrl} alt="" loading="lazy">
                  <section class="description">
                      <p class="title">${item.title}</p>
                      <p class="price">$${item.price}</p>
                  </section>
                  <button class="add-to-cart" data-id=${item.id}>
                    add to cart
                  </button>
                </div>`;
      productsParent.innerHTML = result;
    });
  }
  getAddToCartBtn() {
    const addToCartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtn];
    if (cart.length === 0) {
      cart = JSON.parse(localStorage.getItem("cart"));
      if (cart === null) cart = [];
    }
    buttons.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "added";
        btn.disabled = true;
        btn.style.color = "#FB7185";
      }
      btn.addEventListener("click", (evt) => {
        evt.target.innerText = "added";
        evt.target.disabled = true;
        evt.target.style.color = "#FB7185";
        const addedProduct = Storage.getProduct(id);
        cart = [...cart, { ...addedProduct, quantity: 1 }];
        Storage.saveCart(cart);
        this.setCartValue(cart);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `Total price: $${totalPrice.toFixed(2)}`;
    cartItems.innerText = tempCartItems;
  }
}

class Storage {
  static saveProducts(datas) {
    localStorage.setItem("products", JSON.stringify(datas));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new Ui();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  Storage.saveProducts(productsData);
});
