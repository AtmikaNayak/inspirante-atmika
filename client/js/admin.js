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

const createMessage =
    document.getElementById(
        "createMessage"
    );

document.addEventListener(
    "DOMContentLoaded",
    loadEvents
);

loadEvents()

createEvent()

viewRegistrations(eventId)

function logout() {
    localStorage.clear();

    window.location.href =
        "index.html";
}
