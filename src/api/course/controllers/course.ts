/**
 * course controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::course.course', ({ strapi }) => ({
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
