import responseHelper from "../helpers/responseHelper.js";
import { HTTP_RESPONSES } from "../constants/http-response-messages.constants.js";
import validateJoiData from "../helpers/validationHelper.js";
import projectSchema from "../schema/project.schema.js";
import projectService from "../services/project.service.js";
import projectMemberService from "../services/projectMember.service.js";
import userService from "../services/user.service.js";
import { User } from "../models/User.model.js";
import _ from "lodash";
import { ProjectMember } from "../models/ProjectMember.model.js";

const projectController = {
  createProject: async (req, res) => {
    try {
      const data = req?.body;
      const validation = validateJoiData(
        data,
        projectSchema.createProjectSchema,
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

      const projectData = {
        ...values,
        created_by: req.user.userId,
      };
      const project = await projectService.create(projectData);
      const projectMemberPayload = {
        project_id: project.id,
        user_id: req.user.userId,
        role: "Admin",
      };
      await projectMemberService.create(projectMemberPayload);
      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_CREATED,
        project,
        "Project created successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getProject: async (req, res) => {
    try {
      const data = { project_id: parseInt(req?.params?.id) };
      const validation = validateJoiData(
        data,
        projectSchema.projectIdSchema,
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

      const project = await projectService.findOneById(values.project_id);
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
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  getUserProjects: async (req, res) => {
    try {
      const page = parseInt(req.query?.page) || 1;
      const limit = parseInt(req.query?.per_page) || 10;
      const offset = (page - 1) * limit;
      let baseWhere = {};
      const userInfo = req.user;
      if (_.isEmpty(userInfo)) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_UNAUTHORIZED,
          "User Infor not found. Login again"
        );
      }
      // baseWhere.created_by = userInfo.userId;

      const { count, rows: projects } = await projectService.findAndCountAll({
        where: baseWhere,
        attributes: ["id", "name", "description", "created_by"],
        include: [
          {
            model: User,
            as: "createdBy",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: ProjectMember,
            as: "projectMembers",
            attributes: ["id", "project_id", "user_id", "role"],
            where: {
              user_id: userInfo.userId,
            },
          },
        ],
        limit,
        offset,
      });

      // Prepare pagination metadata
      const totalPages = Math.ceil(count / limit);
      const outputPayload = {
        metaInfo: {
          totalItems: count,
          perPage: totalPages,
          currentPage: page,
          totalPage: limit,
        },
        records: projects,
      };

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        outputPayload,
        "Projects retrieved successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },
  getUserProjectsDropdown: async (req, res) => {
    try {
      let baseWhere = {};
      const userInfo = req.user;
      if (_.isEmpty(userInfo)) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_UNAUTHORIZED,
          "User Infor not found. Login again"
        );
      }
      // baseWhere.created_by = userInfo.userId;

      const result = await projectService.findAll({
        where: baseWhere,
        attributes: ["id", "name", "description", "created_by"],
        include: [
          {
            model: User,
            as: "createdBy",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: ProjectMember,
            as: "projectMembers",
            attributes: ["id", "project_id", "user_id", "role"],
            where: {
              user_id: userInfo.userId,
            },
          },
        ],
      });

      const outputPayload = result.map((project) => ({
        label: project?.name,
        value: String(project?.id),
      }));

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        outputPayload,
        "Projects dropdown list retrieved successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  updateProject: async (req, res) => {
    try {
      const bodyData = req?.body;
      bodyData.project_id = parseInt(req?.params?.id);
      const bodyValidation = validateJoiData(
        bodyData,
        projectSchema.updateProjectSchema,
        false
      );
      if (bodyValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          bodyValidation.errors
        );
      }
      const values = bodyValidation.values;
      const project = await projectService.findOneById(values.project_id);
      if (!project) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Project not found"
        );
      }

      await projectService.update(
        { id: values.project_id },
        bodyValidation.values
      );

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        { project },
        "Project updated successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_NOT_FOUND,
        error.message
      );
    }
  },

  deleteProject: async (req, res) => {
    try {
      const data = { id: parseInt(req?.params?.id) };
      const validation = validateJoiData(
        data,
        projectSchema.projectIdSchema,
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

      await projectService.destroy({ id: values.id });

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        {},
        "Project deleted successfully"
      );
    } catch (error) {
      return responseHelper.errorResponse(
        res,
        HTTP_RESPONSES.HTTP_INTERNAL_SERVER_ERROR,
        error?.message
      );
    }
  },

  inviteUser: async (req, res) => {
    try {
      const bodyData = req?.body;
      bodyData.project_id = parseInt(req?.params?.id);
      const bodyValidation = validateJoiData(
        bodyData,
        projectSchema.inviteUserSchema,
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
      // Check if project exists
      const project = await projectService.findOneById(values.project_id);
      if (!project) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Project not found"
        );
      }

      // Check if current user is admin of the project
      const currentUserMembers = await projectMemberService.findOne({
        project_id: values.project_id,
        user_id: req.user.userId,
        role: "Admin",
      });

      if (!currentUserMembers) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Only project admins can invite users"
        );
      }

      // Check if user to invite exists
      const userToInvite = await userService.findOne({
        id: values.user_id,
      });
      if (!userToInvite) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "User not found"
        );
      }

      // Check if user is already a member
      const membershipData = {
        project_id: values.project_id,
        user_id: userToInvite.id,
        role: values.role,
      };
      const existingMembership = await projectMemberService.findOne(
        membershipData
      );

      if (existingMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_CONFLICT,
          "User is already a member of this project"
        );
      }

      // Create membership

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
        project_id: parseInt(req?.params?.id),
        userId: parseInt(req?.params?.userId),
      };
      const projectValidation = validateJoiData(
        paramsData,
        projectSchema.removeUserSchema,
        true
      );

      if (projectValidation.isError) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_BAD_REQUEST,
          projectValidation.errors
        );
      }
      const values = projectValidation.values;

      // Check if project exists
      const project = await projectService.findOneById(values.project_id);
      if (!project) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "Project not found"
        );
      }

      // Check if current user is admin of the project
      const currentUserMembership = await projectMemberService.findOne({
        project_id: values.project_id,
        user_id: req.user.userId,
        role: "Admin",
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
        project_id: values.project_id,
        user_id: values.user_id,
      });

      if (!membershipToRemove) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_NOT_FOUND,
          "User is not a member of this project"
        );
      }

      // Prevent removing project creator
      if (
        membershipToRemove.role === "Admin" &&
        project.created_by === values.user_id
      ) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "Project creator cannot be removed"
        );
      }

      // Remove membership
      await projectMemberService.destroy({
        project_id: projectValidation.values.id,
        user_id: userValidation.values.userId,
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
      const data = { project_id: parseInt(req?.params?.id) };

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.per_page) || 10;
      const offset = (page - 1) * limit;

      const validation = validateJoiData(
        data,
        projectSchema.projectIdSchema,
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

      // Check if current user is a member of the project
      const currentUserMembership = await projectMemberService.findOne({
        project_id: values.project_id,
        user_id: req.user.userId,
      });

      if (!currentUserMembership) {
        return responseHelper.errorResponse(
          res,
          HTTP_RESPONSES.HTTP_FORBIDDEN,
          "You are not a member of this project"
        );
      }

      // Get all project members with user information

      const members = await projectService.findOneWithOptions({
        where: { id: values.project_id },
        attributes: ["id", "name", "description", "created_by", "createdAt"],
        include: [
          {
            model: ProjectMember,
            as: "projectMembers",
            attributes: ["id", "project_id", "user_id", "role"],
            include: [
              {
                model: User,
                as: "userInfo",
                attributes: ["id", "firstName", "lastName", "email"],
              },
            ],
          },
        ],
      });
      if (req.query.dropdown === "true") {
        // Deduplicate members by user_id
        const uniqueMembers = new Map();
        members.projectMembers.forEach((member) => {
          if (!uniqueMembers.has(member.user_id)) {
            uniqueMembers.set(member.user_id, member);
          }
        });

        const dropdownData = Array.from(uniqueMembers.values()).map(
          (member) => ({
            value: String(member.user_id),
            label: `${member.userInfo.firstName} ${member.userInfo.lastName} (${member.userInfo.email})`,
          })
        );

        return responseHelper.successResponse(
          res,
          HTTP_RESPONSES.HTTP_OK,
          dropdownData,
          "Project members retrieved successfully"
        );
      }

      return responseHelper.successResponse(
        res,
        HTTP_RESPONSES.HTTP_OK,
        members,
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
