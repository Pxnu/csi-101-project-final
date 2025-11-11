function renderAllProducts(productsToRender) {
  const favorites = loadFavorites();
  const container = document.getElementById("product_container");
  if (!container) {
    console.error("Error: Cannot find element with ID 'product_container'");
    return;
  }
  container.innerHTML = "";

  // --- ⭐️ [แก้ไข] ตรวจสอบว่าทำไมสินค้าถึงว่าง ---
  if (productsToRender.length === 0) {
    // ตรวจสอบว่า 'สินค้าทั้งหมด' (allProducts) ว่างเปล่าหรือไม่
    if (allProducts.length === 0) {
        container.innerHTML = "<h2>ไม่พบสินค้าในขณะนี้...</h2>";
    } else {
        // ถ้า allProducts มีของ แต่ productsToRender ไม่มี = ไม่พบผลการค้นหา
        container.innerHTML = "<h2>ไม่พบสินค้าที่คุณค้นหา...</h2>";
    }
    container.style.display = "block";
    return;
  }
  // --- สิ้นสุดส่วนที่แก้ไข ---

  container.style.display = "grid";

  const fragment = document.createDocumentFragment();
  productsToRender.forEach((item) => {
    fragment.appendChild(createProductCard(item, favorites));
  });
  container.appendChild(fragment);
}

function initializeSearch() {
  const searchInput = document.getElementById("nav-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filteredProducts = allProducts.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
      renderAllProducts(filteredProducts);
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

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const searchTerm = (urlParams.get("search") || "").toLowerCase();
  let productsToShow = allProducts;

  const searchInput = document.getElementById("nav-search-input");
  if (searchTerm) {
    productsToShow = allProducts.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    if (searchInput) searchInput.value = searchTerm;
  }

  renderAllProducts(productsToShow);
  initializeSearch();
  updateCart();
  updateFavCount(); 
});