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
  SiPostman,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

export const ABOUT_SECTION_CONTENT = {
  skills: {
    title: "Jutsu",
    accent: "Mastery",
  },
  tools: {
    title: "Arsenal",
    accent: "Storage",
  },
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
  { id: "visual-studio-code", Icon: VscVscode, label: "VS Code" },
  { id: "postman", Icon: SiPostman, label: "Postman" },
  { id: "android-studio", Icon: SiAndroidstudio, label: "Android Studio" },
  { id: "xcode", Icon: SiXcode, label: "Xcode" },
];

export const ABOUT_CARD_CONTENT = {
  introSegments: [
    { type: "text", value: "Greetings, fellow developers! I am " },
    { type: "accent", value: "Pottabattini Santosh Kumar " },
    { type: "text", value: "on a coding journey from " },
    { type: "accent", value: " Telangana, India - The Training Grounds." },
  ],
  jobSegments: [
    { type: "text", value: "Currently serving as a " },
    { type: "accent", value: "Senior Code Warrior " },
    { type: "text", value: "at the legendary " },
    {
      type: "link",
      value: "Hexagon's Capability Center India (HCCI)",
      href: "https://hexagon.com/company/careers/capability-centre-india",
    },
    { type: "text", value: " - where epic coding battles happen daily!" },
  ],
  educationSegments: [
    { type: "text", value: "Trained at the prestigious " },
    { type: "accent", value: "Mahaveer Institute of Science and Technology " },
    {
      type: "text",
      value:
        " dojo, where I mastered the ancient art of Computer Science Engineering (CSE) and earned my Bachelor of Technology (B.Tech) black belt.",
    },
  ],
  activitiesHeading: "When not coding epic applications, you'll find me:",
  activities: [
    "Training in gaming arenas (aka Playing Games)",
    "Discovering new power techniques (aka Exploring New Tech)",
    "Studying anime battle strategies for code inspiration (aka Watching Anime)",
    "Analyzing movie plots for UX lessons (aka Watching Movies)",
  ],
};
