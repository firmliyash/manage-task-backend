import responseHelper from "../helpers/responseHelper.js";
import _ from "lodash";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import userService from "../services/user.service.js";
import validateJoiData from "../helpers/validationHelper.js";
import authSchema from "../schema/auth.schema.js";
import { generateTokens } from "../utils/genrateToken.js";

const authController = {
  signup: async (req, res) => {
    try {
      // Validate request data
      const data = req?.body;
      const validation = validateJoiData(data, authSchema.signupSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;
      const checkUser = await userService.findOne({
        email: values.email,
      });
      if (checkUser) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_CONFLICT,
          "Email already exists"
        );
      }

      const payload = {
        ...values,
        password: await hashPassword(values.password),
        email: values.email.toLowerCase(),
        role: "user",
      };

      await userService.create(payload);
      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        "User created successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },
  login: async (req, res) => {
    try {
      const data = req?.body;
      const validation = validateJoiData(data, authSchema.loginSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      const user = await userService.findOne({
        email: values.email,
      });

      if (!user) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Invalid email or password"
        );
      }

      const isValid = await comparePassword(values.password, user.password);
      if (!isValid) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_UNAUTHORIZED,
          "Invalid email or password"
        );
      }
      const { accessToken, refreshToken } = generateTokens(user);

      return responseHelper.successResponse(res, HTTP_RESPONSES.HTTP_OK, {
        accessToken,
        refreshToken,
        userInfo: {
          id: user?.id || 0,
          email: user?.email || "",
          role: user?.role || "",
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
        },
      });
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },
};

export default authController;
