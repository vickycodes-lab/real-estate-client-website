// ============================================================
// BAJRANG REALTY — FULL FRONTEND SCRIPT (FIXED VERSION)
// ============================================================

const API_BASE = 'http://localhost:5000/api';

// ── HELPERS ─────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Toast
function showToast(message, type = 'success') {
  const toast = $('#formToast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `form-toast form-toast--${type}`;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// ── SCROLL INDICATOR (FIXED BUG) ────────────────────────────
const scrollIndicator = $('.scroll-indicator');

// ── NAVBAR ──────────────────────────────────────────────────
const navbar = $('#navbar');
const mobileMenuToggle = $('#mobileMenuToggle');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 100);

  if (scrollIndicator) {
    scrollIndicator.style.opacity = window.scrollY > 300 ? '0' : '1';
  }
});

// Mobile menu
mobileMenuToggle?.addEventListener('click', () => {
  $('.nav-links')?.classList.toggle('active');
});

// ── SMOOTH SCROLL ───────────────────────────────────────────
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  e.preventDefault();

  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: 'smooth'
    });
  }
});

// ── REVEAL ON SCROLL ────────────────────────────────────────
const revealElements = $$('.reveal');

function revealOnScroll() {
  const h = window.innerHeight;

  revealElements.forEach(el => {
    if (el.getBoundingClientRect().top < h - 120) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);

// ── GOOGLE LOGIN (FIXED + SAFE) ─────────────────────────────
function handleCredentialResponse(response) {
  try {
    const data = JSON.parse(atob(response.credential.split('.')[1]));

    console.log("Google User:", data);

    showToast(`Welcome ${data.name}`, 'success');

    // OPTIONAL: send to backend
    // sendUserToBackend(data);

  } catch (err) {
    console.error("Login Error:", err);
    showToast("Google login failed", 'error');
  }
}

// ── SEND USER TO BACKEND (OPTIONAL) ─────────────────────────
async function sendUserToBackend(user) {
  try {
    await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
  } catch (err) {
    console.log("Backend error:", err);
  }
}

// ── CONTACT FORM ────────────────────────────────────────────
const contactForm = $('#contactForm');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = $('[name="name"]')?.value.trim();
  const phone = $('[name="phone"]')?.value.trim();
  const email = $('[name="email"]')?.value.trim();
  const message = $('[name="message"]')?.value.trim();
  const propertyType = $('[name="propertyType"]')?.value;
  const budget = $('[name="budget"]')?.value;

  if (!name || !phone || !email || !message) {
    showToast("Fill all required fields", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        message: `${budget ? 'Budget: ' + budget + '\n' : ''}${message}`,
        propertyType
      })
    });

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    if (data.success) {
      showToast("Enquiry sent successfully", "success");
      contactForm.reset();
    } else {
      showToast(data.message || "Failed", "error");
    }

  } catch (err) {
    console.log(err);
    showToast("Server not reachable", "error");
  }
});

// ── PROPERTY FILTER ─────────────────────────────────────────
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    $$('.property-card').forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? 'block' : 'none';
    });
  });
});

// ── FAVORITE BUTTON ─────────────────────────────────────────
function bindFavorites() {
  $$('.property-favorite').forEach(btn => {
    btn.onclick = () => {
      btn.classList.toggle('active');
    };
  });
}

// ── INITIAL LOAD ────────────────────────────────────────────
window.addEventListener('load', () => {
  revealOnScroll();
  bindFavorites();

  console.log("🏠 Bajrang Realty Loaded");
});