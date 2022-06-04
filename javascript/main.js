const toggler = document.querySelector(".slider");
const cart = document.querySelector(".cart");
const cartIcon = document.querySelector(".cartIcon");
const cartBtn = document.querySelector(".cartBtn");
const backDrop = document.querySelector(".backdrop");
const confirmBtn = document.querySelector(".cart-item-confirm");

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