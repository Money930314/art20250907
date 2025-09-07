// === Checkout Only JS ===

// 1) 保險：若其他共用 layout 有寫入導覽列，移除它們
document.querySelectorAll('.navbar, .site-header, .global-nav')
  .forEach(el => el.remove());

// 2) 商標容錯（如果圖片失敗，就顯示文字版商標）
const logoImg = document.querySelector('.brand-logo');
const brandText = document.querySelector('.brand-text');

if (logoImg) {
  logoImg.addEventListener('error', () => {
    if (brandText) brandText.style.display = 'inline';
    logoImg.remove();
  });
}

// 3) 也可在這裡放你結帳頁其他 JS（例如：表單驗證、金額更新…）





/********** 共用購物車工具 **********/
const CART_KEY = 'cart';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function cartCount() {
  return readCart().reduce((s, it) => s + (Number(it.qty) || 0), 0);
}

function formatMoney(n) {
  return `NT$ ${Number(n || 0).toLocaleString()}`;
}

/********** 頁面初始化 **********/
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

const badge = document.getElementById('cart-count');
if (badge) badge.textContent = cartCount();

/********** 訂單摘要渲染 **********/
const elItems = document.getElementById('summaryItems');
const elSub   = document.getElementById('subtotalText');
const elShip  = document.getElementById('shipText');
const elTotal = document.getElementById('totalText');

function renderSummary() {
  const cart = readCart();
  elItems.innerHTML = '';

  let subtotal = 0;

  cart.forEach(p => {
    const qty = Number(p.qty) || 0;
    const price = Number(p.price) || 0;
    subtotal += qty * price;

    const item = document.createElement('div');
    item.className = 'summary-item position-relative';

    item.innerHTML = `
      <div class="position-relative">
        <img class="summary-thumb" src="${p.img || ''}" alt="${p.title || ''}">
        <span class="badge rounded-pill text-bg-dark badge-qty">${qty}</span>
      </div>
      <div class="flex-grow-1">
        <div class="small text-truncate">${p.title || ''}</div>
        <div class="small text-muted">${formatMoney(price)}</div>
      </div>
      <div class="small fw-bold">${formatMoney(qty * price)}</div>
    `;
    elItems.appendChild(item);
  });

  elSub.textContent = formatMoney(subtotal);

  // 預設運費顯示文字。若要真的計算，可加上你的規則後更新 elShip 與總額
  let shippingText = '填寫地址後計算';
  let shipCost = 0;

  // 簡易規則（可刪）：若選「宅配」且有地址 -> 一律 NT$ 100
  const form = document.getElementById('checkout-form');
  if (form) {
    const shipHome = form.querySelector('input[name="shipping"][value="home"]')?.checked;
    const addr1 = form.address1?.value?.trim();
    const zip   = form.zip?.value?.trim();
    if (shipHome && addr1 && zip) {
      shipCost = 100;
      shippingText = formatMoney(shipCost);
    }
  }

  elShip.textContent = shippingText;
  elTotal.textContent = formatMoney(subtotal + shipCost);
}

renderSummary();

/********** 表單互動：有填地址/切換收件方式就更新運費/總額文字 **********/
const form = document.getElementById('checkout-form');
if (form) {
  ['input', 'change'].forEach(evt => {
    form.addEventListener(evt, e => {
      if (['address1','zip','shipping'].includes(e.target.name)) {
        renderSummary();
      }
    });
  });

  // 送出示範
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    alert('感謝下單！這裡可以串接金流或導向訂單完成頁。');
  });
}
