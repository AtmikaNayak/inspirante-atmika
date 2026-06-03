# DECISIONS.md

## Why I Chose This Stack

For this project, I chose Vanilla JavaScript, Node.js, Express.js, and MySQL.

### Frontend

I selected Vanilla JavaScript rather than React because the assignment focused primarily on implementing functionality, API integration, authentication, and database interactions. Using plain HTML, CSS, and JavaScript kept the project lightweight and allowed me to focus on completing all required features within the assignment timeline.

### Backend

Node.js and Express.js were chosen because they provide a simple and efficient way to build REST APIs. Express offers a clean routing system, middleware support, and a structure that scales well for small to medium-sized applications.

### Database

I chose MySQL because the application data is highly relational. Users, events, and registrations have clearly defined relationships that are naturally represented using relational tables and foreign key constraints.

### Authentication

JWT-based authentication was implemented because the assignment specifically requested token-based authentication and reusable middleware. JWTs allowed secure route protection and straightforward role-based authorization for admin and student users.

---

## One Decision Not Explicitly Specified in the Brief

I chose to organize the backend into separate controllers, routes, middleware, configuration, and migration folders instead of placing all logic in a single server file.

Although the assignment did not prescribe a specific folder structure, separating responsibilities improves readability, maintainability, and scalability. Each component has a clear purpose:

* Controllers contain business logic
* Routes define API endpoints
* Middleware handles authentication and authorization
* Configuration files manage database connectivity
* Migration files manage schema and seed data

This structure follows common Express.js development practices and makes future maintenance easier.

---

## One Thing I Would Improve With More Time

If I had additional time, I would focus on improving application security by implementing password hashing with bcrypt and moving toward a more production-ready authentication system.

The assignment allowed hardcoded credentials and did not require user registration, so plain-text passwords were acceptable for the scope of this project. However, in a real-world application, passwords should never be stored directly.

Additional improvements would include:

* Refresh token support
* Automated API testing
* Enhanced responsive design
* Event editing and deletion functionality
* Docker-based deployment
* CI/CD pipeline integration

These enhancements would improve security, maintainability, scalability, and overall user experience.
