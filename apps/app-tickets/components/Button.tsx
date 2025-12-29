import { Pressable, Text, StyleSheet, PressableProps, View } from "react-native";
import { ReactNode } from "react";

// Props del botón
interface ButtonProps extends PressableProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "delete"; 
  icon?: ReactNode;
}

// Componente Botón
export default function Button({
  title,
  loading = false,
  variant = "primary",
  icon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button, 
        variant === "primary" && styles.buttonPrimary,
        variant === "secondary" && styles.buttonSecondary,
        variant === "delete" && styles.buttonDelete,
        (loading || disabled) && styles.buttonDisabled,
        pressed && !loading && !disabled && styles.buttonPressed,
      ]}
      disabled={loading || disabled}
      {...props}
    >
      {/* Icono opcional */}
      {icon && <View style={styles.iconContainer}>{icon}</View>}

      {/* Texto */}
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.buttonTextCancel,
        ]}
      >
        {loading ? "Cargando..." : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Primary
  buttonPrimary: {
    backgroundColor: "#1a1d29",
  },

  // Secondary
  buttonSecondary: {
    backgroundColor: "#e2e8f0",
    shadowOpacity: 0,
    elevation: 0,
  },
  // Delete
  buttonDelete: {
    backgroundColor: "#ff0000a9",
  },
  // Estados
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: "#999",
    opacity: 0.6,
  },

  iconContainer: {
    marginRight: 8,
  },

  // Texto
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextCancel: {
    color: "#64748b",
  },
});
