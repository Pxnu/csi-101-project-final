let favorites = [];
const container = document.getElementById("fav_container");
const emptyText = document.getElementById("emptytext");

const closeChatBtnFav = document.getElementById("closeChatBtn");
if (closeChatBtnFav) {
  closeChatBtnFav.addEventListener("click", messengerClose);
}

function loadFavoritesItem() {
  try {
    const raw = localStorage.getItem(SAMPLE_KEY);
    if (!raw) {
      favorites = [];
      return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      favorites = [];
      return;
    }
    favorites = parsed;
  } catch (err) {
    console.error("LoadFavoritesItem_ERROR:", err);
    favorites = [];
  }
}

function saveFavoritesItem() {
  try {
    localStorage.setItem(SAMPLE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error("saveFavoritesItem_Error:", err);
  }
}

function createCardFavoritesItem(item) {
  const card = document.createElement("div");
  card.className = "item";
  card.setAttribute("data-id", item.ID);

  const currentFavorites = loadFavorites();
  const isFav = currentFavorites.some((f) => f.ID === item.ID);

  card.innerHTML = `
    <div class="header">
        <a href="#" class="user-info">
            <i class="fa-solid fa-circle-user profile-icon"></i>
            <span>Username</span>
        </a>
        <div class="actions">
            <i class="fa-solid fa-heart fav ${
              isFav ? "is-favorited" : ""
            }" data-id="${item.ID}"></i>
            <i class="fa-solid fa-ellipsis options"></i>
        </div>
    </div>
    <img class="productImg" src="${item.img}" alt="${escapeHtml(item.name)}" 
         onerror="this.src='https://picsum.photos/400?random=${item.ID}'">
    <p class="productName">${escapeHtml(item.name)}</p>
    <p class="productPrice">${formatPrice(item.price)}</p>
    <div class="button-group">
        <button class="add" type="button"><i class="fa-solid fa-cart-shopping"></i>ตะกร้า</button>
        <button class="buy" type="button">แชท</button>
        <button class="remove" data-action="remove" type="button">ลบ</button>
    </div>
  `;

  const favIcon = card.querySelector(".fav");
  favIcon.addEventListener("click", () => {
    toggleFavorite(item, favIcon);
    loadFavoritesItem();
    renderFavoritesItem();
  });

  const addToCartBtn = card.querySelector(".add");
  addToCartBtn.addEventListener("click", () => addToCart(item));

  const buyBtn = card.querySelector(".buy");
  buyBtn.addEventListener("click", () => {
    window.location.href='/chat.html'
  });

  const removeBtn = card.querySelector("[data-action='remove']");
  removeBtn.addEventListener("click", () =>
    removeItemWithAnimations(item.ID, card)
  );

  return card;
}

function renderFavoritesItem() {
  if (!container) return;
  container.innerHTML = "";

  if (!favorites || favorites.length === 0) {
    if (emptyText) emptyText.textContent = "⚠️ยังไม่มีสินค้าที่คุณถูกใจ⚠️";
    return;
  } else {
    if (emptyText) emptyText.textContent = "";
  }

  const fragment = document.createDocumentFragment();
  favorites.forEach((item) => {
    fragment.appendChild(createCardFavoritesItem(item));
  });
  container.appendChild(fragment);
}

function removeFavoriteById(id) {
  favorites = favorites.filter((item) => item.ID !== id);
  saveFavoritesItem();
}

function removeItemWithAnimations(id, card) {
  card.classList.add("removing");
  setTimeout(() => {
    removeFavoriteById(id);
    renderFavoritesItem();
    updateFavCount();
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  loadFavoritesItem();
  renderFavoritesItem();
  updateCart();
  updateFavCount();
});
