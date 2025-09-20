import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import responseHelper from "../helpers/responseHelper.js";

const checkAdmin = async (req, res, next) => {
  try {
    // Get token from headers
    if (!req.user) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_UNAUTHORIZED,
        "You are not authorize to access this route."
      );
    }

    // Check if the user is an admin
    if (req.user.role !== "admin") {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_FORBIDDEN,
        "You are not authorize to access this route."
      );
    }

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    return responseHelper.errorResponse(
      res,
      HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export default checkAdmin;
