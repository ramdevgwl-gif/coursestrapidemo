"use strict";
/**
 * course controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::course.course', ({ strapi }) => ({
    /**
     * GET /courses/my/enrolled
     * Requires JWT — returns courses the user has purchased (paid orders) plus free courses.
     */
    async myEnrolled(ctx) {
        const access = strapi.service('api::lesson.lesson-access');
        const user = await access.getAuthenticatedUser(ctx);
        if (!user) {
            return ctx.unauthorized('Authentication required');
        }
        const courses = await access.getEnrolledCourses(user.email);
        return ctx.send({ data: courses });
    },
}));
