import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { getToken } from "../services/authStorage";
import useUser from "../hooks/useUser";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, StatusBar } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user } = useUser();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const inAuthGroup = segments[0] === "(auth)";

      if (!token && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      // Solo redirigir si hay token, usuario cargado y no estamos en auth
      if (token && user && !inAuthGroup && !hasChecked) {
        setHasChecked(true);
        const currentGroup = segments[0];
        
        if (user.role === 'agent' && currentGroup !== '(agent-tabs)') {
          router.replace('/(agent-tabs)');
        } else if (user.role === 'user' && currentGroup !== '(user-tabs)') {
          router.replace('/(user-tabs)');
        }
      }
    })();
  }, [segments, user, hasChecked]);

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={styles.root.backgroundColor} />
        <SafeAreaView style={styles.safe} edges={['top']}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1a1d29",
  },

  safe: {
    flex: 1,
  },
});
