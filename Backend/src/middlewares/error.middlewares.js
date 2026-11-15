import { ApiError } from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
            success: false
        });
    }

    return res.status(500).json({
        statusCode: 500,
        message: err.message || "Internal server error",
        success: false
    });
};

export { errorHandler };