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
    title: "Core",
    accent: "Skillset",
  },
  tools: {
    title: "Command",
    accent: "Center",
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
