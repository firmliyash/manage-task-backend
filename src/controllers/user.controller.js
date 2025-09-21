import responseHelper from "../helpers/responseHelper.js";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import userService from "../services/user.service.js";
const userController = {
  getUserList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.per_page) || 10;
      const offset = (page - 1) * limit;

      // Fetch users with pagination
      const { count, rows: users } = await userService.findAndCountAll({
        attributes: ["id", "firstName", "lastName", "role", "email"],
        limit,
        offset,
      });

      // Prepare pagination metadata
      const totalPages = Math.ceil(count / limit);

      const outputPayload = {
        metaInfo: {
          totalItems: count,
          perPage : totalPages,
          currentPage: page,
          totalPage: limit,
        },
        records: users,
      };

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        outputPayload
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  },
  getDropdownList: async (req, res) => {
    try {
      const users = await userService.findAll({
        where:{ role: "user" },
        attributes: ["id", "firstName", "lastName", "role", "email"],
      });

      const dropdownList = users.map((user) => ({
        label: `${user?.firstName} ${user?.lastName} - (${user?.email})`,
        value: String(user.id),
      }))
      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        dropdownList,
        "User list retrieved successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error.message
      );
    }
  },
};

export default userController;
