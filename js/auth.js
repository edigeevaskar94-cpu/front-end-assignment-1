
"use strict";

// Front-end authentication simulation.
// Use test passwords only.

(function () {
    const ACCOUNTS_KEY = "yrDemoAccounts";
    const SESSION_KEY = "yrDemoUser";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const byId = (id) => document.getElementById(id);

    const loginForm = byId("profileLoginForm");
    const signupForm = byId("profileSignupForm");
    const editForm = byId("profileEditForm");
    const editor = byId("profileEditor");

    if (!loginForm || !signupForm || !editForm || !editor) return;

    function readAccounts() {
        try {
            const accounts = JSON.parse(
                localStorage.getItem(ACCOUNTS_KEY) || "[]"
            );

            return Array.isArray(accounts) ? accounts : [];
        } catch (error) {
            return [];
        }
    }

    function saveAccounts(accounts) {
        try {
            localStorage.setItem(
                ACCOUNTS_KEY,
                JSON.stringify(accounts)
            );

            return true;
        } catch (error) {
            return false;
        }
    }

    function currentEmail() {
        try {
            return sessionStorage.getItem(SESSION_KEY) || "";
        } catch (error) {
            return "";
        }
    }

    function currentAccount() {
        const email = currentEmail();

        return readAccounts().find(
            (account) => account.email === email
        ) || null;
    }

    function showMode(mode) {
        loginForm.hidden = mode !== "login";
        signupForm.hidden = mode !== "signup";
        editor.hidden = mode !== "profile";
    }

    function errorFor(inputId, errorId, message) {
        byId(errorId).textContent = message;

        const input = byId(inputId);

        if (message) {
            input.setAttribute("aria-invalid", "true");
        } else {
            input.removeAttribute("aria-invalid");
        }
    }

    function clearErrors(pairs) {
        pairs.forEach(([inputId, errorId]) => {
            errorFor(inputId, errorId, "");
        });
    }

    const loginFields = [
        ["profileLoginEmail", "profileLoginEmailError"],
        ["profileLoginPassword", "profileLoginPasswordError"]
    ];

    const signupFields = [
        ["signupName", "signupNameError"],
        ["signupEmail", "signupEmailError"],
        ["signupPassword", "signupPasswordError"],
        ["signupConfirmPassword", "signupConfirmError"]
    ];

    const editFields = [
        ["profileName", "profileNameError"],
        ["profileEmail", "profileEmailError"],
        ["profilePhone", "profilePhoneError"]
    ];

    function validPassword(password) {
        return password.length >= 8 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            /[^A-Za-z0-9]/.test(password);
    }

    function validPhone(phone) {
        if (!phone) return true;

        const digits = phone.replace(/\D/g, "");

        return digits.length >= 10 &&
            digits.length <= 15 &&
            /^\+?[\d\s()-]+$/.test(phone);
    }

    function loadProfile(account) {
        byId("profileSignedInAs").textContent = account.name;

        byId("profileName").value = account.name;
        byId("profileEmail").value = account.email;
        byId("profilePhone").value = account.phone || "";
    }

    function updateView() {
        const account = currentAccount();

        if (account) {
            showMode("profile");
            loadProfile(account);
        } else {
            showMode("login");
        }
    }

    // SWITCH TO SIGN UP
    byId("showSignup").addEventListener("click", function () {
        clearErrors(loginFields);

        byId("profileLoginError").textContent = "";
        byId("profileLoginSuccess").textContent = "";

        showMode("signup");
    });

    // SWITCH TO LOG IN
    byId("showLogin").addEventListener("click", function () {
        clearErrors(signupFields);

        byId("signupStatus").textContent = "";

        showMode("login");
    });

    // SIGN UP
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors(signupFields);

        byId("signupStatus").textContent = "";

        const name = byId("signupName").value.trim();

        const email = byId("signupEmail")
            .value.trim().toLowerCase();

        const password = byId("signupPassword").value;

        const confirmation =
            byId("signupConfirmPassword").value;

        let valid = true;

        if (name.length < 2 || name.length > 60) {
            errorFor(
                "signupName",
                "signupNameError",
                "Enter your name (2-60 characters)."
            );

            valid = false;
        }

        if (email.length > 120 || !emailPattern.test(email)) {
            errorFor(
                "signupEmail",
                "signupEmailError",
                "Enter a valid email address."
            );

            valid = false;
        }

        if (!validPassword(password)) {
            errorFor(
                "signupPassword",
                "signupPasswordError",
                "Use 8+ characters with upper/lowercase letters, a number and a symbol."
            );

            valid = false;
        }

        if (!confirmation || password !== confirmation) {
            errorFor(
                "signupConfirmPassword",
                "signupConfirmError",
                "Passwords must match."
            );

            valid = false;
        }

        if (!valid) return;

        const accounts = readAccounts();

        if (accounts.some((account) => account.email === email)) {
            errorFor(
                "signupEmail",
                "signupEmailError",
                "This email is already registered."
            );

            return;
        }

        accounts.push({
            name,
            email,
            password,
            phone: ""
        });

        if (!saveAccounts(accounts)) {
            byId("signupStatus").textContent =
                "Could not save your account. Enable browser storage and try again.";

            return;
        }

        signupForm.reset();

        byId("profileLoginEmail").value = email;

        byId("profileLoginSuccess").textContent =
            "Account created successfully. Log in with your new password.";

        showMode("login");
    });

    // LOG IN
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors(loginFields);

        byId("profileLoginError").textContent = "";
        byId("profileLoginSuccess").textContent = "";

        const email = byId("profileLoginEmail")
            .value.trim().toLowerCase();

        const password = byId("profileLoginPassword").value;

        if (!emailPattern.test(email)) {
            errorFor(
                "profileLoginEmail",
                "profileLoginEmailError",
                "Enter a valid email address."
            );

            return;
        }

        if (!password) {
            errorFor(
                "profileLoginPassword",
                "profileLoginPasswordError",
                "Enter your password."
            );

            return;
        }

        const account = readAccounts().find((item) =>
            item.email === email && item.password === password
        );

        if (!account) {
            byId("profileLoginError").textContent =
                "Incorrect email or password.";

            return;
        }

        try {
            sessionStorage.setItem(
                SESSION_KEY,
                account.email
            );
        } catch (error) {
            byId("profileLoginError").textContent =
                "Unable to start a session in this browser.";

            return;
        }

        loginForm.reset();

        updateView();

        window.location.assign("profile.html");
    });

    // EDIT PROFILE
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearErrors(editFields);

        const status = byId("profileSaveStatus");
        status.textContent = "";

        const name = byId("profileName").value.trim();

        const email = byId("profileEmail")
            .value.trim().toLowerCase();

        const phone = byId("profilePhone").value.trim();

        let valid = true;

        if (name.length < 2 || name.length > 60) {
            errorFor(
                "profileName",
                "profileNameError",
                "Enter your name (2-60 characters)."
            );

            valid = false;
        }

        if (email.length > 120 || !emailPattern.test(email)) {
            errorFor(
                "profileEmail",
                "profileEmailError",
                "Enter a valid email address."
            );

            valid = false;
        }

        if (!validPhone(phone)) {
            errorFor(
                "profilePhone",
                "profilePhoneError",
                "Enter a valid phone number (10-15 digits)."
            );

            valid = false;
        }

        if (!valid) return;

        const accounts = readAccounts();

        const index = accounts.findIndex(
            (account) => account.email === currentEmail()
        );

        if (index === -1) {
            status.textContent =
                "Session expired. Please log in again.";

            status.className = "mt-3 text-danger";

            return;
        }

        if (accounts.some(
            (account, i) => i !== index && account.email === email
        )) {
            errorFor(
                "profileEmail",
                "profileEmailError",
                "This email belongs to another account."
            );

            return;
        }

        accounts[index] = {
            ...accounts[index],
            name,
            email,
            phone
        };

        if (!saveAccounts(accounts)) {
            status.textContent =
                "Could not save your profile in this browser.";

            status.className = "mt-3 text-danger";

            return;
        }

        try {
            sessionStorage.setItem(SESSION_KEY, email);
        } catch (error) {
            status.textContent =
                "Profile saved, but the session could not be updated.";

            status.className = "mt-3 text-danger";

            return;
        }

        loadProfile(accounts[index]);

        status.textContent = "Profile saved successfully!";
        status.className = "mt-3 text-success";
    });

    // LOG OUT
    byId("profileLogout").addEventListener("click", function () {
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch (error) {
            // Storage unavailable.
        }

        loginForm.reset();

        clearErrors(loginFields);

        byId("profileLoginError").textContent = "";

        byId("profileLoginSuccess").textContent =
            "You have logged out.";

        byId("profileSaveStatus").textContent = "";

        updateView();
    });

    updateView();
})();
