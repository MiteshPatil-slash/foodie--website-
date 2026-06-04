// ===================== MENU DATA — uses your local images =====================
const menuItems = [
    { id: 1,  name: "Double Chicken Burger",  price: 55, category: "burgers",  badge: "hot",     img: "All images/burger.png" },
    { id: 2,  name: "Chicken Roll",           price: 25, category: "burgers",  badge: "popular", img: "All images/chicken-roll.png" },
    { id: 3,  name: "Spring Roll",            price: 15, category: "burgers",  badge: "",        img: "All images/spring-roll.png" },
    { id: 4,  name: "Cheese Pizza",           price: 32, category: "pizza",    badge: "popular", img: "All images/pizza.png" },
    { id: 5,  name: "Fried Chicken",          price: 26, category: "pizza",    badge: "hot",     img: "All images/fried-chicken.png" },
    { id: 6,  name: "Lasagna",                price: 35, category: "pizza",    badge: "",        img: "All images/lasagna.png" },
    { id: 7,  name: "Spaghetti",              price: 29, category: "drinks",   badge: "popular", img: "All images/spaghetti.png" },
    { id: 8,  name: "Sandwich",               price: 16, category: "drinks",   badge: "",        img: "All images/sandwich.png" },
    { id: 9,  name: "Chicken Burger Combo",   price: 42, category: "desserts", badge: "hot",     img: "All images/burger.png" },
    { id: 10, name: "Crispy Fried Chicken",   price: 31, category: "desserts", badge: "",        img: "All images/fried-chicken.png" },
    { id: 11, name: "Veg Spring Roll",        price: 13, category: "desserts", badge: "popular", img: "All images/spring-roll.png" },
    { id: 12, name: "Classic Lasagna",        price: 38, category: "pizza",    badge: "",        img: "All images/lasagna.png" },
];

// ===================== CART STATE =====================
let cart = [];

// ===================== RENDER MENU =====================
function renderMenu(filter) {
    const grid = document.getElementById("menuGrid");
    const items = (!filter || filter === "all")
        ? menuItems
        : menuItems.filter(i => i.category === filter);

    grid.innerHTML = items.map(item => `
        <div class="menu-card" data-id="${item.id}">
            ${item.badge
                ? `<div class="menu-card-badge${item.badge === 'hot' ? ' hot' : ''}">
                       ${item.badge === 'hot' ? '🔥 Hot' : '⭐ Popular'}
                   </div>`
                : ""}
            <div class="menu-card-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <h4>${item.name}</h4>
            <p class="menu-price">$${item.price}</p>
            <button class="btn add-btn" data-id="${item.id}">
                <i class="fa-solid fa-plus"></i> Add to Cart
            </button>
        </div>
    `).join("");

    // Attach click listeners AFTER injecting HTML (fixes the cart bug)
    grid.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const id = parseInt(this.dataset.id);
            addToCart(id);
            // Button feedback
            this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
            this.style.background = 'var(--gold)';
            setTimeout(() => {
                this.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Cart';
                this.style.background = '';
            }, 1200);
        });
    });
}

// ===================== CART FUNCTIONS =====================
function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    updateCartUI();
    showToast(`${item.name} added to cart!`);
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else updateCartUI();
}

function updateCartUI() {
    const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

    // Badges
    document.getElementById("cartBadge").textContent      = totalQty;
    document.getElementById("cartCountBadge").textContent = totalQty;
    document.getElementById("cartTotal").textContent      = `$${totalPrice}`;

    const list   = document.getElementById("cartItemsList");
    const footer = document.getElementById("cartFooter");

    if (cart.length === 0) {
        list.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Your cart is empty</p>
            </div>`;
        footer.style.display = "none";
        return;
    }

    footer.style.display = "block";
    list.innerHTML = cart.map(item => `
        <div class="cart-item-row">
            <div class="cart-thumb">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>$${item.price * item.qty}</span>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
            </div>
        </div>
    `).join("");

    // Attach qty button listeners
    list.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            changeQty(parseInt(this.dataset.id), parseInt(this.dataset.delta));
        });
    });
}

// ===================== CART OPEN / CLOSE =====================
function openCart() {
    document.getElementById("cartSidebar").classList.add("active");
    document.getElementById("cartOverlay").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    document.getElementById("cartSidebar").classList.remove("active");
    document.getElementById("cartOverlay").classList.remove("active");
    document.body.style.overflow = "";
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);

// ===================== TOAST =====================
function showToast(msg) {
    let toast = document.getElementById("foodie-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "foodie-toast";
        toast.style.cssText = `
            position:fixed; bottom:2rem; left:50%;
            transform:translateX(-50%) translateY(120px);
            background:var(--dark); color:var(--white);
            padding:.85rem 1.75rem; border-radius:100px;
            font-size:.9rem; font-weight:600; z-index:9999;
            transition:transform .4s cubic-bezier(.4,0,.2,1);
            pointer-events:none; font-family:'DM Sans',sans-serif;
            white-space:nowrap; box-shadow:0 8px 32px rgba(0,0,0,.25);
            border-left:4px solid var(--gold);
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = "✓  " + msg;
    toast.style.transform = "translateX(-50%) translateY(0)";
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(120px)";
    }, 2500);
}

// ===================== FILTER BUTTONS =====================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        renderMenu(this.dataset.filter);
    });
});

// ===================== HAMBURGER =====================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
    });
});

// ===================== STICKY HEADER =====================
window.addEventListener("scroll", () => {
    document.getElementById("header").classList.toggle("scrolled", window.scrollY > 40);
});

// ===================== SWIPER =====================
const swiper = new Swiper(".mySwiper", {
    loop: true,
    speed: 600,
    on: {
        slideChange() { updateDots(this.realIndex); }
    }
});

document.getElementById("next").addEventListener("click", () => swiper.slideNext());
document.getElementById("prev").addEventListener("click", () => swiper.slidePrev());

const dotsContainer = document.getElementById("swiperDots");
const slideCount = document.querySelectorAll(".swiper-slide").length;
for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("div");
    dot.className = "swiper-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => swiper.slideToLoop(i));
    dotsContainer.appendChild(dot);
}

function updateDots(index) {
    document.querySelectorAll(".swiper-dot").forEach((d, i) => {
        d.classList.toggle("active", i === index);
    });
}

// ===================== SCROLL ANIMATIONS =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll("[data-animate], [data-animate-delay]").forEach(el => observer.observe(el));

// ===================== INIT =====================
renderMenu("all");
updateCartUI();