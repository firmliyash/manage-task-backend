import _ from "lodash";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";

const responseHelper = {
  successResponse: (
    res,
    resStatus = HTTP_RESPONSES.HTTP_OK,
    data = null,
    message = null
  ) => {
    return res
      .status(resStatus.statusCode)
      .json({
        status: resStatus.statusCode,
        message: message ? message : "Success",
        data : data || {},
      });
  },

  errorResponse: (
    res,
    resStatus = HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
    message = "",
    payload = {},
  ) => {
    let outputPayload = payload;
    if (_.isString(payload)) {
      const errorMessages = [];
      errorMessages.push({ message: payload });
      outputPayload = errorMessages;
    }

    return res.status(resStatus.statusCode).json({
      status: resStatus.statusCode,
      message: message || resStatus.statusMessage,
      data: outputPayload,
    });
  },
};

export default responseHelper;
