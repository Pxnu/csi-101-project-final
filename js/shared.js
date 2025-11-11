/* ==============================================
  [Mockup] Dropdown Menu Logic
============================================== */
document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const userDropdown = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  if (authLink) {
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (userDropdown) {
        userDropdown.classList.toggle("show");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("ต้องการออกจากระบบใช่หรือไม่");
      window.location.href = "/login.html";
    });
  }

  window.addEventListener("click", (e) => {
    if (userDropdown && !e.target.closest(".nav-user-menu")) {
      userDropdown.classList.remove("show");
    }
  });
});

/* ==============================================
  ส่วนแชท
============================================== */
const messenger = document.getElementById("messenger");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

if (messenger) {
  messenger.addEventListener("click", () => {
    if (chatBox.style.display === "flex") {
      chatBox.style.display = "none";
    } else {
      chatBox.style.display = "flex";
    }
  });
}
function messengerBox() {
  if (chatBox) chatBox.style.display = "flex";
}
function messengerClose() {
  if (chatBox) chatBox.style.display = "none";
}

const closeChatButton = document.getElementById("closeChatBtn");
if (closeChatButton) {
  closeChatButton.addEventListener("click", messengerClose);
}

function addMessage(text, sender = "user") {
  if (!chatMessages) return;
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text !== "") {
      addMessage(text, "user");
      chatInput.value = "";
    }
  });
}
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
}

