const Phone = require("../Models/PhoneModel");
const cloudinary = require("../Utils/cloudinary");
const streamifier = require("streamifier");

// ✅ GET ALL (Filters + Search + Pagination)
const getAllPhones = async (req, res) => {
  try {
    const { brand, condition, search } = req.query;

    let query = {}; // 🔥 MUST be empty

    if (brand) query.brand = brand;
    if (condition) query.condition = condition;

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const phones = await Phone.find(query)
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "All phones",
      data: phones,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching phones",
      error: error.message,
    });
  }
};

// ✅ GET BY ID
const getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id).populate(
      "sellerId",
      "name email"
    );

    if (phone) {
      res.json({
        message: "Phone found",
        data: phone,
      });
    } else {
      res.status(404).json({
        message: "Phone not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching phone",
      error: error.message,
    });
  }
};

// ✅ ADD PHONE (Sell Phone - AUTH)
const addPhone = async (req, res) => {
  try {
    let imageUrls = [];

    // 🔥 Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "phonebazar" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const body = { ...req.body };
    if (body.price != null) body.price = Number(body.price);
    if (body.originalPrice != null && body.originalPrice !== "")
      body.originalPrice = Number(body.originalPrice);

    const phone = await Phone.create({
      ...body,
      sellerId: req.user._id,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Phone added",
      data: phone,
    });
  } catch (error) {
    const statusCode = error.name === 'ValidationError' ? 422 : 400;
    res.status(statusCode).json({
      message: "Error adding phone",
      error: error.message,
      details: error.errors || null,
    });
  }
};

// ✅ UPDATE (ONLY OWNER)
const updatePhone = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    if (phone.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updatedPhone = await Phone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Phone updated",
      data: updatedPhone,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating phone",
      error: error.message,
    });
  }
};

// ✅ DELETE (OWNER OR ADMIN)
const deletePhone = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id);

    if (!phone) {
      return res.status(404).json({
        message: "Phone not found",
      });
    }

    const isOwner =
      phone.sellerId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await phone.deleteOne();

    res.json({
      message: "Phone deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting phone",
      error: error.message,
    });
  }
};

const verifyImei = async (req, res) => {
  try {
    const { imeiNumber } = req.body;
    if (imeiNumber && imeiNumber.length >= 10 && imeiNumber.length <= 15) {
      return res.json({ message: "IMEI Verified", isVerified: true });
    }
    res.status(400).json({ message: "Invalid IMEI", isVerified: false });
  } catch (error) {
    res.status(500).json({ message: "Error verifying IMEI", error: error.message });
  }
};

const getSellerListings = async (req, res) => {
  try {
    const phones = await Phone.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      message: "Seller listings fetched",
      data: phones,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller listings", error: error.message });
  }
};

module.exports = {
  getAllPhones,
  getPhoneById,
  addPhone,
  updatePhone,
  deletePhone,
  verifyImei,
  getSellerListings
};