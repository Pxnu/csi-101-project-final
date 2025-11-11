function renderNewProducts() {
  const favorites = loadFavorites();
  const container = document.getElementById("new_product_container");
  if (!container) return;
  container.innerHTML = "";

  const newProducts = allProducts.slice(0, 6);

  // --- ⭐️ [เพิ่มใหม่] ตรวจสอบว่ามีสินค้าหรือไม่ ---
  if (newProducts.length === 0) {
    container.innerHTML = "<h2>ไม่พบสินค้าในขณะนี้...</h2>";
    // เปลี่ยน display เป็น block เพื่อให้ข้อความอยู่ตรงกลาง (ถ้า CSS มีการตั้งค่าไว้)
    container.style.display = "block";
    return;
  }
  // --- สิ้นสุดส่วนที่เพิ่มใหม่ ---

  container.style.display = "grid"; // กลับเป็น grid ถ้ามีสินค้า
  const fragment = document.createDocumentFragment();
  newProducts.forEach((item) => {
    fragment.appendChild(createProductCard(item, favorites));
  });
  container.appendChild(fragment);
}

function handleSearchRedirect() {
  const searchInput = document.getElementById("nav-search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          window.location.href = `/page/Products.html?search=${encodeURIComponent(
            searchTerm
          )}`;
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNewProducts();
  updateCart();
  updateFavCount();
  handleSearchRedirect();
});
