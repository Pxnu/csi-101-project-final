/**
 * แสดงผลสินค้าใหม่ (6 ชิ้นล่าสุด)
 */
function renderNewProducts() {
  const favorites = loadFavorites(); // โหลดสถานะถูกใจ
  const container = document.getElementById("new_product_container");
  if (!container) return;
  container.innerHTML = "";

  // ดึงสินค้า 6 ชิ้นแรก (หรือน้อยกว่า)
  const newProducts = allProducts.slice(0, 6);

  // ตรวจสอบว่ามีสินค้าหรือไม่
  if (newProducts.length === 0) {
    container.innerHTML = "<h2>ไม่พบสินค้าในขณะนี้...</h2>";
    // เปลี่ยน display เป็น block เพื่อให้ข้อความอยู่ตรงกลาง
    container.style.display = "block";
    return;
  }
  
  container.style.display = "grid"; // กลับเป็น grid ถ้ามีสินค้า
  
  const fragment = document.createDocumentFragment();
  newProducts.forEach((item) => {
    // สร้างการ์ดสินค้า (ฟังก์ชันนี้มาจาก shared.js)
    fragment.appendChild(createProductCard(item, favorites));
  });
  container.appendChild(fragment);
}

/**
 * จัดการการค้นหาในหน้าแรก (เมื่อกด Enter)
 * (จะ Redirect ไปหน้า Products.html พร้อมคำค้นหา)
 */
function handleSearchRedirect() {
  const searchInput = document.getElementById("nav-search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          // ส่งต่อไปยังหน้า products.html พร้อม query parameter
          window.location.href = `/products.html?search=${encodeURIComponent(
            searchTerm
          )}`;
        }
      }
    });
  }
}

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
  renderNewProducts(); // แสดงสินค้าใหม่
  updateCart(); // อัปเดต UI ตะกร้า
  updateFavCount(); // อัปเดต UI ถูกใจ
  handleSearchRedirect(); // เริ่มการทำงานของช่องค้นหา
});