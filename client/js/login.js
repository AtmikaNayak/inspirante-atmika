const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

loginBtn.addEventListener("click", login);

async function login() {
    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    try {
        const response = await fetch(
            "http://localhost:3000/api/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            return;
        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "role",
            data.role
        );

        if (data.role === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "student.html";
        }

    } catch (error) {
        message.textContent = "Server error";
    }
}