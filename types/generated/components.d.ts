import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_about_sections';
  info: {
    displayName: 'About Section';
  };
  attributes: {
    Content: Schema.Attribute.Blocks;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedAccessibility extends Struct.ComponentSchema {
  collectionName: 'components_shared_accessibilities';
  info: {
    displayName: 'Accessibility';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface SharedBannerRating extends Struct.ComponentSchema {
  collectionName: 'components_shared_banner_ratings';
  info: {
    displayName: 'Banner Rating';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Value: Schema.Attribute.String;
  };
}

export interface SharedCardsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards_sections';
  info: {
    displayName: 'Cards Section';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedCoursesCategories extends Struct.ComponentSchema {
  collectionName: 'components_shared_courses_categories_s';
  info: {
    displayName: 'Courses Categories ';
  };
  attributes: {
    course_categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-category.course-category'
    >;
    Title: Schema.Attribute.String;
  };
}

export interface SharedCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_sections';
  info: {
    displayName: 'CTA Section';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::advanced-fields.color'>;
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    badgeText: Schema.Attribute.String;
    ButtonText: Schema.Attribute.String;
    ButtonURl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    Description: Schema.Attribute.Blocks;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    ImageAlign: Schema.Attribute.Enumeration<['Left', 'Right']> &
      Schema.Attribute.DefaultTo<'Left'>;
    primaryButtonLink: Schema.Attribute.String;
    primaryButtonText: Schema.Attribute.String;
    secondaryButtonLink: Schema.Attribute.String;
    secondaryButtonText: Schema.Attribute.String;
    subTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface SharedCurriculum extends Struct.ComponentSchema {
  collectionName: 'components_shared_curricula';
  info: {
    displayName: 'Curriculum';
  };
  attributes: {
    lessonsType: Schema.Attribute.Component<'shared.lessons', true>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    FQA: Schema.Attribute.Component<'shared.fqa', true>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedFeaturedCourse extends Struct.ComponentSchema {
  collectionName: 'components_shared_featured_courses';
  info: {
    displayName: 'Featured Course';
  };
  attributes: {
    courses: Schema.Attribute.Relation<'oneToMany', 'api::course.course'>;
    Description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface SharedFooterMenu1 extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_menu_1s';
  info: {
    displayName: 'Footer Menu 1';
  };
  attributes: {
    Heading: Schema.Attribute.String;
    Menu: Schema.Attribute.Component<'shared.menu', true>;
  };
}

export interface SharedFooterMenu2 extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_menu_2s';
  info: {
    displayName: 'Footer Menu 2';
  };
  attributes: {
    Heading: Schema.Attribute.String;
    Menu2: Schema.Attribute.Component<'shared.menu-2', true>;
  };
}

export interface SharedFooterSetting extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_settings';
  info: {
    displayName: 'Footer Setting';
  };
  attributes: {
    FooterLogo: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    FooterSiteDescription: Schema.Attribute.Text;
  };
}

export interface SharedFqa extends Struct.ComponentSchema {
  collectionName: 'components_shared_fqas';
  info: {
    displayName: 'FQA';
  };
  attributes: {
    Answer: Schema.Attribute.Text;
    Question: Schema.Attribute.String;
  };
}

export interface SharedHeadingSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_heading_sections';
  info: {
    displayName: 'Heading Section';
  };
  attributes: {
    shortDescription: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface SharedHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_sections';
  info: {
    displayName: 'Hero Section';
  };
  attributes: {
    ButtonText: Schema.Attribute.String;
    Description: Schema.Attribute.Text;
    Heading: Schema.Attribute.String;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Subheading: Schema.Attribute.String;
  };
}

export interface SharedHomeBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_banners';
  info: {
    displayName: 'Home Banner';
  };
  attributes: {
    banner_rating: Schema.Attribute.Component<'shared.banner-rating', true>;
    Description: Schema.Attribute.Text;
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    LearnerSatisfactionTitle: Schema.Attribute.String;
    LearnerSatisfactionValue: Schema.Attribute.String;
    LogoSlides: Schema.Attribute.Component<'shared.logo-slider', true>;
    SeeAllCourses: Schema.Attribute.String;
    Seo: Schema.Attribute.Component<'shared.seo', true>;
    StartFreeTrialButtonLink: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface SharedHomeTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_shared_home_testimonials';
  info: {
    displayName: 'Home Testimonials';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    testimonial_list: Schema.Attribute.Component<
      'shared.testimonials-section',
      true
    >;
    Title: Schema.Attribute.String;
  };
}

export interface SharedInnovationAndAccessibility
  extends Struct.ComponentSchema {
  collectionName: 'components_shared_innovation_and_accessibilities';
  info: {
    displayName: 'Innovation & Accessibility';
  };
  attributes: {
    Accessibility: Schema.Attribute.Component<'shared.accessibility', true>;
  };
}

export interface SharedLatestBlog extends Struct.ComponentSchema {
  collectionName: 'components_shared_latest_blogs';
  info: {
    displayName: 'Latest Blog';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedLatestBlogSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_latest_blog_sections';
  info: {
    displayName: 'Latest Blog Section';
  };
  attributes: {
    article: Schema.Attribute.Relation<'oneToOne', 'api::article.article'>;
  };
}

export interface SharedLessons extends Struct.ComponentSchema {
  collectionName: 'components_shared_lessons';
  info: {
    displayName: 'Select Course Lessons';
  };
  attributes: {
    lessons: Schema.Attribute.Relation<'oneToMany', 'api::lesson.lesson'>;
  };
}

export interface SharedLogoSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_logo_sliders';
  info: {
    displayName: 'Logo Slider';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedMainMenu extends Struct.ComponentSchema {
  collectionName: 'components_shared_main_menus';
  info: {
    displayName: 'Main Menu';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMentors extends Struct.ComponentSchema {
  collectionName: 'components_shared_mentors';
  info: {
    displayName: 'Mentors';
  };
  attributes: {
    Mentors: Schema.Attribute.Component<'shared.mentors-grid', true>;
  };
}

export interface SharedMentorsGrid extends Struct.ComponentSchema {
  collectionName: 'components_shared_mentors_grids';
  info: {
    displayName: 'Mentors Grid';
  };
  attributes: {
    Designation: Schema.Attribute.String;
    Name: Schema.Attribute.String;
    Photo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedMentorsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_mentors_sections';
  info: {
    displayName: 'Mentors Section';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    mentors: Schema.Attribute.Relation<'oneToMany', 'api::mentor.mentor'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedMenu extends Struct.ComponentSchema {
  collectionName: 'components_shared_menus';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    Title: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SharedMenu2 extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_2s';
  info: {
    displayName: 'Menu 2';
  };
  attributes: {
    Title: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSectionBar extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_bars';
  info: {
    displayName: 'Section Bar';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    SubTitle: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    preventIndexing: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    shareImage: Schema.Attribute.Media<'images'>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSuccessStatistics extends Struct.ComponentSchema {
  collectionName: 'components_shared_success_statistics';
  info: {
    displayName: 'Success Statistics';
  };
  attributes: {
    Text: Schema.Attribute.String;
    Value: Schema.Attribute.String;
  };
}

export interface SharedSuccessStatisticsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_success_statistics_sections';
  info: {
    displayName: 'Success Statistics Section';
  };
  attributes: {
    success_statistics: Schema.Attribute.Component<
      'shared.success-statistics',
      true
    >;
  };
}

export interface SharedTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials';
  info: {
    displayName: 'Testimonials';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    Title: Schema.Attribute.String;
  };
}

export interface SharedTestimonialsSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_testimonials_sections';
  info: {
    displayName: 'Testimonials Section';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Designation: Schema.Attribute.String;
    Name: Schema.Attribute.String;
    Rating: Schema.Attribute.Decimal;
  };
}

export interface SharedTesting extends Struct.ComponentSchema {
  collectionName: 'components_shared_testings';
  info: {
    displayName: 'Testing';
  };
  attributes: {
    Test: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.about-section': SharedAboutSection;
      'shared.accessibility': SharedAccessibility;
      'shared.banner-rating': SharedBannerRating;
      'shared.cards-section': SharedCardsSection;
      'shared.courses-categories': SharedCoursesCategories;
      'shared.cta-section': SharedCtaSection;
      'shared.curriculum': SharedCurriculum;
      'shared.faq': SharedFaq;
      'shared.featured-course': SharedFeaturedCourse;
      'shared.footer-menu-1': SharedFooterMenu1;
      'shared.footer-menu-2': SharedFooterMenu2;
      'shared.footer-setting': SharedFooterSetting;
      'shared.fqa': SharedFqa;
      'shared.heading-section': SharedHeadingSection;
      'shared.hero-section': SharedHeroSection;
      'shared.home-banner': SharedHomeBanner;
      'shared.home-testimonials': SharedHomeTestimonials;
      'shared.innovation-and-accessibility': SharedInnovationAndAccessibility;
      'shared.latest-blog': SharedLatestBlog;
      'shared.latest-blog-section': SharedLatestBlogSection;
      'shared.lessons': SharedLessons;
      'shared.logo-slider': SharedLogoSlider;
      'shared.main-menu': SharedMainMenu;
      'shared.media': SharedMedia;
      'shared.mentors': SharedMentors;
      'shared.mentors-grid': SharedMentorsGrid;
      'shared.mentors-section': SharedMentorsSection;
      'shared.menu': SharedMenu;
      'shared.menu-2': SharedMenu2;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.section-bar': SharedSectionBar;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.success-statistics': SharedSuccessStatistics;
      'shared.success-statistics-section': SharedSuccessStatisticsSection;
      'shared.testimonials': SharedTestimonials;
      'shared.testimonials-section': SharedTestimonialsSection;
      'shared.testing': SharedTesting;
    }
  }
}
