// Every public page: its URL, the name the old tab-based code used for it,
// and its search-engine title/description. Used by the router in App.jsx and
// by vite.config.js to write sitemap.xml at build time.

export const PAGES = [
  {
    key: 'home',
    path: '/',
    label: 'Home',
    nav: true,
    title: 'SaxsProjects | Websites, Web Apps & Tech Support in South Africa',
    description:
      'SaxsProjects builds business websites, web apps and mobile apps for South African businesses, with transparent ZAR pricing, plus tech support and learning support for students.',
  },
  {
    key: 'tech-solutions',
    path: '/tech-solutions',
    label: 'Services',
    nav: true,
    title: 'Tech Solutions — Websites, Web Apps, Mobile Apps & Repairs | SaxsProjects',
    description:
      'Business websites, custom web applications, Android and iOS apps, database design, software updates and laptop repairs. Fixed scopes and clear timelines.',
  },
  {
    key: 'products',
    path: '/products',
    label: 'Products',
    nav: true,
    title: 'Products — Ukhona Pay, TapRide, EduConnectZA & more | SaxsProjects',
    description:
      'Products built by SaxsProjects: Ukhona Pay, TapRide smart-card fares, EduConnectZA, QuestKids and BrainBox learning apps, and an AI monitoring suite.',
  },
  {
    key: 'learning-support',
    path: '/learning-support',
    label: 'Learning Support',
    nav: true,
    title: 'Learning Support — Tutoring & Coding Mentorship | SaxsProjects',
    description:
      'One-on-one tutoring, programming mentorship, assignment strategy and tech setup for students, from a qualified developer and university tutor.',
  },
  {
    key: 'about',
    path: '/about',
    label: 'About',
    nav: true,
    title: 'About SaxsProjects — Phathutshedzo Mamagau',
    description:
      'Meet the founder of SaxsProjects: ICT diploma graduate (University of Mpumalanga), CHPC national team member and university tutor based in Thohoyandou, Limpopo.',
  },
  {
    key: 'how-we-work',
    path: '/how-we-work',
    label: 'How We Work',
    title: 'How We Work — From Brief to Launch | SaxsProjects',
    description:
      'Our six-step process: discovery call, written proposal, design approval, development on a staging link, launch and 30 days of included support.',
  },
  {
    key: 'blog',
    path: '/blog',
    label: 'Guides',
    title: 'Guides & Insights | SaxsProjects',
    description: 'Practical guides on websites, apps and getting your business online in South Africa.',
  },
  {
    key: 'contact',
    path: '/contact',
    label: 'Contact',
    title: 'Contact & Free Consultation | SaxsProjects',
    description:
      'Get a free quote or request a free 15-minute consultation. Call, WhatsApp or email SaxsProjects — Mon–Fri, 09:00–17:00 SAST.',
  },
  {
    key: 'privacy',
    path: '/privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy (POPIA) | SaxsProjects',
    description: 'How SaxsProjects collects, uses and protects your personal information under POPIA.',
  },
  {
    key: 'terms',
    path: '/terms',
    label: 'Terms of Service',
    title: 'Terms of Service | SaxsProjects',
    description: 'Terms that apply to quotes, payments, delivery, refunds and support for SaxsProjects services.',
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    label: 'Client Login',
    noindex: true,
    title: 'Client Portal | SaxsProjects',
    description: 'Sign in to track your SaxsProjects project, milestones and invoices.',
  },
];

// Old tab names that pages still pass to setActiveTab(), and old URLs.
export const ALIASES = {
  'student-services': 'learning-support',
  services: 'tech-solutions',
  portfolio: 'products',
  pricing: 'contact',
};

export const pageByKey = (key) => PAGES.find((p) => p.key === (ALIASES[key] || key));

export const pathFor = (key) => pageByKey(key)?.path || '/';
