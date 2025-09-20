import Joi from "joi";

const taskSchema = {
  createTaskSchema: Joi.object({
    project_id: Joi.number().integer().positive().required(),
    title: Joi.string().trim().min(1).max(255).required(),
    description: Joi.string().trim().max(1000).optional().allow(''),
    assigned_to: Joi.number().integer().positive().optional(),
    deadline: Joi.date().iso().optional(),
  }),

  updateTaskSchema: Joi.object({
    title: Joi.string().trim().min(1).max(255).optional(),
    description: Joi.string().trim().max(1000).optional().allow(''),
    status: Joi.string().valid('Todo', 'In-Progress', 'Done').optional(),
    assigned_to: Joi.number().integer().positive().optional(),
    deadline: Joi.date().iso().optional(),
  }),

  taskIdSchema: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),

  projectTasksSchema: Joi.object({
    projectId: Joi.number().integer().positive().required(),
  }),

  projectTasksQuerySchema: Joi.object({
    status: Joi.string().valid('Todo', 'In-Progress', 'Done').optional(),
    assigned_to: Joi.number().integer().positive().optional(),
    search: Joi.string().trim().min(1).max(100).optional(),
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
  }),

  assignTaskSchema: Joi.object({
    assigned_to: Joi.number().integer().positive().required(),
  }),

  updateTaskStatusSchema: Joi.object({
    status: Joi.string().valid('Todo', 'In-Progress', 'Done').required(),
  }),

  userTasksQuerySchema: Joi.object({
    status: Joi.string().valid('Todo', 'In-Progress', 'Done').optional(),
    project_id: Joi.number().integer().positive().optional(),
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
  }),
};

export default taskSchema;