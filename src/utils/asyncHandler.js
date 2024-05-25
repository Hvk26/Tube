const asyncHandler = (requestHandler)=>{(req, res, next)=>{
    Promise.resolve(requestHandler(req, res, next)).catch((error)=>next(error))
}}







// adding the asynchandler utilities with async as an higher order function where request, response, and next(it is used for the middleware)
//it is a type of method to utilise and resolve the request for the database

// const asyncHandler = (requestHandler) => async(req, res, next) => {
//     try {
//         await requestHandler(req, res, next);
//     } catch (error) {
//         res.status(error.code || 300).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

export {asyncHandler};