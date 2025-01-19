import { BrandVariants, createDarkTheme, createLightTheme, Theme } from "@fluentui/react-components";

const powerBI: BrandVariants = {
  10: "#000000",
  20: "#0B1613",
  30: "#11241F",
  40: "#14332B",
  50: "#164239",
  60: "#165346",
  70: "#156454",
  80: "#127563",
  90: "#278572",
  100: "#3F9682",
  110: "#57A692",
  120: "#6FB5A4",
  130: "#89C5B5",
  140: "#A4D4C7",
  150: "#C1E3D9",
  160: "#E0F2EC"
};

export const lightTheme: Theme = {
  ...createLightTheme(powerBI),
};

export const darkTheme: Theme = {
  ...createDarkTheme(powerBI),
};