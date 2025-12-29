import { View, Text, TextInput, StyleSheet, TextInputProps, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label: string;
}

export default function Input({
  label,
  secureTextEntry,
  multiline,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = secureTextEntry;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.multilineWrapper,
        ]}
      >
        <TextInput
          {...props}
          multiline={multiline}
          placeholderTextColor="#999"
          secureTextEntry={isPasswordField && !showPassword}
          textAlignVertical={multiline ? "top" : "center"}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            isPasswordField && styles.inputWithIcon,
          ]}
        />

        {/* Botón para mostrar/ocultar contraseña */}
        {isPasswordField && (
          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#999"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    flexDirection: "row",
    alignItems: "center",
  },

  // Estilo para inputs multilinea
  multilineWrapper: {
    alignItems: "flex-start",
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1a1a1a",
    flex: 1,
  },
  multilineInput: {
    minHeight: 120,
  },

  inputWithIcon: {
    paddingRight: 50,
  },
  // Botón del ojo
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 0,
    height: 52,
    justifyContent: "center",
  },
});