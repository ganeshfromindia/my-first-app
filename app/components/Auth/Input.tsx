import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "@/constants/styles";
import globalStyle from "@/assets/css/style";

function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
}: {
  label: string;
  keyboardType: any;
  secure: boolean;
  onUpdateValue: any;
  value: any;
  isInvalid: boolean;
}) {
  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          styles.label,
          globalStyle.defaultFont,
          isInvalid && styles.labelInvalid,
        ]}
      >
        {label}
      </Text>
      <TextInput
        style={[styles.input, isInvalid && styles.inputInvalid]}
        autoCapitalize={"none"}
        keyboardType={keyboardType}
        secureTextEntry={secure}
        onChangeText={onUpdateValue}
        value={value}
      />
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "white",
    marginBottom: 4,
  },
  labelInvalid: {
    color: Colors.error500,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
});
