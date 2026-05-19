'use strict';

const register = ({ strapi })=>{
    strapi.customFields.register({
        name: 'color',
        plugin: 'color-picker',
        type: 'string'
    });
};

exports.register = register;
//# sourceMappingURL=register.js.map
