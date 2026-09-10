// scripts/generateHubPages.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDirs = [
  path.join(__dirname, '../dist'),
  path.join(__dirname, '../frontend/public'),
  path.join(__dirname, '../frontend/dist')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'coursesCatalog.json'), 'utf-8'));

function savePage(name, html) {
  targetDirs.forEach(baseDir => {
    fs.writeFileSync(path.join(baseDir, `${name}.html`), html, 'utf-8');
    const subDir = path.join(baseDir, name);
    if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(subDir, 'index.html'), html, 'utf-8');
  });
  console.log(`Saved prerendered static page: /${name} (${name}.html & /${name}/index.html)`);
}

// -------------------------------------------------------------
// 1. MANISH KUMAR PROFILE (Priority 1.0)
// -------------------------------------------------------------
const manishHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Manish Kumar | Best Java Full Stack Developer &amp; AWS DevOps Engineer in Ghaziabad, India</title>
  <meta name="description" content="Official engineering portfolio of Manish Kumar, award-winning Java Full Stack Developer &amp; AWS DevOps Engineer in Ghaziabad. Winner of Best Performer of the Institution Award. Specializing in Java Spring Boot, Microservices, React.js, Docker, Kubernetes &amp; AWS Cloud.">
  <meta name="keywords" content="Manish Kumar, Manish Kumar Java Developer, Manish Kumar Full Stack Developer, Manish Kumar AWS DevOps Engineer, Manish Kumar Ghaziabad, Best Java Developer India, Spring Boot Expert Manish Kumar, React JS Developer Manish Kumar, ProgrammingWala Founder, Java AWS Freelancer Ghaziabad">
  <meta name="author" content="Manish Kumar">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://programmingwala.com/manish-kumar">
  <meta name="thumbnail" content="https://programmingwala.com/manish/manish_3.jpg">
  <link rel="image_src" href="https://programmingwala.com/manish/manish_3.jpg">

  <meta property="og:type" content="profile">
  <meta property="og:url" content="https://programmingwala.com/manish-kumar">
  <meta property="og:title" content="Manish Kumar | Best Java Full Stack Developer &amp; AWS DevOps Engineer">
  <meta property="og:description" content="Official portfolio of Manish Kumar. Award-winning Java Spring Boot architect, React developer, and AWS DevOps specialist based in Ghaziabad.">
  <meta property="og:image" content="https://programmingwala.com/manish/manish_3.jpg">
  <meta property="og:site_name" content="ProgrammingWala">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Manish Kumar | Best Java Full Stack Developer &amp; AWS DevOps Engineer">
  <meta name="twitter:description" content="Winner of the Best Performer Award. Enterprise Java Spring Boot, React, and AWS Cloud Architect.">
  <meta name="twitter:image" content="https://programmingwala.com/manish/manish_3.jpg">

  <link rel="icon" type="image/png" href="/logo.png">

  <!-- Schema.org Person JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://programmingwala.com/manish-kumar#person",
        "name": "Manish Kumar",
        "alternateName": ["Manish Kumar Java Developer", "Manish Kumar AWS Engineer", "Manish Kumar Software Architect"],
        "jobTitle": "Senior Java Full Stack Developer & AWS DevOps Engineer",
        "description": "Manish Kumar is an award-winning Java Full Stack Developer and AWS DevOps Engineer based in Ghaziabad, specializing in Java Spring Boot microservices, React web applications, Docker, Kubernetes, and AWS Cloud Architecture.",
        "image": "https://programmingwala.com/manish/manish_3.jpg",
        "url": "https://programmingwala.com/manish-kumar",
        "gender": "https://schema.org/Male",
        "nationality": "Indian",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre)",
          "addressLocality": "Ghaziabad",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201001",
          "addressCountry": "IN"
        },
        "telephone": "+91-7503962162",
        "email": "info@programmingwala.com",
        "sameAs": [
          "https://github.com/Lightining29",
          "https://programmingwala.com"
        ],
        "award": "Best Performer of the Institution Award",
        "knowsAbout": [
          "Java 17 / 21 LTS",
          "Spring Boot 3.x",
          "Microservices Architecture",
          "React.js & Full Stack JavaScript",
          "AWS Cloud (EC2, S3, RDS, ECS, Lambda)",
          "Docker & Kubernetes Containerization",
          "Jenkins CI/CD Automation",
          "MySQL, PostgreSQL & MongoDB"
        ]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://programmingwala.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Manish Kumar Profile",
            "item": "https://programmingwala.com/manish-kumar"
          }
        ]
      }
    ]
  }
  </script>

  <style>
    :root { --primary: #3b82f6; --bg: #090d16; --card-bg: #0f172a; --text: #e2e8f0; --text-muted: #94a3b8; }
    * { margin:0; padding:0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    header.navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.25rem; color: #fff; text-decoration: none; }
    .brand span { color: #f43f5e; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-left: 20px; transition: 0.2s; }
    .nav-links a:hover { color: #fff; }
    .profile-hero { padding: 60px 0 40px; display: flex; flex-wrap: wrap; gap: 40px; align-items: center; }
    .hero-text { flex: 1 1 500px; }
    .badge { display: inline-block; background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3); padding: 6px 16px; border-radius: 9999px; font-weight: 800; font-size: 0.8rem; margin-bottom: 16px; letter-spacing: 1px; }
    h1 { font-size: 2.8rem; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 16px; }
    .bio { font-size: 1.1rem; color: #cbd5e1; margin-bottom: 24px; line-height: 1.7; }
    .hero-cta { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 30px; }
    .btn-primary { background: #22c55e; color: #fff; padding: 14px 28px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 25px rgba(34, 197, 94, 0.35); }
    .btn-secondary { background: #1e293b; color: #fff; border: 1px solid rgba(255,255,255,0.15); padding: 14px 28px; border-radius: 12px; font-weight: 800; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
    .profile-img-wrap { width: 340px; flex-shrink: 0; text-align: center; }
    .profile-img { width: 100%; border-radius: 28px; border: 4px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); }
    .photo-caption { font-size: 0.85rem; color: #94a3b8; margin-top: 12px; font-weight: 600; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 40px 0; }
    .gallery-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; padding: 16px; text-align: center; }
    .gallery-card img { width: 100%; border-radius: 14px; height: 260px; object-fit: cover; }
    .card-title { font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 12px; }
    .card-desc { font-size: 0.85rem; color: #94a3b8; margin-top: 6px; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
    .skill-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }
    .skill-title { font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
    .skill-pill { display: inline-block; background: rgba(255,255,255,0.06); padding: 4px 12px; border-radius: 8px; font-size: 0.8rem; margin: 4px 4px 4px 0; color: #cbd5e1; }
    footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 60px; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <img src="/logo.png" alt="ProgrammingWala Logo" width="36" height="36">
        <div>Programming<span>Wala</span></div>
      </a>
      <nav class="nav-links">
        <a href="/courses-in-ghaziabad">All Courses</a>
        <a href="/manish-kumar" style="color: #fff; font-weight: bold;">Manish Kumar Profile</a>
        <a href="/tutorials">Tutorials</a>
        <a href="/practice">Practice Lab</a>
        <a href="/verify-certificate">Verify Certificate</a>
        <a href="https://wa.me/917503962162?text=Hi%20Manish%2C%20I%20want%20to%20connect%20regarding%20Java%20Full%20Stack%20or%20AWS%20DevOps" style="background:#22c55e; color:#fff; padding:8px 16px; border-radius:8px;">WhatsApp</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="profile-hero">
      <div class="hero-text">
        <span class="badge">🏆 BEST PERFORMER AWARD WINNER</span>
        <h1>Manish Kumar</h1>
        <p class="bio">Lead Software Architect, Senior Java Full Stack Developer &amp; AWS DevOps Engineer based in Ghaziabad, UP. Mentoring aspiring software engineers and building robust enterprise systems with Java 21, Spring Boot 3, Microservices, React.js, Docker, Kubernetes, and AWS Cloud Architecture.</p>
        
        <div class="hero-cta">
          <a href="https://wa.me/917503962162?text=Hi%20Manish%2C%20I%20am%20interested%20in%20learning%20Java%20or%20AWS%20DevOps%20from%20you" class="btn-primary">
            💬 WhatsApp: +91 7503962162
          </a>
          <a href="tel:+917503962162" class="btn-secondary">
            📞 Call: +91 7503962162
          </a>
        </div>

        <p style="color: #38bdf8; font-size: 0.95rem; font-weight: 600;">
          📍 C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, UP 201001
        </p>
      </div>

      <div class="profile-img-wrap">
        <img src="/manish/manish_3.jpg" alt="Manish Kumar holding Best Performer Award Trophy" class="profile-img" width="340" height="420" loading="eager">
        <div class="photo-caption">🏆 Manish Kumar with Best Performer Award Trophy</div>
      </div>
    </section>

    <!-- Photo Gallery Section -->
    <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 40px;">Professional Honors &amp; Gallery</h2>
    <div class="gallery-grid">
      <div class="gallery-card">
        <img src="/manish/manish_3.jpg" alt="Best Performer of the Institution Award">
        <div class="card-title">Best Performer Award</div>
        <div class="card-desc">Recognized for outstanding architectural contributions in Java Full Stack and cloud solutions.</div>
      </div>
      <div class="gallery-card">
        <img src="/manish/manish_1.jpg" alt="Software Engineer and System Architect">
        <div class="card-title">Software Engineering</div>
        <div class="card-desc">Leading scalable microservices design, reactive patterns, and high-concurrency Java APIs.</div>
      </div>
      <div class="gallery-card">
        <img src="/manish/manish_2.jpg" alt="AWS DevOps and Cloud Specialist">
        <div class="card-title">AWS DevOps Leadership</div>
        <div class="card-desc">Containerization with Docker, Kubernetes orchestration, and automated CI/CD deployment pipelines.</div>
      </div>
    </div>

    <!-- Skills Matrix -->
    <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 40px;">Core Engineering Expertise</h2>
    <div class="skills-grid">
      <div class="skill-card">
        <div class="skill-title">☕ Java &amp; Enterprise Backend</div>
        <div>
          <span class="skill-pill">Java 17 / 21 LTS</span>
          <span class="skill-pill">Spring Boot 3</span>
          <span class="skill-pill">Spring Security &amp; JWT</span>
          <span class="skill-pill">Hibernate &amp; JPA</span>
          <span class="skill-pill">Microservices</span>
          <span class="skill-pill">RESTful APIs</span>
          <span class="skill-pill">Kafka &amp; Event-Driven</span>
        </div>
      </div>
      <div class="skill-card">
        <div class="skill-title">☁️ AWS Cloud &amp; DevOps</div>
        <div>
          <span class="skill-pill">AWS EC2, S3, RDS</span>
          <span class="skill-pill">Docker Containers</span>
          <span class="skill-pill">Kubernetes (K8s)</span>
          <span class="skill-pill">Jenkins CI/CD</span>
          <span class="skill-pill">Linux Administration</span>
          <span class="skill-pill">Nginx &amp; Reverse Proxy</span>
          <span class="skill-pill">CloudFront CDN</span>
        </div>
      </div>
      <div class="skill-card">
        <div class="skill-title">⚛️ Full Stack Web &amp; Databases</div>
        <div>
          <span class="skill-pill">React.js &amp; Next.js</span>
          <span class="skill-pill">TypeScript &amp; ES6+</span>
          <span class="skill-pill">Tailwind CSS</span>
          <span class="skill-pill">MySQL &amp; PostgreSQL</span>
          <span class="skill-pill">MongoDB</span>
          <span class="skill-pill">Redis Caching</span>
          <span class="skill-pill">Node.js / Express</span>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 Manish Kumar &amp; ProgrammingWala. All Rights Reserved.</p>
      <p style="margin-top: 8px;">C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad, UP 201001 • Contact: +91 7503962162</p>
    </div>
  </footer>
</body>
</html>`;

savePage('manish-kumar', manishHtml);

// -------------------------------------------------------------
// 2. COURSES IN GHAZIABAD HUB (/courses-in-ghaziabad)
// -------------------------------------------------------------
const coursesListItems = courses.map(c => `
  <div class="course-card">
    <div class="card-badge">${c.badgeText || c.category || 'PROGRAMMING'}</div>
    <h3><a href="/courses/${c.slug}">${c.shortTitle || c.courseName}</a></h3>
    <p class="desc">${c.overview.substring(0, 135)}...</p>
    <div class="meta-row">
      <span>⏱️ ${c.duration}</span>
      <span>💰 ${c.fees.split(' ')[0]}</span>
      <span>⭐ ${c.rating}</span>
    </div>
    <a href="/courses/${c.slug}" class="view-btn">View Full Syllabus &amp; Demo →</a>
  </div>
`).join('');

const coursesHubHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Best Tech &amp; Coding Coaching in RDC Ghaziabad | Top Placement Institute (2026)</title>
  <meta name="description" content="Explore top 150 IT and software courses in RDC Raj Nagar Ghaziabad. Classroom training in Java Full Stack, Python Data Science, MERN Stack, and AWS DevOps with ISO certification, live practical lab, and 100% placement support.">
  <meta name="keywords" content="Best Tech Coaching in RDC Ghaziabad, Coding Institute RDC Ghaziabad, Java Classes Ghaziabad, Python Coaching Ghaziabad, MERN Stack Institute Ghaziabad, Data Science Course Ghaziabad, AppleTree Infotech RDC">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://programmingwala.com/courses-in-ghaziabad">
  <meta name="thumbnail" content="https://programmingwala.com/logo.png">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://programmingwala.com/courses-in-ghaziabad">
  <meta property="og:title" content="Best Tech &amp; Coding Coaching in RDC Ghaziabad | 150 Courses">
  <meta property="og:description" content="Master Java, Python, MERN Stack, and AWS DevOps at AppleTree Infotech RDC Ghaziabad. 100% practical lab and placement assistance.">
  <meta property="og:image" content="https://programmingwala.com/logo.png">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Best Tech &amp; Coding Coaching in RDC Ghaziabad">
  <meta name="twitter:description" content="150 professional software and tech courses in RDC Raj Nagar Ghaziabad.">
  <meta name="twitter:image" content="https://programmingwala.com/logo.png">

  <link rel="icon" type="image/png" href="/logo.png">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": "https://programmingwala.com/#organization",
    "name": "AppleTree Infotech & ProgrammingWala",
    "url": "https://programmingwala.com/courses-in-ghaziabad",
    "logo": "https://programmingwala.com/logo.png",
    "telephone": "+91-7503962162",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre)",
      "addressLocality": "Ghaziabad",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6750",
      "longitude": "77.4410"
    }
  }
  </script>

  <style>
    :root { --bg: #090d16; --card-bg: #0f172a; --text: #e2e8f0; --text-muted: #94a3b8; --primary: #3b82f6; }
    * { margin:0; padding:0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    header.navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.25rem; color: #fff; text-decoration: none; }
    .brand span { color: #f43f5e; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-left: 20px; }
    .hero { padding: 50px 0 30px; text-align: center; }
    h1 { font-size: 2.8rem; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 16px; }
    .hero-desc { font-size: 1.15rem; color: #cbd5e1; max-width: 800px; margin: 0 auto 24px; }
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin: 40px 0; }
    .course-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; }
    .card-badge { display: inline-block; background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; width: fit-content; }
    .course-card h3 a { color: #fff; text-decoration: none; font-size: 1.25rem; font-weight: 800; }
    .desc { color: var(--text-muted); font-size: 0.85rem; margin: 12px 0 16px; }
    .meta-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; font-size: 0.85rem; color: #cbd5e1; }
    .view-btn { margin-top: 16px; display: block; text-align: center; background: #1e293b; color: #38bdf8; padding: 10px; border-radius: 10px; font-weight: 700; text-decoration: none; border: 1px solid rgba(56, 189, 248, 0.2); }
    footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 60px; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <img src="/logo.png" alt="ProgrammingWala Logo" width="36" height="36">
        <div>Programming<span>Wala</span></div>
      </a>
      <nav class="nav-links">
        <a href="/courses-in-ghaziabad" style="color:#fff; font-weight:bold;">All Courses</a>
        <a href="/manish-kumar">Manish Kumar Profile</a>
        <a href="/tutorials">Tutorials</a>
        <a href="/practice">Practice Lab</a>
        <a href="https://wa.me/917503962162" style="background:#22c55e; color:#fff; padding:8px 16px; border-radius:8px;">WhatsApp: 7503962162</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="hero">
      <span style="color:#f43f5e; font-weight:800; letter-spacing:1px; text-transform:uppercase; font-size:0.85rem;">150 Industry-Ready Programs</span>
      <h1>Tech &amp; Coding Coaching in RDC Ghaziabad</h1>
      <p class="hero-desc">Offline practical labs and live blended mentoring at C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad. Join Java Full Stack, Python AI, MERN Stack, and AWS DevOps batches with guaranteed placement support.</p>
    </div>

    <div class="courses-grid">
      ${coursesListItems}
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 AppleTree Infotech &amp; ProgrammingWala. All Rights Reserved.</p>
      <p style="margin-top: 8px;">C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad, UP 201001 • Contact: +91 7503962162</p>
    </div>
  </footer>
</body>
</html>`;

savePage('courses-in-ghaziabad', coursesHubHtml);

// -------------------------------------------------------------
// 3. CAREERS HUB (/careers)
// -------------------------------------------------------------
const careersHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>High-Impact IT Careers &amp; Job Roles 2026 | ProgrammingWala Placement Hub</title>
  <meta name="description" content="Discover in-demand tech careers in 2026. Java Full Stack Developer, AWS DevOps Engineer, Python Data Scientist, and MERN Developer job roadmap with 100% placement coaching in Ghaziabad.">
  <meta name="keywords" content="Tech Careers 2026, Java Developer Salary India, DevOps Engineer Jobs, Python AI Careers, Full Stack Placement Ghaziabad">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://programmingwala.com/careers">
  <meta name="thumbnail" content="https://programmingwala.com/logo.png">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://programmingwala.com/careers">
  <meta property="og:title" content="High-Impact IT Careers &amp; Job Roles 2026 | ProgrammingWala">
  <meta property="og:description" content="Explore job roles, salaries, and roadmaps for top tech careers. Guaranteed placement assistance in RDC Ghaziabad.">
  <meta property="og:image" content="https://programmingwala.com/logo.png">

  <link rel="icon" type="image/png" href="/logo.png">

  <style>
    :root { --bg: #090d16; --card-bg: #0f172a; --text: #e2e8f0; --text-muted: #94a3b8; }
    * { margin:0; padding:0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    header.navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.25rem; color: #fff; text-decoration: none; }
    .brand span { color: #f43f5e; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-left: 20px; }
    .hero { padding: 50px 0 30px; text-align: center; }
    h1 { font-size: 2.6rem; font-weight: 900; color: #fff; margin-bottom: 16px; }
    .role-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 40px 0; }
    .role-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }
    .role-title { font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
    .role-salary { color: #22c55e; font-weight: 800; font-size: 1.1rem; margin-bottom: 12px; }
    footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 60px; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <img src="/logo.png" alt="ProgrammingWala Logo" width="36" height="36">
        <div>Programming<span>Wala</span></div>
      </a>
      <nav class="nav-links">
        <a href="/courses-in-ghaziabad">All Courses</a>
        <a href="/manish-kumar">Manish Kumar Profile</a>
        <a href="/careers" style="color:#fff; font-weight:bold;">Careers</a>
        <a href="/tutorials">Tutorials</a>
        <a href="https://wa.me/917503962162" style="background:#22c55e; color:#fff; padding:8px 16px; border-radius:8px;">WhatsApp: 7503962162</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="hero">
      <h1>In-Demand Tech Career Tracks (2026)</h1>
      <p style="color:#94a3b8; max-width:700px; margin:0 auto;">Step-by-step career roadmaps, salary insights, and corporate interview prep with 100% placement assistance in RDC Ghaziabad.</p>
    </div>

    <div class="role-grid">
      <div class="role-card">
        <div class="role-title">☕ Java Full Stack Developer</div>
        <div class="role-salary">₹6 LPA – ₹18 LPA Average</div>
        <p style="color:#94a3b8; font-size:0.9rem;">Master Java 21, Spring Boot 3, Microservices, React.js, and SQL databases. High hiring demand across MNCs.</p>
        <a href="/courses/java-full-stack-developer-course-ghaziabad" style="display:inline-block; margin-top:14px; color:#38bdf8; font-weight:700; text-decoration:none;">Explore Java Roadmap →</a>
      </div>

      <div class="role-card">
        <div class="role-title">☁️ AWS Cloud &amp; DevOps Engineer</div>
        <div class="role-salary">₹7 LPA – ₹22 LPA Average</div>
        <p style="color:#94a3b8; font-size:0.9rem;">Master AWS architecture, Docker, Kubernetes, Jenkins pipelines, and Terraform infrastructure as code.</p>
        <a href="/courses/aws-devops-training-ghaziabad" style="display:inline-block; margin-top:14px; color:#38bdf8; font-weight:700; text-decoration:none;">Explore DevOps Roadmap →</a>
      </div>

      <div class="role-card">
        <div class="role-title">📊 Python &amp; Data Science Specialist</div>
        <div class="role-salary">₹6.5 LPA – ₹20 LPA Average</div>
        <p style="color:#94a3b8; font-size:0.9rem;">Pandas, NumPy, Machine Learning algorithms, Scikit-Learn, Deep Learning, and AI model deployments.</p>
        <a href="/courses/data-science-course-in-ghaziabad" style="display:inline-block; margin-top:14px; color:#38bdf8; font-weight:700; text-decoration:none;">Explore Data Science Roadmap →</a>
      </div>

      <div class="role-card">
        <div class="role-title">⚛️ MERN Stack Developer</div>
        <div class="role-salary">₹5.5 LPA – ₹16 LPA Average</div>
        <p style="color:#94a3b8; font-size:0.9rem;">MongoDB, Express, React, Node.js, Next.js, and modern full-stack web application development.</p>
        <a href="/courses/mern-stack-development-ghaziabad" style="display:inline-block; margin-top:14px; color:#38bdf8; font-weight:700; text-decoration:none;">Explore MERN Roadmap →</a>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 ProgrammingWala Career Placement Hub. C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad, UP 201001 • Contact: +91 7503962162</p>
    </div>
  </footer>
</body>
</html>`;

savePage('careers', careersHtml);

// -------------------------------------------------------------
// 4. TUTORIALS & NOTES (/tutorials)
// -------------------------------------------------------------
const tutorialsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Free Programming Tutorials &amp; Code Notes | Java, Python, Web Dev</title>
  <meta name="description" content="Free computer science and software development tutorials. Learn Java OOPs, Spring Boot, Collections, HTML, CSS, JavaScript, and Python with live code examples.">
  <meta name="keywords" content="Java Tutorials, OOPs Concepts, Collection Framework, HTML CSS Guide, Python Notes, ProgrammingWala Tutorials">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://programmingwala.com/tutorials">
  <meta name="thumbnail" content="https://programmingwala.com/logo.png">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://programmingwala.com/tutorials">
  <meta property="og:title" content="Free Programming Tutorials &amp; Code Notes | ProgrammingWala">
  <meta property="og:description" content="Comprehensive tutorials and notes for Java, Python, HTML/CSS, and Web Development.">
  <meta property="og:image" content="https://programmingwala.com/logo.png">

  <link rel="icon" type="image/png" href="/logo.png">

  <style>
    :root { --bg: #090d16; --card-bg: #0f172a; --text: #e2e8f0; --text-muted: #94a3b8; }
    * { margin:0; padding:0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    header.navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.25rem; color: #fff; text-decoration: none; }
    .brand span { color: #f43f5e; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-left: 20px; }
    .hero { padding: 50px 0 30px; text-align: center; }
    h1 { font-size: 2.6rem; font-weight: 900; color: #fff; margin-bottom: 16px; }
    .topics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin: 40px 0; }
    .topic-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }
    .topic-title { font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 10px; }
    footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 60px; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <img src="/logo.png" alt="ProgrammingWala Logo" width="36" height="36">
        <div>Programming<span>Wala</span></div>
      </a>
      <nav class="nav-links">
        <a href="/courses-in-ghaziabad">All Courses</a>
        <a href="/manish-kumar">Manish Kumar Profile</a>
        <a href="/tutorials" style="color:#fff; font-weight:bold;">Tutorials</a>
        <a href="/practice">Practice Lab</a>
        <a href="https://wa.me/917503962162" style="background:#22c55e; color:#fff; padding:8px 16px; border-radius:8px;">WhatsApp: 7503962162</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="hero">
      <h1>Free Software Engineering Tutorials</h1>
      <p style="color:#94a3b8; max-width:700px; margin:0 auto;">Learn core software concepts with rich theory, code examples, interview questions, and interactive practice sandbox.</p>
    </div>

    <div class="topics-grid">
      <div class="topic-card">
        <div class="topic-title">☕ Java Core &amp; OOPs Masterclass</div>
        <p style="color:#94a3b8; font-size:0.9rem;">Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction, Exception Handling, Multithreading, and Java Memory Architecture.</p>
      </div>
      <div class="topic-card">
        <div class="topic-title">📦 Java Collections Framework</div>
        <p style="color:#94a3b8; font-size:0.9rem;">List, Set, Map, Queue, ArrayList, LinkedList, HashMap internal working, Comparable vs Comparator, and Streams API.</p>
      </div>
      <div class="topic-card">
        <div class="topic-title">🌐 HTML5, CSS3 &amp; Responsive Web</div>
        <p style="color:#94a3b8; font-size:0.9rem;">Semantic tags, Flexbox, CSS Grid, media queries, animations, typography, and clean UI components.</p>
      </div>
      <div class="topic-card">
        <div class="topic-title">🐍 Python &amp; Data Structures</div>
        <p style="color:#94a3b8; font-size:0.9rem;">Python syntax, lists, dictionaries, tuples, functions, lambdas, file I/O, and OOP in Python.</p>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 ProgrammingWala Tutorials. C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad, UP 201001 • Contact: +91 7503962162</p>
    </div>
  </footer>
</body>
</html>`;

savePage('tutorials', tutorialsHtml);

// -------------------------------------------------------------
// 5. PRACTICE LAB (/practice)
// -------------------------------------------------------------
const practiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Online Code Compiler &amp; Practice Sandbox | ProgrammingWala</title>
  <meta name="description" content="Interactive browser-based coding sandbox. Write, compile, and execute code in Java, Python, C++, JavaScript, and HTML/CSS with instant outputs.">
  <meta name="keywords" content="Online Java Compiler, Online Python Sandbox, Web Code Editor, Practice Coding Online, ProgrammingWala Sandbox">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://programmingwala.com/practice">
  <meta name="thumbnail" content="https://programmingwala.com/logo.png">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://programmingwala.com/practice">
  <meta property="og:title" content="Online Code Compiler &amp; Practice Sandbox | ProgrammingWala">
  <meta property="og:description" content="Write, test, and run code directly in your browser. Multi-language support with instant compiler feedback.">
  <meta property="og:image" content="https://programmingwala.com/logo.png">

  <link rel="icon" type="image/png" href="/logo.png">

  <style>
    :root { --bg: #090d16; --card-bg: #0f172a; --text: #e2e8f0; --text-muted: #94a3b8; }
    * { margin:0; padding:0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    header.navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.25rem; color: #fff; text-decoration: none; }
    .brand span { color: #f43f5e; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-left: 20px; }
    .hero { padding: 50px 0 30px; text-align: center; }
    h1 { font-size: 2.6rem; font-weight: 900; color: #fff; margin-bottom: 16px; }
    .compiler-card { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 30px; margin: 30px 0; text-align: center; }
    footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 60px; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <img src="/logo.png" alt="ProgrammingWala Logo" width="36" height="36">
        <div>Programming<span>Wala</span></div>
      </a>
      <nav class="nav-links">
        <a href="/courses-in-ghaziabad">All Courses</a>
        <a href="/manish-kumar">Manish Kumar Profile</a>
        <a href="/tutorials">Tutorials</a>
        <a href="/practice" style="color:#fff; font-weight:bold;">Practice Lab</a>
        <a href="https://wa.me/917503962162" style="background:#22c55e; color:#fff; padding:8px 16px; border-radius:8px;">WhatsApp: 7503962162</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="hero">
      <h1>Online Interactive Coding Sandbox</h1>
      <p style="color:#94a3b8; max-width:700px; margin:0 auto;">Practice DSA problems, test algorithms, and build front-end layouts with our instant compiler.</p>
    </div>

    <div class="compiler-card">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 14px;">Launch Full Interactive Lab</h2>
      <p style="color:#94a3b8; font-size:0.95rem; margin-bottom:20px;">Supports Java, Python, C, C++, JavaScript, and HTML/CSS live rendering.</p>
      <a href="/practice" style="display:inline-block; background:#2563eb; color:#fff; padding:12px 30px; border-radius:10px; font-weight:800; text-decoration:none;">Open Coding Playground →</a>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 ProgrammingWala Practice Sandbox. C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad, UP 201001 • Contact: +91 7503962162</p>
    </div>
  </footer>
</body>
</html>`;

savePage('practice', practiceHtml);

// -------------------------------------------------------------
// 6. VERIFY CERTIFICATE (/verify-certificate)
// -------------------------------------------------------------
const verifyHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Verify Certificate | AppleTree Infotech &amp; ProgrammingWala Credentials</title>
  <meta name="description" content="Verify government-recognized and ISO 9001:2015 certified certificates issued by AppleTree Infotech and ProgrammingWala. Authenticate student course completion and credentials.">
  <meta name="keywords" content="Verify Certificate, AppleTree Infotech Certificate Verification, ISO Certificate Authentication, ProgrammingWala Credential Verification">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://programmingwala.com/verify-certificate">
  <meta name="thumbnail" content="https://programmingwala.com/logo.png">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://programmingwala.com/verify-certificate">
  <meta property="og:title" content="Verify Certificate | AppleTree Infotech &amp; ProgrammingWala">
  <meta property="og:description" content="Instant online certificate verification for employer verification and academic credentials.">
  <meta property="og:image" content="https://programmingwala.com/logo.png">

  <link rel="icon" type="image/png" href="/logo.png">

  <style>
    :root { --bg: #090d16; --card-bg: #0f172a; --text: #e2e8f0; --text-muted: #94a3b8; }
    * { margin:0; padding:0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
    header.navbar { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 0; position: sticky; top: 0; z-index: 100; }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 900; font-size: 1.25rem; color: #fff; text-decoration: none; }
    .brand span { color: #f43f5e; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; margin-left: 20px; }
    .hero { padding: 50px 0 30px; text-align: center; }
    h1 { font-size: 2.6rem; font-weight: 900; color: #fff; margin-bottom: 16px; }
    .verify-box { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 36px; margin: 30px 0; text-align: center; }
    footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; text-align: center; color: #64748b; font-size: 0.9rem; margin-top: 60px; }
  </style>
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="/" class="brand">
        <img src="/logo.png" alt="ProgrammingWala Logo" width="36" height="36">
        <div>Programming<span>Wala</span></div>
      </a>
      <nav class="nav-links">
        <a href="/courses-in-ghaziabad">All Courses</a>
        <a href="/manish-kumar">Manish Kumar Profile</a>
        <a href="/tutorials">Tutorials</a>
        <a href="/verify-certificate" style="color:#fff; font-weight:bold;">Verify Certificate</a>
        <a href="https://wa.me/917503962162" style="background:#22c55e; color:#fff; padding:8px 16px; border-radius:8px;">WhatsApp: 7503962162</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <div class="hero">
      <h1>Certificate Verification Portal</h1>
      <p style="color:#94a3b8; max-width:650px; margin:0 auto;">Verify the authenticity of professional certifications awarded by AppleTree Infotech &amp; ProgrammingWala (ISO 9001:2015 &amp; MSME Recognized).</p>
    </div>

    <div class="verify-box">
      <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 12px;">Instant Online Verification</h2>
      <p style="color:#94a3b8; font-size:0.9rem; margin-bottom:24px;">Enter the unique certificate serial number found on the printed credential or PDF transcript to check its validation status.</p>
      <a href="/verify-certificate" style="display:inline-block; background:#22c55e; color:#fff; padding:12px 30px; border-radius:10px; font-weight:800; text-decoration:none;">Verify Certificate Online →</a>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 AppleTree Infotech Verification Desk. C-60, R.K. Tower, 3rd Floor, RDC Raj Nagar, Ghaziabad, UP 201001 • Contact: +91 7503962162</p>
    </div>
  </footer>
</body>
</html>`;

savePage('verify-certificate', verifyHtml);

console.log('Finished generating all hub pages successfully!');
