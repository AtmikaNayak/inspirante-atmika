const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

const logoutBtn =
    document.getElementById("logoutBtn");

const eventsContainer =
    document.getElementById("eventsContainer");

const myRegistrationsContainer =
    document.getElementById(
        "myRegistrationsContainer"
    );

const message =
    document.getElementById("message");

if (!token || role !== "student") {
    window.location.href =
        "index.html";
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadEvents();
        loadMyRegistrations();
    }
);

logoutBtn.addEventListener(
    "click",
    logout
);

function logout() {
    localStorage.clear();

    window.location.href =
        "index.html";
}

async function loadMyRegistrations() {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/api/register/mine",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            document.getElementById(
                "message"
            ).textContent = data.message;

            return;
        }

        const registrationsContainer =
            document.getElementById(
                "myRegistrationsContainer"
            );

        registrationsContainer.innerHTML = "";

        data.forEach(registration => {

            registrationsContainer.innerHTML += `
                <div class="registration-card">
                    <h3>${registration.name}</h3>
                    <p>Date: ${registration.date}</p>
                    <p>Venue: ${registration.venue}</p>
                </div>
            `;

        });

    } catch (error) {

        document.getElementById(
            "message"
        ).textContent =
            "Failed to load registrations";

        console.error(error);

    }

}

async function loadEvents() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:3000/api/events",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            document.getElementById(
                "message"
            ).textContent = data.message;

            return;
        }

        const eventsContainer =
            document.getElementById(
                "eventsContainer"
            );

        eventsContainer.innerHTML = "";

        data.forEach(event => {

            const buttonHtml =
                event.registeredCount >= event.capacity
                    ? `<button disabled>Full</button>`
                    : `<button onclick="registerForEvent(${event.id})">Register</button>`;

            eventsContainer.innerHTML += `
                <div class="event-card">
                    <h3>${event.name}</h3>
                    <p>Date: ${event.date}</p>
                    <p>Venue: ${event.venue}</p>
                    <p>Capacity: ${event.capacity}</p>
                    <p>Registered: ${event.registeredCount}</p>
                    ${buttonHtml}
                </div>
            `;
        });

    } catch (error) {

        console.error(error);
        document.getElementById("message").textContent = "Failed to load events";
    }
}


async function registerForEvent(eventId) {
    try {
        console.log("Event ID:", eventId);
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:3000/api/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    eventId: eventId
                })
            }
        );
        const data = await response.json();
        if (!response.ok) {
            document.getElementById("message").textContent = data.message;
            return;
        }
        document.getElementById("message").textContent = data.message;
        loadEvents();
        loadMyRegistrations();
    }
    catch (error) {
        console.error(error);
        document.getElementById("message").textContent = "Failed to load events";
    }
}



