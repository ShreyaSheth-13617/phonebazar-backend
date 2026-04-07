const userSchema = require('../Models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail, sendLoginNotification } = require('../Utils/MailUtil')

const registerUser = async (req,res) => {
    try {

        const hashedPassword = await bcrypt.hash(req.body.password,10)

        const role = req.body.role || "Buyer"
        const normalizedRole = typeof role === "string" && ["Buyer","Seller","Retailer","Admin"].includes(role)
            ? role
            : role === "seller" ? "Seller" : role === "buyer" ? "Buyer" : "Buyer"

        const savedUser = await userSchema.create({
            ...req.body,
            role: normalizedRole,
            password:hashedPassword
        })

        // Send welcome email asynchronously (don't block registration)
        sendWelcomeEmail(savedUser.email, savedUser.name)

        const userObj = savedUser.toObject()
        delete userObj.password

        res.status(201).json({
            message:"User registered successfully",
            data:userObj
        })

    } catch (error) {

        res.status(500).json({
            message:"Error registering user",
            error:error.message
        })
    }
}

const loginUser = async (req,res) => {

    try{

        const {email,password} = req.body

        const foundUser = await userSchema.findOne({email})

        if(!foundUser){
            return res.status(404).json({
                message:"User not found"
            })
        }

        const isMatch = await bcrypt.compare(password,foundUser.password)

        if(!isMatch){
            return res.status(401).json({
                message:"Invalid password"
            })
        }

        const token = jwt.sign({ _id: foundUser._id, role: foundUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const userObj = foundUser.toObject()
        delete userObj.password

        // Send login notification asynchronously (don't block login)
        sendLoginNotification(foundUser.email, foundUser.name)

        res.status(200).json({
            message:"Login successful",
            data:userObj,
            role:foundUser.role,
            token: token
        })

    }catch(error){

        res.status(500).json({
            message:"Login error",
            error:error.message
        })
    }
}

const getAllUsers = async (req,res) => {

    try{

        const users = await userSchema.find()

        res.json({
            message:"All users",
            data:users
        })

    }catch(error){

        res.status(500).json({
            message:"Error fetching users",
            error:error.message
        })
    }
}

const getUserById = async (req,res) => {

    try{

        const user = await userSchema.findById(req.params.id)

        if(user){
            res.json({
                message:"User found",
                data:user
            })
        }else{
            res.json({
                message:"User not found"
            })
        }

    }catch(error){

        res.status(500).json({
            message:"Error fetching user",
            error:error.message
        })
    }
}

const updateUser = async (req,res) => {

    try{

        const updatedUser = await userSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        res.json({
            message:"User updated",
            data:updatedUser
        })

    }catch(error){

        res.status(500).json({
            message:"Error updating user",
            error:error.message
        })
    }
}

const deleteUser = async (req,res) => {

    try{

        const deletedUser = await userSchema.findByIdAndDelete(req.params.id)

        if(deletedUser){
            res.json({
                message:"User deleted",
                data:deletedUser
            })
        }else{
            res.json({
                message:"User not found"
            })
        }

    }catch(error){

        res.status(500).json({
            message:"Error deleting user",
            error:error.message
        })
    }
}

const crypto = require('crypto');
const { sendForgotPasswordEmail } = require('../Utils/MailUtil');

const forgotPassword = async (req, res) => {
    try {
        const user = await userSchema.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        
        console.log("---- PASSWORD RESET LINK ----");
        console.log(resetUrl);
        console.log("-----------------------------");

        try {
            await sendForgotPasswordEmail(user.email, user.name, resetUrl);
            res.status(200).json({
                message: "Password reset link sent to your email",
                // Passing token for testing in case email misconfigures
                resetToken: resetToken 
            });
        } catch (mailErr) {
            res.status(500).json({
                message: "Reset token generated, but email failed to send. Check console.",
                resetToken: resetToken
            });
        }

    } catch (error) {
        res.status(500).json({ message: "Error generating reset token", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await userSchema.findOne({
            resetToken: resetPasswordToken,
            resetTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword
}