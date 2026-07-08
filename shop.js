let products = [];

let currentProduct = null;
let currentIndex = 0;

fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data.products;
    renderProducts();
  });

function renderProducts() {

  const container =
    document.getElementById("cardsContainer");

  container.innerHTML = "";

  products.forEach(product => {

    container.innerHTML += `
      <div class="card"
           onclick="openModal(${product.id})">

        <img class="image"
             src="${product.images[0]}">

        <h2 class="title">
          ${product.title}
        </h2>

        <p class="price">
          ${product.price}₽
        </p>

        <button class="btn"
          onclick="event.stopPropagation();addToCart(${product.id}, '${product.title}', ${product.price})">
          В корзину
        </button>

      </div>
    `;
  });
}

function openModal(id) {

  currentProduct =
    products.find(p => p.id === id);

  currentIndex = 0;

  document.getElementById("productTitle")
    .textContent =
    currentProduct.title;

  document.getElementById("productDescription").innerHTML =
  currentProduct.description
    .map(row => `
      <div style="display:flex; justify-content:space-between;">
        <span>${row.label}</span>
        <span>${row.value}</span>
      </div>
    `)
    .join("");

  document.getElementById("productPrice")
    .textContent =
    `Цена: ${currentProduct.price}₽`;

  document.getElementById("galleryImage")
    .src =
    currentProduct.images[0];

  document.getElementById("buyButton")
    .onclick = () => {

      addToCart(
        currentProduct.id,
        currentProduct.title,
        currentProduct.price
      );

    };

  document.getElementById("productModal")
    .style.display =
    "block";
}

function closeModal() {

  document.getElementById("productModal")
    .style.display =
    "none";
}

function showImage() {

  document.getElementById("galleryImage")
    .src =
    currentProduct.images[currentIndex];
}

function nextImage() {

  currentIndex =
    (currentIndex + 1)
    % currentProduct.images.length;

  showImage();
}

function prevImage() {

  currentIndex =
    (currentIndex - 1 +
      currentProduct.images.length)
    % currentProduct.images.length;

  showImage();
}

function addToCart(id, title, price) {

  let cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const item =
    cart.find(p => p.id === id);

  if (item) {
    item.count++;
  }
  else {

    const product = products.find(p => p.id === id);

    cart.push({
      id,
      title,
      price,
      image: product.images[0],
      description: product.description,
      count: 1
    });

  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  alert("Товар добавлен в корзину");
}