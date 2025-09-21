import _ from 'lodash';
import { ProjectMember } from '../models/ProjectMember.model.js';

const projectMemberService = {
    findAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await ProjectMember.findAll();
        } else {
            return await ProjectMember.findAll(conditions);
        }
    },

    findAndCountAll: async (conditions) => {
        if (_.isEmpty(conditions)) {
            return await ProjectMember.findAndCountAll();
        } else {
            return await ProjectMember.findAndCountAll(conditions);
        }
    },

    findOne: async (where = {}) => {
        if(_.isEmpty(where)) return {};

        return await ProjectMember.findOne({where: where });
    },
    
    findOneWithOptions: async (options = {}) => {
        if(_.isEmpty(options)) return {};

        return await ProjectMember.findOne(options);
    },

    findOneById: async (id) => {
        return await ProjectMember.findByPk(id);
    },

    create: async (data) => {
        return ProjectMember.create(data);
    },

    update: async (where, data) => {
        return await ProjectMember.update(data, {where: where});
    },
    
    destroy: async (where) => {
        return await ProjectMember.destroy({where: where});
    }
};

export default projectMemberService;