
"use strict";

/* =========================================
   FOR MY SARU — INTERACTIVE FEATURES
   ========================================= */

// PERSONAL SETTINGS
// Enter your real relationship anniversary date as YYYY-MM-DD.
// Leave empty until you know which date to use.
const ANNIVERSARY_DATE = "";

// Birthday: November 16. The year updates automatically.
const BIRTHDAY_MONTH = 10; // JavaScript months start at 0
const BIRTHDAY_DAY = 16;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// =========================================
// 1. BIRTHDAY COUNTDOWN
// =========================================

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");
const countdownMessage = document.getElementById("countdownMessage");

function getNextBirthday(now) {
    let target = new Date(
        now.getFullYear(),
        BIRTHDAY_MONTH,
        BIRTHDAY_DAY,
        0, 0, 0, 0
    );

    // If today's birthday has already begun, keep today's date.
    // Otherwise, use the next occurrence of November 16.
    if (
        now.getMonth() > BIRTHDAY_MONTH ||
        (now.getMonth() === BIRTHDAY_MONTH &&
            now.getDate() > BIRTHDAY_DAY)
    ) {
        target = new Date(
            now.getFullYear() + 1,
            BIRTHDAY_MONTH,
            BIRTHDAY_DAY,
            0, 0, 0, 0
        );
    }

    return target;
}

function updateCountdown() {
    const now = new Date();

    const isBirthdayToday =
        now.getMonth() === BIRTHDAY_MONTH &&
        now.getDate() === BIRTHDAY_DAY;

    if (isBirthdayToday) {
        daysElement.textContent = "00";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        countdownMessage.textContent =
            "It's your special day, Saru! Happy Birthday! 🎂❤️";

        return;
    }

    const target = getNextBirthday(now);
    const difference = Math.max(0, target.getTime() - now.getTime());

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysElement.textContent = String(days).padStart(2, "0");
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    countdownMessage.textContent =
        "Every second brings us closer to your special day. 💗";
}

updateCountdown();

// Update once every second.
window.setInterval(updateCountdown, 1000);


// =========================================
// 2. BIRTHDAY WISH GENERATOR
// =========================================

const wishButton = document.getElementById("wishButton");
const wishText = document.getElementById("wishText");

const wishes = [
    "May your heart stay happy, your dreams grow bigger, and your smile never lose its magic. 💗",
    "May this new year of your life bring you peace, confidence, success, and beautiful surprises. 🌷",
    "May you always find reasons to smile and the courage to follow every dream in your heart. ✨",
    "My wish is to see you happy, healthy, confident, and proud of everything you achieve. ❤️",
    "May every difficult day make you stronger and every beautiful moment give you another reason to smile. 🫶",
    "Happy Birthday, Saru. May life bring you the kind of happiness you truly deserve. 🎂"
];

let previousWish = -1;

wishButton.addEventListener("click", () => {
    let index;

    do {
        index = Math.floor(Math.random() * wishes.length);
    } while (wishes.length > 1 && index === previousWish);

    previousWish = index;
    wishText.textContent = wishes[index];
});


// =========================================
// 3. PHOTO GALLERY AND LIGHTBOX
// =========================================

const memoryCards = document.querySelectorAll(".memory-card");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightboxButton = document.getElementById("closeLightbox");
const photoPicker = document.getElementById("memoryPhotoPicker");
const galleryStatus = document.getElementById("galleryStatus");

let lastFocusedElement = null;
let activePhotoCard = null;

// Show a placeholder if an image has not been added or cannot load.
memoryCards.forEach((card) => {
    const image = card.querySelector("img");

    function markImageLoaded() {
        image.hidden = false;
        card.classList.add("has-image");
        card.dataset.imageAvailable = "true";
        galleryStatus.textContent = "";
    }

    function markImageUnavailable() {
        card.classList.remove("has-image");
        card.dataset.imageAvailable = "false";
        image.hidden = true;

        if (image.dataset.objectUrl) {
            galleryStatus.textContent =
                "That photo could not be opened. Please choose a different image.";
        }
    }

    image.addEventListener("load", markImageLoaded);
    image.addEventListener("error", markImageUnavailable);

    // Handle images that loaded before these listeners were attached.
    if (image.complete) {
        if (image.naturalWidth > 0) {
            markImageLoaded();
        } else {
            markImageUnavailable();
        }
    }

    card.addEventListener("click", () => {
        if (card.dataset.imageAvailable !== "true") {
            activePhotoCard = card;
            photoPicker.click();
            return;
        }

        lastFocusedElement = card;

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = card.dataset.caption;

        if (typeof lightbox.showModal === "function") {
            lightbox.showModal();
            closeLightboxButton.focus();
        }
    });
});

