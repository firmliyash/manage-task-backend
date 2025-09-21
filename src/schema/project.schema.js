import Joi from "joi";

const projectSchema = {
  createProjectSchema: Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
    description: Joi.string().trim().max(1000).optional().allow(""),
  }),

  updateProjectSchema: Joi.object({
    project_id: Joi.number().integer().positive().required(),
    name: Joi.string().trim().min(1).max(255).optional(),
    description: Joi.string().trim().max(1000).optional().allow(""),
  }),

  projectIdSchema: Joi.object({
    project_id: Joi.number().integer().positive().required(),
  }),

  inviteUserSchema: Joi.object({
    project_id: Joi.number().integer().positive().required(),
    user_id: Joi.number().integer().positive().required(),
    role: Joi.string().valid("Admin", "Member").required(),
  }),

  removeUserSchema: Joi.object({
    project_id: Joi.number().integer().positive().required(),
    userId: Joi.number().integer().positive().required(),
  }),
};

export default projectSchema;
