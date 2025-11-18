let favorites = []; // ตัวแปรเก็บรายการถูกใจสำหรับหน้านี้
const container = document.getElementById("fav_container");
const emptyText = document.getElementById("emptytext");

// ปุ่มปิด Chat (สำหรับหน้า Favorite)
const closeChatBtnFav = document.getElementById("closeChatBtn");
if (closeChatBtnFav) {
  closeChatBtnFav.addEventListener("click", messengerClose);
}

/**
 * โหลดข้อมูล "ถูกใจ" จาก localStorage มาใส่ในตัวแปร 'favorites'
 */
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

/**
 * บันทึกข้อมูลตัวแปร 'favorites' ลง localStorage
 */
function saveFavoritesItem() {
  try {
    localStorage.setItem(SAMPLE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error("saveFavoritesItem_Error:", err);
  }
}

/**
 * สร้างการ์ดสินค้าสำหรับหน้า "ถูกใจ" (มีการ์ดที่แตกต่างจาก shared.js)
 * @param {object} item - อ็อบเจกต์สินค้า
 * @returns {HTMLElement} - Element ของการ์ด
 */
function createCardFavoritesItem(item) {
  const card = document.createElement("div");
  card.className = "item";
  card.setAttribute("data-id", item.ID);

  // โหลดสถานะถูกใจล่าสุด (เพื่อความแน่ใจ)
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
              isFav ? "is-favorited" : "" // ใช้สถานะล่าสุด
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

  // Event: คลิกหัวใจ (Toggle Favorite)
  const favIcon = card.querySelector(".fav");
  favIcon.addEventListener("click", () => {
    toggleFavorite(item, favIcon); // เรียกใช้ฟังก์ชันจาก shared.js
    loadFavoritesItem(); // โหลดข้อมูลใหม่
    renderFavoritesItem(); // วาดหน้าจอใหม่ (เพื่อให้สินค้าหายไป)
  });

  // Event: คลิกปุ่มเพิ่มลงตะกร้า
  const addToCartBtn = card.querySelector(".add");
  addToCartBtn.addEventListener("click", () => addToCart(item)); // จาก shared.js

  // Event: คลิกปุ่มแชท
  const buyBtn = card.querySelector(".buy");
  buyBtn.addEventListener("click", () => {
    window.location.href='/chat.html'; // ไปหน้าแชทเต็มจอ
  });

  // Event: คลิกปุ่มลบ (ออกจากหน้านี้)
  const removeBtn = card.querySelector("[data-action='remove']");
  removeBtn.addEventListener("click", () =>
    removeItemWithAnimations(item.ID, card)
  );

  return card;
}

/**
 * แสดงผลสินค้าที่ถูกใจทั้งหมด
 */
function renderFavoritesItem() {
  if (!container) return;
  container.innerHTML = "";

  // ตรวจสอบว่ามีสินค้าที่ถูกใจหรือไม่
  if (!favorites || favorites.length === 0) {
    if (emptyText) emptyText.textContent = "⚠️ยังไม่มีสินค้าที่คุณถูกใจ⚠️";
    return;
  } else {
    if (emptyText) emptyText.textContent = "";
  }

  // สร้างการ์ดทีละใบ
  const fragment = document.createDocumentFragment();
  favorites.forEach((item) => {
    fragment.appendChild(createCardFavoritesItem(item));
  });
  container.appendChild(fragment);
}

/**
 * ลบสินค้าออกจากอาร์เรย์ 'favorites' ด้วย ID
 * @param {string|number} id - ID ของสินค้า
 */
function removeFavoriteById(id) {
  favorites = favorites.filter((item) => item.ID !== id);
  saveFavoritesItem(); // บันทึกลง localStorage
}

/**
 * ลบสินค้า (พร้อม Animation)
 * @param {string|number} id - ID ของสินค้า
 * @param {HTMLElement} card - Element ของการ์ดที่ต้องการลบ
 */
function removeItemWithAnimations(id, card) {
  card.classList.add("removing"); // เพิ่ม class 'removing' (สำหรับ CSS Animation)
  // รอให้ Animation จบ (300ms) ค่อยลบข้อมูลจริงและวาดใหม่
  setTimeout(() => {
    removeFavoriteById(id);
    renderFavoritesItem();
    updateFavCount(); // อัปเดตตัวนับที่ Navbar
  }, 300);
}

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
  loadFavoritesItem(); // โหลดข้อมูล
  renderFavoritesItem(); // แสดงผล
  updateCart(); // อัปเดต UI ตะกร้า
  updateFavCount(); // อัปเดต UI ถูกใจ
});