/* ==============================================
  ส่วน Favorite
============================================== */
function loadFavorites() {
  try {
    const raw = localStorage.getItem(SAMPLE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveFavorites(data) {
  localStorage.setItem(SAMPLE_KEY, JSON.stringify(data));
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
function formatPrice(price) {
  return price.toLocaleString("th-TH") + " บาท";
}

function toggleFavorite(item, icon) {
  let favorites = loadFavorites();
  const index = favorites.findIndex((f) => f.ID === item.ID);

  let isFavoritedNow = false;

  if (index !== -1) {
    favorites.splice(index, 1);
    showTextBox(`ลบ "${escapeHtml(item.name)}" ออกจากที่ถูกใจ`);
    isFavoritedNow = false;
  } else {
    favorites.push(item);
    showTextBox(`✅ เพิ่ม "${escapeHtml(item.name)}" ในที่ถูกใจ`);
    isFavoritedNow = true;
  }

  saveFavorites(favorites);
  updateFavCount();

  const allIconsForThisItem = document.querySelectorAll(
    `.fav[data-id="${item.ID}"]`
  );

  allIconsForThisItem.forEach((ic) => {
    if (isFavoritedNow) {
      ic.classList.add("is-favorited");
    } else {
      ic.classList.remove("is-favorited");
    }
  });
}

/* ==============================================
  ส่วนอัปเดตตัวนับ "ถูกใจ" (Navbar)
============================================== */
function updateFavCount() {
  const favCountElement = document.getElementById("fav-count");
  if (!favCountElement) return;

  const favorites = loadFavorites();
  const totalCount = favorites.length;

  if (totalCount > 0) {
    favCountElement.style.display = "inline-block";
    favCountElement.textContent = totalCount;
  } else {
    favCountElement.style.display = "none";
  }
}

/* ==============================================
  ส่วนตะกร้าสินค้า
============================================== */
const cartIcon = document.querySelector("#cart-icon");
const cartDropdown = document.querySelector("#cart-dropdown");
const cartItemsList = document.querySelector("#cart-items");
const totalPriceElement = document.querySelector("#total-price");
const closeCartBtn = document.querySelector("#closeCart");
const cartOverlay = document.querySelector("#cart-overlay");

const clearCartButton = document.querySelector(".cart-dropdown .clear");
if (clearCartButton) {
  clearCartButton.addEventListener("click", clearCart);
}

function loadCart() {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch {
    return [];
  }
}

function saveCart(cartData) {
  // ⭐️ [แก้ไข] เพิ่มพารามิเตอร์
  localStorage.setItem(CART_KEY, JSON.stringify(cartData));
}

let cart = loadCart();

function showTextBox(message) {
  const textBox = document.querySelector("#textBox");
  if (!textBox) return;
  textBox.textContent = message;
  textBox.className = "show";
  setTimeout(() => {
    textBox.className = textBox.className.replace("show", "");
  }, 2000);
}

function addToCart(item) {
  const name = item.name;
  const price = item.price;
  const imgSrc = item.img;
  const existingItem = cart.find((i) => i.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, imgSrc, quantity: 1 });
  }
  saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
  updateCart();
  showTextBox(`เพิ่มสินค้า ${name} - ${formatPrice(price)} ลงในตะกร้าแล้ว`);
}

function updateCart() {
  if (!cartItemsList) return;

  cartItemsList.innerHTML = "";
  let totalPrice = 0;
  let totalCount = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    const img = document.createElement("img");
    img.src = item.imgSrc;
    li.appendChild(img);
    const info = document.createElement("div");
    info.className = "cart-item-details";
    info.innerHTML = `<p>${escapeHtml(item.name)}</p><p>${formatPrice(
      item.price
    )}</p>`;
    li.appendChild(info);
    const minusBtn = document.createElement("button");
    minusBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
    minusBtn.style.cssText =
      "background:none; border:none; font-size:18px; cursor:pointer; margin:0 1rem;";
    minusBtn.addEventListener("click", () => {
      if (item.quantity > 1) item.quantity -= 1;
      else cart.splice(index, 1);
      saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
      updateCart();
    });
    li.appendChild(minusBtn);
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.value = item.quantity;
    qtyInput.min = 1;
    qtyInput.style.cssText =
      "width:50px; margin:0 1rem; font-size:16px; border:1px solid #000; text-align:center;";
    qtyInput.addEventListener("input", (e) => {
      let val = e.target.value;
      if (val === "") return;
      let newQty = parseInt(val);
      if (!isNaN(newQty) && newQty > 0) {
        item.quantity = newQty;
        saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
        updateCart();
      }
    });
    qtyInput.addEventListener("blur", (e) => {
      if (!e.target.value || parseInt(e.target.value) < 1) item.quantity = 1;
      else item.quantity = parseInt(e.target.value);
      qtyInput.value = item.quantity;
      saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
      updateCart();
    });
    li.appendChild(qtyInput);
    const plutBtn = document.createElement("button");
    plutBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plutBtn.style.cssText =
      "background:none; border:none; font-size:18px; cursor:pointer; margin:0 1rem;";
    plutBtn.addEventListener("click", () => {
      item.quantity += 1;
      saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
      updateCart();
    });
    li.appendChild(plutBtn);
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.className = "cart-item-remove";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
      updateCart();
    });
    li.appendChild(removeBtn);
    cartItemsList.appendChild(li);
    totalPrice += item.price * item.quantity;
    totalCount += item.quantity;
  });
  if (cart.length === 0) {
    cartItemsList.innerHTML = "<li>ตะกร้าของคุณว่างเปล่า</li>";
  }
  if (totalPriceElement) {
    totalPriceElement.textContent = `รวมทั้งหมด: ${formatPrice(totalPrice)}`;
  }
  const cartCount = document.querySelector("#cart-count");
  totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    if (totalCount > 0) {
      cartCount.style.display = "inline-block";
      cartCount.textContent = totalCount;
    } else {
      cartCount.style.display = "none";
    }
  }
}

function clearCart() {
  if (cart.length === 0) {
    showTextBox("ตะกร้าสินค้าของคุณว่างอยู่แล้ว");
    return;
  }
  const confirmClear = confirm(
    "คุณแน่ใจหรือไม่ว่าต้องการล้างสินค้าทั้งหมดในตะกร้า?"
  );
  if (confirmClear) {
    cart = [];
    saveCart(cart); // ⭐️ [แก้ไข] ส่ง cart เข้าไป
    updateCart();
    showTextBox("✅ ล้างสินค้าทั้งหมดในตะกร้าแล้ว");
  } else {
    showTextBox("❌ ยกเลิกการล้างตะกร้า");
  }
}

