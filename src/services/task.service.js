import _ from 'lodash';
import { Task } from '../models/Task.model.js';

const taskService = {
    findAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await Task.findAll();
        } else {
            return await Task.findAll(conditions);
        }
    },

    findAndCountAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await Task.findAndCountAll();
        } else {
            return await Task.findAndCountAll(conditions);
        }
    },

    findOne: async (where = {}) => {
        if(_.isEmpty(where)) return {};

        return await Task.findOne({where: where });
    },
    
    findOneWithOptions: async (options = {}) => {
        if(_.isEmpty(options)) return {};

        return await Task.findOne(options);
    },

    findOneById: async (id) => {
        return await Task.findByPk(id);
    },

    create: async (data) => {
        return Task.create(data);
    },

    update: async (where, data) => {
        return await Task.update(data, {where: where});
    },
    
    destroy: async (where) => {
        return await Task.destroy({where: where});
    }
};

export default taskService;
