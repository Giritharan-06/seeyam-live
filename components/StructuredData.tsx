import React from "react";
import { MOCK_COURSES, MOCK_BRANCHES, MOCK_REVIEWS } from "@/lib/mock-data";

export function GlobalStructuredData() {
  const organizationData = {
    "@type": "EducationalOrganization",
    "@id": "https://seeyamtechnologies.com/#organization",
    "name": "Seeyam Technologies",
    "alternateName": ["Seeyam Tech", "Seeyam IT Training & Placement Institute"],
    "url": "https://seeyamtechnologies.com",
    "logo": "https://seeyamtechnologies.com/logo.png",
    "description": "Premier IT Training, Certification & 100% Placement Institute offering industry-grade Full Stack, Cloud DevOps, AI & Data Science, and Software Testing programs.",
    "telephone": "+91-9840012345",
    "email": "admissions@seeyamtechnologies.com",
    "sameAs": [
      "https://www.linkedin.com/company/seeyam-technologies",
      "https://www.youtube.com/@seeyamtechnologies",
      "https://www.facebook.com/seeyamtechnologies",
      "https://www.instagram.com/seeyamtechnologies"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "OMR IT Corridor, Sholinganallur",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "postalCode": "600119",
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2480",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const courseDataList = MOCK_COURSES.map((course) => {
    const courseReviews = MOCK_REVIEWS.filter(
      (r) => r.courseId === course.id && r.status === "APPROVED"
    );

    return {
      "@type": "Course",
      "@id": `https://seeyamtechnologies.com/#course-${course.slug}`,
      "name": course.title,
      "description": course.summary,
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Seeyam Technologies",
        "sameAs": "https://seeyamtechnologies.com"
      },
      "educationalCredentialAwarded": "Industry Recognized Professional Certification",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": [course.mode, "Blended"],
        "courseWorkload": course.duration,
        "instructor": {
          "@type": "Person",
          "name": "Senior Industry Practitioner (8+ Yrs Exp)"
        }
      },
      "offers": {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": "INR",
        "category": "Paid",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": course.rating.toString(),
        "reviewCount": (course.enrolledCount + courseReviews.length * 15).toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": courseReviews.map((rev) => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": rev.studentName
        },
        "datePublished": rev.createdAt.split("T")[0],
        "reviewBody": rev.body,
        "name": rev.title,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": rev.rating.toString(),
          "bestRating": "5",
          "worstRating": "1"
        }
      }))
    };
  });

  const branchDataList = MOCK_BRANCHES.map((branch) => ({
    "@type": "EducationalOrganization",
    "@id": `https://seeyamtechnologies.com/#branch-${branch.slug}`,
    "name": `Seeyam Technologies - ${branch.name}`,
    "telephone": branch.phone,
    "email": branch.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": branch.address,
      "addressLocality": branch.city,
      "addressRegion": branch.city === "Bangalore" ? "Karnataka" : branch.city === "Hyderabad" ? "Telangana" : "Tamil Nadu",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "21:00"
      }
    ]
  }));

  const structuredDataGraph = {
    "@context": "https://schema.org",
    "@graph": [
      organizationData,
      ...courseDataList,
      ...branchDataList,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
    />
  );
}

export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CourseDetailSchema({
  course,
  reviews = [],
}: {
  course: {
    title: string;
    slug: string;
    summary: string;
    mode: string;
    duration: string;
    price: number;
    rating: number;
    enrolledCount: number;
  };
  reviews?: Array<{
    studentName: string;
    rating: number;
    body: string;
    title: string;
    createdAt: string;
  }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `https://seeyamtechnologies.com/courses/${course.slug}#course`,
    "name": course.title,
    "description": course.summary,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Seeyam Technologies",
      "sameAs": "https://seeyamtechnologies.com",
    },
    "educationalCredentialAwarded": "Industry Recognized Professional Certification",
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": [course.mode, "Blended"],
      "courseWorkload": course.duration,
      "instructor": {
        "@type": "Person",
        "name": "Senior Technical Architect",
      },
    },
    "offers": {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "INR",
      "category": "Paid",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": course.rating.toString(),
      "reviewCount": (course.enrolledCount + reviews.length * 12).toString(),
      "bestRating": "5",
      "worstRating": "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
