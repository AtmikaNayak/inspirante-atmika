const token =
    localStorage.getItem("token");

const role =
    localStorage.getItem("role");

if (!token || role !== "admin") {
    window.location.href =
        "index.html";
}

const logoutBtn =
    document.getElementById("logoutBtn");

const createEventBtn =
    document.getElementById("createEventBtn");

const eventsContainer =
    document.getElementById("eventsContainer");

const registrationsContainer =
    document.getElementById(
        "registrationsContainer"
    );

const message =
    document.getElementById(
        "message"
    );

document.addEventListener(
    "DOMContentLoaded",
    loadEvents
);


function logout() {
    localStorage.clear();

    window.location.href =
        "index.html";
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

            let color = "green";

            if (event.fillPercentage >= 80) {
                color = "red";
            }
            else if (event.fillPercentage >= 50) {
                color = "orange";
            }

            eventsContainer.innerHTML += `
                <div class="event-card">
                    <h3>${event.name}</h3>
                    <p>Date: ${event.date}</p>
                    <p>Venue: ${event.venue}</p>
                    <p>Capacity: ${event.capacity}</p>
                    <p>Registered: ${event.registeredCount}</p>
                    <p style="color:${color}">${(event.fillPercentage || 0).toFixed(2)}%</p>
                    <button onclick="viewRegistrations(${event.id})">View Students</button>
                </div>
            `;
        });

    } catch (error) {

        console.error(error);
        document.getElementById("message").textContent = "Failed to load events";
    }
}

async function viewRegistrations(eventId) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(
            `http://localhost:3000/api/events/${eventId}/registrations`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const data = await response.json();
        if (!response.ok) {
            return;
        }
        const registrationsContainer =
            document.getElementById(
                "registrationsContainer"
            );

        registrationsContainer.innerHTML = "";

        registrationsContainer.innerHTML = "";

        if (data.length === 0) {
            registrationsContainer.innerHTML =
                "<p>No students have registered for this event yet.</p>";
            return;
        }

        data.forEach(student => {

            registrationsContainer.innerHTML += `
                <div class="registration-card">
                    <h3>${student.name}</h3>
                    <p>Username: ${student.username}</p>
                    <p>Event: ${student.eventName}</p>
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

async function createEvent() {
    try {
        const name = document.getElementById("eventName").value;
        const date = document.getElementById("eventDate").value;
        const venue = document.getElementById("eventVenue").value;
        const capacity = document.getElementById("eventCapacity").value;

        if (capacity <= 0) {
            message.textContent = "Capacity must be greater than 0";
            return;
        }

        const response = await fetch("http://localhost:3000/api/events",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    date,
                    venue,
                    capacity
                })
            }
        );
        const data = await response.json();
        message.textContent = data.message;
        if (response.ok) {
            loadEvents();
            document.getElementById("eventName").value = "";
            document.getElementById("eventDate").value = "";
            document.getElementById("eventVenue").value = "";
            document.getElementById("eventCapacity").value = "";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("message").textContent = "Failed to create event";
    }
}

createEventBtn.addEventListener(
    "click",
    createEvent
);

logoutBtn.addEventListener(
    "click",
    logout
);