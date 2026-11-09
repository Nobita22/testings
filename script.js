let products = [];
let cart = [];

const whatsappNumber = "911234567898";

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    if (!response.ok) throw new Error("Could not load products");
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    document.getElementById("products").textContent =
      "Unable to load products. Please run the site using a local server.";
  }
}

function displayProducts(items) {
  const container = document.getElementById("products");

  container.innerHTML = items.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}"
        onerror="this.src='media/product-placeholder.jpg'">
      <div class="product-info">
        <small>${product.category}</small>
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button class="add-btn" onclick="addToCart(${product.id})">
          Add to Cart +
        </button>
      </div>
    </div>
  `).join("");
}

function filterProducts(category) {
  const filtered = products.filter(p => p.category === category);
  displayProducts(filtered);
  document.getElementById("shop").scrollIntoView();
}

function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();
  displayProducts(products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  ));
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(p => p.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  const total = cart.reduce((sum, p) =>
    sum + p.price * p.quantity, 0);

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = total;

  document.getElementById("cart-items").innerHTML =
    cart.length ? cart.map(p => `
      <div class="cart-item">
        <div>
          <strong>${p.name}</strong>
          <p>₹${p.price} × ${p.quantity}</p>
        </div>
        <div>
          <button onclick="changeQuantity(${p.id}, -1)">−</button>
          ${p.quantity}
          <button onclick="changeQuantity(${p.id}, 1)">+</button>
        </div>
      </div>
    `).join("") : "<p>Your cart is empty.</p>";
}

function changeQuantity(id, change) {
  const product = cart.find(p => p.id === id);
  if (!product) return;

  product.quantity += change;
  cart = cart.filter(p => p.quantity > 0);
  updateCart();
}

function toggleCart() {
  document.getElementById("cart-panel")
    .classList.toggle("active");
}

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, p) =>
    sum + p.price * p.quantity, 0);

  let message = "Hello! I would like to place an order:%0A%0A";

  cart.forEach(p => {
    message += `${encodeURIComponent(p.name)} x ${p.quantity} = ₹${p.price * p.quantity}%0A`;
  });

  message += `%0ATotal: ₹${total}`;
  message += "%0A%0APlease confirm availability and delivery details.";

  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(url, "_blank");
}

loadProducts();