photoPicker.addEventListener("change", () => {
    const file = photoPicker.files[0];
    const card = activePhotoCard;
    activePhotoCard = null;
    photoPicker.value = "";

    if (!file || !card) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        galleryStatus.textContent = "Please choose a valid image file.";
        return;
    }

    const image = card.querySelector("img");

    if (image.dataset.objectUrl) {
        URL.revokeObjectURL(image.dataset.objectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    image.dataset.objectUrl = objectUrl;
    image.hidden = false;
    image.src = objectUrl;
});

function closeLightbox() {
    if (lightbox.open) {
        lightbox.close();
    }
}

closeLightboxButton.addEventListener("click", closeLightbox);

// The dialog closes automatically with the Escape key.
lightbox.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
    }
});

// Close when clicking the backdrop, not the image or dialog content.
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});


// =========================================
// 4. FLOATING HEARTS
// =========================================

const floatingHearts = document.getElementById("floatingHearts");
const heartSymbols = ["♥", "♡", "❤", "✦"];

function createFloatingHeart() {
    if (reducedMotion) return;

    const heart = document.createElement("span");

    heart.className = "floating-heart";
    heart.setAttribute("aria-hidden", "true");

    heart.textContent =
        heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 17}px`;

    const duration = 7 + Math.random() * 6;
    heart.style.animationDuration = `${duration}s`;

    floatingHearts.appendChild(heart);

    heart.addEventListener("animationend", () => {
        heart.remove();
    }, { once: true });
}

if (!reducedMotion) {
    createFloatingHeart();

    window.setInterval(createFloatingHeart, 1100);
}


// =========================================
// 5. SURPRISE MESSAGE AND CONFETTI
// =========================================

const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
const confettiLayer = document.getElementById("confettiLayer");

const confettiSymbols = ["💗", "♥", "♡", "✨", "💕", "🌸"];

function celebrateWithConfetti() {
    if (reducedMotion) return;

    // Clear previous pieces before starting another celebration.
    confettiLayer.replaceChildren();

    for (let i = 0; i < 35; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti-piece";
        piece.textContent =
            confettiSymbols[
                Math.floor(Math.random() * confettiSymbols.length)
            ];

        piece.style.left = `${Math.random() * 100}%`;
        piece.style.animationDelay = `${Math.random() * 1.2}s`;
        piece.style.animationDuration = `${2.5 + Math.random() * 1.5}s`;
        piece.style.fontSize = `${13 + Math.random() * 13}px`;

        confettiLayer.appendChild(piece);

        piece.addEventListener("animationend", () => {
            piece.remove();
        }, { once: true });
    }
}

surpriseButton.addEventListener("click", () => {
    const willOpen = surpriseMessage.hidden;

    surpriseMessage.hidden = !willOpen;
    surpriseButton.setAttribute("aria-expanded", String(willOpen));

    surpriseButton.textContent = willOpen
        ? "Close Surprise ♡"
        : "Open My Heart 💌";

    if (willOpen) {
        celebrateWithConfetti();

        surpriseMessage.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: "center"
        });
    } else {
        confettiLayer.replaceChildren();
    }
});


// =========================================
// 6. PERSONAL ANNIVERSARY SETTING
// =========================================

// This helper is available when you want to display the actual
// anniversary date in the timeline or another section.
function getAnniversaryDate() {
    if (!ANNIVERSARY_DATE) {
        return null;
    }

    // Strictly validate YYYY-MM-DD to prevent invalid dates.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ANNIVERSARY_DATE)) {
        return null;
    }

    const [year, month, day] = ANNIVERSARY_DATE
        .split("-")
        .map(Number);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

// Example: when your real date is known, set ANNIVERSARY_DATE above.
// No anniversary date is assumed or invented.

console.log("For My Saru ❤️ — made with love by Satyajit.");
