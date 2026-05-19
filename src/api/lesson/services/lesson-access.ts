/**
 * Server-side lesson access checks. Never rely on frontend-only validation.
 */

import type { Core } from '@strapi/strapi';

type CourseRecord = {
  id: number;
  documentId?: string;
  slug?: string;
  Title?: string;
  CoursePlan?: 'Free' | 'Paid';
  lessons?: LessonRecord[];
};

type LessonRecord = {
  id: number;
  documentId?: string;
  Title?: string;
  Slug?: string;
  VideoUrl?: string;
  Duration?: string;
  Content?: unknown;
  isPreview?: boolean;
  ShortDescription?: string;
  Thumbnail?: unknown;
};

type UserRecord = {
  id: number;
  email: string;
  username?: string;
};

const LESSON_PUBLIC_FIELDS = [
  'id',
  'documentId',
  'Title',
  'Slug',
  'Duration',
  'isPreview',
  'ShortDescription',
] as const;

function pickLessonPublic(lesson: LessonRecord, locked: boolean) {
  const base: Record<string, unknown> = {
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

async function getAuthenticatedUser(
  strapi: Core.Strapi,
  ctx: { request: { header: { authorization?: string } } }
): Promise<UserRecord | null> {
  const authHeader = ctx.request.header.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
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
      .verify(token)) as { id?: number; documentId?: string };

    if (!decoded?.id && !decoded?.documentId) {
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

    return user as UserRecord;
  } catch {
    return null;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function courseMatchesOrder(course: CourseRecord, orderCourse: CourseRecord): boolean {
  if (!orderCourse) return false;
  if (course.id && orderCourse.id && course.id === orderCourse.id) return true;
  if (
    course.documentId &&
    orderCourse.documentId &&
    course.documentId === orderCourse.documentId
  ) {
    return true;
  }
  if (course.slug && orderCourse.slug && course.slug === orderCourse.slug) {
    return true;
  }
  return false;
}

async function hasPaidOrderForCourse(
  strapi: Core.Strapi,
  userEmail: string,
  course: CourseRecord
): Promise<boolean> {
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
    const orderCourse = order.course as CourseRecord | null;
    return courseMatchesOrder(course, orderCourse ?? ({} as CourseRecord));
  });
}

function isFreeCourse(course: CourseRecord): boolean {
  return course.CoursePlan === 'Free';
}

function canAccessLesson(
  lesson: LessonRecord,
  course: CourseRecord,
  user: UserRecord | null,
  hasPaidAccess: boolean
): boolean {
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

async function findCourseBySlug(
  strapi: Core.Strapi,
  courseSlug: string
): Promise<CourseRecord | null> {
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
      return published as CourseRecord;
    }
  } catch {
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
    : courses[courses.length - 1]) as CourseRecord;
}

async function findLessonInCourse(
  course: CourseRecord,
  lessonSlug: string
): Promise<LessonRecord | null> {
  const lessons = course.lessons ?? [];
  return lessons.find((l) => l.Slug === lessonSlug) ?? null;
}

async function resolveCourseAccess(
  strapi: Core.Strapi,
  courseSlug: string,
  user: UserRecord | null
): Promise<{
  course: CourseRecord | null;
  hasPaidAccess: boolean;
  hasFullAccess: boolean;
}> {
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

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getAuthenticatedUser: (ctx: Parameters<typeof getAuthenticatedUser>[1]) =>
    getAuthenticatedUser(strapi, ctx),

  resolveCourseAccess: (courseSlug: string, user: UserRecord | null) =>
    resolveCourseAccess(strapi, courseSlug, user),

  async getCourseLessonsWithAccess(
    courseSlug: string,
    user: UserRecord | null
  ) {
    const { course, hasPaidAccess } = await resolveCourseAccess(strapi, courseSlug, user);

    if (!course) {
      return null;
    }

    const lessons = (course.lessons ?? []).map((lesson) => {
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

  async getProtectedLesson(
    courseSlug: string,
    lessonSlug: string,
    user: UserRecord | null
  ) {
    const { course, hasPaidAccess } = await resolveCourseAccess(strapi, courseSlug, user);

    if (!course) {
      return { status: 'not_found' as const };
    }

    const lesson = await findLessonInCourse(course, lessonSlug);
    if (!lesson) {
      return { status: 'not_found' as const };
    }

    const unlocked = canAccessLesson(lesson, course, user, hasPaidAccess);

    if (!unlocked) {
      return {
        status: 'forbidden' as const,
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
      status: 'ok' as const,
      course: {
        id: course.id,
        Title: course.Title,
        slug: course.slug,
        CoursePlan: course.CoursePlan,
      },
      lesson: pickLessonPublic(lesson, false),
    };
  },

  async getEnrolledCourses(userEmail: string) {
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

    const seen = new Set<number>();
    const courses: Array<Record<string, unknown>> = [];

    for (const order of orders) {
      const course = order.course as CourseRecord | null;
      if (!course?.id || seen.has(course.id)) {
        continue;
      }
      seen.add(course.id);
      courses.push({
        id: course.id,
        documentId: course.documentId,
        Title: course.Title,
        slug: course.slug,
        CoursePlan: course.CoursePlan,
        image: (course as { image?: unknown }).image,
        purchasedAt: order.createdAt,
      });
    }

    const freeCourses = await strapi.db.query('api::course.course').findMany({
      where: { CoursePlan: 'Free' },
      populate: ['image'],
    });

    for (const course of freeCourses as CourseRecord[]) {
      if (!course?.id || seen.has(course.id)) {
        continue;
      }
      seen.add(course.id);
      courses.push({
        id: course.id,
        documentId: course.documentId,
        Title: course.Title,
        slug: course.slug,
        CoursePlan: course.CoursePlan,
        image: (course as { image?: unknown }).image,
        purchasedAt: null,
      });
    }

    return courses;
  },

  LESSON_PUBLIC_FIELDS,
});
