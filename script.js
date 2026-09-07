const PRODUCTS=[
{id:1,name:"Korean Butter Cardigan",price:139000,cat:"girls",img:"assets/butter-cardigan.svg",meta:"Butter yellow • 2–8 yrs"},
{id:2,name:"Teddy Ribbon Dress",price:129000,cat:"girls",img:"assets/teddy-dress.svg",meta:"Pastel pink • 3–8 yrs"},
{id:3,name:"Mini Varsity Jacket",price:159000,cat:"boys",img:"assets/mini-varsity.svg",meta:"Mocha & cream • 4–10 yrs"},
{id:4,name:"Cloud Oversized Hoodie",price:119000,cat:"unisex",img:"assets/cloud-hoodie.svg",meta:"Soft gray • 2–10 yrs"},
{id:5,name:"Daily Denim Set",price:149000,cat:"set",img:"assets/denim-skirt.svg",meta:"Denim blue • 3–9 yrs"},
{id:6,name:"Creamy Knit Set",price:145000,cat:"set",img:"assets/cream-set.svg",meta:"Cream • 2–8 yrs"},
{id:7,name:"Soft Polo Tee",price:89000,cat:"unisex",img:"assets/soft-polo.svg",meta:"Butter • 2–10 yrs"},
{id:8,name:"Bloom Weekend Set",price:155000,cat:"set",img:"assets/bloom-set.svg",meta:"Pink & sage • 3–10 yrs"}
];
let currentFilter="all", cart=[], selected=null;
const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const grid=document.getElementById("productGrid");
function render(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const list=PRODUCTS.filter(p=>(currentFilter==="all"||p.cat===currentFilter)&&(p.name+" "+p.meta).toLowerCase().includes(q));
 grid.innerHTML=list.length?list.map(p=>`<article class="product-card">
 <div class="product-img"><img src="${p.img}" alt="${p.name}"><button class="heart" aria-label="Wishlist">♡</button></div>
 <div class="product-info"><h3>${p.name}</h3><div class="meta">${p.meta}</div><div class="price">${rupiah(p.price)}</div><button class="order-btn" onclick="openOrder(${p.id})">Order Sekarang ✦</button></div></article>`).join(""):`<div class="no-result">No cute match found ♡<br><small>Coba kata kunci lain.</small></div>`;
}
function openOrder(id){
 selected=PRODUCTS.find(p=>p.id===id);
 document.getElementById("modalTitle").textContent=selected.name;
 document.getElementById("modalPrice").textContent=rupiah(selected.price);
 document.getElementById("modalImg").src=selected.img;
 document.getElementById("modalImg").alt=selected.name;
 document.getElementById("modalBackdrop").classList.add("show");
}
function closeOrder(){document.getElementById("modalBackdrop").classList.remove("show")}
function addToCart(){
 if(!selected)return;
 const size=document.getElementById("sizeSelect").value,color=document.getElementById("colorSelect").value,qty=Number(document.getElementById("qtySelect").value);
 const key=`${selected.id}-${size}-${color}`;
 const found=cart.find(x=>x.key===key);
 if(found)found.qty+=qty; else cart.push({key,...selected,size,color,qty});
 renderCart();closeOrder();document.getElementById("cartDrawer").classList.add("show");
}
function renderCart(){
 const box=document.getElementById("cartItems");
 document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);
 const total=cart.reduce((a,b)=>a+b.price*b.qty,0);document.getElementById("cartTotal").textContent=rupiah(total);
 box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-row"><img src="${x.img}" alt=""><div><h4>${x.name}</h4><small>${x.size} • ${x.color} • x${x.qty}<br>${rupiah(x.price*x.qty)}</small></div><button class="remove" onclick="removeCart(${i})">×</button></div>`).join(""):`<div class="empty">Your bag is still tiny ♡<br>Pick something cute first!</div>`;
}
function removeCart(i){cart.splice(i,1);renderCart()}
function waText(items){
 const lines=items.map(x=>`• ${x.name} | ${x.size} | ${x.color} | qty ${x.qty} | ${rupiah(x.price*x.qty)}`).join("%0A");
 const total=items.reduce((a,b)=>a+b.price*b.qty,0);
 return `Halo DARA Kids Wear! Saya mau order:%0A${lines}%0ATotal: ${rupiah(total)}%0A%0ANama:%0AAlamat:%0A`;
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentFilter=b.dataset.filter;render()}));
document.getElementById("searchToggle").onclick=()=>document.getElementById("searchbar").classList.toggle("show");
document.getElementById("searchInput").addEventListener("input",render);
document.getElementById("clearSearch").onclick=()=>{document.getElementById("searchInput").value="";render()};
document.getElementById("closeModal").onclick=closeOrder;
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeOrder()});
document.getElementById("addCart").onclick=addToCart;
document.getElementById("waOrder").onclick=()=>{
 if(!selected)return;
 const size=document.getElementById("sizeSelect").value,color=document.getElementById("colorSelect").value,qty=Number(document.getElementById("qtySelect").value);
 const url="https://wa.me/6281234567890?text="+waText([{...selected,size,color,qty}]);
 window.open(url,"_blank"); 
};
document.getElementById("cartBtn").onclick=()=>document.getElementById("cartDrawer").classList.add("show");
document.getElementById("closeCart").onclick=()=>document.getElementById("cartDrawer").classList.remove("show");
document.getElementById("checkoutCart").onclick=()=>{if(cart.length)window.open("https://wa.me/6281234567890?text="+waText(cart),"_blank")};
document.getElementById("orderFooter").onclick=e=>{e.preventDefault();document.getElementById("shop").scrollIntoView({behavior:"smooth"})};
render();renderCart();
