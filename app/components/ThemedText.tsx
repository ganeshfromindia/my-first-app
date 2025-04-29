import { Text, type TextProps, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import globalStyle from "@/assets/css/style";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "outline";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "borderColor"
  );

  return (
    // <View style={styles.titleContainer}>
    <Text
      style={[
        globalStyle.defaultFont,
        { color },
        { borderColor },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "outline" ? styles.outline : undefined,
        style,
      ]}
      {...rest}
    />
    // </View>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  titleContainer: {
    flexDirection: "row",
    flex: 0,
  },
  title: {
    margin: 8,
    borderRadius: 6,
    // backgroundColor: `#5e0ecc`,
    backgroundColor: `#ffb131`,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    // color: "#0a7ea4",
    color: "#ffb131",
  },
  outline: {
    backgroundColor: "transparent",
    padding: 5,
    borderWidth: 1,
    borderRadius: 15,
    textAlign: "center",
  },
});
