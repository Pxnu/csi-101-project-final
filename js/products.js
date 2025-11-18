/**
 * แสดงผลสินค้าทั้งหมดลงใน Container
 * @param {Array} productsToRender - อาร์เรย์ของสินค้าที่จะแสดง
 */
function renderAllProducts(productsToRender) {
  const favorites = loadFavorites(); // โหลดสถานะถูกใจ
  const container = document.getElementById("product_container");
  
  if (!container) {
    console.error("Error: Cannot find element with ID 'product_container'");
    return;
  }
  container.innerHTML = ""; // ล้าง container

  // ตรวจสอบว่ามีสินค้าที่จะแสดงหรือไม่
  if (productsToRender.length === 0) {
    // ตรวจสอบว่า 'สินค้าทั้งหมด' (allProducts) ว่างเปล่าหรือไม่
    if (allProducts.length === 0) {
      container.innerHTML = "<h2>ไม่พบสินค้าในขณะนี้...</h2>";
    } else {
      // ถ้า allProducts มีของ แต่ productsToRender ไม่มี = ไม่พบผลการค้นหา
      container.innerHTML = "<h2>ไม่พบสินค้าที่คุณค้นหา...</h2>";
    }
    container.style.display = "block"; // แสดงข้อความ
    return;
  }

  container.style.display = "grid"; // กลับไปใช้ grid layout

  // ใช้ DocumentFragment เพื่อประสิทธิภาพที่ดีขึ้น
  const fragment = document.createDocumentFragment();
  productsToRender.forEach((item) => {
    // สร้างการ์ดสินค้า (ฟังก์ชันนี้มาจาก shared.js)
    fragment.appendChild(createProductCard(item, favorites));
  });
  container.appendChild(fragment);
}

/**
 * เริ่มต้นการทำงานของช่องค้นหา (แบบ Real-time)
 */
function initializeSearch() {
  const searchInput = document.getElementById("nav-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      
      // กรองสินค้าตามคำค้นหา
      const filteredProducts = allProducts.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      
      renderAllProducts(filteredProducts); // แสดงผลสินค้าที่กรองแล้ว
      
      // อัปเดต URL (Query Parameter) โดยไม่รีโหลดหน้า
      const url = new URL(window.location);
      if (searchTerm) {
        url.searchParams.set("search", searchTerm);
      } else {
        url.searchParams.delete("search");
      }
      history.pushState({}, "", url.toString());
    });
  }
}

// เมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener("DOMContentLoaded", () => {
  // 1. ตรวจสอบ URL parameters (เช่น ?search=...)
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = (urlParams.get("search") || "").toLowerCase();
  
  let productsToShow = allProducts; // ค่าเริ่มต้นคือแสดงทั้งหมด

  const searchInput = document.getElementById("nav-search-input");
  
  // 2. ถ้ามีคำค้นหาใน URL
  if (searchTerm) {
    // กรองสินค้าตามคำค้นหานั้น
    productsToShow = allProducts.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    // ใส่คำค้นหาลงในช่อง search
    if (searchInput) searchInput.value = searchTerm;
  }

  // 3. แสดงผลสินค้า
  renderAllProducts(productsToShow);
  
  // 4. เริ่มต้นการค้นหาแบบ Real-time
  initializeSearch();
  
  // 5. อัปเดต UI ตะกร้าและถูกใจ
  updateCart();
  updateFavCount();
});