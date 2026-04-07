import { verifyPayment } from "./Src/Controllers/PaymentController.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("DB Connected");
    
    // Attempt verification with fake req and res
    const req = {
        body: {
            razorpay_order_id: "fake",
            razorpay_payment_id: "fake",
            razorpay_signature: "fake",
            cartItems: [{ phoneId: "65e000000000000000000000", quantity: 1, price: 100 }],
            shippingInfo: { name: "test", email: "test@example.com", phone:"123", address:"A", city:"B", pincode:"3" },
            deliveryType: "Normal"
        },
        user: { _id: "65e000000000000000000001" }
    };

    const res = {
        status: function(code) {
            console.log("Status called with code", code);
            return this;
        },
        json: function(data) {
            console.log("JSON called with data", data);
        }
    };

    await verifyPayment(req, res);
    
    console.log("Done");
    process.exit(0);
}).catch(e => console.error(e));
