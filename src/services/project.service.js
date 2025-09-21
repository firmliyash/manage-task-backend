import _ from 'lodash';
import { Project } from '../models/Project.model.js';

const projectService = {
    findAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await Project.findAll();
        } else {
            return await Project.findAll(conditions);
        }
    },

    findAndCountAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await Project.findAndCountAll();
        } else {
            return await Project.findAndCountAll(conditions);
        }
    },

    findOne: async (where = {}) => {
        if(_.isEmpty(where)) return {};

        return await Project.findOne({where: where });
    },
    
    findOneWithOptions: async (options = {}) => {
        if(_.isEmpty(options)) return {};

        return await Project.findOne(options);
    },

    findOneById: async (id) => {
        return await Project.findByPk(id);
    },

    create: async (data) => {
        return Project.create(data);
    },

    update: async (where, data) => {
        return await Project.update(data, {where: where});
    },
    
    destroy: async (where) => {
        return await Project.destroy({where: where});
    }
};

export default projectService;
