/**
 * lesson controller — includes protected LMS endpoints
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::lesson.lesson', ({ strapi }) => {
  const access = () => strapi.service('api::lesson.lesson-access');

  return {
    /**
     * GET /lessons/course/:courseSlug
     * Returns lessons with locked flag; premium fields omitted when locked.
     */
    async findByCourse(ctx) {
      const { courseSlug } = ctx.params;
      if (!courseSlug) {
        return ctx.badRequest('courseSlug is required');
      }

      const user = await access().getAuthenticatedUser(ctx);
      const result = await access().getCourseLessonsWithAccess(courseSlug, user);

      if (!result) {
        return ctx.notFound('Course not found');
      }

      return ctx.send({ data: result });
    },

    /**
     * GET /lessons/course/:courseSlug/access
     * Quick access check for a course (used by frontend gating).
     */
    async checkCourseAccess(ctx) {
      const { courseSlug } = ctx.params;
      if (!courseSlug) {
        return ctx.badRequest('courseSlug is required');
      }

      const user = await access().getAuthenticatedUser(ctx);
      const { course, hasPaidAccess, hasFullAccess } = await access().resolveCourseAccess(
        courseSlug,
        user
      );

      if (!course) {
        return ctx.notFound('Course not found');
      }

      return ctx.send({
        data: {
          courseSlug,
          courseId: course.id,
          CoursePlan: course.CoursePlan,
          isAuthenticated: Boolean(user),
          hasPaidAccess,
          hasFullAccess,
        },
      });
    },

    /**
     * GET /lessons/course/:courseSlug/:lessonSlug
     * Returns full lesson content only when access is granted; 403 otherwise.
     */
    async findProtected(ctx) {
      const { courseSlug, lessonSlug } = ctx.params;
      if (!courseSlug || !lessonSlug) {
        return ctx.badRequest('courseSlug and lessonSlug are required');
      }

      const user = await access().getAuthenticatedUser(ctx);
      const result = await access().getProtectedLesson(courseSlug, lessonSlug, user);

      if (result.status === 'not_found') {
        return ctx.notFound('Lesson not found');
      }

      if (result.status === 'forbidden') {
        return ctx.forbidden('You do not have access to this lesson. Purchase the course to unlock.');
      }

      return ctx.send({ data: result });
    },
  };
});
