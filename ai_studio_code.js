// --- DYNAMIC STOREFRONT INTEGRATION ---
const BASE_DEFAULT_SETTINGS = {
    upiId: "7866986738@axl",
    merchantName: "Tech Gadget Zone India",
    advanceAmt: 5000,
    waNumber: "+16728972711",
    callNumber: "+16728972711",
    qrImg: "images/shop.jpg"
};

const INITIAL_STOCK_PRODUCTS = [
    { name: "iPhone 17", category: "Smartphones", badge: "65% OFF", newPrice: 27965, oldPrice: 79900, img: "images/iphone-17.png" },
    { name: "Galaxy S26 Ultra", category: "Smartphones", badge: "65% OFF", newPrice: 45500, oldPrice: 129999, img: "images/galaxy-s26-ultra.png" },
    { name: "OnePlus 15", category: "Smartphones", badge: "65% OFF", newPrice: 28000, oldPrice: 79999, img: "images/oneplus-15.png" },
    { name: "Pixel 10 Pro XL", category: "Smartphones", badge: "65% OFF", newPrice: 43750, oldPrice: 124999, img: "images/pixel-10-pro-xl.png" },
    { name: "Apple Watch Series 10", category: "Smart Watches", badge: "15% OFF", newPrice: 41900, oldPrice: 49900, img: "images/apple-watch-10.png" },
    { name: "Samsung Galaxy Watch 7", category: "Smart Watches", badge: "18% OFF", newPrice: 27900, oldPrice: 33900, img: "images/galaxy-watch-7.png" },
    { name: "Apple AirPods Pro 2", category: "Earbuds", badge: "15% OFF", newPrice: 21900, oldPrice: 25900, img: "images/airpods-pro-2.png" },
    { name: "Sony WF-1000XM5", category: "Earbuds", badge: "22% OFF", newPrice: 19900, oldPrice: 25900, img: "images/sony-wf-1000xm5.png" },
    { name: "Anker 20,000mAh Power Bank", category: "Accessories", badge: "10% OFF", newPrice: 2699, oldPrice: 2999, img: "images/anker-powerbank.png" }
];

function safeGetStorage(key, fallback) {
    try {
        const rawValue = localStorage.getItem(key);
        if (rawValue === null || rawValue === "") return fallback;
        return JSON.parse(rawValue);
    } catch (error) {
        console.warn(`Storage read failed for ${key}:`, error);
        return fallback;
    }
}

function safeSetStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Storage write failed for ${key}:`, error);
    }
}

function getActiveSettings() {
    return safeGetStorage('tgzi_settings', BASE_DEFAULT_SETTINGS);
}

function getActiveProducts() {
    const storedProducts = safeGetStorage('tgzi_products', null);
    if (!storedProducts) {
        safeSetStorage('tgzi_products', INITIAL_STOCK_PRODUCTS);
        return INITIAL_STOCK_PRODUCTS;
    }
    return Array.isArray(storedProducts) ? storedProducts : INITIAL_STOCK_PRODUCTS;
}

document.addEventListener("DOMContentLoaded", () => {
    const config = getActiveSettings();
    const dynamicCatalog = getActiveProducts();

    // Update floating icons/call links with Admin Settings
    document.querySelectorAll("a[href*='wa.me']").forEach(link => {
        link.href = `https://wa.me/${config.waNumber}`;
    });
    const waFloater = document.querySelector(".whatsapp-float");
    if(waFloater) waFloater.href = `https://wa.me/${config.waNumber}`;

    document.querySelectorAll("a[href*='tel:']").forEach(link => {
        link.href = `tel:${config.callNumber}`;
    });
    const callContactBtn = document.querySelector(".call-contact");
    if(callContactBtn) callContactBtn.href = `tel:${config.callNumber}`;
    
    const waContactBtn = document.querySelector(".whatsapp-contact");
    if(waContactBtn) waContactBtn.href = `https://wa.me/${config.waNumber}`;

    // Render Dynamic Products by Category
    const sectionsMapping = {
        "Smartphones": document.querySelector("#featured-mobiles .product-slider"),
        "Smart Watches": document.querySelector("#featured-smartwatches .product-slider"),
        "Earbuds": document.querySelector("#featured-earbuds .product-slider"),
        "Accessories": document.querySelector("#featured-accessories .product-slider")
    };

    Object.values(sectionsMapping).forEach(slider => {
        if (slider) slider.innerHTML = '';
    });

    dynamicCatalog.forEach(p => {
        const targetSlider = sectionsMapping[p.category || "Smartphones"];
        if (targetSlider) {
            targetSlider.innerHTML += `
                <div class="product-card">
                    <span class="discount-badge">${p.badge}</span>
                    <img src="${p.img}" alt="${p.name}" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'">
                    <h3>${p.name}</h3>
                    <div class="product-price">
                        <span class="new-price">₹${parseInt(p.newPrice).toLocaleString('en-IN')}</span>
                        <span class="old-price">₹${parseInt(p.oldPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <button class="order-now-btn" onclick="openOrderOptions('${p.name.replace(/'/g, "\\'")}')">Order Now</button>
                </div>
            `;
        }
    });

    // --- UX ACTIONS ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById("progress-bar");
        if (progressBar) progressBar.style.width = scrolled + "%";
    });

    // Drawer Menu Logic
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    if(menuBtn && mobileMenu && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
        });
    }
    const hideMenu = () => {
        if(mobileMenu && menuOverlay) {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    };
    if(closeMenu) closeMenu.addEventListener('click', hideMenu);
    if(menuOverlay) menuOverlay.addEventListener('click', hideMenu);

    // Accordion Control
    document.querySelectorAll('.menu-accordion-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const panel = button.nextElementSibling;
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !expanded);
            if (!expanded) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });

    // FAQ Accordion Controls
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const answer = button.nextElementSibling;
            if (button.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                button.querySelector('span').textContent = '−';
            } else {
                answer.style.maxHeight = 0;
                button.querySelector('span').textContent = '+';
            }
        });
    });

    // Search bar filter engine
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    if(searchBtn && searchBar) {
        searchBtn.addEventListener('click', () => {
            searchBar.classList.add('active');
            searchInput.focus();
        });
    }
    if(closeSearch && searchBar) {
        closeSearch.addEventListener('click', () => {
            searchBar.classList.remove('active');
            searchInput.value = '';
            filterSearchItems('');
        });
    }
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterSearchItems(e.target.value.toLowerCase());
        });
    }

    function filterSearchItems(query) {
        let itemsFound = false;
        document.querySelectorAll('.product-card').forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block';
                itemsFound = true;
            } else {
                card.style.display = 'none';
            }
        });
        const noResults = document.getElementById('noResults');
        if(noResults) noResults.style.display = itemsFound ? 'none' : 'block';
    }

    // Interactive countdown
    let countTime = 3600 * 3; // 3 hours
    const cdBox = document.getElementById('countdown');
    if(cdBox) {
        setInterval(() => {
            if(countTime > 0) {
                countTime--;
                let hrs = Math.floor(countTime / 3600);
                let mins = Math.floor((countTime % 3600) / 60);
                let secs = countTime % 60;
                cdBox.textContent = `${String(hrs).padStart(2,'0')}h ${String(mins).padStart(2,'0')}m ${String(secs).padStart(2,'0')}s`;
            }
        }, 1000);
    }

    // Exit intent dialog trigger
    let exitPopupShown = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 20 && !exitPopupShown) {
            const exitPopup = document.getElementById('exitPopup');
            if(exitPopup) {
                exitPopup.classList.add('active');
                exitPopupShown = true;
            }
        }
    });
    const closePopup = document.getElementById('closePopup');
    if(closePopup) {
        closePopup.addEventListener('click', () => {
            document.getElementById('exitPopup').classList.remove('active');
        });
    }

    // Dynamic fake elements
    const stockCountEl = document.getElementById('stock-count');
    const visitorCountEl = document.getElementById('visitor-count');
    if(stockCountEl) {
        setInterval(() => {
            let current = parseInt(stockCountEl.textContent);
            if(current > 3 && Math.random() > 0.85) {
                stockCountEl.textContent = current - 1;
            }
        }, 8000);
    }
    if(visitorCountEl) {
        setInterval(() => {
            let change = Math.floor(Math.random() * 11) - 5;
            let current = parseInt(visitorCountEl.textContent);
            visitorCountEl.textContent = Math.max(80, Math.min(250, current + change));
        }, 4000);
    }

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if(backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Modals Control mapping
    const orderModal = document.getElementById('orderModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const orderFormModal = document.getElementById('orderFormModal');
    const closeOrderFormModal = document.getElementById('closeOrderFormModal');

    if(closeOrderModal) {
        closeOrderModal.addEventListener('click', () => {
            orderModal.style.display = 'none';
        });
    }
    if(closeOrderFormModal) {
        closeOrderFormModal.addEventListener('click', () => {
            orderFormModal.style.display = 'none';
        });
    }

    const orderPaymentBtn = document.getElementById('orderPaymentBtn');
    if(orderPaymentBtn) {
        orderPaymentBtn.addEventListener('click', () => {
            orderModal.style.display = 'none';
            orderFormModal.style.display = 'flex';
        });
    }
});

function openOrderOptions(productName) {
    const config = getActiveSettings();
    document.getElementById('orderProductName').textContent = productName;
    document.getElementById('orderPhoneModel').value = productName;
    
    const whatsappLink = document.getElementById('orderWhatsappLink');
    if (whatsappLink) {
        const textMessage = encodeURIComponent(`Hello, I want to order "${productName}". Please guide me with the steps.`);
        whatsappLink.href = `https://wa.me/${config.waNumber}?text=${textMessage}`;
    }
    
    document.getElementById('orderModal').style.display = 'flex';
}

const orderFormElement = document.getElementById('orderForm');
if (orderFormElement) {
    orderFormElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerName = document.getElementById('orderFullName').value;
        const customerMobile = document.getElementById('orderMobile').value;
        const customerAddress = document.getElementById('orderAddress').value;
        const productSelected = document.getElementById('orderPhoneModel').value;
        const orderQty = document.getElementById('orderQuantity').value;

        const config = getActiveSettings();
        const customOrderId = "TGZ" + Math.floor(100000 + Math.random() * 900000);

        const newOrder = {
            id: customOrderId,
            timestamp: new Date().toLocaleString('en-IN'),
            fullName: customerName,
            mobile: customerMobile,
            address: customerAddress,
            productModel: productSelected,
            quantity: orderQty,
            advanceAmount: config.advanceAmt,
            status: "Pending"
        };

        let activeOrders = safeGetStorage('tgzi_orders', []);
        if (!Array.isArray(activeOrders)) {
            activeOrders = [];
        }
        activeOrders.push(newOrder);
        safeSetStorage('tgzi_orders', activeOrders);
        safeSetStorage('tgzi_active_order_id', customOrderId);

        window.location.href = "order-success.html";
    });
}