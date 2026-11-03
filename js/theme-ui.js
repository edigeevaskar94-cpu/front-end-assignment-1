"use strict";

(function () {
    function init() {
        const header = document.getElementById("main-header");
        if (!header) return;

        const nav = header.querySelector(".navigation");
        const menu = header.querySelector(".nav-menu");
        const logo = header.querySelector(".navbar-brand");

        if (!nav || !menu || !logo) return;

        header.classList.add("nav-unified");

        // Same Bootstrap navbar breakpoint on every page.
        nav.classList.remove("navbar-expand-lg");
        nav.classList.add("navbar-expand-xl");

        // Group logo and clock.
        let brandGroup = nav.querySelector(".brand-group");

        if (!brandGroup) {
            brandGroup = document.createElement("div");
            brandGroup.className = "brand-group";

            logo.before(brandGroup);
            brandGroup.appendChild(logo);
        }

        // Add clock only when the page doesn't already have one.
        let clock = brandGroup.querySelector(".nav-clock");

        if (!clock) {
            clock = document.createElement("div");
            clock.className = "nav-clock";
            clock.setAttribute("aria-label", "Current date and time");

            clock.innerHTML = `
                <span id="currentDate">Loading date...</span>
                <strong id="currentTime">Loading time...</strong>
            `;

            brandGroup.appendChild(clock);
        }

        // The original script.js already updates the Home clock.
        if (!document.body.classList.contains("index-page")) {
            const dateElement = clock.querySelector("#currentDate");
            const timeElement = clock.querySelector("#currentTime");

            function updateClock() {
                const now = new Date();

                dateElement.textContent = now.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    }
                );

                timeElement.textContent = now.toLocaleTimeString(
                    "en-US",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false
                    }
                );
            }

            updateClock();
            setInterval(updateClock, 1000);
        }

        // Find the existing theme button.
        const button = document.querySelector(
            "#yr-theme-toggle, #themeToggle"
        );

        if (!button) return;

        // Cars page: move the original button into navbar.
        // Event listeners stay attached to the same element.
        if (!nav.contains(button)) {
            menu.appendChild(button);
        }

        const body = document.body;
        const isCars = body.classList.contains("cars-page");

        function updateLabel() {
            const dark = body.classList.contains("dark-mode");

            const text = dark
                ? "☀️ Light mode"
                : "🌙 Dark mode";

            if (button.textContent.trim() !== text) {
                button.textContent = text;
            }

            button.setAttribute("aria-pressed", String(dark));
        }

        function setTheme(dark, save) {
            body.classList.toggle("dark-mode", dark);
            body.classList.toggle("dark-theme", dark);

            updateLabel();

            if (save) {
                try {
                    localStorage.setItem(
                        "theme",
                        dark ? "dark" : "light"
                    );
                } catch (error) {
                    // Switching still works without storage.
                }
            }
        }

        let savedDark = false;

        try {
            savedDark = localStorage.getItem("theme") === "dark";
        } catch (error) {
            savedDark = false;
        }

        setTheme(savedDark, false);

        // Existing scripts continue handling their original buttons.
        const hasOriginalHandler =
            button.id === "yr-theme-toggle" ||
            isCars ||
            (
                button.id === "themeToggle" &&
                typeof window.jQuery === "function"
            );

        if (hasOriginalHandler) {
            button.addEventListener("click", function () {
                setTimeout(function () {
                    const dark = body.classList.contains(
                        isCars ? "dark-theme" : "dark-mode"
                    );

                    setTheme(dark, true);
                }, 0);
            });
        } else {
            button.addEventListener("click", function () {
                setTheme(
                    !body.classList.contains("dark-mode"),
                    true
                );
            });
        }

        // Keep button wording consistent.
        const observer = new MutationObserver(updateLabel);

        observer.observe(button, {
            childList: true,
            characterData: true,
            subtree: true
        });

        window.addEventListener("storage", function (event) {
            if (event.key === "theme") {
                setTheme(event.newValue === "dark", false);
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("main-header");
    if (!header) return;

    const navbar = header.querySelector(".navigation");
    const menu = header.querySelector(".nav-menu");

    if (!navbar || !menu) return;

    // One navbar breakpoint for every page.
    navbar.classList.remove("navbar-expand-lg");
    navbar.classList.add("navbar-expand-xl");

    // Shared controls area.
    let tools = menu.querySelector(".nav-tools");

    if (!tools) {
        tools = document.createElement("div");
        tools.className = "nav-tools yr-nav-tools";
        menu.appendChild(tools);
    }

    // Move the existing theme button without recreating it.
    const themeButton = document.querySelector(
        "#themeToggle, #yr-theme-toggle"
    );

    if (themeButton && !tools.contains(themeButton)) {
        tools.appendChild(themeButton);
    }

    if (!menu.querySelector('a[href="profile.html"]')) {
        const profileLink = document.createElement("a");

        profileLink.href = "profile.html";
        profileLink.className = "yr-profile-link";
        profileLink.setAttribute("aria-label", "My Profile");
        profileLink.title = "My Profile";

        const image = document.createElement("img");
        image.src = "images/user.png";
        image.alt = "Profile";

        profileLink.appendChild(image);
        tools.appendChild(profileLink);
    }
});