const User = require("../Models/UserModel");
const Phone = require("../Models/PhoneModel");
// The OrderModel exports using `export default`? Wait, let's check OrderModel.js. 
// Ah, `OrderModel.js` uses `module.exports = mongoose.model("Order",orderSchema)`. OK.
const Order = require("../Models/OrderModel");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Phone.countDocuments();
        const totalOrders = await Order.countDocuments();
        const soldProducts = await Phone.countDocuments({ isSold: true });
        const pendingShipments = await Order.countDocuments({ shipmentStatus: "Pending" });

        // Get total revenue
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Get recent users
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        // Get recent orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).populate("phoneId", "name").limit(5);

        res.json({
            message: "Admin stats fetched",
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                soldProducts,
                pendingShipments,
                totalRevenue,
                recentUsers,
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats", error: error.message });
    }
};

module.exports = { getAdminStats };
