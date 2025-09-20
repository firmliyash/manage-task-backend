import Joi from "joi";

const projectSchema = {
  createProjectSchema: Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
    description: Joi.string().trim().max(1000).optional().allow(''),
  }),

  updateProjectSchema: Joi.object({
    name: Joi.string().trim().min(1).max(255).optional(),
    description: Joi.string().trim().max(1000).optional().allow(''),
  }),

  projectIdSchema: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),

  inviteUserSchema: Joi.object({
    email: Joi.string().email().trim().required(),
    role: Joi.string().valid('Admin', 'Member').optional().default('Member'),
  }),

  removeUserSchema: Joi.object({
    userId: Joi.number().integer().positive().required(),
  }),
};

export default projectSchema;