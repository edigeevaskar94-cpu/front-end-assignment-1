"use strict";

// All Assignment 5 behavior is separate from the team's existing script.js.
document.addEventListener("DOMContentLoaded", function () {
    // Keyboard navigation: arrow keys move focus between navbar links.
    const navigationLinks = [...document.querySelectorAll("#main-header .nav-menu a")];
    navigationLinks.forEach(function (link, index) {
        link.addEventListener("keydown", function (event) {
            let nextIndex;
            switch (event.key) {
                case "ArrowRight":
                case "ArrowDown": nextIndex = (index + 1) % navigationLinks.length; break;
                case "ArrowLeft":
                case "ArrowUp": nextIndex = (index - 1 + navigationLinks.length) % navigationLinks.length; break;
                case "Home": nextIndex = 0; break;
                case "End": nextIndex = navigationLinks.length - 1; break;
                default: return;
            }
            event.preventDefault();
            navigationLinks[nextIndex].focus();
        });
    });

    // About: DOM modification, attributes, dynamic styles and events.
    const themeButton = document.querySelector("#a5-theme");
    if (themeButton) {
        themeButton.addEventListener("click", function () {
            const dark = document.body.classList.toggle("a5-dark");
            themeButton.textContent = dark ? "Switch to Day Mode" : "Switch to Night Mode";
            themeButton.setAttribute("aria-pressed", String(dark));
        });
    }

    const readMoreButton = document.querySelector("#a5-read-more");
    const moreText = document.querySelector("#a5-more");
    if (readMoreButton && moreText) {
        readMoreButton.addEventListener("click", function () {
            moreText.hidden = !moreText.hidden;
            readMoreButton.textContent = moreText.hidden ? "Read More" : "Read Less";
            readMoreButton.setAttribute("aria-expanded", String(!moreText.hidden));
        });
    }

    const stars = [...document.querySelectorAll(".a5-star")];
    const ratingResult = document.querySelector("#a5-rating-result");
    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            const rating = Number(star.dataset.rating);
            stars.forEach(function (other) {
                other.classList.toggle("is-active", Number(other.dataset.rating) <= rating);
                other.setAttribute("aria-pressed", String(Number(other.dataset.rating) === rating));
            });
            ratingResult.textContent = `Thank you! Your rating: ${rating}/5`;
        });
    });

    const sailButton = document.querySelector("#a5-sail");
    const boat = document.querySelector("#a5-boat");
    const journeyResult = document.querySelector("#a5-journey-result");
    if (sailButton && boat && journeyResult) {
        sailButton.addEventListener("click", function () {
            sailButton.disabled = true;
            journeyResult.textContent = "Your yacht is sailing!";
            boat.classList.remove("is-sailing");
            void boat.offsetWidth; // Restart the CSS animation.
            boat.classList.add("is-sailing");
        });
        boat.addEventListener("animationend", function () {
            sailButton.disabled = false;
            journeyResult.textContent = "Your yacht has arrived!";
        });
    }

    // Web Audio API creates a short original notification tone.
    const soundButton = document.querySelector("#a5-sound");
    let audioPlaying = false;
    if (soundButton) {
        soundButton.addEventListener("click", async function () {
            if (audioPlaying) return;
            const AudioContextType = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextType) { soundButton.textContent = "Audio not supported"; return; }
            audioPlaying = true;
            try {
                const audio = new AudioContextType();
                await audio.resume();
                const oscillator = audio.createOscillator();
                const gain = audio.createGain();
                oscillator.type = "sine";
                oscillator.frequency.value = 740;
                gain.gain.setValueAtTime(0.06, audio.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + .25);
                oscillator.connect(gain);
                gain.connect(audio.destination);
                oscillator.start();
                oscillator.stop(audio.currentTime + .25);
                oscillator.onended = function () { audioPlaying = false; audio.close(); };
            } catch (error) { audioPlaying = false; soundButton.textContent = "Audio unavailable"; }
        });
    }

    // Services: objects, methods, arrays, loops, higher-order functions, switch.
    const services = [
        { name: "Yacht Rental", category: "trip", description: "Rent a yacht for your own route." },
        { name: "Luxury Cruises", category: "trip", description: "Premium sightseeing cruises." },
        { name: "Events & Parties", category: "event", description: "Celebrations on the water." },
        { name: "Captain Service", category: "extra", description: "Professional captain on request." },
        { name: "Yacht Preparation", category: "extra", description: "A prepared yacht before boarding." },
        { name: "Private Trips", category: "trip", description: "Personal trips with friends." }
    ];
    const categorySelect = document.querySelector("#a5-category");
    const searchInput = document.querySelector("#a5-search");
    const resultGrid = document.querySelector("#a5-results");
    const countText = document.querySelector("#a5-count");
    if (categorySelect && searchInput && resultGrid && countText) {
        function renderServices() {
            const query = searchInput.value.toLowerCase().trim();
            let category;
            switch (categorySelect.value) {
                case "trip": category = "trip"; break;
                case "event": category = "event"; break;
                case "extra": category = "extra"; break;
                default: category = "all";
            }
            const matches = services.filter(function (service) {
                return (category === "all" || service.category === category) &&
                    service.name.toLowerCase().includes(query);
            });
            resultGrid.replaceChildren();
            matches.forEach(function (service) {
                const tile = document.createElement("article");
                tile.className = "a5-service-tile";
                const heading = document.createElement("h3");
                heading.textContent = service.name;
                const description = document.createElement("p");
                description.textContent = service.description;
                tile.append(heading, description);
                resultGrid.appendChild(tile);
            });
            countText.textContent = `Found ${matches.length} of ${services.length} services`;
        }
        categorySelect.addEventListener("change", renderServices);
        searchInput.addEventListener("input", renderServices);
        document.querySelector("#a5-reset").addEventListener("click", function () {
            categorySelect.value = "all";
            searchInput.value = "";
            renderServices();
        });
        renderServices();
    }

    // Callback-driven two-step estimate, without submitting fake bookings.
    const nextButton = document.querySelector("#a5-next");
    if (nextButton) {
        const stepOne = document.querySelector("#a5-step-one");
        const stepTwo = document.querySelector("#a5-step-two");
        const feedback = document.querySelector("#a5-form-feedback");
        const packages = {
            rental: { name: "Yacht Rental", price: 120000, total(days) { return this.price * days; } },
            cruise: { name: "Luxury Cruise", price: 150000, total(days) { return this.price * days; } }
        };
        function showStep(number, callback) {
            stepOne.hidden = number !== 1;
            stepTwo.hidden = number !== 2;
            if (typeof callback === "function") callback();
        }
        nextButton.addEventListener("click", function () {
            const days = Number(document.querySelector("#a5-days").value);
            if (!Number.isInteger(days) || days < 1 || days > 30) {
                feedback.textContent = "Enter between 1 and 30 days.";
                return;
            }
            feedback.textContent = "";
            showStep(2, function () {
                const selected = packages[document.querySelector("#a5-yacht-type").value];
                document.querySelector("#a5-estimate").textContent =
                    `${selected.name}: ${days} day(s) — ${selected.total(days).toLocaleString("en-US")} ₸ (estimate only)`;
            });
        });
        document.querySelector("#a5-back").addEventListener("click", function () { showStep(1); });
        document.querySelector("#a5-confirm").addEventListener("click", function () {
            feedback.textContent = "Estimate confirmed for viewing. To book, visit our Booking page.";
        });
    }
});
