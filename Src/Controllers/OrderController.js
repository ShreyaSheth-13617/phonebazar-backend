import orderSchema from "../Models/OrderModel.js"; // ✅ FIXED
import PhoneModel from "../Models/PhoneModel.js";

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderSchema.find()
            .populate("buyerId")
            .populate("phoneId")
            .populate("sellerId"); // ✅ ADD THIS

        res.json({
            message: "All orders",
            data: orders
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        })
    }
}

const getOrdersByUser = async (req, res) => {
    try {
        const orders = await orderSchema.find({ buyerId: req.user._id })
            .populate("phoneId")
            .sort({ createdAt: -1 })

        res.json({
            message: "User orders",
            data: orders
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            error: error.message
        })
    }
}

const addOrder = async (req, res) => {
    try {

        // 1. Fetch phone
        const phone = await PhoneModel.findById(req.body.phoneId);

        if (!phone) {
            return res.status(404).json({
                message: "Phone not found"
            });
        }

        // ✅ PREVENT DOUBLE BUY
        if (phone.isSold) {
            return res.status(400).json({ message: "Already sold" });
        }

        // 2. Get seller
        const sellerId = phone.sellerId;

        // 3. Create order
        const payload = {
            ...req.body,
            buyerId: req.user._id,
            sellerId: sellerId,
            orderDate: req.body.orderDate ? new Date(req.body.orderDate) : new Date(),
        }

        const order = await orderSchema.create(payload)

        // ✅ MARK SOLD
        phone.isSold = true;
        await phone.save();

        const populated = await orderSchema.findById(order._id)
            .populate("phoneId")
            .populate("buyerId", "name email")

        res.status(201).json({
            message: "Order placed",
            data: populated
        })

    } catch (error) {
        res.status(400).json({
            message: "Error placing order",
            error: error.message
        })
    }
}

const updateOrder = async (req, res) => {
    try {

        const updatedOrder = await orderSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.json({
            message: "Order updated",
            data: updatedOrder
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating order",
            error: error.message
        })
    }
}

const getSellerOrders = async (req, res) => {
    try {

        const orders = await orderSchema.find({ sellerId: req.user._id })
            .populate("phoneId")
            .populate("buyerId", "name email")
            .sort({ createdAt: -1 });

        res.json({
            message: "Seller orders",
            data: orders
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching seller orders",
            error: error.message
        })
    }
}

const updateShipmentStatus = async (req, res) => {
    try {
        const order = await orderSchema.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update shipment for this order" });
        }

        order.shipmentStatus = req.body.shipmentStatus || order.shipmentStatus;
        await order.save();

        res.json({
            message: "Shipment status updated",
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating shipment", error: error.message });
    }
};

const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const totalListings = await PhoneModel.countDocuments({ sellerId });

        const totalOrders = await orderSchema.countDocuments({ sellerId });

        const activeOrders = await orderSchema.countDocuments({
            sellerId,
            orderStatus: { $ne: "Delivered" }
        });

        const revenueResult = await orderSchema.aggregate([
            { $match: { sellerId: sellerId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue =
            revenueResult.length > 0 ? revenueResult[0].total : 0;

        const recentOrders = await orderSchema.find({ sellerId })
            .populate("phoneId", "name price")
            .populate("buyerId", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            message: "Seller stats fetched",
            data: {
                totalListings,
                totalOrders,
                activeOrders,
                totalRevenue,
                recentOrders
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching seller stats",
            error: error.message
        });
    }
};

// ✅ FIX EXPORT
export {
    getAllOrders,
    getOrdersByUser,
    addOrder,
    updateOrder,
    getSellerOrders,
    updateShipmentStatus,
    getSellerStats
};