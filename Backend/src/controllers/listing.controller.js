import { Listing } from "../models/listings.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createListing = asyncHandler(async (req, res) => {
    const { title, description, price, type, category, condition } = req.body

    // Check required fields
    if (
        !title?.trim() ||
        !description?.trim() ||
        price === undefined ||
        !type?.trim() ||
        !category?.trim() ||
        !condition?.trim()
    ) {
        throw new ApiError(400, "All listing fields are required");
    }

    // Validate listing type
    if (!["sell", "donate"].includes(type)) {
        throw new ApiError(400, "Invalid listing type");
    }

    // Validate condition
    if (!["new", "good", "fair", "poor"].includes(condition)) {
        throw new ApiError(400, "Invalid listing condition");
    }

    // Validate price
    if (Number.isNaN(Number(price)) || Number(price) < 0) {
        throw new ApiError(400, "Price must be a valid non-negative number");
    }


    const imageUrls = [];

    for (const file of req.files) {
        const result = await uploadOnCloudinary(file.buffer);
        imageUrls.push(result.secure_url);
    }
    const listing = await Listing.create({
        title,
        description,
        price,
        type,
        category,
        condition,
        images: imageUrls,
        seller: req.user._id
    })
    return res.status(201).json(
        new ApiResponse(201, { listing }, "listing created successfuly")
    )
})

const getAllListings = asyncHandler(async (req, res) => {
    const { category, type, condition, search, sort, page = 1, limit = 10 } = req.query
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
        !Number.isInteger(pageNumber) ||
        !Number.isInteger(limitNumber) ||
        pageNumber < 1 ||
        limitNumber < 1 ||
        limitNumber > 50
    ) {
        throw new ApiError(400, "Invalid pagination parameters");
    }
    const filter = {
        status: "active",
    }
    if (category) {
        filter.category = category;
    }
    if (type) {
        filter.type = type;
    }
    if (condition) {
        filter.condition = condition;
    }
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ]
    }
    let sortOption = { createdAt: -1 };

    if (sort === "price-low") {
        sortOption = { price: 1 };
    } else if (sort === "price-high") {
        sortOption = { price: -1 };
    }
    const skip = (pageNumber - 1) * limitNumber;

    const list = await Listing.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .populate("seller", "name username");

    const totalListings = await Listing.countDocuments(filter)
    const totalPages = Math.ceil(totalListings / limitNumber)

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                list,
                page: pageNumber,
                limit: limitNumber,
                totalListings,
                totalPages
            },
            "All listings fetched"
        )
    );
})

const getMyListings = asyncHandler(async (req, res) => {
    const filter = { seller: req.user._id, }
    const mylist = await Listing.find(filter).populate("seller", "name username")

    return res.status(200)
        .json(
            new ApiResponse(200, { mylist }, "my listing fetched")
        )
})



const getListingById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const list = await Listing.findById(id)
        .populate("seller", "name username whatsappNumber");

    if (!list) {
        throw new ApiError(404, "Listing not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { list }, "Fetched successfully")
    );
});


const updateListing = asyncHandler(async (req, res) => {
    const { title, description, price, type, category, condition, images } = req.body
    const { id } = req.params
    const currentList = await Listing.findById(id)
    const loggedInId = req.user._id

    if (!currentList) {
        throw new ApiError(404, "Listing not found");
    }

    if (!(currentList.seller.equals(loggedInId))) {
        throw new ApiError(403, "Unauthorized access")
    }
    const upList = await Listing.findByIdAndUpdate(id, { title, description, price, type, category, condition, images, }, { new: true })
    return res.status(200).json(
        new ApiResponse(200, { upList }, "listing updated successfully")
    )
})

const deleteListing = asyncHandler(async (req, res) => {
    const { id } = req.params
    const currentList = await Listing.findById(id)
    const loggedInId = req.user._id

    if (!currentList) {
        throw new ApiError(404, "Listing not found");
    }

    if (!currentList.seller.equals(loggedInId)) {
        throw new ApiError(403, "Unauthorized access");
    }

    const dltList = await Listing.findByIdAndDelete(id)
    return res.status(200).json(
        new ApiResponse(200, { dltList }, "listing deleted successfully")
    )
})

const updateListingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body
    if (!["active", "sold", "donated"].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }
    const { id } = req.params
    const currentList = await Listing.findById(id)
    const loggedInId = req.user._id

    if (!currentList) {
        throw new ApiError(404, "Listing not found");
    }

    if (!(currentList.seller.equals(loggedInId))) {
        throw new ApiError(403, "Unauthorized access")
    }
    const updList = await Listing.findByIdAndUpdate(id, { status }, { new: true })
    return res.status(200).json(
        new ApiResponse(200, { updList }, "listing status updated successfully")
    )
})

export { createListing, getAllListings, getListingById, updateListing, deleteListing, updateListingStatus, getMyListings }