if (cartIcon) {
  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    updateCart();
    if (cartDropdown) cartDropdown.style.display = "block";
    if (cartOverlay) cartOverlay.style.display = "block";
  });
}
if (closeCartBtn) {
  closeCartBtn.addEventListener("click", function () {
    if (cartDropdown) cartDropdown.style.display = "none";
    if (cartOverlay) cartOverlay.style.display = "none";
  });
}
if (cartOverlay) {
  cartOverlay.addEventListener("click", function () {
    if (cartDropdown) cartDropdown.style.display = "none";
    if (cartOverlay) cartOverlay.style.display = "none";
  });
}

/* ==============================================
  ⭐️ [อัปเดต] ฟังก์ชันลบสินค้า
============================================== */
function handleDeleteProduct(item) {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${item.name}"?`)) {
    return;
  }

  try {
    // 1. ลบออกจากรายการสินค้าหลัก
    let currentProducts = allProducts.filter((p) => p.ID !== item.ID);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentProducts));

    // 2. ลบออกจากรายการ ID "สินค้าของเรา"
    let myProductIDs = JSON.parse(localStorage.getItem("myProductIDs")) || [];
    myProductIDs = myProductIDs.filter((id) => id !== item.ID);
    localStorage.setItem("myProductIDs", JSON.stringify(myProductIDs));

    // 3. ⭐️ [ใหม่] ลบออกจากตะกร้าสินค้า (เช็คด้วยชื่อ)
    let currentCart = loadCart();
    currentCart = currentCart.filter((cartItem) => cartItem.name !== item.name);
    saveCart(currentCart); // ส่งตัวแปรที่อัปเดตแล้วเข้าไป

    // 4. ⭐️ [ใหม่] ลบออกจาก "ถูกใจ" (เช็คด้วย ID)
    let currentFavorites = loadFavorites();
    currentFavorites = currentFavorites.filter(
      (favItem) => favItem.ID !== item.ID
    );
    saveFavorites(currentFavorites); // ส่งตัวแปรที่อัปเดตแล้วเข้าไป

    // 5. แจ้งเตือนและรีเฟรชหน้า
    alert("ลบสินค้าเรียบร้อยแล้ว");
    window.location.reload();
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("เกิดข้อผิดพลาดในการลบสินค้า");
  }
}

/* ==============================================
  ส่วนสร้างการ์ดสินค้า (อัปเดต)
============================================== */
function createProductCard(item, favorites) {
  const isFav = favorites.some((f) => f.ID === item.ID);

  const myProductIDs = JSON.parse(localStorage.getItem("myProductIDs")) || [];
  const isMyProduct = myProductIDs.includes(item.ID);

  const deleteButtonHTML = isMyProduct
    ? `<i class="fa-solid fa-trash delete-btn" title="ลบสินค้าของคุณ"></i>`
    : "";

  const card = document.createElement("div");
  card.className = "item";
  card.innerHTML = `
    <div class="header">
        <a href="#" class="user-info">
            <i class="fa-solid fa-circle-user profile-icon"></i>
            <span>Username</span>
        </a>
        <div class="actions">
            ${deleteButtonHTML} 
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
        <button class="add" type="button"><i class="fa-solid fa-cart-shopping"></i>เพิ่มลงตะกร้า</button>
        <button class="buy" type="button">แชทกับผู้ขาย</button>
    </div>
  `;
  const favIcon = card.querySelector(".fav");
  favIcon.addEventListener("click", () => toggleFavorite(item, favIcon));
  const addBtn = card.querySelector(".add");
  addBtn.addEventListener("click", () => addToCart(item));
  const buyBtn = card.querySelector(".buy");
  buyBtn.addEventListener("click", messengerBox);

  if (isMyProduct) {
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleDeleteProduct(item);
    });
  }

  return card;
}
