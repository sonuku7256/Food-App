 const MENU = [
      // STARTERS
      { id: 1, name: "Aloo Tikki", cat: "starter", emoji: "🥔", price: 60, desc: "Crispy golden tikkis, pudine ki chutney ke saath. Delhi ki sabse famous street snack." },
      { id: 2, name: "Samosa (2 pcs)", cat: "starter", emoji: "🔺", price: 40, desc: "Khasta bahar se, andar masaledar aloo. Roz subah fresh banate hain." },
      { id: 3, name: "Dahi Bhalla", cat: "starter", emoji: "🫙", price: 80, desc: "Soft moong dal ke bhalle, meethi dahi aur chaat masala ke saath." },

      // MAIN COURSE
      { id: 4, name: "Dal Makhani", cat: "main", emoji: "🫕", price: 150, desc: "Raat bhar slow-cooked kaali dal, malai wali. Roti ya chawal ke saath best lagti hai." },
      { id: 5, name: "Paneer Butter Masala", cat: "main", emoji: "🧀", price: 180, desc: "Makhani gravy mein fresh paneer. Rich, creamy aur ghar jaisi taste." },
      { id: 6, name: "Rajma Chawal", cat: "main", emoji: "🍚", price: 130, desc: "Punjabi style rajma, long grain basmati chawal ke saath. Sunday special." },
      { id: 7, name: "Veg Biryani", cat: "main", emoji: "🍛", price: 160, desc: "Dum style pakaya hua, seb wali raita ke saath. Bahut hi aromatic." },
      { id: 8, name: "Chole Bhature (2 pcs)", cat: "main", emoji: "🫓", price: 120, desc: "Tangy Amritsari chole, hare pyaaz aur achaar ke saath fluffy bhature." },

      // DESSERT
      { id: 9, name: "Gulab Jamun (4 pcs)", cat: "dessert", emoji: "🟤", price: 70, desc: "Garam garam gulab jamun, chashni mein doobe hue. Pure desi ghee mein bane." },
      { id: 10, name: "Kheer", cat: "dessert", emoji: "🥛", price: 90, desc: "Doodh, chawal aur kesar wali kheer. Thandi thandi, badam pistay ke saath." },
      { id: 11, name: "Gajar Halwa", cat: "dessert", emoji: "🥕", price: 100, desc: "Sardi ki gajar ka halwa, ghee mein pakaya. Seasonal — limited availability." },
    ];

    // =============================================
    // WHATSAPP NUMBER — apna number daalo (country code ke saath)
    // =============================================
    const WHATSAPP_NUMBER = "917256064572"; // <-- YAHAN APNA NUMBER DAALO

    // =============================================
    // CART
    // =============================================
    let cart = {};

    function renderMenu(filter = 'all') {
      const grid = document.getElementById('menuGrid');
      const items = filter === 'all' ? MENU : MENU.filter(d => d.cat === filter);
      grid.innerHTML = items.map(dish => `
    <div class="dish-card" data-id="${dish.id}">
      <div class="dish-img">${dish.emoji}</div>
      <div class="dish-body">
        <div class="dish-cat">${dish.cat === 'starter' ? 'Starter' : dish.cat === 'main' ? 'Main Course' : 'Dessert'}</div>
        <div class="dish-name">${dish.name}</div>
        <div class="dish-desc">${dish.desc}</div>
        <div class="dish-footer">
          <div class="dish-price">₹${dish.price}<span></span></div>
          <button class="add-btn ${cart[dish.id] ? 'added' : ''}" id="btn-${dish.id}" onclick="addToCart(${dish.id})">
            ${cart[dish.id] ? `✓ ${cart[dish.id]} added` : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
    }

    function filterCat(cat, el) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      renderMenu(cat);
    }

    function addToCart(id) {
      cart[id] = (cart[id] || 0) + 1;
      updateCartBar();
      const btn = document.getElementById('btn-' + id);
      if (btn) {
        btn.classList.add('added');
        btn.textContent = `✓ ${cart[id]} added`;
      }
    }

    function updateCartBar() {
      const items = Object.entries(cart).filter(([, q]) => q > 0);
      const count = items.reduce((s, [, q]) => s + q, 0);
      const total = items.reduce((s, [id, q]) => s + MENU.find(d => d.id == id).price * q, 0);
      document.getElementById('cartCount').textContent = count;
      document.getElementById('cartTotal').textContent = '₹' + total;
      document.getElementById('cartBar').classList.toggle('visible', count > 0);
    }

    // =============================================
    // MODAL
    // =============================================
    function openModal() {
      const items = Object.entries(cart).filter(([, q]) => q > 0);
      if (!items.length) return;
      const total = items.reduce((s, [id, q]) => s + MENU.find(d => d.id == id).price * q, 0);

      let html = items.map(([id, q]) => {
        const d = MENU.find(x => x.id == id);
        return `<div class="order-item"><span>${d.name} × ${q}</span><span>₹${d.price * q}</span></div>`;
      }).join('');
      html += `<div class="order-item"><span>Total</span><span>₹${total}</span></div>`;
      document.getElementById('orderSummary').innerHTML = html;
      document.getElementById('modalOverlay').classList.add('open');
    }

    function closeModal() {
      document.getElementById('modalOverlay').classList.remove('open');
    }

    // =============================================
    // PLACE ORDER
    // =============================================
    function placeOrder() {
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const payment = document.getElementById('custPayment').value;
      const note = document.getElementById('custNote').value.trim();

      if (!name) { alert('Naam likhna zaroori hai!'); return; }
      if (!phone || phone.length < 10) { alert('Sahi mobile number daalo!'); return; }
      if (!address) { alert('Delivery address likhna zaroori hai!'); return; }

      const items = Object.entries(cart).filter(([, q]) => q > 0);
      const total = items.reduce((s, [id, q]) => s + MENU.find(d => d.id == id).price * q, 0);

      // WhatsApp message banao
      let msg = `🍽️ *NEW ORDER — Ghar Ka Zaika*\n\n`;
      msg += `👤 *Customer:* ${name}\n`;
      msg += `📱 *Phone:* ${phone}\n`;
      msg += `📍 *Address:* ${address}\n`;
      msg += `💳 *Payment:* ${payment}\n\n`;
      msg += `📋 *Order Details:*\n`;
      items.forEach(([id, q]) => {
        const d = MENU.find(x => x.id == id);
        msg += `• ${d.name} × ${q} = ₹${d.price * q}\n`;
      });
      msg += `\n💰 *Total: ₹${total}*`;
      if (note) msg += `\n\n📝 *Note:* ${note}`;
      msg += `\n\n⏰ Order time: ${new Date().toLocaleTimeString('hi-IN')}`;

      const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

      // WhatsApp kholo
      window.open(waURL, '_blank');

      // Modal band karo, success dikhaao
      closeModal();
      document.getElementById('successMsg').innerHTML = `
    <strong>${name}</strong> Yours order confirmed! 🎉<br><br>
    Details has been sent to your number.<br>
    45 minute mein garam khana aa jaayega.<br><br>
    <small style="color:#aaa">Total: ₹${total} | Payment: ${payment}</small>
  `;
      document.getElementById('successOverlay').classList.add('open');

      // Cart reset
      cart = {};
      updateCartBar();
    }

    function closeSuccess() {
      document.getElementById('successOverlay').classList.remove('open');
      renderMenu('all');
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.tab').classList.add('active');
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Init
    renderMenu();