import MobileResponderImage from "../../Assets/Projects/MR.webp";
import OnCallMobileImage from "../../Assets/Projects/oncallMobile.webp";
import DenoImage from "../../Assets/Projects/Deno.webp";
import AndroidWidgetImage from "../../Assets/Projects/androidWidget.jpg";
import ModernNotificationImage from "../../Assets/Projects/modernNoti.webp";
import TensorImage from "../../Assets/Projects/tensor flow.png";
import ReactNativeImage from "../../Assets/Projects/ReactNative.png";
import TwilioImage from "../../Assets/Projects/twilio.png";
import YashToysImage from "../../Assets/Projects/yashToys.png";

export const NAV = {
  name: "Santosh Kumar",
  role: "Mobile App Developer",
  links: [
    { label: "Work", href: "#work" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
};

export const HERO = {
  availabilityBadge: "Available for opportunities",
  greeting: "Hey, I'm",
  firstName: "Santosh",
  lastName: "Kumar.",
  bio: "A mobile app developer from Telangana, India — building pixel-perfect Android & iOS experiences with React Native. I architect the system, then ship it.",
  tags: [
    { icon: "◷", text: "Telangana, India", color: "#F4E9CE" },
    { icon: "✦", text: "Sr. Software Developer", color: "#BFD9E8" },
    { icon: null, text: "5+ yrs shipping", color: "#D9D7CF" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/santoshP0" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/santosh-kumar-649928265" },
  ],
};

export const STATS = [
  { value: "05+", label: "Years shipping" },
  { value: "5+", label: "Apps built" },
  { value: "6", label: "Tech articles" },
  { value: "∞", label: "Cups of coffee" },
];

export const PROJECTS = [
  {
    num: "01",
    year: "2024",
    title: "Mobile Responder RN",
    desc: "Extends I/CAD capabilities to always-connected responders with native performance, secure messaging, GPS, and camera integrations.",
    tags: ["React Native", "TypeScript", "GPS"],
    role: "Lead Mobile Dev",
    color: "#F6E27A",
    rotate: -0.8,
    image: MobileResponderImage,
    androidLink: "https://play.google.com/store/apps/details?id=com.hexagon.mobileresponder&hl=en",
    iosLink: "https://apps.apple.com/us/app/intergraph-mobile-responder-rn/id6474117198",
  },
  {
    num: "02",
    year: "2023",
    title: "OnCall Mobile",
    desc: "Empowers field units with dispatch intelligence, real-time updates, and frictionless coordination on handheld devices.",
    tags: ["React Native", "Redux", "Maps"],
    role: "Mobile Dev",
    color: "#BFD9E8",
    rotate: 0.7,
    image: OnCallMobileImage,
    androidLink: "https://play.google.com/store/apps/details?id=com.hexagon.oncallmobile&hl=en",
    iosLink: "https://apps.apple.com/us/app/hxgn-oncall-mobile/id1502277906",
  },
  {
    num: "03",
    year: "2025",
    title: "Yash Gifts & Toys",
    desc: "End-to-end e-commerce webapp built in one month — fully functional storefront with admin panel, Cloudflare Pages backend, and minimal-cost deployment.",
    tags: ["React", "Cloudflare", "E-commerce"],
    role: "Full Stack Dev",
    color: "#B9C9A6",
    rotate: -0.6,
    image: YashToysImage,
    link: "https://yashgiftsandtoys.in/",
  },
];

export const EXPERIENCE = [
  {
    num: "01",
    period: "2021 — Now",
    location: "Hyderabad, India",
    role: "Senior Software Developer",
    company: "Hexagon (HCCI)",
    desc: "Building & shipping React Native apps for public safety — Mobile Responder & OnCall Mobile. Leading mobile architecture, CI/CD, and cross-platform delivery for Android & iOS.",
    color: "#F6E27A",
  },
  {
    num: "02",
    period: "2019 — 2021",
    location: "Hyderabad, India",
    role: "Software Developer",
    company: "Bitzop Technologies",
    desc: "Built React Native applications from scratch, integrated TensorFlow for object detection, implemented Twilio video calling, and authored technical articles on Medium.",
    color: "#BFD9E8",
  },
];

export const SKILLS_INTRO = {
  subtitle: "— From the workbench",
  title: "A toolbox,",
  titleItalic: "not",
  titleEnd: "a template.",
  description: "Every project starts with understanding the platform. I pick the right tool for each job — then build interfaces that feel native, fast, and considered rather than generated.",
  currentFocus: "Currently: React Native & AI Agents",
};

export const SKILL_CARDS = [
  { num: "A.01", title: "Mobile", desc: "Native Android & iOS delivery with React Native, pixel-perfect across devices.", color: "#F4E9CE" },
  { num: "A.02", title: "Frontend", desc: "React.js SPAs with modern state management, animations, and responsive design.", color: "#BFD9E8" },
  { num: "A.03", title: "Backend", desc: "Node.js APIs, MongoDB, Firebase, and AWS cloud infrastructure.", color: "#B9C9A6" },
  { num: "A.04", title: "DevOps", desc: "CI/CD pipelines, app distribution, and production monitoring.", color: "#F6E27A" },
];

export const TOOLKIT = [
  {
    num: "T.01",
    title: "Languages",
    count: "05 langs",
    color: "#F6E27A",
    rotate: -0.7,
    items: ["JavaScript", "TypeScript", "Kotlin", "Python", "Swift"],
  },
  {
    num: "T.02",
    title: "Frameworks",
    count: "06 tools",
    color: "#BFD9E8",
    rotate: 0.6,
    items: ["React Native", "React.js", "Node.js", "Redux", "Firebase", "AWS"],
  },
  {
    num: "T.03",
    title: "Tools & Platforms",
    count: "06 tools",
    color: "#B9C9A6",
    rotate: -0.5,
    items: ["VS Code", "Android Studio", "Xcode", "Postman", "Git", "MongoDB"],
  },
];

export const BLOG_ARTICLES = [
  {
    title: "Deno vs Node.js",
    desc: "Performance, security, and DX trade-offs across REST, WebSocket, and GraphQL.",
    image: DenoImage,
    link: "https://medium.com/@santosh.pk/building-a-rest-api-websocket-and-graphql-server-in-deno-25616c95c5a6",
    tags: ["Deno", "Node.js"],
  },
  {
    title: "Custom Android Widgets",
    desc: "React Native widgets that keep users engaged from the home screen.",
    image: AndroidWidgetImage,
    link: "https://medium.com/@santosh.pk/implementation-of-react-native-widget-for-android-14fe648a9b06",
    tags: ["React Native", "Android"],
  },
  {
    title: "Modern Push Notifications",
    desc: "Rich media, deep links, and custom actions with Notifee.",
    image: ModernNotificationImage,
    link: "https://medium.com/@santosh.pk/implementing-modern-push-notifications-in-react-native-android-notifee-72de60ee2712",
    tags: ["Notifee", "Push"],
  },
  {
    title: "Object Detection App",
    desc: "TensorFlow-powered recognition in React Native for real-time awareness.",
    image: TensorImage,
    link: "http://blog.zenof.ai/building-react-native-object-detection-app-using-tensorflow-with-react-hooks/",
    tags: ["TensorFlow", "ML"],
  },
  {
    title: "React Native Best Practices",
    desc: "Key systems that keep apps fast, stable, and ready for scale.",
    image: ReactNativeImage,
    link: "http://blog.zenof.ai/8-best-practices-for-your-react-native-app/",
    tags: ["React Native", "Best Practices"],
  },
  {
    title: "Video Calling with Twilio",
    desc: "Production-ready video experiences with call controls and polished UX.",
    image: TwilioImage,
    link: "http://blog.zenof.ai/create-a-react-native-video-calling-app-using-twilio/",
    tags: ["Twilio", "WebRTC"],
  },
];

export const CONTACT = {
  tabLabel: "Let's build something",
  heading: "Have a project\nin mind?",
  description: "I'm open to freelance projects, full-time roles, and interesting collaborations. Drop me a line and let's talk.",
  email: "santoshpk.mdev@gmail.com",
  linkedin: "https://www.linkedin.com/in/santosh-kumar-649928265",
  formLabels: {
    name: "01 — Your name",
    email: "02 — Email",
    subject: "03 — What's it about?",
    message: "04 — Message",
  },
  subjectOptions: [
    "Mobile app development",
    "React Native consulting",
    "Full-time opportunity",
    "Something else",
  ],
  submitText: "Send it over →",
  successTitle: "Message sent.",
  successDesc: "Thanks — I'll get back to you within a day or two.",
};

export const FOOTER = {
  copy: `© ${new Date().getFullYear()} Santosh Kumar — Set in Instrument Serif & Space Grotesk`,
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/santosh-kumar-649928265" },
    { label: "GitHub", href: "https://github.com/santoshP0" },
    { label: "Medium", href: "https://medium.com/@santosh.pk" },
  ],
};

export const MARQUEE_PHRASES = [
  "Code obsessed.",
  "Performance driven.",
  "Detail devoted.",
  "Mobile first.",
];
