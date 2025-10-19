/* ================== Helpers ================== */
const $  = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => p.querySelectorAll(s);

/* ================== Sticky header (nhẹ) ================== */
const headerEl = $(".page-header");
const onScrollLift = () => {
headerEl.style.transform = window.scrollY > 10 ? "translateY(-2px)" : "translateY(0)";
};
window.addEventListener("scroll", onScrollLift);

/* ================== Menu mobile: lưu trạng thái + auto-close ================== */
const checkbox = $("#click");
const MENU_KEY = "ngysytho-menu";
if (checkbox) {
checkbox.checked = localStorage.getItem(MENU_KEY) === "1";
checkbox.addEventListener("change", () => {
    localStorage.setItem(MENU_KEY, checkbox.checked ? "1" : "0");
});
}

/* ================== Typewriter cho tên ================== */
function typewriter(el, speed = 65) {
if (!el) return;
const full = el.getAttribute("data-text") || el.textContent.trim();
el.textContent = "";
let i = 0;
(function tick() {
    if (i <= full.length) {
    el.textContent = full.slice(0, i++);
    setTimeout(tick, speed);
    }
})();
}
window.addEventListener("load", () => typewriter($("#typingTarget"), 60));

/* ================== Theme toggle + transition mượt ================== */
const themeBtn = $("#themeToggle");
const THEME_KEY = "ngysytho-theme";
function applyTheme(theme) {
document.documentElement.classList.add("theme-anim");
document.documentElement.setAttribute("data-theme", theme);
if (themeBtn) themeBtn.innerHTML = `<i class='bx ${theme === "dark" ? "bx-sun" : "bx-moon"}'></i>`;
setTimeout(() => document.documentElement.classList.remove("theme-anim"), 260);
}
(function initTheme(){
const stored = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(stored || (prefersDark ? "dark" : "light"));
})();
themeBtn?.addEventListener("click", () => {
const curr = document.documentElement.getAttribute("data-theme") || "dark";
const next = curr === "dark" ? "light" : "dark";
applyTheme(next);
localStorage.setItem(THEME_KEY, next);
});

/* ================== Shortcuts: T đổi theme, G lên đầu ================== */
window.addEventListener("keydown", (e) => {
if (["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) return;
const k = e.key.toLowerCase();
if (k === "t") themeBtn?.click();
if (k === "g") window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ================== Progress bar trên cùng ================== */
const progress = $("#progress");
const onScrollProgress = () => {
const h = document.documentElement;
const max = h.scrollHeight - h.clientHeight;
progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
};
window.addEventListener("scroll", onScrollProgress); onScrollProgress();

/* ================== Back-to-Top ================== */
const backTop = $("#backTop");
const onScrollBackTop = () => {
if (!backTop) return;
window.scrollY > 400 ? backTop.classList.add("show") : backTop.classList.remove("show");
};
window.addEventListener("scroll", onScrollBackTop); onScrollBackTop();
backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ================== Toast + Copy email ================== */
const toast = $("#toast");
function showToast(msg, ms = 1800) {
if (!toast) return;
toast.textContent = msg;
toast.classList.add("show");
setTimeout(() => toast.classList.remove("show"), ms);
}
$("#copyEmailBtn")?.addEventListener("click", () => {
navigator.clipboard?.writeText("hello@galloptech.vn")
    .then(() => showToast("Copied: hello@galloptech.vn"))
    .catch(() => {});
});

/* ================== Scroll-Spy CHUẨN + Smooth scroll bù offset ================== */
/* Header offset (dùng cho tính active & smooth scroll) */
function headerOffset() {
const h = $(".page-header");
return (h?.offsetHeight || 0) + 12; // +12px buffer
}

/* Smooth scroll cho các anchor trong menu, có bù offset header */
$$('header ul a[href^="#"]').forEach(a => {
a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    // Auto-close menu mobile
    if (checkbox?.checked) { checkbox.checked = false; localStorage.setItem(MENU_KEY, "0"); }

    const top = target.offsetTop - headerOffset();
    window.scrollTo({ top, behavior: "smooth" });
});
});

/* Auto-close khi click bất kỳ link menu (kể cả link ngoài) */
$$("header ul a").forEach(a => {
a.addEventListener("click", () => {
    if (checkbox?.checked) { checkbox.checked = false; localStorage.setItem(MENU_KEY, "0"); }
});
});

/* Tập mục tiêu spy */
const NAV_SECTIONS = [
{ id: "#top",     el: $("#top")     },
{ id: "#about",   el: $("#about")   },
{ id: "#contact", el: $("#contact") },
].filter(s => s.el);

const navLinksAll = Array.from($$("header ul a"));

function setActive(hash) {
navLinksAll.forEach(a => a.classList.remove("active"));
const link = document.querySelector(`header ul a[href="${hash}"]`);
if (link) link.classList.add("active");
}

/* Cập nhật active dựa trên vị trí scroll + offset header */
function updateActiveOnScroll() {
const y = window.scrollY + headerOffset() + 1;
let current = "#top";
for (const { id, el } of NAV_SECTIONS) {
    if (y >= el.offsetTop) current = id;
}
setActive(current);
}

/* Lắng nghe sự kiện */
["scroll","load","resize"].forEach(ev =>
window.addEventListener(ev, updateActiveOnScroll, { passive: true })
);
/* Trạng thái ban đầu */
updateActiveOnScroll();

/* ================== Parallax tilt avatar + lazy fallback ================== */
const avatar = $(".img-w");
const wrap = $(".images");
if (avatar && wrap) {
const maxTilt = 10;
wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    avatar.style.transform = `rotateX(${(0.5 - y) * maxTilt}deg) rotateY(${(x - 0.5) * maxTilt}deg)`;
});
wrap.addEventListener("mouseleave", () => avatar.style.transform = "rotateX(0) rotateY(0)");
avatar.addEventListener("error", () => { avatar.src = "https://picsum.photos/640?grayscale"; }, { once: true });
}

/* ================== Đổi title khi rời tab ================== */
const originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
document.title = document.hidden ? "Come back, more cool stuff 🤘" : originalTitle;
});

/* ================== Năm ở footer ================== */
$("#year").textContent = new Date().getFullYear();
