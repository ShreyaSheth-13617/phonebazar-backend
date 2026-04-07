const reviewSchema = require('../Models/ReviewModel')
const Phone = require('../Models/PhoneModel')

const getAllReviews = async (req,res)=>{
    try{

        const reviews = await reviewSchema.find()
        .populate("userId")
        .populate("phoneId")

        res.json({
            message:"All reviews",
            data:reviews
        })

    }catch(error){
        res.status(500).json({
            message:"Error fetching reviews",
            error:error.message
        })
    }
}

const getReviewsByProduct = async (req,res)=>{
    try{
        const { productId } = req.params
        const reviews = await reviewSchema.find({ phoneId: productId })
        .sort({ createdAt: -1 })
        .populate("userId", "name email")

        res.json({
            message:"Product reviews",
            data:reviews
        })
    }catch(error){
        res.status(500).json({
            message:"Error fetching reviews",
            error:error.message
        })
    }
}

const addReview = async (req,res)=>{
    try{

        const review = await reviewSchema.create({
            ...req.body,
            userId: req.user._id,
        })

        const reviews = await reviewSchema.find({ phoneId: review.phoneId })
        const avg = reviews.reduce((a, r) => a + (r.rating || 0), 0) / (reviews.length || 1)
        await Phone.findByIdAndUpdate(review.phoneId, {
            rating: Math.round(avg * 10) / 10,
            totalReviews: reviews.length,
        })

        const populated = await reviewSchema.findById(review._id).populate("userId", "name email")

        res.status(201).json({
            message:"Review added",
            data: populated
        })

    }catch(error){
        res.status(400).json({
            message:"Error adding review",
            error:error.message
        })
    }
}

module.exports = { getAllReviews, getReviewsByProduct, addReview }
