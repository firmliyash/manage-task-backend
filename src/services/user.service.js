import _ from 'lodash'; 
import { User } from '../models/User.model.js';

const userService = {
    findAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await User.findAll();
        } else {
            return await User.findAll(conditions);
        }
    },

    findAndCountAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await User.findAndCountAll();
        } else {
            return await User.findAndCountAll(conditions);
        }
    },

    findOne: async (where = {}) => {
        if(_.isEmpty(where)) return {};

        return await User.findOne({where: where });
    },
    findOneWithOptions: async (options = {}) => {
        if(_.isEmpty(options)) return {};

        return await User.findOne(options);
    },

    findOneById: async (id) => {
        return await User.findByPk(id);
    },

    findOneByIdentifier: async (identifier) => {
        return await User.findOne({ where: { identifier: identifier } });
    },

    create: async (data) => {
        return User.create(data);
    },

    update: async (where, data) => {
        return await User.update(data,{where: where});
    },
    destroy: async (where) => {
        return await User.destroy({where: where});
    }
};

export default userService;
