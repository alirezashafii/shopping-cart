const toggler = document.querySelector(".slider");
const cart = document.querySelector(".cart");
const cartIcon = document.querySelector(".cartIcon");
const cartBtn = document.querySelector(".cartBtn");
const backDrop = document.querySelector(".backdrop");
const confirmBtn = document.querySelector(".cart-item-confirm");
const productsParent = document.querySelector(".main-child");

import { productsData } from "./products.js";

toggler.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

cartIcon.addEventListener("click", showFunc);

cartBtn.addEventListener("click", showFunc);

function showFunc() {
  backDrop.style.display = "block";
  cart.style.transform = "translateY(30vh)";
  cart.style.opacity = "1";
}

backDrop.addEventListener("click", closeFunc);

confirmBtn.addEventListener("click", closeFunc);

function closeFunc() {
  backDrop.style.display = "none";
  cart.style.transform = "translateY(-100vh)";
  cart.style.opacity = "0";
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
}

class Storage {
  static saveProducts(datas) {
    localStorage.setItem("products", JSON.stringify(datas));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new Ui();
  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
});
