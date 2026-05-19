export default {
  routes: [
    {
      method: 'GET',
      path: '/courses/my/enrolled',
      handler: 'course.myEnrolled',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
