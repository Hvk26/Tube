const asyncHandler = (requestHandler) => async(req, res, next) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        res.status(error.code || 300).json({
            success: false,
            message: error.message
        });
    }
}

export {asyncHandler};