// ไฟล์นี้สำหรับหน้า Chat.html (หน้าแชทเต็มจอ)

// 1. ดึง Elements จากหน้า Chat.html
const sendBtn = document.getElementById("chat-page-send-btn");
const chatInput = document.getElementById("chat-page-input");
const chatMessages = document.getElementById("chat-page-messages");

/**
 * เพิ่มข้อความลงในกล่องแชท (สำหรับหน้า Chat.html)
 * @param {string} text - ข้อความ
 * @param {string} sender - 'user' หรือ 'bot'
 * @returns {HTMLElement} - Element ของข้อความที่เพิ่งสร้าง
 */
function addMessage(text, sender = "user") {
  if (!chatMessages) return;
  
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  
  if (sender === 'bot') {
    // ถ้าเป็น bot ให้แสดง 'กำลังพิมพ์...'
    msg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  } else {
    // ถ้าเป็น user ให้แสดงข้อความปกติ
    msg.textContent = text;
  }
  
  chatMessages.appendChild(msg);
  // เลื่อน scroll ไปล่างสุด
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

/**
 * ฟังก์ชันจำลองการตอบกลับของ Bot
 */
function handleBotReply() {
    // 1. สร้างข้อความ 'กำลังพิมพ์...'
    const typingMsg = addMessage("", "bot");
    
    // 2. หน่วงเวลา 1.5 วินาที
    setTimeout(() => {
        const replies = [
            "สวัสดีครับ สนใจสินค้าชิ้นไหนครับ?",
            "สอบถามได้เลยครับ",
            "สินค้านี้ยังอยู่นะครับ"
        ];
        // 3. สุ่มข้อความตอบกลับ
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        // 4. แทนที่ 'กำลังพิมพ์...' ด้วยข้อความจริง
        if (typingMsg) {
            typingMsg.innerHTML = randomReply;
        }
    }, 1500);
}

// 5. Event Listeners
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text !== "") {
      addMessage(text, "user"); // เพิ่มข้อความของเรา
      chatInput.value = "";
      handleBotReply(); // เรียก Bot ให้ตอบ
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