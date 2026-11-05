const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const registerSection = document.getElementById("register-section");
const loginSection = document.getElementById("login-section");

const showLogin = document.getElementById("show-login");
const showRegister = document.getElementById("show-register");

showLogin.addEventListener("click", function () {
    registerSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
});

showRegister.addEventListener("click", function () {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
});

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const message = document.getElementById("register-message");

    fetch("http://localhost:3000/users")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to check accounts.");
            }

            return response.json();
        })
        .then(function (users) {
            const existingUser = users.find(function (user) {
                return user.email.toLowerCase() === email.toLowerCase();
            });

            if (existingUser) {
                message.textContent = "This email is already registered.";
                return;
            }

            return fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Registration failed.");
                    }

                    message.textContent = "Registration successful. Please log in.";
                    registerForm.reset();
                });
        })
        .catch(function () {
            message.textContent =
                "Registration failed. Make sure JSON Server is running.";
        });
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    fetch("http://localhost:3000/users")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to check accounts.");
            }

            return response.json();
        })
        .then(function (users) {
            const user = users.find(function (account) {
                return account.email.toLowerCase() === email.toLowerCase()
                    && account.password === password;
            });

            if (!user) {
                message.textContent = "Incorrect email or password.";
                return;
            }

            message.textContent = "Login successful.";
            window.location.href = "areas.html";
        })
        .catch(function () {
            message.textContent =
                "Login failed. Make sure JSON Server is running.";
        });
});