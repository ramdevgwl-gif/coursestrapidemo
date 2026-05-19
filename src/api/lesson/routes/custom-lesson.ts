/**
 * Protected lesson routes — validate access server-side via lesson-access service.
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/lessons/course/:courseSlug',
      handler: 'lesson.findByCourse',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/lessons/course/:courseSlug/access',
      handler: 'lesson.checkCourseAccess',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/lessons/course/:courseSlug/:lessonSlug',
      handler: 'lesson.findProtected',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
