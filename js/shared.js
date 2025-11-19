/* ==============================================
  จัดการ Dropdown ของผู้ใช้ และการ Logout
============================================== */
document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const userDropdown = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");

  // เมื่อคลิกที่ไอคอนผู้ใช้ (auth-link)
  if (authLink) {
    authLink.addEventListener("click", (e) => {
      e.preventDefault(); // ป้องกันการเปลี่ยนหน้า
      if (userDropdown) {
        // สลับการแสดงผลของ dropdown
        userDropdown.classList.toggle("show");
      }
    });
  }

  // เมื่อคลิกปุ่ม Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // ใช้ confirm เพื่อยืนยันก่อนออกจากระบบ
      if (confirm("ต้องการออกจากระบบใช่หรือไม่")) {
        window.location.href = "/index.html"; // ไปยังหน้า login
      }
    });
  }

  // ปิด Dropdown เมื่อคลิกที่อื่นนอกเมนู
  window.addEventListener("click", (e) => {
    if (userDropdown && !e.target.closest(".nav-user-menu")) {
      userDropdown.classList.remove("show");
    }
  });

  // อัปเดต UI ของตะกร้าและถูกใจทันทีที่หน้าโหลด
  updateCart();
  updateFavCount();
});

/* ==============================================
  ซิงค์ข้อมูล (Sync) ตะกร้าและถูกใจข้ามแท็บ (Tabs)
============================================== */
window.addEventListener('storage', (event) => {
    // ตรวจสอบว่า key ที่เปลี่ยนใน localStorage คือ CART_KEY
    if (event.key === CART_KEY) {
        console.log("Storage Sync: Cart changed!");
        cart = loadCart(); // โหลดข้อมูลตะกร้าใหม่
        updateCart(); // อัปเดต UI ตะกร้า
    }
    
    // ตรวจสอบว่า key ที่เปลี่ยนใน localStorage คือ SAMPLE_KEY (ถูกใจ)
    if (event.key === SAMPLE_KEY) {
        console.log("Storage Sync: Favorites changed!");
        updateFavCount(); // อัปเดต UI ถูกใจ
    }
});

/* ==============================================
  จัดการกล่องแชท (Chat Widget)
============================================== */
const messenger = document.getElementById("messenger");
const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

// เปิด/ปิด กล่องแชทเมื่อคลิกไอคอน messenger
if (messenger) {
  messenger.addEventListener("click", () => {
    if (chatBox.style.display === "flex") {
      chatBox.style.display = "none";
    } else {
      chatBox.style.display = "flex";
    }
  });
}
// ฟังก์ชันสำหรับเปิดกล่องแชท (ใช้จากที่อื่นได้)
function messengerBox() {
  if (chatBox) chatBox.style.display = "flex";
}
// ฟังก์ชันสำหรับปิดกล่องแชท
function messengerClose() {
  if (chatBox) chatBox.style.display = "none";
}

// ปุ่มปิดในกล่องแชท
const closeChatButton = document.getElementById("closeChatBtn");
if (closeChatButton) {
  closeChatButton.addEventListener("click", messengerClose);
}

/**
 * เพิ่มข้อความลงในกล่องแชท
 * @param {string} text - ข้อความที่จะเพิ่ม
 * @param {string} sender - ผู้ส่ง ('user' หรือ 'bot')
 */
function addMessage(text, sender = "user") {
  if (!chatMessages) return;
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatMessages.appendChild(msg);
  // เลื่อน scroll ไปที่ข้อความล่าสุด
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// เมื่อคลิกปุ่มส่ง
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text !== "") {
      addMessage(text, "user");
      chatInput.value = "";
    }
  });
}
// เมื่อกด Enter ในช่อง input
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  });
}

/* ==============================================
  ฟังก์ชันเกี่ยวกับ "ถูกใจ" (Favorites)
============================================== */

/**
 * โหลดข้อมูล "ถูกใจ" จาก localStorage
 * @returns {Array} - อาร์เรย์ของสินค้าที่ถูกใจ
 */
