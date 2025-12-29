import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { saveToken } from "../../services/authStorage";
import { useState } from "react";
import { client } from "@/services/cliente";
import { parseApiError } from "@/utils/parseApiError";
import { ApiErrorResponse } from "@/types/api-error";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // lógica para manejar el inicio de sesión
  const handleLogin = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await client.api.auth.login.$post({
        json: { email, password },
      });

      const body = await res.json();

      if (!res.ok) {
        setError(parseApiError(body as ApiErrorResponse));
        return;
      }

      await saveToken(body.data.token);
      const isAgent = body.data.user.role === 'agent';
      router.replace(isAgent ? "/(agent-tabs)" : "/(user-tabs)");
    } catch (e) {
      console.error(e);
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Formulario de Inicio de Sesión */}
        <View style={styles.form}>

          {/* Campos de entrada */}
          <Input
            label="Correo electrónico"
            placeholder="tu@correo.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              setError("")
            }}
            editable={!loading}
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              setError("")
            }}
            editable={!loading}
          />

          {/* Mensaje de error */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Botón de inicio de sesión */}
          <Button
            title="Iniciar sesión"
            loading={loading}
            onPress={handleLogin}
            icon={<Ionicons name="log-in" size={20} color="#ffffff" />}
          />
        </View>

        {/* Enlace para registrarse */}
        <Pressable
          onPress={() => router.push("/(auth)/register")}
          style={({ pressed }) => [
            styles.registerLink,
            pressed && styles.registerLinkPressed
          ]}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 48,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 8,
    marginTop: -8,
  },
  registerLink: {
    marginTop: 32,
    paddingVertical: 8,
  },
  registerLinkPressed: {
    opacity: 0.6,
  },
  registerText: {
    color: "#666",
    fontSize: 15,
  },
  registerTextBold: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
});