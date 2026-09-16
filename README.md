# FitTrack API — Backend

A RESTful API built with Node.js, Express, and MongoDB for user authentication and BMI tracking.

## Features

* **JWT Authentication**: User registration, login, profile management, and token refresh.
* **Role-based Access**: Admin-only access to specific endpoints.
* **BMI Tracking**: Record personal weight/height measurements and fetch user history.
* **Input Validation**: Request body validation powered by Joi.

## Tech Stack

* **Node.js** & **Express.js** (v5)
* **MongoDB** via **Mongoose**
* **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
* **Validation**: `joi`

## Prerequisites

* Node.js (v18+)
* MongoDB connection string (local or MongoDB Atlas)

## Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=3000
DB_URL=your_mongodb_connection_string
JWT_ACCESS=your_jwt_access_secret
JWT_REFRESH=your_jwt_refresh_secret