function loadFavorites() {
  try {
    const raw = localStorage.getItem(SAMPLE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // ถ้ามีข้อผิดพลาด (เช่น JSON ผิด) คืนค่าอาร์เรย์ว่าง
  }
}

/**
 * บันทึกข้อมูล "ถูกใจ" ลง localStorage
 * @param {Array} data - อาร์เรย์ของสินค้าที่ถูกใจ
 */
function saveFavorites(data) {
  localStorage.setItem(SAMPLE_KEY, JSON.stringify(data));
}

/**
 * แปลงอักขระพิเศษ HTML (ป้องกัน XSS)
 * @param {string} text - ข้อความ
 * @returns {string} - ข้อความที่แปลงแล้ว
 */
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

/**
 * จัดรูปแบบราคาเป็นสกุลเงินไทย
 * @param {number} price - ราคา
 * @returns {string} - ราคาในรูปแบบ "x,xxx บาท"
 */
function formatPrice(price) {
  return price.toLocaleString("th-TH") + " บาท";
}

/**
 * สลับสถานะ "ถูกใจ" (เพิ่ม/ลบ)
 * @param {object} item - อ็อบเจกต์สินค้า
 * @param {HTMLElement} icon - ไอคอนรูปหัวใจที่ถูกคลิก
 */
function toggleFavorite(item, icon) {
  let favorites = loadFavorites();
  const index = favorites.findIndex((f) => f.ID === item.ID);
  let isFavoritedNow = false;

  if (index !== -1) {
    // ถ้ามีอยู่แล้ว (กดซ้ำ) = ลบออก
    favorites.splice(index, 1);
    showTextBox(`ลบ "${escapeHtml(item.name)}" ออกจากที่ถูกใจ`);
    isFavoritedNow = false;
  } else {
    // ถ้ายังไม่มี = เพิ่มเข้า
    favorites.push(item);
    showTextBox(`✅ เพิ่ม "${escapeHtml(item.name)}" ในที่ถูกใจ`);
    isFavoritedNow = true;
  }

  saveFavorites(favorites); // บันทึกข้อมูลใหม่
  updateFavCount(); // อัปเดตตัวเลขที่ Navbar

  // อัปเดตไอคอนหัวใจทั้งหมดที่เกี่ยวข้องกับสินค้านี้ (ในทุกหน้า)
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
  อัปเดตตัวนับ "ถูกใจ" (Navbar)
============================================== */
function updateFavCount() {
  const favCountElement = document.getElementById("fav-count");
  if (!favCountElement) return;

  const favorites = loadFavorites();
  const totalCount = favorites.length;

  // แสดงตัวเลขถ้ามีมากกว่า 0, ซ่อนถ้าเป็น 0
  if (totalCount > 0) {
    favCountElement.style.display = "inline-block";
    favCountElement.textContent = totalCount;
  } else {
    favCountElement.style.display = "none";
  }
}

/* ==============================================
  ฟังก์ชันเกี่ยวกับ "ตะกร้าสินค้า" (Cart)
============================================== */
// ดึง Element ที่เกี่ยวข้องกับตะกร้า
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

/**
 * โหลดข้อมูลตะกร้าจาก localStorage
 * @returns {Array} - อาร์เรย์ของสินค้าในตะกร้า
 */
function loadCart() {
  try {
    const rawCart = localStorage.getItem(CART_KEY);
    return rawCart ? JSON.parse(rawCart) : [];
  } catch {
    return [];
  }
}

/**
 * บันทึกข้อมูลตะกร้าลง localStorage
 * @param {Array} cartData - อาร์เรย์สินค้าในตะกร้า
 */
function saveCart(cartData) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartData));
}

// ตัวแปร global สำหรับเก็บสถานะตะกร้าปัจจุบัน
let cart = loadCart();

/**
 * แสดงกล่องข้อความแจ้งเตือน (Toast Notification)
 * @param {string} message - ข้อความที่จะแสดง
 */
function showTextBox(message) {
  const textBox = document.querySelector("#textBox");
  if (!textBox) return;
  textBox.textContent = message;
  textBox.className = "show"; // เพิ่ม class 'show' เพื่อแสดงผล
  // ซ่อนหลังจาก 2 วินาที
  setTimeout(() => {
    textBox.className = textBox.className.replace("show", "");
  }, 2000);
}

