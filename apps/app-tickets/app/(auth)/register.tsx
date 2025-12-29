import { View, Text, Pressable, KeyboardAvoidingView, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { client } from "@/services/cliente";
import { parseApiError } from "@/utils/parseApiError";
import { ApiErrorResponse } from "@/types/api-error";
import { Role } from "@/types/type-user";
import { saveToken } from "@/services/authStorage";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";


export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // lógica para manejar el registro de usuario
  const handleRegister = async () => {
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await client.api.auth.register.$post({
        json: { email, password, username },
      })
      const body = await res.json();

      if (!res.ok) {
        setError(parseApiError(body as ApiErrorResponse))
        return;
      }

      await saveToken(body.data.token);
      const isAgent = body.data.user.role === Role.Agente;
      router.replace(isAgent ? "/(agent-tabs)" : "/(user-tabs)");

    } catch (e) {
      console.error(e);
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Nuevo Usuario</Text>
          <Text style={styles.subtitle}>Regístrate para continuar</Text>
        </View>

        {/* Formulario de Registro */}
        <View style={styles.form}>

          {/* Campos de entrada */}
          <Input
            label="Nombre de usuario"
            placeholder="Tu nombre de usuario"
            autoCapitalize="none"
            value={username}
            onChangeText={(text) => {
              setUsername(text)
              setError("")
            }}
            editable={!loading}
          />

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

          {/* Botón de Registro */}
          <Button
            title="Registrarse"
            loading={loading}
            onPress={handleRegister}
            icon={<Ionicons name="person-add" size={20} color="#ffffff" />}
          />
        </View>

        {/* Enlace para iniciar sesión */}
        <Pressable
          onPress={() => router.push("/(auth)/login")}
          style={({ pressed }) => [
            styles.loginLink,
            pressed && styles.loginLinkPressed,
          ]}
        >
          <Text style={styles.loginLinkText}>
            ¿Ya tienes una cuenta? <Text style={styles.loginTextBold}>Inicia sesión</Text>
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
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 40,
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
    fontSize: 16,
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
    marginTop: -8,
    marginBottom: 8,
  },
  loginLink: {
    marginTop: 20,
    paddingVertical: 10
  },
  loginLinkPressed: {
    opacity: 0.7,
  },
  loginLinkText: {
    color: "#1a1a1a",
    fontSize: 16,
  },
  loginTextBold: {
    fontWeight: "600",
    color: "#1a1a1a",
  }

})