"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "yrDemoBookings";

    function getBookings() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        }
    }

    function saveBookings(bookings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
            return true;
        } catch (error) {
            return false;
        }
    }

    // BOOKING PAGE
    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function () {
            const feedback = document.getElementById("bookingFeedback");

            // Save only after the existing form validation succeeds.
            if (!feedback || !feedback.textContent.startsWith(
                "Booking request submitted successfully!"
            )) {
                return;
            }

            const yachtSelect = document.getElementById("yacht-select");

            const booking = {
                id: "YR-" + Date.now().toString(36) +
                    Math.random().toString(36).slice(2, 6),
                yacht: yachtSelect.selectedOptions[0].textContent.split(" (")[0],
                start: document.getElementById("pickup-date").value,
                end: document.getElementById("return-date").value,
                name: document.getElementById("full-name").value.trim(),
                status: "active",
                rating: null,
                createdAt: new Date().toISOString()
            };

            const bookings = getBookings();
            bookings.unshift(booking);

            if (!saveBookings(bookings)) {
                feedback.textContent =
                    "Booking could not be saved. Please enable browser storage.";
                feedback.style.color = "#dc3545";
            }
        });
    }

    // PROFILE PAGE
    const list = document.getElementById("myBookingsList");
    const editor = document.getElementById("profileEditor");
    const modal = document.getElementById("bookingReviewModal");

    if (!list || !editor || !modal) return;

    const modalTitle = document.getElementById("bookingReviewTitle");
    const modalDescription = document.getElementById("bookingReviewDescription");
    const modalFeedback = document.getElementById("bookingReviewFeedback");
    const closeButton = document.getElementById("bookingReviewClose");
    const submitButton = document.getElementById("bookingReviewSubmit");
    const starButtons = [...modal.querySelectorAll("[data-stars]")];

    let selectedBookingId = null;
    let selectedRating = 0;

    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        return element;
    }

    function makeButton(label, action, id, className) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.dataset.action = action;
        button.dataset.id = id;
        return button;
    }

    function renderBookings() {
        if (editor.hidden) return;

        list.replaceChildren();
        const bookings = getBookings();

        if (bookings.length === 0) {
            list.appendChild(makeElement(
                "p", "text-muted",
                "You have no bookings yet."
            ));
            return;
        }

        bookings.forEach(function (booking) {
            const card = makeElement("article", "yr-booking-card", "");
            const title = makeElement("h3", "h5", booking.yacht);
            const dates = makeElement(
                "p", "mb-2",
                booking.start + " — " + booking.end
            );
            const customer = makeElement(
                "p", "mb-2",
                "Customer: " + booking.name
            );

            const statusNames = {
                active: "Active",
                completed: "Completed",
                cancelled: "Cancelled"
            };

            const badgeColors = {
                active: "bg-primary",
                completed: "bg-success",
                cancelled: "bg-secondary"
            };

            const status = makeElement(
                "span",
                "badge " + (badgeColors[booking.status] || "bg-secondary"),
                statusNames[booking.status] || booking.status
            );

            const actions = makeElement("div", "yr-booking-actions", "");

            if (booking.status === "active") {
                actions.append(
                    makeButton(
                        "Complete Booking", "complete", booking.id,
                        "btn btn-success btn-sm"
                    ),
                    makeButton(
                        "Cancel Booking", "cancel", booking.id,
                        "btn btn-outline-danger btn-sm"
                    )
                );
            } else if (booking.rating) {
                actions.appendChild(makeElement(
                    "p", "mb-0",
                    "Your review: " + "★".repeat(booking.rating) +
                    "☆".repeat(5 - booking.rating)
                ));
            } else {
                actions.appendChild(makeButton(
                    "Leave a Review", "review", booking.id,
                    "btn btn-outline-primary btn-sm"
                ));
            }

            card.append(title, dates, customer, status, actions);
            list.appendChild(card);
        });
    }

    function updateStars() {
        starButtons.forEach(function (button) {
            const value = Number(button.dataset.stars);
            const active = value <= selectedRating;

            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(value === selectedRating));
        });

        submitButton.disabled = selectedRating === 0;
    }

    function openReview(booking) {
        selectedBookingId = booking.id;
        selectedRating = booking.rating || 0;

        modalTitle.textContent = booking.status === "cancelled"
            ? "Rate Your Booking Experience"
            : "Rate Your Yacht Trip";

        modalDescription.textContent = booking.status === "cancelled"
            ? "Tell us about your booking experience."
            : "How was your yacht trip? Choose 1 to 5 stars.";

        modalFeedback.textContent = "";
        updateStars();

        modal.hidden = false;
        starButtons[0].focus();
    }

    function closeReview() {
        modal.hidden = true;
        selectedBookingId = null;
        selectedRating = 0;
        document.getElementById("myBookingsTitle").focus();
    }

    list.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const bookings = getBookings();
        const booking = bookings.find(function (item) {
            return item.id === button.dataset.id;
        });

        if (!booking) return;

        const action = button.dataset.action;

        if (action === "cancel") {
            if (!window.confirm("Are you sure you want to cancel this booking?")) {
                return;
            }
            if (booking.status !== "active") return;
            booking.status = "cancelled";
        }

        if (action === "complete") {
            if (booking.status !== "active") return;
            booking.status = "completed";
        }

        if (action !== "review") {
            if (!saveBookings(bookings)) {
                window.alert("Unable to update this booking.");
                return;
            }
        }

        renderBookings();
        openReview(booking);
    });

    starButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedRating = Number(button.dataset.stars);
            updateStars();
        });
    });

    submitButton.addEventListener("click", function () {
        if (!selectedBookingId || selectedRating < 1 || selectedRating > 5) {
            return;
        }

        const bookings = getBookings();
        const booking = bookings.find(function (item) {
            return item.id === selectedBookingId;
        });

        if (!booking || booking.status === "active") return;

        booking.rating = selectedRating;

        if (!saveBookings(bookings)) {
            modalFeedback.textContent = "Could not save your review.";
            return;
        }

        closeReview();
        renderBookings();
    });

    closeButton.addEventListener("click", closeReview);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeReview();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeReview();
        }
    });

    const loginForm = document.getElementById("profileLoginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function () {
            setTimeout(renderBookings, 0);
        });
    }

    renderBookings();
});