/**
 * เพิ่มสินค้าลงในตะกร้า
 * @param {object} item - อ็อบเจกต์สินค้า
 */
function addToCart(item) {
  const name = item.name;
  const price = item.price;
  const imgSrc = item.img;
  
  // ตรวจสอบว่ามีสินค้านี้ในตะกร้าหรือยัง
  const existingItem = cart.find((i) => i.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1; // ถ้ามี, เพิ่มจำนวน
  } else {
    cart.push({ name, price, imgSrc, quantity: 1 }); // ถ้าไม่มี, เพิ่มใหม่
  }
  
  saveCart(cart); // บันทึกตะกร้า
  updateCart(); // อัปเดต UI
  showTextBox(`เพิ่มสินค้า ${name} - ${formatPrice(price)} ลงในตะกร้าแล้ว`);
}

/**
 * อัปเดต UI ของตะกร้าสินค้า (Dropdown และตัวนับ)
 */
function updateCart() {
  if (!cartItemsList) return;

  cartItemsList.innerHTML = ""; // ล้างรายการเก่า
  let totalPrice = 0;
  let totalCount = 0;

  // วนลูปสร้างรายการสินค้าในตะกร้า
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    
    // รูปภาพ
    const img = document.createElement("img");
    img.src = item.imgSrc;
    li.appendChild(img);
    
    // รายละเอียด
    const info = document.createElement("div");
    info.className = "cart-item-details";
    info.innerHTML = `<p>${escapeHtml(item.name)}</p><p>${formatPrice(
      item.price
    )}</p>`;
    li.appendChild(info);
    
    // ปุ่มลบ (-)
    const minusBtn = document.createElement("button");
    minusBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';
    minusBtn.style.cssText = "background:none; border:none; font-size:18px; cursor:pointer; margin:0 1rem;";
    minusBtn.addEventListener("click", () => {
      if (item.quantity > 1) item.quantity -= 1; // ลดจำนวน
      else cart.splice(index, 1); // ถ้าเหลือ 1 ชิ้น ให้ลบออก
      saveCart(cart);
      updateCart();
    });
    li.appendChild(minusBtn);
    
    // ช่องใส่จำนวน
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.value = item.quantity;
    qtyInput.min = 1;
    qtyInput.style.cssText = "width:50px; margin:0 1rem; font-size:16px; border:1px solid #000; text-align:center;";
    // อัปเดตเมื่อพิมพ์
    qtyInput.addEventListener("input", (e) => {
      let val = e.target.value;
      if (val === "") return;
      let newQty = parseInt(val);
      if (!isNaN(newQty) && newQty > 0) {
        item.quantity = newQty;
        saveCart(cart);
        updateCart();
      }
    });
    // ตรวจสอบเมื่อ focus ออก
    qtyInput.addEventListener("blur", (e) => {
      if (!e.target.value || parseInt(e.target.value) < 1) item.quantity = 1;
      else item.quantity = parseInt(e.target.value);
      qtyInput.value = item.quantity;
      saveCart(cart);
      updateCart();
    });
    li.appendChild(qtyInput);

    // ปุ่มเพิ่ม (+)
    const plutBtn = document.createElement("button");
    plutBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
    plutBtn.style.cssText = "background:none; border:none; font-size:18px; cursor:pointer; margin:0 1rem;";
    plutBtn.addEventListener("click", () => {
      item.quantity += 1;
      saveCart(cart);
      updateCart();
    });
    li.appendChild(plutBtn);

    // ปุ่มลบ (x)
    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "&times;";
    removeBtn.className = "cart-item-remove";
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      updateCart();
    });
    li.appendChild(removeBtn);
    
    cartItemsList.appendChild(li);
    
    totalPrice += item.price * item.quantity;
    totalCount += item.quantity;
  });

  // แสดงข้อความถ้าตะกร้าว่าง
  if (cart.length === 0) {
    cartItemsList.innerHTML = "<li>ตะกร้าของคุณว่างเปล่า</li>";
  }

  // อัปเดตราคารวม
  if (totalPriceElement) {
    totalPriceElement.textContent = `รวมทั้งหมด: ${formatPrice(totalPrice)}`;
  }
  
  // อัปเดตตัวนับที่ไอคอนตะกร้า (Navbar)
  const cartCount = document.querySelector("#cart-count");
  totalCount = cart.reduce((sum, item) => sum + item.quantity, 0); // คำนวณจำนวนรวมใหม่
  if (cartCount) {
    if (totalCount > 0) {
      cartCount.style.display = "inline-block";
      cartCount.textContent = totalCount;
    } else {
      cartCount.style.display = "none";
    }
  }
}

