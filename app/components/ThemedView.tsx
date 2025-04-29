import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const border = useThemeColor(
    { light: lightColor, dark: darkColor },
    "borderColor"
  );

  return (
    <View
      style={[{ backgroundColor, borderRadius: 5 }, style]}
      {...otherProps}
      pointerEvents="auto"
    />
  );
}
