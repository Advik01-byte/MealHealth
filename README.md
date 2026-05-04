# MealHealth

MealHealth is a fictional startup website I created as the final assignment for the ThinkStartup course in the Young Mind Entrepreneurship Program.

The concept is simple: multiple LLMs work together to suggest a healthier meal idea for the user. This repository contains the website prototype for that startup idea, including the landing page, a waitlist form, and a small admin area for the demo flow.

## What this project includes

- A polished landing page for the MealHealth brand
- A waitlist form for collecting emails
- An admin login modal
- An admin dashboard for viewing the stored waitlist
- Recovery and reset password demo pages
- A lightweight Node.js server for local development

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Node.js

## How It Works

This project is a front-end prototype with browser storage for demo purposes.

- Waitlist emails are stored in `localStorage`
- Admin session state is stored in `localStorage` or `sessionStorage`
- Password recovery and reset flows are simulated for the website demo
- The app does not connect to a real AI backend yet

## Running Locally

1. Install Node.js
2. Open a terminal in the project folder
3. Run:

```bash
npm start
```

4. Open the site in your browser:

```bash
http://localhost:3000
```

## Demo Pages

- `index.html` - Main landing page
- `pages/admin-dashboard.html` - Admin dashboard
- `pages/waitlist-admin.html` - Waitlist table
- `pages/recover.html` - Request recovery code
- `pages/reset-password.html` - Reset admin password

## Project Structure

```text
MealHealth/
|-- index.html
|-- pages/
|   |-- admin-dashboard.html
|   |-- recover.html
|   |-- reset-password.html
|   `-- waitlist-admin.html
|-- assets/
|   |-- css/
|   |   `-- style.css
|   `-- js/
|       |-- admin.js
|       |-- admin-dashboard.js
|       |-- auth.js
|       |-- auth-ui.js
|       |-- email-check.js
|       |-- recover.js
|       |-- reset-password.js
|       |-- storage.js
|       `-- waitlist-admin.js
|-- server.js
`-- package.json
```

## Notes

- This is a concept project, not a production service.
- The admin credentials and demo data are seeded in `assets/js/storage.js`.
- If you want to adapt this into a real product later, the next step would be replacing browser storage with a backend database and connecting the meal suggestion logic to an actual LLM pipeline.

## License

No license has been added yet.
