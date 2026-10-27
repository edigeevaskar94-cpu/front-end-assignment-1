
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
















/* =========================================
   YACHTRENT ASTANA - COMBINED SCRIPT
   Team & Assignment 5 (Nurislam's Part)
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {

    // --- 1. CONTACT FORM VALIDATION & DOM MANIPULATION (Assignment 5) ---
    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        const contactFeedback = document.getElementById("contactFeedback");

        // Web Audio API helper for sound effect on success
        function playSuccessSound() {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
                osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.3);
            } catch (e) {
                // AudioContext fallback
            }
        }

        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const name = document.getElementById("contact-name");
            const email = document.getElementById("contact-email");
            const message = document.getElementById("message");
            let isValid = true;

            [name, email, message].forEach(input => {
                if (input) input.classList.remove("is-invalid");
            });
            if (contactFeedback) contactFeedback.textContent = "";

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
                playSuccessSound();
                if (contactFeedback) {
                    contactFeedback.textContent = "Thank you! Your message has been sent successfully.";
                    contactFeedback.style.color = "#16a34a";
                }
                contactForm.reset();
            } else {
                if (contactFeedback) {
                    contactFeedback.textContent = "Please correct the highlighted fields above.";
                    contactFeedback.style.color = "#dc3545";
                }
            }
        });
    }


    // --- 2. MULTI-STEP YACHT BOOKING FORM (Assignment 5 - Nurislam's Part) ---
    const multiStepForm = document.getElementById("bookingForm");

    if (multiStepForm) {
        const steps = document.querySelectorAll(".booking-step");
        const nextBtn = document.getElementById("nextBtn");
        const backBtn = document.getElementById("backBtn");
        const submitBtn = document.getElementById("submitBtn");
        const indicator = document.getElementById("stepIndicator");
        const progressBar = document.getElementById("bookingProgressBar");
        const feedback = document.getElementById("bookingFeedback");
        const summary = document.getElementById("bookingSummary");

        let currentStep = 0;

        // Array of Yacht objects with pricing metadata
        const yachts = [
            { id: "ocean-pearl", name: "Ocean Pearl", price: 120000 },
            { id: "sea-breeze", name: "Sea Breeze", price: 150000 },
            { id: "royal-wave", name: "Royal Wave", price: 200000 },
            { id: "blue-horizon", name: "Blue Horizon", price: 170000 },
            { id: "silver-wave", name: "Silver Wave", price: 145000 },
            { id: "sunset-dream", name: "Sunset Dream", price: 130000 }
        ];

        function todayString() {
            const d = new Date();
            return d.getFullYear() + "-" + 
                   String(d.getMonth() + 1).padStart(2, "0") + "-" + 
                   String(d.getDate()).padStart(2, "0");
        }

        function validateStep(index) {
            feedback.textContent = "";

            if (index === 0) {
                const yacht = document.getElementById("yacht-select").value;
                const start = document.getElementById("pickup-date").value;
                const end = document.getElementById("return-date").value;

                if (!yacht || !start || !end) {
                    feedback.textContent = "Please complete all required fields.";
                    return false;
                }

                if (start < todayString() || end < start) {
                    feedback.textContent = "Please select valid rental dates.";
                    return false;
                }
            }

            if (index === 1) {
                const name = document.getElementById("full-name").value.trim();
                const phone = document.getElementById("phone").value.trim();
                const email = document.getElementById("email").value.trim();
                const digits = phone.replace(/\D/g, "");

                if (name.length < 2 || digits.length < 10 || digits.length > 15 || !/^\+?[\d\s()-]{10,20}$/.test(phone)) {
                    feedback.textContent = "Please enter a valid full name and phone number.";
                    return false;
                }

                if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    feedback.textContent = "Please enter a valid email address.";
                    return false;
                }
            }

            return true;
        }

        function showStep(index, callback) {
            currentStep = index;

            steps.forEach(function(step, i) {
                step.hidden = i !== currentStep;
            });

            const stepNum = currentStep + 1;
            indicator.textContent = "Step " + stepNum + " of 3";

            if (progressBar) {
                const progressPerc = stepNum === 1 ? "33%" : (stepNum === 2 ? "66%" : "100%");
                progressBar.style.width = progressPerc;
                progressBar.setAttribute("aria-valuenow", stepNum === 1 ? 33 : (stepNum === 2 ? 66 : 100));
            }

            backBtn.hidden = currentStep === 0;
            nextBtn.hidden = currentStep === 2;
            submitBtn.hidden = currentStep !== 2;

            feedback.textContent = "";

            if (typeof callback === "function") {
                callback();
            }
        }

        function updateSummary() {
            const yachtId = document.getElementById("yacht-select").value;
            const yacht = yachts.find(item => item.id === yachtId) || { name: "Selected Yacht", price: 0 };

            const startValue = document.getElementById("pickup-date").value;
            const endValue = document.getElementById("return-date").value;

            const start = new Date(startValue + "T00:00:00");
            const end = new Date(endValue + "T00:00:00");

            const days = Math.round((end - start) / 86400000) + 1;
            const total = yacht.price * (days > 0 ? days : 1);

            const data = {
                "Yacht": yacht.name,
                "Start Date": startValue,
                "End Date": endValue,
                "Rental Days": days > 0 ? days : 1,
                "Full Name": document.getElementById("full-name").value.trim(),
                "Phone": document.getElementById("phone").value.trim(),
                "Email": document.getElementById("email").value.trim() || "Not provided",
                "Additional Request": document.getElementById("notes").value.trim() || "None",
                "Estimated Total": total.toLocaleString("en-US") + " ₸"
            };

            summary.replaceChildren();

            Object.entries(data).forEach(function(entry) {
                const p = document.createElement("p");
                const strong = document.createElement("strong");

                strong.textContent = entry[0] + ": ";
                p.append(strong, document.createTextNode(String(entry[1])));

                summary.appendChild(p);
            });
        }

        nextBtn.addEventListener("click", function() {
            if (!validateStep(currentStep)) return;

            if (currentStep < 2) {
                showStep(
                    currentStep + 1,
                    currentStep === 1 ? updateSummary : null
                );
            }
        });

        backBtn.addEventListener("click", function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });

        multiStepForm.addEventListener("submit", function(event) {
            event.preventDefault();

            if (!validateStep(0)) {
                showStep(0);
                return;
            }

            if (!validateStep(1)) {
                showStep(1);
                return;
            }

            feedback.textContent = "Booking request submitted successfully! (Demo mode: request saved).";
            feedback.style.color = "#16a34a";
            submitBtn.disabled = true;
        });

        showStep(0);
    }


    // --- 3. KEYBOARD ACCESSIBILITY (Arrow Navigation) ---
    document.addEventListener("keydown", function(e) {
        const multiStepFormActive = document.getElementById("bookingForm");
        if (multiStepFormActive && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
            const nextBtn = document.getElementById("nextBtn");
            const backBtn = document.getElementById("backBtn");
            
            if (e.key === "ArrowRight" && nextBtn && !nextBtn.hidden) {
                nextBtn.click();
            } else if (e.key === "ArrowLeft" && backBtn && !backBtn.hidden) {
                backBtn.click();
            }
        }
    });

});