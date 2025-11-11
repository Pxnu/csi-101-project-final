// ⭐️ ไฟล์นี้สำหรับหน้า Chat.html

// 1. ดึง Elements จากหน้า Chat.html
const sendBtn = document.getElementById("chat-page-send-btn");
const chatInput = document.getElementById("chat-page-input");
const chatMessages = document.getElementById("chat-page-messages");

// 2. ฟังก์ชันเพิ่มข้อความ (เหมือนใน Shared.js)
function addMessage(text, sender = "user") {
  if (!chatMessages) return;
  const msg = document.createElement("div");
  msg.classList.add("message", sender); // 'user' หรือ 'bot'
  
  if (sender === 'bot') {
    msg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  } else {
    msg.textContent = text;
  }
  
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msg;
}

// 3. ฟังก์ชันบอทตอบ (เหมือนใน Shared.js)
function handleBotReply() {
    const typingMsg = addMessage("", "bot");
    setTimeout(() => {
        const replies = [
            "สวัสดีครับ สนใจสินค้าชิ้นไหนครับ?",
            "สอบถามได้เลยครับ",
            "สินค้านี้ยังอยู่นะครับ"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        // ตรวจสอบว่า typingMsg ยังอยู่ (เผื่อผู้ใช้ออกจากหน้าไปก่อน)
        if (typingMsg) {
            typingMsg.innerHTML = randomReply;
        }
    }, 1500);
}

// 4. Event Listeners (เหมือนใน Shared.js)
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (text !== "") {
      addMessage(text, "user");
      chatInput.value = "";
      handleBotReply();
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