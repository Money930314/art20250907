const CART_KEY = 'cart';

function readCart(){
  try{
    const arr = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(arr) ? arr : [];
  }catch{ return []; }
}
function writeCart(list){
  localStorage.setItem(CART_KEY, JSON.stringify(list));
  updateBadge();
}
function updateBadge(){
  const n = readCart().reduce((s, it)=> s+(Number(it.qty)||0),0);
  const badge = document.getElementById('cart-count');
  if(badge) badge.textContent = n;
}
function money(n){ return 'NT$ ' + (Number(n)||0).toLocaleString(); }

const listEl = document.getElementById('cart-list');
const emptyEl = document.getElementById('empty-state');
const totalEl = document.getElementById('summary-total');

function render(){
  const cart = readCart();
  if(cart.length===0){
    emptyEl.classList.remove('d-none');
    listEl.innerHTML='';
    totalEl.textContent = money(0);
    updateBadge();
    return;
  }else{
    emptyEl.classList.add('d-none');
  }

  listEl.innerHTML = cart.map(it=>`
    <div class="cart-item" data-id="${it.id}">
      <img src="${it.img||'https://placehold.co/200'}" alt="${it.title}">
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="cart-item-title">${it.title}</div>
            <a href="#" class="remove-btn small mt-1 d-inline-block">移除</a>
          </div>
          <div class="cart-item-price">${money(it.price)}</div>
        </div>
        <div class="mt-2 d-flex justify-content-between align-items-center">
          <div class="qty-box">
            <button class="qty-btn btn-minus">−</button>
            <input class="qty-input" type="number" min="0" step="1" value="${it.qty}">
            <button class="qty-btn btn-plus">＋</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s,it)=> s+(it.price*it.qty),0);
  totalEl.textContent = money(total);
  updateBadge();
}

// 數量調整 & 移除
listEl?.addEventListener('click', e=>{
  const itemEl = e.target.closest('.cart-item');
  if(!itemEl) return;
  const id = itemEl.dataset.id;
  let cart = readCart();
  const idx = cart.findIndex(x=>String(x.id)===String(id));
  if(idx<0) return;

  if(e.target.classList.contains('btn-minus')){
    cart[idx].qty = Math.max(0, cart[idx].qty-1);
  }
  if(e.target.classList.contains('btn-plus')){
    cart[idx].qty++;
  }
  if(e.target.classList.contains('remove-btn')){
    e.preventDefault(); cart.splice(idx,1);
  }
  cart = cart.filter(x=>x.qty>0);
  writeCart(cart); render();
});

// 直接輸入數字
listEl?.addEventListener('change', e=>{
  if(!e.target.classList.contains('qty-input')) return;
  const id = e.target.closest('.cart-item').dataset.id;
  let cart = readCart();
  const idx = cart.findIndex(x=>String(x.id)===String(id));
  if(idx<0) return;
  const v = Math.max(0, Number(e.target.value)||0);
  if(v===0) cart.splice(idx,1); else cart[idx].qty = v;
  writeCart(cart); render();
});

document.addEventListener('DOMContentLoaded', ()=>{
  updateBadge();
  render();
  document.getElementById('checkout-btn')?.addEventListener('click', ()=>{
    if(readCart().length===0) return alert('購物車是空的');
    
  });
});

function refreshEmptyState() {
  const main = document.getElementById('cart-main');   // ← main 現在有這個 id
  const emptyState = document.getElementById('empty-state');
  const isEmpty = readCart().length === 0;

  if (!main || !emptyState) return;
  main.classList.toggle('is-empty', isEmpty);
  emptyState.hidden = !isEmpty;        // 空車顯示白卡
}
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  render?.();            // 你的既有渲染
  refreshEmptyState();   // 套用空車狀態
});



//把購物車網頁的"結帳➜"添加"結帳"頁面的網址
  document.getElementById("checkout-btn").addEventListener("click", function() {
    window.location.href = "checkout.html";
  });

