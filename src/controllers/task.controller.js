import responseHelper from "../helpers/responseHelper.js";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import validateJoiData from "../helpers/validationHelper.js";
import taskSchema from "../schema/task.schema.js";
import taskService from "../services/task.service.js";
import projectMemberService from "../services/projectMember.service.js";
import projectService from "../services/project.service.js";
import userService from "../services/user.service.js";
import { User } from "../models/User.model.js";
import { Project } from "../models/Project.model.js";

const taskController = {
  createTask: async (req, res) => {
    try {
      const data = req?.body;
      const validation = validateJoiData(
        data,
        taskSchema.createTaskSchema,
        true
      );
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      // Check if user is member of the project
      const membership = await projectMemberService.findOne({
        project_id: values.project_id,
        user_id: req.user.userId,
      });

      if (!membership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      // If assigning to someone, check they are also a project member

      const task = await taskService.create(values);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_CREATED,
        { task },
        "Task created successfully"
      );
    } catch (error) {
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

      const task = await taskService.findOneById(values.id);
      if (!task) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Task not found"
        );
      }

      // Check if user is member of the project
      const membership = await projectMemberService.findOne({
        project_id: task.project_id,
        user_id: req.user.userId,
      });

      if (!membership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task },
        "Task retrieved successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getProjectTasks: async (req, res) => {
    try {
      const queryData = req?.query || {};
      queryData.projectId = parseInt(req?.params?.projectId);
      const queryValidation = validateJoiData(
        queryData,
        taskSchema.projectTasksQuerySchema,
        false
      );
      if (queryValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          queryValidation.errors
        );
      }
      const values = queryValidation.values;
      // Check if user is member of the project
      const membership = await projectMemberService.findOne({
        project_id: values.projectId,
        user_id: req.user.userId,
      });

      if (!membership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      const page = values.page || 1;
      const limit = values.per_page || 10;
      const offset = (page - 1) * limit;

      const whereClause = { project_id: values.projectId };
      if (values.status) {
        whereClause.status = values.status;
      }
      if (values.assigned_to) {
        whereClause.assigned_to = values.assigned_to;
      }

      const result = await taskService.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const outputPayload = {
        tasks: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(result.count / limit),
          totalItems: result.count,
          itemsPerPage: limit,
        },
      };

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        outputPayload,
        "Project tasks retrieved successfully"
      );
    } catch (error) {
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
      const queryValidation = validateJoiData(
        queryData,
        taskSchema.userTasksQuerySchema,
        false
      );
      if (queryValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          queryValidation.errors
        );
      }

      const values = queryValidation.values;

      const page = values.page || 1;
      const limit = values.limit || 10;
      const offset = (page - 1) * limit;

      const whereClause = { assigned_to: req.user.userId };
      if (values.status) {
        whereClause.status = values.status;
      }
      if (values.project_id) {
        whereClause.project_id = values.project_id;
      }

      const { count, rows: tasks } = await taskService.findAndCountAll({
        where: whereClause,
        attributes: [
          "id",
          "title",
          "description",
          "status",
          "assigned_to",
          "deadline",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: Project,
            attributes: ["id", "name"],
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      const outputPayload = {
        metaInfo: {
          totalItems: count,
          perPage: totalPages,
          currentPage: page,
          totalPage: limit,
        },
        records: tasks,
      };
      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        outputPayload,
        "User tasks retrieved successfully"
      );
    } catch (error) {
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
      const paramsValidation = validateJoiData(
        paramsData,
        taskSchema.taskIdSchema,
        true
      );
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(
        bodyData,
        taskSchema.updateTaskSchema,
        false
      );
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      const task = await taskService.findOneById(paramsValidation.values.id);
      if (!task) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Task not found"
        );
      }

      // Check if user is member of the project
      const membership = await projectMemberService.findOne({
        project_id: task.project_id,
        user_id: req.user.userId,
      });

      if (!membership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      // If updating assignment, check new assignee is also a project member
      if (bodyValidation.values.assigned_to) {
        const assigneeMembership = await projectMemberService.findOne({
          project_id: task.project_id,
          user_id: bodyValidation.values.assigned_to,
        });

        if (!assigneeMembership) {
          return responseHelper.errorResponse(
            res,
            HTTP_RESPONSES.HTTP_FORBIDDEN,
            "Cannot assign task to non-project member"
          );
        }
      }

      await taskService.update(
        { id: paramsValidation.values.id },
        bodyValidation.values
      );

      const updatedTask = await taskService.findOneById(
        paramsValidation.values.id
      );

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task: updatedTask },
        "Task updated successfully"
      );
    } catch (error) {
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

      const task = await taskService.findOneById(values.id);
      if (!task) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Task not found"
        );
      }

      // Check if user is project admin or task assignee
      const adminMembership = await projectMemberService.findOne({
        project_id: task.project_id,
        user_id: req.user.userId,
        role: "Admin",
      });

      const isTaskAssignee = task.assigned_to === req.user.userId;

      if (!adminMembership && !isTaskAssignee) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Only project admins or task assignees can delete tasks"
        );
      }

      await taskService.destroy({ id: values.id });

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        {},
        "Task deleted successfully"
      );
    } catch (error) {
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
      const paramsValidation = validateJoiData(
        paramsData,
        taskSchema.taskIdSchema,
        true
      );
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(
        bodyData,
        taskSchema.assignTaskSchema,
        true
      );
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      const task = await taskService.findOneById(paramsValidation.values.id);
      if (!task) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Task not found"
        );
      }

      // Check if user is member of the project
      const membership = await projectMemberService.findOne({
        project_id: task.project_id,
        user_id: req.user.userId,
      });

      if (!membership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      // Check if assignee is also a project member
      const assigneeMembership = await projectMemberService.findOne({
        project_id: task.project_id,
        user_id: bodyValidation.values.assigned_to,
      });

      if (!assigneeMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Cannot assign task to non-project member"
        );
      }

      await taskService.update(
        { id: paramsValidation.values.id },
        { assigned_to: bodyValidation.values.assigned_to }
      );

      const updatedTask = await taskService.findOneById(
        paramsValidation.values.id
      );

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { task: updatedTask },
        "Task assigned successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const bodyData = req?.body;
      bodyData.task_id = parseInt(req?.params?.id);
      const bodyValidation = validateJoiData(
        bodyData,
        taskSchema.updateTaskStatusSchema,
        true
      );
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }
      const values = bodyValidation.values;
      const task = await taskService.findOneById(values.task_id);
      if (!task) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Task not found"
        );
      }
      // Check if user is member of the project
      const membership = await projectMemberService.findOne({
        project_id: task.project_id,
        user_id: req.user.userId,
      });

      if (!membership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      await taskService.update(
        { id: values.task_id },
        { status: values.status }
      );

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        {},
        "Task status updated successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },
};

export default taskController;
