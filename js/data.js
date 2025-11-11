// 1. ⭐️ [แก้ไข] เปลี่ยนสินค้าเริ่มต้นเป็นอาร์เรย์ว่าง
const initialProducts = [
  // (สินค้า Mockup 15 ชิ้นถูกลบออกจากตรงนี้แล้ว)
];

// 2. Key สำหรับเก็บข้อมูลใน localStorage
const SAMPLE_KEY = "favorites";
const CART_KEY = "shoppingCart";
const PRODUCTS_KEY = "allSiteProducts"; // Key สำหรับเก็บสินค้า

// 3. ฟังก์ชันสำหรับโหลดสินค้าทั้งหมด
function loadAllProducts() {
  try {
    const rawProducts = localStorage.getItem(PRODUCTS_KEY);
    if (rawProducts && rawProducts.length > 2) {
      // ถ้ามีสินค้าใน localStorage อยู่แล้ว ก็ใช้ข้อมูลนั้น
      return JSON.parse(rawProducts);
    } else {
      // ถ้าเป็นผู้ใช้ครั้งแรก: บันทึกอาร์เรย์ว่างเปล่าลง localStorage
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
  } catch (err) {
    console.error("Error loading products:", err);
    return initialProducts; // ถ้าพัง ให้ใช้สินค้าเริ่มต้น (อาร์เรย์ว่าง)
  }
}

// 4. ⭐️ นี่คือตัวแปรหลักที่ไฟล์อื่น (Home.js, Products.js) จะใช้
const allProducts = loadAllProducts();
