// 1. กำหนดค่าเริ่มต้นของสินค้าเป็นอาร์เรย์ว่าง
// (เมื่อผู้ใช้ลงขาย, สินค้าจะถูกเพิ่มเข้ามาใน localStorage)
const initialProducts = [];

// 2. Key สำหรับเก็บข้อมูลใน localStorage
const SAMPLE_KEY = "favorites";      // Key สำหรับเก็บสินค้าที่ถูกใจ
const CART_KEY = "shoppingCart";   // Key สำหรับเก็บสินค้าในตะกร้า
const PRODUCTS_KEY = "allSiteProducts"; // Key สำหรับเก็บสินค้าทั้งหมด

/**
 * ฟังก์ชันสำหรับโหลดสินค้าทั้งหมดจาก localStorage
 * @returns {Array} - อาร์เรย์ของสินค้าทั้งหมด
 */
function loadAllProducts() {
  try {
    const rawProducts = localStorage.getItem(PRODUCTS_KEY);
    // ตรวจสอบว่ามีข้อมูลใน localStorage และไม่ใช่แค่ "[]" (อาร์เรย์ว่าง)
    if (rawProducts && rawProducts.length > 2) {
      // ถ้ามี, ใช้ข้อมูลนั้น
      return JSON.parse(rawProducts);
    } else {
      // ถ้าไม่มี (เช่น ใช้งานครั้งแรก)
      // ให้บันทึกอาร์เรย์ว่างเปล่า (initialProducts) ลง localStorage
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
  } catch (err) {
    console.error("Error loading products:", err);
    // ถ้าเกิด Error (เช่น JSON ผิดพลาด), ให้คืนค่าอาร์เรย์ว่าง
    return initialProducts;
  }
}

// 4. สร้างตัวแปร global 'allProducts'
// นี่คือตัวแปรหลักที่ไฟล์อื่น (Home.js, Products.js) จะใช้อ้างอิง
const allProducts = loadAllProducts();