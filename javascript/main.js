const toggler = document.querySelector(".slider");
const cartModal = document.querySelector(".cart-modal");
const cartIcon = document.querySelector(".cartIcon");
const cartBtn = document.querySelector(".cartBtn");
const backDrop = document.querySelector(".backdrop");
const confirmBtn = document.querySelector(".cart-item-confirm");
const productsParent = document.querySelector(".main-child");
const cartItems = document.querySelector(".counter");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

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
let domButtons = [];

toggler.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

cartIcon.addEventListener("click", showFunc);

cartBtn.addEventListener("click", showFunc);

function showFunc() {
  backDrop.style.display = "block";
  cartModal.style.transform = "translateY(40vh)";
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
    domButtons = buttons;
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
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        cart = [...cart, addedProduct];
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(addedProduct);
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
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${cartItem.imageUrl} alt="" />
                    <div class="cart-item-desc">
                      <h4>${cartItem.title}</h4>
                      <h5>$${cartItem.price}</h5>
                    </div>
                    <div class="cart-item-controller">
                      <svg data-id=${cartItem.id}
                        class="chevron-up"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <p>${cartItem.quantity}</p>
                      <svg data-id=${cartItem.id}
                        class="chevron-down"
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <svg data-id=${cartItem.id}
                      class="trash"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>`;
    cartContent.appendChild(div);
  }
  setupApp() {
    cart = Storage.getCart() || [];
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    this.setCartValue(cart);
    this.cartLogic();
  }
  cartLogic() {
    clearCart.addEventListener("click", () => {
      cart.forEach((cItem) => this.removeItem(cItem.id));
      while (cartContent.children.length) {
        cartContent.removeChild(cartContent.children[0]);
      }
      closeFunc();
    });
    cartContent.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("chevron-up")) {
        const addQuantity = evt.target;
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (evt.target.classList.contains("trash")) {
        const removeItem = evt.target;
        const removedItem = cart.find(
          (cItem) => cItem.id == removeItem.dataset.id
        );
        this.removeItem(removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      } else if (evt.target.classList.contains("chevron-down")) {
        const subQuantity = evt.target;
        const substractedItem = cart.find(
          (cItem) => cItem.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  }
  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const button = domButtons.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "add to cart";
    button.disabled = false;
    button.style.color = "#E11D48";
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
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"))
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new Ui();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  Storage.saveProducts(productsData);
});
