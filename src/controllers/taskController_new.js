import responseHelper from "../helpers/responseHelper.js";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import validateJoiData from "../helpers/validationHelper.js";
import taskSchema from "../schema/task.schema.js";
import * as taskService from "../services/taskService.js";

const taskController = {
  createTask: async (req, res) => {
    try {
      const data = req?.body;
      const validation = validateJoiData(data, taskSchema.createTaskSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      const task = await taskService.createTask(values, req.user.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_CREATED,
        { task },
        "Task created successfully"
      );
    } catch (error) {
      console.error("Create task error:", error);

      if (error.message === "You are not a member of this project" || error.message === "Cannot assign task to non-project member") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getTask: async (req, res) => {
    try {
      const data = { id: parseInt(req?.params?.id) };
      const validation = validateJoiData(data, taskSchema.taskIdSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      const task = await taskService.getTaskById(values.id, req.user.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task },
        "Task retrieved successfully"
      );
    } catch (error) {
      console.error("Get task error:", error);

      if (error.message === "Task not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "You are not a member of this project") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getProjectTasks: async (req, res) => {
    try {
      const paramsData = { projectId: parseInt(req?.params?.projectId) };
      const paramsValidation = validateJoiData(paramsData, taskSchema.projectTasksSchema, true);
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const queryData = req?.query || {};
      const queryValidation = validateJoiData(queryData, taskSchema.projectTasksQuerySchema, false);
      if (queryValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          queryValidation.errors
        );
      }

      const { projectId } = paramsValidation.values;
      const { status, assigned_to, search, page, limit } = queryValidation.values;
      const filters = { status, assigned_to, search };
      const pagination = { page, limit };

      const result = await taskService.getProjectTasks(projectId, req.user.id, filters, pagination);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        result,
        "Project tasks retrieved successfully"
      );
    } catch (error) {
      console.error("Get project tasks error:", error);

      if (error.message === "You are not a member of this project") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getUserTasks: async (req, res) => {
    try {
      const queryData = req?.query || {};
      const validation = validateJoiData(queryData, taskSchema.userTasksQuerySchema, false);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      const { status, project_id, page, limit } = values;
      const filters = { status, project_id };
      const pagination = { page, limit };

      const result = await taskService.getUserTasks(req.user.id, filters, pagination);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        result,
        "User tasks retrieved successfully"
      );
    } catch (error) {
      console.error("Get user tasks error:", error);
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  updateTask: async (req, res) => {
    try {
      const paramsData = { id: parseInt(req?.params?.id) };
      const paramsValidation = validateJoiData(paramsData, taskSchema.taskIdSchema, true);
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(bodyData, taskSchema.updateTaskSchema, false);
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      const task = await taskService.updateTask(paramsValidation.values.id, bodyValidation.values, req.user.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task },
        "Task updated successfully"
      );
    } catch (error) {
      console.error("Update task error:", error);

      if (error.message === "Task not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "You are not a member of this project" || error.message === "Cannot assign task to non-project member") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  deleteTask: async (req, res) => {
    try {
      const data = { id: parseInt(req?.params?.id) };
      const validation = validateJoiData(data, taskSchema.taskIdSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      await taskService.deleteTask(values.id, req.user.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        {},
        "Task deleted successfully"
      );
    } catch (error) {
      console.error("Delete task error:", error);

      if (error.message === "Task not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "Only project admins or task assignees can delete tasks") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  assignTask: async (req, res) => {
    try {
      const paramsData = { id: parseInt(req?.params?.id) };
      const paramsValidation = validateJoiData(paramsData, taskSchema.taskIdSchema, true);
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(bodyData, taskSchema.assignTaskSchema, true);
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      const task = await taskService.assignTask(paramsValidation.values.id, bodyValidation.values.assigned_to, req.user.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task },
        "Task assigned successfully"
      );
    } catch (error) {
      console.error("Assign task error:", error);

      if (error.message === "Task not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "You are not a member of this project" || error.message === "Cannot assign task to non-project member") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const paramsData = { id: parseInt(req?.params?.id) };
      const paramsValidation = validateJoiData(paramsData, taskSchema.taskIdSchema, true);
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(bodyData, taskSchema.updateTaskStatusSchema, true);
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      const task = await taskService.updateTaskStatus(paramsValidation.values.id, bodyValidation.values.status, req.user.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task },
        "Task status updated successfully"
      );
    } catch (error) {
      console.error("Update task status error:", error);

      if (error.message === "Task not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "You are not a member of this project") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          error.message
        );
      }

      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },
};

export default taskController;