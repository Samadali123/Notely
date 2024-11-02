# Notely a modern notes web app

This project is a full-fledged notes application with modern UI and various features including note creation, search, editing, and deletion. The app also supports user authentication using Google Auth and password recovery using Nodemailer.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Demo
You can see a live demo of the project [here](#).

## Features
- User Authentication with Google Auth
- Create, search, edit, and delete notes
- Password recovery using Nodemailer
- Responsive and modern UI with Tailwind CSS

## Technologies Used
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [EJS](https://ejs.co/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Auth](https://developers.google.com/identity)
- [Nodemailer](https://nodemailer.com/)
- [Passport.js](http://www.passportjs.org/)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/notes-app.git
    cd notes-app
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    SESSION_SECRET=your_session_secret
    EMAIL_SERVICE=your_email_service
    EMAIL_USER=your_email_user
    EMAIL_PASS=your_email_password
    ```

4. Run the development server:
    ```bash
    npm run dev
    ```

5. Open your browser and navigate to `http://localhost:3000` to view the app.

## Usage
- **Create Note**: Click on the "Create Note" button, fill in the title and content, and save.
- **Search Note**: Use the search bar to find notes by title or content.
- **Edit Note**: Click on a note to view details and click the "Edit" button to modify.
- **Delete Note**: Click the "Delete" button on a note to remove it.
- **Forgot Password**: Use the "Forgot Password" link on the login page to reset your password via email.

## Project Structure
