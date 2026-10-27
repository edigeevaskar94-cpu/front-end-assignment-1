
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.querySelector("#yachtSearch");
    const categoryFilter = document.querySelector("#categoryFilter");
    const priceFilter = document.querySelector("#priceFilter");
    const resetButton = document.querySelector("#resetSearch");
    const resultText = document.querySelector("#searchResult");

    const yachtCards = document.querySelectorAll(".fleet .car-card");

    // Yacht data stored in an array of objects
    const yachts = [
        { name: "Ocean Pearl", category: "luxury", price: 120000 },
        { name: "Sea Breeze", category: "family", price: 150000 },
        { name: "Royal Wave", category: "luxury", price: 200000 },
        { name: "Blue Horizon", category: "family", price: 170000 },
        { name: "Silver Wave", category: "private", price: 145000 },
        { name: "Sunset Dream", category: "private", price: 130000 }
    ];

    function filterYachts() {
        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;

        let found = 0;

        yachtCards.forEach(function (card) {
            const name = card.querySelector("h2").textContent.trim();

            const yacht = yachts.find(function (item) {
                return item.name === name;
            });

            if (!yacht) return;

            const matchesSearch = yacht.name.toLowerCase().includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                yacht.category === selectedCategory;

            let matchesPrice = true;

            switch (selectedPrice) {
                case "budget":
                    matchesPrice = yacht.price <= 150000;
                    break;

                case "medium":
                    matchesPrice = yacht.price > 150000 && yacht.price <= 180000;
                    break;

                case "premium":
                    matchesPrice = yacht.price > 180000;
                    break;

                default:
                    matchesPrice = true;
            }

            if (matchesSearch && matchesCategory && matchesPrice) {
                card.parentElement.style.display = "";
                found++;
            } else {
                card.parentElement.style.display = "none";
            }
        });

        resultText.textContent = "Yachts found: " + found;
    }

    if (searchInput && categoryFilter && priceFilter &&
        resetButton && resultText) {

        searchInput.addEventListener("input", filterYachts);
        categoryFilter.addEventListener("change", filterYachts);
        priceFilter.addEventListener("change", filterYachts);

        resetButton.addEventListener("click", function () {
            searchInput.value = "";
            categoryFilter.value = "all";
            priceFilter.value = "all";
            filterYachts();
        });

        filterYachts();
    }

    
// Day and Night Mode
const themeButton = document.querySelector("#themeToggle");

if (themeButton) {
    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");

        const isDark = document.body.classList.contains("dark-theme");

        if (isDark) {
            themeButton.textContent = "Switch to Light Mode";
            themeButton.classList.replace("btn-dark", "btn-light");
        } else {
            themeButton.textContent = "Switch to Dark Mode";
            themeButton.classList.replace("btn-light", "btn-dark");
        }

        themeButton.setAttribute("aria-pressed", String(isDark));
    });
}

// Interactive Image Gallery

const galleryItems = document.querySelectorAll(".gallery-item");

const featuredImage = document.querySelector("#featuredYachtImage");
const featuredCaption = document.querySelector("#featuredYachtCaption");

if (featuredImage && featuredCaption) {

    function selectGalleryImage(item) {
        const image = item.querySelector("img");
        const caption = item.querySelector(".gallery-caption");

        if (!image || !caption) return;

        featuredImage.src = image.getAttribute("src");
        featuredImage.alt = image.alt;
        featuredCaption.textContent = caption.textContent;

        galleryItems.forEach(function (galleryItem) {
            galleryItem.classList.remove("selected");
        });

        item.classList.add("selected");
    }

    galleryItems.forEach(function (item) {
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");

        const image = item.querySelector("img");
        item.setAttribute(
            "aria-label",
            "View " + (image ? image.alt : "yacht image")
        );

        item.addEventListener("click", function () {
            selectGalleryImage(item);
        });

        item.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectGalleryImage(item);
            }
        });
    });

    if (galleryItems.length > 0) {
        selectGalleryImage(galleryItems[0]);
    }
}

// Interactive Star Rating

const ratingStars = document.querySelectorAll(".rating-star");
const ratingResult = document.querySelector("#ratingResult");

ratingStars.forEach(function (star) {

    star.addEventListener("click", function () {

        const selectedRating = Number(star.dataset.value);

        ratingStars.forEach(function (item) {

            const starValue = Number(item.dataset.value);

            if (starValue <= selectedRating) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }

            item.setAttribute(
                "aria-pressed",
                String(starValue === selectedRating)
            );
        });

        ratingResult.textContent =
            "Thank you! You rated us " +
            selectedRating + " out of 5 stars.";
    });
});

// Yacht Animation and Sound Effects

const startButton = document.querySelector("#startJourney");
const soundButton = document.querySelector("#playSound");
const animatedYacht = document.querySelector("#animatedYacht");
const journeyMessage = document.querySelector("#journeyMessage");

if (startButton && animatedYacht && journeyMessage) {

    startButton.addEventListener("click", function () {
        journeyMessage.textContent = "Your journey has started!";
        startButton.disabled = true;

        animatedYacht.classList.remove("is-sailing");

        // Restart the animation
        void animatedYacht.offsetWidth;

        animatedYacht.classList.add("is-sailing");
    });

    animatedYacht.addEventListener("animationend", function () {
        journeyMessage.textContent = "Your yacht has arrived!";
        startButton.disabled = false;
    });
}

// Generate a short sound without an audio file

if (soundButton) {
    let audioContext = null;
    let soundPlaying = false;

    soundButton.addEventListener("click", function () {
        if (soundPlaying) return;

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            soundButton.textContent = "Sound unavailable";
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        audioContext.resume();

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(660, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        soundPlaying = true;

        oscillator.onended = function () {
            soundPlaying = false;
            oscillator.disconnect();
            gain.disconnect();
        };

        oscillator.start(now);
        oscillator.stop(now + 0.35);
    });
}

// Keyboard Navigation

const navLinks = document.querySelectorAll("#main-header .nav-menu a");

navLinks.forEach(function (link, index) {

    link.addEventListener("keydown", function (event) {

        let nextIndex;

        switch (event.key) {

            case "ArrowRight":
            case "ArrowDown":
                nextIndex = (index + 1) % navLinks.length;
                break;

            case "ArrowLeft":
            case "ArrowUp":
                nextIndex = (index - 1 + navLinks.length) % navLinks.length;
                break;

            case "Home":
                nextIndex = 0;
                break;

            case "End":
                nextIndex = navLinks.length - 1;
                break;

            default:
                return;
        }

        event.preventDefault();
        navLinks[nextIndex].focus();
    });
});

});
