"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
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
