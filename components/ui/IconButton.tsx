import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  IconButtonProps,
  IconProps,
} from "@expo/vector-icons/build/createIconSet";

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
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
