// ─────────────────────────────────────────────────────────────
//  PORTFOLIO DATA  —  edit this file to update your portfolio
// ─────────────────────────────────────────────────────────────

// ── Project images ──
import mrImg      from "../Assets/Projects/MR.webp";
import oncallImg  from "../Assets/Projects/oncallMobile.webp";
import denoImg    from "../Assets/Projects/Deno.webp";
import widgetImg  from "../Assets/Projects/androidWidget.jpg";
import notiImg    from "../Assets/Projects/modernNoti.webp";
import rnImg      from "../Assets/Projects/ReactNative.png";
import twilioImg  from "../Assets/Projects/twilio.png";
import tensorImg  from "../Assets/Projects/tensor flow.png";

// ── Skill / tool icons ──
import { FaReacteurope } from "react-icons/fa";
import {
  SiJavascript, SiTypescript, SiReact, SiNodedotjs, SiPython,
  SiMongodb, SiFirebase, SiAmazon, SiKotlin, SiSwift,
  SiGit, SiAndroid, SiApple,
  SiVscodium, SiPostman, SiAndroidstudio, SiXcode,
  SiFigma, SiGithub, SiJira,
} from "react-icons/si";

// ─────────────────────────────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────────────────────────────
export const PROFILE = {
  name:    "Santosh",
  role:    "Mobile Dev",
  badge:   "Mobile App Developer",
  tagline: "Building high-performance mobile applications with React Native, TypeScript & modern tech stack. 5+ years of experience delivering production-ready apps.",
  stats: [
    { value: "5+",    label: "Years Exp."   },
    { value: "4+",    label: "Apps Released" },
    { value: "100%",  label: "Delivery"     },
  ],
};

// ─────────────────────────────────────────────────────────────
//  EXPERIENCE  (add / remove / reorder entries freely)
// ─────────────────────────────────────────────────────────────
export const EXPERIENCE = [
  {
    role:    "Senior Software Developer",
    company: "Hexagon's Capability Center India (HCCI)",
    time:    "2022 – Present",
  },
  {
    role:    "Software Developer",
    company: "Botzop",
    time:    "2019 – 2021",
  },
  {
    role:    "B.Tech · Computer Science Engineering",
    company: "Mahaveer Institute of Science and Technology",
    time:    "2015 – 2019",
  },
];

// ─────────────────────────────────────────────────────────────
//  PROJECTS  (set android/ios/link to null if not applicable)
// ─────────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    title:   "Intergraph Mobile Responder",
    desc:    "Extends I/CAD capabilities to always-connected responders with native performance, secure messaging, GPS, and camera integrations.",
    img:     mrImg,
    android: "https://play.google.com/store/apps/details?id=com.hexagon.mobileresponder&hl=en",
    ios:     "https://apps.apple.com/us/app/intergraph-mobile-responder-rn/id6474117198",
    link:    null,
  },
  {
    title:   "OnCall Mobile",
    desc:    "Empowers field units with dispatch intelligence, real-time updates, and frictionless coordination directly on handheld devices.",
    img:     oncallImg,
    android: "https://play.google.com/store/apps/details?id=com.hexagon.oncallmobile&hl=en",
    ios:     "https://apps.apple.com/us/app/hxgn-oncall-mobile/id1502277906",
    link:    null,
  },
];

// ─────────────────────────────────────────────────────────────
//  SKILLS
// ─────────────────────────────────────────────────────────────
export const SKILLS = [
  { name: "React Native", icon: <FaReacteurope /> },
  { name: "React.js",     icon: <SiReact />       },
  { name: "TypeScript",   icon: <SiTypescript />   },
  { name: "JavaScript",   icon: <SiJavascript />   },
  { name: "Node.js",      icon: <SiNodedotjs />    },
  { name: "Python",       icon: <SiPython />       },
  { name: "Kotlin",       icon: <SiKotlin />       },
  { name: "Swift",        icon: <SiSwift />        },
  { name: "AWS",          icon: <SiAmazon />       },
  { name: "Firebase",     icon: <SiFirebase />     },
  { name: "MongoDB",      icon: <SiMongodb />      },
  { name: "Android",      icon: <SiAndroid />      },
  { name: "iOS",          icon: <SiApple />        },
  { name: "Git",          icon: <SiGit />          },
];

// ─────────────────────────────────────────────────────────────
//  TOOLS
// ─────────────────────────────────────────────────────────────
export const TOOLS = [
  { name: "VS Code",         icon: <SiVscodium />      },
  { name: "Android Studio",  icon: <SiAndroidstudio /> },
  { name: "Xcode",           icon: <SiXcode />         },
  { name: "Postman",         icon: <SiPostman />       },
  { name: "Figma",           icon: <SiFigma />         },
  { name: "GitHub",          icon: <SiGithub />        },
  { name: "Jira",            icon: <SiJira />          },
];

// ─────────────────────────────────────────────────────────────
//  BLOGS  (set link to the article URL)
// ─────────────────────────────────────────────────────────────
export const BLOGS = [
  {
    title: "Deno vs Node.js",
    desc:  "Performance, security, and DX trade-offs across REST, WebSocket, and GraphQL builds.",
    img:   denoImg,
    link:  "https://medium.com/@santosh.pk/building-a-rest-api-websocket-and-graphql-server-in-deno-25616c95c5a6",
  },
  {
    title: "Custom Android Widgets",
    desc:  "Reimagining React Native widgets to keep users locked into core flows from the home screen.",
    img:   widgetImg,
    link:  "https://medium.com/@santosh.pk/implementation-of-react-native-widget-for-android-14fe648a9b06",
  },
  {
    title: "Modern Notifications",
    desc:  "Taming Notifee for cinematic push notifications with rich media, deep links, and custom actions.",
    img:   notiImg,
    link:  "https://medium.com/@santosh.pk/implementing-modern-push-notifications-in-react-native-android-notifee-72de60ee2712",
  },
  {
    title: "React Native Best Practices",
    desc:  "Key systems that keep React Native apps fast, stable, and ready for scale.",
    img:   rnImg,
    link:  "http://blog.zenof.ai/8-best-practices-for-your-react-native-app/",
  },
  {
    title: "Video Calling with Twilio",
    desc:  "Building production-ready Twilio video experiences with call controls and polished UX.",
    img:   twilioImg,
    link:  "http://blog.zenof.ai/create-a-react-native-video-calling-app-using-twilio/",
  },
  {
    title: "Object Detection in RN",
    desc:  "Deploying TensorFlow-powered recognition in React Native for real-time scene awareness.",
    img:   tensorImg,
    link:  "http://blog.zenof.ai/building-react-native-object-detection-app-using-tensorflow-with-react-hooks/",
  },
];

// ─────────────────────────────────────────────────────────────
//  CONTACT
// ─────────────────────────────────────────────────────────────
export const CONTACT = {
  email:    "santoshpk.mdev@gmail.com",
  location: "Telangana, India",
  linkedin: {
    url:   "https://www.linkedin.com/in/santosh-kumar-649928265",
    label: "santosh-kumar",
  },
};
