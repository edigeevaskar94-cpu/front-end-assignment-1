
const form = document.getElementById("registrationForm");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const confirmError = document.getElementById("confirmError");
        const formMessage = document.getElementById("formMessage");

        emailError.textContent = "";
        passwordError.textContent = "";
        confirmError.textContent = "";
        formMessage.textContent = "";

        let valid = true;

        if (email === "") {
            emailError.textContent = "Email is required";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = "Enter a valid email";
            valid = false;
        }

        if (password.length < 8) {
            passwordError.textContent = "Password must have at least 8 characters";
            valid = false;
        }

        if (confirmPassword !== password) {
            confirmError.textContent = "Passwords do not match";
            valid = false;
        }

        if (valid) {
            formMessage.textContent = "Validation successful!";
            formMessage.className = "mt-3 text-success";
        }
    });
}

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function(question) {
    question.addEventListener("click", function() {
        const answer = question.nextElementSibling;
        const isOpen = question.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            answer.style.maxHeight = "0px";
            question.setAttribute("aria-expanded", "false");
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
            question.setAttribute("aria-expanded", "true");
        }
    });
});

const contactModal = document.getElementById("contactModal");
const openContactModal = document.getElementById("openContactModal");
const closeContactModal = document.getElementById("closeContactModal");
const contactModalForm = document.getElementById("contactModalForm");

if (contactModal && openContactModal && closeContactModal) {

    function closePopup() {
        contactModal.classList.remove("active");
        contactModal.setAttribute("aria-hidden", "true");
        openContactModal.focus();
    }

    openContactModal.addEventListener("click", function() {
        contactModal.classList.add("active");
        contactModal.setAttribute("aria-hidden", "false");
        closeContactModal.focus();
    });

    closeContactModal.addEventListener("click", closePopup);

    contactModal.addEventListener("click", function(event) {
        if (event.target === contactModal) {
            closePopup();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && contactModal.classList.contains("active")) {
            closePopup();
        }
    });

    contactModalForm.addEventListener("submit", function(event) {
        event.preventDefault();

        document.getElementById("contactResult").textContent =
            "Form validated successfully! Demo only: message not sent.";

        document.getElementById("contactResult").className =
            "mt-3 text-success";

        contactModalForm.reset();
    });
}

const changeColorBtn = document.getElementById("changeColorBtn");

if (changeColorBtn) {
    const colors = ["#ffffff", "#e0f2fe", "#fef3c7", "#dcfce7", "#fce7f3"];

    let colorIndex = 0;

    changeColorBtn.addEventListener("click", function() {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });
}

const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");

if (currentDate && currentTime) {
    function updateDateTime() {
        const now = new Date();

        const date = now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long"
        });

        const time = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });

        currentDate.textContent = date;
        currentTime.textContent = time;
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);
}

















// --- 1. CONTACT FORM VALIDATION (contacts.html үшін) ---
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const name = document.getElementById("contact-name");
        const email = document.getElementById("contact-email");
        const message = document.getElementById("message");
        let isValid = true;

        // Өрістерді тазалау
        [name, email, message].forEach(input => {
            if (input) input.classList.remove("is-invalid");
        });

        if (!name || name.value.trim() === "") {
            if (name) name.classList.add("is-invalid");
            isValid = false;
        }

        if (!email || email.value.trim() === "" || !email.value.includes("@")) {
            if (email) email.classList.add("is-invalid");
            isValid = false;
        }

        if (!message || message.value.trim() === "") {
            if (message) message.classList.add("is-invalid");
            isValid = false;
        }

        if (isValid) {
            alert("Message sent successfully!");
            contactForm.reset();
        }
    });
}


// --- 2. BOOKING FORM VALIDATION (booking.html үшін) ---
const bookingForm = document.querySelector(".booking-form");

if (bookingForm) {
    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const yachtSelect = document.getElementById("yacht-select");
        const fullName = document.getElementById("full-name");
        const phone = document.getElementById("phone");
        const pickupDate = document.getElementById("pickup-date");
        const returnDate = document.getElementById("return-date");
        let isValid = true;

        [yachtSelect, fullName, phone, pickupDate, returnDate].forEach(input => {
            if (input) input.classList.remove("is-invalid");
        });

        if (!yachtSelect || yachtSelect.value === "") {
            if (yachtSelect) yachtSelect.classList.add("is-invalid");
            isValid = false;
        }

        if (!fullName || fullName.value.trim() === "") {
            if (fullName) fullName.classList.add("is-invalid");
            isValid = false;
        }

        if (!phone || phone.value.trim() === "") {
            if (phone) phone.classList.add("is-invalid");
            isValid = false;
        }

        if (!pickupDate || pickupDate.value === "") {
            if (pickupDate) pickupDate.classList.add("is-invalid");
            isValid = false;
        }

        if (!returnDate || returnDate.value === "") {
            if (returnDate) returnDate.classList.add("is-invalid");
            isValid = false;
        }

        if (isValid) {
            alert("Booking request submitted successfully!");
            bookingForm.reset();
        }
    });
}