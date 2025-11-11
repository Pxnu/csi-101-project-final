// ⭐️ [ใหม่] เราจะใช้ Event Delegation กับปุ่มลบ
document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("product-list-container");
  const addBtn = document.getElementById("add-product-btn");
  const submitBtn = document.getElementById("submit-all-btn");

  // 1. สร้างฟอร์มสินค้าชิ้นแรกเมื่อโหลดหน้า
  createNewProductForm();

  // 2. เมื่อคลิกปุ่ม "เพิ่มสินค้ารายการถัดไป"
  if (addBtn) {
    addBtn.addEventListener("click", createNewProductForm);
  }

  // 3. เมื่อคลิกปุ่ม "วางขายสินค้าทั้งหมด"
  if (submitBtn) {
    submitBtn.addEventListener("click", handleSubmitAll);
  }

  // 4. จัดการปุ่ม "ลบ" (Event Delegation)
  if (listContainer) {
    listContainer.addEventListener("click", (e) => {
      // ตรวจสอบว่าที่คลิกคือปุ่มลบ (ที่มี class .remove-item-btn หรือ icon ข้างใน)
      const removeButton = e.target.closest(".remove-item-btn");
      if (removeButton) {
        // หา .product-card ที่เป็นแม่ของปุ่มนี้ แล้วลบมัน
        removeButton.closest(".product-card").remove();
      }
    });
  }
});

/**
 * ⭐️ [ใหม่] ฟังก์ชันสำหรับสร้างฟอร์มสินค้า 1 ชิ้น
 */
function createNewProductForm() {
  const listContainer = document.getElementById("product-list-container");
  if (!listContainer) return;

  // สร้าง element หลัก (div.product-card)
  const card = document.createElement("div");
  card.className = "product-card";

  // สร้าง ID ที่ไม่ซ้ำกันสำหรับ <label> และ <input> ของไฟล์
  const uniqueId = `image-${new Date().getTime()}`;

  card.innerHTML = `
    <button type="button" class="remove-item-btn" title="ลบรายการนี้">
      <i class="fa-solid fa-trash"></i>
    </button>
    <div class="form-group">
      <label>ชื่อสินค้า:</label>
      <input type="text" class="product-name" required placeholder="เช่น เสื้อโปโล, กระเป๋าผ้า...">
    </div>
    <div class="form-group">
      <label>รายละเอียด:</label>
      <textarea class="product-description" rows="3" required placeholder="เช่น สภาพ, ขนาด, สี..."></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="price">ราคา (บาท):</label>
        <input type="number" class="product-price" required min="0" placeholder="ระบุราคา">
      </div>
    </div>
    <div class="form-group">
      <label>อัปโหลดรูปภาพสินค้า:</label>
      <input type="file" id="${uniqueId}" class="product-image-input" accept="image/*" required style="display: none;">
      <label for="${uniqueId}" class="image-upload-label">
        <i class="fa-solid fa-arrow-up-from-bracket"></i>
        <span>คลิกเพื่ออัปโหลดรูปภาพ</span>
        <div class="preview"></div>
      </label>
    </div>
  `;

  // ⭐️ [ใหม่] เพิ่ม Event Listener ให้ปุ่มอัปโหลดรูปที่เพิ่งสร้าง
  const imageInput = card.querySelector(".product-image-input");
  const preview = card.querySelector(".preview");
  const uploadLabel = card.querySelector(".image-upload-label");

  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // e.target.result คือสตริง Base64 ของรูปภาพ
        preview.innerHTML = `<img src="${e.target.result}" alt="ภาพสินค้า">`;
        uploadLabel.classList.add("has-image"); // ⭐️ เพิ่มคลาสเพื่อซ่อนข้อความ

        // ⭐️ [สำคัญ] บันทึก Base64 ไว้ใน data-* attribute
        card.dataset.imageBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // เพิ่มการ์ดใหม่นี้ลงใน container
  listContainer.appendChild(card);
}

/**
 * ⭐️ [ใหม่] ฟังก์ชันสำหรับบันทึกสินค้าทั้งหมด
 */
function handleSubmitAll() {
  const allCards = document.querySelectorAll(".product-card");

  if (allCards.length === 0) {
    alert("คุณยังไม่ได้เพิ่มสินค้าใดๆ");
    return;
  }

  // (allProducts และ PRODUCTS_KEY มาจาก Data.js)
  let currentProducts = allProducts;
  let myProductIDs = JSON.parse(localStorage.getItem("myProductIDs")) || [];
  let newProductsAdded = 0;
  let hasError = false;

  allCards.forEach((card) => {
    // ลบ class error เก่าออกก่อน
    card.classList.remove("error");

    const name = card.querySelector(".product-name").value.trim();
    const price = card.querySelector(".product-price").value;
    const desc = card.querySelector(".product-description").value.trim();
    const imageBase64 = card.dataset.imageBase64; // ⭐️ ดึง Base64 จาก data

    // --- 1. ตรวจสอบข้อมูล ---
    if (!name || !price || !desc || !imageBase64) {
      card.classList.add("error"); // ⭐️ ไฮไลท์การ์ดที่มีปัญหา
      hasError = true;
      return; // ข้ามการ์ดนี้ไป
    }

    // --- 2. สร้างอ็อบเจกต์สินค้าใหม่ ---
    const newProduct = {
      ID: new Date().getTime() + Math.random(), // ⭐️ ทำให้ ID ไม่ซ้ำกัน
      name: name,
      price: parseFloat(price),
      img: imageBase64,
    };

    // --- 3. เพิ่มเข้า List ---
    currentProducts.push(newProduct);
    myProductIDs.push(newProduct.ID);
    newProductsAdded++;
  });

  // --- 4. จัดการผลลัพธ์ ---
  if (hasError) {
    alert("⚠️ เกิดข้อผิดพลาด! กรุณากรอกข้อมูลในช่อง (สีแดง) ให้ครบถ้วน");
    return;
  }

  if (newProductsAdded === 0) {
    alert("ไม่พบสินค้าใหม่ที่จะเพิ่ม");
    return;
  }

  // --- 5. บันทึกลง Storage ---
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(currentProducts));
    localStorage.setItem("myProductIDs", JSON.stringify(myProductIDs));

    alert(`✅ วางขายสินค้า ${newProductsAdded} รายการเรียบร้อยแล้ว!`);

    // ย้ายไปหน้าสินค้า
    window.location.href = "./Products.html";
  } catch (err) {
    console.error("Error saving products:", err);
    alert("เกิดข้อผิดพลาดในการบันทึกสินค้า");
  }
}
