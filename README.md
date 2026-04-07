# 📦 PhoneBazar Backend

Scalable MERN backend for PhoneBazar – an online mobile marketplace platform.

## 🚀 Features

* User Authentication (Register/Login)
* JWT-based Authorization
* Product (Phone) Management
* Cart System
* Order Management
* Razorpay Payment Integration
* Reviews & Ratings
* Shipment Tracking
* Admin Panel APIs

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Razorpay API

## 📁 Project Structure

```
Src/
 ├── Controllers/
 ├── Routes/
 ├── Models/
 ├── Utils/
```

## ⚙️ Environment Variables

Create a `.env` file in root:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret
```

## ▶️ Run Locally

```
npm install
npm start
```

## 🌐 API Base URL

```
http://localhost:5000/api
```

## 📌 Notes

* Do not commit `.env` file
* Use MongoDB Atlas for production
* Ensure Razorpay keys are correct

## 👩‍💻 Author

PhoneBazar Project
