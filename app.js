const productsEl = document.getElementById("products");
const overlay = document.getElementById("overlay");

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
  overlay.style.display = "flex";
}

function closeForm() {
  overlay.style.display = "none";
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