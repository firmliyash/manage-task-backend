import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import responseHelper from "../helpers/responseHelper.js";
import userService from "../services/user.service.js";
import { JWT } from "../utils/jwt.js";
export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return responseHelper.errorResponse(
      res,
      HTTP_RESPONSES.HTTP_UNAUTHORIZED,
      "Access token required"
    );
  }

  try {
    // check token is valid or not
    const decoded = await JWT.verifyAccessToken(token);
    console.log(decoded, "decoded token");

    //check user is verified or not
    const user = await userService.findOneWithOptions({
      where: { id: decoded.userId },
      attributes: ["id"],
    });

    if (!user) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_NOT_FOUND,
        "User not found"
      );
    }

    // check device id of token

    req.user = decoded;
    next();
  } catch (error) {
    return responseHelper.errorResponse(
      res,
      HTTP_RESPONSES.HTTP_UNAUTHORIZED,
      "Invalid token"
    );
  }
};
