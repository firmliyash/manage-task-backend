import responseHelper from "../helpers/responseHelper.js";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import validateJoiData from "../helpers/validationHelper.js";
import projectSchema from "../schema/project.schema.js";
import projectService from "../services/projectService.js";
import projectMemberService from "../services/projectMemberService.js";
import userService from "../services/user.service.js";
import { User } from "../models/User.js";

const projectController = {
  createProject: async (req, res) => {
    try {
      const data = req?.body;
      const validation = validateJoiData(data, projectSchema.createProjectSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      const projectData = {
        ...values,
        created_by: req.user.id
      };
      const project = await projectService.create(projectData);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_CREATED,
        { project },
        "Project created successfully"
      );
    } catch (error) {
      console.error("Create project error:", error);
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getProject: async (req, res) => {
    try {
      const data = { id: parseInt(req?.params?.id) };
      const validation = validateJoiData(data, projectSchema.projectIdSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      const project = await projectService.findOneById(values.id);
      if (!project) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Project not found"
        );
      }

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { project },
        "Project retrieved successfully"
      );
    } catch (error) {
      console.error("Get project error:", error);
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getUserProjects: async (req, res) => {
    try {
      const projects = await projectService.findAll({
        where: { created_by: req.user.id }
      });

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { projects },
        "Projects retrieved successfully"
      );
    } catch (error) {
      console.error("Get user projects error:", error);
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  updateProject: async (req, res) => {
    try {
      const paramsData = { id: parseInt(req?.params?.id) };
      const paramsValidation = validateJoiData(paramsData, projectSchema.projectIdSchema, true);
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(bodyData, projectSchema.updateProjectSchema, false);
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      await projectService.update(
        { id: paramsValidation.values.id },
        bodyValidation.values
      );
      const project = await projectService.findOneById(paramsValidation.values.id);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { project },
        "Project updated successfully"
      );
    } catch (error) {
      console.error("Update project error:", error);

      if (error.message === "Project not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "Only project admins can update projects") {
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

  deleteProject: async (req, res) => {
    try {
      const data = { id: parseInt(req?.params?.id) };
      const validation = validateJoiData(data, projectSchema.projectIdSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      await projectService.destroy({ id: values.id });

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        {},
        "Project deleted successfully"
      );
    } catch (error) {
      console.error("Delete project error:", error);

      if (error.message === "Project not found") {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          error.message
        );
      }

      if (error.message === "Only project admins can delete projects") {
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

  inviteUser: async (req, res) => {
    try {
      const paramsData = { id: parseInt(req?.params?.id) };
      const paramsValidation = validateJoiData(paramsData, projectSchema.projectIdSchema, true);
      if (paramsValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          paramsValidation.errors
        );
      }

      const bodyData = req?.body;
      const bodyValidation = validateJoiData(bodyData, projectSchema.inviteUserSchema, true);
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }

      // Check if project exists
      const project = await projectService.findOneById(paramsValidation.values.id);
      if (!project) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Project not found"
        );
      }

      // Check if current user is admin of the project
      const currentUserMembership = await projectMemberService.findOne({
        project_id: paramsValidation.values.id,
        user_id: req.user.id,
        role: "Admin"
      });

      if (!currentUserMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Only project admins can invite users"
        );
      }

      // Check if user to invite exists
      const userToInvite = await userService.findOne({ email: bodyValidation.values.email });
      if (!userToInvite) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "User not found"
        );
      }

      // Check if user is already a member
      const existingMembership = await projectMemberService.findOne({
        project_id: paramsValidation.values.id,
        user_id: userToInvite.id
      });

      if (existingMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_CONFLICT,
          "User is already a member of this project"
        );
      }

      // Create membership
      const membershipData = {
        project_id: paramsValidation.values.id,
        user_id: userToInvite.id,
        role: bodyValidation.values.role || "Member"
      };

      const membership = await projectMemberService.create(membershipData);

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_CREATED,
        { membership },
        "User invited successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  removeUser: async (req, res) => {
    try {
      const paramsData = { 
        id: parseInt(req?.params?.id),
        userId: parseInt(req?.params?.userId)
      };
      const projectValidation = validateJoiData({ id: paramsData.id }, projectSchema.projectIdSchema, true);
      const userValidation = validateJoiData({ userId: paramsData.userId }, projectSchema.removeUserSchema, true);
      
      if (projectValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          projectValidation.errors
        );
      }

      if (userValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          userValidation.errors
        );
      }

      // Check if project exists
      const project = await projectService.findOneById(projectValidation.values.id);
      if (!project) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Project not found"
        );
      }

      // Check if current user is admin of the project
      const currentUserMembership = await projectMemberService.findOne({
        project_id: projectValidation.values.id,
        user_id: req.user.id,
        role: "Admin"
      });

      if (!currentUserMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Only project admins can remove users"
        );
      }

      // Check if user to remove is a member
      const membershipToRemove = await projectMemberService.findOne({
        project_id: projectValidation.values.id,
        user_id: userValidation.values.userId
      });

      if (!membershipToRemove) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "User is not a member of this project"
        );
      }

      // Prevent removing project creator
      if (membershipToRemove.role === "Admin" && project.created_by === userValidation.values.userId) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Project creator cannot be removed"
        );
      }

      // Remove membership
      await projectMemberService.destroy({
        project_id: projectValidation.values.id,
        user_id: userValidation.values.userId
      });

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        {},
        "User removed successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getProjectMembers: async (req, res) => {
    try {
      const data = { id: parseInt(req?.params?.id) };
      const validation = validateJoiData(data, projectSchema.projectIdSchema, true);
      if (validation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          validation.errors
        );
      }
      const values = validation.values;

      // Check if current user is a member of the project
      const currentUserMembership = await projectMemberService.findOne({
        project_id: values.id,
        user_id: req.user.id
      });

      if (!currentUserMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      // Get all project members with user information
      const members = await projectMemberService.findAll({
        where: { project_id: values.id },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"]
          }
        ]
      });

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { members },
        "Project members retrieved successfully"
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

export default projectController;