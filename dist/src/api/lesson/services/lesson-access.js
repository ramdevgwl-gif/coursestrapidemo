"use strict";
/**
 * Server-side lesson access checks. Never rely on frontend-only validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const LESSON_PUBLIC_FIELDS = [
    'id',
    'documentId',
    'Title',
    'Slug',
    'Duration',
    'isPreview',
    'ShortDescription',
];
function pickLessonPublic(lesson, locked) {
    const base = {
        id: lesson.id,
        documentId: lesson.documentId,
        Title: lesson.Title,
        Slug: lesson.Slug,
        Duration: lesson.Duration,
        isPreview: Boolean(lesson.isPreview),
        ShortDescription: lesson.ShortDescription,
        Thumbnail: lesson.Thumbnail,
        locked,
    };
    if (!locked) {
        base.VideoUrl = lesson.VideoUrl;
        base.Content = lesson.Content;
    }
    return base;
}
async function getAuthenticatedUser(strapi, ctx) {
    const authHeader = ctx.request.header.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
        return null;
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
        return null;
    }
    try {
        const decoded = (await strapi
            .plugin('users-permissions')
            .service('jwt')
            .verify(token));
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id) && !(decoded === null || decoded === void 0 ? void 0 : decoded.documentId)) {
            return null;
        }
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: decoded.documentId
                ? { documentId: decoded.documentId }
                : { id: decoded.id },
        });
        if (!user || user.blocked) {
            return null;
        }
        return user;
    }
    catch {
        return null;
    }
}
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function courseMatchesOrder(course, orderCourse) {
    if (!orderCourse)
        return false;
    if (course.id && orderCourse.id && course.id === orderCourse.id)
        return true;
    if (course.documentId &&
        orderCourse.documentId &&
        course.documentId === orderCourse.documentId) {
        return true;
    }
    if (course.slug && orderCourse.slug && course.slug === orderCourse.slug) {
        return true;
    }
    return false;
}
async function hasPaidOrderForCourse(strapi, userEmail, course) {
    const email = normalizeEmail(userEmail);
    const orders = await strapi.db.query('api::order.order').findMany({
        where: {
            Paymentstatus: 'paid',
            user_email: { $notNull: true },
        },
        populate: ['course'],
    });
    return orders.some((order) => {
        if (normalizeEmail(String(order.user_email || '')) !== email) {
            return false;
        }
        const orderCourse = order.course;
        return courseMatchesOrder(course, orderCourse !== null && orderCourse !== void 0 ? orderCourse : {});
    });
}
function isFreeCourse(course) {
    return course.CoursePlan === 'Free';
}
function canAccessLesson(lesson, course, user, hasPaidAccess) {
    if (lesson.isPreview) {
        return true;
    }
    if (isFreeCourse(course)) {
        return true;
    }
    if (!user) {
        return false;
    }
    return hasPaidAccess;
}
async function findCourseBySlug(strapi, courseSlug) {
    // Use Document Service so we get the same published entry the public API / frontend uses.
    // db.query findOne by slug can return a draft row (different id) than the purchased course.
    try {
        const published = await strapi.documents('api::course.course').findFirst({
            filters: { slug: courseSlug },
            status: 'published',
            populate: {
                lessons: {
                    populate: ['Thumbnail'],
                },
            },
        });
        if (published) {
            return published;
        }
    }
    catch {
        // Fall through to db.query fallback
    }
    const courses = await strapi.db.query('api::course.course').findMany({
        where: { slug: courseSlug },
        populate: {
            lessons: {
                populate: ['Thumbnail'],
            },
        },
    });
    if (!Array.isArray(courses) || courses.length === 0) {
        return null;
    }
    const withPublishedAt = courses.filter((c) => c.publishedAt);
    return (withPublishedAt.length > 0
        ? withPublishedAt[withPublishedAt.length - 1]
        : courses[courses.length - 1]);
}
async function findLessonInCourse(course, lessonSlug) {
    var _a, _b;
    const lessons = (_a = course.lessons) !== null && _a !== void 0 ? _a : [];
    return (_b = lessons.find((l) => l.Slug === lessonSlug)) !== null && _b !== void 0 ? _b : null;
}
async function resolveCourseAccess(strapi, courseSlug, user) {
    const course = await findCourseBySlug(strapi, courseSlug);
    if (!course) {
        return { course: null, hasPaidAccess: false, hasFullAccess: false };
    }
    const hasPaidAccess = user
        ? await hasPaidOrderForCourse(strapi, user.email, course)
        : false;
    const hasFullAccess = isFreeCourse(course) || hasPaidAccess;
    return { course, hasPaidAccess, hasFullAccess };
}
exports.default = ({ strapi }) => ({
    getAuthenticatedUser: (ctx) => getAuthenticatedUser(strapi, ctx),
    resolveCourseAccess: (courseSlug, user) => resolveCourseAccess(strapi, courseSlug, user),
    async getCourseLessonsWithAccess(courseSlug, user) {
        var _a;
        const { course, hasPaidAccess } = await resolveCourseAccess(strapi, courseSlug, user);
        if (!course) {
            return null;
        }
        const lessons = ((_a = course.lessons) !== null && _a !== void 0 ? _a : []).map((lesson) => {
            const unlocked = canAccessLesson(lesson, course, user, hasPaidAccess);
            return pickLessonPublic(lesson, !unlocked);
        });
        return {
            course: {
                id: course.id,
                documentId: course.documentId,
                Title: course.Title,
                slug: course.slug,
                CoursePlan: course.CoursePlan,
            },
            hasPaidAccess,
            hasFullAccess: isFreeCourse(course) || hasPaidAccess,
            isAuthenticated: Boolean(user),
            lessons,
        };
    },
    async getProtectedLesson(courseSlug, lessonSlug, user) {
        const { course, hasPaidAccess } = await resolveCourseAccess(strapi, courseSlug, user);
        if (!course) {
            return { status: 'not_found' };
        }
        const lesson = await findLessonInCourse(course, lessonSlug);
        if (!lesson) {
            return { status: 'not_found' };
        }
        const unlocked = canAccessLesson(lesson, course, user, hasPaidAccess);
        if (!unlocked) {
            return {
                status: 'forbidden',
                course: {
                    id: course.id,
                    Title: course.Title,
                    slug: course.slug,
                    CoursePlan: course.CoursePlan,
                },
                lesson: pickLessonPublic(lesson, true),
            };
        }
        return {
            status: 'ok',
            course: {
                id: course.id,
                Title: course.Title,
                slug: course.slug,
                CoursePlan: course.CoursePlan,
            },
            lesson: pickLessonPublic(lesson, false),
        };
    },
    async getEnrolledCourses(userEmail) {
        const orders = await strapi.db.query('api::order.order').findMany({
            where: {
                user_email: userEmail,
                Paymentstatus: 'paid',
            },
            populate: {
                course: {
                    populate: ['image'],
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const seen = new Set();
        const courses = [];
        for (const order of orders) {
            const course = order.course;
            if (!(course === null || course === void 0 ? void 0 : course.id) || seen.has(course.id)) {
                continue;
            }
            seen.add(course.id);
            courses.push({
                id: course.id,
                documentId: course.documentId,
                Title: course.Title,
                slug: course.slug,
                CoursePlan: course.CoursePlan,
                image: course.image,
                purchasedAt: order.createdAt,
            });
        }
        const freeCourses = await strapi.db.query('api::course.course').findMany({
            where: { CoursePlan: 'Free' },
            populate: ['image'],
        });
        for (const course of freeCourses) {
            if (!(course === null || course === void 0 ? void 0 : course.id) || seen.has(course.id)) {
                continue;
            }
            seen.add(course.id);
            courses.push({
                id: course.id,
                documentId: course.documentId,
                Title: course.Title,
                slug: course.slug,
                CoursePlan: course.CoursePlan,
                image: course.image,
                purchasedAt: null,
            });
        }
        return courses;
    },
    LESSON_PUBLIC_FIELDS,
});
