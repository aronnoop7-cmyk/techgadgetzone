console.log("Tech Gadget Zone India - script loaded");

/* ==========================================================================
   CONTACT NUMBER (single source of truth — update with the real number)
   ========================================================================== */
const WHATSAPP_NUMBER = "16728972711";

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");

if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

function setBodyScroll(enabled) {
  document.body.style.overflow = enabled ? "" : "hidden";
}

function openMenu() {
  mobileMenu?.classList.add("open");
  menuOverlay?.classList.add("open");
  menuBtn?.setAttribute("aria-expanded", "true");
  setBodyScroll(false);
}

function closeMenu() {
  mobileMenu?.classList.remove("open");
  menuOverlay?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
  setBodyScroll(true);
}

menuBtn?.addEventListener("click", openMenu);
closeMenuBtn?.addEventListener("click", () => {
  closeMenu();
  resetMenuAccordions();
});
menuOverlay?.addEventListener("click", () => {
  closeMenu();
  resetMenuAccordions();
});

/* Category accordion inside the mobile menu (Smartphones / Smart Watches /
   Earbuds / Accessories) — tapping a category expands its brand list in
   place instead of navigating to a new page. Only a brand link navigates. */
document.querySelectorAll(".menu-accordion-toggle").forEach((toggle) => {
  const accordion = toggle.parentElement;
  const panel = accordion.querySelector(".menu-accordion-panel");

  toggle.addEventListener("click", () => {
    const isOpen = accordion.classList.contains("open");

    if (isOpen) {
      panel.style.maxHeight = null;
      accordion.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      accordion.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
});

// Reset the mobile menu's accordion state whenever the menu is closed,
// so it reopens fresh next time.
function resetMenuAccordions() {
  document.querySelectorAll(".menu-accordion.open").forEach((accordion) => {
    accordion.classList.remove("open");
    const panel = accordion.querySelector(".menu-accordion-panel");
    if (panel) panel.style.maxHeight = null;
    const toggle = accordion.querySelector(".menu-accordion-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
}


/* ==========================================================================
   SEARCH
   ========================================================================== */
const searchBtn = document.getElementById("searchBtn");
const searchBar = document.getElementById("searchBar");
const searchInput = document.getElementById("searchInput");
const closeSearchBtn = document.getElementById("closeSearch");

function openSearch() {
  searchBar?.classList.add("open");
  searchBtn?.setAttribute("aria-expanded", "true");
  searchInput?.focus();
}

function closeSearch() {
  searchBar?.classList.remove("open");
  searchBtn?.setAttribute("aria-expanded", "false");
  if (searchInput) searchInput.value = "";
  filterProducts("");
}

function filterProducts(query) {
  const q = query.trim().toLowerCase();
  const cards = document.querySelectorAll(".product-card");
  let anyVisible = false;

  cards.forEach((card) => {
    const name = card.querySelector("h3")?.textContent.toLowerCase() || "";
    const matches = name.includes(q);
    card.classList.toggle("hidden", q.length > 0 && !matches);
    if (q.length === 0 || matches) anyVisible = true;
  });

  const noResults = document.getElementById("noResults");
  if (noResults) noResults.classList.toggle("show", q.length > 0 && !anyVisible && cards.length > 0);
}

searchBtn?.addEventListener("click", openSearch);
closeSearchBtn?.addEventListener("click", closeSearch);
searchInput?.addEventListener("input", (e) => filterProducts(e.target.value));
searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSearch();
});

/* ==========================================================================
   CART (placeholder — no cart system yet)
   ========================================================================== */
const cartBtn = document.getElementById("cartBtn");
cartBtn?.addEventListener("click", () => alert("Cart feature coming soon!"));

/* ==========================================================================
   ORDER NOW MODAL
   ========================================================================== */
const orderModal = document.getElementById("orderModal");
const orderProductName = document.getElementById("orderProductName");
const orderWhatsappLink = document.getElementById("orderWhatsappLink");
const orderPaymentBtn = document.getElementById("orderPaymentBtn");
const closeOrderModalBtn = document.getElementById("closeOrderModal");

let currentOrderProduct = "";

function openOrderOptions(productName) {
  currentOrderProduct = productName;

  if (!orderModal) {
    // Fallback for any page that hasn't been updated with the modal markup yet
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I want to order: " + productName)}`,
      "_blank"
    );
    return;
  }

  if (orderProductName) orderProductName.textContent = productName;
  if (orderWhatsappLink) {
    orderWhatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hi, I want to order: " + productName
    )}`;
  }
 
  orderModal.classList.add("open");
  setBodyScroll(false);
}
 
function closeOrderModal() {
  orderModal?.classList.remove("open");
  setBodyScroll(true);
}

closeOrderModalBtn?.addEventListener("click", closeOrderModal);
orderModal?.addEventListener("click", (e) => {
  if (e.target === orderModal) closeOrderModal();
});

/* ==========================================================================
   ORDER FORM MODAL (triggered by "Payment & Order")
   ========================================================================== */
const orderFormModal = document.getElementById("orderFormModal");
const orderForm = document.getElementById("orderForm");
const orderPhoneModelInput = document.getElementById("orderPhoneModel");
const closeOrderFormModalBtn = document.getElementById("closeOrderFormModal");

if (orderModal) {
  orderModal.setAttribute("role", "dialog");
  orderModal.setAttribute("aria-modal", "true");
}

if (orderFormModal) {
  orderFormModal.setAttribute("role", "dialog");
  orderFormModal.setAttribute("aria-modal", "true");
}

function openOrderForm() {
  closeOrderModal();
  if (orderPhoneModelInput) orderPhoneModelInput.value = currentOrderProduct;
  orderFormModal?.classList.add("open");
  setBodyScroll(false);
}

function closeOrderForm() {
  orderFormModal?.classList.remove("open");
  setBodyScroll(true);
}

orderPaymentBtn?.addEventListener("click", openOrderForm);
closeOrderFormModalBtn?.addEventListener("click", closeOrderForm);
orderFormModal?.addEventListener("click", (e) => {
  if (e.target === orderFormModal) closeOrderForm();
});

orderForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  closeOrderForm();

  // Pages inside /pages/ need a relative "../" prefix to reach the root page
  const inPagesFolder = window.location.pathname.includes("/pages/");
  window.location.href = inPagesFolder ? "../order-success.html" : "order-success.html";
});

/* ==========================================================================
   COUNTDOWN (only runs on pages that have #countdown, e.g. the homepage offer)
   ========================================================================== */
const countdownEl = document.getElementById("countdown");
if (countdownEl) {
  const offerTime = new Date().getTime() + 48 * 60 * 60 * 1000;

  setInterval(() => {
    const now = new Date().getTime();
    let distance = offerTime - now;
    if (distance < 0) distance = 0;

    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `${h}h : ${m}m : ${s}s`;
  }, 1000);
}

/* ==========================================================================
   STOCK COUNTER
   ========================================================================== */
const stockEl = document.getElementById("stock-count");
if (stockEl) {
  setInterval(() => {
    const value = parseInt(stockEl.innerHTML, 10);
    if (value > 5) stockEl.innerHTML = value - 1;
  }, 25000);
}

/* ==========================================================================
   VISITOR COUNTER
   ========================================================================== */
const visitorEl = document.getElementById("visitor-count");
if (visitorEl) {
  setInterval(() => {
    const random = 120 + Math.floor(Math.random() * 40);
    visitorEl.innerHTML = random;
  }, 5000);
}

/* ==========================================================================
   AUTO REVIEW SLIDER
   ========================================================================== */
const reviewsContainer = document.querySelector(".reviews-container");
const firstReviewCard = reviewsContainer?.querySelector(".review-card");

if (reviewsContainer && firstReviewCard) {
  const reviewWidth = firstReviewCard.offsetWidth + 12;
  let currentReview = 0;

  setInterval(() => {
    currentReview++;
    if (currentReview >= reviewsContainer.children.length) currentReview = 0;
    reviewsContainer.scrollTo({ left: reviewWidth * currentReview, behavior: "smooth" });
  }, 5000);
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.parentElement.classList.toggle("active");
  });
});

/* ==========================================================================
   BACK TO TOP
   ========================================================================== */
const backBtn = document.getElementById("backToTop");
if (backBtn) {
  window.addEventListener("scroll", () => {
    backBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.querySelectorAll(".sticky-order-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    if (btn.getAttribute("href") === "#") {
      event.preventDefault();
      const firstProduct = document.querySelector(".product-card .order-now-btn");
      const firstProductName = firstProduct?.closest(".product-card")?.querySelector("h3")?.textContent?.trim();
      if (firstProductName) {
        openOrderOptions(firstProductName);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (searchBar?.classList.contains("open")) closeSearch();
    if (mobileMenu?.classList.contains("open")) closeMenu();
    if (orderFormModal?.classList.contains("open")) closeOrderForm();
    else if (orderModal?.classList.contains("open")) closeOrderModal();
    if (exitPopup && exitPopup.style.display === "flex") exitPopup.style.display = "none";
  }
});

/* ==========================================================================
   EXIT INTENT POPUP
   ========================================================================== */
const exitPopup = document.getElementById("exitPopup");
const closePopupBtn = document.getElementById("closePopup");

if (exitPopup && closePopupBtn) {
  let popupShown = false;

  document.addEventListener("mouseout", (e) => {
    if (e.clientY < 5 && !popupShown) {
      exitPopup.style.display = "flex";
      popupShown = true;
    }
  });

  closePopupBtn.addEventListener("click", () => (exitPopup.style.display = "none"));
  exitPopup.addEventListener("click", (e) => {
    if (e.target === exitPopup) exitPopup.style.display = "none";
  });
}

/* ==========================================================================
   IMAGE AUTO-CONNECT / GRACEFUL FALLBACK
   Every product image and brand logo already points at the exact file the
   site expects (see /images/ADD_IMAGES_HERE.txt). The moment a real file is
   dropped in with that same name, it appears everywhere automatically —
   no code changes needed. Until then, this swaps a missing file for a
   neutral placeholder instead of a broken-image icon, so the layout never
   breaks while assets are still being added.
   ========================================================================== */
document.querySelectorAll("img.product-image, img.menu-brand-logo").forEach((img) => {
  img.addEventListener(
    "error",
    function () {
      this.onerror = null;
      this.src = this.classList.contains("menu-brand-logo")
        ? "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='20' rx='4' fill='%23f3f6fb'/%3E%3C/svg%3E"
        : "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='135' height='135'%3E%3Crect width='135' height='135' fill='%23f7f9fc'/%3E%3C/svg%3E";
      this.classList.add("img-pending");
    },
    { once: true }
  );
});
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
