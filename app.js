import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import DBConnection from "./Src/Utils/DBConnection.js";

import UserRoutes from "./Src/Routes/UserRoutes.js";
import ReportRoutes from "./Src/Routes/TestingReportRoutes.js";
import ShipmentRoutes from "./Src/Routes/ShipmentRoutes.js";
import ReviewRoutes from "./Src/Routes/ReviewRoutes.js";
import PhoneRoutes from "./Src/Routes/PhoneRoutes.js";
import CartRoutes from "./Src/Routes/CartRoutes.js";
import PaymentRoutes from "./Src/Routes/PaymentRoutes.js";
import OrderRoutes from "./Src/Routes/OrderRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// DB
DBConnection();

import AdminRoutes from "./Src/Routes/AdminRoutes.js";

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/auth", UserRoutes);

app.use("/api/reports", ReportRoutes);
app.use("/api/testing", ReportRoutes);
app.use("/api/shipments",ShipmentRoutes);
app.use("/api/reviews", ReviewRoutes);

app.use("/api/phones", PhoneRoutes);
app.use("/api/products",PhoneRoutes);

app.use("/api/cart", CartRoutes);
app.use("/api/payments",PaymentRoutes);
app.use("/api/orders",OrderRoutes);

app.use("/api/admin", AdminRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});