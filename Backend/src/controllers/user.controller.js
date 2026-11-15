import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name?.trim() || !username?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existedUser) {
            return res.status(400).json({ message: "user already exist" })
        }

        const user = await User.create({
            username: username,
            email: email,
            password: password,
            name: name
        })

        return res.status(201).json({ message: "registration successful" })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access token",
        );
    }
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" })

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" })
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id,);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully",
            ),
        );

});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, { user: req.user }, "User fetched successfully")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: "",
            },
        },
        {
            new: true,
        },
    );
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is invalid or expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(401, "Invalid refresh token");
    }
});



const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, username, whatsappNumber } = req.body;

    if (!name?.trim() || !username?.trim()) {
        throw new ApiError(400, "Name and username are required");
    }

    const existingUser = await User.findOne({
        username: username.trim(),
        _id: { $ne: req.user._id }
    });

    if (existingUser) {
        throw new ApiError(409, "Username already exists");
    }

    const updateFields = {
        name: name.trim(),
        username: username.trim()
    };

    if (whatsappNumber !== undefined) {
        const number = whatsappNumber.replace(/[\s-]/g, "");

        if (number !== "" && !/^(?:\+91)?[6-9]\d{9}$/.test(number)) {
            throw new ApiError(400, "Enter a valid Indian WhatsApp number");
        }

        updateFields.whatsappNumber = number
            ? number.replace("+", "").startsWith("91")
                ? number.replace("+", "")
                : "91" + number
            : "";
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: updateFields
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken -forgotPasswordToken -emailVerificationToken");

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { user: updatedUser },
            "Profile updated successfully"
        )
    );
});



export { registerUser, loginUser, getCurrentUser, logoutUser, refreshAccessToken, updateAccountDetails }