const register = ({ strapi })=>{
    strapi.customFields.register({
        name: 'color',
        plugin: 'color-picker',
        type: 'string'
    });
};

export { register };
//# sourceMappingURL=register.mjs.map
