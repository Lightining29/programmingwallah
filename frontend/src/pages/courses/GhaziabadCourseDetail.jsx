import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Star, Phone, Clock, CheckCircle2, Navigation, 
  Sparkles, Award, ArrowRight, ShieldCheck, HelpCircle, Code2, 
  MessageCircle, ExternalLink, Calendar, BookOpen, Check, Share2
} from 'lucide-react';
import { GHAZIABAD_COURSES } from '../../data/ghaziabadCoursesData.js';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function GhaziabadCourseDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();

  const courseKey = slug || 'java-coaching-in-ghaziabad';
  const course = GHAZIABAD_COURSES[courseKey] || GHAZIABAD_COURSES['java-coaching-in-ghaziabad'];

  const courseImage = 'https://programmingwala.com/manish/manish_3.jpg';

  useEffect(() => {
    document.title = course.seoTitle;

    const setOrCreateMeta = (nameOrProp, attrValue, content) => {
      let element = document.querySelector("meta[" + nameOrProp + "='" + attrValue + "']");
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameOrProp, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setOrCreateMeta('name', 'description', course.metaDesc);
    setOrCreateMeta('name', 'keywords', course.keywords);
    setOrCreateMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setOrCreateMeta('name', 'thumbnail', courseImage);

    let imgLink = document.querySelector('link[rel="image_src"]');
    if (!imgLink) {
      imgLink = document.createElement('link');
      imgLink.rel = 'image_src';
      document.head.appendChild(imgLink);
    }
    imgLink.href = courseImage;

    setOrCreateMeta('property', 'og:title', course.seoTitle);
    setOrCreateMeta('property', 'og:description', course.metaDesc);
    setOrCreateMeta('property', 'og:image', courseImage);
    setOrCreateMeta('property', 'og:image:width', '1200');
    setOrCreateMeta('property', 'og:image:height', '1200');
    setOrCreateMeta('property', 'og:url', window.location.href);
    setOrCreateMeta('property', 'og:type', 'product');

    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', course.seoTitle);
    setOrCreateMeta('name', 'twitter:description', course.metaDesc);
    setOrCreateMeta('name', 'twitter:image', courseImage);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = "https://programmingwala.com/courses/" + course.slug;

    // Google Rich Snippet JSON-LD: Product + Course + LocalBusiness + BreadcrumbList
    const googleRichSnippetSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': 'https://programmingwala.com/courses/' + course.slug + '#product',
          'name': course.courseName,
          'image': [
            courseImage,
            'https://programmingwala.com/logo.png'
          ],
          'description': course.overview,
          'sku': 'PW-' + course.slug.toUpperCase(),
          'brand': {
            '@type': 'Brand',
            'name': 'AppleTree Infotech & ProgrammingWala'
          },
          'offers': {
            '@type': 'Offer',
            'url': 'https://programmingwala.com/courses/' + course.slug,
            'priceCurrency': 'INR',
            'price': '3500.00',
            'priceValidUntil': '2027-12-31',
            'availability': 'https://schema.org/InStock',
            'itemCondition': 'https://schema.org/NewCondition',
            'seller': {
              '@type': 'EducationalOrganization',
              'name': 'AppleTree Infotech & ProgrammingWala'
            }
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'reviewCount': '520',
            'bestRating': '5',
            'worstRating': '1'
          }
        },
        {
          '@type': 'Course',
          '@id': 'https://programmingwala.com/courses/' + course.slug + '#course',
          'name': course.courseName,
          'description': course.overview,
          'image': courseImage,
          'provider': {
            '@type': 'EducationalOrganization',
            'name': 'AppleTree Infotech & ProgrammingWala',
            'sameAs': 'https://programmingwala.com',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'C-60, R.K. Tower, 3rd Floor, RDC',
              'addressLocality': 'Ghaziabad',
              'addressRegion': 'Uttar Pradesh',
              'postalCode': '201001',
              'addressCountry': 'IN'
            }
          },
          'hasCourseInstance': {
            '@type': 'CourseInstance',
            'courseMode': ['IN_PERSON', 'ONLINE'],
            'courseWorkload': course.duration,
            'location': {
              '@type': 'Place',
              'name': 'AppleTree Infotech RDC Ghaziabad Campus',
              'hasMap': 'https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001',
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': 28.6750,
                'longitude': 77.4410
              },
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'C-60, R.K. Tower, 3rd Floor, RDC',
                'addressLocality': 'Ghaziabad',
                'postalCode': '201001',
                'addressCountry': 'IN'
              }
            }
          }
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://programmingwala.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Courses in Ghaziabad',
              'item': 'https://programmingwala.com/courses-in-ghaziabad'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': course.shortTitle || course.courseName,
              'item': 'https://programmingwala.com/courses/' + course.slug
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': (course.faqs || []).map(f => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        }
      ]
    };

    let script = document.getElementById('ghz-course-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'ghz-course-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(googleRichSnippetSchema);

    return () => {
      const el = document.getElementById('ghz-course-schema');
      if (el) el.remove();
    };
  }, [course]);

  return (
    <div className={"min-h-screen py-10 px-4 sm:px-6 lg:px-8 " + (isDark ? "bg-[#0b0f19] text-white" : "bg-[#f8fafc] text-slate-900")}>
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link
            to="/courses-in-ghaziabad"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Courses in RDC Ghaziabad</span>
          </Link>

          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            Admissions Open for New Batch
          </span>
        </div>

        {/* Hero Section */}
        <header className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-black uppercase tracking-wider">
                {course.tagline}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
              </span>
            </div>

            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Google Verified Course</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              {course.h1}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-rose-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{course.address}</span>
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {course.overview}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">{course.duration}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">Course Duration</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block">{course.fees.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">Monthly Fee</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-600 block">Classroom Lab</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">RDC Campus</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xl sm:text-2xl font-black text-cyan-600 block">100%</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">Placement Support</span>
            </div>
          </div>
        </header>

        {/* 1. Highlights & Lab Features */}
        <section aria-labelledby="highlights-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <h2 id="highlights-heading" className="text-xl sm:text-2xl font-black text-slate-900">
              Why Join This Training at RDC Ghaziabad Campus?
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-3 shadow-lg">
            <ul className="space-y-2.5">
              {course.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Structured Syllabus & Modules */}
        <section aria-labelledby="syllabus-heading" className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h2 id="syllabus-heading" className="text-xl sm:text-2xl font-black text-slate-900">
              Complete Course Curriculum & Hands-on Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {course.curriculumTracks.map((mod, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Module 0{idx + 1}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">{mod.duration}</span>
                </div>
                <h3 className="text-base font-black text-slate-900">{mod.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Google Map & Campus Address Embed */}
        <section aria-labelledby="campus-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              <h2 id="campus-heading" className="text-xl sm:text-2xl font-black text-slate-900">
                Attend Offline Classes at RDC Ghaziabad Campus
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-xl h-[340px]">
            <iframe
              title={"Google Map Location for " + course.courseName}
              src="https://maps.google.com/maps?q=C-60+R.K.+Tower+RDC+Ghaziabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* 4. Action CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-pink-200/80 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-black text-slate-900">Book Free Demo Class in RDC Ghaziabad</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Experience our interactive coding lab, meet our faculty mentors, and inspect the project curriculum with no advance payment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={"https://wa.me/917503962162?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20" + encodeURIComponent(course.courseName) + "%20at%20RDC%20Ghaziabad."}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book 2 Free Demo Classes</span>
            </a>

            <a
              href="https://maps.google.com/?q=C-60+R.K.+Tower+RDC+Ghaziabad+Uttar+Pradesh+201001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-black text-xs border border-slate-200 shadow-md transition cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-cyan-600" />
              <span>Get Google Maps Directions</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}