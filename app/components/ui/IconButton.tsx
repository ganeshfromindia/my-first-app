import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import globalStyle from "@/assets/css/style";

function IconButton({
  icon,
  color,
  size,
  onPress,
}: {
  icon: any;
  color: string;
  size: number;
  onPress: any;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        globalStyle.iconWrapper,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});
