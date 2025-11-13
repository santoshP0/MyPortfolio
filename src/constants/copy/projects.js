import DenoImage from "../../Assets/Projects/Deno.webp";
import AndroidWidgetImage from "../../Assets/Projects/androidWidget.jpg";
import MobileResponderImage from "../../Assets/Projects/MR.webp";
import ModernNotificationImage from "../../Assets/Projects/modernNoti.webp";
import OnCallMobileImage from "../../Assets/Projects/oncallMobile.webp";
import TwilioImage from "../../Assets/Projects/twilio.png";
import ReactNativeImage from "../../Assets/Projects/ReactNative.png";
import TensorImage from "../../Assets/Projects/tensor flow.png";

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