/**
 * ล้างสินค้าทั้งหมดในตะกร้า
 */
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
    saveCart(cart);
    updateCart();
    showTextBox("✅ ล้างสินค้าทั้งหมดในตะกร้าแล้ว");
  } else {
    showTextBox("❌ ยกเลิกการล้างตะกร้า");
  }
}

// Event Listeners สำหรับเปิด/ปิดตะกร้า
if (cartIcon) {
  cartIcon.addEventListener("click", function (e) {
    e.preventDefault();
    updateCart(); // อัปเดตข้อมูลก่อนแสดง
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
  ฟังก์ชันลบสินค้า (สำหรับเจ้าของสินค้า)
============================================== */
function handleDeleteProduct(item) {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${item.name}"?`)) {
    return;
  }

  try {
    // 1. ลบออกจากรายการสินค้าหลัก (allProducts)
    let currentProducts = allProducts.filter((p) => p.ID !== item.ID);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentProducts));

    // 2. ลบออกจากรายการ ID "สินค้าของเรา" (myProductIDs)
    let myProductIDs = JSON.parse(localStorage.getItem("myProductIDs")) || [];
    myProductIDs = myProductIDs.filter((id) => id !== item.ID);
    localStorage.setItem("myProductIDs", JSON.stringify(myProductIDs));

    // 3. ลบออกจากตะกร้าสินค้า (Cart) - (เช็คด้วยชื่อ)
    let currentCart = loadCart();
    currentCart = currentCart.filter((cartItem) => cartItem.name !== item.name);
    saveCart(currentCart); 

    // 4. ลบออกจาก "ถูกใจ" (Favorites) - (เช็คด้วย ID)
    let currentFavorites = loadFavorites();
    currentFavorites = currentFavorites.filter(
      (favItem) => favItem.ID !== item.ID
    );
    saveFavorites(currentFavorites);

    // 5. แจ้งเตือนและรีเฟรชหน้า
    alert("ลบสินค้าเรียบร้อยแล้ว");
    window.location.reload();
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("เกิดข้อผิดพลาดในการลบสินค้า");
  }
}

/* ==============================================
  ฟังก์ชันสร้างการ์ดสินค้า (Product Card)
============================================== */
function createProductCard(item, favorites) {
  // ตรวจสอบว่าสินค้านี้ถูกใจหรือยัง
  const isFav = favorites.some((f) => f.ID === item.ID);

  // ตรวจสอบว่าสินค้านี้เป็นของเราหรือไม่
  const myProductIDs = JSON.parse(localStorage.getItem("myProductIDs")) || [];
  const isMyProduct = myProductIDs.includes(item.ID);

  // สร้างปุ่มลบ (ถ้าเป็นสินค้าของเรา)
  const deleteButtonHTML = isMyProduct
    ? `<i class="fa-solid fa-trash delete-btn" title="ลบสินค้าของคุณ"></i>`
    : "";

  // สร้าง Card
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
  
  // เพิ่ม Event Listener ให้ปุ่มต่างๆ
  const favIcon = card.querySelector(".fav");
  favIcon.addEventListener("click", () => toggleFavorite(item, favIcon));
  
  const addBtn = card.querySelector(".add");
  addBtn.addEventListener("click", () => addToCart(item));
  
  const buyBtn = card.querySelector(".buy");
  buyBtn.addEventListener("click", messengerBox); // เปิดกล่องแชท (Widget)

  // ถ้าเป็นสินค้าของเรา ให้เพิ่ม Event Listener ให้ปุ่มลบ
  if (isMyProduct) {
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // ป้องกันการคลิกซ้อน
      handleDeleteProduct(item);
    });
  }

  return card;
}