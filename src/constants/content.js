import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiAndroid,
  DiAws,
} from "react-icons/di";
import {
  SiFirebase,
  SiTypescript,
  SiKotlin,
  SiApple,
  SiVisualstudiocode,
  SiPostman,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";
import DenoImage from "../Assets/Projects/Deno.webp";
import AndroidWidgetImage from "../Assets/Projects/androidWidget.jpg";
import MobileResponderImage from "../Assets/Projects/MR.webp";
import ModernNotificationImage from "../Assets/Projects/modernNoti.webp";
import OnCallMobileImage from "../Assets/Projects/oncallMobile.webp";
import TwilioImage from "../Assets/Projects/twilio.png";
import ReactNativeImage from "../Assets/Projects/ReactNative.png";
import TensorImage from "../Assets/Projects/tensor flow.png";

export const HERO_CONTENT = {
  greeting: "Hi, I'm",
  name: "Pottabattini Santosh",
  subtitle: "Mobile App Developer forged in the chaos of fast-moving quests.",
  stats: [
    { label: "XP", value: "5+ Years" },
    { label: "Specialty", value: "React Native · React.js" },
    { label: "Current Quest", value: "High-impact mobile worlds" },
  ],
  console: {
    tag: "CV ACCESS",
    code: "A-01",
    subtitle: "Action · Isekai Ready",
    ctaText: "View Character Sheet",
    ctaIcon: "⟡",
  },
};

export const TYPEWRITER_STRINGS = [
  "Senior Software Developer",
  "Mobile App Developer",
  "React-native Developer",
  "Tech Enthusiast",
  "Problem Solver and Strategist",
];

export const SECTION_NAV_ITEMS = [
  { id: "home", label: "Intro" },
  { id: "about", label: "Lore" },
  { id: "skills", label: "Skillset" },
  { id: "projects", label: "Quests" },
  { id: "resume", label: "Stats" },
];

export const LORE_CONTENT = {
  badge: "[Lore Upload]",
  title: "Battle-tested mobile developer with an action anime mindset.",
  loadoutLabel: "Weapon loadout",
  loadoutItems: [
    "React Native · React.js · Node.js · AWS",
    "TypeScript · JavaScript · Python",
    "Pixel-perfect Android & iOS delivery",
  ],
};

export const TECH_STACK_ITEMS = [
  { id: "javascript", Icon: DiJavascript1, label: "Javascript" },
  { id: "typescript", Icon: SiTypescript, label: "TypeScript" },
  { id: "kotlin", Icon: SiKotlin, label: "Kotlin" },
  { id: "nodejs", Icon: DiNodejs, label: "Node js" },
  { id: "react-native", Icon: DiReact, label: "React-native" },
  { id: "react-js", Icon: DiReact, label: "React js" },
  { id: "mongodb", Icon: DiMongodb, label: "Mongodb" },
  { id: "git", Icon: DiGit, label: "Git" },
  { id: "firebase", Icon: SiFirebase, label: "Firebase" },
  { id: "python", Icon: DiPython, label: "Python" },
  { id: "android", Icon: DiAndroid, label: "Android" },
  { id: "ios", Icon: SiApple, label: "iOS" },
  { id: "aws", Icon: DiAws, label: "AWS" },
];

export const TOOL_STACK_ITEMS = [
  { id: "visual-studio-code", Icon: SiVisualstudiocode, label: "Visual Studio" },
  { id: "postman", Icon: SiPostman, label: "Postman" },
  { id: "android-studio", Icon: SiAndroidstudio, label: "Android Studio" },
  { id: "xcode", Icon: SiXcode, label: "Xcode" },
];

export const PROJECT_DEPLOYMENTS = [
  {
    imgPath: MobileResponderImage,
    title: "Intergraph Mobile Responder RN",
    description:
      "Extends I/CAD capabilities to always-connected responders with native performance, secure messaging, GPS, and camera integrations.",
    AndrLink:
      "https://play.google.com/store/apps/details?id=com.hexagon.mobileresponder&hl=en",
    iosLink:
      "https://apps.apple.com/us/app/intergraph-mobile-responder-rn/id6474117198",
  },
  {
    imgPath: OnCallMobileImage,
    title: "OnCall Mobile",
    description:
      "Empowers field units with dispatch intelligence, real-time updates, and frictionless coordination directly on handheld devices.",
    AndrLink:
      "https://play.google.com/store/apps/details?id=com.hexagon.oncallmobile&hl=en",
    iosLink: "https://apps.apple.com/us/app/hxgn-oncall-mobile/id1502277906",
  },
];

export const PROJECT_FIELD_NOTES = [
  {
    imgPath: DenoImage,
    title: "Deno vs Node.js",
    description:
      "A breakdown of performance, security, and DX trade-offs across REST, WebSocket, and GraphQL builds.",
    link:
      "https://medium.com/@santosh.pk/building-a-rest-api-websocket-and-graphql-server-in-deno-25616c95c5a6",
    isBlog: true,
  },
  {
    imgPath: AndroidWidgetImage,
    title: "Custom Android Widgets",
    description:
      "How I reimagined React Native widgets to keep audiences locked into core flows from the home screen.",
    link:
      "https://medium.com/@santosh.pk/implementation-of-react-native-widget-for-android-14fe648a9b06",
    isBlog: true,
  },
  {
    imgPath: ModernNotificationImage,
    title: "Modern Notifications",
    description:
      "Taming Notifee for cinematic push notifications with rich media, deep links, and custom actions.",
    link:
      "https://medium.com/@santosh.pk/implementing-modern-push-notifications-in-react-native-android-notifee-72de60ee2712",
    isBlog: true,
  },
  {
    imgPath: TensorImage,
    title: "Object Detection App",
    description:
      "Deploying TensorFlow-powered recognition in React Native for real-time scene awareness.",
    link:
      "http://blog.zenof.ai/building-react-native-object-detection-app-using-tensorflow-with-react-hooks/",
    isBlog: true,
  },
  {
    imgPath: ReactNativeImage,
    title: "Best Practices",
    description:
      "The key systems that keep React Native apps fast, stable, and ready for scale.",
    link: "http://blog.zenof.ai/8-best-practices-for-your-react-native-app/",
    isBlog: true,
  },
  {
    imgPath: TwilioImage,
    title: "Video Calling App",
    description:
      "Building production-ready Twilio video experiences with call controls and polished UX.",
    link:
      "http://blog.zenof.ai/create-a-react-native-video-calling-app-using-twilio/",
    isBlog: true,
  },
];

export const RESUME_STATS = [
  { label: "Experience", value: "5+ Years" },
  { label: "Specialty", value: "React Native" },
  { label: "Allies", value: "React · Node · AWS" },
  { label: "Mode", value: "Action · Isekai" },
];

export const ABOUT_SECTION_CONTENT = {
  skills: {
    title: "Core",
    accent: "Skillset",
  },
  tools: {
    title: "Command",
    accent: "Center",
  },
};

export const PROJECTS_CONTENT = {
  questBadge: "[Quest Log]",
  questTitle: "Missions",
  questTitleAccent: "& Builds",
  questSubtitle:
    "A curated list of shipped products and artifact notes that shaped my journey.",
  notesBadge: "[Field Notes]",
  notesTitle: "Writing the",
  notesTitleAccent: "Strategy",
};

export const RESUME_CONTENT = {
  badge: "[Character Sheet]",
  title: "Download the",
  titleAccent: "full stats",
  primaryCta: "Open Character Sheet",
  secondaryCta: "Download CV",
};

export const FOOTER_CONTENT = {
  tag: "[End Credits]",
  message: "Thanks for exploring this world. Let’s build the next realm together.",
  links: [
    {
      id: "email",
      href: "mailto:santoshpk.mdev@gmail.com",
      label: "Email",
      icon: "mail",
    },
    {
      id: "linkedin",
      href: "https://www.linkedin.com/in/santosh-kumar-649928265",
      label: "LinkedIn",
      icon: "linkedin",
    },
  ],
};

export const ABOUT_CARD_CONTENT = {
  introSegments: [
    { type: "text", value: "Hi Everyone, I am " },
    { type: "accent", value: "Pottabattini Santosh Kumar " },
    { type: "text", value: "from " },
    { type: "accent", value: " Telangana, India." },
  ],
  jobSegments: [
    { type: "text", value: "I am currently employed as a " },
    { type: "accent", value: "Senior Software Developer " },
    { type: "text", value: "at " },
    {
      type: "link",
      value: "Hexagon's Capability Center India (HCCI)",
      href: "https://hexagon.com/company/careers/capability-centre-india",
    },
    { type: "text", value: "." },
  ],
  educationSegments: [
    { type: "text", value: "I have earned a " },
    { type: "accent", value: " Bachelor of Technology (B.Tech) " },
    {
      type: "text",
      value:
        " degree with a specialization in Computer Science Engineering (CSE) from Mahaveer Institute of science and technology.",
    },
  ],
  activitiesHeading: "Apart from coding, some other activities that I love to do!",
  activities: [
    "Playing Games",
    "Exploring New Tech",
    "Watching Movies/Animes/TV series",
  ],
};

export const PRELOADER_MESSAGE = "Synchronizing battle HUD...";
