/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#ffb131";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#ffb131",
    background: "#fff",
    tint: tintColorLight,
    icon: "#ffb131",
    tabIconDefault: "#ffb131",
    tabIconSelected: tintColorLight,
    borderColor: tintColorLight,
  },
  dark: {
    text: "#ffffff",
    background: "#ffb131",
    tint: tintColorDark,
    icon: "#ffffff",
    tabIconDefault: "#ffffff",
    tabIconSelected: tintColorDark,
    borderColor: tintColorDark,
  },
};
