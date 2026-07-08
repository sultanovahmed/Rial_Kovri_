// Контейнер, куда вставляются карточки корзины
const container = document.querySelector(".cards");

// ================================
// Работа с localStorage
// ================================

// Получаем корзину
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Сохраняем корзину
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ================================
// Отрисовка корзины
// ================================

function renderCart() {
  const cart = getCart();

  // Очищаем контейнер
  container.innerHTML = "";

  // Если корзина пустая
  if (cart.length === 0) {
    container.innerHTML = "<h2>Корзина пуста</h2>";
    return;
  }

  // Рисуем каждый товар
  cart.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img class="card-img" src="${item.image || 'img/carpet1/carpet.png'}" />

      <div class="card-content">
        <h1>${item.title}</h1>

        <div class="p-bg">
          ${item.description
            .map(row => `
              <div class="Desp-names">
                <p>${row.label}:</p>
                <p>${row.value}</p>
              </div>
            `)
          .join("")}
        </div>

        <div class="controls">
          <button class="btn" data-i="${index}" data-d="-1">-</button>
          <span class="count">${item.count}</span>
          <button class="btn" data-i="${index}" data-d="1">+</button>
        </div>
      </div>

      <div class="price">${item.price * item.count}₽</div>
    `;

    container.appendChild(card);
  });
}

// ================================
// Обработка кнопок + / -
// ================================

container.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn")) return;

  const index = Number(e.target.dataset.i);
  const delta = Number(e.target.dataset.d);

  const cart = getCart();
  cart[index].count += delta;

  // Если количество 0 — удаляем товар
  if (cart[index].count <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
});

// ================================
// ЗАПОЛНЕНИЕ ЗАКАЗА ПЕРЕД ОТПРАВКОЙ
// ================================

document.addEventListener("submit", (e) => {
  if (e.target.id !== "orderForm") return;

  const cart = getCart();
  const orderField = document.getElementById("order");

  orderField.value = cart
    .map(
      item =>
        `${item.title} — ${item.count} шт. — ${item.price * item.count}₽`
    )
    .join("\n");
});

// ================================
// Первая отрисовка
// ================================

renderCart();

// ================================
// Модалка оформления
// ================================

function openOrderModal() {
  document.getElementById("orderModal").style.display = "block";
}

function closeOrderModal() {
  document.getElementById("orderModal").style.display = "none";
}
