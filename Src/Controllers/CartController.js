const Cart = require("../Models/CartModel");
const Phone = require("../Models/PhoneModel");

const addItem = async (req, res) => {
  try {
    const { phoneId, quantity = 1 } = req.body;
    if (!phoneId) {
      return res.status(400).json({ message: "phoneId is required" });
    }
    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (phone.isSold) {
      return res.status(400).json({ message: "Product already sold out" });
    }

    phone.isSold = true;
    await phone.save();

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [{ phoneId, quantity }],
      });
    } else {
      const idx = cart.items.findIndex(
        (i) => i.phoneId.toString() === phoneId
      );
      if (idx >= 0) {
        cart.items[idx].quantity += Number(quantity) || 1;
      } else {
        cart.items.push({ phoneId, quantity: Number(quantity) || 1 });
      }
      await cart.save();
    }

    const populated = await Cart.findById(cart._id).populate(
      "items.phoneId"
    );
    res.json({ message: "Added to cart", data: populated });
  } catch (error) {
    res.status(400).json({ message: "Error updating cart", error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.phoneId"
    );
    if (!cart) {
      cart = { userId: req.user._id, items: [] };
    }
    res.json({ message: "Cart", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { phoneId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const phone = await Phone.findById(phoneId);
    if (phone) {
      phone.isSold = false;
      await phone.save();
    }

    cart.items = cart.items.filter(
      (i) => i.phoneId.toString() !== phoneId
    );
    await cart.save();
    const populated = await Cart.findById(cart._id).populate(
      "items.phoneId"
    );
    res.json({ message: "Item removed", data: populated });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { phoneId } = req.params;
    const { quantity } = req.body;
    const q = Number(quantity);
    if (!q || q < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const item = cart.items.find(
      (i) => i.phoneId.toString() === phoneId
    );
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }
    item.quantity = q;
    await cart.save();
    const populated = await Cart.findById(cart._id).populate(
      "items.phoneId"
    );
    res.json({ message: "Cart updated", data: populated });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    if (req.query.checkout !== "true") {
      const cart = await Cart.findOne({ userId: req.user._id });
      if (cart && cart.items.length > 0) {
        for (const item of cart.items) {
          await Phone.findByIdAndUpdate(item.phoneId, { isSold: false });
        }
      }
    }

    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { items: [] } },
      { upsert: true }
    );
    res.json({ message: "Cart cleared", data: { items: [] } });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = { addItem, getCart, removeItem, updateQuantity, clearCart };
