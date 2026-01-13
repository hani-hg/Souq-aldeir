if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

const productsEl = document.getElementById("products");
const modal = document.getElementById("formModal");

let products = JSON.parse(localStorage.getItem("products")) || [];

function render() {
  productsEl.innerHTML = "";
  products.forEach(p => {
    productsEl.innerHTML += `
      <div class="card">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
        <strong>${p.price}</strong>
        <a href="https://wa.me/${p.phone}" target="_blank">واتساب</a>
      </div>
    `;
  });
}

function openForm() {
  modal.style.display = "block";
}

function closeForm() {
  modal.style.display = "none";
}

function addProduct() {
  const p = {
    title: title.value,
    price: price.value,
    phone: phone.value,
    desc: desc.value
  };
  products.unshift(p);
  localStorage.setItem("products", JSON.stringify(products));
  closeForm();
  render();
}

render();